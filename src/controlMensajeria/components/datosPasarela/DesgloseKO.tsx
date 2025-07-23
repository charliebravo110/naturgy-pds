import { Grid, Typography, useMediaQuery } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { thunkGetCardPaymentWithRangeDate } from '../../../provisions/store/actions/ProvisionsThunkActions';
import useStyles from './DesgloseKO.styles';
import AlertIcon from '../../../assets/icons/aviso_alerta_pop_up.svg'
import Spinner from '../../../common/components/spinner/Spinner'

interface StatusArrays {
    cod101Counts: number[];
    cod102Counts: number[];
    cod103Counts: number[];
    cod110Counts: number[];
    cod999Counts: number[];
    dates: string[];
}

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

const createStatusArrays = (cardPayments, days):StatusArrays => {
  let cod101Counts = {};
  let cod102Counts = {};
  let cod103Counts = {};
  let cod110Counts = {};
  let cod999Counts = {};
  let dates = []
  let currentDate = new Date();

  for (let i = 0; i <= days; i++) {
      let date = new Date(currentDate);
      let dateString = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;
      cod101Counts[dateString] = 0;
      cod102Counts[dateString] = 0;
      cod103Counts[dateString] = 0;
      cod110Counts[dateString] = 0;
      cod999Counts[dateString] = 0;
      dates.unshift(dateString);
      currentDate.setDate(currentDate.getDate() - 1);
  }

  for (let i = 0; i < cardPayments.items.length; i++) {
    let item = cardPayments.items[i];
    let date = `${item.requestTimestamp.substr(8,2)}/${item.requestTimestamp.substr(5,2)}/${item.requestTimestamp.substr(2,2)}`;
    if (dates.includes(date)) {
      switch(item.result) {
        case '101':
        cod101Counts[date]++;
        break;
        case '102':
        cod102Counts[date]++;
        break;
        case '103':
        cod103Counts[date]++;
        break;
        case '110':
        cod110Counts[date]++;
        break;
        case '999':
        cod999Counts[date]++;
        break;
        default:
        break;
      }
    }
  }
  return {
    cod101Counts: Object.values(cod101Counts).reverse() as number[],
    cod102Counts: Object.values(cod102Counts).reverse() as number[],
    cod103Counts: Object.values(cod103Counts).reverse() as number[],
    cod110Counts: Object.values(cod110Counts).reverse() as number[],
    cod999Counts: Object.values(cod999Counts).reverse() as number[],
    dates: dates
  }
}     

