import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'

import useStyles from '../../SearchCups.styles'
import { thunkGetListMunicipalities, thunkGetListProvinces, thunkGetListZipCodes, thunkGetMasterData } from '../../../../../actions/GestionAveriasThunkActions'
import { useDispatch } from 'react-redux'

import { useTranslation } from 'react-i18next'
import { iStreetName } from '../../hooks/useStreetNames'
import { CustomSelect } from '../Select/CustomSelect'

interface streetNameProps {
	handleChangeInput: Function
	candidatesList: iStreetName[]
	onSelect?: (selectedStreet: iStreetName)=>void
	value: {value: iStreetName, label: string}
	isClearable?: boolean
	onClear?: () => void
	error?: boolean
	loading?: boolean
	disabled?: boolean
	onClick?: ()=>void
}
export default function StreetName(props: streetNameProps) {
	const styles = useStyles({})
	const { t } = useTranslation()

	const options = props.candidatesList.map(item => {
		const baseName = `${item.streetType} ${item.streetName} (${item.municipalityName})`;
		let name = item.groupEntityName && item.groupEntityName !== '' ? `${baseName} [${item.groupEntityName}]` : baseName;
		name = item.singularEntityName && item.singularEntityName !== '' ? `${name} {${item.singularEntityName}}` : name;
		name = item.populationCenter && item.populationCenter !== '' ? `${name} || ${item.populationCenter}` : name;
		return ({value: item, label: name})
	})

	return (
		<Grid item md={4} xs={12} sm={4}>
			<span className={styles.inputTitle}>{t('averias.management.searchCups.address.streetName') + t('common.punctuation.colon')}</span>
			<CustomSelect 
				options={options} 
				onInputChange={(street) => props.handleChangeInput('streetName', street)} 
				onSelect={(name) => props.onSelect(name.value)}
				value={props.value}
				isClearable={props.isClearable}
				onClear={props.onClear}
				error={props.error}
				loading={props.loading}
				disabled={props.disabled}
			/>
		</Grid>
	)
}