lucide.createIcons();

const guestsDatabase = {};

const dateInput = document.getElementById('guest-date');
const today = new Date().toISOString().split('T')[0];
dateInput.value = today;

function switchAppView(targetId) {
    document.querySelectorAll('.app-view').forEach(view => {
        view.classList.remove('block', 'flex');
        view.classList.add('hidden');
    });
    const target = document.getElementById(targetId);
    target.classList.remove('hidden');
    if (['view-success', 'view-track', 'view-login', 'view-admin-verify'].includes(targetId)) {
        target.classList.add('flex');
    } else {
        target.classList.add('block');
    }
}

const mNavBtns = document.querySelectorAll('.m-nav-btn');
mNavBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        mNavBtns.forEach(b => {
            b.classList.remove('text-blue-600'); b.classList.add('text-slate-400');
            b.querySelector('span').classList.remove('font-bold'); b.querySelector('span').classList.add('font-medium');
        });
        this.classList.remove('text-slate-400'); this.classList.add('text-blue-600');
        this.querySelector('span').classList.remove('font-medium'); this.querySelector('span').classList.add('font-bold');
        switchAppView(this.getAttribute('data-target'));
    });
});

const mAdminBtns = document.querySelectorAll('.m-admin-btn');
mAdminBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        mAdminBtns.forEach(b => {
            b.classList.remove('text-blue-400'); b.classList.add('text-slate-400');
            b.querySelector('span').classList.remove('font-bold'); b.querySelector('span').classList.add('font-medium');
        });
        this.classList.remove('text-slate-400'); this.classList.add('text-blue-400');
        this.querySelector('span').classList.remove('font-medium'); this.querySelector('span').classList.add('font-bold');
        switchAppView(this.getAttribute('data-target'));
    });
});

document.querySelectorAll('.d-nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.d-nav-btn').forEach(b => {
            b.classList.remove('bg-white/10', 'text-blue-400', 'border-white/10');
            b.classList.add('text-slate-400');
        });
        this.classList.remove('text-slate-400');
        this.classList.add('bg-white/10', 'text-blue-400', 'border-white/10');
        switchAppView(this.getAttribute('data-target'));
    });
});

document.querySelectorAll('.d-admin-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.d-admin-btn').forEach(b => {
            b.classList.remove('bg-blue-600/20', 'text-blue-400');
            b.classList.add('text-slate-400', 'hover:bg-slate-800', 'hover:text-white');
        });
        this.classList.remove('text-slate-400', 'hover:bg-slate-800', 'hover:text-white');
        this.classList.add('bg-blue-600/20', 'text-blue-400');
        switchAppView(this.getAttribute('data-target'));
    });
});

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault(); 
    document.getElementById('btn-do-login').disabled = true;
    document.getElementById('login-text').classList.add('hidden');
    document.getElementById('login-spinner').classList.remove('hidden');

    setTimeout(() => {
        document.getElementById('btn-do-login').disabled = false;
        document.getElementById('login-text').classList.remove('hidden');
        document.getElementById('login-spinner').classList.add('hidden');

        document.getElementById('mobile-nav-guest').classList.add('hidden');
        document.getElementById('mobile-nav-admin').classList.remove('hidden');
        document.getElementById('mobile-nav-admin').classList.add('flex');

        document.getElementById('desktop-guest-sidebar').classList.add('hidden');
        document.getElementById('desktop-admin-sidebar').classList.remove('hidden');
        document.getElementById('desktop-admin-sidebar').classList.add('flex');

        switchAppView('view-admin-overview');
        document.querySelector('.m-admin-btn[data-target="view-admin-overview"]').click();
    }, 1000);
});

function doLogout() {
    document.getElementById('mobile-nav-admin').classList.add('hidden');
    document.getElementById('mobile-nav-admin').classList.remove('flex');
    document.getElementById('mobile-nav-guest').classList.remove('hidden');
    document.getElementById('mobile-nav-guest').classList.add('flex');

    document.getElementById('desktop-admin-sidebar').classList.add('hidden');
    document.getElementById('desktop-admin-sidebar').classList.remove('flex');
    document.getElementById('desktop-guest-sidebar').classList.remove('hidden');
    
    switchAppView('view-guest-form');
    document.querySelector('.m-nav-btn[data-target="view-guest-form"]').click();
}
document.getElementById('btn-logout-desktop').addEventListener('click', doLogout);
document.getElementById('btn-logout-mobile').addEventListener('click', doLogout);

