import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'

import useStyles from '../../SearchCups.styles'
import { thunkGetListMunicipalities, thunkGetListProvinces, thunkGetListZipCodes, thunkGetMasterData } from '../../../../../actions/GestionAveriasThunkActions'
import { useDispatch } from 'react-redux'

import { useTranslation } from 'react-i18next'
import TimeoutTextField from '../TimeoutTextField/TimeoutTextField'
import { CustomSelect } from '../Select/CustomSelect'
import { iTown } from '../../hooks/useTowns'

interface TownInterface {
	handleChangeInput: Function
	loading: boolean
	townsList: iTown[]
	onSelect?: (town: iTown) => void
	cooldown: number
	value?: {value: iTown, label: string}
	isClearable?: boolean
	onClear?: ()=>void
	error?: boolean,
	onClick?: ()=>void
	disabled?: boolean
}

export default function Town(props: TownInterface) {
	const styles = useStyles({})
	const { t } = useTranslation()


	return (
		<Grid item xs={12} sm={4}>
			<span className={styles.inputTitle}>({t('averias.management.searchCups.address.town')}): </span>
			<CustomSelect
				options={props.townsList && props.townsList.map(town => ({ value: town, label: town.municipalityName }))}
				onInputChange={(val) => {
					props.handleChangeInput('town', val) }}
				onSelect={(val) => val && props.onSelect(val.value)} 
				value={props.value}
				loading={props.loading}
				isClearable={props.isClearable}
				onClear={props.onClear}
				error={props.error}
				onClick={props.onClick}
				disabled={props.disabled}
			/>
		</Grid>
	)
}