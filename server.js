const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('.'));

// File upload configuration
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        await fs.mkdir(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// File paths
const DATA_DIR = path.join(__dirname, 'data');
const CONTENT_FILE = path.join(DATA_DIR, 'content.json');
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const BLOG_FILE = path.join(DATA_DIR, 'blog.json');

// Ensure data directory exists
const ensureDataDir = async () => {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        await fs.mkdir(path.join(__dirname, 'uploads'), { recursive: true });
    } catch (err) {
        console.error('Error creating directories:', err);
    }
};

// Read JSON file
const readJSON = async (filePath, defaultValue = {}) => {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return defaultValue;
    }
};

// Write JSON file
const writeJSON = async (filePath, data) => {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// Initialize default settings
const initializeSettings = async () => {
    try {
        const settings = await readJSON(SETTINGS_FILE, {});

        if (Object.keys(settings).length === 0) {
            const defaultSettings = {
                version: '2.0',
                sectionOrder: ['navbar', 'hero', 'highlights', 'about', 'focus', 'strategy', 'benefits', 'resources', 'contact', 'footer'],
                sectionSpacing: {
                    navbar: '0px',
                    hero: '0px',
                    highlights: '80px',
                    about: '100px',
                    focus: '100px',
                    strategy: '100px',
                    benefits: '100px',
                    resources: '100px',
                    contact: '100px',
                    footer: '0px'
                },
                sectionVisibility: {
                    navbar: true,
                    hero: true,
                    highlights: true,
                    about: true,
                    focus: true,
                    strategy: true,
                    benefits: true,
                    resources: true,
                    contact: true,
                    footer: true
                },
                colors: {
                    primary: '#F6A86D',
                    primaryDark: '#f59a52',
                    secondary: '#5F8B9B',
                    secondaryDark: '#527a89',
                    charcoal: '#333333',
                    lightGray: '#F5F5F5',
                    white: '#FFFFFF'
                },
                typography: {
                    headingFont: 'Montserrat',
                    bodyFont: 'Open Sans',
                    h1Size: '64px',
                    h2Size: '48px',
                    h3Size: '28px',
                    bodySize: '16px',
                    lineHeight: '1.6'
                },
                customCSS: ''
            };

            await writeJSON(SETTINGS_FILE, defaultSettings);
            console.log('✅ Default settings initialized');
        }
    } catch (err) {
        console.error('Error initializing settings:', err);
    }
};

// Initialize blog
const initializeBlog = async () => {
    try {
        const blog = await readJSON(BLOG_FILE, {});

        if (Object.keys(blog).length === 0) {
            const defaultBlog = {
                posts: []
            };

            await writeJSON(BLOG_FILE, defaultBlog);
            console.log('✅ Blog initialized');
        }
    } catch (err) {
        console.error('Error initializing blog:', err);
    }
};

// Initialize default admin
const initializeAdmin = async () => {
    try {
        const admins = await readJSON(ADMIN_FILE, []);
        const adminExists = admins.find(a => a.username === 'admin');

        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            admins.push({
                id: '1',
                username: 'admin',
                password: hashedPassword,
                createdAt: new Date().toISOString()
            });
            await writeJSON(ADMIN_FILE, admins);
            console.log('✅ Default admin created - Username: admin, Password: admin123');
        }
    } catch (err) {
        console.error('Error initializing admin:', err);
    }
};

