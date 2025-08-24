// ==============================================
// AdsOpti AI Landing Page - Enhanced JavaScript
// Netlify-optimized with modern ES6+ features
// ==============================================

'use strict';

// ==============================================
// Configuration & Constants
// ==============================================
const CONFIG = {
    BETA_DEADLINE: new Date('2025-02-28T23:59:59').getTime(),
    VISITOR_BASE_COUNT: 473,
    FORM_SAVE_KEY: 'adsopti_form_progress',
    VISITOR_COUNT_KEY: 'adsopti_visitor_count',
    EXIT_SHOWN_KEY: 'adsopti_exit_shown',
    LANGUAGE_KEY: 'adsopti_language',
    NOTIFICATION_INTERVAL: 45000, // 45 seconds
    TYPING_SPEED: 100,
    ERASE_SPEED: 50,
    TYPING_DELAY: 2000,
    SUPPORTED_LANGUAGES: ['en', 'zh-TW'],
    DEFAULT_LANGUAGE: 'en',
    TAIWAN_IP_API: 'https://ipapi.co/json/'  // Free IP geolocation service
};

// ==============================================
// Language Detection & Management
// ==============================================
class LanguageManager {
    constructor() {
        this.currentLanguage = CONFIG.DEFAULT_LANGUAGE;
        this.translations = typeof translations !== 'undefined' ? translations : {};
        this.isDetecting = false;
        this.initPromise = this.init();
    }

    async init() {
        try {
            // Load saved language preference or detect automatically
            const savedLang = localStorage.getItem(CONFIG.LANGUAGE_KEY);
            if (savedLang && CONFIG.SUPPORTED_LANGUAGES.includes(savedLang)) {
                this.currentLanguage = savedLang;
            } else {
                this.currentLanguage = await this.detectUserLanguage();
            }
            
            await this.applyLanguage(this.currentLanguage);
            this.setupLanguageSwitcher();
        } catch (error) {
            console.warn('Language initialization failed:', error);
            this.currentLanguage = CONFIG.DEFAULT_LANGUAGE;
            await this.applyLanguage(this.currentLanguage);
        }
    }

    async detectUserLanguage() {
        if (this.isDetecting) return this.currentLanguage;
        this.isDetecting = true;

        try {
            // 1. Try to detect Taiwan via IP geolocation
            const response = await fetch(CONFIG.TAIWAN_IP_API, {
                method: 'GET',
                timeout: 3000
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.country_code === 'TW') {
                    Analytics.track('language_auto_detected', {
                        method: 'ip_geolocation',
                        detected_language: 'zh-TW',
                        country: 'Taiwan'
                    });
                    return 'zh-TW';
                }
            }
        } catch (error) {
            console.warn('IP geolocation failed:', error);
        }

        // 2. Fallback to browser language detection
        const browserLang = navigator.language || navigator.languages?.[0];
        if (browserLang) {
            if (browserLang.toLowerCase().includes('zh') && 
                (browserLang.includes('TW') || browserLang.includes('Hant'))) {
                Analytics.track('language_auto_detected', {
                    method: 'browser_language',
                    detected_language: 'zh-TW',
                    browser_lang: browserLang
                });
                return 'zh-TW';
            }
        }

        // 3. Default to English
        Analytics.track('language_auto_detected', {
            method: 'default',
            detected_language: 'en',
            browser_lang: browserLang
        });
        
        this.isDetecting = false;
        return CONFIG.DEFAULT_LANGUAGE;
    }

    async applyLanguage(langCode) {
        if (!CONFIG.SUPPORTED_LANGUAGES.includes(langCode)) {
            langCode = CONFIG.DEFAULT_LANGUAGE;
        }

        const startTime = performance.now();
        this.currentLanguage = langCode;
        
        // Update document language
        document.documentElement.lang = langCode;
        document.body.className = document.body.className.replace(/lang-\w+/g, '');
        document.body.classList.add(`lang-${langCode}`);

        // Update meta tags
        this.updateMetaTags(langCode);

        // Update all translatable elements
        this.translateElements();

        // Update language switcher UI
        this.updateLanguageSwitcher();

        // Save preference
        localStorage.setItem(CONFIG.LANGUAGE_KEY, langCode);

        const endTime = performance.now();
        Analytics.track('language_applied', {
            language: langCode,
            performance_ms: Math.round(endTime - startTime),
            method: 'apply_language'
        });
    }