document.getElementById('kategori-select').addEventListener('change', function() {
    if (this.value === 'siswa') document.getElementById('kelas-container').classList.add('is-active');
    else document.getElementById('kelas-container').classList.remove('is-active');
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
    } catch (err) { alert("Izinkan akses kamera terlebih dahulu."); }
}
function takeSnapshot() {
    if (!videoStream) return;
    cameraCanvas.width = cameraVideo.videoWidth; cameraCanvas.height = cameraVideo.videoHeight;
    cameraCanvas.getContext('2d').drawImage(cameraVideo, 0, 0, cameraCanvas.width, cameraCanvas.height);
    cameraResult.src = cameraCanvas.toDataURL('image/jpeg', 0.8);
    cameraVideo.classList.add('hidden'); document.getElementById('btn-capture').classList.add('hidden');
    cameraResult.classList.remove('hidden'); document.getElementById('btn-retake').classList.remove('hidden');
    stopCamera();
}
function retakePhoto() {
    cameraResult.classList.add('hidden'); document.getElementById('btn-retake').classList.add('hidden');
    startCamera();
}
function stopCamera() {
    if (videoStream) { videoStream.getTracks().forEach(t => t.stop()); videoStream = null; }
}

function updateCounter(type, amount) {
    const el = document.getElementById(`count-${type}`);
    el.innerText = Math.max(0, parseInt(el.innerText) + amount);
}

