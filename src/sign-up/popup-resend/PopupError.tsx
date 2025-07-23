import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';



import useStyles from './PopupError.styles';
import { Dialog, DialogContent } from '@material-ui/core';
import Button from '../../common/components/button/Button';

import CloseIcon from '../../assets/icons/cerrar.svg';
import AlertIcon from '../../assets/icons/misdocumentos_rechazado.svg'
 


const PopupError = (props: any) => {
	const { errorResend, setErrorResend } = props
	const classes = useStyles({});
	const { t } = useTranslation();

	const handleCloseDialog = () => {
		setErrorResend(false);
	}
		return (
			<Dialog className={classes.dialog} open={errorResend} onClose={handleCloseDialog}>
				<DialogContent className={classes.container}>
					<img src={CloseIcon} className={classes.closeButton} alt='close' onClick={handleCloseDialog} />
					<img src={AlertIcon} className={classes.icon}/>
					<div className={classes.title}>
						{t('signUp.signUpError.item6')}
					</div>
					<div  className={classes.body}>
						{t('signUp.signUpError.item7')}
					</div>
					
					<Button className={classes.button} text={t('signUp.signUpSuccess.close')} color='primary' size='large' variant='contained' onClick={handleCloseDialog} />
				</DialogContent>
			</Dialog>
		)
	} 

export default PopupError;
