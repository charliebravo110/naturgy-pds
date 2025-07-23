import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Divider, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Typography, DialogContent } from '@material-ui/core'
import useStyles_ from '../Content.styles'
import { StyledExpandMoreIcon } from '../../../../../../provisions/components/new-provision/steps/Steps.styles'
import Button from '../../../../../../common/components/button/Button'


interface BajaInterface {
  baja: string,
  comercializadora: string,
  handleCloseDialog: () => void
}

export default function BajaDetail(props: BajaInterface) {

  const {
    baja,
    comercializadora,
    handleCloseDialog
  } = props

  const classes_ = useStyles_({})
  const { t } = useTranslation()

  const [expanded, setExpanded] = useState(true)

  return (
    <>
      <Grid container xs={12} style={{ marginTop: '25px' }}>
        <ExpansionPanel defaultExpanded expanded={expanded} onChange={() => { }} className={classes_.root}>
          <ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header' className={classes_.summary} onClick={() => setExpanded(!expanded)}>
            <Typography className={classes_.expansionPanelSummaryText}>{t('Datos de la solicitud')}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes_.details}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Grid container direction='column'>
                  <Grid item className={classes_.textLineInfo}>
                    <span>{'Motivo de la baja:'}</span>
                    <span className={classes_.customText}>{'No disponible'}</span>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Grid container direction='column'>
                  <Grid item className={classes_.textLineInfo}>
                    <span>{'Comercializadora:'}</span>
                    <span className={classes_.customText}>
                      {(comercializadora && comercializadora  !== '') ? comercializadora : (comercializadora == '' ? 'No disponible' : 'No aplica')}
                    </span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Grid>
      <p style={{ textAlign: 'center', color: '#004571' }}>
        En caso de no haber solicitado esta gestión, por favor, contacta con tu comercializadora.
      </p>
      <Grid container justifyContent='center' className={classes_.buttons}>
        <Grid item xs={12} sm={6} justifyContent='center' className={classes_.cancelButtonGrid}>
          <Button
            fullWidth
            text={t('Cerrar')}
            color='primary'
            size='large'
            variant='contained'
            className={classes_.cancelButton}
            onClick={handleCloseDialog}
          />
        </Grid>
      </Grid>
    </>
  )
}