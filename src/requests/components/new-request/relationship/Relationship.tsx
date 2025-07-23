import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import Grid from '@material-ui/core/Grid'
import BackIcon from '@material-ui/icons/ChevronLeft'

import SupplyData from '../common/supply-data/SupplyData'
import DossierData from '../common/dossier-data/DossierData'
import Breadcrumbs from '../common/breadcrumbs/Breadcrumbs'
import Item from './item/Item'

import LegalDeadlinesDialog from '../../../../provisions/components/legalDeadlines/LegalDeadlinesDialog'

import HomeAppliancesIcon from '../../../../assets/icons/peticiones_electrodomesticos.svg'
import OtherAssetsIcon from '../../../../assets/icons/peticiones_otros_bienes.svg'
import PersonalIcon from '../../../../assets/icons/peticiones_personales.svg'
import WoodlandLoggingIcon from '../../../../assets/icons/peticiones_tala_arbolado.svg'
import FoodIcon from '../../../../assets/icons/peticiones_alimentos.svg'
import MoneyIcon from '../../../../assets/icons/peticiones_dinero.svg'
import TechnicalEconomicDefinitionIcon from '../../../../assets/icons/peticiones_documentacion.svg'
import JobExecutionIcon from '../../../../assets/icons/peticiones_incidencias_anomalias.svg'

import { setNewRequestSteps, resetNewRequestData } from '../../../store/actions/RequestsActions'

import useStyles from './Relationship.styles'
// LCS: Importa la función - Wave 3
import { sendGAEvent, removeEmails } from '../../../../core/utils/gtm'