// ==============================================================
// SUBMIT FORM KEDATANGAN
// ==============================================================
document.getElementById('guest-form').addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    const guestName = document.getElementById('guest-name').value;
    const instansi = document.getElementById('guest-instansi').value;
    const guestDate = document.getElementById('guest-date').value;
    const kategoriSel = document.getElementById('kategori-select');
    const kategori = kategoriSel.options[kategoriSel.selectedIndex].text;
    let kelas = document.getElementById('input-kelas').value;
    if(kelas && kategoriSel.value === 'siswa') kelas = " - " + kelas; else kelas = "";
    const tujuan = document.getElementById('guest-tujuan').value;
    
    const photoSrc = cameraResult.src || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400"><rect width="300" height="400" fill="%23e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="%2394a3b8">Tidak Ada Foto</text></svg>';

    const dateObj = new Date(guestDate);
    const displayDate = `${dateObj.getDate().toString().padStart(2,'0')}/${(dateObj.getMonth()+1).toString().padStart(2,'0')}/${dateObj.getFullYear()}`;
    
    let conflictGuestName = null;
    for (const code in guestsDatabase) {
        if (guestsDatabase[code].date === guestDate && guestsDatabase[code].status !== 'selesai') {
            conflictGuestName = guestsDatabase[code].name; break;
        }
    }

    if (conflictGuestName) {
        document.getElementById('conflict-date-text').innerText = displayDate;
        document.getElementById('conflict-name-text').innerText = conflictGuestName;
        const modal = document.getElementById('conflict-modal');
        const card = document.getElementById('conflict-card');
        modal.classList.remove('hidden');
        setTimeout(() => { card.classList.remove('scale-95', 'opacity-0'); card.classList.add('scale-100', 'opacity-100'); }, 10);
        return; 
    }

    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const code = `SMAN1-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    guestsDatabase[code] = { 
        name: guestName, instansi: instansi, kategori: kategori + kelas, tujuan: tujuan,
        photo: photoSrc, date: guestDate, displayDate: displayDate, time: timeStr, outTime: '-', status: 'menunggu' 
    };

    document.getElementById('btn-submit-guest').disabled = true;
    document.getElementById('submit-text').innerText = "Memproses...";
    document.getElementById('submit-icon').classList.add('hidden');
    document.getElementById('submit-spinner').classList.remove('hidden');

    setTimeout(() => {
        document.getElementById('ticket-name').innerText = guestName;
        document.getElementById('ticket-date-display').innerText = displayDate;
        document.getElementById('ticket-code').innerText = code;
        switchAppView('view-success');

        // INJEKSI KE OVERVIEW (Layar Admin Utama)
        const tr = document.createElement('tr');
        tr.id = `ov-row-${code}`;
        tr.className = "bg-blue-50/50 hover:bg-slate-50/50 transition-colors border-b border-slate-100 fade-in";
        tr.innerHTML = `
            <td class="px-4 py-3"><p class="text-[9px] font-mono text-slate-400">${code}</p><p class="font-bold text-slate-900 text-sm">${guestName}</p></td>
            <td class="px-4 py-3 text-xs text-slate-600 font-medium hidden sm:table-cell">${displayDate}</td>
            <td class="px-4 py-3"><span id="ov-badge-${code}" class="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-[10px] font-bold block mb-1 w-max">Menunggu</span></td>
            <td class="px-4 py-3 text-center">
                <button onclick="openDetailModal('${code}')" class="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 md:py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 mx-auto active:scale-95 w-full md:w-max shadow-sm">
                    <i data-lucide="eye" class="w-3 h-3 md:w-4 md:h-4"></i> Cek Detail
                </button>
            </td>
        `;
        document.getElementById('table-body').prepend(tr);
        updateCounter('menunggu', 1);

        // INJEKSI KE HISTORY 
        const histTr = document.createElement('tr');
        histTr.className = "border-b border-slate-100 hover:bg-slate-50/50 transition-colors fade-in";
        histTr.innerHTML = `
            <td class="px-4 py-3"><p class="text-[9px] font-mono text-slate-400">${code}</p><p class="font-bold text-slate-900 text-sm">${guestName}</p></td>
            <td class="px-4 py-3 text-[10px] text-slate-600 font-medium">In: ${displayDate} <br><span id="hist-out-${code}">Out: -</span></td>
            <td class="px-4 py-3"><span id="hist-badge-${code}" class="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-[10px] font-bold w-max block">Menunggu</span></td>
            <td class="px-4 py-3 text-center">
                <button onclick="openDetailModal('${code}')" class="bg-slate-100 text-slate-600 hover:bg-slate-200 px-3 py-2 md:py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 mx-auto active:scale-95 w-full md:w-max">
                    <i data-lucide="eye" class="w-3 h-3 md:w-4 md:h-4"></i> Cek Detail
                </button>
            </td>
        `;
        document.getElementById('history-table-body').prepend(histTr);

        lucide.createIcons(); 

        document.getElementById('btn-submit-guest').disabled = false;
        document.getElementById('submit-text').innerText = "Kirim & Dapatkan Tiket";
        document.getElementById('submit-icon').classList.remove('hidden');
        document.getElementById('submit-spinner').classList.add('hidden');
        document.getElementById('guest-form').reset();
        document.getElementById('guest-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('kelas-container').classList.remove('is-active');
        if(videoStream) stopCamera();
        cameraResult.classList.add('hidden'); document.getElementById('btn-retake').classList.add('hidden');
        document.getElementById('camera-idle').classList.remove('hidden'); cameraVideo.classList.add('hidden');
        document.getElementById('btn-capture').classList.add('hidden');
    }, 1500); 
});

document.getElementById('btn-change-schedule').addEventListener('click', () => {
    const modal = document.getElementById('conflict-modal');
    const card = document.getElementById('conflict-card');
    card.classList.remove('scale-100', 'opacity-100'); card.classList.add('scale-95', 'opacity-0');
    setTimeout(() => { modal.classList.add('hidden'); document.getElementById('guest-date').focus(); }, 300);
});

document.getElementById('btn-next-guest').addEventListener('click', () => { switchAppView('view-guest-form'); });

// ==============================================================
// LOGIKA PEMBARUAN STATUS GLOBAL (TERMASUK ANIMASI HILANG)
// ==============================================================
function updateRowUI(code) {
    const data = guestsDatabase[code];
    const ovBadge = document.getElementById(`ov-badge-${code}`);
    const histBadge = document.getElementById(`hist-badge-${code}`);
    const histOut = document.getElementById(`hist-out-${code}`);

    let bClass = "", bText = "";

    if (data.status === 'menunggu') {
        bClass = "px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-[10px] font-bold block w-max"; bText = "Menunggu";
    } else if (data.status === 'bertemu') {
        bClass = "px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-[10px] font-bold block w-max"; bText = "Sedang Bertemu";
    } else if (data.status === 'selesai') {
        bClass = "px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-[10px] font-bold block w-max"; bText = "Selesai";
    }

    if(ovBadge) { ovBadge.className = bClass; ovBadge.innerText = bText; }
    if(histBadge) { histBadge.className = bClass; histBadge.innerText = bText; }
    if(histOut && data.status === 'selesai') { histOut.innerText = `Keluar: ${data.outTime}`; }
}

function changeGuestStatus(code, newStatus) {
    const data = guestsDatabase[code];
    if(!data || data.status === newStatus) return;
    
    const prevStatus = data.status;
    data.status = newStatus;
    
    // PENGHAPUSAN OTOMATIS DARI OVERVIEW JIKA SELESAI
    if(newStatus === 'selesai') {
        const o = new Date();
        data.outTime = `${o.getHours().toString().padStart(2,'0')}:${o.getMinutes().toString().padStart(2,'0')}`;
        
        const ovRow = document.getElementById(`ov-row-${code}`);
        if(ovRow) {
            ovRow.classList.add('opacity-0', 'scale-95'); // Animasi hilang
            setTimeout(() => ovRow.remove(), 300); // Hapus permanen
        }
    }
    
    updateCounter(prevStatus, -1);
    updateCounter(newStatus, 1);
    updateRowUI(code);

    if(activeDetailCode === code) {
        updateModalStatusBadge(newStatus);
        document.getElementById('detail-outtime').innerText = data.outTime;
        
        // HIDE ACTION BUTTON JIKA STATUS SELESAI
        if(newStatus === 'selesai') {
            document.getElementById('modal-action-footer').classList.add('hidden');
        }
    }
}

// ==============================================================
// MODAL DETAIL FOTO & INFO TAMU
// ==============================================================
let activeDetailCode = null;

window.openDetailModal = function(code) {
    const data = guestsDatabase[code];
    if(!data) return;
    activeDetailCode = code;

    document.getElementById('detail-photo').src = data.photo;
    document.getElementById('detail-code').innerText = code;
    document.getElementById('detail-datetime').innerText = `${data.displayDate} - Pukul ${data.time}`;
    document.getElementById('detail-outtime').innerText = data.outTime;
    document.getElementById('detail-name').innerText = data.name;
    document.getElementById('detail-instansi').innerText = `${data.instansi} (${data.kategori})`;
    document.getElementById('detail-tujuan').innerText = data.tujuan;

    updateModalStatusBadge(data.status);

    // MODE BACA SAJA (READ-ONLY) JIKA SUDAH SELESAI
    const actionFooter = document.getElementById('modal-action-footer');
    if (data.status === 'selesai') {
        actionFooter.classList.add('hidden');
    } else {
        actionFooter.classList.remove('hidden');
    }

    const modal = document.getElementById('detail-modal');
    const card = document.getElementById('detail-card');
    modal.classList.remove('hidden');
    setTimeout(() => { card.classList.remove('scale-95', 'opacity-0'); card.classList.add('scale-100', 'opacity-100'); }, 10);
};

window.closeDetailModal = function() {
    const modal = document.getElementById('detail-modal');
    const card = document.getElementById('detail-card');
    card.classList.remove('scale-100', 'opacity-100'); card.classList.add('scale-95', 'opacity-0');
    setTimeout(() => { modal.classList.add('hidden'); activeDetailCode = null; }, 300);
};

window.updateStatusFromModal = function(newStatus) {
    if(activeDetailCode) changeGuestStatus(activeDetailCode, newStatus);
};

// >>> BUGFIX: Lencana Modal kini dijamin update saat jadi 'Selesai' <<<
function updateModalStatusBadge(status) {
    const badge = document.getElementById('detail-status-badge');
    const btnM = document.getElementById('btn-status-menunggu');
    const btnB = document.getElementById('btn-status-bertemu');
    const btnS = document.getElementById('btn-status-selesai');

    // Reset tombol (kalau kebetulan masih dirender)
    if(btnM && btnB && btnS) {
        [btnM, btnB, btnS].forEach(btn => btn.className = "flex-1 py-3 px-2 md:px-4 rounded-xl text-xs md:text-sm font-bold border transition-all bg-white text-slate-500 border-slate-200 hover:bg-slate-50 active:scale-95");
    }

    if(status === 'menunggu') {
        badge.className = "px-2 py-1 rounded-md text-[10px] md:text-xs font-bold bg-amber-100 text-amber-700 block w-max"; 
        badge.innerText = "Menunggu";
        if(btnM) btnM.className = "flex-1 py-3 px-2 md:px-4 rounded-xl text-xs md:text-sm font-bold border transition-all bg-amber-500 text-white border-amber-600 shadow-md active:scale-95";
    } else if(status === 'bertemu') {
        badge.className = "px-2 py-1 rounded-md text-[10px] md:text-xs font-bold bg-blue-100 text-blue-700 block w-max"; 
        badge.innerText = "Sedang Bertemu";
        if(btnB) btnB.className = "flex-1 py-3 px-2 md:px-4 rounded-xl text-xs md:text-sm font-bold border transition-all bg-blue-500 text-white border-blue-600 shadow-md active:scale-95";
    } else if(status === 'selesai') {
        badge.className = "px-2 py-1 rounded-md text-[10px] md:text-xs font-bold bg-emerald-100 text-emerald-700 block w-max"; 
        badge.innerText = "Selesai (Keluar)";
        // Tombol tidak perlu diberi warna biru/kuning karena footer ini di-hide di fungsi updateStatusFromModal
    }
}

// ==============================================================
// CEK TIKET MANDIRI & VERIFIKASI ADMIN
// ==============================================================
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
        document.getElementById('track-res-date').innerText = data.displayDate;
        const statusEl = document.getElementById('track-res-status');
        const barEl = document.getElementById('track-color-bar');
        if (data.status === 'menunggu') {
            statusEl.innerText = "Menunggu"; statusEl.className = "text-lg font-bold text-amber-600"; barEl.className = "absolute top-0 right-0 w-2 h-full bg-amber-500";
        } else if (data.status === 'bertemu') {
            statusEl.innerText = "Sedang Bertemu"; statusEl.className = "text-lg font-bold text-blue-600"; barEl.className = "absolute top-0 right-0 w-2 h-full bg-blue-500";
        } else if (data.status === 'selesai') {
            statusEl.innerText = "Selesai Keluar"; statusEl.className = "text-lg font-bold text-emerald-600"; barEl.className = "absolute top-0 right-0 w-2 h-full bg-emerald-500";
        }
    } else {
        document.getElementById('track-found').classList.add('hidden'); document.getElementById('track-not-found').classList.remove('hidden');
    }
});

document.getElementById('admin-verify-input').addEventListener('input', (e) => e.target.value = e.target.value.toUpperCase());
let codeToVerify = null;
document.getElementById('btn-admin-verify').addEventListener('click', () => {
    const code = document.getElementById('admin-verify-input').value.trim();
    if(!code) return;
    if (guestsDatabase[code]) {
        codeToVerify = code; const data = guestsDatabase[code];
        document.getElementById('verify-not-found').classList.add('hidden');
        document.getElementById('verify-result-card').classList.remove('hidden');
        document.getElementById('verify-res-name').innerText = data.name;
        document.getElementById('verify-res-instansi').innerText = data.instansi;
        const btnApply = document.getElementById('btn-apply-ruangan');
        const msgDone = document.getElementById('verify-msg-done');
        if(data.status === 'menunggu') {
            btnApply.classList.remove('hidden'); msgDone.classList.add('hidden');
        } else {
            btnApply.classList.add('hidden'); msgDone.classList.remove('hidden');
        }
    } else {
        document.getElementById('verify-result-card').classList.add('hidden'); document.getElementById('verify-not-found').classList.remove('hidden');
    }
});

document.getElementById('btn-apply-ruangan').addEventListener('click', () => {
    if(codeToVerify) {
        changeGuestStatus(codeToVerify, 'bertemu');
        document.getElementById('btn-apply-ruangan').classList.add('hidden');
        document.getElementById('verify-msg-done').classList.remove('hidden');
    }
});
