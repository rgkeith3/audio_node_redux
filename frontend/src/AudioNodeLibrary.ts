import { AudioNodeFlowInterface, AudioNodeLibraryEntry } from "./AudioNodeFlowInterface";
import * as Tone from 'tone';

const AudioNodeLibrary:{ [index: string] : AudioNodeLibraryEntry } = {
  oscillator: {
    func: () => new Tone.Oscillator().start(),
    flowData: new AudioNodeFlowInterface({
      label: "Oscillator", 
      params: [
        {
          name: "frequency", 
          min: 0, 
          max: 22000, 
          sliderAction: "exp"
        }
      ], 
      constants: [
        {
          name: "type", 
          options: ["sine", "square", "sawtooth", "triangle"]
        }
      ],
      outputs: "audio"
    })
  },
  output: {
    func: () => Tone.getDestination(),
    flowData: new AudioNodeFlowInterface({
      label: "Output",
      inputs: "audio"
    }),
  }
}

export default AudioNodeLibrary