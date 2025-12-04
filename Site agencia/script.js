// ===================================
// QUEBRA-CABEÇA AGENCY - INTERACTIVE SCRIPT
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initPuzzle();
    initScrollAnimations();
    initPortfolioFilters();
    initContactForm();
});

// ===================================
// NAVIGATION
// ===================================
function initNavigation() {
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const links = document.querySelectorAll('.nav-link');

    // Sticky Header
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    links.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Active Link Highlight
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}

// ===================================
// PUZZLE INTERACTION (DRAG AND DROP)
// ===================================
function initPuzzle() {
    const puzzleGrid = document.getElementById('puzzleGrid');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const letters = ['Q', 'U', 'E', 'B', 'R', 'A', 'C', 'A', 'B'];
    let pieces = [];

    // Create pieces
    letters.forEach((letter, index) => {
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');
        piece.textContent = letter;
        piece.setAttribute('draggable', 'true');
        piece.dataset.index = index;
        puzzleGrid.appendChild(piece);
        pieces.push(piece);
    });

    // Add Drag and Drop events
    let draggedItem = null;

    pieces.forEach(piece => {
        piece.addEventListener('dragstart', function (e) {
            draggedItem = this;
            setTimeout(() => {
                this.style.opacity = '0.5';
                this.style.transform = 'scale(0.9)';
            }, 0);
        });

        piece.addEventListener('dragend', function () {
            setTimeout(() => {
                this.style.opacity = '1';
                this.style.transform = '';
                draggedItem = null;
            }, 0);
        });

        piece.addEventListener('dragover', function (e) {
            e.preventDefault();
            this.style.transform = 'scale(1.05)';
        });

        piece.addEventListener('dragleave', function () {
            this.style.transform = '';
        });

        piece.addEventListener('drop', function () {
            this.style.transform = '';
            if (this !== draggedItem) {
                // Swap content
                const tempText = this.textContent;
                this.textContent = draggedItem.textContent;
                draggedItem.textContent = tempText;

                // Visual feedback
                this.classList.add('swapped');
                draggedItem.classList.add('swapped');

                setTimeout(() => {
                    this.classList.remove('swapped');
                    draggedItem.classList.remove('swapped');
                }, 300);
            }
        });
    });

    // Shuffle functionality
    shuffleBtn.addEventListener('click', () => {
        shuffleBtn.disabled = true;

        // Animation
        pieces.forEach((piece, i) => {
            setTimeout(() => {
                piece.style.transform = 'scale(0) rotate(180deg)';
            }, i * 50);
        });

        setTimeout(() => {
            // Shuffle array
            const shuffledLetters = [...letters].sort(() => Math.random() - 0.5);

            pieces.forEach((piece, i) => {
                piece.textContent = shuffledLetters[i];
                piece.style.transform = 'scale(1) rotate(0deg)';
            });

            shuffleBtn.disabled = false;
        }, 500);
    });
}

// ===================================
// SCROLL ANIMATIONS
// ===================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate stats numbers if it's the stats container
                if (entry.target.classList.contains('about-stats')) {
                    animateStats();
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Elements to observe
    const elements = document.querySelectorAll('.about-text, .about-stats, .service-card, .portfolio-item');
    elements.forEach(el => observer.observe(el));
}

function animateStats() {
    const stats = document.querySelectorAll('.stat-number');

    stats.forEach(stat => {
        const target = parseInt(stat.innerText);
        const suffix = stat.innerText.replace(/[0-9]/g, '');
        let current = 0;
        const increment = Math.ceil(target / 50); // Speed of counting

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.innerText = target + suffix;
                clearInterval(timer);
            } else {
                stat.innerText = current + suffix;
            }
        }, 30);
    });
}

// ===================================
// PORTFOLIO FILTERS
// ===================================
function initPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, 100);
                } else {
                    item.classList.remove('visible');
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// ===================================
// CONTACT FORM
// ===================================
function initContactForm() {
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;

            // Simulate form submission
            const btn = form.querySelector('.submit-btn');
            const originalText = btn.innerText;

            btn.innerText = 'Enviando...';
            btn.disabled = true;

            setTimeout(() => {
                btn.innerText = 'Mensagem Enviada!';
                btn.style.background = '#4CAF50';

                setTimeout(() => {
                    alert(`Obrigado, ${name}! Recebemos sua mensagem e entraremos em contato pelo email ${email} em breve.`);
                    form.reset();
                    btn.innerText = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 500);
            }, 1500);
        });
    }
}
