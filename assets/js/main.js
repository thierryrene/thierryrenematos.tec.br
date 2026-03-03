let manualThemeOverride = false;
let activePhotoId = null;
let activePostId = null;
let lastScrollY = 0;
let scrollTicking = false;
let activeModalId = null;
let lastFocusedElement = null;
let lastFocusFallbackSelector = '';
let localeRequestId = 0;
const PAGE_TRANSITION_MS = 420;
const LOADER_MIN_MS = 600;
const LASTFM_REFRESH_MS = 60000;
const loaderStartAt = Date.now();
const CONTACT_TARGET_EMAIL = 'ola@seuemail.com';
const SITE_TITLE_DEFAULT = 'Thierry Rene Matos - Dashboard Biografico, meu.ponto e Galeria';
const SITE_TITLE_SUFFIX = 'Thierry Rene Matos';
const ROUTE_PATHS = {
    dashboard: '/',
    sobre: '/sobre',
    fotografias: '/fotografias',
    blog: '/blog',
    contato: '/contato'
};
const LOCAL_APP_BASE_PATH = '/thierryrenematos.tec.br';
const APP_BASE_PATH = (() => {
    if (window.location.hostname !== 'localhost') return '';
    const normalized = window.location.pathname.split('?')[0].split('#')[0];
    if (normalized === LOCAL_APP_BASE_PATH || normalized.startsWith(`${LOCAL_APP_BASE_PATH}/`)) {
        return LOCAL_APP_BASE_PATH;
    }
    return '';
})();
const LASTFM_ENDPOINT = `${APP_BASE_PATH}/api/lastfm-recent.php`;
const SUPPORTED_LOCALES = ['pt-BR', 'en-US'];
const DEFAULT_LOCALE = 'pt-BR';
const I18N_BASE_PATH = 'data/i18n';
let currentLocale = DEFAULT_LOCALE;
let localeMessages = {};

