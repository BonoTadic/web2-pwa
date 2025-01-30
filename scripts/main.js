const video = document.getElementById('camera');
const qrResult = document.getElementById('qr-result');

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;
    } catch (err) {
        console.error('Error accessing the camera:', err);
        qrResult.textContent = 'Error accessing the camera';
    }
}

function scanQRCode() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

    const code = jsQR(imageData.data, imageData.width, imageData.height);
    if (code) {
        qrResult.textContent = code.data;
        sendNotification('QR Code Scanned', { body: `Scanned: ${code.data}` });
    } else {
        qrResult.textContent = 'No QR code detected';
    }
    requestAnimationFrame(scanQRCode);
}

function sendNotification(title, options) {
    if (Notification.permission === 'granted') {
        new Notification(title, options);
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification(title, options);
            }
        });
    }
}

startCamera();
video.addEventListener('play', scanQRCode);