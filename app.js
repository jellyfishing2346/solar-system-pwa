// DOM elements
const canvas = document.getElementById('solarCanvas');
const ctx = canvas.getContext('2d');
const planetTitle = document.getElementById('planetTitle');
const planetDescription = document.getElementById('planetDescription');
const planetAudio = document.getElementById('planetAudio');
const planetMenu = document.getElementById('planetMenu');
// Removed duplicate declaration of installBtn

// App data
let solarData = [];
let currentPlanet = null;

// Load data from JSON
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    solarData = data.solarSystem;
    createMenu();
  })
  .catch(error => console.error('Error loading data:', error));

// Create planet menu
function createMenu() {
  planetMenu.innerHTML = '';
  solarData.forEach(planet => {
    const btn = document.createElement('button');
    btn.className = 'planet-btn';
    btn.textContent = planet.title;
    btn.addEventListener('click', () => showPlanet(planet));
    planetMenu.appendChild(btn);
  });
}

// Display planet information
function showPlanet(planet) {
  currentPlanet = planet;
  planetTitle.textContent = planet.title;
  planetDescription.textContent = planet.description;
  planetAudio.src = planet.audio;
  
  drawPlanet(planet);
}

// Draw planet on canvas
function drawPlanet(planet) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw stars background
  drawStars();
  
  // Draw the selected planet
  const img = new Image();
  img.onload = function() {
    const size = Math.min(canvas.width, canvas.height) * 0.6;
    const x = canvas.width / 2 - size / 2;
    const y = canvas.height / 2 - size / 2;
    ctx.drawImage(img, x, y, size, size);
  };
  img.src = planet.image;
}

// Draw stars in background
function drawStars() {
  ctx.fillStyle = 'white';
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 1.5;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// PWA Installation
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

// Hide the install button initially
installBtn.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('beforeinstallprompt event triggered');
  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  // Show the install button
  installBtn.style.display = 'block';
  
  // Optional: Log the event for debugging
  console.log('Deferred prompt stored:', deferredPrompt);
});

installBtn.addEventListener('click', async () => {
  console.log('Install button clicked');
  if (deferredPrompt) {
    console.log('Showing install prompt');
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // Hide the install button whether they accepted or dismissed
    installBtn.style.display = 'none';
    
    // We've used the prompt, and can't use it again
    deferredPrompt = null;
    
    // Optional: Track the installation
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      // You might want to track installations in analytics here
    } else {
      console.log('User dismissed the install prompt');
    }
  } else {
    console.log('No deferred prompt available');
  }
});

// Track successful installation
window.addEventListener('appinstalled', () => {
  console.log('PWA was successfully installed');
  installBtn.style.display = 'none';
  // You might want to track installations in analytics here
});

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful');
      })
      .catch(err => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}