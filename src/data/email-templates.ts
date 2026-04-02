import { EmailTemplate } from '@/types/email-builder';
import { Language } from '@/config/i18n/types';

let idCounter = 1000;
const uid = () => `tpl-${++idCounter}-${Date.now()}`;

export interface StarterTemplate {
    id: string;
    name: string;
    description: string;
    thumbnail: string;
    build: () => EmailTemplate;
}

// ---------------------------------------------------------------------------
// Localised string tables
// ---------------------------------------------------------------------------

interface TemplateLocale {
    welcome: {
        name: string;
        description: string;
        heading: string;
        body: string;
        button: string;
        footer: string;
    };
    newsletter: {
        name: string;
        description: string;
        heading: string;
        issue: string;
        featuredTitle: string;
        featuredBody: string;
        readMore: string;
        col1Title: string;
        col1Body: string;
        col2Title: string;
        col2Body: string;
        footer: string;
    };
    promotion: {
        name: string;
        description: string;
        heading: string;
        body: string;
        button: string;
        product1: string;
        product2: string;
        product3: string;
        disclaimer: string;
    };
    productLaunch: {
        name: string;
        description: string;
        heading: string;
        body: string;
        cta: string;
        feature1Title: string;
        feature1Body: string;
        feature2Title: string;
        feature2Body: string;
        feature3Title: string;
        feature3Body: string;
        footer: string;
    };
    eventInvite: {
        name: string;
        description: string;
        heading: string;
        date: string;
        location: string;
        body: string;
        agendaTitle: string;
        agenda1: string;
        agenda2: string;
        agenda3: string;
        cta: string;
        footer: string;
    };
}

