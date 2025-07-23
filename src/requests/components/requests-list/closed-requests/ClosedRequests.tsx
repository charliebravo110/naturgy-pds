import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { withRouter } from 'react-router'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Grid from '@material-ui/core/Grid'

import DynamicSearcher from '../../../../common/components/searcher/DynamicSearcher'

import XLSX from 'xlsx'

import List from './list/List'
import Mosaic from './mosaic/Mosaic'

import { adminCheck } from '../../../../common/lib/ValidationLib'

import { setRequestsListData, setRequestsSupplyListData, setRequestsDossierListData } from '../../../store/actions/RequestsActions'
import { thunkGetCommunicationNotifications, thunkGetMasterData } from '../../../../provisions/store/actions/ProvisionsThunkActions'

import useStyles from './ClosedRequests.styles'
import requestRoleFilter from '../../request-filter/RequestFilter'
import Button from '../../../../common/components/button/Button'
import { isMobileApp } from '../../../../mobile-apps/common/detectPlatform'
import createFileAndOpenIt from '../../../../mobile-apps/local-downloads/createFileAndOpenIt'

// LCS: Importa la función - Wave 3
import { removeAccents, sendGAEvent, removeEmails } from '../../../../core/utils/gtm';

const ClosedRequests = (props: any) => {
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
      requestRoleFilter(requests.list.filter(item => item.status === 'CERRADA'), filterList)
    ) : (
      window.location.pathname === '/supplies/detail' ?
        requestRoleFilter(requests.supplyList.filter(item => item.status === 'CERRADA'), filterList)
        : (
          window.location.pathname === '/provisions/detail' ?
            requestRoleFilter(requests.dossierList.filter(item => item.status === 'CERRADA'), filterList)
            :
            [] as any
        )
    )
  )

  useEffect(() => {
    if (filterList.length > 0) {
      setRequestsList(
        window.location.pathname === '/requests' ? (
          requestRoleFilter(requests.list.filter(item => item.status === 'CERRADA'), filterList)
        ) : (
          window.location.pathname === '/supplies/detail' ?
            requestRoleFilter(requests.supplyList.filter(item => item.status === 'CERRADA'), filterList)
            : (
              window.location.pathname === '/provisions/detail' ?
                requestRoleFilter(requests.dossierList.filter(item => item.status === 'CERRADA'), filterList)
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
      list = requestRoleFilter(requests.list.filter(item => item.status === 'CERRADA'), filterList)
    } else if (window.location.pathname === '/supplies/detail') {
      list = requestRoleFilter(requests.supplyList.filter(item => item.status === 'CERRADA'), filterList)
    } else if (window.location.pathname === '/provisions/detail') {
      list = requestRoleFilter(requests.dossierList.filter(item => item.status === 'CERRADA'), filterList)
    }

    const matches = list.filter(request => (
      (request.codSR && request.codSR.toLowerCase().includes(value.toLowerCase())) ||
      (request.cups && request.cups.toLowerCase().includes(value.toLowerCase())) ||
      (request.codExpedient && request.codExpedient.toLowerCase().includes(value.toLowerCase())) ||
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
      list = requestRoleFilter(requests.list.filter(item => item.status === 'CERRADA'), filterList)
    } else if (window.location.pathname === '/supplies/detail') {
      list = requestRoleFilter(requests.supplyList.filter(item => item.status === 'CERRADA'), filterList)
    } else if (window.location.pathname === '/provisions/detail') {
      list = requestRoleFilter(requests.dossierList.filter(item => item.status === 'CERRADA'), filterList)
    }
    setRequestsList(list)
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
              closeDate: item.closingDate ? item.closingDate : '00/00/0000'
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
            'closeDate',
          ]
        })
        ws['A1'].v = t('requests.requestsList.list.requestCode')
        ws['B1'].v = t('requests.requestsList.list.channel')
        ws['C1'].v = t('requests.requestsList.list.cupsOrDossierNumber')
        ws['D1'].v = t('requests.requestsList.list.requestType')
        ws['E1'].v = t('requests.requestsList.list.openDate')
        ws['F1'].v = t('requests.requestsList.list.closeDate')

        let fileName = 'MisPeticiones.xlsx'
        XLSX.utils.book_append_sheet(wb, ws, 'Peticiones cerradas')
        //crea el llibre 
        XLSX.writeFile(wb, fileName)

        // XLSX.writeFile will attempt to force a client-side download, works for web,
        // for mobile apps blob downloads do not work ATM, code below is an alternative, (hover createFileAndOpenIt for jsdoc).
        if (isMobileApp()) createFileAndOpenIt({ fileName, contentAsBase64: XLSX.write(wb, { type: 'base64' }) })
        
        // LCS: Enviar evento de GdC a GA - Wave 3
        sendGAEvent({
          event: 'data_export',
          section_name: 'mis peticiones',
          click_text: 'exportar datos',
          element_type: 'conversion de accion',
          page_url: removeEmails(window.location.href),
          tab_name: 'peticiones cerradas',
          browsing_type: sessionStorage.getItem('browsing_type')
        });
      }
    }
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
            closeDate: item.closingDate ? item.closingDate : '00/00/0000'
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
          'closeDate',
        ]
      })
      ws['A1'].v = t('requests.requestsList.list.requestCode')
      ws['B1'].v = t('requests.requestsList.list.channel')
      ws['C1'].v = t('requests.requestsList.list.cupsOrDossierNumber')
      ws['D1'].v = t('requests.requestsList.list.requestType')
      ws['E1'].v = t('requests.requestsList.list.openDate')
      ws['F1'].v = t('requests.requestsList.list.closeDate')

      let fileName = 'MisPeticiones.xlsx'
      XLSX.utils.book_append_sheet(wb, ws, 'Peticiones cerradas')
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
          request_number: requests.dossierList[0].codExpedient ? requests.dossierList[0].codExpedient : 'no aplica',
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
          tab_name: 'peticiones cerradas',
          browsing_type: sessionStorage.getItem('browsing_type')
        });
      }
    }
  }

  return (
    <>
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
          />
      }
    </>
  )
}

export default withRouter(ClosedRequests)
