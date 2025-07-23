import React, { useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import useStyles from './ClientDigitizationResumeGraph.styles'

import NoConsumptionIcon from '../../../../../../assets/icons/aviso_alerta_pop_up.svg'
import OkIcon from '../../../../../../assets/icons/ok.svg'
import EmailIcon from '../../../../../../assets/icons/Interfaz_90_sobre_mail_correo_postal.svg'
import MobileIcon from '../../../../../../assets/icons/Icon_sms.svg'
import OpenedPadlockIcon from '../../../../../../assets/icons/ico_candado_abierto.svg'
import ArrowIcon from '../../../../../../assets/icons/flecha_derecha.svg'

const ClientDigitizationResumeGraph = (props: any) => {

  const styles = useStyles({})
  const { t } = useTranslation()

  const { counters, totalRegisters, tabletRes, mobileRes } = props

  const labels = ['', '', '', '']
  const [totalBar, setTotalBar] = useState([] as any)
  const [emailsBar, setEmailsBar] = useState([] as any)
  const [smsBar, setSmsBar] = useState([] as any)
  const [openedUrlsBar, setOpenedUrlsBar] = useState([] as any)

  const [showDetails, setShowDetails] = useState(false)

  const colors = {  
    darkBlue: '#1a587f',
    lightBlue: '#66c2c9',
    orange: '#e57200',
    green: '#8e9300'
  }  

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: t('clientDigitizationControl.search.searchParameters.resumeGraph.totalUrl'),
        stack: '1',
        order: 1,
        data: totalBar,
        backgroundColor: colors.darkBlue
      },
      {
        label: t('clientDigitizationControl.search.searchParameters.resumeGraph.sentEmail'),
        stack: '1',
        order: 1,
        data: emailsBar,
        backgroundColor: colors.lightBlue
      },
      {
        label: t('clientDigitizationControl.search.searchParameters.resumeGraph.sentSms'),
        stack: '1',
        order: 1,
        data: smsBar,
        backgroundColor: colors.orange
      },
      {
        label: t('clientDigitizationControl.search.searchParameters.resumeGraph.openedUrls'),
        stack: '1',
        order: 1,
        data: openedUrlsBar,
        backgroundColor: colors.green
      }
    ]
  }

  const chartOptions = {
    datasets: {
      bar: {
        barPercentage: 2,
        categoryPercentage: 0.2,
      }
    },
    cornerRadius: 8,
    legend: {
      display: false,
      position: 'bottom'
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          stacked: true,
          gridLines: {
            display: false,
          },
          ticks: {
            display: false,
          }
        }
      ],
      yAxes: [{
        gridLines: {
          display: true,
          color: '#D8D8D8',
          borderDash: [12, 6]
        },
        ticks: {
          beginAtZero: true,
          stepsSize: 50,
          fontColor: '#004571',
          fontSize: 11,
          padding: 16,
          callback: function(value) {if (value % 1 === 0) {return value}}
        }
      }]
    },
    type: 'bar',
    data: chartData,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        tooltip: {
          enabled: false
        }
      }
    }
  }

  useEffect(() => {
    const auxTotalBar = counters.totalCounter
    const auxEmailsBar = counters.sentEmailsCounter
    const auxSmsBar = counters.sentSMSCounter
    const auxOpenedUrlsBar = counters.openedURLsCounter

    const auxTotalBarArray = [auxTotalBar, null, null, null]
    const auxEmailsBarArray = [null, auxEmailsBar, null, null]
    const auxSmsBarArray = [null, null, auxSmsBar, null]
    const auxOpenedUrlsBarArray = [null, null, null, auxOpenedUrlsBar]

    setTotalBar(auxTotalBarArray)
    setEmailsBar(auxEmailsBarArray)
    setSmsBar(auxSmsBarArray)
    setOpenedUrlsBar(auxOpenedUrlsBarArray)
  }, [counters, totalRegisters])

  return (
    <Grid container justifyContent='center'>
      {counters.totalCounter > 0 ?
        <>   
          <Grid container className={styles.barCont}>
            <Bar
              data={chartData}
              options={chartOptions}
            />
          </Grid>
          <Grid container className={styles.iconsCont}>
            <img src={OkIcon} className={`${styles.graphIcon} first`} alt='' />
            <img src={EmailIcon} className={`${styles.graphIcon} second`} alt='' />
            <img src={MobileIcon} className={`${styles.graphIcon} third`} alt='' />
            <img src={OpenedPadlockIcon} className={`${styles.graphIcon} fourth`} alt='' />
          </Grid>
        </>
      :
        <div className={styles.noResults}>
          <img src={NoConsumptionIcon} className={styles.alertIcon} alt='' />
          <div className={styles.text}>{t('clientDigitizationControl.search.searchParameters.resumeGraph.noResults')}</div>
        </div>
      }

      <Grid container className={styles.detailsCont}>
        <img src={ArrowIcon} className={`${styles.arrowIcon} ${showDetails ? 'up' : 'down'}`} alt='' />
        <div className={styles.detailsText} onClick={(() => setShowDetails(!showDetails))}>
          {t('clientDigitizationControl.search.searchParameters.resumeGraph.details')}
        </div>
      </Grid>

      {showDetails &&
        <Grid container>
          <Grid container direction={mobileRes ? 'column' : 'row'} className={styles.infoCont}>
            <Grid item><div className={`${styles.square} darkBlue`}/>{t('clientDigitizationControl.search.searchParameters.resumeGraph.totalUrl') + ':'}</Grid>
            <Grid item className={styles.counter}>{counters.totalCounter}</Grid>
          </Grid>
          <Grid container direction={mobileRes ? 'column' : 'row'} className={`${styles.infoCont} margin`}>
            <Grid item><div className={`${styles.square} lightBlue`}/>{t('clientDigitizationControl.search.searchParameters.resumeGraph.sentEmail') + ':'}</Grid>
            <Grid item className={styles.counter}>{counters.sentEmailsCounter}</Grid>
          </Grid>
          <Grid container direction={mobileRes ? 'column' : 'row'} className={`${styles.infoCont} margin`}>
            <Grid item><div className={`${styles.square} orange`}/>{t('clientDigitizationControl.search.searchParameters.resumeGraph.sentSms') + ':'}</Grid>
            <Grid item className={styles.counter}>{counters.sentSMSCounter}</Grid>
          </Grid>
          <Grid container direction={mobileRes ? 'column' : 'row'} className={`${styles.infoCont} margin`}>
            <Grid item><div className={`${styles.square} green`}/>{t('clientDigitizationControl.search.searchParameters.resumeGraph.openedUrls') + ':'}</Grid>
            <Grid item className={styles.counter}>{counters.openedURLsCounter}</Grid>
          </Grid>
        </Grid>
      }
    </Grid>
  )
}

export default ClientDigitizationResumeGraph