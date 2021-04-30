// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const readText = document.querySelector('button[type=button]');
const memeGenerator = document.getElementById('generate-meme'); 
const volumeBar = document.querySelector('input[type=range]');
const canvas = document.getElementById('user-image');
const context = canvas.getContext('2d');
const reset = document.querySelector('button[type=reset]');
const voiceSelect = document.getElementById('voice-selection');

voiceSelect.disabled=false;
populateVoice();
speechSynthesis.onvoiceschanged = populateVoice;
function populateVoice(){
  const voices = speechSynthesis.getVoices();
  for(var i=0; i< voices.length; i++){
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
}

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected

});

readText.disabled=false;
readText.addEventListener('click',() =>{
  const voices = speechSynthesis.getVoices();
  const top = memeGenerator.elements[1].value;
  const bottom = memeGenerator.elements[2].value;
  const speech = new SpeechSynthesisUtterance('top message is: ' + top + ' ' + 'bottom message is: ' + bottom);
  const volumeLevel = volumeBar.value;
  const selectVoice = voiceSelect.selectedOptions[0].getAttribute('data-name');

  for(var i = 0; i < voices.length ; i++) {
    if(voices[i].name === selectVoice) {
      speech.voice = voices[i];
    }
  }

  speech.volume = volumeLevel/100.0;

  speechSynthesis.speak(speech);
});

volumeBar.addEventListener('input',() =>{
  const volumeImg = document.querySelector('#volume-group img');
  const volumeLevel = volumeBar.value;
  if(volumeLevel >= 67 && volumeLevel <=100){
    volumeImg.src = 'icons/volume-level-3.svg';
    volumeImg.alt = 'Volume Level 3';
  }
  else if(volumeLevel <67 && volumeLevel >=34){
    volumeImg.src = 'icons/volume-level-2.svg';
    volumeImg.alt = 'Volume Level 2';
  }
  else if(volumeLevel<34 && volumeLevel>=1){
    volumeImg.src = 'icons/volume-level-1.svg';
    volumeImg.alt = 'Volume Level 3';
  }
  else{
    volumeImg.src = 'icons/volume-level-0.svg';
    volumeImg.alt = 'Volume Level 0';
  }

});

/* Clear Button */
reset.disabled = false;
reset.addEventListener('click', () => {
  /* clear image/text */
  document.getElementById('image-input').value = "";
  document.getElementById('text-top').value = "";
  document.getElementById('text-bottom').value = "";
  /* toggle relevant buttons */
  reset.disabled = true;
  readText.disabled = true;  
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
