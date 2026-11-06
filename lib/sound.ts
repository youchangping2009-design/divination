// iOS Safari 只允许在用户手势中首次播放，动画由定时器触发，需在点击时先逐个解锁
function createSound(src: string) {
  let audio: HTMLAudioElement | null = null;
  let unlocking = false;

  function get() {
    audio ??= new Audio(src);
    return audio;
  }

  return {
    unlock() {
      const audio = get();
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
    },
    play() {
      const audio = get();
      unlocking = false;
      audio.muted = false;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    },
  };
}

const toss = createSound("/audio/coin-toss.mp3");
export const unlockSound = toss.unlock;
export const playTossSound = toss.play;

export const tarotSounds = {
  shuffle: createSound("/audio/tarot-shuffle.m4a"),
  deal: createSound("/audio/tarot-deal.m4a"),
  flip: createSound("/audio/tarot-flip.m4a"),
};

export const qianSounds = {
  shake: createSound("/audio/qian-shake.m4a"),
  drop: createSound("/audio/qian-drop.m4a"),
  jiao: createSound("/audio/qian-jiao.m4a"),
};
