import type { MediaFolder, MediaFile, MediaType, StockSource, StockSourceKey, EmailUsageItem } from '@/types/storage';

export const STOCK_SOURCES: StockSource[] = [
    {
        key: 'unsplash',
        label: 'Unsplash',
        description: 'Free high-resolution photos',
        icon: '🏔',
        color: '#000000',
        connected: true,
        requiresApiKey: true,
        apiKey: 'usk_demo_••••••••••••',
        freeLimit: '50 req/hr',
        website: 'https://unsplash.com/developers',
    },
    {
        key: 'pexels',
        label: 'Pexels',
        description: 'Free stock photos & videos',
        icon: '🌿',
        color: '#05A081',
        connected: false,
        requiresApiKey: true,
        freeLimit: 'Unlimited',
        website: 'https://www.pexels.com/api/',
    },
    {
        key: 'pixabay',
        label: 'Pixabay',
        description: 'Free images, vectors & videos',
        icon: '🌻',
        color: '#2EC66E',
        connected: false,
        requiresApiKey: true,
        freeLimit: '100 req/min',
        website: 'https://pixabay.com/api/docs/',
    },
    {
        key: 'google_drive',
        label: 'Google Drive',
        description: 'Access files from your Drive',
        icon: '🔷',
        color: '#4285F4',
        connected: false,
        requiresApiKey: false,
        website: 'https://drive.google.com',
    },
    {
        key: 'dropbox',
        label: 'Dropbox',
        description: 'Browse and import from Dropbox',
        icon: '📦',
        color: '#0061FF',
        connected: false,
        requiresApiKey: false,
        website: 'https://dropbox.com',
    },
    {
        key: 'mega',
        label: 'MEGA',
        description: 'Secure cloud storage',
        icon: '🔴',
        color: '#D9272E',
        connected: false,
        requiresApiKey: false,
        website: 'https://mega.nz',
    },
];

export const MOCK_FOLDERS: MediaFolder[] = [
    { id: 'f1', name: 'Email Headers', parentId: null, itemCount: 12, createdAt: '2026-01-10' },
    { id: 'f2', name: 'Product Photos', parentId: null, itemCount: 34, createdAt: '2026-01-15' },
    { id: 'f3', name: 'Brand Assets', parentId: null, itemCount: 8, createdAt: '2026-02-01' },
    { id: 'f4', name: 'Campaign — Spring 2026', parentId: null, itemCount: 22, createdAt: '2026-02-20' },
    { id: 'f5', name: 'Backgrounds', parentId: 'f1', itemCount: 6, createdAt: '2026-03-01' },
];

const MOCK_USAGE_POOL: EmailUsageItem[][] = [
    [
        { id: 'e1', campaignName: 'Spring Sale 2026', subject: '🌸 Up to 40% off this weekend', status: 'sent', sentAt: '2026-03-15', openRate: 34.2 },
        { id: 'e2', campaignName: 'Welcome Series #1', subject: 'Welcome to the family!', status: 'sent', sentAt: '2026-02-10', openRate: 58.7 },
        { id: 'e3', campaignName: 'Newsletter March', subject: 'What\'s new in March', status: 'scheduled', sentAt: '2026-04-01' },
    ],
    [],
    [
        { id: 'e4', campaignName: 'Product Launch', subject: 'Introducing our newest product', status: 'sent', sentAt: '2026-03-01', openRate: 41.5 },
        { id: 'e5', campaignName: 'Reengagement', subject: 'We miss you 💙', status: 'draft' },
        { id: 'e6', campaignName: 'Black Friday Promo', subject: '🖤 Biggest sale of the year', status: 'sent', sentAt: '2025-11-29', openRate: 62.1 },
    ],
    [
        { id: 'e7', campaignName: 'Weekly Digest', subject: 'Your weekly digest is here', status: 'sent', sentAt: '2026-03-22', openRate: 28.9 },
        { id: 'e8', campaignName: 'Flash Sale', subject: '⚡ 24h only — 30% off', status: 'sent', sentAt: '2026-03-18', openRate: 47.3 },
        { id: 'e9', campaignName: 'Birthday Campaign', subject: 'Happy Birthday, {{first_name}}!', status: 'sent', sentAt: '2026-03-05', openRate: 71.4 },
        { id: 'e10', campaignName: 'Cart Abandonment', subject: 'You left something behind...', status: 'scheduled', sentAt: '2026-04-05' },
        { id: 'e11', campaignName: 'Loyalty Reward', subject: 'Your exclusive reward is waiting', status: 'draft' },
        { id: 'e12', campaignName: 'Summer Preview', subject: 'Summer is coming 🌞', status: 'draft' },
        { id: 'e13', campaignName: 'Post-Purchase', subject: 'Thanks for your order!', status: 'sent', sentAt: '2026-02-28', openRate: 55.0 },
    ],
    [
        { id: 'e14', campaignName: 'Onboarding Step 3', subject: 'Level up your account', status: 'sent', sentAt: '2026-03-10', openRate: 39.8 },
        { id: 'e15', campaignName: 'Referral Program', subject: 'Give 20%, get 20%', status: 'sent', sentAt: '2026-02-20', openRate: 33.1 },
        { id: 'e16', campaignName: 'Product Update', subject: 'We shipped something new', status: 'scheduled', sentAt: '2026-04-08' },
        { id: 'e17', campaignName: 'Survey Request', subject: 'Quick question for you', status: 'draft' },
        { id: 'e18', campaignName: 'End of Season', subject: 'Last chance for winter deals', status: 'sent', sentAt: '2026-02-15', openRate: 29.4 },
    ],
];

