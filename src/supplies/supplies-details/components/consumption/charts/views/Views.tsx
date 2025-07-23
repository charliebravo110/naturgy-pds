import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import Grid from '@material-ui/core/Grid'

import { formatDate, formatDateHyphens } from '../../../../../../common/lib/FormatLib'

import { setCurrentCompareConsumptions, setCurrentSupplyConsumptions } from '../../../../../store/actions/SuppliesActions'
import Mode from '../mode/Mode'
import useStyles from './Views.styles'
import useStyles_ from '../filters/error-message/SessionTimeout.styles'
import { thunkGetCurrentSupplyConsumptions } from '../../../../store/actions/SuppliesDetailsThunkActions'
import Modales from '../filters/error-message/Modales'
import useModal from '../filters/error-message/UseModal'
import CloseIcon from '../../../../../../assets/icons/cerrar.svg'
import AlertIcon from '../../../../../../assets/icons/aviso_alerta_pop_up.svg'
import Button from '../../../../../../common/components/button/Button'

const Views = (props: any) => {
  const classes = useStyles({})
  const classes_ = useStyles_({})
  const { t } = useTranslation()

  const {
    supplyData,
    mode,
    setMode,
    setIsLoading,
    consumptionsFilters,
    setConsumptionsFilters,
    setAuxStartDate,
    setAuxEndDate,
    isGeneration,
    isGenerationTab,
    selfConsumption
  } = props

  const { isOpen, toggle } = useModal()
  const [ModalMessage, setModalMessage] = useState('')
  const [ModalSecondMessage, setModalSecondMessage] = useState('')

  let auxStartDate
  const dispatch = useDispatch()

  const updateConsumptions = (granularity: string, finalDate: String) => {
    let auxEndDate = new Date(formatDateHyphens(finalDate))

    if (granularity === 'M') {
      auxStartDate = new Date(auxEndDate.getFullYear(), auxEndDate.getMonth() - 6, 1)
    }
    else if (granularity === 'D') {
      let today = new Date().getDate()

      if (today === 1) {
        auxStartDate = new Date(auxEndDate.getFullYear(), auxEndDate.getMonth() - 1, 1)
        auxEndDate = new Date(auxEndDate.getFullYear(), auxEndDate.getMonth(), 0)
      } else {
        auxStartDate = new Date(auxEndDate.getFullYear(), auxEndDate.getMonth(), 1)
      }
    }
    else if (granularity === 'S') {
      /*let today = new Date().getDate()

      if (today === 1) {
        auxStartDate = new Date(auxEndDate.getFullYear(), auxEndDate.getMonth() - 1, 1)
        auxEndDate = new Date(auxEndDate.getFullYear(), auxEndDate.getMonth(), 0)
      } else {
        auxStartDate = new Date(auxEndDate.getFullYear(), auxEndDate.getMonth(), 2)
      }*/
      //auxEndDate es la fecha que escogemos en el DataPicker 
      let dayOfWeek = new Date(formatDateHyphens(auxEndDate)).getDay()
      let today = new Date(formatDateHyphens(auxEndDate)).getDate()
      let auxDate = new Date(formatDateHyphens(auxEndDate))

      switch (dayOfWeek) {
        case 0:
          auxStartDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today - 6)
          auxEndDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today)
          break;
        case 1:
          auxStartDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today)
          auxEndDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today + 6)
          break;
        case 2:
          auxStartDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today - 1)
          auxEndDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today + 5)
          break;
        case 3:
          auxStartDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today - 2)
          auxEndDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today + 4)
          break;
        case 4:
          auxStartDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today - 3)
          auxEndDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today + 3)
          break;
        case 5:
          auxStartDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today - 4)
          auxEndDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today + 2)
          break;
        case 6:
          auxStartDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today - 5)
          auxEndDate = new Date(auxDate.getFullYear(), auxDate.getMonth(), today + 1)
          break;
      }
    }
    else if (granularity === 'H') {
      let dia_milisegundos = 24 * 60 * 60 * 1000
      auxStartDate = new Date(auxEndDate.getTime() - dia_milisegundos)
      auxEndDate = auxStartDate
    }
    else if (granularity === 'Q') {
      let quarter_milisegundos = 24 * 60 * 60 * 1000
      auxStartDate = new Date(auxEndDate.getTime() - quarter_milisegundos)
      auxEndDate = auxStartDate
    }

    setAuxStartDate(formatDate(auxStartDate))
    setAuxEndDate(formatDate(auxEndDate))

    setConsumptionsFilters({
      ...consumptionsFilters,
      granularity,
      startDate: formatDate(auxStartDate),
      endDate: formatDate(auxEndDate),
      compare: 'N'
    })

  }
  const handleChangeGranularity = (granularity: string) => {
    setIsLoading(true)

    setCurrentSupplyConsumptions([])
    setCurrentCompareConsumptions([])

    const fecha = new Date();
    const endDate = formatDate(fecha)
    fecha.setFullYear(fecha.getFullYear() - 2)
    const startDate = formatDate(fecha);

    //obtenemos el primer con datos:

    if (supplyData) {
      dispatch(thunkGetCurrentSupplyConsumptions(false, supplyData.holderDocumentNumber, supplyData.cups, 'D', startDate, endDate, setIsLoading, supplyData.isGenerator, false, false, null, '0', supplyData.measurementSystem, (response) => {
        if (response == 'showModalError1007') {
          setModalMessage('errors.autoconsumo.1007')
          setModalSecondMessage('')
          toggle();
        } else {
          let lastDay = ''
          if (response) {
            //GMV10
            if (supplyData.measurementSystem === 'G') {
              updateConsumptions(granularity, response[response.length - 1].consumptions.items[response[response.length - 1].consumptions.count - 1].consumptionDate)
            }
            //ODI
            else {
              updateConsumptions(granularity, response[response.length - 1].consumptions.items[response[response.length - 1].consumptions.count - 1].consumptionDate)
            }
            let lastDay = ''

          }
        }
      }))
    }
  }

  return (
    <>
      <Modales isOpne={isOpen} toggle={toggle}>
        <img src={CloseIcon} className={classes_.closeButton} alt='close' onClick={toggle} />
        <img src={AlertIcon} />
        <div className={classes_.title}>
          {t(ModalMessage)}
        </div>
        <div className={classes_.body}>
          {t(ModalSecondMessage)}
        </div>
        <Grid item>
          <Grid container justifyContent='center'>
            <Button
              className={classes_.button}
              text={t('errors.date.button.accept')}
              color='primary'
              size='large'
              variant='contained'
              onClick={toggle}
            />
          </Grid>
        </Grid>
      </Modales>
      <Grid item md={12} sm={12} xs={12}>
        <Grid container className={classes.container} item sm={12} xs={12}>
          <div className={classes.label}>
            {
              selfConsumption ?
                t('supplies.suppliesDetails.components.consumption.charts.views.seeSelfConsumptionBy')
                :
                (isGeneration && isGenerationTab) ?
                  t('supplies.suppliesDetails.components.consumption.charts.views.seeGenerationBy')
                  :
                  t('supplies.suppliesDetails.components.consumption.charts.views.seeConsumptionBy')
            }
          </div>

          <Grid container className={classes.menu}>
            <Grid
              item
              className={`${classes.menuItem} ${consumptionsFilters.granularity === 'M' && 'active'}`}
              onClick={() => handleChangeGranularity('M')}
            >
              {t('supplies.suppliesDetails.components.consumption.charts.views.eligiblePeriod')}
            </Grid>

            <Grid
              item
              className={`${classes.menuItem} ${consumptionsFilters.granularity === 'D' && 'active'}`}
              onClick={() => handleChangeGranularity('D')}
            >
              {t('supplies.suppliesDetails.components.consumption.charts.views.month')}
            </Grid>

            <Grid
              item
              className={`${classes.menuItem} ${consumptionsFilters.granularity === 'S' && 'active'}`}
              onClick={() => handleChangeGranularity('S')}
            >
              {t('supplies.suppliesDetails.components.consumption.charts.views.week')}
            </Grid>

            <Grid
              item
              className={`${classes.menuItem} ${(consumptionsFilters.granularity === 'H' || consumptionsFilters.granularity === 'Q') ? 'active' : ''}`}
              onClick={() => handleChangeGranularity('H')}
            >
              {t('supplies.suppliesDetails.components.consumption.charts.views.day')}
            </Grid>
              <Grid item style={{ marginLeft: 'auto', marginTop: 'auto' }}>
                <Mode mode={mode} setMode={setMode} />
              </Grid>
          </Grid>

          <Grid item md={12} className={classes.description}>
            <span>
              {t('supplies.suppliesDetails.components.consumption.consumption.displayconsumptionsConsult')}
            </span>
            <br />
            <span>
              {t('supplies.suppliesDetails.components.consumption.consumption.displayconsumptionsRemember')}
            </span>
          </Grid>


        </Grid>
      </Grid >
    </>
  )
}

export default Views
function dispatch(arg0: any) {
  throw new Error('Function not implemented.')
}

