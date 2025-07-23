import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { withRouter } from 'react-router'
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import AlertIcon from '../../../../../assets/icons/aviso_alerta_pop_up.svg'
import LoadingAnimation from '../../../../../assets/img/spinner.gif'
import AlcanceBloque from '../../../../../assets/icons/alcance_bloque.svg'
import AlcanceCalle from '../../../../../assets/icons/alcance_calle.svg'
import AlcanceCasa from '../../../../../assets/icons/alcance_casa.svg'
import AlcanceMunicipio from '../../../../../assets/icons/alcance_municipio.svg'
import AlcancePortal from '../../../../../assets/icons/alcance_portal.svg'
import Interrogante from '../../../../../assets/icons/interrogante_redondo.svg'
import Exclamacion from '../../../../../assets/icons/triangulo_exclamacion.svg'
import Corte from '../../../../../assets/icons/corte_suministros.svg'
import Variable from '../../../../../assets/icons/deficiencia_variable.svg'
import Continuada from '../../../../../assets/icons/deficiencia_continua.svg'
import Reposicion from '../../../../../assets/icons/reposicion_baja_tension.svg'
import { isPrevious2017 } from '../../../../../common/lib/ValidationLib'
import Tooltip from '../../../../../common/components/tooltip/Tooltip'
import Spinner from '../../../../../common/components/spinner/Spinner'
import useStyles, { StyledTableCell } from './mosaic.styles'
import Pagination from '../../../../../common/components/pagination/Pagination2'
import WarningDialog from '../dialog/WarningDialog'
import { thunkGetListWarnings, thunkGetWarningsIncidence } from '../../../../../supplies/supplies-details/store/actions/SuppliesDetailsThunkActions'
import AveriasUtils from '../../../../utils/AveriasUtilsClass'
const Mosaic = (props: any) => {
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
	const dispatch = useDispatch()
	const classes = useStyles({})
	const target = document.getElementById('number') as HTMLSelectElement
	//usamos estas constantes para controlar la ordenación en columnas
	const [orderByTypeAsc, setOrderByTypeAsc] = useState(false)
	const [orderByNameAsc, setOrderByNameAsc] = useState(false)
	const [orderByDirectionAsc, setOrderByDirectionAsc] = useState(false)
	const [orderByDateAsc, setOrderByDateAsc] = useState(false)
	const [orderByStatusAsc, setOrderByStatusAsc] = useState(false)
	const [orderByAlcanceAsc, setOrderByAlcanceAsc] = useState(false)
	const [showTypeArrow, setShowTypeArrow] = useState(false)
	const [showNameArrow, setShowNameArrow] = useState(false)
	const [showDirectionArrow, setShowDirectionArrow] = useState(false)
	const [showDateArrow, setShowDateArrow] = useState(false)
	const [showStatusArrow, setShowStatusArrow] = useState(false)
	const [showAlcanceArrow, setShowAlcanceArrow] = useState(false)
	const [showCupsArrow, setShowCupsArrow] = useState(false)
	const [showWarningDialog, setShowWarningDialog] = useState(false)
	const [directionNumber, setDirectionNumber] = useState('desc')
	const [warning, setWarning] = useState([] as any)
	const [isLoadingList, setIsLoadingList] = useState(false)
	//ordenamos a partir de la columna de la provincia
	// const orderByName = () => {
	// 	setShowNameArrow(true)
	// 	setShowTypeArrow(false)
	// 	setShowDirectionArrow(false)
	// 	setShowDateArrow(false)
	// 	setShowStatusArrow(false)
	// 	setShowAlcanceArrow(false)
	// 	setShowCupsArrow(false)
	// 	setDirectionNumber('desc')
	// 	if (orderByNameAsc) {
	// 		setFinalList([].concat(listItems).sort().reverse())
	// 		setOrderByNameAsc(false)
	// 		setDirectionNumber('asc')
	// 	} else {
	// 		setFinalList([].concat(listItems).sort((a, b) => a.provinceDesc.localeCompare(b.provinceDesc)))
	// 		setOrderByNameAsc(true)
	// 		setDirectionNumber('desc')
	// 	}
	// }
	// //ordenamos a partir de la columna tipo
	// const orderByType = () => {
	// 	setShowNameArrow(false)
	// 	setShowTypeArrow(true)
	// 	setShowDirectionArrow(false)
	// 	setShowDateArrow(false)
	// 	setShowStatusArrow(false)
	// 	setShowAlcanceArrow(false)
	// 	setShowCupsArrow(false)
	// 	setDirectionNumber('desc')
	// 	if (orderByTypeAsc) {
	// 		setFinalList([].concat(listItems).sort().reverse())
	// 		setOrderByTypeAsc(false)
	// 		setDirectionNumber('asc')
	// 	} else {
	// 		setFinalList([].concat(listItems).sort((a, b) => a.tipoAviso.localeCompare(b.tipoAviso)))
	// 		setOrderByTypeAsc(true)
	// 		setDirectionNumber('desc')
	// 	}
	// }
	// //ordenamos a partir de la columna dirección
	// const orderByDirection = () => {
	// 	setShowNameArrow(false)
	// 	setShowTypeArrow(false)
	// 	setShowDirectionArrow(true)
	// 	setShowDateArrow(false)
	// 	setShowStatusArrow(false)
	// 	setShowAlcanceArrow(false)
	// 	setShowCupsArrow(false)
	// 	setDirectionNumber('desc')
	// 	if (orderByDirectionAsc) {
	// 		setFinalList([].concat(listItems).sort().reverse())
	// 		setOrderByDirectionAsc(false)
	// 		setDirectionNumber('asc')
	// 	} else {
	// 		setFinalList([].concat(listItems).sort((a, b) => a.streetDesc.localeCompare(b.streetDesc)))
	// 		setOrderByDirectionAsc(true)
	// 		setDirectionNumber('desc')
	// 	}
	// }
	// //ordenamos a partir de la columna date
	// const orderByDate = () => {
	// 	setShowNameArrow(false)
	// 	setShowTypeArrow(false)
	// 	setShowDirectionArrow(false)
	// 	setShowDateArrow(true)
	// 	setShowStatusArrow(false)
	// 	setShowAlcanceArrow(false)
	// 	setShowCupsArrow(false)
	// 	setDirectionNumber('desc')
	// 	if (orderByDateAsc) {
	// 		setFinalList([].concat(listItems).sort().reverse())
	// 		setOrderByDateAsc(false)
	// 		setDirectionNumber('asc')
	// 	} else {
	// 		setFinalList([].concat(listItems).sort((a, b) => a.fecha.localeCompare(b.fecha)))
	// 		setOrderByDateAsc(true)
	// 		setDirectionNumber('desc')
	// 	}
	// }
	// //ordenamos a partir de la columna status
	// const orderByStatus = () => {
	// 	setShowNameArrow(false)
	// 	setShowTypeArrow(false)
	// 	setShowDirectionArrow(false)
	// 	setShowDateArrow(false)
	// 	setShowStatusArrow(true)
	// 	setShowAlcanceArrow(false)
	// 	setShowCupsArrow(false)
	// 	setDirectionNumber('desc')
	// 	if (orderByStatusAsc) {
	// 		setFinalList([].concat(listItems).sort().reverse())
	// 		setOrderByStatusAsc(false)
	// 		setDirectionNumber('asc')
	// 	} else {
	// 		setFinalList([].concat(listItems).sort((a, b) => a.estadoAviso.localeCompare(b.estadoAviso)))
	// 		setOrderByStatusAsc(true)
	// 		setDirectionNumber('desc')
	// 	}
	// }
	// //ordenamos a partir de la columna status
	// const orderByAlcance = () => {
	// 	setShowNameArrow(false)
	// 	setShowTypeArrow(false)
	// 	setShowDirectionArrow(false)
	// 	setShowDateArrow(false)
	// 	setShowStatusArrow(false)
	// 	setShowAlcanceArrow(true)
	// 	setShowCupsArrow(false)
	// 	setDirectionNumber('desc')
	// 	if (orderByAlcanceAsc) {
	// 		setFinalList([].concat(listItems).sort().reverse())
	// 		setOrderByAlcanceAsc(false)
	// 		setDirectionNumber('asc')
	// 	} else {
	// 		setFinalList([].concat(listItems).sort((a, b) => a.alcance.localeCompare(b.alcance)))
	// 		setOrderByAlcanceAsc(true)
	// 		setDirectionNumber('desc')
	// 	}
	// }
	//ordenamos a partir de la columna cups
	/*const orderByCups = () => {
		setShowNameArrow(false)
		setShowTypeArrow(false)
		setShowDirectionArrow(false)
		setShowDateArrow(false)
		setShowStatusArrow(false)
		setShowAlcanceArrow(false)
		setShowCupsArrow(true)
		setDirectionNumber('desc')
		if (orderByStatusAsc) {
			setFinalList([].concat(listItems).sort().reverse())
			setOrderByCupsAsc(false)
			setDirectionNumber('asc')
		} else {
			setFinalList([].concat(listItems).sort((a, b) => a.cupsIncidence.localeCompare(b.cupsIncidence)))
			setOrderByCupsAsc(true)
			setDirectionNumber('desc')
		}
	}*/
	// const onChangeSelector = () => {
	// 	setCurrentPage(0)
	// 	setItemsPerPage(Number(target.options[target.selectedIndex].value))
	// }
	// const [totalPagesFilter, setTotalPagesFilter] = useState(0)
	// useEffect(() => {
	// 	setTotalPagesFilter(listItems.length === 0 ? 1 : Math.ceil(listItems.length / itemsPerPage))
	// 	// eslint-disable-next-line
	// }, [listItems, itemsPerPage])
	const handleClick = (warning) => {
		console.log('entra mosaic 1')

		setIsLoadingList(true)
		//disparamos la llamada directamente, esto lo hacemos así pq sino da problemas con la respuesta en OK 
		dispatch(thunkGetListWarnings(warning.warningCode, (responseJson) => {
			if (responseJson.result.codResult === '0000' && (responseJson.result.msgResult === '' || responseJson.result.msgResult === 'CORRECTO' || responseJson.result.msgResult === 'TRANSACCION CORRECTA') ) {
				for(let i = 0; i < responseJson.warning.length; i++) {
					responseJson.warning[i].fecha = AveriasUtils.FormatDateAveriasPantalla(responseJson.warning[i].fecha);
				}
				dispatch(thunkGetWarningsIncidence(warning.warningCode, 'warning', (responseJson2) => {

					if (responseJson2.result.codResult === '0000' && (responseJson2.result.msgResult === 'CORRECTO' || responseJson2.result.msgResult === 'TRANSACCION CORRECTA')) {
						//rellenemos la lista en caso de recibir warnings
						let auxWarning = {
							centro: AveriasUtils.FormatTextField(warning.provinceDesc),
							cups: AveriasUtils.FormatTextField(warning.cupsIncidence),
							tipo: AveriasUtils.FormatTextField(responseJson.warning.tipoAviso),
							alcance: AveriasUtils.FormatTextField(responseJson.warning.alcance),
							fecha: AveriasUtils.FormatDateAveriasPantalla(responseJson.warning.fecha),
							dirCompleta: AveriasUtils.FormatTextField(responseJson.warning.dirCompleta),
							observaciones: AveriasUtils.FormatTextField(responseJson.warning.observaciones),
							warningIncidenceStatus: AveriasUtils.FormatTextField(responseJson.warning.estadoIncidencia),
							seguimientoIncidencia: AveriasUtils.FormatTextField(responseJson2.incidence.historicalState),
							seguimientoFechas: responseJson2.incidence.historicalStateDate,
							seguimientoObservaciones: AveriasUtils.FormatTextField(responseJson2.incidence.historicalStateObs),
							startDateIncidencia: AveriasUtils.FormatDateAveriasPantalla(responseJson2.incidence.incidenceStartDate),
							incidenceState: AveriasUtils.FormatTextField(responseJson2.incidence.incidenceState),
							fechaPrevistaResolucion: AveriasUtils.FormatDateAveriasPantalla(responseJson2.incidence.resolutionDate),
							origin: AveriasUtils.FormatTextField(responseJson2.incidence.origin),
							originDesc: AveriasUtils.FormatTextField(responseJson2.incidence.originDesc),
							instalacionAfectada: AveriasUtils.FormatTextField(responseJson2.incidence.refInstallation),
							centrolIncidencia: AveriasUtils.FormatCodDescField(responseJson2.incidence.base, responseJson2.incidence.baseDesc),
							motivoFinalizaciónIncidencia: AveriasUtils.FormatCodDescField(responseJson2.incidence.incidenceType, responseJson2.incidence.incidenceTypeDesc),
							observacionesIncidencia: AveriasUtils.FormatTextField(responseJson2.incidence.incidenceObs),
							observacionesCor: AveriasUtils.FormatTextField(responseJson2.incidence.incidenceDesc),
							potencia: AveriasUtils.FormatTextField(responseJson2.incidence.power),
							nivelTension: AveriasUtils.FormatTextField(responseJson2.incidence.tensionLevel),
							numAfectados: AveriasUtils.FormatTextField(responseJson2.incidence.cups),
							warningCode: AveriasUtils.FormatTextField(warning.warningCode),
							materialAveriado: AveriasUtils.FormatTextField(responseJson2.incidence.refInstallationType)
						}
						setWarning(auxWarning)
						setShowWarningDialog(true)
						setIsLoadingList(false)
					} else {
						//En caso de error de sistema
						//rellenemos la lista en caso de recibir warnings
						let auxWarning = {
							centro: warning.provinceDesc,
							cups: warning.cupsIncidence,
							tipo: responseJson.warning.tipoAviso,
							alcance: responseJson.warning.alcance,
							fecha: responseJson.warning.fecha,
							dirCompleta: responseJson.warning.dirCompleta,
							observaciones: responseJson.warning.observaciones,
							warningCode: warning.warningCode
						}
						setWarning(auxWarning)
						setShowWarningDialog(true)
						setIsLoadingList(false)
					}
				}))
			} else {
				setIsLoadingList(false)
			}
		}))
	}
	const setImage = (column, warning) => {
		if (column === 'tipo') {
			if (warning.tipoAviso === '1') {
				return (
					//corte
					<Grid container className={classes.lockBox}>
						<img src={Corte} className={classes.lockIcon} alt='' />
					</Grid>
				)
			} else if (warning.tipoAviso === '2') {
				return (
					//deficiencia continuada
					<Grid container className={classes.lockBox}>
						<img src={Continuada} className={classes.lockIcon} alt='' />
					</Grid>
				)
			} else if (warning.tipoAviso === '3') {
				return (
					//deficiencia variable
					<Grid container className={classes.lockBox}>
						<img src={Variable} className={classes.lockIcon} alt='' />
					</Grid>
				)
			} else if (warning.tipoAviso === '4') {
				return (
					//reposición BT
					<Grid container className={classes.lockBox}>
						<img src={Reposicion} className={classes.lockIcon} alt='' />
					</Grid>
				)
			} else {
				return (
					<Grid container className={classes.lockBox}>
						<img src={Interrogante} className={classes.lockIcon} alt='' />
					</Grid>
				)
			}
		} else if (column === 'alcance') {
			if (warning.alcance === '1') {
				//casa
				return (
					<Grid container className={classes.lockBox}>
						<img src={AlcanceCasa} className={classes.lockIcon} alt='' />
					</Grid>
				)
			} else if (warning.alcance === '2') {
				//portal
				return (
					<Grid container className={classes.lockBox}>
						<img src={AlcancePortal} className={classes.lockIcon} alt='' />
					</Grid>
				)
			} else if (warning.alcance === '3') {
				//bloque
				return (
					<Grid container className={classes.lockBox}>
						<img src={AlcanceBloque} className={classes.lockIcon} alt='' />
					</Grid>
				)
			} else if (warning.alcance === '4') {
				//calle
				return (
					<Grid container className={classes.lockBox}>
						<img src={AlcanceCalle} className={classes.lockIcon} alt='' />
					</Grid>
				)
			} else if (warning.alcance === '5') {
				//municipio
				return (
					<Grid container className={classes.lockBox}>
						<img src={AlcanceMunicipio} className={classes.lockIcon} alt='' />
					</Grid>
				)
			} else {
				//interrogante
				return (
					<Grid container className={classes.lockBox}>
						<img src={Interrogante} className={classes.lockIcon} alt='' />
					</Grid>
				)
			}
		} else if (column === 'cor') {
			if (warning.estadoIncidencia && warning.estadoIncidencia !== '') {
				return (
					<Grid container className={classes.lockBox}>
						<img src={Exclamacion} className={classes.lockIcon} alt='' />
					</Grid>
				)
			} else {
				return (
					<Grid container className={classes.lockBox}>
						<img src={Interrogante} className={classes.lockIcon} alt='' />
					</Grid>
				)
			}
		} else {
			return ''
		}
	}
	const setTooltip = (column, warning) => {
		if (column === 'tipo') {
			if (warning.tipoAviso === '1') {
				return (
					t('averias.management.consult.corte')
				)
			} else if (warning.tipoAviso === '2') {
				return (
					t('averias.management.consult.continuada')
				)
			}
			else if (warning.tipoAviso === '3') {
				return (
					t('averias.management.consult.variable')
				)
			}
			else if (warning.tipoAviso === '4') {
				return (
					t('averias.management.consult.reposicion')
				)
			} else {
				return (
					''
				)
			}
		} else if (column === 'alcance') {
			if (warning.alcance === '1') {
				//casa
				return (
					t('averias.management.consult.casa')
				)
			} else if (warning.alcance === '2') {
				//portal
				return (
					t('averias.management.consult.portal')
				)
			} else if (warning.alcance === '3') {
				//bloque
				return (
					t('averias.management.consult.bloque')
				)
			} else if (warning.alcance === '4') {
				//calle
				return (
					t('averias.management.consult.calle')
				)
			} else if (warning.alcance === '5') {
				//municipio
				return (
					t('averias.management.consult.municipio')
				)
			} else {
				return (
					''
				)
			}
		} else if (column === 'cor') {
			if (warning.estadoIncidencia === 'PR') {
				return ('ABIERTA')
			} else if (warning.estadoIncidencia === 'PT') {
				return ('ABIERTA')
			} else if (warning.estadoIncidencia === 'EB') {
				return ('EN CURSO')
			} else if (warning.estadoIncidencia === 'CL') {
				return ('EN CURSO')
			} else if (warning.estadoIncidencia === 'ER') {
				return ('EN CURSO')
			} else if (warning.estadoIncidencia === 'SR') {
				return ('RESUELTA')
			} else if (warning.estadoIncidencia === 'RS') {
				return ('RESUELTA')
			} else if (warning.estadoIncidencia === 'EMCI') {
				return ('EN CURSO')
			} else if (warning.estadoIncidencia === 'EMSI') {
				return ('EN CURSO')
			} else if (warning.estadoIncidencia === 'EM') {
				return ('RESUELTA')
			} else {
				return ('')
			}
		} else {
			return ''
		}
	}
	return (
		<>
        {
				isLoadingList &&
				<Spinner fixed={true} />
			}
			{showWarningDialog &&
				<WarningDialog
					showingDialog={showWarningDialog}
					setShowingDialog={setShowWarningDialog}
					warning={warning}
				/>
			}
        {      
            listItems.map((warning, index) => {
            
                return <Grid key={index} container spacing={2} style={{marginTop:'10px',marginBottom:'10px'}}>
                  <Grid item lg={4}  md={6} sm={6} xs={12}>
                    <Grid className={`${classes.item}`}>
                      <Grid style={{ textAlign: 'center',alignContent:'center' }}  className={classes.rowMosaic}>
                        <div className={classes.title}>{t('averias.management.consult.columnCentro')}</div>
                        <div className={`${classes.value}`}>{warning.provinceDesc}</div>
                      </Grid>

                      <Grid style={{ textAlign: 'center',alignContent:'center' }}  className={classes.rowMosaic}>
                        <div className={classes.title}>{t('averias.management.consult.columnTipo')}</div>

                        <div style={{ textAlign: 'center',alignContent:'center' }} className={`${classes.value}`}>
                        <Tooltip title={setTooltip('tipo', warning)} placement='top'>{setImage('tipo', warning)}</Tooltip>
                        </div>
                      </Grid>

                      <Grid style={{ textAlign: 'center',alignContent:'center' }} className={classes.rowMosaic}>
                        <div className={classes.title}>{t('averias.management.consult.columnAlcance')}</div>

                        <div className={classes.value}>
                          
                        <Tooltip title={setTooltip('alcance', warning)} placement='top'>{setImage('alcance', warning)}</Tooltip>
                          
                        </div>
                      </Grid>

                      <Grid  style={{ textAlign: 'center',alignContent:'center' }} className={classes.rowMosaic}>
                        <div className={classes.title}>{t('averias.management.consult.columnEstadoCOR')}</div>

                        <div className={classes.value}>
                       <Tooltip title={setTooltip('cor', warning)} placement='top'>{setImage('cor', warning)}</Tooltip>
                        </div>
                      </Grid>

                      <Grid  style={{ textAlign: 'center',alignContent:'center' }} className={classes.rowMosaic}>
                        <div className={classes.title}>{t('averias.management.consult.columnStartDate')}</div>

                        <div className={classes.value}>
                        {AveriasUtils.FormatDateAveriasPantalla(warning.fecha)}
                        </div>
                      </Grid>

                      <Grid style={{ textAlign: 'center',alignContent:'center' }} className={classes.rowMosaic}>
                        <div className={classes.title}>{t('averias.management.consult.columnDireccion')}</div>

                        <div className={classes.value}>
                        {warning.streetDesc + ' ' + warning.number + ', ' + warning.municipalityCode + ' ' + warning.municipalityDesc}
                        </div>
                      </Grid>
                      <Grid  className={classes.rowMosaic}>
                      
													<div style={{display:'grid'}} className={classes.editButton} onClick={() => handleClick(warning)}>
														<p>{t('averias.management.consult.show')}</p>
													</div>
												
                    </Grid>
                      </Grid>
                     </Grid>
              </Grid>
            })
          
            }
		</>
	)
}
export default withRouter(Mosaic)
