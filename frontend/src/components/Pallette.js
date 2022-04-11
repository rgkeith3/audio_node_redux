import React, {useState} from 'react';
import { AudioNodeGraph } from '../core/AudioNodeGraph';
import AudioNodeLibrary from '../core/AudioNodeLibrary';

const onDragStart = (event, nodeType) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
};

const Pallette = () => {
  const [open, setOpen] = useState(true);
  const [audioCtxState, setAudioCtxState] = useState(AudioNodeGraph.state);
  const [transportState, setTransportState] = useState(AudioNodeGraph.transport.state);
  const [bpm, setBPM] = useState(AudioNodeGraph.transport.bpm.value);

  const toggleAudioCtxState = () => {
    if (audioCtxState !== "running") {
      AudioNodeGraph.resume().then(state => setAudioCtxState(state));
    }
  }

  const playPauseTransport = () => {
    if (transportState === "started") {
      AudioNodeGraph.transport.pause();
    } else {
      AudioNodeGraph.transport.start();
    }
    setTransportState(AudioNodeGraph.transport.state);
  }

  const stopTransport = () => {
    AudioNodeGraph.transport.stop();
    setTransportState(AudioNodeGraph.transport.state);
  }

  const updateBPM = (ev) => {
    AudioNodeGraph.transport.bpm.value = ev.target.value;
    setBPM(AudioNodeGraph.transport.bpm.value);
  }

  return (
    <aside id="pallette">
      <button onClick={toggleAudioCtxState}>{audioCtxState === "running" ? "Stop" : "Start"}</button>
      <div className="transport">
        <button onClick={playPauseTransport}>{transportState === "started" ? "Pause" : "Play"}</button>
        <button onClick={stopTransport}>Stop</button>
        <input onChange={updateBPM} value={bpm} />
      </div>
      <button onClick={() => setOpen(!open)}>{open ? "Close" : "Open"}</button>
      {open && <div className="drawer">
        <div className="description">You can drag these nodes to the pane on the right.</div>
        <ul>
          {Object.keys(AudioNodeLibrary).map(key =>
            <div key={key} className="dndnode" onDragStart={(event) => onDragStart(event, key)} draggable>
              {AudioNodeLibrary[key].flowData.label}
            </div>
          )}
        </ul>
      </div>}
    </aside>
  );
};

export default Pallette;
