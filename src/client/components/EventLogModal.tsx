import { motion } from "framer-motion";
import { XCircle } from "react-feather";

export default function EventLogModal({ isOpen, onClose, events }: { isOpen: boolean; onClose: () => void; events: any[] }) {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed  inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4"
        >
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-2 rounded-lg shadow-lg w-full max-w-2xl"
            >
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Event Logs</h2>
                    <button onClick={onClose} className="text-red-500 font-bold"><XCircle /></button>
                </div>

                <div className="mt-4 max-h-80 overflow-y-auto border p-3 rounded-lg bg-gray-100">
                    {events.length === 0 ? (
                        <p className="text-gray-500 text-center">No events recorded.</p>
                    ) : (
                        events.map((event, index) => (
                            <div key={index} className="p-2 bg-gray-200 mb-2 rounded">
                                <pre className="text-xs text-wrap">{JSON.stringify(event, null, 2)}</pre>
                            </div>
                        ))
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
