const roles = [
  "build low-level software",
  "design efficient architectures",
  "ship clean and reliable code"
];

document.addEventListener("DOMContentLoaded", () => {
  initializeTypewriter();
  initializeRevealOnScroll();
  initializeMobileMenu();
  initializeActiveSectionTracking();
  loadGitHubRepositories();
});

function initializeTypewriter() {
  const target = document.getElementById("typed-role");
  if (!target) {
    return;
  }

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

    window.setTimeout(tick, timeout);
  };

  tick();
}

function initializeRevealOnScroll() {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach((element) => observer.observe(element));
}

function initializeMobileMenu() {
  const navToggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!navToggle || !nav) {
    return;
  }

  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initializeActiveSectionTracking() {
  const links = [...document.querySelectorAll(".site-nav a")];
  if (!links.length) {
    return;
  }

  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  const hasPageLinks = links.some((link) => {
    const href = link.getAttribute("href") || "";
    return href.endsWith(".html");
  });

  if (hasPageLinks) {
    links.forEach((link) => {
      const href = link.getAttribute("href") || "";
      const linkPath = href.split("/").pop();
      const isHomeAlias = currentPath === "" && (linkPath === "index.html" || href === "/");
      link.classList.toggle("active", linkPath === currentPath || isHomeAlias);
    });
    return;
  }

  const sections = links
    .map((link) => {
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#")) {
        return null;
      }
      return document.querySelector(href);
    })
    .filter(Boolean);

  if (!sections.length) {
    return;
  }

  const updateActive = () => {
    const scrollPosition = window.scrollY + 120;

    let currentSectionId = "";
    sections.forEach((section) => {
      if (section.offsetTop <= scrollPosition) {
        currentSectionId = section.id;
      }
    });

    links.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${currentSectionId}`;
      link.classList.toggle("active", isActive);
    });
  };

  window.addEventListener("scroll", updateActive, { passive: true });
  updateActive();
}

async function loadGitHubRepositories() {
  const repoGrid = document.getElementById("repo-grid");
  const status = document.getElementById("repo-status");

  if (!repoGrid || !status) {
    return;
  }

  const username = "laghzal49";
  const endpoint = `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`;

  try {
    const response = await fetch(endpoint, {
      headers: {
        Accept: "application/vnd.github+json"
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

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}