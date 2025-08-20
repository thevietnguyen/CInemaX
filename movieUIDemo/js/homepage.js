function initializeHomepage() {
    console.log("Khởi tạo các chức năng cho trang chủ...");
    setupHeroSlider();
    setupCinemasInteraction();
    fetchAndRenderHomepageMovies();
    setupTrailerModalLogic();
}

const moviesApi = {
    getMovies: function (options) {
        const queryParams = new URLSearchParams({

            status: options.status,
            page: options.page,
            size: options.size,
            sort: options.sort
        });
        const url = `${API_BASE_URL}/movies?${queryParams.toString()}`;
        lib.get({ url: url, success: options.success, error: options.error });
    }
};

function fetchAndRenderHomepageMovies() {
    const nowShowingContainer = document.getElementById('now-showing-grid');
    const comingSoonContainer = document.getElementById('coming-soon-carousel');
    if (!nowShowingContainer || !comingSoonContainer) return;

    moviesApi.getMovies({
        status: 'NOW_SHOWING', page: 0, size: 5, sort: 'releaseDate,desc',
        success: (pageData) => renderNowShowing(pageData.content, nowShowingContainer),
        error: (err) => {
            console.error("Lỗi tải phim Đang Chiếu:", err);
            nowShowingContainer.innerHTML = `<p>Không thể tải danh sách phim.</p>`;
        }
    });

    moviesApi.getMovies({
        status: 'COMING_SOON', page: 0, size: 10, sort: 'releaseDate,asc',
        success: (pageData) => renderComingSoon(pageData.content, comingSoonContainer),
        error: (err) => {
            console.error("Lỗi tải phim Sắp Chiếu:", err);
            comingSoonContainer.innerHTML = `<p>Không thể tải danh sách phim.</p>`;
        }
    });
}

function renderNowShowing(movies, container) {
    if (!movies || movies.length === 0) {
        container.innerHTML = '<p>Hiện chưa có phim nào đang chiếu.</p>';
        return;
    }
    let htmlContent = '';
    movies.forEach(movie => {
        htmlContent += `
            <div class="movie-card-vertical">
                <div class="flip-card-inner">
                    <div class="card-front">
                        <img src="${movie.posterUrl}" alt="Poster ${movie.title}" loading="lazy">
                        <p class="movie-caption">${movie.title}</p>
                    </div>
                    <div class="card-back">
                        <h3>${movie.title}</h3>
                        <p>${movie.description.substring(0, 100)}...</p>
                        <div class="card-buttons">
                            <a href="/pages/schedules.html?movie=${movie.id}" class="btn btn-primary"><i class="fas fa-ticket-alt"></i> Đặt Vé</a>
                            
                            <!-- **SỬA LẠI:** Thêm class 'js-play-trailer' và data-movie-title -->
                            <button class="btn btn-secondary js-play-trailer" 
                                    data-trailer-url="${movie.trailerUrl || ''}" 
                                    data-movie-title="${movie.title}">
                                <i class="fas fa-play"></i> Trailer
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
    });
    container.innerHTML = htmlContent;
}

function renderComingSoon(movies, container) {
    if (!movies || movies.length === 0) {
        container.innerHTML = '<p>Hiện chưa có phim nào sắp chiếu.</p>';
        return;
    }
    let htmlContent = '';
    movies.forEach(movie => {
        const releaseDate = new Date(movie.releaseDate).toLocaleDateString('vi-VN');
        htmlContent += `
            <div class="movie-card-coming-soon">
                <a href="#" class="coming-soon-poster-link js-play-trailer" 
                   data-trailer-url="${movie.trailerUrl || ''}"
                   data-movie-title="${movie.title}">
                    <img src="${movie.posterUrl}" alt="Poster ${movie.title}" loading="lazy">
                    <div class="card-overlay"><i class="fas fa-play-circle"></i></div>
                </a>
                <div class="card-content">
                    <h4><a href="/pages/movie-details.html?id=${movie.id}">${movie.title}</a></h4>
                    <p>Khởi chiếu: ${releaseDate}</p>
                </div>
            </div>`;
    });
    container.innerHTML = htmlContent;
}



function setupHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-slider-dots .dot');
    if (slides.length === 0 || dots.length === 0) return;

    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function startSlider() {
        slideInterval = setInterval(() => showSlide((currentSlide + 1) % slides.length), 5000);
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            showSlide(parseInt(dot.dataset.index));
            startSlider();
        });
    });

    startSlider();
}

function setupCinemasInteraction() {
    const cinemaItems = document.querySelectorAll('.cinema-item');
    const cinemaMap = document.getElementById('cinema-location-map');
    if (cinemaItems.length === 0 || !cinemaMap) return;

    const firstCinema = document.querySelector('.cinema-item.active');
    if (firstCinema) {
        cinemaMap.src = firstCinema.dataset.mapSrc;
    }

    cinemaItems.forEach(item => {
        item.addEventListener('click', () => {
            cinemaItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            cinemaMap.src = item.dataset.mapSrc;
        });
    });
}

function setupTrailerModalLogic() {
    const modal = document.getElementById('trailer-modal');
    // Nếu không tìm thấy modal (ví dụ ở trang không nạp nó), thì không làm gì cả
    if (!modal) return;

    const modalTitle = document.getElementById('trailer-modal-title');
    const iframe = document.getElementById('trailer-iframe');
    const closeBtn = modal.querySelector('.close-modal-btn');

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

    // Dùng event delegation để bắt sự kiện trên toàn trang
    document.body.addEventListener('click', (event) => {
        // Áp dụng cho nút trailer ở trang chủ
        const playButton = event.target.closest('.js-play-trailer');
        if (playButton) {
            event.preventDefault();
            const trailerUrl = playButton.dataset.trailerUrl;
            const movieTitle = playButton.dataset.movieTitle;
            const embedUrl = getYouTubeEmbedUrl(trailerUrl);

            if (embedUrl) {
                modalTitle.textContent = `Trailer: ${movieTitle}`;
                iframe.src = embedUrl;
                modal.classList.add('active');
            } else {
                alert('Trailer cho phim này hiện không có sẵn.');
            }
        }
    });

    function closeModal() {
        modal.classList.remove('active');
        iframe.src = '';
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
}