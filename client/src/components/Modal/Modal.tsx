import React from 'react';
import "./Modal.css";
import {BiX} from "react-icons/bi";

const Modal = ({children, title, onClose}) => {
    return (
        <div className="modal__background">
            <div className="modal__container">
                <div className="modal__container-header">
                    <h2>{title}</h2>
                    <BiX size={24} style={{cursor: "pointer"}} onClick={onClose}/>
                </div>
                {children}
            </div>
        </div>
    )
};

export default Modal;
