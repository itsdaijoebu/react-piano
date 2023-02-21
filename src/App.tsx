import { useEffect, useState, useRef } from "react";
import Note from "./Note";
import Sustain from "./Sustain";
import Octave from "./Octave";
import Visualizer from "./Visualizer";
import { keyboardLayouts } from "./keyboardLayouts";

function App() {
  const [pressedKeys, setPressedKeys] = useState(new Set<string>());
  const [keyLayout, setKeyLayout] = useState(
    keyboardLayouts.keyboardKeysConsecutive
  );
  const [isSustained, setIsSustained] = useState(false);
  const allOctavesRef = useRef<JSX.Element[]>([]);

  let numOctaves = 3;
  let startOctave = 3;

  /***********stuff to do with the keyboard keys***************/

  const maxKeys = keyboardLayouts.keyboardKeysSplit.length;
  let useKeyConfig = keyboardLayouts.keyboardKeysSplit;

  allOctavesRef.current = Array(numOctaves)
    .fill(null)
    .map((_, i) => (
      <Octave
        keyboardStart={startOctave}
        keyboardLayout={keyLayout}
        octaveNum={startOctave + i}
        pressedKeys={pressedKeys}
        isSustained={isSustained}
        key={`octave-${i}`}
      />
    ));

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.repeat) return;
      if (e.key === " ") {
        setIsSustained(true);
      }
      setPressedKeys((keys) => {
        const newKeys = new Set(keys);
        newKeys.add(e.key);
        return newKeys;
      });
    }
    function handleKeyUp(e: KeyboardEvent) {
      if (e.key === " ") {
        setIsSustained(false);
      }
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

  function clickSustain(e: React.MouseEvent<HTMLButtonElement>) {
    const target = e.currentTarget as HTMLButtonElement
    setIsSustained(prevState => !prevState);
    target.blur()
  }

  return (
    <>
    {/* <section className="visualizer-container"> */}
      <Visualizer />
      <section className="keyboard">
        {allOctavesRef.current}
        <Note
          note={`C${numOctaves + startOctave}`}
          color="white"
          keyboardKey={useKeyConfig[maxKeys - 1]}
          pressedKeys={pressedKeys}
          isSustained={isSustained}
        />
      </section>
      <Sustain
        keyboardKey={keyboardLayouts.sustainPedal}
        isSustained={isSustained}
        onClick={clickSustain}
      />
      <section id="audioList" className="audioList"></section>
    </>
  );
}

export default App;
