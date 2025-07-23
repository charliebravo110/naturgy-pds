import React, {ReactNode, useEffect, useState} from 'react';
import useStyles_ from './SessionTimeout.styles';
import Dialog from '../../../../../../../common/components/dialog/Dialog'
import { DialogContent } from '@material-ui/core';

interface ModalType {
    children?: ReactNode;
    isOpne: boolean;
    toggle: () => void;
    scroll?: {}
    key?: string
}

const Modales = (props: ModalType) => {
  const classes = useStyles_({})
  
  const handleCloseDialog = () => {
    props.toggle();
  }

  return (
    <>
       <Dialog className={props.scroll ? classes.dialog_2 : classes.dialog} open={props.isOpne} onClose={handleCloseDialog} keepMounted key={props.key || 'modal'}>
        <DialogContent className={`${classes.container}`} style={props.scroll}>
          {props.children}
        </DialogContent>
       </Dialog>
    </>
  );
}

export default Modales;
