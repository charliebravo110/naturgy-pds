import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Grid } from '@material-ui/core'
import { adminCheck } from '../../../common/lib/ValidationLib'
import { SecurityHOC } from '../../../common/HOC/SecurityHOC'

import NewServiceProvisionIcon from '../../../assets/icons/nueva_conexion_red.svg'
import SupplyModificationIcon from '../../../assets/icons/ico_cambio_potencia.svg'
import InstallationsModificationIcon from '../../../assets/icons/modificacion_instalaciones.svg'
import GenerationIcon from '../../../assets/icons/nueva_generacion.svg'
import AutoconsumptionIcon from '../../../assets/icons/nuevo_autoconsumo.svg'

import { setDossierType, setDossierSubtype, setCurrentProvision, setCadastreDataCoordinates, setCadastreDataItem } from '../../store/actions/ProvisionsActions'
import useStyles from './WhatToDo.styles'
import { thunkGetMasterData } from '../../store/actions/ProvisionsThunkActions'

// LCS: Importa la función - Wave 3
import { sendGAEvent, removeEmails } from '../../../core/utils/gtm'

const WhatToDo = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const user = useSelector((state: any) => state.user.profile)

  /* 
    Comprobación de US_CC
  */
  useEffect(() => { adminCheck() && props.history.push('/provisions') }, [])

  const handleSelectedDossierType = (type: string, subtype?: string) => {    
    // LCS: Enviar evento de GdC a GA - Wave 37
    let request_type = ''
    switch(type) {
      case 'DOSTYP001':
        if (subtype == 'DOSSUB015')
        request_type='ampliacion de potencia'
      else
        request_type='quiero una nueva conexion a la red'
        break
      case 'DOSTYP003':
        request_type='quiero modificar el trazado de una linea actual'
        break
      case 'DOSTYP002':
        if (subtype == 'DOSSUB000')
          request_type='quiero una conexion de autoconsumo'
        else
          request_type='quiero una nueva conexion de generacion'
        break
    }
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'browsing',
      section_name: 'mi conexion a la red',
      subsection_name: '¿que quieres hacer?',
      click_text: 'solicitar',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_type: request_type,
      browsing_type: sessionStorage.getItem('browsing_type')
    });
    sessionStorage.setItem('request_type', request_type)

    dispatch(setDossierType(type))
    dispatch(setDossierSubtype(subtype))
    dispatch(setCurrentProvision({}))
    dispatch(setCadastreDataCoordinates({ x: '', y: '' }))
    dispatch(setCadastreDataItem({}))
  }
  
  const [showOnlyGeneration, setShowOnlyGeneration] = useState<number>(0)
  const [hideCreateDossier, setHideCreateDossier] = useState<number>(0)

  useEffect(() => {    
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'view',
      content_group: 'nueva conexion a la red',
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
    
    dispatch(thunkGetMasterData('DOSSIER_CONTROL', 'ES', 'SHOW_ONLY_GEN', (response) => {
      if (response) {
        setShowOnlyGeneration(parseInt(response[0].value))
      }
    }))
    dispatch(thunkGetMasterData('DOSSIER_CONTROL', 'ES', 'DISABLE_ALL_CREATE', (response) => {
      if (response) {
        setHideCreateDossier(parseInt(response[0].value))
      }
    }))
  }, [])

  return (
    <>
      <div className={classes.block}>
        <Grid container className={classes.container}>
          <Grid item md={10} xs={11} className={classes.maxWidthForBigScreens}>
            <div className={classes.title}>{t('provisions.whatToDo.title')}</div>

            {(showOnlyGeneration === 1 && hideCreateDossier === 0) &&
              <Grid container className={classes.options} md={12} spacing={2}>
                <div className={classes.advise}>{t('provisions.whatToDo.advise')}</div>
              </Grid>
            }

            {(hideCreateDossier === 1 && showOnlyGeneration === 1 || hideCreateDossier === 1 && showOnlyGeneration === 0) &&
              <Grid container className={classes.options} md={12} spacing={2}>
                <div className={classes.advise}>{t('provisions.whatToDo.advise2')}</div>
              </Grid>
            }

            <Grid container className={classes.options} md={12} spacing={2}>

              <Grid item md={2} sm={6} xs={12}>
                <div className={classes.box}>
                  <div><img className={classes.newServiceProvisionIcon} src={NewServiceProvisionIcon} alt='' /></div>
                  <div className={classes.name}>{t('provisions.whatToDo.options.newServiceProvision')}</div>

                  {(showOnlyGeneration === 0 && hideCreateDossier === 0) &&
                    <Link to='/provisions/new-provision'>
                      <div onClick={() => handleSelectedDossierType('DOSTYP001')} className={classes.button}>{t('provisions.whatToDo.options.button')}</div>
                    </Link>
                  }
                </div>
              </Grid>
            

              <Grid item md={2} sm={6} xs={12}>
                <div className={classes.box}>
                  <div><img className={classes.supplyModificationIcon} src={SupplyModificationIcon} alt='' /></div>
                  <div className={classes.name}>{t('provisions.whatToDo.options.supplyModification')}</div>

                  {(showOnlyGeneration === 0 && hideCreateDossier === 0) &&
                    <Link to='/provisions/edit-provision/keep-in-mind'>
                      <div onClick={() => handleSelectedDossierType('DOSTYP001', 'DOSSUB015')} className={classes.button}>{t('provisions.whatToDo.options.button')}</div>
                    </Link>
                  }
                </div>
              </Grid>

              <Grid item md={2} sm={6} xs={12}>
                <div className={classes.box}>
                  <div><img className={classes.installationsModificationIcon} src={InstallationsModificationIcon} alt='' /></div>
                  <div className={classes.name}>{t('provisions.whatToDo.options.installationsModification')}</div>

                  {(showOnlyGeneration === 0 && hideCreateDossier === 0) &&
                    <Link to='/provisions/edit-installations/keep-in-mind'>
                      <div onClick={() => handleSelectedDossierType('DOSTYP003')} className={classes.button}>{t('provisions.whatToDo.options.button')}</div>
                    </Link>
                  }
                </div>
              </Grid>

              <Grid item md={2} sm={6} xs={12}>
                <div className={classes.box}>
                  <div><img className={classes.newGenerationIcon} src={GenerationIcon} alt='' /></div>
                  <div className={classes.name}>{t('provisions.whatToDo.options.generation')}</div>

                  {(hideCreateDossier === 0) &&
                    <Link to='/provisions/new-generation/keep-in-mind'>
                      <div onClick={() => handleSelectedDossierType('DOSTYP002')} className={classes.button}>{t('provisions.whatToDo.options.button')}</div>
                    </Link>
                  }
                </div>
              </Grid>

              <Grid item md={2} sm={6} xs={12}>
                <div className={classes.box}>
                  <div><img className={classes.autoconsumptionIcon} src={AutoconsumptionIcon} alt='' /></div>
                  <div className={classes.name}>{t('provisions.whatToDo.options.autoconsumption')}</div>

                  {(hideCreateDossier === 0) &&
                    <Link to='/provisions/new-generation/questions'>
                      <div onClick={() => handleSelectedDossierType('DOSTYP002', 'DOSSUB000')} className={classes.button}>{t('provisions.whatToDo.options.button')}</div>
                    </Link>
                  }
                </div>
              </Grid>
            </Grid>
            {/* <Grid container className={classes.warningText}>
              <div>{t('A partir de XX/XX/XXXX y en cumplimiento del Art 5 del RD 1183/2020, de acceso y conexión a las redes de transporte y distribución de energía eléctrica, se implantará la obligatoriedad de uso de un certificado digital de identidad para el alta y gestión de las nuevas solicitudes de conexiones de generación y autoconsumo cuyo propietario sea una persona jurídica. ¡Ten preparado tu certificado digital! ')}</div>
            </Grid> */}
          </Grid>
        </Grid>
      </div>
    </>
  )
}

export default SecurityHOC(WhatToDo)