// Initialize default content
const initializeContent = async () => {
    try {
        const content = await readJSON(CONTENT_FILE, {});

        if (Object.keys(content).length === 0) {
            const defaultContent = {
                navbar: {
                    logo: 'https://assets.cdn.filesafe.space/Out59Sg1pInehCQh9Rc8/media/68e92f9f35e8696fd61d360c.png',
                    brandText: 'Orange Door Investment Group',
                    links: [
                        { text: 'About', href: '#about' },
                        { text: 'Focus', href: '#focus' },
                        { text: 'Roadmap', href: '#strategy' },
                        { text: 'Why Invest', href: '#benefits' },
                        { text: 'Resources', href: '#resources' },
                        { text: 'Contact', href: '#contact' }
                    ]
                },
                hero: {
                    title: 'Opening Doors to Smarter Real Estate Investments',
                    subtitle: 'Multifamily and Senior Living investments that build wealth, provide stability, and make a lasting impact.',
                    backgroundImage: 'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=1920',
                    buttons: [
                        { text: 'Join Our Investor List', href: '#contact', type: 'primary' },
                        { text: 'Schedule a Call', href: 'https://link.orangedoorinvestmentgroup.com/widget/booking/zWhipZrTkrBoIlzY8i8G', type: 'secondary' }
                    ]
                },
                highlights: {
                    items: [
                        { icon: '💰', title: 'Consistent Cash Flow', description: 'Passive income backed by hard assets with quarterly distributions once properties stabilize.' },
                        { icon: '📈', title: 'Value-Add Strategy', description: 'Transforming underperforming properties into thriving communities through strategic renovations.' },
                        { icon: '🤝', title: 'Trusted Partnerships', description: 'Experienced operators with an investor-first focus and proven track records.' }
                    ]
                },
                about: {
                    title: 'About Us',
                    content: 'We founded Orange Door Investment Group to open the door for everyday investors to participate in high quality real estate projects with real impact.',
                    team: [
                        {
                            name: 'Lara Chapman',
                            role: 'Co-Founder | Asset Management',
                            image: 'https://assets.cdn.filesafe.space/Out59Sg1pInehCQh9Rc8/media/68e7d897a54d8835f3212889.jpeg',
                            bio: 'With a foundation in corporate credit and operations, Lara brings structure and accountability to every stage of the investment process.'
                        },
                        {
                            name: 'Ryan Chapman',
                            role: 'Co-Founder | Investor Relations',
                            image: 'https://assets.cdn.filesafe.space/Out59Sg1pInehCQh9Rc8/media/68e4b94cbb291542c6595128.jpeg',
                            bio: 'Ryan brings a sharp eye for opportunity. At Orange Door Investment Group, Ryan leads investor relations and acquisition strategy.'
                        }
                    ],
                    cta: {
                        title: "Let's Build Something Lasting",
                        paragraph1: 'We believe real estate investing should be transparent, collaborative, and rewarding for everyone involved. Whether you are new to passive investing or already expanding your portfolio, we invite you to learn more about our projects and how we work with investors.',
                        paragraph2: 'Join our investor list or schedule a call to start the conversation about upcoming opportunities.'
                    },
                    partners: [
                        { name: 'NAREIT', logo: 'https://assets.cdn.filesafe.space/Out59Sg1pInehCQh9Rc8/media/68e68e65fa9ccd24016fde76.jpeg' },
                        { name: 'Real Estate Association', logo: 'https://assets.cdn.filesafe.space/Out59Sg1pInehCQh9Rc8/media/68e68e655fd99d77bce539de.png' },
                        { name: 'Partners', logo: 'https://assets.cdn.filesafe.space/Out59Sg1pInehCQh9Rc8/media/68e7db118040d5fae3a1ae85.jpeg' },
                        { name: 'Investment', logo: 'https://assets.cdn.filesafe.space/Out59Sg1pInehCQh9Rc8/media/68e68e651d56c334c7dbc633.png' }
                    ]
                },
                focus: {
                    title: 'Our Focus',
                    items: [
                        {
                            title: 'Multifamily Investments',
                            image: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=1200',
                            description: 'We target properties with below market rents, deferred maintenance, or inefficient management.'
                        },
                        {
                            title: 'Senior Living Communities',
                            image: 'https://images.pexels.com/photos/339620/pexels-photo-339620.jpeg?auto=compress&cs=tinysrgb&w=1200',
                            description: 'We focus on Independent Living, Assisted Living, and Memory Care in high demand markets.'
                        },
                        {
                            title: 'Other Commercial Investments',
                            image: 'https://images.pexels.com/photos/323705/pexels-photo-323705.jpeg?auto=compress&cs=tinysrgb&w=1200',
                            description: 'Mobile Home Parks, Self Storage, and Flex Industrial Spaces are considered when the numbers make sense.'
                        }
                    ]
                },
                strategy: {
                    title: 'Our 6-Step Investment Roadmap',
                    steps: [
                        { number: 1, title: 'Acquire at a Discount', description: 'Target off market or underperforming assets where value can be created.' },
                        { number: 2, title: 'Create Value', description: 'Renovate units and improve operations to increase NOI.' },
                        { number: 3, title: 'Partner with Experts', description: 'Work with experienced operators who have a proven record.' },
                        { number: 4, title: 'Stabilize Quickly', description: 'Lease to target occupancy and lock in efficient processes.' },
                        { number: 5, title: 'Refinance Early', description: 'Return capital when the property supports new financing.' },
                        { number: 6, title: 'Disciplined Exit', description: 'Sell based on data and market conditions to maximize returns.' }
                    ]
                },
                benefits: {
                    title: 'Why Invest With Us',
                    items: [
                        { title: 'Preferred Returns', description: 'Investors are paid first, ensuring your capital receives priority.' },
                        { title: 'Strong IRR Targets', description: 'Double digit internal rate of return targets and high equity multiples.' },
                        { title: 'Passive Income', description: 'Quarterly distributions once a property is stabilized.' },
                        { title: 'Tax Advantages', description: 'Depreciation and cost segregation benefits.' },
                        { title: 'Risk Mitigation', description: 'Conservative underwriting and proven operators.' },
                        { title: 'Real Impact', description: 'Better housing for families and dignified communities for seniors.' }
                    ]
                },
                resources: {
                    title: 'Resources',
                    subtitle: 'Investor 101: Essential terms and articles to grow your wealth knowledge.',
                    items: [
                        { title: 'What Is a Real Estate Syndication?', description: 'A real estate syndication allows multiple investors to pool resources and invest in large properties together.' },
                        { title: 'How Preferred Returns Work', description: 'Preferred returns give investors priority on returns up to a stated annual rate before profits are shared.' },
                        { title: 'Understanding GP and LP Roles', description: 'General Partners handle operations; Limited Partners contribute capital and earn passive income.' }
                    ],
                    downloadGuide: {
                        title: 'Real Assets. Real Returns.',
                        subtitle: 'How Commercial Real Estate Grows and Protects Wealth',
                        buttonText: 'Download Free Guide',
                        fileUrl: 'https://storage.googleapis.com/msgsndr/Out59Sg1pInehCQh9Rc8/media/68e691bf1d56c3e7a2dfe831.pdf'
                    },
                    blog: {
                        title: 'Latest Insights',
                        posts: [
                            { title: 'Why Senior Living is a Strong Investment', image: 'https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=800', description: 'Senior living communities meet an essential need with rising demand.' },
                            { title: 'The Value Add Playbook', image: 'https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg?auto=compress&cs=tinysrgb&w=800', description: 'How upgrades create wealth through smart improvements.' },
                            { title: 'How Refinancing Returns Capital', image: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=800', description: 'Providing liquidity while investors retain ownership.' }
                        ]
                    }
                },
                contact: {
                    title: 'Ready to Explore Passive Real Estate Investing?',
                    description: 'Join our list for early access to opportunities, market updates, and education, or schedule a time to talk with us directly.',
                    formUrl: 'https://orangedoorinvestmentgroup.com/investor-sign-up-basic-info-1',
                    backgroundImage: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920'
                },
                footer: {
                    copyright: '© 2025 Orange Door Investment Group. All rights reserved.',
                    tagline: 'Opening Doors to Smarter Real Estate Investments',
                    buttons: [
                        { text: 'Join Our Investor List', href: '#contact', type: 'primary' },
                        { text: 'Schedule a Call', href: 'https://link.orangedoorinvestmentgroup.com/widget/booking/zWhipZrTkrBoIlzY8i8G', type: 'secondary' }
                    ]
                }
            };

            await writeJSON(CONTENT_FILE, defaultContent);
            console.log('✅ Default content initialized');
        }
    } catch (err) {
        console.error('Error initializing content:', err);
    }
};

// API Routes

// Login route
app.post('/api/admin/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admins = await readJSON(ADMIN_FILE, []);
        const admin = admins.find(a => a.username === username);

        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValid = await bcrypt.compare(password, admin.password);

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin.id }, 'orangedoor_secret_key_2025', { expiresIn: '24h' });

        res.json({ token, message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all content
app.get('/api/content', async (req, res) => {
    try {
        const content = await readJSON(CONTENT_FILE, {});
        res.json(content);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get content by section
app.get('/api/content/:section', async (req, res) => {
    try {
        const content = await readJSON(CONTENT_FILE, {});
        const sectionData = content[req.params.section];

        if (!sectionData) {
            return res.status(404).json({ error: 'Section not found' });
        }

        res.json(sectionData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update content by section
app.put('/api/content/:section', async (req, res) => {
    try {
        const content = await readJSON(CONTENT_FILE, {});
        content[req.params.section] = req.body;
        await writeJSON(CONTENT_FILE, content);

        res.json({ message: 'Content updated successfully', data: req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Settings routes
app.get('/api/settings', async (req, res) => {
    try {
        const settings = await readJSON(SETTINGS_FILE, {});
        res.json(settings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/settings', async (req, res) => {
    try {
        await writeJSON(SETTINGS_FILE, req.body);
        res.json({ message: 'Settings updated successfully', data: req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Blog routes
app.get('/api/blog', async (req, res) => {
    try {
        const blog = await readJSON(BLOG_FILE, { posts: [] });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/blog/:slug', async (req, res) => {
    try {
        const blog = await readJSON(BLOG_FILE, { posts: [] });
        const post = blog.posts.find(p => p.slug === req.params.slug);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/blog', async (req, res) => {
    try {
        const blog = await readJSON(BLOG_FILE, { posts: [] });
        const newPost = {
            ...req.body,
            id: Date.now().toString(),
            slug: req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        blog.posts.push(newPost);
        await writeJSON(BLOG_FILE, blog);

        res.json({ message: 'Blog post created successfully', data: newPost });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/blog/:id', async (req, res) => {
    try {
        const blog = await readJSON(BLOG_FILE, { posts: [] });
        const index = blog.posts.findIndex(p => p.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({ error: 'Post not found' });
        }

        blog.posts[index] = {
            ...req.body,
            id: req.params.id,
            updatedAt: new Date().toISOString()
        };

        await writeJSON(BLOG_FILE, blog);

        res.json({ message: 'Blog post updated successfully', data: blog.posts[index] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/blog/:id', async (req, res) => {
    try {
        const blog = await readJSON(BLOG_FILE, { posts: [] });
        blog.posts = blog.posts.filter(p => p.id !== req.params.id);
        await writeJSON(BLOG_FILE, blog);

        res.json({ message: 'Blog post deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Image upload route
app.post('/api/upload', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileUrl = `/uploads/${req.file.filename}`;
        res.json({ url: fileUrl, filename: req.file.filename });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date(), storage: 'File-based JSON', version: '2.0' });
});

// Initialize and start server
const startServer = async () => {
    await ensureDataDir();
    await initializeAdmin();
    await initializeContent();
    await initializeSettings();
    await initializeBlog();

    app.listen(PORT, () => {
        console.log('✅ File-based storage initialized');
        console.log('✅ Enhanced features enabled');
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📊 Admin Panel: http://localhost:${PORT}/admin`);
        console.log(`💾 Data stored in: ${DATA_DIR}`);
    });
};

startServer().catch(err => {
    console.error('❌ Server startup error:', err);
    process.exit(1);
});
