import { useEffect } from "react";

type VisualizerProp = {
  images: string[];
}

export default function Visualizer({images}: VisualizerProp) {
  useEffect(() => {
    const visConsole = document.getElementById('visualizer-console') as HTMLDivElement;
    visConsole.style.backgroundImage = `url(${images[0]}`
  }, [images])

  return (
    <div className="visualizer-container">
      <section className="visualizer-console" id="visualizer-console">
        <h1>visualizer</h1>
      </section>
    </div>
  );
}
