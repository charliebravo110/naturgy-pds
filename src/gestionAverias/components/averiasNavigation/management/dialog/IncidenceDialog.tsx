import React, { useState } from 'react'
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

const IncidenceDialog = (props: any) => {
	const classes = useStyles({})
	const { t } = useTranslation();
	const { showingDialog, setShowingDialog, warning } = props

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

	return (
		<Dialog className={classes.dialog} open={showingDialog} onClose={handleCloseDialog}>
			<DialogContent className={classes.dialogContainer}>
				<img src={CloseIcon} className={classes.closeButton} alt='' onClick={handleCloseDialog} />
				<Grid container className={classes.title}>
					<Typography className={classes.title}>{t('averias.management.consult.warningDetail')}</Typography>
				</Grid>
				<Grid container className={classes.topContainer}>
					<Grid container className={classes.inTopContainer}>
						<Grid item md={6} sm={12} xs={12}><a className={classes.subTitle}>{t('averias.management.consult.columnCentro')}</a> {warning.centro}</Grid>
						{
							warning.cups !== '' &&
							<Grid item md={6} sm={12} xs={12}><a className={classes.subTitle}>{t('averias.management.consult.cups')}</a> {warning.cups}</Grid>
						}
					</Grid>
					<Grid container className={classes.line} />
					<Grid container className={classes.inTopContainer}>
						<Grid item md={4} sm={12} xs={12}>
							<Typography className={classes.subTitle}>{t('averias.management.consult.columnTipo')}</Typography>
							<img src={CloseIcon} /> {
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
							<img src={warning.tipo === '1' ? AlcanceCasa : warning.tipo === '2' ? AlcancePortal : warning.tipo === '3' ? AlcanceBloque : warning.tipo === '4' ? AlcanceCalle : warning.tipo === '5' ? AlcanceMunicipio : ''} />
							{warning.tipo === '1' ?
								t('averias.management.consult.casa')
								:
								warning.tipo === '2' ?
									t('averias.management.consult.portal')
									:
									warning.tipo === '3' ?
										t('averias.management.consult.bloque')
										:
										warning.tipo === '4' ?
											t('averias.management.consult.calle')
											:
											warning.tipo === '5' ?
												t('averias.management.consult.municipio')
												:
												''
							}
						</Grid>
						<Grid item md={4} sm={12} xs={12}>
							<Typography className={classes.subTitle}>{t('averias.management.consult.fechaPrevista')}</Typography>
							{AveriasUtils.FormatDateAveriasPantalla(warning.fecha)}
						</Grid>
					</Grid>
				</Grid>
				<Grid container className={classes.expansionContainer}>
					<ExpansionPanel expanded={expandCups}>
						<ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />} IconButtonProps={{ onClick: togglePanelCups }}>
							<img className={classes.expansionPanelSummaryIcon} src={Seguimiento} alt='' />
							<Typography className={classes.expansionPanelSummaryText}>{t('averias.management.consult.seguimiento')}</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							<Grid item md={12} sm={12} xs={12}>
								[]
							</Grid>
						</ExpansionPanelDetails>
					</ExpansionPanel>
				</Grid>
				<Grid container className={classes.expansionContainer}>
					<ExpansionPanel expanded={expandObservations}>
						<ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />} IconButtonProps={{ onClick: togglePanelObservations }}>
							<img className={classes.expansionPanelSummaryIcon} src={Observaciones} alt='' />
							<Typography className={classes.expansionPanelSummaryText}>{t('averias.management.consult.observations')}</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails>
							<Grid item md={12} sm={12} xs={12}>
								<Typography className={classes.subTitle2}>{t('averias.management.consult.incidenceObservations')}</Typography>
							</Grid>
							<Grid item md={12} sm={12} xs={12} className={classes.observationsContainer}>
								<a className={classes.inObsContainer}>{warning.observaciones}</a>
							</Grid>
							<Grid item md={12} sm={12} xs={12}>
								<Typography className={classes.subTitle2}>{t('averias.management.consult.corObservations')}</Typography>
							</Grid>
							<Grid item md={12} sm={12} xs={12} className={classes.observationsContainer}>
								<a className={classes.inObsContainer}>{warning.observaciones}</a>
							</Grid>
						</ExpansionPanelDetails>
					</ExpansionPanel>
				</Grid>
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

export default IncidenceDialog
