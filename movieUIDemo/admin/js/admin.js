const adminApi = {
    getUsers: (callbacks = {}, query = "") => {
        let url = `${API_BASE_URL}/admin/users?page=${callbacks.page || 0}&size=${callbacks.size || 10}`;
        if (query) {
            url += `&query=${encodeURIComponent(query)}`;
        }
        lib.get({ url, ...callbacks });
    },

    updateUserRole: (userId, newRole, callbacks = {}) => {
        lib.put({
            url: `${API_BASE_URL}/admin/users/${userId}/role`,
            data: JSON.stringify({ role: newRole }),
            ...callbacks
        });
    },

    deleteUser: (userId, callbacks = {}) => {
        lib.delete({ url: `${API_BASE_URL}/admin/users/${userId}`, ...callbacks });
    },

    // getMovies: (callbacks = {}) => {
    //     const page = callbacks.page || 0;
    //     const size = callbacks.size || 10;
    //     lib.get({ url: `${API_BASE_URL}/admin/movies?page=${page}&size=${size}`, ...callbacks });
    // },

    getMovies: (callbacks = {}, query = "") => {
        let url = `${API_BASE_URL}/admin/movies?page=${callbacks.page || 0}&size=${callbacks.size || 10}`;
        if (query) {
            url += `&query=${encodeURIComponent(query)}`;
        }
        lib.get({ url, ...callbacks });
    },

    addMovie: (movieData, callbacks = {}) => {
        lib.post({ url: `${API_BASE_URL}/admin/movies/create`, data: JSON.stringify(movieData), ...callbacks });
    },

    updateMovie: (movieId, movieData, callbacks = {}) => {
        lib.put({ url: `${API_BASE_URL}/admin/movies/${movieId}/update-movies`, data: JSON.stringify(movieData), ...callbacks });
    },

    deleteMovie: (movieId, callbacks = {}) => {
        lib.delete({ url: `${API_BASE_URL}/admin/movies/${movieId}/delete-movies`, ...callbacks });
    },

    getNews: (callbacks = {}, query = "") => {
        let url = `${API_BASE_URL}/admin/news?page=${callbacks.page || 0}&size=${callbacks.size || 10}`;
        if (query) {
            url += `&query=${encodeURIComponent(query)}`;
        }
        lib.get({ url, ...callbacks });
    },

    addNews: (newsData, callbacks = {}) => {
        lib.post({ url: `${API_BASE_URL}/admin/news/create`, data: JSON.stringify(newsData), ...callbacks });
    },

    updateNews: (newsId, newsData, callbacks = {}) => {
        lib.put({ url: `${API_BASE_URL}/admin/news/${newsId}/update`, data: JSON.stringify(newsData), ...callbacks });
    },

    deleteNews: (newsId, callbacks = {}) => {
        lib.delete({ url: `${API_BASE_URL}/admin/news/${newsId}/delete`, ...callbacks });
    },


    getCinemas: (callbacks = {}, query = "") => {
        let url = `${API_BASE_URL}/admin/cinemas?page=${callbacks.page || 0}&size=${callbacks.size || 10}`;
        if (query) {
            url += `&query=${encodeURIComponent(query)}`;
        }
        lib.get({ url, ...callbacks });
    },

    getCinemaById: (cinemaId, callbacks = {}) => {
        lib.get({ url: `${API_BASE_URL}/admin/cinemas/${cinemaId}`, ...callbacks });
    },

    addCinema: (cinemaData, callbacks = {}) => {
        lib.post({ url: `${API_BASE_URL}/admin/cinemas/create`, data: JSON.stringify(cinemaData), ...callbacks });
    },

    updateCinema: (cinemaId, cinemaData, callbacks = {}) => {
        lib.put({ url: `${API_BASE_URL}/admin/cinemas/${cinemaId}/update`, data: JSON.stringify(cinemaData), ...callbacks });
    },

    deleteCinema: (cinemaId, callbacks = {}) => {
        lib.delete({ url: `${API_BASE_URL}/admin/cinemas/${cinemaId}/delete`, ...callbacks });
    },

    getCinemasWithRooms: (callbacks = {}) => {
        lib.get({ url: `${API_BASE_URL}/admin/cinemas/with-rooms`, ...callbacks });
    },
    getShowtimes: (callbacks = {}) => {
        lib.get({ url: `${API_BASE_URL}/admin/showtimes`, ...callbacks });
    },
    createShowtime: (showtimeData, callbacks = {}) => {
        lib.post({ url: `${API_BASE_URL}/admin/showtimes/create`, data: JSON.stringify(showtimeData), ...callbacks });
    },
    deleteShowtime: (showtimeId, callbacks = {}) => {
        lib.delete({ url: `${API_BASE_URL}/admin/showtimes/${showtimeId}/delete`, ...callbacks });
    },

    createRoom: (cinemaId, roomData, callbacks = {}) => {
        lib.post({ url: `${API_BASE_URL}/admin/cinemas/${cinemaId}/rooms`, data: JSON.stringify(roomData), ...callbacks });
    },
    updateRoom: (roomId, roomData, callbacks = {}) => {
        lib.put({ url: `${API_BASE_URL}/admin/rooms/${roomId}`, data: JSON.stringify(roomData), ...callbacks });
    },
    deleteRoom: (roomId, callbacks = {}) => {
        lib.delete({ url: `${API_BASE_URL}/admin/rooms/${roomId}`, ...callbacks });
    },
};

