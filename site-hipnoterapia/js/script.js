// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    
    // Navegação móvel
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Navegação suave
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Fecha o menu móvel se estiver aberto
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });
    });
    
    // Header transparente/sólido baseado no scroll
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Esconde/mostra header baseado na direção do scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Fecha todos os outros itens
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle do item atual
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
    
    // Formulário de contato
    const contactForm = document.getElementById('agendamento');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coleta os dados do formulário
            const formData = new FormData(this);
            const data = {
                nome: formData.get('nome'),
                email: formData.get('email'),
                telefone: formData.get('telefone'),
                especialidade: formData.get('especialidade'),
                mensagem: formData.get('mensagem')
            };
            
            // Validação básica
            if (!data.nome || !data.email || !data.telefone || !data.especialidade) {
                showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
                return;
            }
            
            // Validação de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Por favor, insira um email válido.', 'error');
                return;
            }
            
            // Simula envio do formulário
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            
            submitButton.textContent = 'Enviando...';
            submitButton.disabled = true;
            
            // Simula delay de envio
            setTimeout(() => {
                showNotification('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
                this.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                
                // Redireciona para WhatsApp com os dados
                const whatsappMessage = `Olá! Gostaria de agendar uma consulta de hipnoterapia.
                
Nome: ${data.nome}
Email: ${data.email}
Telefone: ${data.telefone}
Especialidade: ${data.especialidade}
Mensagem: ${data.mensagem || 'Não informado'}`;
                
                const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(whatsappMessage)}`;
                window.open(whatsappUrl, '_blank');
                
            }, 2000);
        });
    }
    
    // Sistema de notificações
    function showNotification(message, type = 'info') {
        // Remove notificação existente
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Cria nova notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Adiciona estilos
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Botão de fechar
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notification.remove();
        });
        
        // Remove automaticamente após 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // Animações de entrada
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observa elementos para animação
    const animatedElements = document.querySelectorAll('.specialist-card, .specialty-card, .reason, .faq-item');
    animatedElements.forEach(el => observer.observe(el));
    
    // Contador animado para estatísticas
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    if (counter.textContent.includes('+')) {
                        counter.textContent = Math.ceil(current) + '+';
                    } else if (counter.textContent.includes('%')) {
                        counter.textContent = Math.ceil(current) + '%';
                    } else {
                        counter.textContent = Math.ceil(current);
                    }
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = counter.textContent; // Mantém o formato original
                }
            };
            
            updateCounter();
        });
    }
    
    // Inicia contador quando a seção hero fica visível
    const heroObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }
    
    // Lazy loading para imagens
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Smooth scroll para botões CTA
    const ctaButtons = document.querySelectorAll('a[href="#agendar"]');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const contactSection = document.querySelector('#contato');
            if (contactSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = contactSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Foca no primeiro campo do formulário
                setTimeout(() => {
                    const firstInput = contactSection.querySelector('input');
                    if (firstInput) {
                        firstInput.focus();
                    }
                }, 500);
            }
        });
    });
    
    // Validação em tempo real do formulário
    const formInputs = document.querySelectorAll('#agendamento input, #agendamento select, #agendamento textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
    
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Remove classes de erro anteriores
        field.classList.remove('error');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        // Validações específicas
        switch (field.type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value && !emailRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Email inválido';
                }
                break;
            case 'tel':
                const phoneRegex = /^[\d\s\(\)\-\+]{10,}$/;
                if (value && !phoneRegex.test(value)) {
                    isValid = false;
                    errorMessage = 'Telefone inválido';
                }
                break;
        }
        
        // Campos obrigatórios
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'Campo obrigatório';
        }
        
        // Mostra erro se inválido
        if (!isValid) {
            field.classList.add('error');
            const errorElement = document.createElement('span');
            errorElement.className = 'field-error';
            errorElement.textContent = errorMessage;
            errorElement.style.cssText = `
                color: #ef4444;
                font-size: 0.8rem;
                margin-top: 0.25rem;
                display: block;
            `;
            field.parentNode.appendChild(errorElement);
        }
        
        return isValid;
    }
    
    // Adiciona estilos CSS para animações via JavaScript
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .nav-menu.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: white;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            padding: 1rem;
            z-index: 1000;
        }
        
        .nav-toggle.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .nav-toggle.active span:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        
        .header.scrolled {
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
        }
        
        .header {
            transition: all 0.3s ease;
        }
        
        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
            border: 2px solid #ef4444;
            background: rgba(239, 68, 68, 0.1);
        }
        
        .lazy {
            opacity: 0;
            transition: opacity 0.3s;
        }
        
        .lazy.loaded {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);
    
    // Performance: Debounce para eventos de scroll
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Aplica debounce ao scroll
    const debouncedScroll = debounce(function() {
        // Código de scroll já está no event listener acima
    }, 10);
    
    // Adiciona classe de carregamento completo
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
    
    // Prevenção de spam no formulário
    let formSubmissionCount = 0;
    const maxSubmissions = 3;
    const submissionWindow = 300000; // 5 minutos
    
    function canSubmitForm() {
        const now = Date.now();
        const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
        
        // Remove submissões antigas
        const recentSubmissions = submissions.filter(time => now - time < submissionWindow);
        
        if (recentSubmissions.length >= maxSubmissions) {
            return false;
        }
        
        // Adiciona nova submissão
        recentSubmissions.push(now);
        localStorage.setItem('formSubmissions', JSON.stringify(recentSubmissions));
        
        return true;
    }
    
    // Adiciona verificação ao formulário
    if (contactForm) {
        const originalSubmitHandler = contactForm.onsubmit;
        contactForm.addEventListener('submit', function(e) {
            if (!canSubmitForm()) {
                e.preventDefault();
                showNotification('Muitas tentativas de envio. Tente novamente em alguns minutos.', 'error');
                return false;
            }
        });
    }
    
    console.log('Site de Hipnoterapia carregado com sucesso!');
});

