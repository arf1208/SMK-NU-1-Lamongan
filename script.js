const STORAGE_KEY = 'reminder_tasks';
let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let intervalId; // Variabel untuk menyimpan ID interval hitungan mundur

// Fungsi untuk menyimpan tugas ke LocalStorage
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Fungsi untuk menangani penambahan tugas baru
document.getElementById('taskForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('taskName').value.trim();
    const date = document.getElementById('taskDate').value;
    const time = document.getElementById('taskTime').value;

    // Gabungkan tanggal dan waktu menjadi satu objek Date JavaScript
    const reminderTime = new Date(`${date} ${time}`);
    
    // Validasi: Pastikan waktu tidak di masa lalu
    if (reminderTime.getTime() < Date.now()) {
        alert("Tanggal dan waktu pengingat harus di masa depan!");
        return;
    }

    const newTask = {
        id: Date.now(), // ID unik
        name: name,
        reminderTime: reminderTime.getTime(), // Simpan dalam milidetik
        completed: false
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    this.reset();
});

// Fungsi untuk menghitung sisa waktu (Contoh: "1 hari 5 jam 30 menit")
function calculateTimeRemaining(targetTime) {
    const now = Date.now();
    let diff = targetTime - now;

    if (diff <= 0) {
        return {
            isOverdue: true,
            display: "Waktu Habis!"
        };
    }

    const s = Math.floor(diff / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);

    const hours = h % 24;
    const minutes = m % 60;
    const seconds = s % 60;

    const parts = [];
    if (d > 0) parts.push(`${d} hari`);
    if (h > 0 || d > 0) parts.push(`${hours} jam`);
    parts.push(`${minutes} menit`);
    parts.push(`${seconds} detik`);
    
    // Tampilkan hanya 3 bagian waktu terpenting
    return {
        isOverdue: false,
        display: parts.slice(0, 3).join(' ')
    };
}

// Fungsi untuk menampilkan notifikasi di browser
function showBrowserNotification(taskName) {
    // 1. Minta izin notifikasi jika belum ada
    if (Notification.permission === 'default') {
        Notification.requestPermission();
    }
    
    // 2. Tampilkan notifikasi jika izin diberikan
    if (Notification.permission === 'granted') {
        new Notification("WAKTUNYA TUGAS!", {
            body: `Pengingat: ${taskName} sekarang jatuh tempo.`,
            icon: '⏰' // Anda bisa mengganti ini dengan ikon sungguhan
        });
    } else {
        // Jika izin ditolak, tampilkan peringatan sederhana
        alert(`🔔 PENGINGAT: Tugas "${taskName}" sekarang jatuh tempo!`);
    }
}

// Fungsi utama untuk menggambar ulang daftar tugas
function renderTasks() {
    const body = document.getElementById('taskListBody');
    const noTaskMsg = document.getElementById('noTaskMessage');
    
    body.innerHTML = '';
    
    // Hanya tampilkan tugas yang belum selesai
    const activeTasks = tasks.filter(t => !t.completed);

    if (activeTasks.length === 0) {
        noTaskMsg.style.display = 'block';
        return;
    }
    
    noTaskMsg.style.display = 'none';

    activeTasks.forEach(task => {
        const timeRemaining = calculateTimeRemaining(task.reminderTime);
        const row = body.insertRow();
        
        // Format waktu tampil
        const formattedTime = new Date(task.reminderTime).toLocaleString('id-ID', {
            dateStyle: 'short',
            timeStyle: 'short'
        });

        // Cell Tugas
        row.insertCell().textContent = task.name;
        // Cell Waktu Peringatan
        row.insertCell().textContent = formattedTime;
        
        // Cell Sisa Waktu (untuk di-update setiap detik)
        const timeCell = row.insertCell();
        timeCell.classList.add('time-left');
        timeCell.textContent = timeRemaining.display;
        timeCell.id = `time-${task.id}`;

        // Cell Aksi (Hapus)
        const actionCell = row.insertCell();
        actionCell.innerHTML = `<button class="delete-btn" onclick="deleteTask(${task.id})">Selesai/Hapus</button>`;
        
        if (timeRemaining.isOverdue) {
             timeCell.classList.add('time-overdue');
        }
    });
}

// Fungsi untuk meng-update hitungan mundur setiap 1 detik
function updateCountdown() {
    tasks.forEach(task => {
        const timeCell = document.getElementById(`time-${task.id}`);
        if (!timeCell) return;

        const { isOverdue, display } = calculateTimeRemaining(task.reminderTime);
        timeCell.textContent = display;

        if (isOverdue) {
            timeCell.classList.add('time-overdue');
            
            // Logika Notifikasi: Hanya jalankan notifikasi sekali
            if (!task.notified) {
                showBrowserNotification(task.name);
                task.notified = true;
                saveTasks(); // Simpan status notifikasi
            }
        } else {
             timeCell.classList.remove('time-overdue');
        }
    });
}

// Fungsi menghapus tugas
function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasks();
    renderTasks();
}

// Inisialisasi Aplikasi
document.addEventListener('DOMContentLoaded', () => {
    // Memastikan deleteTask tersedia secara global
    window.deleteTask = deleteTask; 
    
    // Tampilkan daftar tugas saat halaman dimuat
    renderTasks();
    
    // Mulai interval update hitungan mundur setiap 1000ms (1 detik)
    intervalId = setInterval(updateCountdown, 1000);
});
