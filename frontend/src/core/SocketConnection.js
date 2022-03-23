import { Socket } from "phoenix"

class SocketConnection {
  constructor() {
    this.rtcPeers = {};
    this.kickoffCallbacks = {};
    this.onTrackCallbacks = {};
  }
  connect(userId, setUserId) {
    this.socket = new Socket("ws://localhost:4000/socket", {params: { userId }});
    this.socket.connect();
    this.channel = this.socket.channel(`signal:${userId}`, {});
    this.channel.join()
      .receive("ok", resp => {
        setUserId(userId);
        console.log("Joined Sucessfully", resp);
      })
      .receive("error", resp => console.log("Unable to Join", resp));

    this.channel.on("kickoff", this.onKickoff.bind(this));
    this.channel.on("offer", this.onOfferSignal.bind(this));
    this.channel.on("answer", this.onAnswerSignal.bind(this));
    this.channel.on("ice-candidate", this.onIceCandidateSignal.bind(this));
  }

  onKickoffCallback(code, callback) {
    this.kickoffCallbacks[code] = callback;
  }

  onKickoff({ receiver }) {
    this.kickoffCallbacks[receiver]();
  }

  senderReady(receiverUserId, callback) {
    this.channel.push("sender-ready", { receiverUserId }).receive("ok", callback);
  }

  receiverReady(senderUserId, callback) {
    this.channel.push("receiver-ready", { senderUserId }).receive("ok", callback)
  }

  getRTCPeer(userId) {
    if (!this.rtcPeers[userId]) {
      const rtcPeerConnection = new RTCPeerConnection({ 
        iceServers: [
          {
            urls: "stun:stunserver.org",
          }
        ]
      });
      rtcPeerConnection.onicecandidate = this.onIceCandidate.bind(this, userId);
      rtcPeerConnection.onnegotiationneeded = this.offer.bind(this, userId);
      rtcPeerConnection.ontrack = this.onTrack.bind(this);
      rtcPeerConnection.userId = userId;
      this.rtcPeers[userId] = rtcPeerConnection
    }
    return this.rtcPeers[userId];
  }

  newConnection(userId, mediaTrack) {
    this.getRTCPeer(userId).addTrack(mediaTrack);
  }

  offer(userId) {
    console.log("Making Offer");
    
    this.getRTCPeer(userId).createOffer()
      .then(offer => this.getRTCPeer(userId).setLocalDescription(offer))
      .then(() => {
        this.channel.push("offer", { userId, offer: this.rtcPeers[userId].localDescription});
      });
  }

  onOfferSignal({ offer, from }) {
    console.log("Received Offer");
    
    const remoteDesc = new RTCSessionDescription(offer);
    this.getRTCPeer(from).setRemoteDescription(remoteDesc)
      .then(() => this.getRTCPeer(from).createAnswer())
      .then(answer => this.getRTCPeer(from).setLocalDescription(answer))
      .then(() => {
        console.log("Sending Answer");
        this.channel.push("answer", { from, answer: this.getRTCPeer(from).localDescription})
      });
  }

  onAnswerSignal({ answer, from }) {
    console.log("Received Answer");
    const remoteDesc = new RTCSessionDescription(answer);
    this.getRTCPeer(from).setRemoteDescription(remoteDesc);
  }

  onIceCandidate(userId, { candidate }) {
    console.log("Handling ICE candidate");
    if (candidate) {
      console.log("Sending ICE candidate");
      this.channel.push("ice-candidate", {userId, candidate});
    }
  }

  onTrack({target: rtcPeer, track}) {
    console.log("Handling Track");
    this.onTrackCallbacks[rtcPeer.userId](track);
  }

  onTrackCallback(code, callback) {
    this.onTrackCallbacks[code] = callback;
  }

  onIceCandidateSignal({ from, candidate }) {
    console.log("Received ICE candidate");
    this.getRTCPeer(from).addIceCandidate(candidate);
  }
}
const conn = new SocketConnection();
window.conn = conn;
export default conn;