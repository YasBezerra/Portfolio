// DOM Elements
// const typewriterElement = document.getElementById('typewriter'); // Replaced by intro logic
const introOverlay = document.getElementById('intro-overlay');
const introTextElement = document.getElementById('intro-text');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');
const yearSpan = document.getElementById('year');
const projectsGrid = document.getElementById('projects-grid');

// Configuration
const githubUsername = 'YasBezerra';
const introMessage = "Hello world, eu sou a Yasmin";
const typingSpeed = 100;
const introDelay = 2000; // 2 seconds black screen

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Re-select elements inside event to ensure DOM is ready
    const introOverlay = document.getElementById('intro-overlay');
    const introTextElement = document.getElementById('intro-text');

    // Disable scroll during intro
    document.body.style.overflow = 'hidden';

    // Start Intro Sequence
    if (introOverlay && introTextElement) {
        setTimeout(() => startIntro(introOverlay, introTextElement), introDelay);
    } else {
        console.warn("Intro elements not found, removing overlay fallback");
        if (introOverlay) introOverlay.style.display = 'none';
        document.body.style.overflow = '';
    }

    loadTheme();
    fetchGitHubProjects();
    updateYear();
});

// Intro Logic
function startIntro(overlay, textElement) {
    let i = 0;
    textElement.textContent = '';

    function type() {
        if (i < introMessage.length) {
            textElement.textContent += introMessage.charAt(i);
            i++;
            setTimeout(type, typingSpeed);
        } else {
            // Finished typing
            setTimeout(() => finishIntro(overlay), 1000);
        }
    }

    type();
}

function finishIntro(overlay) {
    if (overlay) {
        overlay.classList.add('fade-out');
    }
    document.body.style.overflow = ''; // Enable scroll

    const heroH1 = document.getElementById('typewriter');
    if (heroH1) {
        heroH1.textContent = introMessage;
    }
}

// Update Year
function updateYear() {
    yearSpan.textContent = new Date().getFullYear();
}

// Custom Cursor Logic
window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Add a slight delay for the outline using animate/requestAnimationFrame can be better but simple CSS transition works here too
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Typewriter Effect
// Old functions removed for cleanliness

// Theme Toggle
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

// GitHub Projects Fetcher
async function fetchGitHubProjects() {
    try {
        // Reverting to fetch ALL repos (sorted by updated)
        const response = await fetch(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=100`);
        const userResponse = await fetch(`https://api.github.com/users/${githubUsername}`);

        if (!response.ok || !userResponse.ok) throw new Error('Falha ao buscar dados');

        const repos = await response.json();
        const userData = await userResponse.json();

        // Update Profile Image
        if (userData.avatar_url) {
            const profileImg = document.getElementById('profile-img');
            if (profileImg) profileImg.src = userData.avatar_url;
        }

        const projectsContainer = document.getElementById('projects-grid');
        projectsContainer.innerHTML = '';
        projectsContainer.style.display = 'block';

        // Filter: Non-forks, has language
        const relevantRepos = repos.filter(repo => !repo.fork && repo.language);

        if (relevantRepos.length === 0) {
            projectsContainer.innerHTML = '<p>Nenhum projeto público encontrado.</p>';
            return;
        }

        // Group by Language
        const projectsByStack = relevantRepos.reduce((acc, repo) => {
            const language = repo.language || 'Outros';
            if (!acc[language]) acc[language] = [];
            acc[language].push(repo);
            return acc;
        }, {});

        // Render Groups as Carousels
        Object.keys(projectsByStack).sort().forEach(language => {
            const stackGroup = document.createElement('div');
            stackGroup.className = 'stack-group';
            // Unique ID for carousel logic
            const carouselId = `carousel-${language.replace(/\s+/g, '-').toLowerCase()}`;

            stackGroup.innerHTML = `
                <div class="stack-header">
                    <h3 class="stack-title">${language}</h3>
                    <div class="carousel-controls">
                        <button class="carousel-btn prev" aria-label="Anterior" onclick="scrollCarousel('${carouselId}', -1)">
                            <i class="fa-solid fa-chevron-left"></i>
                        </button>
                        <button class="carousel-btn next" aria-label="Próximo" onclick="scrollCarousel('${carouselId}', 1)">
                            <i class="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
                <div id="${carouselId}" class="carousel-container">
                    <!-- Cards injected here -->
                </div>
            `;

            projectsContainer.appendChild(stackGroup);

            // Inject cards into the container
            const container = document.getElementById(carouselId);
            projectsByStack[language].forEach((repo, index) => {
                const card = createProjectCard(repo, index);
                container.appendChild(card);
            });
        });

        // Add "View More" Button
        const viewMoreContainer = document.createElement('div');
        viewMoreContainer.style.textAlign = 'center';
        viewMoreContainer.style.marginTop = '4rem';
        viewMoreContainer.innerHTML = `
            <a href="https://github.com/${githubUsername}?tab=repositories" target="_blank" class="btn-secondary">
                Ver mais projetos no GitHub <i class="fa-solid fa-arrow-right"></i>
            </a>
        `;
        projectsContainer.appendChild(viewMoreContainer);

    } catch (error) {
        console.error('Erro:', error);
        document.getElementById('projects-grid').innerHTML = '<p>Erro ao carregar projetos via API. Tente recarregar a página.</p>';
    }
}

// Carousel Scroll Logic
window.scrollCarousel = function (carouselId, direction) {
    const container = document.getElementById(carouselId);
    if (container) {
        const scrollAmount = 340; // Card width + gap
        container.scrollBy({
            left: scrollAmount * direction,
            behavior: 'smooth'
        });
    }
};

// About Read More Logic
const readMoreBtn = document.getElementById('read-more-btn');
const aboutDetails = document.getElementById('about-details');

if (readMoreBtn) {
    readMoreBtn.addEventListener('click', () => {
        const isExpanded = aboutDetails.classList.contains('expanded');

        if (isExpanded) {
            aboutDetails.classList.remove('expanded');
            readMoreBtn.classList.remove('active');
            readMoreBtn.innerHTML = `Saiba mais sobre minha trajetória <i class="fa-solid fa-chevron-down"></i>`;
        } else {
            aboutDetails.classList.add('expanded');
            readMoreBtn.classList.add('active');
            readMoreBtn.innerHTML = `Mostrar menos <i class="fa-solid fa-chevron-down"></i>`;
        }
    });
}

function createProjectCard(repo, index) {
    const card = document.createElement('div');
    card.className = 'project-card';
    // Remove fixed animation delay to avoid sync issues in multiple grids, or keep it per card
    // card.style.animationDelay = `${index * 0.1}s`; 

    // Determine language color/tag
    const language = repo.language || 'Code';

    card.innerHTML = `
        <div class="project-info">
            <div class="project-tags">
                <span class="tag">${language}</span>
            </div>
            <h3>${repo.name}</h3>
            <p>${repo.description || 'Sem descrição fornecida.'}</p>
            <div class="project-links">
                ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="icon-link" aria-label="Live Demo"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''}
                <a href="${repo.html_url}" target="_blank" class="icon-link" aria-label="Código"><i class="fa-brands fa-github"></i></a>
            </div>
        </div>
    `;

    return card;
}
