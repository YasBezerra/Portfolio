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

// Pinned Repos to Show
const pinnedRepos = [
    'inspire-pixel',
    'Passoia',
    'AgilStore',
    'ReciclaTech',
    'biblioteca-flask',
    'YasminBezerra-teste-estagio-imovel-pay'
];

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
    if (cursorOutline.animate) {
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    } else {
        cursorOutline.style.left = `${posX}px`;
        cursorOutline.style.top = `${posY}px`;
    }
});

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
        const userResponse = await fetch(`https://api.github.com/users/${githubUsername}`);
        if (!userResponse.ok) throw new Error('Falha ao buscar usuário');

        const userData = await userResponse.json();

        // Update Profile Image
        if (userData.avatar_url) {
            const profileImg = document.getElementById('profile-img');
            if (profileImg) profileImg.src = userData.avatar_url;
        }

        const projectsContainer = document.getElementById('projects-grid');
        projectsContainer.innerHTML = '';
        projectsContainer.style.display = 'grid';

        for (let i = 0; i < pinnedRepos.length; i++) {
            const repoName = pinnedRepos[i];
            try {
                const repoResponse = await fetch(`https://api.github.com/repos/${githubUsername}/${repoName}`);
                if (!repoResponse.ok) continue;

                const repo = await repoResponse.json();

                let imageUrl = '';
                try {
                    const readmeResponse = await fetch(`https://api.github.com/repos/${githubUsername}/${repoName}/readme`);
                    if (readmeResponse.ok) {
                        const readmeData = await readmeResponse.json();
                        // Github API returns base64 content with newlines
                        const decodedContent = decodeURIComponent(escape(atob(readmeData.content.replace(/\n/g, ''))));

                        // Regular expression to match ![]() or <img src="" />
                        const imgRegex = /!\[.*?\]\((.*?)\)|<img.*?src="(.*?)".*?>/i;
                        const match = decodedContent.match(imgRegex);

                        if (match) {
                            imageUrl = match[1] || match[2];

                            // Check if image URL is relative
                            if (imageUrl && !imageUrl.startsWith('http')) {
                                const branch = repo.default_branch || 'main';
                                // Transform relative to raw absolute GitHub URL
                                imageUrl = `https://raw.githubusercontent.com/${githubUsername}/${repoName}/${branch}/${imageUrl.replace(/^[\\/\.]+/, '')}`;
                            }
                        }
                    }
                } catch (e) {
                    console.warn(`Could not fetch README or Image for ${repoName}`);
                }

                // fallback to a placeholder if no image
                if (!imageUrl) {
                    imageUrl = `https://placehold.co/600x400/151515/FFFFFF?text=${repoName}`;
                }

                const card = createProjectCard(repo, imageUrl, i);
                projectsContainer.appendChild(card);

            } catch (e) {
                console.error(`Erro ao processar repositório ${repoName}`, e);
            }
        }

        // Add "View More" Button
        const viewMoreContainer = document.createElement('div');
        viewMoreContainer.style.textAlign = 'center';
        viewMoreContainer.style.marginTop = '4rem';
        viewMoreContainer.style.gridColumn = '1 / -1';
        viewMoreContainer.innerHTML = `
            <a href="https://github.com/${githubUsername}?tab=repositories" target="_blank" class="btn-secondary">
                Ver mais projetos no GitHub <i class="fa-solid fa-arrow-right"></i>
            </a>
        `;
        projectsContainer.appendChild(viewMoreContainer);

    } catch (error) {
        console.error('Erro geral ao buscar projetos:', error);
        document.getElementById('projects-grid').innerHTML = '<p>Erro ao carregar projetos. Tente novamente mais tarde.</p>';
    }
}

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

function createProjectCard(repo, imageUrl, index) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.animationDelay = `${index * 0.1}s`;

    const language = repo.language || 'Code';

    card.innerHTML = `
        <div class="project-image-container">
            <img src="${imageUrl}" alt="${repo.name}" class="project-image" loading="lazy" onerror="this.src='https://placehold.co/600x400/151515/FFFFFF?text=${repo.name}'">
        </div>
        <div class="project-info">
            <div>
                <div class="project-tags">
                    <span class="tag">${language}</span>
                </div>
                <h3>${repo.name}</h3>
                <p>${repo.description || 'Projeto desenvolvido por ' + githubUsername}</p>
            </div>
            <div class="project-links">
                ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="icon-link" aria-label="Live Demo"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''}
                <a href="${repo.html_url}" target="_blank" class="icon-link" aria-label="Código"><i class="fa-brands fa-github"></i></a>
            </div>
        </div>
    `;

    return card;
}
