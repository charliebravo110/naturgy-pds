import React, { useState, useEffect } from 'react'
import { Bar } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import useStyles from './MensajeriaResumeGraph.styles'

import NoConsumptionIcon from '../../../../assets/icons/aviso_alerta_pop_up.svg'
import UserIcon from '../../../../assets/icons/usuario.svg'
import OkIcon from '../../../../assets/icons/ok.svg'
import RegisteredUserIcon from '../../../../assets/icons/usuario_registrado.svg'
import KoIcon from '../../../../assets/icons/ko.svg'
import ArrowIcon from '../../../../assets/icons/flecha_derecha.svg'

const MensajeriaResumeGraph = (props: any) => {

  const styles = useStyles({})
  const { t } = useTranslation()

  const { counters, totalRegisters, tabletRes, mobileRes } = props

  const labels = ['', '', '', '', '', '', '']
  const [newUsers, setNewUsers] = useState([] as any)
  const [sentCorrectly, setSentCorrectly] = useState([] as any)
  const [newRegisters, setNewRegisters] = useState([] as any)
  const [notSent, setNotSent] = useState([] as any)
  const [newUsersUnique, setnewUsersUnique] = useState([] as any)
  const [sentCorrectlyUnique, setsentCorrectlyUnique] = useState([] as any)
  const [notSentUnique, setnotSentUnique] = useState([] as any)
  const [showDetails, setShowDetails] = useState(false)

  const colors = {
    darkBlueVariant: 'rgba(124, 160, 183, 0.5)',    
    darkBlue: '#1a587f',
    lightBlueVariant: 'rgba(124, 202, 210, 0.5)',
    lightBlue: '#66c2c9',
    orange: '#e57200',
    redVariant: 'rgba(229, 142, 147, 0.5)',
    red: '#d3222a'
  }  

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: t('controlMensajeria.management.searchResume.searchResult.summaryPanel.newUsers'),
        stack: '1',
        order: 1,
        data: newUsers,
        backgroundColor: colors.darkBlueVariant
      },
      {
        label: t('controlMensajeria.management.searchResume.searchResult.summaryPanel.newUniqueUsers'),
        stack: '1',
        order: 1,
        data: newUsersUnique,
        backgroundColor: colors.darkBlue
      },
      {
        label: t('controlMensajeria.management.searchResume.searchResult.summaryPanel.correctShipments'),
        stack: '1',
        order: 1,
        data: sentCorrectly,
        backgroundColor: colors.lightBlueVariant
      },
      {
        label: t('controlMensajeria.management.searchResume.searchResult.summaryPanel.correctUniqueShipments'),
        stack: '1',
        order: 1,
        data: sentCorrectlyUnique,
        backgroundColor: colors.lightBlue
      },
      {
        label: t('controlMensajeria.management.searchResume.searchResult.summaryPanel.newRegisters'),
        stack: '1',
        order: 1,
        data: newRegisters,
        backgroundColor: colors.orange
      },
      {
        label: t('controlMensajeria.management.searchResume.searchResult.summaryPanel.incorrectShipments'),
        stack: '1',
        order: 1,
        data: notSent,
        backgroundColor: colors.redVariant
      },
      {
        label: t('controlMensajeria.management.searchResume.searchResult.summaryPanel.incorrectUniqueShipments'),
        stack: '1',
        order: 1,
        data: notSentUnique,
        backgroundColor: colors.red
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
    const auxNewUsers = counters.totalCounter
    const auxNewUsersUnique = counters.totalCounterNoDuplicates
    const auxSentCorrectly = counters.correctlySendCounter
    const auxSentCorrectlyUnique = counters.correctlySendCounterNoDuplicates
    const auxNewRegisters = counters.registeredCounter
    const auxNotSent = counters.notSent    
    const auxNotSentUnique = counters.notSentNoDuplicates

    const auxNewUsersArray = [auxNewUsers, null, null, null, null, null, null]
    const auxNewUsersUniqueArray = [null, auxNewUsersUnique, null, null, null, null, null]
    const auxSentCorrectlyArray = [null, null, auxSentCorrectly, null, null, null, null]
    const auxSentCorrectlyUniqueArray = [null, null, null, auxSentCorrectlyUnique, null, null, null]
    const auxNewRegistersArray = [null, null, null, null, auxNewRegisters, null, null]
    const auxNotSentArray = [null, null, null, null, null, auxNotSent, null]    
    const auxNotSentUniqueArray = [null, null, null, null, null, null, auxNotSentUnique]

    setNewUsers(auxNewUsersArray)
    setnewUsersUnique(auxNewUsersUniqueArray)
    setSentCorrectly(auxSentCorrectlyArray)
    setsentCorrectlyUnique(auxSentCorrectlyUniqueArray)
    setNewRegisters(auxNewRegistersArray)
    setNotSent(auxNotSentArray)    
    setnotSentUnique(auxNotSentUniqueArray)
  }, [counters, totalRegisters])

  return (
    <Grid container justifyContent='center'>
      {counters.totalCounterNoDuplicates > 0 ?
        <>   
          <Grid container className={styles.barCont}>
            <Bar
              data={chartData}
              options={chartOptions}
            />
          </Grid>
          <Grid container className={styles.iconsCont}>
            <img src={UserIcon} className={`${styles.graphIcon} first`} alt='' />
            <img src={UserIcon} className={`${styles.graphIcon} second`} alt='' />
            <img src={OkIcon} className={`${styles.graphIcon} third`} alt='' />
            <img src={OkIcon} className={`${styles.graphIcon} fourth`} alt='' />
            <img src={RegisteredUserIcon} className={`${styles.graphIcon} fifth`} alt='' />
            <img src={KoIcon} className={`${styles.graphIcon} sixth`} alt='' />
            <img src={KoIcon} className={`${styles.graphIcon} seventh`} alt='' />
          </Grid>
        </>
      :
        <div className={styles.noResults}>
          <img src={NoConsumptionIcon} className={styles.alertIcon} alt='' />

          <div className={styles.text}>{t('controlMensajeria.graph.noResults')}</div>
        </div>
      }

      <Grid container className={styles.detailsCont}>
        <img src={ArrowIcon} className={`${styles.arrowIcon} ${showDetails ? 'up' : 'down'}`} alt='' />
        <div className={styles.detailsText} onClick={(() => setShowDetails(!showDetails))}>
          {t('controlMensajeria.management.searchResume.searchResult.summaryPanel.details')}
        </div>
      </Grid>

      {showDetails &&
        <Grid container>
          <Grid container direction={mobileRes ? 'column' : 'row'} className={styles.infoCont}>
            <Grid item><div className={`${styles.square} darkBlueVariant`}/>{t('controlMensajeria.management.searchResume.searchResult.summaryPanel.newUsers') + ':'}</Grid>
            <Grid item className={styles.counter}>{counters.totalCounter}</Grid>
          </Grid>
          <Grid container direction={mobileRes ? 'column' : 'row'} className={`${styles.infoCont} margin`}>
            <Grid item><div className={`${styles.square} darkBlue`}/>{t('controlMensajeria.management.searchResume.searchResult.summaryPanel.newUniqueUsers') + ':'}</Grid>
            <Grid item className={styles.counter}>{counters.totalCounterNoDuplicates}</Grid>
          </Grid>
          <Grid container direction={mobileRes ? 'column' : 'row'} className={`${styles.infoCont} margin`}>
            <Grid item><div className={`${styles.square} lightBlueVariant`}/>{t('controlMensajeria.management.searchResume.searchResult.summaryPanel.correctShipments') + ':'}</Grid>
            <Grid item className={styles.counter}>{counters.correctlySendCounter}</Grid>
          </Grid>
          <Grid container direction={mobileRes ? 'column' : 'row'} className={`${styles.infoCont} margin`}>
            <Grid item><div className={`${styles.square} lightBlue`}/>{t('controlMensajeria.management.searchResume.searchResult.summaryPanel.correctUniqueShipments') + ':'}</Grid>
            <Grid item className={styles.counter}>{counters.correctlySendCounterNoDuplicates}</Grid>
          </Grid>
          <Grid container direction={mobileRes ? 'column' : 'row'} className={`${styles.infoCont} margin`}>
            <Grid item><div className={`${styles.square} orange`}/>{t('controlMensajeria.management.searchResume.searchResult.summaryPanel.newRegisters') + ':'}</Grid>
            <Grid item className={styles.counter}>{counters.registeredCounter}</Grid>
          </Grid>
          <Grid container direction={mobileRes ? 'column' : 'row'} className={`${styles.infoCont} margin`}>
            <Grid item><div className={`${styles.square} redVariant`}/>{t('controlMensajeria.management.searchResume.searchResult.summaryPanel.incorrectShipments') + ':'}</Grid>
            <Grid item className={styles.counter}>{counters.notSent}</Grid>
          </Grid>
          <Grid container direction={mobileRes ? 'column' : 'row'} className={`${styles.infoCont} margin`}>
            <Grid item><div className={`${styles.square} red`}/>{t('controlMensajeria.management.searchResume.searchResult.summaryPanel.incorrectUniqueShipments') + ':'}</Grid>
            <Grid item className={styles.counter}>{counters.notSentNoDuplicates}</Grid>
          </Grid>
        </Grid>
      }
    </Grid>
  )
}

export default MensajeriaResumeGraph