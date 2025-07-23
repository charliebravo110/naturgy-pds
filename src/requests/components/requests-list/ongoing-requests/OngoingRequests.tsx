import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { withRouter } from 'react-router'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import DynamicSearcher from '../../../../common/components/searcher/DynamicSearcher'
import Pagination from '../../../../common/components/pagination/Pagination2'

import XLSX from 'xlsx'

import List from './list/List'
import Mosaic from './mosaic/Mosaic'
import Spinner from '../../../../common/components/spinner/Spinner'

import { adminCheck } from '../../../../common/lib/ValidationLib'

import { setRequestsListData, setRequestsSupplyListData, setRequestsDossierListData } from '../../../store/actions/RequestsActions'
import { thunkGetCommunicationNotifications, thunkGetMasterData } from '../../../../provisions/store/actions/ProvisionsThunkActions'

import useStyles from './OngoingRequests.styles'
import requestRoleFilter from '../../request-filter/RequestFilter'
import Button from '../../../../common/components/button/Button'
import DialogReiteracion from '../../request-detail/dialog-reiteracion/DialogReiteracion'
import DialogNoReiterar from '../../request-detail/dialog-no-reiterar/DialogNoReiterar'
import { thunkGetEventsSr } from '../../../store/actions/RequestsThunkActions'
import { completeDate } from '../../../../common/lib/FormatLib'
import { isMobileApp } from '../../../../mobile-apps/common/detectPlatform'
import createFileAndOpenIt from '../../../../mobile-apps/local-downloads/createFileAndOpenIt'

// LCS: Importa la función - Wave 3
import { removeAccents, sendGAEvent, removeEmails } from '../../../../core/utils/gtm';

