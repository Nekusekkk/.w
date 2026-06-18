window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        const content = document.getElementById('main-content');
        
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        content.style.opacity = '1';

        setTimeout(() => {
            document.getElementById('anim-top').classList.add('animate-fade-in');
            document.getElementById('anim-middle').classList.add('animate-fade-in');
            document.getElementById('anim-bottom').classList.add('animate-fade-in');
        }, 200);

    }, 2500);

    loadProjectData();
});

window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const windowHeight = window.innerHeight;
    const hero = document.getElementById('hero');
    const heroContent = document.getElementById('hero-content');
    
    if (scrollPos <= windowHeight) {
        const progress = scrollPos / windowHeight;
        hero.style.transform = `translateY(-${scrollPos * 0.4}px)`;
        hero.style.opacity = 1 - progress;
        heroContent.style.transform = `translateY(-${scrollPos * 0.2}px)`;
    }
});

function openDrawer() {
    document.getElementById('drawer').classList.add('active');
    document.body.style.overflow = 'hidden'; 
}

function closeDrawer() {
    document.getElementById('drawer').classList.remove('active');
    document.body.style.overflow = 'auto'; 
}

function loadProjectData() {
    fetch('projekt_1_opis.txt')
        .then(response => response.text())
        .then(data => {
            const sections = {};
            let currentKey = null;
            let currentContent = [];

            data.split('\n').forEach(line => {
                const trimmed = line.trim();
                if (trimmed.endsWith(':')) {
                    if (currentKey) {
                        sections[currentKey] = currentContent.join('\n').trim();
                    }
                    currentKey = trimmed.replace(':', '');
                    currentContent = [];
                } else if (trimmed !== '') {
                    currentContent.push(trimmed);
                }
            });
            if (currentKey) {
                sections[currentKey] = currentContent.join('\n').trim();
            }

            const makeList = (text) => {
                if (!text) return '';
                return '<ul>' + text.split('\n').map(item => {
                    const clean = item.replace(/^-\s*/, '');
                    const parts = clean.split(':');
                    if (parts.length > 1) {
                        return `<li><strong>${parts[0]}:</strong>${parts.slice(1).join(':')}</li>`;
                    }
                    return `<li>${clean}</li>`;
                }).join('') + '</ul>';
            };

            const makeGallery = (text) => {
                if (!text) return '';
                return text.split(',').map(imgName => {
                    const name = imgName.trim();
                    if(!name) return '';
                    return `<img src="projekt_1/${name}" alt="${name}" onerror="this.style.display='none'">`;
                }).join('');
            };

            const container = document.getElementById('drawer-dynamic-content');
            container.innerHTML = `
                <span class="tag">${sections['TAGI'] || ''}</span>
                <h3>${sections['TYTUŁ'] || 'Project'}</h3>
                <p>${sections['WPROWADZENIE'] || ''}</p>
                
                <h4>${sections['SEKCJA_1_TYTUŁ'] || ''}</h4>
                <p>${sections['SEKCJA_1_OPIS'] || ''}</p>
                ${makeList(sections['SEKCJA_1_PUNKTY'])}

                <h4>${sections['SEKCJA_2_TYTUŁ'] || ''}</h4>
                ${makeList(sections['SEKCJA_2_PUNKTY'])}

                <h4>${sections['SEKCJA_3_TYTUŁ'] || ''}</h4>
                ${makeList(sections['SEKCJA_3_PUNKTY'])}

                <h4>Project Gallery</h4>
                <div class="project-gallery">
                    ${makeGallery(sections['ZDJĘCIA'])}
                </div>
            `;
        })
        .catch(err => console.error(err));
}

// MULTI-STEP ORDER FORM LOGIC
let formData = {
    name: '',
    description: '',
    serverExists: '',
    serverLink: '',
    discordTag: ''
};

function startForm() {
    const box = document.getElementById('buy-box');
    box.innerHTML = `
        <div class="step-panel active" id="step-1">
            <h4>To Buy a project we need informations</h4>
            <label for="input-name">Name:</label>
            <input type="text" id="input-name" class="form-input" placeholder="Your name or organization...">
            <button class="next-btn" onclick="nextStep(1)">Next</button>
        </div>
    `;
}

