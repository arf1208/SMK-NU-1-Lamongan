// --- Data Produk (Inventori) ---
const PRODUCTS = [
    { id: 1, name: "Nasi Goreng", price: 15000 },
    { id: 2, name: "Mie Ayam", price: 12000 },
    { id: 3, name: "Kopi Susu", price: 8000 },
    { id: 4, name: "Es Teh Manis", price: 5000 },
    { id: 5, name: "Roti Bakar", price: 10000 },
    { id: 6, name: "Air Mineral", price: 3000 }
];

let cart = []; // Keranjang belanja
const TAX_RATE = 0.11; // 11% PPN
const DISCOUNT_RATE = 0.10; // 10% Diskon (Contoh: untuk pembelian di atas Rp 50.000)

// Global variable untuk menyimpan total transaksi saat ini
window.currentTotals = {};

// Fungsi utilitas untuk memformat angka menjadi Rupiah
function formatRupiah(number) {
    const num = number || 0; 
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(num);
}

// 1. Inisialisasi: Menggambar Kartu Produk
document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('productGrid');
    
    PRODUCTS.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <p>${product.name}</p>
            <span>${formatRupiah(product.price)}</span>
        `;
        card.onclick = () => addToCart(product.id);
        productGrid.appendChild(card);
    });

    renderCart();
});

// 2. Fungsi Menambah Produk ke Keranjang
function addToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);

    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            qty: 1
        });
    }
    renderCart();
}

// 3. Fungsi untuk Mengubah Kuantitas Item
function changeQty(itemId, delta) {
    const item = cart.find(i => i.id === itemId);
    if (!item) return;

    item.qty += delta;

    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== itemId);
    }
    renderCart();
}


// 4. Fungsi untuk Menggambar Ulang Daftar Keranjang dan Menghitung Total
function renderCart() {
    const cartBody = document.getElementById('cartBody');
    cartBody.innerHTML = ''; 

    let totalSubTotal = 0;

    cart.forEach(item => {
        const row = cartBody.insertRow();
        const itemSubtotal = item.price * item.qty;
        totalSubTotal += itemSubtotal;

        row.insertCell().innerHTML = `
            <strong>${item.name}</strong><br>
            <small>${formatRupiah(item.price)}</small>
        `;

        row.insertCell().innerHTML = `
            <span class="qty-modifier" onclick="changeQty(${item.id}, -1)">-</span>
            ${item.qty}
            <span class="qty-modifier" onclick="changeQty(${item.id}, 1)">+</span>
        `;
        row.cells[1].className = 'qty-col';

        row.insertCell().textContent = formatRupiah(itemSubtotal);
    });

    calculateTotals(totalSubTotal);
}

// 5. Fungsi untuk Menghitung dan Memperbarui Ringkasan Total
function calculateTotals(subTotal) {
    let discountAmount = 0;
    
    // Logika Diskon: Diskon 10% jika Subtotal di atas Rp 50.000
    if (subTotal >= 50000) {
        discountAmount = subTotal * DISCOUNT_RATE;
    }

    const subTotalAfterDiscount = subTotal - discountAmount;
    const taxAmount = subTotalAfterDiscount * TAX_RATE; 
    const finalTotal = subTotalAfterDiscount + taxAmount;

    // Perbarui Tampilan Ringkasan
    document.getElementById('subTotal').textContent = formatRupiah(subTotal);
    document.getElementById('discount').textContent = formatRupiah(discountAmount);
    document.getElementById('tax').textContent = formatRupiah(taxAmount);
    document.getElementById('finalTotal').textContent = formatRupiah(finalTotal);
    
    // Simpan Total dalam variabel global
    window.currentTotals = {
        subTotal,
        discountAmount,
        taxAmount,
        finalTotal
    };
}

// 6. Fungsi Checkout (Menampilkan Struk dan Reset)
function checkout() {
    if (cart.length === 0) {
        alert("Keranjang belanja masih kosong!");
        return;
    }
    
    // Tampilkan Struk
    generateReceipt();
    document.getElementById('receiptModal').style.display = 'block';
    
    // FIX LOGIC: Reset keranjang setelah data struk disiapkan dan modal tampil
    cart = [];
    renderCart(); 
}

// 7. Fungsi untuk Menghasilkan Struk Pembelian
function generateReceipt() {
    const content = document.getElementById('receiptContent');
    const totals = window.currentTotals;
    
    // Buat salinan keranjang sebelum di-reset di checkout
    const itemsToPrint = JSON.parse(JSON.stringify(cart));
    
    let receiptHTML = `
        <p style="text-align: center;">-------------------------</p>
        <p style="text-align: center;">JS-Cashier Toko Sederhana</p>
        <p style="text-align: center;">Tgl: ${new Date().toLocaleDateString('id-ID')}</p>
        <p style="text-align: center;">-------------------------</p>
        <p><strong>ITEM BELANJA</strong></p>
        
        <div style="border-bottom: 1px dashed #333; padding-bottom: 5px; margin-bottom: 5px;">
    `;

    itemsToPrint.forEach(item => {
        receiptHTML += `
            <div class="receipt-item">
                <span>${item.name} (${item.qty}x)</span>
                <span>${formatRupiah(item.price * item.qty)}</span>
            </div>
        `;
    });
    
    receiptHTML += `
        </div>
        
        <div style="margin-top: 10px;">
            <div class="receipt-item"><span>Subtotal:</span><span>${formatRupiah(totals.subTotal)}</span></div>
            <div class="receipt-item"><span>Diskon (10%):</span><span>-${formatRupiah(totals.discountAmount)}</span></div>
            <div class="receipt-item"><span>Pajak (11%):</span><span>+${formatRupiah(totals.taxAmount)}</span></div>
            <div class="receipt-item" style="font-size: 1.1em; font-weight: bold; border-top: 1px dashed #333; padding-top: 5px;">
                <span>TOTAL:</span>
                <span>${formatRupiah(totals.finalTotal)}</span>
            </div>
        </div>
        
        <p style="text-align: center; margin-top: 20px;">** TERIMA KASIH **</p>
    `;
    
    content.innerHTML = receiptHTML;
}

// 8. Fungsi untuk Menutup Modal Struk
function closeModal() {
    document.getElementById('receiptModal').style.display = 'none';
}

// 9. Fungsi untuk Mencetak Struk (Simulasi Cetak Browser)
function printReceipt() {
    const content = document.getElementById('receiptContent').innerHTML;
    const printWindow = window.open('', '', 'height=600,width=400');
    
    printWindow.document.write('<html><head><title>Struk Pembelian</title>');
    printWindow.document.write('<style>body { font-family: monospace; font-size: 12px; } .receipt-item { display: flex; justify-content: space-between; } h2, p { text-align: center; margin: 5px 0; } </style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(content);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
    
    closeModal();
}

// 10. Fungsi untuk Membersihkan Keranjang
function clearCart() {
    if (confirm("Yakin ingin mengosongkan keranjang belanja?")) {
        cart = [];
        renderCart();
    }
}
