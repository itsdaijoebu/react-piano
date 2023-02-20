import { useEffect, useState, useRef } from "react";
import Note from "./Note";
import Octave from "./Octave";
import { keyboardLayouts } from "./keyboardLayouts";

function App() {
  const [pressedKeys, setPressedKeys] = useState(new Set<string>());
  const [keyLayout, setKeyLayout] = useState(keyboardLayouts.keyboardKeysConsecutive)
  const allOctavesRef = useRef<JSX.Element[]>([]);

  let numOctaves = 3;
  let startOctave = 3;

  /***********stuff to do with the keyboard keys***************/

  const maxKeys = keyboardLayouts.keyboardKeysSplit.length;
  let useKeyConfig = keyboardLayouts.keyboardKeysSplit;

  allOctavesRef.current = Array(numOctaves)
  .fill(null)
  .map((_, i) => (
    <Octave keyboardStart={startOctave} keyboardLayout={keyLayout} octaveNum={startOctave + i} pressedKeys={pressedKeys} key={`octave-${i}`} />
  ));

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      setPressedKeys((keys) => {
        const newKeys = new Set(keys);
        newKeys.add(e.key);
        return newKeys;
      });
    }
    function handleKeyUp(e: KeyboardEvent) {
      setPressedKeys((keys) => {
        const newKeys = new Set(keys);
        newKeys.delete(e.key);
        return newKeys;
      });
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <>
      <section className="keyboard">
        {allOctavesRef.current}
        <Note
          note={`C${numOctaves + startOctave}`}
          color="white"
          keyboardKey={useKeyConfig[maxKeys - 1]}
          pressedKeys={pressedKeys}
        />
      </section>
      <section id="audioList" className="audioList"></section>
    </>
  );
}

export default App;
