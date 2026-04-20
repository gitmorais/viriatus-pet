/* ============================================================
   ViriatuPet's — Consultório Veterinário em Viseu
   script.js
   ============================================================ */

'use strict';

/* ---- Navbar scroll behaviour ---- */
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    if (backToTop) {
        if (scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
}, { passive: true });

/* ---- Back to top ---- */
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ---- Mobile menu (hamburger) ---- */
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
});

/* Close menu on nav link click */
navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });
});

/* Close on overlay click (outside menu) */
document.addEventListener('click', e => {
    if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        navMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
});

/* ---- Smooth scrolling for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

/* ---- Scroll animations (lightweight Intersection Observer) ---- */
const animElements = document.querySelectorAll('[data-aos]');

function animateIfVisible(el) {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
        const delay = el.dataset.aosDelay || 0;
        setTimeout(() => el.classList.add('aos-animate'), parseInt(delay));
        return true;
    }
    return false;
}

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = el.dataset.aosDelay || 0;
                setTimeout(() => el.classList.add('aos-animate'), parseInt(delay));
                observer.unobserve(el);
            }
        });
    }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });

    animElements.forEach(el => {
        if (!animateIfVisible(el)) {
            observer.observe(el);
        }
    });
} else {
    animElements.forEach(el => el.classList.add('aos-animate'));
}


/* ---- FAQ accordion ---- */
document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');

        /* Close all */
        document.querySelectorAll('.faq-item.open').forEach(open => {
            open.classList.remove('open');
            open.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        });

        /* Open clicked (unless it was already open) */
        if (!isOpen) {
            item.classList.add('open');
            btn.setAttribute('aria-expanded', 'true');
        }
    });
});

/* ---- Appointment Form ---- */
const form = document.getElementById('appointmentForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        if (!validateForm()) return;

        /* Show loading state */
        submitBtn.querySelector('.btn-default-text').style.display = 'none';
        submitBtn.querySelector('.btn-loading-text').style.display = 'flex';
        submitBtn.disabled = true;

        /* Build WhatsApp message from form data */
        const name    = document.getElementById('name').value.trim();
        const phone   = document.getElementById('phone').value.trim();
        const animal  = document.getElementById('animal').value;
        const service = document.getElementById('service').value;
        const message = document.getElementById('message').value.trim();

        const waText = [
            '🐾 *Pedido de Marcação – ViriatuPet\'s*',
            '',
            `*Nome:* ${name}`,
            `*Contacto:* ${phone}`,
            `*Animal:* ${animal}`,
            `*Serviço:* ${service}`,
            message ? `*Mensagem:* ${message}` : null
        ].filter(Boolean).join('\n');

        const waUrl = `https://wa.me/351933454251?text=${encodeURIComponent(waText)}`;

        /* Short delay for UX feedback, then open WhatsApp */
        setTimeout(() => {
            window.open(waUrl, '_blank', 'noopener,noreferrer');
            showFormSuccess();
        }, 600);
    });
}

function validateForm() {
    let valid = true;

    const fields = [
        { id: 'name',    errId: 'nameErr',    check: v => v.length >= 2 },
        { id: 'phone',   errId: 'phoneErr',   check: v => /^[0-9\s\+\-\(\)]{7,}$/.test(v) },
        { id: 'animal',  errId: 'animalErr',  check: v => v !== '' },
        { id: 'service', errId: 'serviceErr', check: v => v !== '' },
    ];

    fields.forEach(({ id, errId, check }) => {
        const input = document.getElementById(id);
        const errEl = document.getElementById(errId);
        const val = input.value.trim();

        if (!check(val)) {
            input.classList.add('error');
            errEl.classList.add('visible');
            valid = false;
        } else {
            input.classList.remove('error');
            errEl.classList.remove('visible');
        }

        input.addEventListener('input', () => {
            input.classList.remove('error');
            errEl.classList.remove('visible');
        }, { once: true });
    });

    /* Privacy checkbox */
    const privacy = document.getElementById('privacy');
    const privacyErr = document.getElementById('privacyErr');
    if (!privacy.checked) {
        privacyErr.classList.add('visible');
        valid = false;
    } else {
        privacyErr.classList.remove('visible');
    }

    return valid;
}

function showFormSuccess() {
    form.style.display = 'none';
    formSuccess.style.display = 'flex';
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/* Exposed globally for the "fazer outro pedido" button */
window.resetForm = function () {
    form.reset();
    form.style.display = 'flex';
    formSuccess.style.display = 'none';
    submitBtn.querySelector('.btn-default-text').style.display = 'flex';
    submitBtn.querySelector('.btn-loading-text').style.display = 'none';
    submitBtn.disabled = false;
    document.querySelectorAll('.form-err.visible').forEach(el => el.classList.remove('visible'));
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
};

/* ---- Active nav link highlight on scroll ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
            });
        }
    });
}, { threshold: 0.35 });

sections.forEach(section => sectionObserver.observe(section));
