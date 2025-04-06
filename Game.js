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