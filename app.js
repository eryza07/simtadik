// Inisialisasi Ikon
lucide.createIcons();

// 1. DATABASE VIRTUAL (Menyimpan data tamu agar bisa di-track & verify)
const guestsDatabase = {};

// 2. SISTEM ROUTER CERDAS (ANTI BUG - Tahan banting di semua ukuran layar)
function switchAppView(targetId) {
    // Sembunyikan semua layar di area Main
    document.querySelectorAll('.app-view').forEach(view => {
        view.classList.remove('block', 'flex');
        view.classList.add('hidden');
    });
    // Tampilkan layar yang dituju
    const target = document.getElementById(targetId);
    target.classList.remove('hidden');
    
    // Gunakan 'flex' untuk layar yang butuh posisi ke tengah, sisanya 'block'
    if (targetId === 'view-success' || targetId === 'view-track' || targetId === 'view-login' || targetId === 'view-admin-verify') {
        target.classList.add('flex');
    } else {
        target.classList.add('block');
    }
}

// 3. KONTROL NAVBAR MOBILE (BAWAH)
const mNavBtns = document.querySelectorAll('.m-nav-btn');
mNavBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        // Reset warna icon semua tombol tamu
        mNavBtns.forEach(b => {
            b.classList.remove('text-blue-600'); b.classList.add('text-slate-400');
            b.querySelector('span').classList.remove('font-bold'); b.querySelector('span').classList.add('font-medium');
        });
        // Aktifkan icon yang diklik
        this.classList.remove('text-slate-400'); this.classList.add('text-blue-600');
        this.querySelector('span').classList.remove('font-medium'); this.querySelector('span').classList.add('font-bold');
        
        // Ganti layar
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

// 4. KONTROL NAVBAR DESKTOP (SIDEBAR KIRI)
const dNavBtns = document.querySelectorAll('.d-nav-btn');
dNavBtns.forEach(btn => {
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

const dAdminBtns = document.querySelectorAll('.d-admin-btn');
dAdminBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        // Reset styling
        dAdminBtns.forEach(b => {
            b.classList.remove('bg-blue-600/20', 'text-blue-400');
            b.classList.add('text-slate-400', 'hover:bg-slate-800', 'hover:text-white');
        });
        // Set active style
        this.classList.remove('text-slate-400', 'hover:bg-slate-800', 'hover:text-white');
        this.classList.add('bg-blue-600/20', 'text-blue-400');
        switchAppView(this.getAttribute('data-target'));
    });
});

// 5. SISTEM LOGIN & LOGOUT
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault(); 
    document.getElementById('btn-do-login').disabled = true;
    document.getElementById('login-text').classList.add('hidden');
    document.getElementById('login-spinner').classList.remove('hidden');

    setTimeout(() => {
        // Sembunyikan Loading UI
        document.getElementById('btn-do-login').disabled = false;
        document.getElementById('login-text').classList.remove('hidden');
        document.getElementById('login-spinner').classList.add('hidden');

        // TUKAR NAVBAR MOBILE (Geser Tamu ke bawah, Angkat Admin ke atas)
        document.getElementById('mobile-nav-guest').classList.replace('translate-y-0', 'translate-y-full');
        document.getElementById('mobile-nav-admin').classList.replace('translate-y-full', 'translate-y-0');

        // TUKAR SIDEBAR DESKTOP
        document.getElementById('desktop-guest-sidebar').classList.add('hidden');
        document.getElementById('desktop-admin-sidebar').classList.remove('hidden');
        document.getElementById('desktop-admin-sidebar').classList.add('flex');

        // Buka Layar Overview Default
        switchAppView('view-admin-overview');

        // Sinkronisasi Active State Tombol Navigasi
        document.querySelector('.m-admin-btn[data-target="view-admin-overview"]').click();
        document.querySelector('.d-admin-btn[data-target="view-admin-overview"]').click();

    }, 1000); // Simulasi request login 1 detik
});

function processLogout() {
    // Tukar Navbar Mobile kembali
    document.getElementById('mobile-nav-admin').classList.replace('translate-y-0', 'translate-y-full');
    document.getElementById('mobile-nav-guest').classList.replace('translate-y-full', 'translate-y-0');

    // Tukar Sidebar Desktop kembali
    document.getElementById('desktop-admin-sidebar').classList.add('hidden');
    document.getElementById('desktop-admin-sidebar').classList.remove('flex');
    document.getElementById('desktop-guest-sidebar').classList.remove('hidden');
    
    // Pindahkan ke Layar Form Tamu
    switchAppView('view-guest-form');
    document.querySelector('.m-nav-btn[data-target="view-guest-form"]').click();
    document.querySelector('.d-nav-btn[data-target="view-guest-form"]').click();
}

