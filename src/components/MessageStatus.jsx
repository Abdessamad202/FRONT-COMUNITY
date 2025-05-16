// Simple message status component with framer motion
import {motion} from "framer-motion";
import {Check} from "lucide-react";
const MessageStatus = ({ status }) => {
    if (status === 'sent') {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-flex"
            >
                <Check size={14} className="text-gray-300" />
            </motion.div>
        );
    } else {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-flex"
            >
                <Check size={14} className="text-indigo-400" />
                <Check size={14} className="text-indigo-400 -ml-2" />
            </motion.div>
        );
    }
    return null;
};

export default MessageStatus;