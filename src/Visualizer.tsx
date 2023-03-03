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
    //store the note associated with each slice. Allows us to update the note associated with the slice without having to search through all the slicesOfNote and delete the slice from the associated note if a slice gets selected by a new note while activated by another (older) note
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
                randSlice.classList.add('playing')
                randSlice.classList.add('pressed')
                const slicesOnNote = slicesOfNote.get(keyboardKey) || [];
                slicesOnNote.push(randSlice);
                slicesOfNote.set(keyboardKey, slicesOnNote);
                noteOfSlice.set(randSlice, keyboardKey);
              }
            }
            if(!keyboardKey.classList.contains("pressed")) {
              const slices = slicesOfNote.get(keyboardKey);
              if(!slices) return
              for(let slice of slices) {
                if(noteOfSlice.get(slice) === keyboardKey) {
                  slice.classList.remove('pressed')
                }
              }
            }
            if (!keyboardKey.classList.contains("playing")) {
              const slices = slicesOfNote.get(keyboardKey);
              if (!slices) return;
              for (let slice of slices) {
                if (noteOfSlice.get(slice) === keyboardKey) {
                  noteOfSlice.delete(slice);
                  slicesOfNote.delete(keyboardKey);
                  slice.classList.remove('playing')
                }
              }
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
    // visSlices.style.backgroundImage = `url(${images[2]})`;
    const visSlice = document.getElementsByClassName("visualizer-slice");
    for (let i = 0; i < visSlice.length; i++) {
      const slice = visSlice[i] as HTMLElement;
      // slice.style.backgroundImage = `url(${images[1]})`;
      // slice.style.backgroundImage = `url(/assets/images/swirly-galaxy.webp)`;
      // slice.style.backgroundImage = `url(/assets/images/rotating-lights.webp)`;
      slice.style.backgroundImage = `url(/assets/images/earth-loop.webp)`;
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
