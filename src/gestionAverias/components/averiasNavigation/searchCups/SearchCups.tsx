import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchedUser } from '../../../../admin/store/actions/AdminActions'
import { thunkCancelSupplantUser } from '../../../../admin/store/actions/AdminThunkActions'
import { thunkListSuppliesAdmin } from '../../../../supplies/supplies-list/store/actions/SuppliesListThunkActions'
import { validateNIE, validateNIF, validateCIF, checkDocumentTypeInString } from '../../../../common/lib/ValidationLib'
import { thunkGetListZipCodes, thunkGetListMunicipalities, thunkGetListStreets, thunkGetListAddresses, thunkGetListCustomers, thunkGetSupplyCups } from '../../../actions/GestionAveriasThunkActions'
import Grid from '@material-ui/core/Grid'
import useStyles, {
	ExpansionPanel,
	ExpansionPanelSummary,
	StyledExpandMoreIcon,
	ExpansionPanelDetails
} from './SearchCups.styles'
import TechnicalDataIcon from '../../../../assets/icons/filtros.svg'
import AlertIcon from '../../../../assets/icons/aviso_alerta_pop_up.svg'
import ErrorIcon from '../../../../assets/icons/misdocumentos_rechazado.svg'
import UserProfile from '../../../../common/interfaces/UserProfile'
import SupplyPoint from '../../../../common/interfaces/SupplyPoint'
import Input from '../../../../common/components/input/Input'
import Button from '../../../../common/components/button/Button'
import LocationModal from '../incidencia/location-modal/LocationModal'
import Typography from '@material-ui/core/Typography'
import ComprovacionSuministro from './comprovacionSuministro/ComprovacionSuministro'
import ListSupplies from '../searchCups/list/ListSuplies'
import Spinner from '../../../../common/components/spinner/Spinner'
import ListName from './list/ListName'
import Modales from '../../../../supplies/supplies-details/components/consumption/charts/filters/error-message/Modales'
import BusquedaExtra from './components/BusquedaExtra/BusquedaExtra'
import { iStreetName, useStreetNames } from './hooks/useStreetNames'
import { useCollectiveEntities } from './hooks/useGroupEntities'
import { useIndividualEntities } from './hooks/useIndividualEntities'
import CloseButon from '../../../../assets/icons/cerrar.svg'
import UserList from '../../../../common/interfaces/userListInterface'
import { iTown } from './hooks/useTowns'
import { iProvince } from './hooks/useProvinces'
import { SearchByAddress, iAddressFormData } from './components/SearchByAddress/SearchByAddress'
import { AlertMessage } from '../common/Alert'

// LCS: Importa la función - Wave 2
import { sendGAEvent } from '../../../../core/utils/gtm';

interface SearchCupsProps {
	user?: UserProfile;
	tabletRes: boolean;
	mobileRes: boolean;
	cooldownTry: number;
	cooldownRetry: number;
	maxRetries: number;
	maxResultsOptions: string;
	maxTryParam: string;
	closedSRTipo: Array<any>;
	typeListParam: Array<any>;
	scopeListParam: Array<any>;
	motiveListParam: Array<any>;
	autoConsultaContadorParam: boolean;
	enabledStateArray: string[];
	monofReadingTypeIds: string;
	trifaReadingTypeIds: string;
	meterConsultTimeout: string;
	meterRearmTimeout: string;
	provinces: iProvince[];
	errorProvinces: boolean;
	loadingProvinces: boolean;
	errorTowns: boolean;
	getTowns: (province: string, town: string) => Promise<iTown[]>;
	setParametersTowns: any;
	resetRetriesTowns: any;
	loadingTowns: boolean;
	towns: iTown[];
	setProvinceCodeTowns: any;
	setInformedTownsExternal: any;
	setTownNameExternal: any;
	clearTowns: any;
	getProvinces: () => void
}

