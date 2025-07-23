import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { useTranslation } from 'react-i18next';
import { Grid } from '@material-ui/core';
import useStyles from './ReportResultPage.styles';
import CrossIcon from '../../../../../assets/icons/cerrar.svg';
import CheckIcon from '../../../../../assets/icons/check_blue.png';
import GreenCheckIcon from '../../../../../assets/icons/aviso_ok.svg';
import { Question } from '../../../../../gestionAverias/services/DigitalScriptService2';
import Button from '../../../../../common/components/button/Button';

interface ReportResultPageProps {
    code: string;
    answeredQuestions: Question[];
    tipology: string;
}

const ReportResultPage = (props: ReportResultPageProps) => {

    const { t } = useTranslation();
    const styles = useStyles({});
    const dispatch = useDispatch();

    const [code] = useState<string>(props.code);
    const [answeredQuestions] = useState<Question[]>(props.answeredQuestions);

    const terminateClickHandle = (): void => {
        dispatch(push('/supplies'));
    }

    return (
        <Grid container justifyContent='center' alignItems='center'>
            <Grid item md={6}>
                <Grid container direction='column' justifyContent='center' alignItems='center'>
                    <Grid item className={styles.title}>
                        <span>
                            Nueva petición
                        </span>
                    </Grid>

                    <Grid container direction='column' alignItems='center'>
                        <Grid container direction='column' alignItems='center'>
                            <Grid item>
                                <img src={GreenCheckIcon} alt='' />
                            </Grid>
                            <Grid item className={styles.subtitle}>
                                <span>
                                    {t('averias.management.resultPage.result1')}
                                </span>
                            </Grid>
                        </Grid>

                        <Grid item className={styles.codeLabel}>
                            <span>
                                Este es el código de la petición:
                             </span>
                        </Grid>

                        <Grid item className={styles.code}>
                            <span>
                                {code}
                            </span>
                        </Grid>
                        {props.tipology === '0871A04' &&
                            <Grid item className={styles.subtitle}>
                                <span>
                                    Tras realizar las comprobaciones necesarias, no hemos detectado ninguna incidencia eléctrica en tu zona. Es probable que la incidencia esté en tu instalación particular, por lo que tendrías que ponerte en contacto con un instalador autorizado para solventar el problema.
                                </span>
                            </Grid>
                        }
                    </Grid>

                    {(answeredQuestions != null) &&
                        <Grid container direction='column'>

                            <Grid item className={styles.separator} />

                            {answeredQuestions.map(q =>
                                <Grid container direction='column' key={q.id}>
                                    <Grid container direction='row' className={styles.question}>
                                        <Grid item>
                                            {(q.answer) ?
                                                <img src={CheckIcon} alt='' />
                                                :
                                                <img src={CrossIcon} alt='' />
                                            }
                                        </Grid>

                                        {(q.answer) ?
                                            <span>
                                                {t('common.buttons.yes')}
                                            </span>
                                            :
                                            <span>
                                                {t('common.buttons.no')}
                                            </span>
                                        }
                                        <span>
                                            {t(q.text)}
                                        </span>
                                    </Grid>

                                    <Grid item className={styles.separator} />

                                </Grid>
                            )}
                        </Grid>
                    }

                    <Grid container direction='column' alignItems='center' className={styles.button}>
                        <Button
                            text={'Finalizar'}
                            color={'primary'}
                            size={'large'}
                            variant={'contained'}
                            onClick={terminateClickHandle}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default ReportResultPage;
