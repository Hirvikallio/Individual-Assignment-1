const synth = window.speechSynthesis;
let voices = [];
let currentUtterance = null;
let currentText = ''; // Text being spoken
let currentIndex = 0; // Current index in the text (for resume functionality)
let chunks = []; // Store text chunks
let isPaused = false; // Track if speech is paused

// Populate available voices
function populateVoiceList() {
    voices = synth.getVoices();
    console.log("Available voices:", voices); // Debugging

    const voiceSelect = document.querySelector("#voiceSelect");
    if (voiceSelect) {
        voiceSelect.innerHTML = ""; // Clear existing options
        voices.forEach((voice) => {
            const option = document.createElement("option");
            option.textContent = `${voice.name} (${voice.lang})${voice.default ? " — DEFAULT" : ""}`;
            option.setAttribute("data-lang", voice.lang);
            option.setAttribute("data-name", voice.name);
            voiceSelect.appendChild(option);
        });
    }

    if (!voices.length) {
        console.warn("Voice list is empty. Retrying...");
        setTimeout(populateVoiceList, 500); // Retry after a delay
    }
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}

// Function to split text into smaller chunks for better tracking of progress
function splitTextIntoChunks(text, chunkSize = 200) { // Adjusted chunk size for smoother flow
    const chunks = [];
    let index = 0;
    while (index < text.length) {
        chunks.push(text.slice(index, index + chunkSize));
        index += chunkSize;
    }
    return chunks;
}

// Function for text-to-speech
function textToSpeech(text, selectedVoiceName = null) {
    if (!text.trim()) {
        console.error("No text provided for TTS.");
        return;
    }

    // Stop any ongoing speech before starting a new one
    if (synth.speaking) {
        synth.cancel(); // Stop any ongoing speech
        console.log("Previous speech canceled.");
    }

    // Reset for new speech
    currentText = text; // Save the current text to track
    currentIndex = 0;   // Reset the current position
    chunks = splitTextIntoChunks(text); // Split text into chunks
    isPaused = false;   // Reset paused state

    // Get the selected voice
    let selectedVoice = voices.find((v) => v.name === selectedVoiceName);
    if (!selectedVoice) {
        // Default to an English voice if the selected voice isn't found
        selectedVoice = voices.find((v) => v.lang.startsWith("en"));
        if (!selectedVoice) {
            console.error("No English voice found. Defaulting to system voice.");
        }
    }

    // Create the initial utterance
    currentUtterance = new SpeechSynthesisUtterance(chunks[currentIndex]);
    if (selectedVoice) {
        currentUtterance.voice = selectedVoice; // Apply the selected/default English voice
        console.log(`Using voice: ${selectedVoice.name}`);
    }

    // Speak the initial chunk
    synth.speak(currentUtterance);

    // Handle when the utterance finishes to proceed to the next chunk
    currentUtterance.onend = () => {
        if (isPaused) {
            return; // Prevent advancing when paused
        }

        currentIndex++;
        if (currentIndex < chunks.length) {
            currentUtterance = new SpeechSynthesisUtterance(chunks[currentIndex]);
            if (selectedVoice) {
                currentUtterance.voice = selectedVoice; // Use the same voice
            }
            synth.speak(currentUtterance);
        } else {
            console.log("Finished speaking.");
        }
    };

    // Debugging
    console.log(`Speaking: "${text}"`);
}

// Pause the speech
function pauseSpeech() {
    if (synth.speaking && !synth.paused) {
        synth.pause();
        isPaused = true; // Track paused state
        console.log("Speech paused.");
    } else if (synth.paused) {
        console.warn("Speech is already paused.");
    } else {
        console.warn("No speech to pause.");
    }
}

// Resume the speech
function resumeSpeech() {
    if (isPaused) {
        synth.resume();
        isPaused = false; // Reset paused state
        console.log("Resuming speech...");
    } else if (!synth.speaking) {
        console.warn("No speech to resume.");
    } else {
        console.warn("Speech is already playing.");
    }
}

// Attach event listeners
document.querySelector("#speechForm")?.addEventListener("submit", (event) => {
    event.preventDefault();

    const inputTxt = document.querySelector("#inputTxt")?.value.trim();
    if (!inputTxt) {
        console.error("Input text is empty.");
        alert("Please enter some text to read aloud!");
        return;
    }

    const selectedVoice = document.querySelector("#voiceSelect")?.selectedOptions[0]?.getAttribute("data-name");

    // Speak the text
    textToSpeech(inputTxt, selectedVoice);
});

