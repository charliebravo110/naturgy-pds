import { Divider, Grid } from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import useStyles from './HeadboardSR.styles'
import ArrowIcon from '../../../../assets/icons/flecha_derecha.svg'
import DocumentIcon from '../../../../assets/icons/ico_documento.svg'
import { useDispatch, useSelector } from 'react-redux'
import { thunkGetDocumentosCargaOffline, thunkGetDocumentSr } from '../../../store/actions/RequestsThunkActions'
import { formatUSADateString } from '../../../../common/lib/FormatLib'
import { adminCheck } from '../../../../common/lib/ValidationLib'

const HeadboardSR = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const user = useSelector((state: any) => state.user.profile)

  const { requestData, location, events, setShowPopupReapertura, closeMessage } = props
  const requestDetail = requestData || (location && location.state && location.state.request)

  const [isLoading, setIsLoading] = useState(false)
  const [documentList, setDocumentList] = useState([] as any)
  const [finalDocumentList, setFinalDocumentList] = useState([] as any)
  const [showDocuments, setShowDocuments] = useState(false)
  const [isReclamacion, setIsReclamacion] = useState(false)
  const [plazoReaperturaActivo, setPlazoReaperturaActivo] = useState(false)

  const closeResponse = t('requests.newRequestDetail.chatSr.ufdResponses.closeResponse')
  const genericResponse = t('requests.newRequestDetail.chatSr.ufdResponses.genericResponse')

  const getUfdResponse = (type: string) => {
    return type === 'CAMBIO DE ESTADO' ? closeResponse : genericResponse
  }

  // El plazo para poder reabrir una SR es de 20 días desde que se cerró
  // const checkPlazo = (date: string) => {
  //   const difference = new Date().getTime() - new Date(formatUSADateString(date)).getTime()
  //   const daysSinceClosing = (Math.ceil(difference / (1000 * 3600 * 24))) - 1

  //   return daysSinceClosing <= 20 ? true : false
  // }

  useEffect(() => {
    if (requestData && requestData.codSR && requestData.codSR !== '') {
      // Tan solo pueden reabrirse SRs de tipo Reclamación (R)
      setIsReclamacion(requestData.codSR.toUpperCase().includes('R') ? true : false)
    }
  }, [requestData])

  useEffect(() => {
    if (isReclamacion && requestData && requestData.reopenTimer && Number(requestData.reopenTimer) > 0) {
      setPlazoReaperturaActivo(true)
    }
    else {
      setPlazoReaperturaActivo(false)
    }
  }, [isReclamacion, requestData])
  
  useEffect(() => {
    if (user.documentNumber && user.documentNumber !== '' && requestDetail.documentList && requestDetail.documentList.sentDocuments && requestDetail.documentList.sentDocuments.length > 0 && requestDetail.documentList.sentDocuments.documentumId !== '' && documentList.length === 0) {
      let promises = [] as any
      let errors = [] as any

      let documentsAux = [] as any

      setIsLoading(true)

      requestDetail.documentList.sentDocuments.map(item => {
        if (item.documentumId !== '') {
          var promise = new Promise<void>(function (resolve, reject) {
            dispatch(thunkGetDocumentSr(item.documentumId, requestDetail.codSR, (response) => {
              if (response && response.documento) {
                documentsAux.push({
                  name: response.documento.nombre,
                  base64: `data:${response.documento.tipoMime};base64,${response.documento.contenido}`,
                  documentTypeDoc: item.documentTypeDoc,
                  documentComment: item.documentComment
                })

                resolve()
              }

              reject()
            }))
          }).then(function () { // resolve()
            // Success :)
          }, function () { // reject()
            // Error :(
            errors.push(item)
          })

          return promises.push(promise)
        }
      })

      Promise.all(promises).then(function () {
        setIsLoading(false)
        // if (errors.length === 0) {
        if (documentsAux.length > 0) {
          setDocumentList(documentsAux)
        }
      })
    }
    // handleListComments()
    // eslint-disable-next-line
  }, [user.documentNumber, requestDetail])

  useEffect(() => {
    if (documentList.length > 0) {
      let promises = [] as any
      let errors = [] as any

      let documentsAux = [] as any

      setIsLoading(true)

      documentList.map((item, i) => {
        // Comprobamos si el nombre del fihcero está compuesto por la nueva nomenclatura e ZEUS: IDENTIFICADORORIGEN_PROCESSBATCHID_CODIGOEXPEDIENTE/CUPS/NINGUNO_TIPODOCUMENTO_ SOLICITANTE_NOMBREDELFICHERO_FECHA
        // Comprobamos también que el PROCESSBATCHID pertenece a PDS (comienza por 02)
        if ((item.name.match(/_/g) || []).length >= 6 && item.name.split('_')[1].startsWith('02')) {
          var promise = new Promise<void>(function (resolve, reject) {
          // El valor inicial '02' del PROCESSBATCHID tan solo sirve para indicar que pertenece a PDS. Pero para lanzar la consulta a nuestra base de datos 
          // UFD_DOCUMENTOS_CARGA_OFFLINE tan solo usamos el resto del ID. Es decir, el id sería el PROCESSBATCHID sin el '02' inicial
          const id = item.name.split('_')[1].substring(2)
            dispatch(thunkGetDocumentosCargaOffline(id, '', '', '', '', '', '', (response) => {
              if (response && response.length > 0) {
                documentsAux.push({
                  name: response[0].docName,
                  base64: item.base64,
                  documentTypeDoc: item.documentTypeDoc,
                  documentComment: item.documentComment,
                })

                resolve()
              }

              reject()
            }))
          }).then(function () { // resolve()
            // Success :)
          }, function () { // reject()
            // Error :(
            errors.push(item)
          })

          return promises.push(promise)
        }
        else {
          documentsAux.push({
            name: item.name,
            base64: item.base64,
            documentTypeDoc: item.documentTypeDoc,
            documentComment: item.documentComment,
          })
        }
      })

      Promise.all(promises).then(function () {
        setIsLoading(false)
        // if (errors.length === 0) {
        if (documentsAux.length > 0) {
          setFinalDocumentList(documentsAux)
        }
      })
    }
    // handleListComments()
    // eslint-disable-next-line
  }, [documentList])

  return (
    <Grid container className={classes.headboard}>
      <Grid xs={12} sm={4} className={classes.marginTop}>
        <Grid xs={12} className={classes.codSr}>{requestData.codSR}</Grid>
        <Grid xs={12} className={classes.status} style={{color:(requestData.status == 'EN CURSO') ? 'orange' : '#009AA6' }}>
          {
            (requestData.status == 'EN CURSO') ?
              t('requests.newRequestDetail.headboardSR.inProgress')
            :
            (requestData.status == 'CERRADA')  ?
              t('requests.newRequestDetail.headboardSR.closed')
            :
              requestData.status  
          }
        </Grid>
      </Grid>
      <Grid xs={12} sm={2} className={classes.marginDate}>
        {
           (requestData && requestData.createDate) ?
             <>
                <Grid className={classes.title}>{t('requests.newRequestDetail.headboardSR.createDate')}</Grid>
                <Grid>{requestData.createDate}</Grid>
             </>
            :
           (requestData.reopeningDate) &&
             <>
                <Grid className={classes.title}>{t('requests.newRequestDetail.headboardSR.reopeningDate')}</Grid>
                <Grid>{requestData.createDate}</Grid>
             </>
        }
       
      </Grid>
      {
        (requestData && requestData.closingDate) &&
          <Grid xs={12} sm={2} className={classes.marginDate}>
            <Grid className={classes.title}>{t('requests.newRequestDetail.headboardSR.closingDate')}</Grid>
            <Grid>{requestData.closingDate}</Grid>
          </Grid>
      }
      
      {
        (requestData.cups || requestData.codExpedient) &&
          <Grid sm={12}>
            <Grid className={classes.marginTop}>
              <span className={classes.title}>
                {
                  (requestData.cups) ?
                    t('requests.newRequestDetail.headboardSR.CUPS')
                  :
                    (requestData.codExpedient) && t('requests.newRequestDetail.headboardSR.EXP')
                }
              </span>
              <span>
                {
                  (requestData.cups) ?
                    requestData.cups
                  :
                    (requestData.codExpedient) && requestData.codExpedient
                }
              </span>
            </Grid>
          </Grid>
      }
      <Grid xs={12}>
        <Grid className={classes.marginTop}>
          <span className={classes.title}>
            {t('requests.newRequestDetail.headboardSR.address')}
          </span>
          <span>
            {requestData.address}
          </span>
        </Grid>
      </Grid>
      <Grid xs={12}  className={classes.genericMargin}>
        <Grid className={classes.title}>{t('requests.newRequestDetail.headboardSR.comments')}</Grid>
        <Grid className={classes.comments}>{requestData.createComment}</Grid>
      </Grid>
      <Grid xs={12} className={classes.genericMargin}>
        <Grid className={classes.title}>
          {t('requests.newRequestDetail.headboardSR.documents')}
          <img style={{transform: showDocuments ? 'rotate(273deg)' : 'rotate(90deg)' }} className={classes.arrow} src={ArrowIcon}  onClick={() => {setShowDocuments(!showDocuments)}} />
        </Grid>
        {(showDocuments) &&
          <Grid className={classes.documents}>
            {
              // (requestDetail.documentList !== undefined && requestDetail.documentList.sentDocuments.length > 0 && requestDetail.documentList.sentDocuments[0].documentCode !== '.' && requestDetail.documentList.sentDocuments[0].documentCode !== '') ?
              finalDocumentList.length > 0 ?
                finalDocumentList.map((item,index) => 
                  {
                    return (
                      <div key={index}>
                        <Grid>
                          {item.documentComment}
                        </Grid> 
                        <Grid className={classes.documentBubble}>
                         <a className={classes.documentLink} href={item.base64} download={item.name}>{item.name}</a>
                           {item.documentTypeDoc}
                        </Grid>
                      </div>
                    )
                  }    
                )
              :
                <>{t('requests.newRequestDetail.headboardSR.noDocuments')}</>                
            }
          </Grid>
        }
      </Grid>
      
      {requestDetail.status === 'CERRADA' ?
        <>
          <Grid xs={12}>
            <Divider variant='middle'/>
          </Grid>
          <Grid xs={12} className={classes.marginTop}>
            <Grid className={classes.title}>
              {t('requests.newRequestDetail.headboardSR.ufdResponse')}
            </Grid>
            <Grid sm={12} className={classes.response}>
              <Grid item className={classes.fontWeight}>
                <span>{t('requests.newRequestDetail.headboardSR.closedRequest')}{' '}{requestDetail.closingDate}</span>
              </Grid>

              {/* AÑADIR AQUí COMENTARIO DE CIERRE SR */}
              {(requestDetail.status && requestDetail.status === 'CERRADA' && closeMessage && closeMessage !== '') &&
                <Grid item>
                  {closeMessage}
                </Grid>
              }

              {/* SR de tipo Reclamación y plazo de reapertura activo => Se permite la reapetura*/}
              {(isReclamacion && plazoReaperturaActivo) ?
                <Grid container>
                  <Grid item>
                    <span>{t('requests.newRequestDetail.headboardSR.reopenPetition1')}</span>
                    <span className={classes.reopen} onClick={() => {!adminCheck() && setShowPopupReapertura(true)}}>
                      {t('requests.newRequestDetail.headboardSR.reopenPetition2')}
                    </span>
                  </Grid>
                  <Grid item>
                    <span>{t('requests.newRequestDetail.headboardSR.reopenPetition3') + ` (${requestDetail.closingDate})`}</span>
                  </Grid>
                </Grid>
              :
                // SR de tipo Reclamación y plazo de reapertura caducado => NO se permite la reapetura
                (isReclamacion) &&
                  <Grid item>
                    <span>{t('requests.newRequestDetail.headboardSR.noReopen1')}</span>
                    <span className={classes.fontWeight}>{t('requests.newRequestDetail.headboardSR.noReopen2')}</span>
                    <span>{` (${requestDetail.closingDate})`}</span>
                  </Grid>
              }
            </Grid>
          </Grid>
        </>
      :
        (events && events.length > 0) && 
          <>
            <Grid xs={12}>
              <Divider variant='middle'/>
            </Grid>
            <Grid xs={12} className={classes.marginTop}>
              <Grid className={classes.title}>
                {t('requests.newRequestDetail.headboardSR.ufdResponse')}
              </Grid>
              <Grid sm={12} className={classes.response}>
                {getUfdResponse(events[events.length - 1].typeName)}
              </Grid>
            </Grid>
          </>
      }
    </Grid>
  )
}

export default HeadboardSR