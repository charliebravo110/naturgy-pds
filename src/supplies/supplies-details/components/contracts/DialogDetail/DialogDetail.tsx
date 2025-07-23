import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import useStyles from './DialogDetail.styles'
import Content from './Content'
import Dialog from '../../../../../common/components/dialog/Dialog'
import Modales from '../../../../../Components/Modales'
import { Divider, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Typography, DialogContent, createTheme, MuiThemeProvider } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import useStyles_, { StyledTableCell } from './Content.styles'
import campanaIcono from '../../../../../assets/icons/camapana.svg'
import Input from '../../../../../common/components/input/Input'
import Button from '../../../../../common/components/button/Button'
import CloseIcon from '../../../../../assets/icons/cerrar.svg'
import { useDispatch } from 'react-redux'
import { showError } from '../../../../../common/store/actions/ErrorActions'
import InfoIcon from '../../../../../assets/icons/info.svg'
import { StyledExpandMoreIcon } from '../../../../../provisions/components/new-provision/steps/Steps.styles'
import BajaDetail from './BajaDetail/BajaDetail'
import CorDetail from './CorDetail/CorDetail'
import CambioSinModificacionesDetail from './CambioSinModificacionesDetail/CambioSinModificacionesDetail'
import CambioConModificacionesDetail from './CambioConModificacionesDetail/CambioConModificacionesDetail'
import DesentimientoDetail from './DesentimientoDetail/DesentimientoDetail'
import ModificacionContratoAcceso from './ModificacionContratoAcceso/ModificacionContratoAcceso'
import TraspasoPunto from './TraspasoPunto/TraspasoPunto'
import { formatIsoDateAndHour, formatNumber } from '../../../../../common/lib/FormatLib'
import ArrowTooltip from '../../../../../common/components/tooltip/arrow/ArrowTooltip'


