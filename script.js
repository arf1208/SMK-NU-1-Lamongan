document.addEventListener('DOMContentLoaded', () => {
    const recipesContainer = document.getElementById('recipes-container');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const filterButtons = document.querySelectorAll('.filters button');

    // Data resep Indonesia (simulasi)
    const allRecipes = [
        { name: "Rendang Daging Sapi", region: "sumatera", tags: ["daging", "pedas", "minang"], description: "Masakan khas Minangkabau yang dimasak dengan santan dan rempah.", imageKeyword: "rendang" },
        { name: "Soto Ayam Lamongan", region: "jawa", tags: ["kuah", "ayam", "jawa-timur"], description: "Sup ayam berkuah kuning dengan koya dan telur.", imageKeyword: "soto-ayam" },
        { name: "Nasi Goreng Kampung", region: "jawa", tags: ["nasi", "cepat-saji", "pedas"], description: "Hidangan nasi yang digoreng dengan bumbu sederhana dan telur.", imageKeyword: "nasi-goreng" },
        { name: "Sate Lilit Ikan", region: "bali", tags: ["ikan", "sate", "pedas"], description: "Sate khas Bali dengan daging ikan cincang yang dililitkan.", imageKeyword: "sate-lilit" },
        { name: "Pempek Kapal Selam", region: "sumatera", tags: ["ikan", "palembang", "kuah-cuko"], description: "Makanan dari ikan dan sagu yang disajikan dengan kuah cuka.", imageKeyword: "pempek" },
        { name: "Coto Makassar", region: "sulawesi", tags: ["daging", "sup", "makassar"], description: "Sup daging khas Makassar dengan bumbu rempah yang kental.", imageKeyword: "coto-makassar" },
        { name: "Papeda Kuah Kuning", region: "papua", tags: ["sagu", "ikan", "papua"], description: "Bubur sagu yang disajikan dengan ikan kuah kuning pedas.", imageKeyword: "papeda" },
    ];

    /**
     * Fungsi untuk mendapatkan URL gambar placeholder berdasarkan kata kunci
     * Menggunakan layanan yang bersifat placeholder/demo
     * @param {string} keyword - Kata kunci untuk gambar
     * @returns {string} URL gambar
     */
    function getPlaceholderImage(keyword) {
        // Menggunakan Picsum atau sejenisnya. Di sini saya pakai Placehold.co sebagai demo
        // Dalam implementasi nyata, ganti dengan aset Anda sendiri
        const seed = keyword.replace(/\s/g, '-').toLowerCase();
        // Contoh: Menggunakan URL untuk ilustrasi masakan
        return `https://source.unsplash.com/random/400x300/?food,indonesian,${seed}`;
    }

    /**
     * Fungsi untuk me-render daftar resep ke HTML
     */
    function renderRecipes(recipes) {
        recipesContainer.innerHTML = ''; 

        if (recipes.length === 0) {
            recipesContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #666;">Maaf, resep yang Anda cari belum tersedia di Dapur Nusantara.</p>';
            return;
        }

        recipes.forEach(recipe => {
            const card = document.createElement('div');
            card.className = 'recipe-card';
            
            // Dapatkan URL Gambar Otomatis
            const imageUrl = getPlaceholderImage(recipe.imageKeyword || recipe.name);

            card.innerHTML = `
                <img src="${imageUrl}" alt="${recipe.name}" loading="lazy" onerror="this.onerror=null;this.src='./assets/images/default.jpg';">
                <div class="card-content">
                    <h3>${recipe.name}</h3>
                    <p>Dari: ${recipe.region.toUpperCase()} - ${recipe.description}</p>
                    <a href="#">Lihat Resep Lengkap</a>
                </div>
            `;
            recipesContainer.appendChild(card);
        });
    }

    /**
     * Fungsi untuk memfilter resep berdasarkan teks pencarian
     */
    function filterBySearch() {
        const query = searchInput.value.toLowerCase();
        const filteredRecipes = allRecipes.filter(recipe => 
            recipe.name.toLowerCase().includes(query) || 
            recipe.region.toLowerCase().includes(query) ||
            recipe.description.toLowerCase().includes(query) ||
            recipe.tags.some(tag => tag.includes(query))
        );
        renderRecipes(filteredRecipes);
    }

    /**
     * Fungsi untuk memfilter resep berdasarkan kategori/wilayah
     */
    function filterByRegion(region) {
        let filteredRecipes;
        if (region === 'all') {
            filteredRecipes = allRecipes;
        } else {
            filteredRecipes = allRecipes.filter(recipe => 
                recipe.region === region
            );
        }
        renderRecipes(filteredRecipes);
    }

    // EVENT LISTENERS

    // 1. Pencarian
    searchButton.addEventListener('click', filterBySearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            filterBySearch();
        }
    });

    // 2. Filter Kategori/Wilayah
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Atur kelas 'active' pada tombol
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const region = this.getAttribute('data-region');
            filterByRegion(region);
        });
    });

    // Inisialisasi: Muat semua resep saat pertama kali halaman dimuat
    renderRecipes(allRecipes);
});
