import React from "react";
import { octaveBasic, OctaveNum } from "./helpers";

export default function NoteAudio({ octaveNum }: OctaveNum) {
  return (
    <>
      {octaveBasic.map((note) => {
        let thisNote = note.note + octaveNum;
        return (
            <audio
              src={`/assets/sounds/default/${thisNote}.mp3`}
              key={`audio-${thisNote}`}
              id={`audio-${thisNote}`}
            ></audio>
        );
      })}
    </>
  );
}
