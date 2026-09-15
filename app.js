// 1. Inisialisasi ikon Lucide
lucide.createIcons();

// ==========================================
// STATE MANAGEMENT & DOM ELEMENTS
// ==========================================
const leftPanel = document.getElementById('left-panel');
const welcomePanel = document.getElementById('welcome-panel');
const loginPanel = document.getElementById('login-panel');
const sidebarPanel = document.getElementById('sidebar-panel');

const guestView = document.getElementById('guest-view');
const adminView = document.getElementById('admin-view');

const btnShowLogin = document.getElementById('btn-show-login');
const btnHideLogin = document.getElementById('btn-hide-login');
const loginForm = document.getElementById('login-form');
const btnDoLogin = document.getElementById('btn-do-login');
const loginText = document.getElementById('login-text');
const loginSpinner = document.getElementById('login-spinner');
const btnLogout = document.getElementById('btn-logout');

const kategoriSelect = document.getElementById('kategori-select');
const kelasContainer = document.getElementById('kelas-container');

// ==========================================
// LOGIKA FORM TAMU (Animasi Kelas)
// ==========================================
kategoriSelect.addEventListener('change', function() {
    if (this.value === 'siswa') {
        kelasContainer.classList.add('is-active');
    } else {
        kelasContainer.classList.remove('is-active');
    }
});

// ==========================================
// LOGIKA NAVIGASI & LOGIN
// ==========================================
function toggleLoginForm() {
    if (welcomePanel.classList.contains('panel-visible')) {
        welcomePanel.classList.replace('panel-visible', 'panel-hidden');
        loginPanel.classList.replace('panel-hidden', 'panel-visible');
    } else {
        loginPanel.classList.replace('panel-visible', 'panel-hidden');
        welcomePanel.classList.replace('panel-hidden', 'panel-visible');
    }
}

btnShowLogin.addEventListener('click', toggleLoginForm);
btnHideLogin.addEventListener('click', toggleLoginForm);

loginForm.addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    // UI Micro-interaction: Loading state
    btnDoLogin.disabled = true;
    loginText.classList.add('hidden');
    loginSpinner.classList.remove('hidden');

    // Simulasi delay login
    setTimeout(() => {
        btnDoLogin.disabled = false;
        loginText.classList.remove('hidden');
        loginSpinner.classList.add('hidden');

        // Ganti Panel Kiri ke Sidebar Admin
        loginPanel.classList.replace('panel-visible', 'panel-hidden');
        sidebarPanel.classList.replace('panel-hidden', 'panel-visible');
        leftPanel.classList.remove('md:w-[30%]');
        leftPanel.classList.add('md:w-[20%]');

        // Ganti View Kanan ke Dashboard Admin
        guestView.classList.replace('view-visible', 'view-hidden');
        adminView.classList.replace('view-hidden', 'view-visible');
    }, 1500);
});

btnLogout.addEventListener('click', function() {
    sidebarPanel.classList.replace('panel-visible', 'panel-hidden');
    welcomePanel.classList.replace('panel-hidden', 'panel-visible');

    leftPanel.classList.remove('md:w-[20%]');
    leftPanel.classList.add('md:w-[30%]');

    adminView.classList.replace('view-visible', 'view-hidden');
    guestView.classList.replace('view-hidden', 'view-visible');
});

// ==========================================
// LOGIKA WEBRTC CAMERA (FOTO TAMU)
// ==========================================
const cameraIdle = document.getElementById('camera-idle');
const cameraVideo = document.getElementById('camera-video');
const btnCapture = document.getElementById('btn-capture');
const cameraCanvas = document.getElementById('camera-canvas');
const cameraResult = document.getElementById('camera-result');
const btnRetake = document.getElementById('btn-retake');

let videoStream = null;

async function startCamera() {
    try {
        const constraints = { 
            video: { 
                facingMode: 'user', // Prioritas kamera depan
                width: { ideal: 1280 },
                height: { ideal: 720 }
            } 
        };
        
        videoStream = await navigator.mediaDevices.getUserMedia(constraints);
        cameraVideo.srcObject = videoStream;
        
        cameraIdle.classList.add('hidden');
        cameraVideo.classList.remove('hidden');
        btnCapture.classList.remove('hidden');
        btnCapture.classList.add('flex');
        
    } catch (err) {
        console.error("Gagal mengakses kamera:", err);
        alert("Tidak dapat mengakses kamera. Pastikan Anda memberikan izin akses kamera.");
    }
}

function takeSnapshot() {
    if (!videoStream) return;

    cameraCanvas.width = cameraVideo.videoWidth;
    cameraCanvas.height = cameraVideo.videoHeight;
    
    const ctx = cameraCanvas.getContext('2d');
    ctx.drawImage(cameraVideo, 0, 0, cameraCanvas.width, cameraCanvas.height);
    
    const imageData = cameraCanvas.toDataURL('image/jpeg', 0.8);
    cameraResult.src = imageData;
    
    cameraVideo.classList.add('hidden');
    btnCapture.classList.add('hidden');
    btnCapture.classList.remove('flex');
    
    cameraResult.classList.remove('hidden');
    btnRetake.classList.remove('hidden');
    
    stopCamera();
}

function retakePhoto() {
    cameraResult.classList.add('hidden');
    btnRetake.classList.add('hidden');
    cameraResult.src = ""; 
    
    startCamera();
}

function stopCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
    }
}
