import React, {useState} from 'react';
import { Handle } from 'react-flow-renderer';
import audioNodeGraph from '../../core/AudioNodeGraph';
import connection from '../../core/SocketConnection';

const ReceiverFlowNode = ({ id }) => {
  const [senderUserId, setSenderUserId] = useState();
  const [waiting, setWaiting] = useState(false);

  const onTrack = (track, rtcPeerUserId) => {
    audioNodeGraph.get(id).useStream(new MediaStream([track]));
    connection.setConnected(rtcPeerUserId);
    setWaiting(false);
  }

  const onSubmit = (ev) => {
    ev.preventDefault();
    const { value: senderUserId } = ev.target.elements.senderUserId;
    setSenderUserId(senderUserId);
    connection.onTrackCallback(senderUserId, onTrack);
    connection.receiverReady(senderUserId, () => setWaiting(true));
  };

  const inner = () => {
    if (waiting) {
      return (
        <div>
          <h4>Waiting for transmission...</h4>
        </div>
      )
    } else if (senderUserId) {
      return (
        <div>
          <h4>Receiving transmission from</h4>
          <strong>{senderUserId}</strong>
        </div>
      );
    } else {
      return(
        <form onSubmit={onSubmit}>
          <input id="senderUserId" />
          <button>Connect</button>
        </form>
      );
    }
  }
  return (
    <div key={id}>
      <Handle type="source" position="right" />
      <div className="label">Receiver</div>
      <div className="description">Enter your friends user id and connect</div>
      {inner()}
    </div>
  );
}

export default ReceiverFlowNode;