document.addEventListener("DOMContentLoaded", function () {
    initializeAdminSession();
    setupNavigation();
    // setupModals();
    setupPopupBehaviors();
    fetchAndRenderUsers();
    fetchAndRenderMovies();
    fetchAndRenderNews();
    fetchAndRenderMovies();
    fetchAndRenderNews();
    fetchAndRenderCinemas();
    fetchAndRenderShowtimes();

    setupTrailerViewer();
    setupGlobalSearch();
    initializeQuillEditor();
    setupDocxImport();
    setupScheduleManagement();
    // const searchInput = document.getElementById('user-search-input');

    // if (searchInput) {
    //     searchInput.addEventListener('keyup', (event) => {
    //         if (event.key === 'Enter') {
    //             const query = searchInput.value.trim();
    //             fetchAndRenderUsers(query);
    //         }
    //     });

    //     searchInput.addEventListener('input', () => {
    //         // tìm kiếm ngay khi gõ
    //         fetchAndRenderUsers(searchInput.value.trim());

    //         // tải lại khi ô trống
    //         // if (searchInput.value.trim() === '') {

    //         //     fetchAndRenderUsers();
    //         // }
    //     });
    // }

    const posterFileInput = document.querySelector('#movie-form-popup input[name="posterFile"]');
    if (posterFileInput) {
        posterFileInput.addEventListener('change', function () {
            const file = this.files[0];
            if (!file) return;

            const posterUrlInput = document.querySelector('#movie-form-popup input[name="posterUrl"]');
            const posterPreview = document.getElementById('poster-preview');
            posterPreview.style.display = 'block';
            posterPreview.src = 'https://i.gifer.com/ZZ5H.gif';

            uploadFile(file, {
                success: (response) => {
                    lib.showNotify({ type: 'success', title: 'Thành công', message: 'Tải ảnh lên thành công!' });
                    posterUrlInput.value = response.url;
                    posterPreview.src = response.url;
                },
                error: (err) => {
                    lib.showNotify({ type: 'error', title: 'Tải ảnh thất bại', message: err.error || 'Có lỗi xảy ra.' });
                    posterPreview.style.display = 'none';
                }
            });
        });
    }

    const thumbnailFileInput = document.querySelector('#news-form-popup input[name="thumbnailFile"]');
    if (thumbnailFileInput) {
        thumbnailFileInput.addEventListener('change', function () {
            const file = this.files[0];
            if (!file) return;

            const form = this.closest('form');
            const hiddenInput = form.querySelector('input[name="thumbnail"]');
            const previewImg = form.querySelector('.thumbnail-preview');

            previewImg.style.display = 'block';
            previewImg.src = 'https://i.gifer.com/ZZ5H.gif';

            uploadFile(file, {
                success: (response) => {
                    lib.showNotify({ type: 'success', title: 'Thành công', message: 'Tải ảnh lên thành công!' });
                    hiddenInput.value = response.url; 
                    previewImg.src = response.url;   
                },
                error: (err) => {
                    lib.showNotify({ type: 'error', title: 'Lỗi Upload', message: err.error || 'Tải ảnh thất bại.' });
                    previewImg.style.display = 'none';
                }
            });
        });
    }


});

function initializeAdminSession() {
    const userInfoSpan = document.querySelector(".user-info span");
    if (!userInfoSpan) return;
    try {
        const userDataString = localStorage.getItem("userData");
        if (userDataString) {
            const userData = JSON.parse(userDataString);
            if (userData?.fullname && userData.role?.includes("ADMIN")) {
                userInfoSpan.textContent = `Chào, ${userData.fullname}!`;
            }
        }
    } catch (error) {
        console.error("Lỗi khi xử lý thông tin người dùng:", error);
    }
}

function setupNavigation() {
    const navLinks = document.querySelectorAll(".sidebar-nav .nav-link");
    const mainHeaderTitle = document.querySelector(".main-header h2");
    const searchBar = document.querySelector('#global-search-input');
    const placeholderMap = {
        'manage-users': 'Tìm theo tên hoặc email người dùng...',
        'manage-movies': 'Tìm theo tên phim...',
        'manage-news': 'Tìm theo tiêu đề bài viết...',
        'manage-cinemas': 'Tìm theo tên rạp...',
        'manage-schedules': 'Tìm theo tên phim hoặc tên rạp...',
        'default': 'Tìm kiếm...'
    };

    function showTab(targetId) {
        const idToShow = targetId || "dashboard";
        document.querySelectorAll(".content-section").forEach(s => s.classList.remove("active"));
        navLinks.forEach(link => link.classList.remove("active"));

        const sectionToShow = document.getElementById(idToShow);
        const linkToActivate = document.querySelector(`.sidebar-nav .nav-link[href="#${idToShow}"]`);

        if (sectionToShow && linkToActivate) {
            sectionToShow.classList.add("active");
            linkToActivate.classList.add("active");
            if (mainHeaderTitle) {
                mainHeaderTitle.textContent = linkToActivate.querySelector("span").textContent;
            }
            if (searchBar) {

                if (placeholderMap[idToShow]) {
                    searchBar.style.display = 'block';
                    searchBar.placeholder = placeholderMap[idToShow];
                    searchBar.value = '';
                } else {
                    searchBar.style.display = 'none';
                }
            }
        }
    }

    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            window.location.hash = targetId;
        });
    });

    window.addEventListener("hashchange", () => {
        const targetId = window.location.hash.substring(1);
        showTab(targetId);
    });

    const initialHash = window.location.hash.substring(1);
    showTab(initialHash);
}

// function setupModals() {
//     const openModalButtons = document.querySelectorAll(".js-open-popup");
//     const closeModalButtons = document.querySelectorAll(".close-modal-btn");
//     const overlays = document.querySelectorAll(".modal-overlay");

//     const closeAllPopups = () => overlays.forEach(overlay => overlay.classList.remove("active"));

//     closeModalButtons.forEach(btn => btn.addEventListener("click", closeAllPopups));
//     overlays.forEach(overlay => overlay.addEventListener("click", e => { if (e.target === overlay) closeAllPopups(); }));
//     document.addEventListener("keydown", e => { if (e.key === "Escape") closeAllPopups(); });

//     openModalButtons.forEach(button => {
//         button.addEventListener("click", () => handlePopupOpen(button));
//     });    
// }