    translateElements() {
        const currentTranslations = this.translations[this.currentLanguage] || this.translations[CONFIG.DEFAULT_LANGUAGE];
        
        // Translate elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getNestedTranslation(currentTranslations, key);
            
            if (translation) {
                const params = this.parseParams(element.getAttribute('data-i18n-params'));
                element.textContent = this.interpolate(translation, params);
            }
        });

        // Translate elements with data-i18n-html attribute (allows HTML)
        document.querySelectorAll('[data-i18n-html]').forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            const translation = this.getNestedTranslation(currentTranslations, key);
            
            if (translation) {
                const params = this.parseParams(element.getAttribute('data-i18n-params'));
                element.innerHTML = this.interpolate(translation, params);
            }
        });

        // Translate placeholder attributes
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.getNestedTranslation(currentTranslations, key);
            
            if (translation) {
                element.setAttribute('placeholder', translation);
            }
        });

        // Update typing animation texts
        this.updateTypingAnimations();
    }

    getNestedTranslation(obj, path) {
        return path.split('.').reduce((current, key) => current && current[key], obj);
    }

    parseParams(paramsStr) {
        if (!paramsStr) return {};
        try {
            return JSON.parse(paramsStr);
        } catch (error) {
            console.warn('Failed to parse i18n params:', paramsStr);
            return {};
        }
    }

    interpolate(text, params) {
        if (!params || typeof text !== 'string') return text;
        
        return text.replace(/\{(\w+)\}/g, (match, key) => {
            return params[key] !== undefined ? params[key] : match;
        });
    }

    updateMetaTags(langCode) {
        const currentTranslations = this.translations[langCode] || this.translations[CONFIG.DEFAULT_LANGUAGE];
        
        // Update title
        if (currentTranslations.title) {
            document.title = currentTranslations.title;
        }

        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && currentTranslations.description) {
            metaDesc.setAttribute('content', currentTranslations.description);
        }
    }

    updateTypingAnimations() {
        const currentTranslations = this.translations[this.currentLanguage] || this.translations[CONFIG.DEFAULT_LANGUAGE];
        
        // Update typing text content for existing animations
        document.querySelectorAll('.typing-text').forEach(element => {
            const dataText = element.getAttribute('data-text');
            let translatedText = dataText;
            
            // Map common typing texts to translations
            if (dataText === '44% of Budget' && currentTranslations.hero_title_waste) {
                translatedText = currentTranslations.hero_title_waste;
            } else if (dataText === 'Fix It in One Click.' && currentTranslations.hero_title_fix) {
                translatedText = currentTranslations.hero_title_fix;
            }
            
            element.setAttribute('data-text', translatedText);
            element.textContent = translatedText;
        });
    }

    setupLanguageSwitcher() {
        const langButtons = document.querySelectorAll('.lang-btn');
        
        langButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                const targetLang = button.getAttribute('data-lang');
                
                if (targetLang !== this.currentLanguage) {
                    // Add switching animation
                    button.classList.add('switching');
                    
                    // Track language switch
                    Analytics.track('language_switched', {
                        from: this.currentLanguage,
                        to: targetLang,
                        method: 'manual_switch'
                    });
                    
                    await this.applyLanguage(targetLang);
                    
                    // Remove animation class
                    setTimeout(() => {
                        button.classList.remove('switching');
                    }, 500);
                }
            });
        });
    }

    updateLanguageSwitcher() {
        const langButtons = document.querySelectorAll('.lang-btn');
        
        langButtons.forEach(button => {
            const buttonLang = button.getAttribute('data-lang');
            button.classList.toggle('active', buttonLang === this.currentLanguage);
        });
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    isChineseLanguage() {
        return this.currentLanguage === 'zh-TW';
    }
}

// ==============================================
// Global State Management
// ==============================================
class AppState {
    constructor() {
        this.selectedPains = new Set();
        this.formProgress = this.loadFormProgress();
        this.visitorCount = this.getVisitorCount();
        this.isExitPopupShown = sessionStorage.getItem(CONFIG.EXIT_SHOWN_KEY) === 'true';
        this.notificationTimer = null;
        this.countdownTimer = null;
        this.typingAnimations = [];
        this.languageManager = new LanguageManager();
    }

    // Form Progress Management
    loadFormProgress() {
        try {
            const saved = localStorage.getItem(CONFIG.FORM_SAVE_KEY);
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.warn('Failed to load form progress:', error);
            return {};
        }
    }

    saveFormProgress(data) {
        try {
            localStorage.setItem(CONFIG.FORM_SAVE_KEY, JSON.stringify(data));
            this.formProgress = data;
        } catch (error) {
            console.warn('Failed to save form progress:', error);
        }
    }

    clearFormProgress() {
        try {
            localStorage.removeItem(CONFIG.FORM_SAVE_KEY);
            this.formProgress = {};
        } catch (error) {
            console.warn('Failed to clear form progress:', error);
        }
    }

    // Visitor Count Management
    getVisitorCount() {
        try {
            const stored = localStorage.getItem(CONFIG.VISITOR_COUNT_KEY);
            if (stored) {
                return parseInt(stored, 10);
            }
            
            // Generate realistic visitor count based on time
            const now = Date.now();
            const baseDate = new Date('2025-01-01').getTime();
            const daysSinceBase = Math.floor((now - baseDate) / (1000 * 60 * 60 * 24));
            const dailyGrowth = Math.floor(Math.random() * 5) + 8; // 8-12 per day
            const count = CONFIG.VISITOR_BASE_COUNT + (daysSinceBase * dailyGrowth) + Math.floor(Math.random() * 15);
            
            localStorage.setItem(CONFIG.VISITOR_COUNT_KEY, count.toString());
            return count;
        } catch (error) {
            console.warn('Failed to get visitor count:', error);
            return CONFIG.VISITOR_BASE_COUNT;
        }
    }

