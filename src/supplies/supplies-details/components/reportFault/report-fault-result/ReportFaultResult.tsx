
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DigitalScriptService, { Question } from '../../../../../gestionAverias/services/DigitalScriptService2';

import { Grid } from '@material-ui/core';
import Button from '../../../../../common/components/button/Button';

import useStyles from './ReportFaultResult.styles';
import UserProfile from '../../../../../common/interfaces/UserProfile';
import SupplyPoint from '../../../../../common/interfaces/SupplyPoint';
import Input from '../../../../../common/components/input/Input';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import DocumentAttachment from '../../../../../gestionAverias/components/supplyPointPanel/document-attachment/DocumentAttachment';

// LCS: Importa la función - Wave 3
import { sendGAEvent, getUser_type } from '../../../../../core/utils/gtm';


interface ReportFaultResultProps {
    user: UserProfile;
    supply: SupplyPoint;
    answeredQuestions: Question[];
    digitalScriptService: DigitalScriptService;
    createFailureNotice: Function;
    setPhone: Function;
    setIdDocument: Function;
    setDocumentState: Function;
    setDocumentType: Function;
    setFormat: Function;
    setNombreArchivo: Function;
}

const ReportFaultResult = (props: ReportFaultResultProps) => {

    const { t } = useTranslation();
    const styles = useStyles({});
    const dispatch = useDispatch();

    const [reRender, setRerender] = useState<boolean>(false);
    const [currentQuestion, setCurrentQuestion] = useState<Question>(null);
    const [answeredQuestionList, setAnsweredQuestionList] = useState<Question[]>(props.answeredQuestions);

    const handleButtonBack = (): void => {
        dispatch(push('/supplies'));
    }

    
    const doReRender = (): void => {
        setRerender(!reRender);
    }

    const answerQuestion = async (question: Question, answer: boolean): Promise<void> => {
        if (answeredQuestionList.includes(question)) {

            const auxAnsweredQuestionList: Question[] = answeredQuestionList;

            // Save the new answer
            auxAnsweredQuestionList.find(q => q.id === question.id).answer = answer;

            // Get modified question index and reset questions after that
            const questionsToReset: Question[] = [];
            const modifiedQuestionIndex = answeredQuestionList.indexOf(question);

            for (let i = auxAnsweredQuestionList.length - 1; i > modifiedQuestionIndex; i--) {
                questionsToReset.push(auxAnsweredQuestionList[i]);
                auxAnsweredQuestionList.pop();
            }

            if (questionsToReset.length > 0) {
                await props.digitalScriptService.resetQuestions(questionsToReset);
            }

            // Set the new values for answeredQuestionList
            setAnsweredQuestionList(auxAnsweredQuestionList);

            // Get next question
            question.answer = answer;
            
            const nextQuestion = await props.digitalScriptService.getQuestion(question);

            if (nextQuestion.id === 6) {
                answerQuestion(nextQuestion, nextQuestion.answer);

            } else {
                setCurrentQuestion(nextQuestion);
            }

            // Had to use this becase updating an array doesn't rerende the .map function
            doReRender();

        } else {
            question.answer = answer;
            answeredQuestionList.push(question);

            const nextQuestion = await props.digitalScriptService.getQuestion(question);

            if (nextQuestion.id === 6) {
                answerQuestion(nextQuestion, nextQuestion.answer);
            } else {
                setCurrentQuestion(nextQuestion);
            }
        }
    }

    const handleClickSaveAviso = ():void => {
        // LCS: comprobamos el rol del usuario - Wave 3
        getUser_type()
        // LCS: Lanzamos el evento - Wave 3
        sendGAEvent({
            event: 'create_incident_report',
            user_id: sessionStorage.getItem('id'),
            user_type: sessionStorage.getItem('user_type'),
            //user_document: sessionStorage.getItem('userDocument')
        });
        props.createFailureNotice()
    }

    return (
        <Grid container md={10}>
            <Grid container className={styles.container2a}>
                <Grid container className={styles.cuadroTexto1}>
                    <Grid item md={12} xs={12} sm={6} className={styles.subTitle}>
                        {t('averias.reportFault.comprobaciones')}
                    </Grid>
                    <Grid container>
                        <Grid item md={12} xs={12} sm={6} className={styles.title1}>
                            {t('averias.reportFault.litDni')}
                        </Grid>
                        <Grid item md={12} xs={12} sm={6} className={styles.input3}>
                            {props.supply.holderDocumentNumber}
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item md={6} xs={12} sm={6} className={styles.title1}>
                            {t('averias.reportFault.cp')}
                        </Grid>
                        <Grid item md={6} xs={12} sm={6} className={styles.input3}>
                            {props.supply.address.zipCode}
                        </Grid>
                    </Grid>

                    <Grid container>
                        <Grid item md={6} xs={12} sm={6} className={styles.title1}>
                            {t('averias.reportFault.cups')}
                        </Grid>
                        <Grid item md={6} xs={12} sm={6} className={styles.input3}>
                            {props.supply.cups}
                        </Grid>
                    </Grid>

                    <Grid container>
                        <Grid item md={6} xs={12} sm={6} className={styles.title1}>
                            {t('averias.reportFault.nombre')}
                        </Grid>
                        <Grid item md={6} xs={12} sm={6} className={styles.input3}>
                            {props.user.name}
                        </Grid>
                    </Grid>

                    <Grid container>
                        <Grid item md={6} xs={12} sm={6} className={styles.input3}>
                            {props.user.surName}
                        </Grid>
                        <Grid item md={6} xs={12} sm={6} className={styles.title1}>
                            {t('averias.reportFault.apellidos')}
                        </Grid>
                    </Grid>

                    <Grid container>
                        <Grid item md={6} xs={12} sm={6} className={styles.title1}>
                            {t('averias.reportFault.email')}
                        </Grid>
                        <Grid item md={6} xs={12} sm={6} className={styles.input3}>
                            {props.user.email}
                        </Grid>
                    </Grid>

                    <Grid container>
                        <Grid item md={6} xs={12} sm={6} className={styles.title1}>
                            {t('averias.reportFault.movil')}
                        </Grid>
                        <Grid item md={6} xs={12} sm={6} className={styles.input3}>
                            <Input
                                className={styles.input3}
                                defaultValue={props.user.phone}
                                onChange={(e) => props.setPhone(e.target.value)}
                            />
                        </Grid>                        
                    </Grid>

                </Grid>

                <DocumentAttachment 
                    setIdDocument={props.setIdDocument}
                    setDocumentState={props.setDocumentState}
                    setDocumentType={props.setDocumentType}
                    setFormat={props.setFormat}
                    setNombreArchivo={props.setNombreArchivo}
                />

                <Grid container className={styles.container1}>
                    
                    <Grid container>
                        {/* ANSWERED QUESTIONS */}
                        {answeredQuestionList.map((q) =>
                            (q.id !== 6) &&
                                <Grid container direction='row' md={12} key={q.id} className={styles.questionContainer}>
                                    <Grid container direction='column' md={8}>
                                        <span className={styles.textoAveria}>
                                            {t(q.text.toString())}
                                        </span>
                                    </Grid>
                                    <Grid container direction='row' justifyContent='space-between' md={3}>
                                        <Button
                                            text={'Si'}
                                            color={'primary'}
                                            size={'small'}
                                            variant={(q.answer) ? 'contained' : 'outlined'}
                                            onClick={() => answerQuestion(q, true)}
                                        />

                                        <Button
                                            text={'No'}
                                            color={'primary'}
                                            size={'small'}
                                            variant={(!q.answer) ? 'contained' : 'outlined'}
                                            onClick={() => answerQuestion(q, false)}
                                        />
                                    </Grid>

                                    <Grid item className={styles.separator} />
                                </Grid>                           
                        )}
                        {/* ElectroDependant */}
                        {answeredQuestionList.map((q) =>
                            (q.id === 6) &&
                                <Grid container direction='row' md={12} key={q.id} className={styles.questionContainer}>
                                    <Grid container direction='column' md={8}>
                                        <span className={styles.textoAveria}>
                                            {t(q.text.toString())}
                                        </span>
                                    </Grid>
                                    <Grid container direction='row' justifyContent='space-between' md={3}>
                                        <Button
                                            text={'Si'}
                                            color={'primary'}
                                            size={'small'}
                                            variant={(q.answer) ? 'contained' : 'outlined'}
                                            disabled
                                            onClick={() => answerQuestion(q, true)}
                                        />

                                        <Button
                                            text={'No'}
                                            color={'primary'}
                                            size={'small'}
                                            variant={(!q.answer) ? 'contained' : 'outlined'}
                                            disabled
                                            onClick={() => answerQuestion(q, false)}
                                        />
                                    </Grid>

                                    <Grid item className={styles.separator} />
                                </Grid>                           
                        )}

                        {/* CURRENT QUESTION */}
                        {(currentQuestion != null && currentQuestion.id !== 0) &&
                            <Grid container direction='row' md={12} className={styles.questionContainer}>
                                <Grid container direction='column' md={8}>
                                    <span className={styles.textoAveria}>
                                        {t(currentQuestion.text.toString())}
                                    </span>
                                </Grid>
                                <Grid container direction='row' justifyContent='space-between' md={3}>
                                    <Button
                                        text={'Si'}
                                        color={'primary'}
                                        size={'medium'}
                                        variant={'outlined'}
                                        onClick={() => answerQuestion(currentQuestion, true)}
                                    />

                                    <Button
                                        text={'No'}
                                        color={'primary'}
                                        size={'medium'}
                                        variant={'outlined'}
                                        onClick={() => answerQuestion(currentQuestion, false)}
                                    />
                                </Grid>

                                <Grid item className={styles.separator} />
                            </Grid>
                        }
                    </Grid>

                    <Grid container className={styles.container2} justifyContent='center'>
                        <Grid container md={10} justify='space-evenly'>
                            <Button
                                text={t('averias.reportFault.volver')}
                                color='primary'
                                size='large'
                                variant='outlined'
                                onClick={handleButtonBack}
                            />
                            <Button
                                text={t('averias.reportFault.saveAviso')}
                                color='primary'
                                size='large'
                                variant='contained'
                                onClick={handleClickSaveAviso()}
                                disabled={(currentQuestion != null && currentQuestion.id !== 0)}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default ReportFaultResult;
