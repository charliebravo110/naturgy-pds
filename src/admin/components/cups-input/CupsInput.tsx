import React, { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'

import Input from '../../../common/components/input/Input'

import useStyles from './CupsInput.styles'
import { useTranslation } from 'react-i18next'

const CupsInput = (props: any) => {
  const { cups, setCups, error, selectedInput, selectInput } = props
  const { t } = useTranslation()
  const classes = useStyles({})

  const [inactive, setInactive] = useState(false)

  useEffect(() => {
    if (selectedInput === 1 || selectedInput === 2 || selectedInput === 3 || selectedInput === 5) {
      setInactive(true)
    } else {
      setInactive(false)
    }
  }, [selectedInput])

  return (
    <Grid container item xs={11} sm={10} md={8} spacing={1} className={`${classes.inputsWrapper} ${(inactive) && classes.inactive}`}>
      <p className={classes.inputTitle}>{t('admin.inputs.cupsNumber')}</p>
      <Input
        className={classes.input}
        showValidationIcon
        error={cups !== '' && error}
        value={cups}
        onChange={({ target }) => {
          setCups(target.value)
          selectInput(4)
        }}
      />
    </Grid>
  )
}

export default CupsInput