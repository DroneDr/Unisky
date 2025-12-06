document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Lazy load for the overview video
    const lazyVideo = document.querySelector('video.lazy-video');

    if (lazyVideo) {
        const lazyVideoObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const video = entry.target;
                    const source = video.querySelector('source');

                    // Set the src to start loading
                    video.src = source.dataset.src;

                    // Load and play the video
                    video.load();
                    video.play().catch(error => console.error("Video autoplay failed:", error));

                    // Stop observing once loaded
                    observer.unobserve(video);
                }
            });
        });
        lazyVideoObserver.observe(lazyVideo);
    }

    // Scroll-in animations for sections
    const animatedSections = document.querySelectorAll('.animated-section');

    if (animatedSections.length > 0) {
        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px 0px -100px 0px' // Trigger a little before it's fully in view
        });

        animatedSections.forEach(section => sectionObserver.observe(section));
    }

    // Radial Menu for Products & Services
    const radialMenu = document.querySelector('.products-services-list');
    if (radialMenu) {
        const items = radialMenu.querySelectorAll('li');
        const display = document.querySelector('.service-content-display');
        const displayTitle = display.querySelector('h3');
        const displayParagraph = display.querySelector('p');
        const itemCount = items.length;
        const radius = radialMenu.offsetWidth / 2;
        const angleIncrement = 360 / itemCount;

        items.forEach((item, index) => {
            // Calculate position on the circle
            const angle = angleIncrement * index;
            const x = radius * Math.cos(angle * Math.PI / 180);
            const y = radius * Math.sin(angle * Math.PI / 180);

            // Apply transform to position the item
            item.style.transform = `translate(${x}px, ${y}px)`;

            // Store the angle on the element for later use
            item.dataset.angle = angle;

            // Set the first item as active by default
            if (index === 0) {
                item.classList.add('active-service');
                displayTitle.textContent = item.querySelector('strong').textContent;
                displayParagraph.textContent = item.querySelector('p').textContent;
            }
            // Add click event listener
            item.addEventListener('click', () => {
                const title = item.querySelector('strong').textContent;
                const text = item.querySelector('p').textContent;
                const itemAngle = parseFloat(item.dataset.angle);

                // Rotate the wheel to bring the clicked item to the top (-90deg)
                const rotationAngle = -90 - itemAngle;
                radialMenu.style.transform = `rotate(${rotationAngle}deg)`;

                // Update active class
                items.forEach(i => i.classList.remove('active-service'));
                item.classList.add('active-service');


                // Update the central display with a fade effect
                display.style.opacity = 0;
                setTimeout(() => {
                    displayTitle.textContent = title;
                    displayParagraph.textContent = text;
                    display.style.opacity = 1;
                }, 200); // Match half of the transition time

                // Counter-rotate each item to keep text horizontal
                items.forEach(i => {
                    const currentScale = i.classList.contains('active-service') ? 'scale(1.15)' : 'scale(1)';
                    i.style.transform = `${i.style.transform.split(')')[0]}) rotate(${-rotationAngle}deg) ${currentScale}`;
                });
            });
        });
        display.style.transition = 'opacity 0.4s ease';
    }

    // Flip cards for Core Values on click (for mobile and desktop)
    const valueCards = document.querySelectorAll('.core-values-list > li');

    if (valueCards.length > 0) {
        const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

        if (isTouchDevice) {
            // On touch devices, use click to toggle
            valueCards.forEach(card => {
                card.addEventListener('click', () => {
                    const cardInner = card.querySelector('.flip-card-inner');
                    cardInner.classList.toggle('is-flipped');
                });
            });
        } else {
            // On non-touch devices (desktops), use hover
            valueCards.forEach(card => {
                const cardInner = card.querySelector('.flip-card-inner');
                card.addEventListener('mouseenter', () => {
                    cardInner.classList.add('is-flipped');
                });
                card.addEventListener('mouseleave', () => {
                    cardInner.classList.remove('is-flipped');
                });
            });
        }
    }
});