// to-do: get keyboard bindings working. Was implementing ability to pass keyboard keys as a prop - got the vars down, now need to actually pass in from app.tsx

import {
  useState,
  useEffect,
  useRef,
  MouseEvent,
  forwardRef,
  LegacyRef,
} from "react";

type NoteProp = {
  note: string;
  color: string;
  pressedKeys: Set<string>;
  keyboardKey: string;
  isSustained: boolean;
  playFadeSpeed: number;
};

const Note = forwardRef(
  (
    {
      note,
      color,
      pressedKeys,
      keyboardKey,
      isSustained,
      playFadeSpeed,
    }: NoteProp,
    ref
  ) => {
    const [isPressed, setIsPressed] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    //used to keep a ref to the interval so that it can be cleared when playing note. Otherwise, when a single note is played too quickly, the fadeout function from stopNote() using an interval might kill the note just as it's played again
    const intervalRefStop = useRef<number>();
    const intervalRefPlay = useRef<number>();
    const audioRef = useRef<HTMLAudioElement>();

    useEffect(() => {
      if (!keyboardKey) return;
      if (pressedKeys.has(keyboardKey)) {
        setIsPressed(true);
      } else {
        setIsPressed(false);
      }
    }, [pressedKeys]);

    useEffect(() => {
      audioRef.current = audioRef.current || createAudioElement(note);

      if (isPressed) {
        playNote();
      } else if (!isSustained) {
        stopNote();
      }

      return () => {
        if (intervalRefStop.current) {
          clearInterval(intervalRefStop.current);
        }
      };
    }, [isPressed]);

    useEffect(() => {
      //need to replicate logic of stopNote but with own internal interval instead of using intervalRefStop since otherwise it fires even when if condition is false for some reason
      if (!isSustained && !isPressed) {
        let stopFadeSpeed = 0.03;
        let minVol = 0;
        let interval = setInterval(() => {
          if (!audioRef.current) return;

          //prevent the volume from going below 0
          if (
            audioRef.current.volume > minVol &&
            audioRef.current.volume < stopFadeSpeed
          ) {
            audioRef.current.volume = stopFadeSpeed;
          }

          if (audioRef.current.volume > minVol) {
            audioRef.current.volume -= stopFadeSpeed;
          } else {
            audioRef.current.pause();
            clearInterval(interval);
          }
        }, 1);
        setIsPlaying(false);
      }

      return () => {
        if (intervalRefStop.current) {
          clearInterval(intervalRefStop.current);
        }
      };
    }, [isSustained]);

    function handleKeyPressed() {
      setIsPressed(true);
    }
    function handleKeyReleased() {
      setIsPressed(false);
    }
    function handleKeyMoved(e: MouseEvent<HTMLButtonElement>) {
      if (!isPressed) {
        if (e.buttons === 1) {
          setIsPressed(true);
        }
      }
    }

    function createAudioElement(note: string): HTMLAudioElement {
      const audio = new Audio(`/assets/sounds/default/${note}.mp3`);
      audio.id = `audio-${note}`;
      const audioList = document.getElementById("audioList");
      if (audioList) audioList.appendChild(audio);
      return audio;
    }

    function playNote() {
      if (!audioRef.current) return;
      setIsPlaying(false);
      // avoid batching setIsPlaying calls to ensure class "playing" is removed before being added
      // primarily to ensure when sustain pedal is being held, the "playing" class animation starts playing from the beginning
      setTimeout(() => setIsPlaying(true), 25); 
      if (intervalRefStop.current) {
        clearInterval(intervalRefStop.current);
      }
      if (intervalRefPlay.current) {
        clearInterval(intervalRefPlay.current);
      }
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 1;
      audioRef.current.play();
      intervalRefPlay.current = setInterval(() => {
        if (!audioRef.current) {
          clearInterval(intervalRefPlay.current);
          return;
        }
        if (!audioRef.current) return;
        if (audioRef.current.volume > 0) {
          if (audioRef.current.volume > playFadeSpeed) {
            audioRef.current.volume -= playFadeSpeed;
          } else {
            clearInterval(intervalRefPlay.current);
            if (!isPressed) {
              stopNote();
            }
          }
        }
      }, 100);
    }

    function stopNote() {
      let stopFadeSpeed = 0.03;
      let minVol = 0;
      intervalRefStop.current = setInterval(() => {
        if (!audioRef.current) return;

        //prevent the volume from going below 0
        if (
          audioRef.current.volume > minVol &&
          audioRef.current.volume < stopFadeSpeed
        ) {
          audioRef.current.volume = stopFadeSpeed;
        }

        if (audioRef.current.volume > minVol) {
          audioRef.current.volume -= stopFadeSpeed;
        } else {
          audioRef.current.pause();
          clearInterval(intervalRefStop.current);
        }
      }, 1);
      setIsPlaying(false);
    }

    return (
      <button
        id={`note-${note}`}
        className={`key ${color} ${isPlaying ? "playing" : ""} ${
          isPressed ? "pressed" : ""
        }`}
        onMouseDown={handleKeyPressed}
        onMouseMove={handleKeyMoved}
        onMouseUp={handleKeyReleased}
        onMouseLeave={handleKeyReleased}
        ref={ref as LegacyRef<HTMLButtonElement>}
      >
        <span className="toggleable-text">{keyboardKey || note}</span>
      </button>
    );
  }
);

export default Note;
