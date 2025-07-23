import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'

import useStyles from '../../SearchCups.styles'

import { useTranslation } from 'react-i18next'

interface BusquedaAvanzadaProps {
    onClick: Function
}

export default function BusquedaAvanzada(prop) {
	const styles = useStyles({})
	const { t } = useTranslation()

	return (
		<Grid item xs={12} sm={4} className={`${styles.BusquedaAvanzada} ${styles.link}`}>
			<span onClick={prop.onClick}>{t('averias.management.searchCups.BusquedaAvanzada')} {'>'}</span>
		</Grid>
	)
}