function setupPopupBehaviors() {
    const overlays = document.querySelectorAll(".modal-overlay");
    const closeAllPopups = () => overlays.forEach(o => o.classList.remove("active"));
    document.body.addEventListener('click', function (event) {
        const openBtn = event.target.closest('.js-open-popup');
        if (openBtn) {
            handlePopupOpen(openBtn);
            return;
        }
        const closeBtn = event.target.closest('.close-modal-btn');
        if (closeBtn) {
            closeAllPopups();
            return;
        }
        const saveMovieBtn = event.target.closest('#movie-form-popup .btn-primary');
        if (saveMovieBtn) {
            const popup = document.getElementById('movie-form-popup');
            const form = popup.querySelector('form');
            const movieId = popup.dataset.id;
            const mode = popup.dataset.mode;

            const movieData = {
                title: form.elements['title'].value,
                description: form.elements['description'].value,
                durationInMinutes: parseInt(form.elements['duration'].value, 10),
                genres: form.elements['genres'].value,
                posterUrl: form.elements['posterUrl'].value,
                trailerUrl: form.elements['trailerUrl'].value,
                releaseDate: "2025-01-01",
                status: form.elements['status'].value.toUpperCase().replace('-', '_')
            };

            const callback = {
                success: () => {
                    lib.showNotify({ type: 'success', title: 'Thành Công', message: `Đã ${mode === 'add' ? 'thêm' : 'cập nhật'} phim thành công!` });
                    closeAllPopups();
                    fetchAndRenderMovies();
                },
                error: (err) => lib.showNotify({ type: 'error', title: 'Thất Bại', message: `Lỗi: ${err.message}` })
            };

            if (mode === 'add') {
                adminApi.addMovie(movieData, callback);
            } else {
                adminApi.updateMovie(movieId, movieData, callback);
            }
            return;
        }


        const updateUserBtn = event.target.closest('#user-form-popup .btn-primary');
        if (updateUserBtn) {
            const popup = document.getElementById('user-form-popup');
            const userId = popup.dataset.id;
            const newRole = popup.querySelector('select[name="role"]').value;

            adminApi.updateUserRole(userId, newRole, {
                success: (user) => {
                    lib.showNotify({ type: 'success', title: 'Thành công', message: `Đã cập nhật vai trò cho ${user.fullName}.` });
                    closeAllPopups();
                    fetchAndRenderUsers();
                },
                error: (err) => lib.showNotify({ type: 'error', title: 'Lỗi', message: err.message || 'Không thể cập nhật vai trò.' })
            });
            return;
        }

        const deleteConfirmBtn = event.target.closest('#delete-confirm-popup .btn-danger');
        if (deleteConfirmBtn) {
            const popup = document.getElementById('delete-confirm-popup');
            const itemId = popup.dataset.id;
            const itemType = popup.dataset.itemType;

            if (itemType === 'movie') {
                adminApi.deleteMovie(itemId, {
                    success: () => {
                        lib.showNotify({ type: 'success', title: 'Thành Công', message: 'Đã xóa phim.' });
                        closeAllPopups();
                        fetchAndRenderMovies();
                    },
                    error: (err) => lib.showNotify({ type: 'error', title: 'Thất Bại', message: `Lỗi: ${err.message}` })
                });
            } else if (itemType === 'user') {
                adminApi.deleteUser(itemId, {
                    success: () => {
                        lib.showNotify({ type: 'success', title: 'Thành Công', message: 'Đã xóa người dùng.' });
                        closeAllPopups();
                        fetchAndRenderUsers();
                    },
                    error: (err) => lib.showNotify({ type: 'error', title: 'Thất Bại', message: `Lỗi: ${err.message}` })
                });
            } else if (itemType === 'news') {
                adminApi.deleteNews(itemId, {
                    success: () => {
                        lib.showNotify({ type: 'success', title: 'Thành Công', message: 'Đã xóa bài viết.' });
                        closeAllPopups();
                        fetchAndRenderNews();
                    },
                    error: (err) => lib.showNotify({ type: 'error', title: 'Thất Bại', message: `Lỗi: ${err.message}` })
                });
            } else if (itemType === 'cinema') {
                adminApi.deleteCinema(itemId, {
                    success: () => {
                        lib.showNotify({ type: 'success', title: 'Thành Công', message: 'Đã xóa rạp phim.' });
                        closeAllPopups();
                        fetchAndRenderCinemas();
                    },
                    error: (err) => lib.showNotify({ type: 'error', title: 'Thất Bại', message: `Lỗi: ${err.message}` })
                });
            } else if (itemType === 'showtime') {
                adminApi.deleteShowtime(itemId, {
                    success: () => {
                        lib.showNotify({ type: 'success', title: 'Thành Công', message: 'Đã xóa suất chiếu.' });
                        closeAllPopups();
                        fetchAndRenderShowtimes();
                    },
                    error: (err) => lib.showNotify({ type: 'error', title: 'Thất Bại', message: `Lỗi: ${err.message}` })
                });
            }
            return;
        }

        const saveNewsBtn = event.target.closest('#news-form-popup .btn-primary');
        if (saveNewsBtn) {
            const popup = document.getElementById('news-form-popup');
            const form = popup.querySelector('form');
            const newsId = popup.dataset.id;
            const mode = popup.dataset.mode;

            const newsData = {
                title: form.elements['title'].value,
                category: form.elements['category'].value,
                status: form.elements['status'].value,
                content: quillEditor.root.innerHTML,
                thumbnail: form.elements['thumbnail'].value
            };

            const callback = {
                success: () => {
                    lib.showNotify({ type: 'success', title: 'Thành Công', message: `Đã ${mode === 'add' ? 'thêm' : 'cập nhật'} bài viết thành công!` });
                    closeAllPopups();
                    fetchAndRenderNews();
                },
                error: (err) => lib.showNotify({ type: 'error', title: 'Thất Bại', message: `Lỗi: ${err.message}` })
            };

            if (mode === 'add') {
                adminApi.addNews(newsData, callback);
            } else {
                adminApi.updateNews(newsId, newsData, callback);
            }
            return;
        }

        const saveCinemaBtn = event.target.closest('#cinema-form-popup .btn-primary');
        if (saveCinemaBtn) {
            const popup = document.getElementById('cinema-form-popup');
            const form = popup.querySelector('form');
            const cinemaId = popup.dataset.id;
            const mode = popup.dataset.mode;
            const cinemaData = {
                name: form.elements['name'].value,
                address: form.elements['address'].value,
                city: form.elements['city'].value
            };

            const cinemaCallback = {
                success: (savedCinema) => {
                    const savedCinemaId = (mode === 'add') ? savedCinema.id : cinemaId;
                    const roomRows = form.querySelectorAll('.room-input-row');
                    const roomPromises = [];

                    roomRows.forEach(row => {
                        const roomId = row.dataset.roomId;
                        const roomData = {
                            id: row.dataset.roomId ? parseInt(row.dataset.roomId) : null,
                            name: row.querySelector('input[name="roomName"]').value,
                            capacity: parseInt(row.querySelector('input[name="roomCapacity"]').value, 10),
                            screenType: row.querySelector('select[name="roomScreenType"]').value,
                            isActive: row.querySelector('select[name="roomIsActive"]').value === 'true'
                        };

                        if (roomId) { 
                            roomPromises.push(new Promise((resolve, reject) => {
                                adminApi.updateRoom(roomId, roomData, { success: resolve, error: reject });
                            }));
                        } else {
                            roomPromises.push(new Promise((resolve, reject) => {
                                adminApi.createRoom(savedCinemaId, roomData, { success: resolve, error: reject });
                            }));
                        }
                    });
                    Promise.all(roomPromises).then(() => {
                        lib.showNotify({ type: 'success', title: 'Thành Công', message: `Đã ${mode === 'add' ? 'thêm' : 'cập nhật'} rạp phim và các phòng!` });
                        closeAllPopups();
                        fetchAndRenderCinemas();
                    }).catch(err => {
                        lib.showNotify({ type: 'error', title: 'Lỗi phòng', message: `Lỗi khi lưu phòng: ${err.message}` });
                    });
                },
                error: (err) => lib.showNotify({ type: 'error', title: 'Thất Bại', message: `Lỗi khi lưu rạp: ${err.message}` })
            };

            if (mode === 'add') {
                adminApi.addCinema(cinemaData, cinemaCallback);
            } else {
                adminApi.updateCinema(cinemaId, cinemaData, cinemaCallback);
            }
            return;
        }

        const addRoomBtn = event.target.closest('#add-room-btn');
        if (addRoomBtn) {
            const container = document.getElementById('room-management-container');
            if (container) {
                container.insertAdjacentHTML('beforeend', createRoomInputRow());
            }
            return;
        }
        const deleteRoomBtn = event.target.closest('.delete-room-btn');
        if (deleteRoomBtn) {
            const roomRow = deleteRoomBtn.closest('.room-input-row');
            const roomId = roomRow.dataset.roomId;
            if (!roomId) {
                roomRow.remove();
                return;
            }
            if (confirm(`Bạn có chắc muốn xóa phòng này không? Hành động này không thể hoàn tác.`)) {
                adminApi.deleteRoom(roomId, {
                    success: () => {
                        lib.showNotify({ type: 'success', title: 'Thành Công', message: 'Đã xóa phòng.' });
                        roomRow.remove();
                    },
                    error: (err) => lib.showNotify({ type: 'error', title: 'Thất Bại', message: err.message || 'Không thể xóa phòng.' })
                });
            }
            return;
        }
    });
    overlays.forEach(overlay => overlay.addEventListener("click", e => {
        if (e.target === overlay) {
            closeAllPopups();
        }
    }));
    document.addEventListener("keydown", e => {
        if (e.key === "Escape") {
            closeAllPopups();
        }
    });
}



