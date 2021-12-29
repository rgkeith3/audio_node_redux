import React, { useState } from 'react';
import { Handle } from 'react-flow-renderer';
import AudioNodeGraph from '../../AudioNodeGraph';
import ConstantSelect from '../utils/ConstantSelect';
import ParamSlider from '../utils/ParamSlider';

const nodeStyle = {
  background: "red",
  display: "flex",
  flexDirection: "column"
}

const AudioFlowNode = ({ id, data: { label, params, constants, outputs, inputs }}) => {
  // there's probably a better way to initiate state
  const initialState = AudioNodeGraph.getNodesInitialState(id, params);
  const [state, setState] = useState(initialState);

  return(
    <div key={id} style={nodeStyle}>
      {inputs ? <Handle type="target" position="left" /> : ""}
      {params.map(({name}, idx) => 
        <Handle type="target" 
          key={name} 
          id={name} 
          position="top" 
          style={{ left: `${(idx + 0.5)/params.length * 100}%`}} 
          isValidConnection={AudioNodeGraph.isValidConnection}
        />
        )}
      <div className="label">{label}</div>
      {params.map(props => 
        <ParamSlider 
          {...props} 
          key={props.name}
          id={id}
          state={state}
          setState={setState}
        />)}
      {constants.map(props => 
        <ConstantSelect 
          {...props}
          key={props.name}
          id={id}
        />)}
      {outputs ? <Handle type="source" position="right" /> : ""}
    </div>
  )
}

export default AudioFlowNode;