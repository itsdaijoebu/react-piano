import { useEffect } from "react";

type VisualizerProp = {
  images: string[];
};

export default function Visualizer({ images }: VisualizerProp) {
  useEffect(() => {
    const visConsole = document.getElementById(
      "visualizer-console"
    ) as HTMLDivElement;
    visConsole.style.backgroundImage = `url(${images[0]}`;
    const visSlices = document.getElementById(
      "visualizer-slices"
    ) as HTMLDivElement;
    visSlices.style.backgroundImage = `url(${images[1]})`;
    const visSlice = document.getElementsByClassName("visualizer-slice");
    for(let i = 0; i < visSlice.length; i++) {
      const slice = visSlice[i] as HTMLElement;
      const varWidth = getComputedStyle(slice).getPropertyValue('--width')
      slice.style.backgroundImage = `url(${images[1]})`
      slice.style.setProperty('left', `calc(${varWidth} * ${i})`)
      slice.style.setProperty('background-position', `calc(-1*${varWidth}*(${i}+1)) 0`)
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
