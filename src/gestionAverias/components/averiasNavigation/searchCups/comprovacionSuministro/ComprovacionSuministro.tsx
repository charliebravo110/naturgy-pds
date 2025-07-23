import React, { useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Grid from '@material-ui/core/Grid';
import { ExpansionPanelDetails, Typography, LinearProgress } from '@material-ui/core';
import Switch from '../../../../../common/components/switch/Switch'
import useStyles, { ExpansionPanel, ExpansionPanelSummary, StyledExpandMoreIcon } from './ComprovacionSuministro.styles'
import consumoTotal from '../../../../../assets/icons/consumo_total.svg';
import incidenciaIcono from '../../../../../assets/icons/incidencia.svg'
import campanaIcono from '../../../../../assets/icons/camapana.svg'
import contadorInactivo from '../../../../../assets/icons/contador_inactivo.svg'
import contadorActivo from '../../../../../assets/icons/contador_activo.svg'
import conectadoConContador from '../../../../../assets/icons/conectando_con_contador.svg'
import redAlertaIcono from '../../../../../assets/icons/ico_aviso_rojo.svg'
import ListIncidences from '../list/ListIncidencias'
import ListWarnings from '../list/ListWarnings'
import { thunkGetEnergyCutOff, thunkGetListWarnings, thunkGetMasterData, thunkGetMeterReadings, thunkGetServiceRequest, thunkGetRearmarContador } from '../../../../actions/GestionAveriasThunkActions';
import Button from '../../../../../common/components/button/Button';
import { formatDateWarnings } from '../../../../../common/lib/FormatLib';
import RequestModal from './request-modal/RequestModal';
import ConectTimeDialog from '../connect-time-inform/ConnectTimeDialog';
import SystemErrorModal from './systemErrorModal/SystemErrorModal';
import RequestCreatedModal from './requestCreatedModal/RequestCreatedModal';
import { thunkGetListIncidence, thunkGetListInterruptions } from '../../../../../supplies/supplies-details/store/actions/SuppliesDetailsThunkActions';
import CustomLinearProgressBar from './customLinearProgressBar/CustomLinearProgressBar';
import { useInterval } from 'usehooks-ts'
import { push } from 'connected-react-router';
import electrodependentIcon from '../../../../../assets/icons/ico_electrodependiente.svg'
import arrowRight from '../../../../../assets/icons/flecha_derecha_blanco.svg'
import arrowRightBlack from '../../../../../assets/icons/flecha_derecha_negro.svg'
import Spinner from '../../../../../assets/img/spinner.gif';
import DigitalScriptService, { Question } from '../../../../services/DigitalScriptService2';
import AveriasUtils from '../../../../utils/AveriasUtilsClass';
import { formatNumberES } from '../../../../../common/services/formatNumber';


const ComprovacionSuministro = (props: any) => {

	const {
		suplyPoint,
		suplyPointUser,
		warningInfo,
		setWarningInfo,
		maxTry,
		closedSRTipo,
		typeList,
		scopeList,
		motiveList,
		tabletRes,
		mobileRes,
		monofReadingTypeIds,
		trifaReadingTypeIds,
		meterConsultTimeout,
		autoConsultaContadorParam,
		meterRearmTimeout,
		supplyVerificationBlockRef
	} = props

	const [systemErrorDialogOpen, setSystemErrorDialogOpen] = useState(false)
	const [requestCreatedDialogOpen, setRequestCreatedDialogOpen] = useState(false)
	const styles = useStyles({})
	const { t } = useTranslation()
	const dispatch = useDispatch()
	//timeouts
	const [seconds, setSeconds] = useState(0)
	const [minutes, setMinutes] = useState('00')
	const [tiempoTrascurrido, setTiempoTrascurrido] = useState(new Date())
	const [porcentajeDeCarga, setPorcentajeDeCarga] = useState(0)
	const [readingTypesIds, setReadingTypesIds] = useState('')
	const [noCortado, setNoCortado] = useState(false)
	const [cortadoBaja, setCortadoBaja] = useState(false)
	const [resetCall, setResetCall] = useState(false)
	const [conTelegestion, setConTelegestion] = useState(false)
	//contador
	const [estadoContador, setEstadoContador] = useState(null)
	//Modal crear aviso
	const [isRequestModalVisible, setIsRequestModalVisible] = useState<boolean>(false)
	const [connectingTimout, setConnectingTimout] = useState(false)
	const [openIncidencesList, setOpenIncidencesList] = useState([] as any)
	const [openWarningsList, setOpenWarningsList] = useState([] as any)
	const [incidencesList, setIncidencesList] = useState([] as any)
	const [warningsList, setWarningsList] = useState([] as any)
	const [srList, setSRList] = useState([] as any)

	//incidence
	const [totalPages, setTotalPages] = useState(0)
	const [currentPage, setCurrentPage] = useState(0)
	const [itemsPerPage, setItemsPerPage] = useState(20)
	const [crearAvisoFromIncidence, setCrearAvisoFromIncidence] = useState(false)
	//warnings
	const [totalPagesWarnings, setTotalPagesWarnings] = useState(0)
	const [currentPageWarnings, setCurrentPageWarnings] = useState(0)
	const [itemsPerPageWarnings, setItemsPerPageWarnings] = useState(20)
	// estado inicial /comprovnado contador
	const [comprovandoContador, setComprovandoContador] = useState(false)
	const [comprovandoContadorBack, setComprovandoContadorBack] = useState(false)
	const [rearmandoContador, setRearmandoContador] = useState(false)
	//estado 0 activo suministro Cortado
	const [estadoZero, setEstadoZero] = useState(false)
	//estado 1 activo con servicio
	const [estadoPrimero, setEstadoPrimero] = useState(false)
	//estado 2 activo pero ha saltado el icp y esta pendiente de rearme
	const [estadoSegundo, setEstadoSegundo] = useState(false)
	//sin contrato
	const [sinContrato, setsinContrato] = useState(true)
	//errror de conexion contador
	const [errorConexion, setErrorConexion] = useState(false)
	// canviar aixo per la info de veure si el suplypoint està actiu
	let day = new Date().getDate()
	let month = new Date().getMonth()
	let year = new Date().getFullYear()
	let time = 30000
	// Último cups con el que se buscaron las SRs
	const [lastSearchedSRsCUPS, setLastSearchedSRsCUPS] = useState('')
	// Último cups con el que se buscaron las incidencias
	const [lastSearchedWarningsCUPS, setLastSearchedWarningsCUPS] = useState('')
	// Último cups con el que se buscaron las incidencias
	const [lastSearchedIncidenceCUPS, setLastSearchedIncidenceCUPS] = useState('')

	const [buttonConsultaPressed, setButtonConsultaPressed] = useState(false)

	const [supplySelectedCheckSumin, setSupplySelectedCheckSumin] = useState('')
	const [executionDate, setExecutionDate] = useState<string>('')
	const [meterKw, setMeterKw] = useState(0)
	const [meterV, setMeterV] = useState(0)
	const [meterKw2, setMeterKw2] = useState(0)
	const [meterV2, setMeterV2] = useState(0)
	const [meterKw3, setMeterKw3] = useState(0)
	const [meterV3, setMeterV3] = useState(0)

	const [isLoadingMeterReadings, setIsLoadingMeterReadings] = useState(false)
	const [isLoadingWarnings, setIsLoadingWarnings] = useState(false)
	const [isLoadingIncidences, setIsLoadingIncidences] = useState(false)
	const [isLoadingSRs, setIsLoadingSRs] = useState(false)

	const [loading, setLoading] = useState<boolean>(false)

	// Datos usuario
	let name = useRef('');
	let surName1 = useRef('');
	let surName2 = useRef('');
	let email = useRef('');
	let phone = useRef('');
	let remark = useRef('');
	let extraInfo = useRef('');
	let currentQuestion = useRef<Question>(null);
	let answeredQuestionList = useRef<Question[]>([]);
	let digitalScript = useRef<DigitalScriptService>(new DigitalScriptService(suplyPointUser, suplyPoint, 'identificar_punto_suministro'));
	let manualChangedCor = useRef<boolean>(false)
	let questionPendingValue = useRef(0)
	const [trigger, setTrigger] = useState(false);

	const reInitializeUserData = () => {
		setName(suplyPointUser.name ? suplyPointUser.name : suplyPoint.holderName)
		setSurName1(suplyPointUser.surName1)
		setSurName2(suplyPointUser.surName2)
		setEmail(suplyPointUser.email)
		setPhone(suplyPointUser.phone)
		setRemark('')
		setExtraInfo('')
		setCurrentQuestion(null)
		setAnsweredQuestionList([])
		setManualChangedCor(false)
		setQuestionPendingValue(0)
		digitalScript.current.resetAllAnswers()
	}

	const setName = (nameParam) => {
		name.current = nameParam
	}

	const setSurName1 = (surName1Param) => {
		surName1.current = surName1Param
	}

	const setSurName2 = (surName2Param) => {
		surName2.current = surName2Param
	}

	const setEmail = (emailParam) => {
		email.current = emailParam
	}

	const setPhone = (phoneParam) => {
		phone.current = phoneParam
	}

	const setRemark = (remarkParam) => {
		remark.current = remarkParam
	}

	const setExtraInfo = (extraInfoParam) => {
		extraInfo.current = extraInfoParam
	}

	const setCurrentQuestion = (currentQuestionParam) => {
		currentQuestion.current = currentQuestionParam
	}

	const setAnsweredQuestionList = (answeredQuestionListParam) => {
		answeredQuestionList.current = answeredQuestionListParam
	}

	const setManualChangedCor = (manualChangedCorParam) => {
		manualChangedCor.current = manualChangedCorParam
	}

	const setQuestionPendingValue = (questionPendingValueParam) => {
		if (questionPendingValue.current !== questionPendingValueParam) {
			if (questionPendingValue.current === 2 && questionPendingValueParam === 0) {
				setTrigger(t => !t);
			}
		}
		questionPendingValue.current = questionPendingValueParam
	}

	const setEstadoContadorAndCheckPopup = (estadoContadorNuevo) => {
		if (questionPendingValue.current === 1) {
			setQuestionPendingValue(2);
		}
		setEstadoContador(estadoContadorNuevo)
	}

	useEffect(() => {
		if (!isLoadingMeterReadings && !isLoadingWarnings && !isLoadingIncidences && !isLoadingSRs) {
			setLoading(false)
		} else {
			setLoading(true)
		}
	}, [isLoadingMeterReadings, isLoadingWarnings, isLoadingIncidences, isLoadingSRs])

	const setMeterReadingDate = (reading: any) => {
		if (reading.timestamp) {
			const timezone = new Date(reading.timestamp)
			const year = timezone.getFullYear()
			const monthN = timezone.getMonth()
			const day = ('0' + timezone.getDate()).slice(-2)
			const hours = ('0' + timezone.getHours()).slice(-2)
			const minutes = ('0' + timezone.getMinutes()).slice(-2)
			const time = hours + ':' + minutes + 'h'
			let monthI18N
			switch (monthN) {
				case 0:
					monthI18N = 'january'
					break
				case 1:
					monthI18N = 'february'
					break
				case 2:
					monthI18N = 'march'
					break
				case 3:
					monthI18N = 'april'
					break
				case 4:
					monthI18N = 'may'
					break
				case 5:
					monthI18N = 'june'
					break
				case 6:
					monthI18N = 'july'
					break
				case 7:
					monthI18N = 'agost'
					break
				case 8:
					monthI18N = 'september'
					break
				case 9:
					monthI18N = 'october'
					break
				case 10:
					monthI18N = 'november'
					break
				case 11:
					monthI18N = 'december'
					break
			}
			const month = t(`supplies.suppliesDetails.components.meter.connectSuccess.months.${monthI18N}`)
			const auxDate = day + ' ' + month + ' ' + year + ' / ' + time
			setExecutionDate(auxDate)
			if (reading && reading.readings[0] && reading.readings[0].readingsMeter) {
				if (suplyPoint.installationType === 'Monofásica') {
					setMeterKw(handleReading(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '421')[0].meterReadings[0].value))
					setMeterV(handleReading(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '411')[0].meterReadings[0].value))
				} else {
					if (handleReading(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '507'))) {
						setMeterKw(handleReading(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '507')[0].meterReadings[0].value))
					}
					if (reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '505')) {
						setMeterV(handleReading(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '505')[0].meterReadings[0].value))
					}
					if (reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '515')) {
						setMeterKw2(handleReading((reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '515')[0].meterReadings[0].value)))
					}
					if (reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '513')) {
						setMeterV2(handleReading(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '513')[0].meterReadings[0].value))
					}
					if (parseFloat(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '523'))) {
						setMeterKw3(handleReading(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '523')[0].meterReadings[0].value))
					}
					if (reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '521')) {
						setMeterV3(handleReading(reading.readings[0].readingsMeter.filter(item => item.readingTypeId === '521')[0].meterReadings[0].value))
					}
				}
			}
		}
	}

	const handleRearmarButton = () => {
		setRearmandoContador(true)
		setErrorConexion(false)
		rearmarContador()
	}
	const handleComprobarContadorButton = () => {
		setButtonConsultaPressed(true)
		setComprovandoContador(true)
		setComprovandoContadorBack(true)
		setErrorConexion(false)
		getReadingTypeId()
	}
	const handleReturn = () => {
		setConnectingTimout(false)
	}
	const rearmarContador = (): void => {
		//funcion para rearmar el contador
		if (suplyPoint.measurementEquipments && suplyPoint.measurementEquipments.meters[0] && suplyPoint.measurementEquipments.meters[0].meter) {
			//rearma el contador
			setIsLoadingMeterReadings(true)
			dispatch(thunkGetRearmarContador(suplyPointUser?.documentNumber, suplyPoint.cups.substring(0, 20), suplyPoint.measurementSystem, suplyPoint.measurementEquipments.meters[0].meter, readingTypesIds, meterConsultTimeout, (response) => {
				setIsLoadingMeterReadings(false)
				if (response) {
					//rearmado
					setRearmandoContador(false)
				}
				else {
					//error al rearmar
					setRearmandoContador(false)
					setErrorConexion(true)
				}
			}
			))
			// mirar on posar el timout aqui
			setResetCall(!resetCall)
		}
		else setErrorConexion(true)
	}
	const getReadingTypeId = () => {
		if (suplyPoint.measurementSystem === 'O' && ((suplyPoint.remoteManagementDate) || (suplyPoint.role && suplyPoint.role === 'US_MANAGER'))) {
			if (suplyPoint.installationType === 'Monofásica') {
				setReadingTypesIds(monofReadingTypeIds)
				setResetCall(!resetCall)
			} else {
				setReadingTypesIds(trifaReadingTypeIds)
				setResetCall(!resetCall)
			}
		}
	}

	//const [count, setCount] = useState<number>(0)
	let count = 0
	const delay = 1000
	useInterval(
		() => {
			// Your custom logic here
			count = count + 1
			if (count === 120) {
				count = 0
				setComprovandoContadorBack(false)
			}
		},
		// Delay in milliseconds or null to stop it
		comprovandoContadorBack ? delay : null,
	)
	// setEstadoContador(0)
	useEffect(() => {
		// funcion para leer la lectura de un contador
		// solo se lee cuando hay la info necesaria para leer
		if (readingTypesIds && readingTypesIds !== '' && (buttonConsultaPressed || autoConsultaContadorParam)) {
			setButtonConsultaPressed(false)
			if (suplyPoint.measurementEquipments && suplyPoint.measurementEquipments.meters[0] && suplyPoint.measurementEquipments.meters[0].meter) {
				setIsLoadingMeterReadings(true)
				dispatch(thunkGetMeterReadings(suplyPointUser?.documentNumber, suplyPoint.cups.substring(0, 20), suplyPoint.measurementSystem, suplyPoint.measurementEquipments.meters[0].meter, readingTypesIds, meterConsultTimeout, (response) => {
					setIsLoadingMeterReadings(false)
					// estados del contador:
					//    currentContactorState === 0 = activo pero suministro cortado
					//    currentContactorState === 1 = activo con servicio
					//    currentContactorState === 2 = activo pendiente de rearme
					if (response && response.readings) {
						const currentContactorState = response.readings[0] && response.readings[0].readingsMeter && response.readings[0].readingsMeter.filter(item => suplyPoint.installationType === 'Monofásica' ? item.readingTypeId === '441' : item.readingTypeId === '537')[0].meterReadings[0].value
						setEstadoContadorAndCheckPopup(currentContactorState)
						if (currentContactorState === '1') {
							setEstadoPrimero(true)
							setMeterReadingDate(response)
							setComprovandoContador(false)
							setComprovandoContadorBack(false)
							count = 0
						} else if (currentContactorState === '2') {
							setEstadoSegundo(true)
							setMeterReadingDate(response)
							setComprovandoContador(false)
							setComprovandoContadorBack(false)
							count = 0
						} else if (currentContactorState === '0') {
							setEstadoZero(true)
							setMeterReadingDate(response)
							setComprovandoContador(false)
							setComprovandoContadorBack(false)
							count = 0
						} else {
							setErrorConexion(true)
							setMeterReadingDate(response)
							setComprovandoContador(false)
							setComprovandoContadorBack(false)
							count = 0
						}
					} else {
						//salta error, paramos el timout si aun esta activo
						setEstadoContadorAndCheckPopup(null)
						setComprovandoContador(false)
						setComprovandoContadorBack(false)
						setErrorConexion(true)
						count = 0
					}
				}))
			}
		}
	}, [resetCall])

	useEffect(() => {
		reInitializeUserData();
		//comprovamos que haya contrato
		if (suplyPoint.isMigrated === '0') {
			if (suplyPoint.descStatus !== 'ACTIVO CONTRATADO') setsinContrato(true)
			else setsinContrato(false)
			//Miramos estado/subestado para confirmar corte
			let osCorte = checkContractStatus()
			//ZEUS
			if (osCorte) {
				//cortado, discriminar impago
				if (cortadoPorImpago(suplyPoint.descSubStatus) || cortadoPorImpago(suplyPoint.descStatus)) {
					setCortadoBaja(false)
				}
				else setCortadoBaja(true)
				setNoCortado(false)
			} else {
				// no cortado
				setNoCortado(true)
			}
			setWarningInfo({
				...warningInfo,
				cortable: suplyPoint.notCuttable === '0' ? 'S' : 'N',
				mtvoNoCortable: suplyPoint.notCuttableMotive,
				potenciaSuministro: suplyPoint.power,
				sistema: suplyPoint.isMigrated === '0' ? 'ZEUS' : 'SGC',
				marcaEquipoContador: suplyPoint.measurementEquipments.meters[0].brand,
				numeroAparatoContador: suplyPoint.measurementEquipments.meters[0].meter,
				importancia: (suplyPoint.importance === '1' || suplyPoint.importance === '2' || suplyPoint.importance === '3' || suplyPoint.importance === '4') ? '1' : '0',
				tipoSuministroImportante: suplyPoint.importance,
				osCorte: osCorte ? '1' : '0'
			})
		} else {
			//llamar SGC
			dispatch(thunkGetEnergyCutOff(suplyPoint.cups, (response) => {
				if (response) {
					//Primero miramos el estado del contrato en el suministro
					if (suplyPoint.descStatus !== 'ACTIVO CONTRATADO') setsinContrato(true)
					else setsinContrato(false)
					//comprobamos si hay corte en SGC
					// 00 no hay corte
					//16, 17 , 19 hay corte
					if (response.energyCutOff.cutCode === '00') {
						setNoCortado(true)
					}
					else if (cortadoPorImpago(response.energyCutOff.reason)) {
						setCortadoBaja(false)
					}
					else {
						setCortadoBaja(true)
					}
					setWarningInfo({
						...warningInfo,
						cortable: response.notCuttable === '0' ? 'S' : 'N',
						mtvoNoCortable: suplyPoint.notCuttableMotive,
						potenciaSuministro: suplyPoint.power,
						sistema: suplyPoint.isMigrated === '0' ? 'ZEUS' : 'SGC',
						marcaEquipoContador: suplyPoint.measurementEquipments.meters[0].brand,
						numeroAparatoContador: suplyPoint.measurementEquipments.meters[0].meter,
						importancia: (response.energyCutOff.notCuttable === '1' || response.energyCutOff.notCuttable === '2' || response.energyCutOff.notCuttable === '3' || response.energyCutOff.notCuttable === '4') ? '1' : '0',
						tipoSuministroImportante: response.energyCutOff.notCuttable,
						osCorte: response.energyCutOff.cutCode === '00' ? '0' : '1'
					})
				}
			}))
		}
		if (suplyPoint.tipoDeLectura === 'TELEGESTIONADO') {
			setConTelegestion(true)
		}
		else setConTelegestion(false)
		// Si es telegestionado llamar contador
		if (conTelegestion) {
			getReadingTypeId()
		}

		if (supplySelectedCheckSumin === null || suplyPoint.cups !== supplySelectedCheckSumin) {
			setEstadoContador(null)
			reInitializeUserData()
			setSupplySelectedCheckSumin(supplySelectedCheckSumin)
		}
	}, [suplyPoint])

	useEffect(() => {
		let auxList = []
		incidencesList.map((item) => {
			if (isIncidenceOpen(item)) {
				auxList.push(item)
			}
		})
		setOpenIncidencesList(auxList)
	}, [incidencesList])

	useEffect(() => {
		let auxList = []
		warningsList.map((item) => {
			if (isWarningOpen(item)) {
				auxList.push(item)
			}
		})
		setOpenWarningsList(auxList)
	}, [warningsList])

	const cortadoPorImpago = (str) => {
		return str == 'BAJA POR IMPAGO';
	}
	const closeFunction = () => {
		setSystemErrorDialogOpen(false)
		handleCloseRequestDialog()
		dispatch(push('/gestionAverias'));
	}
	const closeFunction2 = () => {
		setRequestCreatedDialogOpen(false)
	}
	const checkContractStatus = () => {
		switch (suplyPoint.codSubStatus) {
			case 'SUBSTAT056':
				return true;
			case 'SUBSTAT012':
				return true;
			case 'SUBSTAT007':
				return true;
			case 'SUBSTAT009':
				return true;
			case 'SUBSTAT008':
				return true;
			case 'SUBSTAT037':
				return true;
			case 'SUBSTAT010':
				return true;
		}
		return false;
	}

	const createRequest = () => {
		console.log(warningsList);
		setRemark(sessionStorage.getItem('remark') ? sessionStorage.getItem('remark') : '')
		setIsRequestModalVisible(true)
	}
	const handleCloseRequestDialog = () => {
		setIsRequestModalVisible(false)
	}
	const handleAcceptRequestDialog = (key) => {
		setIsRequestModalVisible(false)
	}
	const fullAddress = () => {
		let stair = suplyPoint.address.stair ? 'Es:' + suplyPoint.address.stair + ' ' : ''
		let floor = suplyPoint.address.floor ? 'Pl:' + suplyPoint.address.floor + ' ' : ''
		let door = suplyPoint.address.door ? 'Pt:' + suplyPoint.address.door + ' ' : ''
		let address1 = suplyPoint.address.street + ' ' + suplyPoint.address.number + ', ' + stair + floor + door
		let address2 = suplyPoint.address.zipCode + ' ' + suplyPoint.address.town + ', ' + suplyPoint.address.province
		return [address1, address2]
	}
	const restarDias = (date: any, dias: number) => {
		date.setDate(date.getDate() - dias)
		return date
	}
	const [formDateFrom, setFormDateFrom] = useState(new Date())
	const [formDateTo, setFormDateTo] = useState(new Date())
	useEffect(() => {
		const dateTo = new Date();
		const dateFrom = new Date(dateTo);
		dateFrom.setDate(dateTo.getDate() - 7);
		setFormDateFrom(dateFrom)
		setFormDateTo(dateTo)
		if (suplyPoint.cups && suplyPoint.cups !== '') {
			setErrorConexion(false)
			setEstadoPrimero(false)
			setEstadoSegundo(false)
			setEstadoZero(false)

			if (lastSearchedSRsCUPS !== suplyPoint.cups) {
				setLastSearchedSRsCUPS(suplyPoint.cups)
				setIsLoadingSRs(true)
				dispatch(thunkGetServiceRequest(suplyPoint.holderDocumentNumber, suplyPoint.cups, (response) => {
					setIsLoadingSRs(false)
					if (response && response.result && response.result.codResult === '0000') {
						let auxList = []
						response.serviceRequests.items.map((item) => {
							if (item.tipology === '0869A09' && suplyPoint.cups === item.cups) {
								auxList.push(item)
							}
						})
						setSRList(auxList)
					} else {
						//En caso de error de sistema
						setSRList([])
					}
				}))
			}

			if (lastSearchedIncidenceCUPS !== suplyPoint.cups) {
				setLastSearchedIncidenceCUPS(suplyPoint.cups)
				setIsLoadingIncidences(true)
				dispatch(thunkGetListIncidence(suplyPoint.cups, dateFrom, dateTo, (response) => {
					setIsLoadingIncidences(false)
					let listadoResultado = [];
					setIncidencesList(listadoResultado)
					if (response && response.incidenceList && response.incidenceList.length > 0) {
						supplyVerificationBlockRef.current.scrollIntoView({ behavior: 'smooth' });
						let data = {
							sistema: 'ZEUS',
							incidenceList: response.incidenceList
						}
						//setIncidenceData(data)
						dispatch(thunkGetListInterruptions(data, (response) => {
							if (response && response.result && response.result.codResult === '0000' && response.incidenceList.length > 0) {
								listadoResultado = response.incidenceList;
								setIncidencesList(listadoResultado)
							}
						}));
					}
				}));
			}
			let data = {
				system: 'ZEUS',
				zone: '',
				warningStatus: '',
				startDate: formatDateWarnings(restarDias(new Date(), 7)) + ' 00:00:00',
				endDate: formatDateWarnings(new Date()) + ' 23:59:59',
				cups: suplyPoint.cups,
				cgv: ''
			}

			if (lastSearchedWarningsCUPS !== suplyPoint.cups) {
				setLastSearchedWarningsCUPS(suplyPoint.cups)
				setIsLoadingWarnings(true)
				dispatch(thunkGetListWarnings(data, (response) => {
					setIsLoadingWarnings(false)
					if (response && response.result && response.result.codResult === '0000' && (response.result.msgResult === '' || response.result.msgResult === 'TRANSACCION CORRECTA')) {
						for(let i = 0; i < response.warning.length; i++) {
							response.warning[i].fecha = AveriasUtils.FormatDateAveriasPantalla(response.warning[i].fecha);
						}
						//rellenemos la lista en caso de recibir warnings
						let auxList = []
						response.warning.map((item) => {
							if (isWarningOpen(item)) {
								auxList.push(item)
							}
						})
						setWarningsList(response.warning)
					} else {
						//En caso de error de sistema
						setWarningsList([])
					}
				}))
			}
		}
	}, [suplyPoint])


	const isIncidenceOpen = (interruption: any) => {
		return (interruption.interruptionDuration === '');
	}

	const isWarningOpen = (warning: any) => {
		// 1 - Aviso pendiente
		// 2 - Asociado a incidencia/trabajo no resuelto
		// 4 - Pendiente de saturne (dura poco pero puede suceder)
		// Closed:
		// 3 - Asociado a incidencia/trabajo resuelto
		// 5 - Desestimado
		// Cuando es 1, 2, 4
		return (warning.estadoAviso !== '3') && (warning.estadoAviso !== '5');
	}

	const getFromStatus = (list: any, type: string) => {
		let cont = 0;
		if (type === 'warnings') {
			list.map(() => {
				cont++
			})
		} else if (type === 'incidences') {
			list.map((item) => {
				cont++;
			})
		}
		return cont;
	}

	const isElectrodependent = () => {
		if (suplyPoint.notCuttableMotive === '01 - ESENCIAL POR ELECTRODEPENDECIA' || suplyPoint.notCuttableMotive === '01 - ESENCIAL POR ELECTRODEPENDENCIA' || suplyPoint.notCuttableMotive === '02 - ESENCIAL POR REAL DECRETO') {
			return true;
		} else {
			for (let i = 0; i < srList.length; i++) {
				if (srList[i].status === 'EN CURSO' && suplyPoint.cups === srList[i].cups) {
					return true;
				}
			}
			return false;
		}
	}
	const isElectrodependentSR = () => {
		for (let i = 0; i < srList.length; i++) {
			if (srList[i].status === 'EN CURSO' && suplyPoint.cups === srList[i].cups) {
				return true;
			}
		}
		return false;
	}

	const handleReading = (value) => {
		if (value.includes('.')) {
			return value.replace('.', ',')
		}
		else return value
	}

	const calcTension = (tension: any) => {
		return (formatNumberES(parseFloat(tension)))
	}

	const calcPotencia = (potencia: any) => {
		return (
			formatNumberES(parseFloat(potencia) / 1000))
	}

	return (
		<Grid container className={styles.borderArea}>
			<Grid item className={styles.headerTitle}>
				{t('averias.management.searchCups.comprovacionesSuministro.title')}
			</Grid>
			<Grid container md={12} sm={12} xs={12} className={styles.innerArea} >
				<Grid className={styles.width}>
					{/* informacion elecrodependencia */}
					{isElectrodependent() &&
						<Grid container md={12} sm={12} xs={12} className={styles.leftjustifyContainer}>
							<Grid item className={styles.whiteRight} id='compSuministro'>
								<div className={styles.electroIcon}>
									<img className={styles.img} src={electrodependentIcon} />
									{t('averias.management.searchCups.comprovacionesSuministro.electrodependentUser')}
								</div>
							</Grid>
						</Grid>
					}
					{/* container superior */}
					<Grid container md={12} sm={12} xs={12} className={styles.rightJustifyContainer}>
						{/* sin contrato / con contrato*/}
						{sinContrato ? (
							<Grid item className={styles.redBox} style={{ fontWeight: 'bold' }}>
								{t('averias.management.searchCups.comprovacionesSuministro.sinContrato')}
							</Grid>
						) : (
							<Grid item className={styles.greenBoxRight} style={{ fontWeight: 'bold' }}>
								{t('averias.management.searchCups.comprovacionesSuministro.enVigor')}
							</Grid>
						)}
						{noCortado ? (
							<Grid item className={styles.greenBox} style={{ fontWeight: 'bold' }}>
								{t('averias.management.searchCups.comprovacionesSuministro.noCortado')}
							</Grid>
						) : (cortadoBaja ? (
							<Grid item className={styles.redBox} style={{ fontWeight: 'bold' }}>
								{t('averias.management.searchCups.comprovacionesSuministro.cortadoBaja')}
							</Grid>
						) : (
							<Grid item className={styles.redBox} style={{ fontWeight: 'bold' }}>
								{t('averias.management.searchCups.comprovacionesSuministro.cortadoImpago')}
							</Grid>
						))}
					</Grid>
				</Grid>
				{/* CONTAINER ESQUERRA */}
				<Grid container md={6} sm={6} xs={6} className={styles.innerContainer} style={{ alignContent: 'center' }}>
					<Grid container direction='row' md={12}>
						<Grid container direction='row' justifyContent='flex-end' md={5}>
							<Grid item><img className={styles.icon} src={consumoTotal} alt='' /></Grid>
							<Grid item className={styles.innerDescriptionText}>{t('averias.management.searchCups.comprovacionesSuministro.consumo')}</Grid>
						</Grid>
						<Grid md={6} className={styles.innerPointInformation}>{suplyPoint.cups}</Grid>
					</Grid>
					<Grid container direction='row' md={12}>
						<Grid container direction='row' justifyContent='flex-end' md={5}>
							<Grid className={styles.innerDescriptionText}>{t('averias.management.searchCups.comprovacionesSuministro.direccion')}</Grid>
						</Grid>
						<Grid md={6} className={styles.innerPointInformation}>
							{(suplyPoint.address.street ? suplyPoint.address.street : '') + ' ' +
								(suplyPoint.address.number ? suplyPoint.address.number : '') + ' ' +
								(suplyPoint.address.stair ? t('averias.management.searchCups.table.escalera') + suplyPoint.address.stair : '') + ' ' +
								(suplyPoint.address.floor ? t('averias.management.searchCups.table.piso') + suplyPoint.address.floor : '') + ' ' +
								(suplyPoint.address.door ? t('averias.management.searchCups.table.puerta') + suplyPoint.address.door : '')}
						</Grid>
					</Grid>
					<Grid container direction='row' md={12}>
						<Grid container direction='row' justifyContent='flex-end' md={5}>
							<Grid className={styles.innerDescriptionText} />
						</Grid>
						<Grid md={6} className={styles.innerPointInformation}>
							{(suplyPoint.address.zipCode ? suplyPoint.address.zipCode : '') + ' ' +
								(suplyPoint.address.town ? suplyPoint.address.town : '') + ', ' +
								(suplyPoint.address.province ? suplyPoint.address.province : '')}
						</Grid>
					</Grid>
					<Grid container direction='row' md={12}>
						<Grid container direction='row' justifyContent='flex-end' md={5}>
							<Grid item className={styles.innerDescriptionText}>{t('averias.management.searchCups.comprovacionesSuministro.titular')}</Grid>
						</Grid>
						<Grid item className={styles.innerPointInformation}>{suplyPoint.holderName ? suplyPoint.holderName : ''}</Grid>
					</Grid>
					<Grid container direction='row' md={12}>
						<Grid container direction='row' justifyContent='flex-end' style={{ textAlign: 'right' }} md={5}>
							<Grid item className={styles.innerDescriptionText}>{t('averias.management.searchCups.comprovacionesSuministro.docIdentificador')}</Grid>
						</Grid>
						<Grid item className={styles.innerPointInformation}>{suplyPoint?.holderDocumentNumber ? suplyPoint?.holderDocumentNumber : ''}</Grid>
					</Grid>
					<Grid container direction='row' md={12}>
						<Grid container direction='row' justifyContent='flex-end' md={5}>
							<Grid item className={styles.innerDescriptionText}>{t('averias.management.searchCups.comprovacionesSuministro.provincia')}</Grid>
						</Grid>
						<Grid item className={styles.innerPointInformation}>{(suplyPoint.address.province ? suplyPoint.address.province : '')}</Grid>
					</Grid>
				</Grid>
				{/* CONTAINER DRETA solo se muestran cosas si hay conexion*/}
				{(!sinContrato) &&
					<Grid container md={6} sm={6} xs={6} className={styles.innerContainer}>
						<Grid container md={12} sm={12} xs={12} className={styles.rightJustifyContainer}>
							{conTelegestion ? (
								/* telegestion */
								<Grid item md={12} sm={12} xs={12} className={`${styles.suministroConTelegestion} ${(tabletRes || mobileRes) && 'mobile'}`}>
									{t('averias.management.searchCups.comprovacionesSuministro.suministroTelegestion')}
								</Grid>
							) : (
								/*No telegestion */
								<Grid item md={12} sm={12} xs={12} className={styles.suministroSinTelegestion}>
									{t('averias.management.searchCups.comprovacionesSuministro.suministroSinTelegestion')}
								</Grid>
							)}
						</Grid>
						{/* estado 2 */}
						{(estadoSegundo && conTelegestion) &&
							<Grid container className={styles.rightJustifyContainer} style={{ marginBottom: '5px' }}>
								<Grid container item md={12} sm={12} xs={12} className={styles.redText}>
									<Grid item sm={11} style={{ alignSelf: 'end' }}>
										{t('averias.management.searchCups.comprovacionesSuministro.contadorEstado21')}<br />
										{t('averias.management.searchCups.comprovacionesSuministro.contadorEstado22')}
									</Grid>
									<Grid item sm={1}>
										<img src={contadorInactivo} className={styles.iconContador} alt='' />
									</Grid>
								</Grid>
							</Grid>
						}
						{/* estado 1 */}
						{(estadoPrimero && conTelegestion) &&
							<Grid container>
								<Grid container md={12} sm={12} xs={12} className={styles.rightJustifyContainer}>
									<Grid item md={12} sm={12} xs={12} className={styles.greenText}>
										<span>
											{t('averias.management.searchCups.comprovacionesSuministro.contadorEstado1')}
										</span>
										<img src={contadorActivo} className={styles.iconContador} alt='' />
									</Grid>
								</Grid>
								<Grid container className={styles.alignEnd}>
									<Grid item md={12} sm={12} xs={12}>{executionDate}</Grid>
									{
										suplyPoint.installationType === 'Monofásica' ?
											<>
												<p className={styles.readingItem}>
													<span>{calcPotencia(meterKw)} kW</span>
													<span>{calcTension(meterV)} V</span>
												</p>
											</>
											:
											<>
												<p className={styles.readingItem}>
													<span>{calcPotencia(meterKw)} kW</span>
													<span>{calcTension(meterV)} V</span>
												</p>
												<p className={styles.readingItem}>
													<span>{calcPotencia(meterKw2)} kW</span>
													<span>{calcTension(meterV2)} V</span>
												</p>
												<p className={styles.readingItem}>
													<span>{calcPotencia(meterKw3)} kW</span>
													<span>{calcTension(meterV3)} V</span>
												</p>
											</>
									}
								</Grid>
							</Grid>
						}
						{/* estado 0 */}
						{(estadoZero && conTelegestion) &&
							<Grid container className={styles.rightJustifyContainer}>
								<Grid item md={12} sm={12} xs={12} className={styles.redText} style={{ display: 'flex', alignContent: 'center', alignItems: 'center', marginTop: '15px', marginBottom: '15px' }}>
									{t('averias.management.searchCups.comprovacionesSuministro.contadorEstado0')}
									<img src={contadorInactivo} className={styles.iconContador} alt='' style={{ marginTop: '0' }} />
								</Grid>
							</Grid>
						}
						{/* estado inicial, conectado con contador */}
						{(comprovandoContador && conTelegestion) &&
							<Grid container className={styles.rightJustifyContainer}>
								<CustomLinearProgressBar
									setConnectingTimout={setConnectingTimout}
									setComprovandoContador={setComprovandoContador}
								/>
							</Grid>
						}
						{/* error de conexion */}
						{(errorConexion) &&
							<Grid container className={styles.rightJustifyContainer2}>
								<Grid item md={10} className={styles.suministroErrorConexion}>
									{t('supplies.suppliesDetails.components.meter.connectError.first.title')}
								</Grid>
								<div className={styles.errorImg}>
									<img src={redAlertaIcono} className={styles.iconContador} alt='' />
								</div>
							</Grid>
						}
						{/* Boton rearmar */}
						{(estadoSegundo && conTelegestion) &&
							<Grid container md={12} sm={12} xs={12} className={(tabletRes || mobileRes) ? styles.buttonCont : styles.rightJustifyContainer}>
								<Button
									text={t('averias.management.searchCups.comprovacionesSuministro.rearmarButton')}
									color={'primary'}
									size={'large'}
									variant={'contained'}
									onClick={handleRearmarButton}
									disabled={rearmandoContador}
								/>
							</Grid>
						}
						{/* boton comprovar contador */}
						{(!estadoSegundo && conTelegestion) &&
							<Grid container md={12} sm={12} xs={12} className={(tabletRes || mobileRes) ? styles.buttonCont : styles.rightJustifyContainer}>
								<Button
									text={t('averias.management.searchCups.comprovacionesSuministro.comprobarContador')}
									color={'primary'}
									size={'large'}
									variant={'contained'}
									onClick={handleComprobarContadorButton}
									disabled={comprovandoContador || comprovandoContadorBack}
									img={comprovandoContador || comprovandoContadorBack ? arrowRightBlack : arrowRight}
									className={styles.arrowRight}
								/>
							</Grid>
						}
					</Grid>
				}
			</Grid>
			<ExpansionPanel >
				<ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />}>
					{getFromStatus(openIncidencesList, 'incidences') > 0 && <span className={styles.red}>{getFromStatus(openIncidencesList, 'incidences')}</span>}
					<img className={styles.expansionPanelSummaryIcon} src={incidenciaIcono} alt='' />
					<Typography className={styles.expansionPanelSummaryText}>
						{t('averias.management.consult.incidencesListTitle')}
					</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
					<Grid container className={styles.table}>
						<ListIncidences
							listItems={incidencesList}
							setFinalList={setIncidencesList}
							currentPage={currentPage}
							setCurrentPage={setCurrentPage}
							itemsPerPage={itemsPerPage}
							setItemsPerPage={setItemsPerPage}
							totalPages={totalPages}
							cups={suplyPoint.cups}
							setIsRequestModalVisible={setIsRequestModalVisible}
							setCrearAvisoFromIncidence={setCrearAvisoFromIncidence}
							setIncidencesLoading={setIsLoadingIncidences}
							tabletRes={tabletRes}
							mobileRes={mobileRes}
						/>
					</Grid>
				</ExpansionPanelDetails>
			</ExpansionPanel>
			<ExpansionPanel >
				<ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />}>
					{getFromStatus(openWarningsList, 'warnings') > 0 && <span className={styles.red}>{getFromStatus(openWarningsList, 'warnings')}</span>}
					<img className={styles.expansionPanelSummaryIcon} src={campanaIcono} alt='' />
					<Typography className={styles.expansionPanelSummaryText}>
						{t('averias.management.searchCups.comprovacionesSuministro.avisos')}
					</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
					<Grid container className={styles.table}>
						<ListWarnings
							listItems={warningsList}
							setFinalList={setWarningsList}
							currentPage={currentPageWarnings}
							setCurrentPage={setCurrentPageWarnings}
							itemsPerPage={itemsPerPageWarnings}
							setItemsPerPage={setItemsPerPageWarnings}
							setWarningsLoading={setIsLoadingWarnings}
							setIncidencesLoading={setIsLoadingIncidences}
							totalPages={totalPagesWarnings}
							cups={suplyPoint.cups}
							mobileRes={mobileRes}
							tabletRes={tabletRes}
						/>
					</Grid>
				</ExpansionPanelDetails>
			</ExpansionPanel>
			{
				loading && (
					<div style={{ backgroundColor: '#f2f5f8', width: '100%', margin: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '20px', color: '#004571', fontWeight: 'bold' }}>
						<img src={Spinner} alt='' style={{ height: '50px' }} />
						<div style={{ textAlign: 'center' }}>
							{t('wait')}
							<br />
							{t('wait_2')}
						</div>
					</div>
				)
			}
			<Grid container direction='row' justifyContent='center' spacing={3} className={styles.buttonsContainer}>
				<Grid item>
					<Button
						className={styles.button}
						text={t('averias.management.searchCups.comprovacionesSuministro.crearAviso')}
						color='primary'
						size='large'
						variant='contained'
						disabled={loading}
						// disabled={(error === false && (credential !== '' || (name !== '' && surname1 !== ''))) ? false : true}
						onClick={createRequest}
					/>
				</Grid>
			</Grid>
			<RequestModal
				isRequestModalVisible={isRequestModalVisible}
				closeDialog={handleCloseRequestDialog}
				handleAcceptRequestDialog={handleAcceptRequestDialog}
				cups={suplyPoint.cups}
				address={fullAddress()}
				document={suplyPointUser?.documentNumber}
				user={suplyPointUser}
				setCreated={setRequestCreatedDialogOpen}
				error={systemErrorDialogOpen}
				setError={setSystemErrorDialogOpen}
				supply={suplyPoint}
				incidenceList={openIncidencesList}
				warningList={openWarningsList}
				isElectroSR={isElectrodependentSR()}
				estadoContador={estadoContador}
				estadoZero={estadoZero}
				estadoPrimero={estadoPrimero}
				estadoSegundo={estadoSegundo}
				warningInfo={warningInfo}
				crearAvisoFromIncidence={crearAvisoFromIncidence}
				maxTry={maxTry}
				closedSRTipo={closedSRTipo}
				typeList={typeList}
				scopeList={scopeList}
				motiveList={motiveList}
				name={name}
				surName1={surName1}
				surName2={surName2}
				email={email}
				phone={phone}
				remark={remark}
				extraInfo={extraInfo}
				currentQuestion={currentQuestion}
				answeredQuestionList={answeredQuestionList}
				digitalScript={digitalScript}
				manualChangedCor={manualChangedCor}
				questionPendingValue={questionPendingValue}
				setName={setName}
				setSurName1={setSurName1}
				setSurName2={setSurName2}
				setEmail={setEmail}
				setPhone={setPhone}
				setRemark={setRemark}
				setExtraInfo={setExtraInfo}
				setCurrentQuestion={setCurrentQuestion}
				setAnsweredQuestionList={setAnsweredQuestionList}
				setManualChangedCor={setManualChangedCor}
				setQuestionPendingValue={setQuestionPendingValue}
			/>
			<SystemErrorModal
				open={systemErrorDialogOpen}
				closeFunction={closeFunction}
			/>
			<RequestCreatedModal
				open={requestCreatedDialogOpen}
				closeFunction={closeFunction2}
			/>
			<ConectTimeDialog
				connectingTimout={connectingTimout}
				setIsLoadingMR={setIsLoadingMeterReadings}
				handleReturn={handleReturn}
				setQuestionPendingVal={setQuestionPendingValue}
			/>
		</Grid >
	)
}
export default ComprovacionSuministro
