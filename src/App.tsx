import { useState } from "react";
import Note from "./Note";
import Octave from "./Octave";
import NoteAudio from "./NoteAudio";

function App() {
  let numOctaves = 3;
  let startOctave = 3;
  let allOctaves = [];
  let allNoteAudio = [];

  /***********stuff to do with the keyboard keys***************/
  const keyboardKeysConsecutive = [
    "z",
    "s",
    "x",
    "d",
    "c",
    "v",
    "g",
    "b",
    "h",
    "n",
    "j",
    "m",
    ",",
    "l",
    ".",
    ";",
    "/",
    "q",
    "2",
    "w",
    "3",
    "e",
    "4",
    "r",
    "t",
    "6",
    "y",
    "7",
    "u",
    "i",
    "9",
    "o",
    "0",
    "p",
    "-",
    "[",
    "]",
  ];
  //splits the keyboard down the middle so left half of computer keyboard controls left half of piano keys and right half of CKeyboard controls right half of PKeyboard
  const keyboardKeysSplit = [
    "z",
    "s",
    "x",
    "d",
    "c",
    "v",
    "g",
    "b",
    "1",
    "q",
    "2",
    "w",
    "e",
    "4",
    "r",
    "5",
    "t",
    "y",
    "h",
    "n",
    "j",
    "m",
    "k",
    ",",
    ".",
    ";",
    "/",
    "7",
    "u",
    "i",
    "9",
    "o",
    "0",
    "p",
    "-",
    "[",
    "]",
  ];
  const sustainPedal = " ";
  const maxKeys = keyboardKeysSplit.length;

  for (let i = startOctave; i < numOctaves + startOctave; i++) {
    allOctaves.push(<Octave octaveNum={i} key={`octave-${i}`} />);
    allNoteAudio.push(<NoteAudio octaveNum={i} key={`audio-${i}`} />);
  }

  return (
    <>
      <section className="keyboard">{allOctaves}</section>

      <section className="audioList">{allNoteAudio}</section>
    </>
  );
}

export default App;