    incrementVisitorCount() {
        this.visitorCount += 1;
        try {
            localStorage.setItem(CONFIG.VISITOR_COUNT_KEY, this.visitorCount.toString());
        } catch (error) {
            console.warn('Failed to increment visitor count:', error);
        }
    }
}

// ==============================================
// Analytics & Tracking
// ==============================================
class Analytics {
    static track(eventName, parameters = {}) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, {
                ...parameters,
                timestamp: Date.now(),
                page_path: window.location.pathname
            });
        }

        // Custom analytics (can be extended for other providers)
        console.log('Analytics Event:', eventName, parameters);
    }

    static trackFormProgress(step, completionRate) {
        this.track('form_progress', {
            step: step,
            completion_rate: completionRate,
            form_type: 'validation'
        });
    }

    static trackPainPointSelection(painType, selected) {
        this.track('pain_point_interaction', {
            pain_type: painType,
            selected: selected,
            selection_count: appState.selectedPains.size
        });
    }

    static trackROICalculation(monthlySpend, currentROAS, estimatedSavings) {
        this.track('roi_calculated', {
            monthly_spend: monthlySpend,
            current_roas: currentROAS,
            estimated_savings: estimatedSavings
        });
    }

    static trackFormSubmission(formData) {
        this.track('form_submission', {
            form_type: 'validation',
            ad_spend_range: formData.ad_spend,
            pricing_preference: formData.pricing,
            role: formData.role,
            features_selected: formData.features ? formData.features.length : 0
        });
    }

    static trackExitIntent() {
        this.track('exit_intent_triggered', {
            time_on_page: Date.now() - pageLoadTime,
            scroll_depth: Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
        });
    }

    static trackScrollDepth(depth) {
        this.track('scroll_depth', {
            depth: depth,
            max_scroll: Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
        });
    }
}

// ==============================================
// Intersection Observer for Animations
// ==============================================
class ScrollAnimations {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        const options = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Trigger specific animations
                    if (entry.target.classList.contains('stats-grid')) {
                        this.animateNumbers();
                    }
                    
                    if (entry.target.classList.contains('roi-result')) {
                        entry.target.classList.add('animate');
                    }
                }
            });
        }, options);

        // Observe elements
        this.observeElements();
    }

    observeElements() {
        const elements = document.querySelectorAll(`
            .pain-card,
            .roi-calculator,
            .form-container,
            .stats-grid,
            .roi-result
        `);

        elements.forEach(el => {
            el.classList.add('fade-in');
            this.observer.observe(el);
        });
    }

    animateNumbers() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(element => {
            const target = parseFloat(element.dataset.target);
            const isDecimal = target % 1 !== 0;
            const duration = 2000;
            const steps = 60;
            const increment = target / steps;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                element.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
                element.style.animation = 'countUp 0.3s ease-out';
            }, duration / steps);
        });
    }
}

// ==============================================
// Typing Animation
// ==============================================
class TypingAnimation {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = Array.isArray(texts) ? texts : [texts];
        this.typeSpeed = options.typeSpeed || CONFIG.TYPING_SPEED;
        this.eraseSpeed = options.eraseSpeed || CONFIG.ERASE_SPEED;
        this.delay = options.delay || CONFIG.TYPING_DELAY;
        this.loop = options.loop !== false;
        this.currentTextIndex = 0;
        this.currentCharIndex = 0;
        this.isErasing = false;
        this.isRunning = false;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.type();
    }

    stop() {
        this.isRunning = false;
    }

    type() {
        if (!this.isRunning) return;

        const currentText = this.texts[this.currentTextIndex];
        
        if (this.isErasing) {
            // Erase text
            if (this.currentCharIndex > 0) {
                this.currentCharIndex--;
                this.element.textContent = currentText.substring(0, this.currentCharIndex);
                setTimeout(() => this.type(), this.eraseSpeed);
            } else {
                this.isErasing = false;
                this.currentTextIndex = (this.currentTextIndex + 1) % this.texts.length;
                setTimeout(() => this.type(), this.delay / 2);
            }
        } else {
            // Type text
            if (this.currentCharIndex < currentText.length) {
                this.currentCharIndex++;
                this.element.textContent = currentText.substring(0, this.currentCharIndex);
                setTimeout(() => this.type(), this.typeSpeed);
            } else {
                if (this.loop && this.texts.length > 1) {
                    this.isErasing = true;
                    setTimeout(() => this.type(), this.delay);
                } else if (!this.loop) {
                    this.stop();
                }
            }
        }
    }
}

// ==============================================
// Form Management
// ==============================================
class FormManager {
    constructor() {
        this.form = document.getElementById('validationForm');
        this.progressBar = document.querySelector('.progress-fill');
        this.progressText = document.querySelector('.progress-text');
        this.loadingElement = document.querySelector('.loading');
        this.successElement = document.querySelector('.success-message');
        this.submitButton = document.querySelector('#submit-btn');
        
        this.totalFields = this.form.querySelectorAll('input[required], select[required], textarea[required]').length;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSavedData();
        this.updateProgress();
        this.setupRealTimeValidation();
    }

