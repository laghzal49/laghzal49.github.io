# Tarik Laghzal - Modern Portfolio

A complete, production-ready portfolio website with a modern retro aesthetic, Node.js/Express backend, and responsive design.

## Features

✨ **Modern Design**
- Retro-modern aesthetic with cyan & hot pink color scheme
- Smooth animations and transitions
- Responsive design (mobile-first)
- Dark theme optimized for readability

🚀 **Full-Stack Application**
- Static frontend (HTML/CSS/JavaScript)
- Node.js/Express backend
- REST API for projects and contact forms
- In-memory data storage (can be replaced with database)

📱 **Responsive Pages**
- **Home**: Hero section with terminal effect, featured projects, features grid
- **About**: Biography, skills showcase, expertise breakdown
- **Projects**: All projects grid loaded from API
- **Contact**: Contact form with validation and backend integration

🔧 **Technical Stack**
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express, CORS
- **Typography**: Work Sans, IBM Plex Mono
- **Icons**: Font Awesome v6.5.2

## Project Structure

```
laghzal49.github.io/
├── backend/
│   ├── server.js              # Express server
│   ├── routes/
│   │   ├── projects.js        # Projects API endpoints
│   │   └── contact.js         # Contact form endpoint
│   └── data/
│       ├── projects.js        # Project data
│       └── skills.js          # Skills data
├── index.html                 # Home page
├── about.html                 # About page
├── projects.html              # Projects page
├── contact.html               # Contact page
├── style.css                  # Global styles
├── script.js                  # Frontend logic
├── package.json               # Dependencies
└── .env                       # Environment variables
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```
   Or for production:
   ```bash
   npm start
   ```

3. **Open in browser**
   ```
   http://localhost:3000
   ```

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `GET /api/projects/status/:status` - Filter by status
- `GET /api/projects/me/skills` - Get skills data

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact/messages` - Get all messages (admin)

## Customization

### Update Portfolio Content

**Projects Data** - Edit `backend/data/projects.js`
```javascript
const projects = [
  {
    id: 1,
    title: "Your Project",
    description: "Description here",
    tags: ["Tag1", "Tag2"],
    github: "https://github.com/...",
    image: "🔥",
    status: "completed"
  }
  // Add more projects
];
```

**Skills Data** - Edit `backend/data/skills.js`
```javascript
const skills = {
  languages: [...],
  competencies: [...],
  tools: [...]
};
```

**Hero Content** - Edit `index.html` sections and `script.js` roles array

### Styling

Global CSS variables in `style.css`:
```css
:root {
  --primary: #00d9ff;      /* Main accent color */
  --secondary: #ff006e;    /* Secondary accent */
  --dark-bg: #0a0e1a;      /* Background */
  --text-primary: #e8ecff; /* Main text */
  /* ... more variables */
}
```

## Deployment

### Static Hosting (GitHub Pages)
1. Remove `/backend` directory
2. Push only frontend files
3. Enable GitHub Pages in repository settings

### Full Stack Deployment

**Using Heroku:**
```bash
heroku create your-app-name
git push heroku main
```

**Using Vercel (with serverless functions):**
- Deploy frontend to Vercel
- Deploy backend as serverless functions or separate service

## Performance

- **Lighthouse Score**: Optimized for 90+ scores
- **Page Load**: ~2 seconds on 4G
- **Bundle Size**: Minimal (no heavy frameworks)
- **Accessibility**: ARIA labels, semantic HTML, color contrast optimized

## Browser Support

- Chrome/Edge: Latest
- Firefox: Latest
- Safari: Latest
- Mobile browsers: iOS Safari 12+, Chrome Android

## Contact Integration

The contact form can be integrated with email services:

**Options:**
1. Nodemailer (SMTP)
2. SendGrid API
3. AWS SES
4. Firebase

Update `backend/routes/contact.js` to send emails.

## Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Blog section
- [ ] Dark/Light theme toggle
- [ ] CMS integration
- [ ] Analytics
- [ ] CDN integration

## License

MIT - Feel free to use this template for your own portfolio

## Author

Tarik Laghzal - [GitHub](https://github.com/laghzal49) | [LinkedIn](https://linkedin.com/in/tarik-laghzal-53a132186/)

---

**Built with ❤️ for developers who care about performance and design**
- Dynamic GitHub repositories fetched from the GitHub API
- Accessible external links and semantic structure

## Project Structure

- `index.html` — homepage and portfolio entry point
- `about.html` — profile, strengths, and skill overview
- `projects.html` — featured work and live GitHub repositories
- `contact.html` — contact details and social links
- `style.css` — full visual design, layout, and responsive behavior
- `script.js` — animations, interactions, mobile nav, and GitHub API rendering

## Customization

1. Update your personal links in all HTML pages (`index.html`, `about.html`, `projects.html`, `contact.html`):
	- GitHub
	- LinkedIn
	- Email (`mailto:laghzaltarik0@gmail.com`)
2. Replace the GitHub username in `script.js` if needed.
3. Update page copy and project cards to match your latest work.

## Run Locally

Open `index.html` in your browser.

For best results, use a local server:

- VS Code Live Server extension, or
- `python3 -m http.server` then open `http://localhost:8000`