document.addEventListener('DOMContentLoaded', () => {
  loadRepos();
});

async function loadRepos() {
  const container = document.getElementById("repos");
  const loadingStatus = document.getElementById("loading-status");

  try {
    // 1. Fetch your repositories
    const response = await fetch("https://api.github.com/users/laghzal49/repos");
    if (!response.ok) throw new Error("Failed to fetch repos");
    const repos = await response.json();

    // 2. Filter forks, sort by latest updated, get top 6
    const topRepos = repos
      .filter(repo => !repo.fork)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 6);

    // Remove loading text
    loadingStatus.style.display = 'none';

    // 3. Loop through top repos concurrently to fetch their READMEs
    await Promise.all(topRepos.map(async (repo) => {
      
      // Determine icon based on language
      let iconClass = 'fas fa-code';
      if (repo.language === 'C') iconClass = 'fas fa-c';
      else if (repo.language === 'Python') iconClass = 'fab fa-python';
      else if (repo.language === 'Shell') iconClass = 'fas fa-terminal';

      const langHtml = repo.language 
        ? `<p class="tech-stack"><i class="${iconClass}"></i> ${repo.language}</p>` 
        : '';

      // Default description fallback
      let finalDescription = repo.description || "System code. No specific description provided in repository.";

      // Fetch the README converted to HTML by GitHub
      try {
        const readmeRes = await fetch(`https://api.github.com/repos/laghzal49/${repo.name}/readme`, {
          headers: { 'Accept': 'application/vnd.github.html' } // Asks GitHub to render the markdown
        });

        if (readmeRes.ok) {
          const readmeHtml = await readmeRes.text();
          
          // Use DOMParser to safely parse the returned HTML
          const parser = new DOMParser();
          const doc = parser.parseFromString(readmeHtml, 'text/html');
          
          // Grab the first paragraph tag from the README
          const firstParagraph = doc.querySelector('p');
          
          if (firstParagraph && firstParagraph.textContent.trim().length > 0) {
            let text = firstParagraph.textContent.trim();
            // Truncate if it's too long so the cards stay neat
            if (text.length > 140) {
              text = text.substring(0, 140) + '...';
            }
            finalDescription = text;
          }
        }
      } catch (readmeError) {
        console.warn(`Could not fetch README for ${repo.name}`, readmeError);
        // Silently fail and keep the default repo.description
      }

      // 4. Build the card HTML
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

      // Append to the grid
      container.appendChild(card);
    }));

  } catch (error) {
    console.error("Error loading repositories:", error);
    loadingStatus.innerHTML = "<i class='fas fa-exclamation-triangle'></i> Error: Connection to GitHub API refused or rate-limited. Check profile directly.";
    loadingStatus.style.color = "#ff5f56";
  }
}