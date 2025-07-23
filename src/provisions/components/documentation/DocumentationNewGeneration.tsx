import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import InfoIcon from '../../../assets/icons/info.svg'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import AvisoOk from '../../../assets/icons/aviso_ok.svg'
import OkList from '../../../assets/icons/ok_list.svg'
import DocumentIcon from '../../../assets/icons/mis_documentos.svg'
import AlertIcon from '../../../assets/icons/aviso_alerta_pop_up.svg'

import useStyles, {
  ExpansionPanel,
  ExpansionPanelSummary,
  StyledExpandMoreIcon,
  ExpansionPanelDetails
} from './DocumentationNewGeneration.styles'

import DocumentUploadFrame from './document-upload-frame/DocumentUploadFrame'
import AddOtherDocumentFrame from './add-other-document/add-other-document-frame/AddOtherDocumentFrame'
import BigFileDialog from './big-file-dialog/BigFileDialog'

import { adminCheck } from '../../../common/lib/ValidationLib'

import { thunkGetMasterData } from '../../store/actions/ProvisionsThunkActions'

const DocumentationNewGeneration = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const { state, isLoading, setIsLoading, showDocOnCancelDossier, blockerDocumentsList, indAceptoFacturaDigital } = props
  const provisions = useSelector((state: any) => state.provisions)
  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)

  const [documentsOnRevision, setDocumentsOnRevision] = useState(false)
  const [documentsValidated, setDocumentsValidated] = useState(false)

  const [documentsRecieved, setDocumentsRecieved] = useState({
    sentDocument: currentProvision && currentProvision.documentList && currentProvision.documentList.sentDocument ? currentProvision.documentList.sentDocument.map((item) => item) : [],
    nSentDocument: currentProvision && currentProvision.documentList && currentProvision.documentList.nSentDocument ? currentProvision.documentList.nSentDocument.map((item) => item) : []
  } as any)

  const [newDocumentsRecieved, setNewDocumentsRecieved] = useState({} as any)

  const [hideOtherDoc, setHideOtherDoc] = useState(false as boolean)

  const [sortedDocumentsList, setSortedDocumentsList] = useState([] as any)
  const [documentsList, setDocumentsList] = useState([] as any)
  const [dossierControl, setDossierControl] = useState([] as any)
  const [allowOtherDocumentFrame, setAllowOtherDocumentFrame] = useState(false)

  const fechaCorteDocumentoOtra = '20201101'

  const billemail = useSelector((state: any) => provisions.currentProvision.billingEmail)
  const [billingEmail, setBillingEmail] = useState(billemail)

  useEffect(() => {
    //esta llamada se encarga de comprobar si tenemos que quitar el adjuntar documentos
    dispatch(thunkGetMasterData('DOSSIER_CONTROL', 'ES', 'MESSAGE_DOC', (response) => {
      if (response !== undefined) {
        setDossierControl(response[0].value)
      }
    }));
    //esta llamada se encarga de comprobar si tenemos que quitar el adjuntar OTROS documentos
    dispatch(thunkGetMasterData('HIDE_OTHER_DOC_FLAG', 'ES', 'HIDE_OTHER_DOC_FLAG', (response) => {
      if (response !== undefined) {
        if (response[0].value === '1') {
          setHideOtherDoc(true)
        } else if ((response[0].value === '0')) {
          setHideOtherDoc(false)
        }
      }
    }));
  }, [])

  useEffect(() => {
    // cuando cambia la lista de documentos

    if (currentProvision && currentProvision.documentList) {
      let sentDocument = currentProvision.documentList.sentDocument ? currentProvision.documentList.sentDocument : []
      let nSentDocument = currentProvision.documentList.nSentDocument ? currentProvision.documentList.nSentDocument : []

      // mergeamos las dos listas de documentos
      let mergedSentDocuments = [
        ...sentDocument,
        ...nSentDocument
      ]

      // ordenamos por tipo de documento (documentType)
      setSortedDocumentsList(mergedSentDocuments.sort((a, b) => (a.documentType > b.documentType) ? 1 : ((b.documentType > a.documentType) ? -1 : 0)))
    }
    // eslint-disable-next-line
  }, [newDocumentsRecieved])

  // Setear en la lista la nueva lista al subir documentos
  useEffect(() => {
    setIsLoading(true)

    if (newDocumentsRecieved.sentDocument && newDocumentsRecieved.nSentDocument) {
      setDocumentsRecieved(newDocumentsRecieved)
    }

    setIsLoading(false)
    // eslint-disable-next-line
  }, [newDocumentsRecieved])

  // Comprobar si no hay documentos pendientes y estan todos aceptados
  useEffect(() => {
    if (documentsRecieved && documentsRecieved.nSentDocument && documentsRecieved.sentDocument) {
      if (documentsRecieved.nSentDocument.length === 0) {
        if (documentsRecieved.sentDocument.filter((item) => Object.keys(item).filter(() => item['statusId'] !== 'DOCSTA0004').length !== 0).length === 0) {
          if (state >= 4) {
            // Si el estado es mayor que el completado de los documentos se muestran como validados
            setDocumentsValidated(true)
          }
        }
      }
    }
    // eslint-disable-next-line
  }, [documentsRecieved])

  // Comprobar si hay documentos en revision
  useEffect(() => {
    if (documentsRecieved && documentsRecieved.sentDocument) {
      const check = documentsRecieved.sentDocument.filter((item) => Object.keys(item).filter(() => item['statusId'] === 'DOCSTA0002').length !== 0).length > 0

      setDocumentsOnRevision(check)
    }
    // eslint-disable-next-line
  }, [documentsRecieved])

  /* Cargar los nombres de los documentos no recibidos desde masterData */
  useEffect(() => {
    if (sortedDocumentsList.length > 0) {
      let promises = [] as any
      let auxList = [] as any

      sortedDocumentsList.map((item, index) => {
        let promise = new Promise<void>((resolve, reject) => {
          dispatch(thunkGetMasterData('DOCUMENT_TYPE_ID', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), item.documentType, (response) => {
            if (response) {
              let auxItem = {
                documentumId: item.documentumId,
                documentCode: item.documentCode,
                documentType: item.documentType,
                documentName: item.documentName,
                statusId: item.statusId,
                documentTypeName: (response.length === 0 ? t('provisions.documentation.documents.other') : response[0].value),
                registerDate: item.registerDate,
                comment: item.comment,
                uploadState: item.uploadState,
                uploadDate: item.uploadDate,
                processBatchID: item.processBatchID
              }

              auxList.push(auxItem)

              resolve()
            }
            reject()

          }))
        }).then(() => { // resolve()
          // Success :)
        }, () => { // reject()
          // Error :(
        })

        return promises.push(promise)
      })

      Promise.all(promises).then(() => {
        setDocumentsList(auxList.sort((a, b) => (a.documentType > b.documentType) ? 1 : ((b.documentType > a.documentType) ? -1 : 0)))
      })
    }
    // eslint-disable-next-line
  }, [sortedDocumentsList])


  const checkIsBlockingDoc = (item) => {
    let response = false;
    blockerDocumentsList.forEach(blockedDoc => {
      if (blockedDoc.key === item.documentType && item.statusId === 'DOCSTA0005') {
        response = true;
      }
    });
    return response;
  }
  useEffect(() => {
    if (currentProvision.dossierStatusId === 'STATUS0003' ||
      currentProvision.dossierStatusId === 'STATUS0100' ||
      currentProvision.dossierStatusId === 'STATUS0101' ||
      currentProvision.dossierStatusId === 'STATUS0010' ||
      currentProvision.dossierStatusId === 'STATUS0012') {
      setAllowOtherDocumentFrame(false)
    } else {
      setAllowOtherDocumentFrame(true)
    }
  }, [currentProvision])

  return (
    <>
      <Grid container justifyContent='center' alignItems='center' className={classes.containerIE}>
      
        <Grid item className={classes.fullWidth}>
          <ExpansionPanel>

            <ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />}>
              <img className={classes.expansionPanelSummaryIcon} src={DocumentIcon} alt='' />

              <Typography className={classes.expansionPanelSummaryText}>{t('provisions.documentation.panelTitle')}</Typography>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails>
              <Grid container direction='column'> 
                {
                  !showDocOnCancelDossier &&
                  (
                    !documentsValidated ?
                      <>
                        {
                          dossierControl === '1' &&
                          <>
                            <div className={classes.fileFormatAdvise}>{t('Lo sentimos, por motivos técnicos, en estos momentos no es posible adjuntar documentación a tu solicitud de conexión. Por favor, envíanos los documentos a través de este formulario.')}</div>
                            <a className={classes.fileFormatAdvise} href='https://www.ufd.es/contacto/' target='_blank'>{'https://www.ufd.es/contacto/'}</a>
                          </>
                        }
                        {
                          dossierControl === '0' &&
                          <div className={classes.fileFormatAdvise}>{t('provisions.documentation.fileFormat')}</div>
                        }

                      </>
                      :
                      <Grid
                        container
                        alignItems='center'
                        justifyContent='center'
                        direction='column'
                        spacing={2}
                        className={classes.validatedContainer}
                      >
                        <Grid item>
                          <img src={AvisoOk} alt='' />
                        </Grid>

                        <Grid item className={classes.validatedTitle}>
                          {t('provisions.documentation.validatedDocuments.title')}
                        </Grid>

                        <Grid item className={classes.validatedSubtitle}>
                          {t('provisions.documentation.validatedDocuments.subtitle')}
                        </Grid>
                      </Grid>
                  )
                }
                {
                  dossierControl !== '1' &&
                  <Grid container spacing={2}>
                    {
                      !isLoading && documentsList.map((item, index) => (
                        item &&
                        (
                          (item.documentType !== 'DOCTYP0203' && item.documentType !== 'DOCTYP0302' && item.documentType !== 'DOCTYP0331') ||
                          (
                            item.documentType === 'DOCTYP0203' && item.registerDate.substring(0, 8) > fechaCorteDocumentoOtra
                          )
                        ) && (

                          !showDocOnCancelDossier ?
                            <DocumentUploadFrame
                              key={index}
                              documentumId={item.documentumId}
                              documentCode={item.documentCode}
                              documentType={item.documentType}
                              documentStatus={item.statusId}
                              documentTypeName={item.documentTypeName}
                              documentName={item.documentName}
                              registerDate={item.registerDate}
                              comment={item.comment}
                              setNewDocumentsRecieved={setNewDocumentsRecieved}
                              isBlockingDoc={checkIsBlockingDoc(item)}
                              billingEmail={billingEmail}
                              indAceptoFacturaDigital={indAceptoFacturaDigital}
                              uploadState={item.uploadState}
                              uploadDate={item.uploadDate}
                              processBatchID={item.processBatchID}
                            />
                            : item.documentumId &&
                            <DocumentUploadFrame
                              key={index}
                              documentumId={item.documentumId}
                              documentCode={item.documentCode}
                              documentType={item.documentType}
                              documentStatus={item.statusId}
                              documentTypeName={item.documentTypeName}
                              documentName={item.documentName}
                              registerDate={item.registerDate}
                              comment={item.comment}
                              setNewDocumentsRecieved={setNewDocumentsRecieved}
                              isBlockingDoc={checkIsBlockingDoc(item)}
                              billingEmail={billingEmail}
                              indAceptoFacturaDigital={indAceptoFacturaDigital}
                              uploadState={item.uploadState}
                              uploadDate={item.uploadDate}
                              processBatchID={item.processBatchID}
                            />
                        )
                      ))
                    }
                    {
                      ((!adminCheck() && !showDocOnCancelDossier) && (allowOtherDocumentFrame)) &&

                      <AddOtherDocumentFrame
                        setNewDocumentsRecieved={setNewDocumentsRecieved}
                        billingEmail={billingEmail}
                        indAceptoFacturaDigital={indAceptoFacturaDigital}
                      />
                    }
                  </Grid>
                }

                {
                  (!documentsValidated && (documentsOnRevision || currentProvision.dossierStatusId === 'STATUS0010') &&
                    !showDocOnCancelDossier) &&
                  <Grid
                    container
                    justifyContent='flex-start'
                    alignItems='center'
                    className={classes.sentDocumentAdviseContainer}
                  >
                    <Grid container lg={12} md={10} sm={11}>
                      <Grid container alignItems='center'>
                        <Grid item md={1} sm={12} xs={12}>
                          <img src={AlertIcon} className={classes.alertIconRevision} alt='' />
                        </Grid>

                        <Grid item md={11} sm={12} xs={12} className={classes.sentDocumentAdviseTitle}>
                          {t('provisions.documentation.onRevisionAdvise.title')}
                        </Grid>
                      </Grid>

                      <Grid container>
                        <Grid item md={1} sm={12} xs={12} />

                        <Grid item md={11} sm={12} xs={12} className={classes.sentDocumentAdviseSubtitle}>
                          {t('provisions.documentation.onRevisionAdvise.text')}
                        </Grid>
                      </Grid>
                      <Grid container>
                        <Grid item md={1} sm={12} xs={12} />

                        <Grid item md={11} sm={12} xs={12} className={classes.sentDocumentAdviseSubtitle}>
                          {t('provisions.documentation.onRevisionAdvise.otherDocs')}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                }
                <Grid
                  container
                  justifyContent='flex-start'
                  alignItems='center'
                  className={classes.otherDocAdviseContainer}
                >
                 <Grid item md={1} sm={12} xs={12}>
                    <img src={AlertIcon} className={classes.alertIconRevision} alt='' />
                  </Grid>
                  <Grid container lg={11} md={10} sm={11}>
                    <Grid container alignItems='center'>
                      <Grid item md={12} sm={10} xs={12} className={classes.otherDocAdviseTitle}>
                        {t('provisions.documentation.otherDocsAdvise')}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </Grid>
      </Grid>
    </>
  )
}
export default DocumentationNewGeneration
