// Script to load dynamic content from API
const API_URL = '/api';

// Function to safely update text content
function updateText(selector, value) {
    const el = document.querySelector(selector);
    if (el && value) el.textContent = value;
}

// Function to safely update attribute
function updateAttr(selector, attr, value) {
    const el = document.querySelector(selector);
    if (el && value) el.setAttribute(attr, value);
}

// Load all dynamic content
async function loadDynamicContent() {
    try {
        const response = await fetch(`${API_URL}/content`);
        const data = await response.json();

        // Update Navbar
        if (data.navbar) {
            updateAttr('.nav-logo', 'src', data.navbar.logo);
            updateText('.nav-brand-text', data.navbar.brandText);

            const navMenu = document.querySelector('.nav-menu');
            if (navMenu && data.navbar.links) {
                navMenu.innerHTML = data.navbar.links.map(link => {
                    // Check if it's an external link (not an anchor)
                    const isExternalLink = link.href && !link.href.startsWith('#');

                    if (isExternalLink) {
                        // External links - no label wrapper, add target="_blank"
                        return `<li><a href="${link.href}" target="_blank" rel="noopener">${link.text}</a></li>`;
                    } else {
                        // Anchor links - with label wrapper for mobile menu close
                        return `<li><label for="menu-checkbox"><a href="${link.href}">${link.text}</a></label></li>`;
                    }
                }).join('');
            }
        }

        // Update Hero
        if (data.hero) {
            updateText('.hero h1', data.hero.title);
            updateText('.hero p', data.hero.subtitle);
            updateAttr('.hero-background img', 'src', data.hero.backgroundImage);

            const heroCtas = document.querySelector('.hero-ctas');
            if (heroCtas && data.hero.buttons) {
                heroCtas.innerHTML = data.hero.buttons.map(btn =>
                    `<a href="${btn.href}" class="btn ${btn.type === 'primary' ? 'btn-primary' : 'btn-secondary'}">${btn.text}</a>`
                ).join('');
            }
        }

        // Update Highlights
        if (data.highlights && data.highlights.items) {
            const highlights = document.querySelector('.highlights');
            if (highlights) {
                highlights.innerHTML = data.highlights.items.map(item => `
                    <div class="highlight-card">
                        <div class="highlight-icon">${item.icon}</div>
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                    </div>
                `).join('');
            }
        }

        // Update About
        if (data.about) {
            updateText('.about-section .section-title', data.about.title);
            updateText('.about-content', data.about.content);

            const team = document.querySelector('.team');
            if (team && data.about.team) {
                team.innerHTML = data.about.team.map(member => `
                    <div class="team-member">
                        <div class="team-member-image">
                            <img src="${member.image}" alt="${member.name}">
                        </div>
                        <div class="team-member-content">
                            <h3>${member.name}</h3>
                            <div class="role">${member.role}</div>
                            <p>${member.bio}</p>
                        </div>
                    </div>
                `).join('');
            }

            // Update CTA section
            if (data.about.cta) {
                updateText('.about-cta h2', data.about.cta.title);
                const ctaContainer = document.querySelector('.about-cta');
                if (ctaContainer) {
                    // Update both paragraphs
                    const paragraphs = ctaContainer.querySelectorAll('p');
                    if (paragraphs[0]) paragraphs[0].textContent = data.about.cta.paragraph1;
                    if (paragraphs[1]) paragraphs[1].textContent = data.about.cta.paragraph2;

                    // Add buttons if they exist
                    if (data.about.cta.buttons) {
                        // Check if buttons container exists, if not create it
                        let buttonsContainer = ctaContainer.querySelector('.about-cta-buttons');
                        if (!buttonsContainer) {
                            buttonsContainer = document.createElement('div');
                            buttonsContainer.className = 'about-cta-buttons';
                            buttonsContainer.style.cssText = 'display: flex; gap: 16px; justify-content: center; margin-top: 30px; flex-wrap: wrap;';
                            ctaContainer.appendChild(buttonsContainer);
                        }
                        buttonsContainer.innerHTML = data.about.cta.buttons.map(btn =>
                            `<a href="${btn.href}" class="btn ${btn.type === 'primary' ? 'btn-primary' : 'btn-secondary-light'}">${btn.text}</a>`
                        ).join('');
                    }
                }
            }

            const logoGrid = document.querySelector('.logo-grid');
            if (logoGrid && data.about.partners) {
                logoGrid.innerHTML = data.about.partners.map(partner => `
                    <div class="partner-logo">
                        <img src="${partner.logo}" alt="${partner.name}">
                    </div>
                `).join('');
            }
        }

        // Update Focus
        if (data.focus) {
            updateText('.focus-section .section-title', data.focus.title);

            const focusAreas = document.querySelector('.focus-areas');
            if (focusAreas && data.focus.items) {
                focusAreas.innerHTML = data.focus.items.map(item => `
                    <div class="focus-item">
                        <div class="focus-image">
                            <img src="${item.image}" alt="${item.title}">
                        </div>
                        <h3>${item.title}</h3>
                        <div class="focus-description">${item.description}</div>
                    </div>
                `).join('');
            }
        }

        // Update Strategy/Roadmap
        if (data.strategy) {
            updateText('.strategy-section .section-title', data.strategy.title);

            const stepFlow = document.querySelector('.odig-step-flow');
            if (stepFlow && data.strategy.steps) {
                stepFlow.innerHTML = data.strategy.steps.map(step => `
                    <div class="odig-step-card">
                        <div class="odig-step-header">
                            <div class="odig-step-num">${step.number}</div>
                            <h3 class="odig-step-title">${step.title}</h3>
                        </div>
                        <p class="odig-step-desc">${step.description}</p>
                    </div>
                `).join('');
            }
        }

        // Update Benefits
        if (data.benefits) {
            updateText('.benefits-section .section-title', data.benefits.title);

            const benefitsGrid = document.querySelector('.benefits-grid');
            if (benefitsGrid && data.benefits.items) {
                benefitsGrid.innerHTML = data.benefits.items.map(item => `
                    <div class="benefit-card">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                    </div>
                `).join('');
            }
        }

        // Update Resources
        if (data.resources) {
            updateText('.resources-section .section-title', data.resources.title);
            updateText('.resources-section .section-subtitle', data.resources.subtitle);

            const resourcesGrid = document.querySelector('.resources-grid');
            if (resourcesGrid && data.resources.items) {
                resourcesGrid.innerHTML = data.resources.items.map(item => `
                    <div class="resource-card">
                        <h3>${item.title}</h3>
                        <p>${item.description}</p>
                    </div>
                `).join('');
            }

            // Update downloadable guides - Replace entire container if guides exist
            const guidesContainer = document.querySelector('.download-guides-container');
            if (guidesContainer && data.resources.downloadGuides && data.resources.downloadGuides.length > 0) {
                // Replace with dynamic guides from admin panel
                guidesContainer.innerHTML = data.resources.downloadGuides.map(guide => `
                    <div class="download-guide">
                        <h3>${guide.title || 'Download Our Guide'}</h3>
                        <p>${guide.subtitle || ''}</p>
                        <a href="${guide.fileUrl}" class="btn btn-primary"target="_blank" download>${guide.buttonText || 'Download Free Guide'}</a>
                    </div>
                `).join('');
            }
            // Otherwise keep the static fallback guide that's already in the HTML

            // Load blog posts from blog API
            try {
                const blogResponse = await fetch(`${API_URL}/blog`);
                const blogData = await blogResponse.json();

                const blogGrid = document.querySelector('.blog-grid');

                // Check if we have real blog posts with slugs
                const apiPosts = blogData.posts && blogData.posts.length > 0 ? blogData.posts.filter(p => p.slug) : [];

                if (blogGrid && apiPosts.length > 0) {
                    // Use API posts with links
                    blogGrid.innerHTML = apiPosts.slice(0, 3).map(post => `
                        <a href="/blog-post.html?slug=${post.slug}" class="blog-card">
                            <div class="blog-image">
                                <img src="${post.image || 'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg'}" alt="${post.title}">
                            </div>
                            <h3>${post.title}</h3>
                            <p>${post.excerpt || post.description || ''}</p>
                        </a>
                    `).join('');
                } else if (blogGrid && data.resources.blog && data.resources.blog.posts) {
                    // Fallback to static content (no links since no slugs)
                    blogGrid.innerHTML = data.resources.blog.posts.map(post => `
                        <div class="blog-card static-blog-card">
                            <div class="blog-image">
                                <img src="${post.image}" alt="${post.title}">
                            </div>
                            <h3>${post.title}</h3>
                            <p>${post.description}</p>
                        </div>
                    `).join('');
                }
            } catch (blogError) {
                console.log('Blog API not available, using static content');
                // Fallback to static content
                if (data.resources.blog) {
                    const blogGrid = document.querySelector('.blog-grid');
                    if (blogGrid && data.resources.blog.posts) {
                        blogGrid.innerHTML = data.resources.blog.posts.map(post => `
                            <div class="blog-card static-blog-card">
                                <div class="blog-image">
                                    <img src="${post.image}" alt="${post.title}">
                                </div>
                                <h3>${post.title}</h3>
                                <p>${post.description}</p>
                            </div>
                        `).join('');
                    }
                }
            }
        }

        // Update Contact
        if (data.contact) {
            updateText('.contact-section h2', data.contact.title);
            updateText('.contact-section > .container > p', data.contact.description);
            updateAttr('.contact-form-container iframe', 'src', data.contact.formUrl);

            const contactSection = document.querySelector('.contact-section');
            if (contactSection && data.contact.backgroundImage) {
                contactSection.style.backgroundImage = `url('${data.contact.backgroundImage}')`;
            }
        }

        // Update Footer
        if (data.footer) {
            updateText('.footer-tagline', data.footer.tagline);
            updateText('.footer-copyright', data.footer.copyright);

            // Social Links Icons mapping
            const socialIcons = {
                facebook: '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
                twitter: '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
                instagram: '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
                linkedin: '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
                youtube: '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
                tiktok: '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>',
                pinterest: '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>',
                email: '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>',
                custom: '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>'
            };

            // Render social links
            const footerSocial = document.querySelector('.footer-social');
            if (footerSocial && data.footer.socialLinks && data.footer.socialLinks.length > 0) {
                footerSocial.innerHTML = data.footer.socialLinks.map(social => {
                    const icon = social.icon || socialIcons[social.platform] || socialIcons.custom;
                    const isEmoji = icon.length <= 2;
                    const iconHtml = isEmoji ? `<span class="social-emoji">${icon}</span>` :
                        icon.startsWith('http') ? `<img src="${icon}" alt="${social.name}" class="social-icon-img">` :
                            icon;
                    return `<a href="${social.url}" class="social-link" target="_blank" rel="noopener" title="${social.name || social.platform}">${iconHtml}</a>`;
                }).join('');
            }

            const footerCta = document.querySelector('.footer-cta');
            if (footerCta && data.footer.buttons) {
                footerCta.innerHTML = data.footer.buttons.map(btn =>
                    `<a href="${btn.href}" class="btn ${btn.type === 'primary' ? 'btn-primary' : 'btn-secondary'}">${btn.text}</a>`
                ).join('');
            }
        }

        console.log('✅ Dynamic content loaded successfully');

        // Reinitialize scroll animations
        setTimeout(initScrollAnimations, 100);

    } catch (error) {
        console.error('Error loading dynamic content:', error);
    }
}

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.classList.add('odig-is-visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.highlight-card, .team-member, .odig-step-card, .benefit-card, .resource-card, .blog-card').forEach(el => {
        observer.observe(el);
    });
}

// Load content when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadDynamicContent);
} else {
    loadDynamicContent();
}

// Optional: Reload content every 30 seconds to pick up changes
// setInterval(loadDynamicContent, 30000);