const LOCALES: Record<Language, TemplateLocale> = {
    en: {
        welcome: {
            name: 'Welcome Email',
            description: 'Onboard new users with a warm greeting',
            heading: 'Welcome aboard! 🎉',
            body: "We're thrilled to have you join us. Your account is all set up and ready to go. Here's what you can do next to get the most out of your experience.",
            button: 'Get Started →',
            footer: 'Need help? Reply to this email or visit our help center.',
        },
        newsletter: {
            name: 'Newsletter',
            description: 'Share updates with a clean multi-section layout',
            heading: '📬 Weekly Digest',
            issue: 'March 2026 · Issue #42',
            featuredTitle: 'Featured: The Future of Design',
            featuredBody: 'Explore the latest trends shaping how we build digital experiences. From AI-assisted workflows to new interaction patterns, the landscape is evolving rapidly.',
            readMore: 'Read More',
            col1Title: 'Quick Tips & Tricks',
            col1Body: 'Five productivity hacks you can use today.',
            col2Title: 'Community Spotlight',
            col2Body: 'Meet the creators building amazing things.',
            footer: 'You received this because you subscribed. Unsubscribe anytime.',
        },
        promotion: {
            name: 'Promotion',
            description: 'Drive sales with a bold offer announcement',
            heading: 'Spring Sale — 40% Off',
            body: "Don't miss out on our biggest sale of the season. Limited time only — use code SPRING40 at checkout.",
            button: 'Shop Now',
            product1: 'Essential Tee\n$29 → $17',
            product2: 'Classic Hoodie\n$59 → $35',
            product3: 'Weekend Bag\n$89 → $53',
            disclaimer: 'Offer valid until March 31, 2026. Cannot be combined with other discounts.',
        },
        productLaunch: {
            name: 'Product Launch',
            description: 'Announce a new product with key features',
            heading: 'Meet Nova One',
            body: 'Our newest product is here to help your team move faster and deliver better customer experiences.',
            cta: 'See Product Details',
            feature1Title: 'Lightning setup',
            feature1Body: 'Go live in minutes with ready-to-use templates and smart defaults.',
            feature2Title: 'Real-time analytics',
            feature2Body: 'Track opens, clicks, and conversions with clear dashboards.',
            feature3Title: 'Team collaboration',
            feature3Body: 'Work together with comments, approvals, and version history.',
            footer: 'Early access is available for a limited number of teams.',
        },
        eventInvite: {
            name: 'Event Invitation',
            description: 'Invite contacts to webinars and live events',
            heading: 'You are invited: Growth Summit 2026',
            date: 'May 14, 2026 · 10:00 AM',
            location: 'Online event',
            body: 'Join industry leaders for practical sessions on email strategy, automation, and conversion optimization.',
            agendaTitle: 'What you will learn',
            agenda1: 'Winning lifecycle campaigns',
            agenda2: 'Personalization at scale',
            agenda3: 'Analytics that drive revenue',
            cta: 'Reserve Your Spot',
            footer: 'Seats are limited. Save your place today.',
        },
    },

    ru: {
        welcome: {
            name: 'Приветственное письмо',
            description: 'Тёплое приветствие для новых пользователей',
            heading: 'Добро пожаловать! 🎉',
            body: 'Мы рады, что вы с нами! Ваш аккаунт готов к работе. Вот что вы можете сделать прямо сейчас, чтобы получить максимум от нашего сервиса.',
            button: 'Начать →',
            footer: 'Нужна помощь? Ответьте на это письмо или посетите центр поддержки.',
        },
        newsletter: {
            name: 'Рассылка',
            description: 'Делитесь новостями с чистым многосекционным макетом',
            heading: '📬 Еженедельный дайджест',
            issue: 'Март 2026 · Выпуск №42',
            featuredTitle: 'Тема номера: Будущее дизайна',
            featuredBody: 'Исследуем последние тенденции в создании цифровых продуктов. От рабочих процессов с AI до новых паттернов взаимодействия — пейзаж меняется стремительно.',
            readMore: 'Читать далее',
            col1Title: 'Советы и лайфхаки',
            col1Body: 'Пять приёмов продуктивности, которые можно применить уже сегодня.',
            col2Title: 'Сообщество',
            col2Body: 'Знакомьтесь с авторами, создающими удивительные вещи.',
            footer: 'Вы получили это письмо, потому что подписались на нашу рассылку. Отписаться.',
        },
        promotion: {
            name: 'Акция',
            description: 'Привлекайте продажи ярким объявлением об акции',
            heading: 'Весенняя распродажа — скидка 40%',
            body: 'Не пропустите главную акцию сезона! Ограниченное время — используйте промокод SPRING40 при оформлении заказа.',
            button: 'Купить сейчас',
            product1: 'Базовая футболка\n1 900 ₽ → 1 140 ₽',
            product2: 'Классовое худи\n3 900 ₽ → 2 340 ₽',
            product3: 'Дорожная сумка\n5 900 ₽ → 3 540 ₽',
            disclaimer: 'Предложение действует до 31 марта 2026 г. Не суммируется с другими скидками.',
        },
        productLaunch: {
            name: 'Запуск продукта',
            description: 'Анонсируйте новый продукт с ключевыми преимуществами',
            heading: 'Знакомьтесь: Nova One',
            body: 'Наш новый продукт помогает командам работать быстрее и улучшать клиентский опыт.',
            cta: 'Подробнее о продукте',
            feature1Title: 'Быстрый старт',
            feature1Body: 'Запускайтесь за минуты с готовыми шаблонами и умными настройками.',
            feature2Title: 'Аналитика в реальном времени',
            feature2Body: 'Отслеживайте открытия, клики и конверсии в наглядных дашбордах.',
            feature3Title: 'Командная работа',
            feature3Body: 'Работайте вместе через комментарии, согласования и историю версий.',
            footer: 'Ранний доступ открыт для ограниченного числа команд.',
        },
        eventInvite: {
            name: 'Приглашение на событие',
            description: 'Приглашайте контакты на вебинары и онлайн-мероприятия',
            heading: 'Вы приглашены: Growth Summit 2026',
            date: '14 мая 2026 · 10:00',
            location: 'Онлайн-мероприятие',
            body: 'Присоединяйтесь к экспертам отрасли и получите практические инсайты по email-стратегии, автоматизации и росту конверсии.',
            agendaTitle: 'Что вы узнаете',
            agenda1: 'Эффективные lifecycle-кампании',
            agenda2: 'Персонализация в масштабе',
            agenda3: 'Аналитика, которая приносит доход',
            cta: 'Забронировать место',
            footer: 'Количество мест ограничено. Забронируйте участие сегодня.',
        },
    },

    uk: {
        welcome: {
            name: 'Вітальний лист',
            description: 'Тепле привітання для нових користувачів',
            heading: 'Ласкаво просимо! 🎉',
            body: 'Ми раді, що ви з нами! Ваш акаунт готовий до роботи. Ось що ви можете зробити просто зараз, щоб отримати максимум від нашого сервісу.',
            button: 'Почати →',
            footer: 'Потрібна допомога? Відповідайте на цей лист або відвідайте центр підтримки.',
        },
        newsletter: {
            name: 'Розсилка',
            description: 'Діліться новинами із чистим багатосекційним макетом',
            heading: '📬 Щотижневий дайджест',
            issue: 'Березень 2026 · Випуск №42',
            featuredTitle: 'Тема номера: Майбутнє дизайну',
            featuredBody: 'Досліджуємо останні тенденції у створенні цифрових продуктів. Від робочих процесів з AI до нових патернів взаємодії — пейзаж змінюється стрімко.',
            readMore: 'Читати далі',
            col1Title: 'Поради та лайфхаки',
            col1Body: "П'ять прийомів продуктивності, які можна застосувати вже сьогодні.",
            col2Title: 'Спільнота',
            col2Body: 'Знайомтеся з авторами, що створюють дивовижні речі.',
            footer: 'Ви отримали цей лист, бо підписалися на нашу розсилку. Відписатися.',
        },
        promotion: {
            name: 'Акція',
            description: "Залучайте продажі яскравим оголошенням про акцію",
            heading: 'Весінній розпродаж — знижка 40%',
            body: 'Не пропустіть головну акцію сезону! Обмежений час — використовуйте промокод SPRING40 при оформленні замовлення.',
            button: 'Купити зараз',
            product1: 'Базова футболка\n760 ₴ → 456 ₴',
            product2: 'Класичне худі\n1 560 ₴ → 936 ₴',
            product3: 'Дорожня сумка\n2 360 ₴ → 1 416 ₴',
            disclaimer: 'Пропозиція діє до 31 березня 2026 р. Не сумується з іншими знижками.',
        },
        productLaunch: {
            name: 'Запуск продукту',
            description: 'Анонсуйте новий продукт із ключовими перевагами',
            heading: 'Зустрічайте: Nova One',
            body: 'Наш новий продукт допомагає командам працювати швидше та покращувати клієнтський досвід.',
            cta: 'Деталі продукту',
            feature1Title: 'Швидкий старт',
            feature1Body: 'Запускайтеся за хвилини з готовими шаблонами та розумними налаштуваннями.',
            feature2Title: 'Аналітика в реальному часі',
            feature2Body: 'Відстежуйте відкриття, кліки та конверсії в наочних дашбордах.',
            feature3Title: 'Командна співпраця',
            feature3Body: 'Працюйте разом через коментарі, погодження та історію версій.',
            footer: 'Ранній доступ відкрито для обмеженої кількості команд.',
        },
        eventInvite: {
            name: 'Запрошення на подію',
            description: 'Запрошуйте контакти на вебінари та онлайн-події',
            heading: 'Вас запрошено: Growth Summit 2026',
            date: '14 травня 2026 · 10:00',
            location: 'Онлайн-подія',
            body: 'Приєднуйтеся до лідерів індустрії на практичні сесії про email-стратегію, автоматизацію та оптимізацію конверсії.',
            agendaTitle: 'Що ви дізнаєтеся',
            agenda1: 'Ефективні lifecycle-кампанії',
            agenda2: 'Персоналізація в масштабі',
            agenda3: 'Аналітика, що приносить дохід',
            cta: 'Забронювати місце',
            footer: 'Кількість місць обмежена. Зареєструйтеся сьогодні.',
        },
    },

    it: {
        welcome: {
            name: 'Email di benvenuto',
            description: 'Un caloroso benvenuto per i nuovi utenti',
            heading: 'Benvenuto a bordo! 🎉',
            body: 'Siamo entusiasti di averti con noi! Il tuo account è pronto. Ecco cosa puoi fare subito per ottenere il massimo dalla nostra piattaforma.',
            button: 'Inizia ora →',
            footer: 'Hai bisogno di aiuto? Rispondi a questa email o visita il nostro centro assistenza.',
        },
        newsletter: {
            name: 'Newsletter',
            description: 'Condividi aggiornamenti con un layout pulito e multisezione',
            heading: '📬 Digest settimanale',
            issue: 'Marzo 2026 · Numero #42',
            featuredTitle: 'In primo piano: Il futuro del design',
            featuredBody: "Esploriamo le ultime tendenze nella creazione di esperienze digitali. Dai flussi di lavoro assistiti dall'AI ai nuovi pattern di interazione, il panorama si evolve rapidamente.",
            readMore: 'Leggi di più',
            col1Title: 'Consigli e trucchi',
            col1Body: 'Cinque trucchi di produttività da usare oggi stesso.',
            col2Title: 'Spotlight della community',
            col2Body: 'Scopri i creatori che stanno realizzando cose straordinarie.',
            footer: 'Hai ricevuto questa email perché sei iscritto. Annulla iscrizione.',
        },
        promotion: {
            name: 'Promozione',
            description: "Aumenta le vendite con un'offerta in evidenza",
            heading: 'Saldi di primavera — 40% di sconto',
            body: "Non perdere i nostri saldi più grandi della stagione! Solo per un tempo limitato — usa il codice SPRING40 al momento del pagamento.",
            button: 'Acquista ora',
            product1: 'T-shirt essenziale\n€29 → €17',
            product2: 'Felpa classica\n€59 → €35',
            product3: 'Borsa weekend\n€89 → €53',
            disclaimer: "Offerta valida fino al 31 marzo 2026. Non cumulabile con altri sconti.",
        },
        productLaunch: {
            name: 'Lancio prodotto',
            description: 'Annuncia un nuovo prodotto con le funzionalità principali',
            heading: 'Ti presentiamo Nova One',
            body: 'Il nostro nuovo prodotto aiuta i team a lavorare più velocemente e offrire esperienze migliori ai clienti.',
            cta: 'Scopri il prodotto',
            feature1Title: 'Avvio rapido',
            feature1Body: 'Vai online in pochi minuti con template pronti e impostazioni intelligenti.',
            feature2Title: 'Analytics in tempo reale',
            feature2Body: 'Monitora aperture, clic e conversioni con dashboard chiare.',
            feature3Title: 'Collaborazione di team',
            feature3Body: 'Lavora insieme con commenti, approvazioni e cronologia versioni.',
            footer: 'L’accesso anticipato è disponibile per un numero limitato di team.',
        },
        eventInvite: {
            name: 'Invito evento',
            description: 'Invita i contatti a webinar ed eventi live',
            heading: 'Sei invitato: Growth Summit 2026',
            date: '14 maggio 2026 · 10:00',
            location: 'Evento online',
            body: 'Partecipa con i leader del settore a sessioni pratiche su strategia email, automazione e ottimizzazione conversioni.',
            agendaTitle: 'Cosa imparerai',
            agenda1: 'Campagne lifecycle efficaci',
            agenda2: 'Personalizzazione su larga scala',
            agenda3: 'Analytics che generano ricavi',
            cta: 'Prenota il tuo posto',
            footer: 'I posti sono limitati. Registrati oggi.',
        },
    },

    es: {
        welcome: {
            name: 'Email de bienvenida',
            description: 'Un cálido saludo para los nuevos usuarios',
            heading: '¡Bienvenido a bordo! 🎉',
            body: '¡Nos alegra mucho tenerte con nosotros! Tu cuenta está lista. Aquí tienes lo que puedes hacer ahora mismo para sacar el máximo partido a nuestra plataforma.',
            button: 'Empezar →',
            footer: '¿Necesitas ayuda? Responde a este email o visita nuestro centro de ayuda.',
        },
        newsletter: {
            name: 'Boletín',
            description: 'Comparte novedades con un diseño limpio de varias secciones',
            heading: '📬 Resumen semanal',
            issue: 'Marzo 2026 · Número #42',
            featuredTitle: 'Destacado: El futuro del diseño',
            featuredBody: 'Exploramos las últimas tendencias en la creación de experiencias digitales. Desde flujos de trabajo asistidos por IA hasta nuevos patrones de interacción, el panorama evoluciona rápidamente.',
            readMore: 'Leer más',
            col1Title: 'Consejos y trucos',
            col1Body: 'Cinco hacks de productividad que puedes usar hoy mismo.',
            col2Title: 'Destacados de la comunidad',
            col2Body: 'Conoce a los creadores que están haciendo cosas increíbles.',
            footer: 'Recibiste este email porque te suscribiste. Cancelar suscripción.',
        },
        promotion: {
            name: 'Promoción',
            description: 'Impulsa las ventas con un anuncio de oferta llamativo',
            heading: 'Rebajas de primavera — 40% de descuento',
            body: '¡No te pierdas nuestras mayores rebajas de la temporada! Solo por tiempo limitado — usa el código SPRING40 en el pago.',
            button: 'Comprar ahora',
            product1: 'Camiseta esencial\n29 € → 17 €',
            product2: 'Sudadera clásica\n59 € → 35 €',
            product3: 'Bolsa de fin de semana\n89 € → 53 €',
            disclaimer: 'Oferta válida hasta el 31 de marzo de 2026. No acumulable con otros descuentos.',
        },
        productLaunch: {
            name: 'Lanzamiento de producto',
            description: 'Anuncia un nuevo producto con sus funciones clave',
            heading: 'Conoce Nova One',
            body: 'Nuestro nuevo producto ayuda a los equipos a trabajar más rápido y mejorar la experiencia del cliente.',
            cta: 'Ver detalles del producto',
            feature1Title: 'Configuración rápida',
            feature1Body: 'Lanza en minutos con plantillas listas y ajustes inteligentes.',
            feature2Title: 'Analítica en tiempo real',
            feature2Body: 'Mide aperturas, clics y conversiones con paneles claros.',
            feature3Title: 'Colaboración en equipo',
            feature3Body: 'Trabajen juntos con comentarios, aprobaciones e historial de versiones.',
            footer: 'El acceso anticipado está disponible para un número limitado de equipos.',
        },
        eventInvite: {
            name: 'Invitación a evento',
            description: 'Invita contactos a webinars y eventos en vivo',
            heading: 'Estás invitado: Growth Summit 2026',
            date: '14 de mayo de 2026 · 10:00',
            location: 'Evento online',
            body: 'Únete a líderes del sector en sesiones prácticas sobre estrategia de email, automatización y optimización de conversiones.',
            agendaTitle: 'Qué aprenderás',
            agenda1: 'Campañas lifecycle ganadoras',
            agenda2: 'Personalización a gran escala',
            agenda3: 'Analítica que impulsa ingresos',
            cta: 'Reserva tu plaza',
            footer: 'Las plazas son limitadas. Reserva hoy.',
        },
    },

    fr: {
        welcome: {
            name: "Email de bienvenue",
            description: 'Un accueil chaleureux pour les nouveaux utilisateurs',
            heading: 'Bienvenue à bord ! 🎉',
            body: "Nous sommes ravis de vous accueillir ! Votre compte est prêt. Voici ce que vous pouvez faire dès maintenant pour profiter au maximum de notre plateforme.",
            button: 'Commencer →',
            footer: "Besoin d'aide ? Répondez à cet email ou visitez notre centre d'assistance.",
        },
        newsletter: {
            name: 'Newsletter',
            description: 'Partagez des actualités avec une mise en page claire multi-sections',
            heading: '📬 Digest hebdomadaire',
            issue: 'Mars 2026 · Numéro #42',
            featuredTitle: "À la une : L'avenir du design",
            featuredBody: "Nous explorons les dernières tendances qui façonnent la création d'expériences numériques. Des flux de travail assistés par l'IA aux nouveaux modèles d'interaction, le paysage évolue rapidement.",
            readMore: 'Lire la suite',
            col1Title: 'Conseils et astuces',
            col1Body: "Cinq hacks de productivité à utiliser dès aujourd'hui.",
            col2Title: 'Coup de projecteur communauté',
            col2Body: 'Rencontrez les créateurs qui font des choses extraordinaires.',
            footer: "Vous avez reçu cet email car vous êtes abonné. Se désabonner.",
        },
        promotion: {
            name: 'Promotion',
            description: 'Stimulez les ventes avec une annonce d\'offre percutante',
            heading: 'Soldes de printemps — 40 % de réduction',
            body: "Ne manquez pas nos plus grandes soldes de la saison ! Durée limitée — utilisez le code SPRING40 à la caisse.",
            button: 'Acheter maintenant',
            product1: 'T-shirt essentiel\n29 € → 17 €',
            product2: 'Sweat classique\n59 € → 35 €',
            product3: 'Sac de week-end\n89 € → 53 €',
            disclaimer: "Offre valable jusqu'au 31 mars 2026. Non cumulable avec d'autres réductions.",
        },
        productLaunch: {
            name: 'Lancement produit',
            description: 'Annoncez un nouveau produit avec ses points forts',
            heading: 'Découvrez Nova One',
            body: 'Notre nouveau produit aide les équipes à aller plus vite et à offrir une meilleure expérience client.',
            cta: 'Voir le produit',
            feature1Title: 'Mise en route rapide',
            feature1Body: 'Lancez-vous en quelques minutes avec des modèles prêts à l’emploi et des paramètres intelligents.',
            feature2Title: 'Analytique en temps réel',
            feature2Body: 'Suivez ouvertures, clics et conversions dans des tableaux de bord clairs.',
            feature3Title: 'Collaboration d’équipe',
            feature3Body: 'Travaillez ensemble avec commentaires, validations et historique des versions.',
            footer: 'L’accès anticipé est disponible pour un nombre limité d’équipes.',
        },
        eventInvite: {
            name: 'Invitation événement',
            description: 'Invitez vos contacts à des webinaires et événements live',
            heading: 'Vous êtes invité : Growth Summit 2026',
            date: '14 mai 2026 · 10:00',
            location: 'Événement en ligne',
            body: 'Rejoignez des leaders du secteur pour des sessions pratiques sur la stratégie email, l’automatisation et l’optimisation de la conversion.',
            agendaTitle: 'Ce que vous allez apprendre',
            agenda1: 'Des campagnes lifecycle performantes',
            agenda2: 'La personnalisation à grande échelle',
            agenda3: 'Une analytique orientée revenus',
            cta: 'Réserver ma place',
            footer: 'Le nombre de places est limité. Réservez dès aujourd’hui.',
        },
    },
};

