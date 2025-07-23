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

import { isPrevious2017, validateCIF } from '../../../../../common/lib/ValidationLib'
import Tooltip from '../../../../../common/components/tooltip/Tooltip'
import Spinner from '../../../../../common/components/spinner/Spinner'

import useStyles, { StyledTableCell } from './List.styles'
import Pagination from '../../../../../common/components/pagination/Pagination2'

const ListName = (props: any) => {
	const {
		currentPage,
		setCurrentPage,
		itemsPerPage,
		setItemsPerPage,
		setname,
		setSurname1,
		setSurname2,
		setNameSelected,
		name,
		setDocumentNumber,
		setSocialReason
	} = props

	const { t } = useTranslation()

	const classes = useStyles({})

	const [orderByNameAsc, setOrderByNameAsc] = useState(false)
	const [orderByNifAsc, setOrderByNifAsc] = useState(false)
	const [orderByDirectionAsc, setOrderByDirectionAsc] = useState(false)
	const [orderBySurname1Asc, setorderBySurname1Asc] = useState(false)
	const [orderBySupplyAsc, setOrderBySupplyAsc] = useState(false)
	const [showNameArrow, setShowNameArrow] = useState(false)
	const [showNifArrow, setShowNifArrow] = useState(false)
	const [showDirectionArrow, setShowDirectionArrow] = useState(false)
	const [showSupplyArrow, setShowSupplyArrow] = useState(false)
	const [showCupsArrow, setShowCupsArrow] = useState(false)
	const [directionNumber, setDirectionNumber] = useState('desc')
	const [finalList, setFinalList] = useState(name.items)
	const [clickedRow, setClickedRow] = useState(null)

	useEffect(()=>{
		setFinalList(name.items)
	}, [name])


	const orderByNif = () => {

		// surname 2
		setShowSupplyArrow(false)

		// surname 1
		setShowDirectionArrow(false)

		// Titular
		setShowCupsArrow(false)

		// NIF/CIF
		setShowNameArrow(true)

		if (orderByNifAsc) {
			setFinalList([].concat())
			setFinalList([].concat(finalList).sort().reverse())
			setOrderByNifAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(finalList).sort((a, b) => a.docNumber.localeCompare(b.docNumber)))
			setOrderByNifAsc(true)
			setDirectionNumber('desc')
		}
	}

	const orderByName = () => {

		// surname 2
		setShowSupplyArrow(true)

		// surname 1
		setShowDirectionArrow(false)

		// Titular
		setShowCupsArrow(true)

		// NIF/CIF
		setShowNameArrow(false)

		if (orderByNameAsc) {
			setFinalList([].concat(finalList).sort().reverse())
			setOrderByNameAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(finalList).sort((a, b) => a.customerName.localeCompare(b.customerName)))
			setOrderByNameAsc(true)
			setDirectionNumber('desc')
		}
	}

	const orderBySurname1 = () => {

		// surname 2
		setShowSupplyArrow(false)

		// surname 1
		setShowDirectionArrow(true)

		// Titular
		setShowCupsArrow(false)

		// NIF/CIF
		setShowNameArrow(false)

		if (orderBySurname1Asc) {
			setFinalList([].concat(finalList).sort().reverse())
			setorderBySurname1Asc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(finalList).sort((a, b) => a.surname1.localeCompare(b.surname1)))
			setorderBySurname1Asc(true)
			setDirectionNumber('desc')
		}
	}

	const orderBySurname2 = () => {

		// surname 2
		setShowSupplyArrow(true)

		// surname 1
		setShowDirectionArrow(false)

		// Titular
		setShowCupsArrow(false)

		// NIF/CIF
		setShowNameArrow(false)
		
		if (orderBySupplyAsc) {
			setFinalList([].concat(finalList).sort().reverse())
			setOrderBySupplyAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(finalList).sort((a, b) => a?.surname2?.localeCompare(b?.surname2)))
			setOrderBySupplyAsc(true)
			setDirectionNumber('desc')
		}
	}
	const [totalPagesFilter, setTotalPagesFilter] = useState(0)

	useEffect(() => {
		setTotalPagesFilter(finalList.length === 0 ? 1 : Math.ceil(finalList.length / itemsPerPage))
		// eslint-disable-next-line
	}, [finalList, itemsPerPage])

	const handleClick = (name, surname1, surname2, nameSelected, dni, index) => {
		if (validateCIF(dni)) {
			setSocialReason(name)
			setname('')
			setSurname1('')
			setSurname2('')
		} else {
			if (name !== '.') {
				setname(name);
				setSurname1(surname1);
				setSurname2(surname2);
				setSocialReason('')
			} else {
				setSocialReason(surname1)
				setname('');
				setSurname1('');
				setSurname2('');
			}
		}
		setNameSelected(nameSelected);
		setDocumentNumber(dni);
		props.setFindByName(props.findByName + 1);
		setClickedRow(index)
	}

	useEffect(()=>{
		if (name.items.length === 1) {
			if (validateCIF(name.items[0].docNumber) || name.items[0].docType == '02' || name.items[0].customerName === '.') {
				setSocialReason(name.items[0].customerName ? name.items[0].customerName : '')
				setname('')
				setSurname1('')
				setSurname2('')
			} else {
				setname(name.items[0].customerName ? name.items[0].customerName : '');
				setSurname1(name.items[0].surname1 ? name.items[0].surname1 : '');
				setSurname2(name.items[0].surname2 ? name.items[0].surname2 : '');
				setSocialReason('')
			}
			// handleClick(name.items[0].docNumber, name.items[0].customerName, name.items[0].surname1 ? name.items[0].surname1 : '', name.items[0].surname2 ? name.items[0].surname2 : '', `${name.items[0].customerName} ${name.items[0].surname1 ? name.items[0].surname1 : ''} ${name.items[0].surname2 ? name.items[0].surname2 : ''}`, name.items[0].docNumber)
		}
	}, [name])

	return (
		name.items && (
			<>
				<Table className={classes.suppliesTable}>
					<TableHead>
						<TableRow className={classes.tableRow}>
							<StyledTableCell className={classes.headTableCell}>{t('averias.management.searchCups.table.nif')}
								<TableSortLabel
									active={showNameArrow}
									direction={directionNumber === 'asc' ? 'asc' : 'desc'}
									onClick={orderByNif}
								/>
							</StyledTableCell>
							<StyledTableCell className={classes.headTableCell}>{t('averias.management.searchCups.table.nameOrReason')}
								<TableSortLabel
									active={showCupsArrow}
									direction={directionNumber === 'asc' ? 'asc' : 'desc'}
									onClick={orderByName}
								/>
							</StyledTableCell>
							<StyledTableCell className={classes.headTableCell}>{t('averias.management.searchCups.table.surname_1')}
								<TableSortLabel
									active={showDirectionArrow}
									direction={directionNumber === 'asc' ? 'asc' : 'desc'}
									onClick={orderBySurname1}
								/>
							</StyledTableCell>
							<StyledTableCell className={classes.headTableCell}>{t('averias.management.searchCups.table.surname_2')}
								<TableSortLabel
									active={showSupplyArrow}
									direction={directionNumber === 'asc' ? 'asc' : 'desc'}
									onClick={orderBySurname2}
								/>
							</StyledTableCell>
							<StyledTableCell className={classes.headTableCell} />
						</TableRow>
					</TableHead>

					<TableBody>
						{
							finalList.length === 0 ?
								<TableRow className={classes.tableBodyRow} >
									<StyledTableCell className={classes.noResults} colSpan={12}>
										{t('delegates.delegatesList.noResults')}
									</StyledTableCell>
								</TableRow>
								:
								finalList.slice(
									(currentPage * itemsPerPage),
									((currentPage * itemsPerPage) + itemsPerPage)
								).map(
									(supply, index) => { const originalIndex = (currentPage * itemsPerPage) + index;
										return (
											<>
												<TableRow className={clickedRow === originalIndex ? classes.tableBodyRowColored : classes.tableBodyRow}>
													<StyledTableCell>{supply.docNumber}</StyledTableCell>
													<StyledTableCell>{(supply.customerName !== '.') ? supply.customerName : supply.surname1}</StyledTableCell>
													<StyledTableCell>{supply.surname1 ? (supply.customerName === '.' ? '' : supply.surname1) : ''}</StyledTableCell>
													<StyledTableCell>{supply.surname2 ? supply.surname2 : ''}</StyledTableCell>
													<StyledTableCell rowSpan={1} className={classes.suppliesTableButtonCell}>
														{
															<div
																className={classes.editButton}
																onClick={() => handleClick(supply.customerName, supply.surname1 ? supply.surname1 : '', supply.surname2 ? supply.surname2 : '', `${supply.customerName} ${supply.surname1 ? supply.surname1 : ''} ${supply.surname2 ? supply.surname2 : ''}`, supply.docNumber, index)}
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

									}
								)
						}
					</TableBody>
				</Table>

				{
					finalList.length > 20 &&
					<Grid container className={classes.itemsPerPage}>
						<span style={{ marginRight: 5 }}>{t('common.pagination.show')}</span>
						<select id='number' name='number' className={classes.select}>
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
	)
}

export default withRouter(ListName)
