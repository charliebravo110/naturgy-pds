import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import { DialogActions } from '@material-ui/core'

import CloseIcon from '../../../../../../../assets/icons/cerrar.svg'

import TextButton from '../../../../../../../common/components/text-button/TextButton'
import Datepicker from '../../../../../../../common/components/datepicker/Datepicker'
import Button from '../../../../../../../common/components/button/Button'
import ConsultantsTable from '../../consultants-table/ConsultantsTable'
import { thunkUpdateDelegationsPeriods } from '../../../../../store/actions/SuppliesListThunkActions'
import { setCurrentDelegation } from '../../../../../../store/actions/SuppliesActions'

import useStyles from './Content.styles'

const Content = (props: any) => {
  const [ periodStartDate, setPeriodStartDate ] = useState('')
  const [ periodEndDate, setPeriodEndDate ] = useState('')
  let currentDelegation = useSelector((state: any) => state.delegations.currentDelegation)
  let currentDelegatesList = useSelector((state: any) => state.delegations.currentDelegatesList)
  const currentDelegationStartDate = currentDelegation && currentDelegation.startDate && currentDelegation.startDate.split('-').reverse().join('/')
  const currentDelegationEndDate = currentDelegation && currentDelegation.endDate && currentDelegation.endDate.split('-').reverse().join('/')

  const {
    closePopup,
    popupStatus,
    setPopupStatus,
    setIsLoading
  } = props

  const delegatesText = currentDelegation.role === 'US_MANAGER' ? 'manager' : 'consultant'
  const delegatesListText = currentDelegatesList && currentDelegatesList[0] && currentDelegatesList[0].role === 'US_MANAGER' ? 'manager' : 'consultant'

  const dispatch = useDispatch()

  const { t } = useTranslation()
  const classes = useStyles({})

  const updateDelegation = async() => {
    setIsLoading(true)
    if( periodStartDate || periodEndDate ){
      const items = [] as any

      const startDate = (periodStartDate && periodStartDate.split('/').reverse().join('-')) || currentDelegation.startDate
      const endDate = (periodEndDate && periodEndDate.split('/').reverse().join('-')) || currentDelegation.endDate

      const item = {
        delegationId: currentDelegation.delegationId,
        startDate,
        endDate
      }

      items.push(item)

      await dispatch(thunkUpdateDelegationsPeriods(items))
    }
    setIsLoading(false)
    closePopup()
  }

  const selectConsultant = (delegation: any) => {
    setPopupStatus(2)
    dispatch(setCurrentDelegation(delegation))
  }

  return (
    <>
        <Grid container justifyContent='flex-end'>
          <TextButton className={classes.closeButton} onClick={closePopup}>
            <img src={CloseIcon} alt='' />
          </TextButton>
        </Grid>
        {
          popupStatus === 1 ?
        <Grid container justifyContent='center' >
          <Grid item xs={11} md={11} >
            <div className={classes.title}>{t(`delegations.delegationProfile.${delegatesListText}sListTitle`)}</div>
            <div className={classes.subTitle}>{t(`delegations.delegationProfile.${delegatesListText}sListSubtitle`)}</div>
            <ConsultantsTable
              currentDelegatesList={currentDelegatesList}
              selectConsultant={selectConsultant}
            />
          </Grid>
        </Grid>
          :
        <Grid container justifyContent='center' >
          <Grid item xs={12} md={8} >
            <div className={classes.title}>{t(`delegations.delegationProfile.${delegatesText}`)}</div>
            <Grid container>
              <Grid container direction='column' spacing={1}>
                <Grid item className={classes.label}>
                  {t(`delegations.delegationProfile.${delegatesText}Name`)}
                </Grid>
                <Grid item className={classes.info}>
                    {currentDelegation && currentDelegation.name}
                </Grid>
              </Grid>
            </Grid>
            <Grid container >
              <Grid container direction='column' spacing={1}>
                <Grid item className={classes.label}>
                  {t('delegates.delegateProfile.email')}
                </Grid>
                <Grid item className={classes.info}>
                    {currentDelegation && currentDelegation.email}
                </Grid>
              </Grid>
            </Grid>
            <Grid container>
              <Grid container direction='column' spacing={1}>
                <Grid item className={classes.label}>
                    {t('delegates.delegateProfile.document')}
                </Grid>
                <Grid item className={classes.info}>
                    {currentDelegation && currentDelegation.documentNumber}
                </Grid>
              </Grid>
            </Grid>
            <Grid container>
              <Grid container direction='column' spacing={1}>
                <Grid item className={classes.label}>
                  {t('delegations.delegationProfile.period')}
                </Grid>
                <Grid container direction='row' className={classes.info}>
                  <Grid container item xs={12} md={6} direction='column'>
                    <p className={classes.dateText}>{t('delegations.delegationProfile.startDate')}</p>
                    <Datepicker date={periodStartDate || currentDelegationStartDate} setDate={setPeriodStartDate} maxDate={periodEndDate || currentDelegationEndDate} />
                  </Grid>
                  <Grid container item xs={12} md={6} direction='column'>
                    <p className={classes.dateText}>{t('delegations.delegationProfile.endDate')}</p>
                    <Datepicker date={periodEndDate || currentDelegationEndDate} setDate={setPeriodEndDate} minDate={periodStartDate || currentDelegationStartDate} maxDate={true} />
                  </Grid>
                </Grid>
                <DialogActions>
                  <Grid container spacing={2} direction='row' justifyContent='center'>
                    <Button
                      className={`${classes.button} ${classes.returnButton}`}
                      text={t('common.buttons.return')}
                      color='inherit'
                      size='large'
                      variant='contained'
                      onClick={closePopup}
                    />

                    <Button
                      className={classes.button}
                      text={t('common.buttons.accept')}
                      color='primary'
                      size='large'
                      variant='contained'
                      onClick={updateDelegation}
                    />
                  </Grid>
                </DialogActions>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        }
    </>
  )
}

export default Content
