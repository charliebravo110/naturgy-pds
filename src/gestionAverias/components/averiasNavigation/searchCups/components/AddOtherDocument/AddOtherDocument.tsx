import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'

import useStyles from '../../SearchCups.styles'
import { useDispatch } from 'react-redux'

import { useTranslation } from 'react-i18next'
import { thunkGetListAddresses, thunkGetListProvinces, thunkGetMasterData } from '../../../../../actions/GestionAveriasThunkActions'
import { log, time } from 'console'
import TimeoutTextField from '../TimeoutTextField/TimeoutTextField'
import { CustomSelect } from '../Select/CustomSelect'

interface iDocument {documentCode: string, documentName: string, value}

interface AddOtherDocumentInterface {
	handleChangeInput: Function
	loadingDocumentList: boolean
	documentList: iDocument[]
	onSelect?: (province: iDocument) => void,
	value?: {value: iDocument, label: string}
	isClearable?: boolean
	onClear?: ()=>void
	error?: boolean
	onClick?: ()=>void
	disabled?: boolean
}

export default function AddOtherDocument(props: AddOtherDocumentInterface) {
	const styles = useStyles({})
	const { t } = useTranslation()

	return (
		<Grid item xs={12} sm={12}>
			<CustomSelect
				options={props.documentList.map(document => ({ value: document.value, label: document.value.documentName }))}
				onInputChange={(val) => {
					props.handleChangeInput('document', val.label)
				}}
				onSelect={val => props.onSelect(val.value)}
				value={props.value}
				isClearable={props.isClearable}
				loading={props.loadingDocumentList}
				onClear={props.onClear}
				error={props.error}
				onClick={props.onClick}
				disabled={props.disabled}
			/>
		</Grid>
	)
}