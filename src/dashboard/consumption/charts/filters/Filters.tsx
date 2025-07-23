import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import Grid from '@material-ui/core/Grid'

import ArrowDownIcon from '../../../../assets/icons/flecha_down_blue.svg'
import Datepicker from '../../../../common/components/datepicker/Datepicker'

import { formatDate } from '../../../../common/lib/FormatLib'
import subMonths from 'date-fns/subMonths'

import useStyles from './Filters.styles'

import {
  setCurrentSupplyConsumptions
} from '../../../../supplies/store/actions/SuppliesActions'

const Filters = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [ BoxVisible, setIsBoxVisible ] = useState(false)
  const [ monthSelected, setMonthSelected ] = useState(new Date())

  const {
    consumptionsFilters,
    setConsumptionsFilters,
    auxStartDate,
    setAuxStartDate,
    auxEndDate
  } = props

  const handleChangeBoxVisible = () => {
    setIsBoxVisible(!BoxVisible)
  }
  
  const handleSelected = (date: Date) => {
    let startDate
    let endDate

    dispatch(setCurrentSupplyConsumptions([]))
    setMonthSelected(date)

    if (consumptionsFilters.granularity === 'D') {
      startDate = formatDate(date)
      endDate = formatDate(new Date(date.getFullYear(), date.getMonth() + 1, 0))

    } else if (consumptionsFilters.granularity === 'H') {
      startDate = formatDate(date)
      endDate = startDate
    }

    setConsumptionsFilters({
      ...consumptionsFilters,
      startDate: startDate,
      endDate: endDate
    })
  }

  return (
    <Grid container className={classes.container}>
      <Grid container className={classes.menu}>
        {
          consumptionsFilters.granularity === 'M' &&
          <Grid container className={classes.userInfo} onClick={handleChangeBoxVisible}>
            <Grid item className={classes.label}>{t('dashboard.filters.endDate')}</Grid>
            <Grid item className={classes.arrowIcon}> 
              {
                BoxVisible ?
                <img className={classes.arrowUp} src={ArrowDownIcon} alt='' />
                :
                <img src={ArrowDownIcon} alt='' />
              }         
            </Grid> 
          </Grid>
        }
        {
          consumptionsFilters.granularity === 'D' &&
          <Grid container className={classes.userInfo} onClick={handleChangeBoxVisible}>
            <Grid item className={classes.label}>{t('dashboard.filters.month')}</Grid>
            <Grid item className={classes.arrowIcon}> 
              {
                BoxVisible ?
                <img className={classes.arrowUp} src={ArrowDownIcon} alt='' />
                :
                <img src={ArrowDownIcon} alt='' />
              }         
            </Grid> 
          </Grid>
        }
        {
          consumptionsFilters.granularity === 'H' &&
          <Grid container className={classes.userInfo} onClick={handleChangeBoxVisible}> 
            <Grid item className={classes.label}>{t('dashboard.filters.day')}</Grid>
            <Grid item className={classes.arrowIcon}> 
              {
                BoxVisible ?
                <img className={classes.arrowUp} src={ArrowDownIcon} alt='' />
                :
                <img src={ArrowDownIcon} alt='' />
              }         
            </Grid> 
          </Grid>
         }
        {
        consumptionsFilters.granularity === 'M' &&
        <Grid container className={classes.menuItem}>
        {
          BoxVisible &&
          <Datepicker 
            autofocus
            date={auxStartDate} 
            setDate={setAuxStartDate} 
            maxDate={auxEndDate} 
            disabled
            placeholderText={auxStartDate}
          />
        }
        </Grid> 
        }
        {
          consumptionsFilters.granularity === 'D' &&
            <Grid container className={classes.menuItem}>
            {
              BoxVisible &&
              <Datepicker 
                date={auxStartDate} 
                maxDate={new Date()}
                minDate={subMonths(new Date(), 6)}
                setDate={setAuxStartDate} 
                onChange={monthSelected => handleSelected(monthSelected)}
                showMonthYearPicker
              />

            }

            </Grid> 
        }
        {
        consumptionsFilters.granularity === 'H' &&
        <Grid container className={classes.menuItem}>
        {
          BoxVisible &&
          <Datepicker 
            date={auxStartDate} 
            maxDate={new Date()}
            minDate={subMonths(new Date(), 6)}
            setDate={setAuxStartDate} 
            onChange={monthSelected => handleSelected(monthSelected)}
          />
        }
        </Grid> 
        }
      </Grid>
    </Grid>
  )
}

export default Filters
