import React, { useEffect, useState } from 'react';
import UploadPhotography from './UploadPhotography';
import { Box, Collapse, DialogContent, ExpansionPanel, ExpansionPanelSummary, Grid, IconButton, List, ListItem, Typography, Button as ButtonMui, Link } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import XLSX from 'xlsx';
import { useDispatch, useSelector } from 'react-redux';

import icon1 from '../../../../assets/icons/datos_tecnicos_instalacion_con_nuemero.png';
import icon2 from '../../../../assets/icons/fotografias_instalacion_con_nuemero.png';
import koIcon from '../../../../assets/icons/Interfaz_24_cruz_cerrar_error_rojo.svg';
import okIcon from '../../../../assets/icons/ico_ok.svg';
import erroIcon from '../../../../assets/icons/misdocumentos_rechazado.svg';
import alertIcon from '../../../../assets/icons/aviso_seguridad.svg';
import alertIcon2 from '../../../../assets/icons/aviso_alerta_pop_up.svg';
import CloseIcon from '../../../../assets/icons/cerrar.svg';
import useStyles from '../JobExecution.styles';
import Button from '../../../../common/components/button/Button';
import Dialog from '../../../../common/components/dialog/Dialog';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { formatDateAndHourStringWithBars } from '../../../../common/lib/FormatLib';
import { adminCheck } from '../../../../common/lib/ValidationLib'
import TextButton from '../../../../common/components/text-button/TextButton';
import { thunkUpdateDossier, thunkFetchFormData, thunkExpedientForm } from '../../../store/actions/ProvisionsThunkActions';
import Spinner from '../../../../common/components/spinner/Spinner';

