import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  Link,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@material-ui/core';
import { ArrowBackIos, Close } from '@material-ui/icons';
import InfoIcon from '../../../../assets/icons/info.svg';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import TextButton from '../../../../common/components/text-button/TextButton';
import { thunkListSupplies } from '../../../supplies-list/store/actions/SuppliesListThunkActions';
import useStyles from '../alerts/Alerts.styles';
import { thunkCreateOrUpdateAlert, thunkGetAlerts } from '../../../store/actions/AlertsThunkAction';
import {
  setDestinatario,
  setFranjaHorarioFin,
  setFranjaHorarioFinEspecial,
  setFranjaHorarioInicio,
  setFranjaHorarioInicioEspecial,
  setTipoCanal,
} from '../../../../common/store/actions/UserActions';
import {
  validateMail,
  validateMobileNumber,
  //falta por declarar
} from '../../../../common/lib/ValidationLib';
import UserProfile from '../../../../common/interfaces/UserProfile';
import { thunkUpdateUserAlertConf } from '../../../../common/store/actions/UserThunkActions';
import {
  deleteAlerts,
  setAlerts as setAlertsRed,
} from '../../../store/actions/AlertsActions';
import { thunkGetMasterData } from '../../store/actions/SuppliesDetailsThunkActions';
import { SecurityHOC } from '../../../../common/HOC/SecurityHOC';
import { showError } from '../../../../common/store/actions/ErrorActions';
import { thunkGetUserDevice } from '../../../../controlMensajeria/actions/ControlMensajeriaThunkActions';

// LCS: Importar funciones
import { sendGAEvent, removeEmails } from '../../../../core/utils/gtm';

