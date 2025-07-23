import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Spinner from '../../../common/components/spinner/Spinner';
import UsersManagementNavbar from '../users-management-navigation/UsersManagementNavbar';

import Grid from '@material-ui/core/Grid';
import useStyles from './GestionUsuarios.styles';

import AssignRol from '../usuariosNavigation/assignRole/AssignRole'
import DeleteUser from '../usuariosNavigation/deleteUser/DeleteUser'
import ActiveUsers from '../usuariosNavigation/activeUsers/ActiveUsers'

// LCS: Importa la función - Wave 3
import { sendGAEvent, removeEmails } from '../../../core/utils/gtm';

const GestionUsuarios = (props: any) => {

	const [isLoading] = useState<boolean>(false);
	const user = useSelector((state: any) => state.user)
	const admin = useSelector((state: any) => state.admin.profile)

	const is700user = () => {
		return /^70\d{6}$/.test(user.documentNumber?.toUpperCase()) || /^70\d{6}$/.test(admin.documentNumber?.toUpperCase())
	}

	const [tabValue, setTabValue] = useState<number>(1);
	const { t } = useTranslation();
	const styles = useStyles({});

	let token = sessionStorage.getItem('token')
	let userRoles = sessionStorage.getItem('userRoles') || ''
	let userRolesArray = userRoles.split(',')

	useEffect(() => {
		// LCS: Enviar evento de GdC a GA - Wave 3
		sendGAEvent({
			event: 'view',
			content_group: 'gestion de usuarios',
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

			<Grid container justifyContent='center' alignItems='center' className={styles.container}>
				<Grid item xs={11} sm={10} className={styles.maxWidthForBigScreens}>
					<Grid item className={styles.headerTitle}>
						{t('gestionUsuarios.management.header.title')}
					</Grid>

					<UsersManagementNavbar tabValue={tabValue} setTabValue={setTabValue}/>

					<Grid container justify='flex-start' className={styles.subContainer}>
						{(tabValue === 1) &&
							<DeleteUser />
						}
						{(tabValue === 2) &&
							<ActiveUsers />
						}
					</Grid>
				</Grid>
			</Grid>
		</>
	);
}

export default GestionUsuarios;
