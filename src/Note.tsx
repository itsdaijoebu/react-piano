import { useState, MouseEvent } from "react";
import { NoteType } from "./helpers";

export default function Note({ note, color }: NoteType) {
  const [isPressed, setIsPressed] = useState(false);
  const [isEntered, setIsEntered] = useState(false);

  function handleKeyPressed() {
    setIsPressed(true);
    playNote();
  }
  function handleKeyReleased() {
    setIsPressed(false);
    setIsEntered(false);
    stopNote();
  }
  function handleKeyMoved(e: MouseEvent<HTMLButtonElement>) {
    if (!isEntered) {
      if (e.buttons === 1) {
        setIsEntered(true);
        setIsPressed(true);
        playNote();
      }
    }
  }

  function playNote() {
    let noteAudio: HTMLAudioElement = document.getElementById(
      `audio-${note}`
    ) as HTMLAudioElement;
    noteAudio.currentTime = 0;
    noteAudio.volume = 1;
    noteAudio.play();
  }

  function stopNote() {
    let noteAudio: HTMLAudioElement = document.getElementById(
      `audio-${note}`
    ) as HTMLAudioElement;

    // noteAudio.pause();
    let noteTimer = setInterval(function () {
      let minVol = 0;
      let fadeSpeed = 0.03;
      //prevents noteAudio.volume from going below zero
      if (noteAudio.volume > minVol && noteAudio.volume < fadeSpeed)
        noteAudio.volume = fadeSpeed;

      //when called, causes the note to rapidly fade and deactivate all visualization panels
      if (noteAudio.volume > minVol) {
        noteAudio.volume -= fadeSpeed;
      } else {
        noteAudio.pause();

        clearInterval(noteTimer);
      }
    }, 1);
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
