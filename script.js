// --- INTERACTIVE PARTICLES CONFIGURATION ---
particlesJS("particles-js", {
  "particles": {
    "number": { "value": 60, "density": { "enable": true, "value_area": 800 } },
    "color": { "value": "#00ff41" },
    "shape": { "type": "circle" },
    "opacity": { "value": 0.3, "random": false },
    "size": { "value": 3, "random": true },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#00ff41",
      "opacity": 0.2,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 2,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": { "enable": true, "mode": "grab" },
      "onclick": { "enable": true, "mode": "push" },
      "resize": true
    },
    "modes": {
      "grab": { "distance": 140, "line_linked": { "opacity": 0.8 } },
      "push": { "particles_nb": 4 }
    }
  },
  "retina_detect": true
});

// --- SCROLL REVEAL ANIMATION (INTERSECTION OBSERVER) ---
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  const windowHeight = window.innerHeight;
  const elementVisible = 100; // Trigger point

  reveals.forEach((reveal) => {
    const elementTop = reveal.getBoundingClientRect().top;
    if (elementTop < windowHeight - elementVisible) {
      reveal.classList.add('active');
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
// Trigger once on load to show elements already in view
setTimeout(revealOnScroll, 1000);