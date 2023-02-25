import { useEffect, useRef } from "react";
import { octaveBasic } from "./helpers";

type VisualizerProp = {
  keyboardStart: number;
  numOctaves: number;
  images: string[];
  notesRef: HTMLButtonElement[];
};

let isMounted = false;

export default function Visualizer({
  keyboardStart,
  numOctaves,
  images,
  notesRef,
}: VisualizerProp) {
  const observerRef = useRef<null | MutationObserver>(null);
  const visSlices = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (isMounted) return;
    isMounted = true;
    const allNotes: Node[] = [];
    const maxSlices = 10; //the max number of slices that can go transparent when a key is pressed

    for (let i = keyboardStart; i <= keyboardStart + numOctaves; i++) {
      if (i < keyboardStart + numOctaves) {
        for (let key of octaveBasic) {
          let newKey = document.getElementById(`note-${key.note}${i}`) as Node;
          if (newKey) allNotes.push(newKey);
        }
      } else {
        let newKey = document.getElementById(
          `note-${octaveBasic[0].note}${i}`
        ) as Node;
        if (newKey) allNotes.push(newKey);
      }
    }

    const visSlice = document.getElementsByClassName("visualizer-slice");
    for (let i = 0; i < visSlice.length; i++) {
      const slice = visSlice[i] as HTMLElement;
      let keyToWatch: Node;
      if (i < visSlice.length - 1) {
        keyToWatch = allNotes[i];
      } else {
        keyToWatch = document.getElementById(
          `note-${octaveBasic[0].note}${keyboardStart + numOctaves}`
        ) as Node;
      }

      observerRef.current = new MutationObserver((mutationList, observer) => {
        for (let mutation of mutationList) {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "class"
          ) {
            const elementClass = mutation.target;
            let interval = 0;
            let visFadeSpeed = 0.01;
            if (elementClass instanceof HTMLElement) {
              if (elementClass.classList.contains("playing")) {
                slice.style.opacity = "0";
                interval = setInterval(() => {
                  if (Number(slice.style.opacity) >= 1) {
                    clearInterval(interval);
                    return;
                  }
                  slice.style.opacity = String(
                    Number(slice.style.opacity) + visFadeSpeed
                  );
                }, 100);
              }
              if (!elementClass.classList.contains("playing")) {
                slice.style.opacity = "1";
                clearInterval(interval);
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
                ref={(e:HTMLDivElement) => visSlices.current[i] = e}
              ></div>
            ))}
        </div>
      </section>
    </div>
  );
}
