import { useState } from "react";
import { PhoneCall, CloudOff, MessageSquare } from "react-feather";
import Button from "./Button";

function SessionStopped({ startSession }: { startSession: () => void }) {
    const [isActivating, setIsActivating] = useState(false);

    function handleStartSession() {
        if (isActivating) return;

        setIsActivating(true);
        startSession();
    }

    return (
        <Button
            onClick={handleStartSession}
            className={isActivating ? "bg-gray-600" : "bg-green-600"}
            icon={<PhoneCall height={16} />}
        >
            {isActivating ? "Starting call..." : "Start call"}
        </Button>
    );
}

function SessionActive({ stopSession, sendTextMessage, }: { stopSession: () => void, sendTextMessage: (message: string) => void, }) {
    const [message, setMessage] = useState("");

    function handleSendClientEvent() {
        sendTextMessage(message);
        setMessage("");
    }

    return (
        <Button onClick={stopSession} icon={<CloudOff height={16} />} className="bg-red-400">
            Stop call
        </Button>
    );
}

export default function SessionControls({
    startSession,
    stopSession,
    sendClientEvent,
    sendTextMessage,
    serverEvents,
    isSessionActive,
}: {
    startSession: () => void,
    stopSession: () => void,
    sendClientEvent: (message: any) => void,
    sendTextMessage: (message: string) => void,
    serverEvents: any[],
    isSessionActive: boolean,
}) {
    return (
        <div className="flex items-center  h-full rounded-md">
            {isSessionActive ? (
                <SessionActive
                    stopSession={stopSession}
                    sendTextMessage={sendTextMessage}
                />
            ) : (
                <SessionStopped startSession={startSession} />
            )}
        </div>
    );
}