function nextStep(currentStep) {
    const box = document.getElementById('buy-box');
    
    if (currentStep === 1) {
        formData.name = document.getElementById('input-name').value || 'Not provided';
        box.innerHTML = `
            <div class="step-panel active" id="step-2">
                <h4>To Buy a project we need informations</h4>
                <label for="input-desc">Description:</label>
                <textarea id="input-desc" class="form-input" rows="4" placeholder="Describe your project vision and ideas..." style="resize:none; font-family:inherit;"></textarea>
                <button class="next-btn" onclick="nextStep(2)">Next</button>
            </div>
        `;
    } 
    else if (currentStep === 2) {
        formData.description = document.getElementById('input-desc').value || 'Not provided';
        box.innerHTML = `
            <div class="step-panel active" id="step-3">
                <h4>To Buy a project we need informations</h4>
                <label>Does the server exist?</label>
                <div class="radio-group">
                    <input type="radio" id="srv-yes" name="server_exist" value="Yes" checked onclick="toggleServerLink(true)">
                    <label for="srv-yes" class="radio-label">Yes</label>
                    
                    <input type="radio" id="srv-no" name="server_exist" value="No" onclick="toggleServerLink(false)">
                    <label for="srv-no" class="radio-label">No</label>
                </div>
                <div id="link-field-container">
                    <label for="input-link" style="font-size:1.2rem; margin-bottom:10px;">Server Link:</label>
                    <input type="text" id="input-link" class="form-input" placeholder="https://discord.gg/...">
                </div>
                <button class="next-btn" onclick="nextStep(3)">Next</button>
            </div>
        `;
    }
    else if (currentStep === 3) {
        const yesRadio = document.getElementById('srv-yes');
        formData.serverExists = yesRadio.checked ? 'Yes' : 'No';
        
        if (yesRadio.checked) {
            formData.serverLink = document.getElementById('input-link').value || 'Not provided';
        } else {
            formData.serverLink = 'N/A (Server does not exist)';
        }

        box.innerHTML = `
            <div class="step-panel active" id="step-4">
                <h4>To Buy a project we need informations</h4>
                <label for="input-dc">Your username on discord:</label>
                <input type="text" id="input-dc" class="form-input" placeholder="e.g. username">
                <button class="done-btn" onclick="submitForm()">Done</button>
            </div>
        `;
    }
}

function toggleServerLink(show) {
    const container = document.getElementById('link-field-container');
    if (show) {
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
    }
}

function submitForm() {
    formData.discordTag = document.getElementById('input-dc').value || 'Not provided';
    const box = document.getElementById('buy-box');
    
    // Webhook Embed Data Structure
    const webhookUrl = 'https://discord.com/api/webhooks/1517283646166274081/4HfsbkIHDE_RifK5up4XartdsxW2hWi8PMR85Zz_Ruqj5rlqthATCrN6LsVxpfcN8xGQ';
    
    const packet = {
        embeds: [{
            title: "🚀 New Project Request!",
            color: 10027025, // Hex #990011 converted to decimal
            fields: [
                { name: "👤 Name", value: formData.name, inline: true },
                { name: "🎮 Discord User", value: formData.discordTag, inline: true },
                { name: "🌐 Server Exists?", value: formData.serverExists, inline: false },
                { name: "🔗 Server Link", value: formData.serverLink, inline: false },
                { name: "📝 Description", value: formData.description, inline: false }
            ],
            timestamp: new Date().toISOString()
        }]
    };

    // Send payload using native fetch API
    fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(packet)
    })
    .then(() => {
        // Show success layout with invitation link
        box.innerHTML = `
            <div class="step-panel active">
                <h4 style="color:#ff4d5a; font-weight:600;">Success! Data transmitted.</h4>
                <p style="color:#d4d4d4; font-size:1.1rem; line-height:1.6;">You are being transferred to our Discord server:</p>
                <a href="https://discord.gg/xQ6XYSvjqE" target="_blank" class="dc-link">https://discord.gg/xQ6XYSvjqE</a>
                <br>
                <button class="ok-btn" onclick="resetForm()">Ok</button>
            </div>
        `;
    })
    .catch(err => {
        console.error(err);
        alert('Something went wrong while sending data. Please check your connection.');
    });
}

function resetForm() {
    const box = document.getElementById('buy-box');
    box.innerHTML = `<button class="buy-btn" onclick="startForm()">Buy a project</button>`;
}
