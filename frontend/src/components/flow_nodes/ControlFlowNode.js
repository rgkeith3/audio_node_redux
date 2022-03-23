import React, { useState } from 'react';
import { Handle } from 'react-flow-renderer';
import AudioNodeGraph from '../../core/AudioNodeGraph';
import ParamSlider from '../utils/ParamSlider';

const nodeStyle = {
  background: "blue",
  display: "flex",
  flexDirection: "column"
}

const ControlFlowNode = ({id, data: { label, params, inputs, outputs }}) => {
  const initialState = AudioNodeGraph.getNodesInitialState(id, params);
  const [state, setState] = useState(initialState);

  const onMouseDown = () => {
    AudioNodeGraph.get(id).triggerAttack();
  }

  const onMouseUp = () => {
    AudioNodeGraph.get(id).triggerRelease();
  }

  return(
    <div key={id} style={nodeStyle}>
      {inputs ? <Handle type="target" position="left" isValidConnection={AudioNodeGraph.isValidConnection} /> : ""}
      <div className="label">{label}</div>
      <button onMouseDown={onMouseDown} onMouseUp={onMouseUp}>Trig!</button>
      {params.map(param => 
        <ParamSlider
          {...param}
          key={param.name}
          id={id}
          state={state}
          setState={setState}
        />
      )}
      {outputs ? <Handle type="source" position="right" isValidConnection={AudioNodeGraph.isValidConnection} /> : ""}
    </div>
  );
}

export default ControlFlowNode;