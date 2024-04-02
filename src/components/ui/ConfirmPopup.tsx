import React from 'react';
import PropTypes from 'prop-types';
import "../../styles/ui/ConfirmPopup.scss";

interface ConfirmPopupProps {
    isOpen: boolean;
    header: string;
    info?: string;
    children?: React.ReactNode;
}

const ConfirmPopup: React.FC<ConfirmPopupProps> = ({ header, info, children, isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div className="popup">
                <h2 className="">{header}</h2>
                <p>{info}</p>
                <div className="button-container">
                {children}
                </div>
            </div>
        </div>
    );

};

export default ConfirmPopup;

ConfirmPopup.propTypes = {
    header: PropTypes.string.isRequired,
    info: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    children: PropTypes.node
};