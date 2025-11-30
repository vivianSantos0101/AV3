import React from 'react';
import './FormModal.css'; 

interface Props {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export function FormModal({ isOpen, onClose, children }: Props) {
    if (!isOpen) {
        return null;
    }

    return (
   
        <div className="modal-backdrop" onClick={onClose}>
    
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="modal-close-btn">&times;</button>
                {children}
            </div>
        </div>
    );
}