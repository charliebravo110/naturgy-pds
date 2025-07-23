import React from 'react'
import { useTranslation } from 'react-i18next'

import { Grid, Checkbox, withStyles } from '@material-ui/core'

import useStyles from './DynamicLegend.styles'
import { CheckboxProps } from '@material-ui/core/Checkbox';

const RedCheckbox = withStyles({
  root: {
    color: '#d3222a',
    '&$checked': {
      color: '#d3222a',
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color='default' {...props} />);

const OrangeCheckbox = withStyles({
  root: {
    color: '#e57200',
    '&$checked': {
      color: '#e57200',
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color='default' {...props} />);

const YellowCheckbox = withStyles({
  root: {
    color: '#edab46',
    '&$checked': {
      color: '#edab46',
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color='default' {...props} />);

const GreenCheckbox = withStyles({
  root: {
    color: '#bfbf60',
    '&$checked': {
      color: '#bfbf60',
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color='default' {...props} />);

const DarkGreenCheckbox = withStyles({
  root: {
    color: '#5fad83',
    '&$checked': {
      color: '#5fad83',
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color='default' {...props} />);

const BlueCheckbox = withStyles({
  root: {
    color: '#009aa6',
    '&$checked': {
      color: '#009aa6',
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color='default' {...props} />);

const DarkBlueCheckbox = withStyles({
  root: {
    color: 'rgba(0, 69, 113, 1)',
    '&$checked': {
      color: 'rgba(0, 69, 113, 1)',
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color='default' {...props} />);

const GreyCheckbox = withStyles({
  root: {
    color: 'rgba(191, 184, 174, 1)',
    '&$checked': {
      color: 'rgba(191, 184, 174, 1)',
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color='default' {...props} />);

const DynamicLegendConsumptions = (props: any) => {

  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    state,
    setState,
    tipoUsuario,
    disabledCheckbox
  } = props

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked});
  };

  return (
    <Grid container item md={12} className={classes.container}>
      <Grid container item md={12} className={classes.titleContainer}>
        {t('Puedes marcar y desmarcar un periodo de energía para visualizarlo en la gráfica')}
      </Grid>
			<Grid container>
				<Grid item md={4} className={classes.itemContainer}>
					<DarkBlueCheckbox checked={state.checked0} onChange={handleChange} name='checked0' disabled={disabledCheckbox.disabled0}/>
					<span className={classes.span}>{t('Consumo (tarifa anterior) (kWh)')}</span>
				</Grid>
				<Grid item md={1} xs={3} className={classes.itemContainer2}>
					<hr style={{borderTop: 2, borderBottom: 2, borderStyle: 'dashed', borderColor: '#0066CC', width: '70%'}}/>
				</Grid>
				<Grid item md={3} className={classes.itemContainer2}>
					<span className={classes.span}>{t('Consumo medio')}</span>
				</Grid>
			</Grid>
			{tipoUsuario === 'simple' ?
			<>
				<Grid item md={4}>
					<RedCheckbox checked={state.checked1} onChange={handleChange} name='checked1' disabled={disabledCheckbox.disabled1}/>
						<span className={classes.span}>{t('Consumo en periodo punta (kWh)')}</span>
				</Grid>
				<Grid item md={4}>
					<YellowCheckbox checked={state.checked2} onChange={handleChange} name='checked2' disabled={disabledCheckbox.disabled2}/>
						<span className={classes.span}>{t('Consumo en periodo llano (kWh)')}</span>
				</Grid>
				<Grid item md={4}>
					<BlueCheckbox checked={state.checked3} onChange={handleChange} name='checked3' disabled={disabledCheckbox.disabled3}/>
						<span className={classes.span}>{t('Consumo en periodo valle (kWh)')}</span>
				</Grid>
			</>
			:
			<>
				<Grid item md={4}>
					<RedCheckbox checked={state.checked1} onChange={handleChange} name='checked1' disabled={disabledCheckbox.disabled1}/>
						<span className={classes.span}>{t('Consumo en P1 (kWh)')}</span>
				</Grid>
				<Grid item md={4}>
					<OrangeCheckbox checked={state.checked2} onChange={handleChange} name='checked2' disabled={disabledCheckbox.disabled2}/>
						<span className={classes.span}>{t('Energía consumida en P2 (kWh)')}</span>
				</Grid>
				<Grid item md={4}>
					<YellowCheckbox checked={state.checked3} onChange={handleChange} name='checked3' disabled={disabledCheckbox.disabled3}/>
						<span className={classes.span}>{t('Energía consumida en P3 (kWh)')}</span>
				</Grid>
				<Grid item md={4}>
					<GreenCheckbox checked={state.checked4} onChange={handleChange} name='checked4' disabled={disabledCheckbox.disabled4}/>
						<span className={classes.span}>{t('Consumo en P4 (kWh)')}</span>
				</Grid>
				<Grid item md={4}>
					<DarkGreenCheckbox checked={state.checked5} onChange={handleChange} name='checked5' disabled={disabledCheckbox.disabled5}/>
						<span className={classes.span}>{t('Energía consumida en P5 (kWh)')}</span>
				</Grid>
				<Grid item md={4}>
					<BlueCheckbox checked={state.checked6} onChange={handleChange} name='checked6' disabled={disabledCheckbox.disabled6}/>
						<span className={classes.span}>{t('Energía consumida en P6 (kWh)')}</span>
				</Grid>
			</>
			}
    </Grid>
  )
}

export default DynamicLegendConsumptions