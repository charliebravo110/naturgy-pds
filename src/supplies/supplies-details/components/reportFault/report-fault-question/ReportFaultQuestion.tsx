import React from 'react';
import { useTranslation } from 'react-i18next';
import { Question } from '../../../../../gestionAverias/services/DigitalScriptService2';

import { Grid } from '@material-ui/core';
import Button from '../../../../../common/components/button/Button';

import useStyles from './ReportFaultQuestion.styles';
import Meter from '../meter/Meter';
import SupplyPoint from '../../../../../common/interfaces/SupplyPoint';


interface ReportFaultQuestionProps {
    question: Question;
    showBackBtn: boolean;
    saveAnswer: Function;
    previousQuestion: Function;
    supplyData: SupplyPoint;
    document: String;
    rearmExit: boolean;
    setRearmExit: Function;
}

const ReportFaultQuestion = (props: ReportFaultQuestionProps) => {

    const { t } = useTranslation();
    const styles = useStyles({});

    const previosQuestion = (): void => {
        props.previousQuestion();
    }

    const answerQuestion = (answer: boolean): void => {
        props.question.answer = answer;
        
        props.saveAnswer(props.question);
    }

    return (
        <Grid container justifyContent='center'>
            <Grid container className={styles.container2} md={8}>
                <Grid container justifyContent='center'>
                    <Grid item className={styles.input3a}>
                        {t('averias.reportFault.preguntas')}
                    </Grid>
                </Grid>

                {(props.showBackBtn) &&
                    <Grid container className={styles.container2}>
                        <Grid item onClick={previosQuestion} className={styles.input4}>
                            {t('averias.reportFault.atras')}
                        </Grid>
                    </Grid>
                }

                {props.question.id === 2 &&
                    <Grid container className={styles.cuadroInfo}>
                        {t('averias.digitalScriptQuestions.resetinstruction')}
                        <a href='https://www.ufd.es/estado-del-servicio/como-detectar-una-averia/' target='_blank'>{t('averias.digitalScriptQuestions.resetinstructionLink')}</a>
                    </Grid>
                }
                {props.question.id === 8 && props.rearmExit &&
                    <Grid container className={styles.cuadroInfo}>
                        <Meter
                            supplyData={props.supplyData}
                            document={props.document}
                            setRearmExit={props.setRearmExit}
                        />
                    </Grid>
                }

                <Grid container className={styles.cuadroTexto}>
                    <Grid item className={styles.input3}>
                        {t(props.question.text)}
                    </Grid>

                    <Grid item md={12}>
                        <Grid container className={styles.container2} justifyContent='center'>
                            <Grid item md={2}>
                                <Button
                                    text={t('averias.reportFault.no')}
                                    color='primary'
                                    size='medium'
                                    variant='contained'
                                    onClick={() => answerQuestion(false)}
                                />
                            </Grid>

                            <Grid item md={2}>
                                <Button
                                    text={t('averias.reportFault.si')}
                                    color='primary'
                                    size='medium'
                                    variant='contained'
                                    onClick={() => answerQuestion(true)}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default ReportFaultQuestion;
