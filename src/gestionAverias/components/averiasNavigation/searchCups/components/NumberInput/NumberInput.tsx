import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'

import useStyles from '../../SearchCups.styles'
import { thunkGetListMunicipalities, thunkGetListProvinces, thunkGetListZipCodes, thunkGetMasterData } from '../../../../../actions/GestionAveriasThunkActions'
import { useDispatch } from 'react-redux'

import { useTranslation } from 'react-i18next'
import Input from '../../../../../../common/components/input/Input'

interface ProvinceInterface {
    number: string,
    handleChangeInput: Function
}

export default function NumberInput(props: ProvinceInterface) {
    const styles = useStyles({})
    const { t } = useTranslation()

    return (
        <Grid item md={1} xs={12} sm={6}>
            <span className={styles.inputTitle}>{t('averias.management.searchCups.address.number') + t('common.punctuation.colon')}</span>
            <Input
                className={styles.inputV2Number}
                value={props.number}
                onChange={(e) => props.handleChangeInput('number', e.target.value)}
            />
        </Grid>
    )
}