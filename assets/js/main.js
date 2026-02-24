let manualThemeOverride = false;
let activePhotoId = null;
let activePostId = null;
let lastScrollY = 0;
let scrollTicking = false;
let activeModalId = null;
let lastFocusedElement = null;
const PAGE_TRANSITION_MS = 420;
const LOADER_MIN_MS = 2000;
const loaderStartAt = Date.now();
const CONTACT_TARGET_EMAIL = 'ola@seuemail.com';
const SUPPORTED_LOCALES = ['pt-BR', 'en-US'];
const DEFAULT_LOCALE = 'pt-BR';
const I18N_BASE_PATH = 'data/i18n';
let currentLocale = DEFAULT_LOCALE;
let localeMessages = {};

const storageKeys = {
    likes: 'thierry.likes.v1',
    comments: 'thierry.comments.v1',
    messages: 'thierry.messages.v1',
    locale: 'thierry.locale.v1'
};

const FALLBACK_DATA = {
    posts: [
        {
            id: 'post_2026_02_bento-grids',
            slug: 'a-era-das-bento-grids',
            title: 'A era das Bento Grids: por que a organizacao celular dominou a web',
            excerpt: 'Uma analise profunda sobre layouts modulares, hierarquia visual e UX.',
            content: [
                'Este artigo e um conteudo ficticio para validar arquitetura editorial no website.',
                'A logica de grid modular organiza leitura e reduz ruido visual.',
                'Com dados e ritmo tipografico, o layout passa a contar historia sem depender de plataformas externas.'
            ],
            category: 'Design',
            created_at: '2026-02-14',
            updated_at: '2026-02-14',
            status: 'published'
        },
        {
            id: 'post_2026_02_astro-ilhas',
            slug: 'astro-5-e-as-ilhas-de-servidor',
            title: 'Astro 5 e as Ilhas de Servidor',
            excerpt: 'Panorama tecnico sobre renderizacao parcial e estrategia de paginas leves.',
            content: [
                'Conteudo ficticio para testes de card e pagina interna.',
                'O foco desta fase continua em HTML e JS puro, com migracao futura opcional.'
            ],
            category: 'Tech',
            created_at: '2026-02-05',
            updated_at: '2026-02-05',
            status: 'published'
        },
        {
            id: 'post_2026_01_spotify-api',
            slug: 'integrando-a-api-do-spotify',
            title: 'Integrando a API do Spotify em 10 minutos',
            excerpt: 'Passo a passo inicial para provar integracao sem perder a identidade visual.',
            content: [
                'Conteudo ficticio para validar variacoes de comprimento de texto.',
                'Os proximos passos incluem fallback robusto e estado de erro amigavel.'
            ],
            category: 'Tutorial',
            created_at: '2026-01-28',
            updated_at: '2026-01-28',
            status: 'published'
        },
        {
            id: 'post_2026_01_minimalismo-brutalista',
            slug: 'minimalismo-no-design-brutalista-contemporaneo',
            title: 'O Minimalismo no Design Brutalista Contemporaneo',
            excerpt: 'Notas sobre contraste, estrutura e intencao em interfaces autorais.',
            content: [
                'Texto ficticio para compor o quarto bloco da grade editorial.',
                'A direcao visual privilegia estrutura explicita, bordas e ritmo de leitura.'
            ],
            category: 'Design',
            created_at: '2026-01-20',
            updated_at: '2026-01-20',
            status: 'published'
        },
        {
            id: 'post_2026_01_strava-rotina',
            slug: 'como-o-strava-mudou-minha-rotina-de-dev',
            title: 'Como o Strava mudou minha rotina de dev',
            excerpt: 'Relato ficticio sobre consistencia, energia e foco na semana de trabalho.',
            content: [
                'Texto ficticio para completar a composicao de cards secundarios.',
                'A secao reforca a narrativa pessoal integrada ao dashboard.'
            ],
            category: 'Life',
            created_at: '2026-01-15',
            updated_at: '2026-01-15',
            status: 'published'
        }
    ],
    photos: [
        {
            id: 'photo_2026_ensaio_01_001',
            slug: 'cidade-em-contraste-01',
            title: 'Cidade em contraste',
            description: 'Luz dura, concreto e recortes urbanos em caminhada noturna.',
            essay_id: 'ensaio_01',
            year: 2026,
            media_type: 'image',
            created_at: '2026-02-10',
            updated_at: '2026-02-10',
            status: 'published'
        },
        {
            id: 'photo_2026_ensaio_01_002',
            slug: 'cidade-em-contraste-02',
            title: 'Sinais de madrugada',
            description: 'Reflexos em asfalto molhado e semaforos em longa exposicao.',
            essay_id: 'ensaio_01',
            year: 2026,
            media_type: 'image',
            created_at: '2026-02-11',
            updated_at: '2026-02-11',
            status: 'published'
        },
        {
            id: 'video_2026_ensaio_01_003',
            slug: 'cidade-em-contraste-video-01',
            title: 'Travessia noturna',
            description: 'Video curto com fluxo de pedestres e luzes da avenida.',
            essay_id: 'ensaio_01',
            year: 2026,
            media_type: 'video',
            created_at: '2026-02-12',
            updated_at: '2026-02-12',
            status: 'published'
        },
        {
            id: 'photo_2025_ensaio_02_001',
            slug: 'ritmo-domestico-01',
            title: 'Ritmo domestico',
            description: 'Objetos, texturas e silencios do cotidiano.',
            essay_id: 'ensaio_02',
            year: 2025,
            media_type: 'image',
            created_at: '2025-09-04',
            updated_at: '2025-09-04',
            status: 'published'
        },
        {
            id: 'photo_2025_ensaio_02_002',
            slug: 'ritmo-domestico-02',
            title: 'Luz de janela',
            description: 'Sombras suaves em objetos de uso diario no inicio da manha.',
            essay_id: 'ensaio_02',
            year: 2025,
            media_type: 'image',
            created_at: '2025-09-06',
            updated_at: '2025-09-06',
            status: 'published'
        },
        {
            id: 'video_2025_ensaio_02_003',
            slug: 'ritmo-domestico-video-01',
            title: 'Som da casa',
            description: 'Video curto com movimentos lentos e ambiente intimista.',
            essay_id: 'ensaio_02',
            year: 2025,
            media_type: 'video',
            created_at: '2025-09-08',
            updated_at: '2025-09-08',
            status: 'published'
        },
        {
            id: 'photo_2024_ensaio_03_001',
            slug: 'cor-de-domingo-01',
            title: 'Cor de domingo',
            description: 'Uma serie de cenas espontaneas em luz natural.',
            essay_id: 'ensaio_03',
            year: 2024,
            media_type: 'image',
            created_at: '2024-11-16',
            updated_at: '2024-11-16',
            status: 'published'
        },
        {
            id: 'photo_2024_ensaio_03_002',
            slug: 'cor-de-domingo-02',
            title: 'Fim de tarde aberto',
            description: 'Cores quentes e movimento leve em espacos publicos.',
            essay_id: 'ensaio_03',
            year: 2024,
            media_type: 'image',
            created_at: '2024-11-20',
            updated_at: '2024-11-20',
            status: 'published'
        }
    ],
    essays: [
        {
            id: 'ensaio_01',
            name: 'Ensaio 01',
            title: 'Cidade em contraste',
            description: 'Serie urbana com foco em geometria, sombra e ritmo noturno.',
            status: 'published'
        },
        {
            id: 'ensaio_02',
            name: 'Ensaio 02',
            title: 'Ritmo domestico',
            description: 'Narrativa de intimidade visual no espaco domestico.',
            status: 'published'
        },
        {
            id: 'ensaio_03',
            name: 'Ensaio 03',
            title: 'Cor de domingo',
            description: 'Recortes espontaneos de fim de semana em luz natural.',
            status: 'published'
        }
    ],
    mediaMap: []
};

