const videoElement = document.getElementById('story-video');
const micButton = document.getElementById('mic-btn');
const stanzaDisplay = document.getElementById('stanza-display');

// Check for browser Speech Recognition API support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    micButton.addEventListener('click', () => {
        try {
            recognition.start();
            micButton.textContent = "Listening... Speak now 🎙️";
            micButton.style.backgroundColor = "#ff9800";
        } catch (e) {
            console.log("Recognition already active");
        }
    });

    recognition.onresult = (event) => {
        const speechResult = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
        console.log("Heard:", speechResult);

        if (speechResult.includes("plays in the sand") || speechResult.includes("sand and shells")) {
            videoElement.src = "sand.mp4";
            videoElement.play();
            stanzaDisplay.innerHTML = "Sand and shells,<br>And wiggly toes<br>Amid sea glass,<br>Arranged in rows.";
        } 
        else if (speechResult.includes("builds a sand castle") || speechResult.includes("fit for a queen")) {
            videoElement.src = "castle.mp4";
            videoElement.play();
            stanzaDisplay.innerHTML = "Ella builds castles<br>Fit for a queen,<br>Packed dense with sand,<br>So they will not lean.";
        } 
        else if (speechResult.includes("eats an ice cream") || speechResult.includes("snacking on melons")) {
            videoElement.src = "icecream.mp4";
            videoElement.play();
            stanzaDisplay.innerHTML = "Snacking on melons<br>And ice-cream cones,<br>Frosty smoothies<br>With blueberry scones.";
        }
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        micButton.textContent = "Try Again 🎙️";
        micButton.style.backgroundColor = "#4CAF50";
    };

    recognition.onend = () => {
        // Automatically restart listening to keep the app continuous for kids
        try {
            recognition.start();
        } catch (e) {
            // Ignore if already started
        }
    };

} else {
    micButton.textContent = "Speech Not Supported in Browser";
    micButton.disabled = true;
}