import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Redirect } from 'react-router-dom'


import Grid from '@material-ui/core/Grid';
import useStyles from './ControlPagos.styles';
import UserProfile from '../../common/interfaces/UserProfile';
import Spinner from '../../common/components/spinner/Spinner';
import PasarelaNavbar from './datosPasarela/PasarelaNavbar';
import { Card, Paper, useMediaQuery } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { thunkGetCardPaymentWithDate } from '../../provisions/store/actions/ProvisionsThunkActions';
import { PagosExpediente } from './datosPasarela/PagosExpediente';
import { Search } from './datosPasarela/Search';
import { PeticionesPasarela } from './datosPasarela/PeticionesPasarela';
import { DesgloseKO } from './datosPasarela/DesgloseKO';





export const ControlPagos = (props:any) => {
  const [isLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile>();
  const [tabValue, setTabValue] = useState<number>(0);
  let token = sessionStorage.getItem('token')
  let userRoles = sessionStorage.getItem('userRoles') || ''
  let userRolesArray = userRoles.split(',')
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const styles = useStyles({});
  const mobileRes = useMediaQuery('(max-width:576px)')

  const [payData, setpayData] = useState([]);
  const [payDataExpedientes, setPayDataExpedientes] = useState([]);

  useEffect(() => {
    dispatch(thunkGetCardPaymentWithDate((response) => {
      if (response) {
        setpayData(response.cardPayments.items)
        prepareDataForExpedientes(response.cardPayments.items)
      }
    }))      
  }, [])

	const prepareDataForExpedientes = (data) => {
		const arraySinRepetidos = data.filter((item) => item.status === 'OK')
		data.map((item) => {
			if (item.status !== 'OK') {
				if (arraySinRepetidos.filter(e => e.dossierNumber === item.dossierNumber).length === 0) {
					arraySinRepetidos.push(item)
				}
			}
		})
		setPayDataExpedientes(arraySinRepetidos)
	}

  {/* Cambiar la comprobación del rol por US_DASHBOARD_PASARELA una vez nos lo den de alta (descomentar línea de abajo)*/}
	// if (!userRolesArray.includes('US_DASHBOARD_PASARELA')) {
  if (!userRolesArray.includes('US_CC')) {
		if (userRolesArray.includes('US_SUPPLYPOINT_CLIENT') || userRolesArray.includes('US_MANAGER') || userRolesArray.includes('US_CC')) {
		  return <Redirect to='/dashboard' />
		} 
    else if (userRolesArray.includes('US_CONSULTANT')) {
		  return <Redirect to='/supplies' />
		} 
    else {
		  return <Redirect to='/landing' />
		}
	}     
     
	return (
		<>        
			{(isLoading) &&
				<Spinner fixed={true} />
			}
            
			<Grid  justify='center' alignItems='center' className={styles.container} xs={12}>
        <Card style={{borderBottom:'none'}}>
          <Grid container className={styles.maxWidthForBigScreens}>
            <PasarelaNavbar tabValue={tabValue} setTabValue={setTabValue} />

            <Grid container justify='flex-start' className={styles.subContainer}>
              {(tabValue === 0) &&
                <PagosExpediente payData={payDataExpedientes} />
              }
              {(tabValue === 1) &&
                <PeticionesPasarela payData={payData} />
              }
              {(tabValue === 2) &&
                <DesgloseKO payData={payData} />
              }
              {(tabValue === 3) &&
                <Search/>
              }
            </Grid>
          </Grid>
        </Card>
			</Grid>
		</>
	);
}
