import { useEffect, useRef } from "react";
import { octaveBasic } from "./helpers";

type VisualizerProp = {
  keyboardStart: number;
  numOctaves: number;
  images: string[];
  notesRef: HTMLButtonElement[];
  visFadeSpeed: number;
};

let isMounted = false;

export default function Visualizer({
  keyboardStart,
  numOctaves,
  images,
  notesRef,
  visFadeSpeed,
}: VisualizerProp) {
  const observerRef = useRef<null | MutationObserver>(null);
  const visSlices = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (isMounted) return;
    isMounted = true;
    const maxSlices = 8; //the max number of slices that can go transparent when a key is pressed
    const intervalStore: Map<HTMLDivElement, number> = new Map(); //store the interval of each slice so that they can be properly cleared when the interval is released
    //store the note associated with each slice. Allows us to update the note associated with the slice without having to search through all the slicesOfNote. Without this, the interval of a given note may be prematurely cleared
    const noteOfSlice: Map<HTMLDivElement, HTMLButtonElement> = new Map();
    const slicesOfNote: Map<HTMLButtonElement, HTMLDivElement[]> = new Map(); // store the slices associated with each note

    for (let i = 0; i < visSlices.current.length; i++) {
      let keyToWatch = notesRef[i];
      observerRef.current = new MutationObserver((mutationList, observer) => {
        const mutation = mutationList[0];
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          const keyboardKey = mutation.target;
          if (keyboardKey instanceof HTMLButtonElement) {
            if (keyboardKey.classList.contains("pressed")) {
              const numSlicesToUse = Math.floor(
                Math.random() * (maxSlices - 1) + 1
              );
              for (let i = 0; i < numSlicesToUse; i++) {
                const randSlice =
                  visSlices.current[
                    Math.floor(Math.random() * visSlices.current.length)
                  ];
                randSlice.style.opacity = "0";
                let interval = setInterval(() => {
                  if (Number(randSlice.style.opacity) >= 0.5) {
                    // clearInterval(interval);
                    return;
                  }
                  randSlice.style.opacity = String(
                    Number(randSlice.style.opacity) + visFadeSpeed
                  );
                }, 500);
                const slicesOnNote = slicesOfNote.get(keyboardKey) || [];
                slicesOnNote.push(randSlice);
                slicesOfNote.set(keyboardKey, slicesOnNote);
                noteOfSlice.set(randSlice, keyboardKey);
                intervalStore.set(randSlice, interval);
                // const intervalArr = intervalStore.get(keyboardKey) || []
                // intervalArr.push(interval)
                // intervalStore.set(keyboardKey, intervalArr)
              }
            }
            if (!keyboardKey.classList.contains("playing")) {
              // const slices = slicesOfNote.get(keyboardKey) || []
              const slices = slicesOfNote.get(keyboardKey);
              if (!slices) return;
              for (let slice of slices) {
                if (noteOfSlice.get(slice) === keyboardKey) {
                  clearInterval(intervalStore.get(slice));
                  slice.style.opacity = "1";
                  intervalStore.delete(slice);
                  noteOfSlice.delete(slice);
                  slicesOfNote.delete(keyboardKey);
                }
              }
              // const intervals = intervalStore.get(keyboardKey) || []
              // for(let interval of intervals) {
              //   clearInterval(interval)
              // }
              // intervalStore.delete(keyboardKey)
            }
          }
        }
      });

      observerRef.current.observe(keyToWatch, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    const visConsole = document.getElementById(
      "visualizer-console"
    ) as HTMLDivElement;
    visConsole.style.backgroundImage = `url(${images[0]}`;
    // visConsole.style.backgroundImage = `url(/assets/images/swirly-galaxy.webp`;
    // visConsole.style.backgroundImage = `url(/assets/images/rotating-lights.webp`;
    // visConsole.style.backgroundImage = `url(/assets/images/earth-loop.webp`;
    // const visSlices = document.getElementById(
    //   "visualizer-slices"
    // ) as HTMLDivElement;
    // visSlices.style.backgroundImage = `url(${images[2]})`;
    const visSlice = document.getElementsByClassName("visualizer-slice");
    for (let i = 0; i < visSlice.length; i++) {
      const slice = visSlice[i] as HTMLElement;
      // slice.style.backgroundImage = `url(${images[1]})`;
      // slice.style.backgroundImage = `url(/assets/images/swirly-galaxy.webp)`;
      // slice.style.backgroundImage = `url(/assets/images/rotating-lights.webp)`;
      slice.style.backgroundImage = `url(/assets/images/earth-loop.webp)`;
      // const varWidth = getComputedStyle(slice).getPropertyValue("--width");
      // slice.style.setProperty("left", `calc(${varWidth} * ${i})`);
    }
  }, [images]);

  return (
    <div className="visualizer-container">
      <section className="visualizer-console" id="visualizer-console">
        <div className="visualizer-slices" id="visualizer-slices">
          {Array(numOctaves * octaveBasic.length + 1)
            .fill(null)
            .map((_, i) => (
              <div
                key={`visualizer-${i}`}
                className="visualizer-slice"
                ref={(e: HTMLDivElement) => (visSlices.current[i] = e)}
              ></div>
            ))}
        </div>
      </section>
    </div>
  );
}
