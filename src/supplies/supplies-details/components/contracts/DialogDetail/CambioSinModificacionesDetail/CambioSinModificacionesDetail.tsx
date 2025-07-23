import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Divider, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Typography, DialogContent } from '@material-ui/core'
import useStyles_ from '../Content.styles'
import { StyledExpandMoreIcon } from '../../../../../../provisions/components/new-provision/steps/Steps.styles'
import Button from '../../../../../../common/components/button/Button'
import { formatNumber } from '../../../../../../common/lib/FormatLib'

interface potenciainterface {
  potencia: string
}

interface BajaInterface {
  comerSaliente: string,
  comerEntrante: string,
  peaje: string,
  grupoPeaje: string,
  potencia: potenciainterface[]
  ATR: string,
  autoconsumoType: string,
  handleCloseDialog: () => void
}

export default function CambioSinModificacionesDetail(props: BajaInterface) {

  const {
    comerSaliente,
    comerEntrante,
    peaje,
    grupoPeaje,
    potencia,
    ATR,
    autoconsumoType,
    handleCloseDialog
  } = props

  const classes_ = useStyles_({})
  const { t } = useTranslation()

  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <Grid container xs={12} style={{ marginTop: '25px' }}>
        <ExpansionPanel defaultExpanded expanded={expanded} onChange={() => { }} className={classes_.root}>
          <ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />} aria-controls='panel1a-content' id='panel1a-header' className={classes_.summary} onClick={() => setExpanded(!expanded)}>
            <Typography className={classes_.expansionPanelSummaryText}>{t('Datos de la solicitud')}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes_.details}>
            <Grid container>
              <Grid item xs={12} sm={6}>
                <Grid container direction='column'>
                  <Grid item className={classes_.textLineInfo}>
                    <span>{'Comercializadora saliente'}</span>
                    <span className={classes_.customText}>
                      {(comerSaliente && comerSaliente  !== '') ? comerSaliente : (comerSaliente == '' ? 'No disponible' : 'No aplica')}
                      </span>
                  </Grid>
                  <Grid item className={classes_.textLineInfo}>
                    <span>{'Comercializadora entrante'}</span>
                    <span className={classes_.customText}>
                      {(comerEntrante && comerEntrante  !== '') ? comerEntrante : (comerEntrante == '' ? 'No disponible' : 'No aplica')}
                    </span>
                  </Grid>
                  <Grid item className={classes_.textLineInfo}>
                    <span>{'Peaje'}</span>
                    <span className={classes_.customText}>
                      {(peaje && peaje  !== '') ? peaje : (peaje == '' ? 'No disponible' : 'No aplica')}
                    </span>
                  </Grid>
                  <Grid item className={classes_.textLineInfo}>
                    <span>{'Grupo de peaje'}</span>
                    <span className={classes_.customText}>
                      {(grupoPeaje && grupoPeaje  !== '') ? grupoPeaje : (grupoPeaje == '' ? 'No disponible' : 'No aplica')}
                    </span>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Grid container direction='column'>
                  {
                    (potencia.length !== 0) ? 
                    <Grid item className={classes_.textLineInfoPT}>
                      <span>{'Potencia contratada (kW):'}</span>
                    </Grid>
                    :
                    <Grid item className={classes_.textLineInfoPT}>
                      <span>{'Potencia contratada (kW):'}</span>
                      <span className={classes_.customText}>{'No disponible'}</span>
                    </Grid>
                  }
                  {
                    potencia.map((potencia, index) => (
                      <Grid item key={index} className={classes_.textLineInfoNoBold} style={{fontWeight:'initial'}}>
                        <span>{`Potencia contratada Pc${index + 1}:`}</span>
                        <span className={classes_.customText}>{formatNumber(potencia.potencia)}</span>
                      </Grid>
                    ))
                  }
                  <Grid item className={classes_.textLineInfo}>
                    <span>{'Tipo de contrato ATR:'}</span>
                    <span className={classes_.customText}>
                      {(ATR && ATR  !== '') ? ATR : (ATR == '' ? 'No disponible' : 'No aplica')}
                    </span>
                  </Grid>
                  <Grid item className={classes_.textLineInfo}>
                    <span>{'Tipo de autoconsumo:'}</span>
                    <span className={classes_.customText}>
                      {(autoconsumoType && autoconsumoType  !== '') ? autoconsumoType : (autoconsumoType == '' ? 'No disponible' : 'No aplica')}
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