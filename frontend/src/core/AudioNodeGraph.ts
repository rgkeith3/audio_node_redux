import { Connection, Edge } from "react-flow-renderer";
import { AudioNodeFlowInterface, Param } from "./AudioNodeFlowInterface";
import AudioNodeLibrary from "./AudioNodeLibrary";
import { reverseTransformValue } from "../utils/tranformValues";
import * as Tone from 'tone';
import { BaseContext, Param as ToneParam, Signal, ToneAudioNode } from "tone";
import { Transport } from "tone/build/esm/core/clock/Transport";

export class AudioNodeGraph {
  constructor() {
    this.nodes = new Map();
    this.state = Tone.getContext().state;
    this.transport = Tone.Transport;
    this.loaded = false;
    
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.add = this.add.bind(this);
    this.set = this.set.bind(this);
    this.get = this.get.bind(this);
    this.getTarget = this.getTarget.bind(this);
    this.isValidConnection = this.isValidConnection.bind(this);
    this.remove = this.remove.bind(this);
    this.resume = this.resume.bind(this);
  }

  getContext() : BaseContext {
    return Tone.getContext();
  }

  connect(connection: Connection | Edge) : void {
    const { source, target, targetHandle } = connection;
    const sourceNode = this.nodes.get(source!)!;
    sourceNode.connect(this.getTarget(target!, targetHandle));
  }

  disconnect(edge: Edge) : void {
    const { source, target, targetHandle } = edge;
    const sourceNode = this.nodes.get(source)!;
    sourceNode.disconnect(this.getTarget(target, targetHandle));
  }

  // redefine audioNodeFlowInterface and return here
  add(type: string, id: string) : AudioNodeFlowInterface {
    const audioNode = AudioNodeLibrary[type].func();
    this.nodes.set(id, audioNode);
    return AudioNodeLibrary[type].flowData;
  }

  set(id: string, node: ToneAudioNode) {
    this.nodes.set(id, node);
  }

  get(id: string) : ToneAudioNode {
    return this.nodes.get(id);
  }

  getTarget(id: string, param: string | null | undefined) : ToneAudioNode {
    const targetNode = this.get(id)!;
    if (!param) return targetNode;

    if (targetNode instanceof AudioWorkletNode) {
      // @ts-ignore: AudioParamMap interface definition missing functions
      return targetNode.parameters.get(param);
    }
    // @ts-ignore: can't string index into AudioNode
    return targetNode[param];
  }

  setTargetValue(id: string, param: string, value: number) : void {
    const targetNode = this.get(id)!;
    targetNode.set({ [param]: value });
  }

  isValidConnection(conn: Connection) {
    const source = this.get(conn.source!);
    const target = this.getTarget(conn.target!, conn.targetHandle);

    if (source instanceof ToneAudioNode && (target instanceof ToneParam || target instanceof ToneAudioNode)) {
      return true;
    }
    return false;
  }

  getNodesInitialState(id: string, params: Param[]) : object {
    const audioNode = this.get(id);
    if (audioNode) {
      return params.reduce((initial, {name, sliderAction}) => {
        const nodeParam = this.getTarget(id, name);
        if (nodeParam instanceof Signal) {
          //@ts-ignore
          initial[name] = nodeParam.value;
          //@ts-ignore
          initial[`${name}-slider`] = reverseTransformValue(sliderAction, nodeParam.value);
        }
        return initial;
      }, {});
    }
    return {};
  }

  remove(id: string) : boolean {
    this.nodes.get(id).disconnect();
    return this.nodes.delete(id);
  }

  async resume() : Promise<"closed" | "running" | "suspended">{
    await Tone.start();
    return this.state = Tone.getContext().state;
  }

  loaded: boolean;
  state: string;
  transport: Transport;
  nodes: Map<string, any>;
}

const nodeGraph = new AudioNodeGraph();
//@ts-ignore
window.nodeGraph = nodeGraph;

export default nodeGraph;