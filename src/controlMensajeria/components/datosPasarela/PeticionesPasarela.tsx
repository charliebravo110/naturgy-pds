import { Grid, Typography, useMediaQuery } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { thunkGetCardPaymentWithRangeDate } from '../../../provisions/store/actions/ProvisionsThunkActions';
import useStyles from './PeticionesPasarela.styles';
import AlertIcon from '../../../assets/icons/aviso_alerta_pop_up.svg'
import Spinner from '../../../common/components/spinner/Spinner'


const rangeOfDays = (days) => {
  let today = new Date();
  let startDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - days
  );
  let endDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  let start =
    ('0' + startDate.getDate()).slice(-2) +
    '/' +
    ('0' + (startDate.getMonth() + 1)).slice(-2) +
    '/' +
    startDate.getFullYear().toString().slice(-2);
  let end =
    ('0' + endDate.getDate()).slice(-2) +
    '/' +
    ('0' + (endDate.getMonth() + 1)).slice(-2) +
    '/' +
    endDate.getFullYear().toString().slice(-2);
  return start + ',' + end;
};

const createStatusArrays = (cardPayments, days) => {
    let okCounts = {};
    let pendingCounts = {};
    let koCounts = {};
    let dates = [];
    let currentDate = new Date();

    for (let i = 0; i <= days; i++) {
        let date = new Date(currentDate);
        let dateString = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;
        okCounts[dateString] = 0;
        pendingCounts[dateString] = 0;
        koCounts[dateString] = 0;
        dates.unshift(dateString);
        currentDate.setDate(currentDate.getDate() - 1);
    }

    for (let i = 0; i < cardPayments.items.length; i++) {
        let item = cardPayments.items[i];
        let date = `${item.requestTimestamp.substr(8,2)}/${item.requestTimestamp.substr(5,2)}/${item.requestTimestamp.substr(2,2)}`
        if (dates.includes(date)) {
            if (item.status === 'OK') {
                okCounts[date]++;
            } else if (item.status === 'PENDIENTE') {
                pendingCounts[date]++;
            } else if (item.status === 'KO') {
                koCounts[date]++;
            }
        }
    }

    return {
        okCounts: Object.values(okCounts).reverse(),
        pendingCounts: Object.values(pendingCounts).reverse(),
        koCounts: Object.values(koCounts).reverse(),
        dates: dates
    }
}                    

export const PeticionesPasarela = (props: any) => {
  const { payData } = props;
  const classes = useStyles({})
  const { t } = useTranslation()
  const dispatch = useDispatch();
  const [labels, setLabels] = useState([]);
  const [OkCounts, setOkCounts] = useState([]);
  const [pendingCounts, setPendingCounts] = useState([]);
  const [KoCounts, setKoCounts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [isLoadingList, setIsLoadingList] = useState(false)
  const mobileRes = useMediaQuery('(max-width:576px)')
  let payDataOK = payData.filter((pago) => pago.status === 'OK');
  let payDataKO = payData.filter((pago) => pago.status === 'KO');
  let payDataPendiente = payData.filter((pago) => pago.status === 'PENDIENTE');
  

  const dataCircularGraph = {
    labels: [t('controlMensajeria.payData.payOK')+` (${payDataOK.length})`,t('controlMensajeria.payData.payPending')+` (${payDataPendiente.length})`,t('controlMensajeria.payData.payKO')+` (${payDataKO.length})`],
    datasets: [
      {
        label: t('controlMensajeria.payData.circularGraphTitle'),
        data: [payDataOK.length,payDataPendiente.length,payDataKO.length],
        backgroundColor: [
          '#1a587f',
          '#e57200', 
          '#66c2c9',       
        ],
        borderColor: [
          '#1a587f',
          '#e57200', 
          '#66c2c9',        
        ],
        borderWidth: 1,
      },
    ],
  };

  const dataLinearGraph = {
    labels: labels,
    datasets: [
      {
        fill: false,
        label: t('controlMensajeria.payData.payOK')+` (${OkCounts.reduce(function(acumulador, valorActual) {
            return acumulador + valorActual;
          }, 0)})`,
        data: OkCounts,
        borderColor:  '#1a587f',
        backgroundColor:  '#1a587f',
      },
        {
          fill: false,
          label: t('controlMensajeria.payData.payKO')+` (${KoCounts.reduce(function(acumulador, valorActual) {
            return acumulador + valorActual;
          }, 0)})`,
          data: KoCounts,
          borderColor: '#66c2c9',     
          backgroundColor:  '#66c2c9',     
        },

      {
        fill: false,
        label: t('controlMensajeria.payData.payPending')+` (${pendingCounts.reduce(function(acumulador, valorActual) {
            return acumulador + valorActual;
          }, 0)})`,
        data: pendingCounts,
        borderColor:   '#e57200', 
        backgroundColor:   '#e57200',    
      },
    ],
  };

  const optionsCircularGraph = {
    title: {
        display: true,
        text: t('controlMensajeria.payData.circularGraphTitle')
    },
    responsive: true,
    legend: {
      display: true,
      position: (mobileRes) ? 'top' : 'right',
    },
    maintainAspectRatio: (mobileRes) ? false : true,
  };

  const optionsLinearGraph = {
    responsive: true,
    legend: {
      display: true,
      position: 'top',
    },
    maintainAspectRatio: (mobileRes) ? false : true,
  };

  const getRangeDateData = (days: any,index:any) => {
    setIsLoadingList(true)
    setSelected(index);
    dispatch(
      thunkGetCardPaymentWithRangeDate(rangeOfDays(days), (response) => {
        if (response.cardPayments) {
          const counts = createStatusArrays(response.cardPayments,days);
          setOkCounts(counts.okCounts);
          setPendingCounts(counts.pendingCounts)
          setKoCounts(counts.koCounts)
          setLabels(counts.dates)
        }
        setIsLoadingList(false)
      })
    );
  };

  useEffect(() => {
    getRangeDateData(6,0)
  }, [])  

  return (
    <>    
      {
        isLoadingList &&
        <Spinner fixed={true} />
      }

      <Grid container className={classes.generalCont}>
        {payData.length > 0 ?
          <Grid item md={6} xs={12} className={classes.graphResponsive}>
            <Pie data={dataCircularGraph} options={optionsCircularGraph} />
          </Grid>
        :
          <Grid container className={classes.noDataCont}>
            <Grid md={6} xs={12} container direction='column' className={classes.alertCont}>
              <img src={AlertIcon} alt='' />
              <div className={classes.noDataText}>{t('controlMensajeria.payData.noData')}</div>
            </Grid>
          </Grid>
        }
        <Grid container item className={classes.optionsCont}>
          <Grid item>
            <Typography  className={selected === 0 ? classes.typographySelected : classes.typography} onClick={() => getRangeDateData(6,0)}>{t('controlMensajeria.payData.week')}</Typography>
          </Grid>
          <Grid item>
            <Typography  className={selected === 1 ? classes.typographySelected : classes.typography} onClick={() => getRangeDateData(14,1)}>{t('controlMensajeria.payData.2week')}</Typography>
          </Grid>
          <Grid item>
            <Typography  className={selected === 2 ? classes.typographySelected : classes.typography} onClick={() => getRangeDateData(29,2)}>{t('controlMensajeria.payData.month')}</Typography>
          </Grid>
        </Grid>
        <Grid item md={8} xs={12} className={classes.graphResponsiveLinear}>
          <Line options={optionsLinearGraph} data={dataLinearGraph} />
        </Grid>
      </Grid>
    </>
  );
};
