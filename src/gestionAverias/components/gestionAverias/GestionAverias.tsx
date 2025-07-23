import React, { Dispatch, useEffect, useState } from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import Spinner from '../../../common/components/spinner/Spinner';
import SearchCups from '../averiasNavigation/searchCups/SearchCups';
import Form from '../averiasNavigation/incidencia/form/Form';
import { useProvinces } from '../averiasNavigation/searchCups/hooks/useProvinces'
import { useTowns } from '../averiasNavigation/searchCups/hooks/useTowns'
import Management from '../averiasNavigation/management/Management';
import FailureManagementNavbar from '../failure-management-navigation/FailureManagementNavigation';
import { thunkGetMasterData } from '../../actions/GestionAveriasThunkActions'

import Grid from '@material-ui/core/Grid';
import useStyles from './GestionAverias.styles';

import UserProfile from '../../../common/interfaces/UserProfile';
// LCS: Importa la función - Wave 2
import { removeEmails, sendGAEvent } from '../../../core/utils/gtm';

const GestionAverias = (props: any) => {

	const [isLoading] = useState<boolean>(false);
	const [user, setUser] = useState<UserProfile>();
	const [tabValue, setTabValue] = useState<number>(0);
	let token = sessionStorage.getItem('token')
	let userRoles = sessionStorage.getItem('userRoles') || ''
	let userRolesArray = userRoles.split(',')

	const tabletRes = useMediaQuery('(max-width:768px)')
	const mobileRes = useMediaQuery('(max-width:576px)')
	const [cooldownTry, setCooldownTry] = useState(3000)
	const [cooldownRetry, setCooldownRetry] = useState(3000)
	const [maxRetries, setMaxRetries] = useState(1)
	const [autoConsultaContador, setAutoConsultaContador] = useState(false)
	const [enabledStateArray, setEnabledStateArray] = useState([] as any)
	const [monofReadingTypeIds, setMonofReadingTypeIds] = useState('')
	const [trifaReadingTypeIds, setTrifaReadingTypeIds] = useState('')
	const [meterConsultTimeout, setMeterConsultTimeout] = useState('')
	const [meterRearmTimeout, setMeterRearmTimeout] = useState('')
	const [maxResultsOptions, setMaxResultsOptions] = useState('100')
	const [closedOnCreationSRs, setclosedOnCreationSRs] = useState([])
	//const statusList = ['PENDIENTE', 'ASOCIADO INC. ABIERTA', 'ASOCIADO INC. CERRADA', 'DESESTIMADO']
	const [statusList, setStatusList] = useState([] as any)

	const { provinces, loadingProvinces, errorProvinces, getProvinces, setParametersProvinces, resetRetriesProvinces } = useProvinces()
	const { errorTowns, getTowns, setParametersTowns, resetRetriesTowns, loadingTowns, towns, setProvinceCodeTowns, setInformedTownsExternal, setTownNameExternal, clearTowns } = useTowns(false, false);

	const dispatch = useDispatch()
	const { t } = useTranslation();
	const styles = useStyles({});
	const [maxTry, setMaxTry] = useState('')
	const [typeList, setTypeList] = useState([])
	const [scopeList, setScopeList] = useState([])
	const [motiveList, setMotiveList] = useState([])

	useEffect(() => {
		// LCS: Enviar evento de GdC a GA - Wave 3
		sendGAEvent({
		  event: 'view',
		  content_group: 'gestion de avisos e incidencias',
		  page_url: removeEmails(window.location.href),
		  user_id: sessionStorage.getItem('id'),
		  previous_path: removeEmails(sessionStorage.getItem("previousPage")),
		  user_type: sessionStorage.getItem('user_type'),
		  browsing_type: sessionStorage.getItem('browsing_type'),
		  element_type: 'medicion de pagina',
		  ga_client_id: sessionStorage.getItem('ga_client_id'),
		  cups: 'no aplica',
		  supply_type: 'no aplica'
		});
		sessionStorage.setItem("previousPage", window.location.href);
	  },[])

	useEffect(() => {
		try {
			if (props.location.state !== undefined) {
				setUser(props.location.state.user);
			} 
		} catch (e) {
			// LCS: Enviar evento a GA - Wave 2
			sendGAEvent({
				event: 'react_error',
				info:{
				error_message: 'Fallo a la hora de asignar el usuario',
				error: e,
				reactComponent: 'GestionAverias.tsx - useEffect',
				}
			});
		}
		
	}, [props.location]);

	useEffect(() => {

		try {
			const fetchData = async () => {
				const response = dispatch(thunkGetMasterData('API_TIMEOUT', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), 'METER_', (response) => {
					let consultAux
					let rearmAux
					if (response && response.length > 0) {
						const meterConsultTimeoutAux = response.filter(item => item.key === 'METER_CONSULTAR')[0].value
						const meterRearmTimeoutAux = response.filter(item => item.key === 'METER_REARMAR')[0].value
						if (meterConsultTimeoutAux && meterRearmTimeoutAux) {
							consultAux = meterConsultTimeoutAux
							rearmAux = meterRearmTimeoutAux
						} else {
							consultAux = process.env.REACT_APP_API_TIMEOUT_METER_CONSULT
							rearmAux = process.env.REACT_APP_API_TIMEOUT_METER_REARM
						}
					} else {
						consultAux = process.env.REACT_APP_API_TIMEOUT_METER_CONSULT
						rearmAux = process.env.REACT_APP_API_TIMEOUT_METER_REARM
					}
					setMeterConsultTimeout(consultAux)
					setMeterRearmTimeout(rearmAux)
				}))
			};

			fetchData();

		} catch (e) {
			// LCS: Enviar evento a GA - Wave 2
			sendGAEvent({
				event: 'react_error',
				info:{
				error_message: 'Fallo a la hora de hacer fetchData1',
				error: e,
				reactComponent: 'GestionAverias.tsx - useEffect',
				}
			});
		}

	}, [])

	useEffect(() => {

		try {
			const fetchData = async () => {
				const response = dispatch(thunkGetMasterData('METER_RT_AVERIAS_ID', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), null, (response) => {
					let monofReadingTypeIdsAux = ''
					let trifaReadingTypeIdsAux = ''
					if (response && response.length > 0) {
						response.map(item => {
							if (item.key === 'FASE_MONOF') {
								return monofReadingTypeIdsAux = monofReadingTypeIdsAux === '' ? item.value : monofReadingTypeIdsAux + ',' + item.value
							} else {
								return trifaReadingTypeIdsAux = trifaReadingTypeIdsAux === '' ? item.value : trifaReadingTypeIdsAux + ',' + item.value
							}
						})

						setMonofReadingTypeIds(monofReadingTypeIdsAux)
						setTrifaReadingTypeIds(trifaReadingTypeIdsAux)
					}
				}))
			};

		fetchData();

		} catch (e) {
			// LCS: Enviar evento a GA - Wave 2
			sendGAEvent({
				event: 'react_error',
				info:{
				error_message: 'Fallo a la hora de hacer fetchData2',
				error: e,
				reactComponent: 'GestionAverias.tsx - useEffect',
				}
			});
		}

	}, [])

	useEffect(() => {

		try {
			if (!props.loadingProvinces) {
				getProvinces();
			}
			const fetchData = async () => {
				dispatch(thunkGetMasterData('ENABLED_PROVINCE_LIST', 'ES', 'PROVINCES', (response: { value: string }[] | undefined) => {
					if (response && response[0] && response[0].value) {
						setEnabledStateArray(response[0].value.split(','));
					}
				}));
			};
	
			fetchData();

		} catch (e) {
			// LCS: Enviar evento a GA - Wave 2
			sendGAEvent({
				event: 'react_error',
				info:{
				error_message: 'Fallo al cargar las provincias',
				error: e,
				reactComponent: 'GestionAverias.tsx - useEffect',
				}
			});

		}

	}, [])


	useEffect(() => {

		try {

			const fetchData = async () => {
				const response = dispatch(thunkGetMasterData('AVERIAS_ADMIN', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), null, (response) => {
					if (response && response.length > 0) {
						for (let i = 0; i < response.length; i++) {
							if (response[i].key === 'USER_TIME_END_SEARCH') {
								setCooldownTry(parseInt(response[i].value))
							}
							else if (response[i].key === 'USER_TIME_RETRY_SEARCH') {
								setCooldownRetry(parseInt(response[i].value))
							}
							else if (response[i].key === 'USER_CALLEJERO_N_RETRIES') {
								setMaxRetries(parseInt(response[i].value))
							}
							else if (response[i].key === 'AUTO_CONSULTA_CONTADOR') {
								setAutoConsultaContador(response[i].value === '1')
							}
							else if (response[i].key === 'MAX_RESULTS_OPTIONS') {
								setMaxResultsOptions(response[i].value)
							}
						}
						setParametersProvinces(props.cooldownTry, props.cooldownRetry, props.maxRetries);
						setParametersTowns(props.cooldownTry, props.cooldownRetry, props.maxRetries);
					}
					dispatch(thunkGetMasterData('SGI_PARAM_TYPE', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), '', (response) => {
						if (response && response.length > 0) {
							let selectTypeList = []
							response.map((item) => {
								selectTypeList.push(item.key + '|' + item.value)
							})
							setTypeList(selectTypeList)
						}
					}))

					dispatch(thunkGetMasterData('SGI_PARAM_SCOPE', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), '', (response) => {
						if (response && response.length > 0) {
							let selectScopeList = []
							response.map((item) => {
								selectScopeList.push(item.key + '|' + item.value)
							})
							setScopeList(selectScopeList)
						}
					}))

					dispatch(thunkGetMasterData('SGI_PARAM_MOTIVE', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), '', (response) => {
						if (response && response.length > 0) {
							let selectMotiveList = []
							response.map((item) => {
								selectMotiveList.push(item.key + ' - ' + item.value)
							})
							setMotiveList(selectMotiveList)
						}
					}))

					dispatch(thunkGetMasterData('SR_CLOSED_ON_CREATION', 'ES', 'TIPOLOGIES', (response) => {
						if (response) {
							setclosedOnCreationSRs(response[0].value)
						}
					}))

					dispatch(thunkGetMasterData('AVERIAS_ADMIN', 'ES', 'SR_FAIL_MAX_TRY', (r) => {
						if (r && r.length > 0) {
							setMaxTry(r[0].value)
						} else if (r && r.length === 0) {
							setMaxTry('0')
						}
					}))

					dispatch(thunkGetMasterData('PARAM_ESTADO_AVISOS', 'ES', 'ESTADO', (response) => {
						if (response[0].value === '0') {
							//SGC
							dispatch(thunkGetMasterData('ESTADO_AVISO', 'ES', 'SGI', (response) => {
								if (response && response.length > 0) {
									let selectList = []
									response.map((item) => {
										selectList.push(item.value)
									})
									setStatusList(selectList)
								}
							}))
						} else {
							//ADMS
							dispatch(thunkGetMasterData('ESTADO_AVISO', 'ES', 'ADMS', (response) => {
								if (response && response.length > 0) {
									let selectList = []
									response.map((item) => {
										selectList.push(item.value)
									})
									setStatusList(selectList)
								}
							}))
						}
					}))
				}))
			};

			fetchData();
		} catch (e) {
			// LCS: Enviar evento a GA - Wave 2
			sendGAEvent({
				event: 'react_error',
				info:{
				error_message: 'Fallo a la hora de hacer fetchData3',
				error: e,
				reactComponent: 'GestionAverias.tsx - useEffect',
				}
			});
		}

	}, [])

	useEffect(() => {
		try {
			if (errorProvinces) {
				resetRetriesProvinces()
			}
		} catch (e) {
			// LCS: Enviar evento a GA - Wave 2
			sendGAEvent({
				event: 'react_error',
				info:{
				error_message: 'Fallo al reintentar cargar las provincias',
				error: e,
				reactComponent: 'GestionAverias.tsx - useEffect',
				}
			});
		}
	}, [errorProvinces])

	if (!token) {
		return <Redirect to='/login' />
	}

	if (!userRolesArray.includes('US_CC')) {
		if (userRolesArray.includes('US_SUPPLYPOINT_CLIENT') || userRolesArray.includes('US_MANAGER') || userRolesArray.includes('US_CC')) {
			return <Redirect to='/dashboard' />
		} else if (userRolesArray.includes('US_CONSULTANT')) {
			return <Redirect to='/supplies' />
		} else {
			return <Redirect to='/landing' />
		}
	}

	return (
		<>
			{(isLoading) &&
				<Spinner fixed={true} />
			}

			<Grid container justify='center' alignItems='center' className={styles.container}>
				<Grid container justify='center' alignItems='center' xs={11} sm={10} className={styles.maxWidthForBigScreens}>
					<Grid item className={styles.headerTitle}>
						{t('averias.management.header.title')}
					</Grid>

					<FailureManagementNavbar tabValue={tabValue} setTabValue={setTabValue} tabletRes={tabletRes} mobileRes={mobileRes} />

					<Grid container justify='flex-start' className={styles.subContainer}>

						{(tabValue === 0) &&
							<SearchCups
								user={user}
								tabletRes={tabletRes}
								mobileRes={mobileRes}
								cooldownTry={cooldownTry}
								cooldownRetry={cooldownRetry}
								maxRetries={maxRetries}
								maxResultsOptions={maxResultsOptions}
								maxTryParam={maxTry}
								closedSRTipo={closedOnCreationSRs}
								typeListParam={typeList}
								scopeListParam={scopeList}
								motiveListParam={motiveList}
								autoConsultaContadorParam={autoConsultaContador}
								enabledStateArray={enabledStateArray}
								monofReadingTypeIds={monofReadingTypeIds}
								trifaReadingTypeIds={trifaReadingTypeIds}
								meterConsultTimeout={meterConsultTimeout}
								meterRearmTimeout={meterRearmTimeout}
								provinces={provinces}
								getProvinces={getProvinces}
								errorProvinces={errorProvinces}
								loadingProvinces={loadingProvinces}
								loadingTowns={loadingTowns}
								errorTowns={errorTowns}
								getTowns={getTowns}
								setParametersTowns={setParametersTowns}
								resetRetriesTowns={resetRetriesTowns}
								towns={towns}
								setProvinceCodeTowns={setProvinceCodeTowns}
								setInformedTownsExternal={setInformedTownsExternal}
								setTownNameExternal={setTownNameExternal}
								clearTowns={clearTowns}
							/>
						}

						{(tabValue === 1) &&
							<Form
								cooldownTry={cooldownTry}
								cooldownRetry={cooldownRetry}
								maxRetries={maxRetries}
								maxTry={maxTry}
								closedSRTipo={closedOnCreationSRs}
								typeList={typeList}
								provinces={provinces}
								getProvinces={getProvinces}
								resetRetriesProvinces={resetRetriesProvinces}
								loadingProvinces={loadingProvinces}
								errorProvinces={errorProvinces}
								scopeList={scopeList}
								motiveList={motiveList}
								errorTowns={errorTowns}
								getTowns={getTowns}
								setParametersTowns={setParametersTowns}
								resetRetriesTowns={resetRetriesTowns}
								loadingTowns={loadingTowns}
								towns={towns}
								setProvinceCodeTowns={setProvinceCodeTowns}
								setInformedTownsExternal={setInformedTownsExternal}
								setTownNameExternal={setTownNameExternal}
								clearTowns={clearTowns}
							/>
						}

						{(tabValue === 2) &&
							<Management
								cooldownTry={cooldownTry}
								cooldownRetry={cooldownRetry}
								maxRetries={maxRetries}
								maxTry={maxTry}
								typeList={typeList}
								scopeList={scopeList}
								provinces={provinces}
								getProvinces={getProvinces}
								statusList={statusList}
								errorProvinces={errorProvinces}
								loadingProvinces={loadingProvinces}
								errorTowns={errorTowns}
								getTowns={getTowns}
								setParametersTowns={setParametersTowns}
								resetRetriesTowns={resetRetriesTowns}
								loadingTowns={loadingTowns}
								towns={towns}
								setProvinceCodeTowns={setProvinceCodeTowns}
								setInformedTownsExternal={setInformedTownsExternal}
								setTownNameExternal={setTownNameExternal}
								clearTowns={clearTowns}
							/>
						}
					</Grid>
				</Grid>
			</Grid>
		</>
	);
}

export default GestionAverias;
