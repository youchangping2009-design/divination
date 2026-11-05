let tossAudio: HTMLAudioElement | null = null;
let unlocking = false;

function getTossAudio() {
  tossAudio ??= new Audio("/audio/coin-toss.mp3");
  return tossAudio;
}

// iOS Safari 只允许在用户手势中首次播放，摇卦由定时器触发，需在点击时先解锁
export function unlockSound() {
  const audio = getTossAudio();
  unlocking = true;
  audio.muted = true;
  audio
    .play()
    .then(() => {
      if (!unlocking) {
        return;
      }
      unlocking = false;
      audio.pause();
      audio.currentTime = 0;
      audio.muted = false;
    })
    .catch(() => {});
}

export function playTossSound() {
  const audio = getTossAudio();
  unlocking = false;
  audio.muted = false;
  audio.currentTime = 0;
  audio.play().catch(() => {});
}
