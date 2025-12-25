// Admin Panel JavaScript
const API_URL = '/api';
let currentSection = 'navbar';
let contentData = {};
let hasChanges = false;

// DOM Elements
const loginScreen = document.getElementById('loginScreen');
const adminDashboard = document.getElementById('adminDashboard');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const saveBtn = document.getElementById('saveBtn');
const previewBtn = document.getElementById('previewBtn');
const logoutBtn = document.getElementById('logoutBtn');
const contentBody = document.getElementById('contentBody');
const sectionTitle = document.getElementById('sectionTitle');
const successToast = document.getElementById('successToast');
const navItems = document.querySelectorAll('.nav-item');

// Check if already logged in
const token = localStorage.getItem('adminToken');
if (token) {
    showDashboard();
}

// Login Form Submit
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_URL}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('adminToken', data.token);
            showDashboard();
        } else {
            showError(data.error || 'Invalid credentials');
        }
    } catch (error) {
        showError('Connection error. Please try again.');
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    if (hasChanges && !confirm('You have unsaved changes. Are you sure you want to logout?')) {
        return;
    }
    localStorage.removeItem('adminToken');
    location.reload();
});

// Navigation
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        const section = item.dataset.section;

        // Only handle section navigation, not external links
        if (!section) {
            return; // Allow normal link behavior for non-section links
        }

        e.preventDefault();
        if (hasChanges && !confirm('You have unsaved changes. Continue without saving?')) {
            return;
        }
        switchSection(section);
    });
});

// Save Changes
saveBtn.addEventListener('click', async () => {
    try {
        const formData = collectFormData();
        await updateContent(currentSection, formData);
        hasChanges = false;
        saveBtn.disabled = true;
        showToast();
    } catch (error) {
        alert('Error saving changes: ' + error.message);
    }
});

// Preview
previewBtn.addEventListener('click', () => {
    window.open('/', '_blank');
});

// Functions
function showDashboard() {
    loginScreen.style.display = 'none';
    adminDashboard.style.display = 'grid';
    loadAllContent();
}

function showError(message) {
    loginError.textContent = message;
    loginError.classList.add('show');
    setTimeout(() => loginError.classList.remove('show'), 3000);
}

function showToast() {
    successToast.classList.add('show');
    setTimeout(() => successToast.classList.remove('show'), 3000);
}

