import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'

import useStyles from '../../SearchCups.styles'
import { thunkGetListMunicipalities, thunkGetListProvinces, thunkGetListZipCodes, thunkGetMasterData } from '../../../../../actions/GestionAveriasThunkActions'
import { useDispatch } from 'react-redux'

import { useTranslation } from 'react-i18next'

interface ProvinceInterface {
	streetName: string,
	setStreetName: Dispatch<SetStateAction<string>>
}

export default function StreetNameAdvane(props: ProvinceInterface) {
	const styles = useStyles({})
	const { t } = useTranslation()

	const {
		streetName,
		setStreetName
	} = props

	useEffect(() => {
		const delayedFunction = setTimeout(() => {
			props.setStreetName(streetName)
		}, 300)

		console.log(streetName);
		

		return () => clearTimeout(delayedFunction)
	}, [streetName])

	return (
		<Grid item xs={12} sm={6} style={{textAlign: 'left'}}>
			<span className={styles.inputTitle}>{t('averias.management.searchCups.address.streetName')}:</span>
			<input
				list='streetNames'
				className={styles.inputV4}
				value={streetName}
				id='input'
				onChange={(e) => {
					setStreetName(e.target.value)
				}}
			/>
		</Grid>
	)
}