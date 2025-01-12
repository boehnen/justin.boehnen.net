import { phrases } from "./phrases.js";

const TYPING_DELAY_MS = 70; // Base typing time per character
const TYPING_OFFSET_MS = 10; // Max random typing delay or speedup
const ERASING_DELAY_MS = 40; // Time to erase each character
const ERASING_LAST_DELAY_MS = 200; // Delay for the last few erased characters
const ERASING_LAST_COUNT = 3; // Number of characters with extra erasing delay

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

function getRandomNumberBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

// Find the length of the common prefix between two strings.
function findCommonPrefixLength(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) {
    i++;
  }
  return i;
}

// Type one word at a time (potentially with pauses).
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

  // Type one character, then recurse
  function typeOneCharacter() {
    if (charIndex < fullWord.length) {
      typedTextSpan.textContent += fullWord[charIndex];
      charIndex++;

      const offset = getRandomNumberBetween(-TYPING_OFFSET_MS, TYPING_OFFSET_MS);
      const delay = (TYPING_DELAY_MS  * typingFactor) + offset;
      setTimeout(() => typeWord(words), delay);
    } else {
      // Finished typing this word
      charIndex = 0;
      wordIndex++;
      setTimeout(() => typeWord(words), pauseAfter);
    }
  }
}

// Erase characters one by one.
// If at any point the remaining text is a prefix of the next phrase,
// jump to the next phrase immediately. Also use slower erase speed for 
// the last few characters before a jump or a full erase.
function erasePhrase() {
  const currentText = typedTextSpan.textContent;
  const length = currentText.length;

  if (length > 0) {
    // Compute the next phrase and how many chars until prefix matches
    const nextIndex = (phraseIndex + 1) % phrases.length;
    const nextPhraseText = buildFullPhrase(phrases[nextIndex].words);

    // Find how many characters we need to erase until currentText 
    // becomes a prefix of nextPhraseText
    const commonPrefixLen = findCommonPrefixLength(currentText, nextPhraseText);
    const charsNeededToEraseForPrefix = length - commonPrefixLen;

    // Remove the last character
    const newText = currentText.slice(0, -1);
    typedTextSpan.textContent = newText;

    // Check if we've become a prefix of the next phrase after removing one char
    if (newText && nextPhraseText.startsWith(newText)) {
      // Jump to the next phrase
      phraseIndex = nextIndex;
      initializeTypingFromPrefix(phrases[phraseIndex].words, newText.length);

      // Start typing the next phrase
      setTimeout(() => {
        typeWord(phrases[phraseIndex].words);
      }, TYPING_DELAY_MS);
    } else {
      // Decide whether to use normal or slower erasing
      // We just removed one character, so now we have (charsNeededToEraseForPrefix - 1) left 
      // to erase before prefix match triggers (or full erase).
      let eraseDelay = ERASING_DELAY_MS;
      if (charsNeededToEraseForPrefix - 1 < ERASING_LAST_COUNT) {
        eraseDelay = ERASING_LAST_DELAY_MS;
      }

      setTimeout(erasePhrase, eraseDelay);
    }
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
  
  // Start by displaying the first phrase fully, then erase after a delay
  const firstPhraseText = buildFullPhrase(phrases[0].words);
  typedTextSpan.textContent = firstPhraseText;
  charIndex = firstPhraseText.length;

  setTimeout(erasePhrase, 3000);
});
