// to-do: get keyboard bindings working. Was implementing ability to pass keyboard keys as a prop - got the vars down, now need to actually pass in from app.tsx

import { useState, useEffect, useRef, MouseEvent } from "react";
import { NoteType } from "./helpers";

type NoteProp = {
  note: string;
  color: string;
  pressedKeys: Set<string>;
  keyboardKey: string;
  isSustained: boolean;
};

export default function Note({
  note,
  color,
  pressedKeys,
  keyboardKey,
  isSustained,
}: NoteProp) {
  const [isPressed, setIsPressed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  //used to keep a ref to the interval so that it can be cleared when playing note. Otherwise, when a single note is played too quickly, the fadeout function from stopNote() using an interval might kill the note just as it's played again 
  const intervalRef = useRef<number>(); 
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
      setIsPlaying(true)
    } else if (!isSustained) {
      stopNote();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPressed]);

  useEffect(() => {
    //need to replicate logic of stopNote but with own internal interval instead of using intervalRef since otherwise it fires even when if condition is false for some reason
    if (!isSustained && !isPressed) {
        let fadeSpeed = 0.03;
        let minVol = 0;
        let interval = setInterval(() => {
          if (!audioRef.current) return;
  
          //prevent the volume from going below 0
          if (
            audioRef.current.volume > minVol &&
            audioRef.current.volume < fadeSpeed
          ) {
            audioRef.current.volume = fadeSpeed;
          }
  
          if (audioRef.current.volume > minVol) {
            audioRef.current.volume -= fadeSpeed;
          } else {
            audioRef.current.pause();
            clearInterval(interval);
          }
        }, 1);
        setIsPlaying(false)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
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
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    audioRef.current.currentTime = 0;
    audioRef.current.volume = 1;
    audioRef.current.play();
  }

  function stopNote() {
      let fadeSpeed = 0.03;
      let minVol = 0;
      intervalRef.current = setInterval(() => {
        if (!audioRef.current) return;

        //prevent the volume from going below 0
        if (
          audioRef.current.volume > minVol &&
          audioRef.current.volume < fadeSpeed
        ) {
          audioRef.current.volume = fadeSpeed;
        }

        if (audioRef.current.volume > minVol) {
          audioRef.current.volume -= fadeSpeed;
        } else {
          audioRef.current.pause();
          clearInterval(intervalRef.current);
        }
      }, 1);
      setIsPlaying(false)
  }

  return (
    <button
      id={`note-${note}`}
      className={`key ${color} ${isPlaying ? "playing" : ""}`}
      onMouseDown={handleKeyPressed}
      onMouseMove={handleKeyMoved}
      onMouseUp={handleKeyReleased}
      onMouseLeave={handleKeyReleased}
    >
      <span className="toggleable-text">{keyboardKey || note}</span>
    </button>
  );
}
