
// const API_BASE_URL = "http://localhost:8080/api";
// var lib = new lib();

// function lib() {
//     function apiCall(method, option) {
//         if (option.before) {
//             option.before();
//         }
//         const token = localStorage.getItem('jwtToken');
//         $.ajax({
//             type: method,
//             contentType: "application/json",
//             url: option.url,
//             data: option.data, // Chỉ dùng cho POST, PUT, PATCH
//             headers: {
//                 ...(token && { 'Authorization': `Bearer ${token}` })
//             },
//             dataType: 'json',
//             success: function(response) {
//                 if (option.success) {
//                     option.success(response);
//                 }
//             },
//             error: function(jqXHR) {
//                 if (option.error) {
//                     const errorData = jqXHR.responseJSON || { message: 'Lỗi không xác định.' };
//                     option.error(errorData);
//                 }
//             },
//             complete: function() {
//                 if (option.complete) {
//                     option.complete();
//                 }
//             }
//         });
//     }

//     this.get = (option) => apiCall('GET', option);
//     this.post = (option) => apiCall('POST', option);
//     this.put = (option) => apiCall('PUT', option);
//     this.delete = (option) => apiCall('DELETE', option);
// }

const API_BASE_URL = "http://localhost:8080/api";
var lib = new lib();

function lib() {
    function apiCall(method, option) {
        if (option.before) {
            option.before();
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
            success: function(response) {
                if (option.success) {
                    option.success(response);
                }
            },
            error: function(jqXHR) {
                if (option.error) {
                    const errorData = jqXHR.responseJSON || { message: 'Lỗi không xác định.' };
                    option.error(errorData);
                }
            },
            complete: function() {
                if (option.complete) {
                    option.complete();
                }
            }
        });
    }

    this.get = (option) => apiCall('GET', option);
    this.post = (option) => apiCall('POST', option);
    this.put = (option) => apiCall('PUT', option);
    this.patch = (option) => apiCall('PATCH', option);
    this.delete = (option) => apiCall('DELETE', option);

    this.showNotify = function(options = {}) {
        const { type = 'info', title, message, duration = 5000 } = options;

        const container = document.getElementById('notification-container');
        if (!container) {
            console.error('Không tìm thấy #notification-container! Hãy thêm thẻ div này vào file HTML.');
            return;
        }

        const toast = document.createElement('div');
        toast.classList.add('notification-toast', type);

        const icons = {
            success: 'fa-solid fa-circle-check',
            error: 'fa-solid fa-circle-xmark',
            info: 'fa-solid fa-circle-info',
            warning: 'fa-solid fa-triangle-exclamation'
        };

        toast.innerHTML = `
            <i class="toast-icon ${icons[type]}"></i>
            <div class="toast-content">
                <p class="toast-title">${title || 'Thông báo'}</p>
                <p class="toast-message">${message || ''}</p>
            </div>
            <button class="toast-close">&times;</button>
        `;

        container.appendChild(toast);

        const removeToast = () => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                toast.remove();
            }, 500);
        };

        const timer = setTimeout(removeToast, duration);

        toast.querySelector('.toast-close').addEventListener('click', () => {
            clearTimeout(timer);
            removeToast();
        });
    }
}