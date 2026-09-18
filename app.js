lucide.createIcons();

// 1. IN-MEMORY DATABASE
const guestsDatabase = {};

// 2. SET DEFAULT DATE KE HARI INI
const dateInput = document.getElementById('guest-date');
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
}

// 3. SISTEM ROUTER SPA (Multi-View Switcher)
function switchAppView(targetId) {
    document.querySelectorAll('.app-view').forEach(view => {
        view.classList.remove('block', 'flex');
        view.classList.add('hidden');
    });

    const target = document.getElementById(targetId);
    if (!target) return;
    target.classList.remove('hidden');

    if (['view-success', 'view-track'].includes(targetId)) {
        target.classList.add('flex');
    } else {
        target.classList.add('block');
    }

    // Update status aktif Sidebar Desktop
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
        const isMatch = btn.getAttribute('data-target') === targetId;
        const ind = btn.querySelector('.nav-indicator');
        if (isMatch) {
            btn.classList.add('text-rose-600');
            btn.classList.remove('text-slate-400', 'hover:text-slate-700');
            btn.querySelector('span').classList.replace('font-semibold', 'font-bold');
            if (ind) ind.classList.remove('hidden');
        } else {
            btn.classList.remove('text-rose-600');
            btn.classList.add('text-slate-400', 'hover:text-slate-700');
            btn.querySelector('span').classList.replace('font-bold', 'font-semibold');
            if (ind) ind.classList.add('hidden');
        }
    });

    // Update status aktif Bottom Nav Mobile
    document.querySelectorAll('.m-nav-btn').forEach(btn => {
        const isMatch = btn.getAttribute('data-target') === targetId;
        if (isMatch) {
            btn.classList.add('text-rose-600');
            btn.classList.remove('text-slate-400');
            btn.querySelector('span').classList.replace('font-medium', 'font-bold');
        } else {
            btn.classList.remove('text-rose-600');
            btn.classList.add('text-slate-400');
            btn.querySelector('span').classList.replace('font-bold', 'font-medium');
        }
    });
}

// Event Listener Tombol Navigasi Desktop & Mobile
document.querySelectorAll('.nav-tab-btn, .m-nav-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        switchAppView(this.getAttribute('data-target'));
    });
});

document.getElementById('btn-quick-scan')?.addEventListener('click', () => {
    switchAppView('view-admin-verify');
});

// 4. ANIMASI DROPDOWN KELAS
document.getElementById('kategori-select')?.addEventListener('change', function () {
    const container = document.getElementById('kelas-container');
    if (this.value === 'siswa') container.classList.add('is-active');
    else container.classList.remove('is-active');
});

// 5. KAMERA WEBRTC
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
    } catch (err) {
        alert("Akses kamera tidak diizinkan di perangkat ini.");
    }
}

function takeSnapshot() {
    if (!videoStream) return;
    cameraCanvas.width = cameraVideo.videoWidth;
    cameraCanvas.height = cameraVideo.videoHeight;
    cameraCanvas.getContext('2d').drawImage(cameraVideo, 0, 0);
    cameraResult.src = cameraCanvas.toDataURL('image/jpeg', 0.85);

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
    if (videoStream) {
        videoStream.getTracks().forEach(t => t.stop());
        videoStream = null;
    }
}

