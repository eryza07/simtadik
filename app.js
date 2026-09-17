lucide.createIcons();

const guestsDatabase = {};

// DOM Elements Container
const leftPanel = document.getElementById('left-panel');
const welcomePanel = document.getElementById('welcome-panel');
const loginPanel = document.getElementById('login-panel');
const sidebarPanel = document.getElementById('sidebar-panel');
const guestView = document.getElementById('guest-view');
const trackingView = document.getElementById('tracking-view');
const adminView = document.getElementById('admin-view');
const verifyView = document.getElementById('verify-view');
const historyView = document.getElementById('history-view');

// DOM Elements Desktop Nav
const navOverview = document.getElementById('nav-overview');
const navVerify = document.getElementById('nav-verify');
const navHistory = document.getElementById('nav-history');

// DOM Elements Mobile Bottom Navs
const mNavGuest = document.getElementById('mobile-nav-guest');
const mNavAdmin = document.getElementById('mobile-nav-admin');

// ==========================================
// KONTROL NAVIGASI MOBILE (BOTTOM NAVBAR)
// ==========================================
const mBtnForm = document.getElementById('m-btn-form');
const mBtnTrack = document.getElementById('m-btn-track');
const mBtnLogin = document.getElementById('m-btn-login');

const mBtnOverview = document.getElementById('m-btn-overview');
const mBtnVerify = document.getElementById('m-btn-verify');
const mBtnHistory = document.getElementById('m-btn-history');
const mBtnLogout = document.getElementById('m-btn-logout');

// Helper: Reset warna icon mobile Guest
function resetMobileNavGuest() {
    [mBtnForm, mBtnTrack, mBtnLogin].forEach(btn => {
        btn.classList.remove('text-blue-600');
        btn.classList.add('text-slate-400');
        btn.querySelector('span').classList.remove('font-bold');
        btn.querySelector('span').classList.add('font-medium');
    });
    // Sembunyikan panel Desktop
    guestView.classList.replace('view-visible', 'view-hidden');
    trackingView.classList.replace('view-visible', 'view-hidden');
    loginPanel.classList.replace('panel-visible', 'panel-hidden');
    welcomePanel.classList.replace('panel-visible', 'panel-hidden');
}

// Helper: Reset warna icon mobile Admin
function resetMobileNavAdmin() {
    [mBtnOverview, mBtnVerify, mBtnHistory].forEach(btn => {
        btn.classList.remove('text-blue-400');
        btn.classList.add('text-slate-400');
        btn.querySelector('span').classList.remove('font-bold');
        btn.querySelector('span').classList.add('font-medium');
    });
    adminView.classList.replace('view-visible', 'view-hidden');
    verifyView.classList.replace('view-visible', 'view-hidden');
    historyView.classList.replace('view-visible', 'view-hidden');
}

// Event Mobile Nav Guest
mBtnForm.addEventListener('click', () => {
    resetMobileNavGuest();
    mBtnForm.classList.replace('text-slate-400', 'text-blue-600');
    mBtnForm.querySelector('span').classList.replace('font-medium', 'font-bold');
    welcomePanel.classList.replace('panel-hidden', 'panel-visible');
    guestView.classList.replace('view-hidden', 'view-visible');
});

mBtnTrack.addEventListener('click', () => {
    resetMobileNavGuest();
    mBtnTrack.classList.replace('text-slate-400', 'text-blue-600');
    mBtnTrack.querySelector('span').classList.replace('font-medium', 'font-bold');
    welcomePanel.classList.replace('panel-hidden', 'panel-visible'); // Pertahankan header
    trackingView.classList.replace('view-hidden', 'view-visible');
});

mBtnLogin.addEventListener('click', () => {
    resetMobileNavGuest();
    mBtnLogin.classList.replace('text-slate-400', 'text-blue-600');
    mBtnLogin.querySelector('span').classList.replace('font-medium', 'font-bold');
    loginPanel.classList.replace('panel-hidden', 'panel-visible');
});

// Event Mobile Nav Admin
mBtnOverview.addEventListener('click', () => {
    resetMobileNavAdmin();
    mBtnOverview.classList.replace('text-slate-400', 'text-blue-400');
    mBtnOverview.querySelector('span').classList.replace('font-medium', 'font-bold');
    adminView.classList.replace('view-hidden', 'view-visible');
});

mBtnVerify.addEventListener('click', () => {
    resetMobileNavAdmin();
    mBtnVerify.classList.replace('text-slate-400', 'text-blue-400');
    mBtnVerify.querySelector('span').classList.replace('font-medium', 'font-bold');
    verifyView.classList.replace('view-hidden', 'view-visible');
});

