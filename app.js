lucide.createIcons();

// DOM ELEMENTS (Navigasi)
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

// DOM ELEMENTS (Form Tamu)
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

// DOM ELEMENTS (Data Dashboard)
const guestNameInput = document.getElementById('guest-name');
const guestInstansiInput = document.getElementById('guest-instansi');
const tableBody = document.getElementById('table-body');
const countMenunggu = document.getElementById('count-menunggu');


// LOGIKA FORM TAMU (Animasi Dropdown Kelas)
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


// LOGIKA NAVIGASI & LOGIN ADMIN
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


// LOGIKA SUBMIT FORM TAMU & INJEKSI DATA KE DASHBOARD
if (guestForm) {
    guestForm.addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        // --- PROSES PENGAMBILAN DATA DARI FORM ---
        const guestName = guestNameInput.value;
        const guestInstansi = guestInstansiInput.value;
        const guestKategori = kategoriSelect.options[kategoriSelect.selectedIndex].text;
        
        // Ambil Waktu Saat Ini (Format HH:MM WIB)
        const now = new Date();
        const timeString = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0') + ' WIB';

        // 1. Matikan tombol dan munculkan loading spinner
        btnSubmitGuest.disabled = true;
        btnSubmitGuest.classList.add('opacity-80', 'cursor-not-allowed');
        submitText.innerText = "Mengirim Data...";
        submitIcon.classList.add('hidden');
        submitSpinner.classList.remove('hidden');

        // 2. Delay 2 detik (simulasi kirim data)
        setTimeout(() => {
            
            // --- INJEKSI DATA KE TABEL DASHBOARD ---
            // Buat HTML elemen baris baru
            const newTableRow = `
                <tr class="bg-blue-50/50 hover:bg-slate-50/50 transition-colors">
                    <td class="px-6 py-4">
                        <p class="font-semibold text-slate-900">${guestName}</p>
                        <p class="text-xs text-blue-600 font-medium animate-pulse">Baru saja masuk</p>
                    </td>
                    <td class="px-6 py-4 text-slate-600">${guestInstansi}<br><span class="text-xs text-slate-400">${guestKategori}</span></td>
                    <td class="px-6 py-4 text-slate-600">${timeString}</td>
                    <td class="px-6 py-4">
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                            <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Menunggu
                        </span>
                    </td>
                    <td class="px-6 py-4">
                        <button class="text-blue-600 hover:text-blue-700 font-medium text-xs">Update Status</button>
                    </td>
                </tr>
            `;
            // Masukkan baris baru ini ke paling atas tabel dashboard
            tableBody.insertAdjacentHTML('afterbegin', newTableRow);

            // Update Angka Statistik "Menunggu"
            let currentCount = parseInt(countMenunggu.innerText);
            countMenunggu.innerText = currentCount + 1;


            // --- TRANSISI UI KE LAYAR SUKSES ---
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

// LOGIKA RESET UNTUK TAMU BERIKUTNYA
if (btnNextGuest) {
    btnNextGuest.addEventListener('click', function() {
        successState.classList.remove('scale-100', 'opacity-100', 'pointer-events-auto');
        successState.classList.add('scale-95', 'opacity-0', 'pointer-events-none');
        
        setTimeout(() => {
            guestFormContainer.classList.remove('scale-95', 'opacity-0', 'pointer-events-none');
            guestFormContainer.classList.add('scale-100', 'opacity-100');
            
            guestForm.reset();
            kelasContainer.classList.remove('is-active');
            inputKelas.removeAttribute('required');
        }, 300);
    });
}
