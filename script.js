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
