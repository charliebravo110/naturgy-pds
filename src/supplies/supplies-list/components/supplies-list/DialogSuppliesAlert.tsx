import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  DialogContentText,
  DialogActions,
  Button,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAlerts, setAlerts } from '../../../store/actions/AlertsActions';
import { thunkCreateOrUpdateAlerts } from '../../../store/actions/AlertsThunkAction';
import useStyles from './SuppliesList.styles';
import { actualLocalDate } from '../../../../common/lib/FormatLib';
import { useHistory } from 'react-router';

// LCS: Importa la función - Wave 3
import { sendGAEvent,removeEmails } from '../../../../core/utils/gtm';

export const DialogSuppliesAlert = (props: any) => {
  const { dialogstate, setDialogstate, selectedItemList, activate, finalList } = props;
  const { t } = useTranslation();
  const user = useSelector((state: any) => state.user);
  const alerts: Array<any> = useSelector((state: any) => state.alerts.list);
  const dispatch = useDispatch();
  let history = useHistory();
  
  const [open, setOpen] = useState(false);

  const handleActivarAlertas = () => {
    //console.log(selectedItemList);
    const alertsList = [];
    selectedItemList.forEach((element) => {
      const newAlert = {
        docId: user.profile.documentNumber,
        tipoAlerta: 'supplycutoff',
        tipoEntidad: 'supply',
        idEntidad: element,
        tipoCanal: user.profile.tipoCanal,
        activo: '1',
        destinatario: user.profile.destinatario,
        franjaInicio: user.profile.franjaInicio,
        franjaFin: user.profile.franjaFin,
        franjaInicioEspecial: user.profile.franjaInicioEspecial,
        franjaFinEspecial: user.profile.franjaFinEspecial,
      };

      alertsList.push(newAlert);
    });

    dispatch(
      thunkCreateOrUpdateAlerts(alertsList, (response) => {
        if (response) {
          //console.log('Prueba response ' + JSON.stringify(response));
          dispatch(setAlerts(alertsList));
        }
      })
    );
    setDialogstate(false);

    // LCS: Enviar evento de GdC a GA - Wave 3
    let itemSelected = finalList.find(item => item.cups === selectedItemList[0])
    sendGAEvent ({
      event: 'enable_warning',
      section_name: 'mis suministros',
      click_text: 'aceptar',
      element_type: 'conversion de accion',
      page_url: removeEmails(window.location.href),
      tab_name: 'gestionados por mi',
      cups: selectedItemList[0],
      supply_type: itemSelected ? (itemSelected.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      click_url: 'no aplica',
      browsing_type: sessionStorage.getItem('browsing_type'),
    });
  };

  const handleDesactivar = () => {
    const alertsList = [];
    selectedItemList.forEach((element) => {
      const fechaString = actualLocalDate()
      const Alert = {
        docId: user.profile.documentNumber,
        tipoAlerta: 'supplycutoff',
        tipoEntidad: 'supply',
        idEntidad: element,
        tipoCanal: user.profile.tipoCanal,
        activo: '0',
        destinatario: user.profile.destinatario,
        franjaInicio: user.profile.franjaInicio,
        franjaFin: user.profile.franjaFin,
        franjaInicioEspecial: user.profile.franjaInicioEspecial,
        franjaFinEspecial: user.profile.franjaFinEspecial,
        fechaBaja: fechaString,
      };

      if (alerts.find((alerta) => alerta.idEntidad === element)) {
        alertsList.push(Alert);
      } else {
        //console.log('No existe una alerta creada que desactivar');
      }
    });

    dispatch(
      thunkCreateOrUpdateAlerts(alertsList, (response) => {
        if (response) {
          //console.log('Prueba response ' + JSON.stringify(response));
          alertsList.forEach((element) =>
            dispatch(deleteAlerts(element.idEntidad))
          );
        }
      })
    );
    setDialogstate(false);

    // LCS: Enviar evento de GdC a GA - Wave 3
    let itemSelected = finalList.find(item => item.cups === selectedItemList[0])
    sendGAEvent ({
      event: 'disable_warning',
      section_name: 'mis suministros',
      click_text: 'aceptar',
      element_type: 'conversion de accion',
      page_url: removeEmails(window.location.href),
      tab_name: 'gestionados por mi',
      cups: selectedItemList[0],
      supply_type: itemSelected ? (itemSelected.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      click_url: 'no aplica',
      browsing_type: sessionStorage.getItem('browsing_type'),
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyles({});

  // LCS: Enviar evento de GdC a GA - Wave 3
  const sendEventEnableAlarms = ():void => {
    console.log('selectedItemList', selectedItemList)
    let itemSelected = finalList.find(item => item.cups === selectedItemList[0])
    sendGAEvent ({
      event: 'enable_warning',
      section_name: 'mis suministros',
      click_text: 'cancelar',
      element_type: 'conversion de accion',
      page_url: removeEmails(window.location.href),
      tab_name: 'gestionados por mi',
      cups: selectedItemList[0],
      supply_type: itemSelected ? (itemSelected.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      click_url: 'no aplica',
      browsing_type: sessionStorage.getItem('browsing_type'),
    });
  }

  // LCS: Enviar evento de GdC a GA - Wave 3
  const sendEventDisableAlarms = ():void => {
    console.log('selectedItemList', selectedItemList)
    let itemSelected = finalList.find(item => item.cups === selectedItemList[0])
    sendGAEvent ({
      event: 'disable_warning',
      section_name: 'mis suministros',
      click_text: 'cancelar',
      element_type: 'conversion de accion',
      page_url: removeEmails(window.location.href),
      tab_name: 'gestionados por mi',
      cups: selectedItemList[0],
      supply_type: itemSelected ? (itemSelected.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      click_url: 'no aplica',
      browsing_type: sessionStorage.getItem('browsing_type'),
    });
  }
  return (
    <>
      <Dialog
        open={dialogstate}
        onClose={handleClose}
        fullWidth
        maxWidth='lg'
        className={classes.dialog}
      >
        <DialogContent className={classes.dialogContent}>
          <DialogTitle
            className={classes.dialogTitle}
          >
            <Typography className={classes.typo2}>
              {t('supplies.dialogAlertConfirm.alerts')}
            </Typography>
            <IconButton
              onClick={() => {
                setDialogstate(false);
              }}
              className={classes.iconButton}
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent className={classes.dialogContent3}>
            <DialogContentText className={classes.title}>
              <Typography variant='h6'>
                {activate
                  ? t('supplies.dialogAlertConfirm.create')
                  : t('supplies.dialogAlertConfirm.delete')}
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions
            className={classes.dialogActions}
          >
            <Button
              size='large'
              variant='outlined'
              onClick={() => {
                activate ? sendEventEnableAlarms() : sendEventDisableAlarms();
                setDialogstate(false);
              }}
              className={classes.btn}
            >
              {t('supplies.dialogAlertConfirm.cancel')}
            </Button>
            <Button
              onClick={() => {
                activate ? handleActivarAlertas() : handleDesactivar();
              }}
              fullWidth
              size='large'
              variant='contained'
              className={classes.btn3}
              autoFocus
            >
              {t('common.buttons.accept')}
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
};
