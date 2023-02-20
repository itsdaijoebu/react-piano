// to-do: get keyboard bindings working. Was implementing ability to pass keyboard keys as a prop - got the vars down, now need to actually pass in from app.tsx

import { useState, useEffect, useRef, MouseEvent } from "react";
import { NoteType } from "./helpers";

type NoteProp = {
  note: string;
  color: string;
  keyboardKey?: string;
};

export default function Note({ note, color, keyboardKey }: NoteProp) {
  const [isPressed, setIsPressed] = useState(false);
  const timerRef = useRef<number>();
  const intervalRef = useRef<number>();
  const audioRef = useRef<HTMLAudioElement>();

  useEffect(() => {
    audioRef.current = audioRef.current || createAudioElement(note);
    console.log(keyboardKey ? keyboardKey : "no associated key");

    if (isPressed) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 1;
      audioRef.current.play();
    } else {
      timerRef.current = setTimeout(() => {
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
      }, 1);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPressed]);

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

  return (
    <button
      id={`note-${note}`}
      className={`key ${color} ${isPressed ? "active" : ""}`}
      onMouseDown={handleKeyPressed}
      onMouseMove={handleKeyMoved}
      onMouseUp={handleKeyReleased}
      onMouseLeave={handleKeyReleased}
    >
      {note}
    </button>
  );
}
