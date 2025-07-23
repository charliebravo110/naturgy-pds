import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { withRouter } from 'react-router-dom'

import Grid from '@material-ui/core/Grid'

import Spinner from '../../../../common/components/spinner/Spinner'
import Button from '../../../../common/components/button/Button'
import OkIcon from '../../../../assets/icons/aviso_ok.svg'

import {
  setRequestsList,
  setRequestsListSupply,
  setRequestsListDossier
} from '../../../store/actions/RequestsActions'
import { thunkGetRequestsList } from '../../../store/actions/RequestsThunkActions'

import useStyles from './Success.styles'

const Success = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const user = useSelector((state: any) => state.user)
  const requests = useSelector((state: any) => state.requests)
  const provisions = useSelector((state: any) => state.provisions)

  const { supplyData, history, setCreatingNewRequest, isLoading, setIsLoading, setCreatingNewRequestFromMeter } = props

  const [ loading, setLoading ] = useState(false)

  const handleClickButton = () => {
    setCreatingNewRequest ? setCreatingNewRequest(true) : setLoading(true)

    setIsLoading ? setIsLoading(true) : setLoading(true)

    let filter = `documentNumber::${user.profile.documentNumber}|status::1`

    dispatch(thunkGetRequestsList(filter, (response) => {
      if (response && response.length > 0) {
        // ok
        dispatch(setRequestsList(response))
      }

      setIsLoading ? setIsLoading(false) : setLoading(false)

      setCreatingNewRequest ? setCreatingNewRequest(false) : setLoading(false)

      if (window.location.pathname !== '/supplies/detail' && window.location.pathname !== '/provisions/detail') {
        history.push('/requests')
      }
      else if (window.location.pathname === '/supplies/detail') {
        setCreatingNewRequestFromMeter(0)
      }
    }))

    if (window.location.pathname === '/supplies/detail' || window.location.pathname === '/provisions/detail') {
      if (window.location.pathname === '/supplies/detail') {
        filter = filter + `|cups::${supplyData && supplyData.cups}`
      } else if (window.location.pathname === '/provisions/detail' && provisions.currentProvision.dossierCod) {
        filter = filter + `|dossierNumber::${provisions.currentProvision.dossierCod}`
      }

      dispatch(thunkGetRequestsList(filter, (response) => {
        if (response && response.length > 0) {
          // ok
          if (window.location.pathname === '/supplies/detail') {
            dispatch(setRequestsListSupply(response))
          } else if (window.location.pathname === '/provisions/detail') {
            dispatch(setRequestsListDossier(response))
          }
        }

        setIsLoading ? setIsLoading(false) : setLoading(false)

        setCreatingNewRequest ? setCreatingNewRequest(false) : setLoading(false)
      }))
    }
  }

  return (
    <div className={`${classes.block} ${window.location.pathname === '/supplies/detail' && 'without-margin'} ${window.location.pathname === '/provisions/detail' && 'with-margin'}`}>
      {
        (loading || isLoading) &&
          <Spinner fixed />
      }

      <Grid container className={classes.container}>
        <Grid item md={10} sm={11} xs={11}>
          <div className={`${classes.title} ${window.location.pathname === '/provisions/detail' && 'without-margin'}`}>{t('requests.newRequest.success.title')}</div>

          <Grid container direction='column' justifyContent='center' alignItems='center'>
            <Grid item>
               <img src={OkIcon} alt='' />
            </Grid>
          </Grid>
          <div className={classes.textInfo}>{t('requests.newRequest.success.description')}</div>

          {requests.newRequestSteps.step1 !== 'CUT' ?
            <div className={classes.textInfoLittle}>{t('requests.newRequest.success.contact')}</div>
          :
            <div className={classes.textInfoLittle}>{t('requests.newRequest.success.petition')}</div>
          }
          <div className={`${classes.textInfoLittle} custom`}>
            <div>{t('requests.newRequest.success.code')}</div>
            <div>{t('requests.newRequest.success.ref')}</div>
          </div>

          <Grid container direction='column' justifyContent='center' alignItems='center' spacing={1} item className={classes.buttonContainer}>
            {
              requests.newRequestSteps.step6 && Array.isArray(requests.newRequestSteps.step6) !== true &&
                <div className={classes.reference}>{requests.newRequestSteps.step6}</div>
            }
            {
              requests.newRequestSteps.step6 && Array.isArray(requests.newRequestSteps.step6) === true &&
                requests.newRequestSteps.step6.map((code, index) => {
                  return <div className={classes.reference} key={index}>{code}</div>
                })                
            }
            {requests.newRequestSteps.step1 === 'CUT' &&
              <div className={classes.textInfoLittle}>{t('requests.newRequest.success.securityText')}</div>
            }
            <Button
              className={classes.button}
              text={t('requests.newRequest.success.exit')}
              color={'primary'}
              size={'large'}
              variant={'contained'}
              onClick={() => handleClickButton()}
            />
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default withRouter(Success)
