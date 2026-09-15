lucide.createIcons();

// ==========================================
// DOM ELEMENTS (Container & Routing)
// ==========================================
const leftPanel = document.getElementById('left-panel');
const welcomePanel = document.getElementById('welcome-panel');
const loginPanel = document.getElementById('login-panel');
const sidebarPanel = document.getElementById('sidebar-panel');

const guestView = document.getElementById('guest-view');
const adminView = document.getElementById('admin-view');
const historyView = document.getElementById('history-view');

const navOverview = document.getElementById('nav-overview');
const navHistory = document.getElementById('nav-history');

const btnShowLogin = document.getElementById('btn-show-login');
const btnHideLogin = document.getElementById('btn-hide-login');
const loginForm = document.getElementById('login-form');
const btnDoLogin = document.getElementById('btn-do-login');
const loginText = document.getElementById('login-text');
const loginSpinner = document.getElementById('login-spinner');
const btnLogout = document.getElementById('btn-logout');

// ==========================================
// DOM ELEMENTS (Data Tables)
// ==========================================
const tableBody = document.getElementById('table-body'); // Tabel Overview Aktif
const historyTableBody = document.getElementById('history-table-body'); // Tabel Riwayat Log
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
        alert("Tidak dapat mengakses kamera. Pastikan Anda memberikan izin akses.");
    }
}

function takeSnapshot() {
    if (!videoStream) return;
    cameraCanvas.width = cameraVideo.videoWidth;
    cameraCanvas.height = cameraVideo.videoHeight;
    const ctx = cameraCanvas.getContext('2d');
    ctx.drawImage(cameraVideo, 0, 0, cameraCanvas.width, cameraCanvas.height);
    cameraResult.src = cameraCanvas.toDataURL('image/jpeg', 0.8);
    
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
// 2. ROUTING ADMIN SIDEBAR (Overview vs Riwayat)
// ==========================================
navOverview.addEventListener('click', (e) => {
    e.preventDefault();
    adminView.classList.replace('view-hidden', 'view-visible');
    historyView.classList.replace('view-visible', 'view-hidden');
    
    // Style Active Tab
    navOverview.classList.add('bg-blue-600/20', 'text-blue-400');
    navOverview.classList.remove('text-slate-400', 'hover:bg-slate-800', 'hover:text-white');
    navHistory.classList.add('text-slate-400', 'hover:bg-slate-800', 'hover:text-white');
    navHistory.classList.remove('bg-blue-600/20', 'text-blue-400');
});

navHistory.addEventListener('click', (e) => {
    e.preventDefault();
    historyView.classList.replace('view-hidden', 'view-visible');
    adminView.classList.replace('view-visible', 'view-hidden');
    
    // Style Active Tab
    navHistory.classList.add('bg-blue-600/20', 'text-blue-400');
    navHistory.classList.remove('text-slate-400', 'hover:bg-slate-800', 'hover:text-white');
    navOverview.classList.add('text-slate-400', 'hover:bg-slate-800', 'hover:text-white');
    navOverview.classList.remove('bg-blue-600/20', 'text-blue-400');
});

// ==========================================
// 3. LOGIKA LOGIN & LOGOUT (SPA Transitions)
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

        // Masuk ke layar default admin (Overview)
        guestView.classList.replace('view-visible', 'view-hidden');
        adminView.classList.replace('view-hidden', 'view-visible');
        historyView.classList.replace('view-visible', 'view-hidden');
    }, 1500);
});

btnLogout.addEventListener('click', function() {
    sidebarPanel.classList.replace('panel-visible', 'panel-hidden');
    welcomePanel.classList.replace('panel-hidden', 'panel-visible');
    leftPanel.classList.remove('md:w-[20%]');
    leftPanel.classList.add('md:w-[30%]');
    
    adminView.classList.replace('view-visible', 'view-hidden');
    historyView.classList.replace('view-visible', 'view-hidden');
    guestView.classList.replace('view-hidden', 'view-visible');
});

