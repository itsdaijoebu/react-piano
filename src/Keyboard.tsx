import { useRef, useEffect, useState } from "react";
import { octaveBasic } from "./helpers";
import Note from "./Note";
import Visualizer from "./Visualizer";

type KeyboardProps = {
  pressedKeys: Set<string>;
  isSustained: boolean;
  startOctave: number;
  numOctaves: number;
  images: string[];
  keyLayout: string[];
};

export default function Keyboard({
  pressedKeys,
  isSustained,
  startOctave,
  numOctaves,
  images,
  keyLayout,
}: KeyboardProps) {
  const allOctavesRef = useRef<JSX.Element[]>([]);
  const notesRef = useRef<HTMLButtonElement[]>([]);

  const octaveLength = octaveBasic.length;

  allOctavesRef.current = Array(numOctaves * octaveLength + 1)
    .fill(null)
    .map((_, i) => (
      <Note
        key={`note-${i}`}
        note={`${octaveBasic[i % octaveLength].note}${
          Math.floor(i / octaveLength) + startOctave
        }`}
        color={`${octaveBasic[i % octaveLength].color}`}
        pressedKeys={pressedKeys}
        keyboardKey={keyLayout[i]}
        isSustained={isSustained}
        ref={(e: HTMLButtonElement) => (notesRef.current[i] = e)}
      />
    ));

  return (
    <>
      <Visualizer
        keyboardStart={startOctave}
        numOctaves={numOctaves}
        images={images}
        notesRef={notesRef.current}
      />
      <section className="keyboard">{allOctavesRef.current}</section>
    </>
  );
}