const state = {
    posts: [],
    photos: [],
    essays: [],
    mediaMap: [],
    photoFilters: {
        essay: 'all',
        year: 'all'
    },
    likes: {},
    comments: {},
    messages: {}
};

function normalizeLocale(raw) {
    if (!raw) return DEFAULT_LOCALE;
    const lower = String(raw).toLowerCase();
    if (lower.startsWith('pt')) return 'pt-BR';
    if (lower.startsWith('en')) return 'en-US';
    return DEFAULT_LOCALE;
}

function deepGet(object, path) {
    return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), object);
}

function t(key, fallback = '') {
    const translated = deepGet(localeMessages, key);
    return translated === undefined || translated === null ? fallback : String(translated);
}

async function loadLocaleMessages(locale) {
    try {
        const response = await fetch(`${I18N_BASE_PATH}/${locale}.json`, { cache: 'no-store' });
        if (!response.ok) throw new Error(`falha i18n ${locale}`);
        localeMessages = await response.json();
    } catch (error) {
        console.warn('erro ao carregar traducoes, mantendo texto atual:', error.message);
        localeMessages = {};
    }
}

function setText(selector, key, fallback = '') {
    const element = document.querySelector(selector);
    if (!element) return;
    element.textContent = t(key, fallback);
}

function setHTML(selector, key, fallback = '') {
    const element = document.querySelector(selector);
    if (!element) return;
    element.innerHTML = t(key, fallback);
}

function setPlaceholder(selector, key, fallback = '') {
    const element = document.querySelector(selector);
    if (!element) return;
    element.setAttribute('placeholder', t(key, fallback));
}

function updateLocaleButtons() {
    const ptButton = document.getElementById('lang-pt');
    const enButton = document.getElementById('lang-en');
    if (!ptButton || !enButton) return;

    const isPt = currentLocale === 'pt-BR';
    ptButton.classList.toggle('is-active', isPt);
    enButton.classList.toggle('is-active', !isPt);
    ptButton.setAttribute('aria-pressed', String(isPt));
    enButton.setAttribute('aria-pressed', String(!isPt));
}