const SearchCups = (props: SearchCupsProps) => {
	const styles = useStyles({})
	const { t } = useTranslation()
	const dispatch = useDispatch()
	const [isLocationModalVisible, setIsLocationModalVisible] = useState<boolean>(false)
	const [isSFDVisible, setIsSFDVisible] = useState<boolean>(false)
	const [credentialType, setCredentialType] = useState('')
	const [documentNumber, setDocumentNumber] = useState('')
	const [credentialList, setCredentialList] = useState([] as any)
	const adminToken = useSelector((state: any) => state.admin.token)
	const searchedUser = useSelector((state: any) => state.admin.searchedUser)
	const supplies: SupplyPoint[] = useSelector((state: any) => state.supplies)
	const [error, setError] = useState<boolean>(false)
	const [showList, setShowList] = useState<boolean>(false)

	const [showListName, setShowListName] = useState<boolean>(false)
	const [expandedListName, setExpandedListName] = useState<boolean>(false)
	const [showSystemError, setShowSysyemError] = useState<boolean>(false)
	const [isLoadingList, setIsLoadingList] = useState<boolean>(false)
	const [isLoadingListName, setIsLoadingListName] = useState<boolean>(false)
	const [isLoadingSecondSpinner, setIsLoadingSecondSpinner] = useState<boolean>(false)
	const [supplyList, setSupplyList] = useState<SupplyPoint[]>([])
	const [supplantedUser, setSupplantedUser] = useState<UserProfile>()
	const [statesList, setStatesList] = useState<iProvince[]>([])
	const [tracksList, setTracksList] = useState([] as any)
	// Form inputs
	const [name, setName] = useState<string>('')
	const [surname1, setSurname1] = useState<string>('')
	const [surname2, setSurname2] = useState<string>('')
	const [socialReason, setSocialReason] = useState<string>('')
	const [provinceCode, setProvinceCode] = useState<string>('')
	const [town, setTown] = useState<string>('')
	const [townCode, setTownCode] = useState<string>('')
	// const [showButton, setShowButton] = useState(true)
	const [zipCode, setZipCode] = useState<string>('');
	const [zipCodesList, setZipCodesList] = useState([] as any)
	const [streetId, setStreetId] = useState<string>('')
	const [streetType, setStreetType] = useState<string>('')
	const [streetName, setStreetName] = useState<string>('')
	const [number, setNumber] = useState<string>('')
	const [stair, setStair] = useState<string>('')
	const [floor, setFloor] = useState<string>('')
	const [door, setDoor] = useState<string>('')
	const [idAddress, setIdAddress] = useState<string>('')
	const [cghId, setCghId] = useState<string>('')
	const [cgvId, setCgvId] = useState<string>('')
	const [totalPages, setTotalPages] = useState(0)
	const [totalPagesName, setTotalPagesName] = useState(0)
	const [currentPage, setCurrentPage] = useState(0)
	const [itemsPerPage, setItemsPerPage] = useState(20)
	const [candidatesList, setCandidatesList] = useState([] as any)
	const [stateList, setStateList] = useState([] as any[])
	const [selectedState, setSelectedState] = useState(0)
	const [showSupplyPoint, setShowSupplyPoint] = useState(false)
	const [suplyyPoint, setSuplyyPoint] = useState<undefined | SupplyPoint>(undefined)
	const [individualEntity, setIndividualEntity] = useState('')
	// const [individualEntityList, setIndividualEntityList] = useState([] as any)
	const [colectiveEntity, setcolectiveEntity] = useState('')
	// const [colectiveEntityList, setcolectiveEntityList] = useState([] as any)
	const [nameSelected, setNameSelected] = useState('')
	const [supplyListNoRepeat, setSupplyListNoRepeat] = useState<SupplyPoint[]>([])
	const [maxDirections, setMaxDirections] = useState('100')

	// Text areas with messages
	const [noResults, setNoResults] = useState<boolean>(false)
	const [noSuppliesResult, setNoSuppliesResult] = useState<boolean>(false)
	const [moreThanMax, setMoreThanMax] = useState(false)

	const [nameList, setNameList] = useState<UserList>({
		items: []
	})
	const [province, setProvince] = useState('')
	const [stateName, setStateName] = useState('')
	const [warningInfo, setWarningInfo] = useState({
		sistema: '',
		cor: stateName === 'GALICIA' ? 'C' : 'N',
		fecha: '',
		hora: '',
		nis: '',
		primerApellido: surname1,
		segundoApellido: surname2,
		descripcionCalle: '',
		numero: door,
		duplicador: '',
		descripcionEntidadSingular: '',
		descripcionEntidadColectiva: '',
		descripcionMunicipio: town,
		descripcionProvincia: stateName,
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
		zipCode: '',
		portal: '',
		importancia: '',
		osCorte: ''
	});
	const [findByName, setFindByName] = useState(0)
	const [streetNameInformed, setStreetNameInformed] = useState(false)
	const [singularEntityInformed, setSingularEntityInformed] = useState(false)
	const [autoConsultaContadorCompr, setAutoConsultaContadorCompr] = useState(false)
	const [maxTry, setMaxTry] = useState('')
	const [closedSRTipo, setClosedSRTipo] = useState([])
	const [typeList, setTypeList] = useState([])
	const [scopeList, setScopeList] = useState([])
	const [motiveList, setMotiveList] = useState([])

	const supplyVerificationBlockRef = useRef(null);

	// fear not, these hooks are actually good for you
	const { errorStreetNames, getStreetNames, setParametersStreetNames, resetRetriesStreetNames, loadingStreetNames, streetNames, clearStreets, setGroupEntityParam, setSingularEntityParam } = useStreetNames({ provinceCode: provinceCode, townCode: townCode, streetName: streetName, streetType: '', groupEntityName: colectiveEntity, singularEntityName: individualEntity })

	const { errorIndividualEntities, getIndividualEntities, setParametersIndividualEntities, resetRetriesIE, individualEntities, loadingIdividualEntities } = useIndividualEntities(provinceCode, townCode, individualEntity, colectiveEntity, singularEntityInformed)
	const { collectiveEntities, errorCollectiveEntities, getCollectiveEntities, setParametersGroupEntities, resetRetriesGE, loadingCollectiveEntities } = useCollectiveEntities(provinceCode, townCode, colectiveEntity, singularEntityInformed)
	const [duplicator, setDuplicator] = useState('')
	const [shouldReset, setShouldReset] = useState(false)
	const [addressData, setAddressData] = useState<iAddressFormData>({ colEntity: null, indEntity: null, province: null, streetName: null, town: null })
	const [dataFromAdvance, setDataFromAdvance] = useState<undefined | iStreetName>(undefined)

	const [trigger, setTrigger] = useState(false);
	const [shouldFilter, setShouldFilter] = useState(false)

	useEffect(() => {
		// simula los seteos antiguos cuando hay un onSelect 
		if (addressData.province) {
			setProvince(addressData.province.provinceName)
			setStateName(addressData.province.provinceName)
			setProvinceCode(addressData.province.provinceCode)
			setTown('')
			setTownCode('')
		} else {
			setProvince('')
			setProvinceCode('')
			setStateName('')
		}
		if (addressData.town) {
			setTown(addressData.town.municipalityName)
			setTownCode(addressData.town.municipalityCode)
		} else {
			setTown('')
			setTownCode('')
		}
		if (addressData.colEntity) {
			setcolectiveEntity(addressData.colEntity.entityName)
			setIndividualEntity('')
		} else {
			setcolectiveEntity('')
		}
		if (addressData.indEntity) {
			setIndividualEntity(addressData.indEntity.entityName)
		} else {
			setIndividualEntity('')
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

	const newRequests = (): void => {
		setShowList(false)
		setShowListName(false)
		setShowSysyemError(false)
		setSupplyList([])
		dispatch(setSearchedUser({}))
		dispatch(thunkCancelSupplantUser())
	}

	useEffect(() => {
		setParametersGroupEntities(props.cooldownTry, props.cooldownRetry, props.maxRetries);
		setParametersIndividualEntities(props.cooldownTry, props.cooldownRetry, props.maxRetries);
		setParametersStreetNames(props.cooldownTry, props.cooldownRetry, props.maxRetries);
		if (props.maxResultsOptions !== '') {
			setMaxDirections(props.maxResultsOptions)
		}
	}, [props.cooldownTry, props.cooldownRetry, props.maxRetries, props.maxResultsOptions])

	useEffect(() => {
		setMaxTry(props.maxTryParam)
		setTypeList(props.typeListParam)
		setScopeList(props.scopeListParam)
		setMotiveList(props.motiveListParam)
		setClosedSRTipo(props.closedSRTipo)
	}, [props.maxTryParam, props.typeListParam, props.scopeListParam, props.motiveListParam, props.closedSRTipo])

	useEffect(() => {
		setAutoConsultaContadorCompr(props.autoConsultaContadorParam);
	}, [props.autoConsultaContadorParam])

	const handleChangeSearch = (credential?: string, name?: string, surname1?: string, idAddress?: string, listAdd?: string[], newRequest = true): void => {

		setMoreThanMax(false);
		setNoSuppliesResult(false);
		setShowSysyemError(false);
		if (newRequest) {
			newRequests()
			validateCredentials(credential, credentialType);
			if (!error) {
				if (socialReason !== '') {
					surname1 = socialReason;
				}
				if ((name && name !== '') || (surname1 && surname1 !== '') || (surname2 && surname2 !== '') || (credential && credential !== '')) {
					setIsLoadingListName(true);
					dispatch(thunkGetListCustomers(credential?.trim(), name?.trim(), surname1?.trim(), surname2?.trim(), (response) => {
						if (response && response.customers) {
							if (response.customers.items.length === 1 && response.customers.items[0].userType == '0') {
								setNoSuppliesResult(true)
							} else {
								if (response.customers && response.customers.items) {
									setNameList(response.customers)
									setShowListName(true)
									if (response.customers.items.length === 1) {
										setName(response.customerName)
										setSurname1(response.surname1 || '')
										setSurname2(response.surname2 || '')
										setExpandedListName(false)
										setIsLoadingSecondSpinner(true);
										dispatch(thunkGetSupplyCups(credential, '', (resp) => {

											if (resp && resp.supplyPoints && resp.supplyPoints.items) {
												const supplyPoints = resp.supplyPoints.items;
												setSupplyList(supplyPoints);
												setShowList(true)
											}
											setIsLoadingSecondSpinner(false);
										}))
									} else {
										setExpandedListName(true)
									}
								}
							}
						} else {
							if (response?.result?.codResult == '24') {
								setMoreThanMax(true)
							} else {
								setShowSysyemError(true)
							}
						}
						setIsLoadingListName(false);
					}));
				} else if (idAddress !== '') {
					const supplyPointDefaultName = t('averias.management.searchCups.table.defaultName');
					setIsLoadingList(true);
					dispatch(thunkListSuppliesAdmin(supplyPointDefaultName, adminToken, '', idAddress, (response) => {
						if (response && response.supplypoints && response.supplypoints.length > 0) {
							const supplyPoints: SupplyPoint[] = response.supplypoints;
							let docNumber = supplyPoints[0].holderDocumentNumber;
							setDocumentNumber(docNumber);
							setCredentialType(checkDocumentTypeInString(docNumber));
							setSupplyList(supplyPoints);
							setShowList(true)
							// no da errro pero no hay resultados
						} else if (response && !response.supplypoints) {
							setNoSuppliesResult(true);
						}
						// hay error de sistema
						else {
							setShowSysyemError(true);
						}
						setIsLoadingList(false);
					}));
				} else if (listAdd?.length > 0) {
					const supplyPointDefaultName = t('averias.management.searchCups.table.defaultName');
					setIsLoadingList(true);
					dispatch(thunkListSuppliesAdmin(supplyPointDefaultName, adminToken, '', listAdd, (response) => {
						if (response && response.supplypoints && response.supplypoints.length > 0) {
							const supplyPoints: SupplyPoint[] = response.supplypoints;
							setSupplyList(supplyPoints);
							setShowList(true);
							// no da errro pero no hay resultados
						} else if (response && !response.supplypoints) {
							setNoSuppliesResult(true);
						}
						// hay error de sistema
						else {
							setShowSysyemError(true);
						}
						setIsLoadingList(false);
					}));
				}
			}
		} else {
			dispatch(thunkGetSupplyCups(credential, '', (resp) => {
				setSupplyList([])
				setShowSupplyPoint(false)
				if (resp && resp.supplyPoints && resp.supplyPoints.items) {
					const supplyPoints = resp.supplyPoints.items;
					setSupplyList(supplyPoints);
				}
				setShowList(true)
			}))
		}

	}
	const validateCredentials = (value: string, credentialType: string): void => {
		switch (credentialType) {
			case 'NIF':
				value === '' ? setError(false) : setError(!validateNIF(value))
				return
			case 'CIF':
				value === '' ? setError(false) : setError(!validateCIF(value))
				return
			case 'NIE':
				value === '' ? setError(false) : setError(!validateNIE(value))
				return
			default:
				value === '' ? setError(false) : setError(true)
		}
	}
	const supplantUser = (userData: UserProfile, getSupply: boolean): void => {
		setSupplantedUser(userData);
		const userId = userData.userId.toString();
		dispatch(setSearchedUser({}));
		if (getSupply) {
			getSupplies(userData);
		}
	}
	const getSupplies = (userData: UserProfile): void => {
		const supplyPointDefaultName = t('averias.management.searchCups.table.defaultName');
		setIsLoadingList(true);
		//modificar la call para obtener lo susplypoints
		dispatch(thunkListSuppliesAdmin(supplyPointDefaultName, adminToken, userData.documentNumber, '', (response) => {
			if (response && response.supplypoints) {
				const supplyPoints: SupplyPoint[] = response.supplypoints;
				if (stateName === '' && town === '' && zipCode === '' && number === '') {
					setSupplyList(supplyPoints);
				} else {
					let auxList = []
					if (stateName !== '' && town !== '' && zipCode !== '' && number !== '') {
						response.supplypoints.map((item) => {
							if ((item.address.province === stateName) &&
								(item.address.town === town) &&
								(item.address.zipCode === zipCode) &&
								(Number(item.address.number) === Number(number))) {
								auxList.push(item);
							}
						})
					} else if (stateName !== '' && town !== '' && zipCode !== '' && number === '') {
						response.supplypoints.map((item) => {
							if ((item.address.province === stateName) &&
								(item.address.town === town) &&
								(item.address.zipCode === zipCode)) {
								auxList.push(item);
							}
						})
					} else {
						response.supplypoints.map((item) => {
							if ((item.address.province === stateName) ||
								(item.address.town === town) ||
								(item.address.zipCode === zipCode) ||
								(Number(item.address.number) === Number(number))) {
								auxList.push(item);
							}
						})
					}
					setSupplyList(auxList);
				}
				setShowList(true);
				setIsLoadingList(false);
				/*
				## Tienes que poder escrivir en
				-> Singular entity
				-> Colective entity
				-> Poblacion
				*/
				// no da errro pero no hay resultados
			} else if (!response) {
				setNoSuppliesResult(true)
			}
			// hay error de sistema
			else {
				setShowSysyemError(true)
			}
			setIsLoadingList(false)
		}));
	}
	const formatText = (text: string): string => {
		return (text.substring(0, 1) + text.substring(1, text.length).toLowerCase())
	}


	useEffect(() => {
		if (searchedUser && searchedUser.userId) {
			if (validateCIF(searchedUser.documentNumber)) {
				setSocialReason(searchedUser.surName)
				setName('')
				setSurname1('')
				setSurname2('')
			} else if (searchedUser.name === '.') {
				setSocialReason(searchedUser.surName)
				setName('')
				setSurname1('')
				setSurname2('')
			} else {
				let auxSurnames = searchedUser.surName.split(' ')
				supplantUser(searchedUser, idAddress === '' ? true : false)
				setName(searchedUser.name ? formatText(searchedUser.name) : '')
				setSurname1(auxSurnames[0] ? formatText(auxSurnames[0]) : '')
				if (auxSurnames.length > 1) {
					setSurname2(auxSurnames[1] ? formatText(auxSurnames[1]) : '')
				}
				setSocialReason('')
			}

		}
	}, [searchedUser]);

	// useEffect(() => {
	// 	calculateShowButton()
	// }, [number, streetType, streetName, stateName, town])

	// const calculateShowButton = (): void => {
	// 	if (streetName !== '' && stateName !== '' && town !== '') {
	// 		setShowButton(false)
	// 	} else {
	// 		setShowButton(true)
	// 	}
	// }

	const calculateSearchCUPSButton = (): boolean => {
		// disabled={(error === false && (documentNumber?.trim() !== '') || (socialReason?.trim() !== '') || (name?.trim() !== '') || (surname1?.trim() !== '') || (surname2?.trim() !== '') || (idAddress !== '' || (town?.trim() !== '' && stateName?.trim() !== '' && streetName?.trim() !== '' && number?.trim() !== '')) || (name?.trim() !== '' && surname1?.trim() !== '') || (name?.trim() !== '') || (surname1?.trim() !== '') || (surname2?.trim() !== '')) ? false : true}
		if ((error === false &&
			(documentNumber?.trim() !== '') || (socialReason?.trim() !== '') ||
			(name?.trim() !== '') || (surname1?.trim() !== '') ||
			(surname2?.trim() !== '') || (idAddress !== '' ||
				(town?.trim() !== '' && stateName?.trim() !== '' && streetName?.trim() !== '')) ||
			(name?.trim() !== '' && surname1?.trim() !== '') || (name?.trim() !== '') ||
			(surname1?.trim() !== '') ||
			(surname2?.trim() !== '') || addressData.streetName !== null)) {
			return false
		}
		return true;
	}

	const calculateShowClear = (): boolean => {
		if ((
			(documentNumber?.trim() !== '') || (socialReason?.trim() !== '') ||
			(name?.trim() !== '') || (surname1?.trim() !== '') ||
			(surname2?.trim() !== '') || (idAddress !== '') ||
			(town?.trim() !== '') || (stateName?.trim() !== '') ||
			(streetName?.trim() !== '') || (name?.trim() !== '') ||
			(surname1?.trim() !== '') || (name?.trim() !== '') ||
			(surname1?.trim() !== '') || (surname2?.trim() !== '')
		)) {
			return false
		}
		return true;
	}

	const performSearchCUPS = (): void => {
		setIsLoadingList(true);
		// dispatch(thunkGetListStreets(streetName, provinceCode, townCode, '', '', individualEntity, colectiveEntity, (r_ : { streets: {items: iStreetName[]}}) => {
		// 	if (r_ && r_.streets && r_.streets.items && r_.streets.items.length > 0) {

		// for (let j = 0; j < r_.streets.items.length; j++) {
		// const r_ = {streets: { items: streetNames}}

		// if (r_.streets.items[j].streetName === streetName) {
		dispatch(thunkGetListAddresses(addressData.streetName.idStreet, number, '', (response) => {
			if (response && response.streets && response.streets.items && response.streets.items.length > 0) {
				if (response.streets.items.length < parseInt(maxDirections)) {
					const aux = [];
					for (let k = 0; k < response.streets.items.length; k++) {
						aux.push(`${response.streets.items[k].addId}`)
						if (k === response.streets.items.length - 1) {
							const supplyPointDefaultName = t('averias.management.searchCups.table.defaultName');
							dispatch(thunkListSuppliesAdmin(supplyPointDefaultName, adminToken, '', aux.join(','), (r__) => {
								if (r__?.supplypoints) {
									setSupplyList(r__?.supplypoints)
									setIsLoadingList(false)
									setShowList(true)
									setNoSuppliesResult(false)
								}
								else {
									setSupplyList([])
									setIsLoadingList(false)
									setNoSuppliesResult(true)
								}
							}))
						}
					}
				} else {
					setMoreThanMax(true)
					setIsLoadingList(false)
					setShowList(false)
				}
			} else {
				setSupplyList([])
				setIsLoadingList(false)
				setNoSuppliesResult(true)
			}
		}))
		// }
		// }

		// } else{
		// 	setIsLoadingList(false)
		// 	if (r_ && r_.streets && r_.streets.items && r_.streets.items.length === 0) {
		// 		setNoSuppliesResult(true)
		// 	}
		// }
		// }))
	}

	const performSearch = (address?: any): void => {

		setSupplyList([])
		setNameList({ items: [] })
		setShowListName(false)
		setSuplyyPoint(undefined)
		setShouldFilter(true)
		setNoResults(false)
		setNoSuppliesResult(false)
		setMoreThanMax(false)
		window.location.hash = ''
		setSupplyListNoRepeat([])
		if (documentNumber !== '' && idAddress === '') {
			handleChangeSearch(documentNumber, '', '', '')
		} else if (name !== '' && surname1 !== '' && idAddress === '') {
			setName(name?.trim())
			setSurname1(surname1?.trim())
			setSurname2(surname2?.trim())
			handleChangeSearch('', name?.trim(), surname1?.trim(), '')
		} else if (socialReason !== '') {
			handleChangeSearch('', '', socialReason)
		} else if (idAddress !== '' || address) {
			if (idAddress !== '') {
				handleChangeSearch('', '', '', idAddress)
			} else {
				handleChangeSearch('', '', '', address)
			}
		} else if (name !== '') {
			handleChangeSearch('', name?.trim(), '', '')
		} else if (surname1 !== '' || socialReason !== '') {
			handleChangeSearch('', '', (surname1?.trim() !== '' ? surname1?.trim() : socialReason?.trim() !== '' ? socialReason?.trim() : ''), '')
		} else if (surname2 !== '') {
			handleChangeSearch('', '', '', surname2?.trim())
		} else if (town?.trim() !== '' && stateName?.trim() !== '' && streetName?.trim() !== '') {
			if (streetId) {
				// dispatch(thunkGetListAddresses(streetId, number, door, (response) => {
				// 	if (response && response.streets && response.streets.items && response.streets.items.length > 0) {
				// 		const aux = [];
				// 		for (let i = 0; i < response.streets.items.length; i++) {
				// 			aux.push(`${response.streets.items[i].addId}`)
				// 		}
				// 		console.log(aux.length)
				// 		const supplyPointDefaultName = t('averias.management.searchCups.table.defaultName');
				// 		setIsLoadingList(true);
				// 		dispatch(thunkListSuppliesAdmin(supplyPointDefaultName, adminToken, '', aux.join(','), (r) => {
				// 			setSupplyList(r.supplypoints)
				// 			setIsLoadingList(false)
				// 			setShowList(true)
				// 		}))
				// 	} else {
				// 		setNoSuppliesResult(true)
				// 	}
				// }))
				performSearchCUPS()
			} else {
				if (provinceCode === '' || provinceCode === undefined) {
					const provinceCodeRecovered = getProvinceCodeFromList(province)
					if (provinceCodeRecovered !== '') {
						setProvinceCode(provinceCodeRecovered)
					}
					if (townCode === '' || townCode === undefined) {
						dispatch(thunkGetListMunicipalities(town, townCode, provinceCodeRecovered, zipCode, (r_) => {
							if (r_ && r_.municipalities && r_.municipalities.items && r_.municipalities.items.length > 0) {
								for (let i = 0; i < r_.municipalities.items.length; i++) {
									if (r_.municipalities.items[i].municipalityName === town) {
										setTownCode(r_.municipalities.items[i].municipalityCode)
										performSearchCUPS()
									}
								}

							} else {
								setNoResults(true)
							}
						}))
					}
				} else {
					if (townCode === '' || townCode === undefined) {
						dispatch(thunkGetListMunicipalities(town, townCode, provinceCode, zipCode, (r) => {
							if (r && r.municipalities && r.municipalities.items && r.municipalities.items.length > 0) {
								for (let i = 0; i < r.municipalities.items.length; i++) {
									if (r.municipalities.items[i].municipalityName === town) {
										setTownCode(r.municipalities.items[i].municipalityCode)
										performSearchCUPS()
									}
								}

							}
						}))
					}
					else {
						performSearchCUPS()
					}
				}
			}
		}
		//setIsLoadingList(true);

		// LCS: Lanzamos el evento - Wave 2
		sendGAEvent({
			event: 'search_create_malfunction_report',
			user_id: sessionStorage.getItem('id'),
			user_type: sessionStorage.getItem('user_type'),
			//user_document: sessionStorage.getItem('userDocumentLogin')
		  });

	}
	const getProvinceCodeFromList = (province): any => {
		for (let i = 0; i < props.provinces.length; i++) {
			if (province === props.provinces[i].provinceName) {
				return props.provinces[i].provinceCode;
			}
		}
		return '';
	}

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
						setStateName(response.zipCodes.items[0].provinceName)
						setTown(response.zipCodes.items[0].items[0].municipalityName)
						setZipCodesList([])
					}
				}));
			}
		} else if (input === 'state') {
			// 	let use = true
			setStateName(value)
			setProvinceCode(props.provinces.find(provinceItem => provinceItem.provinceName.toLowerCase().includes(value.toLowerCase()))?.provinceCode)
			setProvince(value)
		} else if (input === 'town') {
			// municipio
			if (value == t('averias.management.searchCups.address.select')) {
				setTown('')
			}
			else {
				setTown(value)
				setTownCode(props.towns.find(townElement => townElement.municipalityName.toLowerCase().includes(value.toLowerCase()))?.municipalityCode || '')
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
			if (number != value && idAddress != '') {
				setIdAddress('')
			}
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
		} else if (input === 'credential') {
			let auxValue = value?.trim()
			setDocumentNumber(auxValue)
			setCredentialType(checkDocumentTypeInString(auxValue))
			validateCredentials(auxValue, checkDocumentTypeInString(auxValue))
		} else if (input === 'colectiveEntity') {
			if (value == t('averias.management.searchCups.address.select')) {
				setcolectiveEntity('')
			}
			else {
				setcolectiveEntity(value)
			}
		} else if (input === 'individualEntity') {
			if (value == t('averias.management.searchCups.address.select')) {
				setIndividualEntity('')
			}
			else {
				setIndividualEntity(value)
			}
		} else if (input === 'duplicator') {
			setDuplicator(value)
		}
	}

	useEffect(() => {
		if (supplyList) {
			if (supplyList.length === 1) {
				selectSupply(supplyList[0])
				setShowList(true)
			}
			setTotalPages(supplyList.length === 0 ? 1 : Math.ceil(supplyList.length / itemsPerPage))
		}
		// eslint-disable-next-line
	}, [supplyList, itemsPerPage])

	useEffect(() => {
		if (nameList) {
			setTotalPagesName(nameList.items.length === 0 ? 1 : Math.ceil(nameList.items.length / itemsPerPage))
		}
	}, [nameList, itemsPerPage])

	useEffect(() => {

		if (!props.loadingProvinces && props.provinces.length && !statesList.length) {
			// cargar lista de provincias
			if (props.enabledStateArray.length > 0) {
				setStatesList([...props.provinces.filter(province => props.enabledStateArray.includes(province.provinceName))])
			} else {
				setStatesList([...props.provinces])
			}
		}
	}, [props.provinces, statesList, props.loadingProvinces, props.enabledStateArray])

	const handleGetListAddresses = (streetName, provinceCode, municipalityCode, number, door, checkStreetName) => {
		dispatch(thunkGetListStreets(streetName, provinceCode, municipalityCode, '', '', individualEntity, colectiveEntity, (r) => {
			if (r && r.streets && r.streets.items && r.streets.items.length > 0) {
				for (let i = 0; i < r.streets.items.length; i++) {
					if (!checkStreetName || (checkStreetName && r.streets.items[i].streetName === streetName)) {
						dispatch(thunkGetListAddresses(r.streets.items[i].idStreet, number, '', (response) => {
							if (response) {
								if (response.streets && response.streets.items && response.streets.items.length > 0) {
									setStateList(response.streets.items)
									setIsLocationModalVisible(true)
									setNoResults(false)
								} else if (!response.streets) {
									setNoResults(true)
								}
							}
						}))
					}
					if (!checkStreetName) {
						break;
					}
				}
			} else {
				setNoSuppliesResult(true)
			}
		}));
	};

	const handleSearchButton = () => {
		setNoResults(false);
		setNoSuppliesResult(false)
		setMoreThanMax(false)
		if (streetId) {
			dispatch(thunkGetListAddresses(streetId, number, '', (response) => {
				if (response && response.streets && response.streets.items && response.streets.items.length > 0) {
					setStateList(response.streets.items)
					setIsLocationModalVisible(true)
					setNoResults(false)
				} else {
					setNoResults(true)
				}
			}));
		} else {
			if (provinceCode === '' || provinceCode === undefined) {
				const provinceCodeRecovered = getProvinceCodeFromList(province)
				setProvinceCode(provinceCodeRecovered)
				if (townCode === '' || townCode === undefined) {
					dispatch(thunkGetListMunicipalities(town, townCode, provinceCodeRecovered, zipCode, (r_) => {
						if (r_ && r_.municipalities && r_.municipalities.items && r_.municipalities.items.length > 0) {
							for (let i = 0; i < r_.municipalities.items.length; i++) {
								if (r_.municipalities.items[i].municipalityName === town) {
									setTownCode(r_.municipalities.items[i].municipalityCode)
									handleGetListAddresses(streetName, provinceCodeRecovered, r_.municipalities.items[i].municipalityCode, number, '', false)
								}
							}

						}
					}))
				}
				else {
					handleGetListAddresses(streetName, provinceCode, townCode, number, door, false)
				}
			} else {
				if (townCode === '' || townCode === undefined) {
					dispatch(thunkGetListMunicipalities(town, '', provinceCode, zipCode, (r) => {
						if (r && r.municipalities && r.municipalities.items && r.municipalities.items.length > 0) {
							for (let i = 0; i < r.municipalities.items.length; i++) {
								if (r.municipalities.items[i].municipalityName === town) {
									setTownCode(r.municipalities.items[i].municipalityCode)
									handleGetListAddresses(streetName, provinceCode, townCode, number, '', true)
								}
							}

						}
					}))
				}
				else {
					handleGetListAddresses(streetName, provinceCode, townCode, number, '', true)
				}
			}
		}
	}
	const handleCloseLocationDialog = () => {
		setIsLocationModalVisible(false)
	}
	const handleAcceptLocationDialog = (key) => {
		const selected = stateList[key]
		setStair(selected.stair || '')
		setFloor(selected.floor || '')
		setDoor(selected.door || '')
		setDuplicator(selected.portal || '')
		setNumber(selected.addNumber || '')

		setIdAddress(selected.addId)
		setCghId(selected.cghId)
		setCgvId(selected.cgvId)
		setZipCode(selected.zipCode)
		setWarningInfo({
			...warningInfo,
			cor: stateName === 'GALICIA' ? 'C' : 'N',
			primerApellido: surname1,
			segundoApellido: surname2,
			descripcionCalle: selected.address,
			numero: selected.door,
			descripcionMunicipio: town,
			descripcionProvincia: stateName,
			cgh: selected.cghId,
			cgv: selected.cgvId,
			tipoVia: selected.searchType,
			zipCode: selected.zipCode,
			descripcionEntidadSingular: selected.singleEntity,
			descripcionEntidadColectiva: selected.groupEntity,
			portal: selected.portal
		})
		setIsLocationModalVisible(false)
		setIsSFDVisible(true)
		performSearch(selected.addId);
	}
	const resetFilters = () => {
		setProvince('')
		setStateName('')
		setDocumentNumber('')
		setName('')
		setSurname1('')
		setSurname2('')
		setTown('')
		setTownCode('')
		setZipCode('')
		setStreetType('')
		setStreetName('')
		setNumber('')
		setIsSFDVisible(false)
		setStair('')
		setFloor('')
		setDoor('')
		setProvinceCode('')
		setIdAddress('')
		setError(false)
		setSupplyList([])
		setCredentialList([])
		setCandidatesList([])
		setShowList(false)
		setShowListName(false)
		setShowSupplyPoint(false)
		setShowSysyemError(false)
		setcolectiveEntity('')
		setIndividualEntity('')
		setSocialReason('')
		setStreetId('')
		props.clearTowns()
		clearStreets()
		resetRetriesGE()
		resetRetriesIE()
		resetRetriesStreetNames()
		props.resetRetriesTowns()
		setShouldReset(true)
		setSuplyyPoint(undefined)
		// Limpiamos los 3 popups
		setNoResults(false)
		setNoSuppliesResult(false)
		setMoreThanMax(false)
	}

	const selectSupply = (selectedSupply: SupplyPoint) => {
		setShouldFilter(false)
		setSuplyyPoint(selectedSupply)
		setNumber(`${selectedSupply.address.number}`)
		dispatch(thunkGetSupplyCups(selectedSupply.holderDocumentNumber, selectedSupply.cups, (response) => {
			if (response && response.supplyPoints) {
				const supplyActualizado = response.supplyPoints.items[0];
				setSuplyyPoint(supplyActualizado);
			}
		}));
		setIsLoadingList(true)
		setCurrentPage(0)
		let reBuscarTitular = false;
		if (documentNumber !== '') {
			setShowSupplyPoint(true);
			reBuscarTitular = (documentNumber !== selectedSupply.holderDocumentNumber || (name === '' && surname1 === '' && surname2 === ''))
			window.location.hash = '#compSuministro'
			setIsLoadingList(false)
		} else {
			reBuscarTitular = true;
			setShowSupplyPoint(true);
			setIsLoadingList(false);
		}
		if (reBuscarTitular) {
			setDocumentNumber(selectedSupply.holderDocumentNumber)
			setName('')
			setSurname1('')
			setSurname2('')
			dispatch(thunkGetListCustomers(selectedSupply.holderDocumentNumber, '', '', '', (response) => {
				if (response && response.customers && response.customers.items) {
					if (response.customers.items.length >= 1 && response.customers.items[0].userType != '0') {
						if (!validateCIF(response.customers.items[0].docNumber)) {
							setName(response.customers.items[0].customerName)
							setSurname1(response.customers.items[0].surname1 || '')
							setSurname2(response.customers.items[0].surname2 || '')
						} else {
							setSocialReason(response.customers.items[0].customerName)
						}
						setTrigger(t => !t);
					}
				}
			}))
		}
	}

	useEffect(() => {
		const aux = []
		for (let i = 0; i < supplyList?.length; i++) {
			if (!aux.includes(supplyList[i]?.holderName)) {
				aux.push(supplyList[i]?.holderName)
				supplyListNoRepeat.push(supplyList[i])
			}
		}
	}, [supplyList])

	useEffect(() => {
		if (!suplyyPoint) {
			setShowSupplyPoint(false)
		}
	}, [suplyyPoint])

	useEffect(() => {
		if (findByName !== 0) {
			handleChangeSearch(documentNumber, '', '', '', [], false)
		}
	}, [findByName])

	const socialReasonDisabled = useMemo(() => {
		if (socialReason?.trim() !== '' && socialReason !== undefined) {
			return false
		}
		if ((name?.trim() !== '' && name !== undefined) || (surname1?.trim() !== '' && surname1 !== undefined) || (surname2?.trim() !== '' && surname2 !== undefined) || (!validateCIF(documentNumber) && documentNumber !== '')) {
			return true
		}
		return false
	}, [name, surname1, surname2, validateCIF, documentNumber, socialReason])

	const nameDisabled = useMemo(() => {
		if ((name?.trim() !== '' && name !== undefined) || (surname1?.trim() !== '' && surname1 !== undefined) || (surname2?.trim() !== '' && surname2 !== undefined)) {
			return false
		}
		if (socialReason !== '' || (validateCIF(documentNumber) && documentNumber !== '')) {

			return true
		}
		return false
	}, [socialReason, documentNumber, validateCIF, name, surname1, surname2])

	const [open, setOpen] = useState(false)

	const togle = () => {
		setOpen(!open)
	}

	const handleClick = (obj: iStreetName) => {
		setDataFromAdvance(obj)
		setOpen(!open)
	}

	const deletePaddingZeroes = (numeroCalle: string) => {
		const regex = /^0+/; // Expresión regular para encontrar los ceros de relleno al principio
		const numberWithoutPaddingZeros = number.replace(regex, '');
		return numberWithoutPaddingZeros;
	}

	const filteredSupplyList = useMemo(() => {
		console.log(town, province, zipCode, number, streetName)
		let filteredSupplies: SupplyPoint[] = supplyList

		if (shouldFilter) {
		//if (true) {
			if (town.length !== 0) {
				filteredSupplies = filteredSupplies?.filter(supplyPoint => supplyPoint.address.town === town)
			}
			if (province.length !== 0) {
				filteredSupplies = filteredSupplies?.filter(supplyPoint => supplyPoint.address.province === province)
			}
			if (zipCode.length !== 0) {
				filteredSupplies = filteredSupplies?.filter(supplyPoint => supplyPoint.address.zipCode.toString() === zipCode)
			}
			if (number.length !== 0) {
				filteredSupplies = filteredSupplies?.filter(supplyPoint => deletePaddingZeroes(supplyPoint.address.number.toString()) === deletePaddingZeroes(number))
			}
			if (streetName.length !== 0) {
				filteredSupplies = filteredSupplies?.filter(supplyPoint => supplyPoint.address.street === streetName)
			}
		}
		return filteredSupplies
	}, [supplyList, town, province, zipCode, number, streetName, shouldFilter])


	const filteredName = useMemo(() => nameList, [nameList])
	// const filteredName = useMemo(() => {
	// 	let filteredSupplies: UserList = nameList
	// 	if (town.length !== 0) {
	// 		filteredSupplies.items = filteredSupplies?.items?.filter(supplyPoint => supplyPoint.town === town)
	// 	}
	// 	if (province.length !== 0) {
	// 		filteredSupplies.items = filteredSupplies?.items?.filter(supplyPoint => supplyPoint.state === province)
	// 	}
	// 	if (zipCode.length !== 0) {
	// 		filteredSupplies.items = filteredSupplies?.items?.filter(supplyPoint => supplyPoint.zipcode === zipCode)
	// 	}
	// 	if (number.length !== 0) {
	// 		filteredSupplies.items = filteredSupplies?.items?.filter(supplyPoint => supplyPoint.addNumber === number)
	// 	}
	// 	if (streetName.length !== 0) {
	// 		filteredSupplies.items = filteredSupplies?.items?.filter(supplyPoint => supplyPoint.streetName === streetName)
	// 	}


	// ----- TO-DO LLEVARSE ESTE FILTRO A UN LUGAR DONDE TOQUE

	// 	if (filteredSupplies.items.length === 1) {
	// 		setName(filteredSupplies.items[0].customerName)
	// 		setSurname1(filteredSupplies.items[0].surname1 || '')
	// 		setSurname2(filteredSupplies.items[0].surname2 || '')
	// 		setExpandedListName(false)
	// 		setIsLoadingSecondSpinner(true);

	// 		dispatch(thunkGetSupplyCups(filteredSupplies.items[0].docNumber, '', (resp) => {

	// 			if (resp && resp.supplyPoints && resp.supplyPoints.items) {
	// 				const supplyPoints = resp.supplyPoints.items;
	// 				setSupplyList(supplyPoints);
	// 				setShowList(true)
	// 			}
	// 			setIsLoadingSecondSpinner(false);
	// 		}))
	// 	}

	// 	return filteredSupplies
	// }, [nameList])

	useEffect(() => {
		dispatch(setSearchedUser({}));
	}, [])

	return (
		<>
			{
				(isLoadingList || isLoadingListName) &&
				<Spinner fixed={true} />
			}
			<Grid container direction='column' justifyContent='space-between'>
				<ExpansionPanel defaultExpanded>
					<ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />}>
						<img className={styles.expansionPanelSummaryIcon} src={TechnicalDataIcon} alt='' />
						<Typography className={styles.expansionPanelSummaryText}>{t('averias.management.searchCups.searchBy')}</Typography>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails className={styles.pad}>
						<Grid container md={12}>
							<Grid item md={12} className={`${styles.inputsArea} ${(props.tabletRes || props.mobileRes) ? '' : styles.searchContainer}`}>
								<Grid container className={styles.inputsArea}>
									<div className={styles.titleWrapper}>
										<span className={styles.searchTitle}>{t('averias.management.searchCups.holder')}</span>
									</div>
									<Grid container xs={12} sm={12} md={12} spacing={3}>
										<Grid item xs={4} sm={4}>
											<span className={error ? styles.inputTitleError : styles.inputTitle}>{t('averias.management.searchCups.doc') + t('common.punctuation.colon')}</span>
											<input
												list='docUsuario'
												className={error ? styles.inputV4Error : styles.inputV4}
												value={documentNumber}
												onChange={(e) => handleChangeInput('credential', e.target.value)}
											/>
											<datalist id='docUsuario'>
												{credentialList.map((item, index) =>
													<option key={index} value={item} />
												)
												}
											</datalist>
											{error &&
												<span className={styles.credentialError}>{t('admin.inputs.credentialError')}</span>
											}
										</Grid>
										<Grid item xs={4} sm={4}>
											<span className={styles.inputTitle}>{t('averias.management.searchCups.socialReason') + t('common.punctuation.colon')}</span>
											<Input
												className={styles.inputV2}
												value={socialReason}
												onChange={
													(e) => {
														setSocialReason(e.target.value)
													}
												}
												disabled={socialReasonDisabled}
											/>
										</Grid>
										<Grid item xs={4} sm={4} />
										<Grid item xs={4} sm={4}>
											<span className={styles.inputTitle}>{t('averias.management.searchCups.name') + t('common.punctuation.colon')}</span>
											<Input
												className={styles.inputV2}
												value={name}
												onChange={
													(e) => {
														setName(e.target.value)
													}
												}
												disabled={nameDisabled}
											/>
										</Grid>
										<Grid item xs={4} sm={4}>
											<span className={styles.inputTitle}>{t('averias.management.searchCups.firstSurname') + t('common.punctuation.colon')}</span>
											<Input
												className={styles.inputV2}
												value={surname1}
												onChange={
													(e) => {
														setSurname1(e.target.value)
													}
												}
												disabled={nameDisabled}
											/>
										</Grid>
										<Grid item xs={4} sm={4}>
											<span className={styles.inputTitle}>{t('averias.management.searchCups.secondSurname') + t('common.punctuation.colon')}</span>
											<Input
												className={styles.inputV2}
												value={surname2}
												onChange={
													(e) => {
														setSurname2(e.target.value)
													}
												}
												disabled={nameDisabled}
											/>
										</Grid>
									</Grid>
								</Grid>
								<SearchByAddress
									collectiveEntities={collectiveEntities}
									cooldownTry={props.cooldownTry}
									errorProvinces={props.errorProvinces}
									errorTowns={props.errorTowns}
									errorIndividualEntities={errorIndividualEntities}
									errorCollectiveEntities={errorCollectiveEntities}
									errorStreetNames={errorStreetNames}
									handleChangeInput={handleChangeInput}
									handleSearchButton={handleSearchButton}
									individualEntities={individualEntities}
									loadingStatesList={props.loadingProvinces}
									loadingTowns={props.loadingTowns}
									loadingCollectiveEntities={loadingCollectiveEntities}
									loadingIndividualEntities={loadingIdividualEntities}
									loadingStreetNames={loadingStreetNames}
									number={number}
									// showButton={showButton}
									statesList={statesList}
									streetNames={streetNames}
									streetType={streetType}
									toggleOpenModal={togle}
									towns={props.towns}
									townCode={townCode}
									tracksList={tracksList}
									zipCode={zipCode}
									zipCodesList={zipCodesList}
									onReset={() => setShouldReset(false)}
									reset={shouldReset}
									onUpdate={(addressData) => setAddressData(addressData)}
									getColectiveEntities={getCollectiveEntities}
									getIndividualEntities={getIndividualEntities}
									getProvinces={props.getProvinces}
									dataFromAdvance={dataFromAdvance}
									colEntity={colectiveEntity}
									getTowns={props.getTowns}
									indEntity={individualEntity}
									province={provinceCode}
									town={town}
									supplyPoint={suplyyPoint}
									getStreetNames={getStreetNames}
									streetName={streetName}
									clearStreets={clearStreets}
									resetTown={false}
									offResetTown={() => {}}
								/>

								<Modales isOpne={open} toggle={togle} scroll={{ overflow: 'hidden scroll' }} key='busqueda_extra_searchcups'>
									<div>
										<div className={styles.closeBtn}>
											<img src={CloseButon} onClick={() => togle()} />
										</div>
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



								<Grid container className={`${styles.inputsArea} margin`}>
									{noResults && <AlertMessage onClose={()=>setNoResults(false)} text={t('averias.management.incidence.insertContactData.noResults')}/>
										// <Grid className={styles.searchResult}>
										// 	<Grid container direction='row' className={styles.noResults}>
										// 		<Grid item direction='column'><img src={InfoIcon} className={styles.icon} alt='' /></Grid>
										// 		<Grid item direction='column'><span className={styles.bluetext}>{t('averias.management.incidence.insertContactData.noResults')}</span></Grid>
										// 		<Grid item direction='column'><img src={CloseIcon} className={styles.closeButton} alt='' onClick={() => setNoResults(false)} /></Grid>
										// 	</Grid>
										// </Grid>
									}
									
									{isSFDVisible &&
										<Grid container xs={11} sm={10} md={12} spacing={3} className={(props.mobileRes || props.tabletRes) ? styles.addressDetailsCont : ''}>
											<Grid item xs={11} sm={10} md={2} spacing={2}>
												<span className={styles.inputTitle}>{t('averias.management.searchCups.address.duplicator')}</span>
												<Input
													className={styles.inputV2_SFD}
													value={duplicator}
													onChange={(e) => handleChangeInput('duplicator', e.target.value)}
													disabled
												/>
											</Grid>
											<Grid item xs={11} sm={10} md={2} spacing={2}>
												<span className={styles.inputTitle}>{t('averias.management.searchCups.address.stair')}</span>
												<Input
													className={styles.inputV2_SFD}
													value={stair}
													onChange={(e) => handleChangeInput('stair', e.target.value)}
													disabled
												/>
											</Grid>
											<Grid item xs={11} sm={10} md={2} spacing={2}>
												<span className={styles.inputTitle}>{t('averias.management.searchCups.address.floor')}</span>
												<Input
													className={styles.inputV2_SFD}
													value={floor}
													onChange={(e) => handleChangeInput('floor', e.target.value)}
													disabled
												/>
											</Grid>
											<Grid item xs={11} sm={10} md={2} spacing={2}>
												<span className={styles.inputTitle}>{t('averias.management.searchCups.address.door')}</span>
												<Input
													className={styles.inputV2_SFD}
													value={door}
													onChange={(e) => handleChangeInput('door', e.target.value)}
													disabled
												/>
											</Grid>
										</Grid>
									}
								</Grid>
								<Grid container direction='row' justifyContent='center' className={styles.buttonsContainer}>
									{/* <Grid item>
										<Button
											className={styles.cancelButton}
											text={t('common.buttons.cancel')}
											color='inherit'
											size='large'
											variant='contained'
											onClick={resetFilters}
										/>
									</Grid> */}
									<Grid item className={styles.formFooter}>
										<Button
											className={styles.button}
											text={t('common.buttons.search')}
											color='primary'
											size='large'
											variant='contained'
											disabled={calculateSearchCUPSButton()}
											onClick={() => performSearch()}
										/>
										{
											!calculateShowClear() &&
											<p className={styles.link} onClick={resetFilters}>
												{t('averias.management.searchCups.resetFilters')}
											</p>

										}
									</Grid>

								</Grid>
							</Grid>
							{(showListName) &&
								<Grid item md={12} className={styles.searchResultContainer}>
									{(!isLoadingListName) &&
										<>
											{expandedListName && (
												<Grid container className={styles.expansionPanelSummaryText} style={{ backgroundColor: '#f7fbfe', margin: '0', paddingBottom: '1rem' }}>
													{t('select')}
												</Grid>
											)}
											<Grid container >
												{expandedListName ? (
													<>
														<ExpansionPanel defaultExpanded={true}>
															<ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />}>
																<Typography className={styles.expansionPanelSummaryText}>
																	{

																		filteredName.items.length > 20 && totalPagesName > 1 && (currentPage + 1) === totalPagesName ?
																			<Grid container>
																				{filteredName.items.slice((currentPage * itemsPerPage), ((currentPage * itemsPerPage) + itemsPerPage)).length + t('averias.management.consult.titularesDe') + filteredName.items.length}
																			</Grid>
																			:
																			filteredName.items.length > 20 && totalPagesName > 1 ?
																				<Grid container>
																					{filteredName.items.slice((currentPage * itemsPerPage), ((currentPage * itemsPerPage) + itemsPerPage)).length + t('averias.management.consult.titularesDe') + filteredName.items.length}
																				</Grid>
																				:
																				<Grid container>
																					{filteredName.items.length + ((filteredName.items.length > 1 || filteredName.items.length === 0) ? t('averias.management.consult.titulares') : t('averias.management.consult.titular'))}
																				</Grid>
																	}
																</Typography>
															</ExpansionPanelSummary>
															<ExpansionPanelDetails>
																<ListName
																	setDocumentNumber={setDocumentNumber}
																	name={filteredName}
																	listItems={supplyListNoRepeat}
																	setFinalList={setSupplyListNoRepeat}
																	currentPage={currentPage}
																	setCurrentPage={setCurrentPage}
																	itemsPerPage={itemsPerPage}
																	setItemsPerPage={setItemsPerPage}
																	totalPages={totalPagesName}
																	suplyyPoint={suplyyPoint}
																	setSuplyyPoint={setSuplyyPoint}
																	showSupplyPoint={showSupplyPoint}
																	setname={setName}
																	setSurname1={setSurname1}
																	setSurname2={setSurname2}
																	setNameSelected={setNameSelected}
																	setFindByName={setFindByName}
																	findByName={findByName}
																	setSocialReason={setSocialReason}
																/>
															</ExpansionPanelDetails>
														</ExpansionPanel>
													</>
												) : (
													<ExpansionPanel defaultExpanded={false}>
														<ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />}>
															<Typography className={styles.expansionPanelSummaryText}>
																{
																	filteredName.items.length > 20 && totalPagesName > 1 && (currentPage + 1) === totalPagesName ?
																		<Grid container>
																			{filteredName.items.slice((currentPage * itemsPerPage), ((currentPage * itemsPerPage) + itemsPerPage)).length + t('averias.management.consult.titularesDe') + filteredName.items.length}
																		</Grid>
																		:
																		filteredName.items.length > 20 && totalPagesName > 1 ?
																			<Grid container>
																				{filteredName.items.slice((currentPage * itemsPerPage), ((currentPage * itemsPerPage) + itemsPerPage)).length + t('averias.management.consult.titularesDe') + filteredName.items.length}
																			</Grid>
																			:
																			<Grid container>
																				{filteredName.items.length + ((filteredName.items.length > 1 || filteredName.items.length === 0) ? t('averias.management.consult.titulares') : t('averias.management.consult.titular'))}
																			</Grid>
																}
															</Typography>
														</ExpansionPanelSummary>
														<ExpansionPanelDetails>
															<ListName
																setDocumentNumber={setDocumentNumber}
																name={filteredName}
																listItems={supplyListNoRepeat}
																setFinalList={setSupplyListNoRepeat}
																currentPage={currentPage}
																setCurrentPage={setCurrentPage}
																itemsPerPage={itemsPerPage}
																setItemsPerPage={setItemsPerPage}
																totalPages={totalPagesName}
																suplyyPoint={suplyyPoint}
																setSuplyyPoint={setSuplyyPoint}
																showSupplyPoint={showSupplyPoint}
																setname={setName}
																setSurname1={setSurname1}
																setSurname2={setSurname2}
																setNameSelected={setNameSelected}
																setFindByName={setFindByName}
																findByName={findByName}
																setSocialReason={setSocialReason}
															/>
														</ExpansionPanelDetails>
													</ExpansionPanel>
												)}
											</Grid>
										</>
									}
								</Grid>
							}
							{/* {supplyList.length === 1 ? setSuplyyPoint(supplyList[0]) : ''} */}

							{(isLoadingSecondSpinner) &&

								<Grid item md={12} className={styles.searchResultContainer}>
									<Spinner fixed={true} />
								</Grid>
							}
							{(showList) &&
								<Grid item md={12} className={styles.searchResultContainer}>
									{filteredSupplyList?.length > 1 && (
										<Grid container className={styles.expansionPanelSummaryText} style={{ backgroundColor: '#f7fbfe', margin: '0', paddingBottom: '1rem' }}>
											{t('selectSum')}
										</Grid>
									)}
									{(!isLoadingList && !isLoadingSecondSpinner) &&
										<>
											<Grid container >
												{filteredSupplyList?.length > 1 ? (
													<>
														<ExpansionPanel defaultExpanded={true}>
															<ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />}>
																<Typography className={styles.expansionPanelSummaryText}>
																	{
																		filteredSupplyList?.length > 20 && totalPages > 1 && (currentPage + 1) === totalPages ?
																			<Grid container>
																				{filteredSupplyList?.slice((currentPage * itemsPerPage), ((currentPage * itemsPerPage) + itemsPerPage)).length + t('averias.management.consult.suministrosDe') + filteredSupplyList?.length}
																			</Grid>
																			:
																			filteredSupplyList?.length > 20 && totalPages > 1 ?
																				<Grid container>
																					{filteredSupplyList?.slice((currentPage * itemsPerPage), ((currentPage * itemsPerPage) + itemsPerPage)).length + t('averias.management.consult.suministrosDe') + filteredSupplyList?.length}
																				</Grid>
																				:
																				<Grid container>
																					{filteredSupplyList?.length + ((filteredSupplyList?.length > 1 || filteredSupplyList?.length === 0) ? t('averias.management.consult.suministros') : t('averias.management.consult.suministro'))}
																				</Grid>
																	}
																</Typography>
															</ExpansionPanelSummary>
															<ExpansionPanelDetails>
																<ListSupplies
																	listItems={filteredSupplyList}
																	setFinalList={setSupplyList}
																	currentPage={currentPage}
																	setCurrentPage={setCurrentPage}
																	itemsPerPage={itemsPerPage}
																	setItemsPerPage={setItemsPerPage}
																	totalPages={totalPages}
																	suplyyPoint={suplyyPoint}
																	setSuplyyPoint={setSuplyyPoint}
																	showSupplyPoint={showSupplyPoint}
																	setShowSupplyPoint={setShowSupplyPoint}
																	selectSupply={selectSupply}
																/>
															</ExpansionPanelDetails>
														</ExpansionPanel>
													</>
												) : (
													<>
														<ExpansionPanel defaultExpanded={true}>
															<ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />}>
																<Typography className={styles.expansionPanelSummaryText}>
																	{
																		filteredSupplyList?.length > 20 && totalPages > 1 && (currentPage + 1) === totalPages ?
																			<Grid container>
																				{filteredSupplyList?.slice((currentPage * itemsPerPage), ((currentPage * itemsPerPage) + itemsPerPage)).length + t('averias.management.consult.suministrosDe') + filteredSupplyList?.length}
																			</Grid>
																			:
																			filteredSupplyList?.length > 20 && totalPages > 1 ?
																				<Grid container>
																					{filteredSupplyList?.slice((currentPage * itemsPerPage), ((currentPage * itemsPerPage) + itemsPerPage)).length + t('averias.management.consult.suministrosDe') + filteredSupplyList?.length}
																				</Grid>
																				:
																				<Grid container>
																					{filteredSupplyList?.length + ((filteredSupplyList?.length > 1 || filteredSupplyList?.length === 0) ? t('averias.management.consult.suministros') : t('averias.management.consult.suministro'))}
																				</Grid>
																	}
																</Typography>
															</ExpansionPanelSummary>
															<ExpansionPanelDetails>
																<ListSupplies
																	listItems={filteredSupplyList}
																	setFinalList={setSupplyList}
																	currentPage={currentPage}
																	setCurrentPage={setCurrentPage}
																	itemsPerPage={itemsPerPage}
																	setItemsPerPage={setItemsPerPage}
																	totalPages={totalPages}
																	suplyyPoint={suplyyPoint}
																	setSuplyyPoint={setSuplyyPoint}
																	showSupplyPoint={showSupplyPoint}
																	setShowSupplyPoint={setShowSupplyPoint}
																	selectSupply={selectSupply}
																/>
															</ExpansionPanelDetails>
														</ExpansionPanel>
													</>
												)}
											</Grid>
										</>
									}
								</Grid>
							}
							{showSystemError &&
								<Grid item md={12} className={styles.searchResultContainer}>
									{(!isLoadingList) &&
										<>
											<Grid className={styles.alertContainer}>
												<img className={styles.errorIcon} src={ErrorIcon} />
												<div className={styles.alertTitle}>
													{t('averias.management.searchCups.searchError1')}
												</div>
												<div className={styles.errorText}>
													{t('averias.management.searchCups.searchError2')}
												</div>
											</Grid>
										</>
									}
								</Grid>
							}
							{noSuppliesResult &&
								<Grid item md={12} className={styles.searchResultContainer}>
									{(!isLoadingList) &&
										<Grid className={styles.alertContainer}>
											<img src={AlertIcon} />
											<div className={styles.alertTitle}>
												{t('averias.management.searchCups.noResults')}
											</div>
										</Grid>
									}
								</Grid>
							}
							{moreThanMax &&
								<Grid item md={12} className={styles.searchResultContainer}>
									{(!isLoadingList) &&
										<Grid className={styles.alertContainer}>
											<img src={AlertIcon} />
											<div className={styles.alertTitle} style={{ fontWeight: 'bold' }}>
												{t('averias.management.searchCups.noMaxResults')}
											</div>
											<div className={styles.alertTitle_2}>
												{t('averias.management.searchCups.noMaxResluts2')}
											</div>
										</Grid>
									}
								</Grid>
							}
						</Grid>
					</ExpansionPanelDetails>
				</ExpansionPanel>
				{(showSupplyPoint && suplyyPoint) &&
					<Grid ref={supplyVerificationBlockRef} container>
						<ComprovacionSuministro
							suplyPoint={suplyyPoint}
							suplyPointUser={{
								userId: '0',
								documentNumber: documentNumber,
								documentType: '',
								email: '',
								name: name,
								surName1: surname1,
								surName2: surname2,
								phone: '',
								enabled: 0,
							}}
							warningInfo={warningInfo}
							setWarningInfo={setWarningInfo}
							tabletRes={props.tabletRes}
							mobileRes={props.mobileRes}
							autoConsultaContadorParam={autoConsultaContadorCompr}
							monofReadingTypeIds={props.monofReadingTypeIds}
							trifaReadingTypeIds={props.trifaReadingTypeIds}
							meterConsultTimeout={props.meterConsultTimeout}
							meterRearmTimeout={props.meterRearmTimeout}
							maxTry={maxTry}
							closedSRTipo={closedSRTipo}
							typeList={typeList}
							scopeList={scopeList}
							motiveList={motiveList}
							supplyVerificationBlockRef={supplyVerificationBlockRef}
						/>
					</Grid>
				}
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
			</Grid>
		</>
	);
}
export default SearchCups;
