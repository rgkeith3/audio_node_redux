import React from 'react';
import AudioNodeGraph from '../../core/AudioNodeGraph';
import { reverseTransformValue, transformValue } from '../../utils/tranformValues';

const ParamSlider = ({ id, name, min, max, sliderAction, state, setState }) => {
  const sliderMax = reverseTransformValue(sliderAction, max);
  
  const onSlide = ({target: {value}}) => {
    const transformedValue = transformValue(sliderAction, parseFloat(value));
    AudioNodeGraph.setTargetValue(id, name, transformedValue);
    setState({...state, [name]: transformedValue, [`${name}-slider`]: value})
  }

  const onChange = ({target: {value}}) => {
    AudioNodeGraph.setTargetValue(id, name, value);
    const parsedValue = parseFloat(value) || 0;
    setState({...state, [name]: value, [`${name}-slider`]: reverseTransformValue(sliderAction, parsedValue)});
  }

  return (
    <div key={name} className={`controls param-${name}`}>
      <label>{name}</label>
      <div className="inputs">
        <input
          className="nodrag"
          type="range"
          min={min}
          max={sliderMax}
          step="0.01"
          value={state[`${name}-slider`]}
          onChange={onSlide}
          />
        <input
          value={state[name]}
          onChange={onChange}
        />
      </div>
    </div>
  )
}

export default ParamSlider;