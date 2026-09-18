
script = '''
const videoElement = document.getElementById('story-video');
const micButton = document.getElementById('mic-btn');
const stanzaDisplay = document.getElementById('stanza-display');

let storyStep = 0;
let totalScore = 0;

const pages = [
    {
        sentence: "ella rose goes to the beach",
        video: "sand.mp4",
        stanza: "Sand and shells,<br>And wiggly toes<br>Amid sea glass,<br>Arranged in rows."
    },
    {
        sentence: "ella rose builds a sand castle",
        video: "castle.mp4",
        stanza: "Ella builds castles<br>Fit for a queen,<br>Packed dense with sand,<br>So they will not lean."
    },
    {
        sentence: "ella rose eats an ice cream",
        video: "icecream.mp4",
        stanza: "Snacking on melons<br>And ice-cream cones,<br>Frosty smoothies<br>With blueberry scones."
    }
];

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function normalize(text) {
    return text.toLowerCase().replace(/[^a-z0-9\\s]/g, "").trim();
}

function scoreMatch(said, expected) {
    const saidWords = normalize(said).split(/\\s+/).filter(Boolean);
    const expectedWords = normalize(expected).split(/\\s+/).filter(Boolean);

    if (saidWords.length === 0) return 0;

    let matchedCount = 0;
    const saidSet = [...saidWords];
    expectedWords.forEach(word => {
        const idx = saidSet.indexOf(word);
        if (idx !== -1) {
            matchedCount++;
            saidSet.splice(idx, 1);
        }
    });

    const ratio = matchedCount / expectedWords.length;

    if (ratio >= 0.9) return 100;
    if (ratio >= 0.5) return 50;
    return 0;
}

function advancePage() {
    const page = pages[storyStep];
    videoElement.src = page.video;
    videoElement.load();
    videoElement.play();
    stanzaDisplay.innerHTML = page.stanza;
}

function startListening() {
    try {
        recognition.start();
        micButton.textContent = "Listening... Speak now 🎙";
        micButton.style.backgroundColor = "#ff9800";
    } catch (e) {
        console.log("Recognition error:", e);
    }
}

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    micButton.addEventListener('click', () => {
        startListening();
    });

    recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript.trim();
        const expectedSentence = pages[storyStep].sentence;
        const points = scoreMatch(speechResult, expectedSentence);

        console.log("Heard:", speechResult, "at step:", storyStep, "score:", points);

        if (points > 0) {
            totalScore += points;
            const emoji = points === 100 ? "✅ Perfect! +100" : "👍 Close enough! +50";
            stanzaDisplay.innerHTML = `${emoji}<br><b>Total score: ${totalScore}</b>`;

            storyStep++;
            if (storyStep >= pages.length) {
                storyStep = 0;
                setTimeout(() => {
                    micButton.textContent = "Story Complete! Tap to replay 🎙";
                    micButton.style.backgroundColor = "#4CAF50";
                }, 1500);
                setTimeout(() => {
                    advancePage();
                }, 1500);
                return;
            }

            setTimeout(() => {
                advancePage();
                startListening();
            }, 1500);
        } else {
            stanzaDisplay.innerHTML = `Heard: "${speechResult}"<br><b>Try again:</b> Say "${expectedSentence}"`;
            micButton.style.backgroundColor = "#4CAF50";
            micButton.textContent = "Try Again 🎙";
        }
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        micButton.textContent = "Try Again 🎙";
        micButton.style.backgroundColor = "#4CAF50";
    };

    recognition.onend = () => {
        // Keeps button responsive
    };

} else {
    micButton.textContent = "Speech Not Supported in Browser";
    micButton.disabled = true;
}
'''
with open('/mnt/user-data/outputs/script.js', 'w') as f:
    f.write(script)
print("saved")
