import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import BackIcon from '@material-ui/icons/ChevronLeft'

import ClaimIcon from '../../../../assets/icons/peticiones_reclamaciones.svg'

import useStyles from './Consult.styles'
import Item from './item/Item'
import Breadcrumbs from '../common/breadcrumbs/Breadcrumbs'

import { setNewRequestSteps } from '../../../store/actions/RequestsActions'
import { Link } from 'react-router-dom'
import { sendGAEvent } from '../../../../core/utils/gtm'

const Consult = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const requests = useSelector((state: any) => state.requests)

  const { setCurrentStep, setCreatingNewRequest } = props

  const handleClickBack = () => {
    dispatch(setNewRequestSteps({
      step3: ''
    }))
    setCurrentStep(1)
  }

  const handleClickItem = (value) => {
    dispatch(setNewRequestSteps({
      step3: value
    }))

    setCurrentStep(5)

  }

  useEffect(() => {
    dispatch(setNewRequestSteps({
      step3: '',
      step4: ''
    }))
  }, [])

  const sendGAEventConsult = (type:any):void => {
    var clickTextAux
    switch (type) {
      case 'INFO':
        clickTextAux = 'quiero hacer una consulta sobre el funcionamiento del area privada'
        break;
      case 'REPORT':
        clickTextAux = 'quiero reportar un error en el apartado mis conexiones a la red o mis peticiones'
        break;
    }

    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mis peticiones',
      subsection_name: 'nueva peticion',
      click_text: clickTextAux,
      element_type: 'consulta de informacion',
      page_url:window.location.href,
      request_type: 'quiero hacer una consulta o reportar un error del area privada',
      request_step: '1',
      browsing_type: sessionStorage.getItem('browsing_type'),
    })
  }

  const sendGAEventExitConsult = ():void => {
    sendGAEvent({
      event: 'request_funnel',
      section_name: 'mis peticiones',
      subsection_name: 'nueva peticion',
      click_text: 'salir de la peticion',
      element_type: 'consulta de informacion',
      page_url: window.location.href,
      request_type: 'quiero hacer una consulta o reportar un error del area privada',
      request_step: '1',
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

          <Breadcrumbs currentStep={7} />

          <Grid container className={classes.items} md={12} spacing={2}>
            {requests.newRequestSteps.step1 === 'CONSULT' &&
              <>
                <Item
                  type='info'
                  icon={ClaimIcon}
                  title={t('requests.newRequest.consult.info')}
                  handleClick={() => { sendGAEventConsult('INFO'); handleClickItem('INFO')}}
                />

                <Item
                  type='report'
                  icon={ClaimIcon}
                  title={t('requests.newRequest.consult.report')}
                  handleClick={() => { sendGAEventConsult('REPORT'); handleClickItem('REPORT')}}
                />
              </>
            }

          </Grid>
          <div className={classes.exit}>
            {
              (window.location.pathname === '/supplies/detail' || window.location.pathname === '/provisions/detail') ?
                <span onClick={() => {sendGAEventExitConsult(); setCreatingNewRequest(false)}}>{t('requests.newRequest.exit')}</span>
                :
                <Link onClick={() => {sendGAEventExitConsult()}} to='/requests'>{t('requests.newRequest.exit')}</Link>
            }
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default Consult
