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
import AlcanceBloque from '../../../../../assets/icons/alcance_bloque.svg'
import AlcanceCalle from '../../../../../assets/icons/alcance_calle.svg'
import AlcanceCasa from '../../../../../assets/icons/alcance_casa.svg'
import AlcanceMunicipio from '../../../../../assets/icons/alcance_municipio.svg'
import AlcancePortal from '../../../../../assets/icons/alcance_portal.svg'
import Interrogante from '../../../../../assets/icons/interrogante_redondo.svg'
import Exclamacion from '../../../../../assets/icons/triangulo_exclamacion.svg'
import Corte from '../../../../../assets/icons/corte_suministros.svg'
import Variable from '../../../../../assets/icons/deficiencia_variable.svg'
import Continuada from '../../../../../assets/icons/deficiencia_continua.svg'
import Reposicion from '../../../../../assets/icons/reposicion_baja_tension.svg'
import { isPrevious2017 } from '../../../../../common/lib/ValidationLib'
import Tooltip from '../../../../../common/components/tooltip/Tooltip'
import Spinner from '../../../../../common/components/spinner/Spinner'
import DatepickerV3 from '../../../../../common/components/datepickerV3/DatepickerV3'
import Button from '../../../../../common/components/button/Button'
import { formatDateWarnings } from '../../../../../common/lib/FormatLib';
import useStyles, { StyledTableCell } from './List.styles'
import Pagination from '../../../../../common/components/pagination/Pagination2'
import WarningDialog from '../../management/dialog/WarningDialog'
import { thunkGetWarningsIncidence } from '../../../../../supplies/supplies-details/store/actions/SuppliesDetailsThunkActions'
import { thunkGetListWarnings, thunkGetListWarnings2 } from '../../../../actions/GestionAveriasThunkActions'

