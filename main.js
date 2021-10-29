const video = document.getElementById('video');
const videoControls = document.getElementById('video-controls');
const videoContainer = document.querySelector('.video__container');
const playVideo = document.querySelector('.video__play .fa-play');
const pauseVideo = document.querySelector('.video__play .fa-pause');
const playPauseBtns = document.querySelector('.video__play');
const stopVideo = document.querySelector('.video__stop');
const progressBar = document.querySelector('.video__progress-bar');
const seekStart = document.querySelector('.seek-start');
const seekEnd = document.querySelector('.seek-end');
const videoWorks = !!document.createElement('video').canPlayType;
if (videoWorks) {
    video.controls = false;
}
function togglePlayPause() {
    if (video.paused || video.ended) {
        video.play();
        videoContainer.classList.remove('open-overlay')
        playPauseBtns.classList.add('switch-btns');
        playPauseBtns.setAttribute('data-title', 'Pause')
    } else {
        video.pause();
        videoContainer.classList.add('open-overlay')
        playPauseBtns.classList.remove('switch-btns');
        playPauseBtns.setAttribute('data-title', 'Play')
    }
}
function stopVid() {
    video.currentTime = 0;
    video.pause();
    playPauseBtns.classList.remove('switch-btns');
}
stopVideo.addEventListener('click', stopVid);
playVideo.addEventListener('click', () => {
    video.play();
    playPauseBtns.classList.add('switch-btns');
    videoContainer.classList.remove('open-overlay')
    playPauseBtns.setAttribute('data-title', 'Pause')
})
pauseVideo.addEventListener('click', () => {
    video.pause();
    playPauseBtns.classList.remove('switch-btns');
    videoContainer.classList.add('open-overlay')
    playPauseBtns.setAttribute('data-title', 'Play')
})
function formatTime(timeInSeconds) {
    const result = new Date(timeInSeconds * 1000).toISOString().substr(11, 8);
    return {
        minutes: result.substr(3, 2),
        seconds: result.substr(6, 2),
    };
};
function initializeVideo() {
    const videoDuration = Math.round(video.duration);
    const time = formatTime(videoDuration);
    seekEnd.innerText = `${time.minutes}:${time.seconds}`;
}
function updateTimeElapsed() {
    const time = formatTime(Math.round(video.currentTime));
    seekStart.innerText = `${time.minutes}:${time.seconds}`;
    const barTime = Math.round(video.currentTime);
    const barDur = Math.round(video.duration);
    progressBar.value = (barTime / barDur) * 100;
}
function setVideoProgress() {
    video.currentTime = (+progressBar.value * video.duration) / 100;
}
const volumeBtns = document.querySelector('.video__volume')
const muteVideo = document.querySelector('.video__volume .fa-volume-up');
const unmuteVideo = document.querySelector('.video__volume .fa-volume-mute');
const progressVolume = document.querySelector('.volume__progress');
function updateVolume() {
    const volumeNum = parseFloat(progressVolume.value);
    video.volume = volumeNum;
    if (video.volume === 0) {
        volumeBtns.classList.add('mute-volume')
        volumeBtns.setAttribute('data-title', 'Unmute')
    } else {
        volumeBtns.classList.remove('mute-volume')
        volumeBtns.setAttribute('data-title', 'Mute')
    }
}
function toggleMute() {
    video.muted = !video.muted;
    if (video.muted) {
        progressVolume.value = 0;
        video.volume = 0;
        volumeBtns.classList.add('mute-volume')
        volumeBtns.setAttribute('data-title', 'Unmute')
    } else {
        progressVolume.value = 1;
        video.volume = 1;
        volumeBtns.classList.remove('mute-volume')
        volumeBtns.setAttribute('data-title', 'Mute')
    }
}
muteVideo.addEventListener('click', toggleMute)
unmuteVideo.addEventListener('click', toggleMute)
const fullScreen = document.querySelector('.video__fullscreen')
function toggleFullScreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
        fullScreen.classList.remove('full-screen')
        fullScreen.setAttribute('data-title', 'Full Screen')
    } else {
        videoContainer.requestFullscreen();
        fullScreen.classList.add('full-screen')
        fullScreen.setAttribute('data-title', 'Exit Full Screen')
    }
}
const fastBackward = document.querySelector('.video__back')
const fastForward = document.querySelector('.video__forward')
fastBackward.addEventListener('click', () => {
    video.currentTime -= 10;
});
fastForward.addEventListener('click', () => {
    video.currentTime += 10;
});
function keyboardShortcuts(event) {
    const { key } = event;
    switch (key) {
        case 'k':
            togglePlayPause();
            break;
        case 'm':
            toggleMute();
            break;
        case 'f':
            toggleFullScreen();
            break;
        case 'ArrowRight':
            video.currentTime += 10;
            break;
        case 'ArrowLeft':
            video.currentTime -= 10;
            break;
    }
}
const playbackSpeed = document.querySelector('.video__speed');
function updatePlaybackRate() {
    const selectedValue = playbackSpeed.options[playbackSpeed.selectedIndex].value;
    video.playbackRate = selectedValue;
}
progressVolume.addEventListener('input', updateVolume);
playbackSpeed.addEventListener('change', updatePlaybackRate);
document.addEventListener('keyup', keyboardShortcuts);
fullScreen.addEventListener('click', toggleFullScreen);
video.addEventListener('click', togglePlayPause);
progressBar.addEventListener('change', setVideoProgress);
video.addEventListener('loadedmetadata', initializeVideo);
video.addEventListener('timeupdate', updateTimeElapsed);
video.addEventListener('ended', () => {
    video.currentTime = 0;
    video.pause();
    playPauseBtns.classList.remove('switch-btns');
    videoContainer.classList.add('open-overlay')
    playPauseBtns.setAttribute('data-title', 'Play')
});