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
import { adminCheck } from '../../../../../../common/lib/ValidationLib';

import Pagination from '../../../../../../common/components/pagination/Pagination2'


import currentIcon from '../../../../../../assets/icons/ico_en_proceso.svg'
import incidenceIcon from '../../../../../../assets/icons/Estados_incidencia.svg'
import recibedIcon from '../../../../../../assets/icons/info.svg'
import IcoRecibida from '../../../../../../assets/icons/ico_recibida.svg'
import LoadingAnimation from '../../../../../../assets/img/spinner.gif'
// LCS: Importa la función - Wave 3
import { sendGAEvent, removeEmails } from '../../../../../../core/utils/gtm'




const List = (props: any) => {

  const classes = useStyles({})
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const {
    contractsList,
    setFinalList,
    searchingcontractsList,
    currentPage,
    setCurrentPage,
    totalPages,
    rowsPerPage,
    setRowsPerPage,
    setShowingDialog,
    changedTab,
    selectedData,
    setSelectedData,
    isSubLoading,
    supplyData
  } = props

  const target = document.getElementById('number') as HTMLSelectElement

  const user = useSelector((state: any) => state.user.profile)

  //usamos estas constantes para controlar la ordenación en columnas
  const [orderByTypeAsc, setOrderByTypeAsc] = useState(false)
  const [orderByComercializadoraAsc, setOrderByComercializadoraAsc] = useState(false)
  const [orderByStateAsc, setOrderByStateAsc] = useState(false)
  const [orderByDateAsc, setOrderByDateAsc] = useState(false)
  const [orderByDetailAsc, setOrderByDetailAsc] = useState(false)
  const [directionCode, setDirectionCode] = useState('desc')
  const [showTypeArrow, setShowTypeArrow] = useState(false)
  const [showComercializadoraArrow, setShowComercializadoraArrow] = useState(false)
  const [showStateArrow, setShowStateArrow] = useState(false)
  const [showDateArrow, setShowDateArrow] = useState(false)
  const [showDetailArrow, setShowDetailArrow] = useState(false)



  const reset = () => {
    setShowTypeArrow(false)
    setShowComercializadoraArrow(false)
    setShowStateArrow(false)
    setShowDateArrow(false)
    setShowDetailArrow(false)

    setOrderByTypeAsc(false)
    setOrderByComercializadoraAsc(false)
    setOrderByStateAsc(false)
    setOrderByDateAsc(false)
    setOrderByDetailAsc(false)

  }

  //ordenamos a partir de la columna code
  const orderByType = () => {
    setShowTypeArrow(true)
    setShowComercializadoraArrow(false)
    setShowStateArrow(false)
    setShowDateArrow(false)
    setShowDetailArrow(false)
    if (orderByTypeAsc) {
      setFinalList([].concat(contractsList).sort().reverse())
      setOrderByTypeAsc(false)
      setDirectionCode('asc')
    } else {
      setFinalList([].concat(contractsList).sort((a, b) => a.desProceso.localeCompare(b.desProceso)))
      setOrderByTypeAsc(true)
      setDirectionCode('desc')
    }
  }

  const orderByComercializadora = () => {
    setShowComercializadoraArrow(true)
    setShowTypeArrow(false)
    setShowStateArrow(false)
    setShowDateArrow(false)
    setShowDetailArrow(false)
    if (orderByComercializadoraAsc) {
      setFinalList([].concat(contractsList).sort().reverse())
      setOrderByComercializadoraAsc(false)
      setDirectionCode('asc')
    } else {
      setFinalList([].concat(contractsList).sort((a, b) => a.desComercializador.localeCompare(b.desComercializador)))
      setOrderByComercializadoraAsc(true)
      setDirectionCode('desc')
    }

  }

  const orderByState = () => {
    setShowComercializadoraArrow(false)
    setShowTypeArrow(false)
    setShowStateArrow(true)
    setShowDateArrow(false)
    setShowDetailArrow(false)
    if (orderByStateAsc) {
      setFinalList([].concat(contractsList).sort().reverse())
      setOrderByStateAsc(false)
      setDirectionCode('asc')
    } else {
      setFinalList([].concat(contractsList).sort((a, b) => a.estado.localeCompare(b.estado)))
      setOrderByStateAsc(true)
      setDirectionCode('desc')
    }

  }

  const orderByDate = () => {
    setShowComercializadoraArrow(false)
    setShowTypeArrow(false)
    setShowStateArrow(false)
    setShowDateArrow(true)
    setShowDetailArrow(false)
    if (orderByDateAsc) {
      setFinalList(
        contractsList.sort(function (a, b) {
          let aa = a.fecSolicitudFormated.split('/')
          aa = aa[2] + '-' + aa[1] + '-' + aa[0]

          let bb = b.fecSolicitudFormated.split('/')
          bb = bb[2] + '-' + bb[1] + '-' + bb[0]

          return new Date(bb).getTime() - new Date(aa).getTime()
        })
      )
      setOrderByDateAsc(false)
      setDirectionCode('asc')
    } else {
      setFinalList(
        contractsList.sort(function (a, b) {
          let aa = a.fecSolicitudFormated.split('/')
          aa = aa[2] + '-' + aa[1] + '-' + aa[0]

          let bb = b.fecSolicitudFormated.split('/')
          bb = bb[2] + '-' + bb[1] + '-' + bb[0]

          return new Date(aa).getTime() - new Date(bb).getTime()
        })
      )
      setOrderByDateAsc(true)
      setDirectionCode('desc')
    }

  }

  const orderByDetail = () => {
    setShowComercializadoraArrow(false)
    setShowTypeArrow(false)
    setShowStateArrow(false)
    setShowDateArrow(false)
    setShowDetailArrow(true)
    if (orderByDetailAsc) {
      setFinalList([].concat(contractsList).sort().reverse())
      setOrderByDetailAsc(false)
      setDirectionCode('asc')
    } else {
      setFinalList([].concat(contractsList).sort((a, b) => a.detalle.localeCompare(b.detalle)))
      setOrderByDetailAsc(true)
      setDirectionCode('desc')
    }
  }

  // const onChangeSelector = () => {
  //   setCurrentPage(0)
  //   setRowsPerPage(Number(target.options[target.selectedIndex].value))
  // }

  const onChangeSelector = (event) => {
    setCurrentPage(0);
    setRowsPerPage(Number(event.target.value));
  };



  // const handleChangePage = (number) => {
  //   setCurrentPage(number)
  // }

  const [totalPagesFilter, setTotalPagesFilter] = useState(0)

  useEffect(() => {
    setTotalPagesFilter(contractsList.length === 0 ? 1 : Math.ceil(contractsList.length / rowsPerPage))
    // eslint-disable-next-line
  }, [contractsList, rowsPerPage])

  useEffect(() => {
    reset()
  }, [changedTab])

    // LCS: Enviar evento de GdC a GA - Wave 3
  const sendGAEventOnGoingContract = (contract: any): void => {
    sendGAEvent({
      event: 'consult_request',
      section_name: 'mis suministros',
      subsection_name: 'solicitudes de contratacion',
      click_text: 'ver detalle',
      element_type: 'conversion de informacion',
      page_url: removeEmails(window.location.href),
      browsing_type: sessionStorage.getItem('browsing_type'),
      cups: supplyData.cups,
      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      tab_name: 'en curso',
      request_status: contract.estado.toLowerCase(),
      request_type: contract.desProceso.toLowerCase(),
      issue_date: contract.fecSolicitudFormated,
    })
  }

  return (
    <>
      {
        isSubLoading &&
        <Grid container className={classes.loadingBox}>
          <img className={classes.loadingAnimation} src={LoadingAnimation} alt='' />
          <span className={classes.loadingText}>{t('supplies.suppliesDetails.components.contracts.loading')}</span>
        </Grid>
      }
      {
        (contractsList) && contractsList.length > 20 && totalPages > 1 ?
          <Grid container className={classes.totalItems}>
            {contractsList.slice((currentPage * rowsPerPage), ((currentPage * rowsPerPage) + rowsPerPage)).length + t('supplies.suppliesDetails.components.contracts.requestsFrom') + contractsList.length}
          </Grid>
          :
          (contractsList) && contractsList.length > 0 &&
          <Grid container className={classes.totalItems}>
            {contractsList.length + (contractsList.length > 1 ? t('supplies.suppliesDetails.components.contracts.requests') : t('supplies.suppliesDetails.components.contracts.request'))}

          </Grid>
      }
      <Table className={classes.table}>
        <TableHead>
          <TableRow className={classes.row}>
            <StyledTableCell>{t('supplies.suppliesDetails.components.contracts.items.type')}
              <TableSortLabel
                active={showTypeArrow}
                direction={directionCode === 'asc' ? 'asc' : 'desc'}
                onClick={orderByType}
              />
            </StyledTableCell>


            <StyledTableCell className={classes.cell}>{t('supplies.suppliesDetails.components.contracts.items.comerc')}
              <TableSortLabel
                active={showComercializadoraArrow}
                direction={directionCode === 'asc' ? 'asc' : 'desc'}
                onClick={orderByComercializadora}
              />
            </StyledTableCell>


            <StyledTableCell className={classes.cell}>
              {t('supplies.suppliesDetails.components.contracts.items.status')}
              <TableSortLabel
                active={showStateArrow}
                direction={directionCode === 'asc' ? 'asc' : 'desc'}
                onClick={orderByState}
              />
            </StyledTableCell>

            <StyledTableCell className={classes.cell}>
              {t('supplies.suppliesDetails.components.contracts.items.startDate')}
              <TableSortLabel
                active={showDateArrow}
                direction={directionCode === 'asc' ? 'asc' : 'desc'}
                onClick={orderByDate}
              />
            </StyledTableCell>



            <StyledTableCell className={classes.cell}>
              {t('supplies.suppliesDetails.components.contracts.items.detail')}
              {/* <TableSortLabel
                active={showDetailArrow}
                direction={directionCode === 'asc' ? 'asc' : 'desc'}
                onClick={orderByDetail}
              /> */}
            </StyledTableCell>

          </TableRow>
        </TableHead>

        <TableBody>
          { !contractsList || contractsList.length === 0 ? (
            <TableRow className={classes.row}>
              <StyledTableCell className={classes.emptyList} colSpan={7}>
                {searchingcontractsList ? (
                  t('requests.requestsList.list.emptyList.searching')
                ) : (
                  t('requests.requestsList.list.emptyList.OngoingContracts')
                )}
              </StyledTableCell>
            </TableRow>
          ) : (
            contractsList && contractsList.length && contractsList.length > 0 &&
            contractsList
              .slice((currentPage * rowsPerPage), (currentPage * rowsPerPage) + rowsPerPage)
              .map((contract, index) => (
                <TableRow
                  key={index}
                  className={`${classes.row}`}
                >
                  <StyledTableCell>{contract.desProceso}</StyledTableCell>

                  <StyledTableCell>{contract.desComercializador}</StyledTableCell>

                  <StyledTableCell>
                    <Grid container alignItems='center'>
                      <Grid item className={classes.TypeIcon}>
                        {
                          contract.estado ===  t('supplies.suppliesDetails.components.contracts.states.inProgress') &&
                          <img src={currentIcon} alt='' />
                        }
                        {
                          contract.estado === t('supplies.suppliesDetails.components.contracts.states.incidence') &&
                          <img src={incidenceIcon} alt='' />
                        }
                        {
                          contract.estado === t('supplies.suppliesDetails.components.contracts.states.received') &&
                          <img src={IcoRecibida} alt='' />
                        }
                      </Grid>
                      <Grid item className={classes.TypeLabel}>
                        {(contract.estado === t('supplies.suppliesDetails.components.contracts.states.inProgress')) && t('supplies.suppliesDetails.components.contracts.states.inProgress')}
                        {(contract.estado === t('supplies.suppliesDetails.components.contracts.states.incidence')) && t('supplies.suppliesDetails.components.contracts.states.incidence')}
                        {(contract.estado === t('supplies.suppliesDetails.components.contracts.states.received')) && t('supplies.suppliesDetails.components.contracts.states.received')}
                      </Grid>
                    </Grid>
                  </StyledTableCell>

                  <StyledTableCell>{contract.fecSolicitudFormated}</StyledTableCell>
                  <StyledTableCell>
                    {
                      <div
                        className={classes.viewButton}
                        onClick={() => {
                          sendGAEventOnGoingContract(contract);
                          setShowingDialog(true);
                          console.log('contract: ', contract);
                          setSelectedData(contract)
                        }}
                      >
                        {t('supplies.suppliesDetails.components.contracts.items.seeDetail')}
                      </div>
                    }
                  </StyledTableCell>
                </TableRow>
              ))
          )}
        </TableBody>
      </Table>
      {/* {
        contractsList.length > 20 &&
        <Grid container className={classes.itemsPerPage}>
          <span style={{ marginRight: 5 }}>{t('common.pagination.show')}</span>
          <select id='number' name='number' onChange={onChangeSelector} className={classes.select}>
            <option value='20' selected>20</option>
            <option value='50'>50</option>
            <option value='100'>100</option>
          </select>
          <span style={{ marginLeft: 5 }}>{t('common.pagination.forPage')}</span>
        </Grid>
      } */}
      {contractsList.length > 20 && (
        <Grid container className={classes.itemsPerPage}>
          <span style={{ marginRight: 5 }}>{t('common.pagination.show')}</span>
          <select
            id='number'
            name='number'
            onChange={onChangeSelector}
            value={rowsPerPage}
            className={classes.select}
          >
            <option value='20'>20</option>
            <option value='50'>50</option>
            <option value='100'>100</option>
          </select>
          <span style={{ marginLeft: 5 }}>{t('common.pagination.forPage')}</span>
        </Grid>
      )}
      {
        totalPagesFilter > 1 &&
        <Grid container className={classes.paginationContainer}>
          <Pagination
            totalPages={totalPagesFilter}
            currentPage={currentPage}
            handleChangePage={setCurrentPage}
          />
        </Grid>
      }
    </>
  )
}

export default List