    setupEventListeners() {
        // Form submission
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // Auto-save on input
        this.form.addEventListener('input', this.debounce(this.saveFormData.bind(this), 500));
        this.form.addEventListener('change', this.saveFormData.bind(this));
        
        // Progress tracking
        this.form.addEventListener('input', this.debounce(this.updateProgress.bind(this), 200));
        this.form.addEventListener('change', this.updateProgress.bind(this));
    }

    setupRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
        }

        // Required field validation
        if (field.required && !value) {
            isValid = false;
            message = 'This field is required';
        }

        this.showFieldValidation(field, isValid, message);
        return isValid;
    }

    showFieldValidation(field, isValid, message) {
        const existingError = field.parentNode.querySelector('.field-error');
        
        if (existingError) {
            existingError.remove();
        }

        if (!isValid && message) {
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = message;
            errorElement.style.color = 'var(--danger)';
            errorElement.style.fontSize = '0.875rem';
            errorElement.style.marginTop = '0.25rem';
            field.parentNode.appendChild(errorElement);
        }
    }

    clearFieldError(field) {
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    loadSavedData() {
        const savedData = appState.formProgress;
        
        Object.keys(savedData).forEach(key => {
            const element = this.form.elements[key];
            if (element && savedData[key]) {
                if (element.type === 'checkbox' || element.type === 'radio') {
                    if (Array.isArray(savedData[key])) {
                        savedData[key].forEach(value => {
                            const option = this.form.querySelector(`input[name="${key}"][value="${value}"]`);
                            if (option) {
                                option.checked = true;
                                option.closest('.radio-option, .checkbox-option')?.classList.add('selected');
                            }
                        });
                    } else {
                        const option = this.form.querySelector(`input[name="${key}"][value="${savedData[key]}"]`);
                        if (option) {
                            option.checked = true;
                            option.closest('.radio-option, .checkbox-option')?.classList.add('selected');
                        }
                    }
                } else {
                    element.value = savedData[key];
                }
            }
        });
    }

    saveFormData() {
        const formData = new FormData(this.form);
        const data = {};
        
        // Handle regular fields
        for (const [key, value] of formData.entries()) {
            if (data[key]) {
                // Convert to array for multiple values (checkboxes)
                if (Array.isArray(data[key])) {
                    data[key].push(value);
                } else {
                    data[key] = [data[key], value];
                }
            } else {
                data[key] = value;
            }
        }
        
        appState.saveFormProgress(data);
        
        // Track progress
        const completedFields = Object.keys(data).filter(key => {
            const value = data[key];
            return value && value.length > 0 && value !== '';
        }).length;
        
        const progressPercentage = Math.round((completedFields / this.totalFields) * 100);
        Analytics.trackFormProgress(completedFields, progressPercentage);
    }

    updateProgress() {
        const formData = new FormData(this.form);
        const completedFields = Array.from(formData.entries()).filter(([_, value]) => value && value.trim() !== '').length;
        const progressPercentage = Math.round((completedFields / this.totalFields) * 100);
        
        if (this.progressBar) {
            this.progressBar.style.width = `${progressPercentage}%`;
        }
        
        if (this.progressText) {
            this.progressText.textContent = `${progressPercentage}% Complete`;
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        // Show loading state
        this.setSubmissionState('loading');
        
        try {
            // Validate all fields
            const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
            let isFormValid = true;
            
            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isFormValid = false;
                }
            });
            
            if (!isFormValid) {
                throw new Error('Please correct the errors in the form');
            }
            
            // Get form data
            const formData = new FormData(this.form);
            const data = this.processFormData(formData);
            
            // Add selected pain points
            data.painPoints = Array.from(appState.selectedPains);
            data.visitorCount = appState.visitorCount;
            data.submissionTime = new Date().toISOString();
            
            // Track submission
            Analytics.trackFormSubmission(data);
            
            // Simulate processing delay (remove in production)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // The form will be handled by Netlify Forms automatically
            // No need for custom submission logic for Netlify
            
            // Show success state
            this.setSubmissionState('success');
            
            // Clear saved progress
            appState.clearFormProgress();
            
            // Trigger confetti animation
            this.triggerConfetti();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.setSubmissionState('error', error.message);
        }
    }

    processFormData(formData) {
        const data = {};
        
        for (const [key, value] of formData.entries()) {
            if (key === 'features') {
                // Handle multiple checkbox values
                if (!data[key]) data[key] = [];
                data[key].push(value);
            } else {
                data[key] = value;
            }
        }
        
        return data;
    }

    setSubmissionState(state, message = '') {
        // Reset all states
        this.loadingElement.classList.remove('show');
        this.successElement.classList.remove('show');
        this.submitButton.disabled = false;
        
        // Clear any existing error message
        const existingError = this.form.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }
        
        switch (state) {
            case 'loading':
                this.loadingElement.classList.add('show');
                this.submitButton.disabled = true;
                break;
                
            case 'success':
                this.successElement.classList.add('show');
                this.form.style.display = 'none';
                break;
                
            case 'error':
                const errorElement = document.createElement('div');
                errorElement.className = 'form-error';
                errorElement.textContent = message || 'An error occurred. Please try again.';
                errorElement.style.background = 'var(--danger)';
                errorElement.style.color = 'white';
                errorElement.style.padding = 'var(--spacing-sm)';
                errorElement.style.borderRadius = 'var(--radius-md)';
                errorElement.style.marginTop = 'var(--spacing-sm)';
                this.submitButton.parentNode.insertBefore(errorElement, this.submitButton);
                break;
        }
    }

    triggerConfetti() {
        // Simple confetti effect using CSS animations
        const confetti = document.querySelector('.confetti');
        if (confetti) {
            confetti.style.display = 'block';
            setTimeout(() => {
                confetti.style.display = 'none';
            }, 3000);
        }
    }

    debounce(func, wait) {
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
}

