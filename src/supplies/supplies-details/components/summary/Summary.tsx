import React, { Fragment, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Input from '@material-ui/core/Input'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import EditIcon from '../../../../assets/icons/editar_blanco.svg'
import SaveIcon from '../../../../assets/icons/guardar_blanco.svg'
import WhiteDelegateSupplyIcon from '../../../../assets/icons/delegar_suministro_en_gestores_blanco.svg'
import AlertWhiteIcon from '../../../../assets/icons/aviso_alerta_blanco.svg'
import MeterIcon from '../../../../assets/icons/contador_para_boton.svg'
import MeterIconDisabled from '../../../../assets/icons/contador_para_boton_disabled.svg'
import HomeIcon from '../../../../assets/icons/ico_casa_playa_blanco.svg'
import MouseIcon from '../../../../assets/icons/raton.svg'
import MouseIconDisabled from '../../../../assets/icons/ratonDisabled.svg'
import Tooltip from '../../../../common/components/tooltip/Tooltip'

import { thunkUpdateSupply, thunkGetMasterData, } from '../../store/actions/SuppliesDetailsThunkActions'
import { setSupply, setDelegateInMeDelegation } from '../../../store/actions/SuppliesActions'

import useStyles from './Summary.styles'
import { deleteAlerts, setAlerts } from '../../../store/actions/AlertsActions'
import IconTextButton from '../../../../common/components/icon-text-button/IconTextButton'
import ActivarAlerta from '../../../../assets/icons/icon_AlertaActiva.svg'
import DesactivarAlerta from '../../../../assets/icons/icon_DesactivarAlerta.svg'
import { thunkCreateOrUpdateAlert } from '../../../store/actions/AlertsThunkAction'
import Spinner from '../../../../common/components/spinner/Spinner'
import { actualLocalDate } from '../../../../common/lib/FormatLib'
import { useHistory } from 'react-router';
// LCS: Importa la función - Wave 3
import { sendGAEvent, removeEmails } from '../../../../core/utils/gtm'

const Header = (props: any) => {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.only('xs'))
  const classes = useStyles({})
  const dispatch = useDispatch()
  const userToken = useSelector((state: any) => state.user.token)
  const user = useSelector((state: any) => state.user.profile)
  const supplies = useSelector((state: any) => state.supplies)
  const alerts = useSelector((state: any) => state.alerts.list)
  const { t } = useTranslation()

  let supplantedUser = sessionStorage.getItem('supplantedUser')

  const {
    supplyData,
    indexSupplyData,
    handleDelegateOrAuthorize,
    selectedTab,
    setTabValue,
    setMenuTabValue
  } = props

  const [name, setName] = useState(supplyData.name)
  const [isEditingName, setIsEditingName] = useState(false)
  const [meterEnabled, setMeterEnabled] = useState(false)
  const [stormWarningActive, setStormWarningActive] = useState(false)
  const [alertaConfigurada, setAlertaConfigurada] = useState(false)
  const [comunicateIncidenceFlagActive, secomunicateIncidenceFlagActive] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  let history = useHistory();


  /* Comprobación de meter enable */
  useEffect(() => {
    dispatch(thunkGetMasterData(
      'WARNINGS_STATUS',
      'ES',
      '',
      (response) => {
        if (response && response.length > 0) {
          setStormWarningActive(response[0].value === '1')
        }
      }
    ))

    dispatch(thunkGetMasterData(
      'COMMUNICATE_INCIDENCE_FLAG',
      'ES',
      '',
      (response) => {
        if (response && response.length > 0) {
          secomunicateIncidenceFlagActive(response[0].value === '1')
        }
      }
    ))

    if (supplyData.measurementSystem === 'O') {
      if (supplyData.measurementEquipments &&
        supplyData.measurementEquipments.meters[0] &&
        supplyData.measurementEquipments.meters[0].meter &&
        (typeof supplyData.measurementEquipments.meters[0].meter !== 'object' || supplyData.measurementEquipments.meters[0].meter !== '') &&
        supplyData.tipoDeLectura !== 'TELEOPERABLE') {
        setMeterEnabled(true)
      } else {
        setMeterEnabled(false)
      }
    } else {
      setMeterEnabled(true)
    }

    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    setAlertaConfigurada((user.destinatario) ? true : false)
  }, [user.destinatario])

  const handleChangeSupplyName = (e) => {
    const value = e.target.value

    setName(value)
  }

  const handleFocusSupplyName = (e) => {
    if (name === supplyData.name) {
      setName('')
    }
  }

  const handleClickEditingName = () => {
    if (!supplantedUser) {
      if (isEditingName) {
        if (name !== '') {
          dispatch(thunkUpdateSupply(supplyData.cups, user.documentNumber, name, supplyData.icon, userToken, () => {
            let supply = supplies.list.find(i => i.cups === supplyData.cups)

            if (supply) {
              dispatch(setSupply({ name }, indexSupplyData))
            } else {
              dispatch(setDelegateInMeDelegation({ name }, indexSupplyData))
            }
          }))
        } else {
          setName(supplyData.name)
        }
      }

      setIsEditingName(!isEditingName)
    }
  }

  /*
  const handleStormWarning = () => {
    setTabValue(7)
    setMenuTabValue(1)
  }
  */

  const handleActivar = (cups) => {

    setIsLoading(true)

    const newAlert = {
      docId: user.documentNumber,
          tipoAlerta: 'supplycutoff',
          tipoEntidad: 'supply',
          idEntidad: cups,
          tipoCanal: user.tipoCanal,
          activo: '1',
          destinatario: user.destinatario,
          franjaInicio:user.franjaInicio,
          franjaFin:user.franjaFin,
          franjaInicioEspecial:user.franjaInicioEspecial,
          franjaFinEspecial:user.franjaFinEspecial,
    };
  
  
    dispatch(thunkCreateOrUpdateAlert(newAlert,'supplycutoff',cups,(response) => {
     
      if (response) {
        //console.log('Prueba response '+JSON.stringify(response))
        dispatch(setAlerts([newAlert]))
        setIsLoading(false)
      }
    }))

    history.push('/supplies/alerts')
  
  }
  
  const handleDesactivar = (cups) => {
  
    setIsLoading(true)
    const fechaString = actualLocalDate()
    const newAlert = {
      docId: user.documentNumber,
          tipoAlerta: 'supplycutoff',
          tipoEntidad: 'supply',
          idEntidad: cups,
          tipoCanal: user.tipoCanal,
          activo: '0',
          destinatario: user.destinatario,
          franjaInicio:user.franjaInicio,
          franjaFin:user.franjaFin,
          franjaInicioEspecial:user.franjaInicioEspecial,
          franjaFinEspecial:user.franjaFinEspecial,
          fechaBaja:fechaString
    };
  
  
    dispatch(thunkCreateOrUpdateAlert(newAlert,'supplycutoff',cups,(response) => {
     
      if (response) {
        //console.log('Prueba response '+JSON.stringify(response))
        dispatch(deleteAlerts(cups))
        setIsLoading(false)
      }
    }))
  }
  
  

  return (
    <Grid
      container
      item
      xs={11}
      md={10}
      lg={10}
      className={`${(user && user.userId && user.userId > 0) ? classes.block : classes.notRegisteredBlock} ${stormWarningActive && 'marginBottomNegative'}`}
    >
      <Grid
        container
        item
        className={classes.container}
      >
        <Grid
          container
          className={classes.leftColumn}
          item
          xs={12}
          sm={12}
          md={5}
        >
          <Grid item xs={12} sm={12}>
            <span className={classes.title}>{t('supplies.suppliesDetails.components.summary.supplyPointData')}</span>
          </Grid>

          <Grid item xs={12} sm={12} className={classes.cupsBlock}>
            <div>CUPS</div>

            <div className={classes.cups}>{supplyData.cups}</div>
          </Grid>

        </Grid>

        <Grid
          container
          className={classes.centerColumn}
          item
          xs={12}
          sm={12}
          md={4}
        >
          <Grid item className={classes.name} xs={12} sm={12}>
            <Grid container className={classes.nameContainer}>
              <Grid item>
                <img src={HomeIcon} className={classes.nameIcon} alt='' />
              </Grid>

              <Grid item>
                {
                  isEditingName ?
                    <Input
                      className={`${classes.nameLabel} textField`}
                      value={name}
                      onChange={handleChangeSupplyName}
                      onFocus={handleFocusSupplyName}
                      inputProps={{
                        style: {
                          letterSpacing: '0.00938em',
                          borderColor: '#FFF'
                        },
                        maxLength: '25'
                      }}
                    />
                    :
                    <Typography className={classes.nameLabel}>{name}</Typography>
                }
              </Grid>
            </Grid>
          </Grid>

          {
            mobile &&
            <Grid container item xs={12} className={classes.divider} />
          }

          <Grid item className={classes.addressContainer} xs={12} sm={12}>
            <div className={classes.sectionTitle}>{t('supplies.suppliesDetails.components.summary.address')}</div>

            <div className={classes.boldText}>
              {
                supplyData.address && (
                  `${supplyData.address.street ? supplyData.address.street : ''} ${supplyData.address.number ? supplyData.address.number : ''},  ${supplyData.address.town ? supplyData.address.town : ''}, ${supplyData.address.province ? supplyData.address.province : ''} ${supplyData.address.zipCode ? supplyData.address.zipCode : ''}`
                )
              }
            </div>
          </Grid>

          {
            <Grid item className={classes.typeContainer} xs={12} sm={12}>
              <div className={classes.sectionTitle}>{t('supplies.suppliesDetails.components.summary.typeSupplyPoint')}</div>
              <div className={classes.boldText}>{supplyData.isGenerator === '0' && supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau != '' ? t('supplies.suppliesDetails.components.summary.selfConsumptiom') : supplyData.isGenerator === '0' ? t('supplies.suppliesDetails.components.summary.consumptiom') : supplyData.isSelfConsumption ? t('supplies.suppliesDetails.components.summary.selfGenerator') : t('supplies.suppliesDetails.components.summary.generator')}</div>
            </Grid>
          }
        </Grid>

        <Grid container className={classes.rightColumn} item md={3} justifyContent='flex-end'>
          <Grid item className={`${classes.button} ${supplantedUser && 'disabled'}`} onClick={handleClickEditingName} xs={12} md={10}>
            {
              isEditingName ?
                <Fragment>
                  <img className={classes.buttonIcon} src={SaveIcon} alt='' />

                  <Typography className={classes.buttonLabel}>{t('supplies.suppliesDetails.components.summary.saveChanges')}</Typography>
                </Fragment>
                :
                <Fragment>
                  <img className={classes.buttonIcon} src={EditIcon} alt='' />

                  <Typography className={classes.buttonLabel}>{t('supplies.suppliesDetails.components.summary.editName')}</Typography>
                </Fragment>
            }
          </Grid>

          {
            selectedTab === 0 &&
            <>
              <Grid item className={`${classes.button} ${supplantedUser && 'disabled'}`} xs={12} md={10}>
                <img className={classes.buttonIcon} src={WhiteDelegateSupplyIcon} alt='' />

                <span
                  className={classes.buttonLabel}
                  onClick={() => {
                    handleDelegateOrAuthorize('US_MANAGER')
                  }}
                >
                  {t('supplies.suppliesDetails.components.summary.delegateManager')}
                </span>
              </Grid>

              <Grid item className={`${classes.button} ${supplantedUser && 'disabled'}`} xs={12} md={10}>
                <img className={classes.buttonIcon} src={WhiteDelegateSupplyIcon} alt='' />

                <span
                  className={classes.buttonLabel}
                  onClick={() => {
                    handleDelegateOrAuthorize('US_CONSULTANT')
                  }}
                >
                  {t('supplies.suppliesDetails.components.summary.authorizeConsultant')}
                </span>
              </Grid>
            </>
          }
              <Grid style={{fontSize:'14px'}} item className={`${classes.button} ${supplantedUser && 'disabled'}`} xs={12} md={10}>
                  {((alerts.filter(e => e.idEntidad === supplyData.cups).length > 0) ?
                          (<Grid item className={classes.gridStyleInline} onClick={() => { handleDesactivar(supplyData.cups) }}>
                            <IconTextButton icon={<img  className={classes.buttonIcon2}  src={ActivarAlerta} alt=''/>}  />
                          <span  className={classes.buttonLabel}>{t('supplies.dialogAlertConfirm.active')}</span>
                          </Grid>
                          )
                          
                          :
                          <Grid className={classes.gridStyleInline} onClick={() => { if (alertaConfigurada) { handleActivar(supplyData.cups)}}}>
                          <IconTextButton  icon={<img style={{width:'30px'}} className={classes.buttonIcon2}  src={DesactivarAlerta} alt=''/>} />
                          {t('supplies.dialogAlertConfirm.deactive')}
                          </Grid>
                          )}
                          
               </Grid>
          {
            (supplyData.isGenerator === '0') &&
            <>
              <Grid item xs={12} sm={12} className={classes.meterContainer}>
                <Grid
                  container
                  className={`${classes.meterButton} ${!meterEnabled && 'disabled'}`}
                  alignItems='center'
                  onClick={() => {
                    // LCS: Enviar evento de GdC a GA - Wave 3
                    sendGAEvent({
                      event: 'browsing',
                      section_name: 'mis suministros',
                      click_text: 'acceso el contador',
                      element_type: 'consulta de informacion',
                      page_url: removeEmails(window.location.href),
                      cups: supplyData.cups,
                      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
                      browsing_type: sessionStorage.getItem('browsing_type'),
                    });
                    if (supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau) {
                      meterEnabled && setTabValue(5)
                      meterEnabled && setMenuTabValue(1)
                    } else {
                      meterEnabled && setTabValue(4)
                      meterEnabled && setMenuTabValue(1)
                    }
                  }}
                >
                  <Grid item className={classes.meterLabel}>
                    {t('supplies.suppliesDetails.components.summary.goMeter')}
                  </Grid>
                  <Grid item className={classes.meterIconBlock}>
                    <img
                      src={!meterEnabled ? MeterIconDisabled : MeterIcon}
                      className={classes.meterIcon}
                      alt=''
                    />
                  </Grid>
                </Grid>
              </Grid>

              {(stormWarningActive && !comunicateIncidenceFlagActive) &&
                <Grid item xs={12} sm={12} className={classes.meterContainer}>
                  <Tooltip title='Opción deshabilitada temporalmente' placement='bottom'>
                  <Grid
                    container
                    className={classes.meterButtonDisabled}
                    alignItems='center'
                    // onClick={() => {
                    //   if (!supplyData.isSelfConsumption) {
                    //     meterEnabled && setTabValue(5)
                    //     meterEnabled && setMenuTabValue(1)
                    //   } else {
                    //     meterEnabled && setTabValue(6)
                    //     meterEnabled && setMenuTabValue(1)
                    //   }
                    // }}
                    onClick={() => {
                      // LCS: Enviar evento de GdC a GA - Wave 3
                      sendGAEvent({
                        event: 'browsing',
                        section_name: 'mis suministros',
                        click_text: 'comunicar incidencia',
                        element_type: 'consulta de informacion',
                        page_url: removeEmails(window.location.href),
                        module_name: 'datos del punto de suministro',
                        cups: supplyData.cups,
                        click_url: window.origin + '/supplies/detail',
                        supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
                        browsing_type: sessionStorage.getItem('browsing_type'),
                      });
                    }}
                  >
                    <Grid item className={classes.meterLabel}>
                      {t('supplies.suppliesDetails.components.summary.sendFailure')}
                    </Grid>
                    <Grid item className={classes.failureIconBlock}>
                      <img
                        src={MouseIconDisabled}
                        className={classes.failureIcon}
                        alt=''
                      />
                    </Grid>
                  </Grid>
                  </Tooltip>
                </Grid>
              }

            {(stormWarningActive && comunicateIncidenceFlagActive) &&
                <Grid item xs={12} sm={12} className={classes.meterContainer}>
                  
                  <Grid
                    container
                    className={classes.meterButton}
                    alignItems='center'
                    onClick={() => {
                      // LCS: Enviar evento de GdC a GA - Wave 3
                      sendGAEvent({
                        event: 'browsing',
                        section_name: 'mis suministros',
                        click_text: 'comunicar incidencia',
                        element_type: 'consulta de informacion',
                        page_url: removeEmails(window.location.href),
                        module_name: 'datos del punto de suministro',
                        cups: supplyData.cups,
                        click_url: window.origin + '/supplies/detail',
                        supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
                        browsing_type: sessionStorage.getItem('browsing_type'),
                      });
                       if (supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau) {
                         meterEnabled && setTabValue(6)
                         meterEnabled && setMenuTabValue(1)
                       } else {
                         meterEnabled && setTabValue(5)
                         meterEnabled && setMenuTabValue(1)
                       }
                     }}
                  >
                    <Grid item className={classes.meterLabel}>
                      {t('supplies.suppliesDetails.components.summary.sendFailure')}
                    </Grid>
                    <Grid item className={classes.failureIconBlock}>
                      <img
                        src={MouseIcon}
                        className={classes.failureIcon}
                        alt=''
                      />
                    </Grid>
                  </Grid>
                  
                </Grid>
              }

            </>
          }
        </Grid>
      </Grid>
      {
        supplyData.inService && supplyData.inService === 'NO' &&
        <Grid container justifyContent='center' className={`${classes.nonPaymentBlock} ${stormWarningActive && 'mobileWithWarningActive'}`}>
          <Grid container item xs={11} sm={9} md={7} alignItems='center' className={classes.nonPayment}>
            <Grid item xs={2} sm={2} md={1}>
              <img src={AlertWhiteIcon} className={classes.alertIcon} alt='' />
            </Grid>
            <Grid item xs={9} sm={10} md={11}>
              <Grid container spacing={1} direction='column'>
                <Grid item>
                  <span>{t('supplies.suppliesDetails.components.summary.nonPayment.text1')}</span>
                </Grid>
                <Grid item>
                  <span>{t('supplies.suppliesDetails.components.summary.nonPayment.text2')}</span>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
      {/* {
        stormWarningActive &&
        <Grid container justifyContent='flex-end' className={classes.stormWarningBlock}>
          <Grid item className={classes.stormWarningButton} onClick={handleStormWarning}>
            <span>{t('supplies.suppliesDetails.components.summary.stormWarning')}</span>
          </Grid>
        </Grid>
      } */}
      {
        isLoading &&
        <Spinner fixed />
      }
    </Grid>
  )
}

export default Header