document.querySelector("#pauseButton")?.addEventListener("click", pauseSpeech);
document.querySelector("#resumeButton")?.addEventListener("click", resumeSpeech);


/*

// Text-to-Speech functionality
const synth = window.speechSynthesis;
let voices = [];
let currentUtterance = null;
let currentText = ''; // Text being spoken
let currentIndex = 0;  // Current index in the text (for resume functionality)
let chunks = []; // Store text chunks

// Populate available voices
function populateVoiceList() {
    voices = synth.getVoices();
    console.log("Available voices:", voices); // Debugging

    const voiceSelect = document.querySelector("#voiceSelect");
    if (voiceSelect) {
        voiceSelect.innerHTML = ""; // Clear existing options
        voices.forEach((voice) => {
            const option = document.createElement("option");
            option.textContent = `${voice.name} (${voice.lang})${voice.default ? " — DEFAULT" : ""}`;
            option.setAttribute("data-lang", voice.lang);
            option.setAttribute("data-name", voice.name);
            voiceSelect.appendChild(option);
        });
    }

    if (!voices.length) {
        console.warn("Voice list is empty. Retrying...");
        setTimeout(populateVoiceList, 500); // Retry after a delay
    }
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}

// Function to split text into smaller chunks for better tracking of progress
function splitTextIntoChunks(text, chunkSize = 100) {
    const chunks = [];
    let index = 0;
    while (index < text.length) {
        chunks.push(text.slice(index, index + chunkSize));
        index += chunkSize;
    }
    return chunks;
}

// Function for text-to-speech
function textToSpeech(text, selectedVoice = null) {
    if (!text.trim()) {
        console.error("No text provided for TTS.");
        return;
    }

    // Stop any ongoing speech before starting a new one
    if (synth.speaking) {
        synth.cancel(); // Stop any ongoing speech
        console.log("Previous speech canceled.");
    }

    // Reset for new speech
    currentText = text; // Save the current text to track
    currentIndex = 0;   // Reset the current position
    chunks = splitTextIntoChunks(text); // Split text into chunks

    currentUtterance = new SpeechSynthesisUtterance(chunks[currentIndex]);

    // Apply selected voice if provided
    if (selectedVoice) {
        const voice = voices.find((v) => v.name === selectedVoice);
        if (voice) {
            console.log(`Using voice: ${voice.name}`);
            currentUtterance.voice = voice;
        } else {
            console.warn("Selected voice not found. Using default voice.");
        }
    }

    // Debugging
    console.log(`Speaking: "${text}"`);

    // Set up boundary event to track progress
    currentUtterance.onboundary = (event) => {
        if (event.name === 'word') {
            currentIndex++; // Move to next chunk when a word is completed
            if (currentIndex < chunks.length) {
                currentUtterance.text = chunks[currentIndex]; // Update the text to the next chunk
                synth.speak(currentUtterance); // Speak the next chunk
            }
        }
    };

    synth.speak(currentUtterance);
}

// Pause the speech
function pauseSpeech() {
    if (synth.speaking && !synth.paused) {
        synth.pause();
        console.log("Speech paused.");
    } else if (synth.paused) {
        console.warn("Speech is already paused.");
    } else {
        console.warn("No speech to pause.");
    }
}

// Resume the speech
function resumeSpeech() {
    if (synth.paused) {
        console.log("Resuming speech...");
        synth.resume();
    } else if (!synth.speaking) {
        console.warn("No speech to resume.");
    } else {
        console.warn("Speech is already playing.");
    }
}

// Attach event listeners
document.querySelector("#speechForm")?.addEventListener("submit", (event) => {
    event.preventDefault();

    const inputTxt = document.querySelector("#inputTxt")?.value.trim();
    if (!inputTxt) {
        console.error("Input text is empty.");
        alert("Please enter some text to read aloud!");
        return;
    }

    const selectedVoice = document.querySelector("#voiceSelect")?.value || null;

    // Speak the text
    textToSpeech(inputTxt, selectedVoice);
});

document.querySelector("#pauseButton")?.addEventListener("click", pauseSpeech);
document.querySelector("#resumeButton")?.addEventListener("click", resumeSpeech);


*/