// Phrases (text, lifespan in ms)
const textArray = [
  ["Crafting .NET solutions.", 2000],
  ["Building modern web apps.", 2000],
  ["Innovating in the cloud.", 2000],
  ["Leveraging CI/CD pipelines.", 2000],
  ["Designing scalable architectures.", 2000],
  ["Design maintainability.", 2000],
  ["Fusing code quality with creativity.", 2000],
  ["Optimizing for performance at scale.", 2000],
  ["Optimizing for reliabilityat sca", 700],   // Short display (typo)
  ["Optimizing for reliability at scale.", 1500],
  ["⛅ 💻 🚀", 3000]
];

// Base delays (ms per character)
const typingDelay = 70;
const erasingDelay = 40;

// Easing amplitudes: higher = more slowing near edges
const typingAmplitude = 1.3;
const erasingAmplitude = 2.8;

// "Center" in [0..1]. 0.5 slows equally at start/end
const typingCenter = 0.25;
const erasingCenter = 0;

let textArrayIndex = 0;
let charIndex = 0;
let typedTextSpan;

// Slows down near edges by (1 + amplitude * ratio)
function edgeEase(p, amplitude, center) {
  const distFromCenter = Math.abs(p - center);
  const maxDist = Math.max(center, 1 - center);
  const ratio = distFromCenter / maxDist;
  return 1 + amplitude * ratio;
}

// Quadratic version of edgeEase:
// Returns a factor ≥ 1.0.
function edgeEaseQuadratic(p, amplitude, center) {
  const distFromCenter = Math.abs(p - center);
  const maxDist = Math.max(center, 1 - center);
  const ratio = distFromCenter / maxDist;
  return 1 + amplitude * (ratio ** 2);
}

// Calculates how long to wait (ms) given the base delay and progress
function getDelay(baseDelay, p, amplitude, center) {
  return baseDelay * edgeEaseQuadratic(p, amplitude, center);
}

function type() {
  const currentPhrase = textArray[textArrayIndex][0];
  const progress = charIndex / currentPhrase.length;

  if (charIndex < currentPhrase.length) {
    typedTextSpan.textContent += currentPhrase.charAt(charIndex);
    charIndex++;
    const delay = getDelay(typingDelay, progress, typingAmplitude, typingCenter);
    setTimeout(type, delay);
  } else {
    const lifespan = textArray[textArrayIndex][1];
    setTimeout(erase, lifespan);
  }
}

function erase() {
  const currentPhrase = textArray[textArrayIndex][0];
  const progress = 1 - charIndex / currentPhrase.length;

  if (charIndex > 0) {
    charIndex--;
    typedTextSpan.textContent = currentPhrase.substring(0, charIndex);
    const nextIndex = (textArrayIndex + 1) % textArray.length;
    const nextPhrase = textArray[nextIndex][0];
    const currentText = typedTextSpan.textContent;

    if (currentText && nextPhrase.startsWith(currentText)) {
      textArrayIndex = nextIndex;
      setTimeout(type, 250);
    } else {
      const delay = getDelay(erasingDelay, progress, erasingAmplitude, erasingCenter);
      setTimeout(erase, delay);
    }
  } else {
    textArrayIndex = (textArrayIndex + 1) % textArray.length;
    setTimeout(type, typingDelay);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  typedTextSpan = document.querySelector(".typed-text");
  typedTextSpan.textContent = textArray[0][0];
  charIndex = textArray[0][0].length;
  setTimeout(erase, 3000);
});
