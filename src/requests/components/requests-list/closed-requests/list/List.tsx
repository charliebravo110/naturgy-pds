import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Grid from '@material-ui/core/Grid'

import useStyles, { StyledTableCell } from './List.styles'

import { adminCheck } from '../../../../../common/lib/ValidationLib';
import Pagination from '../../../../../common/components/pagination/Pagination2'

const List = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

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
    dossierStatusId
  } = props

  const target = document.getElementById('number') as HTMLSelectElement

  //usamos estas constantes para controlar la ordenación en columnas
  const [orderByCodeAsc, setOrderByCodeAsc] = useState(false)
  const [orderByCreatedAsc, setOrderByCreatedAsc] = useState(true)
  const [orderByClosedAsc, setOrderByClosedAsc] = useState(false)
  const [orderByChanelAsc, setOrderByChanelAsc] = useState(false)
  const [orderByCupsAsc, setOrderByCupsAsc] = useState(false)
  const [directionCode, setDirectionCode] = useState('desc')
  const [showCodeArrow, setShowCodeArrow] = useState(false)
  const [showCreatedArrow, setShowCreatedArrow] = useState(false)
  const [showClosedArrow, setShowClosedArrow] = useState(false)
  const [showChanelArrow, setShowChanelArrow] = useState(false)
  const [showCupsArrow, setShowCupsArrow] = useState(false)
  const [showRequestTypeArrow, setShowRequestTypeArrow] = useState(false)
  const [orderByRequestTypeAsc, setOrderByRequestTypeAsc] = useState(false)

  //ordenamos a partir de la columna code
  const orderByCode = () => {
    setShowCodeArrow(true)
    setShowClosedArrow(false)
    setShowCreatedArrow(false)
    setShowClosedArrow(false)
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
    setShowClosedArrow(true)
    setShowChanelArrow(false)
    setShowClosedArrow(false)
    setShowCupsArrow(false)
    setShowRequestTypeArrow(false)
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
    setShowClosedArrow(false)
    setShowCreatedArrow(true)
    setShowClosedArrow(false)
    setShowCupsArrow(false)
    setShowRequestTypeArrow(false)
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
      setFinalList([].concat(updatedRequestsList).sort((a, b) => a.requestType.localeCompare(b.requestType)))
      setOrderByRequestTypeAsc(true)
      setDirectionCode('desc')
    }
  }

  const orderByClosed = () => {
    setShowCodeArrow(false)
    setShowClosedArrow(false)
    setShowCreatedArrow(false)
    setShowClosedArrow(true)
    setShowCupsArrow(false)
    setShowRequestTypeArrow(false)
    if (orderByClosedAsc) {
      setFinalList(
        requestsList.sort(function (a, b) {
          let aa = a.closingDate.split('/')
          aa = aa[2] + '-' + aa[1] + '-' + aa[0]

          let bb = b.closingDate.split('/')
          bb = bb[2] + '-' + bb[1] + '-' + bb[0]

          return new Date(bb).getTime() - new Date(aa).getTime()
        })
      )
      setOrderByClosedAsc(false)
      setDirectionCode('asc')
    } else {
      setFinalList(
        requestsList.sort(function (a, b) {
          let aa = a.closingDate.split('/')
          aa = aa[2] + '-' + aa[1] + '-' + aa[0]

          let bb = b.closingDate.split('/')
          bb = bb[2] + '-' + bb[1] + '-' + bb[0]

          return new Date(aa).getTime() - new Date(bb).getTime()
        })
      )
      setOrderByClosedAsc(true)
      setDirectionCode('desc')
    }
  }

  const orderByCups= () => {
    setShowCodeArrow(false)
    setShowChanelArrow(false)
    setShowCreatedArrow(false)
    setShowClosedArrow(false)
    setShowCupsArrow(true)
    setShowRequestTypeArrow(false)
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
        requestsList.length > 20 && totalPages > 1 && (currentPage + 1) === totalPages ?
          <Grid container className={classes.totalItems}>
            {requestsList.slice((currentPage * rowsPerPage), ((currentPage * rowsPerPage) + rowsPerPage)).length + t('requests.requestsList.requestsFrom') + requestsList.length}
          </Grid>
          :
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

            <StyledTableCell className={classes.cell}>
              {t('requests.requestsList.list.closeDate')}
              <TableSortLabel
                active={showClosedArrow}
                direction={directionCode === 'asc' ? 'asc' : 'desc'}
                onClick={orderByClosed}
              />
            </StyledTableCell>

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

                  <StyledTableCell className={classes.wrappedCell}>{request.cups !='' ? request.cups : request.codExpedient} </StyledTableCell>

                  <StyledTableCell>{dossierStatusId.find(i => i.key === request.tipology) ? dossierStatusId.find(i => i.key === request.tipology).value : ''}</StyledTableCell>

                  <StyledTableCell>{request.createDate}</StyledTableCell>

                  <StyledTableCell>{request.closingDate}</StyledTableCell>

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
