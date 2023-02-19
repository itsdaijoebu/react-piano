import React from "react";
import { octaveBasic, OctaveNum } from "./helpers";
import Note from "./Note";

export default function Octave({octaveNum}: OctaveNum) {
  const octaveSpecific = octaveBasic.map((note) => ({
    note: note.note + octaveNum,
    color: note.color,
  }));
  return (
    <>
      {octaveSpecific.map((note) => (
        <Note note={note.note}  color={note.color} key={`note-${note.note}`}/>
      ))}
    </>
  );
}
