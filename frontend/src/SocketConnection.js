import { Socket } from "phoenix";

class Connection {
  constructor() {
    this.socket = new Socket("/socket", { params: { token: window.sessionUuid}});
    this.socket.connect();
    this.channel = this.socket.channel(`signal:${window.sessionUuid}`, {});
    this.channel.join()
      .receive("ok", resp => console.log("Joined Sucessfully", resp))
      .receive("error", resp => console.log("Unable to Join", resp));

    this.channel.on("kickoff", this.onKickoff.bind(this));
    this.channel.on("offer", this.onOfferSignal.bind(this));
    this.channel.on("answer", this.onAnswerSignal.bind(this));
    this.channel.on("ice-candidate", this.onIceCandidateSignal.bind(this));
    this.rtcPeers = {};
    this.kickoffCallbacks = {};
    this.onTrackCallbacks = {};
  }

  onKickoffCallback(code, callback) {
    this.kickoffCallbacks[code] = callback;
  }

  onKickoff({receiver}) {
    this.kickoffCallbacks[receiver]();
  }

  senderReady(uuid) {
    this.channel.push("sender-ready", {targetUuid: uuid});
  }

  receiverReady(uuid) {
    this.channel.push("receiver-ready", {targetUuid: uuid});
  }

  getRTCPeer(uuid) {
    if (!this.rtcPeers[uuid]) {
      const rtcPeerConnection = new RTCPeerConnection({ 
        iceServers: [
          {
            urls: "stun:stun.l.google.com:19302",
          }
        ]
      });
      rtcPeerConnection.onicecandidate = this.onIceCandidate.bind(this, uuid);
      rtcPeerConnection.onnegotiationneeded = this.offer.bind(this, uuid);
      rtcPeerConnection.ontrack = this.onTrack.bind(this);
      rtcPeerConnection.targetUuid = uuid;
      this.rtcPeers[uuid] = rtcPeerConnection
    }
    return this.rtcPeers[uuid];
  }

  newConnection(uuid, mediaTrack) {
    this.getRTCPeer(uuid).addTrack(mediaTrack);
  }

  offer(uuid) {
    console.log("Making Offer");
    
    this.getRTCPeer(uuid).createOffer()
      .then(offer => this.getRTCPeer(uuid).setLocalDescription(offer))
      .then(() => {
        this.channel.push("offer", {targetUuid: uuid, offer: this.rtcPeers[uuid].localDescription});
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
        this.channel.push("answer", {targetUuid: from, answer: this.getRTCPeer(from).localDescription})
      });
  }

  onAnswerSignal({ answer, from }) {
    console.log("Received Answer");
    const remoteDesc = new RTCSessionDescription(answer);
    this.getRTCPeer(from).setRemoteDescription(remoteDesc);
  }

  onIceCandidate(uuid, { candidate }) {
    console.log("Handling ICE candidate");
    if (candidate) {
      console.log("Sending ICE candidate");
      this.channel.push("ice-candidate", {targetUuid: uuid, candidate});
    }
  }

  onTrack({target: rtcPeer, track}) {
    console.log("Handling Track");
    this.onTrackCallbacks[rtcPeer.targetUuid](track);
  }

  onTrackCallback(code, callback) {
    this.onTrackCallbacks[code] = callback;
  }

  onIceCandidateSignal({ from, candidate }) {
    console.log("Received ICE candidate");
    this.getRTCPeer(from).addIceCandidate(candidate);
  }
}

const conn = new Connection();

export default conn;