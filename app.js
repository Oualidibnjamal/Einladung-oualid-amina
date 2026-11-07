const welcomeScreen = document.getElementById('welcome-screen');
const videoScreen = document.getElementById('video-screen');
const invitationCard = document.getElementById('invitation-card');

const openBtn = document.getElementById('open-btn');
const skipBtn = document.getElementById('skip-btn');
const introVideo = document.getElementById('intro-video');

const bgMusic = document.getElementById('bg-music');
const musicToggleBtn = document.getElementById('music-toggle');

let transitionStarted = false;
let ballroomEntered = false;

// Hilfsfunktion: Regelt die Musiklautstärke butterweich hoch oder runter
function fadeVolumeTo(targetVolume, durationMs) {
  const startVolume = bgMusic.volume;
  const diff = targetVolume - startVolume;
  const steps = 20;
  const stepTime = durationMs / steps;
  let currentStep = 0;

  const interval = setInterval(() => {
    currentStep++;
    const newVol = startVolume + (diff * (currentStep / steps));
    bgMusic.volume = Math.max(0, Math.min(1, newVol));

    if (currentStep >= steps) {
      clearInterval(interval);
    }
  }, stepTime);
}

// 1. Klick auf das Wachssiegel ("Einladung öffnen")
openBtn.addEventListener('click', () => {
  welcomeScreen.classList.add('hidden');
  videoScreen.classList.remove('hidden');

  // Im Innenhof startet die Musik erst dezent im Hintergrund (20%)
  musicToggleBtn.classList.remove('hidden');
  bgMusic.volume = 0.20;
  bgMusic.play().catch(() => {
    musicToggleBtn.textContent = '🔇';
  });

  // Video starten
  introVideo.play().catch((error) => {
    console.error('Video-Fehler:', error);
    showInvitationCard();
  });
});

// 2. Beim Durchflug durch das goldene Tor (Sekunde 3.4) öffnet sich der Klang im Festsaal!
introVideo.addEventListener('timeupdate', () => {
  if (introVideo.currentTime >= 3.4 && !ballroomEntered && !transitionStarted) {
    ballroomEntered = true;
    // Schwillt beim Eintritt in den Saal sanft von 20% auf 65% an
    fadeVolumeTo(0.65, 900);
  }
});

// 3. Übergang vom Video zur scrollbaren Einladungskarte
function showInvitationCard() {
  if (transitionStarted) return;
  transitionStarted = true;

  // Für das entspannte Lesen auf der HTML-Karte sanft auf 35% absenken
  if (!bgMusic.paused) {
    fadeVolumeTo(0.35, 1000);
  }

  introVideo.pause();
  videoScreen.classList.add('fade-out');

  setTimeout(() => {
    videoScreen.classList.add('hidden');
    invitationCard.classList.remove('hidden');

    setTimeout(() => {
      invitationCard.classList.add('visible');
    }, 50);
  }, 800);
}

// 4. Automatisch zur Karte überblenden, sobald das Video zu Ende ist
introVideo.addEventListener('ended', showInvitationCard);

// 5. Oder wenn man auf "Überspringen" klickt
skipBtn.addEventListener('click', showInvitationCard);

// 6. Live-Countdown (30. Oktober 2027 um 17:30 Uhr)
const weddingDate = new Date('2027-10-30T17:30:00').getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  if (distance <= 0) return;

  document.getElementById('days').textContent = Math.floor(distance / (1000 * 60 * 60 * 24));
  document.getElementById('hours').textContent = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  document.getElementById('minutes').textContent = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  document.getElementById('seconds').textContent = Math.floor((distance % (1000 * 60)) / 1000);
}

setInterval(updateCountdown, 1000);
updateCountdown();

// 7. Scroll-Reveal mit dem IntersectionObserver
const revealElements = document.querySelectorAll('.reveal');

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, {
  threshold: 0.15
});

revealElements.forEach((section) => {
  scrollObserver.observe(section);
});

// 8. Intelligenter WhatsApp-Zusage-Generator + Link-Personalisierung
const guestNameInput = document.getElementById('guest-name');
const guestStatusSelect = document.getElementById('guest-status');
const guestCountSelect = document.getElementById('guest-count');
const guestMessageInput = document.getElementById('guest-message');
const personalGreeting = document.getElementById('personal-greeting');
const rsvpBtn = document.getElementById('rsvp-btn');

const urlParams = new URLSearchParams(window.location.search);
const invitedGuest = urlParams.get('gast');

if (invitedGuest) {
  personalGreeting.textContent = `Exklusive Einladung für ${invitedGuest}`;
  guestNameInput.value = invitedGuest;
}

guestStatusSelect.addEventListener('change', () => {
  if (guestStatusSelect.value === 'absage') {
    guestCountSelect.classList.add('hidden');
  } else {
    guestCountSelect.classList.remove('hidden');
  }
});

rsvpBtn.addEventListener('click', () => {
  const name = guestNameInput.value.trim();
  const status = guestStatusSelect.value;
  const count = guestCountSelect.value;
  const customNote = guestMessageInput.value.trim();

  if (name === '') {
    guestNameInput.classList.add('input-error');
    guestNameInput.placeholder = 'Bitte tragt hier zuerst euren Namen ein!';
    guestNameInput.focus();
    return;
  }

  guestNameInput.classList.remove('input-error');

  let message = '';
  if (status === 'zusage') {
    message = `Salam liebe Amina & lieber Oualid! ✨\n\nWir freuen uns riesig und sind bei eurer Hochzeit gerne dabei!\n\n👤 Name: ${name}\n👥 Anzahl: ${count}`;
  } else {
    message = `Salam liebe Amina & lieber Oualid! 🤍\n\nLeider können wir an eurer Hochzeit nicht teilnehmen. Wir wünschen euch von Herzen alles Gute und Allahs Segen!\n\n👤 Name: ${name}`;
  }

  if (customNote !== '') {
    message += `\n\n🤲 Nachricht / Dua:\n„${customNote}“`;
  }

  const phoneNumber = '491731652537';

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
});

// 9. Klick auf den schwebenden Musik-Button oben rechts (An / Aus)
musicToggleBtn.addEventListener('click', () => {
  if (bgMusic.paused) {
    bgMusic.play();
    musicToggleBtn.textContent = '🔊';
  } else {
    bgMusic.pause();
    musicToggleBtn.textContent = '🔇';
  }
});

// 10. 1-Klick Kalender-Export (.ics Datei passend zum 30. Oktober 2027)
const calendarBtn = document.getElementById('calendar-btn');

calendarBtn.addEventListener('click', () => {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    'SUMMARY:Hochzeit von Oualid & Amina 💍',
    'DTSTART:20271030T173000',
    'DTEND:20271031T020000',
    'LOCATION:Festsaal Walima, Keppentaler Weg 9, 55286 Wörrstadt',
    'DESCRIPTION:Wir freuen uns riesig, diesen besonderen Tag mit euch zu feiern!',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'hochzeit-oualid-amina.ics';
  
  link.click();
});