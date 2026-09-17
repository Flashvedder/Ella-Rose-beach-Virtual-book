const videoElement = document.getElementById('story-video');
const micButton = document.getElementById('mic-btn');
const stanzaDisplay = document.getElementById('stanza-display');

// Track the step in the story (0 = Beach intro, 1 = Sand Castle, 2 = Ice Cream)
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
            micButton.textContent = "Listening... Speak now 🎙️";
            micButton.style.backgroundColor = "#ff9800";
        } catch (e) {
            console.log("Recognition error:", e);
        }
    });

    recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript.trim().toLowerCase();
        console.log("Heard:", speechResult, "at step:", storyStep);

        if (storyStep === 0) {
            // Step 1: Read opening line -> Switches to Sand/Beach video
            if (speechResult.includes("beach") || speechResult.includes("ella rose")) {
                videoElement.src = "sand.mp4";
                videoElement.load();
                videoElement.play();
                stanzaDisplay.innerHTML = "Sand and shells,<br>And wiggly toes<br>Amid sea glass,<br>Arranged in rows.";
                storyStep = 1; // Move to next step
                micButton.textContent = "Next: Read Sand Castle line 🎙️";
            } else {
                stanzaDisplay.innerHTML = `Heard: "${speechResult}"<br><b>Tip:</b> Say "Ella Rose goes to the beach"`;
            }
        } 
        else if (storyStep === 1) {
            // Step 2: Read Castle line -> Switches to Castle video
            if (speechResult.includes("castle") || speechResult.includes("build")) {
                videoElement.src = "castle.mp4";
                videoElement.load();
                videoElement.play();
                stanzaDisplay.innerHTML = "Ella builds castles<br>Fit for a queen,<br>Packed dense with sand,<br>So they will not lean.";
                storyStep = 2; // Move to next step
                micButton.textContent = "Next: Read Ice Cream line 🎙️";
            } else {
                stanzaDisplay.innerHTML = `Heard: "${speechResult}"<br><b>Tip:</b> Say "Ella Rose build a sand castle"`;
            }
        } 
        else if (storyStep === 2) {
            // Step 3: Final line -> Switches to Ice Cream video
            if (speechResult.includes("ice cream") || speechResult.includes("melon") || speechResult.includes("cone")) {
                videoElement.src = "icecream.mp4";
                videoElement.load();
                videoElement.play();
                stanzaDisplay.innerHTML = "Snacking on melons<br>And ice-cream cones,<br>Frosty smoothies<br>With blueberry scones.";
                storyStep = 0; // Loop back to start if desired
                micButton.textContent = "Story Complete! Tap to replay 🎙️";
            } else {
                stanzaDisplay.innerHTML = `Heard: "${speechResult}"<br><b>Tip:</b> Say the final stanza to finish!`;
            }
        }

        // Reset button background color
        micButton.style.backgroundColor = "#4CAF50";
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        micButton.textContent = "Try Again 🎙️";
        micButton.style.backgroundColor = "#4CAF50";
    };

    recognition.onend = () => {
        // Keeps button responsive
    };

} else {
    micButton.textContent = "Speech Not Supported in Browser";
    micButton.disabled = true;
}
