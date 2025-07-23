import React, { useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'

// import Types from './types/Types'
import Dates from './dates/Dates'
import BillingDates from './billing-dates/BillingDates'
import Button from '../../../../../common/components/button/Button'

import useStyles from './Toolbar.styles'
import { useTranslation } from 'react-i18next'
// LCS: Importa la función - Wave 3
import { sendGAEvent, removeEmails } from '../../../../../core/utils/gtm'

const Toolbar = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    handleDownload,
    selection,
    setTabValue,
    setNavToMeter,
    startDatesList,
    endDatesList,
    supplyData
  } = props

  const [isSelfConsumption, setIsSelfConsumption] = useState<boolean>()

  useEffect(() => {
    setIsSelfConsumption(supplyData.isSelfConsumption ? true : false)
  }, [])

  useEffect(() => {
    if (isSelfConsumption && supplyData.isSelfConsumption.generationCups === '') {
      setIsSelfConsumption(false)
    }
  }, [isSelfConsumption])

  const navToMeter = () => {    
    sendGAEvent({
      event: 'download',
      section_name: 'mis suministros',
      subsection_name: 'mis certificados de consumo',
      click_text: 'descargar',
      elemet_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      browsing_type: sessionStorage.getItem('browsing_type'),
      cups: supplyData.cups,
      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
      certificate_type: 'lectura instantanea'
    });
    setTabValue(4)
    setNavToMeter(true)
  }

  return (
    <Grid container>
      {
        /*
        <Grid item>
          <Types type={type} setType={setType} />
        </Grid>
        */
      }

      <Grid item />

      <Grid item>
        <Grid container className={classes.rightContainer}>

          {(isSelfConsumption && selection === 'option3') ?
            <Grid container className={classes.descriptionSelfConsumption}>
              {t('supplies.suppliesDetails.components.certificates.selfConsumptionInfo')}
            </Grid>
            :
            <Grid item>
              {selection === 'option1' &&
                <Dates
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                />
              }

              {(selection === 'option2' || selection === 'option3') &&
                <BillingDates
                  startDate={startDate}
                  setStartDate={setStartDate}
                  endDate={endDate}
                  setEndDate={setEndDate}
                  startDatesList={startDatesList}
                  endDatesList={endDatesList}
                />
              }
            </Grid>
          }
          <Grid item>
            <Button
              className={classes.downloadButton}
              text='Descargar'
              color='primary'
              size='medium'
              variant='contained'
              onClick={selection !== 'option4' ? handleDownload : navToMeter}
              disabled={(selection !== 'option4') && !(selection !== '' && startDate && endDate)}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Toolbar
