// Loading Screen
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    if (!loadingScreen) return; // Guard clause if loading screen doesn't exist
    
    // Ensure minimum loading time of 2 seconds
    const minimumLoadTime = 2000;
    const startTime = Date.now();
    
    // Load all images
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    const totalImages = images.length;

    const hideLoadingScreen = () => {
        if (!loadingScreen) return; // Additional check in case element was removed
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;
        
        if (elapsedTime < minimumLoadTime) {
            // Wait for minimum time to complete
            setTimeout(hideLoadingScreen, minimumLoadTime - elapsedTime);
            return;
        }
        
        loadingScreen.classList.add('fade-out');
        document.body.style.overflow = 'visible';
        
        // Clean up loading screen after animation
        setTimeout(() => {
            if (loadingScreen && loadingScreen.parentNode) {
                loadingScreen.parentNode.removeChild(loadingScreen);
            }
        }, 1000); // Match this with your CSS animation duration
    };

    if (totalImages === 0) {
        setTimeout(hideLoadingScreen, minimumLoadTime);
    } else {
        let loadTimeout = setTimeout(hideLoadingScreen, 5000); // Fallback timeout

        images.forEach(img => {
            if (img.complete) {
                loadedImages++;
                if (loadedImages === totalImages) {
                    clearTimeout(loadTimeout);
                    hideLoadingScreen();
                }
            } else {
                img.addEventListener('load', () => {
                    loadedImages++;
                    if (loadedImages === totalImages) {
                        clearTimeout(loadTimeout);
                        hideLoadingScreen();
                    }
                });
                
                img.addEventListener('error', () => {
                    console.warn('Failed to load image:', img.src);
                    loadedImages++;
                    if (loadedImages === totalImages) {
                        clearTimeout(loadTimeout);
                        hideLoadingScreen();
                    }
                });
            }
        });
    }
});

// Handle navigation active states
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (!targetSection) return; // Guard clause if section doesn't exist
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Smooth scroll to section
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Update active state on scroll with debouncing
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            let current = '';
            const sections = document.querySelectorAll('section');
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= (sectionTop - sectionHeight / 3)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }, 50); // Debounce scroll events
    });
});

// Handle horizontal scrolling for game sections with error handling
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.games-container').forEach(container => {
        const gamesRow = container.querySelector('.games-row');
        const prevBtn = container.querySelector('.prev');
        const nextBtn = container.querySelector('.next');
        
        if (!gamesRow || !prevBtn || !nextBtn) return; // Guard clause if elements don't exist
        
        // Calculate card width dynamically
        const getCardWidth = () => {
            const card = container.querySelector('.game-card');
            if (!card) return 0;
            
            const style = window.getComputedStyle(card);
            const width = parseFloat(style.width) || 0;
            const marginRight = parseFloat(style.marginRight) || 24;
            return width + marginRight;
        };

        // Update arrow visibility with error handling
        const updateArrowVisibility = () => {
            if (!gamesRow) return;
            
            const scrollLeft = gamesRow.scrollLeft;
            const maxScroll = gamesRow.scrollWidth - gamesRow.clientWidth;
            
            if (prevBtn) {
                prevBtn.style.opacity = scrollLeft <= 0 ? '0.5' : '1';
                prevBtn.style.pointerEvents = scrollLeft <= 0 ? 'none' : 'auto';
            }
            
            if (nextBtn) {
                nextBtn.style.opacity = scrollLeft >= maxScroll ? '0.5' : '1';
                nextBtn.style.pointerEvents = scrollLeft >= maxScroll ? 'none' : 'auto';
            }
        };

        // Calculate number of cards to scroll
        const getScrollAmount = () => {
            const viewportWidth = window.innerWidth;
            const cardWidth = getCardWidth();
            return cardWidth > 0 ? Math.max(Math.floor(viewportWidth / cardWidth) - 1, 1) : 1;
        };

        // Initial arrow visibility
        updateArrowVisibility();

        // Scroll handlers with error checking
        prevBtn.addEventListener('click', () => {
            const cardWidth = getCardWidth();
            if (cardWidth === 0) return;
            
            const scrollAmount = getScrollAmount();
            gamesRow.scrollBy({
                left: -cardWidth * scrollAmount,
                behavior: 'smooth'
            });
        });

        nextBtn.addEventListener('click', () => {
            const cardWidth = getCardWidth();
            if (cardWidth === 0) return;
            
            const scrollAmount = getScrollAmount();
            gamesRow.scrollBy({
                left: cardWidth * scrollAmount,
                behavior: 'smooth'
            });
        });

        // Update arrow visibility on scroll with debouncing
        let scrollTimeout;
        gamesRow.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(updateArrowVisibility, 50);
        });

        // Update on window resize with debouncing
        let resizeTimeout;
        window.addEventListener('resize', () => {
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(updateArrowVisibility, 50);
        });
    });
});

