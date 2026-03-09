# Tarik Laghzal Portfolio

Modern portfolio site with a template-style frontend and a Node.js backend.

## What Is Included

- Responsive multi-page portfolio (Home, About, Projects, Contact)
- Express backend API for projects and contact form
- Live GitHub repositories on the Projects page
- README preview for each repository card (fetched from GitHub API)

## Stack

- Frontend: HTML, CSS, Vanilla JavaScript
- Backend: Node.js, Express
- Data source:
  - Local API endpoints (`/api/projects`, `/api/contact`)
  - GitHub REST API for repos and README excerpts

## Run Locally

1. Install dependencies:
   npm install

2. Start server:
   npm start

3. Open:
   http://localhost:3000

## API Endpoints

- GET `/api/health`
- GET `/api/projects`
- GET `/api/projects/:id`
- POST `/api/contact`

## GitHub Repositories + README Previews

The Projects page calls:

- `GET https://api.github.com/users/laghzal49/repos`
- `GET https://api.github.com/repos/laghzal49/{repo}/readme`

For each repository card, the page displays:

- Name
- Description
- Language
- Stars
- Last updated date
- Short cleaned README excerpt

If GitHub rate-limits requests, the page shows a fallback message.

## Deploy (Koyeb)

Use a Web Service deployment.

- Build command: `npm install`
- Run command: `npm start`
- Health check path: `/api/health`