// ---------------------------------------------------------------------------
// Template builders
// ---------------------------------------------------------------------------

function buildWelcomeTemplate(loc: TemplateLocale['welcome']): EmailTemplate {
    return {
        bgColor: '#F8FAFC',
        contentWidth: 600,
        fontFamily: 'Arial, Helvetica, sans-serif',
        rows: [
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'image', src: 'https://placehold.co/600x120/4F46E5/FFFFFF?text=Your+Logo', alt: 'Logo', width: 50, align: 'center' as const },
                ]],
            },
            { id: uid(), columns: 1, blocks: [[{ id: uid(), type: 'spacer', height: 16 }]] },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'heading', content: loc.heading, level: 'h1' as const, color: '#0F172A', align: 'center' as const },
                ]],
            },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'text', content: loc.body, fontSize: 16, color: '#475569', align: 'center' as const },
                ]],
            },
            { id: uid(), columns: 1, blocks: [[{ id: uid(), type: 'spacer', height: 8 }]] },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'button', text: loc.button, url: '#', bgColor: '#4F46E5', textColor: '#FFFFFF', borderRadius: 8, align: 'center' as const },
                ]],
            },
            { id: uid(), columns: 1, blocks: [[{ id: uid(), type: 'spacer', height: 16 }]] },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'divider', color: '#E2E8F0', thickness: 1, style: 'solid' as const },
                ]],
            },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'text', content: loc.footer, fontSize: 13, color: '#94A3B8', align: 'center' as const },
                ]],
            },
        ],
    };
}

