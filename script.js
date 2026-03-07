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
  await typeText('cmd1', 'whoami', 100);
  await new Promise(r => setTimeout(r, 400));
  
  document.getElementById('name-output').classList.add('fade-in');
  await new Promise(r => setTimeout(r, 600));

  document.getElementById('prompt2').classList.add('fade-in');
  await typeText('cmd2', 'cat info.txt', 100);
  await new Promise(r => setTimeout(r, 400));

  await typeText('info-output', 'Student at 1337 | C & Python Developer | Custom Environment Enthusiast', 30);
  await new Promise(r => setTimeout(r, 500));

  document.getElementById('socials').classList.add('fade-in');
}

// --- GITHUB REPO FETCHER WITH CACHING ---
async function loadRepos() {
  const container = document.getElementById("repos");
  const loadingStatus = document.getElementById("loading-status");
  
  const CACHE_KEY = 'tlaghzal_github_data';
  const CACHE_EXPIRY = 60 * 60 * 1000; // 1 hour in milliseconds

  // 1. Check if we have fresh cached data
  const cachedData = localStorage.getItem(CACHE_KEY);
  if (cachedData) {
    const parsedCache = JSON.parse(cachedData);
    if (Date.now() - parsedCache.timestamp < CACHE_EXPIRY) {
      console.log("Loading GitHub data from local cache...");
      loadingStatus.style.display = 'none';
      renderCards(parsedCache.repos, container);
      return; // Exit function early, saving our API limit!
    }
  }

  // 2. If no cache or cache is expired, fetch from GitHub
  console.log("Fetching fresh data from GitHub API...");
  try {
    const response = await fetch("https://api.github.com/users/laghzal49/repos?per_page=100");
    
    // If the main fetch is rate limited, throw error to catch block
    if (response.status === 403 || response.status === 429) {
        throw new Error("Rate Limited");
    }
    if (!response.ok) throw new Error("Failed to fetch repos");
    
    const repos = await response.json();

    const allRepos = repos
      .filter(repo => !repo.fork)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    loadingStatus.style.display = 'none';
    let processedRepos = [];

    // Process all repos concurrently
    await Promise.all(allRepos.map(async (repo) => {
      let iconClass = 'fas fa-code';
      if (repo.language === 'C') iconClass = 'fas fa-c';
      else if (repo.language === 'Python') iconClass = 'fab fa-python';
      else if (repo.language === 'Shell') iconClass = 'fas fa-terminal';

      let finalDescription = repo.description || "System code. No specific description provided.";

      // Attempt to fetch README, but fail silently if rate limited so the card still builds
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
        // Silently catch README errors (like rate limits) to keep the app running
      }

      // Save processed data for this repo
      processedRepos.push({
        name: repo.name,
        language: repo.language,
        iconClass: iconClass,
        description: finalDescription,
        stars: repo.stargazers_count,
        updated: new Date(repo.updated_at).toLocaleDateString(),
        url: repo.html_url,
        // Keep the original date object for sorting the final array
        sortDate: new Date(repo.updated_at) 
      });
    }));

    // Sort the final processed array again just to be safe
    processedRepos.sort((a, b) => b.sortDate - a.sortDate);

    // 3. Save to LocalStorage so we don't hit the API again for an hour
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      repos: processedRepos
    }));

    // 4. Render the cards
    renderCards(processedRepos, container);

  } catch (error) {
    if (error.message === "Rate Limited") {
      loadingStatus.innerHTML = "<i class='fas fa-exclamation-triangle'></i> GitHub API limit reached. The terminal will automatically reconnect in roughly an hour.";
    } else {
      loadingStatus.innerHTML = "<i class='fas fa-exclamation-triangle'></i> Error: Connection to GitHub API refused. Check profile directly.";
    }
    loadingStatus.style.color = "#ff5f56";
  }
}

// Helper function to build the HTML cards
function renderCards(reposData, container) {
  container.innerHTML = ''; // Clear container
  reposData.forEach(repo => {
    const langHtml = repo.language 
      ? `<p class="tech-stack"><i class="${repo.iconClass}"></i> ${repo.language}</p>` 
      : '';

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${repo.name}</h3>
      ${langHtml}
      <p>${repo.description}</p>
      <div style="font-size: 0.85rem; margin-bottom: 15px; display: flex; gap: 15px; opacity: 0.7;">
        <span><i class="fas fa-star"></i> ${repo.stars}</span>
        <span><i class="fas fa-clock"></i> ${repo.updated}</span>
      </div>
      <a href="${repo.url}" target="_blank" style="margin-top: auto;">
        <i class="fab fa-github"></i> Inspect Source
      </a>
    `;
    container.appendChild(card);
  });
}