function handlePopupOpen(button) {
    const targetPopupId = button.dataset.popupTarget;
    const targetPopup = document.querySelector(targetPopupId);
    if (!targetPopup) return;

    const form = targetPopup.querySelector("form");
    const titleElement = targetPopup.querySelector(".modal-title");
    const data = button.dataset;

    if (form) form.reset();
    targetPopup.dataset.id = data.id || '';

    switch (targetPopupId) {
        // case "#movie-form-popup":
        //     const posterUrlInput = form.elements['posterUrl'];
        //     const posterPreview = document.getElementById('poster-preview');

        //     if (button.classList.contains("js-add-button")) {
        //         titleElement.textContent = "Thêm Phim Mới";
        //         targetPopup.dataset.mode = "add";
        //         if (posterPreview) posterPreview.style.display = 'none';
        //         if (posterUrlInput) posterUrlInput.value = '';
        //     } else if (button.classList.contains("js-edit-button")) {
        //         titleElement.textContent = `Sửa Phim: ${data.title}`;
        //         targetPopup.dataset.mode = "edit";
        //         form.elements["title"].value = data.title || "";
        //         form.elements["genres"].value = data.genres || "";
        //         form.elements["duration"].value = data.duration || "";
        //         form.elements["description"].value = data.description || "";
        //         form.elements["trailerUrl"].value = data.trailerUrl || "";
        //         const statusFromServer = data.status || "NOW_SHOWING";
        //         form.elements["status"].value = statusFromServer.toLowerCase().replace('_', '-');
        //         const currentPosterUrl = data.posterUrl || '';

        //         if (posterUrlInput) {
        //             posterUrlInput.value = currentPosterUrl;
        //         }

        //         if (posterPreview) {
        //             if (currentPosterUrl) {
        //                 posterPreview.src = currentPosterUrl;
        //                 posterPreview.style.display = 'block';
        //             } else {
        //                 posterPreview.style.display = 'none';
        //             }
        //         }
        //     }
        //     break;
        case "#movie-form-popup":
            const posterFileInput = form.querySelector('input[name="posterFile"]');
            const posterUrlInput = form.elements['posterUrl'];
            const posterPreview = document.getElementById('poster-preview');

            if (button.classList.contains("js-add-button")) {
                titleElement.textContent = "Thêm Phim Mới";
                targetPopup.dataset.mode = "add";
                if (posterPreview) posterPreview.style.display = 'none';
                if (posterUrlInput) posterUrlInput.value = '';
                if (posterFileInput) posterFileInput.value = '';
            } else if (button.classList.contains("js-edit-button")) {
                titleElement.textContent = `Sửa Phim: ${data.title}`;
                targetPopup.dataset.mode = "edit";

                const movieId = parseInt(data.id);
                const movieData = currentMovieList.find(m => m.id === movieId);
                if (!movieData) {
                    lib.showNotify({ type: 'error', title: 'Lỗi', message: 'Không tìm thấy dữ liệu phim.' });
                    return;
                }

                form.elements["title"].value = movieData.title || "";
                form.elements["genres"].value = movieData.genres || "";
                // **SỬA LẠI TÊN TRƯỜNG CHO ĐÚNG**
                form.elements["duration"].value = movieData.durationInMinutes || "";
                form.elements["description"].value = movieData.description || "";
                form.elements["trailerUrl"].value = movieData.trailerUrl || "";
                form.elements["status"].value = (movieData.status || "NOW_SHOWING").toLowerCase().replace('_', '-');

                const currentPosterUrl = movieData.posterUrl || '';
                if (posterUrlInput) posterUrlInput.value = currentPosterUrl;
                if (posterPreview) {
                    posterPreview.src = currentPosterUrl;
                    posterPreview.style.display = currentPosterUrl ? 'block' : 'none';
                }
                if (posterFileInput) posterFileInput.value = '';
            }
            break;

        case "#user-form-popup":
            titleElement.textContent = `Sửa vai trò: ${data.name}`;
            const userId = parseInt(data.id);
            const userData = currentUserList.find(u => u.id === userId);
            if (!userData) {
                lib.showNotify({ type: 'error', title: 'Lỗi', message: 'Không tìm thấy dữ liệu người dùng.' });
                return;
            }

            form.elements["name"].value = userData.fullname || userData.fullName || "";
            form.elements["email"].value = userData.email || "";
            form.elements["role"].value = (userData.role || "USER").toLowerCase();
            break;

        case "#delete-confirm-popup":
            const confirmText = targetPopup.querySelector("p");
            if (confirmText)
                confirmText.innerHTML = `Bạn có chắc chắn muốn xóa <strong>${data.itemName || "mục này"}</strong>?<br>Hành động này không thể hoàn tác.`;
            targetPopup.dataset.id = data.id;
            targetPopup.dataset.itemType = data.itemType;
            break;

        case "#cinema-form-popup":
            const roomContainer = targetPopup.querySelector('#room-management-container');
            roomContainer.innerHTML = ''; // Luôn dọn dẹp container phòng

            if (button.classList.contains("js-add-button")) {
                titleElement.textContent = "Thêm Rạp Mới";
                targetPopup.dataset.mode = "add";
                // Thêm sẵn một dòng để người dùng nhập
                roomContainer.innerHTML = createRoomInputRow();
            } else if (button.classList.contains("js-edit-button")) {
                titleElement.textContent = `Sửa thông tin Rạp: ${data.name}`;
                targetPopup.dataset.mode = "edit";

                // Điền thông tin cơ bản
                form.elements["name"].value = data.name || "";
                form.elements["address"].value = data.address || "";
                form.elements["city"].value = data.city || "";

                // Gọi API để lấy thông tin chi tiết (bao gồm cả phòng)
                const cinemaId = data.id;
                adminApi.getCinemaById(cinemaId, {
                    success: (cinema) => {
                        if (cinema.rooms && cinema.rooms.length > 0) {
                            cinema.rooms.forEach(room => {
                                roomContainer.insertAdjacentHTML('beforeend', createRoomInputRow(room));
                            });
                        } else {
                            // Nếu không có phòng nào, thêm sẵn một dòng trống
                            roomContainer.innerHTML = createRoomInputRow();
                        }
                    },
                    error: (err) => lib.showNotify({ type: 'error', title: 'Lỗi', message: 'Không thể tải chi tiết rạp.' })
                });
            }
            break;

        case "#news-form-popup":
            // const form = targetPopup.querySelector('form');
            const hiddenInput = form.querySelector('input[name="thumbnail"]');
            const previewImg = form.querySelector('.thumbnail-preview');
            const fileInput = form.querySelector('input[name="thumbnailFile"]');

            if (button.classList.contains("js-add-button")) {
                titleElement.textContent = "Viết Bài Mới";
                targetPopup.dataset.mode = "add";
                if (hiddenInput) hiddenInput.value = '';
                if (previewImg) {
                    previewImg.src = '';
                    previewImg.style.display = 'none';
                }
                if (fileInput) fileInput.value = '';
                if (quillEditor) quillEditor.setText('');

            } else if (button.classList.contains("js-edit-button")) {
                titleElement.textContent = `Sửa Bài Viết: ${data.title}`;
                targetPopup.dataset.mode = "edit";
                const newsId = parseInt(data.id);
                const newsData = currentNewsList.find(news => news.id === newsId);

                if (!newsData) {
                    lib.showNotify({ type: 'error', title: 'Lỗi', message: 'Không tìm thấy dữ liệu bài viết.' });
                    return;
                }
                form.elements["title"].value = newsData.title || "";
                form.elements["category"].value = newsData.category || "review";
                form.elements["status"].value = newsData.status || "draft";

                if (quillEditor) {
                    quillEditor.clipboard.dangerouslyPasteHTML(0, newsData.content || '');
                }

                const currentThumbnailUrl = newsData.thumbnail || '';
                if (hiddenInput) hiddenInput.value = currentThumbnailUrl;
                if (previewImg) {
                    if (currentThumbnailUrl) {
                        previewImg.src = currentThumbnailUrl;
                        previewImg.style.display = 'block';
                    } else {
                        previewImg.style.display = 'none';
                    }
                }
                if (fileInput) fileInput.value = '';
            }
            break;
        case "#schedule-form-popup":
            titleElement.textContent = "Sửa Lịch Chiếu";
            form.elements["movie"].value = data.movie || "";
            form.elements["cinema"].value = data.cinema || "";
            form.elements["date"].value = data.date || "";
            form.elements["time"].value = data.time || "";
            targetPopup.dataset.id = data.id;
            break;

        case "#logout-confirm-popup":
            break;
    }
    targetPopup.classList.add("active");
}

