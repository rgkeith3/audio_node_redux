import React, { useState } from 'react';
import ReactFlow, { Background, Controls, Elements, OnLoadParams, Connection, Edge, ConnectionLineType, addEdge, updateEdge, removeElements, isEdge, isNode } from 'react-flow-renderer';
import './App.css';
import AudioNodeGraph from './AudioNodeGraph';
import AudioFlowNode from './components/flow_nodes/AudioFlowNode';
import ControlFlowNode from './components/flow_nodes/ControlFlowNode';
import Pallette from './Pallette';

const nodeTypes = {
  default: AudioFlowNode,
  envelope: ControlFlowNode
};

let id = 0;
const getId = () => `${id++}`;

function App() {
  const [elements, setElements] = useState<Elements>([]);
  const [audioCtxState, setAudioCtxState] = useState(AudioNodeGraph.state);
  const [patchInstance, setPatchInstance] = useState<OnLoadParams>();

  const onLoad = (reactFlowInstance: OnLoadParams) => setPatchInstance(reactFlowInstance);
  
  const toggleAudioCtxState = () => {
    if (audioCtxState !== "running") {
      AudioNodeGraph.resume().then(state => setAudioCtxState(state));
    }
  }

  const onConnect = (connection: Connection | Edge) => {
    setElements((els) => addEdge({...connection, type: ConnectionLineType.SmoothStep}, els));
    AudioNodeGraph.connect(connection);
  }

  const onEdgeUpdate = (oldEdge: Edge, newConnection: Connection) => {
    setElements((els) => updateEdge(oldEdge, newConnection, els));

    AudioNodeGraph.disconnect(oldEdge);
    AudioNodeGraph.connect(newConnection);
  }

  const onElementsRemove = (elementsToRemove: Elements) => {
    setElements((els) => removeElements(elementsToRemove, els));
    elementsToRemove.forEach((element) => {
      if (isEdge(element)) {
        AudioNodeGraph.disconnect(element);
      }
    });

    elementsToRemove.forEach((element) => {
      if (isNode(element)) {
        AudioNodeGraph.remove(element.id);
      }
    })
  }

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const type = event.dataTransfer!.getData('application/reactflow');
    const position = patchInstance!.project({ x: event.clientX, y: event.clientY });

    const id = getId();
    const data = AudioNodeGraph.add(type, id);

    const newNode = {
      id,
      type,
      position,
      data
    };

    setElements((es) => es.concat(newNode));
  };

  return (
    <div className="App">
      <div className="reactflow-wrapper">
        <ReactFlow
          elements={elements}
          nodeTypes={nodeTypes}
          onLoad={onLoad}
          onConnect={onConnect}
          onEdgeUpdate={onEdgeUpdate}
          onElementsRemove={onElementsRemove}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
      <Pallette 
        audioCtxState={audioCtxState}
        toggleAudioCtxState={toggleAudioCtxState}
      />
    </div>
  );
}

export default App;