mBtnHistory.addEventListener('click', () => {
    resetMobileNavAdmin();
    mBtnHistory.classList.replace('text-slate-400', 'text-blue-400');
    mBtnHistory.querySelector('span').classList.replace('font-medium', 'font-bold');
    historyView.classList.replace('view-hidden', 'view-visible');
});


// ==========================================
// KONTROL NAVIGASI DESKTOP
// ==========================================
document.getElementById('btn-show-tracking-desktop').addEventListener('click', () => {
    guestView.classList.replace('view-visible', 'view-hidden');
    trackingView.classList.replace('view-hidden', 'view-visible');
});

document.getElementById('btn-back-from-tracking-desktop')?.addEventListener('click', () => {
    trackingView.classList.replace('view-visible', 'view-hidden');
    guestView.classList.replace('view-hidden', 'view-visible');
});

function toggleDesktopLogin() {
    if (welcomePanel.classList.contains('panel-visible')) {
        welcomePanel.classList.replace('panel-visible', 'panel-hidden');
        loginPanel.classList.replace('panel-hidden', 'panel-visible');
    } else {
        loginPanel.classList.replace('panel-visible', 'panel-hidden');
        welcomePanel.classList.replace('panel-hidden', 'panel-visible');
    }
}
document.getElementById('btn-show-login-desktop').addEventListener('click', toggleDesktopLogin);
document.getElementById('btn-hide-login-desktop').addEventListener('click', toggleDesktopLogin);

function resetDesktopAdminNavStyle() {
    const b = "flex-shrink-0 flex items-center gap-2 md:gap-3 px-4 py-2 md:py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl text-xs md:text-sm font-medium transition-colors";
    navOverview.className = b; navVerify.className = b; navHistory.className = b;
    adminView.classList.replace('view-visible', 'view-hidden');
    verifyView.classList.replace('view-visible', 'view-hidden');
    historyView.classList.replace('view-visible', 'view-hidden');
}

navOverview.addEventListener('click', (e) => {
    e.preventDefault(); resetDesktopAdminNavStyle();
    adminView.classList.replace('view-hidden', 'view-visible');
    navOverview.classList.add('bg-blue-600/20', 'text-blue-400');
    navOverview.classList.remove('text-slate-400', 'hover:bg-slate-800');
});
navVerify.addEventListener('click', (e) => {
    e.preventDefault(); resetDesktopAdminNavStyle();
    verifyView.classList.replace('view-hidden', 'view-visible');
    navVerify.classList.add('bg-blue-600/20', 'text-blue-400');
    navVerify.classList.remove('text-slate-400', 'hover:bg-slate-800');
});
navHistory.addEventListener('click', (e) => {
    e.preventDefault(); resetDesktopAdminNavStyle();
    historyView.classList.replace('view-hidden', 'view-visible');
    navHistory.classList.add('bg-blue-600/20', 'text-blue-400');
    navHistory.classList.remove('text-slate-400', 'hover:bg-slate-800');
});


// ==========================================
// LOGIN & LOGOUT PROSES (Menangani Mobile & Desktop)
// ==========================================
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault(); 
    document.getElementById('btn-do-login').disabled = true;
    document.getElementById('login-text').classList.add('hidden');
    document.getElementById('login-spinner').classList.remove('hidden');

    setTimeout(() => {
        document.getElementById('btn-do-login').disabled = false;
        document.getElementById('login-text').classList.remove('hidden');
        document.getElementById('login-spinner').classList.add('hidden');

        // Sembunyikan Nav Mobile Tamu, Tampilkan Nav Admin
        mNavGuest.classList.replace('translate-y-0', 'translate-y-full');
        mNavAdmin.classList.replace('translate-y-full', 'translate-y-0');

        // Buka Sidebar Admin Desktop
        loginPanel.classList.replace('panel-visible', 'panel-hidden');
        sidebarPanel.classList.replace('panel-hidden', 'panel-visible');
        leftPanel.classList.remove('md:w-[35%]', 'lg:w-[30%]');
        leftPanel.classList.add('md:w-[25%]', 'lg:w-[20%]');

        // Reset semua view
        guestView.classList.replace('view-visible', 'view-hidden');
        trackingView.classList.replace('view-visible', 'view-hidden');
        verifyView.classList.replace('view-visible', 'view-hidden');
        historyView.classList.replace('view-visible', 'view-hidden');
        
        // Tampilkan Overview default
        adminView.classList.replace('view-hidden', 'view-visible');
    }, 1000);
});