// ==============================================
// Pain Points Selection
// ==============================================
class PainPointsManager {
    constructor() {
        this.painCards = document.querySelectorAll('.pain-card');
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupKeyboardNavigation();
    }

    setupEventListeners() {
        this.painCards.forEach(card => {
            card.addEventListener('click', () => this.togglePain(card));
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.togglePain(card);
                }
            });
        });
    }

    setupKeyboardNavigation() {
        this.painCards.forEach((card, index) => {
            card.addEventListener('keydown', (e) => {
                let nextIndex;
                
                switch (e.key) {
                    case 'ArrowDown':
                    case 'ArrowRight':
                        e.preventDefault();
                        nextIndex = (index + 1) % this.painCards.length;
                        this.painCards[nextIndex].focus();
                        break;
                        
                    case 'ArrowUp':
                    case 'ArrowLeft':
                        e.preventDefault();
                        nextIndex = (index - 1 + this.painCards.length) % this.painCards.length;
                        this.painCards[nextIndex].focus();
                        break;
                }
            });
        });
    }

    togglePain(card) {
        const painType = card.dataset.pain;
        const isSelected = card.classList.contains('selected');
        
        // Add ripple effect
        this.addRippleEffect(card, event);
        
        if (isSelected) {
            card.classList.remove('selected');
            card.setAttribute('aria-pressed', 'false');
            appState.selectedPains.delete(painType);
        } else {
            card.classList.add('selected');
            card.setAttribute('aria-pressed', 'true');
            appState.selectedPains.add(painType);
            
            // Add bounce animation
            card.style.animation = 'none';
            setTimeout(() => {
                card.style.animation = 'pulse 0.6s ease-out';
            }, 10);
        }
        
        // Track the selection
        Analytics.trackPainPointSelection(painType, !isSelected);
    }

    addRippleEffect(element, event) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = (event?.clientX || rect.left + rect.width / 2) - rect.left - size / 2;
        const y = (event?.clientY || rect.top + rect.height / 2) - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('btn-ripple');
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// ==============================================
// ROI Calculator
// ==============================================
class ROICalculator {
    constructor() {
        this.monthlySpendInput = document.getElementById('monthly-spend');
        this.currentROASSelect = document.getElementById('current-roas');
        this.resultElement = document.getElementById('roi-result');
        this.savingsAmountElement = document.getElementById('savings-amount');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSavedValues();
    }

    setupEventListeners() {
        this.monthlySpendInput.addEventListener('input', this.debounce(this.calculate.bind(this), 300));
        this.currentROASSelect.addEventListener('change', this.calculate.bind(this));
    }

    loadSavedValues() {
        const savedData = appState.formProgress;
        if (savedData.monthlySpend) {
            this.monthlySpendInput.value = savedData.monthlySpend;
        }
        if (savedData.currentROAS) {
            this.currentROASSelect.value = savedData.currentROAS;
        }
        this.calculate();
    }

    calculate() {
        const spend = parseFloat(this.monthlySpendInput.value) || 0;
        const roas = parseFloat(this.currentROASSelect.value) || 0;
        
        if (spend > 0 && roas > 0) {
            // Calculate improvement rate based on current performance
            // Lower ROAS = higher potential improvement
            const improvementRate = this.getImprovementRate(roas);
            const savings = Math.round(spend * improvementRate);
            
            // Animate the savings amount
            this.animateSavings(savings);
            
            // Show result with animation
            this.resultElement.style.display = 'block';
            this.resultElement.classList.add('animate');
            
            // Track calculation
            Analytics.trackROICalculation(spend, roas, savings);
            
            // Save values
            appState.saveFormProgress({
                ...appState.formProgress,
                monthlySpend: spend,
                currentROAS: roas
            });
            
        } else {
            this.resultElement.style.display = 'none';
            this.resultElement.classList.remove('animate');
        }
    }

