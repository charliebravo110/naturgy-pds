import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { withRouter } from 'react-router'

import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'

import AlertIcon from '../../../../../assets/icons/aviso_alerta_pop_up.svg'
import ConsumptionIcon from '../../../../../assets/icons/ico_listado_consumo.svg'
import GenerationIcon from '../../../../../assets/icons/ico_listado_generacion.svg'

import { isPrevious2017 } from '../../../../../common/lib/ValidationLib'
import Tooltip from '../../../../../common/components/tooltip/Tooltip'
import Spinner from '../../../../../common/components/spinner/Spinner'

import useStyles, { StyledTableCell } from './List.styles'
import Pagination from '../../../../../common/components/pagination/Pagination2'

const ListSupplies = (props: any) => {
	const {
		listItems,
		setFinalList,
		currentPage,
		setCurrentPage,
		itemsPerPage,
		setItemsPerPage,
		setSupply
	} = props

	const { t } = useTranslation()

	const classes = useStyles({})

	const target = document.getElementById('number') as HTMLSelectElement

	//usamos estas constantes para controlar la ordenación en columnas
	const [orderByNameAsc, setOrderByNameAsc] = useState(false)
	const [orderByNifAsc, setOrderByNifAsc] = useState(false)
	const [orderByDirectionAsc, setOrderByDirectionAsc] = useState(false)
	const [orderByCupsAsc, setOrderByCupsAsc] = useState(false)
	const [orderBySupplyAsc, setOrderBySupplyAsc] = useState(false)
	const [showNameArrow, setShowNameArrow] = useState(false)
	const [showNifArrow, setShowNifArrow] = useState(false)
	const [showDirectionArrow, setShowDirectionArrow] = useState(false)
	const [showSupplyArrow, setShowSupplyArrow] = useState(false)
	const [showCupsArrow, setShowCupsArrow] = useState(false)
	const [directionNumber, setDirectionNumber] = useState('desc')

	const [isLoadingList, setIsLoadingList] = useState(false)

	//ordenamos a partir de la columna del NIF
	const orderByNif = () => {
		setDirectionNumber('desc')
		setShowNifArrow(true)
		setShowNameArrow(false)
		setShowCupsArrow(false)
		setShowDirectionArrow(false)
		setShowSupplyArrow(false)
		if (orderByNifAsc) {
			setFinalList([].concat(listItems).sort().reverse())
			setOrderByNifAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(listItems).sort((a, b) => a.holderDocumentNumber.localeCompare(b.holderDocumentNumber)))
			setOrderByNifAsc(true)
			setDirectionNumber('desc')
		}
	}

	//ordenamos a partir de la columna nombre
	const orderByName = () => {
		setDirectionNumber('desc')
		setShowNifArrow(false)
		setShowNameArrow(true)
		setShowCupsArrow(false)
		setShowDirectionArrow(false)
		setShowSupplyArrow(false)
		if (orderByNameAsc) {
			setFinalList([].concat(listItems).sort().reverse())
			setOrderByNameAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(listItems).sort((a, b) => a.holderName.localeCompare(b.holderName)))
			setOrderByNameAsc(true)
			setDirectionNumber('desc')
		}
	}

	//ordenamos a partir de la columna CUPS
	const orderByCups = () => {
		setDirectionNumber('desc')
		setShowNifArrow(false)
		setShowNameArrow(false)
		setShowCupsArrow(true)
		setShowDirectionArrow(false)
		setShowSupplyArrow(false)
		if (orderByCupsAsc) {
			setFinalList([].concat(listItems).sort().reverse())
			setOrderByCupsAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(listItems).sort((a, b) => a.cups.localeCompare(b.cups)))
			setOrderByCupsAsc(true)
			setDirectionNumber('desc')
		}
	}
	//ordenamos a partir de la columna dirección
	const orderByDirection = () => {
		setDirectionNumber('desc')
		setShowNifArrow(false)
		setShowNameArrow(false)
		setShowCupsArrow(false)
		setShowDirectionArrow(true)
		setShowSupplyArrow(false)
		if (orderByDirectionAsc) {
			setFinalList([].concat(listItems).sort().reverse())
			setOrderByDirectionAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(listItems).sort((a, b) => a.address.street.localeCompare(b.address.street)))
			setOrderByDirectionAsc(true)
			setDirectionNumber('desc')
		}
	}
	//ordenamos a partir de la columna suministro
	const orderBySupply = () => {
		setDirectionNumber('desc')
		setShowNifArrow(false)
		setShowNameArrow(false)
		setShowCupsArrow(false)
		setShowDirectionArrow(false)
		setShowSupplyArrow(true)
		if (orderBySupplyAsc) {
			setFinalList([].concat(listItems).sort().reverse())
			setOrderBySupplyAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(listItems).sort((a, b) => a.isGenerator.localeCompare(b.isGenerator)))
			setOrderBySupplyAsc(true)
			setDirectionNumber('desc')
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

	const handleClick = (supplie: any) => {
		setSupply(supplie)
	}

	
	return (
		<>
			{
				isLoadingList &&
				<Spinner fixed={true} />
			}
			<Table className={classes.suppliesTable}>
				<TableHead>
					<TableRow className={classes.tableRow}>
						<StyledTableCell className={classes.headTableCell}>{t('averias.management.searchCups.table.nif')}
							<TableSortLabel
								active={showNifArrow}
								direction={directionNumber === 'asc' ? 'asc' : 'desc'}
								onClick={orderByNif}
							/>
						</StyledTableCell>

						<StyledTableCell className={classes.headTableCell}>{t('averias.management.searchCups.table.name')}
							<TableSortLabel
								active={showNameArrow}
								direction={directionNumber === 'asc' ? 'asc' : 'desc'}
								onClick={orderByName}
							/>
						</StyledTableCell>

						<StyledTableCell className={classes.headTableCell}>{t('averias.management.searchCups.table.cups')}
							<TableSortLabel
								active={showCupsArrow}
								direction={directionNumber === 'asc' ? 'asc' : 'desc'}
								onClick={orderByCups}
							/>
						</StyledTableCell>

						<StyledTableCell className={classes.headTableCell}>{t('averias.management.searchCups.table.address')}
							<TableSortLabel
								active={showDirectionArrow}
								direction={directionNumber === 'asc' ? 'asc' : 'desc'}
								onClick={orderByDirection}
							/>
						</StyledTableCell>

						<StyledTableCell className={classes.headTableCell} style={{width: '11%'}}>{t('averias.management.searchCups.table.suministro')}
							<TableSortLabel
								active={showSupplyArrow}
								direction={directionNumber === 'asc' ? 'asc' : 'desc'}
								onClick={orderBySupply}
							/>
						</StyledTableCell>
						{/* NUEVA COLUMNA VACIA */}
						<StyledTableCell className={classes.headTableCell} />
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
								(supply, index) => (
									<>
										<TableRow key={index} className={classes.tableBodyRow}>
											<StyledTableCell>{supply.holderDocumentNumber}</StyledTableCell>
											<StyledTableCell>{supply.holderName}</StyledTableCell>
											<StyledTableCell>{supply.cups}</StyledTableCell>
											<StyledTableCell>
												<span>
													{
														(supply.address.street ? supply.address.street : '') + ' ' +
														(supply.address.number ? supply.address.number : '') + ' ' +
														(supply.address.stair ? t('averias.management.searchCups.table.escalera') + supply.address.stair : '') + ' ' +
														(supply.address.floor ? t('averias.management.searchCups.table.piso') + supply.address.floor : '') + ' ' +
														(supply.address.door ? t('averias.management.searchCups.table.puerta') + supply.address.door : '') + ' ' +
														(supply.address.zipCode ? supply.address.zipCode : '') + ' ' +
														(supply.address.town ? supply.address.town : '') + ', ' +
														(supply.address.province ? supply.address.province : '')
													}
												</span>
											</StyledTableCell>
											<StyledTableCell style={{ textAlign: 'center' }}>
												{(supply.isGenerator === '1') ?
													<Tooltip title={t('averias.management.consult.generacion')} placement={'top'}><img src={GenerationIcon} alt='' /></Tooltip>
													:
													<Tooltip title={t('averias.management.consult.consumo')} placement={'top'}><img src={ConsumptionIcon} alt='' /></Tooltip>
												}
											</StyledTableCell>
											<StyledTableCell rowSpan={1} className={classes.suppliesTableButtonCell}>
												{
													<div
														className={classes.editButton}
														onClick={() => handleClick(supply)}
													>
														<p>{t('averias.management.searchCups.table.select')}</p>
													</div>
												}
											</StyledTableCell>

										</TableRow>

										{
											supply.actionDoc === '1' &&
											<TableRow className={`${classes.tableBodyRow} ${supply.actionDoc === '1' && classes.actionRow} ${isPrevious2017(supply.registerDate) && 'disabled'}`}>
												<StyledTableCell colSpan={2}>
													<Grid container className={classes.actionBox}>
														<Grid item>
															<img className={classes.alertIcon} src={AlertIcon} alt='' />
														</Grid>

														<Grid item className={classes.alertLabel}>{t('provisions.provisionsList.pendingAction')}</Grid>
													</Grid>
												</StyledTableCell>
											</TableRow>
										}
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

export default withRouter(ListSupplies)