document.getElementById('btn-logout-desktop').addEventListener('click', processLogout);
document.getElementById('btn-logout-mobile').addEventListener('click', processLogout);

// 6. ANIMASI FORM KELAS
document.getElementById('kategori-select').addEventListener('change', function() {
    if (this.value === 'siswa') document.getElementById('kelas-container').classList.add('is-active');
    else document.getElementById('kelas-container').classList.remove('is-active');
});

// 7. KAMERA WEBRTC
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
    } catch (err) { alert("Izinkan akses kamera terlebih dahulu di perangkat Anda."); }
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

// 8. FUNGSI STATISTIK ADMIN DASHBOARD
function updateCounter(type, amount) {
    const el = document.getElementById(`count-${type}`);
    el.innerText = Math.max(0, parseInt(el.innerText) + amount);
}

// 9. PROSES SUBMIT FORM TAMU & GENERATE TIKET
document.getElementById('guest-form').addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    const guestName = document.getElementById('guest-name').value;
    const instansi = document.getElementById('guest-instansi').value;
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    
    // Bikin Kode Tiket (Contoh: SMAN1-A8B9C)
    const code = `SMAN1-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    // Simpan Ke Database Virtual
    guestsDatabase[code] = { name: guestName, instansi: instansi, time: timeStr, status: 'menunggu' };

    // Set UI Loading Submit
    document.getElementById('btn-submit-guest').disabled = true;
    document.getElementById('submit-text').innerText = "Membuat Tiket...";
    document.getElementById('submit-icon').classList.add('hidden');
    document.getElementById('submit-spinner').classList.remove('hidden');

    setTimeout(() => {
        // Tampilkan Data ke Layar Tiket Sukses
        document.getElementById('ticket-name').innerText = guestName;
        document.getElementById('ticket-code').innerText = code;

        // Pindah ke layar tiket
        switchAppView('view-success');

        // ============ INJEKSI DATA KE TABEL OVERVIEW ADMIN ============
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-50/50 transition-colors border-b border-slate-100";
        tr.innerHTML = `
            <td class="px-4 py-3">
                <p class="text-[9px] font-mono text-slate-400">${code}</p>
                <p class="font-bold text-slate-900 text-xs">${guestName}</p>
                <p class="text-[10px] text-slate-500 hidden sm:block">${instansi}</p>
            </td>
            <td class="px-4 py-3 hidden sm:table-cell text-xs text-slate-600">${instansi}</td>
            <td class="px-4 py-3">
                <span class="status-badge px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-[10px] font-bold block mb-1">Menunggu</span>
                <p class="text-[10px] text-slate-500">Jam: ${timeStr}</p>
            </td>
            <td class="px-4 py-3">
                <select id="sel-${code}" class="bg-slate-50 border border-slate-200 rounded text-xs px-1 py-1 w-full outline-none">
                    <option value="menunggu" selected>Menunggu</option>
                    <option value="bertemu">Sedang Bertemu</option>
                    <option value="selesai">Selesai Keluar</option>
                </select>
            </td>
        `;
        document.getElementById('table-body').prepend(tr);
        updateCounter('menunggu', 1); // Hitungan admin naik

        // ============ INJEKSI DATA KE TABEL HISTORY ADMIN ============
        const histTr = document.createElement('tr');
        histTr.className = "hover:bg-slate-50/50 border-b border-slate-100";
        histTr.innerHTML = `
            <td class="px-4 py-3"><p class="text-[9px] font-mono text-slate-400">${code}</p><p class="font-bold text-slate-900 text-sm">${guestName}</p></td>
            <td class="px-4 py-3 text-[10px] text-slate-600">Masuk: ${timeStr} <br><span id="out-${code}">Keluar: -</span></td>
            <td class="px-4 py-3"><span id="hbad-${code}" class="px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-[10px] font-bold">Menunggu</span></td>
        `;
        document.getElementById('history-table-body').prepend(histTr);

        // ============ LOGIKA UPDATE STATUS ADMIN ============
        const selector = tr.querySelector(`#sel-${code}`);
        const badge = tr.querySelector('.status-badge');
        let prev = 'menunggu';

        selector.addEventListener('change', (ev) => {
            const val = ev.target.value;
            guestsDatabase[code].status = val; // Sync dengan Database Virtual

            // Update Counter
            updateCounter(prev, -1); 
            updateCounter(val, 1);
            
            const hb = document.getElementById(`hbad-${code}`);
            const ho = document.getElementById(`out-${code}`);

            // Update UI Warna Lencana & Jam Keluar
            if(val === 'menunggu') {
                badge.className = "status-badge px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-[10px] font-bold block mb-1"; badge.innerText="Menunggu";
                if(hb) { hb.className=badge.className; hb.innerText="Menunggu"; }
            } else if(val === 'bertemu') {
                badge.className = "status-badge px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-[10px] font-bold block mb-1"; badge.innerText="Sedang Bertemu";
                if(hb) { hb.className=badge.className; hb.innerText="Sedang Bertemu"; }
            } else if(val === 'selesai') {
                badge.className = "status-badge px-2 py-1 bg-emerald-100 text-emerald-700 rounded-md text-[10px] font-bold block mb-1"; badge.innerText="Selesai";
                tr.classList.add('opacity-50');
                const o = new Date();
                if(hb) { hb.className=badge.className; hb.innerText="Selesai"; ho.innerText=`Keluar: ${o.getHours().toString().padStart(2,'0')}:${o.getMinutes().toString().padStart(2,'0')}`; }
            }
            prev = val;
        });

        // ============ RESET FORM BACKGROUND ============
        document.getElementById('btn-submit-guest').disabled = false;
        document.getElementById('submit-text').innerText = "Kirim & Dapatkan Tiket";
        document.getElementById('submit-icon').classList.remove('hidden');
        document.getElementById('submit-spinner').classList.add('hidden');
        document.getElementById('guest-form').reset();
        document.getElementById('kelas-container').classList.remove('is-active');
        if(videoStream) stopCamera();
        cameraResult.classList.add('hidden'); document.getElementById('btn-retake').classList.add('hidden');
        document.getElementById('camera-idle').classList.remove('hidden'); cameraVideo.classList.add('hidden');
        document.getElementById('btn-capture').classList.add('hidden');

    }, 1500); 
});

