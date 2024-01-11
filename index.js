let vidArea = document.querySelector('.vidArea');
let dragText = document.querySelector('p');
let toReplace = document.querySelector('#remove');
let browse = document.querySelector('#browse');
let apply = document.querySelector('#apply');
let start = [];
let end = [];
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
    let from = vidTag.currentTime;
    // from = from.toString().replace('.', '').padStart(9, '0');
    // from = format(from);

    start.push(from);
    let to = vidTag.currentTime;

    // to = to.toString().replace('.', '').padStart(9, '0');
    // to = format(to);
    end.push(to);
    subtitles.push(textArea.value.trim());
    // subtitles.push(from + ' --> ' + to + ' -' + textArea.value.trim());

    // const fs = require('fs');
    // const stream = fs.createWriteStream('subtitles.vtt', { flags: 'a' });
    // stream.write('WEBVTT\n\n');
    // stream.write(`${i + 1}\n${from} --> ${to}\n- ${textArea.value.trim()}\n\n`);

    // const fs = require('fs');

    // const stream = fs.createWriteStream('output.txt');
    // stream.on('error', (err) => {
    //   console.error('Error writing to file:', err);
    // });

    // console.log('Data appended to file.');

    // console.log(subtitles);
    textArea.value = '';
  } else alert('No File Selected');
});

play.addEventListener('click', (event) => {
  //const fs = require('fs');

  // fs.writeFile('subtitles.vtt', subtitles.join(), (err) => {
  //   if (err) throw err;
  //   //console.log('File created successfully!');
  // });

  // fs.readFile('subtitles.vtt', 'utf8', (err, data) => {
  //   if (err) throw err;
  //   console.log('File content:', data);
  // });

  // const link = document.createElement('a');
  // link.href = 'subtitles.vtt';
  // link.download = 'subtitles.vtt'; // Custom filename
  // link.click();
  // mainDiv.appendChild(link);

  // const webVTTContent = `WEBVTT

  // 00:00:00.000 --> 00:00:05.000
  // This is a WebVTT subtitle.
  // `;
  let webVTTContent = `WEBVTT\n\n`;

  // const cue = `00:${Math.floor(currentTime / 60)}:${Math.floor(
  //   currentTime % 60
  // )}.000 --> 00:${Math.floor(currentTime / 60)}:${Math.floor(
  //   currentTime % 60
  // )}.500\nSubtitle text here\n`;

  for (let i = 0; i < start.length; i++) {
    console.log(i);
    webVTTContent = webVTTContent.concat(
      //   `

      // ${start[i]} --> ${end[i]}
      // ${subtitles[i]}
      // `

      `
      00:${Math.floor(start[i] / 60)}:${Math.floor(
        start[i] % 60)}.000 --> 00:${Math.floor(end[i] / 60)}:${Math.floor(
        end[i] % 60
      )}.500\n${subtitles[i]}\n`
    );
  }
  console.log(webVTTContent);
  const webVTTBlob = new Blob([webVTTContent], { type: 'text/vtt' });
  const webVTTURL = URL.createObjectURL(webVTTBlob);

  const downloadLink = document.createElement('a');
  downloadLink.href = webVTTURL;
  downloadLink.download = 'subtitles.vtt';
  downloadLink.click();

  const track = vidTag.addTextTrack('subtitles', 'English', 'en');
  track.src = webVTTURL;
  track.mode = 'showing';
  console.log(track);
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
