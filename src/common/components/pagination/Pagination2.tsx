import React from 'react'

import Grid from '@material-ui/core/Grid'

import LeftArrowIcon from '../../../assets/icons/flecha_izquierda.svg'
import RightArrowIcon from '../../../assets/icons/flecha_derecha.svg'

import useStyles from './Pagination.styles'

const Pagination2 = (props: any) => {
	const classes = useStyles({})

	const {
		totalPages,
		currentPage,
		handleChangePage
	} = props

	let auxPage = []
	let start = 0
	let end = 5

	//rellenamos la variable con los valores del paginado
	for (let i = 1; i <= totalPages; i++) {
		auxPage.push(i)
	}

	//con esto marcamos las 5 páginas que hay que mostrar, si hay más de 5
	if ((currentPage + 1) > end) {
		while ((currentPage + 1) > end) {
			start += 5
			end += 5
		}
	}

	return (
		<>
			{
				totalPages > 1 &&
				<Grid container className={classes.pagination}>
					<Grid item>
						<Grid container justifyContent='center'>
							<img
								className={classes.icon2}
								src={LeftArrowIcon}
								alt=''
								onClick={() => {
									if ((currentPage + 1) > 1) {
										handleChangePage(currentPage - 1)
									}
								}}
							/>

							{
								totalPages > 5 ?
									auxPage.slice(start, end).map((value) => (
										<span key={value.key} className={`${classes.label2} ${value === currentPage + 1 && 'checked'}`}>{value}</span>
									))
									:
									auxPage.map((value) => (
										<span key={value.key} className={`${classes.label2} ${value === currentPage + 1 && 'checked'}`}>{value}</span>
									))
							}

							<img
								className={classes.icon2}
								src={RightArrowIcon}
								alt=''
								onClick={() => {
									if ((currentPage + 1) < totalPages) {
										handleChangePage(currentPage + 1)
									}
								}}
							/>
						</Grid>
					</Grid>
				</Grid>
			}
		</>
	)
}

export default Pagination2