// Tombol "Selesai" di layar Tiket Sukses
document.getElementById('btn-next-guest').addEventListener('click', () => { 
    switchAppView('view-guest-form'); 
});


// 10. FITUR: CEK STATUS MANDIRI (TAMU)
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
        const barEl = document.getElementById('track-color-bar');
        
        if (data.status === 'menunggu') {
            statusEl.innerText = "Menunggu"; statusEl.className = "text-lg font-bold text-amber-600"; barEl.className = "absolute top-0 right-0 w-2 h-full bg-amber-500";
        } else if (data.status === 'bertemu') {
            statusEl.innerText = "Sedang Bertemu"; statusEl.className = "text-lg font-bold text-blue-600"; barEl.className = "absolute top-0 right-0 w-2 h-full bg-blue-500";
        } else if (data.status === 'selesai') {
            statusEl.innerText = "Selesai (Sudah Keluar)"; statusEl.className = "text-lg font-bold text-emerald-600"; barEl.className = "absolute top-0 right-0 w-2 h-full bg-emerald-500";
        }
    } else {
        document.getElementById('track-found').classList.add('hidden'); 
        document.getElementById('track-not-found').classList.remove('hidden');
    }
});


// 11. FITUR: VERIFIKASI KODE (ADMIN TU)
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
        
        const btnApply = document.getElementById('btn-apply-ruangan');
        const msgDone = document.getElementById('verify-msg-done');
        
        if(data.status === 'menunggu') {
            btnApply.classList.remove('hidden'); msgDone.classList.add('hidden');
        } else {
            // Jika sudah masuk ruangan atau selesai, sembunyikan tombol
            btnApply.classList.add('hidden'); msgDone.classList.remove('hidden');
        }
    } else {
        document.getElementById('verify-result-card').classList.add('hidden'); 
        document.getElementById('verify-not-found').classList.remove('hidden');
    }
});

// Tombol Aksi: Sahkan & Masukkan Ruangan
document.getElementById('btn-apply-ruangan').addEventListener('click', () => {
    if(codeToVerify) {
        // Remote control Dropdown di Tabel Overview (Otomatis update semua sistem)
        const selectBox = document.getElementById(`sel-${codeToVerify}`);
        if(selectBox) {
            selectBox.value = 'bertemu'; 
            selectBox.dispatchEvent(new Event('change')); // Trigger event!
            
            document.getElementById('btn-apply-ruangan').classList.add('hidden');
            document.getElementById('verify-msg-done').classList.remove('hidden');
        }
    }
});
