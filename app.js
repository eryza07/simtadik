// 1. Inisialisasi ikon Lucide
lucide.createIcons();

// 2. Tangkap semua elemen DOM yang dibutuhkan
const kategoriSelect = document.getElementById('kategori-select');
const kelasContainer = document.getElementById('kelas-container');
const welcomePanel = document.getElementById('welcome-panel');
const loginPanel = document.getElementById('login-panel');
const btnShowLogin = document.getElementById('btn-show-login');
const btnHideLogin = document.getElementById('btn-hide-login');

// 3. Logika Animasi Dropdown "Kelas" (Kondisional rendering form)
kategoriSelect.addEventListener('change', function() {
    if (this.value === 'siswa') {
        // Tambahkan class pen-trigger animasi CSS Grid
        kelasContainer.classList.add('is-active');
    } else {
        kelasContainer.classList.remove('is-active');
    }
});

// 4. Logika Toggle Panel Login vs Welcome
function togglePanels() {
    if (welcomePanel.classList.contains('panel-visible')) {
        // Transisi dari Welcome ke form Login
        welcomePanel.classList.remove('panel-visible');
        welcomePanel.classList.add('panel-hidden');
        
        loginPanel.classList.remove('panel-hidden');
        loginPanel.classList.add('panel-visible');
    } else {
        // Transisi kembali dari Login ke layar Welcome
        loginPanel.classList.remove('panel-visible');
        loginPanel.classList.add('panel-hidden');
        
        welcomePanel.classList.remove('panel-hidden');
        welcomePanel.classList.add('panel-visible');
    }
}

// 5. Pasang Event Listeners ke tombol
btnShowLogin.addEventListener('click', togglePanels);
btnHideLogin.addEventListener('click', togglePanels);
