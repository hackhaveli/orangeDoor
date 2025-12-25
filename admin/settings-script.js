// Settings Management Script
const API_URL = '/api';
let settings = {};
let hasChanges = false;

// Color definitions
const colorDefinitions = [
    { key: 'primary', label: 'Primary Color', description: 'Main brand color (buttons, highlights)' },
    { key: 'primaryDark', label: 'Primary Dark', description: 'Darker shade of primary' },
    { key: 'secondary', label: 'Secondary Color', description: 'Accent color' },
    { key: 'secondaryDark', label: 'Secondary Dark', description: 'Darker shade of secondary' },
    { key: 'charcoal', label: 'Text Color', description: 'Main text color' },
    { key: 'lightGray', label: 'Background Gray', description: 'Light background color' },
    { key: 'white', label: 'White', description: 'White color for backgrounds' }
];

// Typography definitions
const typographyDefinitions = [
    { key: 'headingFont', label: 'Heading Font', type: 'select', options: ['Montserrat', 'Roboto', 'Poppins', 'Playfair Display', 'Merriweather'] },
    { key: 'bodyFont', label: 'Body Font', type: 'select', options: ['Open Sans', 'Roboto', 'Lato', 'Source Sans Pro', 'Nunito'] },
    { key: 'h1Size', label: 'H1 Size', type: 'range', min: 32, max: 120, unit: 'px' },
    { key: 'h2Size', label: 'H2 Size', type: 'range', min: 24, max: 80, unit: 'px' },
    { key: 'h3Size', label: 'H3 Size', type: 'range', min: 18, max: 48, unit: 'px' },
    { key: 'bodySize', label: 'Body Size', type: 'range', min: 12, max: 24, unit: 'px' },
    { key: 'lineHeight', label: 'Line Height', type: 'range', min: 1.2, max: 2.5, step: 0.1, unit: '' }
];

// Theme presets
const themePresets = [
    {
        name: 'Default',
        colors: {
            primary: '#F6A86D',
            primaryDark: '#f59a52',
            secondary: '#5F8B9B',
            secondaryDark: '#527a89',
            charcoal: '#333333',
            lightGray: '#F5F5F5',
            white: '#FFFFFF'
        }
    },
    {
        name: 'Ocean Blue',
        colors: {
            primary: '#3B82F6',
            primaryDark: '#2563EB',
            secondary: '#06B6D4',
            secondaryDark: '#0891B2',
            charcoal: '#1E293B',
            lightGray: '#F1F5F9',
            white: '#FFFFFF'
        }
    },
    {
        name: 'Forest Green',
        colors: {
            primary: '#10B981',
            primaryDark: '#059669',
            secondary: '#34D399',
            secondaryDark: '#10B981',
            charcoal: '#064E3B',
            lightGray: '#ECFDF5',
            white: '#FFFFFF'
        }
    },
    {
        name: 'Royal Purple',
        colors: {
            primary: '#8B5CF6',
            primaryDark: '#7C3AED',
            secondary: '#A78BFA',
            secondaryDark: '#8B5CF6',
            charcoal: '#4C1D95',
            lightGray: '#F5F3FF',
            white: '#FFFFFF'
        }
    }
];

// Section names
const sectionNames = {
    navbar: 'Navigation Bar',
    hero: 'Hero Section',
    highlights: 'Highlights',
    about: 'About Us',
    focus: 'Focus Areas',
    strategy: 'Strategy Roadmap',
    benefits: 'Benefits',
    resources: 'Resources',
    contact: 'Contact',
    footer: 'Footer'
};

// Load settings on page load
window.addEventListener('DOMContentLoaded', loadSettings);

// Tab switching
document.querySelectorAll('.settings-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        switchTab(tabName);
    });
});

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