const Alerts = (props) => {
  const classes = useStyles({});
  const dispatch = useDispatch();
  const { t } = useTranslation();

  let roles = sessionStorage.getItem('userRoles') || '';
  let rolesArray = roles.split(',');
  const history = useHistory();
  const user = useSelector((state: any) => state.user);
  const destinatario = user.profile.destinatario;
  const alertsState = useSelector((state: any) => state.alerts.list);
  const userApp = destinatario
  const userMail =
    destinatario && validateMail(destinatario)
      ? destinatario
      : user.profile.email;
  const userPhone =
    destinatario && validateMobileNumber(destinatario)
      ? destinatario
      : user.profile.phone;
  const supplies = useSelector((state: any) => state.supplies);
  const delegations = useSelector((state: any) => state.delegations);
  const adminToken = useSelector((state: any) => state.admin.token);
  const [selectedTab, setSelectedTab] = useState(0);
  const [dialogstate, setDialogstate] = useState(false);
  const [suppliesList, setSuppliesList] = useState([] as any);
  const [open, setOpen] = useState(false);

  const [loadingSuppliesList, setLoadingSuppliesList] = useState(
    supplies.list.length === 0
  );
  const [loadingDelegationsList, setLoadingDelegationsList] = useState(
    delegations.managedByMeList.length === 0
  );

  const tipoCanal = (user.profile.tipoCanal) ? user.profile.tipoCanal : 'email';
  const franjaInicio = (user.profile.franjaInicio) ? user.profile.franjaInicio : null;
  const franjaFin = (user.profile.franjaFin) ? user.profile.franjaFin : undefined;
  const franjaInicioEspecial = (user.profile.franjaInicioEspecial) ? user.profile.franjaInicioEspecial : undefined;
  const franjaFinEspecial = (user.profile.franjaFinEspecial) ? user.profile.franjaFinEspecial : undefined

  const franjasProfile = (franjaInicio) ? `${franjaInicio}-${franjaFin}/${franjaInicioEspecial}-${franjaFinEspecial}` : '-/-';

  const [SMSorEmailorApp, setSMSorEmailorApp] = useState(tipoCanal);
  const [IntervalTime, setIntervalTime] = useState('-/-');
  const [Email, setEmail] = useState('');
  const [SMS, setSMS] = useState('');
  const [App, setApp] = useState('');

  const [FechaTemporalInicioNorte, setFechaTemporalInicioNorte] = useState('');
  const [FechaTemporalInicioCentro, setFechaTemporalInicioCentro] = useState('');
  const [FechaTemporalFinalNorte, setFechaTemporalFinalNorte] = useState('');
  const [FechaTemporalFinalCentro, setFechaTemporalFinalCentro] = useState('');
  const [FechaTemporalFinalNorteCentro, setFechaTemporalFinalNorteCentro] = useState('');
  const [FechaTemporalInicioNorteCentro, setFechaTemporalInicioNorteCentro] = useState('');
  const [FechaTemporalFinalCentroFormateado, setFechaTemporalFinalCentroFormateado] =useState('');
  const [FechaTemporalInicioCentroFormateado, setFechaTemporalInicioCentroFormateado] =useState('');
  const [FechaTemporalInicioNorteFormateado, setFechaTemporalInicioNorteFormateado] =useState('');
  const [FechaTemporalFinalNorteFormateado, setFechaTemporalFinalNorteFormateado] =useState('');


  const [TipoTemporal, setTipoTemporal] = useState('');

  const [selected, setSelected] = useState([]);
  const [EmailValidity, setEmailValidity] = useState(false);
  const [SMSValidity, setSMSValidity] = useState(false);
  const [HelperText, setHelperText] = useState('');
  const [FlagOnlyEmail, setFlagOnlyEmail] = useState('');
  const [FlagModoValidacion, setFlagModoValidacion] = useState('');
  const [FlagTemporalNorte, setFlagTemporalNorte] = useState('');
  const [FlagTemporalCentro, setFlagTemporalCentro] = useState('');
  const [TextTitle, setTextTitle] = useState('');
  const [TextTitle2, setTextTitle2] = useState('');

  const [TextSubtitle, setTextSubtitle] = useState('');
  const [appEnavled, setAppEnavled] = useState(false);
  const [SMSshow, setSmsShow] = useState(false)
  const [count, setCount] = useState(0);

  useEffect(() => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'view',
      content_group: 'mis alertas',
      page_url: removeEmails(window.location.href),
      user_id: sessionStorage.getItem('id'),
      previous_path: removeEmails(sessionStorage.getItem("previousPage")),
      user_type: sessionStorage.getItem('user_type'),
      browsing_type: sessionStorage.getItem('browsing_type'),
      element_type: 'medicion de pagina',
      ga_client_id: sessionStorage.getItem('ga_client_id'),
      cups: 'no aplica',
      supply_type: 'no aplica'
    });
    sessionStorage.setItem("previousPage", window.location.href);
  },[])

  useEffect(() => {
    setEmail(userMail);
    setApp(userApp);
    setSMS(userPhone);
    setSMSorEmailorApp(tipoCanal);
    setIntervalTime(franjasProfile)
  }, [userMail, userApp, userPhone, tipoCanal, franjasProfile]);

  function GetUserDevice(): boolean {
    if (count == 0) {
      dispatch(thunkGetAlerts((resp) => {
        if (resp.hasDevices == '0') {
          setAppEnavled(true)
          return true;
        } else {
          setAppEnavled(false)
          return false;
        }
      }))
      setCount(count + 1)
    }
    return appEnavled
  }

  useEffect(() => {
    if (user.token !== '' && user.profile.documentNumber) {
      if (
        !adminToken &&
        !rolesArray.includes('US_SUPPLYPOINT_CLIENT') &&
        !rolesArray.includes('US_MANAGER') &&
        !rolesArray.includes('US_CONSULTANT')
      ) {
        props.history.push('/landing');
      } else {
        if (
          supplies.list.length === 0 &&
          delegations.delegatesInMeList.length === 0
        ) {
          let defaultSupplyName = t('delegations.supplyPointDefaultName');

          // carga inicial de suministros
          dispatch(
            thunkListSupplies(
              defaultSupplyName,
              false,
              true,
              true,
              (response) => {
                if (response) {
                  setSuppliesList(response.supplypoints);

                  setLoadingSuppliesList(false);

                  if (response.supplypoints.length === 0) {
                    setSelectedTab(1);

                    setLoadingDelegationsList(false);
                  }
                } else {
                  setLoadingSuppliesList(false);

                  setLoadingDelegationsList(false);
                }
              }
            )
          );
        } else {
          setSuppliesList(supplies.list);
          setLoadingDelegationsList(false);

          setLoadingSuppliesList(false);
        }
      }
    }
  }, [
    user.token,
    user.profile.documentNumber,
    dispatch,
    origin,
    props.history,
    props.location,
  ]);
  

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeSMSorEmailorApp = (event) => {
    setSMSorEmailorApp(event.target.value);
  };

  const handleChangeIntervalTime = (event) => {
    //console.log(IntervalTime);
    setIntervalTime(event.target.value);
  };

  const handleEmail = (event) => {
    setEmail(event.target.value.trim());
  };

  const handleSMS = (event) => {
    setSMS(event.target.value.trim());
  };

  const handleSubmit = (event) => {
    event.preventDefault();


    if (IntervalTime == '-/-') {
      setHelperText(t('supplies.dialogAlertConfirm.MustSelectTime'));

    }
    else if (SMSorEmailorApp == 'email' && !validateMail(Email)) {
      setHelperText(t('controlMensajeria.management.list.table.body.tooltips.invalidMail'));
    }
    else if (SMSorEmailorApp == 'sms' && !validateMobileNumber(SMS)) {
      setHelperText(t('controlMensajeria.management.list.table.body.tooltips.invalidPhone'));
    } 
    else {

      try {

        setHelperText('');
        const franjas = IntervalTime.split('/');

        const franjaInicioSave = franjas[0].split('-')[0];
        const franjaFinSave = franjas[0].split('-')[1];
        const franjaInicioEspecialSave = franjas[1].split('-')[0];
        const franjaFinEspecialSave = franjas[1].split('-')[1];
        var destinatiarioResultado = '';
        if (SMSorEmailorApp == 'email') {
          destinatiarioResultado = Email;
        } else if (SMSorEmailorApp == 'sms') {
          destinatiarioResultado = SMS;
        } else if (SMSorEmailorApp == 'push') {
          destinatiarioResultado = App;

        }

        const fields: UserProfile = {
          franjaInicio: franjaInicioSave,
          franjaFin: franjaFinSave,
          franjaInicioEspecial: franjaInicioEspecialSave,
          franjaFinEspecial: franjaFinEspecialSave,
          destinatario: destinatiarioResultado,
          tipoCanal: SMSorEmailorApp,
        };

        dispatch(
          thunkUpdateUserAlertConf(fields, (response) => {
            if (response) {
              //console.log('Prueba response ' + JSON.stringify(response));
              dispatch(setFranjaHorarioInicio(franjaInicioSave));
              dispatch(setFranjaHorarioFin(franjaFinSave));
              dispatch(setFranjaHorarioInicioEspecial(franjaInicioEspecialSave));
              dispatch(setFranjaHorarioFinEspecial(franjaFinEspecialSave));
              dispatch(setTipoCanal(SMSorEmailorApp));
              dispatch(setDestinatario(destinatiarioResultado));

              let alertToUpdate: any;

              alertsState.forEach((element) => {
                alertToUpdate = {
                  docId: element.docId,
                  tipoAlerta: element.tipoAlerta,
                  tipoEntidad: element.tipoEntidad,
                  idEntidad: element.idEntidad,
                  tipoCanal: SMSorEmailorApp,
                  activo: element.activo,
                  destinatario: destinatiarioResultado,
                  franjaInicio: franjaInicioSave,
                  franjaFin: franjaFinSave,
                  franjaInicioEspecial: franjaInicioEspecialSave,
                  franjaFinEspecial: franjaFinEspecialSave,
                };

                dispatch(
                  thunkCreateOrUpdateAlert(
                    alertToUpdate,
                    'supplycutoff',
                    alertToUpdate.idEntidad,
                    (response) => { }
                  )
                );

                dispatch(deleteAlerts(alertToUpdate.idEntidad));
                dispatch(setAlertsRed([alertToUpdate]));
              });
              setDialogstate(true)
            }
          })
        );
      } catch (error) {
        dispatch(showError('AAA'))
      }
    }
  };


  useEffect(() => {
    // TODO: FlagTemporalCentro
    dispatch(
      thunkGetMasterData(
        'BATCH_INTERRUPTIONS',
        'ES',
        'TEMPORAL_EN_ZONA_C',
        (response) => {
          
          if (response && response.length > 0) {
           setFlagTemporalCentro(response[0].value);
          }
        }
      )
    );

    // TODO: FlagTemporalNorte
    dispatch(
      thunkGetMasterData(
        'BATCH_INTERRUPTIONS',
        'ES',
        'TEMPORAL_EN_ZONA_N',
        (response) => {
          if (response && response.length > 0) {
            setFlagTemporalNorte(response[0].value);
          }
        }
      )
    );

    dispatch(
      thunkGetMasterData(
        'BATCH_INTERRUPTIONS',
        'ES',
        'TEMPORAL_C_PROG',
        (response) => {
            var fechas = response[0].value.split(';');
            setFechaTemporalInicioCentro(fechas[0]);
            setFechaTemporalFinalCentro(fechas[1]);
            var fechaInicio=fechas[0].split('-');
            var fechaFinal=fechas[1].split('-');
            var diaInicio=fechaInicio[2].split(' ');
            var diaFin=fechaFinal[2].split(' ');
            setFechaTemporalInicioCentroFormateado(diaInicio[0]+'/'+fechaInicio[1]+'/'+fechaInicio[0]);
            setFechaTemporalFinalCentroFormateado(diaFin[0]+'/'+fechaFinal[1]+'/'+fechaFinal[0]);
            setTipoTemporal(t('supplies.dialogAlertConfirm.centerStorm'));
            setTextSubtitle(t('supplies.dialogAlertConfirm.serviceBody'));
            setTextTitle(t('supplies.dialogAlertConfirm.unableAlertService'));

        }
      )
    );
    dispatch(
      thunkGetMasterData(
        'BATCH_INTERRUPTIONS',
        'ES',
        'TEMPORAL_N_PROG',
        (response) => {
            var fechas = response[0].value.split(';');
            setFechaTemporalInicioNorte(fechas[0]);
            setFechaTemporalFinalNorte(fechas[1]);
            var fechaInicio=fechas[0].split('-');
            var fechaFinal=fechas[1].split('-');
            var diaInicio=fechaInicio[2].split(' ');
            var diaFin=fechaFinal[2].split(' ');

            setFechaTemporalInicioNorteFormateado(diaInicio[0]+'/'+fechaInicio[1]+'/'+fechaInicio[0]);
            setFechaTemporalFinalNorteFormateado(diaFin[0]+'/'+fechaFinal[1]+'/'+fechaFinal[0]);
            setTipoTemporal(t('supplies.dialogAlertConfirm.nordStorm'));
            setTextSubtitle(t('supplies.dialogAlertConfirm.serviceBody'));
            setTextTitle(t('supplies.dialogAlertConfirm.serviceTittle'));
          }
      )
    );

    dispatch(
      thunkGetMasterData(
        'INTERRUPTIONS_FLAG',
        'ES',
        'SOLO_EMAILS',
        (response) => {
          if (response && response.length > 0) {
            setFlagOnlyEmail(response[0].value);
          }
          setFlagModoValidacion(response[0].value);
          if (FlagModoValidacion === '1') {
            setTextTitle(t('supplies.dialogAlertConfirm.serviceTittle'));
            setTextSubtitle(t('supplies.dialogAlertConfirm.serviceBody'));
          }
        }
      )
    );

    dispatch(
      thunkGetMasterData(
        'INT_VALIDATION_MODE',
        'ES',
        'VALIDATION_GENERAL_ACTIVE',
        (response) => {

          if (response && response.length > 0) {
            setFlagModoValidacion(response[0].value);
            if (FlagModoValidacion === '1') {
              setTextTitle(t('supplies.dialogAlertConfirm.serviceTittle'));
              setTextSubtitle(t('supplies.dialogAlertConfirm.serviceBody'));
            }
          }
        }
      )
    );
  }, []);

  useEffect( () => {
    if(FechaTemporalInicioCentro != '' && FechaTemporalInicioNorte != '' && FechaTemporalFinalCentro != '' && FechaTemporalFinalNorte){
      const temporalInicioCentro = new Date(FechaTemporalInicioCentro);
      const temporalInicioNorte = new Date(FechaTemporalInicioNorte);
      if(temporalInicioCentro < temporalInicioNorte){
          var fecha=FechaTemporalInicioCentro.split('-');
          var dia=fecha[2].split(' ');
  
          setFechaTemporalInicioNorteCentro(dia[0]+'/'+fecha[1]+'/'+fecha[0]);
      }else{
        var fecha=FechaTemporalInicioNorte.split('-');
        console.log(fecha)
  
        var dia=fecha[2].split(' ');
        setFechaTemporalInicioNorteCentro(dia[0]+'/'+fecha[1]+'/'+fecha[0]);
      }
      const temporalFinalCentro = new Date(FechaTemporalFinalCentro);
      const temporalFinaloNorte = new Date(FechaTemporalFinalNorte);
      if(temporalFinalCentro < temporalFinaloNorte){
        var fecha=FechaTemporalFinalNorte.split('-');
        console.log(fecha)
  
        var dia=fecha[2].split(' ');
        setFechaTemporalFinalNorteCentro(dia[0]+'/'+fecha[1]+'/'+fecha[0]);
      }else{
        var fecha=FechaTemporalFinalCentro.split('-');
        console.log(fecha)
  
        var dia=fecha[2].split(' ');
        setFechaTemporalFinalNorteCentro(dia[0]+'/'+fecha[1]+'/'+fecha[0]);
      }
    }
  },[FechaTemporalInicioCentro,FechaTemporalInicioNorte, FechaTemporalFinalCentro, FechaTemporalFinalNorte ])

  useEffect(() => {
    if(SMSorEmailorApp !== 'sms') {
      setSmsShow(false)
    } else {
      setSmsShow(true)
    }
  }, [SMSorEmailorApp])
    
  // LCS: Enviar evento de GdC a GA - Wave 3
  const sendGAEventSaveAlert = ():any => {
    sendGAEvent({
      event: 'breakdown_notification',
      section_name: 'mis suministros',
      subsection_name: 'mis alertas',
      click_text: 'guardar',
      element_type: 'conversion de accion',
      page_url: removeEmails(window.location.href),
      module_name: 'configurar tus alertas de averias',
      browsing_type:sessionStorage.getItem('browsing_type'),
    })
  }

  return (
    <Box className={classes.block}>
      <Container className={classes.containergrey}>
        <Typography variant='h3' className={classes.title}>
          {t('supplies.dialogAlertConfirm.myAlerts')}
        </Typography>

        <Link
          className={classes.title}
          underline='none'
          onClick={() => {
            history.goBack()
          }}
        >
          <Grid container direction='row' alignItems='center'>
            <TextButton className={classes.buttons}>
              <Grid item>
                <ArrowBackIos fontSize='medium' />
              </Grid>
              <Grid item>
                <Typography>{t('common.buttons.return')}</Typography>
              </Grid>
            </TextButton>
          </Grid>
        </Link>

        <Paper variant='outlined' square>
          <Grid
            container
            className={classes.container}
            spacing={2}
            direction='row'
            justifyContent='center'
            alignItems='center'
          >
            <Grid item xs={12}>
              <Typography variant='h5' className={classes.subtitle}>
                {t('supplies.dialogAlertConfirm.alertsTitle')}
              </Typography>
            </Grid>
            <Grid item xs={8} className={classes.media}>
              <Typography variant='h6' className={classes.text}>
                {t('supplies.dialogAlertConfirm.alertsTextNew')}
              </Typography>
            </Grid>
    
            {FlagModoValidacion === '1' || FlagTemporalNorte === 'true' || FlagTemporalCentro === 'true'
              ?
              <Grid container className={classes.actionBox}>
                <Grid item>
                  <img className={classes.infoIcon} src={InfoIcon} alt='' />
                </Grid>
                {(FlagModoValidacion !== '1' && FlagTemporalNorte == 'true' && FlagTemporalCentro == 'false') &&
                
          
                  <Grid item className={classes.alertTittle}><b>{t('supplies.dialogAlertConfirm.unableAlertService')+ ' ' +FechaTemporalInicioNorteFormateado + ' ' + t('supplies.dialogAlertConfirm.until') +' ' +FechaTemporalFinalNorteFormateado}</b>
                  </Grid>
                }
                {(FlagModoValidacion !== '1' && FlagTemporalCentro == 'true' && FlagTemporalNorte == 'false') &&
                  <Grid item className={classes.alertTittle}><b>{t('supplies.dialogAlertConfirm.unableAlertService')+ ' ' +FechaTemporalInicioCentroFormateado + ' ' + t('supplies.dialogAlertConfirm.until') +' ' +FechaTemporalFinalCentroFormateado}</b>
                  </Grid>
                }
                {(FlagModoValidacion !== '1' && FlagTemporalCentro == 'true' && FlagTemporalNorte == 'true') &&

                  <Grid item className={classes.alertTittle}><b>{t('supplies.dialogAlertConfirm.unableAlertService')+ ' ' + FechaTemporalInicioNorteCentro + ' ' + t('supplies.dialogAlertConfirm.until') +' ' +FechaTemporalFinalNorteCentro}</b>
                  </Grid>
                
                }
                {FlagModoValidacion === '1' &&
                  <Grid item className={classes.alertTittle}><b>{TextTitle}</b>
                  </Grid>
                }


                <Grid item className={classes.alertLabel}>{TextSubtitle}
                </Grid>
              </Grid>
              : ''
            }
            <Grid item>
              <form onSubmit={handleSubmit}>
                <FormControl>
                  <Grid container xs={12}>
                    <Grid item xs={12}>
                      <RadioGroup
                        className={classes.padding_1}
                        name='SMSorEmailButtons'
                        value={(FlagOnlyEmail == '1') ? 'email' : SMSorEmailorApp}
                        onChange={handleChangeSMSorEmailorApp}
                      >
                        <Grid container>
                          <Grid item xs={12} md={2} />
                          <Grid item xs={12} md={6}>
                            <span className={classes.formlabel}>
                              <b className={classes.colorText}>{t('controlMensajeria.management.list.table.body.notificationQuestion')}</b>
                            </span>
                            <Grid container>

                              <Grid item xs={10}>
                                <FormControlLabel
                                  value='email'
                                  control={
                                    <Radio
                                      color='primary'
                                      classes={{
                                        root: classes.radiobtn,
                                        checked: classes.checked,
                                      }}
                                    />}
                                  label='Correo electrónico'
                                  className={classes.formcontrol}
                                />
                              </Grid>

                              <Grid item xs={10} className={`${(SMSorEmailorApp == 'sms' || SMSorEmailorApp == 'push') && classes.invisible}`}>
                                <TextField
                                  className={classes.text}
                                  variant='outlined'
                                  fullWidth
                                  name='Email'
                                  value={Email}
                                  error={EmailValidity}
                                  helperText={
                                    EmailValidity
                                      ? t(
                                        'controlMensajeria.management.list.table.body.tooltips.invalidMail'
                                      )
                                      : null
                                  }
                                  onChange={(e) => {
                                    if (HelperText != 'controlMensajeria.management.list.table.body.tooltips.invalidMail') {
                                      setHelperText('')
                                    }

                                    setEmailValidity(
                                      !validateMail(e.target.value)
                                    );

                                    handleEmail(e);
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </Grid>

                          <Grid item xs={12} md={4} />
                          <Grid item xs={12} md={2} />
                          <Grid item xs={12} md={10}>
                            <FormHelperText className={classes.red}>
                              {FlagOnlyEmail === '1'
                                ? t('supplies.dialogAlertConfirm.onlyEmail')
                                : ''}
                            </FormHelperText>
                            <Grid item xs={10}>
                              <FormControlLabel
                                value='push'
                                control={
                                  <Radio
                                    color='primary'
                                    classes={{
                                      root: classes.radiobtn,
                                      checked: classes.checked,
                                    }}
                                  />
                                }
                                label='Aplicación móvil'
                                disabled={GetUserDevice()}
                                className={classes.formcontrol}
                              />
                              {
                                appEnavled ?
                                  (
                                    <Grid className={classes.alertaApp}>
                                      {t('alerts.app.off')}
                                      <a href='https://apps.apple.com/es/app/ufd/id6447208107?l=es-ES' target='_blank' rel='noopener noreferrer'>iOS</a> y 

                                       <a href='https://play.google.com/store/apps/details?id=es.ufd.areaprivada' target='_blank' rel='noopener noreferrer'> Android</a>

                                    </Grid>
                                  )
                                  :
                                  ''
                              }
                            </Grid>
                            <Grid item xs={10} className={`${(SMSorEmailorApp == 'email' || SMSorEmailorApp == 'sms') && classes.invisible}`} />

                            {/* <FormHelperText className={classes.red}>
                              {HelperText}
                            </FormHelperText> */}
                          </Grid>
                          <Grid item xs={12} md={2} />
                          <Grid item xs={12} md={6}>
                            <FormHelperText className={classes.red}>
                              {FlagOnlyEmail === '1'
                                ? t('supplies.dialogAlertConfirm.onlyEmail')
                                : ''}
                            </FormHelperText>
                            <Grid item xs={10}>
                              <FormControlLabel
                                value='sms'
                                control={
                                  <Radio
                                    color='primary'
                                    classes={{
                                      root: classes.radiobtn,
                                      checked: classes.checked,
                                    }}
                                  />
                                }
                                label='SMS'
                                disabled={FlagOnlyEmail === '1' ? true : false}
                                className={classes.formcontrol}
                              />
                            </Grid>
                            <Grid item xs={10} className={`${(SMSorEmailorApp == 'email' || SMSorEmailorApp == 'app') && classes.invisible}`}>
                              {SMSshow ? (
                                <TextField
                                  className={classes.text}
                                  variant='outlined'
                                  fullWidth
                                  name='SMS'
                                  disabled={FlagOnlyEmail === '1' ? true : false}
                                  // onChange={handleSMS}
                                  value={SMS}
                                  error={SMSValidity}
                                  helperText={
                                    SMSValidity
                                      ? t(
                                        'controlMensajeria.management.list.table.body.tooltips.invalidPhone'
                                      )
                                      : null
                                  }
                                  onChange={(e) => {
                                    if (HelperText != 'controlMensajeria.management.list.table.body.tooltips.invalidPhone') {
                                      setHelperText('')
                                    }

                                    setSMSValidity(
                                      !validateMobileNumber(e.target.value)
                                    );

                                    handleSMS(e);
                                  }}
                                />
                              ) : (
                                ''
                              )}
                            </Grid>
                            {/* <FormHelperText className={classes.red}>
                              {HelperText}
                            </FormHelperText> */}
                          </Grid>

                        </Grid>
                      </RadioGroup>
                    </Grid>

                    <Grid item xs={12}>
                      {/* <Divider orientation='vertical' variant='inset' /> */}
                    </Grid>
                    <Grid item xs={12} md={2} />
                    <Grid item xs={12} md={6}>
                      <RadioGroup
                        className={classes.padding_2}
                        name='IntervalTimeButton'
                        value={IntervalTime}
                        onChange={handleChangeIntervalTime}
                      >
                        <Grid container>
                          <Grid item xs={12} className={classes.margin}>
                            <span className={classes.formlabel}>
                              <b className={classes.colorText}>{t('supplies.dialogAlertConfirm.alertsTime')}</b>
                            </span>
                          </Grid>
                          <Grid item xs={12} className={classes.colorText}>
                            <FormControlLabel
                              value='00:00-00:00/00:00-00:00'
                              control={
                                <Radio
                                  color='primary'
                                  classes={{
                                    root: classes.radiobtn,
                                    checked: classes.checked,
                                  }}
                                //checkedIcon={<span className={classes.checkedIcon} />}
                                //icon={<span className={classes.icon} />} 
                                />}
                              label={t('supplies.dialogAlertConfirm.anyMoment')}
                            />
                          </Grid>
                          <Grid item xs={12} className={classes.colorText}>
                            <FormControlLabel
                              value='08:00-21:30/10:00-21:30'
                              control={
                                <Radio
                                  color='primary'
                                  classes={{
                                    root: classes.radiobtn,
                                    checked: classes.checked,
                                  }}
                                />}
                              label={t('supplies.dialogAlertConfirm.time')}
                              className={classes.formcontroll}
                            />
                          </Grid>
                        </Grid>
                      </RadioGroup>
                    </Grid>
                    <Grid item xs={12} md={2} />
                  </Grid>{' '}
                  {/* <EnhancedTable rows={suppliesList} selected={selected} setSelected={setSelected}/> */}
                  <Grid container>
                    <Grid item xs={12} md={5} />
                    <Grid item xs={12} md={3}>
                      <FormHelperText className={classes.red}>
                        {HelperText}
                      </FormHelperText>
                      <Button
                        className={classes.submitButton}
                        type='submit'
                        variant='contained'
                        color='primary'
                        onClick={sendGAEventSaveAlert}
                      //disabled={ (IntervalTime != '-/-' && !SMSValidity && !EmailValidity) ? false : true}
                      >
                        {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.commentSupplyModal.buttons.save')}
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={4} />





                    <Grid item xs={12} md={4} />


                  </Grid>
                </FormControl>
              </form>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Dialog open={dialogstate} onClose={handleClose} maxWidth='md' className={classes.dialog}>
        <DialogContent className={classes.dialogContent}>
          <DialogTitle className={classes.dialogTitle}>
            <Typography className={classes.typo}>
              {t('supplies.dialogAlertConfirm.alertConfUpdate')}
            </Typography>
            <IconButton onClick={() => { setDialogstate(false); }} className={classes.iconButton}>
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogActions className={classes.dialogActions}>
            <Button size='large' variant='outlined' onClick={() => { setDialogstate(false); }} className={classes.btn2}>{t('common.buttons.accept')}</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default SecurityHOC(Alerts);
