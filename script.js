// Data Array untuk menyimpan semua tujuan keuangan
let financialGoals = [];

// Mendapatkan referensi elemen DOM
const form = document.getElementById('add-goal-form');
const goalsContainer = document.getElementById('goals-container');
const noGoalsMessage = document.getElementById('no-goals-message');

// Fungsi untuk format angka menjadi Rupiah (dasar)
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

// Fungsi untuk merender (menampilkan) tujuan ke DOM
const renderGoals = () => {
    goalsContainer.innerHTML = ''; // Kosongkan wadah tujuan

    if (financialGoals.length === 0) {
        noGoalsMessage.style.display = 'block';
        return;
    } else {
        noGoalsMessage.style.display = 'none';
    }

    financialGoals.forEach(goal => {
        // Hitung persentase kemajuan
        const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
        const clampedPercentage = Math.min(100, progressPercentage).toFixed(1); // Batasi maks 100%

        // Buat elemen card untuk tujuan
        const goalCard = document.createElement('div');
        goalCard.className = 'goal-card';
        
        goalCard.innerHTML = `
            <h3>${goal.name}</h3>
            
            <div class="goal-details">
                <p><strong>Target:</strong> ${formatRupiah(goal.targetAmount)}</p>
                <p><strong>Telah Terkumpul:</strong> ${formatRupiah(goal.currentAmount)}</p>
                <p><strong>Persentase:</strong> ${clampedPercentage}%</p>
            </div>

            <div class="progress-bar-container">
                <div 
                    class="progress-bar" 
                    style="width: ${clampedPercentage}%;"
                    title="${clampedPercentage}% dari target"
                >
                    ${clampedPercentage > 10 ? `${clampedPercentage}%` : ''}
                </div>
            </div>
        `;
        
        goalsContainer.appendChild(goalCard);
    });
};

// Event Listener untuk penambahan tujuan baru
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Mencegah form submit dan refresh halaman

    // Ambil nilai dari input
    const goalName = document.getElementById('goal-name').value.trim();
    const targetAmount = parseFloat(document.getElementById('target-amount').value);
    const currentAmount = parseFloat(document.getElementById('current-amount').value);

    // Validasi dasar
    if (!goalName || targetAmount <= 0 || currentAmount < 0) {
        alert('Mohon isi semua kolom dengan nilai yang valid.');
        return;
    }

    // Buat objek tujuan baru
    const newGoal = {
        id: Date.now(), // ID unik sederhana
        name: goalName,
        targetAmount: targetAmount,
        currentAmount: currentAmount
    };

    // Tambahkan tujuan ke array
    financialGoals.push(newGoal);

    // Render ulang daftar tujuan
    renderGoals();

    // Reset formulir
    form.reset();
});

// Panggil renderGoals saat halaman dimuat pertama kali
document.addEventListener('DOMContentLoaded', renderGoals);
