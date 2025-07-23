import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom'
import Grid from '@material-ui/core/Grid';
import useStyles from './ConsultasInformes.styles';
import UserProfile from '../common/interfaces/UserProfile';
import Spinner from '../common/components/spinner/Spinner';

import Navbar from './components/header-navigation/Navbar';
import { ControlPagos } from './components/ControlPagos';
import ControlMensajeria from './components/consultNavigation/controlMensajeria/ControlMensajeria';
import InterruptionsAlerts from './components/consultNavigation/interruptionsAlerts/InterruptionsAlerts';
import { ClientDigitizationControl } from './components/clientDigitizationControl/ClientDigitizationControl';
import AuditManagement from '../auditManagement/components/AuditManagement';

// LCS: Importa la función - Wave 3
import { removeEmails, sendGAEvent } from '../core/utils/gtm';

const ConsultasInformes = (props: any) => {

	const [isLoading] = useState<boolean>(false);
	const [user, setUser] = useState<UserProfile>();
	const [tabValue, setTabValue] = useState<number>(0);
	let token = sessionStorage.getItem('token')
	let userRoles = sessionStorage.getItem('userRoles') || ''
	let userRolesArray = userRoles.split(',')
	const queryParameters = new URLSearchParams(window.location.search)
	const urlValue = queryParameters.get('value')

	const { t } = useTranslation();
	const styles = useStyles({});

	useEffect(() => {
		// LCS: Enviar evento de GdC a GA - Wave 3
		sendGAEvent({
			event: 'view',
			content_group: 'consultas e informes',
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
		if (props.location.state !== undefined) {
			setUser(props.location.state.user);
		}
	}, [props.location]);

	useEffect(() => {
		if (urlValue === 'pasarela') {
			setTabValue(1)
		}
	}, [urlValue])

	if (!token) {
		return <Redirect to='/login' />
  }
	
  if (!userRolesArray.includes('US_CC')) {
		if (userRolesArray.includes('US_SUPPLYPOINT_CLIENT') || userRolesArray.includes('US_MANAGER')) {
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
				<Grid container className={styles.maxWidthForBigScreens}>

					{/* Cambiar la comprobación del rol por US_DASHBOARD_PASARELA una vez nos lo den de alta (descomentar línea de abajo)*/}
					{/* {userRolesArray.includes('US_DASHBOARD_PASARELA') && */}
					{userRolesArray.includes('US_CC') &&
						<Navbar tabValue={tabValue} setTabValue={setTabValue} />
					}

					<Grid container justify='flex-start' className={styles.subContainer}>

						{(tabValue === 0) &&
							<ControlMensajeria/>
						}

						{(tabValue === 1) &&
							<ControlPagos />
						}

						{(tabValue === 2) &&
							<InterruptionsAlerts />
						}
						
						{(tabValue === 3) &&
						  <ClientDigitizationControl />
						}
						
						{(tabValue === 4) &&
							<AuditManagement />
						}

					</Grid>
				</Grid>
			</Grid>
		</>
	);
}

export default ConsultasInformes;
