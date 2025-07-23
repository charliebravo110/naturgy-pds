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
    containValue,
    compare,
    consumptionsFilters,
    mode
  } = props

  const handleChange = (event) => {
    if (event.target.name === 'checkedALL') {
      if (event.target.checked) {
        setState({
          ...state,
          [event.target.name]: event.target.checked,
          checkedEHCR: true,
          checkedEHAC: true,
          checkedEHCCA: true,
          checkedEHEX: true,
          checkedEHNG: true,
          checkedEHCSA: true,
          checkedEHCRi: true,
          checkedEHACi: true,
          checkedEHCi: true,
          checkedEHEXi: true,
          checkedEHNGi: true,
          checkedEHEXG: true
        });
      } else {
        setState({
          ...state,
          [event.target.name]: event.target.checked,
          checkedEHCR: false,
          checkedEHAC: false,
          checkedEHCCA: false,
          checkedEHEX: false,
          checkedEHNG: false,
          checkedEHCSA: false,
          checkedEHCRi: false,
          checkedEHACi: false,
          checkedEHCi: false,
          checkedEHEXi: false,
          checkedEHNGi: false,
          checkedEHEXG: false
        });
      }
    } else {
      //if cuando están todos marcados
      if (allChecked()) {
        setState({
          ...state,
          [event.target.name]: event.target.checked,
          checkedALL: false
        });
        //else cuando no están todos marcados
      } else {
        //if cuando van a estar todos marcados
        if (allBeChecked(event)) {
          setState({
            ...state,
            [event.target.name]: event.target.checked,
            checkedALL: true
          });
          //else cuando no van a estar todos marcados
        } else {
          setState({ ...state, [event.target.name]: event.target.checked });
        }
      }
    }
  };

  //función para comprobar si están todos marcados
  const allChecked = () => {
    if (state.checkedEHCR && state.checkedEHAC && state.checkedEHCCA && state.checkedEHEX && state.checkedEHNG && state.checkedEHCSA && state.checkedEHCRi && state.checkedEHACi && state.checkedEHCi && state.checkedEHEXi && state.checkedEHNGi && state.checkedEHEXG) {
      return true
    } else {
      return false
    }
  };

  //función para comprabar si estarán todos marcados
  const allBeChecked = (event) => {
    switch (event.target.name) {
      case 'checkedEHCR':
        if (state.checkedEHAC && state.checkedEHCCA && state.checkedEHEX && state.checkedEHNG && state.checkedEHCSA && state.checkedEHCRi && state.checkedEHACi && state.checkedEHCi && state.checkedEHEXi && state.checkedEHNGi && state.checkedEHEXG) {
          return true
        } else {
          return false
        }
      case 'checkedEHAC':
        if (state.checkedEHCR && state.checkedEHCCA && state.checkedEHEX && state.checkedEHNG && state.checkedEHCSA && state.checkedEHCRi && state.checkedEHACi && state.checkedEHCi && state.checkedEHEXi && state.checkedEHNGi && state.checkedEHEXG) {
          return true
        } else {
          return false
        }
      case 'checkedEHCCA':
        if (state.checkedEHCR && state.checkedEHAC && state.checkedEHEX && state.checkedEHNG && state.checkedEHCSA && state.checkedEHCRi && state.checkedEHACi && state.checkedEHCi && state.checkedEHEXi && state.checkedEHNGi && state.checkedEHEXG) {
          return true
        } else {
          return false
        }
      case 'checkedEHEX':
        if (state.checkedEHCR && state.checkedEHAC && state.checkedEHCCA && state.checkedEHNG && state.checkedEHCSA && state.checkedEHCRi && state.checkedEHACi && state.checkedEHCi && state.checkedEHEXi && state.checkedEHNGi && state.checkedEHEXG) {
          return true
        } else {
          return false
        }
      case 'checkedEHNG':
        if (state.checkedEHCR && state.checkedEHAC && state.checkedEHCCA && state.checkedEHEX && state.checkedEHCSA && state.checkedEHCRi && state.checkedEHACi && state.checkedEHCi && state.checkedEHEXi && state.checkedEHNGi && state.checkedEHEXG) {
          return true
        } else {
          return false
        }
      case 'checkedEHCSA':
        if (state.checkedEHCR && state.checkedEHAC && state.checkedEHCCA && state.checkedEHEX && state.checkedEHNG && state.checkedEHCRi && state.checkedEHACi && state.checkedEHCi && state.checkedEHEXi && state.checkedEHNGi && state.checkedEHEXG) {
          return true
        } else {
          return false
        }
      case 'checkedEHCRi':
        if (state.checkedEHCR && state.checkedEHAC && state.checkedEHCCA && state.checkedEHEX && state.checkedEHNG && state.checkedEHCSA && state.checkedEHACi && state.checkedEHCi && state.checkedEHEXi && state.checkedEHNGi && state.checkedEHEXG) {
          return true
        } else {
          return false
        }
      case 'checkedEHACi':
        if (state.checkedEHCR && state.checkedEHAC && state.checkedEHCCA && state.checkedEHEX && state.checkedEHNG && state.checkedEHCSA && state.checkedEHCRi && state.checkedEHCi && state.checkedEHEXi && state.checkedEHNGi && state.checkedEHEXG) {
          return true
        } else {
          return false
        }
      case 'checkedEHCi':
        if (state.checkedEHCR && state.checkedEHAC && state.checkedEHCCA && state.checkedEHEX && state.checkedEHNG && state.checkedEHCSA && state.checkedEHCRi && state.checkedEHACi && state.checkedEHEXi && state.checkedEHNGi && state.checkedEHEXG) {
          return true
        } else {
          return false
        }
      case 'checkedEHEXi':
        if (state.checkedEHCR && state.checkedEHAC && state.checkedEHCCA && state.checkedEHEX && state.checkedEHNG && state.checkedEHCSA && state.checkedEHCRi && state.checkedEHACi && state.checkedEHCi && state.checkedEHNGi && state.checkedEHEXG) {
          return true
        } else {
          return false
        }
      case 'checkedEHNGi':
        if (state.checkedEHCR && state.checkedEHAC && state.checkedEHCCA && state.checkedEHEX && state.checkedEHNG && state.checkedEHCSA && state.checkedEHCRi && state.checkedEHACi && state.checkedEHCi && state.checkedEHEXi && state.checkedEHEXG) {
          return true
        } else {
          return false
        }
      case 'checkedEHEXG':
        if (state.checkedEHCR && state.checkedEHAC && state.checkedEHCCA && state.checkedEHEX && state.checkedEHNG && state.checkedEHCSA && state.checkedEHCRi && state.checkedEHACi && state.checkedEHCi && state.checkedEHEXi && state.checkedEHNGi) {
          return true
        } else {
          return false
        }
    }
  };

  return (

    <Grid container className={classes.container2} >
      <Grid item md={compare && !mode ? 6 : 12} xs={12} className={classes.itemContainer3}>
        <Checkbox
          color='primary'
          checked={state.checkedALL}
          onChange={handleChange}
          name='checkedALL'
        />
        <span className={classes.span}>{t('supplies.suppliesDetails.components.consumption.charts.legend.showAll')}</span>
      </Grid>
      {
        compare && !mode &&
        <>
          <Grid item md={3} xs={12} className={classes.itemContainer3}>
            {
              consumptionsFilters.granularity === 'H' ?
                <span className={classes.span2}>{consumptionsFilters.startDate}</span>
                :
                <span className={classes.span2}>{consumptionsFilters.startDate + ' - ' + consumptionsFilters.endDate}</span>
            }

          </Grid>
          <Grid item md={3} xs={12} className={classes.itemContainer3}>
            {
              consumptionsFilters.granularity === 'H' ?
                <span className={classes.span2}>{consumptionsFilters.startDateCompare}</span>
                :
                <span className={classes.span2}>{consumptionsFilters.startDateCompare + ' - ' + consumptionsFilters.endDateCompare}</span>
            }
          </Grid>
        </>
      }
      {
        containValue.EHCR &&
        <Grid item md={6} xs={12} className={classes.itemContainer3}>
          <GreenBlueCheckbox checked={state.checkedEHCR} onChange={handleChange} name='checkedEHCR' />
          <span className={classes.span}>{t('supplies.suppliesDetails.components.consumption.charts.legend.EHCR')}</span>
        </Grid>
      }

      {
        compare && containValue.EHCR && !mode &&
        <>
          <Grid item md={3} xs={3} className={classes.itemContainer3}>
            <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'solid', borderColor: '#009aa6', width: '50%', marginLeft: 12 }} />
          </Grid>
          <Grid item md={3} xs={3} className={classes.itemContainer3}>
            <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'dashed', borderColor: '#009aa6', width: '50%', marginLeft: 12 }} />
          </Grid>
        </>
      }

      {
        containValue.EHAC &&
        <Grid item md={6} xs={12} className={classes.itemContainer3}>
          <GreenCheckbox checked={state.checkedEHAC} onChange={handleChange} name='checkedEHAC' />
          <span className={classes.span}>{t('supplies.suppliesDetails.components.consumption.charts.legend.EHAC')}</span>
        </Grid>
      }

      {
        compare && containValue.EHAC && !mode &&
        <>
          <Grid item md={3} xs={3} className={classes.itemContainer3}>
            <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'solid', borderColor: '#a2ad00', width: '50%', marginLeft: 12 }} />
          </Grid>
          <Grid item md={3} xs={3} className={classes.itemContainer3}>
            <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'dashed', borderColor: '#a2ad00', width: '50%', marginLeft: 12 }} />
          </Grid>
        </>
      }

      {
        containValue.EHCCA &&
        <Grid item md={6} xs={12} className={classes.itemContainer3}>
          <BlueCheckbox checked={state.checkedEHCCA} onChange={handleChange} name='checkedEHCCA' />
          <span className={classes.span}>{t('supplies.suppliesDetails.components.consumption.charts.legend.EHCCA')}</span>
        </Grid>
      }

      {
        compare && containValue.EHCCA && !mode &&
        <>
          <Grid item md={3} xs={3} className={classes.itemContainer3}>
            <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'solid', borderColor: '#0066cc', width: '50%', marginLeft: 12 }} />
          </Grid>
          <Grid item md={3} xs={3} className={classes.itemContainer3}>
            <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'dashed', borderColor: '#0066cc', width: '50%', marginLeft: 12 }} />
          </Grid>
        </>
      }

      {
        containValue.EHEX &&
        <Grid item md={6} xs={12} className={classes.itemContainer3}>
          <OrangeCheckbox checked={state.checkedEHEX} onChange={handleChange} name='checkedEHEX' />
          <span className={classes.span}>{t('supplies.suppliesDetails.components.consumption.charts.legend.EHEX')}</span>
        </Grid>
      }

      {
        compare && containValue.EHEX && !mode &&
        <>
          <Grid item md={3} xs={3} className={classes.itemContainer3}>
            <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'solid', borderColor: '#e57200', width: '50%', marginLeft: 12 }} />
          </Grid>
          <Grid item md={3} xs={3} className={classes.itemContainer3}>
            <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'dashed', borderColor: '#e57200', width: '50%', marginLeft: 12 }} />
          </Grid>
        </>
      }

      {
        containValue.EHNG &&
        <Grid item md={6} xs={12} className={classes.itemContainer3}>
          <DarkBlueCheckbox checked={state.checkedEHNG} onChange={handleChange} name='checkedEHNG' />
          <span className={classes.span}>{t('supplies.suppliesDetails.components.consumption.charts.legend.EHNG')}</span>
        </Grid>
      }

      {
        compare && containValue.EHNG && !mode &&
        <>
          <Grid item md={3} xs={3} className={classes.itemContainer3}>
            <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'solid', borderColor: '#004571', width: '50%', marginLeft: 12 }} />
          </Grid>
          <Grid item md={3} xs={3} className={classes.itemContainer3}>
            <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'dashed', borderColor: '#004571', width: '50%', marginLeft: 12 }} />
          </Grid>
        </>
      }

      {
        containValue.EHCSA &&
        <Grid item md={6} xs={12} className={classes.itemContainer3}>
          <PurpleCheckbox checked={state.checkedEHCSA} onChange={handleChange} name='checkedEHCSA' />
          <span className={classes.span}>{t('supplies.suppliesDetails.components.consumption.charts.legend.EHCSA')}</span>
        </Grid>
      }

      {
        compare && containValue.EHCSA && !mode &&
        <>
          <Grid item md={3} xs={3} className={classes.itemContainer3}>
            <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'solid', borderColor: '#bb6bd9', width: '50%', marginLeft: 12 }} />
          </Grid>
          <Grid item md={3} xs={3} className={classes.itemContainer3}>
            <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'dashed', borderColor: '#bb6bd9', width: '50%', marginLeft: 12 }} />
          </Grid>
        </>
      }


      {
        containValue.EHCRi &&
        <Grid item md={6} xs={12} className={classes.itemContainer3}>
          <DarkGreenBlueCheckbox checked={state.checkedEHCRi} onChange={handleChange} name='checkedEHCRi' />
          <span className={classes.span}>{t('supplies.suppliesDetails.components.consumption.charts.legend.EHCRi')}</span>
        </Grid>
      }

      {
        compare && containValue.EHCRi && !mode &&
        <>
          <Grid item md={3} xs={3} className={classes.itemContainer3}>
            <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'solid', borderColor: '#d7af05', width: '50%', marginLeft: 12 }} />
          </Grid>
          <Grid item md={3} xs={3} className={classes.itemContainer3}>
            <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'dashed', borderColor: '#d7af05', width: '50%', marginLeft: 12 }} />
          </Grid>
        </>
      }

      {
        containValue.EHACi &&
        <Grid item md={6} xs={12} className={classes.itemContainer3}>
          <DarkGreenCheckbox checked={state.checkedEHACi} onChange={handleChange} name='checkedEHACi' />
          <span className={classes.span}>{t('supplies.suppliesDetails.components.consumption.charts.legend.EHACi')}</span>
        </Grid>
      }

      {
        compare && containValue.EHACi && !mode &&
        <>
          <Grid item md={3} xs={3} className={classes.itemContainer3}>
            <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'solid', borderColor: '#6fcf97', width: '50%', marginLeft: 12 }} />
          </Grid>
          <Grid item md={3} xs={3} className={classes.itemContainer3}>
            <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'dashed', borderColor: '#6fcf97', width: '50%', marginLeft: 12 }} />
          </Grid>
        </>
      }

      {
        containValue.EHCi &&
        <Grid item md={6} xs={12} className={classes.itemContainer3}>
          <DBlueCheckbox checked={state.checkedEHCi} onChange={handleChange} name='checkedEHCi' />
          <span className={classes.span}>{t('supplies.suppliesDetails.components.consumption.charts.legend.EHCi')}</span>
        </Grid>
      }

      {
        compare && containValue.EHCi && !mode &&
        <>
          <Grid item md={3} xs={3} className={classes.itemContainer3}>
            <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'solid', borderColor: '#8217e5', width: '50%', marginLeft: 12 }} />
          </Grid>
          <Grid item md={3} xs={3} className={classes.itemContainer3}>
            <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'dashed', borderColor: '#8217e5', width: '50%', marginLeft: 12 }} />
          </Grid>
        </>
      }

      {
        containValue.EHEXi &&
        <Grid item md={6} xs={12} className={classes.itemContainer3}>
          <DarkOrangeCheckbox checked={state.checkedEHEXi} onChange={handleChange} name='checkedEHEXi' />
          <span className={classes.span}>{t('supplies.suppliesDetails.components.consumption.charts.legend.EHEXi')}</span>
        </Grid>
      }

      {
        compare && containValue.EHEXi && !mode &&
        <>
          <Grid item md={3} xs={3} className={classes.itemContainer3}>
            <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'solid', borderColor: '#56ccf2', width: '50%', marginLeft: 12 }} />
          </Grid>
          <Grid item md={3} xs={3} className={classes.itemContainer3}>
            <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'dashed', borderColor: '#56ccf2', width: '50%', marginLeft: 12 }} />
          </Grid>
        </>
      }


      {
        containValue.EHNGi &&
        <Grid item md={6} xs={12} className={classes.itemContainer3}>
          <GarnetCheckbox checked={state.checkedEHNGi} onChange={handleChange} name='checkedEHNGi' />
          <span className={classes.span}>{t('supplies.suppliesDetails.components.consumption.charts.legend.EHNGi')}</span>
        </Grid>
      }

      {
        compare && containValue.EHNGi && !mode &&
        <>
          <Grid item md={3} xs={3} className={classes.itemContainer3}>
            <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'solid', borderColor: '#b5474c', width: '50%', marginLeft: 12 }} />
          </Grid>
          <Grid item md={3} xs={3} className={classes.itemContainer3}>
            <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'dashed', borderColor: '#b5474c', width: '50%', marginLeft: 12 }} />
          </Grid>
        </>
      }

      {
        containValue.EHEXG &&
        <Grid item md={6} xs={12} className={classes.itemContainer3}>
          <DDarkBlueCheckbox checked={state.checkedEHEXG} onChange={handleChange} name='checkedEHEXG' />
          <span className={classes.span}>{t('supplies.suppliesDetails.components.consumption.charts.legend.EHEXG')}</span>
        </Grid>
      }

      {
        compare && containValue.EHEXG && !mode &&
        <>
          <Grid item md={3} xs={12} className={classes.itemContainer3}>
            <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'solid', borderColor: '#4e7e17', width: '50%', marginLeft: 12 }} />
          </Grid>
          <Grid item md={3} xs={12} className={classes.itemContainer3}>
            <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'dashed', borderColor: '#4e7e17', width: '50%', marginLeft: 12 }} />
          </Grid>
        </>
      }

    </Grid>
  )
}

export default DynamicLegend