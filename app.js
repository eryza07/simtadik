lucide.createIcons();

const guestsDatabase = {};
let currentUserRole = 'guest'; 

let chartOverview = null;
let chartAnalitik = null;
let currentActiveView = 'view-guest-form';

// =========================================================
// WAKTU OTOMATIS & FORMAT WA
// =========================================================
const dateInput = document.getElementById('guest-date');
if (dateInput) { const today = new Date(); dateInput.value = today.toISOString().split('T')[0]; }
const timeInput = document.getElementById('guest-time');
if (timeInput) { const now = new Date(); timeInput.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`; }
const todayStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

function formatPhone(phone) { let p = phone.replace(/\D/g, ''); if(p.startsWith('0')) p = '62' + p.substring(1); return p; }

// =========================================================
// FITUR WHATSAPP & RESCHEDULE
// =========================================================
let codeToVerify = null; 
let activeDetailCode = null; 
let rescheduleCode = null; 

window.sendWAApprove = function() {
    let targetCode = activeDetailCode || codeToVerify;
    const data = guestsDatabase[targetCode]; if(!data) return;
    const msg = `Halo *${data.name}*, jadwal kunjungan Anda ke SMAN 1 Kandangan telah *DISETUJUI* untuk tanggal *${data.displayDate}* pukul *${data.planTime}*.\n\nPENTING: Saat Anda tiba di sekolah, *HARAP MELAPOR KE MEJA TATA USAHA (TU) TERLEBIH DAHULU* untuk memverifikasi Kode Tiket Anda (*${targetCode}*). Dilarang langsung menuju Ruang Kepala Sekolah tanpa izin dari petugas TU.\n\nTerima kasih.`;
    window.open(`https://wa.me/${formatPhone(data.phone)}?text=${encodeURIComponent(msg)}`, '_blank');
};

window.openRescheduleModal = function() {
    let targetCode = activeDetailCode || codeToVerify;
    const data = guestsDatabase[targetCode]; if(!data) return;
    rescheduleCode = targetCode;
    
    document.getElementById('reschedule-date').value = data.date; 
    document.getElementById('reschedule-time').value = ""; 
    document.getElementById('reschedule-reason').value = "";

    const modal = document.getElementById('reschedule-modal');
    const card = document.getElementById('reschedule-card');
    modal.classList.remove('hidden');
    setTimeout(() => { card.classList.replace('scale-95', 'scale-100'); card.classList.replace('opacity-0', 'opacity-100'); }, 10);
};

window.closeRescheduleModal = function() {
    const modal = document.getElementById('reschedule-modal');
    const card = document.getElementById('reschedule-card');
    card.classList.replace('scale-100', 'scale-95'); card.classList.replace('opacity-100', 'opacity-0');
    setTimeout(() => { modal.classList.add('hidden'); rescheduleCode = null; }, 250);
};

window.submitReschedule = function() {
    if(!rescheduleCode) return;
    const data = guestsDatabase[rescheduleCode]; if(!data) return;
    const reason = document.getElementById('reschedule-reason').value || "Bapak Kepala Sekolah ada keperluan mendadak";
    const newDate = document.getElementById('reschedule-date').value; const newTime = document.getElementById('reschedule-time').value;
    const dateObj = new Date(newDate); const newDisplayDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;
    const newPlanTime = newTime ? newTime + " WIB" : "Waktu menyesuaikan";

    changeGuestStatus(rescheduleCode, 'ditolak'); 
    
    const msg = `Mohon maaf Bapak/Ibu *${data.name}*, jadwal kunjungan Anda dengan Kode Tiket *${rescheduleCode}* terpaksa kami *BATALKAN* karena *${reason}*.\n\nSebagai gantinya, kami menyarankan Anda untuk datang kembali pada tanggal *${newDisplayDate}* pukul *${newPlanTime}*.\n\nSilakan balas pesan ini untuk mengonfirmasi ketersediaan Anda. Terima kasih.`;
    window.open(`https://wa.me/${formatPhone(data.phone)}?text=${encodeURIComponent(msg)}`, '_blank');
    closeRescheduleModal();
};

// =========================================================
// PUSH NOTIFICATION & TOAST
// =========================================================
function playTingSound() {
    const AudioContext = window.AudioContext || window.webkitAudioContext; if (!AudioContext) return;
    try { const ctx = new AudioContext(); const osc = ctx.createOscillator(); const gainNode = ctx.createGain(); osc.type = 'sine'; osc.frequency.setValueAtTime(880, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.5); gainNode.gain.setValueAtTime(0.5, ctx.currentTime); gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5); osc.connect(gainNode); gainNode.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.5); } catch (e) {}
}

function checkNotifPermission() {
    if (!("Notification" in window)) return;
    const btn = document.getElementById('btn-enable-notif');
    if (Notification.permission !== "granted" && Notification.permission !== "denied" && currentUserRole !== 'guest') {
        if(btn) btn.classList.remove('hidden');
    } else {
        if(btn) btn.classList.add('hidden');
    }
}
window.requestDesktopNotif = function() {
    if (!("Notification" in window)) { alert("Browser ini tidak mendukung notifikasi OS Desktop."); return; }
    Notification.requestPermission().then(permission => {
        checkNotifPermission();
        if (permission === "granted") { new Notification("Notifikasi Aktif!", { body: "Anda akan menerima pemberitahuan tamu baru secara langsung di layar ini.", icon: "logo.png" }); }
    });
};

window.silentAddNotification = function(title, message) {
    const now = new Date(); const timeStr = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')} WIB`;
    const list = document.getElementById('notif-list'); const empty = document.getElementById('notif-empty');
    if(empty) empty.classList.add('hidden');
    const item = document.createElement('div');
    item.className = "p-3 hover:bg-slate-50 rounded-xl transition cursor-pointer border border-transparent hover:border-slate-100 flex gap-3 fade-in";
    item.innerHTML = `<div class="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5"><i data-lucide="bell" class="w-4 h-4 pointer-events-none"></i></div><div><h5 class="text-xs font-bold text-slate-900">${title}</h5><p class="text-[10px] text-slate-500 mt-0.5 line-clamp-2">${message}</p><span class="text-[9px] font-bold text-slate-400 mt-1 block">${timeStr}</span></div>`;
    list.prepend(item); lucide.createIcons();
    
    const dotHeader = document.getElementById('header-notif-dot'); if(dotHeader) dotHeader.classList.remove('hidden');
    document.querySelectorAll('.nav-red-dot').forEach(dot => dot.classList.remove('hidden'));

    if ("Notification" in window && Notification.permission === "granted") { new Notification(title, { body: message, icon: "logo.png" }); }
}

