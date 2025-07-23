import React, { useState, useEffect, ReactNode } from 'react'
import { Divider, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Grid, Typography } from '@material-ui/core'

import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import { useTranslation } from 'react-i18next'
import useStyles_, { StyledTableCell } from './Content.styles'
import campanaIcono from '../../../../../assets/icons/camapana.svg'
import Input from '../../../../../common/components/input/Input'
import Button from '../../../../../common/components/button/Button'
import CloseIcon from '../../../../../assets/icons/cerrar_blanco.svg'
import OKIcon from '../../../../../assets/icons/ok_blanco.svg'
import enCursoIcon from '../../../../../assets/icons/actualizar_blanco.svg'
import { useDispatch } from 'react-redux'
import { showError } from '../../../../../common/store/actions/ErrorActions'
import InfoIcon from '../../../../../assets/icons/info.svg'
import IcoRecibida from '../../../../../assets/icons/ico_recibida.svg'
import IncidenciaIcon from '../../../../../assets/icons/Estados_incidencia.svg'
import { StyledExpandMoreIcon } from '../../../../../provisions/components/new-provision/steps/Steps.styles'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { formatIsoDateAndHour } from '../../../../../common/lib/FormatLib';

interface msjInterface {
  fechaPaso: string,
  npaso: string,
  resultado: string
}

interface ContentInterface {
  handleCloseDialog: () => void,
  recibida?: boolean,
  enCurso?: boolean,
  msj?: msjInterface[],
  incidencia?: boolean,
  rechazada?: boolean,
  anulada?: boolean,
  finalizada?: boolean,
  cups: string,
  date: string,
  subtitle?: string | ReactNode,
  extraInfo?: string | ReactNode,
  children?: ReactNode,
  fase: 'A3' | 'B1' | 'C1' | 'C2' | 'E1' | 'M1' | 'T1',
  oldComer?: string,
  newComer?: string,
}

