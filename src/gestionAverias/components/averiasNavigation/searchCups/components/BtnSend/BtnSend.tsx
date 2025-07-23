import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'

import useStyles from '../../SearchCups.styles'
import { thunkGetListMunicipalities, thunkGetListProvinces, thunkGetListZipCodes, thunkGetMasterData } from '../../../../../actions/GestionAveriasThunkActions'
import { useDispatch } from 'react-redux'

import { useTranslation } from 'react-i18next'
import Input from '../../../../../../common/components/input/Input'
import Button from '../../../../../../common/components/button/Button'

interface BtnInterface {
    showButon:boolean
    handleSearchButton:Function
}

export default function BtnSend(props:BtnInterface) {
    const styles = useStyles({})
    const { t } = useTranslation()
    return (
        <Grid item md={3} xs={12} sm={6}>
			<span className={styles.inputTitle} />
			<Button
				text={t('averias.management.incidence.insertContactData.selectBuilding')}
				color={'primary'}
				size={'medium'}
				variant={'contained'}
				onClick={props.handleSearchButton}
				disabled={props.showButon}
			/>
		</Grid>
    )
}