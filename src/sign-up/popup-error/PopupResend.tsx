import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';



import useStyles from './PopupResend.styles';
import { Dialog, DialogContent } from '@material-ui/core';
import Button from '../../common/components/button/Button';

import CloseIcon from '../../assets/icons/cerrar.svg';
import OkICon from '../../assets/icons/ico_ok.svg';
 

const PopupResend = (props: any) => {
	const { showDialogResend, setShowDialogResend} = props
	const classes = useStyles({});
	const { t } = useTranslation();

	const handleCloseDialog = () => {
		setShowDialogResend(false);
	}
	

		return (
			<Dialog className={classes.dialog} open={showDialogResend} onClose={handleCloseDialog}>
				<DialogContent className={classes.container}>
					<img src={CloseIcon} className={classes.closeButton} alt='close' onClick={handleCloseDialog} />
					<img src={OkICon} className={classes.icon}/>
					<div className={classes.title}>
						{t('signUp.signUpSuccess.resend')}
					</div>
					
					<Button className={classes.button} text={t('signUp.signUpSuccess.close')} color='primary' size='large' variant='contained' onClick={handleCloseDialog} />
				</DialogContent>
			</Dialog>
		)
	} 

export default PopupResend;
