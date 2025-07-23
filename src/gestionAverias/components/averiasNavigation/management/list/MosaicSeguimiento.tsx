import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { withRouter } from 'react-router'

import Grid from '@material-ui/core/Grid'




import Spinner from '../../../../../common/components/spinner/Spinner'

import useStyles, { StyledTableCell } from './List.styles'
import Pagination from '../../../../../common/components/pagination/Pagination2'
import AveriasUtils from '../../../../utils/AveriasUtilsClass'

const MosaicSeguimiento = (props: any) => {
	const {
		listItems,
		setFinalList,
		currentPage,
		setCurrentPage,
		itemsPerPage,
		setItemsPerPage,
		totalPages,
		isSubLoading
	} = props

	const { t } = useTranslation()

	const classes = useStyles({})

	const target = document.getElementById('number') as HTMLSelectElement


	const [isLoadingList, setIsLoadingList] = useState(false)

	

	const getStatus = (status: string) => {
		switch (status.trim()) {
			case 'PR':
				return ('ABIERTA')
			case 'PT':
				return ('ABIERTA')
			case 'EB':
				return ('EN CURSO')
			case 'CL':
				return ('EN CURSO')
			case 'ER':
				return ('EN CURSO')
			case 'SR':
				return ('RESUELTA')
			case 'RS':
				return ('RESUELTA')
			case 'EMCI':
				return ('EN CURSO')
			case 'EMSI':
				return ('EN CURSO')
			case 'EM':
				return ('RESUELTA')
		}
	}
	

	const [totalPagesFilter, setTotalPagesFilter] = useState(0)

	useEffect(() => {
		setTotalPagesFilter(listItems.length === 0 ? 1 : Math.ceil(listItems.length / itemsPerPage))
		// eslint-disable-next-line
	}, [listItems, itemsPerPage])

	return (
		<>
			{
				isLoadingList &&
				<Spinner fixed={true} />
			}

             {   listItems.map((incidence,index) => {
                    return (<>
                        <Grid key={index} container spacing={2} style={{marginTop:'10px',marginBottom:'10px'}}>
                         <Grid item lg={4}  md={6} sm={6} xs={12}>
                          <Grid className={`${classes.item}`}>

                        <Grid style={{ textAlign: 'center',alignContent:'center' }}  className={classes.rowMosaic}>
                        <div className={classes.title}>{t('averias.management.consult.status')}</div>
                        <div className={`${classes.value}`}>{incidence.estado + ' - ' + getStatus(incidence.estado)}</div>
                         </Grid>

                         <Grid style={{ textAlign: 'center',alignContent:'center' }}  className={classes.rowMosaic}>
                        <div className={classes.title}>{t('averias.management.consult.date')}</div>
                        <div className={`${classes.value}`}>{AveriasUtils.FormatDateAveriasPantalla(incidence.fecha)}</div>
                         </Grid>

                         <Grid style={{ textAlign: 'center',alignContent:'center' }}  className={classes.rowMosaic}>
                        <div className={classes.title}>{t('averias.management.consult.observations')}</div>
                        <div className={`${classes.value}`}>{incidence.obs}</div>
                         </Grid>

                         
                         </Grid>
                         </Grid>
                         </Grid>
                        </>)
                })     }   

			
		</>
	)
}

export default withRouter(MosaicSeguimiento)
