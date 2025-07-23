import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'

import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Grid from '@material-ui/core/Grid'

import useStyles, { StyledTableCell } from './List.styles'
import { adminCheck } from '../../../../../common/lib/ValidationLib';
import Pagination from '../../../../../common/components/pagination/Pagination2'
import campanaIcono from '../../../../../assets/icons/camapana.svg'
import { completeDate } from '../../../../../common/lib/FormatLib'
import Tooltip from '../../../../../common/components/tooltip/Tooltip'
import { thunkGetEventsSr } from '../../../../store/actions/RequestsThunkActions'
import Spinner from '../../../../../common/components/spinner/Spinner'

const List = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const {
    requestsList,
    setFinalList,
    searchingRequestsList,
    currentPage,
    setCurrentPage,
    totalPages,
    rowsPerPage,
    setRowsPerPage,
    handleClickButton,
    handleClickViewButton,
    dossierStatusId,
    checkReiteracion
  } = props

  const target = document.getElementById('number') as HTMLSelectElement

  const user = useSelector((state: any) => state.user.profile)

  //usamos estas constantes para controlar la ordenación en columnas
  const [orderByCodeAsc, setOrderByCodeAsc] = useState(false)
  const [orderByCreatedAsc, setOrderByCreatedAsc] = useState(true)
  const [orderByChanelAsc, setOrderByChanelAsc] = useState(false)
  const [orderByCupsAsc, setOrderByCupsAsc] = useState(false)
  const [directionCode, setDirectionCode] = useState('desc')
  const [showCodeArrow, setShowCodeArrow] = useState(false)
  const [showCreatedArrow, setShowCreatedArrow] = useState(false)
  const [showChanelArrow, setShowChanelArrow] = useState(false)
  const [showCupsArrow, setShowCupsArrow] = useState(false)
  const [showRequestTypeArrow, setShowRequestTypeArrow] = useState(false)
  const [orderByRequestTypeAsc, setOrderByRequestTypeAsc] = useState(false)
  // const checkReiteracion = (request) => {
  //   const now = new Date()
  //   const lastWeek = now.getTime() - (7 * 24 * 60 * 60 * 1000)
  
  //   return new Promise((resolve, reject) => {
  //     dispatch(thunkGetEventsSr(user.documentNumber, request.codSR, (eventsResponse) => {
  //       let hasReiteration = false
        
  //       if (eventsResponse && eventsResponse.events && eventsResponse.events.items) {
  //         const array = eventsResponse.events.items
  //         array.forEach((obj) => {
  //           if (obj.typeName === 'REITERACIÓN') {
  //             const date = new Date(completeDateWithSlash(obj.creationDate))
  //             if (date.getTime() >= lastWeek) {
  //               hasReiteration = true
  //             }
  //           }
  //         })
  //       }
  
  //       resolve(hasReiteration)
  //     }))
  //   })
  // }
  
  //ordenamos a partir de la columna code
  const orderByCode = () => {
    setShowCodeArrow(true)
    setShowChanelArrow(false)
    setShowCreatedArrow(false)
    setShowCupsArrow(false)
    setShowRequestTypeArrow(false)
    if (orderByCodeAsc) {
      setFinalList([].concat(requestsList).sort().reverse())
      setOrderByCodeAsc(false)
      setDirectionCode('asc')
    } else {
      setFinalList([].concat(requestsList).sort((a, b) => a.codSR.localeCompare(b.codSR)))
      setOrderByCodeAsc(true)
      setDirectionCode('desc')
    }
  }

  const orderByChanel = () => {
    setShowCodeArrow(false)
    setShowChanelArrow(true)
    setShowRequestTypeArrow(false)
    setShowCreatedArrow(false)
    setShowCupsArrow(false)
    if (orderByChanelAsc) {
      setFinalList([].concat(requestsList).sort().reverse())
      setOrderByChanelAsc(false)
      setDirectionCode('asc')
    } else {
      setFinalList([].concat(requestsList).sort((a, b) => a.channel.localeCompare(b.channel)))
      setOrderByChanelAsc(true)
      setDirectionCode('desc')
    }
  }

  const orderByCreated = () => {
    setShowCodeArrow(false)
    setShowChanelArrow(false)
    setShowRequestTypeArrow(false)
    setShowCreatedArrow(true)
    setShowCupsArrow(false)
    if (orderByCreatedAsc) {
      setFinalList(
        requestsList.sort(function (a, b) {
          let aa = a.createDate.split('/')
          aa = aa[2] + '-' + aa[1] + '-' + aa[0]

          let bb = b.createDate.split('/')
          bb = bb[2] + '-' + bb[1] + '-' + bb[0]

          return new Date(bb).getTime() - new Date(aa).getTime()
        })
      )
      setOrderByCreatedAsc(false)
      setDirectionCode('asc')
    } else {
      setFinalList(
        requestsList.sort(function (a, b) {
          let aa = a.createDate.split('/')
          aa = aa[2] + '-' + aa[1] + '-' + aa[0]

          let bb = b.createDate.split('/')
          bb = bb[2] + '-' + bb[1] + '-' + bb[0]

          return new Date(aa).getTime() - new Date(bb).getTime()
        })
      )
      setOrderByCreatedAsc(true)
      setDirectionCode('desc')
    }
  }

  const orderByRequestType = () => {
    setShowRequestTypeArrow(true)
    setShowCodeArrow(false)
    setShowChanelArrow(false)
    setShowCreatedArrow(false)
    setShowCupsArrow(false)

    const updatedRequestsList = requestsList.map(request => ({
      ...request,
      requestType: dossierStatusId.find(i => i.key === request.tipology)
        ? dossierStatusId.find(i => i.key === request.tipology).value
        : ''
    }))
    
    if (orderByRequestTypeAsc) {
      setFinalList([].concat(updatedRequestsList).sort().reverse())
      setOrderByRequestTypeAsc(false)
      setDirectionCode('asc')
    } else {
      setFinalList([].concat(updatedRequestsList).sort((a, b) => a.tipologyDescription.localeCompare(b.tipologyDescription)))
      setOrderByRequestTypeAsc(true)
      setDirectionCode('desc')
    }
  } 

  const orderByCups= () => {
    setShowRequestTypeArrow(false)
    setShowCodeArrow(false)
    setShowChanelArrow(false)
    setShowCreatedArrow(false)
    setShowCupsArrow(true)
    if (orderByCupsAsc) {
      setFinalList([].concat(requestsList).sort().reverse())
      setOrderByCupsAsc(false)
      setDirectionCode('asc')
    } else {
      setFinalList([].concat(requestsList).sort((a, b) => a.cups.localeCompare(b.cups)))
      setOrderByCupsAsc(true)
      setDirectionCode('desc')
    }
  }

  const onChangeSelector = () => {
    setCurrentPage(0)
    setRowsPerPage(Number(target.options[target.selectedIndex].value))
  }

  const handleChangePage = (number) => {
    setCurrentPage(number)
  }

  const [totalPagesFilter, setTotalPagesFilter] = useState(0)

  useEffect(() => {
    setTotalPagesFilter(requestsList.length === 0 ? 1 : Math.ceil(requestsList.length / rowsPerPage))
    // eslint-disable-next-line
  }, [requestsList, rowsPerPage])

  useLayoutEffect(() => {
    orderByCreated()
    setShowCreatedArrow(false)
  }, [])
  
  return (
    <>
      {
        requestsList.length > 20 && totalPages > 1 ?
          <Grid container className={classes.totalItems}>
            {requestsList.slice((currentPage * rowsPerPage), ((currentPage * rowsPerPage) + rowsPerPage)).length + t('requests.requestsList.requestsFrom') + requestsList.length}
          </Grid>
          :
          requestsList.length > 0 &&
          <Grid container className={classes.totalItems}>
            {requestsList.length + (requestsList.length > 1 ? t('requests.requestsList.requests') : t('requests.requestsList.request'))}
          </Grid>
      }
      <Table className={classes.table}>
        <TableHead>
          <TableRow className={classes.row}>
            <StyledTableCell>{t('requests.requestsList.list.requestCode')}
              <TableSortLabel
                active={showCodeArrow}
                direction={directionCode === 'asc' ? 'asc' : 'desc'}
                onClick={orderByCode}
              />
            </StyledTableCell>

            {adminCheck() &&
              <StyledTableCell className={classes.cell}>
                {t('requests.requestsList.list.channel')}
                <TableSortLabel
                  active={showChanelArrow}
                  direction={directionCode === 'asc' ? 'asc' : 'desc'}
                  onClick={orderByChanel}
                />
              </StyledTableCell>
            }

            <StyledTableCell className={classes.cell}>{t('requests.requestsList.list.cupsOrDossierNumber')}
              <TableSortLabel
                active={showCupsArrow}
                direction={directionCode === 'asc' ? 'asc' : 'desc'}
                onClick={orderByCups}
              />
            </StyledTableCell>

            {/*<StyledTableCell className={classes.cell}>{t('requests.requestsList.list.address')}</StyledTableCell>*/}

            <StyledTableCell className={classes.cell}>
              {t('requests.requestsList.list.requestType')}
                <TableSortLabel
                  active={showRequestTypeArrow}
                  direction={directionCode === 'asc' ? 'asc' : 'desc'}
                  onClick={orderByRequestType}
                />
            </StyledTableCell>

            <StyledTableCell className={classes.cell}>
              {t('requests.requestsList.list.openDate')}
              <TableSortLabel
                active={showCreatedArrow}
                direction={directionCode === 'asc' ? 'asc' : 'desc'}
                onClick={orderByCreated}
              />
            </StyledTableCell>

            {!adminCheck() &&
              <StyledTableCell className={classes.cell}/>
            }

            <StyledTableCell className={classes.cell} />
          </TableRow>
        </TableHead>

        <TableBody>
          {requestsList.length === 0 ? (
            <TableRow className={classes.row}>
              <StyledTableCell className={classes.emptyList} colSpan={7}>
                {searchingRequestsList ? (
                  t('requests.requestsList.list.emptyList.searching')
                ) : (
                  t('requests.requestsList.list.emptyList.default')
                )}
              </StyledTableCell>
            </TableRow>
          ) : (
            requestsList
              .slice((currentPage * rowsPerPage), (currentPage * rowsPerPage) + rowsPerPage)
              .map((request, index) => (
                <TableRow
                  key={index}
                  className={`${classes.row} ${request.indRead === 1 ? 'read' : 'unread'}`}
                >
                  <StyledTableCell>{request.codSR}</StyledTableCell>

                  {adminCheck() &&
                    <StyledTableCell>{request.channel}</StyledTableCell>
                  }

                  {/*<StyledTableCell className={classes.wrappedCell}>{request.cupsOrDossierNumber}</StyledTableCell>*/}
                  <StyledTableCell className={classes.wrappedCell}>{request.cups !=='' ? request.cups : request.codExpedient} </StyledTableCell>

                  {/*<StyledTableCell>{request.address}</StyledTableCell>*/}

                  {/* <StyledTableCell>{handleGetTypologyByCode(request.tipology)}</StyledTableCell> */}
                  {/*<StyledTableCell>{request.tipologyDescription}</StyledTableCell>*/}
                  <StyledTableCell>{dossierStatusId.find(i => i.key === request.tipology) ? dossierStatusId.find(i => i.key === request.tipology).value : ''}</StyledTableCell>

                  <StyledTableCell>{request.createDate}</StyledTableCell>

                  {!adminCheck() &&
                    <StyledTableCell>

                      {
                        <Grid container alignItems='center' className={classes.requestStatusText} onClick={() => checkReiteracion(request)}>
                          <img className={classes.bellIcon} src={campanaIcono} alt='' />
                          {t('requests.requestsList.list.requestStatus')}
                        </Grid>
                      }
                    
                      {/* {
                        (checkReiteracion(request)) ?
                          
                        <Tooltip title={t('requests.requestsList.list.tooltipRequestStatus')} placement='bottom' arrow={true}>
                          <Grid container alignItems='center' className={classes.requestStatusTextDis}>
                            <img className={classes.bellIcon} src={campanaIcono} alt='' />
                            {t('requests.requestsList.list.requestStatus')}
                          </Grid> 
                        </Tooltip>    
                        :  
                        <Grid container alignItems='center' className={classes.requestStatusText} onClick={() => prepareReiterationPopup(request.codSR)}>
                          <img className={classes.bellIcon} src={campanaIcono} alt='' />
                          {t('requests.requestsList.list.requestStatus')}
                        </Grid> 
                      } */}
                      
                    </StyledTableCell>
                  }

                  <StyledTableCell>
                    {window.location.pathname === '/supplies/detail' ||
                      window.location.pathname === '/provisions/detail' ? (
                      <div className={classes.viewButton} onClick={() => handleClickButton(request)}>
                        {t('requests.requestsList.list.view')}
                      </div>
                    ) : (
                      <div
                        className={classes.viewButton}
                        onClick={() => handleClickViewButton(request)}
                      >
                        {t('requests.requestsList.list.view')}
                      </div>
                    )}
                  </StyledTableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>
      {
        requestsList.length > 20 &&
        <Grid container className={classes.itemsPerPage}>
          <span style={{ marginRight: 5 }}>{t('common.pagination.show')}</span>
          <select id='number' name='number' onChange={onChangeSelector} className={classes.select}>
            <option value='20' selected>20</option>
            <option value='50'>50</option>
            <option value='100'>100</option>
          </select>
          <span style={{ marginLeft: 5 }}>{t('common.pagination.forPage')}</span>
        </Grid>
      }
      {
        totalPagesFilter > 1 &&
        <Grid container className={classes.paginationContainer}>
          <Pagination
            totalPages={totalPagesFilter}
            currentPage={currentPage}
            handleChangePage={handleChangePage}
          />
        </Grid>
      }

    </>
  )
}

export default List
