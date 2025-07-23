import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { withRouter } from 'react-router'

import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'

import AlertIcon from '../../../../assets/icons/aviso_alerta_pop_up.svg'
import ClosedPadlock from '../../../../assets/icons/s_candadocerrado.svg'
import OpenedPadlock from '../../../../assets/icons/s_candadoabierto.svg'
import LoadingAnimation from '../../../../assets/img/spinner.gif'

import { isPrevious2017 } from '../../../../common/lib/ValidationLib'

import {
  setDossierType,
  setDossierSubtype,
  setSelectedSupplyType,
  setSupplySubtypes,
  setSelectedSupplySubtype,
  setBuildingCoordinates,
  setCurrentProvisionScaleInd
} from '../../../store/actions/ProvisionsActions'

import { thunkGetMasterData, thunkGetProvision } from '../../../store/actions/ProvisionsThunkActions'

import useStyles, { StyledTableCell } from './List.styles'
import Pagination from '../../../../common/components/pagination/Pagination2'
import { useHistory } from 'react-router'

// LCS: Importa la función - Wave 3
import { getExpStatus, sendGAEvent, removeEmails } from '../../../../core/utils/gtm'

const List = (props: any) => {
  const {
    listItems,
    setFinalList,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    setIsLoading,
    isSubLoading,
    dossierStatus,
    isLoading,
    setDossierStatus,
    certificateON,
    setCertificateON
  } = props

  const history = useHistory();

  // const [dossierStatus, setDossierStatus] = useState([] as any)

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const classes = useStyles({})

  const padlock = useSelector((state: any) => state.user.padlock)
  // const [certificateON, setCertificateON] = useState('')

  const target = document.getElementById('number') as HTMLSelectElement

  //usamos estas constantes para controlar la ordenación en columnas
  const [orderByNumberAsc, setOrderByNumberAsc] = useState(false)
  const [orderByNameAsc, setOrderByNameAsc] = useState(false)
  const [orderByTypeAsc, setOrderByTypeAsc] = useState(false)
  const [orderByDirectionAsc, setOrderByDirectionAsc] = useState(false)
  const [orderByCreatedAsc, setOrderByCreatedAsc] = useState(false)
  const [orderByStatusAsc, setOrderByStatusAsc] = useState(false)
  const [directionNumber, setDirectionNumber] = useState('desc')
  const [directionName, setDirectionName] = useState('desc')
  const [directionType, setDirectionType] = useState('desc')
  const [showNumberArrow, setShowNumberArrow] = useState(false)
  const [showNameArrow, setShowNameArrow] = useState(false)
  const [showTypeArrow, setShowTypeArrow] = useState(false)
  const [showDirectionArrow, setShowDirectionArrow] = useState(false)
  const [showCreatedArrow, setShowCreatedArrow] = useState(false)
  const [showStatusArrow, setShowStatusArrow] = useState(false)

  //ordenamos a partir de la columna name
  const orderByName = () => {
    setShowNameArrow(true)
    setShowNumberArrow(false)
    setShowDirectionArrow(false)
    setShowCreatedArrow(false)
    setShowStatusArrow(false)
    setDirectionNumber('desc')
    if (orderByNameAsc) {
      setFinalList([].concat(listItems).sort().reverse())
      setOrderByNameAsc(false)
      setDirectionName('asc')
    } else {
      setFinalList([].concat(listItems).sort((a, b) => a.name.localeCompare(b.name)))
      setOrderByNameAsc(true)
      setDirectionName('desc')
    }
  }
  const orderBytype= () => {
    
    //ordenamos a partir de la columan tipo
    setShowTypeArrow(true)
    setShowTypeArrow(false)
    setShowDirectionArrow(false)
    setShowCreatedArrow(false)
    setShowStatusArrow(false)
    setDirectionNumber('desc')
    if (orderByTypeAsc) {
      setFinalList([].concat(listItems).sort().reverse())
      setOrderByTypeAsc(false)
      setDirectionType('asc')
    } else {
      setFinalList([].concat(listItems).sort((a, b) => getDossierSubtype(a.idDossierType, a.idDossierSubtype).localeCompare(getDossierSubtype(b.idDossierType, b.idDossierSubtype))))
      setOrderByTypeAsc(true)
      setDirectionType('desc')
    }
  }

  //ordenamos a partir de la columna number
  const orderByNumber = () => {
    setShowNameArrow(false)
    setShowNumberArrow(true)
    setShowDirectionArrow(false)
    setShowCreatedArrow(false)
    setShowStatusArrow(false)
    setDirectionNumber('desc')
    if (orderByNumberAsc) {
      setFinalList([].concat(listItems).sort().reverse())
      setOrderByNumberAsc(false)
      setDirectionNumber('asc')
    } else {
      setFinalList([].concat(listItems).sort((a, b) => a.dossierCod.localeCompare(b.dossierCod)))
      setOrderByNumberAsc(true)
      setDirectionNumber('desc')
    }
  }
  //ordenamos a partir de la columna dirección
  const orderByDirection = () => {
    setShowNameArrow(false)
    setShowNumberArrow(false)
    setShowDirectionArrow(true)
    setShowCreatedArrow(false)
    setShowStatusArrow(false)
    setDirectionNumber('desc')
    if (orderByDirectionAsc) {
      setFinalList([].concat(listItems).sort().reverse())
      setOrderByDirectionAsc(false)
      setDirectionNumber('asc')
    } else {
      setFinalList([].concat(listItems).sort((a, b) => a.addressDescription.localeCompare(b.addressDescription)))
      setOrderByDirectionAsc(true)
      setDirectionNumber('desc')
    }
  }
  //ordenamos a partir de la columna created
  const orderByCreated = () => {
    setShowNameArrow(false)
    setShowNumberArrow(false)
    setShowDirectionArrow(false)
    setShowCreatedArrow(true)
    setShowStatusArrow(false)
    setDirectionNumber('desc')
    if (orderByCreatedAsc) {
      setFinalList([].concat(listItems).sort().reverse())
      setOrderByCreatedAsc(false)
      setDirectionNumber('asc')
    } else {
      setFinalList([].concat(listItems).sort((a, b) => a.registerDate.localeCompare(b.registerDate)))
      setOrderByCreatedAsc(true)
      setDirectionNumber('desc')
    }
  }
  //ordenamos a partir de la columna status
  const orderByStatus = () => {
    setShowNameArrow(false)
    setShowNumberArrow(false)
    setShowDirectionArrow(false)
    setShowCreatedArrow(false)
    setShowStatusArrow(true)
    setDirectionNumber('desc')
    if (orderByStatusAsc) {
      setFinalList([].concat(listItems).sort().reverse())
      setOrderByStatusAsc(false)
      setDirectionNumber('asc')
    } else {
      setFinalList([].concat(listItems).sort((a, b) => a.dossierStatusId.localeCompare(b.dossierStatusId)))
      setOrderByStatusAsc(true)
      setDirectionNumber('desc')
    }
  }

  const onChangeSelector = () => {
    setCurrentPage(0)
    setItemsPerPage(Number(target.options[target.selectedIndex].value))
  }

  const [totalPagesFilter, setTotalPagesFilter] = useState(0)

  useEffect(() => {
    setTotalPagesFilter(listItems.length === 0 ? 1 : Math.ceil(listItems.length / itemsPerPage))
    // eslint-disable-next-line
  }, [listItems, itemsPerPage])

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

  const handleClick = (provision) => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    let provisionDossierStatus = (dossierStatus.find(i => i.key === provision.dossierStatusId).value).toLowerCase()
    sessionStorage.setItem('provisionDossierStatus', provisionDossierStatus)
    sessionStorage.setItem('request_number', provision.dossierCod)
    sendGAEvent({
      event: 'consult_request',
      section_name: 'mi conexion a la red',
      click_text: 'solicitud de conexion',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      tab_name: sessionStorage.getItem('tab_selected'),
      request_number: provision.dossierCod,
      request_status: getExpStatus(provision.dossierStatusId),
      click_url: window.location.href + '/detail',
      browsing_type: sessionStorage.getItem('browsing_type')
    });
    if (provision.dossierStatusId && !isPrevious2017(provision.registerDate)) {
      setIsLoading(true)

      dispatch(setCurrentProvisionScaleInd(provision.scaleInd ? provision.scaleInd : ''))

      let defaultName = t('provisions.defaultName')

      dispatch(thunkGetProvision(provision.dossierCod, defaultName, (response) => {
        if (response) {
          dispatch(setDossierType(''))
          dispatch(setDossierSubtype(''))
          dispatch(setSelectedSupplyType(''))
          dispatch(setSupplySubtypes([]))
          dispatch(setSelectedSupplySubtype(''))
          dispatch(setBuildingCoordinates({}))

       
          history.push({ 
            pathname: '/provisions/detail',
            state: response
           });
         // props.history.push('/provisions/detail')
        }

        setIsLoading(false)
      }))
    }
  }

  const handleCheckProvisionName = (nameProvision) => {
    let nameResult = nameProvision
    if (nameResult === 'Provisión de servicio') {
      nameResult = 'Solicitud de conexión'
    }
    return nameResult
  }

  const getDossierSubtype = (CurrentProvisionType, CurrentProvisionSubType) => {
    if (CurrentProvisionType === 'DOSTYP001') {
      if (CurrentProvisionSubType === 'DOSSUB015') return  t('provisions.provisionsList.provisionTypes.power')
      else return t('provisions.provisionsList.provisionTypes.consumo')
    }
    else {
      if (CurrentProvisionType === 'DOSTYP002') {
        if (CurrentProvisionSubType === 'DOSSUB000') return t('provisions.provisionsList.provisionTypes.autoconsumo')
        else return t('provisions.provisionsList.provisionTypes.generation')
      }
      else return t('provisions.provisionsList.provisionTypes.trazado')
    }
  }

    // useEffect(() => {
    //   if (dossierStatus.length === 0) {
    //     dispatch(thunkGetMasterData('DOSSIER_STATUS_ID', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), '', (response) => {
    //       if (response) {
    //         setDossierStatus(response)
    //       }
    //     }))
    //     dispatch(thunkGetMasterData('CERTIFICATE', 'ES', 'ACTIVE', (response) => {
    //       if (response[0].value !== '1') {
    //         setCertificateON('0')
    //       } else {
    //         setCertificateON('1')
    //       }
    //     }))

    //   }
    //   // eslint-disable-next-line
    // }, [])

    // NGM - Añadir columna y candado a suministros fehacientes
    // Comprobamos si se trata de un suministro fehaciente
    const isFehaciente = (fehaciente) => {
      if (certificateON === '1' && fehaciente === '1') {
        return (
          <Grid container className={classes.lockBox}>
            <img src={padlock === '1' ? OpenedPadlock : ClosedPadlock} className={classes.lockIcon} alt='' />
          </Grid>
        )
      } else {
        return '';
      }
    }

    return (
      <>
        {
          listItems.length > 20 && totalPages > 1 && (currentPage + 1) === totalPages ?
            <Grid container className={classes.totalItems}>
              {listItems.slice((currentPage * itemsPerPage), ((currentPage * itemsPerPage) + itemsPerPage)).length + t('provisions.provisionsList.solicitudesDe') + listItems.length}
              {
                isSubLoading &&
                <img className={classes.loadingAnimation} src={LoadingAnimation} alt='' />
              }
            </Grid>
            :
            listItems.length > 20 && totalPages > 1 ?
              <Grid container className={classes.totalItems}>
                {listItems.slice((currentPage * itemsPerPage), ((currentPage * itemsPerPage) + itemsPerPage)).length + t('provisions.provisionsList.solicitudesDe') + listItems.length}
                {
                  isSubLoading &&
                  <img className={classes.loadingAnimation} src={LoadingAnimation} alt='' />
                }
              </Grid>
              :
              <Grid container className={classes.totalItems}>
                {listItems.length + (listItems.length > 1 ? t('provisions.provisionsList.solicitudes') : t('provisions.provisionsList.solicitud'))}
                {
                  isSubLoading &&
                  <img className={classes.loadingAnimation} src={LoadingAnimation} alt='' />
                }
              </Grid>
        }
        <Table className={classes.suppliesTable}>
          <TableHead>
            <TableRow className={classes.tableRow}>
              <StyledTableCell  className={classes.cell10}>{t('provisions.provisionsList.name')}
                <TableSortLabel
                  active={showNameArrow}
                  direction={directionName === 'asc' ? 'asc' : 'desc'}
                  onClick={orderByName}
                />
              </StyledTableCell>
              {/* //no entenc pq no m'agafa el text */}
              <StyledTableCell className={classes.cell10}>{t('provisions.provisionsList.provisionType')}

                <TableSortLabel
                  active={showTypeArrow}
                  direction={directionType === 'asc' ? 'asc' : 'desc'}
                  onClick={orderBytype}
                />
              </StyledTableCell>

              <StyledTableCell className={classes.cell20}>{t('provisions.provisionsList.number')}
                <TableSortLabel
                  active={showNumberArrow}
                  direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                  onClick={orderByNumber}
                />
              </StyledTableCell>

              <StyledTableCell className={classes.cell20}>{t('provisions.provisionsList.address')}
                <TableSortLabel
                  active={showDirectionArrow}
                  direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                  onClick={orderByDirection}
                />
              </StyledTableCell>

              <StyledTableCell className={classes.cell20}>{t('provisions.provisionsList.createDate')}
                <TableSortLabel
                  active={showCreatedArrow}
                  direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                  onClick={orderByCreated}
                />
              </StyledTableCell>

              <StyledTableCell className={classes.cell10}>{t('provisions.provisionsList.status')}
                <TableSortLabel
                  active={showStatusArrow}
                  direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                  onClick={orderByStatus}
                />
              </StyledTableCell>

              <StyledTableCell className={classes.onlyDesktop} />

              {/* NGM - Añadir columna y candado a suministros fehacientes */}
              {/* NUEVA COLUMNA VACIA */}
              <StyledTableCell className={classes.headTableCell} />
            </TableRow>
          </TableHead>

          <TableBody>
            {
              listItems.length === 0 ?
                <TableRow className={classes.tableBodyRow} >
                  <StyledTableCell className={classes.noResults} colSpan={12}>
                    {t('delegates.delegatesList.noResults')}
                  </StyledTableCell>
                </TableRow>
                :
                listItems.slice(
                  (currentPage * itemsPerPage),
                  ((currentPage * itemsPerPage) + itemsPerPage)
                ).map(
                  (provision, index) => (
                    <>
                      <TableRow key={index + '' + provision.dossierCod} className={`${classes.tableBodyRow} ${isPrevious2017(provision.registerDate) && 'disabled'}`}>
                        <StyledTableCell className={`${classes.suppliesBoldCell} ${provision.actionDoc === '1' && classes.withAction}`}>{handleCheckProvisionName(provision.name)}</StyledTableCell>

                        <StyledTableCell className={`${classes.suppliesTableWrappedCell} ${(provision.actionDoc === '1') && classes.withAction}`}>{getDossierSubtype(provision.idDossierType, provision.idDossierSubtype)}</StyledTableCell>

                        <StyledTableCell rowSpan={provision.actionDoc === '1' ? 2 : 1}>{provision.dossierCod}</StyledTableCell>

                        <StyledTableCell rowSpan={provision.actionDoc === '1' ? 2 : 1}>{provision.addressDescription}</StyledTableCell>

                        <StyledTableCell rowSpan={provision.actionDoc === '1' ? 2 : 1}>{formatDateAndTime(provision.registerDate)}</StyledTableCell>

                        <StyledTableCell rowSpan={provision.actionDoc === '1' ? 2 : 1}>{dossierStatus.find(i => i.key === provision.dossierStatusId) ? dossierStatus.find(i => i.key === provision.dossierStatusId).value : ''}</StyledTableCell>

                        <StyledTableCell rowSpan={provision.actionDoc === '1' ? 2 : 1} className={classes.suppliesTableButtonCell}>
                          {
                            isPrevious2017(provision.registerDate) ?
                              <div className={`${classes.editButton} disabled`}>
                                <p>{t('delegations.enter')}</p>
                              </div>
                              :
                              <div
                                className={classes.editButton}
                                onClick={() => handleClick(provision)}
                              >
                                <p>{t('delegations.enter')}</p>
                              </div>
                          }
                        </StyledTableCell>

                        {/* NGM - Añadir columna y candado a suministros fehacientes */}
                        {/* Comprobamos si corresponde el lock o no */}
                        <StyledTableCell rowSpan={provision.actionDoc === '1' ? 2 : 1}>{isFehaciente(provision.isFehaciente)}</StyledTableCell>
                      </TableRow>

                      {
                        provision.actionDoc === '1' &&
                        <TableRow className={`${classes.tableBodyRow} ${provision.actionDoc === '1' && classes.actionRow} ${isPrevious2017(provision.registerDate) && 'disabled'}`}>
                          <StyledTableCell colSpan={3}>
                            <Grid container className={classes.actionBox}>
                              <Grid item>
                                <img className={classes.alertIcon} src={AlertIcon} alt='' />
                              </Grid>

                              <Grid item className={classes.alertLabel}>{t('provisions.provisionsList.pendingAction')}</Grid>
                            </Grid>
                          </StyledTableCell>
                        </TableRow>
                      }

                    </>
                  )
                )
            }
          </TableBody>
        </Table>

        {
          listItems.length > 20 &&
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
              handleChangePage={setCurrentPage}
            />
          </Grid>
        }
      </>
    )
  }

  export default withRouter(List)
