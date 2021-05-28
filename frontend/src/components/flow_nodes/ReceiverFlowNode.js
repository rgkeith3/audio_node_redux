import React, {useState} from 'react';
import { Handle, useStoreState } from 'react-flow-renderer';
import AudioNodeGraph from '../../AudioNodeGraph';
import connection from '../../SocketConnection';
import CopyToClipboard from '../utils/CopyToClipboard';

const ReceiverFlowNode = ({ id }) => {
  const [code, setCode] = useState("");
  const edges = useStoreState(store => store.edges);

  const onTrack = (track) => {
    const audioNode = AudioNodeGraph.audioCtx.createMediaStreamSource(new MediaStream([track]));
    AudioNodeGraph.remove(id);
    AudioNodeGraph.set(id, audioNode);
    const edgesToConnect = edges.filter(({source}) => source === id);
    edgesToConnect.forEach(AudioNodeGraph.connect);
  }

  const onClick = () => {
    connection.onTrackCallback(code, onTrack.bind(this));
    connection.receiverReady(code)
  };
  return (
    <div key={id}>
      <Handle type="source" position="right" />
      <div className="label">Receiver</div>
      <div className="code">Your Code is 
        <strong>{window.sessionUuid}</strong>
        <CopyToClipboard copyValue={window.sessionUuid}/>
      </div>
      <div className="description">Enter their code and connect</div>
      <input value={code} onChange={ev => setCode(ev.target.value)} />
      <button type="button" disabled={code.length < 6} onClick={onClick}>Connect</button>
    </div>
  );
}

export default ReceiverFlowNode;