const InitialForms = (props) => {
	const classes = useStyles({})
	const dispatch = useDispatch()
	const { t } = useTranslation()

	const [firstFase, setFirstFase] = useState(true)
	const [secondFase, setSecondFase] = useState(false)
	const [moreSuplies, setMoreSuplies] = useState(false)
	const [tr9Dialog, setTr9Dialog] = useState(false);
	const currentProvision = useSelector((state: any) => state.provisions.currentProvision)
	const [isOpen, setIsOpen] = React.useState(false);
	const [Open, setOpen] = React.useState(false);
	const [expand, setExpand] = useState(true);
	const [isDraftLoading, setIsDraftLoading] = useState(false)

	const {
		setIsLoading,
		handleSendSelfJobsEndDate,
		setexpandSubPanels,
		setDisabledPanel1,
		comunicateResolutionDateZeus,
		setShowForms,
		setShowDialogSupply,
		errorSupply,
		showError,
		okSupply,
		recoveredDraft,
        setRecoveredDraft,
        resetRecoveredDraft,
		handleSaveDraft,
		showDraftContainer,
		setShowDraftContainer,
		setRecoverDraft,
		setIsContinueDraft,
		setIsContinueVerification,
		setIsActiveSaveDraftBtn,
		setInPersonVisit,
		setIsValidPersonVisit,
		setPersonVisitDate,
		setErrorForm,
		tr9callOK,
		setTr9callOK,
		totalSupplies
	} = props;


	const enableSecondFase = () => {
		// se habilita la segunda fase inicial para emepzar la verificación de la instalacion
		setSecondFase(true)
		setFirstFase(false)
		getDraftData();
	}
	const enableFirstFase = () => {
		// se habilita la segunda fase inicial para emepzar la verificación de la instalacion
		setSecondFase(false)
		setMoreSuplies(false)
		setFirstFase(true)
	}

	const enableForms = (optionContinue: string) => {
		setDisabledPanel1(false)
		setexpandSubPanels('panel1')
		setSecondFase(false)
		setMoreSuplies(false)
		setFirstFase(false)
		setShowForms(true)
		setIsActiveSaveDraftBtn(false)
		if(optionContinue === 'continueVerification') {
			setIsContinueVerification(true)
			setIsContinueDraft(false)
		} else {
			setIsContinueVerification(false)
			setIsContinueDraft(true)
		}
	}

	const continueWithDraft = () => {
		setRecoverDraft(true)
		enableForms('continueDraft')		
	}

	const enableMoreSuppliesForms = () => {
		// se procede a enviar la fechaFinTrabajosPropios a ZEUs y se informa al usuario
		setMoreSuplies(true)
		setFirstFase(false)
		setSecondFase(false)
	}

	const handleOpenTr9Dialog = () => {
		setTr9Dialog(true);
	}

	const handleCloseTr9Dialog = () => {
		setTr9Dialog(false);
	}

	const handleAcceptResolution = () => {
		//tratamos la resolución de anomalias
		setIsLoading(true)
		handleSendSelfJobsEndDate(comunicateResolutionDateZeus)
		setIsLoading(false)
		setTr9Dialog(false);
	}

	const [openAlert, setOpenAlert] = useState<boolean>(false)
	const [isValid, setIsValid] = useState<boolean>(false)
	const [dateAlert, setDateAlert] = useState<string>('')

	const getDate = () => {
		let dateZEUS = new Date()
		let year = dateZEUS.getFullYear();
		let month = (dateZEUS.getMonth() + 1).toString().padStart(2, '0');
		let day = dateZEUS.getDate().toString().padStart(2, '0');
		let hours = dateZEUS.getHours().toString().padStart(2, '0');
		let minutes = dateZEUS.getMinutes().toString().padStart(2, '0');
		let seconds = dateZEUS.getSeconds().toString().padStart(2, '0');
		setPersonVisitDate(day + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ':' + seconds)

		return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ':' + seconds

	}

	const [busZeusAttempts, setBusZeusAttempts] = useState(1)
	const expedientType = 'TR9'

	const handleRequestVisit = async() => {
		setIsLoading(true)

		const date = getDate()
		const [datePart, timePart] = date.split(' ');
		const [day, month, year] = datePart.split('/');
		const timeFormatted = timePart.replace(/:/g, '');
		const selfJobsEndDate = `${year}${month}${day}${timeFormatted}`

		const continueDossier = await updateDossierOk(timePart, datePart, selfJobsEndDate)
		if(continueDossier[0]){
      		const continueSendExp = await handleSendExp(selfJobsEndDate, continueDossier[1])
			if(continueSendExp) setIsLoading(false)
	    } 
	}

	const updateDossierOk = async(timePart, datePart, selfJobsEndDate) => {
		
		const [hours, minutes, seconds] = timePart.split(':')
		const dateAlert = `${datePart} ${hours}:${minutes}h`

		const dossierCod = currentProvision.dossierCod
		const data = {
			dossierCod: currentProvision.dossierCod,
			fechaFinTrabajosPropios: selfJobsEndDate,
			tr9AdminResult: '2'
		}
	
		let continueCall = [false, false]
		await dispatch(thunkUpdateDossier(dossierCod, false, data, (response) => {
			if (response && response.result && (response.result.codResult === '0' || response.result.codResult === '0000')) {
				setDateAlert(dateAlert)
				setIsValid(true)
				setInPersonVisit(true)
				setIsValidPersonVisit(true)
				setTr9callOK(true)
				setSecondFase(false)
				continueCall = [true, true]
			} else {
				setErrorForm(true)
				continueCall = [true, false]
			}
			setInPersonVisit(true)
			setOpenAlert(true)
		}))

		return continueCall
	}

	const handleSendExp = async (selfJobsEndDate, sentToAtom) => {	
		setBusZeusAttempts(prevBusZeusAttempts => prevBusZeusAttempts + 1)

		let continueCall = false

		for (let i = 1; i <= currentProvision.anomalyList.length + 1; i++) {
			const sentData = {
				expedientId: currentProvision.dossierCod,
				attempts: i,
				openingDate: currentProvision.registerDate,
				installationEndDate: selfJobsEndDate,
				activationUSer: '2',
				busZeusAttempts: busZeusAttempts,
				sentToAtom: sentToAtom,
				expedientType: expedientType
			}
			
			await dispatch(thunkExpedientForm(sentData, (response) => { continueCall = true }))			
		}
		return continueCall
	}
	
	const getDraftData = async() => {
		setIsDraftLoading(true)
		try {
			await dispatch(thunkFetchFormData(currentProvision.dossierCod, (response => {
				if (response) {
					if (/*!adminCheck() &&*/ response?.result?.codResult === '0000') {
						if(!!response?.taisTr9Data?.power){
							resetRecoveredDraft()
							setRecoveredDraft(response.taisTr9Data)
							setShowDraftContainer(true)
							setIsDraftLoading(false)
						}
					}
				}
			})));	
		} catch (error) {
			setIsDraftLoading(false)
		}
		setIsDraftLoading(false)
	}

	const numberSupplies = () => {
		const totalSupplies = currentProvision.powerList.reduce(
		  (sum, item) => sum + (parseInt(item.numberOfSupplies, 10 )|| 0),
		  0
		)
		  
		return(
		  <Grid item className={classes.verifySubtitleMulti} xs={12}>
			{totalSupplies > 1 ?
				t('provisions.jobExecution.isTr9.supplyInfo', {
				numberOfSupplies: totalSupplies,
				}) 
			  : 
				t('provisions.jobExecution.isTr9.supplyInfoSingular', {
				  numberOfSupplies: totalSupplies,
				})
			}
		  </Grid>
		)
	}

	return (
		<>
			<Alert 
				openAlert={openAlert}
				setOpenAlert={setOpenAlert}
				isValid={isValid}
				dateAlert={dateAlert}
			/>
			{
				isDraftLoading &&
				<Spinner fixed={true} />
			}
			<Grid container xs={12} justifyContent='center' alignItems='center' style={{ marginBottom: '10px', border: 'none'}}>
				{firstFase &&
					<>
						{/* <Grid xs={12} md={10} style={{marginBottom: '20px'}}>
							<Grid style={{fontSize: 20, color: '#004571', fontWeight: 'bold'}}>
								{t('provisions.jobExecution.isTr9.verifySubtitle')}
							</Grid>
							<Grid style={{fontSize: 15, paddingTop: '15px', color: '#64666A'}}>
								{t('provisions.jobExecution.isTr9.verifyPhrase')}
							</Grid>
						</Grid> */}
						{currentProvision.hippo && currentProvision.hippo.isTr9 && !okSupply && currentProvision.anomalyList.length >= 1 && (currentProvision.hippo.isTr9 === 1 || currentProvision.hippo.isTr9 === 2)  ?
							<Grid container xs={12} md={12} justifyContent='center' className={classes.anomaliesContainerOnlyBorder}>
								<Grid item xs={12} md={12}>
									<img src={koIcon} className={classes.iconBig} />
								</Grid>
								<Grid item xs={12} md={12} className={classes.verifyISubtitle}>{t('provisions.jobExecution.isTr9.anomaliDetect1')}</Grid>
								<Grid item xs={12} md={12} className={classes.verifySubtext2}>{t('provisions.jobExecution.isTr9.anomaliDetect2')}</Grid>

								{currentProvision.anomalyList.length >= 1 &&
									<Grid className={classes.containerBoxGrid}>						
										<Box className={classes.containerBox}>
											<div className={classes.headerBox} onClick={() => setIsOpen(!isOpen)}>
												<Typography variant='h6' className={classes.titleBox}>
													{t('provisions.jobExecution.isTr9.typeAnomalia')}
												</Typography>
												<IconButton>
													{isOpen ? <ExpandLess color='primary' /> : <ExpandMore color='primary' />}
												</IconButton>
											</div>
											<Collapse in={isOpen}>
												<List className={classes.listBox}>
													{currentProvision.anomalyList.map((anomaly, index) => (
														<ListItem key={index} className={classes.listItemBox}>
															<Typography variant='body1' className={classes.commentTextBox}>
																{anomaly.comments === '' ? t('provisions.jobExecution.isTr9.commentAnomalia') : anomaly.comments } 
															</Typography>
														</ListItem>
													))}
												</List>
											</Collapse>
										</Box>
									</Grid>
								}

								<Grid container className={classes.btnInit} item xs={12} justifyContent='center'>
									<Grid item xs={9} md={6}>
										{totalSupplies > 1 
											?
												<Button
													text={t('provisions.jobExecution.isTr9.supplyButton')}
													fullWidth
													color='primary'
													size='large'
													variant='contained'
													onClick={() => {
														setShowDialogSupply(true);
													}}
												/>
											:
												<Button
													text={t('provisions.jobExecution.isTr9.iniButton')}
													fullWidth
													color='primary'
													size='large'
													variant='contained'
													onClick={() => { enableSecondFase() }}
												/>
										}
									</Grid>
								</Grid>
								
							</Grid>
						:	
							<Grid container item className={classes.tr9ButtonContainerNoColor} xs={12} md={12}>					
								{okSupply ? (
									<>
										{numberSupplies()}
										<Grid container item xs={12} md={12} className={classes.errorBox}>
											<Grid item xs={12} style={{textAlign:'center'}}>
												<img src={okIcon} width={'25px'} />
											</Grid>
											<Grid item xs={12}>
												<Typography className={classes.errorTitle}>{adminCheck() ? t('provisions.jobExecution.okProcessAdmin') : totalSupplies > 1 ? t('provisions.jobExecution.isTr9.OkResponseSupply') : t('provisions.jobExecution.okProcess')}</Typography>
												<Typography className={classes.errorSubtitle}>{t('provisions.jobExecution.okProccessDate') + formatDateAndHourStringWithBars(new Date())}h</Typography>
											</Grid>
											<Grid item xs={12}>
												<Typography className={classes.errorSubtitle}>{t('provisions.jobExecution.okProccess2')}</Typography>  
											</Grid>
										</Grid>
									</>
								) : (
									(() => {
									
									const totalSupplies = currentProvision.powerList.reduce(
									(sum, item) => sum + (parseInt(item.numberOfSupplies, 10 )|| 0),
									0
									);

									return (
									<>
										{totalSupplies > 1 && (
											<Grid item className={classes.verifySubtitle} xs={12}>
												{totalSupplies > 1 ?
														t('provisions.jobExecution.isTr9.supplyInfo', {
														numberOfSupplies: totalSupplies,
														}) 
													: 
														t('provisions.jobExecution.isTr9.supplyInfoSingular', {
															numberOfSupplies: totalSupplies,
														})
												}
											</Grid>
										)}

										{totalSupplies === 1 && (
											<Grid item className={classes.verifySubtitle} xs={12}>
												{totalSupplies > 1 ?
														t('provisions.jobExecution.isTr9.supplyInfo', {
														numberOfSupplies: totalSupplies,
														}) 
													: 
														t('provisions.jobExecution.isTr9.supplyInfoSingular', {
															numberOfSupplies: totalSupplies,
														})
												}
											</Grid>
										)}

										<Grid item className={classes.verifySubtitle} xs={12}>
											{t('provisions.jobExecution.isTr9.supplyAnomalia')}
										</Grid>

										{totalSupplies > 1 ? (
											<>
												<Grid item className={classes.verifySubtext} xs={12}>
													{t('provisions.jobExecution.isTr9.verifyPhraseSupply')}
													<strong>
														{t('provisions.jobExecution.isTr9.verifyPhraseSupply2')}
													</strong>
												</Grid>

												<Grid
													container
													className={classes.btnInit}
													item
													xs={12}
													justifyContent='center'
												>
													<Grid item xs={12} md={9}>
														<Button
															text={t('provisions.jobExecution.isTr9.supplyButton')}
															fullWidth
															color='primary'
															size='large'
															variant='contained'
															onClick={() => {
																setShowDialogSupply(true);
															}}
														/>
													</Grid>
												</Grid>
											</>
										) : (
											<>
												<Grid item className={classes.verifySubtext} xs={12}>
													{t('provisions.jobExecution.isTr9.verifyPhraseAnomalias')}
												</Grid>

												<Grid
													container
													className={classes.btnInit}
													item
													xs={12}
													justifyContent='center'
												>
													<Grid item xs={12} md={6}>
														<Button
															text={t('provisions.jobExecution.isTr9.iniButton')}
															fullWidth
															color='primary'
															size='large'
															variant='contained'
															onClick={() => {
																enableSecondFase();
															}}
														/>
													</Grid>
												</Grid>
											</>
										)}
									</>
									);
								})()
								)}
							
								{showError &&
									<Grid container className={classes.verifyOkSupply} item xs={12}>
										<img src={erroIcon} className={classes.iconSupply} alt='Error Icon' />
										<Grid item className={classes.colorSub}  xs={12}>
											{t('provisions.jobExecution.isTr9.ErrorResponseSupply')}
										</Grid>
										<Grid item className={classes.colorSubt} xs={12}>
											{t('provisions.jobExecution.isTr9.ErrorResponseSupply2')}
										</Grid>
										<Grid item className={classes.colorSubt} xs={12}>
											{t('provisions.jobExecution.isTr9.ErrorResponseSupply3')}
											<a className={classes.link} target='_blank' href='https://www.ufd.es/atencion-al-cliente'>{t('provisions.jobExecution.isTr9.ErrorResponseSupply4')}</a>
										</Grid>
									</Grid>
								}
							</Grid>
						}

						<Grid item>						
							{/* <Grid item className={classes.supplyAnomaliaLoad} xs={12}>
								{t('provisions.jobExecution.isTr9.supplyAnomaliaLoad')}
							</Grid> */}
									
							<Grid className={classes.supplyAnomaliaSubtitle} item>
								{t('provisions.jobExecution.isTr9.supplyAnomaliaSubtitle')}
							</Grid>
						</Grid>
					</>
             	}
				{secondFase &&
					<>
						<Grid container className={classes.tr9ButtonContainer}>
							<Grid container>
								<Grid item className={`${classes.verifySubtext2} ${classes.tr9ContainerAlign}`}>
									<b>{t('provisions.jobExecution.recommendTechnicalPhraseBold')}</b>{t('provisions.jobExecution.recommendTechnicalPhrase')}
								</Grid>
							</Grid>

							<Grid container className={classes.tr9ContainerInfoWhite}>
								<Grid container className={`${classes.tr9ContainerInfo} ${classes.tr9ContainerAlign}`}>
									<Grid item className={classes.tr9ContainerImage}><img src={icon1} alt='' className={classes.tr9Image}/></Grid>
									<Grid item className={classes.tr9ContainerText}>{t('provisions.jobExecution.verifyTechnicalData')}</Grid>
								</Grid>

								<Grid container className={`${classes.tr9ContainerInfo} ${classes.tr9ContainerAlign}`}>
									<Grid item className={classes.tr9ContainerImage}><img src={icon2} alt='' className={classes.tr9Image}/></Grid>
									<Grid item className={classes.tr9ContainerText}>{t('provisions.jobExecution.verifyPhotography')}</Grid>
								</Grid>
							</Grid>

							<Grid container>
								<Grid item className={`${classes.verifySubtext2} ${classes.tr9ContainerAlign}`}>
									{t('provisions.jobExecution.installationAnomalies1')}<b>{t('provisions.jobExecution.installationAnomalies2')}</b>{t('provisions.jobExecution.installationAnomalies3')}<b>{t('provisions.jobExecution.installationAnomalies4')}</b>{t('provisions.jobExecution.installationAnomalies5')}
								</Grid>
							</Grid>

							<Grid container>
								<Grid item className={`${classes.verifySubtext2} ${classes.tr9ContainerAlign}`} style={{marginTop: 0}}>
									{t('provisions.jobExecution.saveDraftText')}
								</Grid>
							</Grid>

							<Grid container>
								<Grid item className={`${classes.verifySubtext2} ${classes.tr9ContainerAlign}`} style={{marginTop: 0}}>
									{t('provisions.jobExecution.photographsProvided')}
								</Grid>
							</Grid>

							<Grid container className={classes.tr9ButtonContainerRed}>
								<Grid container md={12}>
									<Grid item md={1} className={classes.middle_icon_red_lightning}>
										<img width={'30px'} src={alertIcon} alt='' />
									</Grid>
								</Grid>
								<Grid item md={12} className={classes.verifySubtext2BoldRed}>
									{t('provisions.jobExecution.isTr9.warning1')}
								</Grid>
								<Grid item md={12} className={classes.verifySubtext2Red}>
									{t('provisions.jobExecution.isTr9.warning2')}
								</Grid>
							</Grid>

							{
								(!showDraftContainer) ?
								<Grid container className={classes.tr9ButtonContainer} style={{display: 'flex'}}>
									<Grid item className={classes.tr9ButtonBack}>
										<Button text={t('provisions.jobExecution.backButton')} className={classes.backButton} size='large' variant='contained' onClick={() => { enableFirstFase() }} />
									</Grid>
									<div className={classes.tr9Space}/>
									<Grid item className={classes.tr9ButtonStart}>
										<Button text={t('provisions.jobExecution.isTr9.startVerificationButton')} color='primary' size='large' variant='contained' onClick={() => { enableForms('continueVerification') }} />
									</Grid>
								</Grid>
								:
								<Grid container spacing={2} xs={12} md={10} direction='column'>
								<Grid item xs={12}>
									<Button 
										color='primary'
										className={classes.btnNextDraft}
										text={
											<span style={{ lineHeight: '1.2' }}>
												{t('provisions.jobExecution.isTr9.nextDraft')} <br />
												{(recoveredDraft && recoveredDraft.save_date) ? 
													t('provisions.jobExecution.isTr9.nextDraft2') + recoveredDraft.save_date + t('provisions.jobExecution.isTr9.nextDraft3')
													: 
													t('provisions.jobExecution.isTr9.nextDraft4')
												}
											</span>
									 	 }
										size='large'
										variant='contained'
										onClick={() => continueWithDraft()} 
									/>
								</Grid>
								<Grid className={classes.linkDraftSave} item xs={12}>
									<Link
										onClick={() => 
											{
												resetRecoveredDraft()
												handleSaveDraft()
												setShowDraftContainer(false)
											}
										}
										className={classes.linkDraft}
									>
										{t('provisions.jobExecution.isTr9.linkDraft')}
									</Link>
								</Grid>
							
								{/* <Grid item xs={12}>
									<Button 
										text={t('provisions.jobExecution.backButton')} 
										className={classes.backButton} 
										size='large'
										variant='contained' 
										onClick={() => enableFirstFase()} 
									/>
								</Grid> */}
							</Grid>
							}
							

							{adminCheck() &&
								<>
									<ButtonMui
										className={classes.verifyWith}
										onClick={() => handleRequestVisit()}
										style={{ textTransform: 'none', padding: 0, width: '250px' }}
									>
											<Grid container direction='column' className={classes.verifyBg}>
											<p className={classes.verifyMargin} style={{fontWeight: 'bold'}}>{t('provisions.jobExecution.isTr9.requestVisit')}</p>
											<p className={classes.verifyMargin}>{t('provisions.jobExecution.isTr9.verifyPhraseSuper')}</p>
											</Grid>
									</ButtonMui>
									<Grid container className={classes.verifyTitleOrange} md={10}>
										{t('provisions.jobExecution.isTr9.verifyNoClient')}
									</Grid>
								</>
							}
						</Grid>
						{/* <Grid container className={classes.supplyAnomaliaLoad} md={10}>
							{t('provisions.jobExecution.isTr9.supplyAnomaliaLoad')}
						</Grid> */}
									
						<Grid container className={classes.supplyAnomaliaSubtitle}>
							{t('provisions.jobExecution.isTr9.supplyAnomaliaSubtitle')}
						</Grid>
					</>
				}
				{
					moreSuplies &&
					<Grid container xs={11} sm={11} md={11} justifyContent='center'>
						<Grid item className={classes.messageTr9}>
							{t('provisions.jobExecution.isTr9.confirmTr9part1')}{' '}<b>{comunicateResolutionDateZeus}</b>{' '}{t('provisions.jobExecution.isTr9.confirmTr9part2')}<b>{t('provisions.jobExecution.isTr9.confirmTr9part3')}</b>
						</Grid>
						<Grid container className={classes.tr9ButtonContainerNoColor} xs={12} md={10}>
							<Grid item xs={12} md={6}>
								<Button text={t('provisions.jobExecution.backButton')} className={classes.whiteButton} size='large' variant='contained' onClick={() => { enableFirstFase() }} />
							</Grid>
							<Grid item xs={12} md={6} >
								<Button text={t('provisions.jobExecution.confirmVerify')} color='primary' size='large' variant='contained' onClick={() => { handleAcceptResolution() }} />
							</Grid>
						</Grid>
					</Grid>
				}

			</Grid>
		</>
	);

}

