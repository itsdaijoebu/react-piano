import React from "react";
import { octaveBasic } from "./helpers";

type AudioProp = {
  octaveNum: number
}
export default function NoteAudio({ octaveNum }: AudioProp) {
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
