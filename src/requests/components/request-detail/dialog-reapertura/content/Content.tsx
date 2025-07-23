import React, { useState, useEffect } from 'react'
import { Grid } from '@material-ui/core'

import { useTranslation } from 'react-i18next'
import useStyles from './Content.styles'
import campanaIcono from '../../../../../assets/icons/aviso_alerta_pop_up.svg'
import Input from '../../../../../common/components/input/Input'
import Button from '../../../../../common/components/button/Button'
import CloseIcon from '../../../../../assets/icons/cerrar.svg'
import { thunkUpdateRequest } from '../../../../store/actions/RequestsThunkActions'
import { useDispatch } from 'react-redux'


const Content = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const dispatch = useDispatch()

  const [inputText, setInputText] = useState('')

  const {
    handleCloseDialog,
    user,
    codSR,
    setIsLoading,
    setReopenDone
  } = props

  const handleSendReopen = () => {
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
      indReopen: '1',
      reopenMotive: '',  // Se informa vacío y lo rellena ZEUS
      reopenComments: inputText
    }
    
    dispatch(thunkUpdateRequest(data, (response) => {
      if (response && response.resultado === '0' && response.codigoSR) {
        setReopenDone(true)
      }
      handleCloseDialog()
      setIsLoading(false)
    }))  
}

  return (
      <Grid container>
        <img src={CloseIcon} className={classes.closeButton} alt='' onClick={handleCloseDialog} />
        <Grid container>
          <Grid container item xs={12} className={classes.gridIcon} justifyContent='center'>
            <img className={classes.bellIcon} src={campanaIcono} alt='' /> 
          </Grid>
          <Grid container item xs={12} className={classes.gridTitle} justifyContent='center'>
            <span className={classes.spanTitle}>{t('requests.newRequestDetail.popUpReapertura.title')}</span>
          </Grid>
          <Grid container item xs={12} className={classes.gridText} justifyContent='center'>
            {/* <span className={classes.spanSubtitle}>{t(`requests.newRequestDetail.popUpReapertura.subtitle.title1`)} <b>{t(`requests.newRequestDetail.popUpReapertura.subtitle.title2`)}</b>{`${t('requests.newRequestDetail.popUpReapertura.subtitle.title3')}:`}</span> */}
            <span className={classes.spanSubtitle}>{t(`requests.newRequestDetail.popUpReapertura.subtitle.title1`)} <b>{t(`requests.newRequestDetail.popUpReapertura.subtitle.title2`)}</b></span>
          </Grid>
        </Grid>
        <Grid container justifyContent='center'>
          <Grid item xs={11} className={classes.gridComment}>
            <span className={classes.label}>{t('requests.newRequestDetail.popUpReapertura.comment.label')}</span>
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
              placeholder={t('requests.newRequestDetail.popUpReapertura.initialComment')}
            />
          </Grid>
          <Grid xs={11} container item justifyContent='flex-end'>
            <Grid item className={classes.characterCount}>
              {t('requests.newRequestDetail.popUpReapertura.comment.characterCount.part1')}
              <b>{300 - inputText.length}</b>
              {t('requests.newRequestDetail.popUpReapertura.comment.characterCount.part2')}
              <b>300</b>
            </Grid>
          </Grid>
        </Grid>
        <Grid container justifyContent='center' className={classes.buttons}>
          <Grid item xs={12} sm={4} className={classes.cancelButtonGrid}>
            <Button 
              fullWidth 
              text={t('requests.newRequestDetail.popUpReapertura.cancel')} 
              variant='outlined' 
              className={classes.cancelButton}
              onClick={handleCloseDialog}
            />
          </Grid>
          <Grid item xs={12} sm={4}  className={classes.acceptButtonGrid}>
            <Button 
              fullWidth 
              text={t('requests.newRequestDetail.popUpReapertura.accept')} 
              variant='contained' 
              className={classes.acceptButton}
              onClick={handleSendReopen}
              disabled={inputText === ''}
            />
          </Grid>
        </Grid>
      </Grid>    
  )
}

export default Content