window.toggleNotifDropdown = function(e) {
    if(e) e.stopPropagation();
    const dropdown = document.getElementById('notif-dropdown'); const dot = document.getElementById('header-notif-dot');
    if(dot) dot.classList.add('hidden'); 
    if (dropdown.classList.contains('hidden')) { dropdown.classList.remove('hidden'); setTimeout(() => { dropdown.classList.remove('opacity-0', 'scale-95'); dropdown.classList.add('opacity-100', 'scale-100'); }, 10); } 
    else { dropdown.classList.remove('opacity-100', 'scale-100'); dropdown.classList.add('opacity-0', 'scale-95'); setTimeout(() => dropdown.classList.add('hidden'), 200); }
};
window.clearNotifications = function() {
    const list = document.getElementById('notif-list');
    list.innerHTML = `<div id="notif-empty" class="p-6 text-center text-slate-400 flex flex-col items-center"><i data-lucide="bell-off" class="w-6 h-6 mb-2 opacity-50"></i><span class="text-xs">Belum ada notifikasi.</span></div>`;
    lucide.createIcons();
};
document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('notif-dropdown'); const btn = document.getElementById('btn-header-notif');
    if (dropdown && !dropdown.classList.contains('hidden') && btn && !btn.contains(e.target) && !dropdown.contains(e.target)) { dropdown.classList.remove('opacity-100', 'scale-100'); dropdown.classList.add('opacity-0', 'scale-95'); setTimeout(() => dropdown.classList.add('hidden'), 200); }
});

// =========================================================
// NAVIGASI
// =========================================================
function triggerIconAnimation(element) { element.classList.remove('animate-icon'); void element.offsetWidth; element.classList.add('animate-icon'); }
function updateIndicators() {
    const activeDesktop = document.querySelector(`.nav-tab-btn[data-target="${currentActiveView}"]`); const desktopIndicator = document.getElementById('sliding-indicator');
    if (activeDesktop && activeDesktop.offsetParent !== null) { const navRect = activeDesktop.closest('nav').getBoundingClientRect(); const btnRect = activeDesktop.getBoundingClientRect(); desktopIndicator.style.top = `${btnRect.top - navRect.top}px`; desktopIndicator.style.height = `${btnRect.height}px`; desktopIndicator.style.opacity = '1'; } else if (desktopIndicator) desktopIndicator.style.opacity = '0';
    const activeMobile = document.querySelector(`.m-nav-btn[data-target="${currentActiveView}"], .m-admin-btn[data-target="${currentActiveView}"]`); const mobileIndicator = document.getElementById('mobile-sliding-indicator');
    if (activeMobile && activeMobile.offsetParent !== null && mobileIndicator) { const navRect = activeMobile.closest('nav').getBoundingClientRect(); const btnRect = activeMobile.getBoundingClientRect(); mobileIndicator.style.left = `${btnRect.left - navRect.left}px`; mobileIndicator.style.width = `${btnRect.width}px`; mobileIndicator.style.opacity = '1'; } else if (mobileIndicator) mobileIndicator.style.opacity = '0';
}
window.addEventListener('resize', () => { setTimeout(updateIndicators, 100); });

window.switchAppView = function(targetId) {
    currentActiveView = targetId;
    if (currentUserRole === 'admin' && (targetId === 'view-admin-overview' || targetId === 'view-admin-verify')) { document.querySelectorAll('.nav-red-dot').forEach(dot => dot.classList.add('hidden')); }
    document.querySelectorAll('.app-view').forEach(view => { view.classList.remove('block', 'flex'); view.classList.add('hidden'); });
    const target = document.getElementById(targetId); if (!target) return; target.classList.remove('hidden');
    if (['view-success', 'view-track', 'view-login'].includes(targetId)) target.classList.add('flex'); else target.classList.add('block');
    document.querySelectorAll('.nav-tab-btn').forEach(btn => { if (btn.getAttribute('data-target') === targetId) { btn.classList.add('text-rose-600'); btn.classList.remove('text-slate-400', 'hover:text-slate-700'); btn.querySelector('span.tracking-tight').classList.replace('font-semibold', 'font-bold'); } else { btn.classList.remove('text-rose-600'); btn.classList.add('text-slate-400', 'hover:text-slate-700'); btn.querySelector('span.tracking-tight').classList.replace('font-bold', 'font-semibold'); } });
    document.querySelectorAll('.m-nav-btn, .m-admin-btn').forEach(btn => { if(btn.getAttribute('data-target') === targetId) { btn.classList.add('text-rose-600'); btn.classList.remove('text-slate-400'); btn.querySelector('span').classList.replace('font-medium', 'font-bold'); } else { btn.classList.remove('text-rose-600'); btn.classList.add('text-slate-400'); btn.querySelector('span').classList.replace('font-bold', 'font-medium'); } });
    setTimeout(updateIndicators, 50); 
}