const OngoingRequests = (props: any) => {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    setIsLoading,
    requests,
    setLoadingRequestDetail,
    handleGetTypologyByCode,
    setShowingRequestDetail,
    setRequestData,
    history,
    dossierStatusId,
    loadingRequestsList
  } = props

  const [filterList, setFilterList] = useState([])

  useEffect(() => {
    dispatch(thunkGetMasterData(
      'SERVICE_REQUEST_FILTERS',
      'ES',
      'FILTERS',
      (response) => {
        if (response && response.length > 0) {
          setFilterList(response[0].value.split(';'))
        }
      }
    ))
  }, [])


  const [requestsList, setRequestsList] = useState(
    window.location.pathname === '/requests' ? (
      requestRoleFilter(requests.list.filter(item => item.status === 'EN CURSO'), filterList)
    ) : (
      window.location.pathname === '/supplies/detail' ?
        requestRoleFilter(requests.supplyList.filter(item => item.status === 'EN CURSO'), filterList)
        : (
          window.location.pathname === '/provisions/detail' ?
            requestRoleFilter(requests.dossierList.filter(item => item.status === 'EN CURSO'), filterList)
            :
            [] as any
        )
    )
  )

  useEffect(() => {
    if (filterList.length > 0) {
      setRequestsList(
        window.location.pathname === '/requests' ? (
          requestRoleFilter(requests.list.filter(item => item.status === 'EN CURSO'), filterList)
        ) : (
          window.location.pathname === '/supplies/detail' ?
            requestRoleFilter(requests.supplyList.filter(item => item.status === 'EN CURSO'), filterList)
            : (
              window.location.pathname === '/provisions/detail' ?
                requestRoleFilter(requests.dossierList.filter(item => item.status === 'EN CURSO'), filterList)
                :
                [] as any
            )
        )
      )
    }
  }, [filterList])

  useEffect(() => {
    if (requestsList.length > 0) {
      setFinalList(requestsList)
    }
  }, [requestsList])

  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [totalPages, setTotalPages] = useState(0)
  const [finalList, setFinalList] = useState(requestsList)
  const [showPopup, setShowPopup] = useState(false)
  const [isLoadingReiteration, setIsLoadingReiteration] = useState(false)
  const [showPopupNoReiterar, setShowPopupNoReiterar] = useState(false)

  const docNumber = useSelector((state: any) => state.user.profile.documentNumber)
  const [codSR, setCodSR] = useState('')

  const user = useSelector((state: any) => state.user.profile)

  useEffect(() => {
    if (finalList.length > 20) {
      setTotalPages(requestsList.length === 0 ? 1 : Math.ceil(requestsList.length / rowsPerPage))
    } else {
      setTotalPages(1)
    }
  }, [requestsList, rowsPerPage, finalList])

  const [searchingRequestsList, setSearchingRequestsList] = useState(false)

  const handleSearch = (value) => {
    let list = [] as any

    if (window.location.pathname === '/requests') {
      list = requestRoleFilter(requests.list.filter(item => item.status === 'EN CURSO'), filterList)
    } else if (window.location.pathname === '/supplies/detail') {
      list = requestRoleFilter(requests.supplyList.filter(item => item.status === 'EN CURSO'), filterList)
    } else if (window.location.pathname === '/provisions/detail') {
      list = requestRoleFilter(requests.dossierList.filter(item => item.status === 'EN CURSO'), filterList)
    }

    const matches = list.filter(request => (
      (request.codSR && request.codSR.toLowerCase().includes(value.toLowerCase())) ||
      (request.cupsOrDossierNumber && request.cupsOrDossierNumber.toLowerCase().includes(value.toLowerCase())) ||
      (request.address && request.address.toLowerCase().includes(value.toLowerCase())) ||
      (request.requestType && request.requestType.toLowerCase().includes(value.toLowerCase())) ||
      (request.createDate && request.createDate.toLowerCase().includes(value.toLowerCase()))
    ))

    if (value === '') {
      setSearchingRequestsList(false)

      setTotalPages(requestsList.length === 0 ? 1 : Math.ceil(requestsList.length / rowsPerPage))
    } else {
      setSearchingRequestsList(true)

      setTotalPages(matches.length === 0 ? 1 : Math.ceil(matches.length / rowsPerPage))
    }

    setRequestsList(matches)
  }

  const handleChangePage = (number) => {
    setCurrentPage(number)
  }

  const handleClickButton = (request) => {
    if (request.indRead === 0) {
      if (!adminCheck()) {
        setIsLoading ? setIsLoading(true) : setLoadingRequestDetail(true)

        const date = request.createDate && request.createDate.split('/')

        // formateamos la fecha de dd/mm/yyyy a yyyymmddhhmmss
        const formattedDate = date && (date[2] + '' + date[1] + '' + date[0] + '000000')

        const auxList = [{
          type: 'REQUEST',
          code: request.codSR,
          date: formattedDate,
          indRead: 1
        }] as any

        dispatch(thunkGetCommunicationNotifications(auxList, (response) => {
          let auxRequest = {} as any

          if (response) {
            // actualizar el elemento en requestsList
            let requestItem
            let supplyRequestItem
            let dossierRequestItem

            let requestItemIndex
            let supplyRequestItemIndex
            let dossierRequestItemIndex

            if (window.location.pathname === '/requests') {
              requestItem = requests.list.find(i => i.codSR === request.codSR)

              requestItemIndex = requests.list.indexOf(requestItem)

              dispatch(setRequestsListData({ indRead: 1 }, requestItemIndex))
            } else if (window.location.pathname === '/supplies/detail' || window.location.pathname === '/provisions/detail') {
              requestItem = requestRoleFilter(requests.list.find(i => i.codSR === request.codSR), filterList)

              requestItemIndex = requests.list.indexOf(requestItem)

              dispatch(setRequestsListData({ indRead: 1 }, requestItemIndex))

              if (window.location.pathname === '/supplies/detail') {
                supplyRequestItem = requestRoleFilter(requests.supplyList.find(i => i.codSR === request.codSR), filterList)

                supplyRequestItemIndex = requests.supplyList.indexOf(supplyRequestItem)

                dispatch(setRequestsSupplyListData({ indRead: 1 }, supplyRequestItemIndex))
              } else if (window.location.pathname === '/provisions/detail') {
                dossierRequestItem = requestRoleFilter(requests.dossierList.find(i => i.codSR === request.codSR), filterList)

                dossierRequestItemIndex = requests.dossierList.indexOf(dossierRequestItem)

                dispatch(setRequestsDossierListData({ indRead: 1 }, dossierRequestItemIndex))
              }
            }

            auxRequest = {
              ...request,
              indRead: 1
            }
          } else {
            auxRequest = request
          }

          setRequestData(auxRequest)

          setShowingRequestDetail(true)

          setIsLoading ? setIsLoading(false) : setLoadingRequestDetail(false)
        }))
      } else {
        setRequestData(request)

        setShowingRequestDetail(true)
      }
    } else {
      setRequestData(request)

      setShowingRequestDetail(true)
    }
  }

  const handleClickViewButton = (request) => {
    // LCS - Envío evento GdC - Wave 3
    var requestTypeAux = ''
    requestTypeAux = dossierStatusId.find(i => i.key === request.tipology) ? dossierStatusId.find(i => i.key === request.tipology).value : 'no aplica'
    requestTypeAux = removeAccents(requestTypeAux.toLowerCase())

    sendGAEvent({
      event: 'consult_request',
      section_name: 'mis peticiones',  
      click_text: 'ver',
      elemet_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      click_url: window.location.origin + '/requests/detail',
      cups: request.cups != '' ? request.cups : 'no aplica',
      tab_name: request.status == 'CERRADA' ? 'peticiones cerradas' : 'peticiones en curso',
      request_code: request.codSR,
      browsing_type: sessionStorage.getItem('browsing_type'),
      request_type: requestTypeAux
    });

    if (request.indRead === 0) {
      if (!adminCheck()) {
        setIsLoading ? setIsLoading(true) : setLoadingRequestDetail(true)

        const date = request.createDate && request.createDate.split('/')

        // formateamos la fecha de dd/mm/yyyy a yyyymmddhhmmss
        const formattedDate = date && (date[2] + '' + date[1] + '' + date[0] + '000000')

        const auxList = [{
          type: 'REQUEST',
          code: request.codSR,
          date: formattedDate,
          indRead: 1
        }] as any

        dispatch(thunkGetCommunicationNotifications(auxList, (response) => {
          let auxRequest = {} as any

          if (response) {
            // actualizar el elemento en requestsList
            let requestItem
            let supplyRequestItem
            let dossierRequestItem

            let requestItemIndex
            let supplyRequestItemIndex
            let dossierRequestItemIndex

            if (window.location.pathname === '/requests') {
              requestItem = requestRoleFilter(requests.list.find(i => i.codSR === request.codSR), filterList)

              requestItemIndex = requests.list.indexOf(requestItem)

              dispatch(setRequestsListData({ indRead: 1 }, requestItemIndex))
            } else if (window.location.pathname === '/supplies/detail' || window.location.pathname === '/provisions/detail') {
              requestItem = requestRoleFilter(requests.list.find(i => i.codSR === request.codSR), filterList)

              requestItemIndex = requests.list.indexOf(requestItem)

              dispatch(setRequestsListData({ indRead: 1 }, requestItemIndex))

              if (window.location.pathname === '/supplies/detail') {
                supplyRequestItem = requestRoleFilter(requests.supplyList.find(i => i.codSR === request.codSR), filterList)

                supplyRequestItemIndex = requests.supplyList.indexOf(supplyRequestItem)

                dispatch(setRequestsSupplyListData({ indRead: 1 }, supplyRequestItemIndex))
              } else if (window.location.pathname === '/provisions/detail') {
                dossierRequestItem = requestRoleFilter(requests.dossierList.find(i => i.codSR === request.codSR), filterList)

                dossierRequestItemIndex = requests.dossierList.indexOf(dossierRequestItem)

                dispatch(setRequestsDossierListData({ indRead: 1 }, dossierRequestItemIndex))
              }
            }

            auxRequest = {
              ...request,
              indRead: 1
            }
          } else {
            auxRequest = request
          }

          setIsLoading ? setIsLoading(false) : setLoadingRequestDetail(false)

          history.push({
            pathname: '/requests/detail',
            state: {
              request: auxRequest
            }
          })
        }))
      } else {
        history.push({
          pathname: '/requests/detail',
          state: {
            request
          }
        })
      }
    } else {
      history.push({
        pathname: '/requests/detail',
        state: {
          request
        }
      })
    }
  }

  useEffect(() => {
    let list = [] as any

    if (window.location.pathname === '/requests') {
      list = requestRoleFilter(requests.list.filter(item => item.status === 'EN CURSO'), filterList)
    } else if (window.location.pathname === '/supplies/detail') {
      list = requestRoleFilter(requests.supplyList.filter(item => item.status === 'EN CURSO'), filterList)
    } else if (window.location.pathname === '/provisions/detail') {
      list = requestRoleFilter(requests.dossierList.filter(item => item.status === 'EN CURSO'), filterList)
    }

    setRequestsList(list)
  }, [requests.list, requests.supplyList, requests.dossierList])

  const handleDowloadSupliesList = () => {
    if (finalList) {
      let listData = [] as any
      finalList.map(
        (item) => {
          
          listData.push({
            requestCode: item.codSR ? item.codSR : '',
            chanel: item.channel ? item.channel : '',
            cupsOrDossierNumber: item.cups ? item.cups : (item.codExpedient ? item.codExpedient : ''),
            requestType: dossierStatusId.find(i => i.key === item.tipology) ? dossierStatusId.find(i => i.key === item.tipology).value : '',
            openDate: item.createDate ? item.createDate : '00/00/0000',
          })
        }
      )
      //funcion para descar un excel con la información de los suplipoints en un excel
      const wb = XLSX.utils.book_new()
      let ws
      //posa un JSON object a una pagina
      ws = XLSX.utils.json_to_sheet(listData, {
        header: [
          'requestCode',
          'chanel',
          'cupsOrDossierNumber',
          'requestType',
          'openDate',
        ]
      })
      ws['A1'].v = t('requests.requestsList.list.requestCode')
      ws['B1'].v = t('requests.requestsList.list.channel')
      ws['C1'].v = t('requests.requestsList.list.cupsOrDossierNumber')
      ws['D1'].v = t('requests.requestsList.list.requestType')
      ws['E1'].v = t('requests.requestsList.list.openDate')

      let fileName = 'MisPeticiones.xlsx'
      XLSX.utils.book_append_sheet(wb, ws, 'Peticiones abiertas')
      //crea el llibre 
      XLSX.writeFile(wb, fileName)

      // XLSX.writeFile will attempt to force a client-side download, works for web,
      // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
      if (isMobileApp()) createFileAndOpenIt({ fileName, contentAsBase64: XLSX.write(wb, { type: 'base64' }) })

      // LCS: Enviar evento de GdC a GA - Wave 3
      if(window.location.href.includes('provisions/detail')){        
        sendGAEvent({
          event: 'data_export',
          section_name: 'mi conexion a la red',
          subsection_name: 'detalle de solicitud',
          click_text: 'exportar datos',
          element_type: 'conversion de accion',
          page_url: removeEmails(window.location.href),
          request_number: props.location.state.dossierCod ? props.location.state.dossierCod : 'no aplica',
          request_status: sessionStorage.getItem('provisionDossierStatus'),
          tab_name: 'peticiones en curso',
          module_name: 'peticiones',
          browsing_type: sessionStorage.getItem('browsing_type'),
        });
      } else {
        sendGAEvent({
          event: 'data_export',
          section_name: 'mis peticiones',
          click_text: 'exportar datos',
          element_type: 'conversion de accion',
          page_url: removeEmails(window.location.href),
          tab_name: 'peticiones en curso',
          browsing_type: sessionStorage.getItem('browsing_type')
        });
      }
    }
  }

  const prepareReiterationPopup = (codSR) => {
    if (codSR && codSR !== '') {
      setCodSR(codSR)
      setShowPopup(true)
    }
  }

  const checkReiteracion = (request) => {
    if (request && request.codSR) {
      setIsLoadingReiteration(true)
      dispatch(thunkGetEventsSr(user.documentNumber, request.codSR, (response) => {
        if (response && response.events && response.events.length > 0) {
          const now = new Date()
          const lastWeek = now.getTime() - (7 * 24 * 60 * 60 * 1000)
          let hasReiteration = false
          const array = response.events
          
          array.map((item) => {
            if (item.eventTypeName === 'REITERACIÓN') {
              const auxFormattedDate = item.creationDateEvent ? item.creationDateEvent.substring(0, 10) : ''
              const formattedDate = auxFormattedDate ? auxFormattedDate.split('-')[0] + auxFormattedDate.split('-')[1] + auxFormattedDate.split('-')[2] : auxFormattedDate
              const formattedHour = item.creationDateEvent ? item.creationDateEvent.substring(11, 19).replaceAll(':', '') : ''
              const formattedDateAndHour = (formattedDate && formattedHour) ? formattedDate + formattedHour : ''
              if (formattedDateAndHour && formattedDateAndHour !== '') {
                const date = new Date(completeDate(formattedDateAndHour))
                if (date.getTime() >= lastWeek) { 
                  hasReiteration = true
                }
              }
            }
          })
          if (hasReiteration) {
            setShowPopupNoReiterar(true)
          }
          else {
            prepareReiterationPopup(request.codSR)
          }
        }
        setIsLoadingReiteration(false)
      }))
    }
  }

  return (
    <>
      {
        isLoadingReiteration &&
        <Spinner fixed />
      }
      <Grid container alignItems='center' className={classes.searcher}>
        <Grid item className={classes.mobileFullWidth2}>
          <Button
            text={t('provisions.provisionsList.exportarData')}
            color={'primary'}
            variant={'contained'}
            className={classes.exportButton}
            onClick={handleDowloadSupliesList}
            disabled={loadingRequestsList}
          />
        </Grid>

        <Grid item className={classes.mobileFullWidth}>
          <DynamicSearcher
            label={t('provisions.provisionsList.searcher')}
            finalList={finalList}
            setFinalList={setFinalList}
            listItems={requestsList}
            subtype={'peticion'}
            setCurrentPage={setCurrentPage}
          />
          {/*<Searcher
            handleChangeSearch={handleChangeSearch}
            handleSearch={handleSearch}
            setSearchValue={handleChangeSearch}
          />*/}
        </Grid>
      </Grid>

      {
        mobile ?
          <Mosaic
            requestsList={finalList}
            searchingRequestsList={searchingRequestsList}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            handleGetTypologyByCode={handleGetTypologyByCode}
            handleClickButton={handleClickButton}
            handleClickViewButton={handleClickViewButton}
            dossierStatusId={dossierStatusId}
            checkReiteracion={checkReiteracion}
          />
          :
          <List
            requestsList={finalList}
            setFinalList={setFinalList}
            searchingRequestsList={searchingRequestsList}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            handleGetTypologyByCode={handleGetTypologyByCode}
            handleClickButton={handleClickButton}
            handleClickViewButton={handleClickViewButton}
            dossierStatusId={dossierStatusId}
            checkReiteracion={checkReiteracion}
          />
      }

      { showPopup &&
        <DialogReiteracion
          showingDialog={showPopup}
          setShowingDialog={setShowPopup}
          user={user}
          codSR={codSR}
          setIsLoading={setLoadingRequestDetail}
        />
      }

      {showPopupNoReiterar &&
        <DialogNoReiterar 
          showingDialog={showPopupNoReiterar}
          setShowingDialog={setShowPopupNoReiterar}
        />
      }
    </>
  )
}

export default withRouter(OngoingRequests)