function buildNewsletterTemplate(loc: TemplateLocale['newsletter']): EmailTemplate {
    return {
        bgColor: '#F8FAFC',
        contentWidth: 600,
        fontFamily: "'Georgia', Times, serif",
        rows: [
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'heading', content: loc.heading, level: 'h1' as const, color: '#0F172A', align: 'left' as const },
                ]],
            },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'text', content: loc.issue, fontSize: 13, color: '#94A3B8', align: 'left' as const },
                ]],
            },
            {
                id: uid(), columns: 1,
                blocks: [[{ id: uid(), type: 'divider', color: '#E2E8F0', thickness: 1, style: 'solid' as const }]],
            },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'image', src: 'https://placehold.co/600x250/e2e8f0/475569?text=Featured+Article', alt: 'Featured', width: 100, align: 'center' as const },
                ]],
            },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'heading', content: loc.featuredTitle, level: 'h2' as const, color: '#0F172A', align: 'left' as const },
                ]],
            },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'text', content: loc.featuredBody, fontSize: 15, color: '#475569', align: 'left' as const },
                ]],
            },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'button', text: loc.readMore, url: '#', bgColor: '#0F172A', textColor: '#FFFFFF', borderRadius: 6, align: 'left' as const },
                ]],
            },
            { id: uid(), columns: 1, blocks: [[{ id: uid(), type: 'spacer', height: 12 }]] },
            {
                id: uid(), columns: 1,
                blocks: [[{ id: uid(), type: 'divider', color: '#E2E8F0', thickness: 1, style: 'solid' as const }]],
            },
            {
                id: uid(), columns: 2,
                blocks: [
                    [
                        { id: uid(), type: 'image', src: 'https://placehold.co/280x160/e2e8f0/475569?text=Article+2', alt: 'Article', width: 100, align: 'center' as const },
                        { id: uid(), type: 'heading', content: loc.col1Title, level: 'h3' as const, color: '#0F172A', align: 'left' as const },
                        { id: uid(), type: 'text', content: loc.col1Body, fontSize: 14, color: '#475569', align: 'left' as const },
                    ],
                    [
                        { id: uid(), type: 'image', src: 'https://placehold.co/280x160/e2e8f0/475569?text=Article+3', alt: 'Article', width: 100, align: 'center' as const },
                        { id: uid(), type: 'heading', content: loc.col2Title, level: 'h3' as const, color: '#0F172A', align: 'left' as const },
                        { id: uid(), type: 'text', content: loc.col2Body, fontSize: 14, color: '#475569', align: 'left' as const },
                    ],
                ],
            },
            { id: uid(), columns: 1, blocks: [[{ id: uid(), type: 'spacer', height: 16 }]] },
            {
                id: uid(), columns: 1,
                blocks: [[{ id: uid(), type: 'divider', color: '#E2E8F0', thickness: 1, style: 'solid' as const }]],
            },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'text', content: loc.footer, fontSize: 12, color: '#94A3B8', align: 'center' as const },
                ]],
            },
        ],
    };
}

