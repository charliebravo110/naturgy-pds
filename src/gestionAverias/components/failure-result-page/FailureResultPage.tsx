import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { useTranslation } from 'react-i18next';
import { Grid } from '@material-ui/core';
import Button from '../../../common/components/button/Button';
import useStyles from './FailureResultPage.styles';
import CrossIcon from '../../../assets/icons/cerrar.svg';
import CheckIcon from '../../../assets/icons/check_blue.png';
import ConsumIcon from '../../../assets/icons/consumo_total.svg';
import GreenCheckIcon from '../../../assets/icons/aviso_ok.svg'
import AvisoAlerta from '../../../assets/icons/aviso_alerta_pop_up.svg'
import DigitalScriptService2, { Question } from '../../services/DigitalScriptService2';
import { thunkGetMasterData } from '../../../provisions/store/actions/ProvisionsThunkActions';
import { setMessage } from '../../../common/store/actions/ErrorActions';
import Data from './Data';
import Peticion from './Peticion';
import Averia from './Averia';
import Incidencia from './Incidencia';
import ContactData from './ContactData';
import { useHistory } from 'react-router';
import { thunkCreateNewRequest } from '../../../requests/store/actions/RequestsThunkActions';

export interface Address {
    town: string;
    province: string;
    number?: string;
    stair?: string;
    floor?: string;
    door?: string;
    zipCode?: string;
    streetName?: string;
    streetType?: string;
}

interface FailureResultPageProps {
    code: string;
    remark: string;
    address?: Address;
    answeredQuestions?: Question[];
    type?: number;
    scope?: number;
    previsionDateTime?: string;

    esAviso?: Boolean;
    cups?: string;
    fullAdress?: string;
    titular?: string;
    doc?: string;
    province?: string;

    esIncidencia?: Boolean;
    town?: string;
    zipCode?: string;
    streetType?: string;
    streetName?: string;
    number?: string;

}

