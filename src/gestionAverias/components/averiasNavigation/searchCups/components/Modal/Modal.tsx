import React, {ReactNode, useEffect, useState} from 'react';
import style from './Modales.module.css'
import { DialogContent } from '@material-ui/core';

interface ModalType {
    children?: ReactNode;
    isOpne: boolean;
    toggle: () => void;
}

const Modal = (props: ModalType) => {
  
  const handleCloseDialog = () => {
    props.toggle();
  }

  return (
    <>
      {props.isOpne && (
        <dialog open>
            {props.children}
        </dialog>
      )} 
    </>
  );
}

export default Modal;
