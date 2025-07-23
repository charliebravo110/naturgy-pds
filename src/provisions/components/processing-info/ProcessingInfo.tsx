import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'
import { formatDate } from '../../../common/lib/FormatLib'

import ProcessedIcon from '../../../assets/icons/ico_ok.svg'
import InProgress from '../../../assets/icons/ico_en_proceso.svg'

import useStyles from './ProcessingInfo.styles'
import { thunkGetMasterData } from '../../store/actions/ProvisionsThunkActions'
import { useDispatch } from 'react-redux'

const ProcessingInfo = (props: any) => {
  const {
    currentProvision,
    actualProcedure,
    formalities,
    state
  } = props;

  const classes = useStyles({})
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [ executionExists, setExecutionExists ] = useState(false)
  const [ constructionExists, setConstructionExists ] = useState(false)
  const [ serviceExists, setServiceExists ] = useState(false)
  const [ showProcedureStatus, setShowProcedureStatus ] = useState(false)

  const statusTranslations = (status, returnIconClass) => {
    if (status === 'FINALIZADO') {
      return returnIconClass ? ProcessedIcon : t('provisions.processingInfo.formalities.processed')
    } else if (status === 'EN CURSO' || status === 'VALIDADO' || status === 'PLANIFICADO') {
      return returnIconClass ? InProgress : t('provisions.processingInfo.formalities.inProgress')
    } else {
      return ''
    }
  }

  const formatDateWithoutHours = (date) => {
    if (date.length > 10) {
      return date.substring(0, 10)
    }
    else {
      return date
    }    
  }

  useEffect(() => {
    let executionExists = false
    let constructionExists = false
    let serviceExists = false

    if (formalities && formalities.length > 0) {
      formalities.map((formality) => {
        if (formality.tramiteFase === 'Ejecución') {
          executionExists = true
        }
        else if (formality.tramiteFase === 'Tramite Obra') {          
          constructionExists = true
        }
        else if (formality.tramiteFase === 'Puesta en Servicio') {
          serviceExists = true
        }
      })
    }

    setExecutionExists(executionExists)
    setConstructionExists(constructionExists)
    setServiceExists(serviceExists)

  }, [ formalities ])

  useEffect(() => {
    dispatch(thunkGetMasterData('SHOW_STATUS_TRAMITATION', 'ES', 'SHOWSTATUSTRAMITATION', (response) => {
      if (response && response[0].value === '1') {
        setShowProcedureStatus(true)
      } else {
        setShowProcedureStatus(false)
      }
    }))
  }, [])

  return (
    <Grid container className={classes.container}>
      {
        (state === 7 && actualProcedure && actualProcedure.expedienteEstado && actualProcedure.expedienteEstado === 'EN CURSO' && actualProcedure.fObraEjecutableEstimada && actualProcedure.fObraEjecutableEstimada !== '') ?
          <Grid container className={classes.estimatedDateCont}>
            <Grid item xs={12} className={classes.estimatedDateTitle}>
              {t('provisions.processingInfo.estimatedDate.title')}
            </Grid>
            <Grid item xs={12} className={classes.estimatedDateDate}>
              <label>{formatDateWithoutHours(actualProcedure.fObraEjecutableEstimada)}</label>              
            </Grid>
            <Grid item xs={12} className={classes.estimatedDateInfo}>
              {'*' + t('provisions.processingInfo.estimatedDate.info')}
            </Grid>
          </Grid>
        :
          state > 7 &&
            <Grid container className={classes.estimatedDateCont}>
              <Grid item xs={12} className={classes.estimatedDateTitle}>
                {t('provisions.processingInfo.endProcessing.title')}
              </Grid>
              <Grid item xs={12} className={classes.estimatedDateInfo}>
                {t('provisions.processingInfo.endProcessing.info')}
              </Grid>
            </Grid>
      }

      {
        (formalities && formalities.length > 0) &&
          <Grid container className={classes.formalitiesCont}>

            {/* Trámites inicio de obra */}
            {executionExists &&
              <Grid container>
                <Grid item xs={12} className={classes.formalitiesTitle}>
                  {t('provisions.processingInfo.formalities.startOfWorkProcedures')}
                </Grid>
                <Grid item xs={12} className={classes.formalitiesSubtitle}>
                  {t('provisions.processingInfo.formalities.necessaryProcedures')}
                </Grid>
                <Grid container className={classes.tableTitlesContiner}>
                  <Grid item className={`${classes.titleFromTable} ${classes.rightBorder}`}>
                    {t('provisions.processingInfo.formalities.table.title1')}
                  </Grid>
                  <Grid item className={`${classes.titleFromTable} ${(showProcedureStatus) && classes.rightBorder}`}>
                    {t('provisions.processingInfo.formalities.table.title2')}
                  </Grid>
                  <Grid item className={classes.titleFromTable}>
                    {showProcedureStatus && t('provisions.processingInfo.formalities.table.title3')}
                  </Grid>
                </Grid>
                {
                  formalities.map((formality, i) => 
                    <>
                      {
                        formality.tramiteFase === 'Ejecución' &&
                          <Grid container className={classes.formalitiesInfoCont}>
                            <Grid item className={classes.formalitiesInfoText}>{formality.organismo}</Grid>
                            <Grid item className={classes.formalitiesInfoText}>{formality.tramiteDesc}</Grid>
                            <Grid item className={classes.formalitiesInfoText}>
                              {showProcedureStatus ? 
                                <Grid container className={classes.statusCont}>
                                  <img src={statusTranslations(formality.tramiteEstado, true)} alt='' className={classes.statusIcon}/>
                                  {statusTranslations(formality.tramiteEstado, false)}                                  
                                </Grid>                                
                              : 
                                ''}
                            </Grid>
                          </Grid>
                      }
                    </>
                  )
                }
              </Grid>        
            }

            {/* Trámites en fase de ejecución */}
            {constructionExists &&
              <Grid container>
                <Grid item xs={12} className={classes.formalitiesTitle}>
                  {t('provisions.processingInfo.formalities.proceduresRunning')}
                </Grid>
                <Grid container className={classes.tableTitlesContiner}>
                  <Grid item className={`${classes.titleFromTable} ${classes.rightBorder}`}>
                    {t('provisions.processingInfo.formalities.table.title1')}
                  </Grid>
                  <Grid item className={`${classes.titleFromTable} ${(showProcedureStatus) && classes.rightBorder}`}>
                    {t('provisions.processingInfo.formalities.table.title2')}
                  </Grid>
                  <Grid item className={classes.titleFromTable}>
                    {showProcedureStatus && t('provisions.processingInfo.formalities.table.title3')}
                  </Grid>
                </Grid>
                {
                  formalities.map((formality, i) => 
                    <>
                      {
                        formality.tramiteFase === 'Tramite Obra' &&                        
                          <Grid container className={classes.formalitiesInfoCont}>
                            <Grid item className={classes.formalitiesInfoText}>{formality.organismo}</Grid>
                            <Grid item className={classes.formalitiesInfoText}>{formality.tramiteDesc}</Grid>
                            <Grid item className={classes.formalitiesInfoText}>
                              {showProcedureStatus ? 
                                <Grid container className={classes.statusCont}>
                                  <img src={statusTranslations(formality.tramiteEstado, true)} alt='' className={classes.statusIcon}/>
                                  {statusTranslations(formality.tramiteEstado, false)}                                  
                                </Grid>                                
                              : 
                                ''}
                            </Grid>
                          </Grid>
                      }
                    </>
                  )
                }
              </Grid>
            }

            {/* Trámites para la puesta en servicio */}
            {serviceExists &&
              <Grid container>
                <Grid item xs={12} className={classes.formalitiesTitle}>
                  {t('provisions.processingInfo.formalities.proceduresForCommissioning')}
                </Grid>
                <Grid container className={classes.tableTitlesContiner}>
                  <Grid item className={`${classes.titleFromTable} ${classes.rightBorder}`}>
                    {t('provisions.processingInfo.formalities.table.title1')}
                  </Grid>
                  <Grid item className={`${classes.titleFromTable} ${(showProcedureStatus) && classes.rightBorder}`}>
                    {t('provisions.processingInfo.formalities.table.title2')}
                  </Grid>
                  <Grid item className={classes.titleFromTable}>
                    {showProcedureStatus && t('provisions.processingInfo.formalities.table.title3')}
                  </Grid>
                </Grid>
                {
                  formalities.map((formality, i) => 
                    <>
                      {
                        formality.tramiteFase === 'Puesta en Servicio' &&                        
                          <Grid container className={classes.formalitiesInfoCont}>
                            <Grid item className={classes.formalitiesInfoText}>{formality.organismo}</Grid>
                            <Grid item className={classes.formalitiesInfoText}>{formality.tramiteDesc}</Grid>
                            <Grid item className={classes.formalitiesInfoText}>
                              {showProcedureStatus ? 
                                <Grid container className={classes.statusCont}>
                                  <img src={statusTranslations(formality.tramiteEstado, true)} alt='' className={classes.statusIcon}/>
                                  {statusTranslations(formality.tramiteEstado, false)}                                  
                                </Grid>                                
                              : 
                                ''}
                            </Grid>
                          </Grid>
                      }
                    </>
                  )
                }
              </Grid>
            }

          </Grid>
      }
      
    </Grid>
  )
}

export default ProcessingInfo