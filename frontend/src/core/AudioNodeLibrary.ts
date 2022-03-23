import { AudioNodeFlowInterface, AudioNodeLibraryEntry } from "./AudioNodeFlowInterface";
import * as Tone from 'tone';

const AudioNodeLibrary:{ [index: string] : AudioNodeLibraryEntry } = {
  envelope: {
    func: () => new Tone.Envelope(),
    flowData: new AudioNodeFlowInterface({
      label: "Envelope",
      params: [
        {
          name: "attack",
          min: 0,
          max: 1,
          sliderAction: "lin"
        },
        {
          name: "decay",
          min: 0,
          max: 1,
          sliderAction: "lin"
        },
        {
          name: "sustain",
          min: 0,
          max: 1,
          sliderAction: "lin"
        },
        {
          name: "release",
          min: 0,
          max: 1,
          sliderAction: "lin"
        }
      ],
      outputs: "control"
    })
  },
  multiply: {
    func: () => new Tone.Multiply(),
    flowData: new AudioNodeFlowInterface({
      label: "Multiply",
      params: [
        {
          name: "factor",
          min: -22000,
          max: 22000
        }
      ],
      inputs: "control",
      outputs: "audio"
    })
  },
  add: {
    func: () => new Tone.Add(),
    flowData: new AudioNodeFlowInterface({
      label: "Add",
      params: [
        {
          name: "addend",
          min: -22000,
          max: 22000
        }
      ],
      inputs: "audio", 
      outputs: "audio"
    })
  },
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
  filter: {
    func: () => new Tone.Filter(),
    flowData: new AudioNodeFlowInterface({
      label: "Filter",
      params: [
        {
          name: "frequency",
          min: 0,
          max: 22000,
          sliderAction: "exp"
        },
        {
          name: "Q",
          min: 0,
          max: 10,
        }
      ],
      constants: [
        {
          name: "type",
          options: ["lowpass", "highpass", "bandpass", "lowshelf", "highshelf", "notch", "allpass", "peaking"]
        },
        {
          name: "rolloff",
          options: ["-12", "-24", "-48", "-96"]
        }
      ],
      inputs: "audio",
      outputs: "audio"
    })
  },
  send: {
    func: () => Tone.getContext().createMediaStreamDestination(),
    flowData: new AudioNodeFlowInterface({
      label: "Sender",
      inputs: "audio"
    })
  },
  receive: {
    func: () => new Tone.ToneBufferSource(),
    flowData: new AudioNodeFlowInterface({
      label: "Receiver",
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