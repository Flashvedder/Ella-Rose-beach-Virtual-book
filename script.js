const videoElement = document.getElementById('story-video');
const micButton = document.getElementById('mic-btn');
const stanzaDisplay = document.getElementById('stanza-display');

// Check for browser Speech Recognition API support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    micButton.addEventListener('click', () => {
        try {
            recognition.start();
            micButton.textContent = "Listening... Read your line 🎙️";
            micButton.style.backgroundColor = "#ff9800";
        } catch (e) {
            console.log("Recognition error:", e);
        }
    });

    recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript.trim().toLowerCase();
        console.log("Heard:", speechResult);

        // Keyword-based matching so it's super easy to trigger
        if (speechResult.includes("sand") || speechResult.includes("shells")) {
            videoElement.src = "sand.mp4";
            videoElement.play();
            stanzaDisplay.innerHTML = "Sand and shells,<br>And wiggly toes<br>Amid sea glass,<br>Arranged in rows.";
        } 
        else if (speechResult.includes("castle") || speechResult.includes("queen")) {
            videoElement.src = "castle.mp4";
            videoElement.play();
            stanzaDisplay.innerHTML = "Ella builds castles<br>Fit for a queen,<br>Packed dense with sand,<br>So they will not lean.";
        } 
        else if (speechResult.includes("ice cream") || speechResult.includes("melon") || speechResult.includes("cone")) {
            videoElement.src = "icecream.mp4";
            videoElement.play();
            stanzaDisplay.innerHTML = "Snacking on melons<br>And ice-cream cones,<br>Frosty smoothies<br>With blueberry scones.";
        } else {
            stanzaDisplay.innerHTML = `Heard: "${speechResult}"<br>Try saying "sand", "castle", or "ice cream"!`;
        }

        // Reset button state
        micButton.textContent = "🎙️ Start Reading";
        micButton.style.backgroundColor = "#4CAF50";
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        micButton.textContent = "Try Again 🎙️";
        micButton.style.backgroundColor = "#4CAF50";
    };

    recognition.onend = () => {
        micButton.textContent = "🎙️ Start Reading";
        micButton.style.backgroundColor = "#4CAF50";
    };

} else {
    micButton.textContent = "Speech Not Supported in Browser";
    micButton.disabled = true;
}
