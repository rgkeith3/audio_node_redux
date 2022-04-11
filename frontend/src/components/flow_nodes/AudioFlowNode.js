import React, { useState } from 'react';
import { Handle } from 'react-flow-renderer';
import audioNodeGraph from '../../core/AudioNodeGraph';
import ConstantSelect from '../utils/ConstantSelect';
import ParamSlider from '../utils/ParamSlider';
import styles from "./AudioFlowNode.module.css";

const AudioFlowNode = ({ id, data: { label, params, constants, outputs, inputs }}) => {
  // there's probably a better way to initiate state
  const initialState = audioNodeGraph.getNodesInitialState(id, params);
  const [state, setState] = useState(initialState);
  const [minimized, setMinimized] = useState(false);

  const $params = () => (minimized ? "" : 
    <div className="params">
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
    </div>);

  return(
    <div key={id} className={styles.node}>
      {inputs ? <Handle type="target" position="left" /> : ""}
      {params.map(({name}, idx) => 
        <Handle type="target" 
          key={name} 
          id={name} 
          position="top" 
          style={{ left: `${(idx + 0.5)/params.length * 100}%`}} 
          isValidConnection={audioNodeGraph.isValidConnection}
        />
        )}
      <div className="header">
        <div className="label">{label}</div>
        <button onClick={() => setMinimized(!minimized)}>_</button>
      </div>
      {$params()}
      {outputs ? <Handle type="source" position="right" /> : ""}
    </div>
  )
}

export default AudioFlowNode;