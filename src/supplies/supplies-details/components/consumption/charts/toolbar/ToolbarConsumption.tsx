import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import { DialogContent } from '@material-ui/core'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import useStyles from './Toolbar.styles'

import Button from '../../../../../../common/components/button/Button'
import Dialog from '../../../../../../common/components/dialog/Dialog'
import Datepicker from '../../../../../../common/components/datepicker/Datepicker'
import CloseIcon from '../../../../../../assets/icons/cerrar.svg'
import { formatDate, formatDateHyphens } from '../../../../../../common/lib/FormatLib'
import ViewsConsumption from '../views/ViewsConsumption'

const ToolbarConsumption = (props: any) => {
  const {
    setIsLoading,
    supplyData,
    consumptionsFilters,
    setConsumptionsFilters,
    downLoadFilters,
    setDownLoadFilters,
    isGeneration,
    isGenerationTab,
    selfConsumption
  } = props

  const classes = useStyles({})
  const mobileRes = useMediaQuery('(max-width:576px)')
  const { t } = useTranslation()

  const [showingDialog, setShowingDialog] = useState(false)
  const [auxStartDate, setAuxStartDate] = useState(consumptionsFilters.startDate)
  const [auxEndDate, setAuxEndDate] = useState(consumptionsFilters.endDate)

  useEffect(() => {
    setAuxStartDate(consumptionsFilters.startDate)

    setAuxEndDate(consumptionsFilters.endDate)
  }, [consumptionsFilters.startDate, consumptionsFilters.endDate])

  const [auxEndDateCompare, setAuxEndDateCompare] = useState(consumptionsFilters.endDateCompare)

  const [popupDate, setpopupDate] = useState('')
  const [popupDate2, setpopupDate2] = useState('')
  const [showDate, setshowDate] = useState(false)

  useEffect(() => {
    if (consumptionsFilters.granularity === 'S') {
      let dayOfWeekCompare = new Date(formatDateHyphens(auxEndDateCompare)).getDay()
      let todayCompare = new Date(formatDateHyphens(auxEndDateCompare)).getDate()
      let auxDateCompare = new Date(formatDateHyphens(auxEndDateCompare))
      let startDateCompare
      let endDateCompare

      // switch (dayOfWeekCompare) {
      //   case 0:
      //     startDateCompare = formatDate(new Date(auxDateCompare.getFullYear(), auxDateCompare.getMonth(), todayCompare - 6))
      //     endDateCompare = formatDate(new Date(auxDateCompare.getFullYear(), auxDateCompare.getMonth(), todayCompare))
      //     break;
      //   case 1:
      //     startDateCompare = formatDate(new Date(auxDateCompare.getFullYear(), auxDateCompare.getMonth(), todayCompare))
      //     endDateCompare = formatDate(new Date(auxDateCompare.getFullYear(), auxDateCompare.getMonth(), todayCompare + 6))
      //     break;
      //   case 2:
      //     startDateCompare = formatDate(new Date(auxDateCompare.getFullYear(), auxDateCompare.getMonth(), todayCompare - 1))
      //     endDateCompare = formatDate(new Date(auxDateCompare.getFullYear(), auxDateCompare.getMonth(), todayCompare + 5))
      //     break;
      //   case 3:
      //     startDateCompare = formatDate(new Date(auxDateCompare.getFullYear(), auxDateCompare.getMonth(), todayCompare - 2))
      //     endDateCompare = formatDate(new Date(auxDateCompare.getFullYear(), auxDateCompare.getMonth(), todayCompare + 4))
      //     break;
      //   case 4:
      //     startDateCompare = formatDate(new Date(auxDateCompare.getFullYear(), auxDateCompare.getMonth(), todayCompare - 3))
      //     endDateCompare = formatDate(new Date(auxDateCompare.getFullYear(), auxDateCompare.getMonth(), todayCompare + 3))
      //     break;
      //   case 5:
      //     startDateCompare = formatDate(new Date(auxDateCompare.getFullYear(), auxDateCompare.getMonth(), todayCompare - 4))
      //     endDateCompare = formatDate(new Date(auxDateCompare.getFullYear(), auxDateCompare.getMonth(), todayCompare + 2))
      //     break;
      //   case 6:
      //     startDateCompare = formatDate(new Date(auxDateCompare.getFullYear(), auxDateCompare.getMonth(), todayCompare - 5))
      //     endDateCompare = formatDate(new Date(auxDateCompare.getFullYear(), auxDateCompare.getMonth(), todayCompare + 1))
      //     break;
      // }
      setpopupDate(startDateCompare)
      setpopupDate2(endDateCompare)
      setshowDate(true)
    }
  }, [auxEndDateCompare])

  const handleCloseDialog = () => {
    setShowingDialog(false)
  }
  const handleOpenDialog = () => {
    setShowingDialog(true)
  }
  const handleCompare = () => {
    let dayOfWeekCompare = new Date(formatDateHyphens(auxEndDateCompare)).getDay()
    let todayCompare = new Date(formatDateHyphens(auxEndDateCompare)).getDate()
    let auxDateCompare = new Date(formatDateHyphens(auxEndDateCompare))
    let startDateCompare
    let endDateCompare

    // if (consumptionsFilters.granularity === 'D') {
    //   startDateCompare = auxEndDateCompare

    //   let auxDateCompare = new Date(formatDateHyphens(startDateCompare))
    //   auxDateCompare = new Date(auxDateCompare.getFullYear(), auxDateCompare.getMonth() + 1, 0)

    //   endDateCompare = formatDate(auxDateCompare)
    // }
    // else if (consumptionsFilters.granularity === 'S') {
    //   switch (dayOfWeekCompare) {
    //     case 0:
    //       startDateCompare = formatDate(new Date(auxDateCompare.getFullYear(), auxDateCompare.getMonth(), todayCompare - 6))
    //       endDateCompare = formatDate(new Date(auxDateCompare.getFullYear(), auxDateCompare.getMonth(), todayCompare))
    //       break;
    //     case 1:
    //       startDateCompare = formatDate(new Date(auxDateCompare.getFullYear(), auxDateCompare.getMonth(), todayCompare))
    //       endDateCompare = formatDate(new Date(auxDateCompare.getFullYear(), auxDateCompare.getMonth(), todayCompare + 6))
    //       break;
    //     case 2:
    //       startDateCompare = formatDate(new Date(auxDateCompare.getFullYear(), auxDateCompare.getMonth(), todayCompare - 1))
    //       endDateCompare = formatDate(new Date(auxDateCompare.getFullYear(), auxDateCompare.getMonth(), todayCompare + 5))
    //       break;
    //     case 3:
    //       startDateCompare = formatDate(new Date(auxDateCompare.getFullYear(), auxDateCompare.getMonth(), todayCompare - 2))
    //       endDateCompare = formatDate(new Date(auxDateCompare.getFullYear(), auxDateCompare.getMonth(), todayCompare + 4))
    //       break;
    //     case 4:
    //       startDateCompare = formatDate(new Date(auxDateCompare.getFullYear(), auxDateCompare.getMonth(), todayCompare - 3))
    //       endDateCompare = formatDate(new Date(auxDateCompare.getFullYear(), auxDateCompare.getMonth(), todayCompare + 3))
    //       break;
    //     case 5:
    //       startDateCompare = formatDate(new Date(auxDateCompare.getFullYear(), auxDateCompare.getMonth(), todayCompare - 4))
    //       endDateCompare = formatDate(new Date(auxDateCompare.getFullYear(), auxDateCompare.getMonth(), todayCompare + 2))
    //       break;
    //     case 6:
    //       startDateCompare = formatDate(new Date(auxDateCompare.getFullYear(), auxDateCompare.getMonth(), todayCompare - 5))
    //       endDateCompare = formatDate(new Date(auxDateCompare.getFullYear(), auxDateCompare.getMonth(), todayCompare + 1))
    //       break;
    //   }
    // }
    // else {
    //   startDateCompare = auxStartDateCompare
    //   endDateCompare = auxEndDateCompare
    // }

    setConsumptionsFilters({
      ...consumptionsFilters,
      startDateCompare: (consumptionsFilters.granularity === 'H' || consumptionsFilters.granularity === 'Q') ? endDateCompare : startDateCompare,
      endDateCompare: endDateCompare,
      compare: 'C'
    })

    setShowingDialog(false)
    setshowDate(false)
  }

  const endCompare = () => {

    setConsumptionsFilters({
      ...consumptionsFilters,
      compare: 'N'
    })

    setShowingDialog(false)
    setshowDate(false)
  }

  return (
    <>
{/* DIALOGO */}
      <Dialog className={classes.dialog} open={showingDialog} onClose={handleCloseDialog}>
        <DialogContent className={classes.dialogContainer}>
          <img src={CloseIcon} className={classes.closeButton} alt='' onClick={handleCloseDialog} />

          <Grid container className={classes.noItems}>
            <Grid item>
              <Grid container>
                <Grid container className='row title'>{selfConsumption ? t('supplies.suppliesDetails.components.consumption.charts.actions.popupTitleSelfConsumption') : t('supplies.suppliesDetails.components.consumption.charts.actions.popupTitle')}</Grid>

                <Grid container className={classes.text}>
                  {t('supplies.suppliesDetails.components.consumption.charts.actions.select')}
                  {consumptionsFilters.granularity === 'D' ?
                    t('supplies.suppliesDetails.components.consumption.charts.actions.month')
                    :
                    consumptionsFilters.granularity === 'S' ?
                      t('supplies.suppliesDetails.components.consumption.charts.actions.week')
                      :
                      t('supplies.suppliesDetails.components.consumption.charts.actions.day')}
                  {t('supplies.suppliesDetails.components.consumption.charts.actions.compare')}
                </Grid>

                <Grid container className={classes.dateContainer}>
                  {
                    consumptionsFilters.granularity === 'D' && 
                    <Grid item md={12} sm={12} xs={12} className={classes.menuItem}>
                      <div className={classes.label}>{t('supplies.suppliesDetails.components.consumption.charts.filters.monthCompare')}</div>

                      <Datepicker date={auxEndDateCompare} setDate={setAuxEndDateCompare} icon={true} showMonthYearPicker inline />
                    </Grid>
                  }
                  {
                    consumptionsFilters.granularity === 'S' &&
                    <Grid item md={12} sm={12} xs={12} className={classes.menuItem}>
                      <div className={classes.label}>{t('supplies.suppliesDetails.components.consumption.charts.filters.weekCompare')}</div>

                      {
                        showDate &&
                        <Grid container className={classes.label}>
                          {popupDate} - {popupDate2}
                        </Grid>
                      }

                      <Datepicker date={auxEndDateCompare} setDate={setAuxEndDateCompare} icon={true} inline />
                    </Grid>
                  }
                  {
                    (consumptionsFilters.granularity === 'H' || consumptionsFilters.granularity === 'Q') &&
                    <Grid item md={12} sm={12} xs={12} className={classes.menuItem}>
                      <div className={classes.label}>{t('supplies.suppliesDetails.components.consumption.charts.filters.dayCompare')}</div>

                      <Datepicker date={auxEndDateCompare} setDate={setAuxEndDateCompare} icon={true} inline />
                    </Grid>
                  }
                </Grid>

                <Grid container className='buttons'>
                  <Button
                    className={classes.buttonMobile}
                    text='Cancelar'
                    color='primary'
                    size='large'
                    variant='outlined'
                    onClick={handleCloseDialog}
                  />
                  <Grid item style={{ padding: 5 }} />
                  <Button
                    text='Aceptar'
                    color='primary'
                    size='large'
                    variant='contained'
                    onClick={handleCompare}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
      <Grid container justifyContent='space-between' alignItems='flex-end'>
{/* BOTONES */}
        <ViewsConsumption
          setIsLoading={setIsLoading}
          downLoadFilters={downLoadFilters}
          setDownLoadFilters={setDownLoadFilters}
          consumptionsFilters={consumptionsFilters}
          setConsumptionsFilters={setConsumptionsFilters}
          auxStartDate={auxStartDate}
          setAuxStartDate={setAuxStartDate}
          auxEndDate={auxEndDate}
          setAuxEndDate={setAuxEndDate}
          isGeneration={isGeneration}
          isGenerationTab={isGenerationTab}
          selfConsumption={selfConsumption}
          supplyData={supplyData}
        />
      </Grid>
    </>
  )
}

export default ToolbarConsumption
