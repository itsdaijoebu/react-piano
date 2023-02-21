type SustainProps = {
  keyboardKey: string;
  isSustained: boolean;
  onClick: React.MouseEventHandler
};

export default function Sustain({ keyboardKey, isSustained, onClick }: SustainProps) {

  return (
    <button className={`sustain ${isSustained?'active':''}`} id="sustain" onClick={onClick}>
      <span className="toggleable-text">
        Sustain pedal<span className='sustain-spacing'>Spacebar</span>
      </span>
    </button>
  );
}
