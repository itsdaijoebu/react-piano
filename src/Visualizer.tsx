import { useEffect, useRef } from "react";
import { octaveBasic } from "./helpers";

type VisualizerProp = {
  keyboardStart: number;
  numOctaves: number;
  images: string[];
};

export default function Visualizer({
  keyboardStart,
  numOctaves,
  images,
}: VisualizerProp) {
  const observerRef = useRef<null | MutationObserver>(null);

  useEffect(() => {
    const whiteNotesBasic = octaveBasic.filter(
      (note) => note.color === "white"
    );
    const whiteNotesAll: Node[] = [];
    for (let i = keyboardStart; i <= keyboardStart + numOctaves; i++) {
      if (i < keyboardStart + numOctaves) {
        for (let key of whiteNotesBasic) {
          let newKey = document.getElementById(`note-${key.note}${i}`) as Node;
          if (newKey) whiteNotesAll.push(newKey);
        }
      } else {
        let newKey = document.getElementById(`note-${whiteNotesBasic[0].note}${i}`) as Node;
        if (newKey) whiteNotesAll.push(newKey);
      }
    }

    const visSlice = document.getElementsByClassName("visualizer-slice");
    for (let i = 0; i < visSlice.length; i++) {
      const slice = visSlice[i] as HTMLElement;
      let keyToWatch: Node;
      if (i < visSlice.length - 1) {
        keyToWatch = whiteNotesAll[i];
      } else {
        keyToWatch = document.getElementById(
          `note-${whiteNotesBasic[0].note}${keyboardStart + numOctaves}`
        ) as Node;
      }

      observerRef.current = new MutationObserver((mutationList, observer) => {
        for (let mutation of mutationList) {
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "class"
          ) {
            const elementClass = mutation.target;
            if (elementClass! instanceof HTMLElement) {
              if (elementClass.classList.contains("playing")) {
                slice.style.opacity = "0";
              }
              if (!elementClass.classList.contains("playing")) {
                slice.style.opacity = "1";
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
      const varWidth = getComputedStyle(slice).getPropertyValue("--width");
      slice.style.backgroundImage = `url(${images[1]})`;
      // slice.style.backgroundImage = `url(/assets/images/swirly-galaxy.webp)`;
      // slice.style.backgroundImage = `url(/assets/images/rotating-lights.webp)`;
      // slice.style.backgroundImage = `url(/assets/images/earth-loop.webp)`;
      slice.style.setProperty("left", `calc(${varWidth} * ${i})`);
    }
  }, [images]);

  return (
    <div className="visualizer-container">
      <section className="visualizer-console" id="visualizer-console">
        <div className="visualizer-slices" id="visualizer-slices">
          <div className="visualizer-slice key" id="visualizer-slice1"></div>
          <div className="visualizer-slice key" id="visualizer-slice2"></div>
          <div className="visualizer-slice key" id="visualizer-slice3"></div>
          <div className="visualizer-slice key" id="visualizer-slice4"></div>
          <div className="visualizer-slice key" id="visualizer-slice5"></div>
          <div className="visualizer-slice key" id="visualizer-slice6"></div>
          <div className="visualizer-slice key" id="visualizer-slice7"></div>
          <div className="visualizer-slice key" id="visualizer-slice8"></div>
          <div className="visualizer-slice key" id="visualizer-slice9"></div>
          <div className="visualizer-slice key" id="visualizer-slice10"></div>
          <div className="visualizer-slice key" id="visualizer-slice11"></div>
          <div className="visualizer-slice key" id="visualizer-slice12"></div>
          <div className="visualizer-slice key" id="visualizer-slice13"></div>
          <div className="visualizer-slice key" id="visualizer-slice14"></div>
          <div className="visualizer-slice key" id="visualizer-slice15"></div>
          <div className="visualizer-slice key" id="visualizer-slice16"></div>
          <div className="visualizer-slice key" id="visualizer-slice17"></div>
          <div className="visualizer-slice key" id="visualizer-slice18"></div>
          <div className="visualizer-slice key" id="visualizer-slice19"></div>
          <div className="visualizer-slice key" id="visualizer-slice20"></div>
          <div className="visualizer-slice key" id="visualizer-slice21"></div>
          <div className="visualizer-slice key" id="visualizer-slice22"></div>
        </div>
      </section>
    </div>
  );
}
