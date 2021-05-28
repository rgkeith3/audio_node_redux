import React, {useState} from 'react';
import { Handle } from 'react-flow-renderer';
import AudioNodeGraph from '../../AudioNodeGraph';
import connection from '../../SocketConnection';
import CopyToClipboard from '../utils/CopyToClipboard';

const SenderFlowNode = ({ id }) => {
  const [code, setCode] = useState("");

  const onClick = () => {
    connection.onKickoffCallback(code, () => {
      connection.newConnection(code, AudioNodeGraph.get(id).stream.getTracks()[0]);
    });
    connection.senderReady(code);
  };
  return (
    <div key={id}>
      <Handle type="target" position="left" />
      <div className="label">Sender</div>
      <div className="code">Your Code is 
        <strong>{window.sessionUuid}</strong>
        <CopyToClipboard copyValue={window.sessionUuid}/>
      </div>
      <div className="description">Enter their code and connect</div>
      <input value={code} onChange={ev => setCode(ev.target.value)} />
      <button type="button" disabled={code.length !== 6} onClick={onClick}>Connect</button>
    </div>
  );
}

export default SenderFlowNode;