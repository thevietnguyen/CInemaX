const moviesApi = {
    /**
     * Lấy danh sách phim từ server bằng cách sử dụng lib.get
     * @param {object} options - Đối tượng chứa các tham số và callbacks.
     * @param {string} options.status - Trạng thái phim.
     * @param {number} options.page - Số trang.
     * @param {number} options.size - Kích thước trang.
     * @param {function} options.success - Callback khi thành công.
     * @param {function} options.error - Callback khi thất bại.
     */
    getMovies: function(options) {
        const queryParams = new URLSearchParams({
            status: options.status,
            page: options.page,
            size: options.size
        });
        
        const url = `${API_BASE_URL}/movies?${queryParams.toString()}`;
        lib.get({
            url: url,
            success: options.success,
            error: options.error
        });
    }
};


document.addEventListener('DOMContentLoaded', () => {
    const movieGridContainer = document.getElementById('movie-grid-container');
    const paginationContainer = document.getElementById('pagination-container');
    const filterTabs = document.querySelectorAll('.filter-tab');

    let currentPage = 0;
    let currentStatus = 'NOW_SHOWING';

    function renderMovies(movies) {
        movieGridContainer.innerHTML = '';
        if (!movies || movies.length === 0) {
            movieGridContainer.innerHTML = `<p class="no-movies-message">Không có phim nào phù hợp.</p>`;
            return;
        }
        movies.forEach(movie => {
            const releaseDate = new Date(movie.releaseDate).toLocaleDateString('vi-VN');
            const detailsHtml = movie.status === 'NOW_SHOWING'
                ? `<a href="schedules.html?movie=${movie.id}" class="btn btn-primary btn-small"><i class="fas fa-ticket-alt"></i> Đặt Vé</a>`
                : `<p class="release-date">Khởi chiếu: ${releaseDate}</p>`;
            const movieCardHtml = `
                <div class="movie-card-static">
                    <a href="#" class="card-poster-link js-play-trailer" 
                       data-trailer-url="${movie.trailerUrl || ''}" 
                       data-movie-title="${movie.title}">
                        <img src="${movie.posterUrl}" alt="Poster ${movie.title}">
                        <div class="card-overlay"><i class="fas fa-play-circle"></i></div>
                    </a>
                    <div class="card-info">
                        <h3 class="card-title"><a href="movie-details.html?id=${movie.id}">${movie.title}</a></h3>
                        <span class="card-genres">${movie.genres}</span>
                        <span class="card-duration"><i class="fas fa-clock"></i> ${movie.durationInMinutes} phút</span>
                        <div class="card-details">${detailsHtml}</div>
                    </div>
                </div>`;
            movieGridContainer.insertAdjacentHTML('beforeend', movieCardHtml);
        });
    }


    function setupTrailerModal() {
        const modal = document.getElementById('trailer-modal');
        const modalTitle = document.getElementById('trailer-modal-title');
        const iframe = document.getElementById('trailer-iframe');
        const closeBtn = modal.querySelector('.close-modal-btn');

        // Hàm chuyển đổi URL YouTube sang dạng embed
        function getYouTubeEmbedUrl(url) {
            if (!url) return "";
            let videoId = '';
            if (url.includes("youtube.com/watch?v=")) {
                videoId = new URL(url).searchParams.get('v');
            } else if (url.includes("youtu.be/")) {
                videoId = new URL(url).pathname.substring(1);
            }
            return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : "";
        }

        // Mở modal (sử dụng event delegation)
        document.body.addEventListener('click', (event) => {
            const playButton = event.target.closest('.js-play-trailer');
            if (playButton) {
                event.preventDefault(); // Ngăn link điều hướng
                
                const trailerUrl = playButton.dataset.trailerUrl;
                const movieTitle = playButton.dataset.movieTitle;
                const embedUrl = getYouTubeEmbedUrl(trailerUrl);

                if (embedUrl) {
                    modalTitle.textContent = `Trailer: ${movieTitle}`;
                    iframe.src = embedUrl;
                    modal.classList.add('active');
                } else {
                    // (Tùy chọn) có thể dùng lib.showNotify ở đây nếu có
                    alert('Trailer cho phim này hiện không có sẵn.');
                }
            }
        });

        // Đóng modal
        function closeModal() {
            modal.classList.remove('active');
            // QUAN TRỌNG: Dừng video khi đóng modal để không bị phát trong nền
            iframe.src = ''; 
        }

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (event) => {
            // Chỉ đóng khi click vào nền overlay, không phải nội dung bên trong
            if (event.target === modal) {
                closeModal();
            }
        });
    }


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

    function fetchAndRenderMovies() {
        filterTabs.forEach(tab => tab.classList.toggle('active', tab.dataset.status === currentStatus));
        moviesApi.getMovies({
            status: currentStatus,
            page: currentPage,
            size: 6,
            success: function(pageData) {
                renderMovies(pageData.content);
                renderPagination(pageData);
            },
            error: function(error) {
                console.error('Lỗi khi tải phim:', error);
                movieGridContainer.innerHTML = `<p class="no-movies-message">Gặp lỗi khi tải dữ liệu. Vui lòng thử lại sau.</p>`;
            }
        });
    }
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            currentStatus = tab.dataset.status;
            currentPage = 0;
            fetchAndRenderMovies();
        });
    });

    paginationContainer.addEventListener('click', (event) => {
        event.preventDefault();
        const target = event.target.closest('.page-link');
        if (target && !target.classList.contains('disabled') && !target.classList.contains('active')) {
            currentPage = parseInt(target.dataset.page);
            fetchAndRenderMovies();
        }
    });
    const urlParams = new URLSearchParams(window.location.search);
    currentStatus = (urlParams.get('status') || 'NOW_SHOWING').toUpperCase();
    
    
    fetchAndRenderMovies();

    setupTrailerModal();  
    
});