    getImprovementRate(roas) {
        if (roas <= 1.5) return 0.40; // 40% improvement for very low ROAS
        if (roas <= 2) return 0.35;   // 35% improvement for low ROAS
        if (roas <= 2.5) return 0.30; // 30% improvement for medium ROAS
        if (roas <= 3) return 0.25;   // 25% improvement for good ROAS
        return 0.20; // 20% improvement for high ROAS
    }

    animateSavings(targetAmount) {
        const duration = 1500;
        const steps = 30;
        const increment = targetAmount / steps;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetAmount) {
                current = targetAmount;
                clearInterval(timer);
            }
            
            this.savingsAmountElement.textContent = `$${Math.round(current).toLocaleString()}`;
        }, duration / steps);
    }

    debounce(func, wait) {
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
}

// ==============================================
// Countdown Timer
// ==============================================
class CountdownTimer {
    constructor() {
        this.deadline = CONFIG.BETA_DEADLINE;
        this.elements = {
            days: document.getElementById('days'),
            hours: document.getElementById('hours'),
            minutes: document.getElementById('minutes'),
            seconds: document.getElementById('seconds')
        };
        this.timer = null;
        
        this.init();
    }

    init() {
        this.update();
        this.timer = setInterval(() => this.update(), 1000);
    }

    update() {
        const now = Date.now();
        const difference = this.deadline - now;
        
        if (difference <= 0) {
            // Deadline reached
            this.stop();
            this.showExpired();
            return;
        }
        
        const times = this.calculateTime(difference);
        this.updateDisplay(times);
    }

    calculateTime(difference) {
        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000)
        };
    }

    updateDisplay(times) {
        Object.keys(this.elements).forEach(key => {
            const element = this.elements[key];
            if (element) {
                const newValue = times[key].toString().padStart(2, '0');
                if (element.textContent !== newValue) {
                    element.textContent = newValue;
                    element.style.animation = 'pulse 0.5s ease-out';
                    setTimeout(() => {
                        element.style.animation = '';
                    }, 500);
                }
            }
        });
    }

    showExpired() {
        const countdownSection = document.querySelector('.countdown-section');
        if (countdownSection) {
            countdownSection.innerHTML = `
                <div class="container">
                    <h3>Beta Registration Closed</h3>
                    <p>Join our waitlist to be notified when we launch!</p>
                </div>
            `;
        }
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}

// ==============================================
// Exit Intent Popup
// ==============================================
class ExitIntentManager {
    constructor() {
        this.popup = document.getElementById('exitPopup');
        this.closeButton = this.popup?.querySelector('.exit-popup-close');
        this.form = this.popup?.querySelector('.exit-popup-form');
        this.isShown = false;
        this.mouseLeaveTimer = null;
        
        this.init();
    }

    init() {
        if (!this.popup || appState.isExitPopupShown) return;
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Mouse leave detection (desktop)
        document.addEventListener('mouseleave', (e) => {
            if (e.clientY <= 0 && !this.isShown) {
                this.show();
            }
        });
        
        // Mobile: detect rapid scroll to top
        let lastScrollY = window.scrollY;
        let scrollUpCount = 0;
        
        window.addEventListener('scroll', () => {
            if (window.scrollY < lastScrollY) {
                scrollUpCount++;
                if (scrollUpCount > 5 && window.scrollY < 100 && !this.isShown) {
                    this.show();
                }
            } else {
                scrollUpCount = 0;
            }
            lastScrollY = window.scrollY;
        });
        
        // Close popup
        this.closeButton?.addEventListener('click', () => this.hide());
        this.popup?.addEventListener('click', (e) => {
            if (e.target === this.popup) {
                this.hide();
            }
        });
        
        // Handle form submission
        this.form?.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            Analytics.track('exit_intent_signup', { email: email });
            this.showThankYou();
        });
        
        // Keyboard handling
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isShown) {
                this.hide();
            }
        });
    }

    show() {
        if (this.isShown || !this.popup) return;
        
        this.isShown = true;
        appState.isExitPopupShown = true;
        sessionStorage.setItem(CONFIG.EXIT_SHOWN_KEY, 'true');
        
        this.popup.classList.add('show');
        this.popup.style.display = 'flex';
        
        // Focus management
        const emailInput = this.popup.querySelector('input[type="email"]');
        setTimeout(() => emailInput?.focus(), 300);
        
        // Track event
        Analytics.trackExitIntent();
    }

    hide() {
        if (!this.isShown || !this.popup) return;
        
        this.popup.classList.remove('show');
        setTimeout(() => {
            this.popup.style.display = 'none';
        }, 300);
        
        this.isShown = false;
    }

    showThankYou() {
        const content = this.popup.querySelector('.exit-popup-content');
        if (content) {
            content.innerHTML = `
                <button class="exit-popup-close" aria-label="Close popup">&times;</button>
                <h3>Thank you!</h3>
                <p>We'll notify you as soon as we launch. Keep an eye on your inbox!</p>
                <div style="text-align: center; margin-top: 20px;">
                    <div style="font-size: 3rem;">🎉</div>
                </div>
            `;
            
            // Re-attach close handler
            content.querySelector('.exit-popup-close').addEventListener('click', () => this.hide());
            
            // Auto-close after delay
            setTimeout(() => this.hide(), 3000);
        }
    }
}

