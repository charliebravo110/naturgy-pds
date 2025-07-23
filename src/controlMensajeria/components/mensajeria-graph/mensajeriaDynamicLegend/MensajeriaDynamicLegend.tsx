import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Grid, Checkbox, withStyles } from '@material-ui/core'

import useStyles from './MensajeriaDynamicLegend.styles'
import { CheckboxProps } from '@material-ui/core/Checkbox'
import MailIcon from '../../../../assets/icons/sobre_enviado.svg'
import OkIcon from '../../../../assets/icons/ok.svg'
import UserIcon from '../../../../assets/icons/usuario_registrado.svg'

const DarkBlueCheckbox = withStyles({
  root: {
    color: '#1a587f',
    '&$checked': {
      color: '#1a587f',
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color='default' {...props} />)

const LightBlueCheckbox = withStyles({
  root: {
    color: '#66c2c9',
    '&$checked': {
      color: '#66c2c9',
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color='default' {...props} />)

const OrangeCheckbox = withStyles({
  root: {
    color: '#e57200',
    '&$checked': {
      color: '#e57200',
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color='default' {...props} />)

const MensajeriaDynamicLegend = (props: any) => {

  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    totalUsersCheckbox,
    setTotalUsersCheckbox,
    correctlySentCheckbox,
    setCorrectlySentCheckbox,
    registeredCheckbox,
    setRegisteredCheckbox
  } = props

  const handleChange = (event) => {
    if (event.target.name === 'checked1') {
      setTotalUsersCheckbox(!totalUsersCheckbox)
    }
    else if (event.target.name === 'checked2') {
      setCorrectlySentCheckbox(!correctlySentCheckbox)
    }
    else if (event.target.name === 'checked3') {
      setRegisteredCheckbox(!registeredCheckbox)
    }
  }

  return (
    <Grid container className={classes.container} >
      <Grid container md={4} sm={6} xs={12} className={classes.itemContainer}>
        <DarkBlueCheckbox checked={totalUsersCheckbox} onChange={handleChange} name='checked1' disabled={false}/>
        <img src={MailIcon} className={classes.icon} alt='' />
        <span className={classes.span}>{t('controlMensajeria.graph.totalSent')}</span>
      </Grid>
      <Grid container md={4} sm={6} xs={12} className={classes.itemContainer}>
        <LightBlueCheckbox checked={correctlySentCheckbox} onChange={handleChange} name='checked2' disabled={false}/>
        <img src={OkIcon} className={classes.icon} alt='' />
        <span className={classes.span}>{t('controlMensajeria.graph.sentCorrectly')}</span>
      </Grid>
      <Grid container md={4} sm={6} xs={12} className={classes.itemContainer}>
        <OrangeCheckbox checked={registeredCheckbox} onChange={handleChange} name='checked3' disabled={false}/>
        <img src={UserIcon} className={classes.icon} alt='' />
        <span className={classes.span}>{t('controlMensajeria.graph.registeredUsers')}</span>
      </Grid>
    </Grid>
  )
}

export default MensajeriaDynamicLegend