function bindNavEvents() { document.querySelectorAll('.nav-tab-btn, .m-nav-btn, .m-admin-btn').forEach(btn => { btn.addEventListener('click', function () { triggerIconAnimation(this); switchAppView(this.getAttribute('data-target')); }); }); }
function renderMobileNav() {
    const nav = document.getElementById('mobile-bottom-nav');
    if (currentUserRole === 'guest') { nav.innerHTML = `<div id="mobile-sliding-indicator" class="sliding-indicator absolute top-0 h-[3px] bg-rose-600 rounded-b-full opacity-0 pointer-events-none z-10" style="left: 0; width: 0;"></div><button type="button" class="m-nav-btn flex-1 flex flex-col items-center justify-center h-full text-rose-600 cursor-pointer" data-target="view-guest-form"><i data-lucide="user-plus" class="w-5 h-5 mb-0.5 pointer-events-none"></i><span class="text-[9px] font-bold pointer-events-none">Buku Tamu</span></button><button type="button" class="m-nav-btn flex-1 flex flex-col items-center justify-center h-full text-slate-400 cursor-pointer" data-target="view-track"><i data-lucide="search" class="w-5 h-5 mb-0.5 pointer-events-none"></i><span class="text-[9px] font-medium pointer-events-none">Cek Tiket</span></button><button type="button" class="flex-1 flex flex-col items-center justify-center h-full text-slate-400 cursor-pointer" onclick="toggleLoginAction(this)"><i data-lucide="lock" class="w-5 h-5 mb-0.5 pointer-events-none"></i><span class="text-[9px] font-medium pointer-events-none">Login TU</span></button>`; } 
    else if (currentUserRole === 'admin') { nav.innerHTML = `<div id="mobile-sliding-indicator" class="sliding-indicator absolute top-0 h-[3px] bg-rose-600 rounded-b-full opacity-0 pointer-events-none z-10" style="left: 0; width: 0;"></div><button type="button" class="m-admin-btn flex-1 flex flex-col items-center justify-center h-full text-rose-600 relative cursor-pointer" data-target="view-admin-overview"><div class="relative pointer-events-none"><i data-lucide="home" class="w-5 h-5 mb-0.5"></i><span class="nav-red-dot hidden absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white red-dot-pulse pointer-events-none"></span></div><span class="text-[9px] font-bold pointer-events-none">Beranda</span></button><button type="button" class="m-admin-btn flex-1 flex flex-col items-center justify-center h-full text-slate-400 cursor-pointer" data-target="view-admin-statistik"><i data-lucide="pie-chart" class="w-5 h-5 mb-0.5 pointer-events-none"></i><span class="text-[9px] font-medium pointer-events-none">Analitik</span></button><button type="button" class="m-admin-btn flex-1 flex flex-col items-center justify-center h-full text-slate-400 relative cursor-pointer" data-target="view-admin-verify"><div class="relative pointer-events-none"><i data-lucide="scan" class="w-5 h-5 mb-0.5"></i><span class="nav-red-dot hidden absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white red-dot-pulse pointer-events-none"></span></div><span class="text-[9px] font-medium pointer-events-none">Verifikasi</span></button><button type="button" class="m-admin-btn flex-1 flex flex-col items-center justify-center h-full text-slate-400 cursor-pointer" data-target="view-admin-history"><i data-lucide="book-open" class="w-5 h-5 mb-0.5 pointer-events-none"></i><span class="text-[9px] font-medium pointer-events-none">Riwayat</span></button><button type="button" class="flex-1 flex flex-col items-center justify-center h-full text-red-500 cursor-pointer" onclick="processLogout()"><i data-lucide="log-out" class="w-5 h-5 mb-0.5 pointer-events-none"></i><span class="text-[9px] font-medium pointer-events-none">Keluar</span></button>`; } 
    else if (currentUserRole === 'kepsek') { nav.innerHTML = `<div id="mobile-sliding-indicator" class="sliding-indicator absolute top-0 h-[3px] bg-emerald-600 rounded-b-full opacity-0 pointer-events-none z-10" style="left: 0; width: 0;"></div><button type="button" class="m-admin-btn flex-1 flex flex-col items-center justify-center h-full text-emerald-600 cursor-pointer" data-target="view-kepsek-overview"><i data-lucide="monitor" class="w-5 h-5 mb-0.5 pointer-events-none"></i><span class="text-[9px] font-bold pointer-events-none">Layar Pimpinan</span></button><button type="button" class="flex-1 flex flex-col items-center justify-center h-full text-red-500 cursor-pointer" onclick="processLogout()"><i data-lucide="log-out" class="w-5 h-5 mb-0.5 pointer-events-none"></i><span class="text-[9px] font-medium pointer-events-none">Keluar</span></button>`; }
    lucide.createIcons(); bindNavEvents();
}
window.toggleLoginAction = function(btn) { if(btn) triggerIconAnimation(btn); if(currentUserRole === 'guest') switchAppView('view-login'); else processLogout(); };
renderMobileNav(); setTimeout(updateIndicators, 100);

