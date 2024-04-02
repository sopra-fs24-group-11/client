import React from 'react';
import PropTypes from 'prop-types';
import "../../styles/ui/ConfirmPopup.scss";

interface ConfirmPopupProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmPopup: React.FC<ConfirmPopupProps> = ({ header, info, isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div className="popup">
                <h2>{header}</h2>
                <p>{info}</p>
                <div className="button-container">
                    <button className="left confirm-button" onClick={onConfirm}>Yes</button>
                    <button className="right confirm-button" onClick={onCancel}>No</button>
                </div>
            </div>
        </div>
    );

};

export default ConfirmPopup;

ConfirmPopup.propTypes = {
    header: PropTypes.string.isRequired,
    info: PropTypes.string.isRequired,
};