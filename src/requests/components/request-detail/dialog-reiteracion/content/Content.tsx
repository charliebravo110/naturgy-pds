import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core'

import { useTranslation } from 'react-i18next'
import useStyles from './Content.styles'
import campanaIcono from '../../../../../assets/icons/camapana.svg'
import Input from '../../../../../common/components/input/Input'
import Button from '../../../../../common/components/button/Button'
import CloseIcon from '../../../../../assets/icons/cerrar.svg'
import { useDispatch } from 'react-redux'
import { thunkUpdateRequest } from '../../../../store/actions/RequestsThunkActions'
import { showError } from '../../../../../common/store/actions/ErrorActions'


const Content = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()
  const [inputText, setInputText] = useState('')

  const dispatch = useDispatch()

  const {
    handleCloseDialog,
    user,
    codSR,
    setIsLoading,
    setReiterationDone
  } = props

  
  const handleSendReiteration = () => {
    setIsLoading(true)
    const auxSurname1 = user.surName.includes(' ') ? user.surName.split(' ')[0] : user.surName
    const auxSurname2 = user.surName.includes(' ') ? user.surName.split(' ')[1] : ''
    const data = {
      customer: {
        documentType: user.documentType,
        docNumber: user.documentNumber,
        name: user.name,
        surname: auxSurname1,
        surname2: auxSurname2,
        mail: user.email,
        phonemob: user.phone,
        phone: user.phone
      },
      codSR: codSR,
      docNumber: user.documentNumber,
      reiteration: 'Y',
      descriptionEvent: inputText
    }
    
    dispatch(thunkUpdateRequest(data, (response) => {
      if (response && response.resultado && response.codigoSR) {
        setReiterationDone && setReiterationDone(true)
      }
      else {
        dispatch(showError('XXX', 'updateServiceRequest'))
      }
      setIsLoading(false)      
    }))
    handleCloseDialog()
  }

  return (
      <Grid container>
        <img src={CloseIcon} className={classes.closeButton} alt='' onClick={handleCloseDialog} />
        <Grid container>
          <Grid container item xs={12} className={classes.gridIcon} justifyContent='center'>
            <img className={classes.bellIcon} src={campanaIcono} alt='' /> 
          </Grid>
          <Grid container item xs={12} className={classes.gridTitle} justifyContent='center'>
            <span className={classes.spanTitle}>{t('requests.newRequestDetail.popUpReiteracion.title')}</span>
          </Grid>
          <Grid container item xs={12} className={classes.gridText} justifyContent='center'>
            <span className={classes.spanSubtitle}>{t('requests.newRequestDetail.popUpReiteracion.subtitle')}</span>
          </Grid>
        </Grid>
        <Grid container justifyContent='center'>
          <Grid item xs={11} className={classes.gridComment}>
            <span className={classes.label}>{t('requests.newRequestDetail.popUpReiteracion.comment.label')}</span>
          </Grid>
          <Grid container item xs={11} className={classes.gridTitle} justifyContent='center'>
            <Input
              fullWidth
              multiline
              rows='5'
              inputProps={{
                maxLength: '300'
              }}
              onChange={(e) => setInputText(e.target.value)}
              value={inputText}
              key='inputText'
              className={classes.color}
              placeholder={t('requests.newRequestDetail.popUpReiteracion.initialComment')}
            />
          </Grid>
          <Grid xs={11} container item justifyContent='flex-end'>
            <Grid item className={classes.characterCount}>
              {t('requests.newRequestDetail.popUpReiteracion.comment.characterCount.part1')}
              <b>{300 - inputText.length}</b>
              {t('requests.newRequestDetail.popUpReiteracion.comment.characterCount.part2')}
              <b>300</b>
            </Grid>
          </Grid>
        </Grid>
        <Grid container justifyContent='center' className={classes.buttons}>
          <Grid item xs={12} sm={4} className={classes.cancelButtonGrid}>
            <Button 
              fullWidth 
              text={t('requests.newRequestDetail.popUpReiteracion.cancel')} 
              variant='outlined' 
              className={classes.cancelButton}
              onClick={handleCloseDialog}
            />
          </Grid>
          <Grid item xs={12} sm={4}  className={classes.acceptButtonGrid}>
            <Button 
              fullWidth 
              text={t('requests.newRequestDetail.popUpReiteracion.accept')} 
              variant='contained' 
              className={classes.acceptButton}
              onClick={handleSendReiteration}
              disabled={inputText === ''}
            />
          </Grid>
        </Grid>
      </Grid>    
  )
}

export default Content