lucide.createIcons();

const guestsDatabase = {};
let isAdminLoggedIn = false;

// SET DEFAULT TANGGAL FORM
const dateInput = document.getElementById('guest-date');
if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

// =========================================================
// ROUTER & NAVIGATION ENGINE
// =========================================================
function switchAppView(targetId) {
    document.querySelectorAll('.app-view').forEach(view => {
        view.classList.remove('block', 'flex'); view.classList.add('hidden');
    });

    const target = document.getElementById(targetId);
    if (!target) return;
    target.classList.remove('hidden');

    if (['view-success', 'view-track', 'view-login'].includes(targetId)) {
        target.classList.add('flex');
    } else {
        target.classList.add('block');
    }

    // Sinkronisasi Active State Desktop Sidebar
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
        const isMatch = btn.getAttribute('data-target') === targetId;
        const ind = btn.querySelector('.nav-indicator');
        if (isMatch) {
            btn.classList.add('text-rose-600'); btn.classList.remove('text-slate-400', 'hover:text-slate-700');
            btn.querySelector('span.tracking-tight').classList.replace('font-semibold', 'font-bold');
            if (ind) ind.classList.remove('hidden');
        } else {
            btn.classList.remove('text-rose-600'); btn.classList.add('text-slate-400', 'hover:text-slate-700');
            btn.querySelector('span.tracking-tight').classList.replace('font-bold', 'font-semibold');
            if (ind) ind.classList.add('hidden');
        }
    });

    // Sinkronisasi Mobile Bottom Nav
    document.querySelectorAll('.m-nav-btn').forEach(btn => {
        if(btn.getAttribute('data-target') === targetId) {
            btn.classList.add('text-rose-600'); btn.classList.remove('text-slate-400');
            btn.querySelector('span').classList.replace('font-medium', 'font-bold');
        } else {
            btn.classList.remove('text-rose-600'); btn.classList.add('text-slate-400');
            btn.querySelector('span').classList.replace('font-bold', 'font-medium');
        }
    });
}

function bindNavEvents() {
    document.querySelectorAll('.nav-tab-btn, .m-nav-btn').forEach(btn => {
        btn.addEventListener('click', function () { switchAppView(this.getAttribute('data-target')); });
    });
}

// Render Menu Mobile Bawah Berdasarkan Mode
function renderMobileNav() {
    const nav = document.getElementById('mobile-bottom-nav');
    if (!isAdminLoggedIn) {
        nav.innerHTML = `
            <button class="m-nav-btn flex-1 flex flex-col items-center justify-center h-full text-rose-600 transition" data-target="view-guest-form"><i data-lucide="user-plus" class="w-5 h-5 mb-0.5"></i><span class="text-[9px] font-bold">Buku Tamu</span></button>
            <button class="m-nav-btn flex-1 flex flex-col items-center justify-center h-full text-slate-400 transition" data-target="view-track"><i data-lucide="search" class="w-5 h-5 mb-0.5"></i><span class="text-[9px] font-medium">Cek Tiket</span></button>
            <button class="flex-1 flex flex-col items-center justify-center h-full text-slate-400 transition" onclick="switchAppView('view-login')"><i data-lucide="lock" class="w-5 h-5 mb-0.5"></i><span class="text-[9px] font-medium">Login TU</span></button>
        `;
    } else {
        nav.innerHTML = `
            <button class="m-nav-btn flex-1 flex flex-col items-center justify-center h-full text-rose-600 transition" data-target="view-admin-overview"><i data-lucide="home" class="w-5 h-5 mb-0.5"></i><span class="text-[9px] font-bold">Beranda</span></button>
            <button class="m-nav-btn flex-1 flex flex-col items-center justify-center h-full text-slate-400 transition" data-target="view-admin-verify"><i data-lucide="scan" class="w-5 h-5 mb-0.5"></i><span class="text-[9px] font-medium">Verifikasi</span></button>
            <button class="m-nav-btn flex-1 flex flex-col items-center justify-center h-full text-slate-400 transition" data-target="view-admin-history"><i data-lucide="book-open" class="w-5 h-5 mb-0.5"></i><span class="text-[9px] font-medium">Riwayat</span></button>
            <button class="flex-1 flex flex-col items-center justify-center h-full text-red-500 transition" onclick="processLogout()"><i data-lucide="log-out" class="w-5 h-5 mb-0.5"></i><span class="text-[9px] font-medium">Keluar</span></button>
        `;
    }
    lucide.createIcons();
    bindNavEvents();
}