// Add click handlers for game cards
document.querySelectorAll('.game-card').forEach(card => {
    card.addEventListener('click', function() {
        const gameName = this.querySelector('h3').textContent;
        alert(`Launching ${gameName}...`);
    });
});

// Add lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    const imageOptions = {
        threshold: 0.001,
        rootMargin: '200px 0px 200px 0px'
    };

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '1';
                observer.unobserve(img);
            }
        });
    }, imageOptions);

    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease-in-out';
        imageObserver.observe(img);
    });
});

// PWA Install Notice with improved error handling
document.addEventListener('DOMContentLoaded', () => {
    let deferredPrompt;
    const pwaNotice = document.getElementById('pwaNotice');
    const installBtn = document.querySelector('.install-btn');
    const cancelBtn = document.querySelector('.cancel-btn');

    if (!pwaNotice || !installBtn || !cancelBtn) return; // Guard clause if elements don't exist

    // Check if already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches 
        || navigator.standalone 
        || document.referrer.includes('android-app://');

    // Check if notice was dismissed in the last hour
    const lastDismissed = localStorage.getItem('pwaNoticeDismissedTime');
    const wasRecentlyDismissed = lastDismissed && (Date.now() - parseInt(lastDismissed, 10) < 3600000); // 1 hour

    function showNotice() {
        if (!pwaNotice || isInstalled || wasRecentlyDismissed) return;

        pwaNotice.classList.add('show');
        const overlay = document.createElement('div');
        overlay.className = 'notice-overlay';
        document.body.appendChild(overlay);
        overlay.classList.add('show');
    }

    function hideNotice() {
        if (!pwaNotice) return;

        pwaNotice.classList.remove('show');
        const overlay = document.querySelector('.notice-overlay');
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => {
                if (overlay && overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        }
    }

    // Show notice immediately on mobile devices
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        showNotice();
    }

    // Show notice when PWA installation is available
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showNotice();
    });

    // Show notice on scroll with debouncing
    let hasScrolled = false;
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            if (!hasScrolled && !isInstalled && !wasRecentlyDismissed) {
                hasScrolled = true;
                showNotice();
            }
        }, 50);
    });

    // Install button handler with error handling
    installBtn.addEventListener('click', async () => {
        try {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    console.log('PWA installed successfully');
                    hideNotice();
                }
                deferredPrompt = null;
            } else {
                // Platform-specific instructions
                if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                    alert('To install: tap the share button below and select "Add to Home Screen"');
                } else if (/Android/i.test(navigator.userAgent)) {
                    alert('To install: tap the menu button (⋮) and select "Add to Home Screen"');
                }
                hideNotice();
            }
        } catch (error) {
            console.error('Error during PWA installation:', error);
            hideNotice();
        }
    });

    // Cancel button handler
    cancelBtn.addEventListener('click', () => {
        hideNotice();
        try {
            localStorage.setItem('pwaNoticeDismissedTime', Date.now().toString());
        } catch (error) {
            console.warn('Failed to save dismissal time:', error);
        }
    });
}); 