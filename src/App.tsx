import { useEffect, useState, useRef, useCallback } from "react";
import Note from "./Note";
import Sustain from "./Sustain";
import Octave from "./Octave";
import Visualizer from "./Visualizer";
import { keyboardLayouts } from "./keyboardLayouts";
import { octaveBasic } from "./helpers";

let didInit = false;

function App() {
  const [pressedKeys, setPressedKeys] = useState(new Set<string>());
  const [keyLayout, setKeyLayout] = useState(
    keyboardLayouts.keyboardKeysConsecutive
  );

  const [isSustained, setIsSustained] = useState(false);
  const allOctavesRef = useRef<JSX.Element[]>([]);
  const imagesRef = useRef<string[]>([]);
  // const addImage = useCallback((url: string) => {
  //   imagesRef.current = [...imagesRef.current, url];
  // }, []);

  let numOctaves = 3;
  let startOctave = 3;

  useEffect(() => {
    if (didInit) return;
    didInit = true;
    // let date = Date.now();
    let nasaDailyUrl = `https://api.nasa.gov/planetary/apod?api_key=${
      import.meta.env.VITE_NASA_KEY
    }`;
    let nasaMultipleUrl = `https://api.nasa.gov/planetary/apod?count=2&api_key=${
      import.meta.env.VITE_NASA_KEY
    }`;
    fetch(nasaDailyUrl)
      .then((res) => res.json())
      .then((data) => {
        let newImages = [data.url];
        imagesRef.current = newImages;
        return fetch(nasaMultipleUrl);
      })
      .then((response) => response.json())
      .then((nasaPics) => {
        let newImages = [...imagesRef.current];
        for (let pic of nasaPics) {
          newImages.push(pic.url);
          imagesRef.current = newImages;
        }
        console.log("all images", imagesRef.current);
      })
      .catch((err) => {
        console.error(err);
      });

    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    if (!isMobile) return;
    const lockOrientation = () => {
      try {
        screen.orientation.lock("landscape");
      } catch (err) {
        console.error(err);
      }
    };
    lockOrientation();
    return () => {
      try {
        screen.orientation.unlock();
      } catch (err) {
        console.error(err);
      }
    };
  }, []);

  /***********stuff to do with the keyboard keys***************/

  // let useKeyConfig = keyboardLayouts.keyboardKeysSplit;
  const octaveLength = octaveBasic.length

  allOctavesRef.current = Array(numOctaves*octaveLength)
    .fill(null)
    .map((_, i) => (
      <Note
        key={`note-${i}`}
        note={`${octaveBasic[i%octaveLength].note}${Math.floor(i/octaveLength)+startOctave}`}
        color={`${octaveBasic[i%octaveLength].color}`}
        pressedKeys={pressedKeys}
        keyboardKey={keyLayout[i]}
        isSustained={isSustained}
      />
    ));

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.repeat) return;
      if (e.key === " ") {
        setIsSustained(true);
      }
      if (keyLayout.includes(e.key)) {
        setPressedKeys((keys) => {
          const newKeys = new Set(keys);
          newKeys.add(e.key.toLowerCase());
          return newKeys;
        });
      }
    }
    function handleKeyUp(e: KeyboardEvent) {
      if (e.key === " ") {
        setIsSustained(false);
      }
      if (keyLayout.includes(e.key)) {
        setPressedKeys((keys) => {
          const newKeys = new Set(keys);
          newKeys.delete(e.key.toLowerCase());
          return newKeys;
        });
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  function clickSustain(e: React.MouseEvent<HTMLButtonElement>) {
    const target = e.currentTarget as HTMLButtonElement;
    setIsSustained((prevState) => !prevState);
    target.blur();
  }

  return (
    <>
      {/* <section className="visualizer-container"> */}
      <Visualizer
        keyboardStart={startOctave}
        numOctaves={numOctaves}
        images={imagesRef.current}
      />
      <section className="keyboard">
        {allOctavesRef.current}
        <Note
          note={`C${numOctaves + startOctave}`}
          color="white"
          keyboardKey={keyLayout[keyLayout.length-1]}
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