const FailureResultPage = (props: any) => {

    const { t } = useTranslation();
    const styles = useStyles({});
    const dispatch = useDispatch();

    const [code, setCode] = useState<string>(props.location.state.code);
    const [remark] = useState<string>(props.location.state.remark);
    const [typeList] = useState<string>(props.location.state.typeList)
    const [alcanceList] = useState<string>(props.location.state.alcanceList)
    const [motivoList] = useState<string>(props.location.state.motivoList)

    const [address] = useState<Address>(props.location.state.address);
    const [answeredQuestions] = useState<Question[]>(props.location.state.answeredQuestions);
    const [type] = useState<number>(props.location.state.type);

    const [scope] = useState<number>(props.location.state.scope);
    const [previsionDateTime] = useState<string>(props.location.state.previsionDateTime);
    const [errorMessage] = useState<string>(props.location.state.errorMessage)


    const [esAveria] = useState<Boolean>(props.location.state.esAviso)
    const [esIncidencia] = useState<Boolean>(props.location.state.esIncidencia)
    const [consumo] = useState<string>(props.location.state.cups);
    const [direccion] = useState<string>(props.location.state.fullAdress);
    const [titular] = useState<string>(props.location.state.titular);
    const [doc] = useState<string>(props.location.state.doc);
    const [provincia] = useState<string>(props.location.state.province);
    const [municipio] = useState<string>(props.location.state.town);
    const [cotdigoPostalvincia] = useState<string>(props.location.state.zipCode);
    const [tipoVia] = useState<string>(props.location.state.streetType);
    const [sreet] = useState<string>(props.location.state.streetName);
    const [num] = useState<string>(props.location.state.number);

    const history = useHistory();

    const [typeName, setTypeName] = useState<string>('');
    const [scopeName, setScopeName] = useState<string>('');

    if (errorMessage !== '') {
        if (errorMessage !== 'errors.SR.2001') {
            dispatch(setMessage(errorMessage));
        }
    }

    useEffect(() => {
        if (type !== 0 && scope !== 0) {
            dispatch(thunkGetMasterData('SGI_PARAM_TYPE', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), type, (response) => {
                if (response && response.length > 0) {
                    setTypeName(response[0].value);
                }
            }))
            dispatch(thunkGetMasterData('SGI_PARAM_SCOPE', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), scope, (response) => {
                if (response && response.length > 0) {
                    setScopeName(response[0].value);
                }
            }))
        }
    }, [])

    useEffect(() => {
        const resetScroll = () => {
            window.scrollTo({ top: 0, left: 0 });
        };

        const timeoutId = setTimeout(resetScroll, 500);
        return () => {
            clearTimeout(timeoutId);
        };

    }, [history.location.pathname])


    const terminateClickHandle = (): void => {
        dispatch(push('/gestionAverias'));
    }

    const [showButton, setShowButton] = useState<boolean>(props.location.state.showRetry)
    const retry = () => {
        dispatch(thunkCreateNewRequest(props.location.state.data, (responseZ) => {
            if (responseZ && responseZ.result && responseZ.result.codResult === '0000') {
                setShowButton(false)
                setCode(responseZ.codigoSR)
            }
        }))
    }

    const getMotivoFromList = (motivo) => {
        for (let i = 0; i < motivoList.length; i++) {
            if(motivoList[i].includes(motivo)){
                return motivoList[i];
            }            
        }
        return motivo;
    }

    return (
        <Grid container justifyContent='center' alignItems='center' className={styles.container}>
            <Grid container justifyContent='center' className={styles.maxWidthForBigScreens}>
                <Grid item md={6}>
                    <Grid item className={styles.headerTitle}>
                        {t('averias.management.resultPage.header')}
                    </Grid>
                    <Grid item container>
                        <Grid container direction='column' alignItems='center'>
                            {
                                !showButton ? (
                                    <Grid container direction='column' alignItems='center' className={styles.resumebox}>
                                        <Grid item>
                                            <img src={GreenCheckIcon} alt='' />
                                        </Grid>
                                        <Grid item className={styles.subtitle}>
                                            <span style={{ display: 'flex', textAlign: 'center', flexDirection: 'column', alignContent: 'center', justifyContent: 'center', alignItems: 'center', color: '#004571' }}>
                                                {(!props.location.state.hasCOR) ?
                                                    t('averias.management.resultPage.result2')
                                                    :
                                                    props.location.state.type3 ? (
                                                        <>
                                                            {t('averias.management.resultPage.result2')}
                                                            <span style={{ display: 'block' }}>
                                                                {t('averias.management.resultPage.result2Avice')}
                                                                <br />
                                                                {t('averias.management.resultPage.result2Avice_2')}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {
                                                                t('averias.management.resultPage.result1')
                                                            }
                                                        </>
                                                    )
                                                }
                                            </span>
                                        </Grid>
                                    </Grid>
                                ) : (
                                    (props.location.state.hasCOR) && (
                                        <Grid container direction='column' alignItems='center' className={styles.resumebox}>
                                            <Grid item>
                                                <img src={GreenCheckIcon} alt='' />
                                            </Grid>
                                            <Grid item className={styles.subtitle}>
                                                <span style={{ display: 'flex', textAlign: 'center', flexDirection: 'column', alignContent: 'center', justifyContent: 'center', alignItems: 'center', color: '#004571' }}>
                                                    {(props.location.state.hasCOR) &&
                                                        t('averias.management.resultPage.result3')
                                                    }
                                                </span>
                                            </Grid>
                                        </Grid>
                                    )
                                )
                            }
                        </Grid>
                    </Grid>
                    {
                        showButton && (
                            <>
                                <Grid container direction='column' alignItems='center' style={{ marginTop: '26px' }}>
                                    <Grid container direction='column' alignItems='center' className={styles.resumebox}>
                                        <Grid item>
                                            <img src={AvisoAlerta} alt='' />
                                        </Grid>
                                        <Grid item className={styles.subtitle}>
                                            <span style={{ display: 'flex', textAlign: 'center', flexDirection: 'column', alignContent: 'center', justifyContent: 'center', alignItems: 'center', color: '#004571' }}>
                                                {
                                                    <p style={{ color: 'red', margin: 0 }}>
                                                        {t('notRegiter')}
                                                    </p>
                                                }
                                                {
                                                    <p style={{ color: 'red', margin: 0 }}>
                                                        {`${t('notRegiter_2')} ${props.location.state.msg}`}
                                                    </p>
                                                }
                                                {
                                                    t('notRegiter_3')
                                                }
                                            </span>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <div style={{ margin: '26px 0', display: 'flex', width: '100%', alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
                                    <Button
                                        text={t('averias.management.resultPage.retry')}
                                        color={'primary'}
                                        size={'large'}
                                        variant={'contained'}
                                        onClick={retry}
                                    />
                                </div>
                            </>
                        )
                    }
                    <Grid container className={styles.cont}>
                        <Grid container>
                            <Grid container direction='column' className={styles.remark}>
                                {
                                    props.location.state.hasCOR && (
                                        <>
                                            <h4 className={styles.getMargin}>{t('averias.management.resultPage.data_title')}</h4>
                                            <div className={styles.bkg}>
                                                <div className={styles.getMargin}>
                                                    <Data
                                                        aviso={remark}
                                                        type={`${typeList[type - 1]}`}
                                                        alcance={alcanceList[parseInt(props.location.state.alcance) - 1]}
                                                        motivo={getMotivoFromList(props.location.state.motivo)}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )
                                }
                                {
                                    true && (
                                        <>
                                            <h4 className={styles.getMargin}>{t('averias.management.resultPage.peticion_title')}</h4>
                                            <div className={styles.bkg}>
                                                <div className={styles.getMargin}>
                                                    <Peticion
                                                        code={code}
                                                        SR={props.location.state.SR}
                                                        type={props.location.state.type}
                                                        status={props.location.state.status}
                                                        substatus={props.location.state.substatus}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )
                                }
                                {/* Crear aviso de averia */}
                                {(esAveria) && doc && direccion &&
                                    <>
                                        <h4 className={styles.getMargin}>{t('averias.management.resultPage.data_suministro')} / {t('averias.management.resultPage.punto_actuacion')}</h4>
                                        <Averia
                                            consumo={consumo}
                                            direccion={direccion}
                                            titular={titular}
                                            doc={doc}
                                            provincia={provincia}
                                            ConsumIcon={ConsumIcon}
                                        />
                                    </>
                                }
                                {(esIncidencia) &&
                                    <>
                                        <h4 className={styles.getMargin}>{t('averias.management.resultPage.data_suministro')} / {t('averias.management.resultPage.punto_actuacion')}</h4>
                                        <Incidencia
                                            provincia={provincia}
                                            municipio={municipio}
                                            cotdigoPostalvincia={cotdigoPostalvincia}
                                            tipoVia={tipoVia}
                                            sreet={sreet}
                                            num={num}
                                        />
                                    </>
                                }
                                <h4 className={styles.getMargin}>{t('averias.management.resultPage.contact_data')}</h4>
                                <div className='bkg'>
                                    <div className='getMargin'>
                                        <ContactData phone={num} />
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                        {/* Crear aviso de incidencia */}
                        <Grid container direction='column' alignItems='center' style={{ margin: '1rem' }}>
                            <Button
                                text={t('averias.management.resultPage.close')}
                                color={'primary'}
                                size={'large'}
                                variant={'contained'}
                                onClick={terminateClickHandle}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default FailureResultPage;
