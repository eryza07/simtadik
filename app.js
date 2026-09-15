// ==========================================
// INISIALISASI
// ==========================================
lucide.createIcons();

// ==========================================
// DOM ELEMENTS
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
const inputKelas = document.getElementById('input-kelas');

// ==========================================
// LOGIKA FORM TAMU (Animasi Kelas)
// ==========================================
kategoriSelect.addEventListener('change', function() {
    if (this.value === 'siswa') {
        kelasContainer.classList.add('is-active');
        inputKelas.setAttribute('required', 'true');
    } else {
        kelasContainer.classList.remove('is-active');
        inputKelas.removeAttribute('required');
        inputKelas.value = "";
    }
});

// ==========================================
// LOGIKA NAVIGASI & LOGIN ADMIN
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
    btnDoLogin.disabled = true;
    loginText.classList.add('hidden');
    loginSpinner.classList.remove('hidden');

    setTimeout(() => {
        btnDoLogin.disabled = false;
        loginText.classList.remove('hidden');
        loginSpinner.classList.add('hidden');

        loginPanel.classList.replace('panel-visible', 'panel-hidden');
        sidebarPanel.classList.replace('panel-hidden', 'panel-visible');
        leftPanel.classList.remove('md:w-[30%]');
        leftPanel.classList.add('md:w-[20%]');

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
        const constraints = { video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } };
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

// ==========================================
// LOGIKA SUBMIT FORM TAMU & LAYAR SUKSES
// ==========================================
const guestForm = document.getElementById('guest-form');
const guestFormContainer = document.getElementById('guest-form-container');
const btnSubmitGuest = document.getElementById('btn-submit-guest');
const submitText = document.getElementById('submit-text');
const submitIcon = document.getElementById('submit-icon');
const submitSpinner = document.getElementById('submit-spinner');
const successState = document.getElementById('success-state');
const btnNextGuest = document.getElementById('btn-next-guest');

if (guestForm) {
    guestForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        // 1. Matikan tombol dan munculkan loading spinner
        btnSubmitGuest.disabled = true;
        btnSubmitGuest.classList.add('opacity-80', 'cursor-not-allowed');
        submitText.innerText = "Mengirim Data...";
        submitIcon.classList.add('hidden');
        submitSpinner.classList.remove('hidden');

        // 2. Delay 2 detik (simulasi kirim data)
        setTimeout(() => {
            // Reset state tombol form
            btnSubmitGuest.disabled = false;
            btnSubmitGuest.classList.remove('opacity-80', 'cursor-not-allowed');
            submitText.innerText = "Kirim & Check-In Sekarang";
            submitIcon.classList.remove('hidden');
            submitSpinner.classList.add('hidden');

            // 3. Transisi Animasi: Sembunyikan Form, Munculkan Tiket Antrean
            guestFormContainer.classList.remove('scale-100', 'opacity-100');
            guestFormContainer.classList.add('scale-95', 'opacity-0', 'pointer-events-none');
            
            setTimeout(() => {
                successState.classList.remove('scale-95', 'opacity-0', 'pointer-events-none');
                successState.classList.add('scale-100', 'opacity-100', 'pointer-events-auto');
                lucide.createIcons(); // Refresh icons untuk tiket sukses
            }, 300);
        }, 2000); 
    });
}

// ==========================================
// LOGIKA RESET UNTUK TAMU BERIKUTNYA
// ==========================================
if (btnNextGuest) {
    btnNextGuest.addEventListener('click', function() {
        // Transisi Animasi: Sembunyikan Tiket, Munculkan Form kembali
        successState.classList.remove('scale-100', 'opacity-100', 'pointer-events-auto');
        successState.classList.add('scale-95', 'opacity-0', 'pointer-events-none');
        
        setTimeout(() => {
            guestFormContainer.classList.remove('scale-95', 'opacity-0', 'pointer-events-none');
            guestFormContainer.classList.add('scale-100', 'opacity-100');
            
            // Bersihkan semua input di form
            guestForm.reset();
            kelasContainer.classList.remove('is-active');
            inputKelas.removeAttribute('required');

            // Matikan kamera dan kembalikan UI foto ke state awal
            if (videoStream) stopCamera();
            cameraResult.classList.add('hidden');
            btnRetake.classList.add('hidden');
            cameraIdle.classList.remove('hidden');
            cameraVideo.classList.add('hidden');
            btnCapture.classList.add('hidden');
        }, 300);
    });
}
