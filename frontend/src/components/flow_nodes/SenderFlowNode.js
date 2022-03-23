import React, {useState} from 'react';
import { Handle } from 'react-flow-renderer';
import AudioNodeGraph from '../../core/AudioNodeGraph';
import connection from '../../core/SocketConnection';

const SenderFlowNode = ({ id }) => {
  const [receiverUserId, setReceiverUserId] = useState();
  const [waiting, setWaiting] = useState(false);

  const onSubmit = (ev) => {
    ev.preventDefault();
    const { value: receiverUserId } = ev.target.elements.receiverUserId;
    connection.onKickoffCallback(receiverUserId, () => {
      setWaiting(false);
      connection.newConnection(receiverUserId, AudioNodeGraph.get(id).stream.getTracks()[0]);
    });
    setReceiverUserId(receiverUserId);
    connection.senderReady(receiverUserId, () => setWaiting(true));
  };

  const inner = () => {
    if (waiting) {
      return (
        <div>
          <h4>Waiting for transmission...</h4>
        </div>
      )
    } else if (receiverUserId) {
      return (
        <div>
          <h4>Sending transmission to</h4>
          <strong>{receiverUserId}</strong>
        </div>
      );
    } else {
      return (
        <form onSubmit={onSubmit}>
          <input id="receiverUserId" />
          <button>Connect</button>
        </form>
      );
    }
  }
  return (
    <div key={id}>
      <Handle type="target" position="left" />
      <div className="label">Sender</div>
      <div className="description">Enter your friends user id and connect</div>
      {inner()}
    </div>
  );
}

export default SenderFlowNode;