function buildPromotionTemplate(loc: TemplateLocale['promotion']): EmailTemplate {
    return {
        bgColor: '#F8FAFC',
        contentWidth: 600,
        fontFamily: 'Arial, Helvetica, sans-serif',
        rows: [
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'image', src: 'https://placehold.co/600x80/4F46E5/FFFFFF?text=BRAND', alt: 'Brand', width: 30, align: 'center' as const },
                ]],
            },
            { id: uid(), columns: 1, blocks: [[{ id: uid(), type: 'spacer', height: 12 }]] },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'heading', content: loc.heading, level: 'h1' as const, color: '#4F46E5', align: 'center' as const },
                ]],
            },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'text', content: loc.body, fontSize: 16, color: '#475569', align: 'center' as const },
                ]],
            },
            { id: uid(), columns: 1, blocks: [[{ id: uid(), type: 'spacer', height: 8 }]] },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'button', text: loc.button, url: '#', bgColor: '#4F46E5', textColor: '#FFFFFF', borderRadius: 24, align: 'center' as const },
                ]],
            },
            { id: uid(), columns: 1, blocks: [[{ id: uid(), type: 'spacer', height: 16 }]] },
            {
                id: uid(), columns: 3,
                blocks: [
                    [
                        { id: uid(), type: 'image', src: 'https://placehold.co/180x180/e2e8f0/475569?text=Product+1', alt: 'Product', width: 100, align: 'center' as const },
                        { id: uid(), type: 'text', content: loc.product1, fontSize: 14, color: '#0F172A', align: 'center' as const },
                    ],
                    [
                        { id: uid(), type: 'image', src: 'https://placehold.co/180x180/e2e8f0/475569?text=Product+2', alt: 'Product', width: 100, align: 'center' as const },
                        { id: uid(), type: 'text', content: loc.product2, fontSize: 14, color: '#0F172A', align: 'center' as const },
                    ],
                    [
                        { id: uid(), type: 'image', src: 'https://placehold.co/180x180/e2e8f0/475569?text=Product+3', alt: 'Product', width: 100, align: 'center' as const },
                        { id: uid(), type: 'text', content: loc.product3, fontSize: 14, color: '#0F172A', align: 'center' as const },
                    ],
                ],
            },
            { id: uid(), columns: 1, blocks: [[{ id: uid(), type: 'spacer', height: 16 }]] },
            {
                id: uid(), columns: 1,
                blocks: [[{ id: uid(), type: 'divider', color: '#E2E8F0', thickness: 1, style: 'solid' as const }]],
            },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'text', content: loc.disclaimer, fontSize: 12, color: '#94A3B8', align: 'center' as const },
                ]],
            },
        ],
    };
}

