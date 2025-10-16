document.addEventListener('DOMContentLoaded', () => {
    const recipesContainer = document.getElementById('recipes-container');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const filterButtons = document.querySelectorAll('.filters button');

    // Data resep (simulasi data backend)
    // Dalam proyek nyata, data ini akan diambil dari API/Database
    const allRecipes = [
        { name: "Rendang Daging", country: "indonesia", tags: ["asia", "daging", "pedas"], description: "Masakan Asia Tenggara yang kaya rempah.", image: "./assets/images/rendang.jpg" },
        { name: "Pasta Carbonara", country: "italia", tags: ["europe", "pasta", "telur"], description: "Klasik Roma dengan telur dan keju.", image: "./assets/images/pasta.jpg" },
        { name: "Sushi Roll", country: "jepang", tags: ["asia", "ikan", "nasi"], description: "Hidangan nasi cuka dengan makanan laut.", image: "./assets/images/sushi.jpg" },
        { name: "Taco Al Pastor", country: "mexico", tags: ["america", "daging", "tortilla"], description: "Taco khas Meksiko dengan daging babi.", image: "./assets/images/taco.jpg" },
        { name: "Chicken Tagine", country: "maroko", tags: ["africa", "ayam", "rempah"], description: "Rebusan Maroko yang dimasak dalam periuk tanah liat.", image: "./assets/images/tagine.jpg" },
        { name: "Beef Stroganoff", country: "rusia", tags: ["europe", "daging", "krim"], description: "Irisan daging sapi dalam saus krim.", image: "./assets/images/stroganoff.jpg" },
    ];

    /**
     * Fungsi untuk me-render daftar resep ke HTML
     * @param {Array<Object>} recipes - Daftar resep yang akan ditampilkan
     */
    function renderRecipes(recipes) {
        recipesContainer.innerHTML = ''; // Kosongkan konten sebelumnya

        if (recipes.length === 0) {
            recipesContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">Tidak ada resep yang ditemukan.</p>';
            return;
        }

        recipes.forEach(recipe => {
            const card = document.createElement('div');
            card.className = 'recipe-card';
            card.setAttribute('data-country', recipe.tags[0]); // Menggunakan tag pertama untuk filter negara

            card.innerHTML = `
                <img src="${recipe.image || './assets/images/placeholder.jpg'}" alt="${recipe.name}">
                <h3>${recipe.name}</h3>
                <p>${recipe.country.toUpperCase()} - ${recipe.description}</p>
                <a href="#">Lihat Resep</a>
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
            recipe.country.toLowerCase().includes(query) ||
            recipe.description.toLowerCase().includes(query)
        );
        renderRecipes(filteredRecipes);
    }

    /**
     * Fungsi untuk memfilter resep berdasarkan kategori/benua
     * @param {string} category - Kategori yang dipilih (misalnya 'asia', 'europe')
     */
    function filterByCategory(category) {
        let filteredRecipes;
        if (category === 'all') {
            filteredRecipes = allRecipes;
        } else {
            filteredRecipes = allRecipes.filter(recipe => 
                recipe.tags.includes(category)
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

    // 2. Filter Kategori/Benua
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Hapus kelas 'active' dari semua tombol
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Tambahkan kelas 'active' ke tombol yang diklik
            this.classList.add('active');
            
            const category = this.getAttribute('data-country');
            filterByCategory(category);
        });
    });

    // Inisialisasi: Muat semua resep saat pertama kali halaman dimuat
    renderRecipes(allRecipes);
});
