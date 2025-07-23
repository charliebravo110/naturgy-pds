import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Grid, Checkbox, withStyles } from '@material-ui/core'

import useStyles from './CDDynamicLegend.styles'
import { CheckboxProps } from '@material-ui/core/Checkbox'
import OkIcon from '../../../../../../assets/icons/ok.svg'
import EmailIcon from '../../../../../../assets/icons/Interfaz_90_sobre_mail_correo_postal.svg'
import MobileIcon from '../../../../../../assets/icons/Icon_sms.svg'
import OpenedPadlockIcon from '../../../../../../assets/icons/ico_candado_abierto.svg'

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

const GreenCheckbox = withStyles({
  root: {
    color: '#8e9300',
    '&$checked': {
      color: '#8e9300',
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color='default' {...props} />)

const CDDynamicLegend = (props: any) => {

  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    totalUrlCheckbox,
    setTotalUrlCheckbox,
    enviadosEmailCheckbox,
    setEnviadosEmailCheckbox,
    enviadosSmsCheckbox,
    setEnviadosSmsCheckbox,
    openedUrlsCheckbox,
    setOpenedUrlsCheckbox
  } = props

  const handleChange = (event) => {
    if (event.target.name === 'checked1') {
      setTotalUrlCheckbox(!totalUrlCheckbox)
    }
    else if (event.target.name === 'checked2') {
      setEnviadosEmailCheckbox(!enviadosEmailCheckbox)
    }
    else if (event.target.name === 'checked3') {
      setEnviadosSmsCheckbox(!enviadosSmsCheckbox)
    }
    else if (event.target.name === 'checked4') {
      setOpenedUrlsCheckbox(!openedUrlsCheckbox)
    }
  }

  return (
    <Grid container className={classes.container} >
      <Grid container md={3} sm={6} xs={12} className={classes.itemContainer}>
        <DarkBlueCheckbox checked={totalUrlCheckbox} onChange={handleChange} name='checked1' disabled={false}/>
        <img src={OkIcon} className={classes.icon} alt='' />
        <span className={classes.span}>{t('clientDigitizationControl.search.searchParameters.resumeGraph.totalUrl')}</span>
      </Grid>
      <Grid container md={3} sm={6} xs={12} className={classes.itemContainer}>
        <LightBlueCheckbox checked={enviadosEmailCheckbox} onChange={handleChange} name='checked2' disabled={false}/>
        <img src={EmailIcon} className={classes.icon} alt='' />
        <span className={classes.span}>{t('clientDigitizationControl.search.searchParameters.resumeGraph.sentEmail')}</span>
      </Grid>
      <Grid container md={3} sm={6} xs={12} className={classes.itemContainer}>
        <OrangeCheckbox checked={enviadosSmsCheckbox} onChange={handleChange} name='checked3' disabled={false}/>
        <img src={MobileIcon} className={classes.icon} alt='' />
        <span className={classes.span}>{t('clientDigitizationControl.search.searchParameters.resumeGraph.sentSms')}</span>
      </Grid>
      <Grid container md={3} sm={6} xs={12} className={classes.itemContainer}>
        <GreenCheckbox checked={openedUrlsCheckbox} onChange={handleChange} name='checked4' disabled={false}/>
        <img src={OpenedPadlockIcon} className={classes.icon} alt='' />
        <span className={classes.span}>{t('clientDigitizationControl.search.searchParameters.resumeGraph.openedUrls')}</span>
      </Grid>
    </Grid>
  )
}

export default CDDynamicLegend