function buildProductLaunchTemplate(loc: TemplateLocale['productLaunch']): EmailTemplate {
    return {
        bgColor: '#F8FAFC',
        contentWidth: 600,
        fontFamily: 'Arial, Helvetica, sans-serif',
        rows: [
            {
                id: uid(), columns: 1,
                blocks: [[
                    {
                        id: uid(),
                        type: 'hero',
                        imageUrl: 'https://placehold.co/600x280/0F172A/FFFFFF?text=Nova+One',
                        imageAlt: loc.heading,
                        title: loc.heading,
                        description: loc.body,
                        buttonText: loc.cta,
                        buttonUrl: '#',
                        titleColor: '#0F172A',
                        textColor: '#334155',
                        buttonBgColor: '#0F172A',
                        buttonTextColor: '#FFFFFF',
                        align: 'left',
                    },
                ]],
            },
            { id: uid(), columns: 1, blocks: [[{ id: uid(), type: 'spacer', height: 12 }]] },
            {
                id: uid(), columns: 3,
                blocks: [
                    [
                        { id: uid(), type: 'heading', content: loc.feature1Title, level: 'h3' as const, color: '#0F172A', align: 'left' as const },
                        { id: uid(), type: 'text', content: loc.feature1Body, fontSize: 14, color: '#475569', align: 'left' as const },
                    ],
                    [
                        { id: uid(), type: 'heading', content: loc.feature2Title, level: 'h3' as const, color: '#0F172A', align: 'left' as const },
                        { id: uid(), type: 'text', content: loc.feature2Body, fontSize: 14, color: '#475569', align: 'left' as const },
                    ],
                    [
                        { id: uid(), type: 'heading', content: loc.feature3Title, level: 'h3' as const, color: '#0F172A', align: 'left' as const },
                        { id: uid(), type: 'text', content: loc.feature3Body, fontSize: 14, color: '#475569', align: 'left' as const },
                    ],
                ],
            },
            { id: uid(), columns: 1, blocks: [[{ id: uid(), type: 'spacer', height: 16 }]] },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'text', content: loc.footer, fontSize: 12, color: '#94A3B8', align: 'center' as const },
                ]],
            },
        ],
    };
}

