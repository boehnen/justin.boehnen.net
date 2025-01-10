// typing.js

// Array of texts to type
const textArray = [
    "Crafting .NET solutions.",
    "Building modern web apps.",
    "Innovating in the cloud.",
    "Leveraging CI/CD pipelines.",
    "Designing scalable architectures.",
    "Fusing code quality with creativity.",
    "Optimizing for performance at scale."
  ];
  
  // Typing speed (ms per character)
  const typingDelay = 80;
  // Erasing speed
  const erasingDelay = 40;
  // Pause between finishing a word and erasing
  const newTextDelay = 2000;
  
  let textArrayIndex = 0;
  let charIndex = 0;
  let typedTextSpan;
  
  function type() {
    if (charIndex < textArray[textArrayIndex].length) {
      typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingDelay);
    } else {
      // Done typing current phrase
      setTimeout(erase, newTextDelay);
    }
  }
  
  function erase() {
    if (charIndex > 0) {
      typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, erasingDelay);
    } else {
      // Done erasing
      textArrayIndex++;
      if (textArrayIndex >= textArray.length) textArrayIndex = 0;
      setTimeout(type, typingDelay + 1100);
    }
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    typedTextSpan = document.querySelector(".typed-text");
    if (textArray.length) setTimeout(type, newTextDelay + 250);
  });
  