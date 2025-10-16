document.addEventListener('DOMContentLoaded', () => {
    const recipesContainer = document.getElementById('recipes-container');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const filterButtons = document.querySelectorAll('.filters button');

    // Data resep Indonesia (simulasi data backend)
    // Dalam proyek nyata, data ini diambil dari API atau JSON file besar
    const allRecipes = [
        { name: "Rendang Daging Sapi", region: "sumatera", tags: ["daging", "pedas", "minang"], description: "Raja masakan Indonesia, kaya santan dan rempah.", imageKeyword: "rendang" },
        { name: "Gudeg Jogja", region: "jawa", tags: ["nangka", "manis", "jawa-tengah"], description: "Nangka muda dimasak santan dengan rasa manis legit.", imageKeyword: "gudeg" },
        { name: "Soto Betawi", region: "jawa", tags: ["kuah", "santan", "daging"], description: "Soto khas Jakarta dengan kuah susu atau santan kental.", imageKeyword: "soto-betawi" },
        { name: "Ayam Betutu", region: "bali", tags: ["ayam", "pedas", "panggang"], description: "Ayam utuh berisi bumbu pedas khas Bali, dipanggang.", imageKeyword: "ayam-betutu" },
        { name: "Coto Makassar", region: "sulawesi", tags: ["daging", "sup", "makassar"], description: "Sup daging berkaldu kental dan rempah khas Makassar.", imageKeyword: "coto-makassar" },
        { name: "Nasi Liwet Solo", region: "jawa", tags: ["nasi", "santan", "solo"], description: "Nasi gurih dimasak santan, disajikan dengan lauk pauk.", imageKeyword: "nasi-liwet" },
        { name: "Papeda Ikan Kuah Kuning", region: "timur", tags: ["sagu", "ikan", "papua"], description: "Bubur sagu lengket disajikan dengan ikan kakap kuah kunyit pedas.", imageKeyword: "papeda" },
        { name: "Sate Lilit Ikan Laut", region: "bali", tags: ["sate", "ikan", "seafood"], description: "Daging ikan cincang yang dililitkan pada batang serai.", imageKeyword: "sate-lilit" },
        { name: "Sayur Asem", region: "jawa", tags: ["sayur", "kuah", "segar"], description: "Sayur berkuah asam manis dengan kacang panjang dan melinjo.", imageKeyword: "sayur-asem" }
    ];

    /**
     * Mendapatkan URL gambar placeholder otomatis dari Unsplash
     * @param {string} keyword - Kata kunci untuk pencarian gambar
     * @returns {string} URL gambar Unsplash
     */
    function getPlaceholderImage(keyword) {
        // Membersihkan dan menggabungkan kata kunci untuk URL yang valid
        const seed = keyword.replace(/\s/g, '-').toLowerCase();
        
        // Menggunakan Unsplash API untuk mendapatkan gambar acak berdasarkan keyword
        return `https://source.unsplash.com/random/400x300/?indonesian-food,${seed}`;
    }

    /**
     * Fungsi untuk me-render (menggambarkan) daftar resep ke HTML
     */
    function renderRecipes(recipes) {
        recipesContainer.innerHTML = ''; // Kosongkan konten sebelumnya

        if (recipes.length === 0) {
            recipesContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #666; font-size: 1.2rem;">Maaf, tidak ada resep yang sesuai di RempahRasa.</p>';
            return;
        }

        recipes.forEach(recipe => {
            const card = document.createElement('div');
            card.className = 'recipe-card';
            
            const imageUrl = getPlaceholderImage(recipe.imageKeyword || recipe.name);

            card.innerHTML = `
                <img src="${imageUrl}" 
                     alt="${recipe.name}" 
                     loading="lazy" 
                     onerror="this.onerror=null;this.src='./assets/images/default.jpg';"> 
                <div class="card-content">
                    <h3>${recipe.name}</h3>
                    <p>Daerah Asal: **${recipe.region.toUpperCase()}** - ${recipe.description}</p>
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

    // --- EVENT LISTENERS ---

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

    // Inisialisasi: Tampilkan resep dari wilayah Jawa saat pertama kali dimuat
    filterByRegion('jawa');
});
