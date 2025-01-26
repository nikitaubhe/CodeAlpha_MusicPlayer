
// selecting required tags or elements //
const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = wrapper.querySelector("#close");

let musicIndex =Math.floor((Math.random() * allMusic.length) + 1);


window.addEventListener("load", ()=>{
    loadMusic(musicIndex);//calling loadMusic function once the window is loaded//
    playingNow();
})


function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb -1].name;
    musicArtist.innerText = allMusic[indexNumb -1].artist;
    musicImg.src = `asset/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `asset/${allMusic[indexNumb - 1].src}.mp3`;
}
//play music function//
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}
//pause music function//
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}
//next music function//
function nextMusic(){
    musicIndex++;
    //if musicindex is greater than array length then music index will be 1
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex  = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();

}

//prev music function//
function prevMusic(){
    musicIndex--;
    //if musicindex is less than 1 then music index will be array length
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex  = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();

}
//play or music button event
playPauseBtn.addEventListener("click" , ()=>{
    const isMusicPaused = wrapper.classList.contains("paused");
    //if isMusicPaused is true then call pauseMusic else call playMusic//
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
});

//next music btn event//
nextBtn.addEventListener("click", ()=>{
    nextMusic();

});

//prev music btn event//
prevBtn.addEventListener("click", ()=>{
    prevMusic();

});

//update progress bar width according to music current time//
mainAudio.addEventListener("timeupdate" , (e)=>{
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    
        let musicCurrentTime = wrapper.querySelector(".current"),
        musicduration = wrapper.querySelector(".duration");
       
        mainAudio.addEventListener("loadeddata" ,()=>{
        //update song total duration//
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){
            //adding 0 if sec is less than 10//
            totalSec = `0${totalSec}`;
        }
        musicduration.innerText = `${totalMin}:${totalSec}`;
         });

        //update playing song current time//
        let currentMin = Math.floor(currentTime / 60);
        let currentSec = Math.floor(currentTime % 60);
        if(currentSec < 10){
            //adding 0 if sec is less than 10//
            currentSec = `0${currentSec}`;
        }
        musicduration.innerText = `${currentMin}:${currentSec}`;
});

//update playing song current time according to the progress bar width //
progressArea.addEventListener("click" , (e)=>{
    let progressWidthval = progressArea.clientWidth;
    let clickedOffSetX = e.offsetX;
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
    playMusic();
});


//repeat,shuffle song//
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", ()=>{
    let getText = repeatBtn.innerText;
    switch(getText){
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback Shuffle");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped");
            break;
    }
});


//what to do after the song ended//
mainAudio.addEventListener("ended", ()=>{
    let getText = repeatBtn.innerText;
    switch(getText){
        case "repeat":
            nextMusic();
            
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(indexNumb);
            playMusic();
            break;
        case "shuffle":
            let randIndex = Math.floor((Math.random() * allMusic.length) +1);
            do{
                randIndex = Math.floor((Math.random() * allMusic.length) +1);
            }while(musicIndex == randIndex);
            musicIndex = randIndex;
            loadMusic(musicIndex);
            playMusic();
            playingNow();
            break;
    }

});

showMoreBtn.addEventListener("click", ()=>{
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", ()=>{
    showMoreBtn.click();
});


const ulTag = wrapper.querySelector("ul");
for(let i = 0; i < allMusic.length; i++){
    let liTag = `<li li-index="${i + 1}">
                <div class="row">
                    <span>${allMusic[i].name}</span>
                    <p>${allMusic[i].artist}</p>
                </div>
                 <audio class="${allMusic[i].src}" id="${allMusic[i].src}" src="asset/${allMusic[i].src}.mp3"></audio>
                <span id ="${allMusic[i].src}" class="audio-duration">3:40</span>
            </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", ()=>{
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){
            //adding 0 if sec is less than 10//
            totalSec = `0${totalSec}`;
        }
     liAudioDuration.innerText = `${totalMin}:${totalSec}`;
     liAudioDuration.setAttribute("t-duration" , `${totalMin}:${totalSec}`);
        
    });
    

}


//playing particular song on click//
const allLiTags = ulTag.querySelectorAll("li");
console.log(allLiTags);
function playingNow(){
    //const allLiTags = ulTag.querySelectorAll("li");//
    for(let j = 0; j< allLiTags.length;j++){
        let audioTag = allLiTags[j].querySelector(".audio-duration");

        if(allLiTags[j].classList.contains("playing")){
            allLiTags[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;

        }

        if(allLiTags[j].getAttribute("li-index") == musicIndex){
            allLiTags[j].classList.add("playing");
            audioTag.innerText= "Playing";
    
        }
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
    
}


//play song on li click//
function clicked(element){
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}





