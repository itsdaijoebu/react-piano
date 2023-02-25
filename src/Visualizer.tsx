import { useEffect, useRef } from "react";
import { octaveBasic } from "./helpers";

type VisualizerProp = {
  keyboardStart: number;
  numOctaves: number;
  images: string[];
};

let isMounted = false;

export default function Visualizer({
  keyboardStart,
  numOctaves,
  images,
}: VisualizerProp) {
  const observerRef = useRef<null | MutationObserver>(null);
  const visSlices = useRef([])
  
  useEffect(() => {
    if(isMounted) return
    isMounted=true;
    const allNotes: Node[] = [];
    const maxSlices = 10; //the max number of slices that can go transparent when a key is pressed
    
    for (let i = keyboardStart; i <= keyboardStart + numOctaves; i++) {
      if (i < keyboardStart + numOctaves) {
        for (let key of octaveBasic) {
          let newKey = document.getElementById(`note-${key.note}${i}`) as Node;
          if (newKey) allNotes.push(newKey);
        }
      } else {
        let newKey = document.getElementById(`note-${octaveBasic[0].note}${i}`) as Node;
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
                  if(Number(slice.style.opacity) >= 1) {
                    clearInterval(interval)
                    return
                  } 
                  slice.style.opacity = String(Number(slice.style.opacity) + visFadeSpeed)
                }, 100)
              }
              if (!elementClass.classList.contains("playing")) {
                slice.style.opacity = "1";
                clearInterval(interval)
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
          <div className="visualizer-slice" id="visualizerslice1"></div>
          <div className="visualizer-slice" id="visualizerslice2"></div>
          <div className="visualizer-slice" id="visualizerslice3"></div>
          <div className="visualizer-slice" id="visualizerslice4"></div>
          <div className="visualizer-slice" id="visualizerslice5"></div>
          <div className="visualizer-slice" id="visualizerslice6"></div>
          <div className="visualizer-slice" id="visualizerslice7"></div>
          <div className="visualizer-slice" id="visualizerslice8"></div>
          <div className="visualizer-slice" id="visualizerslice9"></div>
          <div className="visualizer-slice" id="visualizerslice10"></div>
          <div className="visualizer-slice" id="visualizerslice11"></div>
          <div className="visualizer-slice" id="visualizerslice12"></div>
          <div className="visualizer-slice" id="visualizerslice13"></div>
          <div className="visualizer-slice" id="visualizerslice14"></div>
          <div className="visualizer-slice" id="visualizerslice15"></div>
          <div className="visualizer-slice" id="visualizerslice16"></div>
          <div className="visualizer-slice" id="visualizerslice17"></div>
          <div className="visualizer-slice" id="visualizerslice18"></div>
          <div className="visualizer-slice" id="visualizerslice19"></div>
          <div className="visualizer-slice" id="visualizerslice20"></div>
          <div className="visualizer-slice" id="visualizerslice21"></div>
          <div className="visualizer-slice" id="visualizerslice22"></div>
          <div className="visualizer-slice" id="visualizerslice23"></div>
          <div className="visualizer-slice" id="visualizerslice24"></div>
          <div className="visualizer-slice" id="visualizerslice25"></div>
          <div className="visualizer-slice" id="visualizerslice26"></div>
          <div className="visualizer-slice" id="visualizerslice27"></div>
          <div className="visualizer-slice" id="visualizerslice28"></div>
          <div className="visualizer-slice" id="visualizerslice29"></div>
          <div className="visualizer-slice" id="visualizerslice30"></div>
          <div className="visualizer-slice" id="visualizerslice31"></div>
          <div className="visualizer-slice" id="visualizerslice32"></div>
          <div className="visualizer-slice" id="visualizerslice33"></div>
          <div className="visualizer-slice" id="visualizerslice34"></div>
          <div className="visualizer-slice" id="visualizerslice35"></div>
          <div className="visualizer-slice" id="visualizerslice36"></div>
          <div className="visualizer-slice" id="visualizerslice37"></div>
        </div>
      </section>
    </div>
  );
}
