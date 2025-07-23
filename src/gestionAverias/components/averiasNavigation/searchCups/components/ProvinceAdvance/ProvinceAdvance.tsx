import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'

import useStyles from '../../SearchCups.styles'
import { useDispatch } from 'react-redux'

import { useTranslation } from 'react-i18next'
import { thunkGetListAddresses, thunkGetListProvinces } from '../../../../../actions/GestionAveriasThunkActions'
import { log } from 'console'
import { iProvince } from '../../hooks/useProvinces'

interface ProvinceInterface {
	stateName: string,
	setStateName: Dispatch<SetStateAction<string>>,
	statesList: iProvince[]
}

export default function ProvinceAdvance(props: ProvinceInterface) {
	const styles = useStyles({})
	const { t } = useTranslation()

	const {
		stateName,
		setStateName,
		statesList
	} = props


	// useEffect(() => {
	// 	const auxFunction = setTimeout(() => {
			
	// 		props.setStateName(stateName)
	// 		const okProvince = props.statesList.find(provinceFromList => provinceFromList.provinceName === stateName)
	// 		if(okProvince){
	// 			props.setProvince(stateName)
	// 		}
	// 	}, 300)
	// 	return () => clearTimeout(auxFunction)

	// }, [stateName])


	return (
		<Grid item xs={12} sm={6} style={{textAlign: 'right', display: 'flex', flexDirection: 'column', alignContent: 'flex-end', alignItems: 'flex-end'}}>
			<span className={styles.inputTitle} style={{width: '94%', display: 'flex', justifyContent: 'flex-start'}}>{t('averias.management.searchCups.address.state')}:</span>
			<input
				list='provinciasList'
				className={styles.inputV4}
				value={stateName}
				onChange={(e) => setStateName(e.target.value)}
			/>
			<datalist id='provinciasList'>
				{
					
					true ? (
						statesList.map((item, index) => {
							return props.stateName === '' ? (
								<option key={index} value={item.provinceName} />
							) : item.provinceName.toLowerCase().includes(props.stateName.toLowerCase()) ? (
								<option key={index} value={item.provinceName} />
							) : <></>
						}
						)
					) : <></>
				}
			</datalist>
		</Grid>
	)
}