function buildEventInviteTemplate(loc: TemplateLocale['eventInvite']): EmailTemplate {
    return {
        bgColor: '#F1F5F9',
        contentWidth: 600,
        fontFamily: "'Georgia', Times, serif",
        rows: [
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'heading', content: loc.heading, level: 'h1' as const, color: '#0F172A', align: 'center' as const },
                ]],
            },
            {
                id: uid(), columns: 2,
                blocks: [
                    [
                        { id: uid(), type: 'text', content: loc.date, fontSize: 14, color: '#334155', align: 'left' as const },
                    ],
                    [
                        { id: uid(), type: 'text', content: loc.location, fontSize: 14, color: '#334155', align: 'right' as const },
                    ],
                ],
            },
            { id: uid(), columns: 1, blocks: [[{ id: uid(), type: 'divider', color: '#CBD5E1', thickness: 1, style: 'solid' as const }]] },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'text', content: loc.body, fontSize: 15, color: '#475569', align: 'left' as const },
                ]],
            },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'heading', content: loc.agendaTitle, level: 'h3' as const, color: '#0F172A', align: 'left' as const },
                ]],
            },
            {
                id: uid(), columns: 1,
                blocks: [[
                    {
                        id: uid(),
                        type: 'text',
                        content: `• ${loc.agenda1}\n• ${loc.agenda2}\n• ${loc.agenda3}`,
                        fontSize: 14,
                        color: '#334155',
                        align: 'left' as const,
                    },
                ]],
            },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'button', text: loc.cta, url: '#', bgColor: '#0F172A', textColor: '#FFFFFF', borderRadius: 8, align: 'center' as const },
                ]],
            },
            { id: uid(), columns: 1, blocks: [[{ id: uid(), type: 'spacer', height: 12 }]] },
            {
                id: uid(), columns: 1,
                blocks: [[
                    { id: uid(), type: 'text', content: loc.footer, fontSize: 12, color: '#94A3B8', align: 'center' as const },
                ]],
            },
        ],
    };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns starter templates localised for the given language.
 * Falls back to English for any unsupported language.
 */
