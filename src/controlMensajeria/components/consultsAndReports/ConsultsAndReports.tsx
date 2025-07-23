import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Spinner from '../../../common/components/spinner/Spinner';
import ControlMensajeria from '../consultNavigation/controlMensajeria/ControlMensajeria';
import ConsultsAndReportsNavbar from '../consults-and-reports-navigation/ConsultsAndReportsNavigation';

import Grid from '@material-ui/core/Grid';
import useStyles from './ConsultsAndReports.styles';

import UserProfile from '../../../common/interfaces/UserProfile';
import InterruptionsAlerts from '../consultNavigation/interruptionsAlerts/InterruptionsAlerts';

const ConsultsAndReports = (props: any) => {

	const [isLoading] = useState<boolean>(false);
	const [user, setUser] = useState<UserProfile>();
	const [tabValue, setTabValue] = useState<number>(0);

	const { t } = useTranslation();
	const styles = useStyles({});

	useEffect(() => {
		if (props.location.state !== undefined) {
			setUser(props.location.state.user);
		}
	}, [props.location]);

	return (
		<>
			{(isLoading) &&
				<Spinner fixed={true} />
			}

			<Grid container justify='center' alignItems='center' className={styles.container}>
				<Grid item xs={11} sm={10} className={styles.maxWidthForBigScreens}>

					<Grid item className={styles.headerTitle}>
						{t('controlMensajeria.navigation.title')}
					</Grid>

					<ConsultsAndReportsNavbar tabValue={tabValue} setTabValue={setTabValue} />

					<Grid container justify='flex-start' className={styles.subContainer}>

						{(tabValue === 0) &&
							<ControlMensajeria user={user} />
						}

						{(tabValue === 1) &&
							<InterruptionsAlerts />
						}

					</Grid>
				</Grid>
			</Grid>
		</>
	);
}

export default ConsultsAndReports;
