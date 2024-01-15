let vidArea = document.querySelector('.vidArea');
let dragText = document.querySelector('p');
let toReplace = document.querySelector('#remove');
let browse = document.querySelector('#browse');
let apply = document.querySelector('#apply');
let start = [];
let end = [];
let subtitles = [];
let vidTag, track, cues;
let textArea = document.querySelector('textarea');
let play = document.querySelector('#play');
let file;
let counter = 1;
let mainDiv = document.querySelector('#mainDiv');
let dSub = document.querySelector('#dSub');
let dVid = document.querySelector('#dVid');
let webVTTURL;

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
    let from = vidTag.currentTime - 0.5;

    start.push(from);
    let to = vidTag.currentTime + 0.3;

    end.push(to);
    subtitles.push(textArea.value.trim());
    textArea.value = '';
  } else alert('No File Selected');
});

play.addEventListener('click', (event) => {
  if (vidTag != null) {
    let track = vidTag.addTextTrack('captions', 'Captions', 'en');
    track.mode = 'showing';

    for (let i = 0; i < start.length; i++) {
      track.addCue(new VTTCue(start[i], end[i], subtitles[i]));
    }
    cues = track.cues;

    vidTag.load();
    vidTag.play();
  } else alert('No File Selected');
});

dSub.addEventListener('click', () => {
  if (cues != null) {
    console.log(cues);

    let vttContent = 'WEBVTT\n\n';
    for (let i = 0; i < cues.length; i++) {
      const cue = cues[i];
      vttContent += `00:0${Math.floor(cue.startTime / 60)}:${Math.floor(
        cue.startTime % 60
      )}.000 --> 00:0${Math.floor(cue.endTime / 60)}:${Math.floor(
        cue.endTime % 60
      )}.500\n`;
      vttContent += cue.text;
      vttContent += '\n\n';
    }

    const blob = new Blob([vttContent], { type: 'text/vtt' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'subtitles.vtt';
    link.click();
  } else alert('No Subtitles Generated');
});

dVid.addEventListener('click', async () => {
  if (typeof vidTag.capture !== 'function') {
    alert('Your browser does not support video downloading.');
    return;
  }

  if (vidTag != null) {
    const blob = await new Promise((resolve, reject) => {
      vidTag
        .captureStream()
        .then((stream) => {
          const reader = new MediaRecorder(stream);
          reader.ondataavailable = (e) => {
            const chunks = [];
            reader.onstop = () =>
              resolve(new Blob(chunks, { type: 'video/mp4' }));
            chunks.push(e.data);
          };
          reader.start();
          setTimeout(() => reader.stop(), 1000);
        })
        .catch(reject);
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'video.mp4';
    link.click();

    // const videoBlob = new Blob([vidTag.src], { type: 'video/mp4' });
    // const videoURL = URL.createObjectURL(videoBlob);
    // console.log('src:' + vidTag.src);
    // console.log('blob:' + videoBlob);
    // console.log('url' + videoURL);
    // const link = document.createElement('a');
    // link.href = videoURL;
    // link.download = 'video.mp4';
    // link.click();
  } else alert('No File Selected');
});
