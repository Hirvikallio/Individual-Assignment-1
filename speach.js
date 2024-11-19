const synth = window.speechSynthesis;
let voices = [];
let currentUtterance = null;
let currentText = '';
let currentIndex = 0; 
let chunks = []; 
let isPaused = false; 

// Populate available voices
function populateVoiceList() {
    voices = synth.getVoices();
    console.log("Available voices:", voices); 

    const voiceSelect = document.querySelector("#voiceSelect");
    if (voiceSelect) {
        voiceSelect.innerHTML = ""; 
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
        setTimeout(populateVoiceList, 500); 
    }
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}


function splitTextIntoChunks(text, chunkSize = 200) { 
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


    if (synth.speaking) {
        synth.cancel(); 
        console.log("Previous speech canceled.");
    }

    // Reset for new speech
    currentText = text; 
    currentIndex = 0;   
    chunks = splitTextIntoChunks(text); 
    isPaused = false;  

    // Get the selected voice
    let selectedVoice = voices.find((v) => v.name === selectedVoiceName);
    if (!selectedVoice) {
       
        selectedVoice = voices.find((v) => v.lang.startsWith("en"));
        if (!selectedVoice) {
            console.error("No English voice found. Defaulting to system voice.");
        }
    }

  
    currentUtterance = new SpeechSynthesisUtterance(chunks[currentIndex]);
    if (selectedVoice) {
        currentUtterance.voice = selectedVoice; 
        currentUtterance.lang = selectedVoice.lang; 
        console.log(`Using voice: ${selectedVoice.name}`);
    }

    
    synth.speak(currentUtterance);

    
    currentUtterance.onend = () => {
        if (isPaused) {
            return; 
        }

        currentIndex++;
        if (currentIndex < chunks.length) {
            currentUtterance = new SpeechSynthesisUtterance(chunks[currentIndex]);
            if (selectedVoice) {
                currentUtterance.voice = selectedVoice; 
                currentUtterance.lang = selectedVoice.lang; 
            }
            synth.speak(currentUtterance);
        } else {
            console.log("Finished speaking.");
        }
    };


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


document.querySelector("#speechForm")?.addEventListener("submit", (event) => {
    event.preventDefault();

    const inputTxt = document.querySelector("#inputTxt")?.value.trim();
    if (!inputTxt) {
        console.error("Input text is empty.");
        alert("Please enter some text to read aloud!");
        return;
    }

    const selectedVoice = document.querySelector("#voiceSelect")?.selectedOptions[0]?.getAttribute("data-name");

    textToSpeech(inputTxt, selectedVoice);
});

document.querySelector("#pauseButton")?.addEventListener("click", pauseSpeech);
document.querySelector("#resumeButton")?.addEventListener("click", resumeSpeech);


document.querySelector('.speech-controls-button').addEventListener('click', function() {
    var speechControls = document.querySelector('.speech-controls');
  
    if (speechControls.style.display === 'none' || speechControls.style.display === '') {
        speechControls.style.display = 'block'; // Show the speech controls
    } else {
        speechControls.style.display = 'none'; // Hide the speech controls
    }
});
