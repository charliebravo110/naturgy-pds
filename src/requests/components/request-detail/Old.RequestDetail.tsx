import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Link, Redirect } from 'react-router-dom'

import { Grid } from '@material-ui/core'

import ButtonToTop from '../../../common/components/button-to-top/ButtonToTop'
import Spinner from '../../../common/components/spinner/Spinner'

import UserImage from '../../../assets/icons/usuario_publico.svg'
import DocumentIcon from '../../../assets/icons/ico_documento.svg'
import UfdIcon from '../../../assets/icons/simbolo_ufd.svg'
import MessageIcon from '../../../assets/icons/respuesta.svg'

import { hasNotUserPermissions } from '../../../common/lib/UserPermissionsLib'

import { thunkGetDocumentSr, thunkGetDocumentosCargaOffline } from '../../store/actions/RequestsThunkActions'

import useStyles from './Old.RequestDetail.styles'
import { adminCheck } from '../../../common/lib/ValidationLib'

const RequestDetail = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const user = useSelector((state: any) => state.user.profile)

  const { requestData, location, setShowingRequestDetail } = props

  const requestDetail = requestData || (location && location.state && location.state.request)

  const [isLoading, setIsLoading] = useState(false)
  const [inCourse] = useState(requestDetail && requestDetail.status !== 'CERRADA')
  const [closed] = useState(requestDetail && requestDetail.status === 'CERRADA')

  const [documentList, setDocumentList] = useState([] as any)
  const [finalDocumentList, setFinalDocumentList] = useState([] as any)

  //Opciones:
  // Comentario --> 'C'
  // Reiteracion --> 'R'
  // Adjuntar Documentacion --> 'D'
  // Ver Documentacion --> 'V'

  // Añadidos

  /*const getFileBase64 = (file, callback) => {
    let reader = new FileReader()

    reader.readAsDataURL(file)

    reader.onload = () => {
      callback(reader.result)
    }

    reader.onerror = (error) => {
      console.error('Error: ', error)
    }
  }*/

  /*const handleUploadDocument = (e) => {
    const file = e.target.files[0]
    e.target.value = ''

    if (file) {

      let documentumData = {
        nombre: file.name,
        extension: file.name && ('.' + file.name.split('.').pop()),
        tipoMime: file.type,
        carpeta: '/Documentos/ZEUDATCWBS01',
        tipo: 'ZEUDATCPRO01',
        metadatos: [
          {
            nombre: 'tipo_sr',
            valor: requests.newRequestData.tipology
          },
          {
            nombre: 'sector',
            valor: 'ELECTRICIDAD'
          },
          {
            nombre: 'nif_consumidor',
            valor: user.documentNumber
          }
        ]
      } as any

      getFileBase64(file, (response) => {
        const base64 = response.substring(response.indexOf('base64,') + 7, response.length)

        documentumData = {
          ...documentumData,
          contenido: base64
        }

        let documentData = {
          nombreArchivo: file.name,
          format: file.name && (file.name.split('.').pop()),
          documentType: 'DOCTYP0101',
          documentState: 'DOCSTA0002'
        } as any

        // subir el fichero a Documentum
        dispatch(thunkCreateDocument(documentumData, (response) => {
          if (response) {
            documentData = {
              ...documentData,
              url: BASE_URL + '/documentum/' + response.idDocumento,
              idDocumentum: response.idDocumento,
            }
            if (response.result.codResult === '0000') {
              setDocumentUpload(true)
            }
            setFileSelected(documentData)
            dispatch(setNewRequestDataDocument(documentData))
            setShowingDialog(true)
          }
        }))

      })
    }
  }*/

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

        if (errors.length === 0) {
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

        if (errors.length === 0) {
          setFinalDocumentList(documentsAux)
        }
      })
    }
    // handleListComments()
    // eslint-disable-next-line
  }, [documentList])

  // TO-DO 
  // este método es para recuperar el array de comentarios.
  //
  // const handleListComments = () => {
  //   //dispatch(serviceRequestsComments(requestDetail.codSR, (response) => {
  //   dispatch(thunkGetCommentsSr(requestDetail.codSR, (response) => {
  //     if (response) {
  //       console.log('E999513 serviceRequestsComments: ', response)
  //     }

  //   }
  //   ))
  // }

  const UserSkeleton = () => {
    return <div className={classes.userSkeleton} />
  }

  let userRoles = sessionStorage.getItem('userRoles') || ''
  let gdprAccepted = sessionStorage.getItem('gdprAccepted') || ''

  let userRolesArray = userRoles.split(',')

  if (hasNotUserPermissions()) {
    const redirectTo = userRolesArray.includes('US_CC') ? '/admin' : '/login'

    return <Redirect to={redirectTo} />
  }

  if (window.location.pathname !== '/gdpr' && gdprAccepted === '0') {
    return <Redirect to='/gdpr' />
  }

  const commentDateLimit = new Date(2020, 11, 1)
  const srCreateDateArray = requestDetail.createDate.split('/')
  const srCreateDate = new Date(srCreateDateArray[2], srCreateDateArray[1] - 1, srCreateDateArray[0])
  let commentVisible = true

  if (commentDateLimit.getTime() > srCreateDate.getTime()) {
    commentVisible = false
  }

  /*const handleAddComentary = () => {
    setOptionDialog('C')
    setShowingDialog(true)
  }

  const handleAddReiteracion = () => {
    setOptionDialog('R')
    setShowingDialog(true)
  }

  const handleAddDoc = () => {
    setOptionDialog('D')
    auxAttachedDocument.firstChild.click()
  }

  const handleViewDoc = () => {
    if (requestDetail.documentList !== undefined
      && requestDetail.documentList.sentDocuments.length > 0
      && requestDetail.documentList.sentDocuments.documentCode !== '.') {

      setOptionDialog('V')
      setShowingDialog(true)
    }
  }*/

  return (
    <div className={`${classes.block} ${window.location.pathname === '/supplies/detail' && 'without-margin'} ${window.location.pathname === '/provisions/detail' && 'with-margin'}`}>
      {
        isLoading &&
        <Spinner fixed />
      }

      {
        window.location.pathname === '/requests/detail' &&
        <ButtonToTop />
      }

      <Grid container className={classes.container}>
        <Grid item xs={11} md={10} className={classes.maxWidthForBigScreens}>
          <div className={`${classes.title} ${window.location.pathname === '/provisions/detail' && 'without-margin'}`}>{t('requests.requestDetail.title')}</div>

          <Grid container justifyContent='space-between' alignItems='center'>
            <Grid item>
              <div className={classes.infoText}>
                <span className={classes.detailText}>{t('requests.requestDetail.detail')}</span>

                <span className={classes.detailCod}>{requestDetail.codSR}</span>
              </div>
            </Grid>

            <Grid item className={classes.link}>
              {
                (window.location.pathname === '/supplies/detail' || window.location.pathname === '/provisions/detail') ?
                  <div onClick={() => setShowingRequestDetail(false)}>{t('requests.requestDetail.return')}</div>
                  :
                  <Link to='/requests'>{t('requests.requestDetail.return')}</Link>
              }
            </Grid>
          </Grid>

          <Grid container direction='column' className={classes.outerContainer}>
            <Grid item className={classes.requestContainer}>
              <Grid className={classes.userContainer} container justifyContent='space-between' spacing={2}>
                <Grid container md={8}>
                  <Grid item md={1} sm={1} xs={2}>
                    <img src={UserImage} className={classes.userImage} alt='' />
                  </Grid>
                  <Grid item className={classes.userText}>
                    {
                      typeof (user.name) !== 'undefined' && typeof (user.surName) !== 'undefined' ?
                        `${user.name} ${user.surName}`
                        :
                        <UserSkeleton />
                    }
                  </Grid>
                </Grid>

                <Grid item md={4}>
                  <Grid container>
                    {(requestDetail.cups !== '' || requestDetail.codExpedient !== '') &&
                      <Grid item>
                        {requestDetail.cups !== '' ?
                          <>
                            <span className={classes.statusBold}>{t('requests.requestDetail.cups')}</span>
                            <span className={classes.statusText}>{requestDetail.cups}</span>
                          </>
                          :
                          <>
                            <span className={classes.statusBold}>{t('requests.requestDetail.numExpedient')}</span>
                            <span className={classes.statusText}>{requestDetail.codExpedient}</span>
                          </>
                        }
                      </Grid>
                    }

                    {requestDetail.address &&
                      <Grid item>
                        <span className={classes.statusBold}>{t('requests.requestDetail.address')}</span>
                        <span className={classes.statusText}>{requestDetail.address}</span>
                      </Grid>
                    }
                  </Grid>
                </Grid>
              </Grid>

              <Grid container>
                <Grid item md={1} sm={1} xs={1} />
                <Grid item md={11} sm={11} xs={11} className={classes.messageText}>
                  {requestDetail.tipologyDescription}
                </Grid>
              </Grid>

              {(requestDetail.documentList !== undefined && requestDetail.documentList.sentDocuments.length > 0 && requestDetail.documentList.sentDocuments.documentCode !== '.') &&
                <Grid container className={classes.documents}>
                  <Grid item md={1} sm={1} xs={1} />
                  <Grid item md={11} sm={11} xs={11}>
                    <Grid container direction='column'>

                      {finalDocumentList.map((item, index) =>
                        <Grid key={index} container alignItems='center' className={classes.documentContainer}>
                          <Grid item>
                            <img className={classes.documentIcon} src={DocumentIcon} alt='' />
                          </Grid>
                          <Grid item>
                            <a href={item.base64} download={item.name}>{item.name}</a>
                          </Grid>
                          <Grid item className={classes.documentInfo}>
                            {item.documentTypeDoc}
                          </Grid>
                          <Grid item className={classes.documentInfo}>
                            {item.documentComment}
                          </Grid>
                        </Grid>
                      )}

                    </Grid>
                  </Grid>
                </Grid>
              }

              {closed &&
                <Grid container direction='column'>
                  <div className={classes.separator} />

                  <Grid container alignItems='center' justifyContent='space-around' className={classes.ufdContainer}>
                    <Grid item md={1} sm={2} xs={2}>
                      <img className={classes.ufdIcon} src={UfdIcon} alt='' />
                    </Grid>

                    <Grid item md={11} sm={10} xs={8}>
                      <Grid container direction='column' spacing={1}>
                        <Grid item className={classes.closedTitle}>
                          {t('requests.requestDetail.closed.ufdTitle')}
                        </Grid>

                        <Grid item className={classes.closedSubtitle}>
                          {t('requests.requestDetail.closed.ufdSubtitle')}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item md={1} sm={1} xs={1} />

                    <Grid item md={11} sm={11} xs={11} className={classes.closedText}>
                      {requestDetail.resolution}
                    </Grid>
                  </Grid>
                </Grid>
              }
            </Grid>

            {inCourse &&
              <Grid item className={classes.responseContainer}>
                <Grid container>
                  <Grid item lg={1} />

                  <Grid item lg={11} md={12} sm={12} xs={12}>
                    <Grid container alignItems='center' className={classes.inCourse}>
                      <Grid item lg={1} md={2} sm={3} xs={3}>
                        <img className={classes.inCourseIcon} src={MessageIcon} alt='' />
                      </Grid>

                      <Grid item lg={11} md={9} sm={8} xs={8} className={classes.inCourseText}>
                        {t('requests.requestDetail.inCourse.text')}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            }

            {commentVisible &&
              <Grid className={classes.requestContainer} item>
                <Grid container justifyContent='space-between' spacing={2}>
                  {adminCheck() ?
                    <Grid item md={9}>
                      <span className={classes.statusBold}>{t('requests.requestDetail.commentary')}</span>
                      <span className={classes.statusText}>{requestDetail.createComment}</span>
                    </Grid>
                    :
                    <Grid item>
                      <span className={classes.statusBold}>{t('requests.requestDetail.commentary')}</span>
                      <span className={classes.statusText}>{requestDetail.createComment}</span>
                    </Grid>
                  }
                  {adminCheck() && requestDetail.channel &&
                    <Grid item alignContent='flex-end'>
                      <span className={classes.statusBold}>{t('requests.requestDetail.channel')}</span>
                      <span className={classes.statusText}>{requestDetail.channel}</span>
                    </Grid>
                  }
                </Grid>
              </Grid>
            }

            {!commentVisible && adminCheck() && requestDetail.channel &&
              <Grid className={classes.requestContainer} item>
                <Grid container justifyContent='space-between' spacing={2}>
                  <Grid item alignContent='flex-end'>
                    <span className={classes.statusBold}>{t('requests.requestDetail.channel')}</span>
                    <span className={classes.statusText}>{requestDetail.channel}</span>
                  </Grid>
                </Grid>
              </Grid>
            }

            <Grid item className={classes.statusContainer}>
              <Grid container justifyContent='space-between' spacing={2}>
                <Grid item>
                  <Grid container spacing={2}>
                    <Grid item>
                      <span className={classes.statusBold}>{t('requests.requestDetail.openDate')}</span>
                      <span className={classes.statusText}>{requestDetail.createDate}</span>
                    </Grid>
                  </Grid>
                  {
                    closed && requestDetail.closingDate &&
                    <Grid container spacing={2}>
                      <Grid item>
                        <span className={classes.statusBold}>{t('requests.requestDetail.closeDate')}</span>
                        <span className={classes.statusText}>{requestDetail.closingDate}</span>
                      </Grid>
                    </Grid>
                  }
                </Grid>

                <Grid item>
                  <span className={classes.statusBold}>{t('requests.requestDetail.status.title')}</span>
                  <span className={classes.statusText}>
                    {
                      inCourse ?
                        t('requests.requestDetail.status.inCourse')
                        :
                        t('requests.requestDetail.status.closed')
                    }
                  </span>
                </Grid>
              </Grid>
            </Grid>

            {/* <Grid container justifyContent='center'>
              <Grid container md={11}>
                <Grid container className={classes.containerFooter}>

                  <Grid item className={classes.itemFooter} onClick={handleAddComentary}>
                    {t('requests.requestDetail.commentary1')}
                  </Grid>

                  <Grid item className={classes.itemFooter} onClick={handleAddReiteracion}>
                    {t('requests.requestDetail.repeat')}
                  </Grid>

                  <Grid item className={classes.itemFooter} onClick={handleAddDoc}>
                    {t('requests.requestDetail.adDoc')}
                    <InputBase
                      type='file'
                      ref={ref => auxAttachedDocument = ref}
                      onChange={handleUploadDocument}
                      style={{ display: 'none' }}
                    />
                  </Grid>

                </Grid>
              </Grid>
            </Grid> */}

            {/* <Grid container justifyContent='center'>
              <Grid container md={11}>
                <Grid container className={classes.containerChat}>
                  <Grid item className={classes.itemChat}>
                    CHAT
                  </Grid>
                  <Grid item className={classes.itemChat}>
                    <Grid>
                      {t('requests.requestDetail.adDoc1')}
                      {(requestDetail.documentList !== undefined && requestDetail.documentList.sentDocuments.length > 0 && requestDetail.documentList.sentDocuments.documentCode !== '.') ?
                        requestDetail.documentList.sentDocuments.length
                        :
                        0
                      }
                      {t('requests.requestDetail.adDoc2')}
                    </Grid>

                    <Grid item className={classes.itemChat1} onClick={handleViewDoc}>
                      {(requestDetail.documentList !== undefined && requestDetail.documentList.sentDocuments.length > 0 && requestDetail.documentList.sentDocuments.documentCode !== '.') &&
                        t('requests.requestDetail.see')
                      }
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid> */}

          </Grid>
        </Grid>
      </Grid>

      {/* 
      {showingDialog &&

        <DialogRequestDetail
          showingDialog={showingDialog}
          setShowingDialog={setShowingDialog}
          optionDialog={optionDialog}
          setOptionDialog={setOptionDialog}
          datosPeticion={datosPeticion}
          setDatosPeticion={setDatosPeticion}
          documentUpload={documentUpload}
          setDocumentUpload={setDocumentUpload}
          documentList={requestDetail.documentList.sentDocuments}
          fechaPeticion={requestDetail.createDate}

        />
      }
       */}
    </div>
  )
}

export default RequestDetail
