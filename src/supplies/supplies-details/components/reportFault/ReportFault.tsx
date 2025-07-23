import React, { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import { useTranslation } from 'react-i18next'
import useStyles from './ReportFault.styles'
import NoConsumptionIcon from '../../../../assets/icons/aviso_alerta_pop_up.svg'
import InfoIcon from '../../../../assets/icons/info.svg'
import LoadingAnimation from '../../../../assets/img/spinner.gif'
import Button from '../../../../common/components/button/Button'
import ListFilter, { Column } from '../../../../common/components/list-filter/ListFilter'
import DigitalScriptService, { Question } from '../../../../gestionAverias/services/DigitalScriptService2'
import SupplyPoint from '../../../../common/interfaces/SupplyPoint'
import UserProfile from '../../../../common/interfaces/UserProfile'
import ReportFaultQuestion from './report-fault-question/ReportFaultQuestion'
import ReportFaultResult from './report-fault-result/ReportFaultResult'
import ReportResultPage from './report-result-page/ReportResultPage'
import { useDispatch, useSelector } from 'react-redux'
import { thunkCreateNewRequest, thunkNoticeSgi, thunkUpdateRequest } from '../../../../requests/store/actions/RequestsThunkActions'
import { setMessage, showError } from '../../../../common/store/actions/ErrorActions'
import FailureRequest from '../../../../common/interfaces/FailureRequest'
import EndReiterationModal from '../../../../gestionAverias/components/supplyPointPanel/modals/endReiterationModal'
import { formatDayAndMonthToDate } from '../../../../common/lib/FormatLib'
import incidence from '../../../../common/services/IncidenceService'

// LCS: Importa la función - Wave 2
import { hideCUPS, sendGAEvent } from '../../../../core/utils/gtm';

const ReportFault = (props: any) => {

    const { t } = useTranslation();
    const classes = useStyles({});
    const dispatch = useDispatch();

    const { supplyData, userData, tabValue, setIsLoading } = props

    const [pageNumber, setPageNumber] = useState<number>(0);
    const [showErrorForm, setShowErrorForm] = useState<boolean>(false);

    const [user] = useState<UserProfile>(userData);
    
    const [currentQuestion, setCurrentQuestion] = useState<Question>(null);
    const [answeredQuestionList, setAnsweredQuestionList] = useState<Question[]>([]);
    const [digitalScript] = useState<DigitalScriptService>(new DigitalScriptService(user, supplyData, 'identificar_punto_suministro'));
    const [resultCode, setResultCode] = useState<string>('');
    const [resultTipology, setResultTipology] = useState<string>('');
    const [resultQuestions, setResultQuestions] = useState<Question[]>([]);

    const [rearmExit, setRearmExit] = useState(true)
    const [phone, setPhone] = useState<string>(userData.phone);

    const srList = useSelector((state: any) => state.requests.supplyList)
    const [srData, setSrData] = useState([]);
    const [endReiteration, setEndReiteration] = useState(false)

    const incidenceService = new incidence();
    const BASE_URL = process.env.REACT_APP_API_ENDPOINT
    const [ idDocument, setIdDocument ] = useState('')
    const [ documentState, setDocumentState ] = useState('')
    const [ documentType, setDocumentType ] = useState('')
    const [ format, setFormat ] = useState('')
    const [ nombreArchivo, setNombreArchivo ] = useState('')
    const listFilterColumns: Column<FailureRequest>[] = [
        {
            header: t('averias.management.supplyPannel.requestTable.code'),
            size: 'm',
            selector: ((fr: FailureRequest) => fr.codSR),
        },
        {
            header: t('averias.management.supplyPannel.requestTable.createDate'),
            size: 'm',
            selector: ((fr: FailureRequest) => fr.createDate),
        },
        {
            header: t('averias.management.supplyPannel.requestTable.closingDate'),
            size: 'm',
            selector: ((fr: FailureRequest) => fr.closingDate),
        },
        {
            header: '',
            size: 'm',
            selector: ((fr: FailureRequest) =>
                <div className={classes.link} onClick={() => reiterarSr(fr.codSR)}>
                    {t('averias.management.supplyPannel.requestTable.reiterationLink')}
                </div>
            ),
        }
    ];

    const reiterarSr = (SRcode: string) : void => {
        let data = {
            codSR: SRcode,
            docNumber: user.documentNumber,
            reiteration: 'Y',
            descriptionEvent: 'Reiteracion'
        }
        dispatch(thunkUpdateRequest(data, (response) => {
            if (response && response.resultado ) {
                setEndReiteration(true)
            } else {
                dispatch(showError('XXX'))
            }
        }))
    }

    const handleInicializarMenus = () => {
        handleCloseError()
        setPageNumber(0)
    }

    useEffect(() => {
        handleInicializarMenus()
    }, [tabValue])

    useEffect(() => {
        if (pageNumber > 10) {
            handleInicializarMenus()
        }
    }, [pageNumber])

    const handleCloseError = () => {
        setShowErrorForm(false)
    }

    const nextPage = (): void => {
        setPageNumber(pageNumber + 1)
    }

    const goToPage = (pageNum: number): void => {
        if (pageNum >= 0) {
            setPageNumber(pageNum);
        }
    }

    const showResultPage = (code: string, anseredQuestions: Question[], tipology: string): void => {
        setResultCode(code);
        setResultQuestions(anseredQuestions);
        setResultTipology(tipology)

        goToPage(7);

    }

    const previousQuestion = async (): Promise<void> => {

        const questionsToReset: Question[] = [];
        const questionIndex: number = answeredQuestionList.length -1;
        const auxAnsweredQuestionList: Question[] = answeredQuestionList;

        questionsToReset.push(auxAnsweredQuestionList[questionIndex -1]);

        auxAnsweredQuestionList.pop();

        if (questionsToReset.length > 0) {
            await digitalScript.resetQuestions(questionsToReset);
        }

        setAnsweredQuestionList(auxAnsweredQuestionList);

        setCurrentQuestion(await digitalScript.getQuestion(null));
    }

    const saveAnswer = async (question: Question): Promise<void> => {
        answeredQuestionList.push(question);


        const nextQuestion = await digitalScript.getQuestion(question);

        if (nextQuestion.id === 6) {
            saveAnswer(nextQuestion);
        } else {
            setCurrentQuestion(nextQuestion);
        }
    }

    const getFirstQuestion = async () => {
        setCurrentQuestion(await digitalScript.getQuestion(null));
    }

    useEffect(() => {
        if (currentQuestion && currentQuestion.id === 6) {
            saveAnswer(currentQuestion);
        }
    }, [currentQuestion])
    // Obtener estado contador
    const checkMeter = async (): Promise<void> => {
        if (supplyData.tipoDeLectura === 'TELEGESTIONADO'){
            const meterStatus = await digitalScript.getMeterStatus();
            digitalScript.setMeterStatus(meterStatus);
        }
        checkSr(); 
    }

    const checkSr = (): void => {
        let srListAux = [];
        let today = new Date();
        today.setDate(today.getDate() - 7);
        
        srListAux = srList.filter(item => (
            (item.tipology === '0871A00' ||
            item.tipology === '0871A01' ||
            item.tipology === '0871A04') && (
                formatDayAndMonthToDate(item.createDate) > today
            )
        ));

        setSrData(srListAux);
        
        if (srListAux.length !== 0) {
            goToPage(3);
        } else {
            getFirstQuestion();
        }
    }

    const getIncidences = async (): Promise<void> => {

                
        const today = new Date();
        const dateFrom = new Date(today);
        dateFrom.setDate(today.getDate() - 7);

        try {
            
            let incidenceListAux = [];

            // LCS: Registrar el tiempo inicial - Wave 2
            const startTime = performance.now();
            
            const incidenceList = await incidenceService.getIncidenceList(supplyData.cups, dateFrom, today);

            // LCS: Registrar el tiempo final y calcular la duración - Wave 2
            const endTime = performance.now();
            const responseTime = endTime - startTime;
            // LCS: Enviar evento a GA para medir el tiempo - Wave 2
            sendGAEvent({
                event: 'api_response_time',
                info: {
                apiUrl: 'get /listPowerSupplyFacilities?filter=cups::'+hideCUPS(supplyData.cups)+'|fromDate::'+dateFrom+'|toDate::'+today,
                apiUrlShort: 'get /listPowerSupplyFacilities',
                responseTime: responseTime, // Tiempo de respuesta en milisegundos
                }
            });

            incidenceListAux = incidenceList.filter(item => (
                parseInt(item.interruptionDuration, 10) === 0
            ));

            // Si hay incidencias abiertas
            if (incidenceListAux.length > 0) {
                        
                // Setear setLocatedFailure del script a true
                digitalScript.setLocatedFailure(true);

                // Lanzar script
                digitalScript.getQuestion(null);

                // Crear aviso y SR
                createFailureNotice();

                // Redirigir a la página
                goToPage(2);

            } else {
                checkMeter();           
            }

        } catch (e) {

            // LCS: Enviar evento de error a GA - Wave 2
            sendGAEvent({
                event: 'api_error',
                info: {
                    error_message: 'Error al llamar al servicio',
                    error: e,
                    reactComponent: 'ReportFault.tsx - getIncidences',
                    apiUrl: 'get /listPowerSupplyFacilities?filter=cups::'+hideCUPS(supplyData.cups)+'|fromDate::'+dateFrom+'|toDate::'+today,
                    codResult: (e as any).result ? (e as any).result.codResult : ((e as any).codResult ? (e as any).codResult : '')
                }
            });

        }

    }

    const handleSrButton = async () => {
        await getFirstQuestion();
        goToPage(5);
    }

    // Useeffect principal. Controla el flujo de la página.
    useEffect(() => {
        if (currentQuestion == null && pageNumber === 0 && (tabValue === 5 || tabValue === 6)) {

            /*if (supply.notCuttable === '1') {

                // Lanzar script
                digitalScript.getQuestion(null);

                // Crear SR + Aviso
                createFailureNotice();

                // Redirigir a la página
                goToPage(1);
                
            } else {
                
                // Buscar incidencias activas en el último día (o 2...)
                getIncidences();

            }*/
            getIncidences();

            
        } else if (currentQuestion != null && currentQuestion.id === 0 && pageNumber !== 7) {
            const reason = digitalScript.getReason();

            switch (reason) {
                case 'SCRIPT_END':
                    goToPage(6);
                    break;

                default:
                    break;
            }
        } else if (currentQuestion != null && currentQuestion.id !== 0 && pageNumber !== 7) {
            goToPage(5);
        }
    }, [currentQuestion, answeredQuestionList, pageNumber, tabValue]);

    const createFailureNotice = (): void => {
        
        setIsLoading(true);

        const tipology = digitalScript.getSrCode();
        const subtipology = digitalScript.getSrSub();
        const notification = digitalScript.getSgiNotification();

        const data = {
            channel: '10010',
            documentType: '',
            documentNumber: user.documentNumber,
            name: user.name ? user.name : '.',
            surName1: user.surName ?  user.surName : '.',
            email: user.email,
            landline: phone,
            cellphone: '',
            tipology: tipology,
            subtipology: subtipology,
            cups: supplyData.cups,
            dossierNumber: '',
            comment: '',
            documents: [{
                url: idDocument ? BASE_URL + '/documentum/' + idDocument : '',
                idDocumentum: idDocument,
                nombreArchivo: nombreArchivo,
                format: format,
                documentType: documentType,
                documentState: documentState
            }]
        } as any;

        dispatch(thunkCreateNewRequest(data, (response) => {
            if (!response) {
                setIsLoading(false);
                dispatch(showError('2001', 'createServiceRequest'))
            } else {
                let dataSgi = {
                    document: user.documentNumber,
                    name: user.name ? user.name : '.',
                    surname: user.surName ?  user.surName : '.',
                    cups: supplyData.cups,
                    province: '',
                    town: '',
                    street: '',
                    number: '',
                    postalCode: '',
                    email: user.email,
                    phone: phone,
                    observations: '',
                    alcance: notification ? notification.scope : 0,
                    tipo: notification ? notification.type : 0,
                    motivo: notification ? notification.reason : '',
                    sendSgi: notification ? 1 : 0,
                    insertHist: 0,
                    srCode: response.codigoSR
                }

                dispatch(thunkNoticeSgi(dataSgi, (response2) => {
                    if (pageNumber === 6) {
                        // Controlar si hay error de nuestra API.
                        if (response2 && response2.result.codResult !== '0000') {
                            dispatch(setMessage(t('errors.XXX')));
                        } else if (response2 && response2.sgiCodResult !== '' && response2.sgiCodResult !== '1003' && response2.sgiCodResult !== '0000') {
                            dispatch(setMessage(t('errors.sgi.' + response2.sgiCodResult)));
                        }
                        showResultPage(response.codigoSR, answeredQuestionList, tipology);
                    }
                    setIsLoading(false);
                }));
            }
        }));
    }

    return (
        <>
        <Grid container className={classes.container} justifyContent='center'>
            <Grid item sm={12} md={8} className={classes.maxWidthForBigScreens}>

                    {(pageNumber > 4 && pageNumber < 9) ?
                        <Grid container md={12}>
                            <Grid item md={4} className={classes.titleB}>
                                {t(' ')}
                            </Grid>
                            <Grid item md={4} className={classes.titleB}>
                                {t('supplies.suppliesDetails.components.navigation.reportFault')}
                            </Grid>
                        </Grid>
                        :
                        (pageNumber < 5 || pageNumber === 9) &&
                        <Grid container md={12} className={classes.title}>
                            {t('supplies.suppliesDetails.components.navigation.reportFault')}
                        </Grid>
                    }

                    {/* INICIO SCRIPT */}
                    {(pageNumber === 0) &&
                        <Grid container justifyContent='center'>
                            <Grid item md={12} className={classes.description}>
                                {t('averias.reportFault.generarConsulta')}
                            </Grid>

                            <Grid container md={8} className={classes.cuadroTexto} justifyContent='center'>
                                <Grid container className={classes.subTitle}>
                                    {t('averias.reportFault.recopilandoInformacion')}
                                </Grid>
                                <Grid container className={classes.container2} justifyContent='center'>
                                    <img src={LoadingAnimation} className={classes.iconFirst} alt='' />
                                </Grid>
                            </Grid>
                        </Grid>
                    }

                    {/* O/S CORTE */}
                    {(pageNumber === 1) &&
                        <Grid container justifyContent='center'>
                            <Grid item md={8} className={classes.cuadroTexto}>
                                <Grid item>
                                    <img src={NoConsumptionIcon} className={classes.icon} alt='' />
                                    <Grid item className={classes.input2}>
                                        {t('averias.reportFault.corteSuministro')}
                                    </Grid>
                                </Grid>

                                <Grid item className={classes.text}>
                                    {t('averias.reportFault.titleSub1')}
                                </Grid>
                            </Grid>
                        </Grid>
                    }

                    {/* INIDENCIA LOCALIZADA */}
                    {(pageNumber === 2) &&
                        <Grid container justifyContent='center'>
                            <Grid item md={8} className={classes.cuadroTexto}>
                                <Grid item>
                                    <img src={NoConsumptionIcon} className={classes.icon} alt='' />
                                    <Grid item className={classes.input2}>
                                        {t('averias.reportFault.averiaLocalizada')}
                                    </Grid>
                                </Grid>

                                <Grid item className={classes.text}>
                                    {t('averias.reportFault.titleSub1')}
                                </Grid>
                            </Grid>
                        </Grid>
                    }

                    {/* LISTADO SR's */}
                    {(pageNumber === 3) &&
                        <Grid container justifyContent='center'>
                            <Grid item md={8} className={classes.cuadroTexto} >
                                <Grid item>
                                    <img src={NoConsumptionIcon} className={classes.icon} alt='' />
                                    <Grid item className={classes.input2}>
                                        {t('averias.reportFault.avisoEnviado')}
                                    </Grid>
                                </Grid>

                                <Grid item className={classes.text1}>
                                    {t('averias.reportFault.avisoEnviado2')}
                                </Grid>

                                <Grid container justifyContent='center'>
                                    <Grid item className={classes.text2}>
                                        {t('averias.reportFault.listadoPeticiones')}
                                    </Grid>
                                    <ListFilter columns={listFilterColumns} data={srData} />
                                </Grid>

                                <Grid container className={classes.container2} justify='space-evenly'>
                                    <Button
                                        text={t('averias.reportFault.newAviso')}
                                        color='primary'
                                        size='medium'
                                        variant='contained'
                                        onClick={handleSrButton}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    }

                    {/* TE HAREMOS PREGUNTAS */}
                    {(pageNumber === 4) &&
                        <Grid container justifyContent='center' onClick={nextPage}>
                            <Grid container md={8} className={classes.cuadroTexto} justifyContent='center'>
                                <Grid container className={classes.container2} justifyContent='center'>
                                    <img src={InfoIcon} className={classes.iconFirst} alt='' />
                                </Grid>
                                <Grid container className={classes.subTitle}>
                                    {t('averias.reportFault.inicioForm')}
                                </Grid>
                                <Grid container className={classes.container2} justifyContent='center'>
                                    <img src={LoadingAnimation} className={classes.iconFirst} alt='' />
                                </Grid>
                            </Grid>
                        </Grid>
                    }

                    {/* PREGUNTAS SCRIPT */}
                    {(pageNumber === 5 && currentQuestion.id !== 0) && 
                        <ReportFaultQuestion
                            question={currentQuestion}
                            showBackBtn={(answeredQuestionList.length > 0)}
                            saveAnswer={saveAnswer}
                            previousQuestion={previousQuestion}
                            supplyData={supplyData}
                            document={user.documentNumber}
                            rearmExit={rearmExit}
                            setRearmExit={setRearmExit}
                        />
                    }

                    {/* PANTALLA RESUMEN */}
                    {(pageNumber === 6) &&
                        <Grid container justifyContent='center'>
                            <ReportFaultResult
                                user={user}
                                supply={supplyData}
                                answeredQuestions={answeredQuestionList}
                                digitalScriptService={digitalScript}
                                createFailureNotice={createFailureNotice}
                                setPhone={setPhone}
                                setIdDocument={setIdDocument}
                                setDocumentState={setDocumentState}
                                setDocumentType={setDocumentType}
                                setFormat={setFormat}
                                setNombreArchivo={setNombreArchivo}
                            />
                        </Grid>
                    }

                    {/* PANTALLA RESULTADO */}
                    {(pageNumber === 7) &&
                        <Grid container justifyContent='center'>
                            <ReportResultPage
                                code={resultCode}
                                answeredQuestions={resultQuestions}
                                tipology={resultTipology}
                            />
                        </Grid>
                    }

                    {/* PANTALLA ERROR */}
                    {(pageNumber === 13) &&
                        <Grid container justifyContent='center' onClick={handleInicializarMenus}>
                            <Grid container md={8} className={classes.cuadroTexto} justifyContent='center'>
                                <img src={NoConsumptionIcon} className={classes.icon} alt='' />

                                <Grid container className={classes.input2} justifyContent='center'>
                                    {t('averias.reportFault.formError')}
                                </Grid>

                                <Grid container className={classes.text} justifyContent='center'>
                                    {t('averias.reportFault.telAverias')}
                                </Grid>
                            </Grid>
                        </Grid>
                    }
            </Grid>
        </Grid>
        <EndReiterationModal isErrorModalVisible={endReiteration} closeDialog={setEndReiteration} />
        </>
    )
}

export default ReportFault;
