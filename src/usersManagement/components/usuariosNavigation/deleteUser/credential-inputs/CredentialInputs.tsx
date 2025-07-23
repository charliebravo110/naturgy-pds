import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Input from '../../../../../common/components/input/Input'
import Select from '../../../../../common/components/select/Select'

import useStyles from './CredentialInputs.styles'

const CredentialInputs = (props: any) => {
  const { credentialType, setCredentialType, credential, setCredential, error } = props

  const [emptyCredentialTypeError, setEmptyCredentialTypeError] = useState(false)
  const { t } = useTranslation()

  const selectValues = ['NIF', 'CIF', 'NIE']

  const classes = useStyles({})


  useEffect(() => {
    if ((credentialType === '') && (credential !== '')) {
      setEmptyCredentialTypeError(true)
    } else {
      setEmptyCredentialTypeError(false)
    }
  }, [credentialType, credential])

  return (
    <Grid container item xs={11} sm={10} md={12} spacing={1} className={classes.inputsWrapper}>
      <Grid item xs={12} sm={6}>
        <p className={classes.inputTitle}>{t('admin.inputs.credentialType')}</p>
        <Select
          className={classes.input}
          label={t('admin.inputs.credentialTypeLabel')}
          values={selectValues}
          value={credentialType}
          onChange={({ target }) => setCredentialType(target.value)}
        />
        <div className={classes.error}>
          {emptyCredentialTypeError
            && <>{t('admin.inputs.credentialTypeError')}</>
          }
        </div>
      </Grid>
      <Grid item xs={12} sm={6}>
        <p className={classes.inputTitle}>{t('admin.inputs.credential')}</p>
        <Input
          className={classes.input}
          showValidationIcon
          error={credential !== '' && error}
          value={credential}
          onChange={({ target }) => {
            setCredential(target.value)
          }}
        />
        <div className={`explanation ${classes.numberExplanation}`}>
          {t('admin.inputs.credentialAdvice')}<br />
          {t('admin.inputs.credentialAdviceExample')}
        </div>
      </Grid>
    </Grid>
  )
}

export default CredentialInputs