async function loadAllContent() {
    try {
        const response = await fetch(`${API_URL}/content`);
        contentData = await response.json();
        renderSection(currentSection);
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

async function updateContent(section, data) {
    const response = await fetch(`${API_URL}/content/${section}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!response.ok) throw new Error('Failed to save');

    contentData[section] = data;
}

function switchSection(section) {
    currentSection = section;
    navItems.forEach(item => item.classList.remove('active'));
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    renderSection(section);
    hasChanges = false;
    saveBtn.disabled = true;
}

function enableSave() {
    hasChanges = true;
    saveBtn.disabled = false;
}

function renderSection(section) {
    const titles = {
        navbar: 'Navbar Settings',
        hero: 'Hero Section',
        highlights: 'Highlights',
        about: 'About Section',
        focus: 'Focus Areas',
        strategy: 'Strategy Roadmap',
        benefits: 'Benefits',
        resources: 'Resources',
        contact: 'Contact Section',
        footer: 'Footer Settings'
    };

    sectionTitle.textContent = titles[section];
    const data = contentData[section] || {};

    switch (section) {
        case 'navbar':
            renderNavbar(data);
            break;
        case 'hero':
            renderHero(data);
            break;
        case 'highlights':
            renderHighlights(data);
            break;
        case 'about':
            renderAbout(data);
            break;
        case 'focus':
            renderFocus(data);
            break;
        case 'strategy':
            renderStrategy(data);
            break;
        case 'benefits':
            renderBenefits(data);
            break;
        case 'resources':
            renderResources(data);
            break;
        case 'contact':
            renderContact(data);
            break;
        case 'footer':
            renderFooter(data);
            break;
    }

    // Attach change listeners
    setTimeout(() => {
        attachChangeListeners();
    }, 100);
}

function attachChangeListeners() {
    const inputs = contentBody.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', enableSave);
    });
}

function collectFormData() {
    switch (currentSection) {
        case 'navbar':
            return collectNavbarData();
        case 'hero':
            return collectHeroData();
        case 'highlights':
            return collectHighlightsData();
        case 'about':
            return collectAboutData();
        case 'focus':
            return collectFocusData();
        case 'strategy':
            return collectStrategyData();
        case 'benefits':
            return collectBenefitsData();
        case 'resources':
            return collectResourcesData();
        case 'contact':
            return collectContactData();
        case 'footer':
            return collectFooterData();
    }
}

// Render Functions
function renderNavbar(data) {
    contentBody.innerHTML = `
        <div class="form-section">
            <h2>Brand Settings</h2>
            <div class="form-row">
                <div class="form-field">
                    <label>Logo URL</label>
                    <input type="url" id="logo" value="${data.logo || ''}" placeholder="https://...">
                </div>
                <div class="form-field">
                    <label>Brand Text</label>
                    <input type="text" id="brandText" value="${data.brandText || ''}" placeholder="Orange Door Investment Group">
                </div>
            </div>
        </div>

        <div class="form-section">
            <h2>Navigation Links</h2>
            <div id="navLinks" class="dynamic-items">
                ${(data.links || []).map((link, i) => `
                    <div class="dynamic-item">
                        <div class="item-header">
                            <div class="item-number">${i + 1}</div>
                            <button class="btn-remove" onclick="removeNavLink(${i})">Remove</button>
                        </div>
                        <div class="form-row">
                            <div class="form-field">
                                <label>Link Text</label>
                                <input type="text" class="navLinkText" value="${link.text}" placeholder="About">
                            </div>
                            <div class="form-field">
                                <label>Link URL</label>
                                <input type="text" class="navLinkHref" value="${link.href}" placeholder="#about">
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="btn-add" onclick="addNavLink()">+ Add Navigation Link</button>
        </div>
    `;
}

function renderHero(data) {
    contentBody.innerHTML = `
        <div class="form-section">
            <h2>Hero Content</h2>
            <div class="form-field">
                <label>Main Heading</label>
                <textarea id="heroTitle" rows="2">${data.title || ''}</textarea>
            </div>
            <div class="form-field">
                <label>Subtitle</label>
                <textarea id="heroSubtitle" rows="3">${data.subtitle || ''}</textarea>
            </div>
            <div class="form-field">
                <label>Background Image URL</label>
                <input type="url" id="heroBg" value="${data.backgroundImage || ''}" placeholder="https://...">
            </div>
        </div>

        <div class="form-section">
            <h2>Hero Buttons</h2>
            <div id="heroButtons" class="dynamic-items">
                ${(data.buttons || []).map((btn, i) => `
                    <div class="dynamic-item">
                        <div class="item-header">
                            <div class="item-number">${i + 1}</div>
                            <button class="btn-remove" onclick="removeHeroButton(${i})">Remove</button>
                        </div>
                        <div class="form-row">
                            <div class="form-field">
                                <label>Button Text</label>
                                <input type="text" class="heroBtnText" value="${btn.text}">
                            </div>
                            <div class="form-field">
                                <label>Button URL</label>
                                <input type="text" class="heroBtnHref" value="${btn.href}">
                            </div>
                            <div class="form-field">
                                <label>Button Type</label>
                                <select class="heroBtnType">
                                    <option value="primary" ${btn.type === 'primary' ? 'selected' : ''}>Primary (Orange)</option>
                                    <option value="secondary" ${btn.type === 'secondary' ? 'selected' : ''}>Secondary (Outline)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="btn-add" onclick="addHeroButton()">+ Add Button</button>
        </div>
    `;
}

function renderHighlights(data) {
    contentBody.innerHTML = `
        <div class="form-section">
            <h2>Highlight Cards</h2>
            <div id="highlights" class="dynamic-items">
                ${(data.items || []).map((item, i) => `
                    <div class="dynamic-item">
                        <div class="item-header">
                            <div class="item-number">${i + 1}</div>
                            <button class="btn-remove" onclick="removeHighlight(${i})">Remove</button>
                        </div>
                        <div class="form-row">
                            <div class="form-field">
                                <label>Icon (Emoji)</label>
                                <input type="text" class="highlightIcon" value="${item.icon}" placeholder="💰">
                            </div>
                            <div class="form-field">
                                <label>Title</label>
                                <input type="text" class="highlightTitle" value="${item.title}">
                            </div>
                        </div>
                        <div class="form-field">
                            <label>Description</label>
                            <textarea class="highlightDesc" rows="3">${item.description}</textarea>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="btn-add" onclick="addHighlight()">+ Add Highlight</button>
        </div>
    `;
}

function renderAbout(data) {
    contentBody.innerHTML = `
        <div class="form-section">
            <h2>About Content</h2>
            <div class="form-field">
                <label>Section Title</label>
                <input type="text" id="aboutTitle" value="${data.title || ''}">
            </div>
            <div class="form-field">
                <label>Main Content</label>
                <textarea id="aboutContent" rows="4">${data.content || ''}</textarea>
            </div>
        </div>

        <div class="form-section">
            <h2>Team Members</h2>
            <div id="teamMembers" class="dynamic-items">
                ${(data.team || []).map((member, i) => `
                    <div class="dynamic-item">
                        <div class="item-header">
                            <div class="item-number">${i + 1}</div>
                            <button class="btn-remove" onclick="removeTeamMember(${i})">Remove</button>
                        </div>
                        <div class="form-row">
                            <div class="form-field">
                                <label>Name</label>
                                <input type="text" class="teamName" value="${member.name}">
                            </div>
                            <div class="form-field">
                                <label>Role</label>
                                <input type="text" class="teamRole" value="${member.role}">
                            </div>
                        </div>
                        <div class="form-field">
                            <label>Image URL</label>
                            <input type="url" class="teamImage" value="${member.image}">
                        </div>
                        <div class="form-field">
                            <label>Bio</label>
                            <textarea class="teamBio" rows="3">${member.bio}</textarea>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="btn-add" onclick="addTeamMember()">+ Add Team Member</button>
        </div>

        <div class="form-section">
            <h2>CTA Section - "Let's Build Something Lasting"</h2>
            <div class="form-field">
                <label>CTA Title</label>
                <input type="text" id="ctaTitle" value="${data.cta?.title || "Let's Build Something Lasting"}">
            </div>
            <div class="form-field">
                <label>Paragraph 1</label>
                <textarea id="ctaParagraph1" rows="4">${data.cta?.paragraph1 || ''}</textarea>
            </div>
            <div class="form-field">
                <label>Paragraph 2</label>
                <textarea id="ctaParagraph2" rows="3">${data.cta?.paragraph2 || ''}</textarea>
            </div>
        </div>

        <div class="form-section">
            <h2>Partner Logos</h2>
            <div id="partners" class="dynamic-items">
                ${(data.partners || []).map((partner, i) => `
                    <div class="dynamic-item">
                        <div class="item-header">
                            <div class="item-number">${i + 1}</div>
                            <button class="btn-remove" onclick="removePartner(${i})">Remove</button>
                        </div>
                        <div class="form-row">
                            <div class="form-field">
                                <label>Partner Name</label>
                                <input type="text" class="partnerName" value="${partner.name}">
                            </div>
                            <div class="form-field">
                                <label>Logo URL</label>
                                <input type="url" class="partnerLogo" value="${partner.logo}">
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="btn-add" onclick="addPartner()">+ Add Partner</button>
        </div>
    `;
}

function renderFocus(data) {
    contentBody.innerHTML = `
        <div class="form-section">
            <h2>Focus Section</h2>
            <div class="form-field">
                <label>Section Title</label>
                <input type="text" id="focusTitle" value="${data.title || ''}">
            </div>
        </div>

        <div class="form-section">
            <h2>Focus Items</h2>
            <div id="focusItems" class="dynamic-items">
                ${(data.items || []).map((item, i) => `
                    <div class="dynamic-item">
                        <div class="item-header">
                            <div class="item-number">${i + 1}</div>
                            <button class="btn-remove" onclick="removeFocusItem(${i})">Remove</button>
                        </div>
                        <div class="form-field">
                            <label>Title</label>
                            <input type="text" class="focusTitle" value="${item.title}">
                        </div>
                        <div class="form-field">
                            <label>Image URL</label>
                            <input type="url" class="focusImage" value="${item.image}">
                        </div>
                        <div class="form-field">
                            <label>Description</label>
                            <textarea class="focusDesc" rows="3">${item.description}</textarea>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="btn-add" onclick="addFocusItem()">+ Add Focus Item</button>
        </div>
    `;
}

function renderStrategy(data) {
    contentBody.innerHTML = `
        <div class="form-section">
            <h2>Strategy Section</h2>
            <div class="form-field">
                <label>Section Title</label>
                <input type="text" id="strategyTitle" value="${data.title || ''}">
            </div>
        </div>

        <div class="form-section">
            <h2>Roadmap Steps</h2>
            <div id="strategySteps" class="dynamic-items">
                ${(data.steps || []).map((step, i) => `
                    <div class="dynamic-item">
                        <div class="item-header">
                            <div class="item-number">${step.number}</div>
                            <button class="btn-remove" onclick="removeStrategyStep(${i})">Remove</button>
                        </div>
                        <div class="form-row">
                            <div class="form-field">
                                <label>Step Number</label>
                                <input type="number" class="stepNumber" value="${step.number}" min="1">
                            </div>
                            <div class="form-field">
                                <label>Step Title</label>
                                <input type="text" class="stepTitle" value="${step.title}">
                            </div>
                        </div>
                        <div class="form-field">
                            <label>Description</label>
                            <textarea class="stepDesc" rows="2">${step.description}</textarea>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="btn-add" onclick="addStrategyStep()">+ Add Step</button>
        </div>
    `;
}

function renderBenefits(data) {
    contentBody.innerHTML = `
        <div class="form-section">
            <h2>Benefits Section</h2>
            <div class="form-field">
                <label>Section Title</label>
                <input type="text" id="benefitsTitle" value="${data.title || ''}">
            </div>
        </div>

        <div class="form-section">
            <h2>Benefit Cards</h2>
            <div id="benefits" class="dynamic-items">
                ${(data.items || []).map((item, i) => `
                    <div class="dynamic-item">
                        <div class="item-header">
                            <div class="item-number">${i + 1}</div>
                            <button class="btn-remove" onclick="removeBenefit(${i})">Remove</button>
                        </div>
                        <div class="form-field">
                            <label>Title</label>
                            <input type="text" class="benefitTitle" value="${item.title}">
                        </div>
                        <div class="form-field">
                            <label>Description</label>
                            <textarea class="benefitDesc" rows="3">${item.description}</textarea>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="btn-add" onclick="addBenefit()">+ Add Benefit</button>
        </div>
    `;
}

function renderResources(data) {
    contentBody.innerHTML = `
        <div class="form-section">
            <h2>Resources Section</h2>
            <div class="form-field">
                <label>Section Title</label>
                <input type="text" id="resourcesTitle" value="${data.title || ''}">
            </div>
            <div class="form-field">
                <label>Subtitle</label>
                <input type="text" id="resourcesSubtitle" value="${data.subtitle || ''}">
            </div>
        </div>

        <div class="form-section">
            <h2>Resource Items</h2>
            <div id="resourceItems" class="dynamic-items">
                ${(data.items || []).map((item, i) => `
                    <div class="dynamic-item">
                        <div class="item-header">
                            <div class="item-number">${i + 1}</div>
                            <button class="btn-remove" onclick="removeResourceItem(${i})">Remove</button>
                        </div>
                        <div class="form-field">
                            <label>Title</label>
                            <input type="text" class="resourceTitle" value="${item.title}">
                        </div>
                        <div class="form-field">
                            <label>Description</label>
                            <textarea class="resourceDesc" rows="3">${item.description}</textarea>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="btn-add" onclick="addResourceItem()">+ Add Resource</button>
        </div>

        <div class="form-section">
            <h2>Download Guide</h2>
            <div class="form-row">
                <div class="form-field">
                    <label>Guide Title</label>
                    <input type="text" id="guideTitle" value="${data.downloadGuide?.title || ''}">
                </div>
                <div class="form-field">
                    <label>Guide Subtitle</label>
                    <input type="text" id="guideSubtitle" value="${data.downloadGuide?.subtitle || ''}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-field">
                    <label>Button Text</label>
                    <input type="text" id="guideButtonText" value="${data.downloadGuide?.buttonText || ''}">
                </div>
                <div class="form-field">
                    <label>File URL</label>
                    <input type="url" id="guideFileUrl" value="${data.downloadGuide?.fileUrl || ''}">
                </div>
            </div>
        </div>

        <div class="form-section">
            <h2>Blog Section</h2>
            <div class="form-field">
                <label>Blog Title</label>
                <input type="text" id="blogTitle" value="${data.blog?.title || ''}">
            </div>
            <div id="blogPosts" class="dynamic-items">
                ${(data.blog?.posts || []).map((post, i) => `
                    <div class="dynamic-item">
                        <div class="item-header">
                            <div class="item-number">${i + 1}</div>
                            <button class="btn-remove" onclick="removeBlogPost(${i})">Remove</button>
                        </div>
                        <div class="form-field">
                            <label>Post Title</label>
                            <input type="text" class="blogPostTitle" value="${post.title}">
                        </div>
                        <div class="form-field">
                            <label>Image URL</label>
                            <input type="url" class="blogPostImage" value="${post.image}">
                        </div>
                        <div class="form-field">
                            <label>Description</label>
                            <textarea class="blogPostDesc" rows="2">${post.description}</textarea>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="btn-add" onclick="addBlogPost()">+ Add Blog Post</button>
        </div>
    `;
}

function renderContact(data) {
    contentBody.innerHTML = `
        <div class="form-section">
            <h2>Contact Section</h2>
            <div class="form-field">
                <label>Section Title</label>
                <input type="text" id="contactTitle" value="${data.title || ''}">
            </div>
            <div class="form-field">
                <label>Description</label>
                <textarea id="contactDesc" rows="3">${data.description || ''}</textarea>
            </div>
            <div class="form-field">
                <label>Form Embed URL</label>
                <input type="url" id="contactFormUrl" value="${data.formUrl || ''}">
            </div>
            <div class="form-field">
                <label>Background Image URL</label>
                <input type="url" id="contactBg" value="${data.backgroundImage || ''}">
            </div>
        </div>
    `;
}

function renderFooter(data) {
    contentBody.innerHTML = `
        <div class="form-section">
            <h2>Footer Content</h2>
            <div class="form-field">
                <label>Copyright Text</label>
                <input type="text" id="footerCopyright" value="${data.copyright || ''}">
            </div>
            <div class="form-field">
                <label>Tagline</label>
                <input type="text" id="footerTagline" value="${data.tagline || ''}">
            </div>
        </div>

        <div class="form-section">
            <h2>Footer Buttons</h2>
            <div id="footerButtons" class="dynamic-items">
                ${(data.buttons || []).map((btn, i) => `
                    <div class="dynamic-item">
                        <div class="item-header">
                            <div class="item-number">${i + 1}</div>
                            <button class="btn-remove" onclick="removeFooterButton(${i})">Remove</button>
                        </div>
                        <div class="form-row">
                            <div class="form-field">
                                <label>Button Text</label>
                                <input type="text" class="footerBtnText" value="${btn.text}">
                            </div>
                            <div class="form-field">
                                <label>Button URL</label>
                                <input type="text" class="footerBtnHref" value="${btn.href}">
                            </div>
                            <div class="form-field">
                                <label>Button Type</label>
                                <select class="footerBtnType">
                                    <option value="primary" ${btn.type === 'primary' ? 'selected' : ''}>Primary</option>
                                    <option value="secondary" ${btn.type === 'secondary' ? 'selected' : ''}>Secondary</option>
                                </select>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <button class="btn-add" onclick="addFooterButton()">+ Add Button</button>
        </div>
    `;
}

// Collect Functions (Part 1 - will continue in next message)
function collectNavbarData() {
    return {
        logo: document.getElementById('logo').value,
        brandText: document.getElementById('brandText').value,
        links: Array.from(document.querySelectorAll('.navLinkText')).map((el, i) => ({
            text: el.value,
            href: document.querySelectorAll('.navLinkHref')[i].value
        }))
    };
}

function collectHeroData() {
    return {
        title: document.getElementById('heroTitle').value,
        subtitle: document.getElementById('heroSubtitle').value,
        backgroundImage: document.getElementById('heroBg').value,
        buttons: Array.from(document.querySelectorAll('.heroBtnText')).map((el, i) => ({
            text: el.value,
            href: document.querySelectorAll('.heroBtnHref')[i].value,
            type: document.querySelectorAll('.heroBtnType')[i].value
        }))
    };
}

function collectHighlightsData() {
    return {
        items: Array.from(document.querySelectorAll('.highlightIcon')).map((el, i) => ({
            icon: el.value,
            title: document.querySelectorAll('.highlightTitle')[i].value,
            description: document.querySelectorAll('.highlightDesc')[i].value
        }))
    };
}

function collectAboutData() {
    return {
        title: document.getElementById('aboutTitle').value,
        content: document.getElementById('aboutContent').value,
        team: Array.from(document.querySelectorAll('.teamName')).map((el, i) => ({
            name: el.value,
            role: document.querySelectorAll('.teamRole')[i].value,
            image: document.querySelectorAll('.teamImage')[i].value,
            bio: document.querySelectorAll('.teamBio')[i].value
        })),
        cta: {
            title: document.getElementById('ctaTitle').value,
            paragraph1: document.getElementById('ctaParagraph1').value,
            paragraph2: document.getElementById('ctaParagraph2').value
        },
        partners: Array.from(document.querySelectorAll('.partnerName')).map((el, i) => ({
            name: el.value,
            logo: document.querySelectorAll('.partnerLogo')[i].value
        }))
    };
}

function collectFocusData() {
    return {
        title: document.getElementById('focusTitle').value,
        items: Array.from(document.querySelectorAll('.focusTitle')).map((el, i) => ({
            title: el.value,
            image: document.querySelectorAll('.focusImage')[i].value,
            description: document.querySelectorAll('.focusDesc')[i].value
        }))
    };
}

function collectStrategyData() {
    return {
        title: document.getElementById('strategyTitle').value,
        steps: Array.from(document.querySelectorAll('.stepNumber')).map((el, i) => ({
            number: parseInt(el.value),
            title: document.querySelectorAll('.stepTitle')[i].value,
            description: document.querySelectorAll('.stepDesc')[i].value
        }))
    };
}

function collectBenefitsData() {
    return {
        title: document.getElementById('benefitsTitle').value,
        items: Array.from(document.querySelectorAll('.benefitTitle')).map((el, i) => ({
            title: el.value,
            description: document.querySelectorAll('.benefitDesc')[i].value
        }))
    };
}

function collectResourcesData() {
    return {
        title: document.getElementById('resourcesTitle').value,
        subtitle: document.getElementById('resourcesSubtitle').value,
        items: Array.from(document.querySelectorAll('.resourceTitle')).map((el, i) => ({
            title: el.value,
            description: document.querySelectorAll('.resourceDesc')[i].value
        })),
        downloadGuide: {
            title: document.getElementById('guideTitle').value,
            subtitle: document.getElementById('guideSubtitle').value,
            buttonText: document.getElementById('guideButtonText').value,
            fileUrl: document.getElementById('guideFileUrl').value
        },
        blog: {
            title: document.getElementById('blogTitle').value,
            posts: Array.from(document.querySelectorAll('.blogPostTitle')).map((el, i) => ({
                title: el.value,
                image: document.querySelectorAll('.blogPostImage')[i].value,
                description: document.querySelectorAll('.blogPostDesc')[i].value
            }))
        }
    };
}

function collectContactData() {
    return {
        title: document.getElementById('contactTitle').value,
        description: document.getElementById('contactDesc').value,
        formUrl: document.getElementById('contactFormUrl').value,
        backgroundImage: document.getElementById('contactBg').value
    };
}

function collectFooterData() {
    return {
        copyright: document.getElementById('footerCopyright').value,
        tagline: document.getElementById('footerTagline').value,
        buttons: Array.from(document.querySelectorAll('.footerBtnText')).map((el, i) => ({
            text: el.value,
            href: document.querySelectorAll('.footerBtnHref')[i].value,
            type: document.querySelectorAll('.footerBtnType')[i].value
        }))
    };
}

// Add/Remove item functions
function removeNavLink(index) {
    const data = contentData.navbar;
    data.links.splice(index, 1);
    renderNavbar(data);
    enableSave();
}

function addNavLink() {
    const data = contentData.navbar;
    data.links = data.links || [];
    data.links.push({ text: '', href: '#' });
    renderNavbar(data);
    enableSave();
}

function removeHeroButton(index) {
    const data = contentData.hero;
    data.buttons.splice(index, 1);
    renderHero(data);
    enableSave();
}

function addHeroButton() {
    const data = contentData.hero;
    data.buttons = data.buttons || [];
    data.buttons.push({ text: '', href: '#', type: 'primary' });
    renderHero(data);
    enableSave();
}

function removeHighlight(index) {
    const data = contentData.highlights;
    data.items.splice(index, 1);
    renderHighlights(data);
    enableSave();
}

function addHighlight() {
    const data = contentData.highlights;
    data.items = data.items || [];
    data.items.push({ icon: '✨', title: '', description: '' });
    renderHighlights(data);
    enableSave();
}

function removeTeamMember(index) {
    const data = contentData.about;
    data.team.splice(index, 1);
    renderAbout(data);
    enableSave();
}

function addTeamMember() {
    const data = contentData.about;
    data.team = data.team || [];
    data.team.push({ name: '', role: '', image: '', bio: '' });
    renderAbout(data);
    enableSave();
}

function removePartner(index) {
    const data = contentData.about;
    data.partners.splice(index, 1);
    renderAbout(data);
    enableSave();
}

function addPartner() {
    const data = contentData.about;
    data.partners = data.partners || [];
    data.partners.push({ name: '', logo: '' });
    renderAbout(data);
    enableSave();
}

function removeFocusItem(index) {
    const data = contentData.focus;
    data.items.splice(index, 1);
    renderFocus(data);
    enableSave();
}

function addFocusItem() {
    const data = contentData.focus;
    data.items = data.items || [];
    data.items.push({ title: '', image: '', description: '' });
    renderFocus(data);
    enableSave();
}

function removeStrategyStep(index) {
    const data = contentData.strategy;
    data.steps.splice(index, 1);
    renderStrategy(data);
    enableSave();
}

function addStrategyStep() {
    const data = contentData.strategy;
    data.steps = data.steps || [];
    const nextNum = data.steps.length + 1;
    data.steps.push({ number: nextNum, title: '', description: '' });
    renderStrategy(data);
    enableSave();
}

function removeBenefit(index) {
    const data = contentData.benefits;
    data.items.splice(index, 1);
    renderBenefits(data);
    enableSave();
}

function addBenefit() {
    const data = contentData.benefits;
    data.items = data.items || [];
    data.items.push({ title: '', description: '' });
    renderBenefits(data);
    enableSave();
}

function removeResourceItem(index) {
    const data = contentData.resources;
    data.items.splice(index, 1);
    renderResources(data);
    enableSave();
}

function addResourceItem() {
    const data = contentData.resources;
    data.items = data.items || [];
    data.items.push({ title: '', description: '' });
    renderResources(data);
    enableSave();
}

function removeBlogPost(index) {
    const data = contentData.resources;
    data.blog.posts.splice(index, 1);
    renderResources(data);
    enableSave();
}

function addBlogPost() {
    const data = contentData.resources;
    data.blog = data.blog || { title: '', posts: [] };
    data.blog.posts.push({ title: '', image: '', description: '' });
    renderResources(data);
    enableSave();
}

function removeFooterButton(index) {
    const data = contentData.footer;
    data.buttons.splice(index, 1);
    renderFooter(data);
    enableSave();
}

function addFooterButton() {
    const data = contentData.footer;
    data.buttons = data.buttons || [];
    data.buttons.push({ text: '', href: '#', type: 'primary' });
    renderFooter(data);
    enableSave();
}
