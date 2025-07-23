import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchedUser } from '../../../../../admin/store/actions/AdminActions'
import { thunkCancelSupplantUser, thunkGetSearchedUser } from '../../../../../admin/store/actions/AdminThunkActions'
import { thunkListSuppliesAdmin } from '../../../../../supplies/supplies-list/store/actions/SuppliesListThunkActions'
import { validateNIE, validateNIF, validateCIF, checkDocumentTypeInString } from '../../../../../common/lib/ValidationLib'
import { thunkGetListZipCodes, thunkGetListAddresses, thunkGetListCustomers, thunkGetStreetTypeByStreetNameAndZipcode, thunkGetMasterData } from '../../../../actions/GestionAveriasThunkActions'
import Grid from '@material-ui/core/Grid'
import useStyles, {
	ExpansionPanel,
	ExpansionPanelSummary,
	StyledExpandMoreIcon,
	ExpansionPanelDetails
} from './SearchBy.styles'
import AlertIcon from '../../../../../assets/icons/aviso_alerta_pop_up.svg'
import InfoIcon from '../../../../../assets/icons/ico_info_azul.svg'
import CloseIcon from '../../../../../assets/icons/cerrar.svg'
import UserProfile from '../../../../../common/interfaces/UserProfile'
import SupplyPoint from '../../../../../common/interfaces/SupplyPoint'
import Input from '../../../../../common/components/input/Input'
import Select from '../../../../../common/components/select/Select'
import Button from '../../../../../common/components/button/Button'
import LocationModal from '../../incidencia/location-modal/LocationModal'
import Typography from '@material-ui/core/Typography'
import ListSupplies from '../list/ListSupplies'
import MosaicSupplies from '../mosaic/MosaicSupplies'
import { useMediaQuery, useTheme } from '@material-ui/core'
import { log } from 'console'
import Province from '../../searchCups/components/Province/Province'
import Town from '../../searchCups/components/Town/Town'
import ColEntity from '../../searchCups/components/ColEntity/ColEntity'
import IndEntity from '../../searchCups/components/IndEntity/IndEntity'
import ZipCode from '../../searchCups/components/ZipCode/ZipCode'
import StreetType from '../../searchCups/components/StreetType/streetType'
import StreetName from '../../searchCups/components/StreetName/StreetName'
import NumberInput from '../../searchCups/components/NumberInput/NumberInput'
import BtnSend from '../../searchCups/components/BtnSend/BtnSend'
import { iStreetName, useStreetNames } from '../../searchCups/hooks/useStreetNames'
import { useIndividualEntities } from '../../searchCups/hooks/useIndividualEntities'
import { useCollectiveEntities } from '../../searchCups/hooks/useGroupEntities'
import { SearchByAddress, iAddressFormData } from '../../searchCups/components/SearchByAddress/SearchByAddress'
import { iTown } from '../../searchCups/hooks/useTowns'
import { AlertMessage } from '../../common/Alert'

// LCS: Importamos la función - Wave 2
import { sendGAEvent } from '../../../../../core/utils/gtm'

