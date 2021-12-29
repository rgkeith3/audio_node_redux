import React, {useState} from 'react';
import AudioNodeLibrary from './AudioNodeLibrary';

const onDragStart = (event, nodeType) => {
  event.dataTransfer.setData('application/reactflow', nodeType);
  event.dataTransfer.effectAllowed = 'move';
};

const Pallette = ({ toggleAudioCtxState, audioCtxState }) => {
  const [open, setOpen] = useState(true);

  return (
    <aside id="pallette">
      <button onClick={toggleAudioCtxState}>{audioCtxState == "running" ? "Stop" : "Start"}</button>
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
