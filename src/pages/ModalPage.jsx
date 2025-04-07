// App.jsx
import React, { useState } from "react";
import Modal from "../components/Modal";

const ModalPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <button
        onClick={openModal}
        className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out"
      >
        Open Modal
      </button>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center">
          This is an elegant modal example with smooth transitions and refined styling.
        </div>
      </Modal>
    </div>
  );
};

export default ModalPage;
