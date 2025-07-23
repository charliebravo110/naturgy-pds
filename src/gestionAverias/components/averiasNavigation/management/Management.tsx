import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import SwipeableViews from 'react-swipeable-views'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
import { StyledTabSelector, StyledTab } from '../../../../common/components/styled-tab-selector/StyledTabSelector'
import { StyledMobileTab } from '../../../../common/components/styled-tab-selector/styled-tab-selector-mobile/StyledTabSelectorMobile'
import DynamicSearcher from '../../../../common/components/searcher/DynamicSearcher'
import Spinner from '../../../../common/components/spinner/Spinner'
import useStyles, {
	ExpansionPanel,
	ExpansionPanelSummary,
	StyledExpandMoreIcon,
	ExpansionPanelDetails
} from './Management.styles';
import AlertIconWarnings from '../../../../assets/icons/incidencia.svg';
import AlertIcon from '../../../../assets/icons/aviso_alerta_pop_up.svg';
import UserProfile from '../../../../common/interfaces/UserProfile';
import { formatDateWarnings } from '../../../../common/lib/FormatLib';
import { thunkGetListIncidence, thunkGetListInterruptions, thunkGetMasterData } from '../../../../supplies/supplies-details/store/actions/SuppliesDetailsThunkActions';
import List from './list/List'
import ListIncidences from './list/ListIncidencias'
import SearchIncidence from './searchBy/SearchIncidence'
import SearchWarnings from './searchBy/SearchWarnings'
import { thunkGetListWarnings } from '../../../actions/GestionAveriasThunkActions';
import Mosaic from './mosaic/mosaic';
import AveriasUtils from '../../../utils/AveriasUtilsClass';

// LCS: Importamos la función - Wave 2
import { sendGAEvent } from '../../../../core/utils/gtm';

