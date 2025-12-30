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
                navMenu.innerHTML = data.navbar.links.map(link =>
                    `<li><label for="menu-checkbox"><a href="${link.href}">${link.text}</a></label></li>`
                ).join('');
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
