import React from "react";
import { octaveBasic } from "./helpers";
import Note from "./Note";

//keyboardStart is the first octave where the user can play keys from
type OctaveProp = {
  keyboardStart: number;
  keyboardLayout: string[];
  octaveNum: number;
  pressedKeys: Set<string>;
  isSustained: boolean;
};

export default function Octave({
  keyboardStart,
  keyboardLayout,
  octaveNum,
  pressedKeys,
  isSustained
}: OctaveProp) {
  const octaveSpecific = octaveBasic.map((note) => ({
    note: note.note + octaveNum,
    color: note.color,
  }));

  const octaveLength = octaveBasic.length;
  const keyboardKeys = keyboardLayout.slice(
    (octaveNum - keyboardStart) * octaveLength,
    octaveLength * octaveNum
  );

  return (
    <>
      {octaveSpecific.map((note, i) => (
        <Note
          note={note.note}
          color={note.color}
          pressedKeys={pressedKeys}
          keyboardKey={keyboardKeys ? keyboardKeys[i] : ""}
          key={`note-${note.note}`}
          isSustained={isSustained}
        />
      ))}
    </>
  );
}
