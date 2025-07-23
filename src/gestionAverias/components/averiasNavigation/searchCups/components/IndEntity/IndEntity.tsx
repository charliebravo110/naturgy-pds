import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'

import useStyles from '../../SearchCups.styles'
import { useDispatch } from 'react-redux'

import { useTranslation } from 'react-i18next'
import { iIndividualEntity } from '../../hooks/useIndividualEntities'
import { CustomSelect } from '../Select/CustomSelect'

interface IndEntityInterface {
	handleChangeInput: Function
	individualEntityList: iIndividualEntity[]
	isDisabled: boolean
	onSelect?: (entity: iIndividualEntity) => void
	value?: { value: iIndividualEntity, label: string }
	isClearable?: boolean
	error?: boolean
	loading?: boolean
	onClear?: () => void
	onClick?: ()=>void
	disabled?: boolean
	noData: boolean
}

export default function IndEntity(props: IndEntityInterface) {
	const styles = useStyles({})
	const { t } = useTranslation()
	return (
		<Grid item xs={12} sm={4}>
			<span className={styles.inputTitle}>{`{${t('averias.management.searchCups.address.individualEntity')}}` + t('common.punctuation.colon')}</span>
			<CustomSelect 
				options={props.individualEntityList.map(entity => ({ value: entity, label: entity.entityName }))}
				onInputChange={(search) => { props.handleChangeInput('individualEntity', search) }}
				onSelect={(val) => props.onSelect(val.value)}
				value={props.value}
				isClearable={props.isClearable}
				loading={props.loading}
				onClear={props.onClear}
				error={props.error}
				onClick={props.onClick}
				disabled={props.disabled}
				noData={props.noData}
			/>

		</Grid>
	)
}