import React, { useState } from 'react';
import connection from '../core/SocketConnection';
import CopyToClipboard from './utils/CopyToClipboard';

const Connect = () => {
  const [userId, setUserId] = useState();
  const onSubmit = (ev) => {
    ev.preventDefault();
    const { value: connectUserId } = ev.target.elements.connectUserId
    connection.connect(connectUserId, setUserId);
  }

  const inner = () => {
    if (userId) {
      return (
        <div className="code">
          <h4>You are now connected with</h4>
          <strong>{userId}</strong>
          <CopyToClipboard copyValue={userId} />
        </div>
      );
    } else {
      return (
        <form onSubmit={onSubmit}>
          <h4>Want to connect with other noodlers?</h4>
          <p>enter a unique user id</p>
          <input id="connectUserId" />
          <button>Connect!</button>
        </form>
      );
    }
  }

  return (
    <aside id="connect">
      {inner()}
    </aside>
  );
}

export default Connect;
