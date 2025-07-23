import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'

import useStyles from '../../SearchCups.styles'
import { thunkGetListMunicipalities, thunkGetListProvinces, thunkGetListZipCodes, thunkGetMasterData } from '../../../../../actions/GestionAveriasThunkActions'
import { useDispatch } from 'react-redux'

import { useTranslation } from 'react-i18next'

interface ProvinceInterface {
	zipCode: string,
	handleChangeInput: Function
	zipCodesList: [any]
}

export default function ZipCode(props: ProvinceInterface) {
	const styles = useStyles({})
	const { t } = useTranslation()

	return (
		<Grid item xs={12} sm={2}>
			<span className={styles.inputTitle}>{t('averias.management.searchCups.address.zipcode') + t('common.punctuation.colon')}</span>
			<input
				list='zipCodes'
				className={styles.inputV4}
				value={props.zipCode}
				onChange={(e) => props.handleChangeInput('zipcode', e.target.value)}
				disabled
			/>
			<datalist id='zipCodes'>
				{props.zipCodesList.map((item, index) =>
					<option key={index} value={item} />
				)
				}
			</datalist>
		</Grid>
	)
}