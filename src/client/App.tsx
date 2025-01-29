import { useEffect, useRef, useState } from "react";
import SessionControls from "./components/SessionControls";

function App() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [events, setEvents] = useState([]);
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const audioElement = useRef<HTMLAudioElement | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);

  async function startSession() {
    // Get an ephemeral key from the Fastify server
    const tokenResponse = await fetch("/api/session");
    const data = await tokenResponse.json();
    const EPHEMERAL_KEY = data.client_secret.value;

    // Create a peer connection
    const pc = new RTCPeerConnection();

    // Set up to play remote audio from the model
    audioElement.current = document.createElement("audio");
    audioElement.current.autoplay = true;
    pc.ontrack = (e) => {
      if (audioElement.current) {
        audioElement.current.srcObject = e.streams[0];
      }
    };

    // Add local audio track for microphone input in the browser
    const ms = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    mediaStream.current = ms;

    pc.addTrack(ms.getTracks()[0]);
    // Set up data channel for sending and receiving events
    const dc = pc.createDataChannel("oai-events");
    setDataChannel(dc);

    // Start the session using the Session Description Protocol (SDP)
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const baseUrl = "https://api.openai.com/v1/realtime";
    const model = "gpt-4o-mini-realtime-preview";
    const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
      method: "POST",
      body: offer.sdp,
      headers: {
        Authorization: `Bearer ${EPHEMERAL_KEY}`,
        "Content-Type": "application/sdp",
      },
    });

    const answer = {
      type: "answer",
      sdp: await sdpResponse.text(),
    };
    await pc.setRemoteDescription(answer as RTCSessionDescriptionInit);

    peerConnection.current = pc;
  }

  // Stop current session, clean up peer connection and data channel
  function stopSession() {
    if (dataChannel) {
      dataChannel.close();
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }

    setIsSessionActive(false);
    setDataChannel(null);
    peerConnection.current = null;
  }

  // Send a message to the model
  function sendClientEvent(message: any) {
    if (dataChannel) {
      message.event_id = message.event_id || crypto.randomUUID();
      dataChannel.send(JSON.stringify(message));
      setEvents((prev: any[]) => [message, ...prev] as never[]);
    } else {
      console.error(
        "Failed to send message - no data channel available",
        message,

      );
    }
  }

  // Send a text message to the model
  function sendTextMessage(message: string) {
    const event = {
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [
          {
            type: "input_text",
            text: message,
          },
        ],
      },
    };

    sendClientEvent(event);
    sendClientEvent({ type: "response.create" });
  }

  // Attach event listeners to the data channel when a new one is created
  useEffect(() => {
    if (dataChannel) {
      // Append new server events to the list
      dataChannel.addEventListener("message", (e) => {
        setEvents((prev: any[]) => [JSON.parse(e.data), ...prev] as never[]);
      });

      // Set session active when the data channel is opened
      dataChannel.addEventListener("open", () => {
        setIsSessionActive(true);
        setEvents([]);
      });
    }
  }, [dataChannel]);


  return (
    <div className="flex flex-col h-full bg-violet-500 relative">
      {/* Header */}
      <div className="flex w-full p-3 border-b border-gray-700">
        <h1 className="text-xl">Better Call GPT</h1>
      </div>
      {/* Body */}
      <div className="flex flex-col flex-grow w-full h-full overflow-y-auto">
        {/* Red Section with Overflow */}
        <div className="flex w-full h-1/2  overflow-y-auto p-1">
          <div className="max-w-3xl mx-auto bg-gray-50 rounded-md overflow-y-auto w-full">
            <div className="p-3 uppercase">
              <h1>Transcript</h1>
            </div>
            <div className="flex flex-col w-full">
              {Array.from({ length: 1 }).map((_, i) => (
                <div key={i} className="p-2 m-1 bg-red-800 text-white rounded">
                  Red Box {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Green Section with Overflow */}
        <div className="flex w-full h-1/2 overflow-y-auto p-1">
          <div className="max-w-3xl mx-auto bg-gray-50 rounded-md overflow-y-auto w-full">
            <div className="p-3 uppercase">
              <h1>Memory</h1>
            </div>
            <div className="flex flex-col w-full">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="p-2 m-1 bg-green-800 text-white rounded">
                  Green Box {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Control Section */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="flex justify-center mb-10 w-full ">
          {/* buttons */}
          <SessionControls
            startSession={startSession}
            stopSession={stopSession}
            sendClientEvent={sendClientEvent}
            sendTextMessage={sendTextMessage}
            serverEvents={events}
            isSessionActive={isSessionActive}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
