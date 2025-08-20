document.addEventListener("DOMContentLoaded", function () {
    const authApi = {
        register: (registerData, callbacks) => {
            lib.post({
                url: `${API_BASE_URL}/auth/register`,
                data: JSON.stringify(registerData),
                ...callbacks
            });
        },
        login: (loginCredentials, callbacks) => {
            lib.post({
                url: `${API_BASE_URL}/auth/login`,
                data: JSON.stringify(loginCredentials),
                ...callbacks
            });
        }
    };


    function updateHeaderUI(isLoggedIn, userData = null) {
        const loggedOutView = document.getElementById('auth-actions-logged-out');
        const loggedInView = document.getElementById('auth-actions-logged-in');
        if (!loggedOutView || !loggedInView) return;
        if (isLoggedIn && userData) {
            loggedOutView.style.display = 'none';
            loggedInView.style.display = 'flex';
            const fullnameSpan = document.getElementById('header-fullname');
            if (fullnameSpan) fullnameSpan.textContent = userData.fullname;
        } else {
            loggedOutView.style.display = 'flex';
            loggedInView.style.display = 'none';
        }
    }

    function checkLoginStatus() {
        try {
            const token = localStorage.getItem('jwtToken');
            const userDataString = localStorage.getItem('userData');
            if (token && userDataString) {
                const userData = JSON.parse(userDataString);
                updateHeaderUI(true, userData);
            } else {
                updateHeaderUI(false);
            }
        } catch (error) {
            console.error("Lỗi khi đọc trạng thái đăng nhập:", error);
            updateHeaderUI(false);
        }
    }

    function initializeAuthForms() {
        //  form Đăng Ký
        const registerForm = document.getElementById("register-form");
        if (registerForm) {
            registerForm.addEventListener("submit", function (e) {
                e.preventDefault();
                const payload = {
                    fullname: document.getElementById("reg-fullname").value.trim(),
                    email: document.getElementById("reg-email").value.trim(),
                    phoneNumber: document.getElementById("req-phone-number").value.trim(),
                    password: document.getElementById("reg-password").value,
                    confirmPassword: document.getElementById("reg-confirm-password").value
                };
                authApi.register(payload, {
                    success: (response) => {
                        // alert("Đăng ký thành công! Vui lòng đăng nhập.");
                        // lib.showNotify({
                        //     type: 'success',
                        //     title: 'Đăng Ký Thành Công',
                        //     message: 'Tài khoản của bạn đã được tạo. Vui lòng đăng nhập để tiếp tục.'
                        // });
                        // openLoginPopup();
                        closeAllPopups();


                        lib.showNotify({
                            type: 'success',
                            title: 'Đăng Ký Thành Công',
                            message: 'Tài khoản của bạn đã được tạo. Vui lòng đăng nhập để tiếp tục.'
                        });

                        const notifyPopup = document.getElementById('notify-popup');
                        if (notifyPopup) {

                            const observer = new MutationObserver((mutationsList, obs) => {
                                for (const mutation of mutationsList) {

                                    if (mutation.attributeName === 'class' && !notifyPopup.classList.contains('active')) {

                                        openLoginPopup();
                                        obs.disconnect();
                                        return;
                                    }
                                }
                            });

                            observer.observe(notifyPopup, { attributes: true });
                        }
                    },
                    error: (error) => {
                        console.error("Lỗi đăng ký:", error);
                        // alert(`Lỗi đăng ký: ${error.message || 'Vui lòng thử lại.'}`);
                        lib.showNotify({
                            type: 'error',
                            title: 'Đăng Ký Thất Bại',
                            message: error.message || 'Đã có lỗi xảy ra, vui lòng thử lại.'
                        });
                    }
                });
            });
        }
        // form Đăng Nhập
        const loginForm = document.getElementById("login-form");
        if (loginForm) {
            loginForm.addEventListener("submit", function (e) {
                e.preventDefault();
                const payload = {
                    email: document.getElementById("email").value.trim(),
                    password: document.getElementById("password").value
                };
                authApi.login(payload, {
                    success: (data) => {
                        if (data.token) {
                            const userData = {
                                fullname: data.user.fullName,
                                role: data.user.role,
                                email: data.user.email
                            };
                            localStorage.setItem("jwtToken", data.token);
                            localStorage.setItem("userData", JSON.stringify(userData));
                            updateHeaderUI(true, userData);
                            closeAllPopups();
                            if (userData.role?.toUpperCase() === "ADMIN") {
                                window.open('/admin/index.html', '_blank');
                            }
                        } else {
                            // alert(`Đăng nhập thất bại: Phản hồi từ server không hợp lệ.`);
                            lib.showNotify({
                                type: 'error',
                                title: 'Đăng Nhập Thất Bại',
                                message: 'Phản hồi từ máy chủ không hợp lệ. Vui lòng thử lại.'
                            });
                        }
                    },
                    error: (error) => {
                        console.error("Lỗi đăng nhập:", error);
                        // alert(`Đăng nhập thất bại: ${error.message || 'Sai thông tin đăng nhập.'}`);
                        lib.showNotify({
                            type: 'error',
                            title: 'Đăng Nhập Thất Bại',
                            message: error.message || 'Sai email hoặc mật khẩu. Vui lòng thử lại.'
                        });
                    }
                });
            });
        }
    }

    function initializePopupLogic() {
        const loginPopup = document.getElementById('login-popup');
        const registerPopup = document.getElementById('register-popup');
        if (!loginPopup || !registerPopup) return;
        document.querySelectorAll('.js-open-popup, #login-trigger-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = btn.dataset.popupTarget;
                if (targetId === '#login-popup') openLoginPopup();
            });
        });
        document.getElementById('switch-to-register').addEventListener('click', openRegisterPopup);
        document.getElementById('switch-to-login').addEventListener('click', openLoginPopup);
        document.querySelectorAll('.close-popup').forEach(button => button.addEventListener('click', closeAllPopups));
        // document.querySelectorAll('.popup-overlay').forEach(overlay => {
        //     overlay.addEventListener('click', (e) => {
        //         if (e.target === overlay) closeAllPopups();
        //     });
        // });
        document.querySelectorAll('.popup-overlay:not(#notify-popup)').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) closeAllPopups();
            });
        });
    }

    function initializeNotifyPopupLogic() {
        const notifyPopup = document.getElementById('notify-popup');
        if (!notifyPopup) return;
        const closeButtons = notifyPopup.querySelectorAll('.close-modal-btn');
        const closeNotify = () => {
            notifyPopup.classList.remove('active');
        };

        closeButtons.forEach(btn => {
            btn.addEventListener('click', closeNotify);
        });
        notifyPopup.addEventListener('click', (e) => {
            if (e.target === notifyPopup) {
                closeNotify();
            }
        });
    }


    function closeAllPopups() {
        const loginPopup = document.getElementById('login-popup');
        const registerPopup = document.getElementById('register-popup');
        if (loginPopup) loginPopup.classList.remove('show');
        if (registerPopup) registerPopup.classList.remove('show');
    }
    function openLoginPopup(e) {
        if (e) e.preventDefault();
        closeAllPopups();
        document.getElementById('login-popup')?.classList.add('show');
    }

    function openRegisterPopup(e) {
        if (e) e.preventDefault();
        closeAllPopups();
        document.getElementById('register-popup')?.classList.add('show');
    }

    function setActiveNavLink() {
        const navLinks = document.querySelectorAll('.nav-links a');
        let currentPage = window.location.pathname.split('/').pop();
        if (currentPage === '' || currentPage === 'index.html') {
            currentPage = 'index.html';
        }
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').endsWith(currentPage)) {
                link.classList.add('active');
            }
        });
    }

    function initializeUserMenu() {
        const trigger = document.getElementById('user-menu-trigger');
        const dropdown = document.getElementById('user-menu-dropdown');
        if (!trigger || !dropdown) return;
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
            trigger.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && !trigger.contains(e.target)) {
                dropdown.classList.remove('show');
                trigger.classList.remove('active');
            }
        });
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('userData');
                window.location.reload();
            });
        }
    }

    function initializeStorageListener() {
    window.addEventListener('storage', function(event) {
        console.log('Storage changed in another tab:', event.key);
        if (event.key === 'jwtToken' || event.key === 'userData') {
            checkLoginStatus();
        }
    });
}



    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    const fetchHeader = headerPlaceholder ? fetch('/pages/header.html').then(res => res.text()) : Promise.resolve(null);
    const fetchFooter = footerPlaceholder ? fetch('/pages/footer.html').then(res => res.text()) : Promise.resolve(null);
    Promise.all([fetchHeader, fetchFooter])
        .then(([headerData, footerData]) => {
            if (headerData) headerPlaceholder.innerHTML = headerData;
            if (footerData) footerPlaceholder.innerHTML = footerData;

            console.log("Header/Footer đã tải xong. Bắt đầu khởi tạo sự kiện.");
            initializePopupLogic();
            setActiveNavLink();
            initializeAuthForms();
            checkLoginStatus();
            initializeUserMenu();
            initializeNotifyPopupLogic();
            initializeStorageListener();

            const currentPage = window.location.pathname.split('/').pop();
            if (currentPage === '' || currentPage === 'index.html') {
                if (typeof initializeHomepage === 'function') {
                    initializeHomepage();
                }
            }

            console.log("Tất cả các script đã được khởi tạo thành công.");
        })
        .catch(error => console.error('Lỗi nghiêm trọng khi tải header/footer:', error));
});