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
const projectData = {
    'MinhaLivraria': {
        stacks: ['React', 'JavaScript', 'CSS', 'API REST'],
        pt: 'Aplicação de livraria com consumo de API interna/externa. Possui busca interativa e filtros baseados em categorias.',
        en: 'Bookstore application with REST API integration for dynamic book searches and interactive category filtering.'
    },
    'todolist': {
        stacks: ['React', 'Node.js', 'Banco de Dados', 'CSS'],
        pt: 'To-Do List completo para organizar tarefas semanais de forma ágil, com armazenamento no banco de dados e interface altamente fluida e reativa.',
        en: 'Complete To-Do List to agilely organize weekly tasks, featuring persistent database storage and a highly reactive and fluid interface.'
    },
    'galeria': {
        stacks: ['Vue.js', 'JavaScript', 'CSS', 'API'],
        pt: 'Galeria de imagens dinâmica de tirar o fôlego consumindo API do museu de Cleveland. Apresenta interações responsivas e micro-animações visuais.',
        en: 'Breathtaking dynamic image gallery fetching data from the Cleveland Museum API. Features responsive interactions and pristine micro-animations.'
    },
    'AgilStore': {
        stacks: ['React', 'Node.js', 'SCSS'],
        pt: 'Sistema robusto de inventário permitindo CRUD completo. Com interface moderna e UX priorizada, persiste dados confiavelmente em JSON.',
        en: 'Robust inventory management system allowing full CRUD capabilities. Built with a modern interface, prioritizing UX, saving data cleanly to JSON.'
    },
    'inspire-pixel': {
        stacks: ['Vue.js', 'SCSS', 'API REST'],
        pt: 'Projeto front-end inovador focado na separação por componentes, consumo assíncrono de APIs externas e tipografia meticulosamente desenhada.',
        en: 'Innovative frontend project focused on component separation, asynchronous external API fetching, and elegantly tailored typography.'
    },
    'Passoia': {
        stacks: ['React', 'SASS', 'HTML5', 'JS'],
        pt: 'Landing page conceitual estonteante adaptando-se perfeitamente aos múltiplos dispositivos, alavancando as melhores práticas do HTML5 e SASS.',
        en: 'Stunning conceptual landing page seamlessly adapting to multiple devices, leveraging the core best practices of HTML5 and SASS.'
    }
};

const pinnedRepos = Object.keys(projectData);

// Multi-Language System
let currentLang = localStorage.getItem('lang') || 'pt';

const translations = {
    pt: {
        nav_about: "Sobre",
        nav_projects: "Projetos",
        nav_contact: "Contato",
        hero_subtitle: "Desenvolvedora Full Stack",
        about_title: "Minha Jornada",
        about_intro: "Engenheira de Software em formação e Desenvolvedora Full Stack apaixonada por criar soluções digitais de alto impacto. Com MBA em Marketing e atuando na MCS Markup, alio um pensamento técnico analítico à visão estratégica de produto e experiência de usuário.",
        read_more: "Saiba mais sobre minha trajetória <i class='fa-solid fa-chevron-down'></i>",
        read_less: "Mostrar menos <i class='fa-solid fa-chevron-up'></i>",
        about_details: `
            <ul style="list-style: none; padding: 0;">
                <li style="margin-bottom: 0.5rem;"><strong style="color: var(--accent-color);">Formação:</strong> Engenharia de Software (3º período) e MBA em Marketing</li>
                <li style="margin-bottom: 0.5rem;"><strong style="color: var(--accent-color);">Stacks:</strong> JavaScript, Python, React, Vue.js, Node.js, HTML/SCSS</li>
                <li style="margin-bottom: 0.5rem;"><strong style="color: var(--accent-color);">Cloud:</strong> AWS</li>
                <li style="margin-bottom: 0.5rem;"><strong style="color: var(--accent-color);">Inglês:</strong> Avançado (C1)</li>
                <li style="margin-bottom: 0.5rem;"><strong style="color: var(--accent-color);">Localização:</strong> Rio de Janeiro</li>
            </ul>
            <p style="margin-top: 1.5rem; text-align: justify;">
                No meu dia a dia como estagiária, atuo no desenvolvimento e manutenção de aplicações web, participando desde a construção de interfaces até a implementação de regras de negócio no backend. Tenho experiência com integração de APIs REST, comunicação entre serviços e modelagem de dados, sempre buscando garantir organização, legibilidade e escalabilidade do código.<br><br>
                Minha vivência anterior na área administrativa, aliada ao MBA em Marketing and Growth, contribui para uma visão orientada a produto, permitindo que eu desenvolva soluções não apenas funcionais, mas alinhadas às necessidades do usuário e do negócio.<br><br>
                Atualmente, direciono meus estudos para arquitetura de software, infraestrutura em nuvem e boas práticas de desenvolvimento, com o objetivo de evoluir na construção de sistemas cada vez mais robustos, eficientes e bem estruturados.
            </p>
        `,
        projects_title: "Projetos Selecionados",
        projects_loading: "Carregando projetos do GitHub...",
        projects_viewmore: "Ver mais projetos no GitHub <i class='fa-solid fa-arrow-right'></i>",
        contact_title: "Vamos criar algo incrível?",
        contact_desc: "Estou aberta a novas oportunidades e colaborações. Deixe-me uma mensagem!",
        contact_name: "Seu Nome",
        contact_email: "Seu Email",
        contact_msg: "Sua mensagem...",
        contact_btn: "Enviar Mensagem",
        footer_text: " Yasmin Bezerra. Feito com ❤️ e código."
    },
    en: {
        nav_about: "About",
        nav_projects: "Projects",
        nav_contact: "Contact",
        hero_subtitle: "Full Stack Developer",
        about_title: "My Journey",
        about_intro: "Aspiring Software Engineer and impactful Full Stack Developer. Backed by an MBA in Marketing and working at MCS Markup, I merge strong analytical technical coding with a laser-focused strategic vision of user experience and product goals.",
        read_more: "Read more about my journey <i class='fa-solid fa-chevron-down'></i>",
        read_less: "Show less <i class='fa-solid fa-chevron-up'></i>",
        about_details: `
            <ul style="list-style: none; padding: 0;">
                <li style="margin-bottom: 0.5rem;"><strong style="color: var(--accent-color);">Education:</strong> Software Engineering (3rd term) and MBA in Marketing</li>
                <li style="margin-bottom: 0.5rem;"><strong style="color: var(--accent-color);">Stacks:</strong> JavaScript, Python, React, Vue.js, Node.js, HTML/SCSS</li>
                <li style="margin-bottom: 0.5rem;"><strong style="color: var(--accent-color);">Cloud:</strong> AWS</li>
                <li style="margin-bottom: 0.5rem;"><strong style="color: var(--accent-color);">English:</strong> Advanced (C1)</li>
                <li style="margin-bottom: 0.5rem;"><strong style="color: var(--accent-color);">Location:</strong> Rio de Janeiro, Brazil</li>
            </ul>
            <p style="margin-top: 1.5rem; text-align: justify;">
                In my daily routine as an intern, I work on developing and maintaining web applications, participating in everything from building interfaces to implementing business rules on the backend. I have experience with REST API integration, microservice communication, and data modeling, always striving to ensure code organization, readability, and scalability.<br><br>
                My previous administrative background, combined with an MBA in Marketing and Growth, contributes to a product-oriented vision, enabling me to build solutions that are not only highly functional but also closely aligned with both user and business needs.<br><br>
                Currently, I'm focusing my studies on software architecture, cloud infrastructure, and development best practices, aiming to evolve and construct systems that are increasingly robust, efficient, and well-structured.
            </p>
        `,
        projects_title: "Selected Projects",
        projects_loading: "Loading GitHub projects...",
        projects_viewmore: "View more projects on GitHub <i class='fa-solid fa-arrow-right'></i>",
        contact_title: "Let's build something amazing?",
        contact_desc: "I'm open to new opportunities and thrilling collaborations. Drop me a message!",
        contact_name: "Your Name",
        contact_email: "Your Email",
        contact_msg: "Your message...",
        contact_btn: "Send Message",
        footer_text: " Yasmin Bezerra. Made with ❤️ and code."
    }
};