export const Alert = (props: any) => {
	const classes = useStyles({})	
	const { t } = useTranslation()
	const { openAlert, setOpenAlert, isValid, dateAlert } = props

	const handleCloseAlert = () => {
		setOpenAlert(false)
	}	

	return (		
		<Dialog className={classes.alert} open={openAlert} onClose={handleCloseAlert} {...props}>
      		<DialogContent>
				<TextButton className={classes.alertClose} onClick={handleCloseAlert}>
					<img src={CloseIcon} alt='' style={{width: '10px'}}/>
				</TextButton>
        		<Grid
					container
					className={classes.alertContainer}
					direction='column'
					justifyContent='center'
					alignItems='center'
					spacing={2}
				> 
					<Grid item >
						<Grid container className={classes.alertContainerText} spacing={1}>
							<Grid item xs={12} sm={2} md={2} className={classes.alertBlock}>
								<img src={isValid ? okIcon : erroIcon} className={classes.alertIcon} style={{width: '50px'}} alt='' onClick={handleCloseAlert} />
							</Grid>
							<Grid item className={classes.alertText}>
								{isValid ? <label>{t('provisions.jobExecution.isTr9.requestVisitSuccess')}</label> : <label>{t('provisions.jobExecution.isTr9.requestVisitError')}</label>}<br/>
								{isValid && <label>{dateAlert}</label>}
							</Grid>
							{!isValid && <Grid item className={classes.alertText} style={{paddingTop: 20}}>
								<label style={{color: 'dimgrey', fontSize: '16px'}}>{t('provisions.jobExecution.tryLater')}</label>
							</Grid>}
						</Grid>
					</Grid>
					<Grid item>
						<Button
							text={isValid ? t('common.buttons.continue') : t('common.buttons.close')}
							color='primary'
							size='large'
							variant='contained'
							onClick={handleCloseAlert}
						/>
					</Grid>
        		</Grid>
      		</DialogContent>
    	</Dialog>
	)
}

export default InitialForms
