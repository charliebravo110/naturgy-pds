import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Link, Redirect } from 'react-router-dom'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import DelegateUserIcon from '../../../assets/icons/header_gestor.svg'
import AlertIcon from '../../../assets/icons/aviso_alerta_pop_up.svg'

import Spinner from '../../../common/components/spinner/Spinner'
import Input from '../../../common/components/input/Input'
import Button from '../../../common/components/button/Button'
import { SecurityHOC } from '../../../common/HOC/SecurityHOC'
import { validateIdentityCard } from '../../../common/lib/ValidationLib'
import { thunkCreateDelegate } from '../../store/actions/DelegatesThunkActions'

import useStyles from './NewDelegate.styles'

// LCS: Importar las funciones - Wave 3
import { removeEmails, sendGAEvent } from '../../../core/utils/gtm'

const NewDelegate = (props: any) => {
    const [ error, setError ] = useState(true)
    const [ name, setName ] = useState('')
    const [ documentNumber, setDocumentNumber ] = useState('')
    const [ isLoading, setIsLoading ] = useState(false)
    const dispatch = useDispatch()
    const { t } = useTranslation()

    let adminToken = useSelector((state: any) => state.admin.token)

    const redirect = props.location.state && props.location.state.redirect

    const delegatesText = props.delegateType === 'US_MANAGER' ? 'managers' : 'consultants'

    const returnTo = redirect || `/${delegatesText}`

    const classes = useStyles({})

    // En este nuevo cambio, añadimos el rol US_SUPPLYPOINT_CLIENT al rol que ya mandábamos (US_MANAGER / US_CONSULTANT) para que los
    // usuarios que no son propietarios de un CUPS sí puedan visualizar la pantalla de los CUPS que les han sido delegados. Es importante que
    // el primer rol sea US_MANAGER o US_CONSULTANT y el segundo sea US_SUPPLYPOINT_CLIENT y separados por coma. Ejemplo: US_MANAGER,US_SUPPLYPOINT_CLIENT
    const roles = props.delegateType + ',US_SUPPLYPOINT_CLIENT'

    const handleAcceptButton = () => {
        // LCS: Enviar evento de GdC a GA - Wave 3
        sendGAEVentAcceptNewManager()

        setIsLoading(true)

        dispatch(thunkCreateDelegate({
            name,
            documentNumber: documentNumber.toUpperCase()
        }, roles, (response) => {
            if (response) {
            props.history.push(returnTo)
            }

            setIsLoading(false)
        }))
    }

    useEffect(() => {
        // LCS: Enviar evento de GdC a GA - Wave 3
        sendGAEvent({
        event: 'view',
        content_group: props.delegateType === 'US_MANAGER' ? 'mis gestores' : 'mis asesores',
        page_url: removeEmails(window.location.href),
        user_id: sessionStorage.getItem('id'),
        previous_path: removeEmails(sessionStorage.getItem("previousPage")),
        user_type: sessionStorage.getItem('user_type'),
        browsing_type: sessionStorage.getItem('browsing_type'),
        element_type: 'medicion de pagina',
        ga_client_id: sessionStorage.getItem('ga_client_id'),
        cups: 'no aplica',
        supply_type: 'no aplica'
        });
        sessionStorage.setItem("previousPage", window.location.href);
    },[])

    useEffect(() => {
        let error = true
        if(name !== '' && validateIdentityCard(documentNumber)){
            error = false
        }

        setError(error)
    }, [name, documentNumber])

    if(adminToken){
        return <Redirect to={returnTo} />
    }

    // LCS: Enviar evento de GdC a GA - Wave 3
    const sendGAEventCancelNewManager = ():any => {
        if (delegatesText === 'managers') {
            sendGAEvent({
                event: 'add_manager',
                section_name: 'mis suministros',
                subsection_name: 'mis gestores',
                click_text: 'cancelar',
                element_type: 'consulta de informacion',
                page_url: window.location.href,
                module_name: 'nuevo gestor',
                browsing_type: sessionStorage.getItem('browsing_type'),
            })
        } else {
            sendGAEvent({
                event: 'add_advisor',
                section_name: 'mis suministros',
                subsection_name: 'mis asesores',
                click_text: 'cancelar',
                element_type: 'consulta de informacion',
                page_url:window.location.href,
                module_name: 'nuevo asesor',
                browsing_type:sessionStorage.getItem('browsing_type'),
            })
        }
    }
    
    // LCS: Enviar evento de GdC a GA - Wave 3
    const sendGAEVentAcceptNewManager = ():void => {
        if (delegatesText === 'managers') {
            sendGAEvent({
                event: 'add_manager',
                section_name: 'mis suministros',
                subsection_name: 'mis gestores',
                click_text: 'aceptar',
                element_type: 'conversion de accion',
                page_url: window.location.href,
                module_name: 'nuevo gestor',
                browsing_type: sessionStorage.getItem('browsing_type'),
            })
        } else {
            sendGAEvent({
                event: 'add_advisor',
                section_name: 'mis suministros',
                subsection_name: 'mis asesores',
                click_text: 'aceptar',
                element_type: 'conversion de accion',
                page_url:window.location.href,
                module_name: 'nuevo asesor',
                browsing_type:sessionStorage.getItem('browsing_type'),
            })
        }
    }

    return (
        <Grid container justifyContent='center' alignItems='center' className={classes.container}>
          {
            isLoading &&
              <Spinner fixed={true} />
          }
            <Grid item xs={11} sm={11} md={10} className={classes.maxWidthForBigScreens}>
                <Grid className={classes.headerTitle}>
                    {t(`delegates.new${delegatesText}.title`)}
                </Grid>
                <Grid container justifyContent='flex-end'>
                    <Link to={returnTo} className={classes.return}>
                        {t('delegates.delegatesList.return')}
                    </Link>
                </Grid>
                <Grid container direction='row' className={classes.profileBlock}>
                    <Grid container item className={classes.blockLeft} xs={12} sm={12} md={3} lg={3} />
                    <Grid container item className={classes.blockRight} xs={12} sm={12} md={9} lg={9} >
                        <Grid container item xs={3} sm={2} md={1} className={classes.avatarContainer}>
                            <img src={DelegateUserIcon} className={classes.avatar} alt='' />
                        </Grid>
                        <Grid container justifyContent='center' >
                            <Grid item xs={10} md={6}>
                                <Typography className={classes.label}>{t(`delegates.new${delegatesText}.name`)}</Typography>
                                <Input
                                    className={classes.input}
                                    onChange={({target}) => setName(target.value)}
                                    value={name}
                                />
                                <Typography className={classes.label}>{t(`delegates.delegateProfile.document`)}</Typography>
                                <Input
                                    showValidationIcon
                                    className={classes.input}
                                    error={documentNumber !== '' && !validateIdentityCard(documentNumber)}
                                    onChange={({target}) => setDocumentNumber(target.value)}
                                    value={documentNumber}
                                />
                                <div className={classes.advice}>
                                    <img src={AlertIcon} alt=''/>
                                    <p>{t('delegates.newDelegates.advice')}<b>{t(`delegates.new${delegatesText}.advice2`)}</b>{t('delegates.newDelegates.advice3')}</p>
                                </div>
                            </Grid>
                            <Grid container item xs={10} md={8} justifyContent='space-around' >
                                <Grid item xs={12} className={classes.allFields} >
                                    <p>{t(`delegates.delegateProfile.allFields`)}</p>
                                </Grid>
                                <Link to={returnTo} className={classes.cancelButton}>
                                    <Button
                                        className={classes.button}
                                        text={t('delegates.delegateProfile.cancel')}
                                        color='inherit'
                                        size='large'
                                        variant='outlined'
                                        onClick={sendGAEventCancelNewManager}
                                    />
                                </Link>
                                <Button
                                    className={classes.button}
                                    text={t('delegates.delegateProfile.accept')}
                                    color='primary'
                                    size='large'
                                    variant='contained'
                                    onClick={handleAcceptButton}
                                    disabled={error}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
  }

  export default SecurityHOC(NewDelegate)
