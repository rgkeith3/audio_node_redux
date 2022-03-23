export type Param = {
  name: string,
  min: number,
  max: number,
  sliderAction?: string
}

export class ControlParam {
  constructor(value: number) {
    this.value = value;
  }
  setValueAtTime(value: number, _currentTime: number) {
    this.value = value;
  }
  value: number;
}

export type Constant = {
  name: string,
  options: string[]
}

export type AudioNodeFlowInterfaceOptions = {
  audioNode?: AudioNode
  label: string
  params?: Param[]
  constants?: Constant[],
  inputs?: "audio" | "control" | "trigger",
  outputs?: "audio" | "control" | "trigger"
}

export class AudioNodeFlowInterface {
  constructor(options: AudioNodeFlowInterfaceOptions) {
    const { label, params, constants, inputs, outputs } = options;
    this.label = label;
    this.params = params || [];
    this.constants = constants || [];
    this.outputs = outputs || null;
    this.inputs = inputs || null;
  }
  label: string;
  params: Param[];
  constants: Constant[];
  outputs: "audio" | "control" | "trigger" | null;
  inputs: "audio" | "control" | "trigger" | null;
}

export type AudioNodeLibraryEntry = {
  func: any;
  flowData: AudioNodeFlowInterface;
}