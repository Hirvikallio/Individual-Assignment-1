// Resize text buttons
document.getElementById("resize-text-increase").addEventListener("click", function () {
    const body = document.querySelector("body");
    const currentFontSize = window.getComputedStyle(body).fontSize;
    let newFontSize = parseFloat(currentFontSize) * 1.2; // Increase font size by 20%
    body.style.fontSize = newFontSize + "px";
});

document.getElementById("resize-text-decrease").addEventListener("click", function () {
    const body = document.querySelector("body");
    const currentFontSize = window.getComputedStyle(body).fontSize;
    let newFontSize = parseFloat(currentFontSize) * 0.8; // Decrease font size by 20%
    body.style.fontSize = newFontSize + "px";
});

// Color blindness simulation buttons
document.getElementById("protanopia").addEventListener("click", function () {
    document.body.className = "protanopia"; // Apply protanopia CSS class
    document.getElementById("persona-image").src = "pessoa_protanopia.png"; // Update the image
});

document.getElementById("deuteranopia").addEventListener("click", function () {
    document.body.className = "deuteranopia";
    document.getElementById("persona-image").src = "pessoa_deuteranopia.png";
});

document.getElementById("tritanopia").addEventListener("click", function () {
    document.body.className = "tritanopia";
    document.getElementById("persona-image").src = "pessoa_tritanopia.png";
});

document.getElementById("achromatopsia").addEventListener("click", function () {
    document.body.className = "achromatopsia";
    document.getElementById("persona-image").src = "pessoa_achromatopsia.png";
});