import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import Grid from '@material-ui/core/Grid'
import BackIcon from '@material-ui/icons/ChevronLeft'

import SupplyData from '../common/supply-data/SupplyData'
import DossierData from '../common/dossier-data/DossierData'
import Breadcrumbs from '../common/breadcrumbs/Breadcrumbs'
import Item from './item/Item'

import ClaimIcon from '../../../../assets/icons/peticiones_reclamaciones.svg'
import OthersIcon from '../../../../assets/icons/peticiones_otros.svg'
import AnonymousIcon from '../../../../assets/icons/peticiones_anonimo.svg'
import PersonalDataIcon from '../../../../assets/icons/peticiones_datos_personales.svg'
import NotificationIcon from '../../../../assets/icons/nueva_generacion.svg'
import BtenIcon from '../../../../assets/icons/peticiones_corte_bt.svg'
import PrivateIcon from '../../../../assets/icons/peticiones_corte_mt_at.svg'
import ProximityIcon from '../../../../assets/icons/peticiones_corte_trabajos_proximidad.svg'

import { setNewRequestSteps } from '../../../store/actions/RequestsActions'

import useStyles from './Reason.styles'
// LCS: Importa la función - Wave 3
import { sendGAEvent, removeEmails } from '../../../../core/utils/gtm'

