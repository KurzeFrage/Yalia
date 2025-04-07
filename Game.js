document.getElementById('send-message').addEventListener('click', function() {
    alert('Deine Nachricht wurde mit viel Liebe empfangen! ❤️');
});

// No button event - shows alternative screen when clicked successfully
document
  .getElementById("noBtn")
  .addEventListener("click", function () {
    // Zeige den alternativen Screen sofort
    document.getElementById("final-screen").classList.remove("active");
    document.getElementById("alternative-screen").classList.add("active");
  });

  // Set up correct answer buttons
document.querySelectorAll(".correct-answer").forEach((button) => {
  button.addEventListener("click", function () {
    const questionNum = this.dataset.question;
    document.getElementById("message" + questionNum).style.display = "block";
    correctAnswers++;

    // Längere Verzögerung (4 Sekunden) einbauen, damit die Nachricht gelesen werden kann
    setTimeout(() => {
      showScreen(parseInt(questionNum) + 1);
      updateProgress((parseInt(questionNum) + 1) * 25);
    }, 4000); // Von 1500 auf 4000 Millisekunden erhöht (4 Sekunden)
  });
});
// Füge diese Variablen und Funktionen zu deinem JavaScript-Code hinzu
let userResponse = null; // Speichert die Ja/Nein-Antwort

// Speichert die Antwort lokal ohne zu senden
document.getElementById("yesBtn").addEventListener("click", function() {
  document.getElementById("celebration").style.display = "block";
  document.getElementById("success-message").style.display = "block";
  document.getElementById("yesBtn").style.display = "none";
  document.getElementById("noBtn").style.display = "none";
  createHearts();
  
  // Speichere die Antwort lokal statt sofort zu senden
  userResponse = "JA";
});

document.getElementById("noBtn").addEventListener("click", function() {
  // Zeige den alternativen Screen an
  document.getElementById("final-screen").classList.remove("active");
  document.getElementById("alternative-screen").classList.add("active");
  
  // Speichere die Antwort lokal statt sofort zu senden
  userResponse = "NEIN";
  
  // Für Nein brauchen wir eigentlich kein Formular, da es keine weitere Nachricht gibt
  // Wir könnten es aber dennoch verzögert senden
  const neinForm = document.getElementById("nein-form");
  
  // Erstelle einen Button zum Zurück zur Startseite
  const returnButton = document.createElement("button");
  returnButton.className = "btn";
  returnButton.textContent = "Zurück zur Startseite";
  returnButton.style.marginTop = "20px";
  returnButton.addEventListener("click", function() {
    // Sende das Formular bei Klick auf "Zurück zur Startseite"
    neinForm.submit();
  });
  
  // Füge den Button zum alternativen Screen hinzu
  document.getElementById("alternative-screen").appendChild(returnButton);
});

// Modifiziere das Nachrichtenformular-Submit-Event
document.querySelector("#success-message form").addEventListener("submit", function(e) {
  e.preventDefault(); // Verhindere die normale Übermittlung
  
  // Füge die Ja/Nein-Antwort zum Nachrichtenformular hinzu
  const hiddenInput = document.createElement("input");
  hiddenInput.type = "hidden";
  hiddenInput.name = "antwort";
  hiddenInput.value = userResponse;
  this.appendChild(hiddenInput);
  
  // Jetzt das Formular regulär absenden
  this.submit();
});

// Sende das Formular auch beim Schließen der Seite, falls eine Antwort gegeben wurde
window.addEventListener("beforeunload", function(e) {
  if (userResponse && !document.querySelector("#success-message form").classList.contains("submitted")) {
    // Wenn wir eine Antwort haben aber noch kein Formular abgeschickt wurde
    const form = userResponse === "JA" ? document.getElementById("ja-form") : document.getElementById("nein-form");
    
    // Benutze sendBeacon für zuverlässigere Übermittlung beim Schließen
    const formData = new FormData(form);
    navigator.sendBeacon(form.action, formData);
  }
});

// Markiere das Formular als abgeschickt, wenn es gesendet wurde
document.querySelector("#success-message form").addEventListener("submit", function() {
  this.classList.add("submitted");
});