function applyLocaleToStaticContent() {
    document.documentElement.lang = currentLocale;

    setText('#skip-link', 'a11y.skip_content', 'Pular para o conteudo');
    setText('#loader-copy', 'loader.message', 'Carregando');
    const loader = document.getElementById('site-loader');
    if (loader) {
        loader.setAttribute('aria-label', t('loader.aria', 'Carregando pagina'));
    }
    setText('#nav-dashboard', 'nav.dashboard', 'Dashboard');
    setText('#nav-sobre', 'nav.about', 'Sobre');
    setText('#nav-fotografias', 'nav.photos', 'Fotografias');
    setText('#nav-blog', 'nav.blog', 'Blog');
    setText('#nav-contato', 'nav.contact', 'Contato');

    setText('#hero-label', 'hero.label', 'Informacoes');
    setHTML('#hero-title', 'hero.title_html', 'Designer, developer e<br>observador da vida.<br>Construo meu.ponto.');
    setText('#time-status', 'theme.status.syncing', 'Syncing...');

    setText('#about-label', 'about.label', 'Sobre');
    setText('#about-title', 'about.title', 'uma vida em construcao constante.');
    setText('#about-intro', 'about.intro', 'Este website e meu arquivo vivo.');
    setText('#about-focus-label', 'about.focus.label', 'Foco Atual');
    setText('#about-focus-title', 'about.focus.title', 'Transformar sinais do cotidiano em produto digital com identidade.');
    setText('#about-focus-body', 'about.focus.body', 'Interface, conteudo e sistema visual trabalhando juntos, sem excesso.');
    setText('#about-base-label', 'about.base.label', 'Base');
    setText('#about-base-title', 'about.base.title', 'Design de interface, front-end e estrategia editorial.');
    setText('#about-base-body', 'about.base.body', 'Do conceito ao codigo, com foco em clareza, ritmo e performance.');
    setText('#about-direction-label', 'about.direction.label', 'Direcao');
    setText('#about-direction-title', 'about.direction.title', 'Construir um ecossistema pessoal, nao apenas um portfolio.');
    setText('#about-direction-body', 'about.direction.body', 'meu.ponto como laboratorio continuo de pensamento, produto e presenca digital.');
    setText('#about-timeline-label', 'about.timeline.label', 'Linha do Tempo');
    setText('#about-timeline-2009', 'about.timeline.y2009', 'Inicio da minha presenca digital.');
    setText('#about-timeline-2024', 'about.timeline.y2024', 'Consolidacao de um fluxo autoral.');
    setText('#about-timeline-2026', 'about.timeline.y2026', 'Thierry Rene Matos vira plataforma biografica.');
    setText('#about-principles-label', 'about.principles.label', 'Principios');
    setText('#about-principle-1', 'about.principles.p1', 'Clareza antes de volume');
    setText('#about-principle-2', 'about.principles.p2', 'Identidade antes de tendencia');
    setText('#about-principle-3', 'about.principles.p3', 'Consistencia antes de pressa');

    setText('#blog-hero-label', 'blog.hero.label', 'meu.ponto - meu ponto de vista');
    setText('#blog-hero-title', 'blog.hero.title', 'Writing & Thoughts');
    setText('#post-back-button', 'post.back', '<- Voltar para o blogue');
    setText('#post-share-label', 'post.share', 'Partilhar');
    setText('#post-related-label', 'post.related', 'Relacionados');

    setText('#contact-section-label', 'contact.section_label', 'Contato');
    setText('#contact-section-title', 'contact.title', 'Vamos criar algo real.');
    setText('#contact-section-intro', 'contact.intro', 'Preencha o formulario para conversarmos.');
    setText('#contact-name-label', 'contact.form.name.label', 'Nome');
    setPlaceholder('#contact-name', 'contact.form.name.placeholder', 'Seu nome completo');
    setText('#contact-email-label', 'contact.form.email.label', 'E-mail');
    setPlaceholder('#contact-email', 'contact.form.email.placeholder', 'voce@email.com');
    setText('#contact-subject-label', 'contact.form.subject.label', 'Assunto');
    setText('#contact-subject-option-empty', 'contact.form.subject.options.empty', 'Selecione um tema');
    setText('#contact-subject-option-website', 'contact.form.subject.options.website', 'Projeto de website');
    setText('#contact-subject-option-ux', 'contact.form.subject.options.ux', 'Consultoria de UX/UI');
    setText('#contact-subject-option-content', 'contact.form.subject.options.content', 'Parceria de conteudo');
    setText('#contact-subject-option-other', 'contact.form.subject.options.other', 'Outro assunto');
    setText('#contact-message-label', 'contact.form.message.label', 'Mensagem');
    setPlaceholder('#contact-message', 'contact.form.message.placeholder', 'Conte um pouco sobre contexto, objetivo e prazo.');
    setText('#contact-consent-text', 'contact.form.consent', 'Concordo em ser contactado por e-mail.');
    setText('#contact-submit-btn', 'contact.form.submit', 'Enviar mensagem');
    setText('#contact-status', 'contact.form.status.ready', 'Pronto para enviar.');
    setText('#contact-direct-label', 'contact.direct.label', 'Canais diretos');
    setText('#contact-direct-email-label', 'contact.direct.email_label', 'E-mail');
    setText('#contact-direct-linkedin-label', 'contact.direct.linkedin_label', 'LinkedIn');
    setText('#contact-direct-sla-label', 'contact.direct.sla_label', 'SLA');
    setText('#contact-direct-sla-text', 'contact.direct.sla_text', 'Retorno em ate 2 dias uteis.');

    setText('#footer-left', 'footer.left', 'Feito com amor em uma tarde de domingo');
    setText('#footer-right', 'footer.right', 'de 2009 ate hoje');

    setText('#comments-modal-title', 'modals.comments.title', 'Comentarios');
    setText('#comments-modal-close', 'common.close', 'fechar');
    setPlaceholder('#comment-input', 'modals.comments.placeholder', 'Escreva um comentario curto');
    setText('#comments-submit', 'modals.comments.submit', 'Publicar');
    setText('#message-modal-title', 'modals.message.title', 'Mensagem privada');
    setText('#message-modal-close', 'common.close', 'fechar');
    setText('#message-modal-help', 'modals.message.help', 'Interacao local para prototipo de UX.');
    setPlaceholder('#message-input', 'modals.message.placeholder', 'Escreva sua mensagem privada');
    setText('#message-submit', 'modals.message.submit', 'Enviar');

    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.setAttribute('aria-label', t('theme.toggle_aria', 'Alternar tema claro e escuro'));
    }

    const ptButton = document.getElementById('lang-pt');
    const enButton = document.getElementById('lang-en');
    if (ptButton) ptButton.setAttribute('aria-label', t('lang.pt_aria', 'Alterar idioma para portugues'));
    if (enButton) enButton.setAttribute('aria-label', t('lang.en_aria', 'Switch language to English'));
}