// ==========================================
// 4. LOGIKA FORM TAMU & INJEKSI DATA
// ==========================================
const guestForm = document.getElementById('guest-form');
const kategoriSelect = document.getElementById('kategori-select');
const kelasContainer = document.getElementById('kelas-container');
const inputKelas = document.getElementById('input-kelas');

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

if (guestForm) {
    guestForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        const guestName = document.getElementById('guest-name').value;
        const guestInstansi = document.getElementById('guest-instansi').value;
        const guestKategori = kategoriSelect.options[kategoriSelect.selectedIndex].text;
        
        const now = new Date();
        const timeString = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0') + ' WIB';
        const dateString = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        
        // Buat ID unik untuk mengaitkan row Overview dengan row Riwayat
        const uniqueId = 'guest-' + Date.now();

        const btnSubmitGuest = document.getElementById('btn-submit-guest');
        btnSubmitGuest.disabled = true;
        btnSubmitGuest.classList.add('opacity-80', 'cursor-not-allowed');
        document.getElementById('submit-text').innerText = "Mengirim...";
        document.getElementById('submit-icon').classList.add('hidden');
        document.getElementById('submit-spinner').classList.remove('hidden');

        setTimeout(() => {
            // --- INJEKSI KE TABEL RIWAYAT LOG (Background) ---
            const historyRow = document.createElement('tr');
            historyRow.id = `hist-${uniqueId}`; // Hubungkan via ID
            historyRow.className = "hover:bg-slate-50/50 transition-colors";
            historyRow.innerHTML = `
                <td class="px-6 py-4 text-slate-600 font-medium">${dateString}</td>
                <td class="px-6 py-4">
                    <p class="font-bold text-slate-900">${guestName}</p>
                    <p class="text-xs text-slate-500">${guestInstansi} (${guestKategori})</p>
                </td>
                <td class="px-6 py-4 text-slate-600">${timeString}</td>
                <td class="px-6 py-4 font-medium text-slate-400 out-time">-</td>
                <td class="px-6 py-4">
                    <span class="hist-status inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        Menunggu
                    </span>
                </td>
            `;
            historyTableBody.prepend(historyRow); // Taruh di paling atas

            // --- INJEKSI KE TABEL OVERVIEW AKTIF ---
            const tr = document.createElement('tr');
            tr.className = "bg-blue-50/50 hover:bg-slate-50/50 transition-colors";
            tr.innerHTML = `
                <td class="px-6 py-4">
                    <p class="font-bold text-slate-900">${guestName}</p>
                    <p class="text-xs text-blue-600 font-medium animate-pulse new-badge">Baru masuk</p>
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
                    <select class="status-selector bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-700 font-medium outline-none focus:border-blue-500 cursor-pointer shadow-sm">
                        <option value="menunggu" selected>Menunggu</option>
                        <option value="bertemu">Sedang Bertemu</option>
                        <option value="selesai">Selesai</option>
                    </select>
                </td>
            `;
            tableBody.prepend(tr);
            countMenunggu.innerText = parseInt(countMenunggu.innerText) + 1;

            // --- SISTEM UPDATE STATUS & JAM KELUAR ---
            const selector = tr.querySelector('.status-selector');
            const badge = tr.querySelector('.status-badge');
            const dot = tr.querySelector('.status-dot');
            const text = tr.querySelector('.status-text');
            const newBadge = tr.querySelector('.new-badge');
            let previousStatus = 'menunggu';

            selector.addEventListener('change', function(e) {
                const newStatus = e.target.value;
                if(newBadge) newBadge.remove(); // Hapus badge "baru masuk"

                // Update Statistik Angka
                if (previousStatus === 'menunggu') countMenunggu.innerText = Math.max(0, parseInt(countMenunggu.innerText) - 1);
                if (previousStatus === 'bertemu') countBertemu.innerText = Math.max(0, parseInt(countBertemu.innerText) - 1);
                if (previousStatus === 'selesai') countSelesai.innerText = Math.max(0, parseInt(countSelesai.innerText) - 1);

                // Tangkap cell History yang terkait
                const linkedHistRow = document.getElementById(`hist-${uniqueId}`);
                const histStatus = linkedHistRow.querySelector('.hist-status');
                const outTimeCell = linkedHistRow.querySelector('.out-time');

                if (newStatus === 'menunggu') {
                    countMenunggu.innerText = parseInt(countMenunggu.innerText) + 1;
                    badge.className = "status-badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700";
                    dot.className = "status-dot w-1.5 h-1.5 rounded-full bg-amber-500";
                    text.innerText = "Menunggu";
                    
                    histStatus.className = "hist-status inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700";
                    histStatus.innerText = "Menunggu";
                } 
                else if (newStatus === 'bertemu') {
                    countBertemu.innerText = parseInt(countBertemu.innerText) + 1;
                    badge.className = "status-badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700";
                    dot.className = "status-dot w-1.5 h-1.5 rounded-full bg-blue-500";
                    text.innerText = "Sedang Bertemu";

                    histStatus.className = "hist-status inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700";
                    histStatus.innerText = "Sedang Bertemu";
                } 
                else if (newStatus === 'selesai') {
                    countSelesai.innerText = parseInt(countSelesai.innerText) + 1;
                    badge.className = "status-badge inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700";
                    dot.className = "status-dot w-1.5 h-1.5 rounded-full bg-emerald-500";
                    text.innerText = "Selesai";
                    tr.classList.replace('bg-blue-50/50', 'bg-slate-50/10');
                    tr.classList.add('opacity-50'); 

                    // PENTING: Catat Jam Keluar di History Table
                    const outTime = new Date();
                    outTimeCell.innerText = outTime.getHours().toString().padStart(2, '0') + ':' + outTime.getMinutes().toString().padStart(2, '0') + ' WIB';
                    outTimeCell.classList.add('text-slate-900');
                    outTimeCell.classList.remove('text-slate-400');
                    
                    histStatus.className = "hist-status inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700";
                    histStatus.innerText = "Selesai";
                }
                previousStatus = newStatus;
            });

            // UI Transisi Sukses
            btnSubmitGuest.disabled = false;
            btnSubmitGuest.classList.remove('opacity-80', 'cursor-not-allowed');
            document.getElementById('submit-text').innerText = "Kirim & Check-In";
            document.getElementById('submit-icon').classList.remove('hidden');
            document.getElementById('submit-spinner').classList.add('hidden');

            const guestFormContainer = document.getElementById('guest-form-container');
            const successState = document.getElementById('success-state');
            
            guestFormContainer.classList.remove('scale-100', 'opacity-100');
            guestFormContainer.classList.add('scale-95', 'opacity-0', 'pointer-events-none');
            
            setTimeout(() => {
                successState.classList.remove('scale-95', 'opacity-0', 'pointer-events-none');
                successState.classList.add('scale-100', 'opacity-100', 'pointer-events-auto');
            }, 300);

        }, 2000); 
    });
}

// ==========================================
// 5. LOGIKA RESET FORM UNTUK TAMU BERIKUTNYA
// ==========================================
const btnNextGuest = document.getElementById('btn-next-guest');
if (btnNextGuest) {
    btnNextGuest.addEventListener('click', function() {
        const successState = document.getElementById('success-state');
        const guestFormContainer = document.getElementById('guest-form-container');
        
        successState.classList.remove('scale-100', 'opacity-100', 'pointer-events-auto');
        successState.classList.add('scale-95', 'opacity-0', 'pointer-events-none');
        
        setTimeout(() => {
            guestFormContainer.classList.remove('scale-95', 'opacity-0', 'pointer-events-none');
            guestFormContainer.classList.add('scale-100', 'opacity-100');
            
            guestForm.reset();
            kelasContainer.classList.remove('is-active');
            inputKelas.removeAttribute('required');
            
            if (videoStream) stopCamera();
            cameraResult.classList.add('hidden');
            btnRetake.classList.add('hidden');
            cameraIdle.classList.remove('hidden');
            cameraVideo.classList.add('hidden');
            btnCapture.classList.add('hidden');
        }, 300);
    });
}