function processLogout() {
    // Sembunyikan Nav Admin, Tampilkan Nav Tamu
    mNavAdmin.classList.replace('translate-y-0', 'translate-y-full');
    mNavGuest.classList.replace('translate-y-full', 'translate-y-0');

    // Kembalikan Sidebar ke Welcome Desktop
    sidebarPanel.classList.replace('panel-visible', 'panel-hidden');
    welcomePanel.classList.replace('panel-hidden', 'panel-visible');
    
    leftPanel.classList.remove('md:w-[25%]', 'lg:w-[20%]');
    leftPanel.classList.add('md:w-[35%]', 'lg:w-[30%]');
    
    // Tampilkan form tamu, sembunyikan view admin
    adminView.classList.replace('view-visible', 'view-hidden');
    verifyView.classList.replace('view-visible', 'view-hidden');
    historyView.classList.replace('view-visible', 'view-hidden');
    trackingView.classList.replace('view-visible', 'view-hidden');
    
    guestView.classList.replace('view-hidden', 'view-visible');
    
    // Reset Mobile Nav Color
    resetMobileNavGuest();
    mBtnForm.classList.replace('text-slate-400', 'text-blue-600');
    mBtnForm.querySelector('span').classList.replace('font-medium', 'font-bold');
}

document.getElementById('btn-logout-desktop').addEventListener('click', processLogout);
mBtnLogout.addEventListener('click', processLogout);


// ==========================================
// TAMU: CEK STATUS MANDIRI LOGIC
// ==========================================
document.getElementById('track-input').addEventListener('input', (e) => e.target.value = e.target.value.toUpperCase());

document.getElementById('btn-do-track').addEventListener('click', () => {
    const code = document.getElementById('track-input').value.trim();
    if(!code) return;

    document.getElementById('track-result-container').classList.remove('hidden');

    if (guestsDatabase[code]) {
        const data = guestsDatabase[code];
        document.getElementById('track-not-found').classList.add('hidden');
        document.getElementById('track-found').classList.remove('hidden');
        document.getElementById('track-res-name').innerText = data.name;
        
        const statusEl = document.getElementById('track-res-status');
        const dotEl = document.getElementById('track-res-dot');
        const barEl = document.getElementById('track-color-bar');

        if (data.status === 'menunggu') {
            statusEl.innerText = "Menunggu";
            statusEl.className = "text-base md:text-lg font-bold text-amber-600";
            dotEl.className = "w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse";
            barEl.className = "absolute top-0 right-0 w-2 h-full bg-amber-500";
        } else if (data.status === 'bertemu') {
            statusEl.innerText = "Sedang Bertemu";
            statusEl.className = "text-base md:text-lg font-bold text-blue-600";
            dotEl.className = "w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse";
            barEl.className = "absolute top-0 right-0 w-2 h-full bg-blue-500";
        } else if (data.status === 'selesai') {
            statusEl.innerText = "Selesai (Keluar)";
            statusEl.className = "text-base md:text-lg font-bold text-emerald-600";
            dotEl.className = "w-2.5 h-2.5 rounded-full bg-emerald-500";
            barEl.className = "absolute top-0 right-0 w-2 h-full bg-emerald-500";
        }
    } else {
        document.getElementById('track-found').classList.add('hidden');
        document.getElementById('track-not-found').classList.remove('hidden');
    }
});

// ==========================================
// KAMERA WEBRTC
// ==========================================
const cameraVideo = document.getElementById('camera-video');
const cameraCanvas = document.getElementById('camera-canvas');
const cameraResult = document.getElementById('camera-result');
let videoStream = null;

async function startCamera() {
    try {
        const constraints = { video: { facingMode: 'user' } };
        videoStream = await navigator.mediaDevices.getUserMedia(constraints);
        cameraVideo.srcObject = videoStream;
        document.getElementById('camera-idle').classList.add('hidden');
        cameraVideo.classList.remove('hidden');
        document.getElementById('btn-capture').classList.remove('hidden');
    } catch (err) { alert("Akses kamera ditolak."); }
}

function takeSnapshot() {
    if (!videoStream) return;
    cameraCanvas.width = cameraVideo.videoWidth;
    cameraCanvas.height = cameraVideo.videoHeight;
    cameraCanvas.getContext('2d').drawImage(cameraVideo, 0, 0);
    cameraResult.src = cameraCanvas.toDataURL('image/jpeg', 0.8);
    
    cameraVideo.classList.add('hidden');
    document.getElementById('btn-capture').classList.add('hidden');
    cameraResult.classList.remove('hidden');
    document.getElementById('btn-retake').classList.remove('hidden');
    stopCamera();
}

