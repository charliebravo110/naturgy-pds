import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { Grid } from '@material-ui/core'

import ButtonToTop from '../../../common/components/button-to-top/ButtonToTop'

import Tipology from './tipology/Tipology'
import SuppliesList from './supplies-list/SuppliesList'
import DossiersList from './dossiers-list/DossiersList'
import Reason from './reason/Reason'
import Relationship from './relationship/Relationship'
import Form from './form/Form'
import Success from './success/Success'
import NotificationList from './notification-list/NotificationList'
import { adminCheck } from '../../../common/lib/ValidationLib'
import { hasNotUserPermissions } from '../../../common/lib/UserPermissionsLib'

import useStyles from './NewRequest.styles'
import Works from './works/Works'
import Consult from './consult/Consult'

// LCS: Importa la función - Wave 2
import { sendGAEvent, removeEmails } from '../../../core/utils/gtm'

const NewRequest = (props: any) => {
  const classes = useStyles({})

  const requests = useSelector((state: any) => state.requests)

  const {
    supplyData,
    setCreatingNewRequest,
    isLoading,
    setIsLoading,
    creatingNewRequestFromMeter,
    setCreatingNewRequestFromMeter
  } = props

  const [notificationListSelected, setNotificationListSelected] = useState([] as any)
  // comprobar si se accede a nivel de usuario o de suministro/expediente
  const [supplyOrDossier] = useState((window.location.pathname === '/supplies/detail' || window.location.pathname === '/provisions/detail') || false)

  const [cups, setCups] = useState('')

  const [currentStep, setCurrentStep] = useState(creatingNewRequestFromMeter ? 5 : (supplyOrDossier ? 3 : 1))
  // 1 > tipology
  // 2 > supplieslist or dossierslist
  // 3 > reason or method
  // 4 > relationship
  // 5 > form
  // 6 > success

  useEffect(() => {
    // LCS: Enviar evento de GdC a GA - Wave 2
    if (!window.location.href.includes('supplies')) {
      sendGAEvent({
        event: 'view',
        content_group: 'nueva peticion',
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
    }
    sessionStorage.setItem("previousPage", window.location.href);
  }, [])
  
  useEffect(() => {
    const PropsCurrentStep = ( props.location &&  props.location.state && props.location.state.currentStep !== undefined) ? props.location.state.currentStep : '';
    if (PropsCurrentStep===3 && requests.newRequestSteps.step1==='CUT') {
      setCurrentStep(3);
    }
  }, [])
  

  useEffect(() => {
    if (creatingNewRequestFromMeter === 2) {
      setCurrentStep(5)
    }
    //Comprobamos si el step1 es DOSSIER y step3 NOTIFICATIONS para redirigirlo a la lista de notificaciones
    if (creatingNewRequestFromMeter === undefined && !supplyOrDossier && requests.newRequestSteps.step1 === 'DOSSIER' &&
      requests.newRequestSteps.step3 === 'NOTIFICATIONS') {
      setCurrentStep(9)
    }
    // eslint-disable-next-line
  }, [creatingNewRequestFromMeter])


  let userRoles = sessionStorage.getItem('userRoles') || ''
  let gdprAccepted = sessionStorage.getItem('gdprAccepted') || ''

  let userRolesArray = userRoles.split(',')

  useEffect(() => {
    (adminCheck() && props.history) && props.history.push('/requests')
  }, [])

  if (hasNotUserPermissions()) {
    const redirectTo = userRolesArray.includes('US_CC') ? '/admin' : '/login'

    return <Redirect to={redirectTo} />
  }

  if (window.location.pathname !== '/gdpr' && gdprAccepted === '0') {
    return <Redirect to='/gdpr' />
  }

  return (
    <>
      <Grid container justifyContent='center' alignItems='center'>
        <Grid item container className={classes.maxWidthForBigScreens}>
          {
            window.location.pathname === '/requests/add' &&
            <ButtonToTop />
          }

          {
            currentStep === 1 &&
            <Tipology setCurrentStep={setCurrentStep} />
          }

          {
            (currentStep === 2 && requests.newRequestSteps.step1 === 'SUPPLY') &&
            <SuppliesList setCurrentStep={setCurrentStep} setCurrentCups={setCups} />
          }

          {
            (currentStep === 2 && requests.newRequestSteps.step1 === 'DOSSIER') &&
            <DossiersList setCurrentStep={setCurrentStep} />
          }

          {
            currentStep === 3 &&
            <Reason supplyData={supplyData} setCreatingNewRequest={setCreatingNewRequest} setCurrentStep={setCurrentStep} />
          }

          {
            currentStep === 4 &&
            <Relationship supplyData={supplyData} setCreatingNewRequest={setCreatingNewRequest} setCurrentStep={setCurrentStep} />
          }

          {
            currentStep === 5 &&
            <Form
              cups={cups}
              supplyData={supplyData}
              creatingNewRequestFromMeter={creatingNewRequestFromMeter}
              setCreatingNewRequestFromMeter={setCreatingNewRequestFromMeter}
              setCreatingNewRequest={setCreatingNewRequest}
              setCurrentStep={setCurrentStep}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              notificationListSelected={notificationListSelected}
              setNotificationListSelected={setNotificationListSelected}
            />
          }

          {
            currentStep === 6 &&
            <Works setCurrentStep={setCurrentStep} setCreatingNewRequest={setCreatingNewRequest} />
          }

          {
            currentStep === 7 &&
            <Consult setCurrentStep={setCurrentStep} setCreatingNewRequest={setCreatingNewRequest} />
          }

          {
            currentStep === 8 &&
            <Success 
              supplyData={supplyData} 
              setCreatingNewRequest={setCreatingNewRequest} 
              isLoading={isLoading} 
              setIsLoading={setIsLoading} 
              setCreatingNewRequestFromMeter={setCreatingNewRequestFromMeter}
            />
          }

          {
            currentStep === 9 &&
            <NotificationList
              cups={cups}
              setCreatingNewRequest={setCreatingNewRequest}
              setCurrentStep={setCurrentStep}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setCreatingNewRequestFromMeter={setCreatingNewRequestFromMeter}
              creatingNewRequestFromMeter={creatingNewRequestFromMeter}
              notificationListSelected={notificationListSelected}
              setNotificationListSelected={setNotificationListSelected}
            />
          }

        </Grid>
      </Grid>
    </>
  )
}

export default NewRequest
