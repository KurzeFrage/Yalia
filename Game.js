// Game state variables
let currentScreen = 0;
const screens = [
  "start-screen",
  "quiz1",
  "quiz2",
  "quiz3",
  "final-screen",
];
let correctAnswers = 0;
let userResponse = null; // Speichert die Ja/Nein-Antwort
let formSubmitted = false; // Wichtig: Diese Variable fehlte in deinem Code

// Initialize the game when the document is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Start button event
  document
    .getElementById("start-button")
    .addEventListener("click", function () {
      showScreen(1);
      updateProgress(25);
    });

  // Set up wrong answer buttons
  document.querySelectorAll(".wrong-answer").forEach((button) => {
    button.addEventListener("click", function () {
      alert("Nicht ganz... Versuch's nochmal! 😉");
    });
  });

  // Set up correct answer buttons
  document.querySelectorAll(".correct-answer").forEach((button) => {
    button.addEventListener("click", function () {
      const questionNum = this.dataset.question;
      document.getElementById("message" + questionNum).style.display =
        "block";
      correctAnswers++;

      // Längere Verzögerung (4 Sekunden) einbauen, damit die Nachricht gelesen werden kann
      setTimeout(() => {
        showScreen(parseInt(questionNum) + 1);
        updateProgress((parseInt(questionNum) + 1) * 25);
      }, 4000); // Von 1500 auf 4000 Millisekunden erhöht (4 Sekunden)
    });
  });

  // Yes button event - Speichert die Antwort lokal statt sofort zu senden
  document
    .getElementById("yesBtn")
    .addEventListener("click", function () {
      document.getElementById("celebration").style.display = "block";
      document.getElementById("success-message").style.display = "block";
      document.getElementById("yesBtn").style.display = "none";
      document.getElementById("noBtn").style.display = "none";
      createHearts();
      
      // Speichere die Antwort lokal
      userResponse = "JA";
    });

  // No button event
  document.getElementById("noBtn").addEventListener("click", function () {
    // Zeige den alternativen Screen an
    document.getElementById("final-screen").classList.remove("active");
    document.getElementById("alternative-screen").classList.add("active");
    
    // Speichere die Antwort lokal
    userResponse = "NEIN";
  });
  
  // Zurück zur Startseite Button
  document.getElementById("returnBtn").addEventListener("click", function() {
    if (!formSubmitted && userResponse === "NEIN") {
      // Sende das Nein-Formular
      document.getElementById("nein-form").submit();
      formSubmitted = true;
    }
    
    // Optional: Zurück zur Startseite oder Seite neu laden
    window.location.reload();
  });

  // Modifiziere das Nachrichtenformular-Submit-Event
  document.getElementById("messageForm").addEventListener("submit", function(e) {
    if (!formSubmitted) {
      e.preventDefault(); // Verhindere die normale Übermittlung
      
      // Füge die Ja/Nein-Antwort zum Nachrichtenformular hinzu
      const hiddenInput = document.createElement("input");
      hiddenInput.type = "hidden";
      hiddenInput.name = "antwort";
      hiddenInput.value = userResponse; // Wird "JA" sein, wenn wir hier sind
      this.appendChild(hiddenInput);
      
      // Markiere als abgeschickt
      formSubmitted = true;
      
      // Bestätigungsmeldung anzeigen
      alert('Deine Nachricht wurde mit viel Liebe empfangen! ❤️');
      
      // Jetzt das Formular regulär absenden
      this.submit();
    }
  });
});

// Show a specific screen
function showScreen(index) {
  document
    .getElementById(screens[currentScreen])
    .classList.remove("active");
  currentScreen = index;
  document.getElementById(screens[currentScreen]).classList.add("active");
}

// Update progress bar
function updateProgress(percentage) {
  document.getElementById("progress").style.width = percentage + "%";
}

// Create falling hearts animation
function createHearts() {
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const heart = document.createElement("div");
      heart.classList.add("heart");
      heart.style.left = Math.random() * 100 + "%";
      heart.style.animationDuration = Math.random() * 3 + 2 + "s";
      document.getElementById("celebration").appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 5000);
    }, i * 100);
  }
}

