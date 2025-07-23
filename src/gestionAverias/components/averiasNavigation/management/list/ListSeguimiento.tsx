import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { withRouter } from 'react-router'

import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'

import LoadingAnimation from '../../../../../assets/img/spinner.gif'

import Spinner from '../../../../../common/components/spinner/Spinner'

import useStyles, { StyledTableCell } from './List.styles'
import Pagination from '../../../../../common/components/pagination/Pagination2'
import AveriasUtils from '../../../../utils/AveriasUtilsClass'

const ListSeguimiento = (props: any) => {
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

	//usamos estas constantes para controlar la ordenación en columnas
	const [orderByTypeAsc, setOrderByTypeAsc] = useState(false)
	const [orderByNameAsc, setOrderByNameAsc] = useState(false)
	const [orderByStatusAsc, setOrderByStatusAsc] = useState(false)
	const [showTypeArrow, setShowTypeArrow] = useState(false)
	const [showNameArrow, setShowNameArrow] = useState(false)
	const [showAlcanceArrow, setShowAlcanceArrow] = useState(false)
	const [directionNumber, setDirectionNumber] = useState('desc')

	const [isLoadingList, setIsLoadingList] = useState(false)

	//ordenamos a partir de la columna de la provincia
	const orderByName = () => {
		setShowNameArrow(true)
		setShowTypeArrow(false)
		setShowAlcanceArrow(false)
		setDirectionNumber('desc')
		if (orderByNameAsc) {
			setFinalList([].concat(listItems).sort().reverse())
			setOrderByNameAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(listItems).sort((a, b) => a.provinceDesc.localeCompare(b.provinceDesc)))
			setOrderByNameAsc(true)
			setDirectionNumber('desc')
		}
	}

	//ordenamos a partir de la columna tipo
	const orderByType = () => {
		setShowNameArrow(false)
		setShowTypeArrow(true)
		setShowAlcanceArrow(false)
		setDirectionNumber('desc')
		if (orderByTypeAsc) {
			setFinalList([].concat(listItems).sort().reverse())
			setOrderByTypeAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(listItems).sort((a, b) => a.tipoAviso.localeCompare(b.tipoAviso)))
			setOrderByTypeAsc(true)
			setDirectionNumber('desc')
		}
	}

	//ordenamos a partir de la columna status
	const orderByAlcance = () => {
		setShowNameArrow(false)
		setShowTypeArrow(false)
		setShowAlcanceArrow(true)
		setDirectionNumber('desc')
		if (orderByStatusAsc) {
			setFinalList([].concat(listItems).sort().reverse())
			setOrderByStatusAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(listItems).sort((a, b) => a.alcance.localeCompare(b.alcance)))
			setOrderByStatusAsc(true)
			setDirectionNumber('desc')
		}
	}

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

	const onChangeSelector = () => {
		setCurrentPage(0)
		setItemsPerPage(Number(target.options[target.selectedIndex].value))
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
			{
				listItems.length > 20 && totalPages > 1 && (currentPage + 1) === totalPages ?
					<Grid container className={classes.totalItems}>
						{listItems.slice((currentPage * itemsPerPage), ((currentPage * itemsPerPage) + itemsPerPage)).length + t('averias.management.consult.estadosDe') + listItems.length}
						{
							isSubLoading &&
							<img className={classes.loadingAnimation} src={LoadingAnimation} alt='' />
						}
					</Grid>
					:
					listItems.length > 20 && totalPages > 1 ?
						<Grid container className={classes.totalItems}>
							{listItems.slice((currentPage * itemsPerPage), ((currentPage * itemsPerPage) + itemsPerPage)).length + t('averias.management.consult.estadosDe') + listItems.length}
							{
								isSubLoading &&
								<img className={classes.loadingAnimation} src={LoadingAnimation} alt='' />
							}
						</Grid>
						:
						<Grid container className={classes.totalItems}>
							{listItems.length + (listItems.length > 1 ? t('averias.management.consult.estados') : t('averias.management.consult.estado'))}
							{
								isSubLoading &&
								<img className={classes.loadingAnimation} src={LoadingAnimation} alt='' />
							}
						</Grid>
			}
			<Table className={classes.suppliesTable}>
				<TableHead>
					<TableRow className={classes.tableRow}>
						<StyledTableCell className={classes.headTableCell} rowSpan={1}>{t('averias.management.consult.status')}
							<TableSortLabel
								active={showNameArrow}
								direction={directionNumber === 'asc' ? 'asc' : 'desc'}
								onClick={orderByName}
							/>
						</StyledTableCell>

						<StyledTableCell className={classes.headTableCell} rowSpan={1}>{t('averias.management.consult.date')}
							<TableSortLabel
								active={showTypeArrow}
								direction={directionNumber === 'asc' ? 'asc' : 'desc'}
								onClick={orderByType}
							/>
						</StyledTableCell>

						<StyledTableCell className={classes.headTableCell} rowSpan={1}>{t('averias.management.consult.observations')}
							<TableSortLabel
								active={showAlcanceArrow}
								direction={directionNumber === 'asc' ? 'asc' : 'desc'}
								onClick={orderByAlcance}
							/>
						</StyledTableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{
						listItems.length === 0 ?
							<TableRow className={classes.tableBodyRow} >
								<StyledTableCell className={classes.noResults} colSpan={12}>
									{t('delegates.delegatesList.noResults')}
								</StyledTableCell>
							</TableRow>
							:
							listItems.slice(
								(currentPage * itemsPerPage),
								((currentPage * itemsPerPage) + itemsPerPage)
							).map(
								(incidence, index) => (
									<>
										<TableRow key={index} className={classes.tableBodyRow}>
											<StyledTableCell>{incidence.estado ? incidence.estado + ' - ' + getStatus(incidence.estado) : ''}</StyledTableCell>
											<StyledTableCell>{AveriasUtils.FormatDateAveriasPantalla(incidence.fecha)}</StyledTableCell>
											<StyledTableCell>{incidence.obs}</StyledTableCell>
										</TableRow>
									</>
								)
							)
					}
				</TableBody>
			</Table>

			{
				listItems.length > 20 &&
				<Grid container className={classes.itemsPerPage}>
					<span style={{ marginRight: 5 }}>{t('common.pagination.show')}</span>
					<select id='number' name='number' onChange={onChangeSelector} className={classes.select}>
						<option value='20' selected>20</option>
						<option value='50'>50</option>
						<option value='100'>100</option>
					</select>
					<span style={{ marginLeft: 5 }}>{t('common.pagination.forPage')}</span>
				</Grid>
			}

			{
				totalPagesFilter > 1 &&
				<Grid container className={classes.paginationContainer}>
					<Pagination
						totalPages={totalPagesFilter}
						currentPage={currentPage}
						handleChangePage={setCurrentPage}
					/>
				</Grid>
			}
		</>
	)
}

export default withRouter(ListSeguimiento)
