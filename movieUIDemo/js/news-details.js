// js/news-details.js

const newsDetailsApi = {
    getById: function(id, options) {
        lib.get({ url: `${API_BASE_URL}/news/${id}`, ...options });
    },
    // THÊM 2 PHƯƠNG THỨC MỚI
    getCategories: function(options) {
        lib.get({ url: `${API_BASE_URL}/news/categories`, ...options });
    },
    getRecentNews: function(options) {
        lib.get({ url: `${API_BASE_URL}/news/recent`, ...options });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('news-details-container');
    const categoryList = document.getElementById('category-list');
    const recentPostsList = document.getElementById('recent-posts-list');
    
    let categoryMap = {}; // Lưu trữ map category để sử dụng

    // --- CÁC HÀM RENDER ---

    function renderNewsDetails(article) {
        document.title = `${article.title} - MovieBox`;
        const articleDate = new Date(article.createdAt).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' });
        
        // Lấy displayName từ map
        const categoryDisplayName = categoryMap[article.category] || article.category;
        
        const html = `
            <div class="container">
                <div class="article-layout">
                    <article class="article-main">
                        <header class="article-header">
                            <a href="news.html?category=${article.category}" class="article-category">${categoryDisplayName}</a>
                            <h1 class="article-title">${article.title}</h1>
                            <div class="article-meta">
                                <span><i class="fas fa-calendar-alt"></i> ${articleDate}</span>
                            </div>
                        </header>
                        <img src="${article.thumbnail}" alt="${article.title}" class="article-thumbnail">
                        <div class="article-content">
                            ${article.content}
                        </div>
                    </article>
                    <aside class="news-sidebar">
                        <div class="sidebar-widget">
                            <h4 class="widget-title">Chuyên Mục</h4>
                            <ul id="category-list" class="widget-category-list"></ul>
                        </div>
                        <div class="sidebar-widget">
                            <h4 class="widget-title">Bài Viết Mới Nhất</h4>
                            <ul id="recent-posts-list" class="widget-recent-posts"></ul>
                        </div>
                    </aside>
                </div>
            </div>`;
        container.innerHTML = html;
    }

    // --- CÁC HÀM RENDER CHO SIDEBAR ---
    function renderCategories(categories) {
        categoryMap = categories; // Lưu lại map
        const categoryListEl = document.getElementById('category-list');
        if (!categoryListEl) return;
        
        categoryListEl.innerHTML = '';
        for (const [value, displayName] of Object.entries(categories)) {
            // Link sẽ điều hướng người dùng về trang news.html, đã được lọc sẵn
            categoryListEl.innerHTML += `<li><a href="news.html?category=${value}">${displayName}</a></li>`;
        }
    }

    function renderRecentPosts(posts) {
        const recentPostsListEl = document.getElementById('recent-posts-list');
        if (!recentPostsListEl) return;
        
        recentPostsListEl.innerHTML = '';
        posts.forEach(post => {
            recentPostsListEl.innerHTML += `<li><a href="news-details.html?id=${post.id}">${post.title}</a></li>`;
        });
    }


    // --- HÀM TẢI DỮ LIỆU ---
    
    // Tải dữ liệu cho sidebar
    function fetchSidebarData() {
        newsDetailsApi.getCategories({
            success: renderCategories,
            error: err => console.error("Lỗi tải chuyên mục:", err)
        });
        newsDetailsApi.getRecentNews({
            success: renderRecentPosts,
            error: err => console.error("Lỗi tải bài viết mới:", err)
        });
    }

    // Lấy ID từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get('id');

    if (!newsId) {
        container.innerHTML = `<p class="error-message">Không tìm thấy ID bài viết.</p>`;
        return;
    }

    // Tải bài viết chính VÀ dữ liệu sidebar
    newsDetailsApi.getById(newsId, {
        success: (newsData) => {
            renderNewsDetails(newsData);
            // Sau khi render bài viết chính, gọi các hàm render cho sidebar
            // Điều này đảm bảo các element #category-list đã tồn tại
            fetchSidebarData(); 
        },
        error: (err) => {
            console.error("Lỗi khi tải chi tiết tin tức:", err);
            container.innerHTML = `<p class="error-message">Không thể tải bài viết.</p>`;
        }
    });
});