function fetchAndRenderUsers(query = "") {
    adminApi.getUsers({
        success: (pageData) => {
            currentUserList = pageData.content || [];
            renderUserTable(currentUserList);
        },
        error: (err) => {
            console.error("Lỗi fetch user:", err);
            const tbody = document.getElementById("user-list");
            if (tbody)
                tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: red;">Không thể tải dữ liệu. Vui lòng kiểm tra lại.</td></tr>`;
        }
    }, query);
}

function renderUserTable(users) {
    const tbody = document.getElementById("user-list");
    if (!tbody) return;
    tbody.innerHTML = "";
    users.forEach(user => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${user.fullname || user.fullName || ""}</td>
            <td>${user.email || ""}</td>
            <td>${user.joinDate || ""}</td>
            <td>${user.role || ""}</td>
            <td>
                <button class="action-btn edit js-open-popup js-edit-button"
                    data-popup-target="#user-form-popup"
                    data-id="${user.id}"
                    data-name="${user.fullname || user.fullName || ""}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete js-open-popup"
                    data-popup-target="#delete-confirm-popup"
                    data-id="${user.id}"
                    data-item-type="user" 
                    data-item-name="người dùng ${user.fullname || user.fullName || ""}">
                    <i class="fas fa-user-slash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function fetchAndRenderMovies(query = "") {
    const tbody = document.querySelector("#manage-movies tbody");
    if (!tbody) return;
    adminApi.getMovies({
        success: (pageData) => {
            currentMovieList = pageData.content || [];
            renderMoviesTable(currentMovieList);
        },
        error: (err) => {
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: red;">Không thể tải danh sách phim.</td></tr>`;
        }
    }, query);
}

function renderMoviesTable(movies) {
    const tbody = document.querySelector("#manage-movies tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    movies.forEach(movie => {
        const row = document.createElement("tr");
        const statusClass = movie.status.toLowerCase().replace('_', '-');
        row.innerHTML = `
            <td><img src="${movie.posterUrl}" class="table-poster"/></td>
            <td>${movie.title}</td>
            <td>${movie.durationInMinutes} phút</td>
            <td>${movie.genres || ''}</td>
            <td><span class="status-tag ${statusClass}">${movie.status.replace('_', ' ')}</span></td>
            <td>
                <button class="action-btn edit js-open-popup js-edit-button" 
                    data-popup-target="#movie-form-popup" 
                    data-id="${movie.id}"
                    data-title="${movie.title}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn trailer-btn" data-trailer-url="${movie.trailerUrl || ''}" data-title="${movie.title}"><i class="fas fa-play-circle"></i></button>
                <button class="action-btn delete js-open-popup" data-popup-target="#delete-confirm-popup" data-item-type="movie" data-id="${movie.id}" data-item-name="${movie.title}"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}


function uploadFile(file, callbacks = {}) {
    const formData = new FormData();
    formData.append('file', file);

    $.ajax({
        url: `${API_BASE_URL}/files/upload`,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
        },
        success: callbacks.success,
        error: (jqXHR) => {
            if (callbacks.error) {
                const errorData = jqXHR.responseJSON || { error: 'Lỗi không xác định.' };
                callbacks.error(errorData);
            }
        },
        xhr: function () {
            const xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener('progress', function (evt) {
                if (evt.lengthComputable && callbacks.progress) {
                    const percentComplete = evt.loaded / evt.total * 100;
                    callbacks.progress(percentComplete);
                }
            }, false);
            return xhr;
        }
    });
}

function setupTrailerViewer() {
    const trailerContainer = document.getElementById('trailer-viewer-container');
    const trailerIframe = document.getElementById('trailer-iframe');
    const trailerTitle = document.getElementById('trailer-movie-title');
    const closeTrailerBtn = document.getElementById('close-trailer-btn');
    const movieTableBody = document.querySelector("#manage-movies tbody");

    if (!trailerContainer || !movieTableBody) return;

    function getYouTubeEmbedUrl(url) {
        if (!url) return "";
        let videoId = '';
        if (url.includes("youtube.com/watch?v=")) {
            videoId = url.split('v=')[1].split('&')[0];
        } else if (url.includes("youtu.be/")) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
    }

    movieTableBody.addEventListener('click', function (event) {
        const trailerButton = event.target.closest('.trailer-btn');
        if (trailerButton) {
            const url = trailerButton.dataset.trailerUrl;
            const title = trailerButton.dataset.title;
            const embedUrl = getYouTubeEmbedUrl(url);

            if (embedUrl) {
                trailerTitle.textContent = `Trailer: ${title}`;
                trailerIframe.src = embedUrl;
                trailerContainer.classList.add('active');
            } else {
                lib.showNotify({ type: 'warning', title: 'URL không hợp lệ', message: 'URL trailer trống hoặc không được hỗ trợ.' });
            }
        }
    });

    closeTrailerBtn.addEventListener('click', () => {
        trailerContainer.classList.remove('active');
        trailerIframe.src = "";
    });
}

function setupGlobalSearch() {
    const searchInput = document.getElementById('global-search-input');
    if (!searchInput) return;
    const searchHandlers = {
        'manage-users': fetchAndRenderUsers,
        'manage-movies': fetchAndRenderMovies,
        'manage-news': fetchAndRenderNews,
        'manage-cinemas': fetchAndRenderCinemas
    };

    let searchTimeout;

    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);

        const query = searchInput.value.trim();
        const activeSection = document.querySelector('.content-section.active');
        if (!activeSection) return;

        const activeTabId = activeSection.id;
        const handler = searchHandlers[activeTabId];

        if (handler) {
            searchTimeout = setTimeout(() => {
                handler(query);
            }, 300);
        }
    });
}

function fetchAndRenderNews(query = "") {
    const tbody = document.querySelector("#manage-news tbody");
    if (!tbody) return;

    adminApi.getNews({
        success: (pageData) => {
            // **LOGIC MỚI: LƯU DỮ LIỆU VÀO BIẾN TẠM THỜI**
            currentNewsList = pageData.content || [];
            renderNewsTable(currentNewsList);
        },
        error: (err) => {
            console.error("Lỗi khi tải tin tức:", err);
            tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; color: red;">Không thể tải dữ liệu tin tức.</td></tr>`;
        }
    }, query);
}
function renderNewsTable(newsList) {
    const tbody = document.querySelector("#manage-news tbody");
    if (!tbody) return;

    tbody.innerHTML = "";
    if (newsList.length === 0) {
        // Cập nhật colspan để khớp với số cột mới (7 cột)
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Chưa có bài viết nào.</td></tr>`;
        return;
    }

    newsList.forEach(news => {
        const row = document.createElement("tr");
        const statusClass = news.status === 'published' ? 'published' : 'draft';
        const statusText = news.status === 'published' ? 'Đã xuất bản' : 'Bản nháp';
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = news.content || '';
        const plainTextContent = tempDiv.textContent || tempDiv.innerText || '';
        const excerpt = plainTextContent.substring(0, 50) + (plainTextContent.length > 50 ? '...' : '');

        row.innerHTML = `
            <td><img src="${news.thumbnail || 'https://via.placeholder.com/50x75'}" class="table-poster"/></td>
            <td>${news.title}</td>
            <td>${excerpt}</td>
            <td>${news.category}</td>
            <td>${new Date(news.createdAt).toLocaleDateString('vi-VN')}</td>
            <td><span class="status-tag ${statusClass}">${statusText}</span></td>
            <td>
                <button class="action-btn edit js-open-popup js-edit-button"
                    data-popup-target="#news-form-popup"
                    data-id="${news.id}"
                    data-title="${news.title}"
                    data-category="${news.category}"
                    data-status="${news.status}"
                    data-thumbnail="${news.thumbnail || ''}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete js-open-popup"
                    data-popup-target="#delete-confirm-popup"
                    data-item-type="news"
                    data-id="${news.id}"
                    data-item-name="bài viết '${news.title}'">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}



let quillEditor;

function initializeQuillEditor() {
    // Chỉ khởi tạo nếu tìm thấy element
    if (document.getElementById('news-content-editor')) {
        quillEditor = new Quill('#news-content-editor', {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, false] }],
                    ['bold', 'italic', 'underline'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['link', 'image', 'code-block'],
                    ['clean']
                ]
            },
            placeholder: 'Soạn thảo nội dung bài viết ở đây...'
        });
    }
}

