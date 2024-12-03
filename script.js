document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('.item a');
    const currentPath = window.location.pathname.split('/').pop();

    links.forEach((link) => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active-link');
        }

        link.addEventListener('click', function() {
            links.forEach((link) => {
                link.classList.remove('active-link');
            });
            link.classList.add('active-link');
        });
    });
});

// Check TensorFlow.js is loaded
console.log(tf.version.tfjs);  // This will log the version of TensorFlow.js