// =========================================================
// GRAFIK
// =========================================================
function createChartConfig() { return { type: 'bar', data: { labels: ['Siswa', 'Dinas', 'Guru', 'Umum'], datasets: [{ label: 'Jumlah', data: [0, 0, 0, 0], backgroundColor: ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b'], borderRadius: 6, borderSkipped: false, barThickness: 24 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } }, x: { grid: { display: false } } }, animation: { duration: 1000, easing: 'easeOutQuart' } } }; }
function initChart() { try { const ctxOverview = document.getElementById('visitorChartOverview'); const ctxAnalitik = document.getElementById('visitorChartAnalitik'); if(ctxOverview) chartOverview = new Chart(ctxOverview, createChartConfig()); if(ctxAnalitik) chartAnalitik = new Chart(ctxAnalitik, createChartConfig()); } catch(e) {} }
initChart(); 
function updateChartData(siswa, dinas, guru, umum) { const dataObj = [siswa, dinas, guru, umum]; if (chartOverview) { chartOverview.data.datasets[0].data = dataObj; chartOverview.update(); } if (chartAnalitik) { chartAnalitik.data.datasets[0].data = dataObj; chartAnalitik.update(); } }

// =========================================================
// LOGIN AMAN & LOGOUT
// =========================================================
window.handleLoginEnter = function(e) { if (e.key === 'Enter') { e.preventDefault(); executeSafeLogin(); } };
window.executeSafeLogin = function() {
    const userVal = document.getElementById('username-input').value.trim().toLowerCase(); const passVal = document.getElementById('password-input').value.trim();
    if(!userVal || !passVal) { alert("Username dan Password tidak boleh kosong!"); return; }
    let roleValid = null; if (userVal === 'admin' && passVal === 'admin') roleValid = 'admin'; else if (userVal === 'kepsek' && passVal === 'password') roleValid = 'kepsek';
    if (!roleValid) { alert("Akses Ditolak: Username atau Password salah!"); return; }
    
    document.getElementById('btn-do-login').disabled = true; document.getElementById('login-text').classList.add('hidden'); document.getElementById('login-spinner').classList.remove('hidden');
    setTimeout(() => {
        document.getElementById('btn-do-login').disabled = false; document.getElementById('login-text').classList.remove('hidden'); document.getElementById('login-spinner').classList.add('hidden');
        document.getElementById('guest-nav-group').classList.add('hidden'); document.getElementById('admin-nav-group').classList.add('hidden'); document.getElementById('kepsek-nav-group').classList.add('hidden');

        if(roleValid === 'kepsek') { currentUserRole = 'kepsek'; document.getElementById('kepsek-nav-group').classList.remove('hidden'); document.getElementById('kepsek-nav-group').classList.add('flex'); switchAppView('view-kepsek-overview'); } 
        else if (roleValid === 'admin') { currentUserRole = 'admin'; document.getElementById('admin-nav-group').classList.remove('hidden'); document.getElementById('admin-nav-group').classList.add('flex'); switchAppView('view-admin-overview'); }
        
        document.getElementById('header-notif-container').classList.remove('hidden');
        const btnAction = document.getElementById('btn-sidebar-action'); btnAction.classList.replace('bg-rose-500', 'bg-slate-800'); btnAction.classList.replace('hover:bg-rose-600', 'hover:bg-slate-700'); btnAction.classList.replace('shadow-rose-500/25', 'shadow-slate-800/25');
        document.getElementById('sidebar-icon').setAttribute('data-lucide', 'log-out'); document.getElementById('sidebar-text').innerText = "Keluar";
        
        lucide.createIcons(); renderMobileNav(); refreshDashboardMetrics(); document.getElementById('username-input').value = ""; document.getElementById('password-input').value = "";
        checkNotifPermission();
    }, 800);
};

window.processLogout = function() {
    currentUserRole = 'guest'; document.getElementById('admin-nav-group').classList.add('hidden'); document.getElementById('admin-nav-group').classList.remove('flex'); document.getElementById('kepsek-nav-group').classList.add('hidden'); document.getElementById('kepsek-nav-group').classList.remove('flex'); document.getElementById('guest-nav-group').classList.remove('hidden'); document.getElementById('guest-nav-group').classList.add('flex'); document.getElementById('header-notif-container').classList.add('hidden'); document.getElementById('notif-dropdown').classList.add('hidden');
    const btnAction = document.getElementById('btn-sidebar-action'); btnAction.classList.replace('bg-slate-800', 'bg-rose-500'); btnAction.classList.replace('hover:bg-slate-700', 'hover:bg-rose-600'); btnAction.classList.replace('shadow-slate-800/25', 'shadow-rose-500/25');
    document.getElementById('sidebar-icon').setAttribute('data-lucide', 'lock'); document.getElementById('sidebar-text').innerText = "Login";
    lucide.createIcons(); renderMobileNav(); switchAppView('view-guest-form'); 
    const dotHeader = document.getElementById('header-notif-dot'); if(dotHeader) dotHeader.classList.add('hidden'); document.querySelectorAll('.nav-red-dot').forEach(dot => dot.classList.add('hidden'));
    const btnNotif = document.getElementById('btn-enable-notif'); if(btnNotif) btnNotif.classList.add('hidden');
};

// =========================================================
// KAMERA WEBRTC & UPLOAD FILE (FITUR BARU)
// =========================================================
document.getElementById('kategori-select')?.addEventListener('change', function () { const container = document.getElementById('kelas-container'); if (this.value === 'siswa') container.classList.add('is-active'); else container.classList.remove('is-active'); });
const cameraVideo = document.getElementById('camera-video'); const cameraCanvas = document.getElementById('camera-canvas'); const cameraResult = document.getElementById('camera-result'); let videoStream = null;

async function startCamera() { 
    try { 
        videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } }); 
        cameraVideo.srcObject = videoStream; 
        document.getElementById('camera-idle').classList.add('hidden'); 
        cameraVideo.classList.remove('hidden'); 
        document.getElementById('btn-capture').classList.remove('hidden'); 
    } catch (err) { alert("Kamera diblokir oleh browser."); } 
}

function takeSnapshot() { 
    if (!videoStream) return; 
    cameraCanvas.width = cameraVideo.videoWidth; cameraCanvas.height = cameraVideo.videoHeight; 
    cameraCanvas.getContext('2d').drawImage(cameraVideo, 0, 0); 
    cameraResult.src = cameraCanvas.toDataURL('image/jpeg', 0.85); 
    
    cameraVideo.classList.add('hidden'); document.getElementById('btn-capture').classList.add('hidden'); 
    cameraResult.classList.remove('hidden'); document.getElementById('btn-retake').classList.remove('hidden'); 
    stopCamera(); 
}

window.handlePhotoUpload = function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            cameraResult.src = e.target.result;
            document.getElementById('camera-idle').classList.add('hidden');
            cameraVideo.classList.add('hidden');
            document.getElementById('btn-capture').classList.add('hidden');
            
            cameraResult.classList.remove('hidden');
            document.getElementById('btn-retake').classList.remove('hidden');
            if (videoStream) stopCamera(); 
        }
        reader.readAsDataURL(file);
    }
};

window.retakePhoto = function() { 
    cameraResult.classList.add('hidden'); 
    document.getElementById('btn-retake').classList.add('hidden'); 
    document.getElementById('camera-idle').classList.remove('hidden');
    document.getElementById('upload-photo').value = ""; 
    stopCamera();
}

function stopCamera() { if (videoStream) { videoStream.getTracks().forEach(t => t.stop()); videoStream = null; } }

// =========================================================
// UPDATE STATUS MASTER (ANTI-BUG UI)
// =========================================================
window.changeGuestStatus = function(code, newStatus) {
    try {
        const data = guestsDatabase[code]; 
        if (!data || data.status === newStatus) return;
        
        data.status = newStatus;
        if (newStatus === 'selesai' || newStatus === 'ditolak') {
            const o = new Date(); data.outTime = newStatus === 'selesai' ? `${o.getHours().toString().padStart(2, '0')}:${o.getMinutes().toString().padStart(2, '0')} WIB` : 'Ditolak';
        }

        const histBadge = document.getElementById(`hist-badge-${code}`); const histOut = document.getElementById(`hist-out-${code}`);
        if (histBadge) {
            if (newStatus === 'bertemu') { histBadge.className = "px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 w-max block mx-auto text-center"; histBadge.innerText = "Sedang Bertemu"; } 
            else if (newStatus === 'selesai') { histBadge.className = "px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 w-max block mx-auto text-center"; histBadge.innerText = "Selesai"; if (histOut) histOut.innerText = `Out: ${data.outTime}`; } 
            else if (newStatus === 'ditolak') { histBadge.className = "px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 w-max block mx-auto text-center"; histBadge.innerText = "Dibatalkan"; if (histOut) histOut.innerText = "Out: Dibatalkan"; }
        }
        
        refreshDashboardMetrics();
        if (activeDetailCode === code) { openDetailModal(code); }
        if (codeToVerify === code && currentActiveView === 'view-admin-verify') { executeVerification(code); }
    } catch(err) {
        alert("Gagal memproses data: " + err.message);
    }
}