function applyTranslations(lang) {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) {
            el.placeholder = translations[lang][key];
        }
    });

    // Update active state of language toggle button 
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        langBtn.textContent = lang === 'pt' ? 'EN' : 'PT';
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Re-select elements inside event to ensure DOM is ready
    const introOverlay = document.getElementById('intro-overlay');
    const introTextElement = document.getElementById('intro-text');

    // i18n trigger setup
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'pt' ? 'en' : 'pt';
            localStorage.setItem('lang', currentLang);
            applyTranslations(currentLang);

            // Refetch projects to re-render project cards with new language
            fetchGitHubProjects();
        });
    }

    // Apply init translation
    applyTranslations(currentLang);

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

                        // Regular expression to match ![]() or <img src="" /> multiline compatible
                        const imgRegex = /!\[.*?\]\((.*?)\)|<img.*?src=["'](.*?)["'].*?>/is;
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

        const viewMoreText = translations[currentLang].projects_viewmore;
        viewMoreContainer.innerHTML = `
            <a href="https://github.com/${githubUsername}?tab=repositories" target="_blank" class="btn-secondary">
                ${viewMoreText}
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
            readMoreBtn.innerHTML = translations[currentLang].read_more;
        } else {
            aboutDetails.classList.add('expanded');
            readMoreBtn.classList.add('active');
            readMoreBtn.innerHTML = translations[currentLang].read_less;
        }
    });
}

function createProjectCard(repo, imageUrl, index) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.animationDelay = `${index * 0.1}s`;

    const repoName = repo.name;
    const repoInfo = projectData[repoName];

    // Fallback to github data if local info is missing somehow
    let stacksHtml = '';
    let descriptionText = '';

    if (repoInfo) {
        descriptionText = repoInfo[currentLang];
        stacksHtml = repoInfo.stacks.map(s => `<span class="tag">${s}</span>`).join('');
    } else {
        const language = repo.language || 'Code';
        stacksHtml = `<span class="tag">${language}</span>`;
        descriptionText = repo.description || 'Projeto desenvolvido por ' + githubUsername;
    }

    card.innerHTML = `
        <div class="project-image-container">
            <!-- Append a timestamp to imageUrl to bypass browser cache slightly, though github already serves latest nicely -->
            <img src="${imageUrl}?t=${new Date().getTime()}" alt="${repoName}" class="project-image" loading="lazy" onerror="this.src='https://placehold.co/600x400/151515/FFFFFF?text=${repoName}'">
        </div>
        <div class="project-info">
            <div>
                <div class="project-tags">
                    ${stacksHtml}
                </div>
                <h3>${repoName}</h3>
                <p>${descriptionText}</p>
            </div>
            <div class="project-links">
                ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="icon-link" aria-label="Live Demo"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>` : ''}
                <a href="${repo.html_url}" target="_blank" class="icon-link" aria-label="Código"><i class="fa-brands fa-github"></i></a>
            </div>
        </div>
    `;

    return card;
}
