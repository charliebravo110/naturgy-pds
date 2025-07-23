import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { DialogContent, DialogActions } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'

import Button from '../../../../../../../common/components/button/Button'
import TextButton from '../../../../../../../common/components/text-button/TextButton'
import CloseIcon from '../../../../../../../assets/icons/cerrar.svg'
import consumoTotal from '../../../../../../../assets/icons/consumo_total.svg';

import useStyles from './Content.styles'
import Input from '../../../../../../../common/components/input/Input'
import { validateMail, validatePhoneNumber } from '../../../../../../../common/lib/ValidationLib'
import TextArea from '../../../../../../../common/components/textarea/TextArea'
import { thunkCreateNewRequest, thunkGetRequestsList, thunkNoticeSgi } from '../../../../../../../requests/store/actions/RequestsThunkActions'
import { showError } from '../../../../../../../common/store/actions/ErrorActions';
import SystemErrorModal from '../../../../incidencia/form/systemErrorModal/SystemErrorModal';
// LCS: Importa la función - Wave 2
import { sendGAEvent } from '../../../../../../../core/utils/gtm';

const Content = (props: any) => {
	const classes = useStyles({})
	const { t } = useTranslation()
	const dispatch = useDispatch()

	const theme = useTheme()

	const {
		handleCloseDialog,
		handleAcceptDialog,
		cups,
		address,
		name,
		document,
		user,
		setCreated,
		setError,
		supply
	} = props

	const formatText = (text: string): string => {
		return (text.substring(0, 1) + text.substring(1, text.length).toLowerCase())
	}

	const surname = user && user.surName && user.surName.split(' ')

	const [disableButton, setDisableButton] = useState<boolean>(true)
	const [tempSelectedState, setTempSelectedState] = useState(2)

	// Form inputs
	const [firstName, setFirstName] = useState<string>(user && user.name ? formatText(user.name) : '')
	const [surname1, setSurname1] = useState<string>(surname && surname[0] ? formatText(surname[0]) : '')
	const [surname2, setSurname2] = useState<string>(surname && surname[1] ? formatText(surname[1]) : '')
	const [email, setEmail] = useState<string>(user && user.email ? user.email : '')
	const [telephone, setTelephone] = useState<string>(user && user.phone ? user.phone : '')
	const [remark, setRemark] = useState<string>('');

	const [tipology, setTypology] = useState<string>('');
	const [subtipology, setSubTipology] = useState<string>('');

	const [systemErrorDialogOpen, setSystemErrorDialogOpen] = useState(true)

	const [phoneError, setPhoneError] = useState(false)
	const [emailError, setEmailError] = useState(false)

	//Questions
	const [questionState, setQuestionState] = useState<number>(1)

	const [question1, setQuestion1] = useState<string>('')
	const [question2, setQuestion2] = useState<string>('')
	const [question3, setQuestion3] = useState<string>('')
	const [question4, setQuestion4] = useState<string>('')
	const [question5, setQuestion5] = useState<string>('')

	const userPT = useSelector((state: any) => state.admin.profile.documentNumber);

	const closeFunction = () => {
		setSystemErrorDialogOpen(false)
	}

	const updateQuestion = (response: string) => {

		if (questionState === 1) {
			setQuestion1(response)
		} else if (questionState === 2) {
			setQuestion2(response)
		} else if (questionState === 3) {
			setQuestion3(response)
		} else if (questionState === 4) {
			setQuestion4(response)
		} else if (questionState === 5) {
			setQuestion5(response)
		}

		setQuestionState(questionState + 1)

	}

	useEffect(() => {
		if (firstName !== '' && surname1 !== '' && email !== '' && telephone !== '') {
			setDisableButton(false);
		} else {
			setDisableButton(true);
		}
	}, [firstName, surname1, email, telephone]);

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
	}, [telephone])

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
	}, [email])

	useEffect(() => {
		if (question1 !== '' && question2 !== '' && question3 !== '' && question4 !== '' && question5 !== '') {
			setDisableButton(false);
		} else {
			setDisableButton(true);
		}
	}, [question1, question2, question3, question4, question5]);

	// Función para crear SR en ZEUS y aviso en SGI
	const createFailureNotice = (): void => {
		const data = {
			documentType: '',
			documentNumber: user.documentNumber,
			name: (name !== '') ? name : user.name,
			surName1: (surname1 !== '') ? surname1 : surname,
			email: (email !== '') ? email : user.email,
			landline: (telephone !== '') ? telephone : user.phone,
			cellphone: '',
			tipology: tipology,
			subtipology: subtipology,
			cups: supply.cups,
			dossierNumber: '',
			comment: remark + ' CodigoAgente:' + userPT,
			documents: [{
				url: '',
				idDocumentum: '',
				nombreArchivo: '',
				format: '',
				documentType: '',
				documentState: ''
			}]
		} as any;

		dispatch(thunkCreateNewRequest(data, (response) => {
			if (!response) {
				dispatch(showError('2001', 'createServiceRequest'))

				// LCS: Enviar evento a GA para errores - Wave 2
				sendGAEvent({
					event: 'application_error',
					info: {
					  error_message: 'Error al llamar al servicio',
					  error: '2001',
					  reactComponent: 'Content.tsx - createFailureNotice',
					  codResult: '2001',
					  apiUrl: 'post /serviceRequests',
					}
				  });
			} else {

				let alcance = 0;
				let tipo = 0;
				let motivo = '';
				let enviar = 0;

				/*if (sendSgi) {
					if (notification) {
						alcance = notification.scope;
						tipo = notification.type;
						motivo = notification.reason;
					} else {
						alcance = parseInt(sgiScope);
						tipo = parseInt(sgiType);
						motivo = '';
					}
					enviar = 1;
				}*/

				let dataSgi = {
					document: user.documentNumber,
					name: name,
					surname: surname1,
					cups: supply.cups,
					province: '',
					town: '',
					street: '',
					number: '',
					postalCode: '',
					email: email,
					phone: telephone,
					observations: remark,
					alcance: alcance,
					tipo: tipo,
					motivo: motivo,
					sendSgi: enviar,
					insertHist: 0,
					srCode: response.codigoSR
				}

				dispatch(thunkNoticeSgi(dataSgi, (response2) => {

					let prevision = '';
					let errorMessage = '';

					if (response2 && response2.previsionDateTime && response2.previsionDateTime !== '') {
						//formatear
						prevision = response2.previsionDateTime;
						prevision = prevision.substr(0, 10)
					}

					// Controlar si hay error de nuestra API.
					if (response2 && response2.result.codResult !== '0000') {
						errorMessage = t('errors.XXX');
						//mostramos dialog de error
						setSystemErrorDialogOpen(true)

						// LCS: Enviar evento a GA para errores - Wave 2
						sendGAEvent({
							event: 'application_error',
							info: {
							error_message: t('errors.XXX'),
							reactComponent: 'Content.tsx - createFailureNotice',
							codResult: response2.result.codResult,
							apiUrl: 'post /warnings/incidence',
							}
						});

					} else if (response2 && response2.sgiCodResult !== '' && response2.sgiCodResult !== '1003' && response2.sgiCodResult !== '0000') {
						errorMessage = t('errors.sgi.' + response2.sgiCodResult);
						//mostramos dialog de error
						setSystemErrorDialogOpen(true)

						// LCS: Enviar evento a GA para errores - Wave 2
						sendGAEvent({
							event: 'application_error',
							info: {
							error_message: t('errors.sgi.' + response2.sgiCodResult),
							reactComponent: 'Content.tsx - createFailureNotice',
							codResult: response2.sgiCodResult,
							apiUrl: 'post /warnings/incidence',
							}
						});
					}

					if(errorMessage == ''){
						dispatch(push('/gestionAverias/resultPage', {
							code: response.codigoSR,
							remark: remark,
							type: tipo,
							scope: alcance,
							previsionDateTime: prevision,
							errorMessage: errorMessage
						}));
					}

				}));
			}
		}));

		// LCS: Lanzamos el evento - Wave 2
		sendGAEvent({
			event: 'create_malfunction_report',
			user_id: sessionStorage.getItem('id'),
			user_type: sessionStorage.getItem('user_type'),
			//user_document: sessionStorage.getItem('userDocumentLogin')
		  });

	}

	return (
		<DialogContent className={classes.modalContainer}>
			<Grid container className={classes.block}>
				<Grid container justifyContent='flex-end'>
					<TextButton className={classes.closeButton} onClick={handleCloseDialog}>
						<img src={CloseIcon} alt='' />
					</TextButton>
				</Grid>

				<Grid container className={classes.container}>
					<Grid item md={12} className={classes.title}>
						{t('averias.management.searchCups.comprovacionesSuministro.requestModal.title')}
					</Grid>

					<Grid container md={12} sm={12} xs={12} className={classes.innerArea} >
						<Grid container direction='row' md={12}>
							<Grid container direction='row' justifyContent='flex-end' md={3}>
								<Grid><img className={classes.icon} src={consumoTotal} alt='' /></Grid>
								<Grid>
									<Grid className={classes.innerDescriptionText}>{t('averias.management.searchCups.comprovacionesSuministro.consumo')}</Grid>
								</Grid>
							</Grid>
							<Grid md={6} className={classes.innerPointInformation}>{cups}</Grid>
						</Grid>
						<Grid container direction='row' md={12}>
							<Grid container direction='row' justifyContent='flex-end' md={3}>
								<Grid className={classes.innerDescriptionText}>{t('averias.management.searchCups.comprovacionesSuministro.direccion')}</Grid>
							</Grid>
							<Grid md={6} className={classes.innerPointInformation}>{address[0]}</Grid>
						</Grid>
						<Grid container direction='row' md={12}>
							<Grid container direction='row' justifyContent='flex-end' md={3}>
								<Grid className={classes.innerDescriptionText} />
							</Grid>
							<Grid md={6} className={classes.innerPointInformation}>{address[1]}</Grid>
						</Grid>
						<Grid container direction='row' md={12}>
							<Grid container direction='row' justifyContent='flex-end' md={3}>
								<Grid item className={classes.innerDescriptionText}>{t('averias.management.searchCups.comprovacionesSuministro.titular')}</Grid>
							</Grid>
							<Grid item className={classes.innerPointInformation}>{name}</Grid>
						</Grid>
						<Grid container direction='row' md={12}>
							<Grid container direction='row' justifyContent='flex-end' md={3}>
								<Grid item className={classes.innerDescriptionText}>{t('averias.management.searchCups.comprovacionesSuministro.docIdentificador')}</Grid>
							</Grid>
							<Grid item className={classes.innerPointInformation}>{document}</Grid>
						</Grid>
					</Grid>

					<Grid className={classes.inputsContainer}>
						<div className={classes.wrapperTitle}>
							<span>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.contactData')}</span>
						</div>
						<Grid container >
							<Grid item md={4} xs={12} sm={6}>
								<p className={classes.inputTitle}>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.name')}</p>
							</Grid>
							<Grid item md={4} xs={12} sm={6}>
								<p className={classes.inputTitle}>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.firstSurname')}</p>
							</Grid>
							<Grid item md={4} xs={12} sm={6}>
								<p className={classes.inputTitle}>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.secondSurname')}</p>
							</Grid>
						</Grid>

						<Grid container md={12} spacing={3}>
							<Grid item md={4} xs={12} sm={6}>
								<Input
									className={classes.input}
									onChange={(e) => setFirstName(e.target.value)}
									value={firstName}
								/>
							</Grid>
							<Grid item md={4} xs={12} sm={6}>
								<Input
									className={classes.input}
									onChange={(e) => setSurname1(e.target.value)}
									value={surname1}
								/>
							</Grid>
							<Grid item md={4} xs={12} sm={6}>
								<Input
									className={classes.input}
									onChange={(e) => setSurname2(e.target.value)}
									value={surname2}
								/>
							</Grid>
						</Grid>

						<Grid container >
							<Grid item md={4} xs={12} sm={6}>
								<p className={classes.inputTitle}>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.email')}</p>
							</Grid>
							<Grid item md={4} xs={12} sm={6}>
								<p className={classes.inputTitle}>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.phone')}</p>
							</Grid>
							<Grid item md={3} xs={12} sm={6} />
						</Grid>

						<Grid container md={12} spacing={3}>
							<Grid item md={4} xs={12} sm={6}>
								<Input
									className={classes.input}
									onChange={(e) => setEmail(e.target.value)}
									showValidationIcon
									error={email !== '' && emailError}
									value={email}
								/>
							</Grid>
							<Grid item md={4} xs={12} sm={6}>
								<Input
									className={classes.input}
									onChange={(e) => setTelephone(e.target.value)}
									showValidationIcon
									error={telephone !== '' && phoneError}
									value={telephone}
								/>
							</Grid>
							<Grid item md={3} xs={12} sm={6} />
						</Grid>
					</Grid>
					<Grid container className={classes.textArea}>
						<TextArea label={t('averias.management.searchCups.comprovacionesSuministro.requestModal.observations')} handleOnChange={setRemark} />
					</Grid>
					<Grid container md={12} sm={12} xs={12} className={classes.innerArea2}>
						<Grid item md={6} className={classes.borderRight}>
							<div className={classes.questionsTitle}>
								<span>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.questions.questionsTitle')}</span>
							</div>
							{question1 !== '' &&
								<div className={classes.questionText} onClick={() => setQuestionState(1)}>
									<span>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.questions.lightsInside') + ' (' + (question1 === 'Y' ? t('common.buttons.yes') : t('common.buttons.no')) + ')'}</span>
								</div>
							}
							{question2 !== '' &&
								<div className={classes.questionText} onClick={() => setQuestionState(2)}>
									<span>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.questions.lightsOutside') + ' (' + (question2 === 'Y' ? t('common.buttons.yes') : t('common.buttons.no')) + ')'}</span>
								</div>
							}
							{question3 !== '' &&
								<div className={classes.questionText} onClick={() => setQuestionState(3)}>
									<span>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.questions.corMessage') + ' (' + (question3 === 'Y' ? t('common.buttons.yes') : t('common.buttons.no')) + ')'}</span>
								</div>
							}
							{question4 !== '' &&
								<div className={classes.questionText} onClick={() => setQuestionState(4)}>
									<span>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.questions.urgentMessage') + ' (' + (question4 === 'Y' ? t('common.buttons.yes') : t('common.buttons.no')) + ')'}</span>
								</div>
							}
							{question5 !== '' &&
								<div className={classes.questionText} onClick={() => setQuestionState(5)}>
									<span>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.questions.electrodependant') + ' (' + (question5 === 'Y' ? t('common.buttons.yes') : t('common.buttons.no')) + ')'}</span>
								</div>
							}

						</Grid>
						<Grid container md={6} justifyContent='center'>
							{questionState === 1 &&
								<Grid container className={classes.questionContainer}>
									<Grid item>
										<div className={classes.question}>
											<span>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.questions.lightsInside')}</span>
										</div>
									</Grid>
								</Grid>
							}
							{questionState === 2 &&
								<Grid container className={classes.questionContainer}>
									<Grid item>
										<div className={classes.question}>
											<span>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.questions.lightsOutside')}</span>
										</div>
									</Grid>
								</Grid>
							}
							{questionState === 3 &&
								<Grid container className={classes.questionContainer}>
									<Grid item>
										<div className={classes.question}>
											<span>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.questions.corMessage')}</span>
										</div>
									</Grid>
								</Grid>
							}
							{questionState === 4 &&
								<Grid container className={classes.questionContainer}>
									<Grid item>
										<div className={classes.question}>
											<span>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.questions.urgentMessage')}</span>
										</div>
									</Grid>
								</Grid>
							}
							{questionState === 5 &&
								<Grid container className={classes.questionContainer}>
									<Grid item>
										<div className={classes.question}>
											<span>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.questions.electrodependant')}</span>
										</div>
									</Grid>
								</Grid>
							}
							{questionState === 6 &&
								<Grid container className={classes.noQuestionsContainer}>
									<Grid item>
										<div className={classes.question}>
											<span>{t('averias.management.searchCups.comprovacionesSuministro.requestModal.questions.noMoreQuestions')}</span>
										</div>
									</Grid>
								</Grid>
							}
							{questionState !== 6 &&
								<Grid container direction='row' justifyContent='center' spacing={3}>
									<Grid item>
										<Button
											className={classes.yesButton}
											text={t('common.buttons.yes')}
											color='inherit'
											size='small'
											variant='contained'
											onClick={() => updateQuestion('Y')}
										/>
									</Grid>
									<Grid item>
										<Button
											className={classes.noButton}
											text={t('common.buttons.no')}
											color='primary'
											size='small'
											variant='contained'
											onClick={() => updateQuestion('N')}
										/>
									</Grid>
								</Grid>
							}
							{questionState === 4 &&
								<Grid container className={classes.radioButtonsContainer} direction='column' spacing={3}>
									<Grid item>
										<div
											className={`radioButton ${classes.radioButton} ${tempSelectedState === 1 && 'active'}`}
											onClick={() => {
												if (tempSelectedState === 1) {
													setTempSelectedState(0)
												} else {
													setTempSelectedState(1)
												}
											}}
										/>
										<div className={classes.radioButtonText}>{t('averias.management.incidence.insertContactData.emergency')}</div>
									</Grid>
									<Grid item>
										<div
											className={`radioButton ${classes.radioButton} ${tempSelectedState === 2 && 'active'}`}
											onClick={() => {
												if (tempSelectedState === 2) {
													setTempSelectedState(0)
												} else {
													setTempSelectedState(2)
												}
											}}
										/>
										<div className={classes.radioButtonText}>{t('averias.management.incidence.insertContactData.securityWithoutCor')}</div>
									</Grid>
									<Grid item>
										<div
											className={`radioButton ${classes.radioButton} ${tempSelectedState === 3 && 'active'}`}
											onClick={() => {
												if (tempSelectedState === 3) {
													setTempSelectedState(0)
												} else {
													setTempSelectedState(3)
												}
											}}
										/>
										<div className={classes.radioButtonText}>{t('averias.management.incidence.insertContactData.securityWithCor')}</div>
									</Grid>
								</Grid>
							}
						</Grid>
					</Grid>
				</Grid>
				<DialogActions>
					<Grid container direction='row' justifyContent='center' spacing={3}>
						<Grid item>
							<Button
								className={classes.cancelButton}
								text={t('common.buttons.close')}
								color='inherit'
								size='large'
								variant='contained'
								onClick={handleCloseDialog}
							/>
						</Grid>
						<Grid item>
							<Button
								className={classes.button}
								text={t('averias.management.searchCups.comprovacionesSuministro.requestModal.finalizeRequest')}
								color='primary'
								size='large'
								variant='contained'
								onClick={() => {
									createFailureNotice()
									setCreated(true)
								}}
								disabled={disableButton}
							/>
						</Grid>
					</Grid>
				</DialogActions>
			</Grid>

			<SystemErrorModal
				open={systemErrorDialogOpen}
				closeFunction={closeFunction}
			/>
		</DialogContent>
	)
}

export default Content