interface SearchCupsProps {
	user?: UserProfile;
	cooldownTry: number;
	cooldownRetry: number;
	maxRetries: number;
	maxTry: string;
	statusList: string;
	typeList: Array<any>;
	scopeList: Array<any>;
	provinces : Array<any>;	
	getProvinces : Function;
	errorProvinces : boolean;
	loadingProvinces : boolean;
	errorTowns : boolean;
	getTowns : any;
	setParametersTowns : any;
	resetRetriesTowns : any;
	loadingTowns : boolean;
	towns : Array<any>;	
	setProvinceCodeTowns : any;
	setInformedTownsExternal : any;
	setTownNameExternal : any;
	clearTowns : any;
}
const Management = (props: SearchCupsProps) => {
	const styles = useStyles({});
	const theme = useTheme()
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const mobile = useMediaQuery(theme.breakpoints.down('sm'))
	const [statusError, setStatusError] = useState<boolean>(false);
	const [showList, setShowList] = useState<boolean>(false);
	const [isLoadingList, setIsLoadingList] = useState<boolean>(false);
	const [warningsList, setWarningsList] = useState([] as any)
	const [incidencesList, setIncidencesList] = useState([] as any)
	const [copyWarningsList, setCopyWarningsList] = useState([] as any)
	const [statesList, setStatesList] = useState([] as any)
	// Form inputs listwarnings
	const [province, setProvince] = useState<string>('');
	const [zone, setZone] = useState<string>('');
	const [status, setStatus] = useState<string>('');
	const [statusCode, setStatusCode] = useState<string>('');
	const [zoneCode, setZoneCode] = useState<string>('');
	const [listWarningsError, setListWarningsError] = useState<boolean>(false)
	const [nonResponse, setNonResponse] = useState<boolean>(false)
	//parte warnings
	const [datepickerDate1, setDatepickerDate1] = useState<Date>(new Date());
	const [datepickerDate2, setDatepickerDate2] = useState<Date>(new Date());
	const [zoneList, setZoneList] = useState([] as any)
	const [selectedTab, setSelectedTab] = useState(0)
	// 0 => buscar warnings
	// 1 => buscador de incidencias
	const [reloadProvZone, setReloadProvZone] = useState<string>('');
	const [totalPages, setTotalPages] = useState(0)
	const [currentPage, setCurrentPage] = useState(0)
	const [itemsPerPage, setItemsPerPage] = useState(20)
	const [supply, setSupply] = useState([] as any)
	const [showInterruptions, setShowInterruptions] = useState<boolean>(false)
	const [incidenceData, setIncidenceData] = useState([] as any)
	const [formDateFrom, setFormDateFrom] = useState(new Date())
	const [formDateTo, setFormDateTo] = useState(new Date())
	
  useEffect(() => {
		setTotalPages(warningsList.length === 0 ? 1 : Math.ceil(warningsList.length / itemsPerPage))
		// eslint-disable-next-line
	}, [warningsList, itemsPerPage])
	useEffect(() => {
		resetFilters()
	}, [selectedTab])
	useEffect(() => {
		const dateTo = new Date();
		const dateFrom = new Date(dateTo);
		dateFrom.setDate(dateTo.getDate() - 7);
		setFormDateFrom(dateFrom)
		setFormDateTo(dateTo)
		
		if (supply.cups && supply.cups !== '') {
			setIsLoadingList(true)
			dispatch(thunkGetListIncidence(supply.cups, dateFrom, dateTo, (response) => {
				if (response && response.incidenceList && response.incidenceList.length > 0) {
					let data = {
						sistema: 'ZEUS',
						incidenceList: response.incidenceList
					}
					setIncidenceData(data)
					dispatch(thunkGetListInterruptions(data, (response) => {
						if (response && response.result && response.result.codResult === '0000' && response.incidenceList.length > 0) {
							//cargamos la lista de interupciones
							let auxList = []
							response.incidenceList.map((item) => {
								auxList.push(item)
							})
							setIncidencesList(auxList)
							setShowInterruptions(true)
							setIsLoadingList(false)
						} else {
							//En caso de error o no encontrar interrupciones
							setShowInterruptions(true)
							setIsLoadingList(false)
						}
					}))
				} else {
					//En caso de error
					setIsLoadingList(false)
				}
			}))
		}
	}, [supply])
	const performSearch = (): any => {
		//En caso de estar en el primer tab (buscar avisos)
		setIsLoadingList(true)
		
		if (selectedTab === 0) {
			let data = {
				system: 'ZEUS',
				zone: zoneCode,
				warningStatus: statusCode,
				startDate: formatDateWarnings(datepickerDate1) + ' 00:00:00',
				endDate: formatDateWarnings(datepickerDate2) + ' 23:59:59',
				cups: '',
				cgv: ''
			}
			//disparamos la llamada directamente 
			dispatch(thunkGetListWarnings(data, (response) => {
				//setWarningsList(response) - Fix - ADN 13/12/2023
				if (response && response.result && response.result.codResult === '0000' && (response.result.msgResult ===''|| response.result.msgResult ==='TRANSACCION CORRECTA')) {
					const regex = /^(\d{4})-(\d{2})-(\d{2})_(\d{2}):(\d{2}):(\d{2})$/;
					//Si el formato es el de ADMS se modifica para que se muestre en la tabla YYYY-MM-DD HH:mm:SS 
					for(let i = 0; i < response.warning.length; i++) {
						response.warning[i].fecha = AveriasUtils.FormatDateAveriasPantalla(response.warning[i].fecha);
					}
					
					//rellenemos la lista en caso de recibir warnings
					setWarningsList(response.warning)
					setCopyWarningsList(response.warning)
					setNonResponse(false)
					setListWarningsError(false)
					setShowList(true)
					setIsLoadingList(false)
				} else if (response && response.result && response.result.codResult && response.result.codResult === '0000' && response.result.msgResult &&
          			(response.result.msgResult === 'NO HAY AVISOS PARA EL PERIODO SELECCIONADO' || response.result.msgResult === 'OPERACION NO EFECTUADA - Ningún aviso encontrado con este criterio de selección')) {
					//acciones para mostrar que no hay avisos
					setWarningsList([])
					setNonResponse(true)
					setShowList(true)
					setIsLoadingList(false)
				} else {
					console.log('listwarnings:entra al else')

					//En caso de error de sistema
					setListWarningsError(true)
          			setWarningsList([])
					setShowList(true)
					setIsLoadingList(false)
				}
			}));
		}
		// LCS: Lanzamos el evento - Wave 2
		sendGAEvent({
			event: 'search_malfunction_report',
			user_id: sessionStorage.getItem('id'),
			user_type: sessionStorage.getItem('user_type'),
		  });
	}
	const handleChangeInput = (input, value): any => {
		if (input === 'state') {
			dispatch(thunkGetMasterData('CENTER_ID', 'ES', value, (response) => {
				if (response && response.length > 0) {
					setZoneCode(response[0].value)
				}
			})
			)
			setProvince(value)
			setReloadProvZone('PROVINCE')
		} else if (input === 'zone') {
			// zona
			dispatch(thunkGetMasterData('CENTER_ID', 'ES', value, (response) => {
				if (response && response.length > 0) {
					setZoneCode(response[0].value)
				}
			})
			)
			setZone(value)
			setReloadProvZone('ZONE')
		} else if (input === 'status') {
			//estado
			setStatus(value)
			setStatusError(false)
			if (value === 'PENDIENTE') {
				setStatusCode('1')
			} else if (value === 'ASOCIADO INC. ABIERTA') {
				setStatusCode('2')
			} else if (value === 'ASOCIADO INC. CERRADA') {
				setStatusCode('3')
			} else if (value === 'DESESTIMADO') {
				setStatusCode('4')
			} else if (value === 'Aviso pendiente') {
				setStatusCode('1')
			} else if (value === 'Aviso asociado a incidencia NO resuelta') {
				setStatusCode('2')
			} else if (value === 'Aviso asociado a incidencia SI resuelta') {
				setStatusCode('3')
			} else if (value === 'Aviso pendiente, enviado a WAP') {
				setStatusCode('4')
			} else if (value === 'Aviso desestimado') {
				setStatusCode('5')
			} else if (value === 'Aviso pendiente de respuesta de rearme por Saturne') {
				setStatusCode('6')
			}
		}
	}
	useEffect(() => {
		if (reloadProvZone === '') {
			// cargar lista de provincias de nuestra master data
			dispatch(thunkGetMasterData('CENTERS', 'ES', '', (response) => {
				if (response && response.length > 0) {
					let selectList = []
					let selectList2 = []
					response.map((item) => {
						if (!selectList.includes(item.key)) {
							selectList.push(item.key)
						}
						selectList2.push(item.value)
					})
					setStatesList(selectList)
					setZoneList(selectList2)
				}
			})
			)
		} else if (reloadProvZone === 'PROVINCE') {
			if (zone === '') {
				setZoneList([])
			}
			dispatch(thunkGetMasterData('CENTERS', 'ES', province, (response) => {
				if (response && response.length > 0) {
					let selectList = []
					response.map((item) => {
						selectList.push(item.value)
					})
					setZoneList(selectList)
				}
			})
			)
		} else if (reloadProvZone === 'ZONE') {
			dispatch(thunkGetMasterData('CENTERS', 'ES', '', (response) => {
				if (response && response.length > 0) {
					let selectList = []
					response.map((item) => {
						if (!selectList.includes(item.key) && item.value === zone) {
							setProvince(item.key)
							selectList.push(item.key)
              setReloadProvZone('PROVINCE')
						}
					})
				}
			})
			)
		}
    setReloadProvZone('NONE')
	}, [reloadProvZone])
	const handleCancel = () => {
		return <Redirect to='/profile' />
	}
	const resetFilters = () => {
		setProvince('')
		setZone('')
		setReloadProvZone('')
		setStatus('')
		setZoneCode('')
		setStatusCode('')
		setShowInterruptions(false)
		setDatepickerDate1(new Date())
		setDatepickerDate2(new Date())
		setWarningsList([])
		setShowList(false)
	}
	const [expand, setExpand] = useState(true)
	const [expandWarningsTable, setExpandWarningsTable] = useState(true)
	const togglePanel = () => {
		setExpand((prev) => !prev)
	}
	const toggleWarningsTablePanel = () => {
		setExpandWarningsTable((prev) => !prev)
	}
	
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
			if (list && list.length && list.length > 0) {
				list.map((item) => {
					if (isWarningOpen(item)) {
						cont++;
					}
				})
			}
		} else if (type === 'incidences') {
			list.map((item) => {
				if (isIncidenceOpen(item)) {
					cont++;
				}
			})
		}
		return cont;
	}
	return (
		<>
			{
				isLoadingList &&
				<Spinner fixed={true} />
			}
			<Grid container direction='column' justifyContent='space-between' className={styles.container}>
				<ExpansionPanel className={styles.height} expanded={expand}>
					<ExpansionPanelSummary style={{display:'grid'}} expandIcon={<StyledExpandMoreIcon />} IconButtonProps={{ onClick: togglePanel }}>
						{/*<img className={styles.expansionPanelSummaryIcon} src={Filters} alt='' />
                    <Typography className={styles.expansionPanelSummaryText}>{t('averias.management.consult.title')}</Typography>*/}
						<div className={styles.navigation}>
							<StyledTabSelector
								className={styles.tabs}
								value={selectedTab}
								onChange={(event, tab) => setSelectedTab(tab)}
								indicatorColor='primary'
								textColor='primary'
								orientation={mobile ? 'vertical' : 'horizontal'}
								TabIndicatorProps={mobile ? {
									style: {
										display: 'none'
									}
								} : {}}
							>
								{
									!mobile ?
										<StyledTab
											className={styles.tab}
											label={
												<Badge
													classes={{ badge: styles.customBadge }}
													className={styles.badge}
												>
													{t('averias.management.consult.title')}
												</Badge>
											}
										/>
										:
										<StyledMobileTab
											className={styles.tab}
											label={
												<Badge
													classes={{ badge: styles.customBadge }}
													className={styles.badge}
												>
													{t('averias.management.consult.title')}
												</Badge>
											}
										/>
								}
								{
									!mobile ?
										<StyledTab
											className={styles.tab}
											label={
												<Badge
													classes={{ badge: styles.customBadge }}
													className={styles.badge}
												>
													{t('averias.management.consult.title2')}
												</Badge>
											}
										/>
										:
										<StyledMobileTab
											className={styles.tab}
											label={
												<Badge
													classes={{ badge: styles.customBadge }}
													className={styles.badge}
												>
													{t('averias.management.consult.title2')}
												</Badge>
											}
										/>
								}
							</StyledTabSelector>
						</div>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails>
						<SwipeableViews
							index={selectedTab}
							className={styles.views}
							onChangeIndex={setSelectedTab}
						>
							<SearchWarnings
								zoneList={zoneList}
								zone={zone}
								handleChangeInput={handleChangeInput}
								statesList={statesList}
								province={province}
								isLoadingList={isLoadingList}
								handleCancel={handleCancel}
								performSearch={performSearch}
								resetFilters={resetFilters}
								statusList={props.statusList}
								status={status}
								setStatus={setStatus}
								datepickerDate1={datepickerDate1}
								setDatepickerDate1={setDatepickerDate1}
								datepickerDate2={datepickerDate2}
								setDatepickerDate2={setDatepickerDate2}
								error={statusError}
							/>
							<SearchIncidence
								supply={supply}
								setSupply={setSupply}
								setLoading={setIsLoadingList}
								setShowInterruptions={setShowInterruptions}
								setIncidencesList={setIncidencesList}
								selectedTab={selectedTab}
								cooldownTry={props.cooldownTry}
								cooldownRetry={props.cooldownRetry}
								maxRetries={props.maxRetries}
								provinces={props.provinces}
								getProvinces={props.getProvinces}
								errorProvinces={props.errorProvinces}
								loadingProvinces={props.loadingProvinces}
								errorTowns={props.errorTowns}
								getTowns={props.getTowns}
								setParametersTowns={props.setParametersTowns}
								resetRetriesTowns={props.resetRetriesTowns}
								loadingTowns={props.loadingTowns}
								towns={props.towns}
								setProvinceCodeTowns={props.setProvinceCodeTowns}
								setInformedTownsExternal={props.setInformedTownsExternal}
								setTownNameExternal={props.setTownNameExternal}
								clearTowns={props.clearTowns}
							/>
						</SwipeableViews>
					</ExpansionPanelDetails>
				</ExpansionPanel>
				{//Esta es la lista de warnings cargada si estamos buscando avisos
					(showList) &&
					<ExpansionPanel expanded={expandWarningsTable}>
						<ExpansionPanelSummary classes={{content: styles.expansionPanelSummaryContent}}  expandIcon={<StyledExpandMoreIcon />} IconButtonProps={{ onClick: toggleWarningsTablePanel }}>
							<Grid item style={{ paddingTop: 10, textAlign:'center' }}>
								{getFromStatus(warningsList,'warnings') > 0 && <span className={styles.red}>{getFromStatus(warningsList,'warnings')}</span>}
							</Grid>
							<Grid item md={'auto'} className={styles.warnigsTitle} style={{textAlign:'center'}}>
								<img className={styles.expansionPanelSummaryIcon} src={AlertIconWarnings} alt='' />
							</Grid>
							<Grid item md={5} className={styles.warnigsTitle} style={{textAlign:'center'}}>
								<Typography className={styles.expansionPanelSummaryText}>{t('averias.management.consult.warningsListTitle')}</Typography>
							</Grid>
							<Grid item md={2} className={styles.filtrarPor} style={{textAlign:'center'}}>
								{t('averias.management.consult.filter')}
							</Grid>
							<Grid item md={4} style={{textAlign:'center'}}>
								<DynamicSearcher
									label={t('Palabra, término, etc')}
									finalList={warningsList}
									setFinalList={setWarningsList}
									listItems={copyWarningsList}
									subtype={'warnings'}
								/>
							</Grid>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							<Grid container>
								{(!isLoadingList) &&
									<>
										{(warningsList !== null) &&
											<>
												{(warningsList.length === 0) ?
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
													:
													<Grid container className={styles.table}>
														{(mobile) ? 
														<Mosaic listItems={warningsList} setFinalList={setWarningsList} currentPage={currentPage} setCurrentPage={setCurrentPage} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} totalPages={totalPages}/>
													   :
										                 <List listItems={warningsList} setFinalList={setWarningsList} currentPage={currentPage} setCurrentPage={setCurrentPage} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} totalPages={totalPages}/> 
													 	 }
														
														
													</Grid>
												}
											</>
										}
									</>
								}
							</Grid>
						</ExpansionPanelDetails>
					</ExpansionPanel>
				}
				{//Esta es la lista de incidencias cargada si estamos buscando incidencias
					(showInterruptions) &&
					<ExpansionPanel expanded={expandWarningsTable}>
						<ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />} IconButtonProps={{ onClick: toggleWarningsTablePanel }}>
							<Grid item style={{ paddingTop: 10 }}>
								{getFromStatus(incidencesList, 'incidences') > 0 && <span className={styles.red}>{getFromStatus(incidencesList, 'incidences')}</span>}
							</Grid>
							<Grid item md={'auto'} className={styles.warnigsTitle}>
								<img className={styles.expansionPanelSummaryIcon} src={AlertIconWarnings} alt='' />
							</Grid>
							<Grid item md={5} className={styles.warnigsTitle}>
								<Typography className={styles.expansionPanelSummaryText}>{t('averias.management.consult.incidencesListTitle')}</Typography>
							</Grid>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							<Grid container>
								{(!isLoadingList) &&
									<>
										{(incidencesList !== null) &&
											<>
												{/*(incidencesList.length === 0) ?
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
                                                    :
                                                    <Grid container className={styles.table}>
                                                        <ListIncidences
                                                            listItems={incidencesList}
                                                            setFinalList={setIncidencesList}
                                                            currentPage={currentPage}
                                                            setCurrentPage={setCurrentPage}
                                                            itemsPerPage={itemsPerPage}
                                                            setItemsPerPage={setItemsPerPage}
                                                            totalPages={totalPages}
                                                        />
                                                    </Grid>
                                                    */}
												<Grid container className={styles.table}>
													<ListIncidences
														listItems={incidencesList}
														setFinalList={setIncidencesList}
														currentPage={currentPage}
														setCurrentPage={setCurrentPage}
														itemsPerPage={itemsPerPage}
														setItemsPerPage={setItemsPerPage}
														totalPages={totalPages}
														incidenceData={incidenceData}
														cups={supply.cups}
													/>
												</Grid>
											</>
										}
									</>
								}
							</Grid>
						</ExpansionPanelDetails>
					</ExpansionPanel>
				}
			</Grid >
		</>
	);
}
export default Management;