const roles = [
  "building efficient systems",
  "designing clean architecture",
  "shipping reliable software"
];

document.addEventListener("DOMContentLoaded", () => {
  initializeTypewriter();
  initializeMobileMenu();
  setupHeaderOnScroll();
  setupNavigation();
  setupSmoothScroll();
  loadFeaturedProjects();
  loadGitHubRepositories();
  setupContactForm();
});

let cachedRepos = [];
let selectedRepoTag = "All";

function initializeTypewriter() {
  const target = document.getElementById("terminal-text");
  if (!target) return;

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const current = roles[roleIndex];
    charIndex += deleting ? -1 : 1;
    target.textContent = current.slice(0, charIndex);

    let delay = deleting ? 35 : 70;

    if (!deleting && charIndex === current.length) {
      deleting = true;
      delay = 1200;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 260;
    }

    window.setTimeout(tick, delay);
  };

  tick();
}

function initializeMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(nav.classList.contains("open")));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function setupHeaderOnScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 24);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function setupNavigation() {
  const links = document.querySelectorAll(".nav-link");
  const path = window.location.pathname.split("/").pop() || "index.html";

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === path) {
      link.classList.add("active");
    }
  });
}

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    });
  });
}

async function loadFeaturedProjects() {
  const container = document.getElementById("featured-list");
  if (!container) return;

  try {
    const response = await fetch("/api/projects");
    if (!response.ok) throw new Error("Backend projects not available");

    const payload = await response.json();
    const projects = Array.isArray(payload.data) ? payload.data.slice(0, 3) : [];

    if (projects.length === 0) {
      container.innerHTML = "<p class=\"empty\">No featured projects yet.</p>";
      return;
    }

    container.innerHTML = projects
      .map(
        (project) => `
          <article class="repo-card">
            <div class="repo-title-row">
              <h3>${escapeHtml(project.title || "Untitled")}</h3>
            </div>
            <p class="repo-desc">${escapeHtml(project.description || "No description")}</p>
            <div class="repo-meta">
              ${(project.tags || [])
                .slice(0, 4)
                .map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`)
                .join("")}
            </div>
            <a class="repo-link" href="${project.github || "#"}" target="_blank" rel="noopener noreferrer">View Repository</a>
          </article>
        `
      )
      .join("");
  } catch (_error) {
    container.innerHTML = "<p class=\"empty\">Backend API unavailable. Check deployment or server status.</p>";
  }
}

async function loadGitHubRepositories() {
  const repoGrid = document.getElementById("repo-grid");
  const status = document.getElementById("repo-status");
  const filterBox = document.getElementById("repo-filters");
  if (!repoGrid || !status) return;

  const username = "laghzal49";

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=9&type=owner`,
      {
        headers: { Accept: "application/vnd.github+json" }
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch repositories");
    }

    const repos = await response.json();
    const filtered = repos.filter((repo) => !repo.fork);

    if (filtered.length === 0) {
      status.textContent = "No public repositories available.";
      return;
    }

    cachedRepos = filtered.slice(0, 12);

    const withReadme = await Promise.all(
      cachedRepos.map(async (repo) => {
        const readmePreview = await getReadmePreview(username, repo.name);
        return { ...repo, readmePreview };
      })
    );

    cachedRepos = withReadme;
    renderRepoFilters(filterBox, cachedRepos);
    renderFilteredRepos(repoGrid, status);
  } catch (error) {
    console.error(error);
    status.textContent = "Could not load GitHub repositories right now.";
    repoGrid.innerHTML = "<p class=\"empty\">Try again in a minute. GitHub API may be rate-limited.</p>";
  }
}

