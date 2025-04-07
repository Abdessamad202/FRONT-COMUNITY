// ModalHeader.jsx
import { X } from "lucide-react";

export function ModalHeader({ comments, toggleModal }) {
  return (
    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
      <h3 id="comments-modal-title" className="text-lg font-semibold text-gray-900">
        Comments ({comments})
      </h3>
      <button
        onClick={toggleModal}
        className="text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Close comments"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