const PHOTO_IDS = [
    '1486312338219-ce68d2c6f44d', '1498050108023-c5249f4df085', '1551434678-e076c223a692',
    '1497366811353-6870744d04b2', '1521737852567-6949f3f9f2b5', '1542273917363-3b1817f69a2d',
    '1519389950473-47ba0277781c', '1518770660439-4636190af475', '1485827404703-89b55fcc595e',
    '1557682250-33bd709cbe85', '1444703686981-a3abbc4d4fe3', '1501854140801-50d01698950b',
    '1493723843671-1d655e66ac1c', '1462275646964-a0e3386b89fa', '1504674900247-0877df9cc836',
    '1488646953014-85cb44e25828', '1519085360753-af0119f7cbe7', '1511895426328-dc8714191011',
];

const FOLDERS_FOR_FILES = [null, null, 'f1', 'f1', 'f2', 'f2', 'f2', 'f3', 'f4', 'f4', null, 'f1', 'f2', 'f3', null, 'f4', null, 'f2'];
const SOURCES: Array<'upload' | StockSourceKey> = ['upload', 'unsplash', 'upload', 'upload', 'unsplash', 'upload', 'upload', 'upload', 'unsplash', 'upload', 'unsplash', 'upload', 'upload', 'upload', 'unsplash', 'upload', 'upload', 'unsplash'];
const WIDTHS  = [1200, 1920, 800, 1600, 1200, 900, 1440, 1200, 1920, 800, 1200, 900, 1600, 1200, 800, 1920, 1200, 900];
const HEIGHTS = [800, 1080, 600, 900, 800, 600, 900, 800, 1080, 533, 800, 600, 900, 800, 533, 1080, 800, 600];
const SIZES   = [245120, 1843200, 102400, 512000, 614400, 307200, 921600, 204800, 1536000, 163840, 409600, 204800, 716800, 358400, 122880, 1228800, 460800, 266240];
const NAMES   = [
    'laptop-workspace.jpg', 'code-screen.jpg', 'coffee-desk.jpg', 'office-meeting.jpg',
    'team-work.jpg', 'modern-office.jpg', 'meeting-room.jpg', 'circuit-board.jpg',
    'robot-tech.jpg', 'purple-gradient.jpg', 'galaxy-night.jpg', 'green-forest.jpg',
    'mountain-lake.jpg', 'sunrise-peak.jpg', 'avocado-toast.jpg', 'airplane-window.jpg',
    'portrait-pro.jpg', 'cafe-laptop.jpg',
];
const TAGS_POOL = [
    ['workspace', 'laptop'], ['tech', 'code'], ['coffee', 'morning'], ['office', 'business'],
    ['team', 'people'], ['office', 'minimal'], ['meeting', 'business'], ['tech', 'circuit'],
    ['ai', 'robot'], ['abstract', 'purple'], ['space', 'night'], ['nature', 'forest'],
    ['landscape', 'water'], ['mountain', 'sunrise'], ['food', 'healthy'], ['travel', 'sky'],
    ['portrait', 'person'], ['lifestyle', 'coffee'],
];
const USAGE_COUNTS = [12, 0, 3, 7, 5, 1, 0, 8, 2, 0, 4, 1, 0, 6, 0, 3, 9, 1];

function makeUrl(id: string, w = 600) {
    return `https://images.unsplash.com/photo-${id}?w=${w}&auto=format&fit=crop`;
}

export const MOCK_FILES: MediaFile[] = PHOTO_IDS.map((id, i) => ({
    id: `m${i + 1}`,
    folderId: FOLDERS_FOR_FILES[i],
    name: NAMES[i],
    url: makeUrl(id, WIDTHS[i]),
    thumbUrl: makeUrl(id, 400),
    type: 'image' as MediaType,
    size: SIZES[i],
    width: WIDTHS[i],
    height: HEIGHTS[i],
    alt: NAMES[i].replace(/-/g, ' ').replace('.jpg', ''),
    tags: TAGS_POOL[i],
    starred: [0, 4, 8, 14].includes(i),
    usageCount: USAGE_COUNTS[i],
    usageItems: MOCK_USAGE_POOL[Math.min(USAGE_COUNTS[i] > 0 ? (USAGE_COUNTS[i] > 5 ? 4 : USAGE_COUNTS[i] > 2 ? 3 : USAGE_COUNTS[i] > 1 ? 2 : 1) - 1 : 1, MOCK_USAGE_POOL.length - 1)],
    source: SOURCES[i],
    createdAt: `2026-0${Math.floor(i / 6) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
}));

export const STORAGE_QUOTA = 1024 * 1024 * 1024; // 1 GB mock

export const GRID_COLS_MAP: Record<3 | 4 | 5, string> = {
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
};