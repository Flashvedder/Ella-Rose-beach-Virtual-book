const videoElement = document.getElementById('story-video');
const micButton = document.getElementById('mic-btn');
const stanzaDisplay = document.getElementById('stanza-display');

// Track which part of the story we are on (0 = sand, 1 = castle, 2 = ice cream)
let storyStep = 0;

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
            micButton.textContent = "Listening... Read the current line 🎙️";
            micButton.style.backgroundColor = "#ff9800";
        } catch (e) {
            console.log("Recognition error:", e);
        }
    });

    recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript.trim().toLowerCase();
        console.log("Heard:", speechResult, "at step:", storyStep);

        if (storyStep === 0) {
            // Step 1: Looking for Sand
            if (speechResult.includes("sand") || speechResult.includes("shells")) {
                videoElement.src = "sand.mp4";
                videoElement.play();
                stanzaDisplay.innerHTML = "Sand and shells,<br>And wiggly toes<br>Amid sea glass,<br>Arranged in rows.";
                storyStep = 1; // Advance to next step
                micButton.textContent = "Next: Read the Castle line 🎙️";
            } else {
                stanzaDisplay.innerHTML = `Heard: "${speechResult}"<br><b>Tip:</b> Read the sand stanza first!`;
            }
        } 
        else if (storyStep === 1) {
            // Step 2: Looking for Castle
            if (speechResult.includes("castle") || speechResult.includes("queen")) {
                videoElement.src = "castle.mp4";
                videoElement.play();
                stanzaDisplay.innerHTML = "Ella builds castles<br>Fit for a queen,<br>Packed dense with sand,<br>So they will not lean.";
                storyStep = 2; // Advance to next step
                micButton.textContent = "Next: Read the Ice Cream line 🎙️";
            } else {
                stanzaDisplay.innerHTML = `Heard: "${speechResult}"<br><b>Tip:</b> Read the castle stanza next!`;
            }
        } 
        else if (storyStep === 2) {
            // Step 3: Looking for Ice Cream
            if (speechResult.includes("ice cream") || speechResult.includes("melon") || speechResult.includes("cone")) {
                videoElement.src = "icecream.mp4";
                videoElement.play();
                stanzaDisplay.innerHTML = "Snacking on melons<br>And ice-cream cones,<br>Frosty smoothies<br>With blueberry scones.";
                storyStep = 0; // Loop back to start or finish
                micButton.textContent = "Story Complete! Tap to replay 🎙️";
            } else {
                stanzaDisplay.innerHTML = `Heard: "${speechResult}"<br><b>Tip:</b> Read the ice cream stanza to finish!`;
            }
        }

        // Reset button color state (keeping custom text prompt)
        micButton.style.backgroundColor = "#4CAF50";
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        micButton.textContent = "Try Again 🎙️";
        micButton.style.backgroundColor = "#4CAF50";
    };

    recognition.onend = () => {
        if (micButton.style.backgroundColor !== "rgb(255, 152, 0)") {
            // Only reset button if it's not actively waiting for a manual click change
        }
    };

} else {
    micButton.textContent = "Speech Not Supported in Browser";
    micButton.disabled = true;
}
