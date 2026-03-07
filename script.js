document.addEventListener('DOMContentLoaded', () => {
  runTerminalSequence();
  loadRepos();
});

// --- FANCY TYPING EFFECT ENGINE ---
async function typeText(elementId, text, speed = 50) {
  const element = document.getElementById(elementId);
  element.innerHTML = '';
  for (let i = 0; i < text.length; i++) {
    element.innerHTML += text.charAt(i);
    await new Promise(resolve => setTimeout(resolve, speed));
  }
}

async function runTerminalSequence() {
  // 1. Type 'whoami'
  await typeText('cmd1', 'whoami', 100);
  await new Promise(r => setTimeout(r, 400));
  
  // 2. Reveal Name
  document.getElementById('name-output').classList.add('fade-in');
  await new Promise(r => setTimeout(r, 600));

  // 3. Reveal next prompt and type 'cat info.txt'
  document.getElementById('prompt2').classList.add('fade-in');
  await typeText('cmd2', 'cat info.txt', 100);
  await new Promise(r => setTimeout(r, 400));

  // 4. Type the description out rapidly
  await typeText('info-output', 'Student at 1337 | C & Python Developer | Custom Environment Enthusiast', 30);
  await new Promise(r => setTimeout(r, 500));

  // 5. Fade in the social links
  document.getElementById('socials').classList.add('fade-in');
}

// --- GITHUB REPO FETCHER ---
async function loadRepos() {
  const container = document.getElementById("repos");
  const loadingStatus = document.getElementById("loading-status");

  try {
    const response = await fetch("https://api.github.com/users/laghzal49/repos?per_page=100");
    if (!response.ok) throw new Error("Failed to fetch repos");
    const repos = await response.json();

    const allRepos = repos
      .filter(repo => !repo.fork)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    loadingStatus.style.display = 'none';

    await Promise.all(allRepos.map(async (repo) => {
      let iconClass = 'fas fa-code';
      if (repo.language === 'C') iconClass = 'fas fa-c';
      else if (repo.language === 'Python') iconClass = 'fab fa-python';
      else if (repo.language === 'Shell') iconClass = 'fas fa-terminal';

      const langHtml = repo.language 
        ? `<p class="tech-stack"><i class="${iconClass}"></i> ${repo.language}</p>` 
        : '';

      let finalDescription = repo.description || "System code. No specific description provided.";

      try {
        const readmeRes = await fetch(`https://api.github.com/repos/laghzal49/${repo.name}/readme`, {
          headers: { 'Accept': 'application/vnd.github.html' } 
        });

        if (readmeRes.ok) {
          const readmeHtml = await readmeRes.text();
          const parser = new DOMParser();
          const doc = parser.parseFromString(readmeHtml, 'text/html');
          const firstParagraph = doc.querySelector('p');
          
          if (firstParagraph && firstParagraph.textContent.trim().length > 0) {
            let text = firstParagraph.textContent.trim();
            if (text.length > 140) text = text.substring(0, 140) + '...';
            finalDescription = text;
          }
        }
      } catch (readmeError) {
        console.warn(`Skipped README for ${repo.name}`);
      }

      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h3>${repo.name}</h3>
        ${langHtml}
        <p>${finalDescription}</p>
        <div style="font-size: 0.85rem; margin-bottom: 15px; display: flex; gap: 15px; opacity: 0.7;">
          <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
          <span><i class="fas fa-clock"></i> ${new Date(repo.updated_at).toLocaleDateString()}</span>
        </div>
        <a href="${repo.html_url}" target="_blank" style="margin-top: auto;">
          <i class="fab fa-github"></i> Inspect Source
        </a>
      `;
      container.appendChild(card);
    }));

  } catch (error) {
    loadingStatus.innerHTML = "<i class='fas fa-exclamation-triangle'></i> Error: Connection to GitHub API refused.";
    loadingStatus.style.color = "#ff5f56";
  }
}