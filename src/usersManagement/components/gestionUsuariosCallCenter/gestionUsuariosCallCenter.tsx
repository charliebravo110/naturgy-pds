import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { useDispatch } from 'react-redux';
import XLSX from 'xlsx'
import { Redirect } from 'react-router-dom'

import Input from '../../../common/components/input/Input'
import Spinner from '../../../common/components/spinner/Spinner';
import Button from '../../../common/components/button/Button';
import DatepickerV3 from '../../../common/components/datepickerV3/DatepickerV3';
import Select from '../../../common/components/select/Select';
import { validateMail, validatePhoneNumber } from '../../../common/lib/ValidationLib';
import FilterIcon from '../../../assets/icons/filtros.svg';
import AlertIcon from '../../../assets/icons/aviso_alerta_pop_up.svg';
import { thunkGetListUsers, thunkGetListRoles, thunkDeleteUsers, thunkAssignRole, thunkRevokeRole } from '../../actions/UsuariosThunkActions';
import List from '../list/List';
import SuccessModal from '../modals/SuccessModal';
import DeleteModal from '../modals/DeleteModal';
import AsignModal from '../modals/AsignModal';

// LCS: Importa la función - Wave 3
import { sendGAEvent, removeEmails } from '../../../core/utils/gtm';

import useStyles, {
	ExpansionPanel,
	ExpansionPanelSummary,
	StyledExpandMoreIcon,
	ExpansionPanelDetails
} from './gestionUsuariosCallCenter.styles';