export function getStarterTemplates(language: Language): StarterTemplate[] {
    const locale = LOCALES[language] ?? LOCALES.en;

    return [
        {
            id: 'welcome',
            name: locale.welcome.name,
            description: locale.welcome.description,
            thumbnail: '👋',
            build: () => buildWelcomeTemplate(locale.welcome),
        },
        {
            id: 'newsletter',
            name: locale.newsletter.name,
            description: locale.newsletter.description,
            thumbnail: '📰',
            build: () => buildNewsletterTemplate(locale.newsletter),
        },
        {
            id: 'promotion',
            name: locale.promotion.name,
            description: locale.promotion.description,
            thumbnail: '🏷️',
            build: () => buildPromotionTemplate(locale.promotion),
        },
        {
            id: 'product-launch',
            name: locale.productLaunch.name,
            description: locale.productLaunch.description,
            thumbnail: '🚀',
            build: () => buildProductLaunchTemplate(locale.productLaunch),
        },
        {
            id: 'event-invite',
            name: locale.eventInvite.name,
            description: locale.eventInvite.description,
            thumbnail: '📅',
            build: () => buildEventInviteTemplate(locale.eventInvite),
        },
    ];
}

export function getStarterTemplateById(language: Language, templateId: string): StarterTemplate | null {
    return getStarterTemplates(language).find((template) => template.id === templateId) ?? null;
}

/**
 * English default — kept for backward compatibility with existing imports.
 */
export const starterTemplates: StarterTemplate[] = getStarterTemplates('en');
