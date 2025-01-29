import { motion } from "framer-motion";

function Message({ message, timestamp, isUser, color }: { message: string; timestamp: string; isUser: boolean; color?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }} // Start slightly lower
            animate={{ opacity: 1, y: 0 }} // Fade in & move up
            exit={{ opacity: 0, y: -10 }} // Fade out & move up when removed
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`flex ${isUser ? "justify-end" : "justify-start"} w-full`}
        >
            <div className={`max-w-lg p-3 rounded-lg shadow-md text-sm ${isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-black"} ${color ? color : ""}`}>
                <p>{message}</p>
                <div className="text-xs mt-1">{timestamp}</div>
            </div>
        </motion.div>
    );
}

export default function Transcript({ events }: { events: any[] }) {
    const eventsToDisplay: { timestamp: number; component: JSX.Element }[] = [];

    events.forEach((event) => {
        const timestamp = new Date().getTime();

        const userMessage = event.type === "conversation.item.input_audio_transcription.completed" ? event.transcript : null;
        const modelMessage = event.type === "response.audio_transcript.done" ? event.transcript : null;
        const functionCall = event.type === "response.function_call_arguments.done" ? event.name : null;

        if (userMessage || modelMessage) {
            eventsToDisplay.push({
                timestamp,
                component: (
                    <Message
                        key={event.event_id}
                        message={userMessage || modelMessage}
                        timestamp={new Date().toLocaleTimeString()}
                        isUser={!!userMessage}
                    />
                ),
            });
        }
        if (functionCall) {
            eventsToDisplay.push({
                timestamp,
                component: (
                    <Message
                        key={event.event_id}
                        message={`Function called: ${functionCall}`}
                        color="bg-green-100"
                        timestamp={new Date().toLocaleTimeString()}
                        isUser={false}
                    />
                ),
            });
        }
    });

    return (
        <div className="flex flex-col gap-2 p-3">
            {events.length === 0 ? (
                <div className="text-gray-500 text-center">Awaiting transcript...</div>
            ) : (
                eventsToDisplay.reverse().map((event) => event.component)
            )}
        </div>
    );
}
