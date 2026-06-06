import "../styles/Dashboard.css"; 

export function initDashboardPage() {
// Initialize the dashboard
    // initDashboard();

const footerLinks = document.querySelectorAll('.footer__links a[data-page]');
    
    if (footerLinks.length > 0) {
        const pageFiles = {
            'home': '/',
            'upload': '/upload',
            'dashboard': '/dashboard',
            'reports': '/reports',
            'education': '/education',
            'chat': 'chat.html',
            'login': '/auth'
        };
        
        footerLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetPage = this.getAttribute('data-page');
                
                if (pageFiles[targetPage]) {
                    window.location.href = pageFiles[targetPage];
                }
            });
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1000);
        });
    }
    
    const userIcon = document.querySelector('.user-icon');
    if (userIcon) {
        userIcon.addEventListener('click', function() {
            window.location.href = '/auth';
        });
    }
}

export default initDashboardPage;