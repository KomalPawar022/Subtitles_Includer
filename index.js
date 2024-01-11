import { appendFile } from 'fs';
let vidArea = document.querySelector('.vidArea');
let dragText = document.querySelector('p');
let toReplace = document.querySelector('#remove');
let browse = document.querySelector('#browse');
let apply = document.querySelector('#apply');
let subtitles = [];
let vidTag;
let textArea = document.querySelector('textarea');
let play = document.querySelector('#play');
let file;
let counter = 1;
let mainDiv = document.querySelector('#mainDiv');

vidArea.addEventListener('dragover', (event) => {
  event.preventDefault();
  dragText.textContent = 'Release the File';
  vidArea.classList.add('active');
});

vidArea.addEventListener('dragleave', (event) => {
  dragText.textContent = 'Drag & Drop';
  vidArea.classList.remove('active');
});

vidArea.addEventListener('drop', (event) => {
  event.preventDefault();
  file = event.dataTransfer.files[0];
  displayFile();
});

browse.addEventListener('change', (event) => {
  file = event.target.files[0];
  displayFile();
});

function displayFile() {
  let fileType = file.type;
  let validExt = ['video/mp4'];
  if (validExt.includes(fileType)) {
    let filereader = new FileReader();
    filereader.onload = () => {
      let fileUrl = filereader.result;
      vidTag = document.createElement('video');
      vidTag.setAttribute('src', fileUrl);
      vidTag.setAttribute('controls', true);
      vidTag.setAttribute('height', '100%');
      vidTag.setAttribute('width', '100%');
      let srcTag = document.createElement('source');
      srcTag.setAttribute('src', fileUrl);
      srcTag.setAttribute('type', file.type);
      vidTag.appendChild(srcTag);
      vidArea.removeChild(toReplace);
      vidArea.appendChild(vidTag);
    };
    filereader.readAsDataURL(file);
  } else {
    alert('Invalid File : Not a Video.');
  }
}

apply.addEventListener('click', (event) => {
  if (vidTag) {
    let from = vidTag.currentTime.toString().replace('.', '').padStart(9, '0');
    from = format(from);
    // console.log(from);

    let to = vidTag.currentTime + 1;
    console.log(to);
    to = to.toString().replace('.', '').padStart(9, '0');
    to = format(to);
    subtitles.push(from + ' --> ' + to + ' -' + textArea.value.trim());

    console.log(subtitles);
    textArea.value = '';
  } else alert('No File Selected');
});

play.addEventListener('click', (event) => {
  const fs = require('fs');

  fs.writeFile('subtitles.vtt', subtitles.join(), (err) => {
    if (err) throw err;
    //console.log('File created successfully!');
  });

  fs.readFile('subtitles.vtt', 'utf8', (err, data) => {
    if (err) throw err;
    console.log('File content:', data);
  });

  const link = document.createElement('a');
  link.href = 'subtitles.vtt';
  link.download = 'subtitles.vtt'; // Custom filename
  link.click();
  mainDiv.appendChild(link);

  const track = vidTag.addTextTrack('subtitles', 'English', 'en');
  track.src = 'subtitles.vtt';
  vidTag.load();
  vidTag.play();
});

function format(num) {
  let a = num.split('');
  let i;
  for (i = 2; i < num.length - 3; i += 3) {
    a.splice(i, 0, ':');
  }
  a.splice(i, 0, '.');
  return a.join('');
}