/**
 * Thiết lập chức năng nhập nội dung từ file .docx
 */
function setupDocxImport() {
    const importBtn = document.getElementById('import-docx-btn');
    const fileInput = document.getElementById('docx-file-input');
    if (!importBtn || !fileInput) return;

    // Khi bấm nút "Nhập", giả lập một cú click vào input file ẩn
    importBtn.addEventListener('click', () => {
        fileInput.click();
    });

    // Khi người dùng đã chọn một file
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        lib.showNotify({ type: 'info', title: 'Đang xử lý', message: 'Vui lòng chờ trong khi chuyển đổi file...' });

        const reader = new FileReader();
        reader.onload = function (loadEvent) {
            const arrayBuffer = loadEvent.target.result;
            // Dùng mammoth.js để chuyển đổi
            mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
                .then(result => {
                    if (quillEditor) {
                        quillEditor.clipboard.dangerouslyPasteHTML(0, result.value);
                        lib.showNotify({ type: 'success', title: 'Thành công', message: 'Đã nhập nội dung!' });
                    }
                })
                .catch(err => {
                    console.error("Lỗi khi chuyển đổi DOCX:", err);
                    lib.showNotify({ type: 'error', title: 'Lỗi', message: 'Không thể đọc file .docx này.' });
                });
        };

        reader.readAsArrayBuffer(file);
        fileInput.value = '';
    });
}

