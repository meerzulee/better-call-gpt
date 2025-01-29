import { useEffect, useRef, useState } from "react";
import SessionControls from "./components/SessionControls";
import EventLog from "./components/EventLog";
import Transcript from "./components/Transcript";
import { getSearchData, getWeatherData } from "./tools";
import { INIT_SESSION } from "./config";



function App() {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [events, setEvents] = useState([]);
  const [dataChannel, setDataChannel] = useState<RTCDataChannel | null>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const audioElement = useRef<HTMLAudioElement | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);

  async function startSession() {
    // Get an ephemeral key
    const tokenResponse = await fetch("/api/session");
    const data = await tokenResponse.json();
    const EPHEMERAL_KEY = data.client_secret.value;

    const pc = new RTCPeerConnection();

    audioElement.current = document.createElement("audio");
    audioElement.current.autoplay = true;
    pc.ontrack = (e) => {
      if (audioElement.current) {
        audioElement.current.srcObject = e.streams[0];
      }
    };

    const ms = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    mediaStream.current = ms;

    pc.addTrack(ms.getTracks()[0]);
    const dc = pc.createDataChannel("oai-events");
    setDataChannel(dc);

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
  function sendFunctionResult(callId: string, result: any) {
    if (dataChannel) {
      const responseEvent = {
        type: "conversation.item.create",
        item: {
          type: "function_call_output",
          call_id: callId,
          output: JSON.stringify(result),
        },
      };

      dataChannel.send(JSON.stringify(responseEvent));

      // Immediately ask model to continue responding
      sendClientEvent({ type: "response.create" });
    }
  }
  // Attach event listeners to the data channel when a new one is created
  useEffect(() => {
    if (dataChannel) {
      dataChannel.addEventListener("message", async (e) => {
        const eventData = JSON.parse(e.data);
        setEvents((prev: any[]) => [eventData, ...prev] as never[]);

        // Detect when the model calls a function (response.done)
        if (eventData.type === "response.done") {
          const output = eventData.response?.output || [];

          for (const item of output) {
            if (item.type === "function_call") {
              const { name, arguments: argsString, call_id } = item;
              const args = JSON.parse(argsString);
              // Handle function execution
              let functionResult = null;
              if (name === "get_weather") {
                functionResult = await getWeatherData(args.location);
              } else if (name === "tavily_search") {
                functionResult = await getSearchData(args.query);
              }

              // Send function results back to the model
              if (functionResult !== null) {
                sendFunctionResult(call_id, functionResult);
              }
            }
          }
        }
      });

      dataChannel.addEventListener("open", () => {
        setIsSessionActive(true);
        sendClientEvent(INIT_SESSION);
        setEvents([]);
      });
    }
  }, [dataChannel]);


  return (
    <div className="flex flex-col h-full  relative">
      {/* Header */}
      <div className="flex w-full p-3 border-b border-gray-700">
        <h1 className="text-xl">Better Call GPT</h1>
      </div>
      {/* Body */}
      <div className="flex flex-col flex-grow w-full h-full overflow-y-auto px-2">
        <div className="flex w-full h-1/2  overflow-y-auto p-1">
          <div className="max-w-3xl mx-auto bg-gray-100 rounded-md overflow-y-auto w-full shadow-sm">
            <div className="p-3 uppercase sticky top-0 bg-gray-100">
              <h1>Transcript</h1>
            </div>
            <div className="flex flex-col w-full gap-2">
              <Transcript events={events} />
            </div>
          </div>
        </div>
        <div className="flex w-full h-1/2 overflow-y-auto p-1 pb-20 ">
          <div className="max-w-3xl mx-auto bg-gray-100 rounded-md  overflow-y-auto w-full">
            <div className="p-3 uppercase sticky top-0 bg-gray-100">
              <h1>Event Logs</h1>
            </div>
            <div className="flex flex-col gap-2 w-full px-2">
              <EventLog events={events} />
            </div>
          </div>
        </div>
      </div>
      {/* Control Section */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="flex justify-center mb-8 w-full ">
          <SessionControls
            startSession={startSession}
            stopSession={stopSession}
            isSessionActive={isSessionActive}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
