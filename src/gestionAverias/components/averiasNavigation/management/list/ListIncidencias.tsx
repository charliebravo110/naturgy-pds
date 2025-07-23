import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { withRouter } from 'react-router'
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import LoadingAnimation from '../../../../../assets/img/spinner.gif'
import Incidencia from '../../../../../assets/icons/icono_rojo_incidencia.svg'
import Programada from '../../../../../assets/icons/icono_azul_programada.svg'
import Aviso from '../../../../../assets/icons/icono_naranja_aviso.svg'
import Spinner from '../../../../../common/components/spinner/Spinner'
import Pagination from '../../../../../common/components/pagination/Pagination2'
import DatepickerV3 from '../../../../../common/components/datepickerV3/DatepickerV3'
import Button from '../../../../../common/components/button/Button'
import { formatDateZeus } from '../../../../../common/lib/FormatLib';
import useStyles, { StyledTableCell } from './List.styles'
import NetIncidenceDialog from '../dialog/NetIncidenceDialog'
import { useMediaQuery } from '@material-ui/core'
import { thunkGetListInterruptions, thunkGetWarningsIncidence, thunkGetListIncidence } from '../../../../../supplies/supplies-details/store/actions/SuppliesDetailsThunkActions'
import AveriasUtils from '../../../../utils/AveriasUtilsClass'
const ListIncidencias = (props: any) => {
	const {
		listItems,
		setFinalList,
		currentPage,
		setCurrentPage,
		itemsPerPage,
		setItemsPerPage,
		totalPages,
		isSubLoading,
		cups
	} = props
	const { t } = useTranslation()
	const dispatch = useDispatch()
	const classes = useStyles({})
	const target = document.getElementById('number') as HTMLSelectElement
	//usamos estas constantes para controlar la ordenación en columnas
	const [orderByTypeAsc, setOrderByTypeAsc] = useState(false)
	const [orderByDateAsc, setOrderByDateAsc] = useState(false)
	const [orderByAfectadaAsc, setOrderByAfectadaAsc] = useState(false)
	const [orderByPotenciaAsc, setOrderByPotenciaAsc] = useState(false)
	const [orderByDuracionAsc, setOrderByDuracionAsc] = useState(false)
	const [orderByProgramadaAsc, setOrderByProgramadaAsc] = useState(false)
	const [orderByInterrupcionesAsc, setOrderByInterrupcionesAsc] = useState(false)
	const [showTypeArrow, setShowTypeArrow] = useState(false)
	const [showDateArrow, setShowDateArrow] = useState(false)
	const [showAfectadaArrow, setShowAfectadaArrow] = useState(false)
	const [showPotenciaArrow, setShowPotenciaArrow] = useState(false)
	const [showDuracionArrow, setShowDuracionArrow] = useState(false)
	const [showProgramadaArrow, setShowProgramadaArrow] = useState(false)
	const [showInterrupcionesArrow, setShowInterrupcionesArrow] = useState(false)
	const [showNetIncidenceDialog, setShowNetIncidenceDialog] = useState(false)
	const [directionNumber, setDirectionNumber] = useState('desc')
	const [incidence, setIncidence] = useState([] as any)
	const [isLoadingList, setIsLoadingList] = useState(false)
	const [firstSearch, setFirstSearch] = useState(true)
	const restarDias = (date: any, dias: number) => {
		date.setDate(date.getDate() - dias)
		return date
	}
	const [datepickerDate1, setDatepickerDate1] = useState<Date>(restarDias(new Date(), 7));
	const [datepickerDate2, setDatepickerDate2] = useState<Date>(new Date());
	const mobileRes = useMediaQuery('(max-width:576px)')

	//ordenamos a partir de la columna tipo
	/*const orderByType = () => {
		setShowTypeArrow(true)
		setShowDateArrow(false)
		setShowAfectadaArrow(false)
		setShowPotenciaArrow(false)
		setShowDuracionArrow(false)
		setShowProgramadaArrow(false)
		setShowInterrupcionesArrow(false)
		setDirectionNumber('desc')
		if (orderByTypeAsc) {
			setFinalList([].concat(listItems).sort().reverse())
			setOrderByTypeAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(listItems).sort((a, b) => a.tipoAviso.localeCompare(b.tipoAviso)))
			setOrderByTypeAsc(true)
			setDirectionNumber('desc')
		}
	}*/
	//ordenamos a partir de la columna date
	const orderByDate = () => {
		setShowTypeArrow(false)
		setShowDateArrow(true)
		setShowAfectadaArrow(false)
		setShowPotenciaArrow(false)
		setShowDuracionArrow(false)
		setShowProgramadaArrow(false)
		setShowInterrupcionesArrow(false)
		setDirectionNumber('desc')
		if (orderByDateAsc) {
			setFinalList([].concat(listItems).sort().reverse())
			setOrderByDateAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(listItems).sort((a, b) => a.incidenceDate.localeCompare(b.incidenceDate)))
			setOrderByDateAsc(true)
			setDirectionNumber('desc')
		}
	}
	//ordenamos a partir de la columna instalación afectada
	const orderByAfectada = () => {
		setShowTypeArrow(false)
		setShowDateArrow(false)
		setShowAfectadaArrow(true)
		setShowPotenciaArrow(false)
		setShowDuracionArrow(false)
		setShowProgramadaArrow(false)
		setShowInterrupcionesArrow(false)
		setDirectionNumber('desc')
		if (orderByDateAsc) {
			setFinalList([].concat(listItems).sort().reverse())
			setOrderByAfectadaAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(listItems).sort((a, b) => a.installationRef.localeCompare(b.installationRef)))
			setOrderByAfectadaAsc(true)
			setDirectionNumber('desc')
		}
	}
	//ordenamos a partir de la columna potencia afectada
	const orderByPotencia = () => {
		setShowTypeArrow(false)
		setShowDateArrow(false)
		setShowAfectadaArrow(false)
		setShowPotenciaArrow(true)
		setShowDuracionArrow(false)
		setShowProgramadaArrow(false)
		setShowInterrupcionesArrow(false)
		setDirectionNumber('desc')
		if (orderByDateAsc) {
			setFinalList([].concat(listItems).sort().reverse())
			setOrderByPotenciaAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(listItems).sort((a, b) => a.affectedPower.localeCompare(b.affectedPower)))
			setOrderByPotenciaAsc(true)
			setDirectionNumber('desc')
		}
	}
	//ordenamos a partir de la columna duración
	const orderByDuration = () => {
		setShowTypeArrow(false)
		setShowDateArrow(false)
		setShowAfectadaArrow(false)
		setShowPotenciaArrow(false)
		setShowDuracionArrow(true)
		setShowProgramadaArrow(false)
		setShowInterrupcionesArrow(false)
		setDirectionNumber('desc')
		if (orderByDateAsc) {
			setFinalList([].concat(listItems).sort().reverse())
			setOrderByDuracionAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(listItems).sort((a, b) => a.interruptionDuration.localeCompare(b.interruptionDuration)))
			setOrderByDuracionAsc(true)
			setDirectionNumber('desc')
		}
	}
	//ordenamos a partir de la columna programada
	const orderByProgress = () => {
		setShowTypeArrow(false)
		setShowDateArrow(false)
		setShowAfectadaArrow(false)
		setShowPotenciaArrow(false)
		setShowDuracionArrow(false)
		setShowProgramadaArrow(true)
		setShowInterrupcionesArrow(false)
		setDirectionNumber('desc')
		if (orderByDateAsc) {
			setFinalList([].concat(listItems).sort().reverse())
			setOrderByProgramadaAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(listItems).sort((a, b) => a.programmed.localeCompare(b.programmed)))
			setOrderByProgramadaAsc(true)
			setDirectionNumber('desc')
		}
	}
	//ordenamos a partir de la columna número de interrupciones
	const orderByInterrupciones = () => {
		setShowTypeArrow(false)
		setShowDateArrow(false)
		setShowAfectadaArrow(false)
		setShowPotenciaArrow(false)
		setShowDuracionArrow(false)
		setShowProgramadaArrow(false)
		setShowInterrupcionesArrow(true)
		setDirectionNumber('desc')
		if (orderByDateAsc) {
			setFinalList([].concat(listItems).sort().reverse())
			setOrderByInterrupcionesAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(listItems).sort((a, b) => a.interruptionCount.localeCompare(b.interruptionCount)))
			setOrderByInterrupcionesAsc(true)
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
	const handleClick = (incidence) => {

		setIsLoadingList(true)
		//disparamos la llamada directamente, esto lo hacemos así pq sino da problemas con la respuesta en OK 
		dispatch(thunkGetWarningsIncidence(incidence.incidenceCode, 'incidence', (responseJson) => {

			if (responseJson?.result?.codResult === '0000' && (responseJson?.result?.msgResult === 'CORRECTO'|| responseJson?.result?.msgResult === 'TRANSACCION CORRECTA')) {

				let auxIncidence = {
					fechaDeteccion: AveriasUtils.FormatDateAveriasPantalla(responseJson.incidence.incidenceStartDate),
					instalacionAfectada: AveriasUtils.FormatCodDescField(responseJson.incidence.refInstallationType,responseJson.incidence.refInstallation),
					numeroInterrupciones: AveriasUtils.FormatTextField(incidence.interruptionCount),
					duracion: incidence.interruptionDuration !== '' && secondsToString(Number(incidence.interruptionDuration)) + 'h',
					potenciaAfectada: AveriasUtils.FormatTextField(incidence.affectedPower) + ((incidence.affectedPower && incidence.powerUnit) ? ' ' : '') + AveriasUtils.FormatTextField(incidence.powerUnit),
					programada: incidence.programmed === 'S' ? 'Si' : 'No',
					seguimientoIncidencia: responseJson.incidence.historicalState,
					seguimientoFechas: responseJson.incidence.historicalStateDate,
					seguimientoObservaciones: AveriasUtils.FormatTextField(responseJson.incidence.historicalStateObs),
					incidenceState: AveriasUtils.FormatTextField(responseJson.incidence.incidenceState),
					fechaPrevistaResolucion: AveriasUtils.FormatDateAveriasPantalla(responseJson.incidence.resolutionDate),
					origin: responseJson.incidence.origin,
					originDesc: responseJson.incidence.originDesc,
					centrolIncidencia: AveriasUtils.FormatCodDescField(responseJson.incidence.base,responseJson.incidence.baseDesc),
					motivoFinalizaciónIncidencia: AveriasUtils.FormatCodDescField(responseJson.incidence.incidenceType, responseJson.incidence.incidenceTypeDesc),
					observacionesIncidencia: responseJson.incidence.incidenceObs,
					observacionesCor: AveriasUtils.FormatTextField(responseJson.incidence.incidenceDesc),
					tensionLevel: responseJson.incidence.tensionLevel,
					numeroAfectados: AveriasUtils.FormatTextField(responseJson.incidence.cups),
					incidenceCode: incidence.incidenceCode
				}
				setIncidence(auxIncidence)
				setIsLoadingList(false)
				setShowNetIncidenceDialog(true)
			} else {
				setIsLoadingList(false)
			}
		}))
	}
	const sumarDias = (date: any, dias: number) => {
		date.setDate(date.getDate() + dias)
		return date
	}
	const performSearch = () => {
		//relanzamos la consulta con las nuevas fechas
		setIsLoadingList(true)
		setFirstSearch(false)
		dispatch(thunkGetListIncidence(cups, datepickerDate1, datepickerDate2, (response) => {
			if (response && response.incidenceList && response.incidenceList.length > 0) {
				let data = {
					sistema: 'ZEUS',
					incidenceList: response.incidenceList
				}
				//setIncidenceData(data)
				dispatch(thunkGetListInterruptions(data, (response) => {
					//cargamos la lista de interupciones
					let auxList = []
					if (response && response.result && response.result.codResult === '0000' && response.incidenceList.length > 0) {
						response.incidenceList.map((item) => {
							auxList.push(item)
						})
					}
					setFinalList(auxList)
					setIsLoadingList(false)
				}));
			}
		}));
	}
	const secondsToString = (seconds: number) => {
		let hour = Math.floor(seconds / 3600).toString()
		hour = (Number(hour) < 10) ? '0' + hour : hour
		let minute = Math.floor((seconds / 60) % 60).toString()
		minute = (Number(minute) < 10) ? '0' + minute : minute
		let second = (seconds % 60).toString()
		second = (Number(second) < 10) ? '0' + second : second
		return hour + ':' + minute + ':' + second
	}
	const setIcon = (incidence: any) => {
		if (incidence.programmed === 'S') {
			return Programada
		} else if (incidence.incidenceCode !== '') {
			return Incidencia
		} else {
			return Aviso
		}
	}
	return (
		<>
			{
				isLoadingList &&
				<Spinner fixed={true} />
			}
			{showNetIncidenceDialog &&
				<NetIncidenceDialog
					showingDialog={showNetIncidenceDialog}
					setShowingDialog={setShowNetIncidenceDialog}
					incidence={incidence}
				/>
			}
			<Grid container className={classes.dateContainer}>
				<Grid item xs={12} sm={12} md={2}>
					<span className={classes.inputTitle}>{t('averias.management.consult.startDate')}</span>
					<DatepickerV3 selectedDate={datepickerDate1} handleChange={setDatepickerDate1} size='m' maxDate={datepickerDate2} dateFormat={'dd/MM/yyyy'} popperPlacement={mobileRes ? 'bottom-start' : 'right-center'} />
				</Grid>
				<Grid item xs={12} sm={12} md={2}>
					<span className={classes.inputTitle}>{t('averias.management.consult.endDate')}</span>
					<DatepickerV3 selectedDate={datepickerDate2} handleChange={setDatepickerDate2} size='m' maxDate={datepickerDate2} dateFormat={'dd/MM/yyyy'} popperPlacement={mobileRes ? 'bottom-start' : 'right-center'} />
				</Grid>
				<Grid item xs={12} sm={12} md={1}>
					<Button
						fullWidth
						className={classes.button}
						text={t('averias.management.consult.searchButton')}
						color='primary'
						size='large'
						variant='contained'
						onClick={performSearch}
					/>
				</Grid>
			</Grid>
			{
				listItems.length > 20 && totalPages > 1 && (currentPage + 1) === totalPages ?
					<Grid container className={classes.totalItems}>
						{listItems.slice((currentPage * itemsPerPage), ((currentPage * itemsPerPage) + itemsPerPage)).length + t('averias.management.consult.incidencesDe') + listItems.length}
						{
							isSubLoading &&
							<img className={classes.loadingAnimation} src={LoadingAnimation} alt='' />
						}
					</Grid>
					:
					listItems.length > 20 && totalPages > 1 ?
						<Grid container className={classes.totalItems}>
							{listItems.slice((currentPage * itemsPerPage), ((currentPage * itemsPerPage) + itemsPerPage)).length + t('averias.management.consult.incidencesDe') + listItems.length}
							{
								isSubLoading &&
								<img className={classes.loadingAnimation} src={LoadingAnimation} alt='' />
							}
						</Grid>
						:
						<Grid container className={classes.totalItems}>
							{listItems.length + ((listItems.length > 1 || listItems.length === 0) ? t('averias.management.consult.incidences') : t('averias.management.consult.incidence')) + (firstSearch ? t('averias.management.consult.incidence7') : '')}
							{
								isSubLoading &&
								<img className={classes.loadingAnimation} src={LoadingAnimation} alt='' />
							}
						</Grid>
			}
			{
				(!mobileRes) ?
				<Table className={classes.suppliesTable}>
				<TableHead>
					<TableRow className={classes.tableRow}>
						<StyledTableCell className={classes.headTableCell} rowSpan={1}>{t('averias.management.consult.columnTipo')}
							{/*<TableSortLabel
                                active={showTypeArrow}
                                direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                                onClick={orderByType}
                            />*/}
						</StyledTableCell>
						<StyledTableCell className={classes.headTableCell} rowSpan={1}>{t('averias.management.consult.columnStartDate2')}
							<TableSortLabel
								active={showDateArrow}
								direction={directionNumber === 'asc' ? 'asc' : 'desc'}
								onClick={orderByDate}
							/>
						</StyledTableCell>
						<StyledTableCell className={classes.headTableCell} rowSpan={1}>{t('averias.management.consult.instalacionInterrumpida')}
							<TableSortLabel
								active={showAfectadaArrow}
								direction={directionNumber === 'asc' ? 'asc' : 'desc'}
								onClick={orderByAfectada}
							/>
						</StyledTableCell>
						<StyledTableCell className={classes.headTableCell} rowSpan={1} style={{ textAlign: 'center' }}>{t('averias.management.consult.potenciaAfectado')}
							<TableSortLabel
								active={showPotenciaArrow}
								direction={directionNumber === 'asc' ? 'asc' : 'desc'}
								onClick={orderByPotencia}
							/>
						</StyledTableCell>
						<StyledTableCell className={classes.headTableCell} rowSpan={1} style={{ textAlign: 'center' }}>{t('averias.management.consult.duration')}
							<TableSortLabel
								active={showDuracionArrow}
								direction={directionNumber === 'asc' ? 'asc' : 'desc'}
								onClick={orderByDuration}
							/>
						</StyledTableCell>
						<StyledTableCell className={classes.headTableCell} rowSpan={1} style={{ textAlign: 'center' }}>{t('averias.management.consult.prog')}
							<TableSortLabel
								active={showProgramadaArrow}
								direction={directionNumber === 'asc' ? 'asc' : 'desc'}
								onClick={orderByProgress}
							/>
						</StyledTableCell>
						<StyledTableCell className={classes.headTableCell} rowSpan={1} style={{ textAlign: 'center' }}>{t('averias.management.consult.inter')}
							<TableSortLabel
								active={showInterrupcionesArrow}
								direction={directionNumber === 'asc' ? 'asc' : 'desc'}
								onClick={orderByInterrupciones}
							/>
						</StyledTableCell>
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
								(incidence, index) => (
									<>
										<TableRow key={index} className={classes.tableBodyRow}>
											<StyledTableCell>{<img src={setIcon(incidence)} className={classes.lockIcon} alt='' />}</StyledTableCell>
											<StyledTableCell>{AveriasUtils.FormatDateAveriasPantalla(incidence.incidenceDate)}</StyledTableCell>
											<StyledTableCell>{AveriasUtils.FormatTextField(incidence.installationRef)}</StyledTableCell>
											<StyledTableCell style={{ textAlign: 'center' }}>{Number(incidence.affectedPower) + ' ' + incidence.powerUnit}</StyledTableCell>
											<StyledTableCell style={{ textAlign: 'center' }}>{incidence.interruptionDuration !== '' && secondsToString(Number(incidence.interruptionDuration)) + 'h'}</StyledTableCell>
											<StyledTableCell style={{ textAlign: 'center' }}>{incidence.programmed === 'S' ? 'Si' : 'No'}</StyledTableCell>
											<StyledTableCell style={{ textAlign: 'center' }}>{AveriasUtils.FormatTextField(incidence.interruptionCount)}</StyledTableCell>
											<StyledTableCell rowSpan={1} className={classes.suppliesTableButtonCell}>
												{
													<div
														className={classes.editButton}
														onClick={() => handleClick(incidence)}
													>
														<p>{t('averias.management.consult.show')}</p>
													</div>
												}
											</StyledTableCell>
										</TableRow>
									</>
								)
							)
					}
				</TableBody>
			</Table>
			: 	<Table>
				{
				listItems.map((incidence, index) => {
				return <Grid key={index} container spacing={2} style={{marginTop:'10px',marginBottom:'10px'}}>
					<Grid item lg={4}  md={6} sm={6} xs={12}>
				<Grid className={`${classes.item}`}>
					<Grid style={{ textAlign: 'center',alignContent:'center' }}  className={classes.rowMosaic}>
					<div className={classes.title}>{t('averias.management.consult.columnTipo')}</div>
					<div className={`${classes.value}`}>{<img  src={setIcon(incidence)} className={classes.lockIcon} alt='' />}</div>
						</Grid>

                   <Grid style={{ textAlign: 'center',alignContent:'center' }}  className={classes.rowMosaic}>
                       <div className={classes.title}>{t('averias.management.consult.columnStartDate2')}</div>
                       <div className={`${classes.value}`}>{AveriasUtils.FormatDateAveriasPantalla(incidence.incidenceDate)}</div>
                   </Grid>

                   <Grid style={{ textAlign: 'center',alignContent:'center' }} className={classes.rowMosaic}>
                       <div className={classes.title}>{t('averias.management.consult.instalacionInterrumpida')}</div>
                       <div className={`${classes.value}`}>{incidence.installationRef}</div>
                   </Grid>

                   <Grid  style={{ textAlign: 'center',alignContent:'center' }} className={classes.rowMosaic}>
                       <div className={classes.title}>{t('averias.management.consult.potenciaAfectado')}</div>
                       <div className={`${classes.value}`}>{Number(incidence.affectedPower) + ' ' + incidence.powerUnit}</div>
                   </Grid>

                   <Grid  style={{ textAlign: 'center',alignContent:'center' }} className={classes.rowMosaic}>
                       <div className={classes.title}>{t('averias.management.consult.duration')}</div>
                       <div className={`${classes.value}`}>{incidence.interruptionDuration !== '' && secondsToString(Number(incidence.interruptionDuration)) + 'h'}</div>
                   </Grid>

                   <Grid style={{ textAlign: 'center',alignContent:'center' }} className={classes.rowMosaic}>
                       <div className={classes.title}>{t('averias.management.consult.prog')}</div>
                       <div className={`${classes.value}`}>{incidence.programmed === 'S' ? 'Si' : 'No'}</div>
                   </Grid>

                   <Grid style={{ textAlign: 'center',alignContent:'center' }} className={classes.rowMosaic}>
                       <div className={classes.title}>{t('averias.management.consult.inter')}</div>
                       <div className={`${classes.value}`}>{AveriasUtils.FormatTextField(incidence.interruptionCount)}</div>
                   </Grid>

                   
                   <Grid  className={classes.rowMosaic}>
                   
                   							{
                                                   <div style={{display:'grid'}} className={classes.editButton} onClick={() => handleClick(incidence)}>
                                                      	 <p>{t('averias.management.consult.show')}</p>
                                                   </div>
                                               }
                                               
                   </Grid>
                   </Grid>
                   </Grid>
				</Grid>
			})}
			</Table>
			}
			
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
export default withRouter(ListIncidencias)