function fetchAndRenderCinemas(query = "") {
    const tbody = document.querySelector("#manage-cinemas tbody");
    if (!tbody) return;

    adminApi.getCinemas({
        success: (pageData) => {
            renderCinemasTable(pageData.content || []);
            // Thêm logic phân trang ở đây nếu cần
        },
        error: (err) => {
            console.error("Lỗi khi tải danh sách rạp:", err);
            tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color: red;">Không thể tải dữ liệu rạp phim.</td></tr>`;
        }
    }, query);
}

function renderCinemasTable(cinemas) {
    const tbody = document.querySelector("#manage-cinemas tbody");
    if (!tbody) return;

    tbody.innerHTML = "";
    if (cinemas.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Chưa có rạp phim nào.</td></tr>`;
        return;
    }

    cinemas.forEach(cinema => {
        const row = document.createElement("tr");
        // Lấy số lượng phòng chiếu từ danh sách rooms
        const roomCount = cinema.rooms ? cinema.rooms.length : 0;

        row.innerHTML = `
            <td>${cinema.name}</td>
            <td>${cinema.address}</td>
            <td>${cinema.city}</td>
            <td>${roomCount}</td>
            <td>
                <button class="action-btn edit js-open-popup js-edit-button"
                    data-popup-target="#cinema-form-popup"
                    data-id="${cinema.id}"
                    data-name="${cinema.name}"
                    data-address="${cinema.address}"
                    data-city="${cinema.city}"
                    data-rooms="${roomCount}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete js-open-popup"
                    data-popup-target="#delete-confirm-popup"
                    data-item-type="cinema"
                    data-id="${cinema.id}"
                    data-item-name="rạp '${cinema.name}'">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function fetchAndRenderShowtimes() {
    const tbody = document.getElementById('schedules-list');
    if (!tbody) return;

    adminApi.getShowtimes({
        success: (pageData) => {
            renderShowtimesTable(pageData.content || []);
        },
        error: (err) => {
            console.error("Lỗi khi tải lịch chiếu:", err);
            tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: red;">Không thể tải dữ liệu lịch chiếu.</td></tr>`;
        }
    });
}

function renderShowtimesTable(showtimes) {
    const tbody = document.getElementById('schedules-list');
    if (!tbody) return;
    tbody.innerHTML = "";

    if (showtimes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">Chưa có lịch chiếu nào.</td></tr>`;
        return;
    }

    showtimes.forEach(st => {
        const row = document.createElement('tr');
        const startTime = new Date(st.startTime);
        const formattedTime = `${startTime.getHours().toString().padStart(2, '0')}:${startTime.getMinutes().toString().padStart(2, '0')} ${startTime.toLocaleDateString('vi-VN')}`;
        const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(st.price);

        row.innerHTML = `
            <td>${st.movieTitle}</td>
            <td>${st.cinemaName}</td>
            <td>${st.roomName}</td>
            <td>${formattedTime}</td>
            <td>${formattedPrice}</td>
            <td>
                <button class="action-btn delete js-open-popup"
                    data-popup-target="#delete-confirm-popup"
                    data-item-type="showtime"
                    data-id="${st.id}"
                    data-item-name="suất chiếu phim ${st.movieTitle} lúc ${formattedTime}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}


function setupScheduleManagement() {
    const cinemaSelect = document.getElementById('schedule-cinema-select');
    const roomSelect = document.getElementById('schedule-room-select');
    const movieSelect = document.getElementById('schedule-movie-select');
    const scheduleForm = document.getElementById('schedule-form');

    if (!scheduleForm) return;

    let cinemasData = [];
    let moviesData = [];
    function populateInitialData() {
        adminApi.getCinemasWithRooms({
            success: (data) => {
                cinemasData = data;
                cinemaSelect.innerHTML = '<option value="">-- Chọn rạp --</option>';
                cinemasData.forEach(cinema => {
                    cinemaSelect.innerHTML += `<option value="${cinema.id}">${cinema.name}</option>`;
                });
            }
        });
        adminApi.getMovies({
            success: (moviePage) => {
                moviesData = moviePage.content; 
                movieSelect.innerHTML = '<option value="">-- Chọn phim --</option>';
                moviesData.forEach(movie => {
                    movieSelect.innerHTML += `<option value="${movie.id}">${movie.title}</option>`;
                });
            }
        });
    }

    // Khi chọn rạp -> hiển thị phòng
    cinemaSelect.addEventListener('change', () => {
        const cinemaId = parseInt(cinemaSelect.value);
        const selectedCinema = cinemasData.find(c => c.id === cinemaId);

        roomSelect.innerHTML = '<option value="">-- Chọn phòng --</option>';
        if (selectedCinema && selectedCinema.rooms) {
            selectedCinema.rooms.forEach(room => {
                roomSelect.innerHTML += `<option value="${room.id}">${room.name}</option>`;
            });
            roomSelect.disabled = false;
        } else {
            roomSelect.disabled = true;
            roomSelect.innerHTML = '<option value="">-- Chờ chọn rạp --</option>';
        }
    });

    scheduleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const form = e.target;
        const movieId = form.elements['movie'].value;
        const date = form.elements['date'].value;
        const time = form.elements['time'].value;

        if (!movieId || !date || !time) {
            lib.showNotify({ type: 'error', title: 'Thiếu thông tin', message: 'Vui lòng chọn phim, ngày và giờ chiếu.' });
            return;
        }

        const selectedMovie = moviesData.find(m => m.id == movieId);
        if (!selectedMovie) {
            lib.showNotify({ type: 'error', title: 'Lỗi', message: 'Không tìm thấy thông tin phim đã chọn.' });
            return;
        }

        const startTimeObj = new Date(`${date}T${time}:00`);
        const endTimeObj = new Date(startTimeObj.getTime() + selectedMovie.durationInMinutes * 60000);
        const formatDateTimeLocal = (date) => {
            const pad = (num) => num.toString().padStart(2, '0');
            return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
        };

        const startTime = formatDateTimeLocal(startTimeObj);
        const endTime = formatDateTimeLocal(endTimeObj);
        const showtimeData = {
            roomId: form.elements['room'].value,
            movieId: movieId,
            startTime: startTime,
            endTime: endTime,
            price: form.elements['price'].value
        };

        adminApi.createShowtime(showtimeData, {
            success: () => {
                lib.showNotify({ type: 'success', title: 'Thành công', message: 'Đã tạo lịch chiếu mới.' });
                form.reset();
                roomSelect.innerHTML = '<option value="">-- Chờ chọn rạp --</option>';
                roomSelect.disabled = true;
                fetchAndRenderShowtimes();
            },
            error: (err) => lib.showNotify({ type: 'error', title: 'Thất bại', message: err.message || 'Không thể tạo lịch chiếu.' })
        });
    });

    populateInitialData();
}

function createRoomInputRow(room = {}) {
    const roomId = room.id || '';
    const roomName = room.name || '';
    const roomCapacity = room.capacity || '';
    const screenType = room.screenType || '_2D';
    const isActive = room.isActive !== undefined ? room.isActive : true;

    return `
        <div class="room-input-row" data-room-id="${roomId}">
            <div class="form-group">
                <label>Tên phòng</label>
                <input type="text" name="roomName" value="${roomName}" placeholder="Ví dụ: Phòng 1" required>
            </div>
            <div class="form-group">
                <label>Sức chứa</label>
                <input type="number" name="roomCapacity" value="${roomCapacity}" placeholder="Ví dụ: 120" required>
            </div>
            <div class="form-group">
                <label>Loại màn hình</label>
                <select name="roomScreenType">
                    <option value="_2D" ${screenType === '_2D' ? 'selected' : ''}>2D</option>
                    <option value="_3D" ${screenType === '_3D' ? 'selected' : ''}>3D</option>
                    <option value="IMAX" ${screenType === 'IMAX' ? 'selected' : ''}>IMAX</option>
                    <option value="GOLD_CLASS" ${screenType === 'GOLD_CLASS' ? 'selected' : ''}>Gold Class</option>
                </select>
            </div>
            <div class="form-group">
                <label>Trạng thái</label>
                <select name="roomIsActive">
                    <option value="true" ${isActive === true ? 'selected' : ''}>Hoạt động</option>
                    <option value="false" ${isActive === false ? 'selected' : ''}>Không hoạt động</option>
                </select>
            </div>
            <div class="room-actions">
                <button type="button" class="action-btn delete-room-btn"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `;
}