function retakePhoto() {
    cameraResult.classList.add('hidden');
    document.getElementById('btn-retake').classList.add('hidden');
    startCamera();
}

function stopCamera() {
    if (videoStream) { videoStream.getTracks().forEach(t => t.stop()); videoStream = null; }
}

// ==========================================
// SUBMIT FORM KEDATANGAN TAMU (GENERATE TIKET)
// ==========================================
document.getElementById('kategori-select').addEventListener('change', function() {
    if (this.value === 'siswa') document.getElementById('kelas-container').classList.add('is-active');
    else document.getElementById('kelas-container').classList.remove('is-active');
});

document.getElementById('guest-form').addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    const guestName = document.getElementById('guest-name').value;
    const instansi = document.getElementById('guest-instansi').value;
    
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    
    const code = `SMAN1-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    guestsDatabase[code] = { name: guestName, instansi: instansi, time: timeStr, status: 'menunggu' };

    document.getElementById('btn-submit-guest').disabled = true;
    document.getElementById('submit-text').innerText = "Membuat Tiket...";
    document.getElementById('submit-icon').classList.add('hidden');
    document.getElementById('submit-spinner').classList.remove('hidden');

    setTimeout(() => {
        document.getElementById('ticket-name').innerText = guestName;
        document.getElementById('ticket-code').innerText = code;

        document.getElementById('guest-form-container').classList.replace('scale-100', 'scale-95');
        document.getElementById('guest-form-container').classList.replace('opacity-100', 'opacity-0');
        document.getElementById('guest-form-container').classList.add('pointer-events-none');
        
        setTimeout(() => {
            document.getElementById('success-state').classList.replace('opacity-0', 'opacity-100');
            document.getElementById('success-state').classList.replace('scale-95', 'scale-100');
            document.getElementById('success-state').classList.replace('pointer-events-none', 'pointer-events-auto');
        }, 300);

        injectToAdminOverview(code, guestName, timeStr);
        injectToHistory(code, guestName, timeStr);

        document.getElementById('btn-submit-guest').disabled = false;
        document.getElementById('submit-text').innerText = "Kirim & Dapatkan Tiket";
        document.getElementById('submit-icon').classList.remove('hidden');
        document.getElementById('submit-spinner').classList.add('hidden');
    }, 1500); 
});

document.getElementById('btn-next-guest').addEventListener('click', () => {
    document.getElementById('success-state').classList.replace('opacity-100', 'opacity-0');
    document.getElementById('success-state').classList.replace('scale-100', 'scale-95');
    document.getElementById('success-state').classList.replace('pointer-events-auto', 'pointer-events-none');
    setTimeout(() => {
        document.getElementById('guest-form-container').classList.replace('opacity-0', 'opacity-100');
        document.getElementById('guest-form-container').classList.replace('scale-95', 'scale-100');
        document.getElementById('guest-form-container').classList.remove('pointer-events-none');
        document.getElementById('guest-form').reset();
        document.getElementById('kelas-container').classList.remove('is-active');
        if(videoStream) stopCamera();
        cameraResult.classList.add('hidden');
        document.getElementById('btn-retake').classList.add('hidden');
        document.getElementById('camera-idle').classList.remove('hidden');
        cameraVideo.classList.add('hidden');
        document.getElementById('btn-capture').classList.add('hidden');
    }, 300);
});

// ==========================================
// INJEKSI KE ADMIN
// ==========================================
function injectToAdminOverview(code, name, time) {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-50/50 transition-colors";
    tr.innerHTML = `
        <td class="px-4 py-3">
            <p class="text-[10px] font-mono text-slate-400">${code}</p>
            <p class="font-bold text-slate-900">${name}</p>
        </td>
        <td class="px-4 py-3 text-slate-600">${time}</td>
        <td class="px-4 py-3">
            <span class="status-badge inline-flex px-2 py-1 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700">Menunggu</span>
        </td>
        <td class="px-4 py-3">
            <select id="sel-${code}" class="bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs outline-none w-full sm:w-auto">
                <option value="menunggu" selected>Menunggu</option>
                <option value="bertemu">Sedang Bertemu</option>
                <option value="selesai">Selesai</option>
            </select>
        </td>
    `;
    document.getElementById('table-body').prepend(tr);
    updateCounter('menunggu', 1);

    const selector = tr.querySelector(`#sel-${code}`);
    const badge = tr.querySelector('.status-badge');
    let prev = 'menunggu';

    selector.addEventListener('change', (e) => {
        const val = e.target.value;
        guestsDatabase[code].status = val; 
        
        updateCounter(prev, -1);
        updateCounter(val, 1);

        const histBadge = document.getElementById(`hist-badge-${code}`);
        const histOut = document.getElementById(`hist-out-${code}`);

        if(val === 'menunggu') {
            badge.className = "status-badge inline-flex px-2 py-1 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700";
            badge.innerText = "Menunggu";
            if(histBadge) { histBadge.className=badge.className; histBadge.innerText="Menunggu"; }
        } else if(val === 'bertemu') {
            badge.className = "status-badge inline-flex px-2 py-1 rounded-full text-[10px] font-medium bg-blue-100 text-blue-700";
            badge.innerText = "Sedang Bertemu";
            if(histBadge) { histBadge.className=badge.className; histBadge.innerText="Sedang Bertemu"; }
        } else if(val === 'selesai') {
            badge.className = "status-badge inline-flex px-2 py-1 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-700";
            badge.innerText = "Selesai";
            tr.classList.add('opacity-50');
            const o = new Date();
            if(histBadge) { 
                histBadge.className=badge.className; histBadge.innerText="Selesai"; 
                histOut.innerText = `Keluar: ${o.getHours().toString().padStart(2,'0')}:${o.getMinutes().toString().padStart(2,'0')}`;
            }
        }
        prev = val;
    });
}

