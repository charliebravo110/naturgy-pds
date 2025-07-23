import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import Grid from '@material-ui/core/Grid'
import BackIcon from '@material-ui/icons/ChevronLeft'
import Spinner from '../../../../common/components/spinner/Spinner'
import Button from '../../../../common/components/button/Button'
import Breadcrumbs from '../common/breadcrumbs/Breadcrumbs'
import Item from '../notification-list/item/Item'
import ConfirmationDialog from '../form/confirmation-dialog/ConfirmationDialog'
import EsquemaIcon from '../../../../assets/icons/ico_esquema.svg'

import useStyles from './NotificationList.styles'

const NotificationList = (props: any) => {

    const classes = useStyles({})
    const { t } = useTranslation()

    const requests = useSelector((state: any) => state.requests)


    const { setCreatingNewRequest, setCurrentStep, isLoading, notificationListSelected, setNotificationListSelected } = props


    const [loading, setLoading] = useState(false)
    const [disablingButton, setDisablingButton] = useState(true)
    const [showingConfirmationDialog, setShowingConfirmationDialog] = useState(false)

    const [check1, setCheck1] = useState(false)
    const [check2, setCheck2] = useState(false)
    const [check3, setCheck3] = useState(false)
    const [check4, setCheck4] = useState(false)

    const handleClickBack = () => {
        setCurrentStep(3)
        setNotificationListSelected([])
    }

    const handleClickItem = (value) => {
        if (value !== '') {
            let lista = []
            lista = notificationListSelected

            if (lista.includes(value)) {
                let pos = lista.indexOf(value)
                lista.splice(pos, 1)       
            } else {
                lista.push(value)
            }

            setNotificationListSelected(lista)

            if (notificationListSelected.length > 0) {
                setDisablingButton(false)
            }
            else {
                setDisablingButton(true)
            }

            if (notificationListSelected.includes('NOTIFIOPER01')){
                setCheck1(true)
            } else {
                setCheck1(false) 
            }
            if (notificationListSelected.includes('NOTIFIOPER02')){
                setCheck2(true)
            } else {
                setCheck2(false) 
            }
            if (notificationListSelected.includes('NOTIFIOPER03')){
                setCheck3(true)
            } else {
                setCheck3(false) 
            }
            if (notificationListSelected.includes('NOTIFIOPER04')){
                setCheck4(true)
            } else {
                setCheck4(false) 
            }            

        }
    }

    const handleClickContinue = () => {
        setCurrentStep(5)
    }

    return (
        <>
            <div className={`${classes.block} ${window.location.pathname === '/supplies/detail' && 'without-margin'} ${window.location.pathname === '/provisions/detail' && 'with-margin'}`}>
                {
                    (loading || isLoading) &&
                    <Spinner fixed />
                }

                <ConfirmationDialog visible={showingConfirmationDialog} setVisible={() => setShowingConfirmationDialog(false)} />

                <Grid container className={classes.container}>
                    <Grid item md={10} sm={11} xs={11}>
                        <div className={`${classes.goBackContainer} ${window.location.pathname === '/provisions/detail' && 'onDossier'} ${window.location.pathname === '/supplies/detail' && 'onSupply'}`}>
                            <Grid container className={classes.goBack} onClick={handleClickBack}>
                                <Grid item className={classes.goBackIcon}>
                                    <BackIcon />
                                </Grid>

                                <Grid item>
                                    {t('requests.newRequest.goBack')}
                                </Grid>
                            </Grid>
                        </div>

                        <div className={`${classes.title} ${window.location.pathname === '/provisions/detail' && 'without-margin'} ${window.location.pathname === '/supplies/detail' && 'onSupply'}`}>{t('requests.newRequest.notificationlist.title')}</div>

                        <hr className={classes.line} />
                        
                        <Breadcrumbs currentStep={7} />

                        <div className={classes.description}>
                            {
                                (requests.newRequestSteps.step1 === 'DOSSIER' && requests.newRequestSteps.step3 === 'NOTIFICATIONS') ?
                                    t('requests.newRequest.notificationlist.notification.description')
                                    :
                                    t('requests.newRequest.relationship.descriptions.default')
                            }
                        </div>
                        <div className={classes.items}>
                            {
                                <>
                                    <Item
                                        type='technical-economic-definition'
                                        icon={EsquemaIcon}
                                        title={t('requests.newRequest.notificationlist.notification.notifications.notifioper01.title')}
                                        description={t('requests.newRequest.notificationlist.notification.notifications.notifioper01.description')}
                                        handleClick={() => handleClickItem('NOTIFIOPER01')}
                                        isCheckboxSelected={check1}
                                    />
                                    
                                    <Item
                                        type='technical-economic-definition'
                                        icon={EsquemaIcon}
                                        title={t('requests.newRequest.notificationlist.notification.notifications.notifioper03.title')}
                                        description={t('requests.newRequest.notificationlist.notification.notifications.notifioper03.description')}
                                        handleClick={() => handleClickItem('NOTIFIOPER03')}
                                        isCheckboxSelected={check3}
                                    />                                    

                                    <Item
                                        type='technical-economic-definition'
                                        icon={EsquemaIcon}
                                        title={t('requests.newRequest.notificationlist.notification.notifications.notifioper02.title')}
                                        description={t('requests.newRequest.notificationlist.notification.notifications.notifioper02.description')}
                                        handleClick={() => handleClickItem('NOTIFIOPER02')}
                                        isCheckboxSelected={check2}
                                    />

                                    <Item
                                        type='technical-economic-definition'
                                        icon={EsquemaIcon}
                                        title={t('requests.newRequest.notificationlist.notification.notifications.notifioper04.title')}
                                        description={t('requests.newRequest.notificationlist.notification.notifications.notifioper04.description')}
                                        handleClick={() => handleClickItem('NOTIFIOPER04')}
                                        isCheckboxSelected={check4}
                                    />
                                </>
                            }
                        </div>

                        <Grid container className={classes.buttons} spacing={4}>
                            {
                                <Grid item md='auto' sm={12} xs={12}>
                                    <Button
                                        text={t('common.buttons.continue')}
                                        color='primary'
                                        size='large'
                                        variant='contained'
                                        disabled={disablingButton}
                                        onClick={handleClickContinue}
                                    />
                                </Grid>
                            }
                        </Grid>

                        <div className={classes.exit}>
                            {
                                (window.location.pathname === '/supplies/detail' || window.location.pathname === '/provisions/detail') ?
                                    <span onClick={() => setCreatingNewRequest(false)}>{t('requests.newRequest.exit')}</span>
                                    :
                                    <Link to='/requests'>{t('requests.newRequest.exit')}</Link>
                            }
                        </div>

                    </Grid>
                </Grid>
            </div>
        </>
    )

}

export default NotificationList