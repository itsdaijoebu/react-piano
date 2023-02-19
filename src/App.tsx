import { useState } from "react";
import Note from "./Note";
import Octave from "./Octave";
import NoteAudio from "./NoteAudio"

function App() {
  let numOctaves = 3;
  let startOctave = 3;
  let allOctaves = [];
  let allNoteAudio = []

  for(let i = 3; i < numOctaves+startOctave; i++) {
    allOctaves.push(<Octave octaveNum={i} key={`octave-${i}`}/>)
    allNoteAudio.push(<NoteAudio octaveNum={i} key={`audio-${i}`}/>)
  }
  
  return (
    <>
    <section className='keyboard'>
      {allOctaves}
    </section>

    <section className="audioList">
      {allNoteAudio}
    </section>
    </>
  );
}

export default App;