// 6. FUNGSI PERHITUNGAN STATISTIK & DONUT CHART ALA KATSUDOTO
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

    // Angka-angka Utama
    document.getElementById('stat-bertemu').innerText = bertemu;
    document.getElementById('stat-total-tamu').innerText = totalTamu;
    document.getElementById('stat-menunggu-ratio').innerText = menunggu;
    document.getElementById('stat-checkout-count').innerText = selesai;
    document.getElementById('stat-ditolak').innerText = ditolak;

    // Breakdown Kategori
    document.getElementById('cat-siswa').innerText = siswa;
    document.getElementById('cat-dinas').innerText = dinas;
    document.getElementById('cat-umum').innerText = umum;

    // Progress Bar Horizontal
    const baseTotal = totalTamu === 0 ? 1 : totalTamu;
    const checkinPct = Math.round((menunggu / baseTotal) * 100);
    const checkoutPct = Math.round((selesai / baseTotal) * 100);
    document.getElementById('bar-checkin').style.width = `${checkinPct}%`;
    document.getElementById('bar-checkout').style.width = `${checkoutPct}%`;

    // Donut Progress Chart
    const targetCapacity = 20; // Estimasi kuota 20 tamu per hari
    const donutPct = Math.min(100, Math.round((totalTamu / targetCapacity) * 100));
    const donutRing = document.getElementById('donut-progress');
    if (donutRing) {
        donutRing.setAttribute('stroke-dasharray', `${donutPct}, 100`);
    }
    document.getElementById('donut-pct').innerText = `${donutPct}%`;

    // Status Panel Kanan (Ruang Kepala Sekolah)
    const roomBadge = document.getElementById('room-status-badge');
    const seatActive = document.getElementById('seat-active-text');
    const seatWaiting = document.getElementById('seat-waiting-text');

    seatActive.innerText = `${bertemu} Tamu`;
    seatWaiting.innerText = `${menunggu} Tamu`;

    if (bertemu > 0) {
        roomBadge.className = "px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-rose-100 text-rose-700";
        roomBadge.innerText = "Terisi";
    } else {
        roomBadge.className = "px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-slate-100 text-slate-600";
        roomBadge.innerText = "Kosong";
    }

    // Refresh Tampilan Grid Tamu Aktif di Dashboard
    renderActiveGuestsGrid();
}