// =========================================================
// REFRESH DASHBOARD UI
// =========================================================
function refreshDashboardMetrics() {
    let menunggu = 0, bertemu = 0, selesai = 0, ditolak = 0; let siswa = 0, dinas = 0, guru = 0, umum = 0;
    for (const code in guestsDatabase) {
        const item = guestsDatabase[code];
        if (item.status === 'menunggu') menunggu++; else if (item.status === 'bertemu') bertemu++; else if (item.status === 'selesai') selesai++; else if (item.status === 'ditolak') ditolak++;
        const k = item.kategori.toLowerCase(); if (k.includes('siswa')) siswa++; else if (k.includes('dinas')) dinas++; else if (k.includes('guru')) guru++; else umum++;
    }

    const totalTamu = menunggu + bertemu + selesai;
    updateChartData(siswa, dinas, guru, umum); 

    if(document.getElementById('stat-bertemu')) {
        document.getElementById('stat-bertemu').innerText = bertemu; document.getElementById('stat-menunggu-ratio').innerText = menunggu; document.getElementById('stat-checkout-count').innerText = selesai;
        const roomBadge = document.getElementById('room-status-badge');
        if (bertemu > 0) { roomBadge.className = "px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-rose-100 text-rose-700"; roomBadge.innerText = "Terisi"; } 
        else { roomBadge.className = "px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-slate-100 text-slate-600"; roomBadge.innerText = "Kosong"; }
        renderActiveGuestsGrid();
    }
    if(document.getElementById('stat-total-tamu')) {
        document.getElementById('stat-total-tamu').innerText = totalTamu; const donutPct = Math.min(100, Math.round((totalTamu / 20) * 100)); const donutRing = document.getElementById('donut-progress');
        if (donutRing) donutRing.setAttribute('stroke-dasharray', `${donutPct}, 100`); document.getElementById('donut-pct').innerText = `${donutPct}%`;
    }
    renderScheduleAnalytics(); renderKepsekDashboard();
}

function renderActiveGuestsGrid() {
    const grid = document.getElementById('active-guests-grid'); const emptyState = document.getElementById('empty-active-state');
    if(!grid) return; grid.innerHTML = "";
    const activeList = Object.keys(guestsDatabase).map(code => ({ code, ...guestsDatabase[code] })).filter(g => g.status === 'menunggu' || g.status === 'bertemu').reverse();
    if (activeList.length === 0) { emptyState.classList.remove('hidden'); grid.classList.add('hidden'); return; }
    emptyState.classList.add('hidden'); grid.classList.remove('hidden');

    activeList.forEach(guest => {
        const isBertemu = guest.status === 'bertemu'; const card = document.createElement('div');
        card.className = "bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between gap-3 hover:border-slate-300 transition fade-in";
        card.innerHTML = `<div class="flex items-center gap-3 min-w-0"><div class="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0"><img src="${guest.photo}" alt="Foto" class="w-full h-full object-cover"></div><div class="min-w-0"><p class="text-[9px] font-mono font-bold text-slate-400 truncate">${guest.code}</p><h5 class="font-bold text-slate-900 text-sm truncate">${guest.name}</h5><p class="text-[11px] text-slate-400 truncate">${guest.instansi}</p></div></div><div class="flex flex-col items-end gap-2 shrink-0"><span class="px-2 py-0.5 rounded-md text-[9px] font-bold ${isBertemu ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}">${isBertemu ? 'Di Ruangan' : 'Menunggu'}</span><button type="button" onclick="openDetailModal('${guest.code}')" class="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition active:scale-90 shadow-sm relative z-20 cursor-pointer"><i data-lucide="eye" class="w-3 h-3 pointer-events-none"></i></button></div>`;
        grid.appendChild(card);
    });
    lucide.createIcons();
}

function renderKepsekDashboard() {
    const grid = document.getElementById('kepsek-guests-grid'); const emptyState = document.getElementById('kepsek-empty-state');
    if(!grid) return; grid.innerHTML = "";
    const activeList = Object.keys(guestsDatabase).map(code => ({ code, ...guestsDatabase[code] })).filter(g => g.status === 'menunggu' || g.status === 'bertemu').reverse();
    if (activeList.length === 0) { emptyState.classList.remove('hidden'); grid.classList.add('hidden'); return; }
    emptyState.classList.add('hidden'); grid.classList.remove('hidden');

    activeList.forEach(guest => {
        const isBertemu = guest.status === 'bertemu'; const card = document.createElement('div');
        card.className = `p-4 md:p-6 rounded-3xl border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 transition fade-in ${isBertemu ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200/80 hover:border-slate-300'}`;
        card.innerHTML = `<div class="flex items-center gap-4 min-w-0 w-full md:w-auto"><div class="w-14 h-14 md:w-16 md:h-16 rounded-2xl overflow-hidden bg-slate-100 border-2 ${isBertemu ? 'border-emerald-300' : 'border-slate-200'} shrink-0"><img src="${guest.photo}" class="w-full h-full object-cover"></div><div class="min-w-0 flex-1"><p class="text-[10px] font-bold ${isBertemu ? 'text-emerald-600' : 'text-slate-400'} tracking-wider uppercase mb-0.5">${isBertemu ? 'Sedang Bertemu Anda' : 'Menunggu Panggilan'}</p><h5 class="font-black text-slate-900 text-base md:text-lg truncate">${guest.name}</h5><p class="text-xs text-slate-500 truncate">${guest.instansi} - ${guest.tujuan}</p></div></div><div class="flex gap-2 shrink-0 w-full md:w-auto justify-end">${!isBertemu ? `<button type="button" onclick="changeGuestStatus('${guest.code}', 'bertemu')" class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-xs font-bold transition active:scale-95 shadow-lg shadow-blue-500/25 flex-1 md:flex-none cursor-pointer">Panggil Masuk</button>` : ''}${isBertemu ? `<button type="button" onclick="changeGuestStatus('${guest.code}', 'selesai')" class="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl text-xs font-bold transition active:scale-95 shadow-lg shadow-emerald-500/25 flex-1 md:flex-none cursor-pointer"><i data-lucide="check-check" class="w-4 h-4 inline mr-1 pointer-events-none"></i>Selesaikan Pertemuan</button>` : ''}</div>`;
        grid.appendChild(card);
    });
    lucide.createIcons();
}

