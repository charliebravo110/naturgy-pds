import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Dialog from '../../../../../common/components/dialog/Dialog'
import Button from '../../../../../common/components/button/Button'
import CloseIcon from '../../../../../assets/icons/cerrar.svg'
import Observaciones from '../../../../../assets/icons/observaciones.svg'
import Seguimiento from '../../../../../assets/icons/seguimiento.svg'

import Incidencia2 from '../../../../../assets/icons/icono_rojo_incidencia.svg'
import Programada from '../../../../../assets/icons/icono_azul_programada.svg'
import Aviso from '../../../../../assets/icons/icono_naranja_aviso.svg'
import AveriasUtils from '../../../../utils/AveriasUtilsClass'

import Grid from '@material-ui/core/Grid'
import { DialogContent, useMediaQuery } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'

import List from '../list/ListSeguimiento'

import useStyles, {
	ExpansionPanel,
	ExpansionPanelSummary,
	StyledExpandMoreIcon,
	ExpansionPanelDetails
} from './Dialog.styles';
import MosaicSeguimiento from '../list/MosaicSeguimiento';

const NetIncidenceDialog = (props: any) => {
	const classes = useStyles({})
	const { t } = useTranslation();
	const { showingDialog, setShowingDialog, incidence } = props
	const mobileRes = useMediaQuery('(max-width:576px)')

	const handleCloseDialog = () => {
		setShowingDialog(false)
	}

	const [expandObservations, setExpandObservations] = useState(true)
	const [expandSeguimiento, setExpandSeguimiento] = useState(true)
	const togglePanelObservations = () => {
		setExpandObservations((prev) => !prev)
	}
	const togglePanelSeguimiento = () => {
		setExpandSeguimiento((prev) => !prev)
	}

	const [listaSeguimiento, setListaSeguimiento] = useState([] as any)

	const [totalPages, setTotalPages] = useState(0)
	const [currentPage, setCurrentPage] = useState(0)
	const [itemsPerPage, setItemsPerPage] = useState(20)


	//Creamos la lista de seguimiento de ser necesario
	if (incidence.incidenceState && listaSeguimiento.length === 0) {
		let auxList = []
		let auxStatus = incidence.seguimientoIncidencia.toString().split(',')
		let auxDates = incidence.seguimientoFechas.toString().split(',')
		let auxObs = incidence.seguimientoObservaciones.toString().split('|')
		let auxObj

		for (let i = 0; i < auxStatus.length; i++) {
			auxObj = {
				estado: auxStatus[i] ? auxStatus[i] : '',
				fecha: AveriasUtils.FormatDateAveriasPantalla(auxDates[i] ? auxDates[i] : ''),
				obs: auxObs[i] ? auxObs[i] : ''
			}

			auxList.push(auxObj)
		}
		setListaSeguimiento(auxList)
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
		}
	}

	const setIcon2 = (incidence: any) => {
		if (incidence.programada === 'Si') {
			return Programada
		} else if (incidence.code !== '') {
			return Incidencia2
		} else {
			return Aviso
		}
	}

	const setType = (incidence: any) => {
		if (incidence.programada === 'Si') {
			return t('averias.management.consult.corteProgramado')
		} else if (incidence.code !== '') {
			return t('averias.management.consult.avisoIncidencia')
		} else {
			return t('averias.management.consult.aviso')
		}
	}

	useEffect(() => {
		setTotalPages(listaSeguimiento.length === 0 ? 1 : Math.ceil(listaSeguimiento.length / itemsPerPage))
		// eslint-disable-next-line
	}, [listaSeguimiento, itemsPerPage])

	return (
		<Dialog className={classes.dialog} open={showingDialog} onClose={handleCloseDialog}>
			<DialogContent className={classes.dialogContainer}>
				<img src={CloseIcon} className={classes.closeButton} alt='' onClick={handleCloseDialog} />
				<Grid container className={classes.title}>
					<Typography className={classes.title}>{t('averias.management.consult.incidenceDetail')}</Typography>
				</Grid>
				<Grid container className={classes.topContainer}>
					<Grid container className={classes.inTopContainer}>
						<img className={classes.expansionPanelSummaryIcon} src={setIcon2(incidence)} alt='' />
						<Grid item md={11} sm={12} xs={12}>
							<Typography className={classes.expansionPanelSummaryText}>{setType(incidence)}<a>{'  ' + AveriasUtils.FormatCodDescField(incidence.incidenceState, getStatus(incidence.incidenceState))}</a></Typography>
						</Grid>
					</Grid>
					<Grid container className={classes.line} />
					<Grid container className={classes.inTopContainer}>
						<Grid container>
							<Grid item md={3} sm={12} xs={12}>
								<Typography className={classes.subTitle}>{t('averias.management.consult.codigo')}</Typography>
								{incidence.incidenceCode}
							</Grid>
							<Grid item md={3} sm={12} xs={12}>
								<Typography className={classes.subTitle}>{t('averias.management.consult.description')}</Typography>
								{incidence.observacionesCor}
							</Grid>
						</Grid>
						<Grid item md={3} sm={12} xs={12}>
							<Typography className={classes.subTitle}>{t('averias.management.consult.columnCentro')}</Typography>
							{incidence.centrolIncidencia}
						</Grid>
						<Grid item md={3} sm={12} xs={12}>
							<Typography className={classes.subTitle}>{t('averias.management.consult.instalacionOrigen')}</Typography>
							{AveriasUtils.FormatCodDescField(incidence.origin, incidence.originDesc)}
						</Grid>
						<Grid item md={3} sm={12} xs={12}>
							<Typography className={classes.subTitle}>{t('averias.management.consult.TensionLevel')}</Typography>
							{incidence.tensionLevel}
						</Grid>
						<Grid item md={3} sm={12} xs={12}>
							<Typography className={classes.subTitle}>{t('averias.management.consult.numInterrupciones')}</Typography>
							{AveriasUtils.FormatTextField(incidence.numeroInterrupciones)}
						</Grid>
						<Grid item md={3} sm={12} xs={12}>
							<Typography className={classes.subTitle}>{t('averias.management.consult.columnStartDate')}</Typography>
							{AveriasUtils.FormatDateAveriasPantalla(incidence.fechaDeteccion)}
						</Grid>
						<Grid item md={3} sm={12} xs={12}>
							<Typography className={classes.subTitle}>{t('averias.management.consult.instalacionAfectada')}</Typography>
							{incidence.instalacionAfectada}
						</Grid>
						<Grid item md={3} sm={12} xs={12}>
							<Typography className={classes.subTitle}>{t('averias.management.consult.duracion')}</Typography>
							{incidence.duracion}
						</Grid>
						<Grid item md={3} sm={12} xs={12}>
							<Typography className={classes.subTitle}>{t('averias.management.consult.potenciaAfectado')}</Typography>
							{AveriasUtils.FormatTextField(incidence.potenciaAfectada)}
						</Grid>
						<Grid item md={3} sm={12} xs={12}>
							<Typography className={classes.subTitle}>{t('averias.management.consult.fechaPrevista')}</Typography>
							{AveriasUtils.FormatDateAveriasPantalla(incidence.fechaPrevistaResolucion)}
						</Grid>
						<Grid item md={3} sm={12} xs={12}>
							<Typography className={classes.subTitle}>{t('averias.management.consult.tipoIncidencia')}</Typography>
							{incidence.motivoFinalizaciónIncidencia}
						</Grid>
						<Grid item md={3} sm={12} xs={12}>
							<Typography className={classes.subTitle}>{t('averias.management.consult.NumeroAfectados')}</Typography>
							{AveriasUtils.FormatTextField(incidence.numeroAfectados)}
						</Grid>
						<Grid item md={3} sm={12} xs={12}>
							<Typography className={classes.subTitle}>{t('averias.management.consult.programada')}</Typography>
							{incidence.programada}
						</Grid>
					</Grid>
				</Grid>
				<Grid container className={classes.expansionContainer}>
					<ExpansionPanel expanded={expandObservations}>
						<ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />} IconButtonProps={{ onClick: togglePanelObservations }}>
							<img className={classes.expansionPanelSummaryIcon} src={Observaciones} alt='' />
							<Typography className={classes.expansionPanelSummaryText}>{t('averias.management.consult.observations')}</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							{/*<Grid item md={12} sm={12} xs={12}>
								<Typography className={classes.subTitle2}>{t('averias.management.consult.incidenceObservations')}</Typography>
							</Grid>
							<Grid item md={12} sm={12} xs={12} className={classes.observationsContainer}>
								<a className={classes.inObsContainer}>{[]}</a>
							</Grid>*/}
							<Grid item md={12} sm={12} xs={12}>
								<Typography className={classes.subTitle2}>{t('averias.management.consult.corObservations')}</Typography>
							</Grid>
							<Grid item md={12} sm={12} xs={12} className={classes.observationsContainer}>
								<a className={classes.inObsContainer}>{incidence.observacionesIncidencia}</a>
							</Grid>
						</ExpansionPanelDetails>
					</ExpansionPanel>
				</Grid>
				<Grid container className={classes.expansionContainer}>
					<ExpansionPanel expanded={expandSeguimiento}>
						<ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />} IconButtonProps={{ onClick: togglePanelSeguimiento }}>
							<img className={classes.expansionPanelSummaryIcon} src={Seguimiento} alt='' />
							<Typography className={classes.expansionPanelSummaryText}>{t('averias.management.consult.seguimiento')}</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							<Grid item md={12} sm={12} xs={12} className={classes.table}>
								{(mobileRes ? 
								<MosaicSeguimiento listItems={listaSeguimiento} setFinalList={setListaSeguimiento} currentPage={currentPage} setCurrentPage={setCurrentPage} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} totalPages={totalPages} /> 
							:
							<List listItems={listaSeguimiento} setFinalList={setListaSeguimiento} currentPage={currentPage} setCurrentPage={setCurrentPage} itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage} totalPages={totalPages} />
								)}
							
								
							</Grid>
						</ExpansionPanelDetails>
					</ExpansionPanel>
				</Grid>
				<Grid container className={classes.buttonContainer}>
					<Button
						text={t('common.buttons.close')}
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

export default NetIncidenceDialog
