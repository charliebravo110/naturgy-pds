import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'

import useStyles from '../../SearchCups.styles'
import { useDispatch } from 'react-redux'

import { useTranslation } from 'react-i18next'
import { iCollectiveEntity } from '../../hooks/useGroupEntities'
import { CustomSelect } from '../Select/CustomSelect'
import { iIndividualEntity } from '../../hooks/useIndividualEntities'

interface ColEntityInterface {
	handleChangeInput: Function
	colectiveEntityList: iCollectiveEntity[]
	isDisabled: boolean
	onSelect?: (entity: iCollectiveEntity) => void
	value?: { value: iCollectiveEntity, label: string }
	isClearable?: boolean
	loading?: boolean
	onClear?: () => void
	error?: boolean,
	onClick?: ()=>void
	disabled?: boolean
	noData: boolean

}

export default function ColEntity(props: ColEntityInterface) {
	const styles = useStyles({})
	const { t } = useTranslation()
	return (
		<Grid item xs={12} sm={4}>
			<span className={styles.inputTitle}>[{t('averias.management.searchCups.address.colectiveEntity')}]:</span>

			<CustomSelect
				options={props.colectiveEntityList.map(entity => ({ value: entity, label: entity.entityName }))}
				onInputChange={(search) => { props.handleChangeInput('colectiveEntity', search) }}
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