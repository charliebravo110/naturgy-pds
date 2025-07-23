import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import Select from '../../../../../../common/components/select/Select'
import Input from '../../../../../../common/components/input/Input'
import Switch from '../../../../../../common/components/switch/Switch'

import useStyles from './SupportForm.styles'

const SupportForm = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    state,
    techData,
    setTechDataI,
    techDataErrors,
    setTechDataErrors
  } = props

  return (
    <Grid container className={classes.inputs}>

      <Grid container justifyContent='space-between'>
        <Grid container md={5} direction='column' className={classes.inputContainer}>
          <Grid item>
            <Typography>
              {t(
                'provisions.editInstallations.requestData.technicalData.labels.divert.elements.support.labels.firstColumn.row1'
              )}
            </Typography>
          </Grid>
          <Grid item className={classes.input}>
            {state === 0 ? (
              <Input
                fullWidth
                value={techData.cause}
                onChange={(e) => setTechDataI({ ...techData, cause: e.target.value })}
              />
            ) : (
              <Typography className={classes.text}>{''}</Typography>
            )}
          </Grid>
        </Grid>
        <Grid container md={5} direction='column' className={classes.inputContainer}>
          <Grid item>
            <Typography>
              {t(
                'provisions.editInstallations.requestData.technicalData.labels.divert.elements.support.labels.secondColumn.row1'
              )}
            </Typography>
          </Grid>
          <Grid item className={classes.input}>
            {state === 0 ? (
              <Select
                fullWidth
                values={[]}
                value={''}
                label={t(
                  'provisions.editInstallations.requestData.technicalData.labels.divert.selectPlaceholder'
                )}
                onChange={(e) => setTechDataI({ ...techData, cause: e.target.value })}
              />
            ) : (
              <Typography className={classes.text}>{''}</Typography>
            )}
          </Grid>
        </Grid>
      </Grid>

      <Grid container justifyContent='space-between'>
        <Grid container md={5} direction='column' className={classes.inputContainer}>
          <Grid item>
            <Typography>
              {t(
                'provisions.editInstallations.requestData.technicalData.labels.divert.elements.support.labels.firstColumn.row2'
              )}
            </Typography>
          </Grid>
          <Grid item className={classes.input}>
            {state === 0 ? <Switch /> : <Switch disabled />}
          </Grid>
        </Grid>
        <Grid container md={5} direction='column' className={classes.inputContainer}>
          <Grid item>
            <Typography>
              {t(
                'provisions.editInstallations.requestData.technicalData.labels.divert.elements.support.labels.secondColumn.row2'
              )}
            </Typography>
          </Grid>
          <Grid item className={classes.input}>
            {state === 0 ? <Switch /> : <Switch disabled />}
          </Grid>
        </Grid>
      </Grid>

      <Grid container justifyContent='space-between'>
        <Grid container md={5} direction='column' className={classes.inputContainer}>
          <Grid item>
            <Typography>
              {t(
                'provisions.editInstallations.requestData.technicalData.labels.divert.elements.support.labels.firstColumn.row3'
              )}
            </Typography>
          </Grid>
          <Grid item className={classes.input}>
            {state === 0 ? <Switch /> : <Switch disabled />}
          </Grid>
        </Grid>
        <Grid container md={5} />
      </Grid>

      <Grid container justifyContent='space-between'>
        <Grid container md={5} direction='column' className={classes.inputContainer}>
          <Grid item>
            <Typography>
              {t(
                'provisions.editInstallations.requestData.technicalData.labels.divert.elements.support.labels.firstColumn.row4'
              )}
            </Typography>
          </Grid>
          <Grid item className={classes.input}>
            {state === 0 ? (
              <Input
                fullWidth
                value={techData.cause}
                onChange={(e) => setTechDataI({ ...techData, cause: e.target.value })}
              />
            ) : (
              <Typography className={classes.text}>{''}</Typography>
            )}
          </Grid>
        </Grid>
        <Grid container md={5} />
      </Grid>

    </Grid>
  )
}

export default SupportForm
