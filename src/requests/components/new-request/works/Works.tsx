import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import Grid from '@material-ui/core/Grid'
import BackIcon from '@material-ui/icons/ChevronLeft'

import ClaimIcon from '../../../../assets/icons/peticiones_reclamaciones.svg'

import useStyles from './Works.styles'
import Item from './item/Item'
import Breadcrumbs from '../common/breadcrumbs/Breadcrumbs'
import { setNewRequestSteps } from '../../../store/actions/RequestsActions'

const Works = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

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

          <Breadcrumbs currentStep={6} />

          <Grid container className={classes.items} md={12} spacing={2}>
            <>
              <Item
                type='cut'
                icon={ClaimIcon}
                title={t('requests.newRequest.works.cut')}
                handleClick={() => handleClickItem('CUT')}
              />

              <Item
                type='unmount'
                icon={ClaimIcon}
                title={t('requests.newRequest.works.unmount')}
                handleClick={() => handleClickItem('UNMOUNT')}
              />
            </>
          </Grid>
          <div className={classes.exit}>
            {
              (window.location.pathname === '/supplies/detail' || window.location.pathname === '/provisions/detail') ?
                <span onClick={() => setCreatingNewRequest(false)}>{t('requests.newRequest.exit')}</span>
                :
                <Link to='/requests'>{t('requests.newRequest.exit')}</Link>
            }
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default Works
