import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { withRouter } from 'react-router'

import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Typography from '@material-ui/core/Typography'

import AlertIcon from '../../../../../assets/icons/aviso_alerta_pop_up.svg'
import ConsumptionIcon from '../../../../../assets/icons/ico_listado_consumo.svg'
import GenerationIcon from '../../../../../assets/icons/ico_listado_generacion.svg'

import { isPrevious2017 } from '../../../../../common/lib/ValidationLib'
import Tooltip from '../../../../../common/components/tooltip/Tooltip'
import Spinner from '../../../../../common/components/spinner/Spinner'

import useStyles, { StyledTableCell } from './List.styles'
import Pagination from '../../../../../common/components/pagination/Pagination2'
import Button from '../../../../../common/components/button/Button'

const ListDirection = (props: any) => {

	const { t } = useTranslation()

	const classes = useStyles({})

	const [finalList, setFinalList] = useState(props.extra)

	const [provinceArrow, setProvinceArrow] = useState(false)
	const [municipalityArrow, setMunicipalityArrow] = useState(false)
	const [orderByProvinceAsc, setOrderByProvinceAsc] = useState(false)
	const [colEntityArrow, setcolEntityArrow] = useState(false)
	const [singEntityArrow, setsingEntityArrow] = useState(false)
	const [CPEntityArrow, setCPEntityArrow] = useState(false)
	const [typeArrow, setTypeArrow] = useState(false)
	const [nameArrow, setNameArrow] = useState(false)
	const [directionNumber, setDirectionNumber] = useState('desc')

	const orderByProvinceArrow = () => {
		setProvinceArrow(true)
		setMunicipalityArrow(false)
		setcolEntityArrow(false)
		setsingEntityArrow(false)
		setCPEntityArrow(false)
		setTypeArrow(false)
		setNameArrow(false)
		if (orderByProvinceAsc) {
			setFinalList([].concat())
			setFinalList([].concat(finalList).sort().reverse())
			setOrderByProvinceAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(finalList).sort((a, b) => a.provinceName.localeCompare(b.provinceName)))
			setOrderByProvinceAsc(true)
			setDirectionNumber('desc')
		}
	}

	const showTextResultsFromTo = () => {
		return 	t('averias.management.consult.resultadosDel') +  
		Math.max((currentPage * itemsPerPage), 1) + 
		t('averias.management.consult.resultadosAl') + 
		Math.min(((currentPage * itemsPerPage) + itemsPerPage), finalList?.length) + 
		t('averias.management.consult.resultadosDeTotal') + 
		finalList?.length + t('averias.management.consult.resultados')
	}

	const orderBymunicipalityArrow = () => {
		setProvinceArrow(false)
		setMunicipalityArrow(true)
		setcolEntityArrow(false)
		setsingEntityArrow(false)
		setCPEntityArrow(false)
		setTypeArrow(false)
		setNameArrow(false)
		if (orderByProvinceAsc) {
			setFinalList([].concat())
			setFinalList([].concat(finalList).sort().reverse())
			setOrderByProvinceAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(finalList).sort((a, b) => a.municipalityName.localeCompare(b.municipalityName)))
			setOrderByProvinceAsc(true)
			setDirectionNumber('desc')
		}
	}

	const orderByColEntityArrow = () => {
		setProvinceArrow(false)
		setMunicipalityArrow(false)
		setcolEntityArrow(true)
		setsingEntityArrow(false)
		setCPEntityArrow(false)
		setTypeArrow(false)
		setNameArrow(false)
		if (orderByProvinceAsc) {
			setFinalList([].concat())
			setFinalList([].concat(finalList).sort().reverse())
			setOrderByProvinceAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(finalList).sort((a, b) => a?.groupEntityName?.localeCompare(b?.groupEntityName)))
			setOrderByProvinceAsc(true)
			setDirectionNumber('desc')
		}
	}

	const orderBySingEntityArrow = () => {
		setProvinceArrow(false)
		setMunicipalityArrow(false)
		setcolEntityArrow(false)
		setsingEntityArrow(true)
		setCPEntityArrow(false)
		setTypeArrow(false)
		setNameArrow(false)
		if (orderByProvinceAsc) {
			setFinalList([].concat())
			setFinalList([].concat(finalList).sort().reverse())
			setOrderByProvinceAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(finalList).sort((a, b) => a?.singularEntityName?.localeCompare(b?.singularEntityName)))
			setOrderByProvinceAsc(true)
			setDirectionNumber('desc')
		}
	}

	const orderByCP = () => {
		setProvinceArrow(false)
		setMunicipalityArrow(false)
		setcolEntityArrow(false)
		setsingEntityArrow(false)
		setCPEntityArrow(true)
		setTypeArrow(false)
		setNameArrow(false)
		if (orderByProvinceAsc) {
			setFinalList([].concat())
			setFinalList([].concat(finalList).sort().reverse())
			setOrderByProvinceAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(finalList).sort((a, b) => a?.zipCode?.localeCompare(b?.zipCode)))
			setOrderByProvinceAsc(true)
			setDirectionNumber('desc')
		}
	}

	const orderByType = () => {
		setProvinceArrow(false)
		setMunicipalityArrow(false)
		setcolEntityArrow(false)
		setsingEntityArrow(false)
		setCPEntityArrow(false)
		setTypeArrow(true)
		setNameArrow(false)
		if (orderByProvinceAsc) {
			setFinalList([].concat())
			setFinalList([].concat(finalList).sort().reverse())
			setOrderByProvinceAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(finalList).sort((a, b) => a?.streetType?.localeCompare(b?.streetType)))
			setOrderByProvinceAsc(true)
			setDirectionNumber('desc')
		}
	}

	const orderByName = () => {
		setProvinceArrow(false)
		setMunicipalityArrow(false)
		setcolEntityArrow(false)
		setsingEntityArrow(false)
		setCPEntityArrow(false)
		setTypeArrow(false)
		setNameArrow(true)
		if (orderByProvinceAsc) {
			setFinalList([].concat())
			setFinalList([].concat(finalList).sort().reverse())
			setOrderByProvinceAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(finalList).sort((a, b) => a?.streetName?.localeCompare(b?.streetName)))
			setOrderByProvinceAsc(true)
			setDirectionNumber('desc')
		}
	}


	const radiobuttonSelect = (supply) => {
		setSelected(supply)
	}

	const radiobuttonIsChecked = (supply) => {
		const seleccionado = selected;
		return (seleccionado !== null && 
			seleccionado.idStreet === supply.idStreet && 
			seleccionado.streetName === supply.streetName && 
			seleccionado.streetType === supply.streetType &&
			seleccionado.zipCode === supply.zipCode &&
			seleccionado.municipalityCode === supply.municipalityCode &&
			seleccionado.provinceCode === supply.provinceCode);
	}

	const [currentPage, setCurrentPage] = useState(0);
	const [itemsPerPage, setItemsPerPage] = useState(10)
	const [totalPagesFilter, setTotalPagesFilter] = useState(0)
	const [selected, setSelected] = useState<any>(null)

	useEffect(() => {
		setTotalPagesFilter(finalList.length === 0 ? 1 : Math.ceil(finalList.length / itemsPerPage))
		if ((totalPagesFilter < currentPage)) {
			// Funciona cuado hay mas de itemsPerPage supply
			setCurrentPage(totalPagesFilter - 1)
		}

		if (finalList.length < itemsPerPage) {
			// Funciona cuado hay menos de itemsPerPage supply
			setCurrentPage(0)
		}
	}, [finalList, itemsPerPage])

	useEffect(() => {
		if (totalPagesFilter <= currentPage && totalPagesFilter !== 0) {
			setCurrentPage(totalPagesFilter - 1)
		}
	}, [totalPagesFilter])

	return (
		true && (
			<>
				<Typography className={classes.expansionPanelSummaryText}>
					{
						(finalList?.length > itemsPerPage) ?
						<Grid container>
						{showTextResultsFromTo()}
						</Grid>
						:
						<Grid container>
							{finalList?.length + (finalList?.length !== 1 ? t('averias.management.consult.resultados') : t('averias.management.consult.resultado'))}
						</Grid>
					}
				</Typography>
				<Table className={classes.suppliesTable}>
					<TableHead>
						<TableRow className={classes.tableRow}>
							<StyledTableCell className={classes.headTableCell}>
								<div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', alignContent: 'center' }}>
									{t('averias.management.searchCups.table.province')}
									<TableSortLabel
										active={provinceArrow}
										direction={directionNumber === 'asc' ? 'asc' : 'desc'}
										onClick={orderByProvinceArrow}
									/>
								</div>
							</StyledTableCell>
							<StyledTableCell className={classes.headTableCell}>
								<div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', alignContent: 'center' }}>
									{t('averias.management.searchCups.table.municipality')}
									<TableSortLabel
										active={municipalityArrow}
										direction={directionNumber === 'asc' ? 'asc' : 'desc'}
										onClick={orderBymunicipalityArrow}
									/>
								</div>
							</StyledTableCell>
							<StyledTableCell className={classes.headTableCell}>
								<div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', alignContent: 'center' }}>
									{t('averias.management.searchCups.table.colEntity')}
									<TableSortLabel
										active={colEntityArrow}
										direction={directionNumber === 'asc' ? 'asc' : 'desc'}
										onClick={orderByColEntityArrow}
									/>
								</div>
							</StyledTableCell>
							<StyledTableCell className={classes.headTableCell}>
								<div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', alignContent: 'center' }}>
									{t('averias.management.searchCups.table.singEntity')}
									<TableSortLabel
										active={singEntityArrow}
										direction={directionNumber === 'asc' ? 'asc' : 'desc'}
										onClick={orderBySingEntityArrow}
									/>
								</div>
							</StyledTableCell>
							<StyledTableCell className={classes.headTableCell}>
								<div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', alignContent: 'center' }}>
									{t('averias.management.searchCups.table.CP')}
									<TableSortLabel
										active={CPEntityArrow}
										direction={directionNumber === 'asc' ? 'asc' : 'desc'}
										onClick={orderByCP}
									/>
								</div>
							</StyledTableCell>
							<StyledTableCell className={classes.headTableCell}>
								<div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', alignContent: 'center' }}>
									{t('averias.management.searchCups.table.typeStreet')}
									<TableSortLabel
										active={typeArrow}
										direction={directionNumber === 'asc' ? 'asc' : 'desc'}
										onClick={orderByType}
									/>
								</div>
							</StyledTableCell>
							<StyledTableCell className={classes.headTableCell}>
								<div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', alignContent: 'center' }}>
									{t('averias.management.searchCups.table.nameStreet')}
									<TableSortLabel
										active={nameArrow}
										direction={directionNumber === 'asc' ? 'asc' : 'desc'}
										onClick={orderByName}
									/>
								</div>
							</StyledTableCell>
							<StyledTableCell />
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
									(supply, index) => {
										return (
											<>
												<TableRow className={classes.tableBodyRow}>
													<StyledTableCell>{supply.provinceName}</StyledTableCell>
													<StyledTableCell>{supply.municipalityName}</StyledTableCell>
													<StyledTableCell>{supply.groupEntityName}</StyledTableCell>
													<StyledTableCell>{supply.singularEntityName}</StyledTableCell>
													<StyledTableCell>{supply.zipCode}</StyledTableCell>
													<StyledTableCell>{supply.streetType}</StyledTableCell>
													<StyledTableCell>{supply.streetName}</StyledTableCell>
													<StyledTableCell className={classes.suppliesTableButtonCell}>
														{
															<input type='radio' name='supply' id={supply.idStreet}  onClick={() => radiobuttonSelect(supply)} checked={radiobuttonIsChecked(supply)}/>
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
						<select id='number' name='number' className={classes.select} onChange={(event) => setItemsPerPage(parseInt(event.target.value))}>
							<option value='10'>10</option>
							<option value='20'>20</option>
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

				<Button
					text={t('common.buttons.close')}
					color='secondary'
					size='large'
					variant='contained'
					style={
						{
							color: 'black',
							margin: '1rem'
						}
					}
					onClick={() => {
						props.toggle()
					}}
				/>

				<Button
					text={t('common.buttons.accept')}
					color='primary'
					size='large'
					variant='contained'
					// disabled={(error === false && (credential.trim() !== '') || (socialReason.trim() !== '') || (name.trim() !== '') || (surname1.trim() !== '') || (surname2.trim() !== '') || (idAddress.trim() !== '' || (town.trim() !== '' && province.trim() !== '' && zipCode.trim() !== '' && streetType.trim() !== '' && streetName.trim() !== '' && number.trim() !== '')) || (name.trim() !== '' && surname1.trim() !== '') || (name.trim() !== '') || (surname1.trim() !== '') || (surname2.trim() !== '')) ? false : true}
					onClick={() => {
						const selectedArray = []
						finalList.map((v) => {
							return radiobuttonIsChecked(v) ? selectedArray.push(v) : ''
						})
						if (selectedArray.length > 0) {
							props.handleClick(selectedArray[0])
						}
					}}
					style={
						{
							margin: '1rem'
						}
					}
				/>

			</>
		)
	)
}

export default withRouter(ListDirection)
