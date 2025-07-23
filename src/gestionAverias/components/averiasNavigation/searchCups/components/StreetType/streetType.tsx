import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'

import useStyles from '../../SearchCups.styles'
import { thunkGetListMunicipalities, thunkGetListProvinces, thunkGetListZipCodes, thunkGetMasterData } from '../../../../../actions/GestionAveriasThunkActions'
import { useDispatch } from 'react-redux'

import { useTranslation } from 'react-i18next'

interface ProvinceInterface {
	streetType: string,
	handleChangeInput: Function
	tracksList: string[]
}

export default function StreetType(props: ProvinceInterface) {
	const styles = useStyles({})
	const { t } = useTranslation()

	return (
		<Grid item md={2} xs={12} sm={6}>
			<span className={styles.inputTitle}>{t('averias.management.searchCups.address.streetType') + t('common.punctuation.colon')}</span>
			<input
				list='streetTypeList'
				className={styles.inputV4}
				value={props.streetType}
				onChange={(e) => props.handleChangeInput('streetType', e.target.value)}
				disabled
			/>
			<datalist id='streetTypeList'>
				{
					(
						props.tracksList.map((item, index) => {
							return props.streetType === '' ? (
								<option key={index} value={item.split('|')[0]} />
							) : item.toLowerCase().includes(props.streetType.toLowerCase()) ? (
								<option key={index} value={item.split('|')[0]} />
							) : <></>
						}
						)
					)
				}
			</datalist>
		</Grid>
	)
}