const Relationship = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const requests = useSelector((state: any) => state.requests)

  const [popupLegalDeadlines, setPopupLegalDeadlines] = useState(false)
  const [showConsumption, setShowConsumption] = useState(false)

  const { supplyData, setCreatingNewRequest, setCurrentStep } = props

  const handleClickBack = () => {
    setCurrentStep(3)
  }

  const handleLegalDeadlines = (isConsumption) => {
    setShowConsumption(isConsumption ? true : false)
    setPopupLegalDeadlines(true)
  }

  const handleClickItem = (value) => {
    dispatch(setNewRequestSteps({
      step4: value
    }))

    setCurrentStep(5)
  }

  useEffect(() => {
    // resetear datos de este paso (4)
    dispatch(setNewRequestSteps({
      step4: ''
    }))

    // resetear datos del formulario (form)
    dispatch(resetNewRequestData())
    // eslint-disable-next-line
  }, [])

  const sendGAEventRelationshipSupply = (type:any): void => {
    var clickTextAux
    switch (type) {
      case 'APPLIANCE-DAMAGE':
        clickTextAux = 'daños en electrodomesticos/receptores/mercancias'
        break;
      case 'OTHER-ASSETS-DAMAGE':
        clickTextAux = 'daños en otros bienes'
        break;
      case 'PERSONAL-DAMAGE':
        clickTextAux = 'daños personales'
        break;
      case 'WOODLAND-LOGGING-DAMAGE':
        clickTextAux = 'daños por tala de arbolado'
        break;
      case 'PERISHABLE-FOOD-DAMAGE':
        clickTextAux = 'daños en alimentos perecederos'
        break;
      case 'RECEIVED-COMPENSATION-DISAGREEMENTS':
        clickTextAux = 'desacuerdos con la indemnizacion recibida'
        break;
    }

    var stepNameAux = 'comentarios'
    if (requests.newRequestSteps.step1 === 'SUPPLY' && requests.newRequestSteps.step3 === 'CLAIM')
      stepNameAux = 'tu reclamacion esta relacionada con...'

    var reasonRequestAux= ''
    switch (requests.newRequestSteps.step3) {
      case 'CLAIM':
        reasonRequestAux = 'quiero hacer una reclamacion por un daño'
        break;
      case 'READING':
        reasonRequestAux = 'quiero aportar la lectura de mi contador'
        break;
      case 'REPORT':
        reasonRequestAux = 'quiero reportar errores de visualización de datos de mi suministro'
        break;
      case 'ACCESS':
        reasonRequestAux = 'tengo problemas con el acceso online a mi contador'
        break;
      case 'OTHERS':
        reasonRequestAux = 'otros'
        break;
    }

    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mis peticiones',
      subsection_name: 'nueva peticion',
      click_text: clickTextAux,
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_type: 'mis suministros',
      request_step: '3',
      request_step_name: stepNameAux,
      cups: requests.newRequestSupply.cups,
      reason_request: reasonRequestAux,
      browsing_type: sessionStorage.getItem('browsing_type'),
    })
  }

  const sendGAEventRelationshipDossier = (type: any):void => {

    var clickTextAux

    switch (type) {
      case 'TECHNICAL-ECONOMIC-DEFINITION':
        clickTextAux = 'plazo incumplido de la definicion de la propuesta previa'
        break;
      case 'JOB-EXECUTION':
        clickTextAux = 'plazo incumplido en la ejecucion de los trabajos'
        break;
      case 'PAYMENT-RETURN':
        clickTextAux = 'devolucion del cobro por cancelacion de mi solicitud de conexion'
        break;
      case 'OTHERS':
        clickTextAux = 'otros'
        break;
      case 'TECHNICAL-MEMORY':
        clickTextAux = 'documentacion del proyecto o memoria tecnica'
        break;
      case 'CGP-LOCATION-MAP':
        clickTextAux = 'plano de ubicación del cgp/cpm'
        break;
      case 'CGP-INSTALLATION':
        clickTextAux = 'comunicar la instalación del cgp'
        break;
    }

    sendGAEvent ({
      event: 'request_funnel',
      section_name: 'mis peticiones',
      subsection_name: 'nueva peticion',
      click_text: clickTextAux,
      element_type: 'consulta de informacion',
      page_url: window.location.href,
      request_type: 'mis solicitudes de conexion a la red',
      request_step: '3',
      request_step_name: 'tu solicitud esta relacionada con...',
      request_number: requests.newRequestDossier.dossierCod,
      reason_request: 'quiero hacer una reclamacion',
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
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mis peticiones',
      subsection_name: 'nueva peticion',
      click_text: 'salir de la peticion',
      element_type: 'consulta de informacion',
      page_url: window.location.href,
      request_type: requestTypeAux,
      request_step: i.toString(),
      request_step_name: 'tu reclamacion esta relacionada con...',
      cups: requests.newRequestSupply.cups,
      reason_request: 'quiero hacer una reclamacion',
      browsing_type: sessionStorage.getItem('browsing_type'),
    })

    console.log(i)
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

          <div className={`${classes.title} ${window.location.pathname === '/provisions/detail' && 'without-margin'} ${window.location.pathname === '/supplies/detail' && 'onSupply'}`}>{t('requests.newRequest.relationship.title')}</div>

          {
            requests.newRequestSteps.step1 === 'SUPPLY' &&
            <SupplyData supplyData={supplyData} />
          }

          {
            requests.newRequestSteps.step1 === 'DOSSIER' &&
            <DossierData />
          }

          <Breadcrumbs currentStep={4} />

          <div className={classes.description}>
            {
              (requests.newRequestSteps.step1 === 'SUPPLY' && requests.newRequestSteps.step3 === 'CLAIM') ?
                t('requests.newRequest.relationship.descriptions.claim')
                :
                t('requests.newRequest.relationship.descriptions.default')
            }
          </div>

          <div className={classes.items}>
            {
              (requests.newRequestSteps.step1 === 'SUPPLY' && requests.newRequestSteps.step3 === 'CLAIM') &&
              <>
                <Item
                  type='appliance-damage'
                  icon={HomeAppliancesIcon}
                  title={t('requests.newRequest.relationship.items.supply.claim.applianceDamage.title')}
                  description={t('requests.newRequest.relationship.items.supply.claim.applianceDamage.description')}
                  handleClick={() => { sendGAEventRelationshipSupply('APPLIANCE-DAMAGE'); handleClickItem('APPLIANCE-DAMAGE')}}
                />

                <Item
                  type='other-assets-damage'
                  icon={OtherAssetsIcon}
                  title={t('requests.newRequest.relationship.items.supply.claim.otherAssetsDamage.title')}
                  description={t('requests.newRequest.relationship.items.supply.claim.otherAssetsDamage.description')}
                  handleClick={() => { sendGAEventRelationshipSupply('OTHER-ASSETS-DAMAGE'); handleClickItem('OTHER-ASSETS-DAMAGE')}}
                />

                <Item
                  type='personal-damage'
                  icon={PersonalIcon}
                  title={t('requests.newRequest.relationship.items.supply.claim.personalDamage.title')}
                  description={t('requests.newRequest.relationship.items.supply.claim.personalDamage.description')}
                  handleClick={() => { sendGAEventRelationshipSupply('PERSONAL-DAMAGE'); handleClickItem('PERSONAL-DAMAGE')}}
                />

                <Item
                  type='woodland-logging-damage'
                  icon={WoodlandLoggingIcon}
                  title={t('requests.newRequest.relationship.items.supply.claim.woodlandLoggingDamage.title')}
                  description={t('requests.newRequest.relationship.items.supply.claim.woodlandLoggingDamage.description')}
                  handleClick={() => { sendGAEventRelationshipSupply('WOODLAND-LOGGING-DAMAGE'); handleClickItem('WOODLAND-LOGGING-DAMAGE')}}
                />

                <Item
                  type='perishable-food-damage'
                  icon={FoodIcon}
                  title={t('requests.newRequest.relationship.items.supply.claim.perishableFoodDamage.title')}
                  description={t('requests.newRequest.relationship.items.supply.claim.perishableFoodDamage.description')}
                  handleClick={() => { sendGAEventRelationshipSupply('PERISHABLE-FOOD-DAMAGE'); handleClickItem('PERISHABLE-FOOD-DAMAGE')}}
                />

                <Item
                  type='received-compensation-disagreements'
                  icon={MoneyIcon}
                  title={t('requests.newRequest.relationship.items.supply.claim.receivedCompensationDisagreements.title')}
                  description={t('requests.newRequest.relationship.items.supply.claim.receivedCompensationDisagreements.description')}
                  handleClick={() => { sendGAEventRelationshipSupply('RECEIVED-COMPENSATION-DISAGREEMENTS'); handleClickItem('RECEIVED-COMPENSATION-DISAGREEMENTS')}}
                />

              </>
            }

            {
              (requests.newRequestSteps.step1 === 'DOSSIER' && requests.newRequestSteps.step3 === 'CLAIM') &&
              <>
                <Item
                  type='technical-economic-definition'
                  icon={TechnicalEconomicDefinitionIcon}
                  title={t('requests.newRequest.relationship.items.dossier.claim.technicalEconomicDefinition.title')}
                  description={t('requests.newRequest.relationship.items.dossier.claim.technicalEconomicDefinition.description')}
                  handleClick={() => { sendGAEventRelationshipDossier('TECHNICAL-ECONOMIC-DEFINITION'); handleClickItem('TECHNICAL-ECONOMIC-DEFINITION')}}
                />

                {(requests.newRequestDossier.idDossierType === 'DOSTYP002') &&
                  <Grid container className={classes.legalDeadlinesTexts}>
                    <Grid container justifyContent='center'>
                      <Grid item className={classes.legalDeadlines} onClick={() => handleLegalDeadlines(false)}>{t('provisions.newProvision.keepInMind.legalDeadlinesNewGeneration')}</Grid>
                    </Grid>
                  </Grid>
                }
                {(requests.newRequestDossier.idDossierType !== 'DOSTYP002') &&
                  <Grid container className={classes.legalDeadlinesTexts}>
                    <Grid container justifyContent='center'>
                      <Grid item className={classes.legalDeadlines} onClick={() => handleLegalDeadlines(true)}>{t('provisions.newProvision.keepInMind.legalDeadlinesConsumption')}</Grid>
                    </Grid>
                  </Grid>
                }

                <LegalDeadlinesDialog
                  popup={popupLegalDeadlines}
                  setPopup={setPopupLegalDeadlines}
                  showConsumption={showConsumption}
                />

                <Item
                  type='job-execution'
                  icon={JobExecutionIcon}
                  title={t('requests.newRequest.relationship.items.dossier.claim.jobExecution.title')}
                  description={t('requests.newRequest.relationship.items.dossier.claim.jobExecution.description')}
                  handleClick={() => { sendGAEventRelationshipDossier('JOB-EXECUTION'); handleClickItem('JOB-EXECUTION')}}
                />

                <Item
                  type='payment-return'
                  icon={MoneyIcon}
                  title={t('requests.newRequest.relationship.items.dossier.claim.paymentReturn.title')}
                  description={''}
                  handleClick={() => { sendGAEventRelationshipDossier('PAYMENT-RETURN'); handleClickItem('PAYMENT-RETURN')}}
                />
                <Item
                  type='others'
                  title={t('requests.newRequest.relationship.items.dossier.claim.others.title')}
                  description={''}
                  handleClick={() => { sendGAEventRelationshipDossier('OTHERS'); handleClickItem('OTHERS')}}
                />
              </>
            }

            {
              (requests.newRequestSteps.step1 === 'DOSSIER' && requests.newRequestSteps.step3 === 'DOCUMENTATION') &&
              <>
                <Item
                  type='technical-memory'
                  icon={HomeAppliancesIcon}
                  title={t('requests.newRequest.relationship.items.dossier.documentation.technicalMemory.title')}
                  description={t('requests.newRequest.relationship.items.dossier.documentation.technicalMemory.description')}
                  handleClick={() => { sendGAEventRelationshipDossier('TECHNICAL-MEMORY'); handleClickItem('TECHNICAL-MEMORY')}}
                />

                <Item
                  type='cgp-location-map'
                  icon={OtherAssetsIcon}
                  title={t('requests.newRequest.relationship.items.dossier.documentation.cgpLocationMap.title')}
                  description={t('requests.newRequest.relationship.items.dossier.documentation.cgpLocationMap.description')}
                  handleClick={() => { sendGAEventRelationshipDossier('CGP-LOCATION-MAP'); handleClickItem('CGP-LOCATION-MAP')}}
                />

                <Item
                  type='cgp-installation'
                  icon={PersonalIcon}
                  title={t('requests.newRequest.relationship.items.dossier.documentation.cgpInstallation.title')}
                  description={t('requests.newRequest.relationship.items.dossier.documentation.cgpInstallation.description')}
                  handleClick={() => { sendGAEventRelationshipDossier('CGP-INSTALLATION'); handleClickItem('CGP-INSTALLATION')}}
                />
              </>
            }
          </div>

          <div className={classes.exit}>
            {
              (window.location.pathname === '/supplies/detail' || window.location.pathname === '/provisions/detail') ?
                <span onClick={() => { sendGAEventExitRequest(); setCreatingNewRequest(false)}}>{t('requests.newRequest.exit')}</span>
                :
                <Link to='/requests'>{t('requests.newRequest.exit')}</Link>
            }
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default Relationship
