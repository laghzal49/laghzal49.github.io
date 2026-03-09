/**
 * Portfolio Script
 * Modern interactive features for the portfolio
 */

const roles = [
  "architect efficient systems",
  "design performant solutions",
  "write clean, reliable code"
];

document.addEventListener("DOMContentLoaded", () => {
  initializeTypewriter();
  initializeMobileMenu();
  loadFeaturedProjects();
  setupNavigation();
});

/**
 * Typewriter effect for terminal
 */
function initializeTypewriter() {
  const target = document.getElementById("terminal-text");
  if (!target) return;

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const currentRole = roles[roleIndex];

    if (!deleting) {
      charIndex += 1;
    } else {
      charIndex -= 1;
    }

    target.textContent = currentRole.slice(0, charIndex);

    let timeout = deleting ? 40 : 70;

    if (!deleting && charIndex === currentRole.length) {
      timeout = 1200;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      timeout = 350;
    }

    setTimeout(tick, timeout);
  };

  tick();
}

/**
 * Mobile menu toggle
 */
function initializeMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav");

  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("active");
    toggle.setAttribute("aria-expanded", nav.classList.contains("active"));
  });

  // Close menu when link clicked
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/**
 * Setup navigation active states
 */
function setupNavigation() {
  const navLinks = document.querySelectorAll(".nav-link");
  const currentPath = window.location.pathname;

  navLinks.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "/" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

/**
 * Load featured projects from API
 */
async function loadFeaturedProjects() {
  const container = document.getElementById("featured-list");
  if (!container) return;

  try {
    const response = await fetch("/api/projects");
    if (!response.ok) throw new Error("Failed to fetch projects");

    const { data: projects } = await response.json();

    // Display first 3 projects
    const featured = projects.slice(0, 3);

    container.innerHTML = featured.map(project => `
      <article class="featured-project">
        <div class="project-icon">${project.image}</div>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <div class="project-tags">
          ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
        </div>
        <div class="project-actions">
          <a href="${project.github}" target="_blank" class="link-btn">View →</a>
        </div>
      </article>
    `).join("");
  } catch (error) {
    console.error("Error loading projects:", error);
    container.innerHTML = '<p>Failed to load projects. Try again later.</p>';
  }
}

/**
 * Smooth scroll behavior
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href !== "#") {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
});

      }
    });

    if (!response.ok) {
      throw new Error("Failed to load repositories");
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories) || repositories.length === 0) {
      status.textContent = "No public repositories available right now.";
      return;
    }

    repoGrid.innerHTML = "";
    repositories.forEach((repo) => {
      const card = document.createElement("article");
      card.className = "repo-card";

      const updatedDate = new Date(repo.updated_at).toLocaleDateString();
      const language = repo.language || "Mixed";
      const description = repo.description || "No description provided.";

      card.innerHTML = `
        <div class="repo-title">
          <h4>${escapeHTML(repo.name)}</h4>
          ${repo.fork ? '<span class="repo-fork">Fork</span>' : ""}
        </div>
        <p class="repo-desc">${escapeHTML(description)}</p>
        <div class="repo-meta">
          <span>${escapeHTML(language)}</span>
          <span>★ ${repo.stargazers_count}</span>
          <span>${updatedDate}</span>
        </div>
        <a class="repo-link" href="${repo.html_url}" target="_blank" rel="noopener noreferrer">View Repository →</a>
      `;

      repoGrid.appendChild(card);
    });

    status.textContent = "Synced from GitHub API.";
  } catch (error) {
    status.textContent = "Couldn’t load repositories right now. Please try again later.";
    console.error(error);
  }
}

async function loadFeaturedRepository() {
  const nameEl = document.getElementById("featured-repo-name");
  const descriptionEl = document.getElementById("featured-repo-description");
  const techEl = document.getElementById("featured-repo-tech");
  const linkEl = document.getElementById("featured-repo-link");

  if (!nameEl || !descriptionEl || !techEl || !linkEl) {
    return;
  }

  const username = "laghzal49";
  const repositoryName = "mazegen";
  const endpoint = `https://api.github.com/repos/${username}/${repositoryName}`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/vnd.github+json"
      }
    });

    if (!response.ok) {
      throw new Error("Failed to load featured repository");
    }

    const repo = await response.json();

    nameEl.textContent = repo.name || repositoryName;
    descriptionEl.textContent = repo.description || "No description provided yet.";

    const language = repo.language || "Mixed";
    const stars = Number.isFinite(repo.stargazers_count) ? repo.stargazers_count : 0;
    techEl.textContent = `${language} • ★ ${stars} • Updated ${new Date(repo.updated_at).toLocaleDateString()}`;

    if (repo.html_url) {
      linkEl.href = repo.html_url;
    }
  } catch (error) {
    console.error(error);
  }
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}