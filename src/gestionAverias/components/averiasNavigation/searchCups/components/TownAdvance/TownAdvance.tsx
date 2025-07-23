import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'

import useStyles from '../../SearchCups.styles'
import { thunkGetListMunicipalities, thunkGetListProvinces, thunkGetListZipCodes, thunkGetMasterData, thunkListIndividualEntity } from '../../../../../actions/GestionAveriasThunkActions'
import { useDispatch } from 'react-redux'

import { useTranslation } from 'react-i18next'

interface ProvinceInterface {
	townName:string
	setTownName: Dispatch<SetStateAction<string>>
	// errorTowns : boolean;
	// getTowns : any;
	// setParametersTowns : any;
	// resetRetriesTowns : any;
	// loadingTowns : boolean;
	// towns : Array<any>;	
	// setProvinceCodeTowns : any;
	// setInformedTownsExternal : any;
	// setTownNameExternal : any;
	// clearTowns : any;
}

export default function TownAdvance(props: ProvinceInterface) {
	const styles = useStyles({})
	const { t } = useTranslation()
	const dispatch = useDispatch()

	const {
		townName,
		setTownName
	} = props

	useEffect(() => {
		const auxFunction = setTimeout(() => {
			props.setTownName(townName)
		}, 300)		

		return () => clearTimeout(auxFunction)
	}, [townName])


	return (
		<Grid item xs={12} sm={6} style={{textAlign: 'right', display: 'flex', flexDirection: 'column', alignContent: 'flex-end', alignItems: 'flex-end'}}>
			<span className={styles.inputTitle} style={{width: '94%', display: 'flex', justifyContent: 'flex-start'}}>{t('averias.management.searchCups.address.population')}</span>
			<input
				className={styles.inputV4}
				value={townName}
				onChange={(e) => setTownName(e.target.value)}
			/>
		</Grid>
	)
}