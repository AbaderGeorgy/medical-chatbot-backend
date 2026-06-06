export function initReportsPage() {
// Initialize the reports page
    // initReports();

const footerLinks = document.querySelectorAll('.footer__links a[data-page]');
    
    if (footerLinks.length > 0) {
        const pageFiles = {
            'home': '/',
            'upload': '/upload',
            'dashboard': '/dashboard',
            'reports': '/reports',
            'education': '/education',
            'chat': 'chat.html',
            'login': 'login.html'
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
}
