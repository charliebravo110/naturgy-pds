import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Link, Redirect } from 'react-router-dom'

import Grid from '@material-ui/core/Grid'

import DelegateUserIcon from '../../../assets/icons/header_gestor.svg'
import removeDelegateIcon from '../../../assets/icons/plus_thicker.svg'

import Input from '../../../common/components/input/Input'
import EditLabel from '../../../common/components/edit-label/EditLabel'
import SaveLabel from '../../../common/components/save-label/SaveLabel'
import { SecurityHOC } from '../../../common/HOC/SecurityHOC'
import EditManager from '../dialogs/edit-manager/EditManager'
import RemoveManager from '../dialogs/remove-manager/RemoveManager'
import { setDelegateName, resetDelegate } from '../../store/actions/DelegatesActions'
import { thunkGetDelegate, thunkUpdateDelegate, thunkDeleteDelegate, thunkGetDelegations } from '../../store/actions/DelegatesThunkActions'

import useStyles from './DelegateProfile.styles'

// LCS: Importar la función - Wave 3
import { removeEmails, sendGAEvent } from '../../../core/utils/gtm'

const DelegateProfile = (props: any) => {
    const [ inputName, setInputName ] = useState(false)
    const [ nameValue, setNameValue ] = useState()
    const [ popup, setPopup ] = useState(false)
    const [ deletePopupOpen, setDeletePopupOpen ] = useState(false)
    const [ deletePopupState, setDeletePopupState ] = useState(1)
    const [ sucess, setSucess ] = useState(true)

    const delegate = useSelector((state: any) => state.delegates.currentDelegate)
    const dispatch = useDispatch()
    const { t } = useTranslation()

    const id = props.location.state && props.location.state.delegateId
    const delegatesText = props.delegateType === 'US_MANAGER' ? 'managers' : 'consultants'

    const classes = useStyles({})
    
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

    const openNameInput = () => {
        setInputName(!inputName)
        setNameValue(delegate.name)
    }

    const handleSaveInputName = async() => {
        const currentDelegate = delegate

        setInputName(!inputName)

        await dispatch(setDelegateName(nameValue || ''))

        dispatch(thunkUpdateDelegate(id, setSucess))

        if(currentDelegate.name !== nameValue){
            setPopup(true)
        }
    }

    const closeDeletePopup = () => {
        setDeletePopupOpen(false)
        setDeletePopupState(1)
    }

    const checkDelegationsAndDelete = () =>{

        dispatch(thunkGetDelegations(delegate.delegateId, (response) => {

            if (response.delegations && response.delegations.items.length > 0) {
                setDeletePopupState(2)
            }else{
                setDeletePopupOpen(false)
                dispatch(thunkDeleteDelegate(`/${delegatesText}`))
            }
        }))
    }
    
    useEffect(() => {
        if(id){
            dispatch(thunkGetDelegate(id))
        }
        return function() {
            dispatch(resetDelegate())
        }
    }, [dispatch, id])

    if(!id){
        return <Redirect to={`/${delegatesText}`} />
    }

    // LCS: Enviar evento de GdC a GA - Wave 3
    const sendGAEventRemoveDelegate = ():void => {
        sendGAEvent({
            event: 'add_manager',
            section_name: 'mis suministros',
            subsection_name: (props.delegateType === 'US_MANAGER' ? 'mis gestores' : 'mis asesores'),
            click_text: 'dar de baja',
            element_type: 'consulta de informacion',
            page_url: window.location.href,
            module_name: (props.delegateType === 'US_MANAGER' ? 'modificar datos del gestor' : 'modificar datos del asesor'),
            browsing_type: sessionStorage.getItem('browsing_type'),
        })
    }

    return (
        <>
        <EditManager success={sucess} popup={popup} setPopup={setPopup}>
            {
                sucess ?
                <p>{t('delegates.delegateProfile.popupSuccess')}</p>
                :
                <p>{t('delegates.delegateProfile.popupFail')}</p>
            }
        </EditManager>
        <RemoveManager
            open={deletePopupOpen}
            closeFunction={closeDeletePopup}
            state={deletePopupState}
            deleteFunction={checkDelegationsAndDelete}
            managerInfo={props.delegateType}
        />
        <Grid container justifyContent='center' alignItems='center' className={classes.container}>
            <Grid item xs={10} className={classes.headerTitle}>
                {t(`delegates.${delegatesText}profile.title`)}
            </Grid>
            <Grid container item xs={10} justifyContent='flex-end'>
                <Link to={`/${delegatesText}`} className={classes.return}>
                    {t('delegates.delegatesList.return')}
                </Link>
            </Grid>
            <Grid container item direction='row' xs={11} sm={11} md={10} className={classes.profileBlock}>
                <Grid container item className={classes.blockLeft} xs={12} sm={12} md={3} lg={3} />
                <Grid container item className={classes.blockRight} xs={12} sm={12} md={9} lg={9} >
                    <Grid container item xs={3} sm={2} md={1} className={classes.avatarContainer}>
                        <img src={DelegateUserIcon} className={classes.avatar} alt='' />
                    </Grid>
                    <Grid container item xs={12} justifyContent='flex-end' >
                        <div className={classes.removeText} onClick={() => { sendGAEventRemoveDelegate(); setDeletePopupOpen(true)}}>
                            <img src={removeDelegateIcon} alt='x' className={classes.removeIcon} />
                            {t('delegates.delegateProfile.removeDelegate')}
                        </div>
                    </Grid>
                    <Grid container justifyContent='center' >
                        <Grid item xs={10} md={6}>
                            <Grid container direction='column' spacing={1} className={classes.ieFlexHack}>
                                {
                                inputName ?
                                    <>
                                        <SaveLabel
                                            label={t(`delegates.new${delegatesText}.name`)}
                                            onClick={handleSaveInputName}
                                        />
                                        <Input
                                            className={classes.updateInput}
                                            onChange={({ target }) => setNameValue(target.value)}
                                            value={nameValue}
                                        />
                                    </>
                                :
                                    <>
                                        <EditLabel large label={t(`delegates.new${delegatesText}.name`)} onClick={openNameInput} delegateOption={delegatesText}/>

                                        <Grid className={classes.info}>{delegate.name}</Grid>
                                    </>
                                }
                            </Grid>
                            <Grid item className={classes.dataRow}>
                                <Grid container direction='row'>
                                <Grid item>
                                    <Grid container direction='column' spacing={1}>
                                    <Grid item className={classes.label}>
                                        {t(`delegates.delegateProfile.document`)}
                                    </Grid>

                                    <Grid item className={classes.info}>
                                        {delegate && delegate.documentNumber}
                                    </Grid>
                                    </Grid>
                                </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
        </>
    )
  }

  export default SecurityHOC(DelegateProfile)
