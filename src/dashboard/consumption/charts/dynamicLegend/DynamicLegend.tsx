import React from 'react'
import { useTranslation } from 'react-i18next'

import { Grid, Checkbox, withStyles } from '@material-ui/core'

import useStyles from './DynamicLegend.styles'
import { CheckboxProps } from '@material-ui/core/Checkbox';

//TODO cambiar nimbre ya que no se corresponde a su color de verdad debido a cambios de última hora
const GreenBlueCheckbox = withStyles({
  root: {
    color: '#009aa6',
    '&$checked': {
      color: '#009aa6',
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color='default' {...props} />);

const DarkGreenBlueCheckbox = withStyles({
  root: {
    color: '#d7af05',
    '&$checked': {
      color: '#d7af05',
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color='default' {...props} />);

const GreenCheckbox = withStyles({
  root: {
    color: '#a2ad00',
    '&$checked': {
      color: '#a2ad00',
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color='default' {...props} />);

const DarkGreenCheckbox = withStyles({
  root: {
    color: '#6fcf97',
    '&$checked': {
      color: '#6fcf97',
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color='default' {...props} />);

const BlueCheckbox = withStyles({
  root: {
    color: '#0066cc',
    '&$checked': {
      color: '#0066cc',
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color='default' {...props} />);

const DBlueCheckbox = withStyles({
  root: {
    color: '#8217e5',
    '&$checked': {
      color: '#8217e5',
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

const DarkOrangeCheckbox = withStyles({
  root: {
    color: '#56ccf2',
    '&$checked': {
      color: '#56ccf2',
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color='default' {...props} />);

const DarkBlueCheckbox = withStyles({
  root: {
    color: '#004571',
    '&$checked': {
      color: '#004571',
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color='default' {...props} />);

const DDarkBlueCheckbox = withStyles({
  root: {
    color: '#4e7e17',
    '&$checked': {
      color: '#4e7e17',
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color='default' {...props} />);

const PurpleCheckbox = withStyles({
  root: {
    color: '#bb6bd9',
    '&$checked': {
      color: '#bb6bd9',
    },
  },
  checked: {},
})((props: CheckboxProps) => <Checkbox color='default' {...props} />);

const GarnetCheckbox = withStyles({
  root: {
    color: '#b5474c',
    '&$checked': {
      color: '#b5474c',
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
    containValue
  } = props

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.checked });
  };

  return (

    <Grid container className={classes.container2} >

      {
        containValue.EHCR &&
        <Grid item md={12} xs={12} className={classes.itemContainer3}>
          <GreenBlueCheckbox checked={state.checkedEHCR} onChange={handleChange} name='checkedEHCR' />
          <span className={classes.span}>{t('supplies.suppliesDetails.components.consumption.charts.legend.EHCR')}</span>
        </Grid>
      }

      {
        containValue.EHAC &&
        <Grid item md={12} xs={12} className={classes.itemContainer3}>
          <GreenCheckbox checked={state.checkedEHAC} onChange={handleChange} name='checkedEHAC' />
          <span className={classes.span}>{t('supplies.suppliesDetails.components.consumption.charts.legend.EHAC')}</span>
        </Grid>
      }

      {
        containValue.EHCCA &&
        <Grid item md={12} xs={12} className={classes.itemContainer3}>
          <BlueCheckbox checked={state.checkedEHCCA} onChange={handleChange} name='checkedEHCCA' />
          <span className={classes.span}>{t('supplies.suppliesDetails.components.consumption.charts.legend.EHCCA')}</span>
        </Grid>
      }

      {
        containValue.EHEX &&
        <Grid item md={12} xs={12} className={classes.itemContainer3}>
          <OrangeCheckbox checked={state.checkedEHEX} onChange={handleChange} name='checkedEHEX' />
          <span className={classes.span}>{t('supplies.suppliesDetails.components.consumption.charts.legend.EHEX')}</span>
        </Grid>
      }

      {
        containValue.EHNG &&
        <Grid item md={12} xs={12} className={classes.itemContainer3}>
          <DarkBlueCheckbox checked={state.checkedEHNG} onChange={handleChange} name='checkedEHNG' />
          <span className={classes.span}>{t('supplies.suppliesDetails.components.consumption.charts.legend.EHNG')}</span>
        </Grid>
      }

      {
        containValue.EHCSA &&
        <Grid item md={12} xs={12} className={classes.itemContainer3}>
          <PurpleCheckbox checked={state.checkedEHCSA} onChange={handleChange} name='checkedEHCSA' />
          <span className={classes.span}>{t('supplies.suppliesDetails.components.consumption.charts.legend.EHCSA')}</span>
        </Grid>
      }

      {
        containValue.EHCRi &&
        <Grid item md={12} xs={12} className={classes.itemContainer3}>
          <DarkGreenBlueCheckbox checked={state.checkedEHCRi} onChange={handleChange} name='checkedEHCRi' />
          <span className={classes.span}>{t('supplies.suppliesDetails.components.consumption.charts.legend.EHCRi')}</span>
        </Grid>
      }

      {
        containValue.EHACi &&
        <Grid item md={12} xs={12} className={classes.itemContainer3}>
          <DarkGreenCheckbox checked={state.checkedEHACi} onChange={handleChange} name='checkedEHACi' />
          <span className={classes.span}>{t('supplies.suppliesDetails.components.consumption.charts.legend.EHACi')}</span>
        </Grid>
      }

      {
        containValue.EHCi &&
        <Grid item md={12} xs={12} className={classes.itemContainer3}>
          <DBlueCheckbox checked={state.checkedEHCi} onChange={handleChange} name='checkedEHCi' />
          <span className={classes.span}>{t('supplies.suppliesDetails.components.consumption.charts.legend.EHCi')}</span>
        </Grid>
      }

      {
        containValue.EHEXi &&
        <Grid item md={12} xs={12} className={classes.itemContainer3}>
          <DarkOrangeCheckbox checked={state.checkedEHEXi} onChange={handleChange} name='checkedEHEXi' />
          <span className={classes.span}>{t('supplies.suppliesDetails.components.consumption.charts.legend.EHEXi')}</span>
        </Grid>
      }

      {
        containValue.EHNGi &&
        <Grid item md={12} xs={12} className={classes.itemContainer3}>
          <GarnetCheckbox checked={state.checkedEHNGi} onChange={handleChange} name='checkedEHNGi' />
          <span className={classes.span}>{t('supplies.suppliesDetails.components.consumption.charts.legend.EHNGi')}</span>
        </Grid>
      }

      {
        containValue.EHEXG &&
        <Grid item md={12} xs={12} className={classes.itemContainer3}>
          <DDarkBlueCheckbox checked={state.checkedEHEXG} onChange={handleChange} name='checkedEHEXG' />
          <span className={classes.span}>{t('supplies.suppliesDetails.components.consumption.charts.legend.EHEXG')}</span>
        </Grid>
      }

    </Grid>
  )
}

export default DynamicLegend