const SearchIncidence = (props: any) => {
	const styles = useStyles({})
	const { t } = useTranslation()
	const dispatch = useDispatch()
	const theme = useTheme()
	const mobile = useMediaQuery(theme.breakpoints.down('sm'))
	const {
		supply,
		setSupply,
		setLoading,
		setShowInterruptions,
		setIncidencesList,
		selectedTab,
		cooldownTry,
		cooldownRetry,
		maxRetries,
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
	const [isLocationModalVisible, setIsLocationModalVisible] = useState<boolean>(false)
	const [isSFDVisible, setIsSFDVisible] = useState<boolean>(false)
	const [credentialType, setCredentialType] = useState('')
	const [credential, setCredential] = useState('')
	const [credentialList, setCredentialList] = useState([] as any)
	const adminToken = useSelector((state: any) => state.admin.token)
	const searchedUser = useSelector((state: any) => state.admin.searchedUser)
	const supplies: SupplyPoint[] = useSelector((state: any) => state.supplies)
	const [error, setError] = useState<boolean>(false)
	const [showList, setShowList] = useState<boolean>(false)
	const [showSystemError, setShowSysyemError] = useState<boolean>(false)
	const [isLoadingList, setIsLoadingList] = useState<boolean>(false)
	const [supplyList, setSupplyList] = useState<SupplyPoint[]>([])
	const [supplantedUser, setSupplantedUser] = useState<UserProfile>()
	const [tracksList, setTracksList] = useState([] as any)

	const [noResults, setNoResults] = useState<boolean>(false)
	const [showTab, setShowTab] = useState(selectedTab)
	// Form inputs
	const [name, setName] = useState<string>('')
	const [surname1, setSurname1] = useState<string>('')
	const [surname2, setSurname2] = useState<string>('')
	const [province, setProvince] = useState<string>('')
	const [provinceCode, setProvinceCode] = useState<string>('')
	const [town, setTown] = useState<string>('')
	const [townCode, setTownCode] = useState<string>('')
	const [showButton, setShowButton] = useState(true)
	const [zipCode, setZipCode] = useState<string>('');
	const [zipCodesList, setZipCodesList] = useState([] as any)
	const [streetId, setStreetId] = useState<string>('')
	const [streetType, setStreetType] = useState<string>('')
	const [streetName, setStreetName] = useState<string>('')
	const [number, setNumber] = useState<string>('')
	const [stair, setStair] = useState<string>('')
	const [floor, setFloor] = useState<string>('')
	const [door, setDoor] = useState<string>('')
	const [duplicator, setDuplicator] = useState<string>('')
	const [candidatesList, setCandidatesList] = useState([] as any)
	const [stateList, setStateList] = useState([] as any)
	const [selectedState, setSelectedState] = useState(0)
	const [showSupplyPoint, setShowSupplyPoint] = useState(false)
	const [suplyyPoint, setSuplyyPoint] = useState<undefined | SupplyPoint>(undefined)
	const [suplyyPointUser, setSuplyyPointUser] = useState()
	const [idAddress, setIdAddress] = useState<string>('')
	const [individualEntity, setIndividualEntity] = useState('')
	const [colectiveEntity, setcolectiveEntity] = useState('')
	const [socialReason, setSocialReason] = useState('')

	const [singularEntityInformed, setSingularEntityInformed] = useState(false)

	const [shouldReset, setShouldReset] = useState(false)
	const [addressData, setAddressData] = useState<iAddressFormData>({colEntity: null, indEntity: null, province: null, streetName: null, town: null})


	// fear not, these hooks are actually good for you
	const { errorStreetNames, getStreetNames, setParametersStreetNames, resetRetriesStreetNames, loadingStreetNames, streetNames, clearStreets, setGroupEntityParam, setSingularEntityParam } = useStreetNames({ provinceCode: provinceCode, townCode: townCode, streetName: streetName, streetType: '', groupEntityName: colectiveEntity, singularEntityName: individualEntity })
	const { errorIndividualEntities, getIndividualEntities, setParametersIndividualEntities, resetRetriesIE, individualEntities, loadingIdividualEntities } = useIndividualEntities(provinceCode, townCode, individualEntity, colectiveEntity, singularEntityInformed)
	const { collectiveEntities, errorCollectiveEntities, getCollectiveEntities, setParametersGroupEntities, resetRetriesGE, loadingCollectiveEntities } = useCollectiveEntities(provinceCode, townCode, colectiveEntity, singularEntityInformed)

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

	useEffect(() => {
		setParametersGroupEntities(props.cooldownTry, props.cooldownRetry, props.maxRetries);
		setParametersIndividualEntities(props.cooldownTry, props.cooldownRetry, props.maxRetries);
		setParametersTowns(props.cooldownTry, props.cooldownRetry, props.maxRetries);
		setParametersStreetNames(props.cooldownTry, props.cooldownRetry, props.maxRetries);
	}, [props.cooldownTry, props.cooldownRetry, props.maxRetries])

	const suplyPointShow = (suplyPoint: any, user: any) => {
		// activar ventana de suplypoint con los datos demà més i millor
		setSuplyyPoint(suplyPoint)
		setSuplyyPointUser(user)
		setShowSupplyPoint(true);
	}
	const newRequests = (): void => {
		setShowList(false)
		setShowSysyemError(false)
		setSupplyList([])
		dispatch(setSearchedUser({}))
		dispatch(thunkCancelSupplantUser())
	}
	const handleChangeSearch = (credential: string, name: string, surname1: string, idAddress: string, listAdd?: string[]): void => {
		newRequests();
		validateCredentials(credential, credentialType);
		if (!error) {
			if (credential !== '') {
				dispatch(thunkGetSearchedUser(credential, '', '', '', '', setIsLoadingList, () => {
					if (searchedUser && searchedUser.userId) {
						//revisar aixo amb la nova crida
						supplantUser(searchedUser, true);
					}
				}));
			} else if (name !== '' && surname1 !== '') {
				let documentNumber = '';
				dispatch(thunkGetListCustomers('', name, surname1, surname2, (response) => {
					if (response && response.customers && response.customers.items && response.customers.items[0] && response.customers.items[0].docNumber) {
						if (response.customers.items.length === 1) {
							documentNumber = response.customers.items[0].docNumber;
							if (documentNumber !== '') {
								setCredential(documentNumber);
								setCredentialType(checkDocumentTypeInString(documentNumber))
								dispatch(thunkGetSearchedUser(documentNumber, '', '', '', '', setIsLoadingList, () => {
									if (searchedUser && searchedUser.userId) {
										//revisar aixo amb la nova crida
										supplantUser(searchedUser, true);
									}
								}));
							}
						} else {
							let auxListCredentials = []
							response.customers.items.map((item) => {
								auxListCredentials.push(item.docNumber);
							})
							setCredentialList(auxListCredentials);
						}
					}
					setIsLoadingList(false);
					setLoading(false);
				}));
			} else if (idAddress !== '') {
				const supplyPointDefaultName = t('averias.management.searchCups.table.defaultName');
				setIsLoadingList(true);
				setLoading(true);
				//modificar la call para obtener lo susplypoints
				dispatch(thunkListSuppliesAdmin(supplyPointDefaultName, adminToken, '', idAddress, (response) => {
					if (response && response.supplypoints && response.supplypoints.length > 0) {
						const supplyPoints: SupplyPoint[] = response.supplypoints;
						let docNumber = supplyPoints[0].holderDocumentNumber
						setCredential(docNumber);
						setCredentialType(checkDocumentTypeInString(docNumber));
						setSupplyList(supplyPoints);
						setShowList(true);
						dispatch(thunkGetSearchedUser(docNumber, '', '', '', '', setIsLoadingList, () => {
							if (searchedUser && searchedUser.userId) {
								//revisar aixo amb la nova crida
								supplantUser(searchedUser, false);
							}
						}));
					} else {
						setShowSysyemError(true);
					}
					setIsLoadingList(false);
					setLoading(false);
				}));
			} else if (listAdd.length > 0) {
				const supplyPointDefaultName = t('averias.management.searchCups.table.defaultName');
				setIsLoadingList(true);
				dispatch(thunkListSuppliesAdmin(supplyPointDefaultName, adminToken, '', listAdd, (response) => {
					if (response && response.supplypoints && response.supplypoints.length > 0) {
						const supplyPoints: SupplyPoint[] = response.supplypoints;
						setSupplyList(supplyPoints);
						setShowList(true);
						// no da errro pero no hay resultados
					} else {
						setShowSysyemError(true);
					}
					setIsLoadingList(false);
					setLoading(false);
				}));
			} else {
				if (name !== '' || surname1 !== '' || surname2 !== '') {
					let documentNumber = '';
					dispatch(thunkGetListCustomers('', name, surname1, surname2, (response) => {
						if (response && response.customers && response.customers.items && response.customers.items[0] && response.customers.items[0].docNumber) {
							if (response.customers.items.length === 1) {
								documentNumber = response.customers.items[0].docNumber;
								if (documentNumber !== '') {
									setCredential(documentNumber);
									setCredentialType(checkDocumentTypeInString(documentNumber))
									dispatch(thunkGetSearchedUser(documentNumber, '', '', '', '', setIsLoadingList, () => {
										if (searchedUser && searchedUser.userId) {
											//revisar aixo amb la nova crida
											supplantUser(searchedUser, true);
										}
									}));
								}
							} else {
								let auxListCredentials = []
								response.customers.items.map((item) => {
									auxListCredentials.push(item.docNumber);
								})
								setCredentialList(auxListCredentials);
							}
						}
						setIsLoadingList(false);
						setLoading(false);
					}));
				}
			}
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
				if (province === '' && town === '' && zipCode === '' && number === '' /*&& stair === '' && floor === '' && door === ''*/) {
					setSupplyList(supplyPoints);
				} else {
					let auxList = []
					if (province !== '' && town !== '' && zipCode !== '' && number !== '') {
						response.supplypoints.map((item) => {
							if ((item.address.province === province) &&
								(item.address.town === town) &&
								(item.address.zipCode === zipCode) &&
								(Number(item.address.number) === Number(number))) {
								auxList.push(item);
							}
						})
					} else if (province !== '' && town !== '' && zipCode !== '' && number === '') {
						response.supplypoints.map((item) => {
							if ((item.address.province === province) &&
								(item.address.town === town) &&
								(item.address.zipCode === zipCode)) {
								auxList.push(item);
							}
						})
					} else {
						response.supplypoints.map((item) => {
							if ((item.address.province === province) ||
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
				setLoading(false)
				// no da errro pero no hay resultados
			}
			// hay error de sistema
			else {
				setShowSysyemError(true)
			}
			setIsLoadingList(false)
			setLoading(false)
		}));
	}
	const formatText = (text: string): string => {
		return (text.substring(0, 1) + text.substring(1, text.length).toLowerCase())
	}

	useEffect(() => {
		if (searchedUser && searchedUser.userId) {
			let auxSurnames = searchedUser.surName.split(' ')
			supplantUser(searchedUser, idAddress === '' ? true : false)
			setName(searchedUser.name ? formatText(searchedUser.name) : '')
			setSurname1(auxSurnames[0] ? formatText(auxSurnames[0]) : '')
			if (auxSurnames.length > 1) {
				setSurname2(auxSurnames[1] ? formatText(auxSurnames[1]) : '')
			}
		}
	}, [searchedUser]);
	useEffect(() => {
		if (number !== '' && streetType !== '' && streetName !== '' && province !== '' && town !== '') {
			setShowButton(false)
		} else {
			setShowButton(true)
		}
	}, [number, streetType, streetName, province, town])

	const searchDisabled = () => {
		if(error === false && 
			(credential !== '' || 
			(idAddress !== '' || 
				(town !== '' && province !== '' && zipCode !== '' && streetType !== '' && streetName !== '' && number !== '')) ||
			(name !== '' || surname1 !== '') || 
			(socialReason !== '')
			)
		){
			return false
		}
		return true
	}
	
	const performSearch = (address?: string): void => {
		if (credential !== '' && idAddress === '') {
			handleChangeSearch(credential, '', '', '')
		} else if ((name !== '' || surname1 !== '' || socialReason!== '' || surname2 !== '') && idAddress === '') {
			handleChangeSearch('', name? name : '', surname1 ? surname1 : socialReason? socialReason : '', '', [])
		} else if (idAddress !== '' || (address !== '' && address.toString() !== '[object Object]')) {
			if (idAddress !== '') {
				handleChangeSearch('', '', '', idAddress)
			} else {
				handleChangeSearch('', '', '', address)
			}
		} else {

			dispatch(thunkGetListAddresses(streetId, number, '', (response) => {
				if (response && response.streets && response.streets.items && response.streets.items.length > 0) {
					const auxList = []
					response.streets.items.map((item, index) => {
						auxList.push(item.addId)
					})
					handleChangeSearch('', '', '', '', auxList)
				} else {
				}
			}));
		}
		setLoading(true)
		setIsLoadingList(true);

		// LCS: Lanzamos el evento - Wave 2
		sendGAEvent({
			event: 'search_incident_report',
			user_id: sessionStorage.getItem('id'),
			user_type: sessionStorage.getItem('user_type'),
		  });

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
						setProvince(response.zipCodes.items[0].provinceName)
						setTown(response.zipCodes.items[0].items[0].municipalityName)
						setZipCodesList([])
					}
				}));
			}
		} else if (input === 'state') {
			setProvinceCode(provinces.find(provinceItem => provinceItem.provinceName.toLowerCase().includes(value.toLowerCase()))?.provinceCode)

			setProvince(input)
		} else if (input === 'town') {
			// municipio
			setTown(value)
		} else if (input === 'streetType') {
			// tipo de via
			if (value == t('averias.management.searchCups.address.select')) {
				setStreetType('')
			}
			else {
				setStreetType(value)
			}
			//setStreetType(value)
		} else if (input === 'streetName') {
			// nombre de via
			setStreetName(value)
			// if (value.length > 3) {
			// 	checkStreetName()
			// 	onInput()
			// } else {
			// 	setCandidatesList([])
			// }
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
		} else if (input === 'duplicator'){
			setDuplicator(value)
		}
		 else if (input === 'credential') {
			let auxValue = value.trim()
			setCredential(auxValue)
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
		}
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
	const handleCloseLocationDialog = () => {
		setIsLocationModalVisible(false)
	}
	const handleAcceptLocationDialog = (key) => {
		const selected = stateList[key];
		setStair(selected.stair || '');
		setFloor(selected.floor || '');
		setDoor(selected.door || '');
		setDuplicator(selected.portal || '');
		setNumber(selected.addNumber || '')
		setIdAddress(selected.addId);
		setZipCode(selected.zipCode);
		setIsLocationModalVisible(false);
		setIsSFDVisible(true);
		performSearch(selected.addId);
	}
	const handleCancel = () => {
		return <Redirect to='/profile' />
	}
	const resetFilters = () => {
		setCredential('')
		setName('')
		setSurname1('')
		setSurname2('')
		setProvince('')
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
		setDuplicator('')
		setProvinceCode('')
		setIdAddress('')
		setShowInterruptions(false)
		setNoResults(false)
		setError(false)
		setSupplyList([])
		setIncidencesList([])
		setCredentialList([])
		setCandidatesList([])
		setShowList(false)
		setShowSupplyPoint(false)
		setNoResults(false)
		resetRetriesGE()
		resetRetriesIE()
		// resetRetriesProvinces()
		resetRetriesStreetNames()
		resetRetriesTowns()
		setSuplyyPoint(undefined)
		setShouldReset(true)

	}
	//Funcion para detectar cuando seleccionamos un elemento del datalist de streetNames
	const [totalPages, setTotalPages] = useState(0)
	const [currentPage, setCurrentPage] = useState(0)
	const [itemsPerPage, setItemsPerPage] = useState(20)

	useEffect(() => {
		if (supplyList) {
			setTotalPages(supplyList.length === 0 ? 1 : Math.ceil(supplyList.length / itemsPerPage))
		}
		// eslint-disable-next-line
	}, [supplyList, itemsPerPage])
	useEffect(() => {
		if (selectedTab == 0) { setShowTab(false) } else { setShowTab(true) }
	}, [selectedTab])

	const socialReason_disabled = () => {
		if ((name !== '' && name !== undefined) || (surname1 !== '' && surname1 !== undefined) || (surname2 !== '' && surname2 !== undefined) || (!validateCIF(credential) && credential !== '')) {
			return true
		}
		return false
	}

	const name_disabled = () => {
		if (socialReason !== '' || (validateCIF(credential) && credential !== '')) {
			return true
		}
		return false
	}


	return (
		<Grid container md={12} style={{ display: (!showTab) ? 'none' : '' }}>
			<Grid item md={12} className={`${styles.inputsArea} ${styles.searchContainer}`}>
				<Grid container className={styles.inputsArea}>
					<Grid container className={styles.inputsArea}>
						<div className={styles.titleWrapper}>
							<span className={styles.searchTitle}>{t('averias.management.searchCups.holder')}</span>
						</div>
						<Grid container xs={12} sm={12} md={12} spacing={3}>
							<Grid item xs={4} sm={4}>
								<span className={error ? styles.inputTitleError : styles.inputTitle}>{t('averias.management.searchCups.doc')}</span>
								<input
									list='docUsuario'
									className={error ? styles.inputV4Error : styles.inputV4}
									value={credential}
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
								<span className={styles.inputTitle}>{t('averias.management.searchCups.socialReason')}</span>
								{
									socialReason_disabled() ? (
										<Input
											className={styles.inputV2}
											value={socialReason}
											onChange={({ target }) => {
												setSocialReason(target.value)
											}}
											disabled
										/>
									) : (
										<Input
											className={styles.inputV2}
											value={socialReason}
											onChange={({ target }) => {
												setSocialReason(target.value)
											}}
										/>
									)
								}
							</Grid>
							<Grid item xs={4} sm={4} />
							<Grid item xs={4} sm={4}>
								<span className={styles.inputTitle}>{t('averias.management.searchCups.name')}</span>
								{
									name_disabled() ? (
										<Input
											className={styles.inputV2}
											value={name}
											onChange={({ target }) => {
												setName(target.value)
											}}
											disabled
										/>
									) : (
										<Input
											className={styles.inputV2}
											value={name}
											onChange={({ target }) => {
												setName(target.value)
											}}
										/>
									)
								}
							</Grid>
							<Grid item xs={4} sm={4}>
								<span className={styles.inputTitle}>{t('averias.management.searchCups.firstSurname')}</span>
								{
									name_disabled() ? (
										<Input
											className={styles.inputV2}
											value={surname1}
											onChange={({ target }) => {
												setSurname1(target.value)
											}}
											disabled
										/>
									) : (
										<Input
											className={styles.inputV2}
											value={surname1}
											onChange={({ target }) => {
												setSurname1(target.value)
											}}
										/>
									)
								}
							</Grid>
							<Grid item xs={4} sm={4}>
								<span className={styles.inputTitle}>{t('averias.management.searchCups.secondSurname')}</span>
								{
									name_disabled() ? (
										<Input
											className={styles.inputV2}
											value={surname2}
											onChange={({ target }) => {
												setSurname2(target.value)
											}}
											disabled
										/>
									) : (
										<Input
											className={styles.inputV2}
											value={surname2}
											onChange={({ target }) => {
												setSurname2(target.value)
											}}
										/>
									)
								}
							</Grid>
						</Grid>
					</Grid>
				</Grid>
				<Grid container className={styles.inputsArea}>
					<SearchByAddress
						collectiveEntities={collectiveEntities}
						cooldownTry={props.cooldownTry}
						handleChangeInput={handleChangeInput}
						handleSearchButton={handleSearchButton}
						individualEntities={individualEntities}
						loadingStatesList={props.loadingProvinces}
						loadingTowns={props.loadingTowns}
						number={number}
						statesList={provinces}
						streetNames={streetNames}
						streetType={streetType}
						towns={props.towns}
						tracksList={tracksList}
						zipCode={zipCode}
						zipCodesList={zipCodesList}
						onReset={()=>setShouldReset(false)}
						reset={shouldReset}
						onUpdate={(addressData)=>setAddressData(addressData)}
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
						colEntity={colectiveEntity}
						getTowns={getTowns}
						indEntity={individualEntity}
						province={provinceCode}
						town={town}
						townCode={townCode}
						getStreetNames={getStreetNames}
						streetName={streetName}
						supplyPoint={suplyyPoint}
						clearStreets={clearStreets}
						resetTown={false}
						offResetTown={() => {}}
					/>
				</Grid>
				<Grid container className={styles.inputsArea}>
					{noResults && <AlertMessage onClose={()=>setNoResults(false)} text={t('averias.management.incidence.insertContactData.noResults')}/>
						// <Grid className={styles.searchResult}>
						// 	<Grid container direction='row'>
						// 		<Grid direction='column'><img src={InfoIcon} className={styles.icon} alt='' /></Grid>
						// 		<Grid direction='column' className={styles.bluetext}>{t('averias.management.incidence.insertContactData.noResults')}</Grid>
						// 		<Grid direction='column'><img src={CloseIcon} className={styles.closeButton} alt='' onClick={() => setNoResults(false)} /></Grid>
						// 	</Grid>
						// </Grid>
					}
					{isSFDVisible &&
						<>
							<Grid container xs={11} sm={10} md={12} spacing={2}>
							<Grid item xs={12} className={styles.sfdContainer}>
									<p className={styles.inputTitle}>{t('averias.management.searchCups.address.duplicator')}</p>
									<Input
										className={styles.inputV2_SFD}
										value={duplicator}
										onChange={(e) => handleChangeInput('duplicator', e.target.value)}
									/>
								</Grid>
								<Grid item xs={12} className={styles.sfdContainer}>
									<p className={styles.inputTitle}>{t('averias.management.searchCups.address.stair')}</p>
									<Input
										className={styles.inputV2_SFD}
										value={stair}
										onChange={(e) => handleChangeInput('stair', e.target.value)}
									/>
								</Grid>
								<Grid item xs={12} className={styles.sfdContainer}>
									<p className={styles.inputTitle}>{t('averias.management.searchCups.address.floor')}</p>
									<Input
										className={styles.inputV2_SFD}
										value={floor}
										onChange={(e) => handleChangeInput('floor', e.target.value)}
									/>
								</Grid>
								<Grid item xs={12} className={styles.sfdContainer}>
									<p className={styles.inputTitle}>{t('averias.management.searchCups.address.door')}</p>
									<Input
										className={styles.inputV2_SFD}
										value={door}
										onChange={(e) => handleChangeInput('door', e.target.value)}
									/>
								</Grid>
							</Grid>
						</>
					}
				</Grid>
				<Grid container xs={12} direction='row' justifyContent='center' spacing={3} className={styles.buttonsContainer}>
					<Grid item>
						<Button
							className={styles.cancelButton}
							text={t('common.buttons.cancel')}
							color='inherit'
							size='large'
							variant='contained'
							onClick={resetFilters}
						/>
					</Grid>
					<Grid item>
						<Button
							className={styles.button}
							text={t('common.buttons.search')}
							color='primary'
							size='large'
							variant='contained'
							disabled={searchDisabled()}
							onClick={performSearch}
						/>
					</Grid>
					<Grid item>
						<p className={styles.link} onClick={resetFilters}>
							{t('averias.management.searchCups.resetFilters')}
						</p>
					</Grid>
				</Grid>
				{/*(isLoadingList) &&
                    <span className={styles.loadingContainer}>
                        <img alt='' src={LoadingAnimation} className={styles.loadingImg} />
                        <span className={styles.loadingText}>
                            {t('averias.management.searchCups.buscar')}
                        </span>
                    </span>
                */}
			</Grid>
			{(showList) &&
				<Grid item md={12} className={styles.searchResultContainer}>
					{(!isLoadingList) &&
						<>
							{(supplyList.length === 0) ?
								<Grid className={styles.alertContainer}>
									<img src={AlertIcon} />
									<div className={styles.alertTitle}>
										{t('averias.management.searchCups.noResults')}
									</div>
								</Grid>
								:
								<Grid container className={styles.table}>
									<ExpansionPanel defaultExpanded classes={{ root: styles.MuiExpansionPanel }} >
										<ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />}>
											<Typography className={styles.expansionPanelSummaryText}>
												{
													supplyList.length > 20 && totalPages > 1 && (currentPage + 1) === totalPages ?
														<Grid container>
															{supplyList.slice((currentPage * itemsPerPage), ((currentPage * itemsPerPage) + itemsPerPage)).length + t('averias.management.consult.resultadosDe') + supplyList.length}
														</Grid>
														:
														supplyList.length > 20 && totalPages > 1 ?
															<Grid container>
																{supplyList.slice((currentPage * itemsPerPage), ((currentPage * itemsPerPage) + itemsPerPage)).length + t('averias.management.consult.resultadosDe') + supplyList.length}
															</Grid>
															:
															<Grid container>
																{supplyList.length + ((supplyList.length > 1 || supplyList.length === 0) ? t('averias.management.consult.resultados') : t('averias.management.consult.resultado'))}
															</Grid>
												}
											</Typography>
										</ExpansionPanelSummary>
										<ExpansionPanelDetails style={{ padding: '0' }}>
											{
												(mobile) ?
													<MosaicSupplies listItems={supplyList} setFinalList={setSupplyList} currentPage={currentPage} setCurrentPage={setCurrentPage} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} totalPages={totalPages} setSupply={setSupply} />
													:
													<ListSupplies listItems={supplyList} setFinalList={setSupplyList} currentPage={currentPage} setCurrentPage={setCurrentPage} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} totalPages={totalPages} setSupply={setSupply} />
											}



										</ExpansionPanelDetails>
									</ExpansionPanel>
								</Grid>
							}
						</>
					}
				</Grid>
			}
			{showSystemError &&
				<Grid item md={12} className={styles.searchResultContainer}>
					{(!isLoadingList) &&
						<>
							<Grid className={styles.alertContainer}>
								<img src={AlertIcon} />
								<div className={styles.alertTitle}>
									{t('averias.management.searchCups.noResults')}
								</div>
							</Grid>
						</>
					}
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
	);
}
export default SearchIncidence;
