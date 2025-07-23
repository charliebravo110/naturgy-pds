import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'

import useStyles from '../../SearchCups.styles'
import { useDispatch } from 'react-redux'

import { useTranslation } from 'react-i18next'
import { thunkGetListAddresses, thunkGetListProvinces, thunkGetMasterData } from '../../../../../actions/GestionAveriasThunkActions'
import { log, time } from 'console'
import TimeoutTextField from '../TimeoutTextField/TimeoutTextField'
import { CustomSelect } from '../Select/CustomSelect'
import { iProvince } from '../../hooks/useProvinces'

interface ProvinceInterface {
	handleChangeInput: Function
	loadingStatesList: boolean
	statesList: iProvince[]
	onSelect?: (province: iProvince) => void,
	value?: {value: iProvince, label: string}
	cooldown: number
	isClearable?: boolean
	onClear?: ()=>void
	error?: boolean
	onClick?: ()=>void
	disabled?: boolean
}

export default function Province(props: ProvinceInterface) {
	const styles = useStyles({})
	const { t } = useTranslation()

	return (
		<Grid item xs={12} sm={4}>
			<span className={styles.inputTitle}>{t('averias.management.searchCups.address.state') + t('common.punctuation.colon')}</span>
			<CustomSelect 
				options={props.statesList.map(state => ({ value: state, label: state.provinceName }))}
				onInputChange={(val) => {
					props.handleChangeInput('province', val.label)
				}}
				onSelect={val => props.onSelect(val.value)}
				value={props.value}
				isClearable={props.isClearable}
				loading={props.loadingStatesList}
				onClear={props.onClear}
				error={props.error}
				onClick={props.onClick}
				disabled={props.disabled}
			/>
		</Grid>
	)
}