const storageKeys = {
    likes: 'thierry.likes.v1',
    comments: 'thierry.comments.v1',
    messages: 'thierry.messages.v1',
    locale: 'thierry.locale.v1',
    theme: 'thierry.theme.v1'
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

function escapeHtml(value) {
    return String(value ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

function escapeAttr(value) {
    return escapeHtml(value).replaceAll('`', '&#96;');
}

async function loadLocaleMessages(locale) {
    try {
        const response = await fetch(`${I18N_BASE_PATH}/${locale}.json`, { cache: 'no-store' });
        if (!response.ok) throw new Error(`falha i18n ${locale}`);
        return await response.json();
    } catch (error) {
        console.warn('erro ao carregar traducoes, mantendo texto atual:', error.message);
        return {};
    }
}

function setText(selector, key, fallback = '') {
    const element = document.querySelector(selector);
    if (!element) return;
    element.textContent = t(key, fallback);
}

function setMultilineTextWithBr(selector, key, fallback = '') {
    const element = document.querySelector(selector);
    if (!element) return;
    const value = t(key, fallback);
    const lines = String(value).split(/<br\s*\/?>/gi);
    element.innerHTML = '';
    lines.forEach((line, index) => {
        if (index > 0) element.appendChild(document.createElement('br'));
        element.appendChild(document.createTextNode(line));
    });
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
    setMultilineTextWithBr('#hero-title', 'hero.title_html', 'Designer, developer e<br>observador da vida.<br>Construo meu.ponto.');
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

    const requestId = ++localeRequestId;
    const messages = await loadLocaleMessages(normalized);
    if (requestId !== localeRequestId) return;

    currentLocale = normalized;
    localeMessages = messages;
    applyLocaleToStaticContent();
    updateLocaleButtons();

    if (!options.skipPersist) {
        localStorage.setItem(storageKeys.locale, currentLocale);
    }

    renderPhotoFilters();
    renderPhotoGrid();
    renderBlogList();
    if (activePostId) {
        openPostById(activePostId, { skipRouteUpdate: true, track: false });
    } else if (state.posts.length || state.photos.length || state.essays.length) {
        applyRouteFromLocation({ replace: true, track: false });
    }
}

function updateActiveNav(navId) {
    document.querySelectorAll('nav a').forEach((link) => link.classList.remove('active-nav'));
    if (!navId) return;
    const navLink = document.getElementById('nav-' + navId);
    if (navLink) navLink.classList.add('active-nav');
}

function normalizePath(pathname = '/') {
    const path = pathname.split('?')[0].split('#')[0];
    if (!path || path === '/') return '/';
    return path.endsWith('/') ? path.slice(0, -1) : path;
}

function withBasePath(path = '/') {
    if (!APP_BASE_PATH) return path;
    if (path === '/') return APP_BASE_PATH;
    return `${APP_BASE_PATH}${path}`;
}

function stripBasePath(path = '/') {
    if (!APP_BASE_PATH) return path;
    if (path === APP_BASE_PATH) return '/';
    if (path.startsWith(`${APP_BASE_PATH}/`)) {
        const stripped = path.slice(APP_BASE_PATH.length);
        return stripped || '/';
    }
    return path;
}

function getRoutePath(pageId, post) {
    if (pageId === 'post' && post?.slug) return `/blog/${encodeURIComponent(post.slug)}`;
    return ROUTE_PATHS[pageId] || '/';
}

function getPageTitle(pageId, post) {
    if (pageId === 'post' && post?.title) return `${post.title} - meu.ponto | ${SITE_TITLE_SUFFIX}`;
    if (pageId === 'sobre') return `Sobre | ${SITE_TITLE_SUFFIX}`;
    if (pageId === 'fotografias') return `Fotografias | ${SITE_TITLE_SUFFIX}`;
    if (pageId === 'blog') return `Blog meu.ponto | ${SITE_TITLE_SUFFIX}`;
    if (pageId === 'contato') return `Contato | ${SITE_TITLE_SUFFIX}`;
    return SITE_TITLE_DEFAULT;
}

function updateCanonical(path) {
    const canonicalUrl = `${window.location.origin}${path}`;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);
}

function trackVirtualPageview(path, title) {
    const normalizedPath = normalizePath(path);
    const payload = {
        page_path: normalizedPath,
        page_location: `${window.location.origin}${normalizedPath}`,
        page_title: title
    };

    if (typeof window.gtag === 'function') {
        window.gtag('event', 'page_view', payload);
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'virtual_pageview', ...payload });
    document.dispatchEvent(new CustomEvent('virtual-pageview', { detail: payload }));
}

function updateBrowserState(pageId, options = {}) {
    const { post = null, replace = false, track = true } = options;
    const routePath = getRoutePath(pageId, post);
    const path = withBasePath(routePath);
    const title = getPageTitle(pageId, post);
    const state = pageId === 'post'
        ? { pageId, postId: post?.id || null, slug: post?.slug || null }
        : { pageId };

    const currentPath = normalizePath(stripBasePath(window.location.pathname));
    const nextPath = normalizePath(routePath);
    const stateChanged = JSON.stringify(window.history.state || {}) !== JSON.stringify(state);
    const isSameRoute = currentPath === nextPath && !stateChanged;
    const shouldReplace = replace || (!stateChanged && currentPath === nextPath);

    if (shouldReplace) {
        window.history.replaceState(state, '', path);
    } else {
        window.history.pushState(state, '', path);
    }

    document.title = title;
    updateCanonical(path);
    if (track && !isSameRoute) trackVirtualPageview(path, title);
}

function resolveRouteFromLocation() {
    const path = normalizePath(stripBasePath(window.location.pathname));
    const blogMatch = path.match(/^\/blog\/([^/]+)$/);
    if (blogMatch) {
        const slug = decodeURIComponent(blogMatch[1]);
        const post = getPublishedPosts().find((item) => item.slug === slug);
        if (post) return { pageId: 'post', postId: post.id };
    }

    const pageByPath = Object.entries(ROUTE_PATHS).find(([, routePath]) => normalizePath(routePath) === path);
    if (pageByPath) return { pageId: pageByPath[0] };
    return { pageId: 'dashboard' };
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

function showPage(pageId, options = {}) {
    transitionToPage(pageId, { navId: pageId, updateNav: true });
    if (!options.skipRouteUpdate) {
        updateBrowserState(pageId, {
            replace: Boolean(options.replaceRoute),
            track: options.track !== false
        });
    }
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
    if (lastFocusedElement?.dataset?.photoId && lastFocusedElement?.dataset?.action) {
        lastFocusFallbackSelector = `[data-action="${lastFocusedElement.dataset.action}"][data-photo-id="${lastFocusedElement.dataset.photoId}"]`;
    } else {
        lastFocusFallbackSelector = '';
    }
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

    if (options.restoreFocus) {
        if (lastFocusedElement && lastFocusedElement.isConnected && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
            return;
        }

        if (lastFocusFallbackSelector) {
            const fallbackTarget = document.querySelector(lastFocusFallbackSelector);
            if (fallbackTarget && typeof fallbackTarget.focus === 'function') {
                fallbackTarget.focus();
                return;
            }
        }

        const photoGrid = document.getElementById('photo-grid');
        if (photoGrid) {
            photoGrid.setAttribute('tabindex', '-1');
            photoGrid.focus();
        }
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

function updateLastfmBars(recent = [], nowPlaying = false) {
    const barsRoot = document.getElementById('lastfm-bars');
    if (!barsRoot) return;

    const seedSource = recent.map((item) => `${item.name || ''}${item.artist || ''}`).join('|') || 'lastfm';
    const heights = [28, 44, 66, 52].map((base, index) => {
        const charCode = seedSource.charCodeAt(index % seedSource.length) || 40;
        return Math.min(92, Math.max(24, base + (charCode % 26) - 13));
    });

    barsRoot.innerHTML = heights.map((height) => `
        <div class="w-2 ${nowPlaying ? 'bg-red-500' : 'bg-zinc-500'}" style="height:${height}%"></div>
    `).join('');
}

function setLastfmAlbumBackground(albumArtUrl) {
    const cardEl = document.getElementById('listening-log-card');
    const bgEl = document.getElementById('lastfm-bg');
    if (!cardEl || !bgEl) return;

    if (!albumArtUrl) {
        cardEl.classList.remove('has-album-art');
        bgEl.style.backgroundImage = '';
        return;
    }

    const sanitizedUrl = String(albumArtUrl).replace(/["\\\n\r]/g, '');
    bgEl.style.backgroundImage = `url("${sanitizedUrl}")`;
    cardEl.classList.add('has-album-art');
}

function getLastfmStatusModel(nowPlaying, playedAtUnix) {
    if (nowPlaying) {
        return {
            statusLabel: 'Now Playing',
            statusClass: 'text-red-500'
        };
    }

    if (playedAtUnix > 0) {
        const diffMs = Date.now() - (playedAtUnix * 1000);
        const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

        if (diffMinutes <= 1) {
            return {
                statusLabel: 'Tocou agora',
                statusClass: 'text-amber-400'
            };
        }

        if (diffMinutes < 60) {
            return {
                statusLabel: `Ha ${diffMinutes} min`,
                statusClass: 'text-amber-400'
            };
        }

        const playedDate = new Date(playedAtUnix * 1000);
        const now = new Date();
        const sameDay = playedDate.toDateString() === now.toDateString();
        const timeLabel = playedDate.toLocaleTimeString(currentLocale, {
            hour: '2-digit',
            minute: '2-digit'
        });
        if (sameDay) {
            return {
                statusLabel: `Ultima ${timeLabel}`,
                statusClass: 'text-amber-400'
            };
        }

        const dateLabel = playedDate.toLocaleDateString(currentLocale, {
            day: '2-digit',
            month: '2-digit'
        });
        return {
            statusLabel: `${dateLabel} ${timeLabel}`,
            statusClass: 'text-amber-400'
        };
    }

    return {
        statusLabel: 'Idle',
        statusClass: 'text-amber-400'
    };
}

function updateLastfmCardUi(model) {
    const trackEl = document.getElementById('lastfm-track');
    const statusEl = document.getElementById('lastfm-status');
    const statusIconEl = document.getElementById('lastfm-status-icon');
    if (!trackEl || !statusEl || !statusIconEl) return;

    trackEl.textContent = model.trackLine;
    statusEl.textContent = model.statusLabel;
    statusEl.classList.remove('text-red-500', 'text-amber-400', 'text-zinc-500');
    statusEl.classList.add(model.statusClass);
    statusIconEl.classList.toggle('is-playing', Boolean(model.nowPlaying));
    updateLastfmBars(model.recent, model.nowPlaying);
    setLastfmAlbumBackground(model.albumArt || '');
}

async function fetchLastfmRecent() {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 7000);

    try {
        const response = await fetch(LASTFM_ENDPOINT, {
            cache: 'no-store',
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`lastfm endpoint error: ${response.status}`);
        }

        const payload = await response.json();
        const track = payload?.track;
        const recent = Array.isArray(payload?.recent) ? payload.recent : [];
        const nowPlaying = Boolean(payload?.now_playing);
        const trackName = track?.name || '';
        const artistName = track?.artist || '';
        const albumArt = track?.album_art || '';
        const playedAtUnix = Number(track?.played_at_unix || 0);

        if (!trackName && !artistName) {
            updateLastfmCardUi({
                trackLine: 'Sem escuta recente',
                statusLabel: 'Idle',
                statusClass: 'text-amber-400',
                recent,
                nowPlaying: false,
                albumArt: ''
            });
            return;
        }

        const statusModel = getLastfmStatusModel(nowPlaying, playedAtUnix);
        updateLastfmCardUi({
            trackLine: artistName ? `${trackName} - ${artistName}` : trackName,
            statusLabel: statusModel.statusLabel,
            statusClass: statusModel.statusClass,
            recent,
            nowPlaying,
            albumArt
        });
    } catch (error) {
        console.warn('falha ao sincronizar lastfm:', error.message);
        updateLastfmCardUi({
            trackLine: 'Last.fm indisponivel',
            statusLabel: 'Offline',
            statusClass: 'text-zinc-500',
            recent: [],
            nowPlaying: false,
            albumArt: ''
        });
    } finally {
        window.clearTimeout(timeoutId);
    }
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
            class="ui-btn ${isActive ? 'bg-[var(--item-hover)]' : ''}">
            ${escapeHtml(label)}
        </button>
    `;
}

function renderPhotoFilters() {
    const essayFilterRoot = document.getElementById('photo-essay-filters');
    const yearFilterRoot = document.getElementById('photo-year-filters');
    const essays = state.essays.filter((essay) => essay.status === 'published');
    const years = [...new Set(getPublishedPhotos().map((photo) => String(photo.year)))].sort((a, b) => Number(b) - Number(a));

    const essayButtons = [
        `<span class="text-[10px] uppercase tracking-[0.2em] opacity-60">${escapeHtml(t('photos.filter.essay', 'Ensaio'))}</span>`,
        createFilterButton('essay', 'all', t('photos.filter.all', 'Todos'), state.photoFilters.essay === 'all'),
        ...essays.map((essay) => createFilterButton('essay', essay.id, essay.name, state.photoFilters.essay === essay.id))
    ];

    const yearButtons = [
        `<span class="text-[10px] uppercase tracking-[0.2em] opacity-60">${escapeHtml(t('photos.filter.year', 'Ano'))}</span>`,
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
    const mediaEntry = state.mediaMap.find((entry) => entry.owner_type === 'photo' && entry.owner_id === photo.id);
    const imageSrc = mediaEntry?.path || photo.image || '';
    const imageAlt = mediaEntry?.alt || photo.alt || photo.title || t('photos.media.alt_fallback', 'Midia da galeria');
    const mediaCaption = mediaEntry?.caption || photo.description || '';
    const mediaCredit = mediaEntry?.credit || '';
    const metaParts = [`${essay ? essay.name : t('photos.filter.essay', 'Ensaio')} - ${photo.year} - ${mediaType}`];
    if (mediaCredit) metaParts.push(`credit: ${mediaCredit}`);
    const escapedPostId = escapeAttr(photo.id);
    const escapedImageSrc = escapeAttr(imageSrc);
    const escapedImageAlt = escapeAttr(imageAlt);
    const mediaBlock = mediaType === 'image'
        ? `
            <div class="relative w-full ${imageHeight} bg-zinc-500/10 border border-zinc-500/20 mb-6 overflow-hidden">
                <img data-photo-media="true" src="${escapedImageSrc}" alt="${escapedImageAlt}" loading="lazy" decoding="async" class="w-full h-full object-cover">
                <div data-fallback class="absolute inset-0 hidden items-center justify-center text-[10px] uppercase tracking-[0.2em] opacity-50">
                    ${escapeHtml(mediaLabel)}
                </div>
            </div>
        `
        : `
            <div class="w-full ${imageHeight} bg-zinc-500/10 border border-zinc-500/20 mb-6 flex items-center justify-center text-[10px] uppercase tracking-[0.2em] opacity-50">
                ${escapeHtml(mediaLabel)}
            </div>
        `;

    return `
        <article class="grid-item photo-item ${colSpan} p-6 md:p-10 aspect-auto md:aspect-auto justify-between" data-photo-id="${escapedPostId}">
            <div>
                <span class="label">${escapeHtml(metaParts.join(' - '))}</span>
                ${mediaBlock}
                <h3 class="${titleSize} font-bold mb-3">${escapeHtml(photo.title)}</h3>
                <p class="text-sm opacity-70">${escapeHtml(mediaCaption)}</p>
            </div>
            <div class="mt-6 pt-4 border-t border-[var(--grid-border)] flex flex-wrap items-center gap-4">
                <button type="button" data-action="toggle-like" data-photo-id="${escapedPostId}" class="icon-btn" title="${escapeAttr(t('actions.like', 'Curtir'))}" aria-label="${escapeAttr(t('actions.like_photo', 'Curtir foto'))}">${likeEmoji}</button>
                <span class="text-[10px] uppercase tracking-[0.2em] opacity-60 mr-2">${likeModel.count}</span>
                <button type="button" data-action="open-comments" data-photo-id="${escapedPostId}" class="icon-btn" title="${escapeAttr(t('actions.comments', 'Comentarios'))}" aria-label="${escapeAttr(t('actions.open_comments', 'Abrir comentarios'))}">💬</button>
                <span class="text-[10px] uppercase tracking-[0.2em] opacity-60 mr-2">${comments.length}</span>
                <button type="button" data-action="open-message" data-photo-id="${escapedPostId}" class="icon-btn" title="${escapeAttr(t('actions.private_message', 'Mensagem privada'))}" aria-label="${escapeAttr(t('actions.send_private_message', 'Enviar mensagem privada'))}">✉️</button>
                <span class="text-[10px] uppercase tracking-[0.2em] opacity-60">${messages.length}</span>
            </div>
        </article>
    `;
}

function wirePhotoMediaFallback() {
    const images = document.querySelectorAll('img[data-photo-media]');
    images.forEach((image) => {
        image.addEventListener('error', () => {
            image.style.display = 'none';
            const fallback = image.parentElement?.querySelector('[data-fallback]');
            if (fallback) fallback.style.display = 'flex';
        }, { once: true });
    });
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
    wirePhotoMediaFallback();
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
    list.innerHTML = '';

    if (!comments.length) {
        const empty = document.createElement('p');
        empty.className = 'text-sm opacity-70';
        empty.textContent = t('modals.comments.empty', 'Sem comentarios ainda. Seja a primeira pessoa a comentar.');
        list.appendChild(empty);
        return;
    }

    comments.slice().reverse().forEach((comment) => {
        const item = document.createElement('div');
        item.className = 'border border-[var(--grid-border)] p-4';

        const meta = document.createElement('div');
        meta.className = 'text-[10px] uppercase tracking-[0.2em] opacity-60 mb-2';
        meta.textContent = formatDate(comment.created_at);

        const text = document.createElement('p');
        text.className = 'text-sm leading-relaxed';
        text.textContent = String(comment.text || '');

        item.append(meta, text);
        list.appendChild(item);
    });
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
            <article
                class="grid-item md:col-span-2 p-6 md:p-10 aspect-auto md:aspect-auto flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center justify-between group cursor-pointer"
                data-open-post="${escapeAttr(post.id)}"
                role="button"
                tabindex="0"
                aria-label="${escapeAttr(t('blog.open_post', 'Abrir post'))}: ${escapeAttr(post.title)}">
                <div class="max-w-md">
                    <span class="label">${escapeHtml(formatDate(post.created_at))} - ${escapeHtml(post.category)}</span>
                    <h3 class="text-3xl font-bold mb-4 group-hover:text-[var(--accent)] transition-colors">${escapeHtml(post.title)}</h3>
                    <p class="text-sm opacity-60">${escapeHtml(post.excerpt)}</p>
                </div>
                <div class="w-32 h-32 bg-[var(--accent)] opacity-20 hidden md:block"></div>
            </article>
        `;
    }

    return `
        <article
            class="grid-item p-6 md:p-8 justify-between group cursor-pointer"
            data-open-post="${escapeAttr(post.id)}"
            role="button"
            tabindex="0"
            aria-label="${escapeAttr(t('blog.open_post', 'Abrir post'))}: ${escapeAttr(post.title)}">
            <div>
                <span class="label">${escapeHtml(formatDate(post.created_at))} - ${escapeHtml(post.category)}</span>
                <h3 class="text-lg font-bold group-hover:text-[var(--accent)] transition-colors">${escapeHtml(post.title)}</h3>
            </div>
            <div class="text-[10px] font-bold uppercase mt-4">${escapeHtml(t('blog.read_article', 'Ler Artigo ->'))}</div>
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

function openPostById(postId, options = {}) {
    const post = state.posts.find((item) => item.id === postId);
    if (!post) return;

    activePostId = postId;

    const postMeta = document.getElementById('post-meta');
    const postTitle = document.getElementById('post-title');
    const postCover = document.getElementById('post-cover');
    const postBody = document.getElementById('post-body-content');
    const postRelated = document.getElementById('post-related');

    postMeta.innerText = `${formatDate(post.created_at)} - ${post.category}`;
    postTitle.innerText = post.title;

    if (postCover) {
        const coverEntry = state.mediaMap.find((entry) => entry.owner_type === 'post' && entry.owner_id === post.id);
        postCover.innerHTML = '';
        postCover.className = 'w-full h-64 bg-zinc-500/10 border border-zinc-500/20 mb-12';

        if (coverEntry?.path) {
            const figure = document.createElement('figure');
            figure.className = 'w-full h-full m-0';

            const image = document.createElement('img');
            image.src = coverEntry.path;
            image.alt = coverEntry.alt || post.title;
            image.loading = 'lazy';
            image.decoding = 'async';
            image.className = 'w-full h-full object-cover';

            image.addEventListener('error', () => {
                postCover.className = 'w-full h-64 bg-zinc-500/10 border border-zinc-500/20 mb-12 flex items-center justify-center italic opacity-30';
                postCover.textContent = t('post.cover_fallback', 'capa de artigo');
            }, { once: true });

            figure.appendChild(image);
            if (coverEntry.caption) {
                const caption = document.createElement('figcaption');
                caption.className = 'text-xs opacity-70 mt-2';
                caption.textContent = coverEntry.caption;
                figure.appendChild(caption);
            }

            postCover.appendChild(figure);
        } else {
            postCover.className = 'w-full h-64 bg-zinc-500/10 border border-zinc-500/20 mb-12 flex items-center justify-center italic opacity-30';
            postCover.textContent = t('post.cover_fallback', 'capa de artigo');
        }
    }

    postBody.innerHTML = '';
    const content = Array.isArray(post.content) ? post.content : [];
    content.forEach((paragraph) => {
        const p = document.createElement('p');
        p.textContent = String(paragraph || '');
        postBody.appendChild(p);
    });

    const relatedPosts = getPublishedPosts().filter((item) => item.id !== post.id).slice(0, 2);
    postRelated.innerHTML = '';
    relatedPosts.forEach((item) => {
        const link = document.createElement('a');
        link.href = withBasePath(getRoutePath('post', item));
        link.dataset.relatedPostId = item.id;
        link.className = 'block text-sm font-bold hover:text-[var(--accent)]';
        link.textContent = item.title;
        postRelated.appendChild(link);
    });

    transitionToPage('post', { navId: 'blog', updateNav: true });
    if (!options.skipRouteUpdate) {
        updateBrowserState('post', {
            post,
            replace: Boolean(options.replaceRoute),
            track: options.track !== false
        });
    }
}

function getShareUrl(platform) {
    const post = state.posts.find((item) => item.id === activePostId);
    const title = post?.title || document.title;
    const canonical = window.location.href;
    const encodedUrl = encodeURIComponent(canonical);
    const encodedText = encodeURIComponent(title);

    if (platform === 'x') return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
    if (platform === 'linkedin') return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
    if (platform === 'threads') return `https://www.threads.net/intent/post?text=${encodedText}%20${encodedUrl}`;
    return '';
}

function handleShareClick(event) {
    const button = event.target.closest('button[data-share-platform]');
    if (!button) return;

    const platform = button.getAttribute('data-share-platform');
    if (!platform) return;
    const shareUrl = getShareUrl(platform);
    if (!shareUrl) return;

    if (navigator.share) {
        navigator.share({ title: document.title, url: window.location.href }).catch(() => {});
        return;
    }

    window.open(shareUrl, '_blank', 'noopener,noreferrer');
}

function toggleThemeManual() {
    manualThemeOverride = true;
    const body = document.body;
    body.classList.toggle('theme-day');
    const themeMode = body.classList.contains('theme-day') ? 'day' : 'night';
    localStorage.setItem(storageKeys.theme, themeMode);
    updateThemeIcons();
}

function applyStoredThemeOverride() {
    const storedTheme = localStorage.getItem(storageKeys.theme);
    if (storedTheme !== 'day' && storedTheme !== 'night') return;

    manualThemeOverride = true;
    document.body.classList.toggle('theme-day', storedTheme === 'day');
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

function handleNavigationClick(event) {
    const navTarget = event.target.closest('[data-page]');
    if (!navTarget) return;
    event.preventDefault();
    const pageId = navTarget.getAttribute('data-page');
    if (pageId) showPage(pageId);
}

function handleLocaleClick(event) {
    const localeButton = event.target.closest('[data-locale]');
    if (!localeButton) return;
    const locale = localeButton.getAttribute('data-locale');
    if (locale) setLocale(locale);
}

function handlePhotoActionsClick(event) {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const action = target.getAttribute('data-action');
    const photoId = target.getAttribute('data-photo-id');
    if (!photoId) return;

    if (action === 'toggle-like') togglePhotoLike(photoId);
    if (action === 'open-comments') openCommentsModal(photoId);
    if (action === 'open-message') openMessageModal(photoId);
}

function handlePhotoFilterClick(event) {
    const button = event.target.closest('button[data-filter-group][data-filter-value]');
    if (!button) return;
    const group = button.getAttribute('data-filter-group');
    const value = button.getAttribute('data-filter-value');
    if (group && value) setPhotoFilter(group, value);
}

function handleBlogListClick(event) {
    const card = event.target.closest('[data-open-post]');
    if (!card) return;
    const postId = card.getAttribute('data-open-post');
    if (postId) openPostById(postId);
}

function handleBlogListKeydown(event) {
    const card = event.target.closest('[data-open-post]');
    if (!card) return;
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    const postId = card.getAttribute('data-open-post');
    if (postId) openPostById(postId);
}

function handleRelatedPostClick(event) {
    const link = event.target.closest('[data-related-post-id]');
    if (!link) return;
    event.preventDefault();
    const postId = link.getAttribute('data-related-post-id');
    if (postId) openPostById(postId);
}

function applyRouteFromLocation(options = {}) {
    const { replace = false, track = true } = options;
    const route = resolveRouteFromLocation();
    if (route.pageId === 'post' && route.postId) {
        openPostById(route.postId, { skipRouteUpdate: true, replaceRoute: replace, track });
        updateBrowserState('post', {
            post: state.posts.find((item) => item.id === route.postId),
            replace,
            track
        });
        return;
    }

    activePostId = null;
    showPage(route.pageId, { skipRouteUpdate: true, replaceRoute: replace, track });
    updateBrowserState(route.pageId, { replace, track });
}

function handlePopState() {
    applyRouteFromLocation({ replace: true, track: true });
}

function applyStaticRouteHrefs() {
    const routeAnchors = document.querySelectorAll('a[data-page]');
    routeAnchors.forEach((anchor) => {
        const pageId = anchor.getAttribute('data-page');
        if (!pageId) return;
        const route = ROUTE_PATHS[pageId] || '/';
        anchor.setAttribute('href', withBasePath(route));
    });
}

function bindStaticUIEvents() {
    document.addEventListener('click', handleNavigationClick);

    const langPt = document.getElementById('lang-pt');
    const langEn = document.getElementById('lang-en');
    const themeToggle = document.getElementById('theme-toggle');
    const contactForm = document.getElementById('contact-form');
    const commentsClose = document.getElementById('comments-modal-close');
    const messageClose = document.getElementById('message-modal-close');
    const commentsForm = document.getElementById('comments-form');
    const messageForm = document.getElementById('message-form');
    const photoEssayFilters = document.getElementById('photo-essay-filters');
    const photoYearFilters = document.getElementById('photo-year-filters');
    const photoGrid = document.getElementById('photo-grid');
    const blogList = document.getElementById('blog-list');
    const postRelated = document.getElementById('post-related');
    const postPage = document.getElementById('page-post');

    langPt?.addEventListener('click', handleLocaleClick);
    langEn?.addEventListener('click', handleLocaleClick);
    themeToggle?.addEventListener('click', toggleThemeManual);
    contactForm?.addEventListener('submit', handleContactSubmit);
    commentsClose?.addEventListener('click', closeCommentsModal);
    messageClose?.addEventListener('click', closeMessageModal);
    commentsForm?.addEventListener('submit', submitComment);
    messageForm?.addEventListener('submit', submitPrivateMessage);
    photoEssayFilters?.addEventListener('click', handlePhotoFilterClick);
    photoYearFilters?.addEventListener('click', handlePhotoFilterClick);
    photoGrid?.addEventListener('click', handlePhotoActionsClick);
    blogList?.addEventListener('click', handleBlogListClick);
    blogList?.addEventListener('keydown', handleBlogListKeydown);
    postRelated?.addEventListener('click', handleRelatedPostClick);
    postPage?.addEventListener('click', handleShareClick);
}

async function initApp() {
    applyStaticRouteHrefs();
    bindStaticUIEvents();

    const storedLocale = localStorage.getItem(storageKeys.locale);
    const browserLocale = navigator.language || DEFAULT_LOCALE;
    await setLocale(storedLocale || browserLocale, { skipPersist: false });

    applyStoredThemeOverride();
    updateTheme();
    await bootstrapContent();
    await fetchLastfmRecent();
    applyRouteFromLocation({ replace: true, track: true });
    handleMobileNavScroll();
    window.addEventListener('scroll', onWindowScroll, { passive: true });
    window.addEventListener('resize', handleMobileNavScroll);
    document.addEventListener('keydown', handleModalKeydown);
    window.addEventListener('popstate', handlePopState);
    document.getElementById('comments-modal').addEventListener('click', handleModalBackdropClick);
    document.getElementById('message-modal').addEventListener('click', handleModalBackdropClick);

    if (document.readyState === 'complete') {
        hideSiteLoader();
    } else {
        window.addEventListener('load', hideSiteLoader, { once: true });
        window.setTimeout(hideSiteLoader, LOADER_MIN_MS + 1200);
    }

    setInterval(updateTheme, 60000);
    setInterval(fetchLastfmRecent, LASTFM_REFRESH_MS);
}

initApp();