async function setLocale(locale, options = {}) {
    const normalized = normalizeLocale(locale);
    if (!SUPPORTED_LOCALES.includes(normalized)) return;
    currentLocale = normalized;

    await loadLocaleMessages(currentLocale);
    applyLocaleToStaticContent();
    updateLocaleButtons();

    if (!options.skipPersist) {
        localStorage.setItem(storageKeys.locale, currentLocale);
    }

    renderPhotoFilters();
    renderPhotoGrid();
    renderBlogList();
    if (activePostId) openPostById(activePostId);
}

function updateActiveNav(navId) {
    document.querySelectorAll('nav a').forEach((link) => link.classList.remove('active-nav'));
    if (!navId) return;
    const navLink = document.getElementById('nav-' + navId);
    if (navLink) navLink.classList.add('active-nav');
}

function transitionToPage(pageId, options = {}) {
    const { navId = pageId, updateNav = true } = options;
    const targetPage = document.getElementById('page-' + pageId);
    if (!targetPage) return;

    if (updateNav) {
        updateActiveNav(navId);
    } else {
        updateActiveNav(null);
    }

    const currentPage = document.querySelector('.page-content.active');
    if (!currentPage || currentPage === targetPage) {
        targetPage.classList.add('active');
        targetPage.classList.remove('page-transition-out');
        targetPage.classList.add('page-transition-in');
        window.setTimeout(() => targetPage.classList.remove('page-transition-in'), PAGE_TRANSITION_MS);
        window.scrollTo(0, 0);
        return;
    }

    currentPage.classList.remove('page-transition-in');
    currentPage.classList.add('page-transition-out');

    targetPage.classList.remove('page-transition-out');
    targetPage.classList.add('active', 'page-transition-in');

    window.setTimeout(() => {
        currentPage.classList.remove('active', 'page-transition-out');
    }, PAGE_TRANSITION_MS);

    window.setTimeout(() => {
        targetPage.classList.remove('page-transition-in');
    }, PAGE_TRANSITION_MS);

    window.scrollTo(0, 0);
}

function showPage(pageId) {
    transitionToPage(pageId, { navId: pageId, updateNav: true });
}

function formatDate(dateValue) {
    const d = new Date(dateValue + 'T12:00:00');
    return d.toLocaleDateString(currentLocale, {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

function readStorage(key, fallback = {}) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw);
    } catch {
        return fallback;
    }
}

function writeStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function setContactStatus(message, state = 'idle') {
    const status = document.getElementById('contact-status');
    if (!status) return;
    status.dataset.state = state;
    status.textContent = message;
}

function handleContactSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const submitBtn = document.getElementById('contact-submit-btn');
    if (!(form instanceof HTMLFormElement) || !submitBtn) return;

    const honeypot = form.elements.namedItem('company_website');
    if (honeypot && honeypot.value) {
        setContactStatus(t('contact.form.status.validation_error', 'Falha ao validar envio. Tente novamente.'), 'error');
        return;
    }

    if (!form.checkValidity()) {
        form.reportValidity();
        setContactStatus(t('contact.form.status.required_error', 'Revise os campos obrigatorios antes de enviar.'), 'error');
        return;
    }

    const formData = new FormData(form);
    const payload = {
        name: String(formData.get('name') || '').trim(),
        email: String(formData.get('email') || '').trim(),
        subject: String(formData.get('subject') || '').trim(),
        message: String(formData.get('message') || '').trim()
    };

    submitBtn.disabled = true;
    submitBtn.textContent = t('contact.form.submit_sending', 'Enviando...');
    setContactStatus(t('contact.form.status.preparing', 'Preparando seu e-mail...'), 'idle');

    try {
        const subject = `[${t('contact.mail.subject_prefix', 'Contato')}] ${payload.subject}`;
        const body =
`${t('contact.mail.name_label', 'Nome')}: ${payload.name}
${t('contact.mail.email_label', 'E-mail')}: ${payload.email}

${t('contact.mail.message_label', 'Mensagem')}:
${payload.message}`;

        const mailtoUrl = `mailto:${CONTACT_TARGET_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoUrl;

        setContactStatus(t('contact.form.status.success', 'Sua aplicacao de e-mail foi aberta. Se preferir, envie direto para ola@seuemail.com.'), 'success');
        form.reset();
    } catch (error) {
        console.error('falha ao processar formulario de contato', error);
        setContactStatus(t('contact.form.status.send_error', 'Nao foi possivel iniciar o envio. Tente novamente em instantes.'), 'error');
    } finally {
        window.setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = t('contact.form.submit', 'Enviar mensagem');
        }, 700);
    }
}

function getFocusableElements(container) {
    return [...container.querySelectorAll('a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')]
        .filter((el) => !el.hasAttribute('hidden') && el.offsetParent !== null);
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    if (activeModalId && activeModalId !== modalId) {
        closeModal(activeModalId, { restoreFocus: false });
    }

    lastFocusedElement = document.activeElement;
    modal.classList.remove('modal-hidden');
    document.body.classList.add('modal-open');
    activeModalId = modalId;

    const focusables = getFocusableElements(modal);
    const focusTarget = focusables[0] || modal;
    if (!focusables.length && !modal.hasAttribute('tabindex')) {
        modal.setAttribute('tabindex', '-1');
    }
    focusTarget.focus();
}

function closeModal(modalId, options = { restoreFocus: true }) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.add('modal-hidden');

    const stillOpen = document.querySelector('#comments-modal:not(.modal-hidden), #message-modal:not(.modal-hidden)');
    if (!stillOpen) {
        document.body.classList.remove('modal-open');
        activeModalId = null;
    } else {
        activeModalId = stillOpen.id;
    }

    if (options.restoreFocus && lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
    }
}

function handleModalKeydown(event) {
    if (!activeModalId) return;

    const modal = document.getElementById(activeModalId);
    if (!modal || modal.classList.contains('modal-hidden')) return;

    if (event.key === 'Escape') {
        event.preventDefault();
        if (activeModalId === 'comments-modal') closeCommentsModal();
        if (activeModalId === 'message-modal') closeMessageModal();
        return;
    }

    if (event.key !== 'Tab') return;

    const focusables = getFocusableElements(modal);
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}

function handleModalBackdropClick(event) {
    if (event.target.id === 'comments-modal') closeCommentsModal();
    if (event.target.id === 'message-modal') closeMessageModal();
}

async function loadJson(path) {
    const response = await fetch(path, { cache: 'no-store' });
    if (!response.ok) throw new Error('falha ao carregar ' + path);
    return response.json();
}

async function bootstrapContent() {
    try {
        const [posts, photos, essays, mediaMap] = await Promise.all([
            loadJson('data/posts.json'),
            loadJson('data/photos.json'),
            loadJson('data/essays.json'),
            loadJson('data/media-map.json')
        ]);

        state.posts = posts;
        state.photos = photos;
        state.essays = essays;
        state.mediaMap = mediaMap;
    } catch (error) {
        console.warn('carregando fallback local de dados:', error.message);
        state.posts = FALLBACK_DATA.posts;
        state.photos = FALLBACK_DATA.photos;
        state.essays = FALLBACK_DATA.essays;
        state.mediaMap = FALLBACK_DATA.mediaMap;
    }

    state.likes = readStorage(storageKeys.likes, {});
    state.comments = readStorage(storageKeys.comments, {});
    state.messages = readStorage(storageKeys.messages, {});

    renderPhotoFilters();
    renderPhotoGrid();
    renderBlogList();
}

function getEssayById(id) {
    return state.essays.find((essay) => essay.id === id);
}

function getPublishedPosts() {
    return state.posts
        .filter((post) => post.status === 'published')
        .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

function getPublishedPhotos() {
    return state.photos
        .filter((photo) => photo.status === 'published')
        .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

function createFilterButton(group, value, label, isActive) {
    return `
        <button
            type="button"
            data-filter-group="${group}"
            data-filter-value="${value}"
            onclick="setPhotoFilter('${group}', '${value}')"
            class="ui-btn ${isActive ? 'bg-[var(--item-hover)]' : ''}">
            ${label}
        </button>
    `;
}

function renderPhotoFilters() {
    const essayFilterRoot = document.getElementById('photo-essay-filters');
    const yearFilterRoot = document.getElementById('photo-year-filters');
    const essays = state.essays.filter((essay) => essay.status === 'published');
    const years = [...new Set(getPublishedPhotos().map((photo) => String(photo.year)))].sort((a, b) => Number(b) - Number(a));

    const essayButtons = [
        `<span class="text-[10px] uppercase tracking-[0.2em] opacity-60">${t('photos.filter.essay', 'Ensaio')}</span>`,
        createFilterButton('essay', 'all', t('photos.filter.all', 'Todos'), state.photoFilters.essay === 'all'),
        ...essays.map((essay) => createFilterButton('essay', essay.id, essay.name, state.photoFilters.essay === essay.id))
    ];

    const yearButtons = [
        `<span class="text-[10px] uppercase tracking-[0.2em] opacity-60">${t('photos.filter.year', 'Ano')}</span>`,
        createFilterButton('year', 'all', t('photos.filter.all', 'Todos'), state.photoFilters.year === 'all'),
        ...years.map((year) => createFilterButton('year', year, year, state.photoFilters.year === year))
    ];

    essayFilterRoot.innerHTML = essayButtons.join('');
    yearFilterRoot.innerHTML = yearButtons.join('');
}

function getPhotoLikeModel(photoId) {
    if (!state.likes[photoId]) {
        state.likes[photoId] = { count: 0, liked: false };
    }
    return state.likes[photoId];
}

function getPhotoComments(photoId) {
    if (!state.comments[photoId]) state.comments[photoId] = [];
    return state.comments[photoId];
}

function getPhotoMessages(photoId) {
    if (!state.messages[photoId]) state.messages[photoId] = [];
    return state.messages[photoId];
}

function renderPhotoCard(photo, large = false) {
    const essay = getEssayById(photo.essay_id);
    const likeModel = getPhotoLikeModel(photo.id);
    const comments = getPhotoComments(photo.id);
    const messages = getPhotoMessages(photo.id);
    const titleSize = large ? 'text-2xl' : 'text-xl';
    const imageHeight = large ? 'h-72' : 'h-44';
    const colSpan = large ? 'md:col-span-2' : '';
    const likeEmoji = likeModel.liked ? '❤️' : '🤍';
    const mediaType = photo.media_type === 'video' ? 'video' : 'image';
    const mediaLabel = mediaType === 'video'
        ? t('photos.media.video_placeholder', 'video placeholder ▶')
        : t('photos.media.image_placeholder', 'foto placeholder');
    const imageAlt = photo.alt || photo.title || t('photos.media.alt_fallback', 'Midia da galeria');
    const mediaBlock = mediaType === 'image'
        ? `
            <div class="relative w-full ${imageHeight} bg-zinc-500/10 border border-zinc-500/20 mb-6 overflow-hidden">
                <img src="${photo.image || ''}" alt="${imageAlt}" loading="lazy" decoding="async" class="w-full h-full object-cover"
                    onerror="this.style.display='none'; this.parentElement.querySelector('[data-fallback]').style.display='flex';">
                <div data-fallback class="absolute inset-0 hidden items-center justify-center text-[10px] uppercase tracking-[0.2em] opacity-50">
                    ${mediaLabel}
                </div>
            </div>
        `
        : `
            <div class="w-full ${imageHeight} bg-zinc-500/10 border border-zinc-500/20 mb-6 flex items-center justify-center text-[10px] uppercase tracking-[0.2em] opacity-50">
                ${mediaLabel}
            </div>
        `;

    return `
        <article class="grid-item photo-item ${colSpan} p-6 md:p-10 aspect-auto md:aspect-auto justify-between" data-photo-id="${photo.id}">
            <div>
                <span class="label">${essay ? essay.name : t('photos.filter.essay', 'Ensaio')} - ${photo.year} - ${mediaType}</span>
                ${mediaBlock}
                <h3 class="${titleSize} font-bold mb-3">${photo.title}</h3>
                <p class="text-sm opacity-70">${photo.description}</p>
            </div>
            <div class="mt-6 pt-4 border-t border-[var(--grid-border)] flex flex-wrap items-center gap-4">
                <button type="button" onclick="togglePhotoLike('${photo.id}')" class="icon-btn" title="${t('actions.like', 'Curtir')}" aria-label="${t('actions.like_photo', 'Curtir foto')}">${likeEmoji}</button>
                <span class="text-[10px] uppercase tracking-[0.2em] opacity-60 mr-2">${likeModel.count}</span>
                <button type="button" onclick="openCommentsModal('${photo.id}')" class="icon-btn" title="${t('actions.comments', 'Comentarios')}" aria-label="${t('actions.open_comments', 'Abrir comentarios')}">💬</button>
                <span class="text-[10px] uppercase tracking-[0.2em] opacity-60 mr-2">${comments.length}</span>
                <button type="button" onclick="openMessageModal('${photo.id}')" class="icon-btn" title="${t('actions.private_message', 'Mensagem privada')}" aria-label="${t('actions.send_private_message', 'Enviar mensagem privada')}">✉️</button>
                <span class="text-[10px] uppercase tracking-[0.2em] opacity-60">${messages.length}</span>
            </div>
        </article>
    `;
}

function renderPhotoGrid() {
    const root = document.getElementById('photo-grid');
    const photos = getPublishedPhotos().filter((photo) => {
        const essayMatch = state.photoFilters.essay === 'all' || photo.essay_id === state.photoFilters.essay;
        const yearMatch = state.photoFilters.year === 'all' || String(photo.year) === state.photoFilters.year;
        return essayMatch && yearMatch;
    });

    if (!photos.length) {
        root.innerHTML = `
            <div class="grid-item md:col-span-4 p-6 md:p-10 aspect-auto md:aspect-auto">
                <span class="label">${t('photos.empty.label', 'Sem resultado')}</span>
                <p class="text-sm opacity-70">${t('photos.empty.body', 'Nao ha fotografias para o filtro selecionado.')}</p>
            </div>
        `;
        return;
    }

    root.innerHTML = photos.map((photo, index) => renderPhotoCard(photo, index === 0)).join('');
}

function setPhotoFilter(group, value) {
    state.photoFilters[group] = value;
    renderPhotoFilters();
    renderPhotoGrid();
}

function renderPhotoGridPreserveScroll() {
    const currentY = window.scrollY;
    renderPhotoGrid();
    window.requestAnimationFrame(() => window.scrollTo(0, currentY));
}

function togglePhotoLike(photoId) {
    const model = getPhotoLikeModel(photoId);
    model.liked = !model.liked;
    model.count = model.liked ? model.count + 1 : Math.max(0, model.count - 1);
    writeStorage(storageKeys.likes, state.likes);
    renderPhotoGridPreserveScroll();
}

function openCommentsModal(photoId) {
    activePhotoId = photoId;
    openModal('comments-modal');
    renderCommentsModal();
}

function closeCommentsModal() {
    closeModal('comments-modal');
    activePhotoId = null;
}

function renderCommentsModal() {
    const list = document.getElementById('comments-list');
    const comments = getPhotoComments(activePhotoId);
    if (!comments.length) {
        list.innerHTML = `<p class="text-sm opacity-70">${t('modals.comments.empty', 'Sem comentarios ainda. Seja a primeira pessoa a comentar.')}</p>`;
        return;
    }

    list.innerHTML = comments
        .slice()
        .reverse()
        .map((comment) => `
            <div class="border border-[var(--grid-border)] p-4">
                <div class="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-2">${formatDate(comment.created_at)}</div>
                <p class="text-sm leading-relaxed">${comment.text}</p>
            </div>
        `)
        .join('');
}

function submitComment(event) {
    event.preventDefault();
    if (!activePhotoId) return;

    const input = document.getElementById('comment-input');
    const value = input.value.trim();
    if (!value) return;

    const comments = getPhotoComments(activePhotoId);
    comments.push({
        id: 'comment_' + Date.now(),
        text: value,
        created_at: new Date().toISOString().slice(0, 10)
    });

    writeStorage(storageKeys.comments, state.comments);
    input.value = '';
    renderCommentsModal();
    renderPhotoGridPreserveScroll();
}

function openMessageModal(photoId) {
    activePhotoId = photoId;
    openModal('message-modal');
}

function closeMessageModal() {
    closeModal('message-modal');
    activePhotoId = null;
    document.getElementById('message-input').value = '';
}

function submitPrivateMessage(event) {
    event.preventDefault();
    if (!activePhotoId) return;

    const input = document.getElementById('message-input');
    const value = input.value.trim();
    if (!value) return;

    const messages = getPhotoMessages(activePhotoId);
    messages.push({
        id: 'message_' + Date.now(),
        text: value,
        created_at: new Date().toISOString().slice(0, 10)
    });

    writeStorage(storageKeys.messages, state.messages);
    closeMessageModal();
    renderPhotoGridPreserveScroll();
}

function renderBlogCard(post, index) {
    if (index === 0) {
        return `
            <article class="grid-item md:col-span-2 p-6 md:p-10 aspect-auto md:aspect-auto flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center justify-between group cursor-pointer" onclick="openPostById('${post.id}')">
                <div class="max-w-md">
                    <span class="label">${formatDate(post.created_at)} - ${post.category}</span>
                    <h3 class="text-3xl font-bold mb-4 group-hover:text-[var(--accent)] transition-colors">${post.title}</h3>
                    <p class="text-sm opacity-60">${post.excerpt}</p>
                </div>
                <div class="w-32 h-32 bg-[var(--accent)] opacity-20 hidden md:block"></div>
            </article>
        `;
    }

    return `
        <article class="grid-item p-6 md:p-8 justify-between group cursor-pointer" onclick="openPostById('${post.id}')">
            <div>
                <span class="label">${formatDate(post.created_at)} - ${post.category}</span>
                <h3 class="text-lg font-bold group-hover:text-[var(--accent)] transition-colors">${post.title}</h3>
            </div>
            <div class="text-[10px] font-bold uppercase mt-4">${t('blog.read_article', 'Ler Artigo ->')}</div>
        </article>
    `;
}

function renderBlogList() {
    const root = document.getElementById('blog-list');
    const posts = getPublishedPosts();

    if (!posts.length) {
        root.innerHTML = `
            <div class="grid-item md:col-span-3 p-6 md:p-10 aspect-auto md:aspect-auto">
                <span class="label">${t('blog.empty.label', 'Sem posts')}</span>
                <p class="text-sm opacity-70">${t('blog.empty.body', 'Nenhum post publicado no momento.')}</p>
            </div>
        `;
        return;
    }

    root.innerHTML = posts.map((post, index) => renderBlogCard(post, index)).join('');
}

function openPostById(postId) {
    const post = state.posts.find((item) => item.id === postId);
    if (!post) return;

    activePostId = postId;

    const postMeta = document.getElementById('post-meta');
    const postTitle = document.getElementById('post-title');
    const postBody = document.getElementById('post-body-content');
    const postRelated = document.getElementById('post-related');

    postMeta.innerText = `${formatDate(post.created_at)} - ${post.category}`;
    postTitle.innerText = post.title;
    postBody.innerHTML = post.content.map((paragraph) => `<p>${paragraph}</p>`).join('');

    const relatedPosts = getPublishedPosts().filter((item) => item.id !== post.id).slice(0, 2);
    postRelated.innerHTML = relatedPosts
        .map((item) => `<a href="#" onclick="openPostById('${item.id}')" class="block text-sm font-bold hover:text-[var(--accent)]">${item.title}</a>`)
        .join('');

    transitionToPage('post', { updateNav: false });
}

function toggleThemeManual() {
    manualThemeOverride = true;
    const body = document.body;
    body.classList.toggle('theme-day');
    updateThemeIcons();
}

function updateThemeIcons() {
    const isDay = document.body.classList.contains('theme-day');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    const statusText = document.getElementById('time-status');
    const dot = document.getElementById('time-dot');

    if (isDay) {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
        if (statusText) statusText.innerText = t('theme.status.override_day', 'OVERRIDE - DAY MODE');
        if (dot) dot.style.backgroundColor = '#fbbf24';
    } else {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
        if (statusText) statusText.innerText = t('theme.status.override_night', 'OVERRIDE - NIGHT MODE');
        if (dot) dot.style.backgroundColor = '#818cf8';
    }
}

function updateTheme() {
    if (manualThemeOverride) return;

    const now = new Date();
    const hour = now.getHours();
    const body = document.body;
    const statusText = document.getElementById('time-status');
    const dot = document.getElementById('time-dot');
    const isDay = hour >= 6 && hour < 18;

    if (isDay) {
        body.classList.add('theme-day');
        if (statusText) statusText.innerText = `${hour}:00 - ${t('theme.status.day', 'DAY MODE')}`;
        if (dot) dot.style.backgroundColor = '#fbbf24';
    } else {
        body.classList.remove('theme-day');
        if (statusText) statusText.innerText = `${hour}:00 - ${t('theme.status.night', 'NIGHT MODE')}`;
        if (dot) dot.style.backgroundColor = '#818cf8';
    }

    updateThemeIcons();
}

function handleMobileNavScroll() {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
        document.body.classList.remove('mobile-nav-hidden');
        lastScrollY = window.scrollY;
        return;
    }

    const currentY = window.scrollY;
    const delta = currentY - lastScrollY;
    const nearTop = currentY < 24;

    if (nearTop || delta < -8) {
        document.body.classList.remove('mobile-nav-hidden');
    } else if (delta > 8 && currentY > 64) {
        document.body.classList.add('mobile-nav-hidden');
    }

    lastScrollY = currentY;
}

function onWindowScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(() => {
        handleMobileNavScroll();
        scrollTicking = false;
    });
}

function hideSiteLoader() {
    const loader = document.getElementById('site-loader');
    if (!loader) return;
    const elapsed = Date.now() - loaderStartAt;
    const remaining = Math.max(0, LOADER_MIN_MS - elapsed);
    window.setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('is-loading');
        window.setTimeout(() => loader.remove(), 420);
    }, remaining);
}

async function initApp() {
    const storedLocale = localStorage.getItem(storageKeys.locale);
    const browserLocale = navigator.language || DEFAULT_LOCALE;
    await setLocale(storedLocale || browserLocale, { skipPersist: false });

    updateTheme();
    await bootstrapContent();
    handleMobileNavScroll();
    window.addEventListener('scroll', onWindowScroll, { passive: true });
    window.addEventListener('resize', handleMobileNavScroll);
    document.addEventListener('keydown', handleModalKeydown);
    document.getElementById('comments-modal').addEventListener('click', handleModalBackdropClick);
    document.getElementById('message-modal').addEventListener('click', handleModalBackdropClick);

    if (document.readyState === 'complete') {
        hideSiteLoader();
    } else {
        window.addEventListener('load', hideSiteLoader, { once: true });
        window.setTimeout(hideSiteLoader, LOADER_MIN_MS + 1200);
    }

    setInterval(updateTheme, 60000);
}

initApp();