// 7. RENDER KARTU TAMU AKTIF (Hanya 'Menunggu' & 'Sedang Bertemu')
function renderActiveGuestsGrid() {
    const grid = document.getElementById('active-guests-grid');
    const emptyState = document.getElementById('empty-active-state');
    grid.innerHTML = "";

    const activeList = Object.keys(guestsDatabase)
        .map(code => ({ code, ...guestsDatabase[code] }))
        .filter(g => g.status === 'menunggu' || g.status === 'bertemu')
        .reverse();

    if (activeList.length === 0) {
        emptyState.classList.remove('hidden');
        grid.classList.add('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    grid.classList.remove('hidden');

    activeList.forEach(guest => {
        const isBertemu = guest.status === 'bertemu';
        const card = document.createElement('div');
        card.id = `guest-card-${guest.code}`;
        card.className = "bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-center justify-between gap-3 hover:border-slate-300 transition";

        card.innerHTML = `
            <div class="flex items-center gap-3 min-w-0">
                <div class="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                    <img src="${guest.photo}" alt="Foto" class="w-full h-full object-cover">
                </div>
                <div class="min-w-0">
                    <p class="text-[9px] font-mono font-bold text-slate-400 truncate">${guest.code}</p>
                    <h5 class="font-bold text-slate-900 text-sm truncate">${guest.name}</h5>
                    <p class="text-[11px] text-slate-400 truncate">${guest.instansi}</p>
                </div>
            </div>
            <div class="flex flex-col items-end gap-2 shrink-0">
                <span class="px-2 py-0.5 rounded-md text-[9px] font-bold ${isBertemu ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}">
                    ${isBertemu ? 'Di Ruangan' : 'Menunggu'}
                </span>
                <button onclick="openDetailModal('${guest.code}')" class="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition">
                    Cek Detail
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// 8. SUBMIT FORM KEDATANGAN TAMU (Anti-Bentrok Jadwal)
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

    // Validasi Tanggal Bentrok
    let conflictGuestName = null;
    for (const code in guestsDatabase) {
        if (guestsDatabase[code].date === guestDate && guestsDatabase[code].status !== 'selesai' && guestsDatabase[code].status !== 'ditolak') {
            conflictGuestName = guestsDatabase[code].name;
            break;
        }
    }

    if (conflictGuestName) {
        document.getElementById('conflict-date-text').innerText = displayDate;
        document.getElementById('conflict-name-text').innerText = conflictGuestName;
        const modal = document.getElementById('conflict-modal');
        const card = document.getElementById('conflict-card');
        modal.classList.remove('hidden');
        setTimeout(() => {
            card.classList.remove('scale-95', 'opacity-0');
            card.classList.add('scale-100', 'opacity-100');
        }, 10);
        return;
    }

    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const code = `SMAN1-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Simpan ke Database
    guestsDatabase[code] = {
        name: guestName,
        instansi: instansi,
        kategori: kategori + kelas,
        tujuan: tujuan,
        photo: photoSrc,
        date: guestDate,
        displayDate: displayDate,
        time: timeStr,
        outTime: '-',
        status: 'menunggu'
    };

    const submitBtn = document.getElementById('btn-submit-guest');
    submitBtn.disabled = true;
    document.getElementById('submit-text').innerText = "Memproses Tiket...";
    document.getElementById('submit-icon').classList.add('hidden');
    document.getElementById('submit-spinner').classList.remove('hidden');

    setTimeout(() => {
        document.getElementById('ticket-name').innerText = guestName;
        document.getElementById('ticket-date-display').innerText = displayDate;
        document.getElementById('ticket-code').innerText = code;
        switchAppView('view-success');

        // Tambah ke tabel riwayat (akan aktif jika status sudah selesai/ditolak)
        appendHistoryRow(code);

        // Update semua angka & grafik dashboard
        refreshDashboardMetrics();

        // Reset Form
        submitBtn.disabled = false;
        document.getElementById('submit-text').innerText = "Kirim & Buat Tiket Kunjungan";
        document.getElementById('submit-icon').classList.remove('hidden');
        document.getElementById('submit-spinner').classList.add('hidden');
        document.getElementById('guest-form').reset();
        document.getElementById('guest-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('kelas-container').classList.remove('is-active');

        if (videoStream) stopCamera();
        cameraResult.classList.add('hidden');
        document.getElementById('btn-retake').classList.add('hidden');
        document.getElementById('camera-idle').classList.remove('hidden');
        cameraVideo.classList.add('hidden');
        document.getElementById('btn-capture').classList.add('hidden');
    }, 1200);
});

// Modal Konflik Handler
document.getElementById('btn-change-schedule')?.addEventListener('click', () => {
    const modal = document.getElementById('conflict-modal');
    const card = document.getElementById('conflict-card');
    card.classList.remove('scale-100', 'opacity-100');
    card.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
        document.getElementById('guest-date').focus();
    }, 300);
});

document.getElementById('btn-next-guest')?.addEventListener('click', () => {
    switchAppView('view-guest-form');
});

// 9. INJEKSI KE TABEL RIWAYAT
function appendHistoryRow(code) {
    const data = guestsDatabase[code];
    const tbody = document.getElementById('history-table-body');
    if (!tbody) return;

    const tr = document.createElement('tr');
    tr.id = `hist-row-${code}`;
    tr.className = "hover:bg-slate-50/70 transition";
    tr.innerHTML = `
        <td class="px-5 py-3.5">
            <p class="text-[10px] font-mono text-slate-400 font-bold">${code}</p>
            <p class="font-bold text-slate-900">${data.name}</p>
            <p class="text-[11px] text-slate-400">${data.instansi}</p>
        </td>
        <td class="px-5 py-3.5 text-slate-600">
            ${data.displayDate} <br>
            <span class="text-[10px] text-slate-400 font-mono">In: ${data.time} | <span id="hist-out-${code}">Out: -</span></span>
        </td>
        <td class="px-5 py-3.5">
            <span id="hist-badge-${code}" class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                Menunggu
            </span>
        </td>
        <td class="px-5 py-3.5 text-center">
            <button onclick="openDetailModal('${code}')" class="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition">
                Profil
            </button>
        </td>
    `;
    tbody.prepend(tr);
}

// 10. PEMBARUAN STATUS GLOBAL (Selesai -> Hilang dari Overview -> Masuk Riwayat)
function changeGuestStatus(code, newStatus) {
    const data = guestsDatabase[code];
    if (!data || data.status === newStatus) return;

    data.status = newStatus;

    if (newStatus === 'selesai' || newStatus === 'ditolak') {
        const o = new Date();
        data.outTime = newStatus === 'selesai'
            ? `${o.getHours().toString().padStart(2, '0')}:${o.getMinutes().toString().padStart(2, '0')}`
            : 'Ditolak';
    }

    // Update Badge di Tabel History
    const histBadge = document.getElementById(`hist-badge-${code}`);
    const histOut = document.getElementById(`hist-out-${code}`);
    if (histBadge) {
        if (newStatus === 'bertemu') {
            histBadge.className = "px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700";
            histBadge.innerText = "Sedang Bertemu";
        } else if (newStatus === 'selesai') {
            histBadge.className = "px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700";
            histBadge.innerText = "Selesai";
            if (histOut) histOut.innerText = `Out: ${data.outTime}`;
        } else if (newStatus === 'ditolak') {
            histBadge.className = "px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700";
            histBadge.innerText = "Ditolak";
            if (histOut) histOut.innerText = "Out: Ditolak";
        }
    }

    // Refresh statistik & otomatis hapus dari kartu antrean aktif jika sudah selesai
    refreshDashboardMetrics();

    // Sinkronisasi Modal Detail jika terbuka
    if (activeDetailCode === code) {
        updateModalBadgeUI(newStatus);
        document.getElementById('detail-outtime').innerText = data.outTime;
        if (newStatus === 'selesai' || newStatus === 'ditolak') {
            document.getElementById('modal-action-footer').classList.add('hidden');
        }
    }
}

// 11. MODAL DETAIL FOTO & DATA TAMU
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

    // Kunci tombol aksi jika status sudah final
    const actionFooter = document.getElementById('modal-action-footer');
    if (data.status === 'selesai' || data.status === 'ditolak') {
        actionFooter.classList.add('hidden');
    } else {
        actionFooter.classList.remove('hidden');
    }

    const modal = document.getElementById('detail-modal');
    const card = document.getElementById('detail-card');
    modal.classList.remove('hidden');
    setTimeout(() => {
        card.classList.remove('scale-95', 'opacity-0');
        card.classList.add('scale-100', 'opacity-100');
    }, 10);
};

window.closeDetailModal = function () {
    const modal = document.getElementById('detail-modal');
    const card = document.getElementById('detail-card');
    card.classList.remove('scale-100', 'opacity-100');
    card.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
        activeDetailCode = null;
    }, 250);
};

