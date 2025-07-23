import React from 'react'
import { useTranslation } from 'react-i18next'

import { Grid, Checkbox, withStyles } from '@material-ui/core'

import useStyles from './DynamicLegend.styles'
import { CheckboxProps } from '@material-ui/core/Checkbox';
import conIcon from '../../../../../../assets/icons/cadena.svg'

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

const GreyCheckbox = withStyles({
  root: {
    color: 'rgba(191, 184, 174, 1)',
    '&$checked': {
      color: 'rgba(191, 184, 174, 1)',
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color='default' {...props} />);

const DynamicLegend = (props: any) => {

  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    state,
    setState,
    disabledCheckbox,
    tipoUsuario,
    compare,
    setTopLegendYear
  } = props

  const checkChecked = () => {
    if (state.checked0) {
      return 'checked0'
    } else if (state.checked1) {
      return 'checked1'
    } else if (state.checked2) {
      return 'checked2'
    } else if (state.checked3) {
      return 'checked3'
    } else if (state.checked4) {
      return 'checked4'
    } else if (state.checked5) {
      return 'checked5'
    } else if (state.checked6) {
      return 'checked6'
    } else {
      return ''
    }
  };

  const handleChange = (event) => {
    if (compare) {
      if (event.target.name === 'checked0') {
        setTopLegendYear('(P0) ')
      } else if (event.target.name === 'checked1') {
        setTopLegendYear('(P1) ')
      } else if (event.target.name === 'checked2') {
        setTopLegendYear('(P2) ')
      } else if (event.target.name === 'checked3') {
        setTopLegendYear('(P3) ')
      } else if (event.target.name === 'checked4') {
        setTopLegendYear('(P4) ')
      } else if (event.target.name === 'checked5') {
        setTopLegendYear('(P5) ')
      } else if (event.target.name === 'checked6') {
        setTopLegendYear('(P6) ')
      }
      let lastChecked = checkChecked()
      if (lastChecked !== event.target.name) {
        setState({ ...state, [lastChecked]: false, [event.target.name]: event.target.checked});
      }
    } else {
      setState({ ...state, [event.target.name]: event.target.checked});
    }
  };

  return (
    <Grid container item md={12} className={classes.container} >
      <Grid item md={12} className={classes.itemContainer}>
        <Checkbox
          disabled
          defaultChecked
          color='primary'
          inputProps={{ 'aria-label': 'disabled checked checkbox' }}
        />
        {!compare ? t('supplies.suppliesDetails.components.maxPowerEstimated.charts.legend.selectAllPeriods') : t('supplies.suppliesDetails.components.maxPowerEstimated.charts.legend.compareText')}
      </Grid>
      <Grid item className={classes.itemContainer}>
        <GreyCheckbox checked={state.checked0} onChange={handleChange} name='checked0' disabled={disabledCheckbox.disabled0}/> 
        <span className={classes.span}>{t('supplies.suppliesDetails.components.maxPowerEstimated.charts.legend.dlSimpleP0')}</span>
      </Grid>
      <Grid item className={classes.itemContainer}>
        <RedCheckbox checked={state.checked1} onChange={handleChange} name='checked1' disabled={disabledCheckbox.disabled1}/>
        {tipoUsuario === 'complejo' ?
          <span className={classes.span}>{'P1'}</span>
        :
          <span className={classes.span}>{t('supplies.suppliesDetails.components.maxPowerEstimated.charts.legend.dlSimpleP1')}</span>
        }
      </Grid>
      {tipoUsuario === 'simple' &&
        <img src={conIcon} alt='' className={classes.linkContainer}/>
      }
      <Grid item className={classes.itemContainer}>
        {tipoUsuario === 'complejo' ?
          <OrangeCheckbox checked={state.checked2} onChange={handleChange} name='checked2' disabled={disabledCheckbox.disabled2}/>
        :
          <YellowCheckbox checked={state.checked2} onChange={handleChange} name='checked2' disabled={disabledCheckbox.disabled2}/>
        }
        {tipoUsuario === 'complejo' ?
          <span className={classes.span}>{'P2'}</span>
        :
          <span className={classes.span}>{t('supplies.suppliesDetails.components.maxPowerEstimated.charts.legend.dlSimpleP2')}</span>
        }
      </Grid>
      <Grid item className={classes.itemContainer}>
        {tipoUsuario === 'complejo' ?
          <YellowCheckbox checked={state.checked3} onChange={handleChange} name='checked3' disabled={disabledCheckbox.disabled3}/>
        :
          <BlueCheckbox checked={state.checked3} onChange={handleChange} name='checked3' disabled={disabledCheckbox.disabled3}/>
        }
        {tipoUsuario === 'complejo' ?
          <span className={classes.span}>{'P3'}</span>
        :
          <span className={classes.span}>{t('supplies.suppliesDetails.components.maxPowerEstimated.charts.legend.dlSimpleP3')}</span>
        }
      </Grid>
      {tipoUsuario === 'complejo' &&
        <Grid item className={classes.itemContainer}>
          <GreenCheckbox checked={state.checked4} onChange={handleChange} name='checked4' disabled={disabledCheckbox.disabled4}/>
          <span className={classes.span}>{'P4'}</span>
        </Grid>
      }
      {tipoUsuario === 'complejo' &&
        <Grid item className={classes.itemContainer}>
          <DarkGreenCheckbox checked={state.checked5} onChange={handleChange} name='checked5' disabled={disabledCheckbox.disabled5}/>
          <span className={classes.span}>{'P5'}</span>
        </Grid>
      }
      {tipoUsuario === 'complejo' &&
        <Grid item className={classes.itemContainer}>
          <BlueCheckbox checked={state.checked6} onChange={handleChange} name='checked6' disabled={disabledCheckbox.disabled6}/>
          <span className={classes.span}>{'P6'}</span>
        </Grid>
      }
    </Grid>
  )
}

export default DynamicLegend