import AveriasUtils from '../../../../utils/AveriasUtilsClass'
const ListWarnings = (props: any) => {
	const {
		listItems,
		setFinalList,
		currentPage,
		setCurrentPage,
		itemsPerPage,
		setItemsPerPage,
		totalPages,
		isSubLoading,
		setWarningsLoading,
		setIncidencesLoading,
		cups,
		tabletRes,
		mobileRes
	} = props
	const { t } = useTranslation()
	const dispatch = useDispatch()
	const classes = useStyles({})
	const target = document.getElementById('number') as HTMLSelectElement
	//usamos estas constantes para controlar la ordenación en columnas
	const [orderByTypeAsc, setOrderByTypeAsc] = useState(false)
	const [orderByNameAsc, setOrderByNameAsc] = useState(false)
	const [orderByDirectionAsc, setOrderByDirectionAsc] = useState(false)
	const [orderByDateAsc, setOrderByDateAsc] = useState(false)
	const [orderByCupsAsc, setOrderByCupsAsc] = useState(false)
	const [orderByStatusAsc, setOrderByStatusAsc] = useState(false)
	const [showTypeArrow, setShowTypeArrow] = useState(false)
	const [showNameArrow, setShowNameArrow] = useState(false)
	const [showDirectionArrow, setShowDirectionArrow] = useState(false)
	const [showDateArrow, setShowDateArrow] = useState(false)
	const [showStatusArrow, setShowStatusArrow] = useState(false)
	const [showAlcanceArrow, setShowAlcanceArrow] = useState(false)
	const [showCupsArrow, setShowCupsArrow] = useState(false)
	const [showWarningDialog, setShowWarningDialog] = useState(false)
	const [showWarning, setShowWarning] = useState(false)
	const [directionNumber, setDirectionNumber] = useState('desc')
	const [warning, setWarning] = useState([] as any)
	const [isLoadingList, setIsLoadingList] = useState(false)
	const restarDias = (date: any, dias: number) => {
		date.setDate(date.getDate() - dias)
		return date
	}
	const [datepickerDate1, setDatepickerDate1] = useState<Date>(restarDias(new Date(), 7));
	const [datepickerDate2, setDatepickerDate2] = useState<Date>(new Date());
	const [firstSearch, setFirstSearch] = useState(true)
	//ordenamos a partir de la columna de la provincia
	const orderByName = () => {
		setShowNameArrow(true)
		setShowTypeArrow(false)
		setShowDirectionArrow(false)
		setShowDateArrow(false)
		setShowStatusArrow(false)
		setShowAlcanceArrow(false)
		setShowCupsArrow(false)
		setDirectionNumber('desc')
		if (orderByNameAsc) {
			setFinalList([].concat(listItems).sort().reverse())
			setOrderByNameAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(listItems).sort((a, b) => a.provinceDesc.localeCompare(b.provinceDesc)))
			setOrderByNameAsc(true)
			setDirectionNumber('desc')
		}
	}
	//ordenamos a partir de la columna tipo
	const orderByType = () => {
		setShowNameArrow(false)
		setShowTypeArrow(true)
		setShowDirectionArrow(false)
		setShowDateArrow(false)
		setShowStatusArrow(false)
		setShowAlcanceArrow(false)
		setShowCupsArrow(false)
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
	}
	//ordenamos a partir de la columna dirección
	/*const orderByDirection = () => {
		setShowNameArrow(false)
		setShowTypeArrow(false)
		setShowDirectionArrow(true)
		setShowDateArrow(false)
		setShowStatusArrow(false)
		setShowAlcanceArrow(false)
		setShowCupsArrow(false)
		setDirectionNumber('desc')
		if (orderByDirectionAsc) {
			setFinalList([].concat(listItems).sort().reverse())
			setOrderByDirectionAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(listItems).sort((a, b) => a.streetDesc.localeCompare(b.streetDesc)))
			setOrderByDirectionAsc(true)
			setDirectionNumber('desc')
		}
	}*/
	//ordenamos a partir de la columna date
	const orderByDate = () => {
		setShowNameArrow(false)
		setShowTypeArrow(false)
		setShowDirectionArrow(false)
		setShowDateArrow(true)
		setShowStatusArrow(false)
		setShowAlcanceArrow(false)
		setShowCupsArrow(false)
		setDirectionNumber('desc')
		if (orderByDateAsc) {
			setFinalList([].concat(listItems).sort().reverse())
			setOrderByDateAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(listItems).sort((a, b) => a.fecha.localeCompare(b.fecha)))
			setOrderByDateAsc(true)
			setDirectionNumber('desc')
		}
	}
	//ordenamos a partir de la columna status
	const orderByStatus = () => {
		setShowNameArrow(false)
		setShowTypeArrow(false)
		setShowDirectionArrow(false)
		setShowDateArrow(false)
		setShowStatusArrow(true)
		setShowAlcanceArrow(false)
		setShowCupsArrow(false)
		setDirectionNumber('desc')
		if (orderByStatusAsc) {
			setFinalList([].concat(listItems).sort().reverse())
			setOrderByStatusAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(listItems).sort((a, b) => a.estadoAviso.localeCompare(b.estadoAviso)))
			setOrderByStatusAsc(true)
			setDirectionNumber('desc')
		}
	}
	//ordenamos a partir de la columna status
	const orderByAlcance = () => {
		setShowNameArrow(false)
		setShowTypeArrow(false)
		setShowDirectionArrow(false)
		setShowDateArrow(false)
		setShowStatusArrow(false)
		setShowAlcanceArrow(true)
		setShowCupsArrow(false)
		setDirectionNumber('desc')
		if (orderByStatusAsc) {
			setFinalList([].concat(listItems).sort().reverse())
			setOrderByStatusAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(listItems).sort((a, b) => a.alcance.localeCompare(b.alcance)))
			setOrderByStatusAsc(true)
			setDirectionNumber('desc')
		}
	}
	//ordenamos a partir de la columna cups
	/*const orderByCups = () => {
		setShowNameArrow(false)
		setShowTypeArrow(false)
		setShowDirectionArrow(false)
		setShowDateArrow(false)
		setShowStatusArrow(false)
		setShowAlcanceArrow(false)
		setShowCupsArrow(true)
		setDirectionNumber('desc')
		if (orderByStatusAsc) {
			setFinalList([].concat(listItems).sort().reverse())
			setOrderByCupsAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(listItems).sort((a, b) => a.cupsIncidence.localeCompare(b.cupsIncidence)))
			setOrderByCupsAsc(true)
			setDirectionNumber('desc')
		}
	}*/
	const onChangeSelector = () => {
		setCurrentPage(0)
		setItemsPerPage(Number(target.options[target.selectedIndex].value))
	}
	const [totalPagesFilter, setTotalPagesFilter] = useState(0)
	useEffect(() => {
		setTotalPagesFilter(listItems.length === 0 ? 1 : Math.ceil(listItems.length / itemsPerPage))
		// eslint-disable-next-line
	}, [listItems, itemsPerPage])
	const handleClick = (warning) => {
		setIsLoadingList(true)
		//disparamos la llamada directamente, esto lo hacemos así pq sino da problemas con la respuesta en OK 
		setWarningsLoading(true)
		dispatch(thunkGetListWarnings2(warning.warningCode, (responseJson) => { 
			setWarningsLoading(false)
			//getIncidence, se quita responseJson.result.msgResult === ''
			if (responseJson && responseJson.result && responseJson.result.codResult === '0000' ) {
				setIncidencesLoading(true)
				dispatch(thunkGetWarningsIncidence(warning.warningCode, 'warning', (responseJson2) => {
					setIncidencesLoading(false)
					//get Warnings se quita (responseJson2.result.msgResult === 'CORRECTO'|| responseJson2.result.msgResult === 'TRANSACCION CORRECTA')
					if (responseJson2 && responseJson2.result && responseJson2.result.codResult === '0000') {
						//rellenemos la lista en caso de recibir warnings
						let auxWarning = {
							centro: warning.provinceDesc,
							cups: warning.cupsIncidence,
							tipo: responseJson.warning.tipoAviso,
							alcance: responseJson.warning.alcance,
							fecha: responseJson.warning.fecha,
							dirCompleta: responseJson.warning.dirCompleta,
							observaciones: responseJson.warning.observaciones,
							warningIncidenceStatus: responseJson.warning.estadoIncidencia,
							seguimientoIncidencia: responseJson2.incidence.historicalState,
							seguimientoFechas: responseJson2.incidence.historicalStateDate,
							seguimientoObservaciones: responseJson2.incidence.historicalStateObs,
							startDateIncidencia: AveriasUtils.FormatDateAveriasPantalla(responseJson2.incidence.incidenceStartDate),
							incidenceState: responseJson2.incidence.incidenceState,
							fechaPrevistaResolucion: AveriasUtils.FormatDateAveriasPantalla(responseJson2.incidence.resolutionDate),
							origin: responseJson2.incidence.origin,
							originDesc: responseJson2.incidence.originDesc,
							instalacionAfectada: responseJson2.incidence.refInstallation,
							centrolIncidencia: AveriasUtils.FormatCodDescField(responseJson2.incidence.base, responseJson2.incidence.baseDesc),
							motivoFinalizaciónIncidencia:  AveriasUtils.FormatCodDescField(responseJson2.incidence.incidenceType, responseJson2.incidence.incidenceTypeDesc),
							observacionesIncidencia: responseJson2.incidence.incidenceObs,
							observacionesCor: AveriasUtils.FormatTextField(responseJson2.incidence.incidenceDesc),
							tipoAviso: responseJson.warning.tipoAviso,
							warningCode: warning.warningCode,
							potencia: responseJson2.incidence.power,
							nivelTension: responseJson2.incidence.tensionLevel,
							numAfectados: responseJson2.incidence.cups,
							materialAveriado: AveriasUtils.FormatTextField(responseJson2.incidence.refInstallationType)
						}
						setWarning(auxWarning)
						//setShowWarningDialog(true)
						setShowWarning(true)
						setIsLoadingList(false)
					} else {
						//En caso de error de sistema
						//rellenemos la lista en caso de recibir warnings
						let auxWarning = {
							centro: warning.provinceDesc,
							cups: warning.cupsIncidence,
							tipo: responseJson.warning.tipoAviso,
							alcance: responseJson.warning.alcance,
							fecha: responseJson.warning.fecha,
							dirCompleta: responseJson.warning.dirCompleta,
							observaciones: responseJson.warning.observaciones,
							warningCode: warning.warningCode
						}
						setWarning(auxWarning)
						setShowWarningDialog(true)
						setIsLoadingList(false)
					}
				}))
			} else {
				setIsLoadingList(false)
			}
		}))
	}
	const performSearch = () => {
		setFirstSearch(false)
		setIsLoadingList(true)
		//relanzamos la consulta con las nuevas fechas
		let data = {
			system: 'ZEUS',
			zone: '',
			warningStatus: '',
			startDate: formatDateWarnings(datepickerDate1) + ' 00:00:00',
			endDate: formatDateWarnings(datepickerDate2) + ' 23:59:59',
			cups: cups,
			cgv: ''
		}
		dispatch(thunkGetListWarnings(data, (response) => {
			if (response && response.result && response.result.codResult === '0000' && (response.result.msgResult === '' || response.result.msgResult === 'TRANSACCION CORRECTA')) {
				//rellenemos la lista en caso de recibir warnings
				let auxList = []
				response.warning.map((item) => {
					auxList.push(item)
				})
				setFinalList(auxList)
				setIsLoadingList(false)
			} else {
				//En caso de error de sistema
				setFinalList([])
				setIsLoadingList(false)
			}
		}))
	}
	const setImage = (column, warning) => {
		if (column === 'tipo') {
			if (warning.tipoAviso === '1') {
				return (
					//corte
					<Grid container className={classes.lockBox}>
						<img src={Corte} className={classes.lockIcon} alt='' />
					</Grid>
				)
			} else if (warning.tipoAviso === '2') {
				return (
					//deficiencia continuada
					<Grid container className={classes.lockBox}>
						<img src={Continuada} className={classes.lockIcon} alt='' />
					</Grid>
				)
			} else if (warning.tipoAviso === '3') {
				return (
					//deficiencia variable
					<Grid container className={classes.lockBox}>
						<img src={Variable} className={classes.lockIcon} alt='' />
					</Grid>
				)
			} else if (warning.tipoAviso === '4') {
				return (
					//reposición BT
					<Grid container className={classes.lockBox}>
						<img src={Reposicion} className={classes.lockIcon} alt='' />
					</Grid>
				)
			} else {
				return (
					<Grid container className={classes.lockBox}>
						<img src={Interrogante} className={classes.lockIcon} alt='' />
					</Grid>
				)
			}
		} else if (column === 'alcance') {
			if (warning.alcance === '1') {
				//casa
				return (
					<Grid container className={classes.lockBox}>
						<img src={AlcanceCasa} className={classes.lockIcon} alt='' />
					</Grid>
				)
			} else if (warning.alcance === '2') {
				//portal
				return (
					<Grid container className={classes.lockBox}>
						<img src={AlcancePortal} className={classes.lockIcon} alt='' />
					</Grid>
				)
			} else if (warning.alcance === '3') {
				//bloque
				return (
					<Grid container className={classes.lockBox}>
						<img src={AlcanceBloque} className={classes.lockIcon} alt='' />
					</Grid>
				)
			} else if (warning.alcance === '4') {
				//calle
				return (
					<Grid container className={classes.lockBox}>
						<img src={AlcanceCalle} className={classes.lockIcon} alt='' />
					</Grid>
				)
			} else if (warning.alcance === '5') {
				//municipio
				return (
					<Grid container className={classes.lockBox}>
						<img src={AlcanceMunicipio} className={classes.lockIcon} alt='' />
					</Grid>
				)
			} else {
				//interrogante
				return (
					<Grid container className={classes.lockBox}>
						<img src={Interrogante} className={classes.lockIcon} alt='' />
					</Grid>
				)
			}
		} else if (column === 'cor') {
			if (warning.estadoIncidencia && warning.estadoIncidencia !== '') {
				return (
					<Grid container className={classes.lockBox}>
						<img src={Exclamacion} className={classes.lockIcon} alt='' />
					</Grid>
				)
			} else {
				return (
					<Grid container className={classes.lockBox}>
						<img src={Interrogante} className={classes.lockIcon} alt='' />
					</Grid>
				)
			}
		} else {
			return ''
		}
	}
	const setTooltip = (column, warning) => {
		if (column === 'tipo') {
			if (warning.tipoAviso === '1') {
				return (
					t('averias.management.consult.corte')
				)
			} else if (warning.tipoAviso === '2') {
				return (
					t('averias.management.consult.continuada')
				)
			}
			else if (warning.tipoAviso === '3') {
				return (
					t('averias.management.consult.variable')
				)
			}
			else if (warning.tipoAviso === '4') {
				return (
					t('averias.management.consult.reposicion')
				)
			} else {
				return (
					''
				)
			}
		} else if (column === 'alcance') {
			if (warning.alcance === '1') {
				//casa
				return (
					t('averias.management.consult.casa')
				)
			} else if (warning.alcance === '2') {
				//portal
				return (
					t('averias.management.consult.portal')
				)
			} else if (warning.alcance === '3') {
				//bloque
				return (
					t('averias.management.consult.bloque')
				)
			} else if (warning.alcance === '4') {
				//calle
				return (
					t('averias.management.consult.calle')
				)
			} else if (warning.alcance === '5') {
				//municipio
				return (
					t('averias.management.consult.municipio')
				)
			} else {
				return (
					''
				)
			}
		} else if (column === 'cor') {
			if (warning.estadoIncidencia === 'PR') {
				return ('ABIERTA')
			} else if (warning.estadoIncidencia === 'PT') {
				return ('ABIERTA')
			} else if (warning.estadoIncidencia === 'EB') {
				return ('EN CURSO')
			} else if (warning.estadoIncidencia === 'CL') {
				return ('EN CURSO')
			} else if (warning.estadoIncidencia === 'ER') {
				return ('EN CURSO')
			} else if (warning.estadoIncidencia === 'SR') {
				return ('RESUELTA')
			} else if (warning.estadoIncidencia === 'RS') {
				return ('RESUELTA')
			} else if (warning.estadoIncidencia === 'EMCI') {
				return ('EN CURSO')
			} else if (warning.estadoIncidencia === 'EMSI') {
				return ('EN CURSO')
			} else if (warning.estadoIncidencia === 'EM') {
				return ('RESUELTA')
			} else {
				return ('')
			}
		} else {
			return ''
		}
	}
	const resetWarning = () => {
		setShowWarning(false)
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
			default:
				return ('')
		}
	}

	const getTooltipStatus = (status: string) => {
		switch (status) {
			case 'PR':
				return ('Propuesta')
			case 'PT':
				return ('Pendiente')
			case 'EB':
				return ('Eviada Brigada')
			case 'CL':
				return ('Causa localizada')
			case 'ER':
				return ('En reposición')
			case 'SR':
				return ('Servicio repuesto')
			case 'RS':
				return ('Resuelta')
			case 'EMCI':
				return ('Enviado mantenimiento con indisponibilidades pendientes')
			case 'EMSI':
				return ('Enviado mantenimiento sin indisponibilidades')
			case 'EM':
				return ('Enviado mantenimiento')
			default:
				return ('')
		}
	}
	return (
		<>
			{
				isLoadingList &&
				<Spinner fixed={true} />
			}
			{showWarningDialog &&
				<WarningDialog
					showingDialog={showWarningDialog}
					setShowingDialog={setShowWarningDialog}
					warning={warning}
					cups={cups}
				/>
			}
			{showWarning &&
				<>
					<Grid container className={classes.topContainer}>
						<Grid container className={classes.inTopContainer}>
							<Grid item md={6} sm={12} xs={12}>
								<Typography className={classes.expansionPanelSummaryText}>{t('averias.management.consult.codigo') + ' ' + warning.warningCode}</Typography>
							</Grid>
							<Grid item md={5} sm={12} xs={12} className={classes.end}>
								<Typography className={classes.link} onClick={() => setShowWarningDialog(true)}>{t('averias.management.consult.show')}</Typography>
							</Grid>
						</Grid>
						<Grid container className={classes.line} />
						<Grid container className={classes.inTopContainer}>
							<Grid item md={3} sm={12} xs={12}>
								<Typography className={classes.subTitle}>{t('averias.management.consult.columnStartDate')}</Typography>
								{AveriasUtils.FormatDateAveriasPantalla(warning.fecha)}
							</Grid>
							<Grid item md={3} sm={12} xs={12}>
								<Typography className={classes.subTitle}>{t('averias.management.consult.origen')}</Typography>
								{AveriasUtils.FormatCodDescField(warning.origin, warning.originDesc)}
							</Grid>
							<Grid item md={3} sm={12} xs={12}>
								<Typography className={classes.subTitle}>{t('averias.management.consult.columnTipo')}</Typography>
								{setTooltip('tipo', warning)}
							</Grid>
							<Grid item md={3} sm={12} xs={12}>
								<Typography className={classes.subTitle}>{t('averias.management.consult.status')}</Typography>
								<Tooltip className={classes.tooltip} title={getTooltipStatus(warning.incidenceState)} placement='top-start'><Typography>{AveriasUtils.FormatCodDescField(warning.incidenceState, getStatus(warning.incidenceState))}</Typography></Tooltip>
							</Grid>
						</Grid>
					</Grid>
					<Grid container>
						<p className={classes.link} onClick={resetWarning}>
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
						{listItems.slice((currentPage * itemsPerPage), ((currentPage * itemsPerPage) + itemsPerPage)).length + t('averias.management.consult.warningsFor') + listItems.length}
						{
							isSubLoading &&
							<img className={classes.loadingAnimation} src={LoadingAnimation} alt='' />
						}
					</Grid>
					:
					listItems.length > 20 && totalPages > 1 ?
						<Grid container className={classes.totalItems}>
							{listItems.slice((currentPage * itemsPerPage), ((currentPage * itemsPerPage) + itemsPerPage)).length + t('averias.management.consult.warningsFor') + listItems.length}
							{
								isSubLoading &&
								<img className={classes.loadingAnimation} src={LoadingAnimation} alt='' />
							}
						</Grid>
						:
						<Grid container className={classes.totalItems}>
							{listItems.length + ((listItems.length > 1 || listItems.length === 0) ? t('averias.management.consult.warnings') : t('averias.management.consult.warning')) + (firstSearch ? t('averias.management.consult.incidence7') : '')}
							{
								isSubLoading &&
								<img className={classes.loadingAnimation} src={LoadingAnimation} alt='' />
							}
						</Grid>
			}
			<Table className={classes.suppliesTable}>
				<TableHead>
					<TableRow className={classes.tableRow}>
						<StyledTableCell className={`${classes.headTableCell} ${!mobileRes && 'center'}`} rowSpan={1}>{t('averias.management.consult.codigo')}
							<TableSortLabel
								active={showNameArrow}
								direction={directionNumber === 'asc' ? 'asc' : 'desc'}
								onClick={orderByName}
							/>
						</StyledTableCell>
						<StyledTableCell className={`${classes.headTableCell} ${!mobileRes && 'center'}`} rowSpan={1}>{t('averias.management.consult.columnStartDate')}
							<TableSortLabel
								active={showDateArrow}
								direction={directionNumber === 'asc' ? 'asc' : 'desc'}
								onClick={orderByDate}
							/>
						</StyledTableCell>
						<StyledTableCell className={`${classes.headTableCell} ${!mobileRes && 'center'}`} rowSpan={1}>{t('averias.management.consult.columnTipo')}
							<TableSortLabel
								active={showTypeArrow}
								direction={directionNumber === 'asc' ? 'asc' : 'desc'}
								onClick={orderByType}
							/>
						</StyledTableCell>
						<StyledTableCell className={`${classes.headTableCell} ${!mobileRes && 'center'}`} rowSpan={1}>{t('averias.management.consult.columnAlcance')}
							<TableSortLabel
								active={showAlcanceArrow}
								direction={directionNumber === 'asc' ? 'asc' : 'desc'}
								onClick={orderByAlcance}
							/>
						</StyledTableCell>
						<StyledTableCell className={`${classes.headTableCell} ${!mobileRes && 'center'}`} rowSpan={1}>{t('averias.management.consult.columnEstadoCOR')}
							<TableSortLabel
								active={showStatusArrow}
								direction={directionNumber === 'asc' ? 'asc' : 'desc'}
								onClick={orderByStatus}
							/>
						</StyledTableCell>
						{/* NUEVA COLUMNA VACIA */}
						<StyledTableCell className={`${classes.headTableCell} ${!mobileRes && 'center'}`} />
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
								(warning, index) => (
									<>
										<TableRow key={index + '' + warning.dossierCod} className={`${classes.tableBodyRow} ${isPrevious2017(warning.registerDate) && 'disabled'}`}>
											<StyledTableCell className={!mobileRes && classes.bodyTableCell}>{warning.warningCode}</StyledTableCell>
											<StyledTableCell className={!mobileRes && classes.bodyTableCell}>{AveriasUtils.FormatDateAveriasPantalla(warning.fecha)}</StyledTableCell>
											<StyledTableCell className={!mobileRes && classes.bodyTableCell}><Tooltip title={setTooltip('tipo', warning)} placement='top'>{setImage('tipo', warning)}</Tooltip></StyledTableCell>
											<StyledTableCell className={!mobileRes && classes.bodyTableCell}><Tooltip title={setTooltip('alcance', warning)} placement='top'>{setImage('alcance', warning)}</Tooltip></StyledTableCell>
											<StyledTableCell className={!mobileRes && classes.bodyTableCell}><Tooltip title={setTooltip('cor', warning)} placement='top'>{setImage('cor', warning)}</Tooltip></StyledTableCell>
											<StyledTableCell rowSpan={1} className={classes.suppliesTableButtonCell}>
												{
													<div
														className={classes.editButton}
														onClick={() => handleClick(warning)}
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
export default withRouter(ListWarnings)
