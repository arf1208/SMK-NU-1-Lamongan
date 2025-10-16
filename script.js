// script.js
const saldoTotal = document.getElementById('saldo-total');
const listTransaksi = document.getElementById('list-transaksi');
const formTransaksi = document.getElementById('form-transaksi');
const deskripsiInput = document.getElementById('deskripsi');
const jumlahInput = document.getElementById('jumlah');

// Array dummy untuk menyimpan transaksi
let transaksi = []; // Di aplikasi nyata, ini biasanya disimpan di Local Storage atau Database

// Fungsi untuk memformat angka menjadi Rupiah (Rp)
const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
}

// Fungsi untuk memperbarui tampilan Saldo Total
const perbaruiSaldo = () => {
    // Hitung saldo total
    const total = transaksi.reduce((acc, item) => (acc += item.jumlah), 0);
    saldoTotal.textContent = formatRupiah(total);
    saldoTotal.className = total >= 0 ? 'saldo-total' : 'saldo-total pengeluaran'; // Kasih warna merah jika minus
}

// Fungsi untuk menambahkan transaksi ke DOM
const tambahTransaksiKeDOM = (transaksiItem) => {
    // Tentukan apakah itu Pemasukan (hijau) atau Pengeluaran (merah)
    const kelas = transaksiItem.jumlah < 0 ? 'pengeluaran' : 'pemasukan';

    const item = document.createElement('li');
    item.classList.add(kelas);

    // Dapatkan nilai absolut (tanpa tanda minus) untuk ditampilkan
    const jumlahText = formatRupiah(Math.abs(transaksiItem.jumlah));

    item.innerHTML = `
        <span>${transaksiItem.deskripsi}</span>
        <span>${jumlahText}</span>
    `;

    listTransaksi.appendChild(item);
}

// Fungsi utama untuk menginisialisasi aplikasi
const init = () => {
    listTransaksi.innerHTML = '';
    // Tambahkan setiap transaksi dari array ke DOM
    transaksi.forEach(tambahTransaksiKeDOM);
    perbaruiSaldo();
}

// Handler untuk pengiriman formulir
formTransaksi.addEventListener('submit', (e) => {
    e.preventDefault();

    const deskripsi = deskripsiInput.value.trim();
    // Gunakan parseFloat untuk memastikan input adalah angka
    const jumlah = parseFloat(jumlahInput.value);

    // Validasi sederhana
    if (deskripsi === '' || isNaN(jumlah) || jumlah === 0) {
        alert('Mohon masukkan deskripsi dan jumlah yang valid!');
        return;
    }

    const transaksiBaru = {
        id: Date.now(), // ID unik sederhana
        deskripsi,
        jumlah
    };

    transaksi.push(transaksiBaru);

    // Tambahkan ke tampilan
    tambahTransaksiKeDOM(transaksiBaru);
    perbaruiSaldo();

    // Reset formulir
    deskripsiInput.value = '';
    jumlahInput.value = '';
});

// Jalankan inisialisasi saat aplikasi dimuat
init();