// Inisialisasi Awal
renderMobileNav();
bindNavEvents();

// =========================================================
// LOGIN & LOGOUT LOGIC
// =========================================================
document.getElementById('login-form')?.addEventListener('submit', function(e) {
    e.preventDefault(); 
    document.getElementById('btn-do-login').disabled = true;
    document.getElementById('login-text').classList.add('hidden');
    document.getElementById('login-spinner').classList.remove('hidden');

    setTimeout(() => {
        document.getElementById('btn-do-login').disabled = false;
        document.getElementById('login-text').classList.remove('hidden');
        document.getElementById('login-spinner').classList.add('hidden');

        isAdminLoggedIn = true;
        
        // Ubah UI Sidebar Desktop
        document.getElementById('guest-nav-group').classList.add('hidden');
        document.getElementById('admin-nav-group').classList.remove('hidden');
        document.getElementById('admin-nav-group').classList.add('flex');
        
        const btnAction = document.getElementById('btn-sidebar-action');
        btnAction.classList.replace('bg-rose-500', 'bg-slate-800');
        btnAction.classList.replace('hover:bg-rose-600', 'hover:bg-slate-700');
        btnAction.classList.replace('shadow-rose-500/25', 'shadow-slate-800/25');
        document.getElementById('sidebar-icon').setAttribute('data-lucide', 'log-out');
        document.getElementById('sidebar-text').innerText = "Keluar";
        lucide.createIcons();

        renderMobileNav();
        switchAppView('view-admin-overview');
    }, 800);
});

// Tombol Merah Kiri Bawah (Bisa Login, Bisa Logout)
document.getElementById('btn-sidebar-action')?.addEventListener('click', () => {
    if(!isAdminLoggedIn) { switchAppView('view-login'); } 
    else { processLogout(); }
});

document.getElementById('btn-quick-scan')?.addEventListener('click', () => { switchAppView('view-admin-verify'); });

window.processLogout = function() {
    isAdminLoggedIn = false;
    
    document.getElementById('admin-nav-group').classList.add('hidden');
    document.getElementById('admin-nav-group').classList.remove('flex');
    document.getElementById('guest-nav-group').classList.remove('hidden');
    document.getElementById('guest-nav-group').classList.add('flex');

    const btnAction = document.getElementById('btn-sidebar-action');
    btnAction.classList.replace('bg-slate-800', 'bg-rose-500');
    btnAction.classList.replace('hover:bg-slate-700', 'hover:bg-rose-600');
    btnAction.classList.replace('shadow-slate-800/25', 'shadow-rose-500/25');
    document.getElementById('sidebar-icon').setAttribute('data-lucide', 'lock');
    document.getElementById('sidebar-text').innerText = "Login";
    lucide.createIcons();

    renderMobileNav();
    switchAppView('view-guest-form');
}

// =========================================================
// FITUR: KAMERA WEBRTC & FORM ANIMASI
// =========================================================
document.getElementById('kategori-select')?.addEventListener('change', function () {
    const container = document.getElementById('kelas-container');
    if (this.value === 'siswa') container.classList.add('is-active');
    else container.classList.remove('is-active');
});

const cameraVideo = document.getElementById('camera-video');
const cameraCanvas = document.getElementById('camera-canvas');
const cameraResult = document.getElementById('camera-result');
let videoStream = null;