window.updateStatusFromModal = function (newStatus) {
    if (activeDetailCode) {
        changeGuestStatus(activeDetailCode, newStatus);
    }
};

function updateModalBadgeUI(status) {
    const badge = document.getElementById('detail-status-badge');
    if (status === 'menunggu') {
        badge.className = "px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700";
        badge.innerText = "Menunggu";
    } else if (status === 'bertemu') {
        badge.className = "px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700";
        badge.innerText = "Sedang Bertemu";
    } else if (status === 'selesai') {
        badge.className = "px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700";
        badge.innerText = "Selesai";
    } else if (status === 'ditolak') {
        badge.className = "px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700";
        badge.innerText = "Ditolak";
    }
}

// 12. VERIFIKASI KODE & PERSETUJUAN (Akses dari Tab Verifikasi atau Quick Input)
let codeToVerify = null;

function executeVerification(code) {
    if (!code) return;
    const data = guestsDatabase[code];
    const notFound = document.getElementById('verify-not-found');
    const resultCard = document.getElementById('verify-result-card');

    if (data) {
        codeToVerify = code;
        notFound.classList.add('hidden');
        resultCard.classList.remove('hidden');

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
            badge.className = "px-3 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700";
            badge.innerText = "Menunggu Persetujuan";
            footer.classList.remove('hidden');
            footer.classList.add('flex');
            msgDone.classList.add('hidden');
        } else {
            if (data.status === 'bertemu') {
                badge.className = "px-3 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700";
                badge.innerText = "Sedang Bertemu";
                msgStatus.innerText = "Sedang Bertemu";
                msgStatus.className = "text-blue-600";
            } else if (data.status === 'selesai') {
                badge.className = "px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700";
                badge.innerText = "Selesai (Pulang)";
                msgStatus.innerText = "Selesai";
                msgStatus.className = "text-emerald-600";
            } else if (data.status === 'ditolak') {
                badge.className = "px-3 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700";
                badge.innerText = "Ditolak";
                msgStatus.innerText = "Ditolak";
                msgStatus.className = "text-rose-600";
            }
            footer.classList.add('hidden');
            footer.classList.remove('flex');
            msgDone.classList.remove('hidden');
        }
    } else {
        resultCard.classList.add('hidden');
        notFound.classList.remove('hidden');
    }
}