// ====== NEUE FUNKTIONALITÄT FÜR MOBILE ======

// Variablen für die neue Funktionalität
let isPageActive = true;
let inactivityTimer;
let visibilityTimer;
const INACTIVITY_TIMEOUT = 60000; // 60 Sekunden Inaktivität
const VISIBILITY_CHECK_INTERVAL = 5000; // Prüfe alle 5 Sekunden, ob die Seite sichtbar ist

// Funktion zum Senden des Formulars basierend auf der Antwort
function sendResponseForm() {
  if (userResponse && !formSubmitted) {
    const form = userResponse === "JA" ? document.getElementById("ja-form") : document.getElementById("nein-form");
    
    // Bei JA-Antwort: Prüfe, ob eine Nachricht eingegeben wurde
    if (userResponse === "JA") {
      const messageTextarea = document.querySelector("#messageForm textarea");
      if (messageTextarea && messageTextarea.value.trim()) {
        // Wenn ja, füge sie zum JA-Formular hinzu
        const messageInput = document.createElement("input");
        messageInput.type = "hidden";
        messageInput.name = "message";
        messageInput.value = "Die Person hat JA gewählt! ❤️\n\nNachricht: " + messageTextarea.value;
        form.appendChild(messageInput);
      }
    }
    
    // Sende das Formular ab
    form.submit();
    formSubmitted = true;
    console.log("Formular wurde wegen Inaktivität/Sichtbarkeit gesendet.");
  }
}

// Funktion zum Zurücksetzen des Inaktivitäts-Timers
function resetInactivityTimer() {
  if (userResponse && !formSubmitted) {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      console.log("Inaktivitäts-Timeout ausgelöst");
      sendResponseForm();
    }, INACTIVITY_TIMEOUT);
  }
}

// Überwache Benutzeraktivitäten - Füge diese nach DOMContentLoaded hinzu
document.addEventListener("DOMContentLoaded", function() {
  document.addEventListener("mousemove", resetInactivityTimer);
  document.addEventListener("keypress", resetInactivityTimer);
  document.addEventListener("touchstart", resetInactivityTimer);
  document.addEventListener("click", resetInactivityTimer);
});

// Überwache Sichtbarkeit der Seite
document.addEventListener("visibilitychange", function() {
  if (document.visibilityState === "hidden") {
    // Seite ist jetzt im Hintergrund (App-Wechsel auf Mobilgeräten)
    isPageActive = false;
    
    // Wenn eine Antwort ausgewählt wurde, sende das Formular nach kurzer Verzögerung
    if (userResponse && !formSubmitted) {
      clearTimeout(visibilityTimer);
      visibilityTimer = setTimeout(() => {
        if (!isPageActive && !formSubmitted) {
          console.log("Formular wegen Unsichtbarkeit gesendet");
          sendResponseForm();
        }
      }, 3000); // 3 Sekunden, nachdem der Nutzer die App verlassen hat
    }
  } else {
    // Seite ist wieder sichtbar
    isPageActive = true;
    clearTimeout(visibilityTimer);
  }
});

// Regelmäßige Prüfung der Sichtbarkeit (Backup-Methode)
setInterval(() => {
  if (userResponse && !formSubmitted) {
    if (!document.hasFocus()) {
      console.log("Regelmäßige Prüfung: Seite ist nicht im Fokus");
      if (!isPageActive) {
        sendResponseForm();
      }
    }
  }
}, VISIBILITY_CHECK_INTERVAL);

// Starte den Inaktivitäts-Timer, wenn der Benutzer eine Antwort gegeben hat
document.getElementById("yesBtn").addEventListener("click", function() {
  // Starte den Timer erst nach der Antwort
  resetInactivityTimer();
});

document.getElementById("noBtn").addEventListener("click", function() {
  // Starte den Timer erst nach der Antwort
  resetInactivityTimer();
});

// Sende Formular beim Schließen der Seite (für Desktop-Geräte)
window.addEventListener("beforeunload", function() {
  if (userResponse && !formSubmitted) {
    sendResponseForm();
  }
});