async function startCamera() {
    try {
        videoStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        cameraVideo.srcObject = videoStream;
        document.getElementById('camera-idle').classList.add('hidden');
        cameraVideo.classList.remove('hidden');
        document.getElementById('btn-capture').classList.remove('hidden');
    } catch (err) { alert("Akses kamera tidak diizinkan."); }
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

function retakePhoto() {
    cameraResult.classList.add('hidden'); document.getElementById('btn-retake').classList.add('hidden'); startCamera();
}
function stopCamera() {
    if (videoStream) { videoStream.getTracks().forEach(t => t.stop()); videoStream = null; }
}

// =========================================================
// DASHBOARD STATISTIK & RENDER TAMU AKTIF (KATSUDOTO STYLE)
// =========================================================
function refreshDashboardMetrics() {
    let menunggu = 0, bertemu = 0, selesai = 0, ditolak = 0;
    let siswa = 0, dinas = 0, umum = 0;

    for (const code in guestsDatabase) {
        const item = guestsDatabase[code];
        if (item.status === 'menunggu') menunggu++;
        else if (item.status === 'bertemu') bertemu++;
        else if (item.status === 'selesai') selesai++;
        else if (item.status === 'ditolak') ditolak++;

        if (item.kategori.toLowerCase().includes('siswa')) siswa++;
        else if (item.kategori.toLowerCase().includes('dinas')) dinas++;
        else umum++;
    }

    const totalTamu = menunggu + bertemu + selesai;

    if(document.getElementById('stat-bertemu')) {
        document.getElementById('stat-bertemu').innerText = bertemu;
        document.getElementById('stat-total-tamu').innerText = totalTamu;
        document.getElementById('stat-menunggu-ratio').innerText = menunggu;
        document.getElementById('stat-checkout-count').innerText = selesai;
        document.getElementById('stat-ditolak').innerText = ditolak;

        document.getElementById('cat-siswa').innerText = siswa;
        document.getElementById('cat-dinas').innerText = dinas;
        document.getElementById('cat-umum').innerText = umum;

        const baseTotal = totalTamu === 0 ? 1 : totalTamu;
        document.getElementById('bar-checkin').style.width = `${Math.round((menunggu / baseTotal) * 100)}%`;
        document.getElementById('bar-checkout').style.width = `${Math.round((selesai / baseTotal) * 100)}%`;

        const donutPct = Math.min(100, Math.round((totalTamu / 20) * 100)); // Anggap kuota 20
        const donutRing = document.getElementById('donut-progress');
        if (donutRing) donutRing.setAttribute('stroke-dasharray', `${donutPct}, 100`);
        document.getElementById('donut-pct').innerText = `${donutPct}%`;

        const roomBadge = document.getElementById('room-status-badge');
        document.getElementById('seat-active-text').innerText = `${bertemu} Tamu`;
        document.getElementById('seat-waiting-text').innerText = `${menunggu} Tamu`;

        if (bertemu > 0) {
            roomBadge.className = "px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-rose-100 text-rose-700";
            roomBadge.innerText = "Terisi";
        } else {
            roomBadge.className = "px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-slate-100 text-slate-600";
            roomBadge.innerText = "Kosong";
        }
        renderActiveGuestsGrid();
    }
}

function renderActiveGuestsGrid() {
    const grid = document.getElementById('active-guests-grid');
    const emptyState = document.getElementById('empty-active-state');
    if(!grid) return;
    grid.innerHTML = "";

    const activeList = Object.keys(guestsDatabase).map(code => ({ code, ...guestsDatabase[code] })).filter(g => g.status === 'menunggu' || g.status === 'bertemu').reverse();

    if (activeList.length === 0) {
        emptyState.classList.remove('hidden'); grid.classList.add('hidden'); return;
    }

    emptyState.classList.add('hidden'); grid.classList.remove('hidden');

    activeList.forEach(guest => {
        const isBertemu = guest.status === 'bertemu';
        const card = document.createElement('div');
        card.className = "bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between gap-3 hover:border-slate-300 transition";
        card.innerHTML = `
            <div class="flex items-center gap-3 min-w-0">
                <div class="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0"><img src="${guest.photo}" alt="Foto" class="w-full h-full object-cover"></div>
                <div class="min-w-0"><p class="text-[9px] font-mono font-bold text-slate-400 truncate">${guest.code}</p><h5 class="font-bold text-slate-900 text-sm truncate">${guest.name}</h5><p class="text-[11px] text-slate-400 truncate">${guest.instansi}</p></div>
            </div>
            <div class="flex flex-col items-end gap-2 shrink-0">
                <span class="px-2 py-0.5 rounded-md text-[9px] font-bold ${isBertemu ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}">${isBertemu ? 'Di Ruangan' : 'Menunggu'}</span>
                <button onclick="openDetailModal('${guest.code}')" class="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition">Cek Detail</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// =========================================================
// SUBMIT BUKU TAMU & DETEKSI KONFLIK
// =========================================================
document.getElementById('guest-form')?.addEventListener('submit', function (e) {
    e.preventDefault();

    const guestName = document.getElementById('guest-name').value;
    const instansi = document.getElementById('guest-instansi').value;
    const guestDate = document.getElementById('guest-date').value;
    const kategoriSel = document.getElementById('kategori-select');
    const kategori = kategoriSel.options[kategoriSel.selectedIndex].text;
    let kelas = document.getElementById('input-kelas').value;
    if (kelas && kategoriSel.value === 'siswa') kelas = " - " + kelas; else kelas = "";
    const tujuan = document.getElementById('guest-tujuan').value;
    const photoSrc = cameraResult.src || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400"><rect width="300" height="400" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%2394a3b8">Tanpa Foto</text></svg>';

    const dateObj = new Date(guestDate);
    const displayDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;

    // Cek Bentrok
    let conflictGuestName = null;
    for (const code in guestsDatabase) {
        if (guestsDatabase[code].date === guestDate && guestsDatabase[code].status !== 'selesai' && guestsDatabase[code].status !== 'ditolak') {
            conflictGuestName = guestsDatabase[code].name; break;
        }
    }

    if (conflictGuestName) {
        document.getElementById('conflict-date-text').innerText = displayDate;
        document.getElementById('conflict-name-text').innerText = conflictGuestName;
        document.getElementById('conflict-modal').classList.remove('hidden');
        setTimeout(() => { document.getElementById('conflict-card').classList.replace('scale-95', 'scale-100'); document.getElementById('conflict-card').classList.replace('opacity-0', 'opacity-100'); }, 10);
        return;
    }

    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const code = `SMAN1-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    guestsDatabase[code] = { name: guestName, instansi: instansi, kategori: kategori + kelas, tujuan: tujuan, photo: photoSrc, date: guestDate, displayDate: displayDate, time: timeStr, outTime: '-', status: 'menunggu' };

    document.getElementById('btn-submit-guest').disabled = true;
    document.getElementById('submit-text').innerText = "Memproses Tiket...";
    document.getElementById('submit-icon').classList.add('hidden');
    document.getElementById('submit-spinner').classList.remove('hidden');

    setTimeout(() => {
        document.getElementById('ticket-name').innerText = guestName;
        document.getElementById('ticket-date-display').innerText = displayDate;
        document.getElementById('ticket-code').innerText = code;
        switchAppView('view-success');

        appendHistoryRow(code);
        refreshDashboardMetrics();

        // Reset
        document.getElementById('btn-submit-guest').disabled = false;
        document.getElementById('submit-text').innerText = "Kirim & Buat Tiket Kunjungan";
        document.getElementById('submit-icon').classList.remove('hidden');
        document.getElementById('submit-spinner').classList.add('hidden');
        document.getElementById('guest-form').reset();
        document.getElementById('guest-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('kelas-container').classList.remove('is-active');
        if (videoStream) stopCamera();
        cameraResult.classList.add('hidden'); document.getElementById('btn-retake').classList.add('hidden');
        document.getElementById('camera-idle').classList.remove('hidden'); cameraVideo.classList.add('hidden'); document.getElementById('btn-capture').classList.add('hidden');
    }, 1200);
});

document.getElementById('btn-change-schedule')?.addEventListener('click', () => {
    document.getElementById('conflict-card').classList.replace('scale-100', 'scale-95'); document.getElementById('conflict-card').classList.replace('opacity-100', 'opacity-0');
    setTimeout(() => { document.getElementById('conflict-modal').classList.add('hidden'); document.getElementById('guest-date').focus(); }, 300);
});

document.getElementById('btn-next-guest')?.addEventListener('click', () => { switchAppView('view-guest-form'); });

// =========================================================
// FUNGSI RIWAYAT & PERUBAHAN STATUS
// =========================================================
function appendHistoryRow(code) {
    const data = guestsDatabase[code];
    const tbody = document.getElementById('history-table-body');
    if (!tbody) return;

    const tr = document.createElement('tr');
    tr.id = `hist-row-${code}`;
    tr.className = "hover:bg-slate-50/70 transition";
    tr.innerHTML = `
        <td class="px-5 py-3.5"><p class="text-[10px] font-mono text-slate-400 font-bold">${code}</p><p class="font-bold text-slate-900">${data.name}</p><p class="text-[11px] text-slate-400">${data.instansi}</p></td>
        <td class="px-5 py-3.5 text-slate-600">${data.displayDate} <br><span class="text-[10px] text-slate-400 font-mono">In: ${data.time} | <span id="hist-out-${code}">Out: -</span></span></td>
        <td class="px-5 py-3.5"><span id="hist-badge-${code}" class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">Menunggu</span></td>
        <td class="px-5 py-3.5 text-center"><button onclick="openDetailModal('${code}')" class="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition">Profil</button></td>
    `;
    tbody.prepend(tr);
}

function changeGuestStatus(code, newStatus) {
    const data = guestsDatabase[code];
    if (!data || data.status === newStatus) return;
    data.status = newStatus;

    if (newStatus === 'selesai' || newStatus === 'ditolak') {
        const o = new Date();
        data.outTime = newStatus === 'selesai' ? `${o.getHours().toString().padStart(2, '0')}:${o.getMinutes().toString().padStart(2, '0')}` : 'Ditolak';
    }

    const histBadge = document.getElementById(`hist-badge-${code}`);
    const histOut = document.getElementById(`hist-out-${code}`);
    if (histBadge) {
        if (newStatus === 'bertemu') { histBadge.className = "px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700"; histBadge.innerText = "Sedang Bertemu"; } 
        else if (newStatus === 'selesai') { histBadge.className = "px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700"; histBadge.innerText = "Selesai"; if (histOut) histOut.innerText = `Out: ${data.outTime}`; } 
        else if (newStatus === 'ditolak') { histBadge.className = "px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700"; histBadge.innerText = "Ditolak"; if (histOut) histOut.innerText = "Out: Ditolak"; }
    }

    refreshDashboardMetrics();

    if (activeDetailCode === code) {
        updateModalBadgeUI(newStatus);
        document.getElementById('detail-outtime').innerText = data.outTime;
        if (newStatus === 'selesai' || newStatus === 'ditolak') document.getElementById('modal-action-footer').classList.add('hidden');
    }
}

// =========================================================
// MODAL PROFIL DETAIL
// =========================================================
let activeDetailCode = null;
window.openDetailModal = function (code) {
    const data = guestsDatabase[code];
    if (!data) return;
    activeDetailCode = code;

    document.getElementById('detail-photo').src = data.photo;
    document.getElementById('detail-code').innerText = code;
    document.getElementById('detail-datetime').innerText = `${data.displayDate} - ${data.time}`;
    document.getElementById('detail-outtime').innerText = data.outTime;
    document.getElementById('detail-name').innerText = data.name;
    document.getElementById('detail-instansi').innerText = `${data.instansi} (${data.kategori})`;
    document.getElementById('detail-tujuan').innerText = data.tujuan;

    updateModalBadgeUI(data.status);

    const actionFooter = document.getElementById('modal-action-footer');
    if (data.status === 'selesai' || data.status === 'ditolak' || data.status === 'menunggu') actionFooter.classList.add('hidden'); // Khusus Overview (Hanya bisa klik selesai jika sedang bertemu)
    else actionFooter.classList.remove('hidden');

    const modal = document.getElementById('detail-modal');
    const card = document.getElementById('detail-card');
    modal.classList.remove('hidden');
    setTimeout(() => { card.classList.replace('scale-95', 'scale-100'); card.classList.replace('opacity-0', 'opacity-100'); }, 10);
};

window.closeDetailModal = function () {
    const modal = document.getElementById('detail-modal');
    const card = document.getElementById('detail-card');
    card.classList.replace('scale-100', 'scale-95'); card.classList.replace('opacity-100', 'opacity-0');
    setTimeout(() => { modal.classList.add('hidden'); activeDetailCode = null; }, 250);
};

window.updateStatusFromModal = function (newStatus) { if (activeDetailCode) changeGuestStatus(activeDetailCode, newStatus); };

function updateModalBadgeUI(status) {
    const badge = document.getElementById('detail-status-badge');
    if (status === 'menunggu') { badge.className = "px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700"; badge.innerText = "Menunggu"; } 
    else if (status === 'bertemu') { badge.className = "px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700"; badge.innerText = "Sedang Bertemu"; } 
    else if (status === 'selesai') { badge.className = "px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700"; badge.innerText = "Selesai"; } 
    else if (status === 'ditolak') { badge.className = "px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700"; badge.innerText = "Ditolak"; }
}

// =========================================================
// CEK TIKET (TAMU) & VERIFIKASI APPROVAL (ADMIN)
// =========================================================
document.getElementById('btn-do-track')?.addEventListener('click', () => {
    const code = document.getElementById('track-input').value.trim().toUpperCase();
    if (!code) return;
    const resContainer = document.getElementById('track-result-container');
    resContainer.classList.remove('hidden');
    if (guestsDatabase[code]) {
        const data = guestsDatabase[code];
        document.getElementById('track-not-found').classList.add('hidden');
        document.getElementById('track-found').classList.remove('hidden');
        document.getElementById('track-res-name').innerText = data.name;
        document.getElementById('track-res-date').innerText = data.displayDate;
        const statusEl = document.getElementById('track-res-status');
        const dotEl = document.getElementById('track-res-dot');
        const barEl = document.getElementById('track-color-bar');

        if (data.status === 'menunggu') { statusEl.innerText = "Menunggu Persetujuan"; statusEl.className = "text-sm font-black text-amber-600"; dotEl.className = "w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"; barEl.className = "absolute top-0 right-0 w-2 h-full bg-amber-500"; } 
        else if (data.status === 'bertemu') { statusEl.innerText = "Sedang Bertemu Kepsek"; statusEl.className = "text-sm font-black text-blue-600"; dotEl.className = "w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"; barEl.className = "absolute top-0 right-0 w-2 h-full bg-blue-500"; } 
        else if (data.status === 'selesai') { statusEl.innerText = "Selesai (Sudah Keluar)"; statusEl.className = "text-sm font-black text-emerald-600"; dotEl.className = "w-2.5 h-2.5 rounded-full bg-emerald-500"; barEl.className = "absolute top-0 right-0 w-2 h-full bg-emerald-500"; } 
        else if (data.status === 'ditolak') { statusEl.innerText = "Kunjungan Ditolak"; statusEl.className = "text-sm font-black text-rose-600"; dotEl.className = "w-2.5 h-2.5 rounded-full bg-rose-500"; barEl.className = "absolute top-0 right-0 w-2 h-full bg-rose-500"; }
    } else {
        document.getElementById('track-found').classList.add('hidden'); document.getElementById('track-not-found').classList.remove('hidden');
    }
});

let codeToVerify = null;
function executeVerification(code) {
    if (!code) return;
    const data = guestsDatabase[code];
    if (data) {
        codeToVerify = code;
        document.getElementById('verify-not-found').classList.add('hidden');
        document.getElementById('verify-result-card').classList.remove('hidden');

        document.getElementById('v-res-photo').src = data.photo;
        document.getElementById('v-res-code').innerText = code;
        document.getElementById('v-res-name').innerText = data.name;
        document.getElementById('v-res-instansi').innerText = data.instansi;
        document.getElementById('v-res-kategori').innerText = data.kategori;
        document.getElementById('v-res-date').innerText = data.displayDate;
        document.getElementById('v-res-time').innerText = data.time;
        document.getElementById('v-res-tujuan').innerText = data.tujuan;

        const badge = document.getElementById('v-res-status-badge');
        const footer = document.getElementById('v-res-action-footer');
        const msgDone = document.getElementById('v-res-msg-done');
        const msgStatus = document.getElementById('v-res-msg-status');

        if (data.status === 'menunggu') {
            badge.className = "px-3 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700"; badge.innerText = "Menunggu Persetujuan";
            footer.classList.remove('hidden'); footer.classList.add('flex'); msgDone.classList.add('hidden');
        } else {
            if (data.status === 'bertemu') { badge.className = "px-3 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700"; badge.innerText = "Sedang Bertemu"; msgStatus.innerText = "Sedang Bertemu"; msgStatus.className = "text-blue-600"; } 
            else if (data.status === 'selesai') { badge.className = "px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700"; badge.innerText = "Selesai (Pulang)"; msgStatus.innerText = "Selesai"; msgStatus.className = "text-emerald-600"; } 
            else if (data.status === 'ditolak') { badge.className = "px-3 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700"; badge.innerText = "Ditolak"; msgStatus.innerText = "Ditolak"; msgStatus.className = "text-rose-600"; }
            footer.classList.add('hidden'); footer.classList.remove('flex'); msgDone.classList.remove('hidden');
        }
    } else {
        document.getElementById('verify-result-card').classList.add('hidden'); document.getElementById('verify-not-found').classList.remove('hidden');
    }
}

document.getElementById('btn-admin-verify')?.addEventListener('click', () => { executeVerification(document.getElementById('admin-verify-input').value.trim().toUpperCase()); });
document.getElementById('btn-quick-verify-go')?.addEventListener('click', () => {
    const code = document.getElementById('quick-verify-input').value.trim().toUpperCase();
    if (!code) return; switchAppView('view-admin-verify'); document.getElementById('admin-verify-input').value = code; executeVerification(code);
});

document.getElementById('btn-verify-approve')?.addEventListener('click', () => { if (codeToVerify) { changeGuestStatus(codeToVerify, 'bertemu'); executeVerification(codeToVerify); } });
document.getElementById('btn-verify-reject')?.addEventListener('click', () => { if (codeToVerify) { changeGuestStatus(codeToVerify, 'ditolak'); executeVerification(codeToVerify); } });