// Handler Tombol Verifikasi Tab
document.getElementById('btn-admin-verify')?.addEventListener('click', () => {
    const code = document.getElementById('admin-verify-input').value.trim().toUpperCase();
    executeVerification(code);
});

// Handler Verifikasi Cepat dari Dashboard Kanan
document.getElementById('btn-quick-verify-go')?.addEventListener('click', () => {
    const code = document.getElementById('quick-verify-input').value.trim().toUpperCase();
    if (!code) return;
    switchAppView('view-admin-verify');
    document.getElementById('admin-verify-input').value = code;
    executeVerification(code);
});

// Aksi "Setujui"
document.getElementById('btn-verify-approve')?.addEventListener('click', () => {
    if (codeToVerify) {
        changeGuestStatus(codeToVerify, 'bertemu');
        executeVerification(codeToVerify);
    }
});

// Aksi "Tolak"
document.getElementById('btn-verify-reject')?.addEventListener('click', () => {
    if (codeToVerify) {
        changeGuestStatus(codeToVerify, 'ditolak');
        executeVerification(codeToVerify);
    }
});

// 13. CEK TIKET MANDIRI OLEH TAMU
document.getElementById('btn-do-track')?.addEventListener('click', () => {
    const code = document.getElementById('track-input').value.trim().toUpperCase();
    if (!code) return;

    const resContainer = document.getElementById('track-result-container');
    const notFound = document.getElementById('track-not-found');
    const found = document.getElementById('track-found');

    resContainer.classList.remove('hidden');

    if (guestsDatabase[code]) {
        const data = guestsDatabase[code];
        notFound.classList.add('hidden');
        found.classList.remove('hidden');

        document.getElementById('track-res-name').innerText = data.name;
        document.getElementById('track-res-date').innerText = data.displayDate;

        const statusEl = document.getElementById('track-res-status');
        const dotEl = document.getElementById('track-res-dot');
        const barEl = document.getElementById('track-color-bar');

        if (data.status === 'menunggu') {
            statusEl.innerText = "Menunggu Persetujuan";
            statusEl.className = "text-sm font-black text-amber-600";
            dotEl.className = "w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse";
            barEl.className = "absolute top-0 right-0 w-2 h-full bg-amber-500";
        } else if (data.status === 'bertemu') {
            statusEl.innerText = "Sedang Bertemu Kepala Sekolah";
            statusEl.className = "text-sm font-black text-blue-600";
            dotEl.className = "w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse";
            barEl.className = "absolute top-0 right-0 w-2 h-full bg-blue-500";
        } else if (data.status === 'selesai') {
            statusEl.innerText = "Kunjungan Selesai (Sudah Keluar)";
            statusEl.className = "text-sm font-black text-emerald-600";
            dotEl.className = "w-2.5 h-2.5 rounded-full bg-emerald-500";
            barEl.className = "absolute top-0 right-0 w-2 h-full bg-emerald-500";
        } else if (data.status === 'ditolak') {
            statusEl.innerText = "Kunjungan Ditolak / Dibatalkan";
            statusEl.className = "text-sm font-black text-rose-600";
            dotEl.className = "w-2.5 h-2.5 rounded-full bg-rose-500";
            barEl.className = "absolute top-0 right-0 w-2 h-full bg-rose-500";
        }
    } else {
        found.classList.add('hidden');
        notFound.classList.remove('hidden');
    }
});
