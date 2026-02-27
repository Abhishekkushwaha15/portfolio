
class ParticleBackground {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = window.innerWidth > 768 ? 100 : 50;

        this.setCanvasSize();
        this.createParticles();
        this.animate();

        window.addEventListener('resize', () => this.setCanvasSize());
    }

    setCanvasSize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
            });
        }
    }

    animate() {
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle) => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            this.ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

class TypingEffect {
    constructor(element, texts, speed = 100, deleteSpeed = 50, delayBetween = 2000) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.deleteSpeed = deleteSpeed;
        this.delayBetween = delayBetween;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;

        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];
        const displayText = currentText.substring(0, this.charIndex);

        this.element.textContent = displayText;

        if (!this.isDeleting && this.charIndex < currentText.length) {
            this.charIndex++;
            setTimeout(() => this.type(), this.speed);
        } else if (this.isDeleting && this.charIndex > 0) {
            this.charIndex--;
            setTimeout(() => this.type(), this.deleteSpeed);
        } else if (!this.isDeleting && this.charIndex === currentText.length) {
            this.isDeleting = true;
            setTimeout(() => this.type(), this.delayBetween);
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            setTimeout(() => this.type(), this.speed);
        }
    }
}


class SmoothScroll {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');

        this.setupEventListeners();
    }

    setupEventListeners() {
        if (this.hamburger) {
            this.hamburger.addEventListener('click', () => {
                this.navMenu.classList.toggle('active');
            });
        }

        this.navLinks.forEach((link) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                    this.navMenu.classList.remove('active');
                }
            });
        });

        window.addEventListener('scroll', () => {
            let current = '';

            this.sections.forEach((section) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;

                if (scrollY >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            this.navLinks.forEach((link) => {
                link.classList.remove('active');
                if (link.getAttribute('href').substring(1) === current) {
                    link.classList.add('active');
                }
            });
        });
    }
}

class ScrollAnimations {
    constructor() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            },
            {
                threshold: 0.1,
            }
        );

        this.observeElements();
    }

    observeElements() {
        const animatedElements = document.querySelectorAll(
            '.skill-card, .project-card, .stat, .fade-in-text'
        );

        animatedElements.forEach((element) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            this.observer.observe(element);
        });
    }
}

class FormHandler {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        if (this.form) {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitForm();
        });
    }

    submitForm() {
        const submitButton = this.form.querySelector('.submit-button');
        const originalText = submitButton.textContent;

        submitButton.textContent = 'Message Sent! 🎉';
        submitButton.disabled = true;

        setTimeout(() => {
            this.form.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 3000);
    }
}

class SkillProgress {
    constructor() {
        this.skillCards = document.querySelectorAll('.skill-card');
        this.animatedSkills = new Set();

        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !this.animatedSkills.has(entry.target)) {
                        this.animateSkill(entry.target);
                        this.animatedSkills.add(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        this.skillCards.forEach((card) => {
            this.observer.observe(card);
        });
    }

    animateSkill(skillCard) {
        const progressBar = skillCard.querySelector('.skill-progress');
        if (progressBar) {
            const width = progressBar.style.width;
            progressBar.style.width = '0';
            setTimeout(() => {
                progressBar.style.transition = 'width 1.5s ease-out';
                progressBar.style.width = width;
            }, 100);
        }
    }
}

class ParallaxEffect {
    constructor() {
        window.addEventListener('scroll', () => {
            this.updateParallax();
        });
    }

    updateParallax() {
        const scrolled = window.scrollY;
        const hero = document.querySelector('.hero');

        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    }
}

class Tooltip {
    constructor() {
        this.socialIcons = document.querySelectorAll('.social-icon');
        this.setupTooltips();
    }

    setupTooltips() {
        this.socialIcons.forEach((icon) => {
            icon.addEventListener('mouseenter', (e) => {
                const title = e.currentTarget.getAttribute('title');
                if (title) {
                    this.showTooltip(e.currentTarget, title);
                }
            });

            icon.addEventListener('mouseleave', () => {
                const tooltip = icon.querySelector('.tooltip-text');
                if (tooltip) {
                    tooltip.remove();
                }
            });
        });
    }

    showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.classList.add('tooltip-text');
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 212, 255, 0.9);
            color: #000;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            white-space: nowrap;
            pointer-events: none;
            bottom: 110%;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1000;
        `;
        element.style.position = 'relative';
        element.appendChild(tooltip);
    }
}

class MobileMenuHandler {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.navMenu = document.querySelector('.nav-menu');

        this.navLinks.forEach((link) => {
            link.addEventListener('click', () => {
                if (this.navMenu) {
                    this.navMenu.classList.remove('active');
                }
            });
        });
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new ParticleBackground('particleCanvas');
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        new TypingEffect(typingText, [
            'Full Stack Developer & Creative Designer',
            'Web Developer & UI/UX Enthusiast',
            'Building Digital Experiences'
        ]);
    }

    new SmoothScroll();
    new ScrollAnimations();
    new FormHandler('.contact-form');
    new SkillProgress();
    new ParallaxEffect();
    new Tooltip();
    new MobileMenuHandler();
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .tooltip-text {
            animation: tooltipFade 0.3s ease-out forwards;
        }

        @keyframes tooltipFade {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
    `;
    document.head.appendChild(styleSheet);
});

window.addEventListener('resize', () => {
    const canvas = document.getElementById('particleCanvas');
    if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
});
