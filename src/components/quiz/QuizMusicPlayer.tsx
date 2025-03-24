import { useEffect, useRef, useState } from 'react';
import { useQuizStore } from '@/store/quiz';

const musicOptions = [
  {
    id: 'none',
    name: 'No Music',
    volume: 0,
  },
  {
    id: 'mild',
    name: 'Mild (Lo-fi)',
    volume: 0.3,
    url: '/music/lofi.mp3',
  },
  {
    id: 'medium',
    name: 'Medium (Ambient)',
    volume: 0.4,
    url: '/music/ambient.mp3',
  },
  {
    id: 'energetic',
    name: 'Energetic (Upbeat)',
    volume: 0.5,
    url: '/music/upbeat.mp3',
  },
];

export function QuizMusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { settings } = useQuizStore();
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!audioRef.current) {
      console.log('Audio element not found');
      return;
    }

    const selectedMusic = musicOptions.find(
      (option) => option.id === settings.musicType
    );
    console.log('Selected music:', selectedMusic);

    if (selectedMusic?.id === 'none') {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      return;
    }

    if (selectedMusic?.url) {
      audioRef.current.src = selectedMusic.url;
      audioRef.current.volume = selectedMusic.volume;
      audioRef.current.loop = true;
      audioRef.current.muted = isMuted;

      // Add error handling
      audioRef.current.onerror = (e) => {
        console.error('Error loading audio:', e);
        console.error('Audio element state:', {
          src: audioRef.current?.src,
          volume: audioRef.current?.volume,
          paused: audioRef.current?.paused,
          currentTime: audioRef.current?.currentTime,
        });
      };

      // Add load handling
      audioRef.current.onloadeddata = () => {
        console.log('Audio element state:', {
          src: audioRef.current?.src,
          volume: audioRef.current?.volume,
          paused: audioRef.current?.paused,
          currentTime: audioRef.current?.currentTime,
        });
      };

      // Play the audio
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Audio element state:', {
              src: audioRef.current?.src,
              volume: audioRef.current?.volume,
              paused: audioRef.current?.paused,
              currentTime: audioRef.current?.currentTime,
            });
          })
          .catch((error) => {
            console.error('Error playing audio:', error);
            console.error('Audio element state:', {
              src: audioRef.current?.src,
              volume: audioRef.current?.volume,
              paused: audioRef.current?.paused,
              currentTime: audioRef.current?.currentTime,
            });
          });
      }
    }

    return () => {
      if (audioRef.current) {
        console.log('Cleaning up audio');
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [settings.musicType, isMuted]);

  // Handle mute toggle
  const toggleMute = () => {
    if (audioRef.current) {
      setIsMuted(!isMuted);
      audioRef.current.muted = !isMuted;
    }
  };

  return (
    <>
      <audio ref={audioRef} />
      {settings.musicType !== 'none' && (
        <button
          onClick={toggleMute}
          className='fixed bottom-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500'
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2'
              />
            </svg>
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z'
              />
            </svg>
          )}
        </button>
      )}
    </>
  );
}
