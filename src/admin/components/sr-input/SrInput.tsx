import React, { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'

import Input from '../../../common/components/input/Input'

import useStyles from './SrInput.styles'
import { useTranslation } from 'react-i18next'

const SrInput = (props: any) => {
  const { sr, setSr, error, selectedInput, selectInput } = props
  const { t } = useTranslation()
  const classes = useStyles({})

  const [inactive, setInactive] = useState(false)

  useEffect(() => {
    if (selectedInput === 1 || selectedInput === 2 || selectedInput === 3 || selectedInput === 4) {
      setInactive(true)
    } else {
      setInactive(false)
    }
  }, [selectedInput])

  return (
    <Grid container item xs={11} sm={10} md={8} spacing={1} className={`${classes.inputsWrapper} ${(inactive) && classes.inactive}`}>
      <p className={classes.inputTitle}>{t('admin.inputs.srNumber')}</p>
      <Input
        className={classes.input}
        showValidationIcon
        error={sr !== '' && error}
        value={sr}
        onChange={({ target }) => {
          setSr(target.value)
          selectInput(5)
        }}
      />
    </Grid>
  )
}

export default SrInput