const newsApi = {
    getNews: function (options) {
        const params = new URLSearchParams({
            page: options.page,
            size: options.size
        });
        if (options.query) params.append('query', options.query);
        if (options.category) params.append('category', options.category);

        const url = `${API_BASE_URL}/news?${params.toString()}`;
        lib.get({ url, success: options.success, error: options.error });
    },
    getCategories: function (options) {
        lib.get({ url: `${API_BASE_URL}/news/categories`, ...options });
    },
    getRecentNews: function (options) {
        lib.get({ url: `${API_BASE_URL}/news/recent`, ...options });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const newsGrid = document.getElementById('news-grid');
    const paginationContainer = document.getElementById('pagination-container');
    const categoryList = document.getElementById('category-list');
    const recentPostsList = document.getElementById('recent-posts-list');
    const searchForm = document.getElementById('news-search-form');
    const searchInput = document.getElementById('news-search-input');

    let currentPage = 0;
    let currentQuery = '';
    let currentCategoryValue = '';
    let categoryMap = {};

    // --- CÁC HÀM RENDER ---

    function renderNews(articles) {
        newsGrid.innerHTML = '';
        if (!articles || articles.length === 0) {
            newsGrid.innerHTML = `<p class="no-articles-message">Không tìm thấy bài viết nào.</p>`;
            return;
        }
        articles.forEach(article => {
            const articleDate = new Date(article.createdAt).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });
            const excerpt = article.content.substring(0, 120) + '...';
            const categoryDisplayName = categoryMap[article.category] || article.category;

            newsGrid.innerHTML += `
                <article class="news-article-card">
                    <a href="news-details.html?id=${article.id}" class="card-image-link">
                    <img src="${article.thumbnail || 'https://via.placeholder.com/400x250'}" alt="${article.title}">
                    </a>
                <div class="card-body">
                    <div class="card-meta">
                        <a href="#" class="card-category js-category-filter" data-category="${article.category}">${article.category}</a>
                        <span class="card-date">${articleDate}</span>
                    </div>
                    <h3 class="card-title"><a href="news-details.html?id=${article.id}">${article.title}</a></h3>
                    <p class="card-excerpt">${excerpt}</p>
                    <a href="news-details.html?id=${article.id}" class="read-more-link">Đọc Thêm <i class="fas fa-arrow-right"></i></a>
                </div>
            </article>`;
        });
    }

    // **HÀM MỚI 1: Render Phân Trang**
    function renderPagination(pageData) {
        paginationContainer.innerHTML = '';
        const { totalPages, number: currentPageNumber } = pageData;
        if (totalPages <= 1) return;

        paginationContainer.innerHTML += `<a href="#" class="page-link ${currentPageNumber === 0 ? 'disabled' : ''}" data-page="${currentPageNumber - 1}">«</a>`;
        for (let i = 0; i < totalPages; i++) {
            paginationContainer.innerHTML += `<a href="#" class="page-link ${i === currentPageNumber ? 'active' : ''}" data-page="${i}">${i + 1}</a>`;
        }
        paginationContainer.innerHTML += `<a href="#" class="page-link ${currentPageNumber >= totalPages - 1 ? 'disabled' : ''}" data-page="${currentPageNumber + 1}">»</a>`;
    }

    // **HÀM MỚI 2: Render Chuyên Mục**
    function renderCategories(categories) {
        categoryMap = categories; // Lưu map để sử dụng sau
        categoryList.innerHTML = '<li><a href="#" class="js-category-filter" data-category="">Tất cả chuyên mục</a></li>';

        for (const [value, displayName] of Object.entries(categories)) {
            categoryList.innerHTML += `<li><a href="#" class="js-category-filter" data-category="${value}">${displayName}</a></li>`;
        }
    }

    // **HÀM MỚI 3: Render Bài Viết Mới**
    function renderRecentPosts(posts) {
        recentPostsList.innerHTML = '';
        if (!posts || posts.length === 0) return;

        posts.forEach(post => {
            recentPostsList.innerHTML += `<li><a href="news-details.html?id=${post.id}">${post.title}</a></li>`;
        });
    }

    // --- CÁC HÀM FETCH DỮ LIỆU ---

    function fetchAndRenderAll() {
        newsApi.getNews({
            page: currentPage, size: 4, query: currentQuery, category: currentCategoryValue, // **SỬA LẠI: Gửi đi 'value'**
            success: (pageData) => {
                renderNews(pageData.content);
                renderPagination(pageData);
            },
            error: (err) => {
                console.error("Lỗi tải bài viết:", err);
                newsGrid.innerHTML = `<p>Gặp lỗi khi tải dữ liệu.</p>`;
            }
        });
    }

    function fetchSidebarData() {
        newsApi.getCategories({
            success: (categories) => renderCategories(categories),
            error: (err) => console.error("Lỗi tải chuyên mục:", err)
        });
        newsApi.getRecentNews({
            success: (posts) => {
                renderRecentPosts(posts);
            },
            error: (err) => console.error("Lỗi khi tải bài viết mới:", err)
        });
    }

    // --- GÁN SỰ KIỆN ---

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        currentPage = 0;
        currentQuery = searchInput.value;
        currentCategory = ''; // Reset category khi tìm kiếm
        fetchAndRenderAll();
    });

    // Sử dụng event delegation cho category list
    document.body.addEventListener('click', (e) => {
        const categoryLink = e.target.closest('.js-category-filter');
        if (categoryLink) {
            e.preventDefault();
            currentPage = 0;
            currentQuery = '';
            searchInput.value = '';
            currentCategoryValue = categoryLink.dataset.category; // Lấy 'value' (vd: "review")
            fetchAndRenderAll();
        }
    });

    paginationContainer.addEventListener('click', (event) => {
        event.preventDefault();
        const target = event.target.closest('.page-link');
        if (target && !target.classList.contains('disabled') && !target.classList.contains('active')) {
            currentPage = parseInt(target.dataset.page);
            fetchAndRenderAll();
        }
    });

    // --- KHỞI CHẠY ---
    fetchAndRenderAll();
    fetchSidebarData();
});