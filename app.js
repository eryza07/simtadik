lucide.createIcons();

// ==========================================
// DOM ELEMENTS (Navigasi & Container)
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

// ==========================================
// DOM ELEMENTS (Form Tamu)
// ==========================================
const guestForm = document.getElementById('guest-form');
const guestFormContainer = document.getElementById('guest-form-container');
const btnSubmitGuest = document.getElementById('btn-submit-guest');
const submitText = document.getElementById('submit-text');
const submitIcon = document.getElementById('submit-icon');
const submitSpinner = document.getElementById('submit-spinner');
const successState = document.getElementById('success-state');
const btnNextGuest = document.getElementById('btn-next-guest');

const kategoriSelect = document.getElementById('kategori-select');
const kelasContainer = document.getElementById('kelas-container');
const inputKelas = document.getElementById('input-kelas');

const guestNameInput = document.getElementById('guest-name');
const guestInstansiInput = document.getElementById('guest-instansi');

// ==========================================
// DOM ELEMENTS (Dashboard Admin)
// ==========================================
const tableBody = document.getElementById('table-body');
const countMenunggu = document.getElementById('count-menunggu');
const countBertemu = document.getElementById('count-bertemu');
const countSelesai = document.getElementById('count-selesai');

// ==========================================
// 1. LOGIKA WEBRTC CAMERA (FOTO TAMU)
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
        alert("Tidak dapat mengakses kamera. Pastikan Anda memberikan izin akses kamera pada browser Anda.");
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
// 2. LOGIKA FORM TAMU (Animasi Kelas)
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
// 3. LOGIKA NAVIGASI & LOGIN ADMIN
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
// 4. LOGIKA SUBMIT FORM & UPDATE ADMIN DASHBOARD
// ==========================================
if (guestForm) {
    guestForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        // Ambil Data dari Form
        const guestName = guestNameInput.value;
        const guestInstansi = guestInstansiInput.value;
        const guestKategori = kategoriSelect.options[kategoriSelect.selectedIndex].text;
        
        // Format Waktu Masuk
        const now = new Date();
        const timeString = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0') + ' WIB';

        // Set Loading UI Tombol Submit
        btnSubmitGuest.disabled = true;
        btnSubmitGuest.classList.add('opacity-80', 'cursor-not-allowed');
        submitText.innerText = "Mengirim Data...";
        submitIcon.classList.add('hidden');
        submitSpinner.classList.remove('hidden');

        setTimeout(() => {
            
            // --- MEMBUAT BARIS BARU DI TABEL ADMIN ---
            const tr = document.createElement('tr');
            tr.className = "hover:bg-slate-50/50 transition-colors";
            
            tr.innerHTML = `
                <td class="px-6 py-4">
                    <p class="font-semibold text-slate-900 name-tag">${guestName}</p>
                    <p class="text-xs text-blue-600 font-medium animate-pulse new-badge">Baru saja masuk</p>
                </td>
                <td class="px-6 py-4 text-slate-600">${guestInstansi}<br><span class="text-xs text-slate-400">${guestKategori}</span></td>
                <td class="px-6 py-4 text-slate-600">${timeString}</td>
                <td class="px-6 py-4 status-cell">
                    <span class="status-badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        <span class="status-dot w-1.5 h-1.5 rounded-full bg-amber-500"></span> 
                        <span class="status-text">Menunggu</span>
                    </span>
                </td>
                <td class="px-6 py-4">
                    <select class="status-selector bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-700 font-medium outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-sm transition-all">
                        <option value="menunggu" selected>Menunggu</option>
                        <option value="bertemu">Sedang Bertemu</option>
                        <option value="selesai">Selesai</option>
                    </select>
                </td>
            `;
            
            // Masukkan baris baru ke paling atas tabel
            tableBody.prepend(tr);

            // Tambah angka "Menunggu" di dashboard
            countMenunggu.innerText = parseInt(countMenunggu.innerText) + 1;

            // --- SISTEM UPDATE STATUS DINAMIS ---
            const selector = tr.querySelector('.status-selector');
            const badge = tr.querySelector('.status-badge');
            const dot = tr.querySelector('.status-dot');
            const text = tr.querySelector('.status-text');
            const newBadge = tr.querySelector('.new-badge');
            let previousStatus = 'menunggu';

            selector.addEventListener('change', function(event) {
                const newStatus = event.target.value;
                
                // Hapus efek "Baru saja masuk" jika status diubah
                if(newBadge) newBadge.remove();

                // Kurangi angka pada status sebelumnya
                if (previousStatus === 'menunggu') countMenunggu.innerText = Math.max(0, parseInt(countMenunggu.innerText) - 1);
                if (previousStatus === 'bertemu') countBertemu.innerText = Math.max(0, parseInt(countBertemu.innerText) - 1);
                if (previousStatus === 'selesai') countSelesai.innerText = Math.max(0, parseInt(countSelesai.innerText) - 1);

                // Tambahkan angka pada status baru dan ubah warna lencana
                if (newStatus === 'menunggu') {
                    countMenunggu.innerText = parseInt(countMenunggu.innerText) + 1;
                    badge.className = "status-badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700";
                    dot.className = "status-dot w-1.5 h-1.5 rounded-full bg-amber-500";
                    text.innerText = "Menunggu";
                } 
                else if (newStatus === 'bertemu') {
                    countBertemu.innerText = parseInt(countBertemu.innerText) + 1;
                    badge.className = "status-badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700";
                    dot.className = "status-dot w-1.5 h-1.5 rounded-full bg-blue-500";
                    text.innerText = "Sedang Bertemu";
                } 
                else if (newStatus === 'selesai') {
                    countSelesai.innerText = parseInt(countSelesai.innerText) + 1;
                    badge.className = "status-badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700";
                    dot.className = "status-dot w-1.5 h-1.5 rounded-full bg-emerald-500";
                    text.innerText = "Selesai";
                    tr.classList.add('opacity-50'); // Buat baris sedikit transparan jika sudah selesai
                }
                
                previousStatus = newStatus;
            });

            // --- TRANSISI UI KE LAYAR TIKET SUKSES ---
            btnSubmitGuest.disabled = false;
            btnSubmitGuest.classList.remove('opacity-80', 'cursor-not-allowed');
            submitText.innerText = "Kirim & Check-In Sekarang";
            submitIcon.classList.remove('hidden');
            submitSpinner.classList.add('hidden');

            guestFormContainer.classList.remove('scale-100', 'opacity-100');
            guestFormContainer.classList.add('scale-95', 'opacity-0', 'pointer-events-none');
            
            setTimeout(() => {
                successState.classList.remove('scale-95', 'opacity-0', 'pointer-events-none');
                successState.classList.add('scale-100', 'opacity-100', 'pointer-events-auto');
                lucide.createIcons();
            }, 300);

        }, 2000); 
    });
}

// ==========================================
// 5. LOGIKA RESET UNTUK TAMU BERIKUTNYA
// ==========================================
if (btnNextGuest) {
    btnNextGuest.addEventListener('click', function() {
        successState.classList.remove('scale-100', 'opacity-100', 'pointer-events-auto');
        successState.classList.add('scale-95', 'opacity-0', 'pointer-events-none');
        
        setTimeout(() => {
            guestFormContainer.classList.remove('scale-95', 'opacity-0', 'pointer-events-none');
            guestFormContainer.classList.add('scale-100', 'opacity-100');
            
            // Bersihkan form
            guestForm.reset();
            kelasContainer.classList.remove('is-active');
            inputKelas.removeAttribute('required');
            
            // Matikan kamera dan sembunyikan foto
            if (videoStream) stopCamera();
            cameraResult.classList.add('hidden');
            btnRetake.classList.add('hidden');
            cameraIdle.classList.remove('hidden');
            cameraVideo.classList.add('hidden');
            btnCapture.classList.add('hidden');
        }, 300);
    });
}