function renderScheduleAnalytics() {
    const tbody = document.getElementById('analytics-schedule-body'); if (!tbody) return; tbody.innerHTML = '';
    const sortedGuests = Object.values(guestsDatabase).sort((a, b) => { const dateA = new Date(a.date + 'T' + a.time.replace(' WIB', '')); const dateB = new Date(b.date + 'T' + b.time.replace(' WIB', '')); return dateB - dateA; });
    if (sortedGuests.length === 0) { tbody.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-slate-400 text-xs">Belum ada data jadwal kunjungan.</td></tr>`; return; }

    sortedGuests.forEach(data => {
        const dateObj = new Date(data.date); const hari = dateObj.toLocaleDateString('id-ID', { weekday: 'long' }); const tgl = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
        let badgeClass = "bg-amber-100 text-amber-700"; if (data.status === 'bertemu') badgeClass = "bg-blue-100 text-blue-700"; if (data.status === 'selesai') badgeClass = "bg-emerald-100 text-emerald-700"; if (data.status === 'ditolak') badgeClass = "bg-rose-100 text-rose-700";
        const jamKeluar = data.outTime !== '-' ? data.outTime : 'Selesai'; const rentangWaktu = `${data.planTime} - ${jamKeluar}`;
        const tr = document.createElement('tr'); tr.className = "border-b border-slate-100 hover:bg-slate-50/50 transition-colors";
        tr.innerHTML = `<td class="px-4 py-3"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px] uppercase border border-slate-200 shadow-sm">${hari.substring(0,3)}</div><div><p class="font-bold text-slate-900">${hari}</p><p class="text-[10px] text-slate-500">${tgl}</p></div></div></td><td class="px-4 py-3 font-mono text-rose-600 font-bold text-xs text-center"><div class="bg-rose-50 px-2 py-1 rounded-lg border border-rose-100 inline-block">${rentangWaktu}</div></td><td class="px-4 py-3"><p class="font-bold text-slate-900">${data.name}</p><p class="text-[10px] text-slate-500">${data.instansi} (${data.kategori})</p></td><td class="px-4 py-3 text-xs text-slate-600 max-w-[150px] truncate" title="${data.tujuan}">${data.tujuan}</td><td class="px-4 py-3 text-center"><span class="px-2 py-1 rounded-md text-[9px] font-bold ${badgeClass}">${data.status.toUpperCase()}</span></td>`;
        tbody.appendChild(tr);
    });
}

// =========================================================
// SUBMIT FORM TAMU
// =========================================================
window.resetGuestForm = function() {
    const submitBtn = document.getElementById('btn-submit-guest');
    if (submitBtn) { submitBtn.disabled = false; document.getElementById('submit-text').innerText = "Kirim & Buat Tiket Kunjungan"; document.getElementById('submit-icon').classList.remove('hidden'); document.getElementById('submit-spinner').classList.add('hidden'); }
    const form = document.getElementById('guest-form'); if (form) form.reset();
    const dateInp = document.getElementById('guest-date'); if (dateInp) dateInp.value = new Date().toISOString().split('T')[0];
    const timeInp = document.getElementById('guest-time');
    if (timeInp) { const now = new Date(); timeInp.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`; }
    const kelasC = document.getElementById('kelas-container'); if (kelasC) kelasC.classList.remove('is-active');

    if (typeof stopCamera === 'function') stopCamera();
    const cRes = document.getElementById('camera-result'); if (cRes) { cRes.classList.add('hidden'); cRes.src = ""; }
    const bRetake = document.getElementById('btn-retake'); if(bRetake) bRetake.classList.add('hidden');
    const cIdle = document.getElementById('camera-idle'); if(cIdle) cIdle.classList.remove('hidden');
    const cVid = document.getElementById('camera-video'); if(cVid) cVid.classList.add('hidden');
    const bCap = document.getElementById('btn-capture'); if(bCap) bCap.classList.add('hidden');
    
    // Reset Upload
    const upPhoto = document.getElementById('upload-photo'); if(upPhoto) upPhoto.value = "";
};

window.finishGuestRegistration = function() {
    resetGuestForm(); switchAppView('view-guest-form');
    const mainEl = document.querySelector('main'); if(mainEl) mainEl.scrollTo({ top: 0, behavior: 'smooth' });
};

window.submitGuestForm = function() {
    const guestName = document.getElementById('guest-name').value; const instansi = document.getElementById('guest-instansi').value; const guestDate = document.getElementById('guest-date').value; const guestPhone = document.getElementById('guest-phone').value; 
    const guestTimeInput = document.getElementById('guest-time').value; const planTimeWIB = guestTimeInput ? guestTimeInput + ' WIB' : '-';
    const kategoriSel = document.getElementById('kategori-select'); const kategori = kategoriSel.options[kategoriSel.selectedIndex].text;
    let kelas = document.getElementById('input-kelas').value; if (kelas && kategoriSel.value === 'siswa') kelas = " - " + kelas; else kelas = "";
    const tujuan = document.getElementById('guest-tujuan').value;
    const photoSrc = cameraResult.src || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400"><rect width="300" height="400" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%2394a3b8">Tanpa Foto</text></svg>';
    const dateObj = new Date(guestDate); const displayDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;

    const newTimeParts = guestTimeInput.split(':'); const newTotalMins = parseInt(newTimeParts[0]) * 60 + parseInt(newTimeParts[1]); let conflictData = null;
    for (const code in guestsDatabase) {
        const data = guestsDatabase[code];
        if (data.date === guestDate && data.status !== 'selesai' && data.status !== 'ditolak') {
            const existParts = data.planTime.replace(' WIB','').split(':'); const existTotalMins = parseInt(existParts[0]) * 60 + parseInt(existParts[1]);
            if (Math.abs(newTotalMins - existTotalMins) < 120) {
                let nextMins = existTotalMins + 120; let nH = Math.floor(nextMins / 60); let nM = nextMins % 60; if (nH > 23) { nH = 23; nM = 59; } 
                conflictData = { name: data.name, existTime: data.planTime, suggestTime: `${nH.toString().padStart(2,'0')}:${nM.toString().padStart(2,'0')}` }; break; 
            }
        }
    }

    if (conflictData) {
        document.getElementById('conflict-date-text').innerText = displayDate; document.getElementById('conflict-time-text').innerText = conflictData.existTime; document.getElementById('conflict-name-text').innerText = conflictData.name; document.getElementById('conflict-suggest-time').innerText = conflictData.suggestTime + ' WIB'; document.getElementById('btn-accept-suggestion').dataset.suggestTime = conflictData.suggestTime;
        document.getElementById('conflict-modal').classList.remove('hidden'); setTimeout(() => { document.getElementById('conflict-card').classList.replace('scale-95', 'scale-100'); document.getElementById('conflict-card').classList.replace('opacity-0', 'opacity-100'); }, 10);
        return;
    }

    const now = new Date(); const timeStrWIB = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0') + ' WIB';
    const code = `SMAN1-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    guestsDatabase[code] = { name: guestName, phone: guestPhone, instansi: instansi, kategori: kategori + kelas, tujuan: tujuan, photo: photoSrc, date: guestDate, displayDate: displayDate, planTime: planTimeWIB, time: timeStrWIB, outTime: '-', status: 'menunggu' };

    const submitBtn = document.getElementById('btn-submit-guest'); if(submitBtn) submitBtn.disabled = true; 
    document.getElementById('submit-text').innerText = "Memproses Tiket..."; document.getElementById('submit-icon').classList.add('hidden'); document.getElementById('submit-spinner').classList.remove('hidden');

    setTimeout(() => {
        try {
            document.getElementById('ticket-name').innerText = guestName; document.getElementById('ticket-date-display').innerText = `${displayDate} | Jam ${planTimeWIB}`; document.getElementById('ticket-code').innerText = code;
            switchAppView('view-success'); appendHistoryRow(code); refreshDashboardMetrics();
            silentAddNotification("Tamu Baru Terdaftar!", `${guestName} dari ${instansi} telah mendaftar.`);
        } catch (error) {} finally { resetGuestForm(); }
    }, 1200);
};

document.getElementById('btn-accept-suggestion')?.addEventListener('click', function() { document.getElementById('guest-time').value = this.dataset.suggestTime; document.getElementById('conflict-card').classList.replace('scale-100', 'scale-95'); document.getElementById('conflict-card').classList.replace('opacity-100', 'opacity-0'); setTimeout(() => { document.getElementById('conflict-modal').classList.add('hidden'); document.getElementById('btn-submit-guest').click(); }, 300); });
document.getElementById('btn-change-schedule')?.addEventListener('click', () => { document.getElementById('conflict-card').classList.replace('scale-100', 'scale-95'); document.getElementById('conflict-card').classList.replace('opacity-100', 'opacity-0'); setTimeout(() => { document.getElementById('conflict-modal').classList.add('hidden'); document.getElementById('guest-time').focus(); }, 300); });

// =========================================================
// CEK TIKET, VERIFIKASI & MODAL PROFIL
// =========================================================
function appendHistoryRow(code) {
    const data = guestsDatabase[code]; const tbody = document.getElementById('history-table-body'); if (!tbody) return;
    const tr = document.createElement('tr'); tr.id = `hist-row-${code}`; tr.className = "hover:bg-slate-50/70 transition fade-in";
    tr.innerHTML = `<td class="px-5 py-3.5"><p class="text-[10px] font-mono text-slate-400 font-bold">${code}</p><p class="font-bold text-slate-900">${data.name}</p><p class="text-[11px] text-slate-400">${data.instansi}</p></td><td class="px-5 py-3.5 text-slate-600">${data.displayDate} <br><span class="text-[10px] text-slate-400 font-mono">In: ${data.time} | <span id="hist-out-${code}">Out: -</span></span></td><td class="px-5 py-3.5"><span id="hist-badge-${code}" class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 w-max block mx-auto text-center">Menunggu</span></td><td class="px-5 py-3.5 text-center"><button type="button" onclick="openDetailModal('${code}')" class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition active:scale-90 shadow-sm relative z-20 cursor-pointer"><i data-lucide="user" class="w-4 h-4 pointer-events-none"></i></button></td>`;
    tbody.prepend(tr); lucide.createIcons();
}

window.openDetailModal = function (code) {
    const data = guestsDatabase[code]; if (!data) return; activeDetailCode = code;
    document.getElementById('detail-photo').src = data.photo; document.getElementById('detail-code').innerText = code; document.getElementById('detail-datetime').innerText = `${data.displayDate} - ${data.planTime}`; document.getElementById('detail-outtime').innerText = data.outTime; document.getElementById('detail-name').innerText = `${data.name} (${data.phone})`; document.getElementById('detail-instansi').innerText = `${data.instansi} (${data.kategori})`; document.getElementById('detail-tujuan').innerText = data.tujuan;
    const badge = document.getElementById('detail-status-badge'); const waitActions = document.getElementById('mdl-waiting-actions'); const btnSelesai = document.getElementById('btn-mdl-selesai');
    if (data.status === 'menunggu') { badge.className = "px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700"; badge.innerText = "Menunggu Persetujuan"; waitActions.classList.remove('hidden'); btnSelesai.classList.add('hidden'); } 
    else if (data.status === 'bertemu') { badge.className = "px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700"; badge.innerText = "Sedang Bertemu Kepsek"; waitActions.classList.add('hidden'); btnSelesai.classList.remove('hidden'); } 
    else if (data.status === 'selesai') { badge.className = "px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700"; badge.innerText = "Selesai (Pulang)"; waitActions.classList.add('hidden'); btnSelesai.classList.add('hidden'); } 
    else if (data.status === 'ditolak') { badge.className = "px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700"; badge.innerText = "Dibatalkan / Reschedule"; waitActions.classList.add('hidden'); btnSelesai.classList.add('hidden'); }
    const modal = document.getElementById('detail-modal'); const card = document.getElementById('detail-card');
    modal.classList.remove('hidden'); setTimeout(() => { card.classList.replace('scale-95', 'scale-100'); card.classList.replace('opacity-0', 'opacity-100'); }, 10);
};

window.closeDetailModal = function () {
    const modal = document.getElementById('detail-modal'); const card = document.getElementById('detail-card');
    card.classList.replace('scale-100', 'scale-95'); card.classList.replace('opacity-100', 'opacity-0');
    setTimeout(() => { modal.classList.add('hidden'); activeDetailCode = null; }, 250);
};

window.updateStatusFromModal = function (newStatus) { if (activeDetailCode) { changeGuestStatus(activeDetailCode, newStatus); } };

window.doTrackTicket = function() {
    const code = document.getElementById('track-input').value.trim().toUpperCase(); if (!code) return;
    const resContainer = document.getElementById('track-result-container'); resContainer.classList.remove('hidden');
    if (guestsDatabase[code]) {
        const data = guestsDatabase[code];
        document.getElementById('track-not-found').classList.add('hidden'); document.getElementById('track-found').classList.remove('hidden');
        document.getElementById('track-res-name').innerText = data.name; document.getElementById('track-res-date').innerText = `${data.displayDate} | Tiba: ${data.planTime}`;
        const statusEl = document.getElementById('track-res-status'); const dotEl = document.getElementById('track-res-dot'); const barEl = document.getElementById('track-color-bar');

        if (data.status === 'menunggu') { statusEl.innerText = "Menunggu Persetujuan"; statusEl.className = "text-sm font-black text-amber-600"; dotEl.className = "w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"; barEl.className = "absolute top-0 right-0 w-2 h-full bg-amber-500"; } 
        else if (data.status === 'bertemu') { statusEl.innerText = "Sedang Bertemu Kepsek"; statusEl.className = "text-sm font-black text-blue-600"; dotEl.className = "w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"; barEl.className = "absolute top-0 right-0 w-2 h-full bg-blue-500"; } 
        else if (data.status === 'selesai') { statusEl.innerText = "Selesai (Sudah Keluar)"; statusEl.className = "text-sm font-black text-emerald-600"; dotEl.className = "w-2.5 h-2.5 rounded-full bg-emerald-500"; barEl.className = "absolute top-0 right-0 w-2 h-full bg-emerald-500"; } 
        else if (data.status === 'ditolak') { statusEl.innerText = "Dibatalkan / Reschedule"; statusEl.className = "text-sm font-black text-rose-600"; dotEl.className = "w-2.5 h-2.5 rounded-full bg-rose-500"; barEl.className = "absolute top-0 right-0 w-2 h-full bg-rose-500"; }
    } else { document.getElementById('track-found').classList.add('hidden'); document.getElementById('track-not-found').classList.remove('hidden'); }
};

window.executeVerification = function(code) {
    if (!code) return; const data = guestsDatabase[code]; 
    const notFound = document.getElementById('verify-not-found'); const resultCard = document.getElementById('verify-result-card');
    
    if (data) {
        codeToVerify = code; notFound.classList.add('hidden'); resultCard.classList.remove('hidden');
        document.getElementById('v-res-photo').src = data.photo; document.getElementById('v-res-code').innerText = code; document.getElementById('v-res-name').innerText = data.name; document.getElementById('v-res-instansi').innerText = data.instansi; document.getElementById('v-res-kategori').innerText = data.kategori; document.getElementById('v-res-date').innerText = data.displayDate; document.getElementById('v-res-time').innerText = data.planTime; document.getElementById('v-res-tujuan').innerText = data.tujuan;
        
        const badge = document.getElementById('v-res-status-badge'); const footer = document.getElementById('v-res-action-footer'); 
        const waitActions = document.getElementById('v-res-waiting-actions'); const meetActions = document.getElementById('v-res-bertemu-actions');
        const msgDone = document.getElementById('v-res-msg-done'); const msgStatus = document.getElementById('v-res-msg-status');
        
        if (data.status === 'menunggu') { 
            badge.className = "px-3 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700"; badge.innerText = "Menunggu Persetujuan"; 
            footer.classList.remove('hidden'); footer.classList.add('flex'); msgDone.classList.add('hidden'); waitActions.classList.remove('hidden'); meetActions.classList.add('hidden');
        } 
        else if (data.status === 'bertemu') { 
            badge.className = "px-3 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700"; badge.innerText = "Sedang Bertemu"; 
            footer.classList.remove('hidden'); footer.classList.add('flex'); msgDone.classList.add('hidden'); waitActions.classList.add('hidden'); meetActions.classList.remove('hidden');
        } 
        else {
            if (data.status === 'selesai') { badge.className = "px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700"; badge.innerText = "Selesai (Pulang)"; msgStatus.innerText = "Selesai (Sudah Keluar)"; msgStatus.className = "text-emerald-600"; } 
            else if (data.status === 'ditolak') { badge.className = "px-3 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700"; badge.innerText = "Dibatalkan"; msgStatus.innerText = "Dibatalkan / Reschedule"; msgStatus.className = "text-rose-600"; }
            footer.classList.add('hidden'); footer.classList.remove('flex'); msgDone.classList.remove('hidden'); waitActions.classList.add('hidden'); meetActions.classList.add('hidden');
        }
    } else { resultCard.classList.add('hidden'); notFound.classList.remove('hidden'); }
};

window.doAdminVerify = function() { const code = document.getElementById('admin-verify-input').value.trim().toUpperCase(); executeVerification(code); };
window.doQuickVerify = function() { const code = document.getElementById('quick-verify-input').value.trim().toUpperCase(); if (!code) return; switchAppView('view-admin-verify'); document.getElementById('admin-verify-input').value = code; executeVerification(code); };
window.approveVerification = function() { try { if (codeToVerify) { changeGuestStatus(codeToVerify, 'bertemu'); } } catch(e) {} };
window.finishVerification = function() { try { if (codeToVerify) { changeGuestStatus(codeToVerify, 'selesai'); } } catch(e) {} };

// =========================================================
// EXPORT CSV MURNI (TANPA PDF SAMA SEKALI)
// =========================================================
window.exportToCSV = function() {
    let csv = "Kode Tiket,Tanggal Pertemuan,Rencana Jam Tiba,Nama Lengkap,Asal Instansi,Kategori,Keperluan,Status Akhir,Waktu Form Masuk,Waktu Keluar\n";
    const sortedGuests = Object.values(guestsDatabase).sort((a, b) => new Date(a.date) - new Date(b.date));
    sortedGuests.forEach(d => {
        const code = Object.keys(guestsDatabase).find(k => guestsDatabase[k] === d);
        const name = `"${d.name.replace(/"/g, '""')}"`; const instansi = `"${d.instansi.replace(/"/g, '""')}"`; const tujuan = `"${d.tujuan.replace(/"/g, '""')}"`;
        csv += `${code},${d.displayDate},${d.planTime},${name},${instansi},${d.kategori},${tujuan},${d.status.toUpperCase()},${d.time},${d.outTime}\n`;
    });
    const blob = new Blob(["\uFEFF"+csv], { type: 'text/csv;charset=utf-8;' }); const link = document.createElement("a"); const url = URL.createObjectURL(blob);
    link.setAttribute("href", url); link.setAttribute("download", `Rekap_Tamu_SMAN1_${new Date().getTime()}.csv`); link.style.visibility = 'hidden'; document.body.appendChild(link); link.click(); document.body.removeChild(link);
};
