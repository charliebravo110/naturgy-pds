import React, { useState, useEffect } from 'react'
import { pdf } from '@react-pdf/renderer'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'

import DocumentPDF from './document-pdf/DocumentPDF'

import Spinner from '../../../../common/components/spinner/Spinner'

import ListItem from './list-item/ListItem'
import MosaicItem from './mosaic-item/MosaicItem'

import NoItemsIcon from '../../../../assets/icons/aviso_alerta_pop_up.svg'

import { thunkGetMasterData } from '../../../store/actions/ProvisionsThunkActions'

import { setCurrentProvision } from '../../../store/actions/ProvisionsActions'
import { thunkUpdateDossier } from '../../../store/actions/ProvisionsThunkActions'

import useStyles, { StyledTableCell } from './ActivitiesList.styles'
import { TableSortLabel } from '@material-ui/core'
import { convertToFullDate } from '../../../../common/lib/FormatLib';
import { isMobileApp, isWeb } from '../../../../mobile-apps/common/detectPlatform'
import createFileAndOpenIt from '../../../../mobile-apps/local-downloads/createFileAndOpenIt'

const ActivitiesList = (props: any) => {
  const classes = useStyles({})
  const theme = useTheme()
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const mobile = useMediaQuery(theme.breakpoints.down('sm'))

  const user = useSelector((state: any) => state.user.profile)
  const provisions = useSelector((state: any) => state.provisions)
  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)

  const { setLoading } = props

  const [ isLoading, setIsLoading ] = useState(false)

  const activitiesList = useSelector((state: any) => state.provisions.currentProvision.activitiesList)
  const communicationList = useSelector((state: any) => state.provisions.currentProvision.communicationList)

  const [ documentIsReady, setDocumentIsReady ] = useState(false)

  const [ filteredActivitiesList, setFilteredActivitiesList ] = useState([] as any)
  const [ filteredActivitiesListToShow, setFilteredActivitiesListToShow ] = useState([] as any)

  const [ currentPage, setCurrentPage ] = useState(1)
  const [ subjectTypes, setSubjectTypes ] = useState([] as any)

  const [showDateArrow, setShowDateArrow] = useState(false)
  const [directionCode, setDirectionCode] = useState('desc')
  const [orderByDateAsc, setOrderByDateAsc] = useState(false)
  const [showActionArrow, setShowActionArrow] = useState(false)
  const [orderByActionAsc, setOrderByActionAsc] = useState(false)


  const [ list, setList ] = useState((provisions.currentProvision.communicationList && provisions.currentProvision.communicationList.length > 0) ? provisions.currentProvision.communicationList : [] as any)

  const rowsPerPage = 6

  const [ actualDate, setActualDate ] = useState('')

  const customFormatDate = () => {
    const year = new Date().getFullYear()
    let month = (new Date().getMonth()+1).toString()
    let day = (new Date().getDate()).toString()

    if (month.length === 1) {
      month = '0' + month
    }
    if (day.length === 1) {
      day = '0' + day
    }

    const date = (day + '/' + month + '/' + year)    
    setActualDate(date)
  }

  const filterActivities = async () => {

    if (communicationList && communicationList.length > 0) {
      const filteredCommunicationList = communicationList.filter((communication) => {
        if (communication.idCommunicationType === 'COMTYP304' || communication.idCommunicationType === 'COMTYP305' || communication.idCommunicationType === 'COMTYP306') {
          return communication
        }
      })

      if (filteredCommunicationList.length > 0) {
        filteredCommunicationList.map((communication) => {
          communication.activityDate = communication.sendDate
          activitiesList.push(communication)
        })
      }
    }

    let admittedRequest = false
    let ppExpired = false
    let recordCharged = false
    
    const filteredActivities = await activitiesList.filter((activity, index) => {

      if (index === 0) {
        activity.message = t('provisions.provisionsDetails.activitiesList.table.registerRequest')
      } 
      else if (activity.idActivity === 'ACTTYPE017' || activity.idActivity === 'ACTTYPE001') {
        if (activity.idActivity === 'ACTTYPE001' && activity.dossierStatusId === 'STATUS0100') {
          if (activity.comments.search('PENDIENTE DOCUMENTACION') !== -1) {
            activity.message = t('provisions.provisionsDetails.activitiesList.table.documentationAttached')
          }
          else if (activity.comments.search('SUBSANA') !== -1) {
            activity.message = t('provisions.provisionsDetails.activitiesList.table.pendingDocumentationAttached')
          }
        } 
        else if (activity.idActivity === 'ACTTYPE001' && activity.dossierStatusId === 'STATUS0101') {
          activity.message = t('provisions.provisionsDetails.activitiesList.table.correctionRequested')
        }
        else if (activity.idActivity === 'ACTTYPE001' && activity.dossierStatusId === 'STATUS0010' && !admittedRequest) {        
          activity.message = t('provisions.provisionsDetails.activitiesList.table.admittedRequest') + formatDateAndTime(currentProvision.priorityDate)
          admittedRequest = true
        }
        else if (activity.idActivity === 'ACTTYPE001' && activity.dossierStatusId === 'STATUS0094') {
          activity.message = t('provisions.provisionsDetails.activitiesList.table.requestDenied')
        }
        else if (activity.idActivity === 'ACTTYPE001' && activity.dossierStatusId === 'STATUS0102') {
          activity.message = t('provisions.provisionsDetails.activitiesList.table.requestInadmissible')
        }
        else if (activity.idActivity === 'ACTTYPE001' && activity.dossierStatusId === 'STATUS0098') {
          activity.message = t('provisions.provisionsDetails.activitiesList.table.requestCancelled')
        }
        else if (activity.idActivity === 'ACTTYPE001' && activity.dossierStatusId === 'STATUS0040') {
          recordCharged = true
          // activity.message = t('provisions.provisionsDetails.activitiesList.table.recordCharged')
        }

        else if (activity.idActivity === 'ACTTYPE017' && activity.dossierStatusId === 'PREPRCOD2') {
          if (!recordCharged) {
            activity.message = t('provisions.provisionsDetails.activitiesList.table.previousProposalSent')
          }          
        }
        else if (activity.idActivity === 'ACTTYPE017' && activity.dossierStatusId === 'PREPRCOD4') {
          activity.message = t('provisions.provisionsDetails.activitiesList.table.previousProposalSent2')
        }
        else if (activity.idActivity === 'ACTTYPE017' && activity.dossierStatusId === 'PREPRCOD5') {
          activity.message = t('provisions.provisionsDetails.activitiesList.table.previousProposalAccepted')
        }
        else if (activity.idActivity === 'ACTTYPE017' && activity.dossierStatusId === 'PREPRCOD3') {
          activity.message = t('provisions.provisionsDetails.activitiesList.table.previousProposalRequest')
        }
        else if (activity.idActivity === 'ACTTYPE017' && activity.dossierStatusId === 'PREPRCOD8') {
          activity.message = t('provisions.provisionsDetails.activitiesList.table.previousProposalRejected')
        }
        else if (activity.idActivity === 'ACTTYPE017' && activity.dossierStatusId === 'PREPRCOD6') {
          activity.message = t('provisions.provisionsDetails.activitiesList.table.tenPercentPayment')
        }
        else if (activity.idActivity === 'ACTTYPE017' && activity.dossierStatusId === 'PREPRCOD9') {
          ppExpired = true
          activity.message = t('provisions.provisionsDetails.activitiesList.table.previousProposalExpired')
        }
        else if (activity.idActivity === 'ACTTYPE017' && activity.dossierStatusId === 'PREPRCOD1' && ppExpired) {          
          activity.message = t('provisions.provisionsDetails.activitiesList.table.admittedRequest') + formatDateAndTime(currentProvision.priorityDate)
        }
      }
      else if (activity.idCommunicationType === 'COMTYP304' || activity.idCommunicationType === 'COMTYP305') {
        activity.message = t('provisions.provisionsDetails.activitiesList.table.permissionsSent')
      }
      else if (activity.idCommunicationType === 'COMTYP306') {
        activity.message = t('provisions.provisionsDetails.activitiesList.table.notificationsSent')
      }

      if (activity.message !== undefined) {
        return activity
      }
    })

    // const filteredActivities2 = await filteredActivities.map((activity) => {
      
    // })

    const result = filteredActivities.sort(function(a, b) {
      return new Date(parseInt(a.activityDate)).getTime() - new Date(parseInt(b.activityDate)).getTime()
    })

    setFilteredActivitiesList(result)
    setFilteredActivitiesListToShow(result)
  }

  const handleSearch = (value) => {
    const allCommunications = provisions.currentProvision.communicationList || [] as any

    if (value) {
      const matches = allCommunications.filter(item => {
        const subject = subjectTypes.find(i => i.key === item.idCommunicationType) && subjectTypes.find(i => i.key === item.idCommunicationType).value

        return subject.toLowerCase().includes(value.toLowerCase()) && item
      })

      setList(matches)
    } else {
      setList(allCommunications)
    }
  }

  const resetFilters = () => {

    setShowActionArrow(false)
    setShowDateArrow(false)
    setOrderByActionAsc(false)
    setOrderByDateAsc(false)

  }

  const orderByDate = () => {
    resetFilters()
    setShowActionArrow(false)
    setShowDateArrow(true)
    if (orderByDateAsc) {
      setFilteredActivitiesListToShow(
        filteredActivitiesList.sort(function (a, b) {
          return new Date(convertToFullDate(b.activityDate)).getTime() - new Date(convertToFullDate(a.activityDate)).getTime();
        })
      )
      setOrderByDateAsc(false);
      setDirectionCode('asc');
    } else {
      setFilteredActivitiesListToShow(
        filteredActivitiesList.sort(function (a, b) {
          return new Date(convertToFullDate(a.activityDate)).getTime() - new Date(convertToFullDate(b.activityDate)).getTime();
        })
      )
      setOrderByDateAsc(true);
      setDirectionCode('desc');
    }
  }
  
  const orderByAction = () => {
    resetFilters()
    setShowActionArrow(true)
    setShowDateArrow(false)
    if (orderByActionAsc) {
      setFilteredActivitiesListToShow([].concat(filteredActivitiesListToShow).sort().reverse())
      setOrderByActionAsc(false)
      setDirectionCode('asc')
    } else {
      setFilteredActivitiesListToShow([].concat(filteredActivitiesListToShow).sort((a, b) => a.message.localeCompare(b.message)))
      setOrderByActionAsc(true)
      setDirectionCode('desc')
    }
  }

  useEffect(() => {
    if (subjectTypes.length === 0) {
      setLoading(true)

      dispatch(thunkGetMasterData('COMMUNICATIONS_TYPE', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), 'COMTYP', (response) => {
        if (response) {
          setSubjectTypes(response)
        }

        setLoading(false)
      }))
    }
  // eslint-disable-next-line
  filterActivities()
  customFormatDate()
  }, [])

  useEffect(() => {
    if (provisions.currentProvision && 
        provisions.currentProvision.communicationList && 
        provisions.currentProvision.communicationList.length > 0) {
        
        let sortedDocumentList = provisions.currentProvision.communicationList.sort(function (a,b){
        
        if (a.sendDate > b.sendDate) {
          return -1
        }
        if (a.sendDate < b.sendDate) {
          return 1
        }
        return 0
      })
      setList(sortedDocumentList)
    } else {
      setList(provisions.currentProvision.communicationList)
    }
  // eslint-disable-next-line
  }, [ provisions.currentProvision ])

  const handleDownload = () => {
    // setLoading(true)

    setDocumentIsReady(true)

    // setLoading(false)
  }

  const downloadDocument = async () => {
    const blob = await pdf(
      <DocumentPDF
        user={user}
        actualDate={actualDate}
        data={filteredActivitiesListToShow}
        currentProvision={currentProvision}
        rowsPerPage={6}
      />
    ).toBlob()

    const pdfUrl = window.URL.createObjectURL(blob)

    const tempLink = document.createElement('a')
    const fileName = 'activities.pdf'

    if (isWeb()) {
      const tempLink = document.createElement('a')
      tempLink.href = pdfUrl
      tempLink.setAttribute('download', fileName)
      tempLink.click()
    } else {
      // downloadLink.click() will attempt to force a client-side download, works for web,
      // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
      createFileAndOpenIt({ fileName, contentAsBlob: blob })
    }

    handleUploadDocument(blob)
  }

  const getBase64 = (file, cb) => {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
        cb(reader.result)
    }
    reader.onerror = (error) => {
        console.error('Error: ', error)
    }
  }

  const handleUploadDocument = (doc) => {
    const document = doc

    let date: any

    date = new Date()

    const auxDate = date.getDate() + '/' + parseInt(date.getMonth() + 1) + '/' + date.getFullYear()

    getBase64(document, (result) => {
      const base64 = result.substring(result.indexOf('base64,') + 7, result.length)

      // Thunk de subida del archivo de este objeto
      const data = {
        dossierCod: currentProvision.dossierCod,
        email: currentProvision.email,
        applicant: {
          docNumber: user.documentNumber
        },
        documentList: {
          document: [
            {
              nombre: 'lista_actividades.pdf',
              extension: '.pdf',
              tipoMime: document.type,
              carpeta: '/Documentos/ZEUDOCUWBS02',
              tipo: 'ZEUDOCUWBS02',
              contenido: base64,
              documentDesc: 'RESGUARDO ACREDITATIVO',
              comment: 'RESGUARDO ACREDITATIVO',
              metadatos: [
                {
                  nombre: 'codigo_tipo',
                  valor: 'DOCTYP0331'
                },
                {
                  nombre: 'cod_expediente',
                  valor: currentProvision.dossierCod
                }
              ]
            }
          ]
        }
      }

      setIsLoading(true)

      dispatch(thunkUpdateDossier(currentProvision.dossierCod, true, data, (response) => {
        if (response && response.dossier) {
          dispatch(setCurrentProvision({
            ...currentProvision,
            dossierStatusId: response.dossier.dossierStatusId,
            documentList: response.dossier.documentList
          }))
        }

        setIsLoading(false)
      }))
    })
  }

  const formatDateAndTime = (date) => {
    if (date) {
      const year = date.substring(0, 4)
      const month = date.substring(4, 6)
      const day = date.substring(6, 8)
      const hour = date.substring(8, 10)
      const min = date.substring(10, 12)
      const sec = date.substring(12, 14)
      return (day + '/' + month + '/' + year + ' ' + hour + ':' + min + ':' + sec)
    }
  }

  useEffect(() => {
    if (documentIsReady) {
      downloadDocument()
    }
  // eslint-disable-next-line
  }, [ documentIsReady ])

  return (
    <>
      <Grid container justifyContent='center' alignItems='center'>
        {
          isLoading &&
            <Spinner />
        }
        <Grid item container xs={11} md={10} className={classes.container}>
          <Grid item className={classes.title}>
            {t('provisions.provisionsDetails.activitiesList.title')}
          </Grid>

          <Grid container className={classes.block} direction='column'>
            <Grid container direction='column'>
              <Grid item className={classes.subtitle}>
                {t('provisions.provisionsDetails.activitiesList.subtitle')}
              </Grid>

              <Grid item className={classes.suggestionText}>
                {t('provisions.provisionsDetails.activitiesList.suggestionText')}
              </Grid>
            </Grid>

            <div className={classes.separator} />

            <Grid container justifyContent='space-between' alignItems='center'>
              <Grid item>            
                <div onClick={handleDownload} className={classes.button2}>{t('provisions.provisionsDetails.activitiesList.button')}</div>
              </Grid>
              <Grid item>
                <label className={classes.suggestionText}>{t('provisions.provisionsDetails.activitiesList.lastUpdate') + ' ' + actualDate}</label>
              </Grid>
            </Grid>

            {
              (!filteredActivitiesListToShow || (filteredActivitiesListToShow && filteredActivitiesListToShow.length === 0)) ?
                <Grid container className={classes.noItems}>
                  <Grid item>
                    <img src={NoItemsIcon} alt='' />

                    <Grid className={classes.text}>
                      {t('provisions.provisionsDetails.activitiesList.noItems')}
                    </Grid>
                  </Grid>
                </Grid>
              :
                mobile ?
                  <Grid container className={classes.mosaicContainer}>
                    {
                      // filteredActivitiesListToShow && filteredActivitiesListToShow.slice(
                      //   (currentPage - 1) * rowsPerPage,
                      //   currentPage * rowsPerPage
                      filteredActivitiesListToShow && 
                      filteredActivitiesListToShow.map(item => (
                        <MosaicItem
                          key={item.activityDate}
                          // read={item.indRead}
                          // subject={subjectTypes.find(i => i.key === item.idCommunicationType) ? subjectTypes.find(i => i.key === item.idCommunicationType).value : ''}
                          subject={item.message}
                          date={item.activityDate}
                          // attachment={item.documentumId}
                          setLoading={setLoading}
                        />
                      ))
                    }
                  </Grid>
                :
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>

                        <StyledTableCell>
                          {t('provisions.provisionsDetails.activitiesList.table.col1')}
                          <TableSortLabel
                            active={showDateArrow}
                            direction={directionCode === 'asc' ? 'asc' : 'desc'}
                            onClick={orderByDate}
                          />
                        </StyledTableCell>

                        <StyledTableCell>
                          {t('provisions.provisionsDetails.activitiesList.table.col2')}
                          <TableSortLabel
                            active={showActionArrow}
                            direction={directionCode === 'asc' ? 'asc' : 'desc'}
                            onClick={orderByAction}
                          />
                        </StyledTableCell>

                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {
                        // filteredActivitiesListToShow && filteredActivitiesListToShow.slice(
                        //   (currentPage - 1) * rowsPerPage,
                        //   currentPage * rowsPerPage
                        filteredActivitiesListToShow && 
                        filteredActivitiesListToShow.map(item => (
                          <ListItem
                            key={item.activityDate}
                            // read={item.indRead}
                            // subject={subjectTypes.find(i => i.key === item.idCommunicationType) ? subjectTypes.find(i => i.key === item.idCommunicationType).value : ''}
                            subject={item.message}
                            date={item.activityDate}
                            // attachment={item.documentumId}
                            setLoading={setLoading}
                          />
                        ))
                      }
                    </TableBody>
                  </Table>
            }
          </Grid>
        </Grid>
      </Grid>

    </>
  )
}
export default ActivitiesList
