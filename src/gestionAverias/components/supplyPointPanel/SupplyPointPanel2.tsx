import React, { useState, useEffect } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';


import { DialogContent, Grid, RadioGroup, FormControlLabel, DialogActions } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';

import { showError } from '../../../common/store/actions/ErrorActions';
import { thunkCreateNewRequest, thunkNoticeSgi } from '../../../requests/store/actions/RequestsThunkActions';

import useStyles from './SupplyPointPanel.styles';

import Input from '../../../common/components/input/Input';
import TextArea from '../../../common/components/textarea/TextArea';
import Button from '../../../common/components/button/Button';
import Spinner from '../../../common/components/spinner/Spinner';

import CloseIcon from '../../../assets/icons/cerrar.svg'
import consumoTotal from '../../../assets/icons/consumo_total.svg';

import EndReiterationModal from './modals/endReiterationModal';
import OsCutModal from './modals/osCutModal';

import DigitalScriptService, { Question } from '../../services/DigitalScriptService2';
import TextButton from '../../../common/components/text-button/TextButton';
import { validateMail, validatePhoneNumber } from '../../../common/lib/ValidationLib';

import InfoIcon from '../../../assets/icons/ico_info.svg'
import ArrowDown from '../../../assets/icons/flecha_down_blue.svg'
import ArrowUp from '../../../assets/icons/flecha_up_blue.svg'
import Check from '../../../assets/icons/Interfaz_22_check_tick_preguntas.svg'

import Tooltip from '../../../common/components/tooltip/Tooltip'
import ErrorMessageContainer from './components/error'
import AlertIcon from '../../../assets/icons/aviso_alerta_blanco.svg'
import AlertIcon2 from '../../../assets/icons/aviso_alerta_pop_up.svg'
import Modales from '../../../supplies/supplies-details/components/consumption/charts/filters/error-message/Modales';
import Resume from '../failure-result-page/Resume';
import AveriasContext from '../../../context/AveriasContext';
// LCS: Importa la función - Wave 2
import { sendGAEvent } from '../../../core/utils/gtm';