const DialogReiteracion = (props: any) => {
  const classes = useStyles({})
  const classes_ = useStyles_({})
  const { t } = useTranslation()

  const {
    showingDialog,
    setShowingDialog,
    selected,
    CUPS
  } = props

  const handleCloseDialog = () => {
    setShowingDialog(false)
  }

  const [expanded, setExpanded] = useState<boolean>(true)

  const [CDA_Resultado, setCDA_Resultado] = useState('0')
  const [alta] = useState(selected?.fecMensaje?.split('T')?.join(' '))
  const [comercializadora] = useState(selected?.desComercializador)
  const [peaje] = useState(selected?.desPeaje)
  const [grupoPeaje] = useState(selected?.desGrupoPeaje)
  const [potencias] = useState(selected?.potenciaPeriodos?.potenciaPeriodo)
  const [ATR] = useState(selected?.desTipoContrato)
  const [autoconsumo] = useState(selected?.desTipoAutoconsumo)
  const [oldComer] = useState(selected?.desComercializadorSaliente)
  const [newComer] = useState(selected?.desComercializador)
  const [chat] = useState(selected?.pasos?.paso)
  const [fechaSolicitud] = useState(selected?.fecSolicitudFormated + ' ' + selected?.fecSolicitud.slice(-8))

  const getPotencias = () => {
    return (
      potencias.forEach((potencia, index) => {
        return (
          <Grid item className={classes_.textLineInfoPC}>
            <span>{`Potencia contratada Pc${index + 1}:`}</span>
            <span className={classes_.customText}>{formatNumber(potencia.potencia)}</span>
          </Grid>
        )
      })
    )
  }

  const theme = createTheme({
    overrides: {
      MuiTooltip: {
        tooltip: {
          fontSize: '1em',
          backgroundColor: 'white !important',
          color: '#5985a2 !important',
          padding: '15px !important',
          boxShadow: '2px 2px 2px 2px #e2e2e2 !important',
          maxWidth: '300px !important',
          fontFamily: 'FSEmeric',
          textAlign: 'center'
        },
        tooltipArrow: {
          fontSize: '1em',
          backgroundColor: 'white !important',
          color: '#5985a2 !important',
          padding: '15px !important',
          boxShadow: '2px 2px 2px 2px #e2e2e2 !important',
          maxWidth: '300px !important',
          fontFamily: 'FSEmeric',
          textAlign: 'center'
        }
      }
    }
  });

  useEffect(() => {
    setCDA_Resultado(selected.cdaResultado)
  }, [selected])

 

  return (
    <Modales
      isOpen={showingDialog}
      toggle={handleCloseDialog}
      showCloseIcon={true}
      title={`dialog.traking.${selected.cdaProceso}`}
    >
      {selected.cdaProceso === 'A3' ? (
        CDA_Resultado === '21' ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            recibida
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={'Hemos recibido de tu comercializadora la solicitud de alta de tu suministro.'}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
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
                          <span>{'Fecha de alta:'}</span>
                          <span className={classes_.customText}>{formatIsoDateAndHour(alta)}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Comercializadora:'}</span>
                          <span className={classes_.customText}>
                            {(comercializadora && comercializadora  !== '') ? comercializadora : (comercializadora == '' ? 'No disponible' : 'No aplica')}
                            </span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Peaje:'}</span>
                          <span className={classes_.customText}>
                            {(peaje && peaje  !== '') ? peaje : (peaje == '' ? 'No disponible' : 'No aplica')}
                          </span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Grupo de peaje:'}</span>
                          <span className={classes_.customText}>
                            {(grupoPeaje && grupoPeaje  !== '') ? grupoPeaje : (grupoPeaje == '' ? 'No disponible' : 'No aplica')}
                            </span>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Grid container direction='column'>
                      {
                        (potencias.length !== 0) ? 
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
                          potencias.map((potencia, index) => (
                          <Grid item key={index} className={classes_.textLineInfoPC} style={{fontWeight:'initial'}}>
                            <span>{`Potencia contratada Pc${index + 1}:`}</span>
                            <span className={classes_.customText}>{formatNumber(potencia.potencia)}</span>
                          </Grid>
                        ))
                      }
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Tipo de contrato ATR:'}</span>
                          <span className={classes_.customText}>
                            {(ATR && ATR!== '') ? ATR: (ATR== '' ? 'No disponible' : 'No aplica')}
                          </span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Tipo de autoconsumo:'}</span>
                          <span className={classes_.customText}>{(autoconsumo&& autoconsumo!== '') ? autoconsumo: (autoconsumo== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
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
          </Content>
        ) : (CDA_Resultado === '22' || CDA_Resultado === '40' || CDA_Resultado === '44') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            enCurso
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={'Estamos revisando la información que nos ha proporcionado tu comercializadora.'}
            msj={chat}

            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
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
                          <span>{'Fecha de alta:'}</span>
                          <span className={classes_.customText}>{formatIsoDateAndHour(alta)}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Comercializadora:'}</span>
                          <span className={classes_.customText}>{(comercializadora && comercializadora  !== '') ? comercializadora : (comercializadora == '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Peaje:'}</span>
                          <span className={classes_.customText}>
                            {(peaje&& peaje!== '') ? peaje: (peaje== '' ? 'No disponible' : 'No aplica')}
                            </span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Grupo de peaje:'}</span>
                          <span className={classes_.customText}>{(grupoPeaje && grupoPeaje!== '') ? grupoPeaje: (grupoPeaje== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Grid container direction='column'>
                        {
                          (potencias.length !== 0) ? 
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
                            potencias.map((potencia, index) => (
                            <Grid item key={index} className={classes_.textLineInfoPC} style={{fontWeight:'initial'}}>
                              <span>{`Potencia contratada Pc${index + 1}:`}</span>
                              <span className={classes_.customText}>{formatNumber(potencia.potencia)}</span>
                            </Grid>
                          ))
                        }
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Tipo de contrato ATR:'}</span>
                          <span className={classes_.customText}>{(ATR && ATR!== '') ? ATR: (ATR== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Tipo de autoconsumo:'}</span>
                          <span className={classes_.customText}>{(autoconsumo&& autoconsumo!== '') ? autoconsumo: (autoconsumo== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
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
          </Content>
        ) : (CDA_Resultado === '25') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            enCurso
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={'Tu comercializadora nos ha enviado una solicitud de anulación del alta del suministro.'}
            msj={chat}

            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
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
                          <span>{'Fecha de alta:'}</span>
                          <span className={classes_.customText}>{formatIsoDateAndHour(alta)}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Comercializadora:'}</span>
                          <span className={classes_.customText}> {(comercializadora && comercializadora  !== '') ? comercializadora : (comercializadora == '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Peaje:'}</span>
                          <span className={classes_.customText}>{(peaje&& peaje!== '') ? peaje: (peaje== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Grupo de peaje:'}</span>
                          <span className={classes_.customText}>{(grupoPeaje && grupoPeaje!== '') ? grupoPeaje: (grupoPeaje== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Grid container direction='column'>
                        {
                          (potencias.length !== 0) ? 
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
                            potencias.map((potencia, index) => (
                            <Grid item key={index} className={classes_.textLineInfoPC} style={{fontWeight:'initial'}}>
                              <span>{`Potencia contratada Pc${index + 1}:`}</span>
                              <span className={classes_.customText}>{formatNumber(potencia.potencia)}</span>
                            </Grid>
                          ))
                         }
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Tipo de contrato ATR:'}</span>
                          <span className={classes_.customText}>{(ATR && ATR!== '') ? ATR: (ATR== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Tipo de autoconsumo:'}</span>
                          <span className={classes_.customText}>{(autoconsumo&& autoconsumo!== '') ? autoconsumo: (autoconsumo== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
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
          </Content>
        ) : (CDA_Resultado === '27') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            enCurso
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={'Hemos rechazado la petición de anulación que nos ha trasladado tu comercializadora y tu solicitud sigue en curso.'}
            extraInfo={' Para más información, por favor, contacta con ellos.'}
            msj={chat}

            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
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
                          <span>{'Fecha de alta:'}</span>
                          <span className={classes_.customText}>{formatIsoDateAndHour(alta)}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Comercializadora:'}</span>
                          <span className={classes_.customText}> {(comercializadora && comercializadora  !== '') ? comercializadora : (comercializadora == '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Peaje:'}</span>
                          <span className={classes_.customText}>{(peaje&& peaje!== '') ? peaje: (peaje== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Grupo de peaje:'}</span>
                          <span className={classes_.customText}>{(grupoPeaje && grupoPeaje!== '') ? grupoPeaje: (grupoPeaje== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Grid container direction='column'>
                          {
                            (potencias.length !== 0) ? 
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
                          potencias.map((potencia, index) => (
                          <Grid item key={index} className={classes_.textLineInfoPC} style={{fontWeight:'initial'}}>
                            <span>{`Potencia contratada Pc${index + 1}:`}</span>
                            <span className={classes_.customText}>{formatNumber(potencia.potencia)}</span>
                          </Grid>
                        ))
                      }
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Tipo de contrato ATR:'}</span>
                          <span className={classes_.customText}>{(ATR && ATR!== '') ? ATR: (ATR== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Tipo de autoconsumo:'}</span>
                          <span className={classes_.customText}>{(autoconsumo&& autoconsumo!== '') ? autoconsumo: (autoconsumo== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
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
          </Content>
        ) : (CDA_Resultado === '46') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            enCurso
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={'Hemos recibido de tu comercializadora la confirmación de la resolución de la incidencia. Nuestro equipo está trabajando para continuar con tu solicitud'}
            msj={chat}

            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
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
                          <span>{'Fecha de alta:'}</span>
                          <span className={classes_.customText}>{formatIsoDateAndHour(alta)}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Comercializadora:'}</span>
                          <span className={classes_.customText}> {(comercializadora && comercializadora  !== '') ? comercializadora : (comercializadora == '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Peaje:'}</span>
                          <span className={classes_.customText}>{(peaje&& peaje!== '') ? peaje: (peaje== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Grupo de peaje:'}</span>
                          <span className={classes_.customText}>{(grupoPeaje && grupoPeaje!== '') ? grupoPeaje: (grupoPeaje== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Grid container direction='column'>
                          {
                            (potencias.length !== 0) ? 
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
                          potencias.map((potencia, index) => (
                          <Grid item key={index} className={classes_.textLineInfoPC} style={{fontWeight:'initial'}}>
                            <span>{`Potencia contratada Pc${index + 1}:`}</span>
                            <span className={classes_.customText}>{formatNumber(potencia.potencia)}</span>
                          </Grid>
                        ))
                      }
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Tipo de contrato ATR:'}</span>
                          <span className={classes_.customText}>{(ATR && ATR!== '') ? ATR: (ATR== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Tipo de autoconsumo:'}</span>
                          <span className={classes_.customText}>{(autoconsumo&& autoconsumo!== '') ? autoconsumo: (autoconsumo== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
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
          </Content>
        ) : (CDA_Resultado === '28') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            incidencia
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={'Hemos enviado una comunicación de incidencia a tu comercializadora y el plazo de resolución es de 30 días naturales.'}
            extraInfo={' Para más información, por favor, contacta con ellos.'}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
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
                          <span>{'Fecha de alta:'}</span>
                          <span className={classes_.customText}>{formatIsoDateAndHour(alta)}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Comercializadora:'}</span>
                          <span className={classes_.customText}> {(comercializadora && comercializadora  !== '') ? comercializadora : (comercializadora == '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Peaje:'}</span>
                          <span className={classes_.customText}>{(peaje&& peaje!== '') ? peaje: (peaje== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Grupo de peaje:'}</span>
                          <span className={classes_.customText}>{(grupoPeaje && grupoPeaje!== '') ? grupoPeaje: (grupoPeaje== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Grid container direction='column'>
                        {
                          (potencias.length !== 0) ? 
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
                          potencias.map((potencia, index) => (
                          <Grid item key={index} className={classes_.textLineInfoPC} style={{fontWeight:'initial'}}>
                            <span>{`Potencia contratada Pc${index + 1}:`}</span>
                            <span className={classes_.customText}>{formatNumber(potencia.potencia)}</span>
                          </Grid>
                        ))
                      }
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Tipo de contrato ATR:'}</span>
                          <span className={classes_.customText}>{(ATR && ATR!== '') ? ATR: (ATR== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Tipo de autoconsumo:'}</span>
                          <span className={classes_.customText}>{(autoconsumo&& autoconsumo!== '') ? autoconsumo: (autoconsumo== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
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
          </Content>
        ) : (CDA_Resultado === '23' || CDA_Resultado === '29' || CDA_Resultado === '45' || CDA_Resultado === '24') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            rechazada
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={'Hemos tenido que rechazar la solicitud de alta que nos ha trasladado tu comercializadora.'}
            extraInfo={' Para más información, por favor, contacta con ellos.'}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
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
                          <span>{'Fecha de alta:'}</span>
                          <span className={classes_.customText}>{formatIsoDateAndHour(alta)}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Comercializadora:'}</span>
                          <span className={classes_.customText}> {(comercializadora && comercializadora  !== '') ? comercializadora : (comercializadora == '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Peaje:'}</span>
                          <span className={classes_.customText}>{(peaje&& peaje!== '') ? peaje: (peaje== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Grupo de peaje:'}</span>
                          <span className={classes_.customText}>{(grupoPeaje && grupoPeaje!== '') ? grupoPeaje: (grupoPeaje== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Grid container direction='column'>
                          {
                            (potencias.length !== 0) ? 
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
                          potencias.map((potencia, index) => (
                          <Grid item key={index} className={classes_.textLineInfoPC} style={{fontWeight:'initial'}}>
                            <span>{`Potencia contratada Pc${index + 1}:`}</span>
                            <span className={classes_.customText}>{formatNumber(potencia.potencia)}</span>
                          </Grid>
                        ))
                      }
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Tipo de contrato ATR:'}</span>
                          <span className={classes_.customText}>{(ATR && ATR!== '') ? ATR: (ATR== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Tipo de autoconsumo:'}</span>
                          <span className={classes_.customText}>{(autoconsumo&& autoconsumo!== '') ? autoconsumo: (autoconsumo== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
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
          </Content>
        ) : (CDA_Resultado === '26') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            anulada
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={'Hemos anulado la solicitud de alta del suministro por petición de tu comercializadora.'}
            extraInfo={' Para más información, por favor, contacta con ellos.'}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
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
                          <span>{'Fecha de alta:'}</span>
                          <span className={classes_.customText}>{formatIsoDateAndHour(alta)}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Comercializadora:'}</span>
                          <span className={classes_.customText}> {(comercializadora && comercializadora  !== '') ? comercializadora : (comercializadora == '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Peaje:'}</span>
                          <span className={classes_.customText}>{(peaje&& peaje!== '') ? peaje: (peaje== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Grupo de peaje:'}</span>
                          <span className={classes_.customText}>{(grupoPeaje && grupoPeaje!== '') ? grupoPeaje: (grupoPeaje== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Grid container direction='column'>
                          {
                            (potencias.length !== 0) ? 
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
                          potencias.map((potencia, index) => (
                          <Grid item key={index} className={classes_.textLineInfoPC} style={{fontWeight:'initial'}}>
                            <span>{`Potencia contratada Pc${index + 1}:`}</span>
                            <span className={classes_.customText}>{formatNumber(potencia.potencia)}</span>
                          </Grid>
                        ))
                      }
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Tipo de contrato ATR:'}</span>
                          <span className={classes_.customText}>{(ATR && ATR!== '') ? ATR: (ATR== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Tipo de autoconsumo:'}</span>
                          <span className={classes_.customText}>{(autoconsumo&& autoconsumo!== '') ? autoconsumo: (autoconsumo== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
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
          </Content>
        ) : (CDA_Resultado === '30' || CDA_Resultado === '32') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            finalizada
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={'Te informamos de que tu solicitud de alta del suministro se ha realizado con éxito.'}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
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
                          <span>{'Fecha de alta:'}</span>
                          <span className={classes_.customText}>{formatIsoDateAndHour(alta)}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Comercializadora:'}</span>
                          <span className={classes_.customText}> {(comercializadora && comercializadora  !== '') ? comercializadora : (comercializadora == '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Peaje:'}</span>
                          <span className={classes_.customText}>{(peaje&& peaje!== '') ? peaje: (peaje== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Grupo de peaje:'}</span>
                          <span className={classes_.customText}>{(grupoPeaje && grupoPeaje!== '') ? grupoPeaje: (grupoPeaje== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Grid container direction='column'>
                          {
                            (potencias.length !== 0) ? 
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
                          potencias.map((potencia, index) => (
                          <Grid item key={index} className={classes_.textLineInfoPC} style={{fontWeight:'initial'}}>
                            <span>{`Potencia contratada Pc${index + 1}:`}</span>
                            <span className={classes_.customText}>{formatNumber(potencia.potencia)}</span>
                          </Grid>
                        ))
                      }
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Tipo de contrato ATR:'}</span>
                          <span className={classes_.customText}>{(ATR && ATR!== '') ? ATR: (ATR== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                        <Grid item className={classes_.textLineInfo}>
                          <span>{'Tipo de autoconsumo:'}</span>
                          <span className={classes_.customText}>{(autoconsumo&& autoconsumo!== '') ? autoconsumo: (autoconsumo== '' ? 'No disponible' : 'No aplica')}</span>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            </Grid>
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
          </Content>
        ) : null
      ) : selected.cdaProceso === 'B1' ? (
        CDA_Resultado === '21' ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            recibida
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={'Hemos recibido de tu comercializadora la solicitud de baja de tu suministro.'}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <BajaDetail
              baja=''
              comercializadora={comercializadora}
              handleCloseDialog={handleCloseDialog}
            />
          </Content>
        ) : (CDA_Resultado === '22' || CDA_Resultado === '40' || CDA_Resultado === '44') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            enCurso
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={'Estamos revisando la información que nos ha proporcionado tu comercializadora.'}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <BajaDetail
              baja=''
              comercializadora={comercializadora}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '27') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            enCurso
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={'Hemos rechazado la petición de anulación que nos ha trasladado tu comercializadora y la solicitud sigue en curso.'}
            extraInfo={' Para más información, por favor, contacta con ellos.'}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <BajaDetail
              baja=''
              comercializadora={comercializadora}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '25') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            enCurso
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={'Tu comercializadora nos ha enviado una solicitud de anulación de la baja del suministro.'}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <BajaDetail
              baja=''
              comercializadora={comercializadora}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '46') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            enCurso
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={'Hemos recibido de tu comercializadora la confirmación de la resolución de la incidencia. Nuestro equipo está trabajando para continuar con tu solicitud'}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <BajaDetail
              baja=''
              comercializadora={comercializadora}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '28') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            incidencia
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={'Hemos enviado una comunicación de incidencia a tu comercializadora y el plazo de resolución es de 30 días naturales.'}
            extraInfo={' Para más información, por favor, contacta con ellos.'}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <BajaDetail
              baja=''
              comercializadora={comercializadora}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '23' || CDA_Resultado === '29' || CDA_Resultado === '45' || CDA_Resultado === '24') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            rechazada
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={'Hemos tenido que rechazar la solicitud que nos ha trasladado tu comercializadora.'}
            extraInfo={' Para más información, por favor, contacta con ellos.'}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <BajaDetail
              baja=''
              comercializadora={comercializadora}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '30' || CDA_Resultado === '32') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            finalizada
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={<span dangerouslySetInnerHTML={{ __html: 'Te informamos de que tu solicitud de <strong>baja del suministro</strong> se ha realizado con éxito.' }} />}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <BajaDetail
              baja=''
              comercializadora={comercializadora}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '26') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            anulada
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={'Hemos anulado la solicitud de baja de tu suministro por petición de tu comercializadora.'}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <BajaDetail
              baja=''
              comercializadora={comercializadora}
              handleCloseDialog={handleCloseDialog}
            />
          </Content>
        ) : null
      ) : selected.cdaProceso === 'C1' ? (
        CDA_Resultado === '21' ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            recibida
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={(<>{'Hemos recibido una solicitud de cambio de la comercializadora '}<b>{oldComer ? oldComer : ''}</b> {' a la comercializadora '} <b>{newComer ? newComer : ''}</b></>)}
            extraInfo={(<>{'En caso de no haber solicitado dicha gestión, por favor, contacta con tu nueva comercializadora '} <b>{newComer ? newComer : ''}</b></>)}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <CambioSinModificacionesDetail
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '22' || CDA_Resultado === '40' || CDA_Resultado === '44' || CDA_Resultado === '46') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            enCurso
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={(<> {'Estamos revisando la información que nos ha proporcionado tu nueva comercializadora '}<b>{newComer}</b>{'.'}</>)}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <CambioSinModificacionesDetail
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '25') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            enCurso
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={(<> {'Tu nueva comercializadora '}<b>{newComer}</b>{' nos ha enviado una petición de anulación del cambio de comercializadora.'}</>)}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <CambioSinModificacionesDetail
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '27') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            enCurso
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={(<> {'No hemos podido anular el cambio de comercializadora, por lo que la petición de cambio sigue en curso.'}</>)}
            extraInfo={(<>{' Para más información, por favor, contacta con tu nueva comercializadora '} <b>{newComer ? newComer : ''}</b>{'.'}</>)}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <CambioSinModificacionesDetail
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '28') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            incidencia
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={(<>{'Hemos recibido una solicitud de cambio de la comercializadora '}<b>{oldComer ? oldComer : ''}</b> {' a la comercializadora '} <b>{newComer ? newComer : ''}</b></>)}
            extraInfo={(<>{'En caso de no haber solicitado dicha gestión, por favor, contacta con tu nueva comercializadora '} <b>{newComer ? newComer : ''}</b></>)}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <CambioSinModificacionesDetail
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '23' || CDA_Resultado === '29' || CDA_Resultado === '45' || CDA_Resultado === '24') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            rechazada
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={`Hemos tenido que rechazar la solicitud que nos ha trasladado tu comercializadora.`}
            extraInfo={` Para más información, por favor, contacta con ellos.`}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <CambioSinModificacionesDetail
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '30' || CDA_Resultado === '32') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            finalizada
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={<>{`Te informamos de que tu solicitud de `} <b>cambio de comercializadora</b> {` se ha realizado con éxito. `}</>}
            extraInfo={<>{'En caso de no haber solicitado dicha gestión, por favor, contacta con tu nueva comercializadora '}<b>{newComer ? newComer : ''}</b>{'.'}</>}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <CambioSinModificacionesDetail
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '26') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            anulada
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={(<>
              {'Hemos anulado la solicitud de cambio de comercializadora por petición de '} <b>{newComer}</b>{'.'}
            </>)}
            extraInfo={` Para más información, por favor, contacta con ellos.`}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <CambioSinModificacionesDetail
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />
          </Content>
        ) : null
      ) : selected.cdaProceso === 'C2' ? (
        CDA_Resultado === '21' ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            recibida
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={<>{'Hemos recibido una solicitud de cambio de la comercializadora '}<b>{oldComer ? oldComer : ''}</b>{' a la comercializadora '}<b>{newComer ? newComer : ''}</b>{', que implica una modificación de tu contrato.'}</>}
            extraInfo={<>{'En caso de no haber solicitado dicha gestión, por favor, contacta con tu nueva comercializadora '}<b>{newComer ? newComer : ''}</b>{'.'}</>}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <CambioConModificacionesDetail
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '22' || CDA_Resultado === '40' || CDA_Resultado === '44') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            enCurso
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={<>{'Estamos revisando la información que nos ha proporcionado tu nueva comercializadora '}<b>{newComer ? newComer : ''}</b>{'.'}</>}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <CambioConModificacionesDetail
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '25') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            enCurso
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={<>{'Tu nueva comercializadora '}<b>{newComer ? newComer : ''}</b>{'. nos ha enviado una petición de anulación del cambio de comercializadora.'}</>}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <CambioConModificacionesDetail
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '27') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            enCurso
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={<>{'No hemos podido anular el cambio de comercializadora, por lo que la petición de cambio sigue en curso.'}</>}
            extraInfo={<>{' Para más información, por favor, contacta con tu nueva comercializadora '}<b>{newComer ? newComer : ''}</b>{'.'}</>}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <CambioConModificacionesDetail
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '46') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            enCurso
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={<>{'Hemos recibido de tu comercializadora la confirmación de la resolución de la incidencia.'}</>}
            extraInfo={<>{'Nuestro equipo está trabajando para continuar con tu solicitud.'}</>}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <CambioConModificacionesDetail
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '28') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            incidencia
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={`Hemos enviado una comunicación de incidencia a tu comercializadora y el plazo de resolución es de 30 días naturales.`}
            extraInfo={<>{' Para más información, por favor, contacta con ellos.'}</>}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <CambioConModificacionesDetail
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '23' || CDA_Resultado === '29' || CDA_Resultado === '45' || CDA_Resultado === '24') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            rechazada
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={`Hemos tenido que rechazar la solicitud que nos ha trasladado tu comercializadora.`}
            extraInfo={' Para más información, por favor, contacta con ellos.'}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <CambioConModificacionesDetail
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '30' || CDA_Resultado === '32') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            finalizada
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={<span dangerouslySetInnerHTML={{ __html: 'Te informamos de que tu solicitud de <strong>cambio de comercializadora</strong> se ha realizado con éxito.' }} />}
            extraInfo={<>{'En caso de no haber solicitado dicha gestión, por favor, contacta con tu nueva comercializadora '}<b>{newComer ? newComer : ''}</b>{'.'}</>}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <CambioConModificacionesDetail
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '26') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            anulada
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={<>{'Hemos anulado la solicitud de cambio de comercializadora por petición de '}<b>{newComer ? newComer : ''}</b>{'.'}</>}
            extraInfo={' Para más información, por favor, contacta con ellos.'}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <CambioConModificacionesDetail
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />
          </Content>
        ) : null
      ) : selected.cdaProceso === 'E1' ? (
        CDA_Resultado === '21' ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            recibida
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={<>
              {`Tu comercializadora ${newComer} nos ha enviado una petición de `}
              <MuiThemeProvider theme={theme}>
                <ArrowTooltip title={'Desistimiento consiste en que a petición tuya renuncias y pides volver al contrato anterior. Se retorna a la situación anterior, como si no se hubiera hecho el cambio.'} placement='bottom'>
                  <span style={{ textDecoration: 'underline', textDecorationStyle: 'dotted', textDecorationColor: '#004571' }}>desistimiento</span>
                </ArrowTooltip>
              </MuiThemeProvider>
              {` de una solicitud.`}
            </>}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <DesentimientoDetail
              showDataComplete={false}
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '22' || CDA_Resultado === '40' || CDA_Resultado === '44' || CDA_Resultado === '46') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            enCurso
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={<>{'Estamos revisando la información que nos ha proporcionado tu comercializadora '}<b>{newComer ? newComer : ''}</b>{'.'}</>}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <DesentimientoDetail
              showDataComplete={true}
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '25') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            enCurso
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={<>{'Tu comercializadora nos ha enviado una solicitud de anulación del desistimiento.'}</>}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <DesentimientoDetail
              showDataComplete={true}
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '27') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            enCurso
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={<>{'Hemos rechazado la petición de anulación que nos ha trasladado tu comercializadora y la solicitud sigue en curso.'}</>}
            extraInfo={' Para más información, por favor, contacta con ellos.'}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <DesentimientoDetail
              showDataComplete={true}
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '28') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            incidencia
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={<>{'Hemos enviado una comunicación de incidencia a tu comercializadora '}<b>{newComer ? newComer : ''}</b>{' y el plazo de resolución es de 30 días naturales.'}</>}
            extraInfo={' Para más información, por favor, contacta con ellos.'}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <DesentimientoDetail
              showDataComplete={true}
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '23' || CDA_Resultado === '29' || CDA_Resultado === '45' || CDA_Resultado === '24') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            rechazada
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={<>{'Hemos tenido que rechazar la petición de desistimiento que nos ha trasladado tu comercializadora '}<b>{newComer ? newComer : ''}</b>{'.'}</>}
            extraInfo={' Para más información, por favor, contacta con ellos.'}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <DesentimientoDetail
              showDataComplete={true}
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '30' || CDA_Resultado === '32') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            finalizada
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={<>{'Te informamos de que la petición de desistimiento se ha realizado con éxito. En caso de no haber solicitado dicha gestión, por favor, contacta con tu comercializadora '}<b>{newComer ? newComer : ''}</b>{'.'}</>}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <DesentimientoDetail
              showDataComplete={true}
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '26') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            anulada
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={<>{'Hemos anulado la solicitud de desistimiento por petición de tu comercializadora '}<b>{newComer ? newComer : ''}</b>{'.'}</>}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <DesentimientoDetail
              showDataComplete={true}
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />
          </Content>
        ) : null
      ) : selected.cdaProceso === 'M1' ? (
        CDA_Resultado === '21' ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            recibida
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={`Hemos recibido de tu comercializadora una solicitud de modificación del contrato de tu suministro.`}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <ModificacionContratoAcceso
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
              fechaSolicitud={fechaSolicitud}
            />

          </Content>
        ) : (CDA_Resultado === '22' || CDA_Resultado === '40' || CDA_Resultado === '44') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            enCurso
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={`Estamos revisando la información que nos ha proporcionado tu comercializadora.`}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <ModificacionContratoAcceso
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
              fechaSolicitud={fechaSolicitud}
            />

          </Content>
        ) : (CDA_Resultado === '25') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            enCurso
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={`Tu comercializadora nos ha enviado una solicitud de anulación de la modificación del contrato de suministro.`}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <ModificacionContratoAcceso
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
              fechaSolicitud={fechaSolicitud}
            />

          </Content>
        ) : (CDA_Resultado === '27') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            enCurso
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={`No hemos podido anular la petición de cambio del contrato de suministro y la solicitud sigue en curso.`}
            extraInfo={' Para más información, por favor, contacta con ellos.'}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <ModificacionContratoAcceso
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
              fechaSolicitud={fechaSolicitud}
            />

          </Content>
        ) : (CDA_Resultado === '46') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            enCurso
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={`Hemos recibido de tu comercializadora la confirmación de la resolución de la incidencia. Nuestro equipo está trabajando para continuar con tu solicitud.`}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <ModificacionContratoAcceso
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
              fechaSolicitud={fechaSolicitud}
            />

          </Content>
        ) : (CDA_Resultado === '28') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            incidencia
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={`Hemos enviado una comunicación de incidencia a tu comercializadora y el plazo de resolución es de 30 días naturales.`}
            extraInfo={` Para más información, por favor, contacta con ellos.`}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <ModificacionContratoAcceso
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
              fechaSolicitud={fechaSolicitud}
            />

          </Content>
        ) : (CDA_Resultado === '23' || CDA_Resultado === '29' || CDA_Resultado === '45' || CDA_Resultado === '24') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            rechazada
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={`Hemos tenido que rechazar la solicitud que nos ha trasladado tu comercializadora.`}
            extraInfo={` Para más información, por favor, contacta con ellos.`}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <ModificacionContratoAcceso
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
              fechaSolicitud={fechaSolicitud}
            />

          </Content>
        ) : (CDA_Resultado === '30' || CDA_Resultado === '32') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            finalizada
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={`Te informamos de que tu solicitud de modificación del contrato de suministro se ha realizado con éxito.`}
            extraInfo={`En caso de no haber solicitado dicha gestión, por favor, contacta con tu comercializadora.`}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <ModificacionContratoAcceso
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
              fechaSolicitud={fechaSolicitud}
            />

          </Content>
        ) : (CDA_Resultado === '26') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            anulada
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={<>
              {`Hemos anulado la solicitud de desistimiento por petición de tu comercializadora `} <b>{newComer}</b>{'.'}
            </>}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <ModificacionContratoAcceso
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
              fechaSolicitud={fechaSolicitud}
            />
          </Content>
        ) : null
      ) : selected.cdaProceso === 'T1' ? (
        CDA_Resultado === '21' ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            recibida
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={<>{'Hemos solicitado el traspaso de tu suministro a la Comercializadora de Último Recurso '}<b>{newComer ? newComer : ''}</b>{' A partir de ahora, ellos se encargarán de facturarte el consumo y prestarte el servicio de atención al cliente.'}</>}
            extraInfo={' Para más información, por favor, contacta con ellos.'}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <TraspasoPunto
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '22' || CDA_Resultado === '25' || CDA_Resultado === '27' || CDA_Resultado === '40' || CDA_Resultado === '46') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            enCurso
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={<>{'La Comercializadora de Último Recurso '}<b>{newComer ? newComer : ''}</b>{' está revisando la solicitud de traspaso.'}</>}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <TraspasoPunto
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '44') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            enCurso
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={<>{'Hemos solicitado el traspaso de tu suministro a la Comercializadora de Último Recurso '}<b>{newComer ? newComer : ''}</b>{'. A partir de ahora, ellos se encargarán de facturarte el consumo y prestarte el servicio de atención al cliente.'}</>}
            extraInfo={' Para más información, por favor, contacta con ellos.'}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <TraspasoPunto
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '28') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            incidencia
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={``}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <TraspasoPunto
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '23' || CDA_Resultado === '29' || CDA_Resultado === '45' || CDA_Resultado === '24') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            rechazada
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={<>{'La Comercializadora de Último Recurso '}<b>{newComer ? newComer : ''}</b>{' ha rechazado la solicitud de traspaso.'}</>}
            extraInfo={' Para más información, por favor, contacta con ellos.'}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <TraspasoPunto
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '30' || CDA_Resultado === '32') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            finalizada
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={<>{'Te informamos que la solicitud de traspaso a la Comercializadora de Último Recurso '}<b>{newComer ? newComer : ''}</b>{' se ha realizado con éxito.'}</>}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <TraspasoPunto
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />

          </Content>
        ) : (CDA_Resultado === '26') ? (
          <Content
            handleCloseDialog={handleCloseDialog}
            anulada
            cups={CUPS ? CUPS : ''}
            date={chat && chat[0] && chat[0].fechaPaso && formatIsoDateAndHour(chat[0].fechaPaso)}
            subtitle={<>{'Hemos anulado la solicitud de traspaso a la Comercializadora de Último Recurso '}<b>{newComer ? newComer : ''}</b>{' se ha realizado con éxito.'}</>}
            extraInfo={' Para más información, por favor, contacta con ellos.'}
            msj={chat}
            newComer={newComer}
            oldComer={oldComer}
            fase={selected.cdaProceso}
          >
            <TraspasoPunto
              comerSaliente={oldComer}
              comerEntrante={newComer}
              peaje={peaje}
              grupoPeaje={grupoPeaje}
              potencia={potencias}
              ATR={ATR}
              autoconsumoType={autoconsumo}
              handleCloseDialog={handleCloseDialog}
            />
          </Content>
        ) : null
      ) : null}
    </Modales>
  )
}

export default DialogReiteracion