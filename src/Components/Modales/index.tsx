import React, { ReactNode, useEffect, useState } from 'react';
import style from './Modales.module.css'
import useStyles_ from './SessionTimeout.styles';
import Button from '../../common/components/button/Button';
import Dialog from '../../common/components/dialog/Dialog'
import { createTheme, DialogContent, MuiThemeProvider } from '@material-ui/core';
import CloseIcon from '../icons/CloseIcon';
import { useTranslation } from 'react-i18next';
import ArrowTooltip from '../../common/components/tooltip/arrow/ArrowTooltip'


interface ModalType {
  children?: ReactNode;
  isOpen: boolean;
  toggle: () => void;
  scroll?: {};
  showCloseIcon: boolean;
  title?: string
}

const Modales = (props: ModalType) => {
  const classes = useStyles_({})

  const handleCloseDialog = () => {
    props.toggle();
  }

  const { t } = useTranslation()

  const theme = createTheme({
    overrides: {
      MuiTooltip: {
        tooltip: {
          fontSize: '1em',
          backgroundColor: 'white !important',
          color: '#004571 !important',
          padding: '15px !important',
          boxShadow: '2px 2px 2px 2px #e2e2e2 !important',
          maxWidth: '300px !important',
          fontFamily: 'FSEmeric',
          textAlign: 'center'
        },
        tooltipArrow: {
          fontSize: '1em',
          backgroundColor: 'white !important',
          color: '#004571 !important',
          padding: '15px !important',
          boxShadow: '2px 2px 2px 2px #e2e2e2 !important',
          maxWidth: '300px !important',
          fontFamily: 'FSEmeric',
          textAlign: 'center'
        }
      }
    }
  });

  return (
    <>
      {props.isOpen && (
        <Dialog className={props.scroll ? classes.dialog_2 : classes.dialog} open={props.isOpen} onClose={handleCloseDialog}>
          <DialogContent style={props.scroll}>
            {props.showCloseIcon && (
              <button style={{ color: '#004571', position: 'absolute', top: '7px', right: props.scroll ? '7px' : '18px', backgroundColor: 'transparent', borderColor: 'transparent', padding: 0, cursor: 'pointer' }} onClick={props.toggle} >
                <CloseIcon />
              </button>
            )}
            {props.title?.toLowerCase() === `dialog.traking.e1` ? (
              <MuiThemeProvider theme={theme}>
                <ArrowTooltip title={t('dialog.traking.E1_tooltip')} placement='bottom'>
                  <span className={classes.spanTitle} style={{ textDecoration: 'underline', textDecorationStyle: 'dotted', textDecorationColor: '#004571' }}>
                    {t(props.title)}
                  </span>
                </ArrowTooltip>
              </MuiThemeProvider>
            ) :
              <span className={classes.spanTitle}>
                {t(props.title)}
              </span>}
            {props.children}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default Modales;