const SupplyPointPanel2 = (props: any) => {

	const { t } = useTranslation();
	const dispatch = useDispatch();
	const classes = useStyles({});

	const userPTName = useSelector((state: any) => state.admin.profile.name);
	const userPTSurname = useSelector((state: any) => state.admin.profile.surName);

	const tabletRes = useMediaQuery('(max-width:768px)')
	const mobileRes = useMediaQuery('(max-width:576px)')

	const {
		user,
		supply,
		incidenceList,
		warningList,
		isElectrodependantSR,
		estadoContador,
		handleCloseDialog,
		warningInfo,
		estadoZero,
		estadoPrimero,
		estadoSegundo,
		crearAvisoFromIncidence,
		error,
		setError,
		maxTry,
		closedSRTipo,
		typeList,
		scopeList,
		motiveList,
		remarkParent,
		setRemarkParent
	} = props

	const { security, setSecurity, electrodependent, setElectodependent } = AveriasContext()
	let arrayUser = supply.holderName.split(' ');

	const fullAddress = () => {
		let stair = supply.address.stair ? 'Es:' + supply.address.stair + ' ' : ''
		let floor = supply.address.floor ? 'Pl:' + supply.address.floor + ' ' : ''
		let door = supply.address.door ? 'Pt:' + supply.address.door + ' ' : ''
		let address1 = supply.address.street + ' ' + supply.address.number + ', ' + stair + floor + door
		let address2 = supply.address.zipCode + ' ' + supply.address.town + ', ' + supply.address.province
		return [address1, address2]
	}

	const address = fullAddress()

	const userPT = useSelector((state: any) => state.admin.profile.documentNumber);

	// Gestión SR's
	const [endReiteration, setEndReiteration] = useState(false)
	const [enviarSgi, setEnviarSgi] = useState(false)


	const defaultNameCalculate = () => {
		return props?.user?.name ? props.user.name : ((arrayUser && arrayUser[0]) ? arrayUser[0] : '')
	}

	const defaultSurName1Calculate = () => {
		return props?.user?.surName1 ? props.user.surName1 : ((arrayUser && arrayUser[1]) ? arrayUser[1] : '')
	}

	const defaultSurName2Calculate = () => {
		return props?.user?.surName2 ? props.user.surName2 : ((arrayUser && arrayUser[2]) ? arrayUser[2] : '')
	}

	// Datos usuario
	const [name, setName] = useState(defaultNameCalculate());
	const [email, setEmail] = useState(supply?.holderContactEmail ? supply.holderContactEmail : '');
	const [phone, setPhone] = useState(supply?.holderContactPhone ? supply.holderContactPhone : '');
	const [surName1, setSurName1] = useState(defaultSurName1Calculate());
	const [surName2, setSurName2] = useState(defaultSurName2Calculate());
	const [remark, setRemark] = useState(getRemarkText());

	const [nameError, setNameError] = useState(false)
	const [surname1Error, setSurname1Error] = useState(false)
	const [surname2Error, setSurname2Error] = useState(false)
	const [observationsError, setObservationsError] = useState(false)
	const [phoneError, setPhoneError] = useState(false)
	const [emailError, setEmailError] = useState(false)

	// Digital script.
	const [reRender, setRerender] = useState<boolean>(false);
	const [currentQuestion, setCurrentQuestion] = useState<Question>(null);
	const [answeredQuestionList, setAnsweredQuestionList] = useState<Question[]>([]);
	const [digitalScript] = useState<DigitalScriptService>(new DigitalScriptService(user, supply, 'identificar_punto_suministro'));
	const [showDigitalScript, setShowDigitalScript] = useState<boolean>(false);

	// Spinners
	const [isRequestLoading, setIsRequestLoading] = useState<boolean>(false);
	const [isIncidenceCreating, setIsIncidenceCreating] = useState<boolean>(false);

	// Orden de corte
	const [osCutModal, setOsCutModal] = useState(false)

	// Datos SGI
	const [sendSgi, setSendSgi] = useState<boolean>(false)
	const [sendSeguridad, setSeguridad] = useState<boolean>(null)
	const [sgiType, setSgiType] = useState('')
	const [sgiScope, setSgiScope] = useState('')
	const [urgencia, setUrgencia] = useState('')
	const [sgiTypeDisabled, setSgiTypeDisabled] = useState<boolean>(false)
	const [sgiScopeDisabled, setSgiScopeDisabled] = useState<boolean>(false)
	let [srCode, setSrCode] = useState('')
	const [srSubCode, setSrSubCode] = useState('')
	const [isBloqued, setIsBloqued] = useState<boolean>(false)
	const [type, setType] = useState('')
	const [alcance, setAlcance] = useState('')
	const [motivo, setMotivo] = useState('')

	// Botón envío formulario
	const [disableButton, setDisableButton] = useState<boolean>(true);

	//Radio button pregunta urgencia
	const [tempSelectedState, setTempSelectedState] = useState('2')

	// Indicador contrato no vigente
	const [activeContractInd, setActiveContractInd] = useState<boolean>(true)

	// Saber si es urgente o no
	const [isSecurityProblem, setIsSecurityProblem] = useState<boolean>()

	const [showModal, setShowModal] = useState<boolean>()

	const [questionModal, setQuestionModal] = useState<Question>()

	const [manualChangedCor, setManualChangedCor] = useState<boolean>(false)

	const [extraInfo, setExtraInfo] = useState('')

	const [maxChar, setMaxChar] = useState<number>(300)

	const [restChar, setRestChar] = useState<number>(300)

	const [numTry, setNumTry] = useState(0)
	const [corFlag, setCorFlag] = useState(false)
	const [respuestaSgi, setRespuestaSgi] = useState(null)
	const [respuestaZeus, setRespuestaZeus] = useState(null)
	const [error1001, setError1001] = useState(false)
	const [error2001, setError2001] = useState(false)

	useEffect(() => {
		if (props.warningList && props.warningList.length >= 1) {
			digitalScript.setHasAveria(true)
			for (let i = 0; i < warningList.length; i++) {
				// Nos quedamos siempre con el tipo de avería
				digitalScript.setTipoAveria(warningList[i].tipoAviso);
				// Si hay una incidencia de tipo 3 se informa al agente que se ponga en contacto con el COR (T03A H01 H02)
				if (warningList[i].tipoAviso === '3') {
					// así que gana prioridad y se para
					break;
				}
			}
		}

		if (props.incidenceList && props.incidenceList.length >= 1) {
			let hasIncidence = false;
			for (let i = 0; i < incidenceList.length; i++) {
				if (incidenceList[i].interruptionDuration === '') {
					hasIncidence = true;
					break; // Detener el bucle si se encuentra una incidencia en curso no terminada
				}
			}
			digitalScript.setHasIncidence(hasIncidence)
		}
		digitalScript.setSrDependency(props.isElectrodependantSR)
	}, [])

	useEffect(() => {
		setRestChar(maxChar - extraInfo.split('').length)
	}, [extraInfo])
	// Saber si se debe priorizar: '0' not priority, '1' priority, '2' undefined
	const [priority, setPriority] = useState('2')
	const [showPriorityTooltip, setShowPriorityTooltip] = useState(false)

	useEffect(() => {
		if (priority === '1') {
			setRemark('¡PRIORIZAR ATENCIÓN POR IMPACTO EN USUARIO/NEGOCIO! \n' + remark)
		}
		else {
			setRemark(remark.replace('¡PRIORIZAR ATENCIÓN POR IMPACTO EN USUARIO/NEGOCIO! \n', ''))
		}
	}, [priority])

	let expirationDateAux = supply.expirationDate && supply.expirationDate !== '' ? supply.expirationDate.split('/') : ''
	let day = new Date().getDate()
	let month = new Date().getMonth()
	let year = new Date().getFullYear()

	// UseEffect inicial equivale a componentDidMount
	useEffect(() => {
		if (expirationDateAux !== '') {
			if (parseInt(expirationDateAux[2]) < year) {
				setActiveContractInd(false)
			} else if (parseInt(expirationDateAux[2]) === year) {
				if (parseInt(expirationDateAux[1]) < month) {
					setActiveContractInd(false)
				} else if (parseInt(expirationDateAux[1]) === month) {
					if (parseInt(expirationDateAux[0]) < day) {
						setActiveContractInd(false)
					}
				}
			}
		}

		digitalScript.setMeterStatus(parseInt(estadoContador))

		if (warningInfo.osCorte === '1') {
			digitalScript.setOsCorte(1)
		}

		//Comprobamos si se está creando un aviso desde una incidencia
		if (crearAvisoFromIncidence) {
			digitalScript.setLocatedFailure(true)
			digitalScript.resetQuestions(answeredQuestionList)
			setEnviarSgi(true)
			setSrCode('0871A00')
		}

	}, [])

	// useEffect para controlar el botón de envío
	useEffect(() => {
		if (name !== '' && surName1 !== '' && phone !== '') {
			if (showDigitalScript) {
				setDisableButton(false)
			}
			else if (digitalScript.getReason() === 'SCRIPT_END' || enviarSgi || digitalScript.getReason() === 'serviceDown') {
				if (!manualChangedCor) {
					setDisableButton(false)
				} else if (manualChangedCor && restChar !== maxChar) {
					setDisableButton(false)
				} else {
					setDisableButton(true)
				}
			}
			else if (digitalScript.getOsCorte() === 1) {

				setDisableButton(false)
			}
			else {
				setDisableButton(true)
			}
		}
		else {
			setDisableButton(true)
		}

	}, [name, surName1, phone, sgiType, sgiScope, digitalScript.getReason() === 'SCRIPT_END', showDigitalScript, manualChangedCor, restChar]);

	// useEffect para controlar las preguntas del script
	useEffect(() => {

		if (currentQuestion === null) {
			getFirstQuestion();
		}
		if (currentQuestion && currentQuestion.id === 7) {
			setIsSecurityProblem(currentQuestion.answer)
			digitalScript.setAnswer(currentQuestion.id, isSecurityProblem)
		}
		if (currentQuestion && currentQuestion.id === 7) {
			answerQuestion(currentQuestion, currentQuestion.answer);
		}
		if (currentQuestion && currentQuestion.id === 0) {
			if (digitalScript.getReason() === 'locatedFailure') {
				const notification = digitalScript.getSgiNotification();
				setSendSgi(true);
				setSgiScope(notification.scope.toString());
				setSgiTypeDisabled(true);
				setSgiScopeDisabled(true);
			}
		}
	}, [currentQuestion]);



	useEffect(() => {
		if (phone !== '' && validatePhoneNumber(phone)) {
			setPhoneError(false)
		} else {
			if (phone === '') {
				setPhoneError(true)
			} else {
				setPhoneError(false)
			}
		}
	}, [phone])

	useEffect(() => {
		if (surName1?.trim() === '') {
			setSurname1Error(true)
		} else {
			setSurname1Error(false)
		}
	}, [surName1])

	useEffect(() => {
		if (name?.trim() === '') {
			setNameError(true)
		} else {
			setNameError(false)
		}
	}, [name])

	useEffect(() => {
		setRemarkParent(remark)
		if (remark?.trim() === '') {
			setObservationsError(true)
		} else {
			setObservationsError(false)
			sessionStorage.setItem('remark', remark)
		}
	}, [remark])

	useEffect(() => {
		if (email !== '' && validateMail(email)) {
			setEmailError(false)
		} else {
			if (email !== '') {
				setEmailError(true)
			} else {
				setEmailError(false)
			}
		}
	}, [email])

	const doReRender = (): void => {
		setRerender(!reRender);
	}

	// Función para controlar los inputs del formulario
	const handleChangeInput = (
		input: 'name' | 'surname1' | 'surname2' | 'email' | 'phone' | 'type' | 'scope' | 'urgencia' | 'remark' | 'security',
		value: any
	): any => {
		if (input === 'name') {
			setName(value);
		} else if (input === 'surname1') {
			setSurName1(value);
		} else if (input === 'surname2') {
			setSurName2(value);
		} else if (input === 'email') {
			setEmail(value);
		} else if (input === 'phone') {
			setPhone(value);
		} else if (input === 'type') {
			setSgiType(value);
		} else if (input === 'scope') {
			setSgiScope(value);
		} else if (input === 'urgencia') {
			setUrgencia(value);
		} else if (input === 'remark') {
			setRemark(value)
		}
	}

	useEffect(() => {
		const DNI = sessionStorage.getItem('DNIAveria')
		const CUPS = sessionStorage.getItem('CUPSAveria')
		if (DNI === supply?.holderDocumentNumber && CUPS === supply.cups) {
			setSecurity(sessionStorage.getItem('security') === '1' ? true : sessionStorage.getItem('security') === '0' ? false : undefined)
			setElectodependent(sessionStorage.getItem('electrodependent') === '1' ? true : sessionStorage.getItem('electrodependent') === '0' ? false : undefined)
		} else {
			sessionStorage.setItem('DNIAveria', supply?.holderDocumentNumber)
			sessionStorage.setItem('CUPSAveria', supply.cups)
			sessionStorage.setItem('remark', remarkParent)
			sessionStorage.setItem('electrodependent', '')
			sessionStorage.setItem('security', '')
		}
	}, [])

	useEffect(() => {
		const DNI = sessionStorage.getItem('DNIAveria')
		const CUPS = sessionStorage.getItem('CUPSAveria')
		if (DNI === supply?.holderDocumentNumber && CUPS === supply.cups) {
			if (currentQuestion?.id === 1 && (sessionStorage.getItem('security') === '1' || sessionStorage.getItem('security') === '0')) {
				answerQuestion(currentQuestion, sessionStorage.getItem('security') === '1' ? true : sessionStorage.getItem('security') === '0' ? false : undefined)
			} else if (currentQuestion?.id === 7 && (sessionStorage.getItem('electrodependent') === '1' || sessionStorage.getItem('electrodependent') === '0')) {
				answerQuestion(currentQuestion, sessionStorage.getItem('electrodependent') === '1' ? true : sessionStorage.getItem('electrodependent') === '0' ? false : undefined)
			}
		}
	}, [currentQuestion])

	const existQuestion = (QuestionList: Question[], questionId: number): number => {
		return QuestionList.findIndex(question => question.id === questionId);
	}
	
	const isFlowNotSupplyRestored = (question) => {
		if (existQuestion(answeredQuestionList, 1) !== -1 && existQuestion(answeredQuestionList, 7) !== -1
			&& existQuestion(answeredQuestionList, 2) !== -1 && existQuestion(answeredQuestionList, 3)
			&& existQuestion(answeredQuestionList, 6) && existQuestion(answeredQuestionList, 5) 
			&& question.id && question.id == 5 && question.answer) {
			return true
		}
		return false;
	}

	// Función para responder las preguntas del script digital
	const answerQuestion = async (question: Question, answer: boolean): Promise<void> => {
		// variable creada para los flujos H18, H19, H20, H23
		let controlFlowNotSupplyRestored = false;
		if (question.id === 1) {
			setSecurity(answer)
			sessionStorage.setItem('security', answer === true ? '1' : answer === false ? '0' : '')
			setSrSubCode('');
			setSrCode('');
		}

		if (question.id === 7) {
			setElectodependent(answer)
			sessionStorage.setItem('electrodependent', answer === true ? '1' : answer === false ? '0' : '')
		}

		if (question.id === 12) {
			if ((digitalScript.getAnswer(6) === true && digitalScript.getAnswer(7) === false) || (digitalScript.getAnswer(6) === false && digitalScript.getAnswer(7) === false && digitalScript.getMeterStatusSync() === 1)) {
				if (answer === true) {
					setManualChangedCor(true)
				} else {
					setManualChangedCor(false)
				}
			} else {
				setManualChangedCor(false)
			}
		}

		if (question.id && question.id == 6 && question.answer == true) {
			setIsBloqued(true)
		}

		if(question.id === 5 && isFlowNotSupplyRestored(question) && !answer) {
			const indexNotVisible = answeredQuestionList.findIndex(questionLa => questionLa.id === question.id);
			if(indexNotVisible !== -1) {
				answeredQuestionList.splice(indexNotVisible, 1);
				controlFlowNotSupplyRestored = true;
			}
		}

		if (answeredQuestionList.includes(question)) {

			const auxAnsweredQuestionList: Question[] = answeredQuestionList;

			// Save the new answer
			auxAnsweredQuestionList.find(q => q.id === question.id).answer = answer;

			// Get modified question index and reset questions after that
			const questionsToReset: Question[] = [];
			const modifiedQuestionIndex = answeredQuestionList.indexOf(question);

			for (let i = auxAnsweredQuestionList.length - 1; i > modifiedQuestionIndex; i--) {
				questionsToReset.push(auxAnsweredQuestionList[i]);
				auxAnsweredQuestionList.pop();
			}

			if (questionsToReset.length > 0) {
				await digitalScript.resetQuestions(questionsToReset);
			}

			// Set the new values for answeredQuestionList
			setAnsweredQuestionList(auxAnsweredQuestionList);

			// Get next question
			question.answer = answer;

			const nextQuestion = await digitalScript.getQuestion(question);

			if (nextQuestion.id === 7) {
				answerQuestion(nextQuestion, nextQuestion.answer);
			} else {
				setCurrentQuestion(nextQuestion);
			}

			// Had to use this becase updating an array doesn't rerende the .map function
			doReRender();

		} else {
			question.answer = answer;
			if (question.id === 12 && question.visible) {
				answeredQuestionList.push(question);
			} else if (question.id !== 12) {
				answeredQuestionList.push(question);
			}
			const indexNotVisible = answeredQuestionList.findIndex(AQL => AQL?.visible === false);
			if(indexNotVisible !== -1) {
				answeredQuestionList.splice(indexNotVisible, 1);
			}
			const nextQuestion = await digitalScript.getQuestion(question);

			if (nextQuestion.id === 7) {
				answerQuestion(nextQuestion, nextQuestion.answer);
			} else {
				setCurrentQuestion(nextQuestion);
			}

			if (controlFlowNotSupplyRestored && nextQuestion.id === 12) {
				let questionCOR = digitalScript.getQuestionsList().find(quest => quest.id === 12);
				questionCOR.answer = false;
				questionCOR.disabled = false;
				if (questionCOR && !answeredQuestionList.includes(questionCOR)) {
					setManualChangedCor(false);
					answeredQuestionList.push(questionCOR);
				}
			}
		}
		if (digitalScript.getReason() === 'SCRIPT_END') {
			if (digitalScript.getSgiNotification()) {
				const notification = digitalScript.getSgiNotification()
				setSendSgi(true)

				setSgiType(notification.type.toString());
				setSgiScope(notification.scope.toString());

				setSgiTypeDisabled(true);
				setSgiScopeDisabled(true);

			} else {
				setSendSgi(false);
			}

		} else {
			setSgiScope('');
			setSgiTypeDisabled(true);
			setSgiScopeDisabled(false);
		}

		calcData();

		let found = false
		answeredQuestionList.forEach(element => {
			if (element.id === 12 && element.answer === true) {
				setCorFlag(true)
				found = true
			} else if (element.id === 12 && element.answer === false) {
				setCorFlag(false)
				setPriority('2')
				found = true
			}
		})
		if (!found) {
			setCorFlag(false)
			setPriority('2')
		}
	}

	// Función para obtener la primera pregunta del script digital
	const getFirstQuestion = async () => {
		setCurrentQuestion(await digitalScript.getQuestion(null));
	}

	const [errorShow, setShowError] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [disabled, setDisabled] = useState(false)

	const data_aux = {
		tipology: srCode !== '' ? srCode : digitalScript.getSrCode() ? digitalScript.getSrCode() : digitalScript.getTipoSR(),
	} as any;

	const postSRCreation = (respuestaZeus, prevision, tipo, hasToSendCor): void => {
		if (!respuestaZeus) {
			dispatch(showError('2001', 'createServiceRequest'))
			setIsIncidenceCreating(false)
		} else {
			//No hay error en el mensaje
			if (!error) {
				let return_ = {
					code: respuestaZeus.codigoSR,
					remark: remark + ((extraInfo && manualChangedCor) ? ' JUSTIFICACION: ' + extraInfo : ''),
					previsionDateTime: prevision,
					errorMessage: errorMessage,
					esAviso: true,
					esIncidencia: false,
					province: supply.address.province ? supply.address.province : '',
					cups: supply.cups ? supply.cups : '',
					fullAdress: address ? address : '',
					titular: supply.holderName ? supply.holderName : '',
					contactPerson: (name ? name : '') + (surName1 ? (name ? ' ' : '') + surName1 : '') + (surName2 ? (name ? ' ' : '') + surName2 : ''),
					doc: user?.documentNumber ? user?.documentNumber : supply.holderDocumentNumber ? supply.holderDocumentNumber : '',
					type: tipo,
					typeList: typeList,
					alcance: alcance,
					alcanceList: scopeList,
					motivoList: motiveList,
					scope: null,
					phone: phone ? phone : '',
					SR: digitalScript.getTipoSR(),
					motivo: motivo,
					type_: alcance,
					status: 'CERRADO',
					substatus: digitalScript.getSrSubString(),
					existAveria: digitalScript.getHasAveria() ? digitalScript.getHasAveria() : false,
					existIncidence: digitalScript.getHasIncidence() ? digitalScript.getHasIncidence() : false,
					newAveria: digitalScript.getNewAveriaResponse(),
					hasCOR: digitalScript.getCalculatedHasToSendCor(),
					type3: (digitalScript.getTipoAveria() === '3') ? true : false
				}

				if (hasToSendCor) {
					return_.scope = alcance;
				}

				dispatch(push('/gestionAverias/resultPage', return_));
			}

			setIsIncidenceCreating(false)
		}
	}

	const setDataClosedBy = (data): void => {
		const CheckClosedTipology = (data) => {
			// Verificar
			return data && data.tipology && closedSRTipo.includes(data.tipology);
		}

		if (CheckClosedTipology(data)) {
			data.closedByCode = userPT
			data.closedBy = userPTSurname + ', ' + userPTName
		}
	}

	// Función final acciones Zeus crear SR
	function doCreateServiceRequest(data, responseSGI, prevision, tipo, hasToSendCor, numIntento = 0) {
		if (responseSGI && responseSGI.sgiCodResult === '1001') {
			digitalScript.setCORpetitionError('1001')
			setSrCode(digitalScript.getTipoSR())
			setError1001(true)
			data.tipology = digitalScript.getTipoSR()
			const q = digitalScript.getQuestionsList()[12]
			answerQuestion(q, true)
			setIsIncidenceCreating(false)
			setRespuestaSgi(null)
		} else if (responseSGI && (responseSGI.sgiCodResult === '2001' || responseSGI.sgiCodResult === '2002' || responseSGI.sgiCodResult === '2003' || responseSGI.sgiCodResult === '2004' || responseSGI.sgiCodResult === '2005')) {
			digitalScript.setCORpetitionError(responseSGI.sgiCodResult)
			setSrCode(digitalScript.getTipoSR())
			setError2001(true)
			setIsIncidenceCreating(false)
			setRespuestaSgi(null)
		} else {
			setDataClosedBy(data);
			dispatch(thunkCreateNewRequest(data, (responseZ) => {
				setRespuestaZeus(responseZ);
				if (responseZ && responseZ.result && responseZ.result.codResult === '0000') {
					setNumTry(0)
					postSRCreation(responseZ, prevision, tipo, hasToSendCor);
				} else {
					let errorsSGIOrZeus = false;
					if (respuestaSgi && respuestaSgi.result.codResult !== '0000') {
						errorsSGIOrZeus = true;
						setErrorMessage(t('errors.XXX'));
						//mostramos dialog de error
						// setError(true);
						if (respuestaSgi && respuestaSgi.sgiCodResult !== '' && respuestaSgi.sgiCodResult !== '1003') {
							setErrorMessage(t('errors.sgi.' + respuestaSgi.sgiCodResult));
						}
					}
					if (!errorsSGIOrZeus) {
						if (responseZ && responseZ.result) {
							// setError(true)
							setErrorMessage(t('errors.XXX'));
							if (responseZ.result.codResult === '1001') {
								setIsIncidenceCreating(false);
								setShowError(true);
								setErrorMessage('errors.SR.1001');
							} else if (responseZ.result.codResult === '2001') {
								setIsIncidenceCreating(false);
								setShowError(false);
								setErrorMessage('errors.SR.2001');
							} else if (responseZ.result.codResult === '2002') {
								setIsIncidenceCreating(false);
								setShowError(true);
								setErrorMessage('errors.SR.2002');
							}
						}
						if (responseZ && respuestaSgi && responseZ.codigoSR) {
							respuestaSgi.codigoSR = responseZ.codigoSR;
						}
					}

					if (respuestaSgi && respuestaSgi.previsionDateTime && respuestaSgi.previsionDateTime !== '') {
						errorsSGIOrZeus = true;
						//formatear
						prevision = respuestaSgi.previsionDateTime;
						prevision = prevision.substr(0, 10);
					}
					// Controlar si hay error de nuestra API.
				}

				if (responseZ && responseZ.result && responseZ.result.codResult && responseZ.result.codResult === '2001') {
					if (numIntento < maxTry) {
						doCreateServiceRequest(data, responseSGI, prevision, tipo, hasToSendCor, numIntento + 1)
					} else {
						let return_ = {
							code: respuestaZeus?.codigoSR ? respuestaZeus?.codigoSR : '',
							remark: remark,
							previsionDateTime: prevision,
							errorMessage: errorMessage,
							esAviso: true,
							esIncidencia: false,
							province: supply.address.province ? supply.address.province : '',
							cups: supply.cups ? supply.cups : '',
							fullAdress: address ? address : '',
							titular: supply.holderName ? supply.holderName : '',
							contactPerson: (name ? name : '') + (surName1 ? (name ? ' ' : '') + surName1 : '') + (surName2 ? (name ? ' ' : '') + surName2 : ''),
							doc: user?.documentNumber ? user?.documentNumber : supply.holderDocumentNumber ? supply.holderDocumentNumber : '',
							type: tipo,
							typeList: typeList,
							alcance: alcance,
							alcanceList: scopeList,
							motivoList: motiveList,
							scope: null,
							phone: phone ? phone : '',
							SR: srCode !== '' ? srCode : digitalScript.getTipoSR(),
							motivo: motivo,
							type_: alcance,
							status:'CERRADO',
							substatus: digitalScript.getSrSubString(),
							existAveria: digitalScript.getHasAveria() ? digitalScript.getHasAveria() : false,
							existIncidence: digitalScript.getHasIncidence() ? digitalScript.getHasIncidence() : false,
							newAveria: digitalScript.getNewAveriaResponse(),
							hasCOR: digitalScript.getCalculatedHasToSendCor(),
							type3: (digitalScript.getTipoAveria() === '3') ? true : false,
							data: data,
							showRetry: true,
							msg: responseZ.observaciones,
						}

						if (hasToSendCor) {
							return_.scope = alcance;
						}
						
						dispatch(push('/gestionAverias/resultPage', return_));
					}
				}
			}));
		}
	}

	const calculateImportance = (): string => {
		let tipoImportancia = ''
		if (warningInfo && warningInfo.tipoSuministroImportante && warningInfo.tipoSuministroImportante !== '') {
			tipoImportancia = warningInfo.tipoSuministroImportante
		}
		switch (tipoImportancia) {
			case '1':
				return 'Esencial';

			case '2':
				return 'VIP';

			case '3':
				return 'Mantenimiento';

			case '4':
				return 'Explotación';

			default:
				break;
		}
		return ''
	}

	// Función para crear SR en ZEUS y aviso en SGI
	const createFailureNotice = (): void => {
		sessionStorage.removeItem('DNIAveria')
		sessionStorage.removeItem('CUPSAveria')
		sessionStorage.removeItem('electrodependent')
		sessionStorage.removeItem('security')
		sessionStorage.removeItem('remark')
		setIsIncidenceCreating(true)

		const tipology = digitalScript.getTipoSR();
		const subtipology = digitalScript.getSrSub();
		const notification = digitalScript.getSgiNotification();

		let tipoNumber = digitalScript.getTipoAviso();
		let alcanceNumber = digitalScript.getAlcance();
		let motivo = digitalScript.getMotivo();
		let hasToSendCor = digitalScript.getCalculatedHasToSendCor();
		let tipo = `${tipoNumber}`;
		let alcance = `${alcanceNumber}`;
		let enviar = 0;

		const electrodependiente = digitalScript.getAnswer(7);

		if (electrodependiente) {
			warningInfo.importancia = '1'
		}

		if (enviarSgi || hasToSendCor) {
			digitalScript.noticeSgi(tipoNumber, alcanceNumber, motivo);
			setType(tipo);
			setAlcance(alcance);
			setMotivo(motivo);
		}

		const data = {
			documentType: '',
			documentNumber: user?.documentNumber ? user?.documentNumber : supply.holderDocumentNumber ? supply.holderDocumentNumber : '',
			name: (name !== '') ? name : user?.name ? user?.name : arrayUser[0] ? arrayUser[0] : '',
			surName1: (surName1 !== '') ? surName1 : user?.surName1 ? user?.surName1 : arrayUser[1] ? arrayUser[1] : '',
			surName2: (surName2 !== '') ? surName2 : user?.surName2 ? user?.surName2 : arrayUser[2] ? arrayUser[2] : '',
			email: (email !== '') ? email : user?.email ? user?.email : supply.ownership ? supply.ownership : '',
			landline: (phone !== '') ? phone : user?.phone ? user?.phone : supply.holderContactPhone ? supply.holderContactPhone : '',
			cellphone: '',
			tipology: srCode !== '' ? srCode : tipology,
			subtipology: srSubCode !== '' ? srSubCode : subtipology,
			cups: supply.cups,
			dossierNumber: '',
			channel: '10003',
			createdByCode: userPT,
			createdBy: userPTSurname + ', ' + userPTName,
			savedByCode: userPT,
			savedBy: userPTSurname + ', ' + userPTName,
			closedByCode: '',
			closedBy: '',
			comment: remark + ' CodigoAgente:' + userPT + ((extraInfo && manualChangedCor) ? ' JUSTIFICACION: ' + extraInfo : ''),
			documents: [{
				url: '',
				idDocumentum: '',
				nombreArchivo: '',
				format: '',
				documentType: '',
				documentState: ''
			}],
			alcance: alcance,

		} as any;


		//Controlamos si se ha de enviar al COR
		if (hasToSendCor) {
			enviar = 1;
		}

		let prevision = ''
		let errorMessage = ''
		let response = {
			codigoSR: ''
		}

		if (hasToSendCor) {
			const direccion = warningInfo && formatAddress(warningInfo.descripcionMunicipio, warningInfo.descripcionCalle, warningInfo.numero, warningInfo.zipCode,
				warningInfo.descripcionProvincia, warningInfo.portal)
			let dataSgi = {
				document: user?.documentNumber ? user?.documentNumber : supply.holderDocumentNumber ? supply.holderDocumentNumber : '',
				name: name ? name : '',
				surname: surName1 ? surName1 : '',
				cups: supply.cups ? supply.cups : '',
				province: warningInfo && warningInfo.descripcionProvincia ? warningInfo.descripcionProvincia : '',
				town: warningInfo && warningInfo.descripcionMunicipio ? warningInfo.descripcionMunicipio : '',
				street: warningInfo && warningInfo.descripcionCalle ? warningInfo.descripcionCalle : '',
				number: warningInfo && warningInfo.numero ? warningInfo.numero : '',
				postalCode: warningInfo && warningInfo.zipCode ? warningInfo.zipCode : '',
				email: email ? email : '',
				phone: phone ? phone : '',
				observations: remark ? 'CODIGOAGENTE:' + userPT + ' ' + remark + `${(extraInfo && manualChangedCor) ? ' JUSTIFICACION: ' + extraInfo : ''}` : 'CODIGOAGENTE:' + userPT + `${(extraInfo && manualChangedCor) ? ' JUSTIFICACION: ' + extraInfo : ''}`,
				alcance: alcance ? alcance : '',
				tipo: tipo ? tipo : '',
				motivo: motivo ? motivo : '',
				sendSgi: enviar,
				insertHist: 0,
				srCode: '',
				reclamacion: tipo === '4' ? 'Put in service' : '',
				detalleReclamacion: '',
				sistema: warningInfo && warningInfo.sistema ? warningInfo.sistema : '',
				cor: warningInfo && warningInfo.cor ? warningInfo.cor : '',
				fecha: '',
				hora: '',
				nis: '',
				primerApellido: surName1 ? surName1 : '',
				segundoApellido: surName2 ? surName2 : '',
				descripcionCalle: warningInfo && warningInfo.descripcionCalle ? warningInfo.descripcionCalle : '',
				numero: warningInfo && warningInfo.numero ? warningInfo.numero : '',
				duplicador: warningInfo && warningInfo.portal ? warningInfo.portal : '',
				descripcionEntidadSingular: warningInfo && warningInfo.descripcionEntidadSingular ? warningInfo.descripcionEntidadSingular : '',
				descripcionEntidadColectiva: warningInfo && warningInfo.descripcionEntidadColectiva ? warningInfo.descripcionEntidadColectiva : '',
				descripcionMunicipio: warningInfo && warningInfo.descripcionMunicipio ? warningInfo.descripcionMunicipio : '',
				descripcionProvincia: warningInfo && warningInfo.descripcionProvincia ? warningInfo.descripcionProvincia : '',
				cgh: warningInfo && warningInfo.cgh ? warningInfo.cgh : '',
				cgv: warningInfo && warningInfo.cgv ? warningInfo.cgv : '',
				tipoVia: warningInfo && warningInfo.tipoVia ? warningInfo.tipoVia : '',
				//Estos vacios no los tenemos
				nivelTensionSuministro: '',
				suministroImportante: warningInfo && warningInfo.importancia ? warningInfo.importancia : '',
				tipoSuministroImportante: calculateImportance(),
				instalacionBdi: '',
				alimentadorSgc: '',
				potenciaSuministro: warningInfo && warningInfo.potenciaSuministro ? warningInfo.potenciaSuministro : '',
				marcaEquipoContador: warningInfo && warningInfo.marcaEquipoContador ? warningInfo.marcaEquipoContador : '',
				numeroAparatoContador: warningInfo && warningInfo.numeroAparatoContador ? warningInfo.numeroAparatoContador : '',
				cortable: warningInfo && warningInfo.cortable ? warningInfo.cortable : '',
				mtvoNoCortable: warningInfo && warningInfo.mtvoNoCortable ? warningInfo.mtvoNoCortable : '',
				direccion: direccion
			}

			dispatch(thunkNoticeSgi(dataSgi, (responseSGI) => {
				setRespuestaSgi(responseSGI);
				if (responseSGI && responseSGI.result && responseSGI.result.codResult && responseSGI.result.codResult == '0000') {
					doCreateServiceRequest(data, responseSGI, prevision, tipo, hasToSendCor);
				} else {
					setIsIncidenceCreating(false)
				}
				//hay respuesta
				// Si no hay que enviar al SGI o bien el SGI ha respondido OK, enviamos la SR a Zeus.

			}));
		}

		if (!(enviarSgi || hasToSendCor)) {
			setDataClosedBy(data);
			setRespuestaSgi(null)
			doCreateServiceRequest(data, respuestaSgi, prevision, tipo, hasToSendCor);
		}

		// LCS: Lanzamos el evento - Wave 2
		sendGAEvent({
			event: 'create_malfunction_report',
			user_id: sessionStorage.getItem('id'),
			user_type: sessionStorage.getItem('user_type'),
			//user_document: sessionStorage.getItem('userDocumentLogin')
		  });
	}

	const formatAddress = (descripcionMunicipio, descripcionCalle, numero, zipCode, provincia, portal) => {
		return descripcionMunicipio ? descripcionMunicipio : '' +
			descripcionCalle ? descripcionCalle : '' +
				numero ? numero : '' +
					zipCode ? zipCode : '';
		// En esta versión se envía tal cual estaba. En Form si se envía provincia y portal en la desc
	}

	const handleRadioButtonQuestion = (e) => {
		setShowDigitalScript(!showDigitalScript)
	}

	const handleData = (e) => {
		setTempSelectedState(e.target.value)
		switch (e.target.value) {
			case '1':
				setSrCode('0871A02')
				setSrSubCode('0871A0200')
				digitalScript.setSecurityEmergency(1);
				break;
			case '2':
				setSrCode('0871A01')
				setSrSubCode('0871A0102')
				digitalScript.setSecurityEmergency(2);
				break;
			case '3':
				setSrCode('0871A01')
				setSrSubCode('0871A0101')
				digitalScript.setSecurityEmergency(3);
				break;
			case '0':
				digitalScript.setSecurityEmergency(0);
				break;
		}
	}

	const formatText = (text: string): string => {
		return (text.substring(0, 1) + text.substring(1, text.length).toLowerCase())
	}

	const handleSendSeguridad = () => {
		setSeguridad(!sendSeguridad)
		digitalScript.setAnswer(12, !sendSeguridad)
	}

	useEffect(() => {
		let exists = false
		let aux = false
		let diferencialContestada = digitalScript.getAnswer(6) != null;
		let noSaltadoDiferencial = diferencialContestada && !digitalScript.getAnswer(6);
		if (currentQuestion && (currentQuestion.id === 12 || currentQuestion.id === 0)) {
			if (digitalScript.getAnswer(6) === true && digitalScript.getAnswer(7) === false) {
				answerQuestion(currentQuestion, false)
			}
			const q12NotDefault = (digitalScript.isSupplyRestored() || (noSaltadoDiferencial && digitalScript.getMeterStatusSync() === 1))
			for (let i = 0; i < answeredQuestionList.length; i++) {
				if (answeredQuestionList[i].id === 12 || q12NotDefault) {
					exists = true;
				}
			}

			if (!exists) {
				answerQuestion(currentQuestion, true)
			} else if (exists) {
				answerQuestion(currentQuestion, false)
			}
		}
	}, [currentQuestion])

	const [showTooltip, setShowTooltip] = useState(false)

	const ClickInfoButton = () => {
		setShowTooltip(!showTooltip)
	}

	const calcData = () => {
		let type = `${digitalScript.getTipoAviso()}`;
		let alcance = `${digitalScript.getAlcance()}`;
		let motivo = `${digitalScript.getMotivo()}`;
		let sr = ''
		let COR = false
		setType(type);
		setAlcance(alcance);
		setMotivo(motivo);
		let motiveSetAtEnd = false;
		for (let i = 0; i < answeredQuestionList.length; i++) {
			if (answeredQuestionList[i].id === 1 && answeredQuestionList[i].answer) {
				if (supply.notCuttableMotive === '01 - ESENCIAL POR ELECTRODEPENDECIA' || supply.notCuttableMotive === '01 - ESENCIAL POR ELECTRODEPENDENCIA' || supply.notCuttableMotive === '02 - ESENCIAL POR REAL DECRETO') {
					motiveSetAtEnd = true;
					setMotivo(motivo)
				}
				if (tempSelectedState === '1') {
					sr = 'SR 0871A02'
				} else {
					sr = 'SR 0871A01'
					COR = tempSelectedState === '2'
				}
			} else {
				// setAlcance('2')
				if (answeredQuestionList[i].id === 7 && answeredQuestionList[i].answer) {
					motiveSetAtEnd = true;
				}
			}
		}
		if (motiveSetAtEnd) {
			setMotivo(motivo);
		}
		let temporalSendCor = digitalScript.getCalculatedHasToSendCor();
	}
	const ClickPriorityInfo = () => {
		setShowPriorityTooltip(!showPriorityTooltip)
	}

	const getErrorCORMessageText = () => {
		switch (digitalScript.getCORpetitionError()) {
			case '2001':
				return 'error2001.Text1'
			case '2002':
				return 'error2002.Text1'
			case '2003':
				return 'error2003.Text1'
			case '2004':
				return 'error2004.Text1'
			case '2005':
				return 'error2005.Text1'
		}
	}

	const TooltipGet = () => {
		return (
			<Tooltip placement='bottom'>
				<div>
					<span>
						<b>
							{t('averias.digitalScriptQuestions.security_tooltip.emergency')}:
						</b>
					</span>
					<ul>
						<li>
							{t('averias.digitalScriptQuestions.security_tooltip.pt_1_1')}
						</li>
						<li>
							{t('averias.digitalScriptQuestions.security_tooltip.pt_1_2')}
						</li>
					</ul>
					<span>
						<b>
							{t('averias.digitalScriptQuestions.security_tooltip.COR')}:
						</b>
					</span>
					<ul>
						<li>
							{t('averias.digitalScriptQuestions.security_tooltip.pt_2_1')}
						</li>
					</ul>
					<span>
						<b>
							{t('averias.digitalScriptQuestions.security_tooltip.NoCor')}:
						</b>
					</span>
					<ul>
						<li>
							{t('averias.digitalScriptQuestions.security_tooltip.pt_3_1')}
						</li>
						<li>
							{t('averias.digitalScriptQuestions.security_tooltip.pt_3_2')}
						</li>
						<li>
							{t('averias.digitalScriptQuestions.security_tooltip.pt_3_3')}
						</li>
						<li>
							{t('averias.digitalScriptQuestions.security_tooltip.pt_3_4')}
						</li>
						<li>
							{t('averias.digitalScriptQuestions.security_tooltip.pt_3_5')}
						</li>
						<li>
							{t('averias.digitalScriptQuestions.security_tooltip.pt_3_6')}
						</li>
						<li>
							{t('averias.digitalScriptQuestions.security_tooltip.pt_3_7')}
						</li>
					</ul>
				</div>
			</Tooltip>
		)
	}

	const toggle = () => {
		// setShowModal(!showModal)
		setManualChangedCor(true)
	}

	const toggle_no = () => {
		setShowModal(!showModal)
		setManualChangedCor(!manualChangedCor)
		answerQuestion(questionModal, false)
	}

	const BtnDisabled = () => {
		if (((digitalScript.getIsFlujoFinal()) && (!nameError) && (emailError === false) && (phone !== '' && phoneError === false) && !surname1Error && remark !== '') && ((priority !== '2' && digitalScript.getCalculatedHasToSendCor()) || (priority === '2' && !digitalScript.getCalculatedHasToSendCor())) && ((manualChangedCor === true && extraInfo?.trim() !== '') || (manualChangedCor === false))) {
			return false
		} else {
			return true
		}
	}

	const getMotivoFromList = (motivo) => {
		for (let i = 0; i < motiveList.length; i++) {
			if (motiveList[i].includes(motivo)) {
				return motiveList[i];
			}
		}
		return motivo;
	}

	function getRemarkText() {
		const DNI = sessionStorage.getItem('DNIAveria')
		const CUPS = sessionStorage.getItem('CUPSAveria')
		if (DNI === supply?.holderDocumentNumber && CUPS === supply.cups) {
			return props?.remarkParent
		} else {
			return ''
		}
	}

	const getTextAreaText = () => {
		if (remark?.trim() !== '') {
			return remark
		} else {
			return ''
		}
	}

	return (
		<>
			{
				(isRequestLoading || isIncidenceCreating) &&
				<Spinner fixed={true} />
			}
			<Modales isOpne={showModal} toggle={toggle}>
				<div className={classes.modalesContainer}>
					"¿Estas seguro de que quieres cambiar el flujo actual y enviar un aviso? Por favor, justifica la razoón del envio de este aviso"
					<Grid item>
						<Grid container justifyContent='space-around'>
							<Button
								// className={classes_.button}
								text={t('errors.date.button.yes')}
								color='primary'
								size='large'
								variant='contained'
								onClick={toggle}
							/>

							<Button
								// className={classes_.button}
								text={t('errors.date.button.no')}
								color='primary'
								size='large'
								variant='contained'
								onClick={toggle_no}
							/>
						</Grid>
					</Grid>
				</div>
			</Modales>
			<DialogContent className={classes.modalContainer}>
				<Grid container className={classes.block}>
					<Grid container justifyContent='flex-end'>
						<TextButton className={classes.closeButton} onClick={handleCloseDialog}>
							<img src={CloseIcon} alt='' />
						</TextButton>
					</Grid>
					<Grid item className={classes.headerTitle}>
						{t('averias.management.searchCups.comprovacionesSuministro.requestModal.title')}
					</Grid>
					<Grid container md={12} sm={12} xs={12} className={classes.innerArea} >
						<Grid container direction='row' md={12}>
							<Grid container direction='row' justifyContent='flex-end' md={3}>
								<Grid><img className={classes.icon} src={consumoTotal} alt='' /></Grid>
								<Grid>
									<Grid className={classes.innerDescriptionText}>{t('averias.management.searchCups.comprovacionesSuministro.consumo')}</Grid>
								</Grid>
							</Grid>
							<Grid md={6} className={classes.innerPointInformation}>{supply.cups}</Grid>
						</Grid>
						<Grid container direction='row' md={12}>
							<Grid container direction='row' justifyContent='flex-end' md={3}>
								<Grid className={classes.innerDescriptionText}>{t('averias.management.searchCups.comprovacionesSuministro.direccion')}</Grid>
							</Grid>
							<Grid md={6} className={classes.innerPointInformation}>{address[0]}</Grid>
						</Grid>
						<Grid container direction='row' md={12}>
							<Grid container direction='row' justifyContent='flex-end' md={3}>
								<Grid className={classes.innerDescriptionText} />
							</Grid>
							<Grid md={6} className={classes.innerPointInformation}>{address[1]}</Grid>
						</Grid>
						<Grid container direction='row' md={12}>
							<Grid container direction='row' justifyContent='flex-end' md={3}>
								<Grid item className={classes.innerDescriptionText}>{t('averias.management.searchCups.comprovacionesSuministro.titular')}</Grid>
							</Grid>
							<Grid item className={classes.innerPointInformation}>{supply.holderName}</Grid>
						</Grid>
						<Grid container direction='row' md={12}>
							<Grid container direction='row' justifyContent='flex-end' md={3}>
								<Grid item className={classes.innerDescriptionText}>{t('averias.management.searchCups.comprovacionesSuministro.docIdentificador')}</Grid>
							</Grid>
							<Grid item className={classes.innerPointInformation}>{supply?.holderDocumentNumber ? supply?.holderDocumentNumber : ''}</Grid>
						</Grid>
					</Grid>
					<Grid className={classes.inputsContainer}>
						<div className={classes.wrapperTitle}>
							<span>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.contactData')}</span>
						</div>
						<Grid container>
							<Grid container md={4} xs={12} sm={6} className={classes.contactDataCont}>
								<Grid container md={10}>
									<span className={classes.inputTitle}>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.name')}</span>
									<Input
										className={classes.inputFull}
										onChange={(e) => handleChangeInput('name', e.target.value)}
										error={nameError}
										defaultValue={defaultNameCalculate()}
									/>
									{nameError ? (
										<span className={classes.credentialError}>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.mandatory')}</span>
									) : (
										<span className={classes.credentialError} style={{ color: 'transparent' }}>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.mandatory')}</span>
									)}
								</Grid>
							</Grid>
							<Grid container md={4} xs={12} sm={6} className={classes.contactDataCont}>
								<Grid container md={10}>
									<span className={classes.inputTitle}>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.firstSurname')}</span>
									<Input
										className={classes.inputFull}
										onChange={(e) => handleChangeInput('surname1', e.target.value)}
										error={surname1Error}
										defaultValue={defaultSurName1Calculate()}
									/>
									{surname1Error ? (
										<span className={classes.credentialError}>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.mandatory')}</span>
									) : (
										<span className={classes.credentialError} style={{ color: 'transparent' }}>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.mandatory')}</span>
									)}
								</Grid>
							</Grid>
							<Grid container md={4} xs={12} sm={6} className={classes.contactDataCont}>
								<Grid container md={10}>
									<span className={classes.inputTitle}>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.secondSurname')}</span>
									<Input
										className={classes.inputFull}
										onChange={(e) => handleChangeInput('surname2', e.target.value)}
										defaultValue={defaultSurName2Calculate()}
									/>
									{surname2Error ? (
										<span className={classes.credentialError}>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.mandatory')}</span>
									) : (
										<span className={classes.credentialError} style={{ color: 'transparent' }}>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.mandatory')}</span>
									)}
								</Grid>
							</Grid>
							<Grid container md={4} xs={12} sm={6} className={classes.contactDataCont}>
								<Grid container md={10}>
									<span className={classes.inputTitle}>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.email')}</span>
									<Input
										className={classes.inputFull}
										onChange={(e) => handleChangeInput('email', e.target.value)}
										error={emailError}
										defaultValue={supply.holderContactEmail ? supply.holderContactEmail : ''}
									/>
									<span className={classes.credentialError} style={{ color: 'transparent' }}>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.mandatory')}</span>
								</Grid>
							</Grid>
							<Grid container md={4} xs={12} sm={6} className={classes.contactDataCont}>
								<Grid container md={10}>
									<span className={classes.inputTitle}>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.phone')}</span>
									<Input
										className={classes.inputFull}
										onChange={(e) => handleChangeInput('phone', e.target.value)}
										error={phoneError}
										defaultValue={supply.holderContactPhone ? supply.holderContactPhone : ''}
									/>
									{phoneError ? (
										<span className={classes.credentialError}>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.mandatory')}</span>
									) : (
										<span className={classes.credentialError} style={{ color: 'transparent' }}>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.mandatory')}</span>
									)}
								</Grid>
							</Grid>
						</Grid>
					</Grid>
					<Grid container className={classes.textArea}>
						<TextArea value={getTextAreaText()} label={t('averias.management.searchCups.comprovacionesSuministro.requestModal.observations')} handleOnChange={setRemark} error={observationsError} />
						{observationsError ? (
							<span className={classes.credentialError}>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.mandatory')}</span>
						) : (
							<span className={classes.credentialError} style={{ color: 'transparent' }}>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.mandatory')}</span>
						)}
					</Grid>

					{!showDigitalScript &&
						<>
							{digitalScript.getReason() !== 'serviceDown' &&
								<Grid container md={12} sm={12} xs={12} className={classes.innerArea4}>
									{/* ANSWERED QUESTIONS */}
									{answeredQuestionList.map((q, index) =>
										<>
											{q.id == 0 ? '' : (
												<>
													<Grid container direction='row' md={12} key={q.id} className={`${classes.questionContainer} ${(mobileRes || tabletRes) && 'mobile'}`} style={{ display: `${(currentQuestion.extraInfo_1 || currentQuestion.extraInfo_2) ? 'flex' : ''}`, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
														<Grid container direction='column' md={9} xs={12} >
															{q.id === 1 ? (
																<>
																	<span className={classes.textoAveria}>
																		<div className={classes.div}>
																			{t(q.text.toString())}
																		</div>
																		<img src={InfoIcon} alt='' onClick={ClickInfoButton} style={{ width: '19.5px' }} />
																	</span>

																</>
															) : (
																q.id === 15 ? (
																	<span className={classes.textoAveria} style={{ height: '100%' }}>
																		<div className={classes.div}>
																			{t(q.text.toString())}
																			{q.text_2 ? (
																				<>
																					<br />
																					{t(q.text_2.toString())}
																				</>
																			) : ''}
																			{(q.extraInfo_1 || q.extraInfo_2) && (
																				<ul>
																					{(q?.extraInfo_1) && (
																						<li>
																							{t(q?.extraInfo_1?.toString())}
																						</li>
																					)}

																					{(q?.extraInfo_2) && (
																						<li>
																							{t(q?.extraInfo_2?.toString())}
																						</li>
																					)}
																				</ul>
																			)}
																			{q.text_bold ? (
																				<>
																					<b style={{ color: 'red' }}>{t(q.text_bold.toString())}</b>
																					?
																				</>
																			) : ''}
																		</div>
																		<img src={InfoIcon} alt='' onClick={ClickInfoButton} style={{ width: '19.5px' }} />
																	</span>
																) : (
																	<span className={classes.textoAveria} style={{ height: '100%' }}>
																		{/* <div className={classes.div}> */}
																		<div className={classes.div} style={((q.text_2 || '').length + (q.extraInfo_1 || '').length + (q.extraInfo_2 || '').length + (q.text_bold || '').length) > 30 ? { marginBottom: 13 } : {}}>

																			{t(q.text.toString())}
																			{q.text_2 ? (
																				<>
																					<br />
																					{t(q.text_2.toString())}
																				</>
																			) : ''}
																			{(q.extraInfo_1 || q.extraInfo_2) && (
																				<ul>
																					{(q?.extraInfo_1) && (
																						<li>
																							{t(q?.extraInfo_1?.toString())}
																						</li>
																					)}

																					{(q?.extraInfo_2) && (
																						<li>
																							{t(q?.extraInfo_2?.toString())}
																						</li>
																					)}
																				</ul>
																			)}
																			{q.text_bold ? (
																				<>
																					<b style={{ color: 'red' }}>{t(q.text_bold.toString())}</b>
																					?
																				</>
																			) : ''}
																		</div>
																	</span>
																)
															)}
														</Grid>
														<Grid container direction='row' justifyContent='space-around' md={3} xs={12} className={(mobileRes || tabletRes) && classes.buttonsCont}>
															{((q.id === 7 || q.id === 12) && q.disabled) ? (
																<>
																	{q.answer ? (
																		<>
																			<Button
																				text={t('common.buttons.yes')}
																				color={'primary'}
																				size={'small'}
																				variant={'contained'}
																				onClick={() => answerQuestion(q, true)}
																				className={classes.btnQuestionsPosit}
																				img={Check}
																				style={{ width: '90px' }}
																			/>
																			<Button
																				text={t('common.buttons.no')}
																				color={'primary'}
																				size={'small'}
																				variant={'outlined'}
																				onClick={() => answerQuestion(q, false)}
																				disabled={true}
																				className={classes.btnQuestions}
																				style={{ width: '90px' }}
																			/>
																		</>
																	) : (
																		<>
																			<Button
																				text={t('common.buttons.yes')}
																				color={'primary'}
																				size={'small'}
																				variant={'outlined'}
																				onClick={() => answerQuestion(q, true)}
																				disabled={true}
																				className={classes.btnQuestions}
																				style={{ width: '90px' }}
																			/>
																			<Button
																				text={t('common.buttons.no')}
																				color={'primary'}
																				size={'small'}
																				variant={'contained'}
																				onClick={() => answerQuestion(q, false)}
																				className={classes.btnQuestionsPosit}
																				img={Check}
																				style={{ width: '90px' }}
																			// disabled={true}
																			/>
																		</>
																	)}
																</>
															) : (q.id === 12 && manualChangedCor && q.answer === true) ? (
																<>
																	<Button
																		text={t('common.buttons.yes')}
																		// color={'primary'}
																		size={'small'}
																		variant='text'
																		// variant={(q.answer) ? 'contained' : 'outlined'}
																		onClick={() => answerQuestion(q, true)}
																		className={`${classes.btnRed} ${classes.btnQuestionsPosit}`}
																		img={Check}
																		style={{ width: '90px' }}
																	/>
																	<Button
																		text={t('common.buttons.no')}
																		color={'primary'}
																		size={'small'}
																		variant={(!q.answer) ? 'contained' : 'outlined'}
																		onClick={() => answerQuestion(q, false)}
																		className={classes.btnQuestions}
																		style={{ width: '90px' }}
																	// disabled={isDisabled()}
																	/>
																</>
															) : (
																<>
																	<Button
																		text={t('common.buttons.yes')}
																		color={'primary'}
																		size={'small'}
																		// variant='text'
																		variant={(q.answer) ? 'contained' : 'outlined'}
																		onClick={() => answerQuestion(q, true)}
																		className={q.answer ? classes.btnQuestionsPosit : classes.btnQuestions}
																		img={q.answer ? Check : ''}
																		style={{ width: '90px' }}
																	// className={classes.btnRed}
																	/>
																	<Button
																		text={t('common.buttons.no')}
																		color={'primary'}
																		size={'small'}
																		variant={(!q.answer) ? 'contained' : 'outlined'}
																		onClick={() => answerQuestion(q, false)}
																		className={q.answer ? classes.btnQuestions : classes.btnQuestionsPosit}
																		img={q.answer ? '' : Check}
																		style={{ width: '90px' }}
																	// disabled={isDisabled()}
																	/>
																</>
															)}
														</Grid>
														{showTooltip && (q.id === 1 || q.id === 15) ? (
															TooltipGet()
														) : ''}
														{((q.id === 1 || q.id === 15) && q.answer) && (
															<Grid container spacing={3} className={classes.radioButtonText}>
																<RadioGroup onChange={(e) => handleData(e)}>
																	<Grid item>
																		<FormControlLabel value={'1'} control={<Radio color='primary' />} label={t('averias.management.incidence.insertContactData.emergency')} />
																		<FormControlLabel value={'3'} control={<Radio color='primary' />} label={t('averias.management.incidence.insertContactData.securityWithCor')} />
																		<FormControlLabel value={'2'} control={<Radio color='primary' />} label={t('averias.management.incidence.insertContactData.securityWithoutCor')} />
																	</Grid>
																</RadioGroup>
															</Grid>
														)}
													</Grid>
													<Grid className={`separator_1 ${classes.separator}`} />

												</>
											)}
											{q.id == 12 && manualChangedCor &&
												<>
													<div className={classes.extraInfo}>
														<div className={classes.extraInfo_2}>
															<img src={AlertIcon2} alt='Alert icon' className={classes.warningIcon} />
															<div className={classes.textoAveria} style={{ textAlign: 'center' }}>
																{t('changeCOR')}
															</div>
														</div>

														<Grid container className={classes.textArea}>
															<TextArea label={t('justifyChange')} value={extraInfo} handleOnChange={setExtraInfo} />

															<p className={classes.right}>{t('rest_char')}  {restChar} de {maxChar}</p>
														</Grid>
													</div>
													<Grid className={`separator_1 ${classes.separator}`} />

												</>}

										</>


									)}
									{/* QUESTION 1 */}
									{(currentQuestion != null && currentQuestion.id === 1) &&
										<>
											<Grid container direction='row' md={12} className={`${classes.questionContainer} ${(mobileRes || tabletRes) && 'mobile'}`}>
												<Grid container direction='column' md={9} xs={12}>
													<span className={classes.textoAveria}>
														<div className={classes.div}>
															{t(currentQuestion.text.toString())}
														</div>
														<img src={InfoIcon} alt='' onClick={ClickInfoButton} style={{ width: '19.5px' }} />
													</span>
												</Grid>
												<Grid container direction='row' justifyContent='space-around' md={3} className={(mobileRes || tabletRes) && classes.buttonsCont}>
													<Button
														text={t('common.buttons.yes')}
														color={'primary'}
														size={'medium'}
														variant={'outlined'}
														onClick={() => answerQuestion(currentQuestion, true)}
														className={classes.btnQuestions}
														style={{ width: '90px' }}
													/>
													<Button
														text={t('common.buttons.no')}
														color={'primary'}
														size={'medium'}
														variant={'outlined'}
														onClick={() => answerQuestion(currentQuestion, false)}
														className={classes.btnQuestions}
														style={{ width: '90px' }}
													/>
												</Grid>
											</Grid>
											{!showTooltip && (
												<Grid className={`separator_2 ${classes.separator}`} />
											)}
										</>
									}

									{/* CURRENT QUESTION */}
									{(currentQuestion != null && currentQuestion.id !== 0 && currentQuestion.id !== 1 && currentQuestion.id !== 12) &&
										<>
											<Grid container direction='row' md={12} className={`${classes.questionContainer} ${(mobileRes || tabletRes) && 'mobile'}`} style={{ display: `${(currentQuestion.extraInfo_1 || currentQuestion.extraInfo_2) ? 'flex' : ''}`, flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
												<Grid container direction='column' md={9} xs={12}>
													<span className={classes.textoAveria} style={{ display: 'block', height: '100%' }}>
														{t(currentQuestion.text.toString())}
														{currentQuestion.text_2 ? (
															<>
																<br />

																{t(currentQuestion.text_2.toString())}
															</>
														) : ''}
														{(currentQuestion.extraInfo_1 || currentQuestion.extraInfo_2) && (
															<ul>
																{(currentQuestion?.extraInfo_1) && (
																	<li>
																		{t(currentQuestion?.extraInfo_1?.toString())}
																	</li>
																)}

																{(currentQuestion?.extraInfo_2) && (
																	<li>
																		{t(currentQuestion?.extraInfo_2?.toString())}
																	</li>
																)}
															</ul>
														)}
														{currentQuestion.text_bold ? (
															<>
																<b style={{ color: 'red' }}>{t(currentQuestion.text_bold.toString())}</b>
																?
															</>
														) : ''}
														{currentQuestion.id === 15 && (
															<img src={InfoIcon} alt='' onClick={ClickInfoButton} className={classes.infoIcon15} />
														)}
													</span>
												</Grid>
												<Grid container direction='row' justifyContent='space-around' md={3} className={(mobileRes || tabletRes) && classes.buttonsCont}>
													<Button
														className={classes.btnQuestions}
														text={t('common.buttons.yes')}
														color={'primary'}
														size={'medium'}
														variant={'outlined'}
														onClick={() => answerQuestion(currentQuestion, true)}
														style={{ width: '90px' }}
													/>
													<Button
														className={classes.btnQuestions}
														text={t('common.buttons.no')}
														color={'primary'}
														size={'medium'}
														variant={'outlined'}
														onClick={() => answerQuestion(currentQuestion, false)}
														disabled={disabled}
														style={{ width: '90px' }}
													/>
												</Grid>
											</Grid>
											<Grid className={`separator_3 ${classes.separator}`} />
										</>
									}
									{showTooltip && (currentQuestion.id === 1 || currentQuestion.id === 15) ? (
										TooltipGet()
									) : ''}
									{/* ANSWERED QUESTIONS */}

									{(corFlag) &&
										<>
											{mobileRes || tabletRes ? (
												<>
													<Grid container direction='row' md={12} className={`${classes.questionContainer} ${'mobile'}`}>
														<Grid container direction='column' md={9} xs={12}>
															<span className={classes.textoAveria}>
																<div className={classes.div}>
																	{t('averias.management.searchCups.comprovacionesSuministro.requestModal.questions.priorityText')}
																</div>
															</span>
														</Grid>
														<Grid container direction='column' md={9} xs={12}>
															<span className={classes.textoAveria}>
																<span onClick={ClickPriorityInfo}>
																	<img src={InfoIcon} alt='' />
																	{showPriorityTooltip ?
																		<div className={classes.linkDiv}>
																			{t('averias.management.searchCups.comprovacionesSuministro.requestModal.questions.priorityToolTipClose')}
																		</div>
																		:
																		<div className={classes.linkDiv}>
																			{t('averias.management.searchCups.comprovacionesSuministro.requestModal.questions.priorityToolTip')}
																		</div>
																	}
																	{showPriorityTooltip ?
																		<img src={ArrowUp} alt='' className={classes.ArrowIcon} />
																		:
																		<img src={ArrowDown} alt='' className={classes.ArrowIcon} />
																	}
																</span>
															</span>
														</Grid>
														{showPriorityTooltip &&
															<Tooltip placement='bottom'>
																<div>
																	<span >
																		{t('averias.management.searchCups.comprovacionesSuministro.requestModal.questions.priorityInfo')}
																	</span>
																</div>
															</Tooltip>
														}
														<Grid container direction='row' justifyContent='space-around' md={3} xs={12} className={classes.buttonsCont}>
															<Button
																className={priority === '1' ? classes.btnQuestionsPosit : classes.btnQuestions}
																text={t('common.buttons.yes')}
																color={'primary'}
																size={'small'}
																variant={(priority === '1') ? 'contained' : 'outlined'}
																onClick={() => setPriority('1')}
																img={priority === '1' ? Check : ''}
																style={{ width: '90px' }}
															/>
															<Button
																className={(priority === '0' ? classes.btnQuestionsPosit : classes.btnQuestions)}
																text={t('common.buttons.no')}
																color={'primary'}
																size={'small'}
																variant={(priority === '0') ? 'contained' : 'outlined'}
																onClick={() => setPriority('0')}
																img={priority === '0' ? Check : ''}
																style={{ width: '90px' }}
															/>
														</Grid>
													</Grid>
													<Grid className={`separator_4 ${classes.separator}`} />
												</>
											) : (
												<>
													<Grid container direction='row' md={12} className={`${classes.questionContainer}`}>
														<Grid container direction='column' md={9} xs={12}>
															<span className={classes.textoAveria}>
																<div className={classes.div}>
																	{t('averias.management.searchCups.comprovacionesSuministro.requestModal.questions.priorityText')}
																</div>
															</span>
														</Grid>
														<Grid container direction='row' justifyContent='space-around' md={3} xs={12}>
															<Button
																text={t('common.buttons.yes')}
																color={'primary'}
																size={'small'}
																variant={(priority === '1') ? 'contained' : 'outlined'}
																onClick={() => setPriority('1')}
																className={priority === '1' ? classes.btnQuestionsPosit : classes.btnQuestions}
																img={priority === '1' ? Check : ''}
																style={{ width: '90px' }}
															/>
															<Button
																text={t('common.buttons.no')}
																color={'primary'}
																size={'small'}
																variant={(priority === '0') ? 'contained' : 'outlined'}
																onClick={() => setPriority('0')}
																className={priority === '0' ? classes.btnQuestionsPosit : classes.btnQuestions}
																img={priority === '0' ? Check : ''}
																style={{ width: '90px' }}
															/>
														</Grid>
														<Grid container direction='column' md={9} xs={12}>
															<span className={classes.textoAveria}>
																<span className={`${classes.priorityHover} ${'notMobile'}`} onClick={ClickPriorityInfo}>
																	<img className={`${classes.priorityIcon} ${'notMobile'}`} src={InfoIcon} alt='' />
																	{showPriorityTooltip ?
																		<div className={`${classes.linkDiv} ${'notMobile'}`}>
																			{t('averias.management.searchCups.comprovacionesSuministro.requestModal.questions.priorityToolTipClose')}
																		</div>
																		:
																		<div className={`${classes.linkDiv} ${'notMobile'}`}>
																			{t('averias.management.searchCups.comprovacionesSuministro.requestModal.questions.priorityToolTip')}
																		</div>
																	}

																	{showPriorityTooltip ?
																		<img src={ArrowUp} alt='' className={classes.ArrowIcon} />
																		:
																		<img src={ArrowDown} alt='' className={classes.ArrowIcon} />
																	}
																</span>
															</span>
														</Grid>
														{showPriorityTooltip &&
															<Tooltip className={classes.priorityText} placement='bottom'>
																<div>
																	<span >
																		{t('averias.management.searchCups.comprovacionesSuministro.requestModal.questions.priorityInfo')}
																	</span>
																</div>
															</Tooltip>
														}
													</Grid>
													<Grid className={`separator_5 ${classes.separator}`} />
												</>
											)}
										</>
									}

									{/* QUESTION COR */}
									{/* {(currentQuestion != null && currentQuestion.id === 12) &&
										<Grid container direction='row' md={12} className={`${classes.questionContainer} ${(mobileRes || tabletRes) && 'mobile'}`}>
											<Grid container direction='column' md={9} xs={12}>
												<span className={classes.textoAveria}>
													{t(currentQuestion.text.toString())}
												</span>
											</Grid>
											<Grid container direction='row' justifyContent='space-around' md={3} className={(mobileRes || tabletRes) && classes.buttonsCont}>
												<Button
													text={t('common.buttons.yes')}
													// color={'primary'}
													style={{background_color: 'red'}}
													size={'medium'}
													variant={'outlined'}
													onClick={() => answerQuestion(currentQuestion, true)}
													
												/>
												<Button
													text={t('common.buttons.no')}
													color={'primary'}
													size={'medium'}
													variant={'outlined'}
													onClick={() => answerQuestion(currentQuestion, false)}
													disabled={isBloqued}
												/>
											</Grid>
										</Grid>
									} */}
									{/* SEND TO SGI */}
								</Grid>
							}
						</>
					}
					{error1001 && (
						<div className={classes.errorGrid} style={{ position: 'relative' }}>
							<img src={AlertIcon2} style={{ width: '32px' }} />
							<div>
								<p>
									{t('error1001.Text1')}
								</p>
								<p>
									{t('error1001.Text2')}
								</p>
								<p>
									{t('error1001.Text3')}
								</p>
							</div>
							<div>
								<img src={CloseIcon} className={classes.closeButton} alt='' onClick={() => setError1001(false)} style={{ position: 'absolute', top: 15, right: '25px', cursor: 'pointer', width: '1%' }} />
							</div>
						</div>
					)}
					{error2001 && (
						<div className={classes.errorGrid} style={{ position: 'relative' }}>
							<img src={AlertIcon2} style={{ width: '32px' }} />
							<div>
								<p>
									{t(getErrorCORMessageText())}
								</p>
							</div>
							<div>
								<img src={CloseIcon} className={classes.closeButton} alt='' onClick={() => setError2001(false)} style={{ position: 'absolute', top: 15, right: '25px', cursor: 'pointer', width: '1%' }} />
							</div>
						</div>
					)}

					{(digitalScript.getIsFlujoFinal()) &&
						<>
							{(true) &&
								<div style={{ width: '99%' }}>
									<div className={`${classes.innerArea3}`}>
										<h4 style={{ color: '#004571' }}>Resultado de la atención</h4>
										<Resume
											type={`${typeList[parseInt(type) - 1] ? typeList[parseInt(type) - 1] : ''}`}
											alcance={`${scopeList[parseInt(alcance) - 1]}`}
											motivo={getMotivoFromList(digitalScript.getMotivo())}
											SR={`${srCode !== '' ? srCode : digitalScript.getSrCode() ? digitalScript.getSrCode() : digitalScript.getTipoSR()}`}
											type_={alcance}
											status={(data_aux && data_aux.tipology && closedSRTipo.includes(data_aux.tipology)) ? 'CERRADO' : 'ABIERTO'}
											substatus={`${digitalScript.getSrSubString()}`}
											code={''}
											avisoAlCor={() => digitalScript.getCalculatedHasToSendCor()}
										/>
									</div>
									{errorShow && (
										<ErrorMessageContainer>
											<img src={AlertIcon} alt='Alert icon' style={{ width: '32px' }} />
											<div>
												<p style={{ color: '#004471' }}>{t(errorMessage)}</p>
											</div>
											<img src={CloseIcon} onClick={() => setShowError(!errorShow)} />
										</ErrorMessageContainer>
									)}
								</div>
							}
						</>
					}
					<div className={classes.requiredFields}>
						<span>{t('averias.management.incidence.insertContactData.requiredFields')}</span>
					</div>
					<DialogActions>
						<Grid container direction='row' justifyContent='center' spacing={3}>
							<Grid item>
								<Button
									className={classes.cancelButton}
									text={t('common.buttons.close')}
									color='inherit'
									size='large'
									variant='contained'
									onClick={handleCloseDialog}
								/>
							</Grid>
							<Grid item>
								<Button
									className={classes.button}
									// text={t(buttonText)}
									text={digitalScript.getCalculatedHasToSendCor() ? t('averias.management.searchCups.comprovacionesSuministro.requestModal.finalizeRequest.cor') : t('averias.management.searchCups.comprovacionesSuministro.requestModal.finalizeRequest.no_cor')}
									color='primary'
									size='large'
									variant='contained'
									onClick={createFailureNotice}
									disabled={BtnDisabled()}
								/>
							</Grid>
						</Grid>
					</DialogActions>
				</Grid>
			</DialogContent>

			<EndReiterationModal isErrorModalVisible={endReiteration} closeDialog={setEndReiteration} />
			<OsCutModal isErrorModalVisible={osCutModal} closeDialog={setOsCutModal} />
		</>
	);
}

export default SupplyPointPanel2;
