import React from 'react';
import AudioNodeGraph from '../../core/AudioNodeGraph';

const ConstantSelect = ({ name, options, id }) => {

  const onChange = ({ target: { value }}) => {
    AudioNodeGraph.get(id)[name] = value;
  }

  return (
    <div className={`controls constant-${name}`}>
      <label>{name}</label>
      <div className="inputs">
        <select onChange={onChange} name={name}>
          {options.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>
    </div>
  )
}

export default ConstantSelect;