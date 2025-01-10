import { phrases } from "./phrases.js";

const TYPING_DELAY_MS = 70; // ms per character
const ERASING_DELAY_MS = 40; // ms per character
const ERASING_LAST_DELAY_MS = 200; // ms per character
const ERASING_LAST_COUNT = 3; // num of characters to slow down for
let phraseIndex = 0;
let wordIndex = 0;
let charIndex = 0;

let typedTextSpan;

// Joins all the words (with spaces in between) into one string.
function buildFullPhrase(words) {
  return words
    .map((w, i) => (i < words.length - 1 ? w.text + " " : w.text))
    .join("");
}

// Given a prefix length (already typed characters),
// determine which word and character index we should resume typing from.
function initializeTypingFromPrefix(words, prefixLength) {
  let totalSoFar = 0;
  wordIndex = 0;
  charIndex = 0;

  for (let i = 0; i < words.length; i++) {
    // Add a space except on the last word
    const wordText = i < words.length - 1
      ? words[i].text + " "
      : words[i].text;

    const wLen = wordText.length;

    if (totalSoFar + wLen <= prefixLength) {
      // Entire word is already typed
      totalSoFar += wLen;
      wordIndex++;
      charIndex = 0; // reset for the next word
    } else {
      // The prefix partially includes this word
      charIndex = prefixLength - totalSoFar;
      totalSoFar += charIndex; // now totalSoFar == prefixLength
      break;
    }
  }
}

function typeWord(words) {
  // If we've typed all words in this phrase, wait lifespan, then erase
  if (wordIndex >= words.length) {
    const lifespan = phrases[phraseIndex].lifespan ?? 2000;
    setTimeout(erasePhrase, lifespan);
    return;
  }

  // Destructure with default fallback
  const {
    text,
    typingFactor = 1,
    pauseBefore = 0,
    pauseAfter = 0
  } = words[wordIndex];

  // If it's not the last word, add a trailing space
  const fullWord = wordIndex < words.length - 1 ? text + " " : text;

  // If charIndex===0, we haven't started this word yet => do pauseBefore
  if (charIndex === 0 && pauseBefore > 0) {
    setTimeout(() => {
      typeOneCharacter();
    }, pauseBefore);
  } else {
    typeOneCharacter();
  }

  // Helper to type one character, then recurse
  function typeOneCharacter() {
    if (charIndex < fullWord.length) {
      typedTextSpan.textContent += fullWord[charIndex];
      charIndex++;

      const delay = TYPING_DELAY_MS * typingFactor;
      setTimeout(() => typeWord(words), delay);
    } else {
      // Finished typing this word
      charIndex = 0;
      wordIndex++;
      setTimeout(() => typeWord(words), pauseAfter);
    }
  }
}

function erasePhrase() {
  const currentText = typedTextSpan.textContent;
  const length = currentText.length;

  // If there are still chars left to erase...
  if (length > 0) {
    // Remove last char
    const newText = currentText.slice(0, -1);
    typedTextSpan.textContent = newText;

    // Compare with the next phrase
    const nextIndex = (phraseIndex + 1) % phrases.length;
    const nextPhraseText = buildFullPhrase(phrases[nextIndex].words);

    // If what's left is a prefix of the next phrase
    if (newText && nextPhraseText.startsWith(newText)) {
      // Jump to the next phrase
      phraseIndex = nextIndex;
      // Figure out how many characters are already typed
      initializeTypingFromPrefix(phrases[phraseIndex].words, newText.length);

      // Wait a bit before typing resumes
      setTimeout(() => {
        typeWord(phrases[phraseIndex].words);
      }, TYPING_DELAY_MS);
      return;
    }

    // Otherwise, keep erasing
    const eraseDelay =
      length <= ERASING_LAST_COUNT ? ERASING_LAST_DELAY_MS : ERASING_DELAY_MS;
    setTimeout(erasePhrase, eraseDelay);
  } else {
    // Fully erased, move on to the next phrase
    phraseIndex = (phraseIndex + 1) % phrases.length;
    wordIndex = 0;
    charIndex = 0;

    typeWord(phrases[phraseIndex].words);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  typedTextSpan = document.querySelector(".typed-text");
  const firstPhraseText = buildFullPhrase(phrases[0].words);
  typedTextSpan.textContent = firstPhraseText;
  charIndex = firstPhraseText.length;
  setTimeout(erasePhrase, 3000);
});
