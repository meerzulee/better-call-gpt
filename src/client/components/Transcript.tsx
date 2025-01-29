
function Message({ message, timestamp, isUser }: { message: string, timestamp: string, isUser: boolean }) {

    return (
        <div className={`flex flex-col gap-2 p-2 rounded-md  ${isUser ? "items-end" : "items-start"}`}>
            <div
                className={`flex items-center gap-2  bg-blue-100 p-2 rounded-md ${isUser ? "justify-end" : "justify-start max-w-[70%]"}`}
            >
                <div className="text-sm text-gray-500">{message}</div>
            </div>

        </div>
    );
}

export default function Transcript({ events }: { events: any[] }) {
    const eventsToDisplay: any[] = [];
    // let deltaEvents: { [key: string]: any } = {};
    events.forEach((event) => {
        const userMessage = event.type === "conversation.item.input_audio_transcription.completed" ? event.transcript : null;
        const modelMessage = event.type === "response.audio_transcript.done" ? event.transcript : null;
        if (userMessage || modelMessage) {
            eventsToDisplay.unshift(
                <Message
                    key={event.event_id}
                    message={userMessage || modelMessage}
                    timestamp={new Date().toLocaleTimeString()}
                    isUser={!!userMessage}
                />,
            );
        }
    });

    return (
        <>
            {events.length === 0 ? (
                <div className="text-gray-500 px-3">Awaiting events...</div>
            ) : (
                eventsToDisplay
            )}
        </>
    );
}