function renderRepoFilters(container, repos) {
  if (!container) return;

  const tags = [
    "All",
    ...Array.from(new Set(repos.map((repo) => repo.language || "Mixed"))).slice(0, 8)
  ];

  container.innerHTML = tags
    .map(
      (tag) =>
        `<button type="button" class="filter-chip ${tag === selectedRepoTag ? "active" : ""}" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`
    )
    .join("");

  container.querySelectorAll(".filter-chip").forEach((button) => {
    button.addEventListener("click", () => {
      selectedRepoTag = button.getAttribute("data-tag") || "All";
      renderRepoFilters(container, repos);

      const grid = document.getElementById("repo-grid");
      const status = document.getElementById("repo-status");
      if (!grid || !status) return;

      renderFilteredRepos(grid, status);
    });
  });
}

function renderFilteredRepos(grid, status) {
  const repos =
    selectedRepoTag === "All"
      ? cachedRepos
      : cachedRepos.filter((repo) => (repo.language || "Mixed") === selectedRepoTag);

  if (repos.length === 0) {
    grid.innerHTML = "<p class=\"empty\">No repositories for this filter yet.</p>";
    status.textContent = `No repositories found for ${selectedRepoTag}.`;
    return;
  }

  grid.innerHTML = repos.map((repo) => renderRepoCard(repo, repo.readmePreview)).join("");
  status.textContent = `Showing ${repos.length} repositories${selectedRepoTag === "All" ? "" : ` in ${selectedRepoTag}`}.`;
}

async function getReadmePreview(username, repoName) {
  try {
    const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/readme`, {
      headers: { Accept: "application/vnd.github+json" }
    });

    if (!response.ok) return "README preview unavailable.";

    const payload = await response.json();
    if (!payload.content) return "README preview unavailable.";

    const text = decodeBase64Utf8(payload.content);
    return normalizeReadme(text);
  } catch (_error) {
    return "README preview unavailable.";
  }
}

function decodeBase64Utf8(value) {
  const cleaned = String(value).replace(/\n/g, "");
  const decoded = atob(cleaned);
  const bytes = Uint8Array.from(decoded, (char) => char.charCodeAt(0));
  return new TextDecoder("utf-8").decode(bytes);
}

function normalizeReadme(markdown) {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/^#+\s+/gm, "")
    .replace(/^[>*-]\s+/gm, "")
    .replace(/\r/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plain) return "README preview unavailable.";

  return `${plain.slice(0, 180)}${plain.length > 180 ? "..." : ""}`;
}

function renderRepoCard(repo, readmePreview) {
  const language = repo.language || "Mixed";
  const stars = Number.isFinite(repo.stargazers_count) ? repo.stargazers_count : 0;
  const updatedAt = new Date(repo.updated_at).toLocaleDateString();
  const description = repo.description || "No description provided.";

  return `
    <article class="repo-card">
      <div class="repo-title-row">
        <h3>${escapeHtml(repo.name)}</h3>
      </div>
      <p class="repo-desc">${escapeHtml(description)}</p>
      <p class="repo-readme"><strong>README:</strong> ${escapeHtml(readmePreview)}</p>
      <div class="repo-meta">
        <span class="pill">${escapeHtml(language)}</span>
        <span class="pill">Stars ${stars}</span>
        <span class="pill">Updated ${updatedAt}</span>
      </div>
      <a class="repo-link" href="${repo.html_url}" target="_blank" rel="noopener noreferrer">Open on GitHub</a>
    </article>
  `;
}

function setupContactForm() {
  const form = document.getElementById("contact-form");
  const statusBox = document.getElementById("form-status");
  if (!form || !statusBox) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
      name: document.getElementById("name")?.value?.trim() || "",
      email: document.getElementById("email")?.value?.trim() || "",
      subject: document.getElementById("subject")?.value?.trim() || "",
      message: document.getElementById("message")?.value?.trim() || ""
    };

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      setFormStatus(statusBox, "Please fill in all fields.", "error");
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      form.reset();
      setFormStatus(statusBox, "Message sent successfully.", "success");
    } catch (_error) {
      setFormStatus(statusBox, "Could not send the message right now.", "error");
    }
  });
}

function setFormStatus(node, message, variant) {
  node.textContent = message;
  node.classList.remove("success", "error");
  node.classList.add(variant);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