// ==============================================
// Activity Notifications
// ==============================================
class ActivityNotifications {
    constructor() {
        this.container = document.querySelector('.activity-notifications');
        this.notifications = [];
        this.timer = null;
        
        this.sampleActivities = [
            { name: 'Sarah M.', action: 'joined the beta', time: '2 min ago', avatar: 'SM' },
            { name: 'Mike R.', action: 'calculated ROI', time: '5 min ago', avatar: 'MR' },
            { name: 'Jessica L.', action: 'completed signup', time: '8 min ago', avatar: 'JL' },
            { name: 'David K.', action: 'joined from California', time: '12 min ago', avatar: 'DK' },
            { name: 'Anna B.', action: 'calculated $4.2k savings', time: '15 min ago', avatar: 'AB' },
            { name: 'Tom W.', action: 'completed survey', time: '18 min ago', avatar: 'TW' }
        ];
        
        this.init();
    }

    init() {
        if (!this.container) return;
        
        // Start showing notifications after a delay
        setTimeout(() => {
            this.startNotifications();
        }, 10000); // Wait 10 seconds after page load
    }

    startNotifications() {
        this.showRandomNotification();
        
        // Set up recurring notifications
        this.timer = setInterval(() => {
            this.showRandomNotification();
        }, CONFIG.NOTIFICATION_INTERVAL);
    }

    showRandomNotification() {
        const activity = this.getRandomActivity();
        const notification = this.createNotification(activity);
        
        this.container.appendChild(notification);
        this.notifications.push(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);
        
        // Limit number of visible notifications
        if (this.notifications.length > 3) {
            const oldest = this.notifications.shift();
            this.hideNotification(oldest);
        }
    }

    getRandomActivity() {
        const randomIndex = Math.floor(Math.random() * this.sampleActivities.length);
        const activity = { ...this.sampleActivities[randomIndex] };
        
        // Randomize the time
        const minutes = Math.floor(Math.random() * 30) + 1;
        activity.time = `${minutes} min ago`;
        
        return activity;
    }

    createNotification(activity) {
        const notification = document.createElement('div');
        notification.className = 'activity-notification';
        notification.innerHTML = `
            <div class="avatar">${activity.avatar}</div>
            <div class="content">
                <div class="name">${activity.name}</div>
                <div class="action">${activity.action}</div>
            </div>
            <div class="time">${activity.time}</div>
        `;
        
        return notification;
    }

    hideNotification(notification) {
        if (notification && notification.parentNode) {
            notification.classList.add('hide');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
            
            // Remove from tracking array
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        }
    }

    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        
        // Clear all notifications
        this.notifications.forEach(notification => {
            this.hideNotification(notification);
        });
    }
}

// ==============================================
// Radio/Checkbox Enhancement
// ==============================================
class FormOptionsManager {
    constructor() {
        this.radioOptions = document.querySelectorAll('.radio-option');
        this.checkboxOptions = document.querySelectorAll('.checkbox-option');
        
        this.init();
    }

    init() {
        this.setupRadioOptions();
        this.setupCheckboxOptions();
    }

    setupRadioOptions() {
        this.radioOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const radio = option.querySelector('input[type="radio"]');
                const name = radio.name;
                
                // Clear other selections in same group
                document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
                    r.closest('.radio-option').classList.remove('selected');
                });
                
                // Select this one
                if (e.target.tagName !== 'INPUT') {
                    radio.checked = true;
                }
                option.classList.add('selected');
                
                // Trigger change event for form manager
                radio.dispatchEvent(new Event('change', { bubbles: true }));
            });
        });
    }

    setupCheckboxOptions() {
        this.checkboxOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const checkbox = option.querySelector('input[type="checkbox"]');
                
                if (e.target.tagName !== 'INPUT') {
                    checkbox.checked = !checkbox.checked;
                }
                
                option.classList.toggle('selected', checkbox.checked);
                
                // Trigger change event for form manager
                checkbox.dispatchEvent(new Event('change', { bubbles: true }));
            });
        });
    }
}

// ==============================================
// Scroll Depth Tracking
// ==============================================
class ScrollDepthTracker {
    constructor() {
        this.trackedDepths = new Set();
        this.milestones = [25, 50, 75, 90, 100];
        
        this.init();
    }

    init() {
        window.addEventListener('scroll', this.throttle(this.trackScrollDepth.bind(this), 200));
    }

