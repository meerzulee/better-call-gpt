import { ArrowUp, ArrowDown } from "react-feather";
import { useState } from "react";

function Event({ event, timestamp }: { event: any, timestamp: string }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const isClient = event.event_id && !event.event_id.startsWith("event_");

    return (
        <div className="flex flex-col gap-2 p-2 rounded-md bg-red-100">
            <div
                className={`flex items-center gap-2 cursor-pointer ${isClient ? "justify-end" : "justify-start"}`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {isClient ? (
                    <ArrowDown className="text-blue-400" />
                ) : (
                    <ArrowUp className="text-green-400" />
                )}
                <div className="text-sm text-gray-500">
                    {isClient ? "client:" : "server:"}
                    &nbsp;{event.type} | {timestamp}
                </div>
            </div>
            <div
                className={`text-gray-500 bg-gray-200 p-2 rounded-md overflow-x-auto ${isExpanded ? "block" : "hidden"}`}
            >
                <pre className="text-xs">{JSON.stringify(event, null, 2)}</pre>
            </div>
        </div>
    );
}

export default function EventLog({ events }: { events: any[] }) {
    const eventsToDisplay: any[] = [];
    let deltaEvents: { [key: string]: any } = {};

    events.forEach((event) => {
        // if (event.type.startsWith("response.audio_transcript.delta")) {
        //     console.log("audio transcript", event.delta);
        // }
        if (event.type.endsWith("delta")) {
            // console.log("Event", event.type, event);

            if (deltaEvents[event.type]) {
                // for now just log a single event per render pass
                return;
            } else {
                deltaEvents[event.type] = event;
            }
        }
        eventsToDisplay.unshift(
            <Event
                key={event.event_id}
                event={event}
                timestamp={new Date().toLocaleTimeString()}
            />,
        );
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
