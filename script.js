document.addEventListener('DOMContentLoaded', () => {

    emailjs.init('2gPO0hAR1OM7dkwGS');

    const SERVICE_ID = 'service_7xtxlx8';
    const TEMPLATE_ID = 'template_p4v2b39';

    const header = document.getElementById('main-header');
    const scrollBtn = document.getElementById('scroll-top');
    const hamburger = document.getElementById('hamburger');
    const overlay = document.getElementById('mobile-overlay');
    const mobileItems = document.querySelectorAll('.mobile-nav-item');
    const form = document.getElementById('contact-form');
    const toast = document.getElementById('toast');

    const handleScroll = () => {
        const y = window.scrollY;
        header.classList.toggle('scrolled', y > 50);
        scrollBtn.classList.toggle('visible', y > 300);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();

    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    const toggleMenu = () => {
        const open = hamburger.classList.contains('active');
        hamburger.classList.toggle('active');
        overlay.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', !open);
        document.body.style.overflow = open ? '' : 'hidden';
    };
    hamburger.addEventListener('click', toggleMenu);
    mobileItems.forEach(link => link.addEventListener('click', toggleMenu));

    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav-item');
    const mobNavItems = document.querySelectorAll('.mobile-nav-item');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(item => {
                    item.classList.toggle('active', item.getAttribute('href') === `#${id}`);
                });
                mobNavItems.forEach(item => {
                    item.classList.toggle('active', item.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { root: null, rootMargin: '-30% 0px -60% 0px', threshold: 0 });
    sections.forEach(s => navObserver.observe(s));

    const revealEls = document.querySelectorAll('.glass-card, .cert-card, .project-card, .skill-group, .section-header, .timeline-item');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { root: null, rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

    revealEls.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });

    const emailInput = document.getElementById('form-email');
    const nameInput = document.getElementById('form-name');
    const subjectInput = document.getElementById('form-subject');
    const messageInput = document.getElementById('form-message');

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    const validateField = (input, condition) => {
        input.parentElement.classList.toggle('invalid', !condition);
        return condition;
    };

    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
        input.addEventListener('input', () => {
            const val = input.value.trim();
            if (input === emailInput) validateField(input, isValidEmail(val));
            else validateField(input, val !== '');
        });
    });

    const showToast = (title, desc, isError) => {
        toast.classList.remove('error', 'active');
        if (isError) toast.classList.add('error');
        toast.querySelector('.toast-title').textContent = title;
        toast.querySelector('.toast-desc').textContent = desc;
        toast.classList.add('active');
        setTimeout(() => toast.classList.remove('active'), 4000);
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameVal = nameInput.value.trim();
        const emailVal = emailInput.value.trim();
        const subjectVal = subjectInput.value.trim();
        const messageVal = messageInput.value.trim();

        const valid =
            validateField(nameInput, nameVal !== '') &&
            validateField(emailInput, isValidEmail(emailVal)) &&
            validateField(subjectInput, subjectVal !== '') &&
            validateField(messageInput, messageVal !== '');

        if (!valid) return;

        const btn = form.querySelector('.btn-submit');
        const orig = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span>Sending...</span>';

        emailjs.send(SERVICE_ID, TEMPLATE_ID, {
            name: nameVal,
            email: emailVal,
            subject: subjectVal,
            message: messageVal
        })
        .then(() => {
            form.reset();
            showToast('Message Sent!', 'Thank you! I\'ll get back to you soon.', false);
        })
        .catch(() => {
            showToast('Something went wrong', 'Please try again or email me directly.', true);
        })
        .finally(() => {
            btn.disabled = false;
            btn.innerHTML = orig;
        });
    });
});
