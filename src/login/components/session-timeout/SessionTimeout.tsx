import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Dialog from '../../../common/components/dialog/Dialog';
import Button from '../../../common/components/button/Button';

import useStyles from './SessionTimeout.styles';
import { DialogContent } from '@material-ui/core';
import CloseIcon from '../../../assets/icons/cerrar.svg';
import AlertIcon from '../../../assets/icons/aviso_alerta_pop_up.svg';

import { thunkGetMasterData } from '../../../provisions/store/actions/ProvisionsThunkActions';

const SessionTimeout = (props: any) => {

	let isLoggedIn = false;
	let timer;
	let timerVal = 60000;
	const classes = useStyles({});
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const user = useSelector((state: any) => state.user)

	const [showDialog, setShowDialog] = useState(false);
	// const [timeVal, setTimeVal] = useState(60000 * 15);

	useEffect(() => {
		if(user.sessionTime) {
			/*const callGetTimeFromMasterData = async () => {
				await getTimeFromMaterData();
			}
			
			callGetTimeFromMasterData();*/

			//setTimeVal(user.sessionTime*timerVal);
			window.addEventListener('scroll', () => restartTimer(user.sessionTime));
			window.addEventListener('keypress', () => restartTimer(user.sessionTime));
			window.addEventListener('mousemove', () => restartTimer(user.sessionTime));
			window.addEventListener('touchstart', () => restartTimer(user.sessionTime));
		}
	}, [user.sessionTime]);

	/*const getTimeFromMaterData = async () => {
		let timeInMillis: number;
		
		if (!sessionStorage.getItem('timeout')) {
			await dispatch(thunkGetMasterData('SESSION_TIMEOUT', 'ES', 'TIMEOUT', (response) => {
				if (response !== undefined && response.length > 0) {
					sessionStorage.setItem('timeout', (response[0].value * timerVal).toString())
					timeInMillis = parseInt(sessionStorage.getItem('timeout'))
				} else {
					timeInMillis = 10 * timerVal
				}
			}));
		} else {
			timeInMillis = parseInt(sessionStorage.getItem('timeout'))
		}
		
		timerVal = timeInMillis

	}*/

	const restartTimer = (time) => {
		clearTimeout(timer);
		timer = setTimeout(handleLogOut, time*timerVal);
	}

	const checkLoggedIn = () => {
		let token = sessionStorage.getItem('token') || '';

		if (token !== null && token !== '') {
			isLoggedIn = true;
		} else {
			isLoggedIn = false;
		}
	}

	const handleLogOut = () => {
		if (!showDialog) {
			checkLoggedIn();

			if (isLoggedIn) {
				handleTimeout();
				isLoggedIn = false;
				setShowDialog(true);
			}
		}
	}

	const handleTimeout = () => {
		props.handleTimeoutHeader();
	}

	const handleCloseDialog = () => {
		setShowDialog(false);
	}

	if (showDialog) {
		return (
			<Dialog className={classes.dialog} open={showDialog} onClose={handleCloseDialog}>
				<DialogContent className={classes.container}>
					<img src={CloseIcon} className={classes.closeButton} alt='close' onClick={handleCloseDialog} />
					<img src={AlertIcon} />
					<div className={classes.title}>
						{t('login.sessionTimeoutAlert')}
					</div>
					<div className={classes.body}>
						{t('login.sessionTimeout')}
					</div>
					<Button className={classes.button} text={t('common.buttons.accept')} color='primary' size='large' variant='contained' onClick={handleCloseDialog} />
				</DialogContent>
			</Dialog>
		)
	} else {
		return (null);
	}
}

export default SessionTimeout;
