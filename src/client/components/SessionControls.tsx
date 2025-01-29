import { useState } from "react";
import { PhoneCall, CloudOff } from "react-feather";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";



function SessionStopped({ startSession }: { startSession: () => void }) {
    const [isActivating, setIsActivating] = useState(false);

    function handleStartSession() {
        if (isActivating) return;
        setIsActivating(true);
        startSession();
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
        >
            <motion.button
                onClick={handleStartSession}
                disabled={isActivating}
                className={`text-white rounded-full px-4 py-2 flex items-center gap-2 hover:opacity-90 ${isActivating && "cursor-wait"}`}
                animate={
                    isActivating
                        ? { backgroundColor: ["#16a34a", "#10b981", "#059669", "#16a34a"] } // Green shades cycle
                        : { backgroundColor: "#16a34a" } // Default green
                }
                transition={isActivating ? { duration: 1, repeat: Infinity, ease: "easeInOut" } : {}}
            >
                <PhoneCall height={16} />
                Start Call
            </motion.button>
        </motion.div>
    );
}


function SessionActive({ stopSession }: { stopSession: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
        >
            <Button onClick={stopSession} icon={<CloudOff height={16} />} className="bg-red-400">
                Stop Call
            </Button>
        </motion.div>
    );
}

export default function SessionControls({
    startSession,
    stopSession,
    isSessionActive,
}: {
    startSession: () => void;
    stopSession: () => void;
    isSessionActive: boolean;
}) {
    return (
        <div className="flex items-center h-full rounded-md">
            <AnimatePresence mode="wait">
                {isSessionActive ? (
                    <SessionActive stopSession={stopSession} key="active" />
                ) : (
                    <SessionStopped startSession={startSession} key="stopped" />
                )}
            </AnimatePresence>
        </div>
    );
}
