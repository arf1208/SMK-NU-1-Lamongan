// --- script.js ---

document.addEventListener('DOMContentLoaded', function() {
    const mainNav = document.getElementById('mainNav');
    
    // Fungsi untuk mengubah kelas pada Navbar saat di-scroll
    const navbarShrink = function () {
        if (!mainNav) {
            return;
        }
        if (window.scrollY === 0) {
            mainNav.classList.remove('navbar-shrink')
        } else {
            mainNav.classList.add('navbar-shrink')
        }
    };

    // Panggil fungsi saat page load
    navbarShrink();

    // Panggil fungsi saat scroll event
    document.addEventListener('scroll', navbarShrink);


    // Placeholder: Logika untuk tombol "Mulai Urus Dokumen"
    const startButton = document.querySelector('.btn-xl');
    if (startButton) {
        startButton.addEventListener('click', function() {
            console.log("Pengguna mengklik tombol 'Mulai Urus Dokumen'.");
            // Di sini Anda bisa menambahkan logika validasi atau animasi
        });
    }

});

// Catatan: Anda juga bisa menambahkan validasi form login di file ini jika menggunakan halaman login.php
