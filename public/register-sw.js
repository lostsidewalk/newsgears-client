if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js', {
            scope: '.'
        }).then(function (registration) {
            // registration was successful
        }, function (err) {
            // registration failed 
        });
    });
}