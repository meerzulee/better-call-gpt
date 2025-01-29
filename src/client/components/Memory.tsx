import { motion } from "framer-motion";

function MemoryItem({ keyName, value }: { keyName: string; value: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex justify-start w-full"
        >
            <div className="max-w-lg p-3 rounded-lg flex gap-2 shadow-md text-sm bg-yellow-100 text-black">
                <p className="font-semibold">{keyName.replace(/_/g, " ")}:</p>
                <p>{value}</p>
            </div>
        </motion.div>
    );
}

export default function MemoryDisplay({ memory }: { memory: Record<string, string> }) {
    const memoryEntries = Object.entries(memory);

    return (
        <div className="flex flex-col gap-2 p-3">
            {memoryEntries.length === 0 ? (
                <div className="text-gray-500 text-center">No memory stored yet...</div>
            ) : (
                memoryEntries.reverse().map(([key, value]) => (
                    <MemoryItem key={key} keyName={key} value={value} />
                ))
            )}
        </div>
    );
}