const Content = (props: ContentInterface) => {
  const classes = useStyles_({})
  const { t } = useTranslation()
  const [inputText, setInputText] = useState('')

  const dispatch = useDispatch()

  const {
    handleCloseDialog,
    recibida,
    enCurso,
    msj,
    incidencia,
    rechazada,
    anulada,
    finalizada,
    cups,
    date,
    children,
    subtitle,
    extraInfo,
    fase,
    oldComer,
    newComer
  } = props

  const [expanded, setExpanded] = useState<boolean>(true)
  const [expandedMsj, setExpandedMsj] = useState<boolean>(true)
 

  return (
    <>
      {recibida && (
        <Grid container justifyContent='center' className={classes.generalInfo}>
           <Grid item xs={12} className={classes.cupsContainer}>
              <span className={classes.cupsLabel}>{'CUPS:'}</span>
              <span className={classes.cupsNumber}>{cups}</span>
             </Grid>
          <Grid item xs={12} className={classes.divider}>
            <Divider variant='middle' className={classes.dashedDivider} />
          </Grid>
          <Grid item  className={classes.contentRow} xs={12}>
            <Grid item xs={1} className={classes.iconFix} style={{ backgroundColor: '#E57200', borderRadius: '100%', minHeight: 30, maxHeight: 30, minWidth: 30, maxWidth: 30, display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
              <img src={IcoRecibida} alt='' width={'35px'} />
            </Grid>
            <Grid item xs={11} className={classes.generalInfoTexts}>
              <Grid item xs={12} className={classes.textLine}>
                <span>{date}</span>
              </Grid>
              <Grid item xs={12} className={classes.textLine}>
                <span className={classes.bold}>{'Solicitud recibida.'}</span>
              </Grid>
              <Grid item xs={12} className={classes.textLine}>
                <span className={classes.noBold}>{subtitle ? subtitle : 'Hemos recibido de tu comercializadora la solicitud de alta de tu suministro.'} </span>
              </Grid>
              {
                extraInfo && (
                  <Grid item xs={12} className={classes.extraInfo}>
                    <span style={{ color: '#686A6D' }}>{extraInfo}</span>
                  </Grid>
                )
              }
            </Grid>
          </Grid>
        </Grid>
      )}
      {enCurso && (
        <>
          <Grid container justifyContent='center' className={classes.enCurso}>
          <Grid item xs={12} className={classes.cupsContainer}>
              <span className={classes.cupsLabel}>{'CUPS:'}</span>
              <span className={classes.cupsNumber}>{cups}</span>
             </Grid>
            <Grid item xs={12} className={classes.divider}>
              <Divider variant='middle' className={classes.dashedDivider} />
            </Grid>
            <Grid item className={classes.contentRow} xs={12} >
              <Grid item xs={1} className={classes.iconFix} style={{ backgroundColor: '#E57200', borderRadius: '100%', minHeight: 30, maxHeight: 30, minWidth: 30, maxWidth: 30, display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                <img src={enCursoIcon} alt='' width={'20px'} height={'20px'} />
              </Grid>
              <Grid item xs={11} className={classes.generalInfoTexts}>
                <Grid item xs={12} className={classes.textLine}>
                  <span>{date}</span>
                </Grid>
                <Grid item xs={12} className={classes.textLine}>
                  <span className={classes.bold}>{'Solicitud en curso.'}</span>
                </Grid>
                <Grid item xs={12} className={classes.textLine}>
                  <span>{subtitle ? subtitle : 'Hemos recibido de tu comercializadora la solicitud de alta de tu suministro.'} </span>
                </Grid>
                {
                  extraInfo && (
                    <Grid item xs={12} className={classes.extraInfo}>
                      <span style={{ color: '#686A6D' }}>{extraInfo}</span>
                    </Grid>
                  )
                }
              </Grid>
            </Grid>
          </Grid>
          {/* Tabla en escritorio y lista en móvil */}
          <Grid container xs={12} style={{ marginTop: '25px' }}>
            <ExpansionPanel defaultExpanded expanded={expandedMsj} className={classes.root}>
              <ExpansionPanelSummary
                expandIcon={<StyledExpandMoreIcon />}
                className={classes.summary}
                onClick={() => setExpandedMsj(!expandedMsj)}
              >
                <Typography className={classes.expansionPanelSummaryText}>{t('Historial de mensajes')}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.detailsTable}>
                {/* Tabla visible solo en escritorio */}
                <div className={classes.tableContainer}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell style={{ whiteSpace: 'nowrap' }}>{t('Fecha')}</StyledTableCell>
                        <StyledTableCell>{t('Detalle')}</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {msj?.map((item, index) => (
                        <TableRow key={index}>
                          <StyledTableCell style={{ whiteSpace: 'nowrap' }}>{formatIsoDateAndHour(item?.fechaPaso)}</StyledTableCell>
                          <StyledTableCell>
                            {t(`detalle.${props.fase}.${item?.resultado.split('-')[0]}`, {
                              oldComer: oldComer || '',
                              newComer: newComer || '',
                            })}
                          </StyledTableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

           
               {/* Lista visible solo en móvil */}
                <div className={classes.listContainer}>
                  {msj?.map((item, index) => (
                    <div key={index} className={classes.listItem}>
                      {/* Fecha */}
                      <div className={classes.messageDate}>
                        {formatIsoDateAndHour(item?.fechaPaso)}
                      </div>
                      {/* Detalle */}
                      <div className={classes.messageDetail}>
                        {t(`detalle.${props.fase}.${item?.resultado.split('-')[0]}`, {
                          oldComer: oldComer || '',
                          newComer: newComer || '',
                        })}
                      </div>
                    </div>
                  ))}
                </div>


              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
        </>
      )}
      {incidencia && (
        <>
          <Grid container justifyContent='center' className={classes.enCurso}>
          <Grid item xs={12} className={classes.cupsContainer}>
              <span className={classes.cupsLabel}>{'CUPS:'}</span>
              <span className={classes.cupsNumber}>{cups}</span>
             </Grid>
            <Grid item xs={12} className={classes.divider}>
              <Divider variant='middle' className={classes.dashedDivider} />
            </Grid>
            <Grid item className={classes.contentRow} xs={12}>
            <Grid item xs={1} className={classes.iconFix} style={{ backgroundColor: '#E57200', borderRadius: '100%', minHeight: 30, maxHeight: 30, minWidth: 30, maxWidth: 30, display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                <img src={IncidenciaIcon} alt='' width={38} height={38} />
              </Grid>
              <Grid item xs={11} className={classes.generalInfoTexts}>
                <Grid item xs={12} className={classes.textLine}>
                  <span>{date}</span>
                </Grid>
                <Grid item xs={12} className={classes.textLine}>
                  <span className={classes.bold}>{'Incidencia.'}</span>
                </Grid>
                <Grid item xs={12} className={classes.textLine}>
                  <span className={classes.noBold}>{subtitle ? subtitle : 'Hemos enviado una comunicación de incidencia a tu comercializadora y el plazo de resolución es de 30 días naturales.'}</span>
                </Grid>
                {
                  extraInfo && (
                    <Grid item xs={12} className={classes.extraInfo}>
                      <span style={{ color: '#686A6D' }}>{extraInfo}</span>
                    </Grid>
                  )
                }
              </Grid>
            </Grid>
          </Grid>
          {/* Tabla en escritorio y lista en móvil */}
          <Grid container xs={12} style={{ marginTop: '25px' }}>
            <ExpansionPanel defaultExpanded expanded={expandedMsj} className={classes.root}>
              <ExpansionPanelSummary
                expandIcon={<StyledExpandMoreIcon />}
                className={classes.summary}
                onClick={() => setExpandedMsj(!expandedMsj)}
              >
                <Typography className={classes.expansionPanelSummaryText}>{t('Historial de mensajes')}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.detailsTable}>
                {/* Tabla visible solo en escritorio */}
                <div className={classes.tableContainer}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell style={{ whiteSpace: 'nowrap' }}>{t('Fecha')}</StyledTableCell>
                        <StyledTableCell>{t('Detalle')}</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {msj?.map((item, index) => (
                        <TableRow key={index}>
                          <StyledTableCell style={{ whiteSpace: 'nowrap' }}>{formatIsoDateAndHour(item?.fechaPaso)}</StyledTableCell>
                          <StyledTableCell>
                            {t(`detalle.${props.fase}.${item?.resultado.split('-')[0]}`, {
                              oldComer: oldComer || '',
                              newComer: newComer || '',
                            })}
                          </StyledTableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

           
               {/* Lista visible solo en móvil */}
                <div className={classes.listContainer}>
                  {msj?.map((item, index) => (
                    <div key={index} className={classes.listItem}>
                      {/* Fecha */}
                      <div className={classes.messageDate}>
                        {formatIsoDateAndHour(item?.fechaPaso)}
                      </div>
                      {/* Detalle */}
                      <div className={classes.messageDetail}>
                        {t(`detalle.${props.fase}.${item?.resultado.split('-')[0]}`, {
                          oldComer: oldComer || '',
                          newComer: newComer || '',
                        })}
                      </div>
                    </div>
                  ))}
                </div>


              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
        </>
      )}
      {rechazada && (
        <>
          <Grid container justifyContent='center' className={classes.rechazada}>
          <Grid item xs={12} className={classes.cupsContainer}>
              <span className={classes.cupsLabel}>{'CUPS:'}</span>
              <span className={classes.cupsNumber}>{cups}</span>
             </Grid>
            <Grid item xs={12} className={classes.divider}>
              <Divider variant='middle' className={classes.dashedDivider} />
            </Grid>
            <Grid item className={classes.contentRow}xs={12}>
              <Grid item xs={1} className={classes.icon} style={{ backgroundColor: '#d3222a', borderRadius: '100%', minHeight: 30, maxHeight: 30, minWidth: 30, maxWidth: 30, display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                <img src={CloseIcon} alt='' width={'20px'} height={'20px'} />
              </Grid>
              <Grid item xs={11} className={classes.generalInfoTexts}>
                <Grid item xs={12} className={classes.textLine}>
                  <span>{date}</span>
                </Grid>
                <Grid item xs={12} className={classes.textLine}>
                  <span className={classes.bold}>{'Solicitud rechazada.'}</span>
                </Grid>
                <Grid item xs={12} className={classes.textLine}>
                  <span className={classes.noBold}>{subtitle ? subtitle : 'Hemos tenido que rechazar la solicitud de alta que nos ha trasladado tu comercializadora.'}</span>
                </Grid>
                {
                  extraInfo && (
                    <Grid item xs={12} className={classes.extraInfo}>
                      <span style={{ color: '#686A6D' }}>{extraInfo}</span>
                    </Grid>
                  )
                }
              </Grid>
            </Grid>
          </Grid>
          {/* Tabla en escritorio y lista en móvil */}
          <Grid container xs={12} style={{ marginTop: '25px' }}>
            <ExpansionPanel defaultExpanded expanded={expandedMsj} className={classes.root}>
              <ExpansionPanelSummary
                expandIcon={<StyledExpandMoreIcon />}
                className={classes.summary}
                onClick={() => setExpandedMsj(!expandedMsj)}
              >
                <Typography className={classes.expansionPanelSummaryText}>{t('Historial de mensajes')}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.detailsTable}>
                {/* Tabla visible solo en escritorio */}
                <div className={classes.tableContainer}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell style={{ whiteSpace: 'nowrap' }}>{t('Fecha')}</StyledTableCell>
                        <StyledTableCell>{t('Detalle')}</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {msj?.map((item, index) => (
                        <TableRow key={index}>
                          <StyledTableCell>{formatIsoDateAndHour(item?.fechaPaso)}</StyledTableCell>
                          <StyledTableCell>
                            {t(`detalle.${props.fase}.${item?.resultado.split('-')[0]}`, {
                              oldComer: oldComer || '',
                              newComer: newComer || '',
                            })}
                          </StyledTableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

           
               {/* Lista visible solo en móvil */}
                <div className={classes.listContainer}>
                  {msj?.map((item, index) => (
                    <div key={index} className={classes.listItem}>
                      {/* Fecha */}
                      <div className={classes.messageDate}>
                        {formatIsoDateAndHour(item?.fechaPaso)}
                      </div>
                      {/* Detalle */}
                      <div className={classes.messageDetail}>
                        {t(`detalle.${props.fase}.${item?.resultado.split('-')[0]}`, {
                          oldComer: oldComer || '',
                          newComer: newComer || '',
                        })}
                      </div>
                    </div>
                  ))}
                </div>


              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
        </>
      )}
      {anulada && (
        <>
          <Grid container justifyContent='center' className={classes.anulada}>
             <Grid item xs={12} className={classes.cupsContainer}>
              <span className={classes.cupsLabel}>{'CUPS:'}</span>
              <span className={classes.cupsNumber}>{cups}</span>
             </Grid>
            <Grid item xs={12} className={classes.divider}>
              <Divider variant='middle' className={classes.dashedDivider} />
            </Grid>
            <Grid item className={classes.contentRow} xs={12}>
              <Grid item xs={1} className={classes.icon} style={{ backgroundColor: '#BDBDBD', borderRadius: '100%', minHeight: 30, maxHeight: 30, minWidth: 30, maxWidth: 30, display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                <img src={CloseIcon} alt='' width={'20px'} height={'20px'} />
              </Grid>
              <Grid item xs={11} className={classes.generalInfoTexts}>
                <Grid item xs={12} className={classes.textLine}>
                  <span>{date}</span>
                </Grid>
                <Grid item xs={12} className={classes.textLine}>
                  <span className={classes.bold}>{'Solicitud anulada'}</span>
                </Grid>
                <Grid item xs={12} className={classes.textLine}>
                  <span className={classes.noBold}>{subtitle ? subtitle : 'Hemos anulado la solicitud de alta del suministro por petición de tu comercializadora.'}</span>
                </Grid>
                {
                  extraInfo && (
                    <Grid item xs={12} className={classes.extraInfo}>
                      <span style={{ color: '#686A6D' }}>{extraInfo}</span>
                    </Grid>
                  )
                }
              </Grid>
            </Grid>
          </Grid>
          {/* Tabla en escritorio y lista en móvil */}
          <Grid container xs={12} style={{ marginTop: '25px' }}>
            <ExpansionPanel defaultExpanded expanded={expandedMsj} className={classes.root}>
              <ExpansionPanelSummary
                expandIcon={<StyledExpandMoreIcon />}
                className={classes.summary}
                onClick={() => setExpandedMsj(!expandedMsj)}
              >
                <Typography className={classes.expansionPanelSummaryText}>{t('Historial de mensajes')}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.detailsTable}>
                {/* Tabla visible solo en escritorio */}
                <div className={classes.tableContainer}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell style={{ whiteSpace: 'nowrap' }}>{t('Fecha')}</StyledTableCell>
                        <StyledTableCell>{t('Detalle')}</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {msj?.map((item, index) => (
                        <TableRow key={index}>
                          <StyledTableCell style={{ whiteSpace: 'nowrap' }}>{formatIsoDateAndHour(item?.fechaPaso)}</StyledTableCell>
                          <StyledTableCell>
                            {t(`detalle.${props.fase}.${item?.resultado.split('-')[0]}`, {
                              oldComer: oldComer || '',
                              newComer: newComer || '',
                            })}
                          </StyledTableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

           
               {/* Lista visible solo en móvil */}
                <div className={classes.listContainer}>
                  {msj?.map((item, index) => (
                    <div key={index} className={classes.listItem}>
                      {/* Fecha */}
                      <div className={classes.messageDate}>
                        {formatIsoDateAndHour(item?.fechaPaso)}
                      </div>
                      {/* Detalle */}
                      <div className={classes.messageDetail}>
                        {t(`detalle.${props.fase}.${item?.resultado.split('-')[0]}`, {
                          oldComer: oldComer || '',
                          newComer: newComer || '',
                        })}
                      </div>
                    </div>
                  ))}
                </div>


              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
        </>
      )}
      {finalizada && (
        <>
          <Grid container justifyContent='center' className={classes.finalizada}>
             <Grid item xs={12} className={classes.cupsContainer}>
              <span className={classes.cupsLabel}>{'CUPS:'}</span>
              <span className={classes.cupsNumber}>{cups}</span>
             </Grid>
            <Grid item xs={12} className={classes.divider}>
              <Divider variant='middle' className={classes.dashedDivider} />
            </Grid>
            <Grid item className={classes.contentRow} xs={12}>
              <Grid item xs={1} className={classes.iconFix} style={{ backgroundColor: '#A2AD00', borderRadius: '100%', minHeight: 30, maxHeight: 30, minWidth: 30, maxWidth: 30, display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>           
                <img src={OKIcon} alt='' width={'20px'} height={'20px'}  />
              </Grid>
              <Grid item xs={11} className={classes.generalInfoTexts}>
                <Grid item xs={12} className={classes.textLine}>
                  <span>{date}</span>
                </Grid>
                <Grid item xs={12} className={classes.textLine}>
                  <span className={classes.bold}>{'Solicitud finalizada.'}</span>
                </Grid>
                <Grid item xs={12} className={classes.textLine}>
                  <span className={classes.noBold}>
                    {subtitle ? subtitle : (
                      <>
                        {'Te informamos de que tu solicitud de '} <b>{'Alta de suministro'}</b> {'se ha realizado con éxito.'}
                      </>
                    )}
                  </span>
                </Grid>
                {
                  extraInfo && (
                    <Grid item xs={12} className={classes.extraInfo}>
                      <span style={{ color: '#686A6D' }}>{extraInfo}</span>
                    </Grid>
                  )
                }
              </Grid>
            </Grid>
          </Grid>
          {/* Tabla en escritorio y lista en móvil */}
          <Grid container xs={12} style={{ marginTop: '25px' }}>
            <ExpansionPanel defaultExpanded expanded={expandedMsj} className={classes.root}>
              <ExpansionPanelSummary
                expandIcon={<StyledExpandMoreIcon />}
                className={classes.summary}
                onClick={() => setExpandedMsj(!expandedMsj)}
              >
                <Typography className={classes.expansionPanelSummaryText}>{t('Historial de mensajes')}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.detailsTable}>
                {/* Tabla visible solo en escritorio */}
                <div className={classes.tableContainer}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell style={{ whiteSpace: 'nowrap' }}>{t('Fecha')}</StyledTableCell>
                        <StyledTableCell>{t('Detalle')}</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {msj?.map((item, index) => (
                        <TableRow key={index}>
                          <StyledTableCell style={{ whiteSpace: 'nowrap' }}>{formatIsoDateAndHour(item?.fechaPaso)}</StyledTableCell>
                          <StyledTableCell>
                            {t(`detalle.${props.fase}.${item?.resultado.split('-')[0]}`, {
                              oldComer: oldComer || '',
                              newComer: newComer || '',
                            })}
                          </StyledTableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

           
               {/* Lista visible solo en móvil */}
                <div className={classes.listContainer}>
                  {msj?.map((item, index) => (
                    <div key={index} className={classes.listItem}>
                      {/* Fecha */}
                      <div className={classes.messageDate}>
                        {formatIsoDateAndHour(item?.fechaPaso)}
                      </div>
                      {/* Detalle */}
                      <div className={classes.messageDetail}>
                        {t(`detalle.${props.fase}.${item?.resultado.split('-')[0]}`, {
                          oldComer: oldComer || '',
                          newComer: newComer || '',
                        })}
                      </div>
                    </div>
                  ))}
                </div>


              </ExpansionPanelDetails>
            </ExpansionPanel>
          </Grid>
        </>
      )}
      {
        children
      }
    </>
  )
}

export default Content
