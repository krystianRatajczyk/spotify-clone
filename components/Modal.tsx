import React from "react";
import { MdClose } from "react-icons/md";
import CircularButton from "./Layout/CircularButton";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-opacityGray"
      onClick={onClose}
    >
      <div
        className="absolute bg-[#2b2a2a] rounded-lg p-8 shadow-lg"
        onClick={(e) => {
          e.stopPropagation(); //prevent event bubbling (event goes from child to parent)
        }}
      >
        <div className="flex justify-between">
          <h3 className="font-bold text-2xl">{title}</h3>
          <CircularButton className="p-1" hoverClassName="bg-[#212121]">
            <MdClose size={30} color="#B3B3B3" onClick={onClose} />
          </CircularButton>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