function injectToHistory(code, name, time) {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-slate-50/50";
    tr.innerHTML = `
        <td class="px-4 py-3 text-slate-600 font-medium">Hari Ini</td>
        <td class="px-4 py-3">
            <p class="text-[10px] font-mono text-slate-400">${code}</p>
            <p class="font-bold text-slate-900">${name}</p>
        </td>
        <td class="px-4 py-3 text-slate-600">${time} <br><span id="hist-out-${code}" class="text-[10px] font-bold text-slate-800">Blm Keluar</span></td>
        <td class="px-4 py-3">
            <span id="hist-badge-${code}" class="inline-flex px-2 py-1 rounded-full text-[10px] font-medium bg-amber-100 text-amber-700">Menunggu</span>
        </td>
    `;
    document.getElementById('history-table-body').prepend(tr);
}

function updateCounter(type, amount) {
    const el = document.getElementById(`count-${type}`);
    el.innerText = Math.max(0, parseInt(el.innerText) + amount);
}

// ==========================================
// ADMIN: VERIFIKASI KODE TIKET & APPLY
// ==========================================
document.getElementById('admin-verify-input').addEventListener('input', (e) => e.target.value = e.target.value.toUpperCase());

let codeToVerify = null;

document.getElementById('btn-admin-verify').addEventListener('click', () => {
    const code = document.getElementById('admin-verify-input').value.trim();
    if(!code) return;

    if (guestsDatabase[code]) {
        codeToVerify = code;
        const data = guestsDatabase[code];
        
        document.getElementById('verify-not-found').classList.add('hidden');
        document.getElementById('verify-result-card').classList.remove('hidden');
        
        document.getElementById('verify-res-name').innerText = data.name;
        document.getElementById('verify-res-instansi').innerText = data.instansi;
        
        const badge = document.getElementById('verify-res-status-badge');
        const btnApply = document.getElementById('btn-apply-ruangan');
        const msgDone = document.getElementById('verify-msg-done');

        if(data.status === 'menunggu') {
            badge.className = "px-3 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700";
            badge.innerText = "Menunggu";
            btnApply.classList.remove('hidden');
            msgDone.classList.add('hidden');
        } else {
            badge.className = data.status === 'bertemu' ? "px-3 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700" : "px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700";
            badge.innerText = data.status === 'bertemu' ? "Sedang Bertemu" : "Selesai";
            btnApply.classList.add('hidden');
            msgDone.classList.remove('hidden');
        }
    } else {
        document.getElementById('verify-result-card').classList.add('hidden');
        document.getElementById('verify-not-found').classList.remove('hidden');
    }
});

document.getElementById('btn-apply-ruangan').addEventListener('click', () => {
    if(codeToVerify) {
        const selectBox = document.getElementById(`sel-${codeToVerify}`);
        if(selectBox) {
            selectBox.value = 'bertemu';
            selectBox.dispatchEvent(new Event('change'));
            
            document.getElementById('btn-apply-ruangan').classList.add('hidden');
            document.getElementById('verify-msg-done').classList.remove('hidden');
            
            const badge = document.getElementById('verify-res-status-badge');
            badge.className = "px-3 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700";
            badge.innerText = "Sedang Bertemu";
        }
    }
});
