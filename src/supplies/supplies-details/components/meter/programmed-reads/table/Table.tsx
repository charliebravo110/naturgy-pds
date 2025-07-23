import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import MUiTable from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'

import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'

import Pagination from './pagination/Pagination'

import ClockIcon from '../../../../../../assets/icons/seleccionar_hora_naranja.svg'

import { formatDayAndMonthAndYear } from '../../../../../../common/lib/FormatLib'

import useStyles, { StyledTableCell } from './Table.styles'
import Select from '../../../../../../common/components/select/Select'
import { any } from 'prop-types'
import Dates from '../../../certificates/toolbar/dates/Dates'
import { intlFormat } from 'date-fns'
import { thunkListDelegatesByCreatorUserId, thunkListDelegatesByDocId } from '../../../../../../delegates/store/actions/DelegatesThunkActions'
import { thunkListProgrammedReads } from '../../../../store/actions/SuppliesDetailsThunkActions'

const Table = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Comentado RVD - PPM 1009750 - Historial de Consultas y consultas al contador programadas
  //const selectorProgrammedReads = useSelector((state: any) => state.supplies.currentSupplyProgrammedReads)

  const user = useSelector((state: any) => state.user.profile)
  const admin = useSelector((state: any) => state.admin.profile)
  const delegatesInMeList = useSelector((state: any) => state.delegations.delegatesInMeList)


  const [newProgrammedQuery, setNewPorgrammedQuery] = useState([any])


  const { supplyData, setIsLoading } = props

  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 15
  const [totalPages, setTotalPages] = useState(0)
  const [trifasic, setTrifasic] = useState(false)

  // INI RVD - PPM 1009750
  const [programmedReads, setProgrammedReads] = useState({
    count: 0,
    items: [],
    xMessageId: ''
  })

  const [initialProgrammedReads, setinitialProgrammedReads] = useState({
    count: 0,
    items: [],
    xMessageId: ''
  })

  const [IdDelegatesList, setIdDelegatesList] = useState('')
  const [IdDelegatesInMeList, setIdDelegatesInMeList] = useState('')
  const delegatedCups = delegatesInMeList && delegatesInMeList.find(item => item.cups === supplyData.cups)

  // FIN RVD - PPM 1009750

  useEffect(() => {
    setTotalPages(programmedReads?.count === 0 ? 1 : Math.ceil(programmedReads?.count / itemsPerPage))
  }, [programmedReads?.items])


  useEffect(() => {
    if (supplyData.installationType == 'Trifásica' || supplyData.installationType == 'TRIFÁSICA') {
      setTrifasic(true)
    }

  }, [])

  useEffect(() => {

    const meterId = (
      supplyData &&
      supplyData.measurementEquipments &&
      supplyData.measurementEquipments.meters[0] &&
      supplyData.measurementEquipments.meters[0].meter
    ) ?
      supplyData.measurementEquipments.meters[0].meter
      :
      ''

    dispatch(thunkListProgrammedReads(meterId, 0, 0, (reads) => {

      setinitialProgrammedReads(reads)

    }))
  }, [])


  // INI RVD - PPM 1009750
  useEffect(() => {
    if (user && user.userId) {
      dispatch(thunkListDelegatesByCreatorUserId(user.userId, (response) => {
        if (response) {
          const items = response.delegates?.items;
          const userIds = items.map(item => item.userId.toString())
          setIdDelegatesList(userIds)
        }
      }))
    }

    if (delegatedCups) {
      if (user && user.documentNumber) {
        dispatch(thunkListDelegatesByDocId(user.documentNumber, (response) => {
          if (response) {
            const items = response.delegates?.items;
            const userIds = items.map(item => item.creatorUserId.toString())
            setIdDelegatesInMeList(userIds)
          }
        }))
      }
    }

  }, [user, delegatedCups])
  // FIN RVD - PPM 1009750

  const sortData = (a: any, b: any) => {
    // TODO MAA funcion para formatear la data
    let hour_a = a.hour.split(':')
    let date_a = a.programmedDate.split('/')
    let aDate = new Date(Date.UTC(parseInt(date_a[2]), parseInt(date_a[1]) - 1, parseInt(date_a[0]), parseInt(hour_a[0]), parseInt(hour_a[1]), 0))



    let hour_b = b.hour.split(':')
    let date_b = b.programmedDate.split('/')
    let bDate = new Date(Date.UTC(parseInt(date_b[2]), parseInt(date_b[1]) - 1, parseInt(date_b[0]), parseInt(hour_b[0]), parseInt(hour_b[1]), 0))



    if (aDate.getTime() < bDate.getTime()) {

      return 1
    } else {

      return -1
    }

  }

  const formatNumberES = (numero: Number) => {
    let cadena: string = '';
    let sNumero = numero.toString();

    if (sNumero.length == 4) {
      if (sNumero.includes('.') || sNumero.includes(',')) {
        return numero.toLocaleString('es-ES');
      } else {
        let cadena = numero.toLocaleString('es-ES');
        const result = cadena.slice(0, 1) + '.' + cadena.slice(1);
        return result;
      }
    } else {
      return numero.toLocaleString('es-ES');
    }

  }

  // INI RVD - PPM 1009750 (Mostrar sólo las consultas del propio usuario para clientes y todas para el usuario administrador)
  useEffect(() => {
    if (initialProgrammedReads && initialProgrammedReads?.items && initialProgrammedReads?.items.length > 0) {
      if (admin.userId) {
        setProgrammedReads(initialProgrammedReads)
      }
      else {
        const userItems = initialProgrammedReads?.items.filter((item) => {
          if (item.actionId.split('/')[0] && item.actionId.split('/')[0] === user.userId) {
            return item
          }
          else if (item.actionId.split('/')[0] && IdDelegatesList && IdDelegatesList.includes(item.actionId.split('/')[0])) {
            return item
          }
          else if (item.actionId.split('/')[0] && delegatedCups && IdDelegatesInMeList.includes(item.actionId.split('/')[0])) {
            return item
          }
          else if (item.actionId.split('/')[0] && item.actionId.split('/')[0] === '0') {
            return item
          }

        })
        const auxProgrammedReads = {
          count: userItems.length,
          items: userItems,
          xMessageId: (initialProgrammedReads && initialProgrammedReads.xMessageId) ? initialProgrammedReads.xMessageId : ''
        }
        setProgrammedReads(auxProgrammedReads)
      }
    }
    else {
      setProgrammedReads(initialProgrammedReads)
    }
  }, [initialProgrammedReads, IdDelegatesList, IdDelegatesInMeList, delegatedCups])
  // FIN RVD - PPM 1009750 (Mostrar sólo las consultas del propio usuario para clientes y todas para el usuario administrador)

  return (
    <>
      {
        !mobile ?
          <>
            <Grid container className={classes.container}>
              <MUiTable className={classes.messagesTable}>
                <TableHead className={classes.header}>
                  {
                    programmedReads?.items && programmedReads?.items.length === 0 ?
                      <></>
                      :
                      <TableRow>
                        <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                          {t('supplies.suppliesDetails.components.meter.programmedReads.table.date')}
                        </StyledTableCell>
                        <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                          {t('supplies.suppliesDetails.components.meter.programmedReads.table.hour')}
                        </StyledTableCell>
                        <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                          {t('supplies.suppliesDetails.components.meter.programmedReads.table.tension')}
                        </StyledTableCell>
                        <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                          {t('supplies.suppliesDetails.components.meter.programmedReads.table.potenciaInstantanea')}
                        </StyledTableCell>
                        <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                          {t('supplies.suppliesDetails.components.meter.programmedReads.table.periodo')}
                        </StyledTableCell>
                        <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                          {t('supplies.suppliesDetails.components.meter.programmedReads.table.lecturaKWh')}
                        </StyledTableCell>
                        <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                          {t('supplies.suppliesDetails.components.meter.programmedReads.table.estadoConsulta')}
                        </StyledTableCell>
                        <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                          {t('supplies.suppliesDetails.components.meter.programmedReads.table.state')}
                        </StyledTableCell>
                      </TableRow>
                  }
                </TableHead>

                <TableBody>
                  {

                    programmedReads?.items && (
                      programmedReads?.items.length === 0 ?
                        <TableRow>
                          <TableCell className={classes.noResults} colSpan={12}>
                            {t('supplies.suppliesDetails.components.meter.programmedReads.noItems')}
                          </TableCell>
                        </TableRow>
                        :
                        programmedReads?.items.slice(
                          (currentPage * itemsPerPage),
                          ((currentPage * itemsPerPage) + itemsPerPage)
                          // TODO MAA descomentar para realizar el sort de la tabla de lecturas
                        ).sort((a, b) => sortData(a, b)
                        ).map((item, index) => {
                          //mostramos lecturas cuando el usuario es administrador o no es administrador i la lectura tiene el userID del user
                          // TODO MAA descomentar per provar lo de no veure consultes feta per admin
                          let queryID: string[] = [];
                          let numPowerTotal: string = formatNumberES(parseFloat(item.power) / 1000);
                          let periodo1: string = formatNumberES(parseFloat(item.periodo1));
                          let periodo2: string = formatNumberES(parseFloat(item.periodo2));
                          let periodo3: string = formatNumberES(parseFloat(item.periodo3));
                          let periodo4: string = formatNumberES(parseFloat(item.periodo4));
                          let periodo5: string = formatNumberES(parseFloat(item.periodo5));
                          let periodo6: string = formatNumberES(parseFloat(item.periodo6));
                          let totalizador: string = formatNumberES(parseFloat(item.totalizador));
                          let voltageMonofasico: string = formatNumberES(parseFloat(item.voltage))
                          if (item.actionId) {

                            queryID = item.actionId.split('/');

                          } else {

                            queryID.push(user.userId);
                          }
                          if (admin.userId || (!admin.userId && (queryID[0] === user.userId || queryID[0] === '0')) || (!admin.userId && IdDelegatesList.includes(queryID[0])) || (!admin.userId && delegatedCups && IdDelegatesInMeList && IdDelegatesInMeList.includes(queryID[0]))) {
                            //tratamos los datos para cada una de las lecturas anteriores
                            // partimos potencias y voltages para contadores trifasicos
                            let power = item.power.split(',');
                            let power0: string = formatNumberES(parseFloat(power[0]) / 1000);
                            let power1: string = formatNumberES(parseFloat(power[1]) / 1000);
                            let power2: string = formatNumberES(parseFloat(power[2]) / 1000);
                            let voltage = item.voltage.split(',')
                            let periodList = []
                            //tratamos periodos
                            item.periodo1 ? periodList.push(t('supplies.suppliesDetails.components.meter.connectSuccess.period.period1') + ' ' + (formatNumberES(parseFloat(periodo1)))) : periodList.push(t('supplies.suppliesDetails.components.meter.connectSuccess.period.period1') + ' ' + 0)
                            item.periodo2 ? periodList.push(t('supplies.suppliesDetails.components.meter.connectSuccess.period.period2') + ' ' + (formatNumberES(parseFloat(periodo2)))) : periodList.push(t('supplies.suppliesDetails.components.meter.connectSuccess.period.period2') + ' ' + 0)
                            item.periodo3 ? periodList.push(t('supplies.suppliesDetails.components.meter.connectSuccess.period.period3') + ' ' + (formatNumberES(parseFloat(periodo3)))) : periodList.push(t('supplies.suppliesDetails.components.meter.connectSuccess.period.period3') + ' ' + 0)
                            if (item.periodo4) periodList.push(t('supplies.suppliesDetails.components.meter.connectSuccess.period.period4') + ' ' + (formatNumberES(parseFloat(periodo4))))
                            if (item.periodo5) periodList.push(t('supplies.suppliesDetails.components.meter.connectSuccess.period.period5') + ' ' + (formatNumberES(parseFloat(periodo5))))
                            if (item.periodo6) periodList.push(t('supplies.suppliesDetails.components.meter.connectSuccess.period.period6') + ' ' + (formatNumberES(parseFloat(periodo6))))
                            let state = item.state === 'PENDING' ?
                              t('supplies.suppliesDetails.components.meter.programmedReads.statePending')
                              :
                              item.state === 'OK' ?
                                t('supplies.suppliesDetails.components.meter.programmedReads.stateOk')
                                :
                                t('supplies.suppliesDetails.components.meter.programmedReads.stateError')

                            return (
                              <TableRow key={index} className={classes.tableBodyRow}>
                                <StyledTableCell>{item.programmedDate}</StyledTableCell>
                                <StyledTableCell>{item.hour}</StyledTableCell>

                                <StyledTableCell>
                                  {/*
                                    En caso de que sea trifasico muestra lo siguiente
                                  */}
                                  {trifasic ?
                                    <>
                                      <div>
                                        {t('supplies.suppliesDetails.components.meter.connectSuccess.phases.phase1')}
                                        {voltage[0] && voltage[0] !== '0' ? formatNumberES(parseFloat(voltage[0])) : 0}
                                      </div>
                                      <div>
                                        {t('supplies.suppliesDetails.components.meter.connectSuccess.phases.phase2')}
                                        {voltage[1] && voltage[1] !== '0' ? formatNumberES(parseFloat(voltage[1])) : 0}
                                      </div>
                                      <div>
                                        {t('supplies.suppliesDetails.components.meter.connectSuccess.phases.phase3')}
                                        {voltage[2] && voltage[2] !== '0' ? formatNumberES(parseFloat(voltage[2])) : 0}
                                      </div>
                                    </>
                                    :
                                    <>
                                      <div>
                                        {voltageMonofasico && voltageMonofasico !== '0' ? formatNumberES(parseFloat(voltageMonofasico)) : 0}
                                      </div>
                                    </>
                                  }
                                </StyledTableCell>
                                <StyledTableCell>
                                  {/*
                                    En caso de que sea trifasico muestra lo siguiente
                                  */}
                                  {trifasic ?
                                    <>
                                      <div>
                                        {t('supplies.suppliesDetails.components.meter.connectSuccess.phases.phase1')}
                                        {power[0] && power[0] !== '0' ? (power0) : 0}
                                      </div>
                                      <div>
                                        {t('supplies.suppliesDetails.components.meter.connectSuccess.phases.phase2')}
                                        {power[1] && power[1] !== '0' ? (power1) : 0}
                                      </div>
                                      <div>
                                        {t('supplies.suppliesDetails.components.meter.connectSuccess.phases.phase3')}
                                        {power[2] && power[2] !== '0' ? (power2) : 0}
                                      </div>
                                    </>
                                    :
                                    <>
                                      <div>
                                        {numPowerTotal && numPowerTotal !== '0' ? (numPowerTotal) : 0}
                                      </div>
                                    </>
                                  }
                                </StyledTableCell>

                                {/* falta añadir el periodo en la lista de consultas programdas */}
                                <StyledTableCell>
                                  <select className={classes.select}>
                                    <option selected>{periodList[0]}</option>
                                    <option >{periodList[1]}</option>
                                    <option >{periodList[2]}</option>
                                    {periodList[3] ?
                                      <option >{periodList[3]}</option>
                                      : ''
                                    }
                                    {periodList[4] ?
                                      <option >{periodList[4]}</option>
                                      : ''
                                    }
                                    {periodList[5] ?
                                      <option >{periodList[5]}</option>
                                      : ''
                                    }
                                  </select>
                                </StyledTableCell>
                                <StyledTableCell>
                                  <div>
                                    {totalizador && totalizador !== '0' && totalizador !== 'NaN' ? formatNumberES(parseFloat(totalizador)) : 0}
                                  </div>
                                </StyledTableCell>
                                <StyledTableCell className={classes.blueColor}>
                                  {
                                    item.state === 'PENDING' &&
                                    <img className={classes.icon} src={ClockIcon} alt='' />
                                  }
                                  {state}
                                </StyledTableCell>
                                <StyledTableCell>
                                  {
                                    item.meterStatus === '0' ?
                                      t('supplies.suppliesDetails.components.meter.programmedReads.state0')
                                      : item.meterStatus === '1' ?
                                        t('supplies.suppliesDetails.components.meter.programmedReads.state1')
                                        : item.meterStatus === '2' ?
                                          t('supplies.suppliesDetails.components.meter.programmedReads.state2')
                                          : ''
                                  }
                                </StyledTableCell>
                              </TableRow>
                            )
                            // TODO MAA descomentar per provar lo de no veure consultes feta per admin
                          }
                        })

                    )
                  }
                </TableBody>
              </MUiTable>
            </Grid>

            <Pagination
              supplyData={supplyData}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              setIsLoading={setIsLoading}
            />

            {/*RVD A implementar */}
            {/* <Pagination 
      currentPage={currentPage} 
      totalPages={totalPages} 
      handleChangePage={setCurrentPage} 
      /> */}

          </>

          :
          <>
            <Grid container className={classes.container}>
              {
                programmedReads?.items && (
                  programmedReads?.items.length === 0 ?
                    <TableRow>
                      <TableCell className={classes.noResults} colSpan={12}>
                        {t('supplies.suppliesDetails.components.meter.programmedReads.noItems')}
                      </TableCell>
                    </TableRow>
                    :
                    programmedReads?.items.slice(
                      (currentPage * itemsPerPage),
                      ((currentPage * itemsPerPage) + itemsPerPage)
                      // TODO MAA descomentar para realizar el sort de la tabla de lecturas
                    ).sort((a, b) => sortData(a, b)
                    ).map((item, index) => {
                      //mostramos lecturas cuando el usuario es administrador o no es administrador i la lectura tiene el userID del user
                      // TODO MAA descomentar per provar lo de no veure consultes feta per admin
                      let queryID: string[] = [];
                      let numPowerTotal: string = formatNumberES(parseFloat(item.power) / 1000);
                      let periodo1: string = formatNumberES(parseFloat(item.periodo1));
                      let periodo2: string = formatNumberES(parseFloat(item.periodo2));
                      let periodo3: string = formatNumberES(parseFloat(item.periodo3));
                      let periodo4: string = formatNumberES(parseFloat(item.periodo4));
                      let periodo5: string = formatNumberES(parseFloat(item.periodo5));
                      let periodo6: string = formatNumberES(parseFloat(item.periodo6));
                      let totalizador: string = formatNumberES(parseFloat(item.totalizador));

                      if (item.actionId) {
                        queryID = item.actionId.split('/');
                      } else {
                        queryID.push(user.userId);
                      }

                      if (admin.userId || (!admin.userId && queryID[0] === user.userId) || (!admin.userId && IdDelegatesList.includes(queryID[0]) || (!admin.userId && delegatedCups && IdDelegatesInMeList && IdDelegatesInMeList.includes(queryID[0])))) {
                        //tratamos los datos para cada una de las lecturas anteriores
                        // partimos potencias y voltages para contadores trifasicos
                        let power = item.power.split(',');
                        let power0: string = formatNumberES(parseFloat(power[0]) / 1000);
                        let power1: string = formatNumberES(parseFloat(power[1]) / 1000);
                        let power2: string = formatNumberES(parseFloat(power[2]) / 1000);
                        let voltage = item.voltage.split(',')
                        let periodList = []
                        //tratamos periodos
                        item.periodo1 ? periodList.push(t('supplies.suppliesDetails.components.meter.connectSuccess.period.period1') + ' ' + (formatNumberES(parseFloat(periodo1)))) : periodList.push(t('supplies.suppliesDetails.components.meter.connectSuccess.period.period1') + ' ' + 0)
                        item.periodo2 ? periodList.push(t('supplies.suppliesDetails.components.meter.connectSuccess.period.period2') + ' ' + (formatNumberES(parseFloat(periodo2)))) : periodList.push(t('supplies.suppliesDetails.components.meter.connectSuccess.period.period2') + ' ' + 0)
                        item.periodo3 ? periodList.push(t('supplies.suppliesDetails.components.meter.connectSuccess.period.period3') + ' ' + (formatNumberES(parseFloat(periodo3)))) : periodList.push(t('supplies.suppliesDetails.components.meter.connectSuccess.period.period3') + ' ' + 0)
                        if (item.periodo4) periodList.push(t('supplies.suppliesDetails.components.meter.connectSuccess.period.period4') + ' ' + (formatNumberES(parseFloat(periodo4))))
                        if (item.periodo5) periodList.push(t('supplies.suppliesDetails.components.meter.connectSuccess.period.period5') + ' ' + (formatNumberES(parseFloat(periodo5))))
                        if (item.periodo6) periodList.push(t('supplies.suppliesDetails.components.meter.connectSuccess.period.period6') + ' ' + (formatNumberES(parseFloat(periodo6))))
                        let state = item.state === 'PENDING' ?
                          t('supplies.suppliesDetails.components.meter.programmedReads.statePending')
                          :
                          item.state === 'OK' ?
                            t('supplies.suppliesDetails.components.meter.programmedReads.stateOk')
                            :
                            t('supplies.suppliesDetails.components.meter.programmedReads.stateError')

                        // TODO MAA descomentar per provar lo de no veure consultes feta per admin
                        return (
                          <Grid item key={index} lg={4} md={6} sm={6} xs={12}>
                            <Grid className={classes.item}>
                              <Grid className={classes.row}>
                                <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.date')}</Typography>
                                <Typography className={classes.value}>{item.programmedDate}</Typography>
                              </Grid>
                              <Grid className={classes.row}>
                                <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.hour')}</Typography>
                                <Typography className={classes.value}>{item.hour}</Typography>
                              </Grid>
                              <Grid className={classes.row}>
                                <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.tension')}</Typography>
                                <Typography className={classes.value}>
                                  {/*
                                    En caso de que sea trifasico muestra lo siguiente
                                  */}
                                  {trifasic ?
                                    <>
                                      <div>
                                        {t('supplies.suppliesDetails.components.meter.connectSuccess.phases.phase1')}
                                        {voltage[0] && voltage[0] !== '0' ? formatNumberES(parseFloat(voltage[0])) : 0}
                                      </div>
                                      <div>
                                        {t('supplies.suppliesDetails.components.meter.connectSuccess.phases.phase2')}
                                        {voltage[1] && voltage[1] !== '0' ? formatNumberES(parseFloat(voltage[1])) : 0}
                                      </div>
                                      <div>
                                        {t('supplies.suppliesDetails.components.meter.connectSuccess.phases.phase3')}
                                        {voltage[2] && voltage[2] !== '0' ? formatNumberES(parseFloat(voltage[2])) : 0}
                                      </div>
                                    </>
                                    :
                                    <>
                                      <div>
                                        {item.voltage && item.voltage !== '0' ? formatNumberES(parseFloat(item.voltage)) : 0}
                                      </div>
                                    </>
                                  }
                                </Typography>
                              </Grid>
                              <Grid className={classes.row}>
                                <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.potenciaInstantanea')}</Typography>
                                <Typography className={classes.value}>
                                  {/*
                                    En caso de que sea trifasico muestra lo siguiente
                                  */}
                                  {trifasic ?
                                    <>
                                      <div>
                                        {t('supplies.suppliesDetails.components.meter.connectSuccess.phases.phase1')}
                                        {power[0] && power[0] !== '0' ? (power0) : 0}
                                      </div>
                                      <div>
                                        {t('supplies.suppliesDetails.components.meter.connectSuccess.phases.phase2')}
                                        {power[1] && power[1] !== '0' ? (power1) : 0}
                                      </div>
                                      <div>
                                        {t('supplies.suppliesDetails.components.meter.connectSuccess.phases.phase3')}
                                        {power[2] && power[2] !== '0' ? (power2) : 0}
                                      </div>
                                    </>
                                    :
                                    <>
                                      <div>
                                        {item.power && item.power !== '0' ? (numPowerTotal) : 0}
                                      </div>
                                    </>
                                  }
                                </Typography>
                              </Grid>
                              <Grid className={classes.row}>
                                <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.periodo')}</Typography>
                                <Typography className={classes.value}>
                                  <select className={classes.select}>
                                    <option selected>{periodList[0]}</option>
                                    <option >{periodList[1]}</option>
                                    <option >{periodList[2]}</option>
                                    {periodList[3] ?
                                      <option >{periodList[3]}</option>
                                      : ''
                                    }
                                    {periodList[4] ?
                                      <option >{periodList[4]}</option>
                                      : ''
                                    }
                                    {periodList[5] ?
                                      <option >{periodList[5]}</option>
                                      : ''
                                    }
                                  </select>
                                </Typography>
                              </Grid>
                              <Grid className={classes.row}>
                                <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.lecturaKWh')}</Typography>
                                <Typography className={classes.value}>
                                  <div>
                                    {totalizador && totalizador !== '0' && totalizador !== 'NaN' ? formatNumberES(parseFloat(totalizador)) : 0}
                                  </div>
                                </Typography>
                              </Grid>
                              <Grid className={classes.row}>
                                <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.estadoConsulta')}</Typography>
                                <Typography className={classes.blueColor}>
                                  {
                                    item.state === 'PENDING' &&
                                    <img className={classes.icon} src={ClockIcon} alt='' />
                                  }
                                  {state}
                                </Typography>
                              </Grid>
                              <Grid className={classes.row}>
                                <Typography className={classes.title}>{t('supplies.suppliesDetails.components.meter.programmedReads.table.state')}</Typography>
                                <Typography className={classes.value}>
                                  {
                                    item.meterStatus === '0' ?
                                      t('supplies.suppliesDetails.components.meter.programmedReads.state0')
                                      : item.meterStatus === '1' ?
                                        t('supplies.suppliesDetails.components.meter.programmedReads.state1')
                                        : item.meterStatus === '2' ?
                                          t('supplies.suppliesDetails.components.meter.programmedReads.state2')
                                          : ''
                                  }
                                </Typography>
                              </Grid>
                            </Grid>
                          </Grid>
                        )
                      }

                    })
                )
              }
            </Grid>

            <Pagination
              supplyData={supplyData}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              setIsLoading={setIsLoading}
            />
          </>
      }
    </>
  )
}

export default Table