async function loadSettings() {
    try {
        const response = await fetch(`${API_URL}/settings`);
        settings = await response.json();

        renderThemePresets();
        renderColorGrid();
        renderTypographyGrid();
        renderSectionList();
        renderAdvanced();

        console.log('✅ Settings loaded');
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

function renderThemePresets() {
    const container = document.getElementById('themePresets');
    container.innerHTML = themePresets.map((theme, index) => `
        <div class="theme-card" onclick="applyTheme(${index})">
            <div class="theme-preview">
                <div class="theme-color" style="background: ${theme.colors.primary}"></div>
                <div class="theme-color" style="background: ${theme.colors.secondary}"></div>
                <div class="theme-color" style="background: ${theme.colors.charcoal}"></div>
            </div>
            <div class="theme-name">${theme.name}</div>
        </div>
    `).join('');
}

function applyTheme(index) {
    const theme = themePresets[index];
    settings.colors = { ...settings.colors, ...theme.colors };
    renderColorGrid();
    markChanged();
    showToast(`${theme.name} theme applied!`);
}

function renderColorGrid() {
    const container = document.getElementById('colorGrid');
    container.innerHTML = colorDefinitions.map(def => {
        const color = settings.colors[def.key] || '#000000';
        return `
            <div class="color-field">
                <label>${def.label}</label>
                <div style="color: var(--text-secondary); font-size: 12px; margin-bottom: 8px;">${def.description}</div>
                <div class="color-input-wrapper">
                    <div class="color-preview" style="background: ${color}" onclick="document.getElementById('${def.key}-picker').click()"></div>
                    <input type="color" id="${def.key}-picker" value="${color}" onchange="updateColor('${def.key}', this.value)">
                    <input type="text" class="color-input form-field input" value="${color}" onchange="updateColor('${def.key}', this.value)" style="padding: 12px; background: var(--darker-bg); border: 2px solid var(--border-color); border-radius: 8px; color: var(--text-primary);">
                </div>
            </div>
        `;
    }).join('');
}

function updateColor(key, value) {
    settings.colors[key] = value;
    renderColorGrid();
    markChanged();
}

function renderTypographyGrid() {
    const container = document.getElementById('typographyGrid');
    container.innerHTML = typographyDefinitions.map(def => {
        const value = settings.typography[def.key];

        if (def.type === 'select') {
            return `
                <div class="font-control">
                    <label>${def.label}</label>
                    <select class="font-select" onchange="updateTypography('${def.key}', this.value)">
                        ${def.options.map(opt => `<option value="${opt}" ${value === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                    </select>
                </div>
            `;
        } else if (def.type === 'range') {
            const numValue = parseFloat(value);
            return `
                <div class="font-control">
                    <label>${def.label}: <span class="slider-value">${value}</span></label>
                    <input type="range" class="size-slider" 
                           min="${def.min}" 
                           max="${def.max}" 
                           step="${def.step || 1}"
                           value="${numValue}" 
                           oninput="updateTypography('${def.key}', this.value + '${def.unit}')"
                           onchange="updateTypography('${def.key}', this.value + '${def.unit}')">
                </div>
            `;
        }
    }).join('');
}

function updateTypography(key, value) {
    settings.typography[key] = value;
    renderTypographyGrid();
    markChanged();
}

function renderSectionList() {
    const container = document.getElementById('sectionList');
    container.innerHTML = settings.sectionOrder.map((section, index) => {
        const isVisible = settings.sectionVisibility[section];
        const spacing = settings.sectionSpacing[section] || '0px';

        return `
            <div class="section-item" draggable="true" data-section="${section}" data-index="${index}">
                <div class="drag-handle">⋮⋮</div>
                <div class="section-info">
                    <div class="section-name">${sectionNames[section]}</div>
                    <div style="color: var(--text-secondary); font-size: 12px;">Spacing: ${spacing}</div>
                </div>
                <div class="section-controls">
                    <input type="text" class="spacing-input" value="${spacing}" 
                           placeholder="0px" 
                           onchange="updateSpacing('${section}', this.value)">
                    <div class="section-toggle ${isVisible ? 'active' : ''}" onclick="toggleSection('${section}')"></div>
                </div>
            </div>
        `;
    }).join('');

    // Add drag and drop listeners
    initDragAndDrop();
}

function toggleSection(section) {
    settings.sectionVisibility[section] = !settings.sectionVisibility[section];
    renderSectionList();
    markChanged();
}

function updateSpacing(section, value) {
    settings.sectionSpacing[section] = value;
    markChanged();
}

function initDragAndDrop() {
    const items = document.querySelectorAll('.section-item');
    let draggedItem = null;

    items.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            draggedItem = item;
            item.classList.add('dragging');
        });

        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
        });

        item.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = getDragAfterElement(item.parentElement, e.clientY);
            if (afterElement == null) {
                item.parentElement.appendChild(draggedItem);
            } else {
                item.parentElement.insertBefore(draggedItem, afterElement);
            }
        });

        item.addEventListener('drop', () => {
            updateSectionOrder();
        });
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.section-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateSectionOrder() {
    const items = document.querySelectorAll('.section-item');
    settings.sectionOrder = Array.from(items).map(item => item.dataset.section);
    markChanged();
}

function renderAdvanced() {
    document.getElementById('customCSS').value = settings.customCSS || '';
}

// Save settings
document.getElementById('saveBtn').addEventListener('click', saveSettings);
document.getElementById('saveSettings').addEventListener('click', saveSettings);

async function saveSettings() {
    try {
        // Get custom CSS
        settings.customCSS = document.getElementById('customCSS').value;

        const response = await fetch(`${API_URL}/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings)
        });

        if (response.ok) {
            hasChanges = false;
            showToast('Settings saved successfully!');
        } else {
            throw new Error('Failed to save');
        }
    } catch (error) {
        alert('Error saving settings: ' + error.message);
    }
}

// Reset settings
document.getElementById('resetSettings').addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
        fetch(`${API_URL}/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
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
            })
        })
            .then(() => {
                loadSettings();
                showToast('Settings reset to defaults');
            });
    }
});

// Export settings
document.getElementById('exportBtn').addEventListener('click', () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'orangedoor-settings.json';
    link.click();
    showToast('Settings exported!');
});

document.getElementById('exportSettings').addEventListener('click', () => {
    document.getElementById('exportBtn').click();
});

// Import settings
document.getElementById('importSettings').addEventListener('click', () => {
    document.getElementById('importFile').click();
});

document.getElementById('importFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                settings = JSON.parse(event.target.result);
                saveSettings().then(() => {
                    loadSettings();
                    showToast('Settings imported successfully!');
                });
            } catch (error) {
                alert('Error importing settings: Invalid JSON file');
            }
        };
        reader.readAsText(file);
    }
});

function markChanged() {
    hasChanges = true;
}

function showToast(message) {
    const toast = document.getElementById('successToast');
    toast.querySelector('span').textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

// Warn before leaving with unsaved changes
window.addEventListener('beforeunload', (e) => {
    if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
    }
});
