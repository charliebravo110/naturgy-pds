import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import useStyles from './Legend.styles'

const Legend = (props: any) => {

    const classes = useStyles({})
    const { t } = useTranslation()

    const {
        values,
        tipoUsuario,
        isAdapted
      } = props

    return(
      <Grid container className={classes.container2}>
        {tipoUsuario === 'complejo' &&
          <Grid item md={12} className={classes.supText}>
            {t('supplies.suppliesDetails.components.maxPowerEstimated.charts.legend.energyPeriod')}
          </Grid>
        }
        {isAdapted !=='SI' &&
          <Grid item xs={12} sm={12} md={4} className={classes.label2}>
            <Grid container className={classes.legendItemContainer}>
              <Grid item xs={1} md={1} className={classes.whiteTextOrange}>
                <div>{'PC'}</div>
              </Grid>
              <Grid item className={classes.labelTitle} xs='auto' sm='auto'>
                {t('supplies.suppliesDetails.components.maxPowerEstimated.charts.legend.contractedPower')}
              </Grid>
              <span>{values.p1.toFixed(2).replace('.', ',')} {t('dashboard.Power')}</span>
            </Grid>
          </Grid>
        }
        {isAdapted ==='SI' && tipoUsuario === 'simple' &&
          <Grid item xs={12} sm={12} md={12} className={classes.label2}>
            <Grid container className={classes.legendItemContainer}>
              <Grid item className={classes.supText} xs='auto' sm='auto'>
                {t('supplies.suppliesDetails.components.maxPowerEstimated.charts.legend.simpleSupText')}
              </Grid>
            </Grid>
          </Grid>
        }
        {tipoUsuario === 'complejo' && isAdapted ==='SI' &&
          <Grid item xs={12} sm={12} md={4} className={classes.label2}>
            <Grid container className={classes.legendItemContainer}>
              <Grid item xs={1} md={1} className={classes.whiteTextRed}>
                <div>{'PC1'}</div>
              </Grid>
              <Grid item className={classes.labelTitle} xs='auto' sm='auto'>
                {t('supplies.suppliesDetails.components.maxPowerEstimated.charts.legend.contractedPowerP1')}
              </Grid>
              <span>{values.p1.toFixed(2).replace('.', ',')} {t('dashboard.Power')}</span>
            </Grid>
          </Grid>
        }
        {tipoUsuario === 'complejo' && isAdapted ==='SI' &&
          <Grid item xs={12} sm={12} md={4} className={classes.label2}>
            <Grid container className={classes.legendItemContainer}>
              <Grid item xs={1} md={1} className={classes.whiteTextOrange}>
                <div>{'PC2'}</div>
              </Grid>
              <Grid item className={classes.labelTitle} xs='auto' sm='auto'>
                {t('supplies.suppliesDetails.components.maxPowerEstimated.charts.legend.contractedPowerP2')}
              </Grid>
              <span>{values.p2.toFixed(2).replace('.', ',')} {t('dashboard.Power')}</span>
            </Grid>
          </Grid>
        }
        {tipoUsuario === 'simple' && isAdapted ==='SI' &&
          <Grid item xs={12} sm={12} md={4} className={classes.label2}>
            <Grid container className={classes.legendItemContainer}>
              <Grid item xs={1} md={1} className={classes.whiteTextRed2}>
                <div>{'   '}</div>
              </Grid>
              <Grid item xs={1} md={1} className={classes.whiteTextYellow2}>
                <div>{'   '}</div>
              </Grid>
              <Grid item className={classes.labelTitle} xs='auto' sm='auto'>
                {t('supplies.suppliesDetails.components.maxPowerEstimated.charts.legend.simpleContractedPowerP1')}
              </Grid>
              <span>{values.p1.toFixed(2).replace('.', ',')} {t('dashboard.Power')}</span>
            </Grid>
          </Grid>
        }
        {isAdapted ==='SI' && tipoUsuario === 'simple' &&
          <Grid item xs={12} sm={12} md={4} className={classes.label2}>
            <Grid container className={classes.legendItemContainer}>
              <Grid item xs={1} md={1} className={tipoUsuario === 'complejo' ? classes.whiteTextYellow : classes.whiteTextBlue}>
                <div>{'   '}</div>
              </Grid>
              <Grid item className={classes.labelTitle} xs='auto' sm='auto'>
                {t('supplies.suppliesDetails.components.maxPowerEstimated.charts.legend.simpleContractedPowerP2')}
              </Grid>
              <span>{values.p3.toFixed(2).replace('.', ',')} {t('dashboard.Power')}</span>
            </Grid>
          </Grid>
        }
        {isAdapted ==='SI' && tipoUsuario === 'complejo' &&
          <Grid item xs={12} sm={12} md={4} className={classes.label2}>
            <Grid container className={classes.legendItemContainer}>
              <Grid item xs={1} md={1} className={tipoUsuario === 'complejo' ? classes.whiteTextYellow : classes.whiteTextBlue}>
                <div>{'PC3'}</div>
              </Grid>
              <Grid item className={classes.labelTitle} xs='auto' sm='auto'>
                {t('supplies.suppliesDetails.components.maxPowerEstimated.charts.legend.contractedPowerP3')}
              </Grid>
              <span>{values.p3.toFixed(2).replace('.', ',')} {t('dashboard.Power')}</span>
            </Grid>
          </Grid>
        }
        {tipoUsuario === 'complejo' && isAdapted ==='SI' &&
          <Grid item xs={12} sm={12} md={4} className={classes.label2}>
            <Grid container className={classes.legendItemContainer}>
              <Grid item xs={1} md={1} className={classes.whiteTextGreen}>
                <div>{'PC4'}</div>
              </Grid>
              <Grid item className={classes.labelTitle} xs='auto' sm='auto'>
                {t('supplies.suppliesDetails.components.maxPowerEstimated.charts.legend.contractedPowerP4')}
              </Grid>
              <span>{values.p4.toFixed(2).replace('.', ',')} {t('dashboard.Power')}</span>
            </Grid>
          </Grid>
        }
        {tipoUsuario === 'complejo' && isAdapted ==='SI' &&
          <Grid item xs={12} sm={12} md={4} className={classes.label2}>
            <Grid container className={classes.legendItemContainer}>
              <Grid item xs={1} md={1} className={classes.whiteTextDarkGreen}>
                <div>{'PC5'}</div>
              </Grid>
              <Grid item className={classes.labelTitle} xs='auto' sm='auto'>
                {t('supplies.suppliesDetails.components.maxPowerEstimated.charts.legend.contractedPowerP5')}
              </Grid>
              <span>{values.p5.toFixed(2).replace('.', ',')} {t('dashboard.Power')}</span>
            </Grid>
          </Grid>
        }
        {tipoUsuario === 'complejo' && isAdapted ==='SI' &&
          <Grid item xs={12} sm={12} md={4} className={classes.label2}>
            <Grid container className={classes.legendItemContainer}>
              <Grid item xs={1} md={1} className={classes.whiteTextBlue}>
                <div>{'PC6'}</div>
              </Grid>
              <Grid item className={classes.labelTitle} xs='auto' sm='auto'>
                {t('supplies.suppliesDetails.components.maxPowerEstimated.charts.legend.contractedPowerP6')}
              </Grid>
              <span>{values.p6.toFixed(2).replace('.', ',')} {t('dashboard.Power')}</span>
            </Grid>
          </Grid>
        }
        {/*isAdapted ==='SI' && 
          <Grid item xs={12} sm={12} md={8} className={classes.label2}>
            <Grid container className={classes.legendItemContainer}>
              {tipoUsuario === 'complejo' ?
                <Grid item className={classes.whiteTextGrey}>
                  <div>{'P0'}</div>
                </Grid>
              :
                <Grid item xs={1} sm={1} md={1} className={classes.whiteTextGrey2}>
                  <div>{'P0'}</div>
                </Grid>
              }
              <Grid item className={classes.labelTitle} xs='auto' sm='auto'>
                {t('supplies.suppliesDetails.components.maxPowerEstimated.charts.legend.contractedPowerP0')}
              </Grid>
              <span>{t('supplies.suppliesDetails.components.maxPowerEstimated.charts.legend.p0')}</span>
            </Grid>
          </Grid>
        */}
      </Grid>
    )

}

export default Legend
