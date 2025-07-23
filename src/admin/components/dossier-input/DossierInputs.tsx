import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Input from '../../../common/components/input/Input'

import useStyles from './DossierInputs.styles'

const DossierInputs = (props: any) => {

  const { dossier, setDossier, error, selectedInput, selectInput } = props
  const { t } = useTranslation()
  const classes = useStyles({})
  const [inactive, setInactive] = useState(false)

  useEffect(() => {
    if (selectedInput === 1 || selectedInput === 2 || selectedInput === 4 || selectedInput === 5) {
      setInactive(true)
    } else {
      setInactive(false)
    }
  }, [selectedInput])

  return (
    <Grid container item xs={11} sm={10} md={8} spacing={1} className={`${classes.inputsWrapper} ${(inactive) && classes.inactive}`}>
      <p className={classes.inputTitle}>{t('admin.inputs.dossierNumber')}</p>
      <Input
        className={classes.input}
        showValidationIcon
        error={dossier !== '' && error}
        value={dossier}
        onChange={({ target }) => {
          setDossier(target.value)
          selectInput(3)
        }}
      />
    </Grid>
  )
}

export default DossierInputs