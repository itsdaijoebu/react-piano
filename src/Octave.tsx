import React from "react";
import { octaveBasic } from "./helpers";
import Note from "./Note";

type OctaveProp = {
  octaveNum: number,
  keyboardKeys?: string[]
}

export default function Octave({octaveNum, keyboardKeys}: OctaveProp) {
  const octaveSpecific = octaveBasic.map((note) => ({
    note: note.note + octaveNum,
    color: note.color,
  }));
  return (
    <>
      {octaveSpecific.map((note, i) => (
        <Note note={note.note}  color={note.color} keyboardKey={keyboardKeys ? keyboardKeys[i] : ''} key={`note-${note.note}`}/>
      ))}
    </>
  );
}