    trackScrollDepth() {
        const scrollPercent = Math.round(
            (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        );
        
        this.milestones.forEach(milestone => {
            if (scrollPercent >= milestone && !this.trackedDepths.has(milestone)) {
                this.trackedDepths.add(milestone);
                Analytics.trackScrollDepth(milestone);
            }
        });
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// ==============================================
// Visitor Count Display
// ==============================================
class VisitorCountManager {
    constructor() {
        this.visitorCountElement = document.querySelector('.visitor-count');
        this.spotsRemainingElement = document.getElementById('spots-remaining');
        
        this.init();
    }

    init() {
        this.updateVisitorCount();
        this.updateSpotsRemaining();
        
        // Increment visitor count
        appState.incrementVisitorCount();
        
        // Update display periodically to show "live" activity
        setInterval(() => {
            this.simulateLiveUpdate();
        }, 120000); // Every 2 minutes
    }

    updateVisitorCount() {
        if (this.visitorCountElement) {
            this.visitorCountElement.textContent = `${appState.visitorCount}+`;
        }
    }

    updateSpotsRemaining() {
        if (this.spotsRemainingElement) {
            // Calculate remaining spots based on visitor count
            const totalSpots = 100;
            const baseSpotsTaken = 33; // Starting point
            const additionalSpots = Math.floor(appState.visitorCount / 15); // 1 spot per 15 visitors
            const spotsTaken = Math.min(baseSpotsTaken + additionalSpots, totalSpots - 5); // Leave at least 5
            const spotsRemaining = totalSpots - spotsTaken;
            
            this.spotsRemainingElement.textContent = spotsRemaining;
        }
    }

    simulateLiveUpdate() {
        // Occasionally increment visitor count to show activity
        if (Math.random() < 0.3) { // 30% chance every 2 minutes
            appState.incrementVisitorCount();
            this.updateVisitorCount();
            this.updateSpotsRemaining();
        }
    }
}

// ==============================================
// Page Load Performance
// ==============================================
class PerformanceManager {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        // Track page load performance
        window.addEventListener('load', () => {
            this.trackLoadMetrics();
        });
        
        // Track Core Web Vitals if supported
        this.trackCoreWebVitals();
    }

    trackLoadMetrics() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
            
            this.metrics.loadTime = loadTime;
            this.metrics.domReady = domReady;
            
            Analytics.track('page_performance', {
                load_time: loadTime,
                dom_ready: domReady,
                connection: navigator.connection?.effectiveType || 'unknown'
            });
        }
    }

    trackCoreWebVitals() {
        // This would integrate with web-vitals library in production
        // For now, just track what we can measure
        
        // Measure time to first paint
        if (window.performance && window.performance.getEntriesByType) {
            const paintEntries = window.performance.getEntriesByType('paint');
            paintEntries.forEach(entry => {
                this.metrics[entry.name] = entry.startTime;
            });
        }
    }
}

// ==============================================
// Global Variables & Initialization
// ==============================================
let appState;
let pageLoadTime;

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    pageLoadTime = Date.now();
    
    // Initialize global state
    appState = new AppState();
    
    // Wait for language manager to initialize
    try {
        await appState.languageManager.initPromise;
        console.log('🌍 Language initialized:', appState.languageManager.getCurrentLanguage());
    } catch (error) {
        console.warn('Language initialization failed:', error);
    }
    
    // Initialize all managers
    const scrollAnimations = new ScrollAnimations();
    const formManager = new FormManager();
    const painPointsManager = new PainPointsManager();
    const roiCalculator = new ROICalculator();
    const countdownTimer = new CountdownTimer();
    const exitIntentManager = new ExitIntentManager();
    const activityNotifications = new ActivityNotifications();
    const formOptionsManager = new FormOptionsManager();
    const scrollDepthTracker = new ScrollDepthTracker();
    const visitorCountManager = new VisitorCountManager();
    const performanceManager = new PerformanceManager();
    
    // Initialize typing animations (after language is applied)
    setTimeout(() => {
        const typingElements = document.querySelectorAll('.typing-text');
        typingElements.forEach(element => {
            const text = element.dataset.text || element.textContent;
            const typingAnimation = new TypingAnimation(element, [text], {
                typeSpeed: appState.languageManager.isChineseLanguage() ? 80 : 100, // Slower for Chinese
                loop: false
            });
            
            // Start typing animation when element comes into view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        typingAnimation.start();
                        observer.unobserve(element);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(element);
        });
    }, 100); // Small delay to ensure language is applied
    
    // Track page view with language information
    Analytics.track('page_view', {
        page_title: document.title,
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        language: appState.languageManager.getCurrentLanguage(),
        browser_language: navigator.language || navigator.languages?.[0]
    });
    
    console.log('🚀 AdsOpti AI Landing Page Loaded Successfully');
});

// Handle page visibility changes (for pause/resume functionality)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        Analytics.track('page_hidden', {
            time_on_page: Date.now() - pageLoadTime
        });
    } else {
        Analytics.track('page_visible', {
            time_away: Date.now() - pageLoadTime
        });
    }
});

// Handle page unload (track session duration)
window.addEventListener('beforeunload', () => {
    Analytics.track('page_unload', {
        session_duration: Date.now() - pageLoadTime,
        scroll_depth: Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100)
    });
});

// Export for testing purposes (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AppState,
        Analytics,
        FormManager,
        TypingAnimation,
        CONFIG
    };
}