export const DesgloseKO = (props: any) => {
  const { payData } = props;
  const classes = useStyles({})
  const { t } = useTranslation()
  const dispatch = useDispatch();
  const [labels, setLabels] = useState([]);
  const [counts, setcounts] = useState({} as StatusArrays);   
  const [selected, setSelected] = useState(null);
  const [isLoadingList, setIsLoadingList] = useState(false)
  const mobileRes = useMediaQuery('(max-width:576px)')
  const [cod101Sum, setCod101Sum] = useState(0) 
  const [cod102Sum, setCod102Sum] = useState(0) 
  const [cod103Sum, setCod103Sum] = useState(0) 
  const [cod110Sum, setCod110Sum] = useState(0) 
  const [cod999Sum, setCod999Sum] = useState(0)
  const [hasData, setHasData] = useState(false)  
  
  let payDataKO = payData.filter((pago) => pago.status === 'KO');

  let cod101 = payDataKO.filter((pago) => pago.result === '101');
  let cod102 = payDataKO.filter((pago) => pago.result === '102');
  let cod103 = payDataKO.filter((pago) => pago.result === '103');
  let cod110 = payDataKO.filter((pago) => pago.result === '110');
  let cod999 = payDataKO.filter((pago) => pago.result === '999');

  const dataCircularGraph = {
    labels: [t('controlMensajeria.payData.101')+` (${cod101.length})`,t('controlMensajeria.payData.102')+` (${cod102.length})`,t('controlMensajeria.payData.103')+` (${cod103.length})`,t('controlMensajeria.payData.110')+` (${cod110.length})`,t('controlMensajeria.payData.999')+` (${cod999.length})`],
    datasets: [
      {
        label: t('controlMensajeria.payData.circularGraphTitle'),
        data: [cod101.length,cod102.length,cod103.length,cod110.length,cod999.length],
        backgroundColor: [
          '#1a587f',
          '#e57200', 
          '#66c2c9',  
          '#d3222a',
          '#1F8A70'
        ],
        borderColor: [
          '#1a587f',
          '#e57200', 
          '#66c2c9',  
          '#d3222a',
          '#1F8A70'
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
        label: t('controlMensajeria.payData.101')+` (${cod101Sum})`,
        data: counts.cod101Counts,
        borderColor: '#1a587f',
        backgroundColor: '#1a587f',
      },
        {
          fill: false,
          label: t('controlMensajeria.payData.102')+` (${cod102Sum})`,
          data: counts.cod102Counts,
          borderColor:  '#e57200', 
          backgroundColor:  '#e57200', 
        },

      {
        fill: false,
        label: t('controlMensajeria.payData.103')+` (${cod103Sum})`,
        data: counts.cod103Counts,
        borderColor:    '#66c2c9',  
        backgroundColor:    '#66c2c9',  
      },

      {
        fill: false,
        label: t('controlMensajeria.payData.110')+` (${cod110Sum})`,
        data: counts.cod110Counts,
        borderColor: '#d3222a',
        backgroundColor: '#d3222a',
      },

      {
        fill: false,
        label: t('controlMensajeria.payData.999')+` (${cod999Sum})`,
        data: counts.cod999Counts,
        borderColor: '#1F8A70',
        backgroundColor: '#1F8A70',
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
    innerWidth:'100%'
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
          const countsResult:StatusArrays = createStatusArrays(response.cardPayments,days);
          setcounts(countsResult);
          setLabels(countsResult.dates)
          setCod101Sum(countsResult.cod101Counts.reduce(function(acumulador, valorActual) {
            return acumulador + valorActual;
          }, 0))
          setCod102Sum(countsResult.cod102Counts.reduce(function(acumulador, valorActual) {
            return acumulador + valorActual;
          }, 0))
          setCod103Sum(countsResult.cod103Counts.reduce(function(acumulador, valorActual) {
            return acumulador + valorActual;
          }, 0))
          setCod110Sum(countsResult.cod110Counts.reduce(function(acumulador, valorActual) {
            return acumulador + valorActual;
          }, 0))
          setCod999Sum(countsResult.cod999Counts.reduce(function(acumulador, valorActual) {
            return acumulador + valorActual;
          }, 0))
        }
        setIsLoadingList(false)
      })
    );
  };

  const checkData = (data) => {
    let status = false
    data.map((item) => {
      if (item.status === 'KO') {
        status = true
      }
    })
    return status
  }

  useEffect(() => {
    if (payData.length > 0) {
      setHasData(checkData(payData))
    }
  }, [payData.length])

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
        {payData.length > 0 && hasData ?
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
        <Grid container className={classes.optionsCont}>
          <Grid item>
            <Typography className={selected === 0 ? classes.typographySelected : classes.typography} onClick={() => getRangeDateData(6,0)}>{t('controlMensajeria.payData.week')}</Typography>
          </Grid>
          <Grid item>
            <Typography className={selected === 1 ? classes.typographySelected : classes.typography} onClick={() => getRangeDateData(14,1)}>{t('controlMensajeria.payData.2week')}</Typography>
          </Grid>
          <Grid item>
            <Typography className={selected === 2 ? classes.typographySelected : classes.typography} onClick={() => getRangeDateData(29,2)}>{t('controlMensajeria.payData.month')}</Typography>
          </Grid>
        </Grid>
        <Grid item md={8} xs={12} className={classes.graphResponsiveLinear}>
          <Line options={optionsLinearGraph} data={dataLinearGraph} />
        </Grid>
      </Grid>
    </>
  );
};
