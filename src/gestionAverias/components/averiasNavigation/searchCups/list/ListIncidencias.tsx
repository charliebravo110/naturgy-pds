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
import Typography from '@material-ui/core/Typography'

import LoadingAnimation from '../../../../../assets/img/spinner.gif'
import Incidencia from '../../../../../assets/icons/icono_rojo_incidencia.svg'
import Programada from '../../../../../assets/icons/icono_azul_programada.svg'
import Aviso from '../../../../../assets/icons/icono_naranja_aviso.svg'

import Spinner from '../../../../../common/components/spinner/Spinner'
import Pagination from '../../../../../common/components/pagination/Pagination2'
import DatepickerV3 from '../../../../../common/components/datepickerV3/DatepickerV3'
import Button from '../../../../../common/components/button/Button'

import AveriasUtils from '../../../../utils/AveriasUtilsClass'

import useStyles, { StyledTableCell } from './List.styles'

import { thunkGetListInterruptions, thunkGetWarningsIncidence, thunkGetListIncidence } from '../../../../../supplies/supplies-details/store/actions/SuppliesDetailsThunkActions'
import NetIncidenceDialog from '../../management/dialog/NetIncidenceDialog'

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
		setIncidencesLoading,
		cups,
		setIsRequestModalVisible,
		setCrearAvisoFromIncidence,
		tabletRes,
		mobileRes
	} = props

	const { t } = useTranslation()
	const dispatch = useDispatch()

	const classes = useStyles({})

	const target = document.getElementById('number') as HTMLSelectElement

	//usamos estas constantes para controlar la ordenación en columnas
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
	const [showNetIncidence, setShowNetIncidence] = useState(false)
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
		if (orderByAfectadaAsc) {
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
		if (orderByPotenciaAsc) {
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
		if (orderByDuracionAsc) {
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
		if (orderByProgramadaAsc) {
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
		if (orderByInterrupcionesAsc) {
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
		setIncidencesLoading(true)
		//disparamos la llamada directamente, esto lo hacemos así pq sino da problemas con la respuesta en OK 
		dispatch(thunkGetWarningsIncidence(incidence.incidenceCode, 'incidence', (response) => {
			setIncidencesLoading(false)

			if (response && response.result && response.result.codResult === '0000' && (response.result.msgResult === 'CORRECTO' || response.result.msgResult === 'TRANSACCION CORRECTA')) {

				let auxIncidence = {
					fechaDeteccion: AveriasUtils.FormatDateAveriasPantalla(response.incidence.incidenceStartDate),
					instalacionAfectada: AveriasUtils.FormatCodDescField(response.incidence.refInstallationType, response.incidence.refInstallation),
					numeroInterrupciones: AveriasUtils.FormatTextField(incidence.interruptionCount),
					duracion: incidence.interruptionDuration !== '' && secondsToString(Number(incidence.interruptionDuration)) + 'h',
					potenciaAfectada: Number(incidence.affectedPower) + ' ' + incidence.powerUnit,
					programada: incidence.programmed === 'S' ? 'Si' : 'No',
					seguimientoIncidencia: response.incidence.historicalState,
					seguimientoFechas: response.incidence.historicalStateDate,
					seguimientoObservaciones: response.incidence.historicalStateObs,
					incidenceState: AveriasUtils.FormatTextField(response.incidence.incidenceState),
					fechaPrevistaResolucion: AveriasUtils.FormatDateAveriasPantalla(response.incidence.resolutionDate),
					origin: response.incidence.origin,
					originDesc: response.incidence.originDesc,
					centrolIncidencia: AveriasUtils.FormatCodDescField(response.incidence.base,response.incidence.baseDesc),
					motivoFinalizaciónIncidencia: AveriasUtils.FormatCodDescField(response.incidence.incidenceType, response.incidence.incidenceTypeDesc),
					observacionesIncidencia: response.incidence.incidenceObs,
					observacionesCor: AveriasUtils.FormatTextField(response.incidence.incidenceDesc),
					tensionLevel: response.incidence.tensionLevel,
					numeroAfectados: AveriasUtils.FormatTextField(response.incidence.cups),
					incidenceCode: incidence.incidenceCode
				}
				setIncidence(auxIncidence)
				setIsLoadingList(false)
				setShowNetIncidence(true)
				//setShowNetIncidenceDialog(true)
			} else {
				setIsLoadingList(false)
			}
		}))
	}

	const performSearch = () => {
		//relanzamos la consulta con las nuevas fechas
		setIsLoadingList(true)
		setFirstSearch(false)
		//let startDate = formatDateZeus(datepickerDate1)
		//let endDate = formatDateZeus(sumarDias(datepickerDate2, 1))
		setIncidencesLoading(true)
		dispatch(thunkGetListIncidence(cups, datepickerDate1, datepickerDate2, (response) => {
			setIncidencesLoading(false)
			if (response && response.incidenceList && response.incidenceList.length > 0) {
				let data = {
					sistema: 'ZEUS',
					incidenceList: response.incidenceList
				}
				//setIncidenceData(data)
				setIncidencesLoading(true)
				dispatch(thunkGetListInterruptions(data, (response) => {
					setIncidencesLoading(false)
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

	const getStatus = (status: string) => {
		switch (status) {
			case 'PR':
				return ('ABIERTA')
			case 'PT':
				return ('ABIERTA')
			case 'EB':
				return ('EN CURSO')
			case 'CL':
				return ('EN CURSO')
			case 'ER':
				return ('EN CURSO')
			case 'SR':
				return ('RESUELTA')
			case 'RS':
				return ('RESUELTA')
			case 'EMCI':
				return ('EN CURSO')
			case 'EMSI':
				return ('EN CURSO')
			case 'EM':
				return ('RESUELTA')
		}
	}

	const resetIncidence = () => {
		setShowNetIncidence(false)
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

	const setIcon2 = (incidence: any) => {
		if (incidence.programada === 'Si') {
			return Programada
		} else if (incidence.code !== '') {
			return Incidencia
		} else {
			return Aviso
		}
	}

	const setType = (incidence: any) => {
		if (incidence.programada === 'Si') {
			return t('averias.management.consult.corteProgramado')
		} else if (incidence.code !== '') {
			return t('averias.management.consult.avisoIncidencia')
		} else {
			return t('averias.management.consult.aviso')
		}
	}

	const handleClickCrear = () => {
		setCrearAvisoFromIncidence(true)
		setIsRequestModalVisible(true)
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
			{
				showNetIncidence &&
				<>
					<Grid container className={classes.topContainer}>
						<Grid container className={classes.inTopContainer}>
							<img className={classes.expansionPanelSummaryIcon} src={setIcon2(incidence)} alt='' />
							<Grid item md={10} sm={12} xs={12}>
								<Typography className={classes.expansionPanelSummaryText}>{setType(incidence)}<a>{'  ' + AveriasUtils.FormatCodDescField(incidence.incidenceState,getStatus(incidence.incidenceState))}</a></Typography>
							</Grid>
							{/* i168 - Ocultar botón - Es esencial que se oculte el botón de “Crear aviso” en el detalle de la cabecera al ver una incidencia de la red. La acción que realiza no es la adecuada y el camino correcto ya está cubierto por flujograma
								
							<Grid item md={6} sm={12} xs={12} className='buttons' style={{ textAlign: 'end' }}>
								<Button
									className={classes.buttonCrearAviso}
									text={t('averias.management.consult.crearAviso')}
									color='primary'
									size='small'
									variant='contained'
									onClick={handleClickCrear}
									disabled={getStatus(incidence.incidenceState) === 'RESUELTA' ? true : false}
								/>
							</Grid>
							*/}
							<Grid item md={1} sm={12} xs={12} className={classes.end}>
								<Typography className={classes.link} onClick={() => setShowNetIncidenceDialog(true)}>{t('averias.management.consult.show')}</Typography>
							</Grid>
						</Grid>
						<Grid container className={classes.line} />
						<Grid container className={classes.inTopContainer}>
							<Grid item md={3} sm={12} xs={12}>
								<Typography className={classes.subTitle}>{t('averias.management.consult.columnStartDate')}</Typography>
								{AveriasUtils.FormatDateAveriasPantalla(incidence.fechaDeteccion)}
							</Grid>
							<Grid item md={3} sm={12} xs={12}>
								<Typography className={classes.subTitle}>{t('averias.management.consult.instalacionAfectada')}</Typography>
								{incidence.instalacionAfectada}
							</Grid>
							<Grid item md={3} sm={12} xs={12}>
								<Typography className={classes.subTitle}>{t('averias.management.consult.numInterrupciones')}</Typography>
								{AveriasUtils.FormatTextField(incidence.numeroInterrupciones)}
							</Grid>
							<Grid item md={3} sm={12} xs={12}>
								<Typography className={classes.subTitle}>{t('averias.management.consult.duracion')}</Typography>
								{incidence.duracion}
							</Grid>
							<Grid item md={3} sm={12} xs={12}>
								<Typography className={classes.subTitle}>{t('averias.management.consult.fechaPrevista')}</Typography>
								{AveriasUtils.FormatDateAveriasPantalla(incidence.fechaPrevistaResolucion)}
							</Grid>
							<Grid item md={3} sm={12} xs={12}>
								<Typography className={classes.subTitle}>{t('averias.management.consult.potenciaAfectado')}</Typography>
								{AveriasUtils.FormatTextField(incidence.potenciaAfectada)}
							</Grid>
							<Grid item md={3} sm={12} xs={12}>
								<Typography className={classes.subTitle}>{t('averias.management.consult.programada')}</Typography>
								{incidence.programada}
							</Grid>
						</Grid>
					</Grid>
					<Grid container>
						<p className={classes.link} onClick={resetIncidence}>
							{t('averias.management.consult.linkResetIncidence')}
						</p>
					</Grid>
				</>
			}
			<Grid container className={classes.dateContainer}>
				<Grid item xs={12} sm={12} md={2}>
					<span className={classes.inputTitle}>{t('averias.management.consult.startDate')}</span>
					<DatepickerV3 selectedDate={datepickerDate1} handleChange={setDatepickerDate1} size='m' maxDate={datepickerDate2} dateFormat={'dd/MM/yyyy'} popperPlacement={mobileRes ? 'bottom-start' : 'right-center'} />
				</Grid>
				<Grid item xs={12} sm={12} md={2}>
					<span className={classes.inputTitle}>{t('averias.management.consult.endDate')}</span>
					<DatepickerV3 selectedDate={datepickerDate2} handleChange={setDatepickerDate2} size='m' maxDate={new Date()} dateFormat={'dd/MM/yyyy'} popperPlacement={mobileRes ? 'bottom-start' : 'right-center'} />
				</Grid>
				<Grid item xs={12} sm={12} md={1}>
					<Button
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
			<Table className={classes.suppliesTable}>
				<TableHead>
					<TableRow className={classes.tableRow}>
						<StyledTableCell className={`${classes.headTableCell} ${(!tabletRes && !mobileRes) && 'center'}`} rowSpan={1}>{t('averias.management.consult.columnTipo')}
						</StyledTableCell>

						<StyledTableCell className={`${classes.headTableCell} ${(!tabletRes && !mobileRes) && 'center'}`} rowSpan={1}>{t('averias.management.consult.columnStartDate2')}
							<TableSortLabel
								active={showDateArrow}
								direction={directionNumber === 'asc' ? 'asc' : 'desc'}
								onClick={orderByDate}
							/>
						</StyledTableCell>

						<StyledTableCell className={`${classes.headTableCell} ${(!tabletRes && !mobileRes) && 'center'}`} rowSpan={1}>{t('averias.management.consult.instalacionInterrumpida')}
							<TableSortLabel
								active={showAfectadaArrow}
								direction={directionNumber === 'asc' ? 'asc' : 'desc'}
								onClick={orderByAfectada}
							/>
						</StyledTableCell>

						<StyledTableCell className={`${classes.headTableCell} ${(!tabletRes && !mobileRes) && 'center'}`} rowSpan={1}>{t('averias.management.consult.potenciaAfectado')}
							<TableSortLabel
								active={showPotenciaArrow}
								direction={directionNumber === 'asc' ? 'asc' : 'desc'}
								onClick={orderByPotencia}
							/>
						</StyledTableCell>

						<StyledTableCell className={`${classes.headTableCell} ${(!tabletRes && !mobileRes) && 'center'}`} rowSpan={1}>{t('averias.management.consult.duration')}
							<TableSortLabel
								active={showDuracionArrow}
								direction={directionNumber === 'asc' ? 'asc' : 'desc'}
								onClick={orderByDuration}
							/>
						</StyledTableCell>

						<StyledTableCell className={`${classes.headTableCell} ${(!tabletRes && !mobileRes) && 'center'}`} rowSpan={1}>{t('averias.management.consult.prog')}
							<TableSortLabel
								active={showProgramadaArrow}
								direction={directionNumber === 'asc' ? 'asc' : 'desc'}
								onClick={orderByProgress}
							/>
						</StyledTableCell>

						<StyledTableCell className={`${classes.headTableCell} ${(!tabletRes && !mobileRes) && 'center'}`} rowSpan={1}>{t('averias.management.consult.inter')}
							<TableSortLabel
								active={showInterrupcionesArrow}
								direction={directionNumber === 'asc' ? 'asc' : 'desc'}
								onClick={orderByInterrupciones}
							/>
						</StyledTableCell>
						{/* NUEVA COLUMNA VACIA */}
						<StyledTableCell className={`${classes.headTableCell} ${(!tabletRes && !mobileRes) && 'center'}`} />
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

											<StyledTableCell className={(!tabletRes && !mobileRes) && classes.bodyTableCell}>{<img src={setIcon(incidence)} className={classes.lockIcon} alt='' />}</StyledTableCell>
											<StyledTableCell className={(!tabletRes && !mobileRes) && classes.bodyTableCell}>{AveriasUtils.FormatDateAveriasPantalla(incidence.incidenceDate)}</StyledTableCell>
											<StyledTableCell className={(!tabletRes && !mobileRes) && classes.bodyTableCell}>{AveriasUtils.FormatTextField(incidence.installationRef)}</StyledTableCell>
											<StyledTableCell className={(!tabletRes && !mobileRes) && classes.bodyTableCell}>{Number(incidence.affectedPower) + ' ' + incidence.powerUnit}</StyledTableCell>
											<StyledTableCell className={(!tabletRes && !mobileRes) && classes.bodyTableCell}>{incidence.interruptionDuration !== '' && secondsToString(Number(incidence.interruptionDuration)) + 'h'}</StyledTableCell>
											<StyledTableCell className={(!tabletRes && !mobileRes) && classes.bodyTableCell}>{incidence.programmed === 'S' ? 'Si' : 'No'}</StyledTableCell>
											<StyledTableCell className={(!tabletRes && !mobileRes) && classes.bodyTableCell}>{AveriasUtils.FormatTextField(incidence.interruptionCount)}</StyledTableCell>
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
