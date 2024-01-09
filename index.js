let vidArea=document.querySelector('.vidArea');
let dragText=document.querySelector('p')
let file;
let toReplace=document.querySelector('#remove')
let browse=document.querySelector('#browse')


vidArea.addEventListener('dragover',(event)=>{
    event.preventDefault();
    dragText.textContent="Release the File"
    vidArea.classList.add('active')
})

vidArea.addEventListener('dragleave',(event)=>{
    
    dragText.textContent="Drag & Drop"
    vidArea.classList.remove('active')
    
})

vidArea.addEventListener('drop',(event)=>{
    event.preventDefault();
    file=event.dataTransfer.files[0];
    displayFile();
    
})

browse.addEventListener('change',(event)=>{
    file=event.target.files[0];
    displayFile();
})



function displayFile()
{
    let fileType=file.type;
    let validExt=["video/mp4"]
    if(validExt.includes(fileType))
    {
        let filereader=new FileReader();
        filereader.onload=()=>{
        fileUrl=filereader.result;
        let vidTag=document.createElement('video')
        vidTag.setAttribute('src',fileUrl)
        vidTag.setAttribute('controls',true);
        vidTag.setAttribute('height','100%');
        vidTag.setAttribute('width','100%');
        let srcTag=document.createElement('source');
        srcTag.setAttribute('src',fileUrl);
        srcTag.setAttribute('type',file.type);
        vidTag.appendChild(srcTag);
        vidArea.removeChild(toReplace)
        vidArea.appendChild(vidTag);  
        }
        filereader.readAsDataURL(file)
    }
    else{
        alert("Invalid File : Not a Video.")
    }
}