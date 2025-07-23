import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { Grid, RadioGroup, FormControlLabel, useMediaQuery } from '@material-ui/core';
import LocationModal from '../location-modal/LocationModal'
import Button from '../../../../../common/components/button/Button'
import Input from '../../../../../common/components/input/Input'
import useStyles from './Form.styles'
import { showError } from '../../../../../common/store/actions/ErrorActions'
import TextArea from '../../../../../common/components/textarea/TextArea'
import { push } from 'connected-react-router'
import { thunkCreateNewRequest, thunkNoticeSgi } from '../../../../../requests/store/actions/RequestsThunkActions'
import { validateMail, validatePhoneNumber } from '../../../../../common/lib/ValidationLib'
import { Redirect } from 'react-router-dom'

import WhiteInfoIcon from '../../../../../assets/icons/ico_info.svg'
import Check from '../../../../../assets/icons/Interfaz_22_check_tick_preguntas.svg'
import { thunkGetListAddresses, thunkGetListZipCodes } from '../../../../actions/GestionAveriasThunkActions'
import SystemErrorModal from './systemErrorModal/SystemErrorModal'
import { useStreetNames, iStreetName } from '../../searchCups/hooks/useStreetNames'
import { useIndividualEntities } from '../../searchCups/hooks/useIndividualEntities'
import { useCollectiveEntities } from '../../searchCups/hooks/useGroupEntities'
import DigitalScriptService, { Question } from '../../../../services/DigitalScriptService2'
import Tooltip from '../../../../../common/components/tooltip/Tooltip'

import Radio from '@material-ui/core/Radio';

import InputWithTitle from '../../searchCups/components/Duplicator/Duplicator';
import Modales from '../../../../../supplies/supplies-details/components/consumption/charts/filters/error-message/Modales';
import BusquedaExtra from '../../searchCups/components/BusquedaExtra/BusquedaExtra';
import { SearchByAddress, iAddressFormData } from '../../searchCups/components/SearchByAddress/SearchByAddress';
import { iTown } from '../../searchCups/hooks/useTowns';
import { CustomSelect } from '../../searchCups/components/Select/CustomSelect';
import { iProvince } from '../../searchCups/hooks/useProvinces';
import { AlertMessage } from '../../common/Alert';

// LCS: Import de la función - Wave 2
import { sendGAEvent } from '../../../../../core/utils/gtm';

