import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import SuccessDialog from './success-dialog/SuccessDialog'
import Button from '../../../../common/components/button/Button'

import { checkDocumentTypeInString } from '../../../../common/lib/ValidationLib'

import { thunkCreateNewRequest } from '../../../../requests/store/actions/RequestsThunkActions'

import useStyles from './ContactMeButton.styles'

const ContactMeButton = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const user = useSelector((state: any) => state.user)
  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)

  const { setLoading } = props

  const [ isSuccessDialogVisible, setIsSuccessDialogVisible ] = useState(false)
  const [ srCode, setSrCode ] = useState('')

  const handleClick = () => {
    // create sr

    setLoading(true)

    let data = {
      documentType: checkDocumentTypeInString(user.profile.documentNumber),
      documentNumber: user.profile.documentNumber,
      name: user.profile.name,
      surName1: user.profile.surName,
      email: user.profile.email,
      landline: user.profile.phone, // phone
      cellphone: user.profile.phone, // phonemob
      tipology: '1074A24',
      subtipology: '',
      cups: '',
      dossierNumber: currentProvision.dossierCod || '',
      comment: '',
      documents: [{
        url: '',
        idDocumentum: '',
        nombreArchivo: '',
        format: '',
        documentType: '',
        documentState: ''
      }]
    } as any

    dispatch(thunkCreateNewRequest(data, (response: any) => {
      if (response && response.result && response.result.codResult === '0000') {
        setSrCode(response.codigoSR)

        setIsSuccessDialogVisible(true)
      }

      setLoading(false)
    }))
  }

  return (
    <>
      <SuccessDialog
        showingDialog={isSuccessDialogVisible}
        handleReturn={() => setIsSuccessDialogVisible(false)}
        srCode={srCode}
      />

      <Grid container className={classes.container} md={12}>
        <Button
          className={classes.button}
          text={t('provisions.provisionsDetails.contactMe.button')}
          color='primary'
          size='small'
          variant='contained'
          onClick={handleClick}
        />


        {
          /*
          <Grid item className={classes.button} onClick={handleClick}>
            {t('provisions.provisionsDetails.contactMe.button')}
          </Grid>
          */
        }
      </Grid>
    </>
  )
}

export default ContactMeButton
