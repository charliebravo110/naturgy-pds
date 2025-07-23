import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import useStyles from './Legend.styles'

const LegendSelfConsumption = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    consumptionsFilters,
    finalSum,
    finalMax,
    finalAvg,
    finalMin,
    state,
    containValue,
    compare
  } = props

  return (
    <Grid container className={classes.container}>
      <Grid container className={classes.sectionSelfConsumption}>
        <Grid item xs={12} sm={12} md={2}>
          <Grid container className={classes.item2}>
            <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
              <Grid container>
                <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                  <span>
                    {
                      ''
                    }
                  </span>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={12} md={2}>
          <Grid container className={classes.item2}>
            <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
              <Grid container>
                <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                  <span>
                    {
                      t('supplies.suppliesDetails.components.consumption.charts.legend.period2')
                    }
                  </span>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={12} md={2}>
          <Grid container className={classes.item2}>
            <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
              <Grid container>
                <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                  <span>
                    {
                      t('supplies.suppliesDetails.components.consumption.charts.legend.totalEnergy')
                    }
                  </span>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={12} md={2}>
          <Grid container className={classes.item2}>
            <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
              <Grid container>
                <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                  <span>
                    {
                      t('supplies.suppliesDetails.components.consumption.charts.legend.maxEnergy')
                    }
                  </span>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={12} md={2}>
          <Grid container className={classes.item2}>
            <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
              <Grid container>
                <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                  <span>
                    {
                      t('supplies.suppliesDetails.components.consumption.charts.legend.midEnergy')
                    }
                  </span>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={12} md={2}>
          <Grid container className={classes.item2}>
            <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
              <Grid container>
                <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                  <span>
                    {
                      t('supplies.suppliesDetails.components.consumption.charts.legend.minEnergy')
                    }
                  </span>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {containValue.EHCRi === true && state.checkedEHCRi === true &&
        <Grid container className={compare ? `${classes.sectionSelfConsumption} border2` : `${classes.sectionSelfConsumption} border`}>
          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md={12} className={classes.label3}>
                <Grid container>
                  <Grid item md={3} xs={3}>
                    <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'solid', borderColor: '#d7af05', width: '50%' }} />
                  </Grid>
                  <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                    <span>
                      {
                        'EHCRi'
                      }
                    </span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      consumptionsFilters.startDate + '-' + consumptionsFilters.endDate
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalSum.EHCRi.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMax.EHCRi.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalAvg.EHCRi.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMin.EHCRi.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
      {compare && containValue.EHCRi === true && state.checkedEHCRi === true &&
        <Grid container className={`${classes.sectionSelfConsumption} border`}>
          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md={12} className={classes.label3}>
                <Grid container>
                  <Grid item md={3} xs={3}>
                    <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'dashed', borderColor: '#d7af05', width: '50%' }} />
                  </Grid>
                  <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                    <span>
                      {
                        'EHCRi'
                      }
                    </span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      consumptionsFilters.startDateCompare + '-' + consumptionsFilters.endDateCompare
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalSum.EHCRicompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMax.EHCRicompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalAvg.EHCRicompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMin.EHCRicompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
      {containValue.EHACi === true && state.checkedEHACi === true &&
        <Grid container className={compare ? `${classes.sectionSelfConsumption} border2` : `${classes.sectionSelfConsumption} border`}>
          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md={12} className={classes.label3}>
                <Grid container>
                  <Grid item md={3} xs={3}>
                    <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'solid', borderColor: '#6fcf97', width: '50%' }} />
                  </Grid>
                  <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                    <span>
                      {
                        'EHACi'
                      }
                    </span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      consumptionsFilters.startDate + '-' + consumptionsFilters.endDate
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalSum.EHACi.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMax.EHACi.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalAvg.EHACi.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMin.EHACi.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
      {compare && containValue.EHACi === true && state.checkedEHACi === true &&
        <Grid container className={`${classes.sectionSelfConsumption} border`}>
          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md={12} className={classes.label3}>
                <Grid container>
                  <Grid item md={3} xs={3}>
                    <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'dashed', borderColor: '#6fcf97', width: '50%' }} />
                  </Grid>
                  <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                    <span>
                      {
                        'EHACi'
                      }
                    </span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      consumptionsFilters.startDateCompare + '-' + consumptionsFilters.endDateCompare
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalSum.EHACicompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMax.EHACicompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalAvg.EHACicompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMin.EHACicompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
      {containValue.EHCi === true && state.checkedEHCi === true &&
        <Grid container className={compare ? `${classes.sectionSelfConsumption} border2` : `${classes.sectionSelfConsumption} border`}>
          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md={12} className={classes.label3}>
                <Grid container>
                  <Grid item md={3} xs={3}>
                    <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'solid', borderColor: '#8217e5', width: '50%' }} />
                  </Grid>
                  <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                    <span>
                      {
                        'EHCi'
                      }
                    </span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      consumptionsFilters.startDate + '-' + consumptionsFilters.endDate
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalSum.EHCi.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMax.EHCi.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalAvg.EHCi.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMin.EHCi.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
      {compare && containValue.EHCi === true && state.checkedEHCi === true &&
        <Grid container className={`${classes.sectionSelfConsumption} border`}>
          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md={12} className={classes.label3}>
                <Grid container>
                  <Grid item md={3} xs={3}>
                    <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'dashed', borderColor: '#8217e5', width: '50%' }} />
                  </Grid>
                  <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                    <span>
                      {
                        'EHCi'
                      }
                    </span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      consumptionsFilters.startDateCompare + '-' + consumptionsFilters.endDateCompare
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalSum.EHCicompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMax.EHCicompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalAvg.EHCicompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMin.EHCicompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
      {containValue.EHEXi === true && state.checkedEHEXi === true &&
        <Grid container className={compare ? `${classes.sectionSelfConsumption} border2` : `${classes.sectionSelfConsumption} border`}>
          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md={12} className={classes.label3}>
                <Grid container>
                  <Grid item md={3} xs={3}>
                    <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'solid', borderColor: '#56ccf2', width: '50%' }} />
                  </Grid>
                  <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                    <span>
                      {
                        'EHEXi'
                      }
                    </span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      consumptionsFilters.startDate + '-' + consumptionsFilters.endDate
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalSum.EHEXi.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMax.EHEXi.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalAvg.EHEXi.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMin.EHEXi.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
      {compare && containValue.EHEXi === true && state.checkedEHEXi === true &&
        <Grid container className={`${classes.sectionSelfConsumption} border`}>
          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md={12} className={classes.label3}>
                <Grid container>
                  <Grid item md={3} xs={3}>
                    <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'dashed', borderColor: '#56ccf2', width: '50%' }} />
                  </Grid>
                  <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                    <span>
                      {
                        'EHEXi'
                      }
                    </span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      consumptionsFilters.startDateCompare + '-' + consumptionsFilters.endDateCompare
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalSum.EHEXicompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMax.EHEXicompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalAvg.EHEXicompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMin.EHEXicompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
      {containValue.EHNGi === true && state.checkedEHNGi === true &&
        <Grid container className={compare ? `${classes.sectionSelfConsumption} border2` : `${classes.sectionSelfConsumption} border`}>
          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md={12} className={classes.label3}>
                <Grid container>
                  <Grid item md={3} xs={3}>
                    <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'solid', borderColor: '#b5474c', width: '50%' }} />
                  </Grid>
                  <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                    <span>
                      {
                        'EHNGi'
                      }
                    </span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      consumptionsFilters.startDate + '-' + consumptionsFilters.endDate
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalSum.EHNGi.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMax.EHNGi.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalAvg.EHNGi.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMin.EHNGi.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
      {compare && containValue.EHNGi === true && state.checkedEHNGi === true &&
        <Grid container className={`${classes.sectionSelfConsumption} border`}>
          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md={12} className={classes.label3}>
                <Grid container>
                  <Grid item md={3} xs={3}>
                    <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'dashed', borderColor: '#b5474c', width: '50%' }} />
                  </Grid>
                  <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                    <span>
                      {
                        'EHNGi'
                      }
                    </span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      consumptionsFilters.startDateCompare + '-' + consumptionsFilters.endDateCompare
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalSum.EHNGicompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMax.EHNGicompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalAvg.EHNGicompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMin.EHNGicompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
      {containValue.EHEXG === true && state.checkedEHEXG === true &&
        <Grid container className={compare ? `${classes.sectionSelfConsumption} border2` : `${classes.sectionSelfConsumption} border`}>
          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md={12} className={classes.label3}>
                <Grid container>
                  <Grid item md={3} xs={3}>
                    <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'solid', borderColor: '#4e7e17', width: '50%' }} />
                  </Grid>
                  <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                    <span>
                      {
                        'EHEXG'
                      }
                    </span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      consumptionsFilters.startDate + '-' + consumptionsFilters.endDate
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalSum.EHEXG.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMax.EHEXG.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalAvg.EHEXG.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMin.EHEXG.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
      {compare && containValue.EHEXG === true && state.checkedEHEXG === true &&
        <Grid container className={`${classes.sectionSelfConsumption} border`}>
          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md={12} className={classes.label3}>
                <Grid container>
                  <Grid item md={3} xs={3}>
                    <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'dashed', borderColor: '#4e7e17', width: '50%' }} />
                  </Grid>
                  <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                    <span>
                      {
                        'EHEXG'
                      }
                    </span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      consumptionsFilters.startDateCompare + '-' + consumptionsFilters.endDateCompare
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalSum.EHEXGcompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMax.EHEXGcompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalAvg.EHEXGcompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMin.EHEXGcompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
      {containValue.EHCR === true && state.checkedEHCR === true &&
        <Grid container className={compare ? `${classes.sectionSelfConsumption} border2` : `${classes.sectionSelfConsumption} border`}>
          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md={12} className={classes.label3}>
                <Grid container>
                  <Grid item md={3} xs={3}>
                    <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'solid', borderColor: '#009aa6', width: '50%' }} />
                  </Grid>
                  <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                    <span>
                      {
                        'EHCR'
                      }
                    </span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      consumptionsFilters.startDate + '-' + consumptionsFilters.endDate
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      finalSum.EHCR.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      finalMax.EHCR.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      finalAvg.EHCR.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      finalMin.EHCR.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
      {compare && containValue.EHCR === true && state.checkedEHCR === true &&
        <Grid container className={`${classes.sectionSelfConsumption} border`}>
          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md={12} className={classes.label3}>
                <Grid container>
                  <Grid item md={3} xs={3}>
                    <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'dashed', borderColor: '#009aa6', width: '50%' }} />
                  </Grid>
                  <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                    <span>
                      {
                        'EHCR'
                      }
                    </span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      consumptionsFilters.startDateCompare + '-' + consumptionsFilters.endDateCompare
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      finalSum.EHCRcompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      finalMax.EHCRcompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      finalAvg.EHCRcompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      finalMin.EHCRcompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
      {containValue.EHAC === true && state.checkedEHAC === true &&
        <Grid container className={compare ? `${classes.sectionSelfConsumption} border2` : `${classes.sectionSelfConsumption} border`}>
          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md={12} className={classes.label3}>
                <Grid container>
                  <Grid item md={3} xs={3}>
                    <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'solid', borderColor: '#a2ad00', width: '50%' }} />
                  </Grid>
                  <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                    <span>
                      {
                        'EHAC'
                      }
                    </span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      consumptionsFilters.startDate + '-' + consumptionsFilters.endDate
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalSum.EHAC.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMax.EHAC.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalAvg.EHAC.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMin.EHAC.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
      {compare && containValue.EHAC === true && state.checkedEHAC === true &&
        <Grid container className={`${classes.sectionSelfConsumption} border`}>
          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md={12} className={classes.label3}>
                <Grid container>
                  <Grid item md={3} xs={3}>
                    <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'dashed', borderColor: '#a2ad00', width: '50%' }} />
                  </Grid>
                  <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                    <span>
                      {
                        'EHAC'
                      }
                    </span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      consumptionsFilters.startDateCompare + '-' + consumptionsFilters.endDateCompare
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalSum.EHACcompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMax.EHACcompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalAvg.EHACcompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMin.EHACcompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
      {containValue.EHCCA === true && state.checkedEHCCA === true &&
        <Grid container className={compare ? `${classes.sectionSelfConsumption} border2` : `${classes.sectionSelfConsumption} border`}>
          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md={12} className={classes.label3}>
                <Grid container>
                  <Grid item md={3} xs={3}>
                    <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'solid', borderColor: '#0066cc', width: '50%' }} />
                  </Grid>
                  <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                    <span>
                      {
                        'EHCCA'
                      }
                    </span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      consumptionsFilters.startDate + '-' + consumptionsFilters.endDate
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalSum.EHCCA.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMax.EHCCA.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalAvg.EHCCA.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMin.EHCCA.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
      {compare && containValue.EHCCA === true && state.checkedEHCCA === true &&
        <Grid container className={`${classes.sectionSelfConsumption} border`}>
          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md={12} className={classes.label3}>
                <Grid container>
                  <Grid item md={3} xs={3}>
                    <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'dashed', borderColor: '#0066cc', width: '50%' }} />
                  </Grid>
                  <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                    <span>
                      {
                        'EHCCA'
                      }
                    </span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      consumptionsFilters.startDateCompare + '-' + consumptionsFilters.endDateCompare
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalSum.EHCCAcompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMax.EHCCAcompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalAvg.EHCCAcompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMin.EHCCAcompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
      {containValue.EHEX === true && state.checkedEHEX === true &&
        <Grid container className={compare ? `${classes.sectionSelfConsumption} border2` : `${classes.sectionSelfConsumption} border`}>
          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md={12} className={classes.label3}>
                <Grid container>
                  <Grid item md={3} xs={3}>
                    <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'solid', borderColor: '#e57200', width: '50%' }} />
                  </Grid>
                  <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                    <span>
                      {
                        'EHEX'
                      }
                    </span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      consumptionsFilters.startDate + '-' + consumptionsFilters.endDate
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalSum.EHEX.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMax.EHEX.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalAvg.EHEX.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMin.EHEX.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
      {compare && containValue.EHEX === true && state.checkedEHEX === true &&
        <Grid container className={`${classes.sectionSelfConsumption} border`}>
          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md={12} className={classes.label3}>
                <Grid container>
                  <Grid item md={3} xs={3}>
                    <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'dashed', borderColor: '#e57200', width: '50%' }} />
                  </Grid>
                  <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                    <span>
                      {
                        'EHEX'
                      }
                    </span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      consumptionsFilters.startDateCompare + '-' + consumptionsFilters.endDateCompare
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalSum.EHEXcompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMax.EHEXcompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalAvg.EHEXcompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMin.EHEXcompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
      {containValue.EHNG === true && state.checkedEHNG === true &&
        <Grid container className={compare ? `${classes.sectionSelfConsumption} border2` : `${classes.sectionSelfConsumption} border`}>
          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md={12} className={classes.label3}>
                <Grid container>
                  <Grid item md={3} xs={3}>
                    <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'solid', borderColor: '#004571', width: '50%' }} />
                  </Grid>
                  <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                    <span>
                      {
                        'EHNG'
                      }
                    </span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      consumptionsFilters.startDate + '-' + consumptionsFilters.endDate
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalSum.EHNG.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMax.EHNG.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalAvg.EHNG.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMin.EHNG.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
      {compare && containValue.EHNG === true && state.checkedEHNG === true &&
        <Grid container className={`${classes.sectionSelfConsumption} border`}>
          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md={12} className={classes.label3}>
                <Grid container>
                  <Grid item md={3} xs={3}>
                    <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'dashed', borderColor: '#004571', width: '50%' }} />
                  </Grid>
                  <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                    <span>
                      {
                        'EHNG'
                      }
                    </span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      consumptionsFilters.startDateCompare + '-' + consumptionsFilters.endDateCompare
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalSum.EHNGcompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMax.EHNGcompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalAvg.EHNGcompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMin.EHNGcompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
      {containValue.EHCSA === true && state.checkedEHCSA === true &&
        <Grid container className={compare ? `${classes.sectionSelfConsumption} border2` : `${classes.sectionSelfConsumption} border`}>
          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md={12} className={classes.label3}>
                <Grid container>
                  <Grid item md={3} xs={3}>
                    <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'solid', borderColor: '#bb6bd9', width: '50%' }} />
                  </Grid>
                  <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                    <span>
                      {
                        'EHCSA'
                      }
                    </span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      consumptionsFilters.startDate + '-' + consumptionsFilters.endDate
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalSum.EHCSA.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMax.EHCSA.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalAvg.EHCSA.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMin.EHCSA.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
      {compare && containValue.EHCSA === true && state.checkedEHCSA === true &&
        <Grid container className={`${classes.sectionSelfConsumption} border`}>
          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md={12} className={classes.label3}>
                <Grid container>
                  <Grid item md={3} xs={3}>
                    <hr style={{ borderTop: 1, borderBottom: 1, borderStyle: 'dashed', borderColor: '#bb6bd9', width: '50%' }} />
                  </Grid>
                  <Grid item className={classes.labelTitle} xs={12} sm='auto'>
                    <span>
                      {
                        'EHCSA'
                      }
                    </span>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>
                  <Grid item xs={12} sm='auto'>
                    {
                      consumptionsFilters.startDateCompare + '-' + consumptionsFilters.endDateCompare
                    }
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalSum.EHCSAcompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMax.EHCSAcompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalAvg.EHCSAcompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={2}>
            <Grid container className={classes.item2}>
              <Grid item xs={9} sm={9} md='auto' className={classes.label3}>
                <Grid container>

                  <Grid item xs={12} sm='auto'>
                    {
                      finalMin.EHCSAcompare.toFixed(2).replace('.', ',')
                    } {'kWh'}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }
    </Grid>
  )
}

export default LegendSelfConsumption
