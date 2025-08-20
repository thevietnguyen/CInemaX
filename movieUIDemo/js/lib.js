// File: js/lib.js (Phiên bản cuối cùng cho User)

const API_BASE_URL = "http://localhost:8080/api";
var lib = new lib();

function lib() {
    function apiCall(method, option) {
        if (option.beforePost) {
            option.beforePost();
        }
        const token = localStorage.getItem('jwtToken');
        $.ajax({
            type: method,
            contentType: "application/json",
            url: option.url,
            data: option.data,
            headers: {
                ...(token && { 'Authorization': `Bearer ${token}` })
            },
            dataType: 'json',
            success: function (response) {
                if (option.success) {
                    option.success(response);
                }
            },
            error: function (jqXHR) {
                if (option.error) {
                    const errorData = jqXHR.responseJSON || { message: 'Lỗi không xác định.' };
                    option.error(errorData);
                }
            }
        });
    }

    // Public methods
    this.get = (option) => apiCall('GET', option);
    this.post = (option) => apiCall('POST', option);
    this.put = (option) => apiCall('PUT', option);
    this.patch = (option) => apiCall('PATCH', option);
    this.delete = (option) => apiCall('DELETE', option);


    this.showNotify = function (options) {
        const popup = document.getElementById('notify-popup');
        if (!popup) return;

        const titleEl = popup.querySelector('#notify-title');
        const messageEl = popup.querySelector('#notify-message');
        const iconContainerEl = popup.querySelector('.notify-icon');

        // 1. Cập nhật nội dung
        titleEl.textContent = options.title || 'Thông báo';
        messageEl.textContent = options.message || '';

        // 2. Cập nhật icon và màu sắc
        iconContainerEl.className = 'notify-icon'; // Reset class
        let iconHtml = '';
        switch (options.type) {
            case 'success':
                iconHtml = '<i class="fas fa-check-circle"></i>';
                iconContainerEl.classList.add('success');
                break;
            case 'error':
                iconHtml = '<i class="fas fa-times-circle"></i>';
                iconContainerEl.classList.add('error');
                break;
            case 'warning':
                iconHtml = '<i class="fas fa-exclamation-triangle"></i>';
                iconContainerEl.classList.add('warning');
                break;
            default:
                iconHtml = '<i class="fas fa-info-circle"></i>';
        }
        iconContainerEl.innerHTML = iconHtml;

        // 3. Hiển thị popup
        popup.classList.add('active');
    };
}