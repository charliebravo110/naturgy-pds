import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Dialog from '../../../../../common/components/dialog/Dialog'
import Button from '../../../../../common/components/button/Button'
import CloseIcon from '../../../../../assets/icons/cerrar.svg'
import AlcanceBloque from '../../../../../assets/icons/alcance_bloque.svg'
import AlcanceCalle from '../../../../../assets/icons/alcance_calle.svg'
import AlcanceCasa from '../../../../../assets/icons/alcance_casa.svg'
import AlcanceMunicipio from '../../../../../assets/icons/alcance_municipio.svg'
import AlcancePortal from '../../../../../assets/icons/alcance_portal.svg'
import Observaciones from '../../../../../assets/icons/observaciones.svg'
import Seguimiento from '../../../../../assets/icons/seguimiento.svg'
import Incidencia from '../../../../../assets/icons/incidencia.svg'
import Interrogante from '../../../../../assets/icons/interrogante_redondo.svg'
import Corte from '../../../../../assets/icons/corte_suministros.svg'
import Variable from '../../../../../assets/icons/deficiencia_variable.svg'
import Continuada from '../../../../../assets/icons/deficiencia_continua.svg'
import Reposicion from '../../../../../assets/icons/reposicion_baja_tension.svg'
import AveriasUtils from '../../../../utils/AveriasUtilsClass'
import Grid from '@material-ui/core/Grid'
import { DialogContent } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import useStyles, {
	ExpansionPanel,
	ExpansionPanelSummary,
	StyledExpandMoreIcon,
	ExpansionPanelDetails
} from './Dialog.styles';
import List from '../list/ListSeguimiento'
import Tooltip from '../../../../../common/components/tooltip/Tooltip'
const WarningDialog = (props: any) => {
	const classes = useStyles({})
	const { t } = useTranslation();
	const { showingDialog, setShowingDialog, warning, cups } = props
	const handleCloseDialog = () => {
		setShowingDialog(false)
	}
	const [expandCups, setExpandCups] = useState(true)
	const [expandObservations, setExpandObservations] = useState(true)
	const [expandSeguimiento, setExpandSeguimiento] = useState(true)
	const togglePanelCups = () => {
		setExpandCups((prev) => !prev)
	}
	const togglePanelObservations = () => {
		setExpandObservations((prev) => !prev)
	}
	const togglePanelSeguimiento = () => {
		setExpandSeguimiento((prev) => !prev)
	}
	const getStatus = (status: string) => {
		switch (status) {
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
			default:
				return ('')
		}
	}

	const getTooltipStatus = (status: string) => {
		switch (status) {
			case 'PR':
				return ('Propuesta')
			case 'PT':
				return ('Pendiente')
			case 'EB':
				return ('Eviada Brigada')
			case 'CL':
				return ('Causa localizada')
			case 'ER':
				return ('En reposición')
			case 'SR':
				return ('Servicio repuesto')
			case 'RS':
				return ('Resuelta')
			case 'EMCI':
				return ('Enviado mantenimiento con indisponibilidades pendientes')
			case 'EMSI':
				return ('Enviado mantenimiento sin indisponibilidades')
			case 'EM':
				return ('Enviado mantenimiento')
			default:
				return ('')
		}
	}
	const [listaSeguimiento, setListaSeguimiento] = useState([] as any)
	const [totalPages, setTotalPages] = useState(0)
	const [currentPage, setCurrentPage] = useState(0)
	const [itemsPerPage, setItemsPerPage] = useState(20)
	//Creamos la lista de seguimiento de ser necesario
	if (warning.warningIncidenceStatus && listaSeguimiento.length === 0) {
		let auxList = []
		let auxStatus = warning.seguimientoIncidencia?.toString().split(',')
		let auxDates = warning.seguimientoFechas?.toString().split(',')
		let auxObs = warning.seguimientoObservaciones?.toString().split('|')
		let auxObj
		for (let i = 0; i < auxStatus.length; i++) {
			auxObj = {
				estado: auxStatus[i] ? auxStatus[i] : '',
				fecha: AveriasUtils.FormatDateAveriasPantalla(auxDates[i] ? auxDates[i] : ''),
				obs: (auxObs != null && auxObs[i]) ? auxObs[i] : ''
			}
			auxList.push(auxObj)
		}
		setListaSeguimiento(auxList)
	}
	useEffect(() => {
		setTotalPages(listaSeguimiento.length === 0 ? 1 : Math.ceil(listaSeguimiento.length / itemsPerPage))
		// eslint-disable-next-line
	}, [listaSeguimiento, itemsPerPage])
	const setImage = (column, warning) => {
		if (column === 'tipo') {
			if (warning.tipo === '1') {
				return (
					Corte
				)
			} else if (warning.tipo === '2') {
				return (
					Continuada
				)
			} else if (warning.tipo === '3') {
				return (
					Variable
				)
			} else if (warning.tipo === '4') {
				return (
					Reposicion
				)
			} else {
				return (
					Interrogante
				)
			}
		} else if (column === 'alcance') {
			if (warning.alcance === '1') {
				//casa
				return (
					AlcanceCasa
				)
			} else if (warning.alcance === '2') {
				//portal
				return (
					AlcancePortal
				)
			} else if (warning.alcance === '3') {
				//bloque
				return (
					AlcanceBloque
				)
			} else if (warning.alcance === '4') {
				//calle
				return (
					AlcanceCalle
				)
			} else if (warning.alcance === '5') {
				//municipio
				return (
					AlcanceMunicipio
				)
			} else {
				//interrogante
				return (
					Interrogante
				)
			}
		} else {
			return ''
		}
	}
	return (
		<Dialog className={classes.dialog} open={showingDialog} onClose={handleCloseDialog}>
			<DialogContent className={classes.dialogContainer}>
				<img src={CloseIcon} className={classes.closeButton} alt='' onClick={handleCloseDialog} />
				<Grid container className={classes.title}>
					<Typography className={classes.title}>{cups ? t('averias.management.consult.warningDetail2') : t('averias.management.consult.warningDetail')}</Typography>
				</Grid>
				<Grid container className={classes.topContainer}>
					<Grid container className={classes.inTopContainer}>
						{cups && <Grid item md={6} sm={12} xs={12}><a className={classes.subTitle}>{t('averias.management.consult.cups')}</a> {cups}</Grid>}
						{/*cups && <Grid item md={6} sm={12} xs={12} style={{ textAlign: 'end' }}><a className={classes.subTitleCups}>{t('averias.management.consult.cups')}</a> {cups}</Grid>*/}
					</Grid>
					{cups && <Grid container className={classes.line} />}
					<Grid container className={classes.inTopContainer}>
						<Grid item md={4} sm={12} xs={12}>
							<Typography className={classes.subTitle}>{t('averias.management.consult.codigo')}</Typography>
							{warning.warningCode}
						</Grid>
						<Grid item md={4} sm={12} xs={12}>
							<Typography className={classes.subTitle}>{t('averias.management.consult.columnTipo')}</Typography>
							<img src={setImage('tipo', warning)} /> {
								warning.tipo === '1' ?
									t('averias.management.consult.corte')
									:
									warning.tipo === '2' ?
										t('averias.management.consult.continuada')
										:
										warning.tipo === '3' ?
											t('averias.management.consult.variable')
											:
											warning.tipo === '4' ?
												t('averias.management.consult.reposicion')
												:
												''
							}
						</Grid>
						<Grid item md={4} sm={12} xs={12}>
							<Typography className={classes.subTitle}>{t('averias.management.consult.columnStartDate')}</Typography>
							{AveriasUtils.FormatDateAveriasPantalla(warning.fecha)}
						</Grid>
						<Grid item md={4} sm={12} xs={12}>
							<Typography className={classes.subTitle}>{t('averias.management.consult.columnDireccion')}</Typography>
							{warning.dirCompleta}
						</Grid>
						<Grid item md={4} sm={12} xs={12}>
							<Typography className={classes.subTitle}>{t('averias.management.consult.columnAlcance')}</Typography>
							<img src={setImage('alcance', warning)} />
							{warning.alcance === '1' ?
								t('averias.management.consult.casa')
								:
								warning.alcance === '2' ?
									t('averias.management.consult.portal')
									:
									warning.alcance === '3' ?
										t('averias.management.consult.bloque')
										:
										warning.alcance === '4' ?
											t('averias.management.consult.calle')
											:
											warning.alcance === '5' ?
												t('averias.management.consult.municipio')
												:
												''
							}
						</Grid>
						{
							warning.warningIncidenceStatus &&
							<>
								<Grid item md={4} sm={12} xs={12}>
									<Typography className={classes.subTitle}>{t('averias.management.consult.status')}</Typography>
									{warning.warningIncidenceStatus && getStatus(warning.warningIncidenceStatus)}
								</Grid>
								<Grid item md={4} sm={12} xs={12}>
									<Typography className={classes.subTitle}>{t('averias.management.consult.columnEndDate')}</Typography>
									{warning.fecha && AveriasUtils.FormatDateAveriasPantalla(warning.fecha)}
								</Grid>
							</>
						}
					</Grid>
				</Grid>
				<Grid container className={classes.expansionContainer}>
					<ExpansionPanel expanded={expandObservations}>
						<ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />} IconButtonProps={{ onClick: togglePanelObservations }}>
							<img className={classes.expansionPanelSummaryIcon} src={Observaciones} alt='' />
							<Typography className={classes.expansionPanelSummaryText}>{t('averias.management.consult.observations')}</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							<Grid item md={12} sm={12} xs={12}>
								<Typography className={classes.subTitle2}>{t('averias.management.consult.subObservations')}</Typography>
							</Grid>
							<Grid item md={12} sm={12} xs={12} className={classes.observationsContainer}>
								<a className={classes.inObsContainer}>{warning.observaciones}</a>
							</Grid>
						</ExpansionPanelDetails>
					</ExpansionPanel>
				</Grid>
				{
					warning.warningIncidenceStatus &&
					<Grid container className={classes.expansionContainer}>
						<ExpansionPanel expanded={expandSeguimiento}>
							<ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />} IconButtonProps={{ onClick: togglePanelSeguimiento }}>
								<img className={classes.expansionPanelSummaryIcon} src={Incidencia} alt='' />
								<Typography className={classes.expansionPanelSummaryText}>{t('averias.management.consult.incidencia')}</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<Grid container className={classes.inTopContainer}>
									<Grid item md={3} sm={12} xs={12}>
										<Typography className={classes.subTitle}>{t('averias.management.consult.columnStartDate')}</Typography>
										{AveriasUtils.FormatDateAveriasPantalla(warning.startDateIncidencia)}
									</Grid>
									<Grid item md={3} sm={12} xs={12}>
										<Typography className={classes.subTitle}>{t('averias.management.consult.status')}</Typography>
										<Tooltip className={classes.tooltip} title={getTooltipStatus(warning.incidenceState)} placement='top-start'><Typography>{warning.warningIncidenceStatus && getStatus(warning.warningIncidenceStatus)}</Typography></Tooltip>
									</Grid>
									<Grid item md={3} sm={12} xs={12}>
										<Typography className={classes.subTitle}>{t('averias.management.consult.potencia')}</Typography>
										{Number(warning.potencia)}
									</Grid>
									<Grid item md={3} sm={12} xs={12}>
										<Typography className={classes.subTitle}>{t('averias.management.consult.fechaPrevista')}</Typography>
										{warning.fechaPrevistaResolucion && AveriasUtils.FormatDateAveriasPantalla(warning.fechaPrevistaResolucion)}
									</Grid>
									<Grid item md={3} sm={12} xs={12}>
										<Typography className={classes.subTitle}>{t('averias.management.consult.columnCentro')}</Typography>
										{warning.centrolIncidencia}
									</Grid>
									<Grid item md={3} sm={12} xs={12}>
										<Typography className={classes.subTitle}>{t('averias.management.consult.instalacionAfectada')}</Typography>
										{warning.instalacionAfectada}
									</Grid>
									<Grid item md={3} sm={12} xs={12}>
										<Typography className={classes.subTitle}>{t('averias.management.consult.tipoIncidencia')}</Typography>
										{warning.motivoFinalizaciónIncidencia}
									</Grid>
									<Grid item md={3} sm={12} xs={12}>
										<Typography className={classes.subTitle}>{t('averias.management.consult.description')}</Typography>
										{warning.observacionesCor}
									</Grid>
									<Grid item md={3} sm={12} xs={12}>
										<Typography className={classes.subTitle}>{t('averias.management.consult.instalacionOrigen')}</Typography>
										{(warning.origin && warning.originDesc ) ? warning.origin + ' - ' + warning.originDesc : warning.origin ? warning.origin : warning.originDesc ? warning.originDesc : ''}
									</Grid>
									<Grid item md={3} sm={12} xs={12}>
										<Typography className={classes.subTitle}>{t('averias.management.consult.TensionLevel')}</Typography>
										{warning.nivelTension}
									</Grid>
									<Grid item md={3} sm={12} xs={12}>
										<Typography className={classes.subTitle}>{t('averias.management.consult.NumeroAfectados')}</Typography>
										{Number(AveriasUtils.FormatTextField(warning.numAfectados))}
									</Grid>
									<Grid item md={12} sm={12} xs={12}>
										<Typography className={classes.subTitle2}>{t('averias.management.consult.corObservations')}</Typography>
									</Grid>
									<Grid item md={12} sm={12} xs={12} className={classes.observationsContainer}>
										<a className={classes.inObsContainer}>{warning.observacionesIncidencia}</a>
									</Grid>
								</Grid>
							</ExpansionPanelDetails>
						</ExpansionPanel>
					</Grid>
				}
				{
					warning.warningIncidenceStatus &&
					<Grid container className={classes.expansionContainer}>
						<ExpansionPanel expanded={expandCups}>
							<ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />} IconButtonProps={{ onClick: togglePanelCups }}>
								<img className={classes.expansionPanelSummaryIcon} src={Seguimiento} alt='' />
								<Typography className={classes.expansionPanelSummaryText}>{t('averias.management.consult.seguimiento')}</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<Grid item md={12} sm={12} xs={12} className={classes.table}>
									<List
										listItems={listaSeguimiento}
										setFinalList={setListaSeguimiento}
										currentPage={currentPage}
										setCurrentPage={setCurrentPage}
										itemsPerPage={itemsPerPage}
										setItemsPerPage={setItemsPerPage}
										totalPages={totalPages}
									/>
								</Grid>
							</ExpansionPanelDetails>
						</ExpansionPanel>
					</Grid>
				}
				<Grid container className={classes.buttonContainer}>
					<Button
						text={t('common.buttons.accept')}
						color='primary'
						size='large'
						variant='contained'
						className={classes.button}
						onClick={handleCloseDialog}
					/>
				</Grid>
			</DialogContent>
		</Dialog>
	)
}
export default WarningDialog
