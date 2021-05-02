// script.js

const img = new Image(); // used to load image from <input> and draw to canvas
const readText = document.querySelector('button[type=button]');
const memeGenerator = document.getElementById('generate-meme'); 
const volumeBar = document.querySelector('input[type=range]');
const canvas = document.getElementById('user-image');
const context = canvas.getContext('2d');
const reset = document.querySelector('button[type=reset]');
const voiceSelect = document.getElementById('voice-selection');
const newImage = document.getElementById('image-input');
const submit = document.querySelector('button[type=submit]');

populateVoice();
voiceSelect.disabled= false;
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
  context.clearRect(0 , 0, canvas.width, canvas.height);

  submit.disabled = false;
  reset.disabled = true;
  readText.disabled = true;

  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);

  const dimensions = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  context.drawImage(img, dimensions.startX, dimensions.startY, dimensions.width, dimensions.height);
});

newImage.addEventListener('change',() => {
  const object = URL.createObjectURL(newImage.files[0]);
  img.src = object;
  img.alt = newImage.files[0].name;
});

memeGenerator.addEventListener('submit', (e) => {
  e.preventDefault();

  const context = canvas.getContext('2d');
  const top = memeGenerator.elements[1].value;
  const bottom = memeGenerator.elements[2].value;
  
  context.font = "30px Impact";
  context.fillStyle = 'white';
  context.textAlign = 'center';
  context.fillText(top, canvas.width/2,50);
  context.fillText(bottom, canvas.width/2, canvas.height-50);

  submit.disabled = true;
  reset.disabled = false;
  readText.disabled = false;

});


/* Button: Read Text */
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

/* Button: Clear */
reset.addEventListener('click', () => {
  const context = canvas.getContext('2d');
  context.clearRect(0,0,canvas.width,canvas.height);

  reset.disabled = true;
  readText.disabled = true;  
  submit.disabled = false;
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