const Form = (props: any) => {

	const {
		user,
		supply,
		cooldownTry,
		cooldownRetry,
		maxRetries,
		maxTry,
		closedSRTipo,
		typeList,
		scopeList,
		motiveList,
		provinces,
		getProvinces,
		resetRetriesProvinces,
		loadingProvinces,
		errorTowns,
		getTowns,
		setParametersTowns,
		resetRetriesTowns,
		loadingTowns,
		towns,
		setProvinceCodeTowns,
		setInformedTownsExternal,
		setTownNameExternal,
		clearTowns,
		errorProvinces
	} = props

	const tabletRes = useMediaQuery('(max-width:768px)')
	const mobileRes = useMediaQuery('(max-width:576px)')

	const styles = useStyles({});
	const classes = useStyles({})
	const dispatch = useDispatch();
	const { t } = useTranslation();

	const userPT = useSelector((state: any) => state.admin.profile.documentNumber);
	const userPTName = useSelector((state: any) => state.admin.profile.name);
	const userPTSurname = useSelector((state: any) => state.admin.profile.surName);
	const [closedOnCreationSRs, setClosedOnCreationSRs] = useState([])

	const [isLocationModalVisible, setIsLocationModalVisible] = useState<boolean>(false);

	const [stateList, setStateList] = useState([] as any)
	const [selectedState, setSelectedState] = useState(0)

	// const [statesList, setStatesList] = useState([] as any)
	// const [townsList, setTownsList] = useState([] as any)
	const [tracksList, setTracksList] = useState([] as any)

	const [noticeCor, setNoticeCor] = useState<boolean>(false)
	const [addressSwitch, setAddressSwitch] = useState<boolean>(true)
	const [urgentSwitch, setUrgentSwitch] = useState<boolean>(true)

	const [noResults, setNoResults] = useState<boolean>(false)

	const [tempSelectedState, setTempSelectedState] = useState(0)

	const [disableButton, setDisableButton] = useState<boolean>(true)
	const [SRprocessing, setSRprocessing] = useState<boolean>(false)

	// Form inputs
	const [name, setName] = useState<string>('');
	const [surname1, setSurname1] = useState<string>('');
	const [surname2, setSurname2] = useState<string>('');
	const [email, setEmail] = useState<string>('');
	const [telephone, setTelephone] = useState<string>('');
	const [province, setProvince] = useState<string>('');
	const [provinceCode, setProvinceCode] = useState<string>('')
	const [town, setTown] = useState<string>('');
	const [townCode, setTownCode] = useState<string>('');
	const [remark, setRemark] = useState<string>('');

	const [zipCode, setZipCode] = useState<string>('')
	const [zipCodesList, setZipCodesList] = useState([] as any)

	const [colEntity, setColEntity] = useState<string>('')

	const [indEntity, setIndEntity] = useState<string>('')

	const [resetStreet, setResetStreet] = useState<boolean>(false)
	const [resetTown, setResetTown] = useState<boolean>(false)
	const [streetId, setStreetId] = useState<string>('')
	const [streetType, setStreetType] = useState<string>('');
	const [streetName, setStreetName] = useState<string>('');
	const [streetNamePlain, setStreetNamePlain] = useState<string>('');
	const [number, setNumber] = useState<string>('');
	const [stair, setStair] = useState<string>('');
	const [floor, setFloor] = useState<string>('');
	const [door, setDoor] = useState<string>('');
	const [address, setAddress] = useState<string>('');
	const [cghId, setCghId] = useState<string>('');
	const [cgvId, setCgvId] = useState<string>('');
	const [descripcionEntidadSingular, setDescripcionEntidadSingular] = useState<string>('');
	const [descripcionEntidadColectiva, setDescripcionEntidadColectiva] = useState<string>('');
	const [portal, setPortal] = useState<string>('');
	const [duplicator, setDuplicator] = useState<string>('')

	const [showButton, setShowButton] = useState(true)
	const [phoneError, setPhoneError] = useState(false)
	const [emailError, setEmailError] = useState(false)

	const [candidatesList, setCandidatesList] = useState([] as any)

	const [systemErrorDialogOpen, setSystemErrorDialogOpen] = useState(false)

	// Datos SGI
	const [sendSgi, setSendSgi] = useState<boolean>(false)
	const [sendSeguridad, setSeguridad] = useState<boolean>(null)
	const [sgiType, setSgiType] = useState('')
	const [sgiScope, setSgiScope] = useState('')
	const [urgencia, setUrgencia] = useState('')
	const [sgiTypeDisabled, setSgiTypeDisabled] = useState<boolean>(false)
	const [sgiScopeDisabled, setSgiScopeDisabled] = useState<boolean>(false)
	const [srCode, setSrCode] = useState('')
	const [srSubCode, setSrSubCode] = useState('')
	const [isBloqued, setIsBloqued] = useState<boolean>(false)
	const [type, setType] = useState('')
	const [alcance, setAlcance] = useState('')
	const [motivo, setMotivo] = useState('')

	const [manualChangedCor, setManualChangedCor] = useState(false)

	const [streetNameInformed, setStreetNameInformed] = useState(false)
	const [singularEntityInformed, setSingularEntityInformed] = useState(false)
	const { streetNames, errorStreetNames, loadingStreetNames, getStreetNames, setParametersStreetNames, setCodesListStreets, resetRetriesStreetNames, setGroupEntityParam, setSingularEntityParam, clearStreets } = useStreetNames({ provinceCode: provinceCode, streetName: streetName, streetType: streetType, townCode: townCode, groupEntityName: colEntity, singularEntityName: indEntity })
	const { errorIndividualEntities, getIndividualEntities, setParametersIndividualEntities, resetRetriesIE, individualEntities, loadingIdividualEntities } = useIndividualEntities(provinceCode, townCode, indEntity, colEntity, singularEntityInformed)
	const { collectiveEntities, errorCollectiveEntities, getCollectiveEntities, setParametersGroupEntities, resetRetriesGE, loadingCollectiveEntities } = useCollectiveEntities(provinceCode, townCode, colEntity, singularEntityInformed)
	const [showTooltip, setShowTooltip] = useState(false)
	const [answeredQuestionList, setAnsweredQuestionList] = useState<Question[]>([]);
	const [showDigitalScript, setShowDigitalScript] = useState<boolean>(false)
	const [currentQuestion, setCurrentQuestion] = useState<Question>(null);
	const [reRender, setRerender] = useState<boolean>(false);
	const [modalOpen, setModalOpen] = useState<boolean>(false)

	const [priority, setPriority] = useState('2')

	const [isSecurityProblem, setIsSecurityProblem] = useState<boolean>()

	const [showPriorityTooltip, setShowPriorityTooltip] = useState(false)

	const [digitalScript] = useState<DigitalScriptService>(new DigitalScriptService(props.user, props.supply, 'datos_contacto'));

	const [errorCode, setErrorCode] = useState<string>('')
	const [errorService, setErrorService] = useState<string>('')
	const [numTry, setNumTry] = useState(0)
	const [shouldReset, setShouldReset] = useState(false)
	const [addressData, setAddressData] = useState<iAddressFormData>({ colEntity: null, indEntity: null, province: null, streetName: null, town: null })
	const [dataFromAdvance, setDataFromAdvance] = useState<iStreetName | undefined>(undefined)
	// const [readOnlyProvince, setReadOnlyProvince] = useState<iProvince | null>(null)
	// const [readOnlyTown, setReadOnlyTown] = useState<iTown | null>(null)
	const [selectedProvince, setSelectedProvince] = useState<iProvince | null>(null)
	const [selectedTown, setSelectedTown] = useState<iTown | null>(null)


	const [selectedInmueble, setSelectedInmueble] = useState(null)

	const getFirstQuestion = async () => {
		setCurrentQuestion(await digitalScript.getQuestion(null));
	}

	const togle = () => {
		setModalOpen(!modalOpen)
	}

	useEffect(() => {
		// simula los seteos antiguos cuando hay un onSelect 
		if (addressData.province) {
			setProvince(addressData.province.provinceName)
			setProvinceCode(addressData.province.provinceCode)
			setTown('')
			setTownCode('')
		} else {
			setProvince('')
			setProvinceCode('')
		}
		if (addressData.town) {
			setTown(addressData.town.municipalityName)
			setTownCode(addressData.town.municipalityCode)
		} else {
			setTown('')
			setTownCode('')
		}
		if (addressData.colEntity) {
			setColEntity(addressData.colEntity.entityName)
			setIndEntity('')
		} else {
			setColEntity('')
		}
		if (addressData.indEntity) {
			setIndEntity(addressData.indEntity.entityName)
		} else {
			setIndEntity('')
		}
		if (addressData.streetName) {
			setStreetName(addressData.streetName.streetName)
			setStreetId(addressData.streetName.idStreet)
			setStreetType(addressData.streetName.streetType)
			setZipCode(addressData.streetName.zipCode)
		} else {
			setStreetType('')
			setZipCode('')
			setStreetName('')
			setStreetId('')
		}
	}, [addressData])

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
		if (province && !loadingProvinces) {
			handleProvinceCodeChanged();
		}
		if ((!props.provinces || (props.provinces && props.provinces.length === 0)) && !props.loadingProvinces) {
			props.getProvinces();
		}
	}, [province])

	useEffect(() => {
		setCodesListStreets(provinceCode, townCode)
	}, [provinceCode, townCode]);

	useEffect(() => {
		setParametersGroupEntities(props.cooldownTry, props.cooldownRetry, props.maxRetries);
		setParametersIndividualEntities(props.cooldownTry, props.cooldownRetry, props.maxRetries);
		setParametersTowns(props.cooldownTry, props.cooldownRetry, props.maxRetries);
		setParametersStreetNames(props.cooldownTry, props.cooldownRetry, props.maxRetries);
		setClosedOnCreationSRs(props.closedSRTipo);
	}, [props.cooldownTry, props.cooldownRetry, props.maxRetries, props.closedSRTipo])

	useEffect(() => {
		if (selectedProvince) {
			setProvince(selectedProvince.provinceName)
			setProvinceCode(selectedProvince.provinceCode)
			getTowns(selectedProvince.provinceCode, '')
		} else {
			setProvince('')
			setProvinceCode('')
		}
	}, [selectedProvince])

	useEffect(() => {
		if (selectedTown) {
			setTown(selectedTown.municipalityName)
			setTownCode(selectedTown.municipalityCode)
		} else {
			setTown('')
			setTownCode('')
		}
	}, [selectedTown])

	const handleChangeInput = (input, value): any => {
		if (input === 'zipcode') {
			// zipcode
			setZipCode(value);
			//en caso que la longitud del valor introducido sea X
			if (value.length === 3) {
				dispatch(thunkGetListZipCodes(value, '', '', (response) => {
					if (response && response.zipCodes && response.zipCodes.items && response.zipCodes.items.length > 0) {
						let zipCodesListAux = []
						response.zipCodes.items.map((item) => {
							zipCodesListAux.push(item.zipCode)
						})
						setZipCodesList(zipCodesListAux)
					}
				}));
			} else if (value.length === 5) {
				//una vez se ha selecciónado el valor, borramos la lista e informamos municipio y provincia 
				dispatch(thunkGetListZipCodes(value, '', '', (response) => {
					if (response && response.zipCodes && response.zipCodes.items && response.zipCodes.items.length > 0) {
						setProvinceCode(response.zipCodes.items[0].provinceCode)
						setTown(response.zipCodes.items[0].items[0].municipalityName)
						setZipCodesList([])
					}
				}));
			}
		} else if (input === 'state') {
			handleProvinceCodeChanged()
			setProvince(value)

		} else if (input === 'town') {
			// municipio
			if (value == t('averias.management.searchCups.address.select')) {
				setTown('')
			}
			else {
				setTown(value)
				setTownCode(towns.find(townElement => townElement.municipalityName.toLowerCase().includes(value.toLowerCase()))?.municipalityCode || '')
			}
		} else if (input === 'streetType') {
			// tipo de via
			if (value == t('averias.management.searchCups.address.select')) {
				setStreetType('')
			}
			else {
				setStreetType(value)
			}
		} else if (input === 'streetName') {
			// nombre de via
			setStreetName(value)
		} else if (input === 'number') {
			// numero
			setNumber(value)
		} else if (input === 'stair') {
			// numero
			setStair(value)
		} else if (input === 'floor') {
			// numero
			setFloor(value)
		} else if (input === 'door') {
			// numero
			setDoor(value)
		} else if (input === 'colectiveEntity') {
			if (value == t('averias.management.searchCups.address.select')) {
				setColEntity('')
			}
			else {
				setColEntity(value)
			}
		} else if (input === 'individualEntity') {
			if (value == t('averias.management.searchCups.address.select')) {
				setIndEntity('')
			}
			else {
				setIndEntity(value)
			}
		} else if (input === 'duplicator') {
			setDuplicator(value)
		}
	}

	const handleChangeProvince = (provinceValue) => {
		handleChangeTown(null)
		resetRetriesProvinces()

		setSelectedProvince(provinceValue)
	}

	const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

	const handleChangeTown = async (townValue) => {
		clearStreets()
		setResetTown(true)

		await sleep(50);

		setTown('')
		setColEntity('')
		setIndEntity('')
		setTown('')
		setType('')
		setStreetName('')
		setStreetType('')
		setZipCode('')
		setNumber('')
		setDuplicator('')
		setStair('')
		setFloor('')
		setDoor('')
		setZipCode('')
		setStreetType('')
		setStreetNamePlain('')
		resetRetriesGE()
		resetRetriesIE()
		//resetRetriesProvinces()
		resetRetriesStreetNames()
		resetRetriesTowns()
		//setShouldReset(true)
		setSelectedTown(townValue)
		setResetTown(false)
	}

	const handleProvinceCodeChanged = () => {
		const okProvince = provinces.find(provinceFromList => provinceFromList.provinceName === province)
		if (okProvince && (okProvince.provinceCode != provinceCode || towns.length <= 0)) {
			setProvinceCodeTowns(okProvince.provinceCode)
			setProvinceCode(okProvince.provinceCode)
		}
	}

	const handleCloseLocationDialog = () => {
		setIsLocationModalVisible(false)
	}

	const handleAcceptLocationDialog = (key) => {
		const selected = stateList[key]
		setSelectedInmueble(selected)

		setStair(selected.stair || '')
		setFloor(selected.floor || '')
		setDoor(selected.door || '')
		setDuplicator(selected.portal || '')
		setPortal(selected.portal || '')
		setNumber(selected.addNumber || '')
		setAddress(selected.address)
		//setStreetType(selected.searchType)
		setCghId(selected.cghId)
		setCgvId(selected.cgvId)
		setZipCode(selected.zipCode)
		setDescripcionEntidadSingular(selected.singleEntity)
		setDescripcionEntidadColectiva(selected.groupEntity)
		setIsLocationModalVisible(false)
	}

	const handleSearchButton = () => {
		dispatch(thunkGetListAddresses(streetId, number, '', (response) => {
			if (response && response.streets && response.streets.items && response.streets.items.length > 0) {
				setStateList(response.streets.items)
				setIsLocationModalVisible(true)
				setNoResults(false)
			} else {
				setNoResults(true)
			}
		}));
	}

	const corSwitchHandler = () => {
		if (addressSwitch === false) {
			addressSwitchHandler()
		}
		setNoticeCor(!noticeCor)
	}

	const addressSwitchHandler = () => {
		setAddressSwitch(!addressSwitch)
	}

	const urgentSwitchHandler = () => {
		setUrgentSwitch(!urgentSwitch)
	}

	const data_aux = {
		tipology: srCode !== '' ? srCode : digitalScript.getTipoSR(),
	} as any;

	const addPaddingZeroes = (numeroCalle: string) => {
		let numCallePadded = numeroCalle;
		for (let i = numeroCalle.length; i < 4; i++) {
			numCallePadded = '0' + numCallePadded;
		}
		return numCallePadded;
	}

	const postSRCreation = (respuestaZeus, prevision, tipo, hasToSendCor, data): void => {
		let errorMessage = ''
		if (errorCode !== '' || errorService !== '') {
			errorMessage = 'errors.' + errorService;
			if (errorCode !== '') {
				errorMessage = errorMessage + '.' + errorCode;
			}
		}
		if (!respuestaZeus) {
			setErrorCode('2001')
			setErrorService('SR')
		} else {
			//No hay error en el mensaje
			if (errorCode === '' && errorService === '') {
				let return_ = {
					code: respuestaZeus.codigoSR,
					remark: remark,
					previsionDateTime: prevision,
					errorMessage: errorMessage,
					esAviso: true,
					esIncidencia: false,
					province: province,
					cups: '',
					fullAdress: address,
					titular: '',
					contactPerson: (name ? name : '') + (surname1 ? (name ? ' ' : '') + surname1 : '') + (surname2 ? (name ? ' ' : '') + surname2 : ''),
					doc: '',
					type: tipo,
					typeList: typeList,
					alcance: alcance,
					alcanceList: scopeList,
					motivoList: motiveList,
					scope: null,
					phone: telephone,
					SR: digitalScript.getTipoSR(),
					motivo: motivo,
					type_: alcance,
					status: (data_aux && data_aux.tipology && closedOnCreationSRs.includes(data_aux.tipology)) ? 'CERRADO' : 'ABIERTO',
					substatus: `${digitalScript.getSrSubString()}`,
					existAveria: digitalScript.getHasAveria() ? digitalScript.getHasAveria() : false,
					existIncidence: digitalScript.getHasIncidence() ? digitalScript.getHasIncidence() : false,
					hasCOR: true,
					type3: (digitalScript.getTipoAveria() === '3') ? true : false,
					data: data,
					showRetry: false,
					msg: respuestaZeus.observaciones,
				}

				if (hasToSendCor) {
					return_.scope = alcance;
				}

				if (respuestaZeus?.result?.codResult === '2001') {
					return_.showRetry = true
				}

				dispatch(push('/gestionAverias/resultPage', return_));
			}

			setSRprocessing(false);
		}
	}

	const setDataClosedBy = (data): void => {
		const CheckClosedTipology = (data) => {
			// Verificar
			return data && data.tipology && closedOnCreationSRs.includes(data.tipology);
		}

		if (CheckClosedTipology(data)) {
			data.closedByCode = userPT
			data.closedBy = userPTSurname + ', ' + userPTName
		}
	}

	const redirectResultPage = (): void => {

		setSRprocessing(true);

		const tipology = digitalScript.getTipoSR();
		setSrCode(tipology);
		const subtipology = digitalScript.getSrSub();
		const notification = digitalScript.getSgiNotification();

		let tipoNumber = digitalScript.getTipoAviso();
		let alcanceNumber = digitalScript.getAlcance();
		let motivo = digitalScript.getMotivo();
		let hasToSendCor = digitalScript.getCalculatedHasToSendCor();

		setErrorCode('')
		setErrorService('')

		const direccion = formatAddressZeus(town, ((streetNamePlain != null && streetNamePlain !== '') ? streetNamePlain : streetName), number, zipCode, province, door, portal)

		const mustSendDireccionObs = (selectedInmueble === null || (selectedInmueble !== null && checkSelectedInmueble()))

		let dataSgi = {
			document: '',
			name: name,
			surname: surname1,
			cups: '',
			province: province,
			town: town,
			street: (streetName ? streetName : address ? address : direccion),
			number: (number ? number : ''),
			postalCode: zipCode,
			email: email,
			phone: telephone,
			observations: `CODIGOAGENTE:${userPT} ${remark} ${mustSendDireccionObs ? `${direccion} ` : ''}`,
			alcance: alcanceNumber,
			tipo: tipoNumber,
			motivo: motivo ? motivo : '',
			sendSgi: (!noticeCor) ? 1 : 0,
			insertHist: 1,
			srCode: '',
			reclamacion: 'Put in service',
			detalleReclamacion: '',
			sistema: '',
			cor: province === 'GALICIA' ? 'C' : 'N',
			fecha: '',
			hora: '',
			nis: '',
			primerApellido: surname1,
			segundoApellido: surname2,
			descripcionCalle: (streetName ? streetName : address ? address : direccion),
			numero: (number ? number : ''),
			duplicador: (portal ? portal : ''),
			descripcionEntidadSingular: (descripcionEntidadSingular ? descripcionEntidadSingular : indEntity ? indEntity : ''),
			descripcionEntidadColectiva: (descripcionEntidadColectiva ? descripcionEntidadColectiva : colEntity ? colEntity : ''),
			descripcionMunicipio: town,
			descripcionProvincia: province,
			cgh: cghId,
			cgv: cgvId,
			tipoVia: streetType,
			//No los tenemos en este punto
			nivelTensionSuministro: '',
			suministroImportante: '',
			tipoSuministroImportante: '',
			instalacionBdi: '',
			alimentadorSgc: '',
			potenciaSuministro: '',
			marcaEquipoContador: '',
			numeroAparatoContador: '',
			cortable: '',
			mtvoNoCortable: '',
			direccion: direccion
		}

		const data = {
			documentType: 'NIF',
			documentNumber: 'GENERICO',
			name: name,
			surName1: surname1,
			email: email,
			landline: telephone,
			cellphone: '',
			tipology: tipology,
			subtipology: subtipology,
			cups: '',
			dossierNumber: '',
			//TODO ver si tenemos que enviar o no dichos campos (sube o no)
			channel: '10003',
			createdByCode: userPT,
			createdBy: userPTSurname + ', ' + userPTName,
			savedByCode: userPT,
			savedBy: userPTSurname + ', ' + userPTName,
			closedByCode: '',
			closedBy: '',
			province: provinceCode,
			comment: remark + ' CodigoAgente:' + userPT + (mustSendDireccionObs ? direccion + ' ' : ''),
			documents: [{
				url: '',
				idDocumentum: '',
				nombreArchivo: '',
				format: '',
				documentType: '',
				documentState: ''
			}]
		} as any;


		let respuestaSgi = null;
		let respuestaZeus = null;

		let prevision = ''
		let response = {
			codigoSR: ''
		}

		if (hasToSendCor) {

			dispatch(thunkNoticeSgi(dataSgi, (response2) => {
				respuestaSgi = response2;
				if (respuestaSgi && respuestaSgi.result && respuestaSgi.result.codResult && respuestaSgi.result.codResult == '0000') {
					setDataClosedBy(data);
					dispatch(thunkCreateNewRequest(data, (response) => {
						respuestaZeus = response;
						postSRCreation(respuestaZeus, prevision, tipoNumber, hasToSendCor, data);
					}))
				} else if (respuestaSgi && respuestaSgi.result && respuestaSgi.result.codResult && respuestaSgi.result.codResult == '2001') {
					if (parseInt(maxTry) >= numTry) {
						setNumTry(numTry + 1)
						redirectResultPage()
					}
					else {
						setNumTry(0)
					}
				}
				//hay respuesta
				// Si no hay que enviar al SGI o bien el SGI ha respondido OK, enviamos la SR a Zeus.

			}));
		}

		if (!hasToSendCor) {
			setDataClosedBy(data);
			dispatch(thunkCreateNewRequest(data, (response) => {
				respuestaZeus = response;
				postSRCreation(respuestaZeus, prevision, tipoNumber, hasToSendCor, data);
			}))
		}

		let errorsSGIOrZeus = false;
		if (respuestaSgi && respuestaSgi.result.codResult !== '0000') {
			errorsSGIOrZeus = true;
			setErrorCode('')
			setErrorService('XXX')
			//mostramos dialog de error
			setSystemErrorDialogOpen(true);
			if (respuestaSgi && respuestaSgi.sgiCodResult !== '' && respuestaSgi.sgiCodResult !== '1003') {
				setErrorCode(respuestaSgi.sgiCodResult)
				setErrorService('sgi')
			}
		}
		if (!errorsSGIOrZeus) {
			if (respuestaZeus && respuestaZeus.result) {
				setSystemErrorDialogOpen(true);
				setErrorCode('')
				setErrorService('XXX')
				if (respuestaZeus.result.codResult !== '2001') {
					setErrorCode(respuestaZeus.result.codResult)
					setErrorService('SR')
				}
			}
			if (respuestaZeus && respuestaSgi && respuestaZeus.codigoSR) {
				respuestaSgi.codigoSR = respuestaZeus.codigoSR
			}
		}

		if (respuestaSgi && respuestaSgi.previsionDateTime && respuestaSgi.previsionDateTime !== '') {
			errorsSGIOrZeus = true;
			//formatear
			prevision = respuestaSgi.previsionDateTime;
			prevision = prevision.substr(0, 10)
		}
		if (errorService !== '') {
			dispatch(showError(errorCode, errorService))
		}
		// Controlar si hay error de nuestra API.

		// LCS: Lanzamos el evento - Wave 2
		sendGAEvent({
			event: 'create_incident_report',
			user_id: sessionStorage.getItem('id'),
			user_type: sessionStorage.getItem('user_type'),
			//user_document: sessionStorage.getItem('userDocumentLogin')
		});
	}

	const resetFilters = () => {
		setName('')
		setSurname1('')
		setSurname2('')
		setEmail('')
		setTelephone('')
		setProvince('')
		setTown('')
		setColEntity('')
		setIndEntity('')
		setTown('')
		setType('')
		setStreetName('')
		setStreetType('')
		setZipCode('')
		setNumber('')
		setDuplicator('')
		setStair('')
		setFloor('')
		setDoor('')
		setZipCode('')
		setStreetType('')
		setStreetNamePlain('')
		resetRetriesGE()
		resetRetriesIE()
		resetRetriesProvinces()
		resetRetriesStreetNames()
		resetRetriesTowns()
		setShouldReset(true)
		setSelectedProvince(null)
		setSelectedTown(null)

	}

	useEffect(() => {
		if (name !== '' && surname1 !== '' && telephone !== '' && province !== '' && town !== '' && remark !== '') {
			if (addressSwitch === false) {
				if (streetType !== '' && streetName !== '') {
					setDisableButton(false);
				} else {
					setDisableButton(true);
				}
			} else {
				setDisableButton(false);
			}
		} else {
			setDisableButton(true);
		}
	}, [name, surname1, telephone, province, town, remark, addressSwitch, streetType, streetName]);

	useEffect(() => {
		if (telephone !== '' && validatePhoneNumber(telephone)) {
			setPhoneError(false)
		} else {
			if (telephone !== '') {
				setPhoneError(true)
			} else {
				setPhoneError(false)
			}
		}
	}, [telephone])

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

	// useEffect(() => {
	// 	if ( streetName !== '' && province !== '' && town !== '') {
	// 		setShowButton(false)
	// 	} else {
	// 		setShowButton(true)
	// 	}
	// }, [  streetName, province, town])

	const handleCancel = () => {
		return <Redirect to='/profile' />
	}

	const closeFunction = () => {
		setSystemErrorDialogOpen(false)
	}

	const ClickInfoButton = () => {
		setShowTooltip(!showTooltip)
	}

	const doReRender = (): void => {
		setRerender(!reRender);
	}

	// Función para responder las preguntas del script digital
	const answerQuestion = async (question: Question, answer: boolean): Promise<void> => {

		if (question.id === 1 && !answer) {
			digitalScript.setSecurityEmergency(0)
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
			answeredQuestionList.push(question);

			const nextQuestion = await digitalScript.getQuestion(question);

			if (nextQuestion.id === 7) {
				answerQuestion(nextQuestion, nextQuestion.answer);
			} else {
				setCurrentQuestion(nextQuestion);
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
	}

	const formatAddressZeus = (descripcionMunicipio, descripcionCalle, numero, zipCode, provincia, portal, duplicador) => {
		let direccion = descripcionCalle;
		direccion = direccion + (numero ? ', ' + addPaddingZeroes(numero) : '');
		direccion = direccion + (duplicador ? ' ' + duplicador : '');
		direccion = direccion + (portal ? ' ' + portal : '');
		direccion = direccion + (provincia ? ' - ' + provincia : '');
		direccion = direccion + (descripcionMunicipio ? ', ' + descripcionMunicipio : '');
		direccion = direccion + (zipCode ? ' (' + zipCode + ')' : '');
		return direccion;
	}

	const checkSelectedInmueble = () => {
		return selectedInmueble === null ||
			(selectedInmueble !== null && ((selectedInmueble.portal !== portal) || (selectedInmueble.zipCode !== zipCode) || (selectedInmueble.town !== town) || (selectedInmueble.provinceName !== province) || (selectedInmueble.addNumber !== number)))
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
		if (motiveSetAtEnd) {
			setMotivo(motivo);
		}
		let temporalSendCor = digitalScript.getCalculatedHasToSendCor();
	}

	const isNotCor = () => {
	}

	const isCor = () => {
	}

	const TooltipGet = () => {
		return (
			<Tooltip placement='bottom'>
				<div>
					<span>{t('averias.digitalScriptQuestions.security_tooltip.emergency')}</span>
					<ul>
						<li>
							{t('averias.digitalScriptQuestions.security_tooltip.pt_1_1')}
						</li>
						<li>
							{t('averias.digitalScriptQuestions.security_tooltip.pt_1_2')}
						</li>
					</ul>
					<span>
						{t('averias.digitalScriptQuestions.security_tooltip.COR')}
					</span>
					<ul>
						<li>
							{t('averias.digitalScriptQuestions.security_tooltip.pt_2_1')}
						</li>
					</ul>
					<span>
						{t('averias.digitalScriptQuestions.security_tooltip.NoCor')}
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
				setSrCode('');
				setSrSubCode('');
				digitalScript.setSecurityEmergency(0);
				break;
		}
	}

	const ClickPriorityInfo = () => {
		setShowPriorityTooltip(!showPriorityTooltip)
	}

	const handleClick = (obj: iStreetName) => {

		setDataFromAdvance(obj)
		setModalOpen(!modalOpen)
	}

	return (
		<Grid className={styles.containerA}>
			<Grid className={styles.containerB}>
				<Grid container className={styles.inputsArea}>
					<div className={styles.wrapperTitle}>
						<span>{t('averias.management.incidence.insertContactData.contactPerson')}</span>
					</div>
					<Grid container xs={11} sm={10} md={12} spacing={3} style={{ marginTop: 0 }}>
						<Grid item xs={12} sm={3}>
							<span className={styles.inputTitle}>{t('averias.management.incidence.insertContactData.nombre')}</span>
							<Input
								className={styles.input}
								onChange={(e) => setName(e.target.value)}
								value={name}
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<span className={styles.inputTitle}>{t('averias.management.incidence.insertContactData.apellidoUno')}</span>
							<Input
								className={styles.input}
								onChange={(e) => setSurname1(e.target.value)}
								value={surname1}
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<span className={styles.inputTitle}>{t('averias.management.incidence.insertContactData.apellidoDos')}</span>
							<Input
								className={styles.input}
								onChange={(e) => setSurname2(e.target.value)}
								value={surname2}
							/>
						</Grid>
						<Grid item md={3} xs={12} sm={6} />
					</Grid>

					<Grid container xs={11} sm={10} md={12} spacing={3} style={{ marginTop: 0 }}>
						<Grid item xs={12} sm={3}>
							<span className={styles.inputTitle}>{t('averias.management.incidence.insertContactData.mail')}</span>
							<Input
								className={styles.input}
								onChange={(e) => setEmail(e.target.value)}
								showValidationIcon
								error={email !== '' && emailError}
								value={email}
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<span className={styles.inputTitle}>{t('averias.management.incidence.insertContactData.telefono')}</span>
							<Input
								className={styles.input}
								onChange={(e) => setTelephone(e.target.value)}
								showValidationIcon
								error={telephone !== '' && phoneError}
								value={telephone}
							/>
						</Grid>
						<Grid item xs={12} sm={3} />
					</Grid>

					<div className={styles.wrapperTitle}>
						<span>{t('averias.management.incidence.insertContactData.incidenceLocation')}</span>
					</div>
					<Grid container xs={11} sm={10} md={12} spacing={3} style={{ marginTop: 0 }}>
						<Grid item xs={12} sm={3}>
							<span className={styles.inputTitle}>{t('averias.management.incidence.insertContactData.province')}</span>

							<CustomSelect
								placeholder={t('averias.management.incidence.insertContactData.selectProvince')}
								onSelect={(province: { value: iProvince, label: string }) => {
									// setProvince(province.value.provinceName)
									// setProvinceCode(province.value.provinceCode)
									// setReadOnlyProvince(province.value)
									// getTowns(province.value.provinceCode, '')
									handleChangeProvince(province.value)

								}}
								options={provinces.map((province: iProvince) => ({ value: province, label: province.provinceName }))}
								onInputChange={(val) => handleChangeInput('state', val)}
								onClear={() => {
									setSelectedProvince(null)
									setSelectedTown(null)
								}}
								value={selectedProvince ? { value: selectedProvince, label: selectedProvince.provinceName } : null}
								isClearable={false}
								loading={loadingProvinces}
								disabled={loadingProvinces}
								onClick={errorProvinces && getProvinces()}
							/>
						</Grid>



						<Grid item xs={12} sm={3}>
							<span className={styles.inputTitle}>{t('averias.management.incidence.insertContactData.town')}*</span>

							<CustomSelect
								placeholder={t('averias.management.incidence.insertContactData.selectTown')}
								onSelect={(town: { value: iTown, label: string }) => {
									// setTown(town.value.municipalityName)
									// setTownCode(town.value.municipalityCode)
									// setReadOnlyTown(town.value)
									handleChangeTown(town.value)
								}}
								options={towns.map((town: iTown) => ({ value: town, label: town.municipalityName }))}
								onInputChange={(val) => handleChangeInput('town', val)}
								onClear={() => {
									// setTown('')
									// setTownCode('')
									setSelectedTown(null)
								}}
								value={selectedTown ? { value: selectedTown, label: selectedTown.municipalityName } : null}
								isClearable={false}
								loading={loadingTowns}
								disabled={loadingTowns || !province}
								onClick={errorTowns && getTowns(provinceCode, '')}
							/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>

			<Grid className={styles.containerB}>
				{!showDigitalScript &&
					<>
						{digitalScript.getReason() !== 'serviceDown' &&
							<Grid container md={12} sm={12} xs={12} className={classes.innerArea4}>
								<Grid container direction='row' md={12} className={`${classes.questionContainer} ${(mobileRes || tabletRes) && 'mobile'}`}>
									<Grid container direction='column' md={9} xs={12}>
										<span className={classes.textoAveria}>
											<div className={classes.div}>
												Crear aviso al COR
											</div>
										</span>
									</Grid>
								</Grid>
								<Grid className={classes.separator} />
								{/* ANSWERED QUESTIONS */}
								{answeredQuestionList.map((q, index) =>
									q.id == 0 ? '' : (
										<>
											<Grid container direction='row' md={12} key={q.id} className={`${classes.questionContainer} ${(mobileRes || tabletRes) && 'mobile'}`}>
												<Grid container direction='column' md={9} xs={12}>
													{q.id === 1 ? (
														<>
															<span className={classes.textoAveria}>
																<div className={classes.div}>
																	{t(q.text.toString())}
																</div>
																<img src={WhiteInfoIcon} alt='' style={{ width: '19.5px' }} onClick={ClickInfoButton} />
															</span>

														</>
													) : (
														<span className={classes.textoAveria}>
															<div className={classes.div}>
																{t(q.text.toString())}
																{q.text_2 ? (
																	<>
																		<br />
																		{t(q.text_2.toString())}
																	</>
																) : ''}
															</div>
														</span>
													)}
												</Grid>
												<Grid container direction='row' justifyContent='space-around' md={3} xs={12} className={(mobileRes || tabletRes) && classes.buttonsCont}>
													{(q.id === 12 && q.disabled) ? (
														<>
															{q.answer ? (
																<>
																	<Button
																		text={t('common.buttons.yes')}
																		color={'primary'}
																		size={'small'}
																		variant={'contained'}
																		onClick={() => answerQuestion(q, true)}
																		className={classes.btnQuestions}
																		img={q.answer ? Check : ''}
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
																		img={q.answer ? '' : Check}
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
																		img={q.answer ? Check : ''}
																		style={{ width: '90px' }}
																	/>
																	<Button
																		text={t('common.buttons.no')}
																		color={'primary'}
																		size={'small'}
																		variant={'contained'}
																		onClick={() => answerQuestion(q, false)}
																		className={classes.btnQuestions}
																		img={q.answer ? '' : Check}
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
																className={`${classes.btnRed} ${classes.btnQuestions}`}
																img={q.answer ? Check : ''}
																style={{ width: '90px' }}
															/>
															<Button
																text={t('common.buttons.no')}
																color={'primary'}
																size={'small'}
																variant={(!q.answer) ? 'contained' : 'outlined'}
																onClick={() => answerQuestion(q, false)}
																className={classes.btnQuestions}
																img={q.answer ? '' : Check}
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
																className={classes.btnQuestions}
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
																className={classes.btnQuestions}
																img={q.answer ? '' : Check}
																style={{ width: '90px' }}
															// disabled={isDisabled()}
															/>
														</>
													)}
												</Grid>
												{showTooltip && q.id === 1 ? (
													TooltipGet()
												) : ''}
												{(q.id === 1 && q.answer) && (
													<Grid container spacing={3} className={classes.radioButtonText}>
														<RadioGroup onChange={(e) => handleData(e)}>
															<Grid item>
																<FormControlLabel value={'1'} control={<Radio color='primary' />} label={t('averias.management.incidence.insertContactData.emergency')} onClick={isNotCor} />
																<FormControlLabel value={'3'} control={<Radio color='primary' />} label={t('averias.management.incidence.insertContactData.securityWithCor')} onClick={isCor} />
																<FormControlLabel value={'2'} control={<Radio color='primary' />} label={t('averias.management.incidence.insertContactData.securityWithoutCor')} onClick={isNotCor} />
															</Grid>
														</RadioGroup>
													</Grid>
												)}
											</Grid>
											<Grid className={classes.separator} />
										</>
									)

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
													<img src={WhiteInfoIcon} alt='' style={{ width: '19.5px' }} onClick={ClickInfoButton} />
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
											{showTooltip ? (
												TooltipGet()
											) : ''}
										</Grid>
										<Grid className={classes.separator} />
									</>
								}
								{/* CURRENT QUESTION */}
								{(currentQuestion != null && currentQuestion.id !== 0 && currentQuestion.id !== 1 && currentQuestion.id !== 12) &&
									<>
										<Grid container direction='row' md={12} className={`${classes.questionContainer} ${(mobileRes || tabletRes) && 'mobile'}`}>
											<Grid container direction='column' md={9} xs={12}>
												<span className={classes.textoAveria}>
													{t(currentQuestion.text.toString())}
													{currentQuestion.text_2 ? (
														<>
															<br />
															{t(currentQuestion.text_2.toString())}
														</>
													) : ''}
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
													style={{ width: '90px' }}
												/>
											</Grid>
										</Grid>
										<Grid className={classes.separator} />
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

				{(digitalScript.whantsInfo() === true) &&
					<>
						<SearchByAddress
							collectiveEntities={collectiveEntities}
							cooldownTry={cooldownTry}
							handleChangeInput={handleChangeInput}
							handleSearchButton={handleSearchButton}
							individualEntities={individualEntities}
							loadingStatesList={props.loadingProvinces}
							loadingTowns={props.loadingTowns}
							number={number}
							statesList={provinces}
							streetNames={streetNames}
							streetType={streetType}
							towns={towns}
							tracksList={tracksList}
							zipCode={zipCode}
							zipCodesList={zipCodesList}
							toggleOpenModal={togle}
							onReset={() => setShouldReset(false)}
							reset={shouldReset}
							onUpdate={(addressData) => setAddressData(addressData)}
							getColectiveEntities={getCollectiveEntities}
							getIndividualEntities={getIndividualEntities}
							loadingCollectiveEntities={loadingCollectiveEntities}
							loadingIndividualEntities={loadingIdividualEntities}
							loadingStreetNames={loadingStreetNames}
							errorCollectiveEntities={errorCollectiveEntities}
							errorIndividualEntities={errorIndividualEntities}
							errorProvinces={errorProvinces}
							errorStreetNames={errorStreetNames}
							errorTowns={errorTowns}
							getProvinces={getProvinces}
							dataFromAdvance={dataFromAdvance}
							colEntity={colEntity}
							getTowns={getTowns}
							indEntity={indEntity}
							province={provinceCode}
							town={town}
							townCode={townCode}
							getStreetNames={getStreetNames}
							streetName={streetName}
							readOnlyProvince={selectedProvince}
							readOnlyTown={selectedTown}
							clearStreets={clearStreets}
							resetTown={resetTown}
							offResetTown={() => setResetTown(false)}
						/>

						<Grid container spacing={3}>
							<InputWithTitle
								duplicator={duplicator}
								title='averias.management.searchCups.address.duplicator'
							/>

							<Grid style={{ width: '15px' }} />

							<InputWithTitle
								duplicator={stair}
								title='averias.management.searchCups.address.stair'
							/>

							<Grid style={{ width: '15px' }} />

							<InputWithTitle
								duplicator={floor}
								title='averias.management.searchCups.address.floor'
							/>

							<Grid style={{ width: '15px' }} />

							<InputWithTitle
								duplicator={door}
								title='averias.management.searchCups.address.door'
							/>
						</Grid>
					</>
				}


				{modalOpen && (
					<Modales isOpne={modalOpen} toggle={togle} scroll={{ overflow: 'hidden scroll' }}>
						<div>
							<div>
								<h1 style={{ fontWeight: 'normal', color: 'rgba(0, 69, 113, 1.0)' }}>
									{t('averias.management.searchCups.BusquedaAvanzada')}
								</h1>
							</div>
							<BusquedaExtra
								handleClick={handleClick}
								toggle={togle}
								province={province}
								provinces={props.provinces}
							/>
						</div>
					</Modales>
				)}

			</Grid>

			{noResults && <AlertMessage onClose={()=>setNoResults(false)} text={t('averias.management.incidence.insertContactData.noResults')}/>
				// <Grid className={styles.containerB}>
				// 	<Grid className={styles.searchResult}>
				// 		<Grid container direction='row'>
				// 			<Grid direction='column'><img src={InfoIcon} className={styles.icon} alt='' /></Grid>
				// 			<Grid direction='column' className={styles.bluetext}>{t('averias.management.incidence.insertContactData.noResults')}</Grid>
				// 			<Grid direction='column'><img src={CloseIcon} className={styles.closeButton} alt='' onClick={() => setNoResults(false)} /></Grid>
				// 		</Grid>
				// 	</Grid>
				// </Grid>
			}

			{(!urgentSwitch) &&
				<Grid className={styles.containerB}>
					<Grid container className={styles.radioButtonsArea} spacing={3}>
						<Grid item>
							<div
								className={`radioButton ${styles.radioButton} ${tempSelectedState === 1 && 'active'}`}
								onClick={() => {
									if (tempSelectedState === 1) {
										setTempSelectedState(0)
									} else {
										setTempSelectedState(1)
									}
								}}
							/>
							<div className={styles.radioButtonText}>{t('averias.management.incidence.insertContactData.emergency')}</div>
						</Grid>
						<Grid item>
							<div
								className={`radioButton ${styles.radioButton} ${tempSelectedState === 2 && 'active'}`}
								onClick={() => {
									if (tempSelectedState === 2) {
										setTempSelectedState(0)
									} else {
										setTempSelectedState(2)
									}
								}}
							/>
							<div className={styles.radioButtonText}>{t('averias.management.incidence.insertContactData.securityWithoutCor')}</div>
						</Grid>
						<Grid item>
							<div
								className={`radioButton ${styles.radioButton} ${tempSelectedState === 3 && 'active'}`}
								onClick={() => {
									if (tempSelectedState === 3) {
										setTempSelectedState(0)
									} else {
										setTempSelectedState(3)
									}
								}}
							/>
							<div className={styles.radioButtonText}>{t('averias.management.incidence.insertContactData.securityWithCor')}</div>
						</Grid>
					</Grid>
				</Grid>
			}

			<Grid className={styles.containerB}>
				<Grid container className={styles.textArea}>
					<TextArea label={t('averias.management.incidence.insertContactData.observations')} handleOnChange={setRemark} />
				</Grid>
			</Grid>

			<div className={styles.requiredFields}>
				<span>{t('averias.management.incidence.insertContactData.requiredFields')}</span>
			</div>

			<Grid container direction='row' justifyContent='center' spacing={3} className={styles.buttonsContainer}>
				<Grid item>
					<Button
						className={styles.finalizeButton}
						text={t('averias.management.searchCups.createFin')}
						color={'primary'}
						size={'large'}
						variant={'contained'}
						onClick={redirectResultPage}
						disabled={(disableButton || emailError || phoneError || SRprocessing) ||
							(digitalScript.getAnswer(1) === null ||
								(digitalScript.getAnswer(1) && digitalScript.getSecurityEmergency() === 0))}
					/>
					<p className={styles.link} onClick={resetFilters}>
						{t('averias.management.searchCups.resetFilters')}
					</p>
				</Grid>

			</Grid>

			<LocationModal
				isLocationModalVisible={isLocationModalVisible}
				closeDialog={handleCloseLocationDialog}
				handleAcceptLocationDialog={handleAcceptLocationDialog}
				stateList={stateList}
				selectedState={selectedState}
				setSelectedState={setSelectedState}
				streetName={streetName}
				number={number}
			/>
			<SystemErrorModal
				open={systemErrorDialogOpen}
				closeFunction={closeFunction}
			/>
		</Grid>
	);
}

export default Form;