const GestionUsuariosCallCenter = (props: any) => {
	const { t } = useTranslation();
	const styles = useStyles({});
	const dispatch = useDispatch();
	const [formValues, setFormValues] = useState<any>({}); // selected tile
	const [showList, setShowList] = useState<boolean>(false);
	const [userList, setUserList] = useState([] as any);
	const [auxList, setAuxList] = useState([] as any);
	const [roles, setRoles] = useState([] as any);
	const [totalPages, setTotalPages] = useState(0);
	const [currentPage, setCurrentPage] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState(20);
	const [expandUserTable, setExpandUserTable] = useState(true);
	const [isLoadingList, setIsLoadingList] = useState<boolean>(false);
	const [datepickerDate1, setDatepickerDate1] = useState<Date>(null);
	const [datepickerDate2, setDatepickerDate2] = useState<Date>(null);
	const [datepickerDateEnd1, setDatepickerDateEnd1] = useState<Date>(null);
	const [datepickerDateEnd2, setDatepickerDateEnd2] = useState<Date>(null);
	const [email, setEmail] = useState<string>('');
	const [telephone, setTelephone] = useState<string>('');
	const [phoneError, setPhoneError] = useState(false);
	const [emailError, setEmailError] = useState(false);
	const [typeValue, setTypeValue] = useState('0');
	const [role, setRole] = useState('');
	const [openSuccess, setOpenSuccess] = useState<boolean>(false);
	const [openDelete, setOpenDelete] = useState<boolean>(false);
	const [openAsignRole, setOpenAsignRole] = useState<boolean>(false);
	const [modalTitle, setModalTitle] = useState('');
	const [userToAction, setUserToAction] = useState<any>();
	const userRoles = sessionStorage.getItem('userRoles') || ''
	const userRolesArray = userRoles.split(',')

	let diaAnterior: Date = new Date();
	diaAnterior.setDate(diaAnterior.getDate() - 1);

	const userTypes = ['0| ', `1|${t('gestionUsuariosCC.userTypes.platform')}`, `2|${t('gestionUsuariosCC.userTypes.ufd')}`, `3|${t('gestionUsuariosCC.userTypes.administrator')}`];

	useEffect(() => {
		// LCS: Enviar evento de GdC a GA - Wave 3
		sendGAEvent({
		  event: 'view',
		  content_group: 'gestion de usuarios call center',
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
		setIsLoadingList(true);
		getResults();
		dispatch(thunkGetListRoles((response) => {
			if (response && response.result && response.result.codResult === '0000') {
				setRoles(['', ...response.roles]);
			}
		}));
	}, []);

	useEffect(() => {
		setTotalPages(userList.length === 0 ? 1 : Math.ceil(userList.length / itemsPerPage))
		// eslint-disable-next-line
	}, [userList, itemsPerPage]);

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
	}, [email]);

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
	}, [telephone]);


	useEffect(() => {
		filterList();
	}, userList);

	if (!userRolesArray.includes('US_CC')) {
		if (userRolesArray.includes('US_SUPPLYPOINT_CLIENT') || userRolesArray.includes('US_MANAGER')) {
		  return <Redirect to='/dashboard' />
		} else if (userRolesArray.includes('US_CONSULTANT')) {
		  return <Redirect to='/supplies' />
		} else {
		  return <Redirect to='/landing' />
		}
  	}

	const getResults = () => {
		dispatch(thunkGetListUsers((response) => {
			if (response && response.result && response.result.codResult === '0000') {
				//rellenemos la lista en caso de recibir warnings
				setUserList(response.users);
				setAuxList(response.users);
				setShowList(true);
				setIsLoadingList(false);
			} else {
				setIsLoadingList(false);
				setAuxList([]);
				setUserList([]);
			}
		}));
	}

	const resetFilters = () => {
		setFormValues({
			name: '',
			surname: '',
			registration: '',
			phone: '',
			email: '',
		});
		setEmail('');
		setTelephone('');
		setDatepickerDate1(null);
		setDatepickerDate2(null);
		setDatepickerDateEnd1(null);
		setDatepickerDateEnd2(null);
		setTypeValue('0');
	};

	const getFormatedDate = (date: string): string => {
		return `${date.slice(3, 5)}/${date.slice(0, 2)}${date.slice(5)}`;
	}

	const filterList = () => {
		let result = [...auxList];

		if (formValues['registration']) {
			result = result.filter(li => li.username.includes(formValues['registration']));
		}
		if (formValues['name']) {
			result = result.filter(li => li.name.toUpperCase().includes(formValues['name'].toUpperCase()));
		}
		if (formValues['surname']) {
			result = result.filter(li => li.lastName.toUpperCase().includes(formValues['surname'].toUpperCase()));
		}

		if (datepickerDate1 && datepickerDate2) {
			const dateToFilter = datepickerDate2.setHours(23, 59, 59);
			result = result.filter(
				li => new Date(getFormatedDate(li.creationDate)).getTime() >= datepickerDate1.getTime() && new Date(getFormatedDate(li.creationDate)).getTime() <= dateToFilter
			);
		} else if (datepickerDate1) {
			result = result.filter(
				li => new Date(getFormatedDate(li.creationDate)).getTime() >= datepickerDate1.getTime()
			);
		} else if (datepickerDate2) {
			const dateToFilter = datepickerDate2.setUTCHours(23, 59, 59, 999);
			result = result.filter(
				li => new Date(getFormatedDate(li.creationDate)).getTime() <= dateToFilter
			);
		}

		if (datepickerDateEnd1 && datepickerDateEnd2) {
			const dateToFilter = datepickerDateEnd2.setHours(23, 59, 59);
			result = result.filter(
				li => !li.enabled && (new Date(getFormatedDate(li.lastModifiedDate)).getTime() >= datepickerDateEnd1.getTime() && new Date(getFormatedDate(li.lastModifiedDate)).getTime() <= dateToFilter)
			);
		} else if (datepickerDateEnd1) {
			result = result.filter(
				li => !li.enabled && (new Date(getFormatedDate(li.lastModifiedDate)).getTime() >= datepickerDateEnd1.getTime())
			);
		} else if (datepickerDateEnd2) {
			const dateToFilter = datepickerDateEnd2.setUTCHours(23, 59, 59, 999);
			result = result.filter(
				li => !li.enabled && (new Date(getFormatedDate(li.lastModifiedDate)).getTime() <= dateToFilter)
			);
		}

		if (email !== '') {
			result = result.filter(li => li.email.includes(email));
		}
		if (telephone !== '') {
			result = result.filter(li => li.phone_number && li.phone_number.includes(telephone));
		}
		if (typeValue !== '0') {
			if (typeValue === '1') {
				// Agente plataforma 700
				result = result.filter(li => /^700\d{5}$/.test(li.username));
			} else if (typeValue === '2') {
				// Gestor UFD 00, 44, 70
				result = result.filter(li => {
					const code00 = /^00\d{6}$/.test(li.username)
					const code44 = /^44\d{6}$/.test(li.username)
					const codeUF = /^UF\d{6}$/.test(li.username) || /^uf\d{6}$/.test(li.username)
					const code70 = /^70\d{6}$/.test(li.username) && !/^700\d{5}$/.test(li.username);

					return code00 || code44 || code70 || codeUF
				});

			} else {
				// Admin 9
				result = result.filter(li => /^9\d{7}$/.test(li.username));
			}
		}
		if (role !== '') {
			result = result.filter(li => li.role === formValues['role']);
		}

		setUserList(result);
	};

	const throwEventGA = (): any => {
		// LCS: Enviar evento de negocio a GA - Wave 3
		sendGAEvent({
			event: 'search_supply_manage_user_call_center',
			user_id: sessionStorage.getItem('id'),
			user_type: sessionStorage.getItem('user_type'),
			//user_document: sessionStorage.getItem('userDocumentLogin')
		});
	}

	const performSearch = (): any => {
		setIsLoadingList(true);
		filterList();
		setShowList(true);
		setIsLoadingList(false);
		// LCS - WAVE 3
		throwEventGA();
	}

	const modifyForm = (event: React.ChangeEvent<{ value: unknown; id: string; name: string }>) => {
		const tempElem = Object.assign({}, formValues) as any;
		const key = event.target.id;
		tempElem[key] = event.target.value;
		setFormValues(tempElem);
	};

	const toggleUsersTablePanel = () => {
		setExpandUserTable((prev) => !prev)
	}

	const getUserType = (user: string) => {
		const code = user.toUpperCase();

		const code9 = /^9\d{7}$/.test(code);
		const code00 = /^00\d{6}$/.test(code);
		const code44 = /^44\d{6}$/.test(code);
		const code700 = /^700\d{5}$/.test(code);
		const codeUF = /^UF\d{6}$/.test(code) || /^uf\d{6}$/.test(code);
		const code70 = /^70\d{6}$/.test(code) && !/^700\d{5}$/.test(code);

		if (code9) {
			return t('gestionUsuariosCC.userTypes.administrator')
		} else if (code700) {
			return t('gestionUsuariosCC.userTypes.platform')
		} else if (code00 || code44 || code70 || codeUF) {
			return t('gestionUsuariosCC.userTypes.ufd')
		}

		return ''

	}

	const exportToExcel = () => {
		if (userList) {
			let listData = [] as any
			userList.map(
				(item) => {
					listData.push({
						matricula: item.username ? item.username : '',
						nombre_completo: `${item.name} ${item.lastName}`,
						tipo_usuario: getUserType(item.username),
						rol: item.roles.filter(rol => rol === 'US_CC').length > 0 ? t('common.buttons.yes') : t('common.buttons.no'),
						email: item.email,
						alta: item.creationDate,
						baja: !item.enabled ? item.lastModifiedDate : ' '
					})
				}
			)
			const wb = XLSX.utils.book_new()
			let ws
			ws = XLSX.utils.json_to_sheet(listData, {
				header: [
					'matricula',
					'nombre_completo',
					'tipo_usuario',
					'rol',
					'email',
					'alta',
					'baja',
				]
			})
			ws['A1'].v = t('gestionUsuariosCC.table.header.registration')
			ws['B1'].v = t('gestionUsuariosCC.table.header.name')
			ws['C1'].v = t('gestionUsuariosCC.table.header.type')
			ws['D1'].v = t('gestionUsuariosCC.table.header.role')
			ws['E1'].v = t('gestionUsuariosCC.table.header.email')
			ws['F1'].v = t('gestionUsuariosCC.table.header.dateFrom')
			ws['G1'].v = t('gestionUsuariosCC.table.header.dateTo')

			let fileName = 'UsuariosCallCenter.xlsx'
			XLSX.utils.book_append_sheet(wb, ws, 'Usuarios Call Center')
			//crea el llibre 
			XLSX.writeFile(wb, fileName)
		}


	}

	const handleDeleteUser = (users: any) => {
		setIsLoadingList(true);
		dispatch(thunkDeleteUsers(users, () => {
			getResults();
			setIsLoadingList(false);
		}));
	}

	const handleAssignUser = (user: any) => {
		setIsLoadingList(true);
		dispatch(thunkAssignRole(user, () => {
			getResults();
			setIsLoadingList(false);
			setModalTitle(t('gestionUsuariosCC.table.successTitleRol'));
			setOpenSuccess(true);
		}));
	}

	const revokeUser = () => {
		setOpenDelete(false);
		setIsLoadingList(true);
		dispatch(thunkRevokeRole(userToAction, () => {
			getResults();
			setIsLoadingList(false);
			setModalTitle(t('gestionUsuariosCC.table.successTitleDelete'));
			setOpenSuccess(true);
		}));
	}

	const handleRevokeUser = (user: any) => {
		setUserToAction(user);
		setModalTitle(t('gestionUsuariosCC.table.confirmDelete'));
		setOpenDelete(true);
	}

	const handleCloseDialog = (e) => {
		setOpenSuccess(e);
	}

	return (
		<>
			{(isLoadingList) &&
				<Spinner fixed={true} />
			}

			<Grid container justify='center' alignItems='center' className={styles.container}>
				<Grid item xs={12} sm={10} className={styles.maxWidthForBigScreens}>
					<Grid item className={styles.headerTitle}>
						{t('gestionUsuariosCC.header.title')}
					</Grid>
					<ExpansionPanel defaultExpanded>
						<ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />}>
							<img className={styles.expansionPanelSummaryIcon} src={FilterIcon} alt='' />
							<Typography className={styles.expansionPanelSummaryText}>{t('gestionUsuariosCC.filter.title')}</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							<Grid container md={12}>
								<Grid item md={12} className={`${styles.inputsArea} ${styles.searchContainer}`}>
									<Grid container className={styles.inputsArea}>
										<div className={styles.titleWrapper}>
											<span className={styles.searchTitle}>{t('gestionUsuariosCC.filter.userTitle')}</span>
										</div>
										<Grid container xs={12} sm={10} md={12} spacing={3}>
											<Grid item xs={12} sm={3}>
												<span className={styles.inputTitle}>{t('gestionUsuariosCC.filter.registration')}</span>
												<Input
													id='registration'
													className={styles.inputV2}
													value={formValues['registration']}
													onChange={modifyForm}
												/>
											</Grid>
											<Grid item xs={12} sm={3}>
												<span className={styles.inputTitle}>{t('gestionUsuariosCC.filter.name')}</span>
												<Input
													id='name'
													className={styles.inputV2}
													value={formValues['name']}
													onChange={modifyForm}
												/>
											</Grid>
											<Grid item xs={12} sm={3}>
												<span className={styles.inputTitle}>{t('gestionUsuariosCC.filter.surname')}</span>
												<Input
													id='surname'
													className={styles.inputV2}
													value={formValues['surname']}
													onChange={modifyForm}
												/>
											</Grid>
										</Grid>

										<Grid container md={12} spacing={2}>
											<Grid item xs={12} md={3}>
												<Grid className={styles.inputTitle}>{t('gestionUsuariosCC.filter.dateFrom')}</Grid>
												<DatepickerV3 selectedDate={datepickerDate1} handleChange={setDatepickerDate1} size='m' maxDate={datepickerDate2} dateFormat={'dd/MM/yyyy'} popperPlacement={'right-center'} />
											</Grid>
											<Grid item xs={12} md={3}>
												<Grid className={styles.inputTitle} />
												<DatepickerV3 selectedDate={datepickerDate2} handleChange={setDatepickerDate2} size='m' minDate={datepickerDate1} maxDate={diaAnterior} dateFormat={'dd/MM/yyyy'} popperPlacement={'right-center'} />
											</Grid>
											<Grid item xs={12} md={3}>
												<Grid className={styles.inputTitle}>{t('gestionUsuariosCC.filter.dateTo')}</Grid>
												<DatepickerV3 selectedDate={datepickerDateEnd1} handleChange={setDatepickerDateEnd1} size='m' maxDate={datepickerDateEnd2} dateFormat={'dd/MM/yyyy'} popperPlacement={'right-center'} />
											</Grid>
											<Grid item xs={12} md={3}>
												<Grid className={styles.inputTitle} />
												<DatepickerV3 selectedDate={datepickerDateEnd2} handleChange={setDatepickerDateEnd2} size='m' minDate={datepickerDateEnd1} maxDate={new Date()} dateFormat={'dd/MM/yyyy'} popperPlacement={'right-center'} />
											</Grid>
										</Grid>

										<Grid container md={12} spacing={2}>
											<Grid item xs={12} sm={3} md={3}>
												<span className={styles.inputTitle}>{t('gestionUsuariosCC.filter.userType')}</span>
												<Select
													id='type'
													className={styles.inputV2}
													codFiltering={true}
													label={t('gestionUsuariosCC.filter.userTypeLabel')}
													values={userTypes}
													onChange={({ target }) => setTypeValue(target.value)}
													value={typeValue}
												/>
											</Grid>
											{false && <Grid item xs={12} sm={3} md={3}>
												<span className={styles.inputTitle}>{t('gestionUsuariosCC.filter.roles')}</span>
												<Select
													id='role'
													className={styles.inputV2}
													label={t('gestionUsuariosCC.filter.rolesLabel')}
													values={roles}
													onChange={({ target }) => setRole(target.value)}
													value={role}
												/>
											</Grid>}
										</Grid>

									</Grid>
									<Grid container className={styles.inputsArea}>
										<div className={styles.titleWrapper}>
											<span className={styles.searchTitle}>{t('gestionUsuariosCC.filter.dataTitle')}</span>
										</div>
										<Grid container xs={12} sm={10} md={12} spacing={3}>
											<Grid item xs={12} sm={3}>
												<span className={styles.inputTitle}>{t('gestionUsuariosCC.filter.phone')}</span>
												<Input
													className={styles.input}
													onChange={(e) => setTelephone(e.target.value)}
													showValidationIcon
													error={telephone !== '' && phoneError}
													value={telephone}
												/>
											</Grid>
											<Grid item xs={12} sm={3}>
												<span className={styles.inputTitle}>{t('gestionUsuariosCC.filter.email')}</span>
												<Input
													className={styles.input}
													onChange={(e) => setEmail(e.target.value)}
													showValidationIcon
													error={email !== '' && emailError}
													value={email}
												/>
											</Grid>
										</Grid>
									</Grid>
									<Grid container direction='row' justify='center' spacing={3} className={styles.buttonsContainer}>
										<Grid item xs={12} sm={6} md={4} lg={3}>
											<Button
												className={styles.cancelButton}
												text={t('common.buttons.cancel')}
												color='inherit'
												size='large'
												variant='contained'
												onClick={resetFilters}
											/>
										</Grid>
										<Grid item xs={12} sm={6} md={4} lg={3}>
											<Button
												className={styles.button}
												text={t('common.buttons.searchUser')}
												color='primary'
												size='large'
												variant='contained'
												onClick={performSearch}
											/>
										</Grid>
										<Grid item xs={12} sm={6} md={4} lg={3}>
											<p className={styles.link} onClick={resetFilters}>
												{t('gestionUsuariosCC.filter.resetFilters')}
											</p>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</ExpansionPanelDetails>
					</ExpansionPanel>
					{(showList) &&
						<ExpansionPanel expanded={expandUserTable}>
							<ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />} IconButtonProps={{ onClick: toggleUsersTablePanel }}>
								<Grid item >
									{
										userList.length > 20 && totalPages > 1 && (currentPage + 1) === totalPages ?
											<Grid container className={styles.totalItems}>
												{userList.slice((currentPage * itemsPerPage), ((currentPage * itemsPerPage) + itemsPerPage)).length + t('gestionUsuariosCC.table.header.results') + userList.length}
											</Grid>
											:
											userList.length > 20 && totalPages > 1 ?
												<Grid container className={styles.totalItems}>
													{userList.slice((currentPage * itemsPerPage), ((currentPage * itemsPerPage) + itemsPerPage)).length + t('gestionUsuariosCC.table.header.results') + userList.length}
												</Grid>
												:
												<Grid container className={styles.totalItems}>
													{userList.length + (userList.length > 1 ? t('gestionUsuariosCC.table.header.result') : t('gestionUsuariosCC.table.header.result'))}
												</Grid>
									}
								</Grid>
								<Grid item >
									<p className={styles.exportLink} onClick={exportToExcel}>
										{t('gestionUsuariosCC.table.header.export')}
									</p>
								</Grid>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<Grid container>
									{(!isLoadingList) &&
										<>
											{(userList !== null) &&
												<>
													{(userList.length === 0) ?
														<Grid item md={12} className={styles.searchResultContainer}>
															{(!isLoadingList) &&
																<>
																	<Grid className={styles.alertContainer}>
																		<img src={AlertIcon} />
																		<div className={styles.alertTitle}>
																			{t('gestionUsuariosCC.table.noResults')}
																		</div>
																	</Grid>
																</>
															}
														</Grid>
														:
														<Grid container className={styles.table}>
															<List
																listItems={userList}
																setFinalList={setUserList}
																currentPage={currentPage}
																setCurrentPage={setCurrentPage}
																itemsPerPage={itemsPerPage}
																setItemsPerPage={setItemsPerPage}
																totalPages={totalPages}
																deleteUser={handleDeleteUser}
																assignUser={handleAssignUser}
																revokeUser={handleRevokeUser}
															/>
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
				</Grid>
			</Grid>
			<SuccessModal title={modalTitle} open={openSuccess} closeaux={handleCloseDialog} />
			<DeleteModal title={modalTitle} open={openDelete} handleCloseDialog={() => setOpenDelete(false)} handleAcceptDialog={revokeUser}/>
			<AsignModal title={modalTitle} open={openAsignRole} handleCloseDialog={() => setOpenAsignRole(false)} />
		</>
	);
}

export default GestionUsuariosCallCenter;

