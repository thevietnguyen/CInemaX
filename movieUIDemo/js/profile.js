document.addEventListener("DOMContentLoaded", function () {
    const userApi = {
        /**
         * @param {object} callbacks
         */
        getProfile: (callbacks) => {
            lib.get({
                url: `${API_BASE_URL}/users/me`,
                ...callbacks
            });
        },

        /**
         * @param {object} updateData - cập nhật { fullName, phoneNumber }.
         * @param {object} callbacks - complete, error.
         */
        updateProfile: (updateData, callbacks) => {
            lib.patch({
                url: `${API_BASE_URL}/users/me`,
                data: JSON.stringify(updateData),
                ...callbacks
            });
        },

        changePassword: (passwordData, callbacks) => {
            lib.put({
                url: `${API_BASE_URL}/users/me/password-change`,
                data: JSON.stringify(passwordData),
                ...callbacks
            });
        }
    };

    const tabs = document.querySelectorAll('.account-tab');
    const contentBlocks = document.querySelectorAll('.content-block');

    function showTab(targetId) {
        const idToShow = targetId || 'profile-content';

        tabs.forEach(t => t.classList.remove('active'));
        contentBlocks.forEach(c => c.style.display = 'none');

        const tabToActivate = document.querySelector(`.account-tab[data-target="${idToShow}"]`);
        const contentToShow = document.getElementById(idToShow);

        if (tabToActivate && contentToShow) {
            tabToActivate.classList.add('active');
            contentToShow.style.display = 'block';
        }
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.dataset.target;
            history.pushState(null, '', `#${targetId}`);
            showTab(targetId);
        });
    });
    const initialHash = window.location.hash.substring(1);
    showTab(initialHash);
    const changePasswordForm = document.getElementById('change-password-form');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const payload = {
                oldPassword: this.elements['oldPassword'].value,
                newPassword: this.elements['newPassword'].value,
                confirmPassword: this.elements['confirmPassword'].value
            };
            if (payload.newPassword !== payload.confirmPassword) {
                // alert("Mật khẩu mới và xác nhận không khớp!");
                lib.showNotify({
                    type: 'error',
                    title: 'Mật khẩu xác nhận không khớp',
                    message: 'Mật khẩu xác nhận không khớp.'
                });
                return;
            }
            userApi.changePassword(payload, {
                success: (response) => {
                    // alert(response.message || "Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
                    lib.showNotify({
                        type: 'success',
                        title: 'Thành công',
                        message: response.message || "Đổi mật khẩu thành công! Bạn sẽ được chuyển hướng để đăng nhập lại."
                    });
                    // Chờ 3 giây để người dùng đọc thông báo rồi mới chuyển hướng
                    setTimeout(() => {
                        localStorage.removeItem('jwtToken');
                        localStorage.removeItem('userData');
                        window.location.href = '../index.html';
                    }, 3000);
                },
                error: (error) =>
                    // alert(`Đổi mật khẩu thất bại: ${error.message}`)
                    lib.showNotify({
                        type: 'error',
                        title: 'Đổi mật khẩu thất bại',
                        message: `Đổi mật khẩu thất bại: ${error.message}`
                    }),
            });
        });
    }


    function populateUserData(userData) {
        if (!userData) return;

        console.log("Populating user data:", userData);
        const userFullNameSidebar = document.getElementById('user-fullname');
        if (userFullNameSidebar) userFullNameSidebar.textContent = userData.fullName || 'Không có tên';

        const userEmailSidebar = document.getElementById('user-email');
        if (userEmailSidebar) userEmailSidebar.textContent = userData.email || '';

        const profileFullNameInput = document.getElementById('profile-fullname');
        if (profileFullNameInput) profileFullNameInput.value = userData.fullName || '';

        const profileEmailInput = document.getElementById('profile-email');
        if (profileEmailInput) profileEmailInput.value = userData.email || '';

        const profilePhoneInput = document.getElementById('profile-phone');
        if (profilePhoneInput) profilePhoneInput.value = userData.phoneNumber || '';
    }

    function loadUserProfile() {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            // alert("Vui lòng đăng nhập để xem thông tin tài khoản.");
            lib.showNotify({
                type: 'error',
                title: 'Không tải được thông tin tài khoản',
                message: 'Vui lòng đăng nhập để xem thông tin tài khoản'
            });
            window.location.href = '../index.html';
            return;
        }

        userApi.getProfile({
            success: function (userData) {

                try {
                    populateUserData(userData);
                } catch (e) {
                    console.error("Lỗi khi hiển thị dữ liệu người dùng lên giao diện:", e);
                    lib.showNotify({
                        type: 'error',
                        title: 'Lỗi hiển thị',
                        message: 'Đã xảy ra lỗi khi hiển thị thông tin của bạn. Vui lòng thử lại.'
                    })
                    // alert("Đã xảy ra lỗi khi hiển thị thông tin của bạn. Vui lòng thử lại.");
                }
            },
            error: function (error) {
                console.error("Failed to fetch user profile:", error);
                // alert(`Không thể tải thông tin cá nhân: ${error.message}.`);
                lib.showNotify({
                    type: 'error',
                    title: 'Không tải được thông tin tài khoản',
                    message: `Không thể tải thông tin cá nhân: ${error.message}.`
                });
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('userData');
                window.location.href = '../index.html';
            }
        });
    }

    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const payload = {
                fullName: document.getElementById('profile-fullname').value.trim(),
                phoneNumber: document.getElementById('profile-phone').value.trim()
            };

            console.log("Sending update payload:", payload);

            userApi.updateProfile(payload, {
                success: function (updatedUserData) {
                    // alert('Cập nhật thông tin thành công!');
                    lib.showNotify({
                        type: 'success',
                        title: 'Thành công',
                        message: 'Cập nhật thông tin thành công.'
                    });
                    populateUserData(updatedUserData);

                    try {
                        const localUserData = JSON.parse(localStorage.getItem('userData'));
                        if (localUserData) {
                            localUserData.fullname = updatedUserData.fullName;
                            localStorage.setItem('userData', JSON.stringify(localUserData));
                            document.getElementById('header-fullname').textContent = updatedUserData.fullName;
                        }
                    } catch (e) {
                        console.error("Lỗi cập nhật localStorage:", e);
                    }
                },
                error: function (error) {
                    console.error("Update failed:", error);
                    if (error.fullName || error.phoneNumber) {
                        let errorMessage = "Vui lòng kiểm tra lại thông tin:\n";
                        if (error.fullName) errorMessage += `- Họ tên: ${error.fullName}\n`;
                        if (error.phoneNumber) errorMessage += `- Số điện thoại: ${error.phoneNumber}\n`;
                        alert(errorMessage);
                        lib.showNotify({
                            type: 'error',
                            title: 'Thất bại',
                            message: `Vui lòng kiểm tra lại thông tin: ${errorMessage}.`
                        });
                    } else {
                        alert(`Cập nhật thất bại: ${error.message || 'Vui lòng thử lại.'}`);
                        lib.showNotify({
                            type: 'error',
                            title: 'Thất bại',
                            message: `Cập nhật thất bại: ${error.message || 'Vui lòng thử lại.'}`
                        });
                    }
                }
            });
        });
    }
    const accountLogoutBtn = document.getElementById('account-logout-btn');
    if (accountLogoutBtn) {
        accountLogoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const token = localStorage.getItem('jwtToken');
            if (token) {
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('userData');
                // alert("Bạn đã đăng xuất thành công.");
                window.location.href = '../index.html';
            }
        });
    }

    loadUserProfile();
});