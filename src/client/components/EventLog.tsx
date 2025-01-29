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
                    &nbsp;{event.type}
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
    const messageHistory: { [key: string]: string } = {};
    const eventsToDisplay: any[] = [];

    events.forEach((event) => {
        if (event.type.startsWith("response.delta")) {
            if (!messageHistory[event.event_id]) {
                messageHistory[event.event_id] = "";
            }
            messageHistory[event.event_id] += event.delta?.text || "";
            return;
        }
        eventsToDisplay.push({
            component: (
                <Event
                    key={event.event_id}
                    event={{ ...event, full_text: messageHistory[event.event_id] }}
                    timestamp={new Date().toLocaleTimeString()}
                />
            ),
            timestamp: () => {
                const timestamp = new Date().getTime();
                return timestamp;
            },
        });
    });


    return (
        <div className="flex flex-col gap-2 p-3">
            {events.length === 0 ? (
                <div className="text-gray-500 text-center">Awaiting messages...</div>
            ) : (
                eventsToDisplay.reverse().map((event) => event.component)
            )}
        </div>
    );
}
