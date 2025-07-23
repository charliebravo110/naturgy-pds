import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'

import useStyles from '../../SearchCups.styles'
import { thunkGetListMunicipalities, thunkGetListProvinces, thunkGetListZipCodes, thunkGetMasterData } from '../../../../../actions/GestionAveriasThunkActions'
import { useDispatch } from 'react-redux'

import { useTranslation } from 'react-i18next'
import Input from '../../../../../../common/components/input/Input'
import Button from '../../../../../../common/components/button/Button'

interface DuplicatorInterface {
    duplicator: string,
    title: string
}

export default function InputWithTitle(props: DuplicatorInterface) {
    const styles = useStyles({})
    const { t } = useTranslation()

    const change_ = () => {}

    return (
        <Grid item md={1} xs={12} sm={6}>
            <span className={styles.inputTitle}>{t(props.title)}</span>
            <Input
                className={styles.input}
                value={props.duplicator}
                onChange={change_()}
                disabled
            />
        </Grid>
    )
}