const Reason = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const requests = useSelector((state: any) => state.requests)

  const { supplyData, setCreatingNewRequest, setCurrentStep } = props

  const handleClickBack = () => {
    if (window.location.pathname === '/supplies/detail' || window.location.pathname === '/provisions/detail') {
      setCreatingNewRequest(false)
    } else if (requests.newRequestSteps.step1 === 'FRAUD') {
      setCurrentStep(1)
    } else if (requests.newRequestSteps.step1 === 'CUT') {
      setCurrentStep(1)
    } else {
      // comprobar si la creacion es a nivel de cups/expediente o usuario
      setCurrentStep(2)
    }
  }

  const handleClickItem = (value) => {
    dispatch(setNewRequestSteps({
      step3: value
    }))

    if (requests.newRequestSteps.step1 === 'SUPPLY') {
      if (value === 'CLAIM' || value === 'INCIDENCE') {
        setCurrentStep(4)
      } else {
        setCurrentStep(5)
      }
    } else if (requests.newRequestSteps.step1 === 'DOSSIER') {
      if (value === 'CLAIM' || value === 'DOCUMENTATION') {
        setCurrentStep(4)
      } else if (value === 'NOTIFICATIONS') {
        setCurrentStep(9)
      } else {
        setCurrentStep(5)
      }
    } else if (requests.newRequestSteps.step1 === 'FRAUD' || requests.newRequestSteps.step1 === 'CUT') {
      setCurrentStep(5)
    }
  }

  useEffect(() => {
    console.log(requests)
    // resetear datos de este paso (3)
    // resetear paso 4 (relationship)
    dispatch(setNewRequestSteps({
      step3: '',
      step4: ''
    }))
    // eslint-disable-next-line
  }, [])

  const sendGAEventSupply = (type:any):void => {

    var clickTextAux
    switch (type) {
      case 'CLAIM':
        clickTextAux = 'quiero hacer una reclamacion por un daño'
        break;
      case 'READING':
        clickTextAux = 'quiero aportar la lectura de mi contador'
        break;
      case 'REPORT':
        clickTextAux = 'quiero reportar errores de visualización de datos de mi suministro'
        break;
      case 'ACCESS':
        clickTextAux = 'tengo problemas con el acceso online a mi contador'
        break;
      case 'OTHERS':
        clickTextAux = 'otros'
        break;
    }
    console.log(supplyData)
    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mis peticiones',
      subsection_name: 'nueva peticion',
      click_text: clickTextAux,
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_type: 'mis suministros',
      request_step: '2',
      request_step_name: '¿cual es el motivo de tu peticion?',
      cups: requests.newRequestSupply.cups,
      browsing_type: sessionStorage.getItem('browsing_type'),
    })
  }

  const sendGAEventExitRequest = ():void => {

    const steps = [requests.newRequestSteps.step1, requests.newRequestSteps.step2, requests.newRequestSteps.step3, requests.newRequestSteps.step4, requests.newRequestSteps.step5, requests.newRequestSteps.step6]
    var i
    for (i = 0; i < 6; i++) {
      if (steps[i] === '') {
        break;
      }
    }

    var requestTypeAux

    switch (requests.newRequestSteps.step1) {
      case 'SUPPLY':
        requestTypeAux = 'mis suministros'
        break;
      case 'DOSSIER':
        requestTypeAux = 'mis solicitudes de conexion a la red'
        break;
      case 'FRAUD':
        requestTypeAux = 'quiero denunciar un fraude'
        break;
      case 'CUT':
        requestTypeAux = 'quiero hacer una consulta o reportar un error del area privada'
        break;
    }

    var stepNameAux = '¿cual es el motivo de tu peticion?'
    // LCS: Enviar evento de GdC a GA - Wave 3
    if (requests.newRequestSteps.step1 === 'FRAUD') {
      stepNameAux = '¿como quieres denunciar el fraude?'
      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mis peticiones',
        subsection_name: 'nueva peticion',
        click_text: 'salir de la peticion',
        element_type: 'consulta de informacion',
        page_url: window.location.href,
        request_type: requestTypeAux,
        request_step: i.toString(),
        request_step_name: stepNameAux,
        browsing_type: sessionStorage.getItem('browsing_type'),
      })
    } else {
      sendGAEvent({
        event: 'request_funnel',
        section_name: 'mis peticiones',
        subsection_name: 'nueva peticion',
        click_text: 'salir de la peticion',
        element_type: 'consulta de informacion',
        page_url: window.location.href,
        request_type: requestTypeAux,
        request_step: i.toString(),
        request_step_name: stepNameAux,
        cups: requests.newRequestSupply.cups,
        browsing_type: sessionStorage.getItem('browsing_type'),
      })
    }
    console.log(i)
  }

  const  sendGAEventDossier = (type:any):void => {

    const steps = [requests.newRequestSteps.step1, requests.newRequestSteps.step2, requests.newRequestSteps.step3, requests.newRequestSteps.step4, requests.newRequestSteps.step5, requests.newRequestSteps.step6]
    var i
    for (i = 0; i < 6; i++) {
      if (steps[i] === '') {
        break;
      }
    }

    var clickTextAux
    switch (type) {
      case 'CLAIM':
        clickTextAux = 'quiero hacer una reclamacion'
        break;
      case 'NOTIFICATIONS':
        clickTextAux = 'quiero solicitar una notificación operacional'
        break;
      case 'MODIFY':
        clickTextAux = 'quiero modificar datos o corregir errores de mi solicitud de conexion'
        break;
      case 'DOUBTS':
        clickTextAux = 'tengo dudas sobre las comunicaciones recibidas'
        break;
      case 'REACTIVATE':
        clickTextAux = 'quiero reactivar mi solicitud de conexion cancelada'
        break;
    }

    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mis peticiones',
      subsection_name: 'nueva peticion',
      click_text: clickTextAux,
      element_type: 'consulta de informacion',
      page_url: window.location.href,
      request_type: 'mis solicitudes de conexion a la red',
      request_step: i.toString(),
      request_step_name: '¿cual es el motivo de tu peticion?',
      request_number: requests.newRequestDossier.dossierCod,
      browsing_type: sessionStorage.getItem('browsing_type'),
    })
  }

  const sendGAEventFraud = (type:any):void => {
    var clickTextAux
    switch (type) {
      case 'ANONYMOUS':
        clickTextAux = 'informar de manera anonima'
        break;
    }

    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mis peticiones',
      subsection_name: 'nueva peticion',
      click_text: clickTextAux,
      element_type: 'consulta de informacion',
      page_url: window.location.href,
      request_type: 'quiero denunciar un fraude',
      request_step: '1',
      request_step_name: '¿como quieres denunciar el fraude?',
      browsing_type: sessionStorage.getItem('browsing_type'),
    })
  }

  return (
    <div className={`${classes.block} ${window.location.pathname === '/supplies/detail' && 'without-margin'} ${window.location.pathname === '/provisions/detail' && 'with-margin'}`}>
      <Grid container className={classes.container}>
        <Grid item md={10} sm={11} xs={11}>
          <div className={`${classes.goBackContainer} ${window.location.pathname === '/provisions/detail' && 'onDossier'} ${window.location.pathname === '/supplies/detail' && 'onSupply'}`}>
            <Grid container className={classes.goBack} onClick={handleClickBack}>
              <Grid item className={classes.goBackIcon}>
                <BackIcon />
              </Grid>

              <Grid item>
                {t('requests.newRequest.goBack')}
              </Grid>
            </Grid>
          </div>

          <div className={`${classes.title} ${window.location.pathname === '/provisions/detail' && 'without-margin'} ${window.location.pathname === '/supplies/detail' && 'onSupply'}`}>{t('requests.newRequest.reason.title')}</div>

          {
            requests.newRequestSteps.step1 === 'SUPPLY' &&
            <SupplyData supplyData={supplyData} />
          }

          {
            requests.newRequestSteps.step1 === 'DOSSIER' &&
            <DossierData />
          }

          <Breadcrumbs currentStep={3} />

          <div className={classes.description}>
            {
              (requests.newRequestSteps.step1 === 'SUPPLY' || requests.newRequestSteps.step1 === 'DOSSIER') ?
                t('requests.newRequest.reason.descriptions.default')
                :
                requests.newRequestSteps.step1 === 'FRAUD' ?
                  t('requests.newRequest.reason.descriptions.fraud')
                  :
                  t('requests.newRequest.reason.descriptions.cut')
            }
          </div>

          <Grid container className={classes.items} md={12} spacing={2}>
            {
              requests.newRequestSteps.step1 === 'SUPPLY' &&
              <>
                <Item
                  type='claim'
                  icon={ClaimIcon}
                  title={t('requests.newRequest.reason.items.supply.claim')}
                  handleClick={() => { sendGAEventSupply('CLAIM'); handleClickItem('CLAIM')}}
                />

                <Item
                  type='reading'
                  icon={OthersIcon}
                  title={t('requests.newRequest.reason.items.supply.reading')}
                  handleClick={() => { sendGAEventSupply('READING'); handleClickItem('READING')}}
                />

                <Item
                  type='report'
                  icon={OthersIcon}
                  title={t('requests.newRequest.reason.items.supply.report')}
                  handleClick={() => { sendGAEventSupply('REPORT');handleClickItem('REPORT')}}
                />

                <Item
                  type='access'
                  icon={OthersIcon}
                  title={t('requests.newRequest.reason.items.supply.access')}
                  handleClick={() => { sendGAEventSupply('ACCESS');handleClickItem('ACCESS')}}
                />

                <Item
                  type='others'
                  icon={OthersIcon}
                  title={t('requests.newRequest.reason.items.supply.others')}
                  handleClick={() => { sendGAEventSupply('OTHERS');handleClickItem('OTHERS')}}
                />
              </>
            }

            {
              requests.newRequestSteps.step1 === 'DOSSIER' &&
              <>
                <Item
                  type='claim'
                  icon={ClaimIcon}
                  title={t('requests.newRequest.reason.items.dossier.claim')}
                  handleClick={() => { sendGAEventDossier('CLAIM'); handleClickItem('CLAIM')}}
                />
                {/*
                  <Item
                    type='documentation'
                    icon={DocumentationIcon}
                    title={t('requests.newRequest.reason.items.dossier.documentation')}
                    handleClick={() => handleClickItem('DOCUMENTATION')}
                  />
                  */}
                {(requests.newRequestDossier && requests.newRequestDossier.idDossierType &&
                  requests.newRequestDossier.idDossierType === 'DOSTYP002') &&
                  <Item
                    type='notification'
                    icon={NotificationIcon}
                    title={t('requests.newRequest.reason.items.dossier.notifications')}
                    handleClick={() => { sendGAEventDossier('NOTIFICATIONS'); handleClickItem('NOTIFICATIONS')}}
                  />
                }

                <Item
                  type='modify'
                  icon={ClaimIcon}
                  title={t('requests.newRequest.reason.items.dossier.modify')}
                  handleClick={() => { sendGAEventDossier('MODIFY'); handleClickItem('MODIFY')}}
                />

                <Item
                  type='doubts'
                  icon={ClaimIcon}
                  title={t('requests.newRequest.reason.items.dossier.doubts')}
                  handleClick={() => { sendGAEventDossier('DOUBTS'); handleClickItem('DOUBTS')}}
                />

                <Item
                  type='reactivate'
                  icon={ClaimIcon}
                  title={t('requests.newRequest.reason.items.dossier.reactivate')}
                  handleClick={() => { sendGAEventDossier('REACTIVATE'); handleClickItem('REACTIVATE')}}
                />

              </>
            }

            {
              requests.newRequestSteps.step1 === 'FRAUD' &&
              <>
                <Item
                  type='anonymous'
                  icon={AnonymousIcon}
                  title={t('requests.newRequest.reason.items.fraud.anonymous')}
                  handleClick={() => { sendGAEventFraud('ANONYMOUS'); handleClickItem('ANONYMOUS')}}
                />

                {/* <Item
                  type='personal-data'
                  icon={PersonalDataIcon}
                  title={t('requests.newRequest.reason.items.fraud.personalData')}
                  handleClick={() => handleClickItem('PERSONAL-DATA')}
                /> */}
              </>
            }

            {
              requests.newRequestSteps.step1 === 'CUT' &&
              <>
                <Grid container className={classes.note}>
                  <Grid item>
                    {t('requests.newRequest.reason.items.cut.note')}
                  </Grid>
                </Grid>

                <Item
                  type='bten'
                  icon={BtenIcon}
                  title={t('requests.newRequest.reason.items.cut.bten')}
                  handleClick={() => handleClickItem('BTEN')}
                />

                <Item
                  type='private'
                  icon={PrivateIcon}
                  title={t('requests.newRequest.reason.items.cut.private')}
                  handleClick={() => handleClickItem('PRIVATE')}
                />

                <Item
                  type='proximity'
                  icon={ProximityIcon}
                  title={t('requests.newRequest.reason.items.cut.proximity')}
                  handleClick={() => handleClickItem('PROXIMITY')}
                />
              </>
            }
          </Grid>

          <div className={classes.exit}>
            {
              (window.location.pathname === '/supplies/detail' || window.location.pathname === '/provisions/detail') ?
                <span onClick={() => { sendGAEventExitRequest(); setCreatingNewRequest(false)}}>{t('requests.newRequest.exit')}</span>
                :
                <Link onClick={() => {sendGAEventExitRequest()}} to='/requests'>{t('requests.newRequest.exit')}</Link>
            }
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default Reason
