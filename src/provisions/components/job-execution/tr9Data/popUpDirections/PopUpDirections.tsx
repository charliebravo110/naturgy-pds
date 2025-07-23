import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dialog, DialogContent, Grid, Typography, Button as ButtonReact, Link } from '@material-ui/core'
import Button from '../../../../../common/components/button/Button'
import CloseIcon from '../../../../../assets/icons/cerrar.svg'
import AlertIcon from '../../../../../assets/icons/aviso_alerta_pop_up.svg'
import ErrorIcon from '../../../../../assets/icons/misdocumentos_rechazado.svg'
import useStyles from '../popUpDirections/PopUpDirections.styles'
import PopUpTable from './PopUpTable'

const PopUpDirections = (props: any) => {
    const classes = useStyles()
    const { t } = useTranslation()

    const {
        openDialog,
        addressList,
        address,
        setAddress,
        searchAddress,
        setCodePostal,
        setAddressType,
        setAddressNumber,
        province,
        town,
        open,
        setDisabledAllFields,
        setManualDirection,
        setIdStreetSelect
    } = props

    const [openFailDirection, setOpenFailDirection] = useState(false)
    const [acceptButton, setAcceptButton] = useState(false)
    const [checkData, setCheckData] = useState({address: '', streetName: '', zipCode: '', streetType: ''})

    const header = () => {
        return (
            <Grid>
                <Grid className={classes.titleContainer}>
                    <Typography className={classes.title}>{t('provisions.jobExecution.isTr9.popUpDirections.searchRoute')}</Typography>
                </Grid>
                <Grid className={classes.localityContainer}>
                    <Typography className={classes.localityTitle}>{t('provisions.jobExecution.isTr9.popUpDirections.province')}
                        <Typography className={classes.localityText}> {province}</Typography></Typography>
                    <Typography className={classes.localityTitle}>{t('provisions.jobExecution.isTr9.popUpDirections.municipality')}
                        <Typography className={classes.localityText}> {town}</Typography></Typography>
                </Grid>
            </Grid>
        )
    }

    const contentError = () => {
        if (addressList.length > 50) {
            return (
                <Grid className={classes.alertContainer}>
                    <img src={AlertIcon} width={48} />
                    <Typography className={classes.getTitle}>{t('provisions.jobExecution.isTr9.popUpDirections.get.part1')} <strong>50</strong> {t('provisions.jobExecution.isTr9.popUpDirections.get.part2')}</Typography>
                    <Typography className={classes.text}>{t('provisions.jobExecution.isTr9.popUpDirections.excessResults')}</Typography>
                    <Typography className={classes.text}>{t('provisions.jobExecution.isTr9.popUpDirections.narrowSearch')}</Typography>
                </Grid>
            )
        } else {
            return (
                <Grid className={classes.errorContainer}>
                    <img src={ErrorIcon} width={48} />
                    <Typography className={classes.getTitle}>{t('provisions.jobExecution.isTr9.popUpDirections.notFound')} "<strong>{searchAddress ? searchAddress : address}</strong>"</Typography>
                    <Typography className={classes.paddingText}>{t('provisions.jobExecution.isTr9.popUpDirections.tryAgain')}</Typography>
                    <Typography className={classes.text}>{t('provisions.jobExecution.isTr9.popUpDirections.verificationProcess')}</Typography>
                </Grid>
            )
        }
    }

    const contentList = () => {
        return (
            <>
                <Typography className={classes.getTitle}>{t('provisions.jobExecution.isTr9.popUpDirections.found')} "<strong>{searchAddress ? searchAddress : address}</strong>"</Typography>
                <PopUpTable addressList={addressList} address={address} setCheckData={setCheckData} setAddress={setAddress} setCodePostal={setCodePostal} setAddressType={setAddressType} setAddressNumber={setAddressNumber} setAcceptButton={setAcceptButton} setIdStreetSelect={setIdStreetSelect} />
            </>
        )
    }

    const addressNotFound = () => {
        return (
            <Grid className={classes.notFoundContainer} style={{ display: 'flex', flexDirection: openFailDirection ? 'column' : 'row', paddingBlock: 10 }}>
                <Grid className={classes.failDirectionContainer}>
                    <Typography className={classes.failDirectionTitle}>{t('provisions.jobExecution.isTr9.popUpDirections.notFoundQuestion')}</Typography>
                    {!openFailDirection &&
                        <Link
                            onClick={() => setOpenFailDirection(true)}
                        >
                            <Typography className={classes.failDirectionLink}>{t('provisions.jobExecution.isTr9.popUpDirections.clickHere')}</Typography>
                        </Link>}
                </Grid>
                {openFailDirection && (
                    <Grid className={classes.failDirectionColumnContainer}>
                        <Typography className={classes.failDirectionText}>{t('provisions.jobExecution.isTr9.popUpDirections.doesntAppear')}</Typography>
                        <Grid className={classes.failDirectionButtonsContainer}>
                            <Button
                                //className={classes.acceptBtn}
                                text={t('common.buttons.cancel')}
                                color='inherit'
                                size='large'
                                variant='contained'
                                onClick={() => setOpenFailDirection(false)}
                            />
                            <div className={classes.gridSpaceContainer} />
                            <Button
                                className={classes.acceptBtn}
                                text={t('common.buttons.continue')}
                                color='primary'
                                size='large'
                                variant='contained'
                                onClick={() => {
                                    setDisabledAllFields(false)
                                    open(false)
                                    setOpenFailDirection(false)
                                    setManualDirection(true)
                                }}
                            />
                        </Grid>
                    </Grid>
                )}
            </Grid>
        )
    }

    const footer = () => {
        return (
            <Grid className={classes.footerContainer}>
                <Button
                    //className={classes.acceptBtn}
                    text={addressList.length === 0 || addressList.length > 50 ? t('common.buttons.close') : t('common.buttons.accept')}
                    color='primary'
                    size='large'
                    variant='contained'
                    disabled={openFailDirection ? true : addressList.length === 0 || addressList.length > 50 ? false : !acceptButton}
                    onClick={() => {
                        if(!(addressList.length === 0 || addressList.length > 50)) {
                            setAddress(checkData.streetName)
                            setCodePostal(checkData.zipCode)
                            setAddressType(checkData.streetType)
                        }
                        open(false)
                        setOpenFailDirection(false)
                        setAcceptButton(false)
                    }}
                />
            </Grid>
        )
    }

    return (
        <Dialog open={openDialog} className={classes.dialog}>
            <DialogContent className={classes.dialogContainer}>
                <Grid>
                    <img src={CloseIcon} alt='' width={10} onClick={() => open(false)} className={classes.closeIcon} />
                    {header()}
                    {addressList.length === 0 || addressList.length > 50 ? contentError() : contentList()}
                    {addressList.length < 50 && addressNotFound()}
                    {footer()}
                </Grid>
            </DialogContent>
        </Dialog>
    )
}

export default PopUpDirections