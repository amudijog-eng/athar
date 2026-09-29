import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { RECITERS, SURAHS_LIST, getSurahAudioUrl } from '../data/quranData';

const AudioPlayerContext = createContext();

export const AudioPlayerProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSurah, setCurrentSurah] = useState(() => SURAHS_LIST[0]); // Al-Fatihah
  const [activeReciter, setActiveReciter] = useState(() => {
    try {
      const saved = localStorage.getItem('athar_reciter');
      return saved ? JSON.parse(saved) : RECITERS[0]; // Mishary Alafasy
    } catch {
      return RECITERS[0];
    }
  });
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioError, setAudioError] = useState(null);

  // Initialize Audio instance
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };
    const onWaiting = () => setIsLoading(true);
    const onCanPlay = () => setIsLoading(false);
    const onEnded = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } else {
        handleNextSurah();
      }
    };
    const onError = () => {
      setIsLoading(false);
      setIsPlaying(false);
      setAudioError('تعذر تحميل التلاوة، يرجى المحاولة لاحقاً أو اختيار قارئ آخر.');
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [isLooping]);

  const playSurah = (surah, reciter = activeReciter) => {
    if (!audioRef.current) return;
    setAudioError(null);
    setIsLoading(true);
    setCurrentSurah(surah);
    if (reciter.id !== activeReciter.id) {
      setActiveReciter(reciter);
      localStorage.setItem('athar_reciter', JSON.stringify(reciter));
    }

    const url = getSurahAudioUrl(reciter.server, surah.id);
    audioRef.current.src = url;
    audioRef.current.playbackRate = playbackSpeed;
    audioRef.current.volume = volume;
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.warn('Playback error:', err);
        setIsPlaying(false);
        setIsLoading(false);
      });
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current.src || audioRef.current.src === '') {
        playSurah(currentSurah, activeReciter);
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    }
  };

  const seek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const seekRelative = (seconds) => {
    if (audioRef.current) {
      const newTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const changeReciter = (reciter) => {
    setActiveReciter(reciter);
    localStorage.setItem('athar_reciter', JSON.stringify(reciter));
    if (isPlaying) {
      playSurah(currentSurah, reciter);
    }
  };

  const changeSpeed = (speed) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const changeVolume = (newVol) => {
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  const handleNextSurah = () => {
    const nextIndex = (currentSurah.id % 114);
    const next = SURAHS_LIST[nextIndex];
    if (next) playSurah(next, activeReciter);
  };

  const handlePrevSurah = () => {
    const prevIndex = currentSurah.id === 1 ? 113 : currentSurah.id - 2;
    const prev = SURAHS_LIST[prevIndex];
    if (prev) playSurah(prev, activeReciter);
  };

  const toggleLoop = () => {
    setIsLooping(prev => !prev);
  };

  return (
    <AudioPlayerContext.Provider value={{
      isPlaying,
      currentSurah,
      activeReciter,
      currentTime,
      duration,
      volume,
      playbackSpeed,
      isLooping,
      isLoading,
      audioError,
      playSurah,
      togglePlay,
      seek,
      seekRelative,
      changeReciter,
      changeSpeed,
      changeVolume,
      toggleLoop,
      handleNextSurah,
      handlePrevSurah
    }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => useContext(AudioPlayerContext);
