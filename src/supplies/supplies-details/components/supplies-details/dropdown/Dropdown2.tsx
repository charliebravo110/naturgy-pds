import React from 'react'
import { useTranslation } from 'react-i18next'

import SwipeableViews from 'react-swipeable-views'
import Grid from '@material-ui/core/Grid'
import Courtesy from '../../../../../common/components/courtesy/Courtesy'
import Certificates from '../../certificates/Certificates'
import Consumption from '../../consumption/consumption/Consumption'
import EstimatedMaximumPower from '../../consumption/estimated-maximum-power/EstimatedMaximumPower'
import SelfConsumption from '../../consumption/selfconsumption/SelfConsumption'
import IncidentHistory from '../../incidentHistory/IncidentHistory'
import Meter from '../../meter/Meter'
import ReportFault from '../../reportFault/ReportFault'
import Requests from '../../requests/Requests'
import useStyles from './Dropdown.styles'
import GeneralData from '../../general-data/GeneralData'
import { Contracts } from '../../contracts/Contracts'


const Dropdown2 = (props: any) => {
  const { t } = useTranslation()
  const classes = useStyles({})

  const {
    isLoading,
    setIsLoading,
    supplyData,
    consumptionsFilters,
    setConsumptionsFilters,
    selfConsumptionsFilters,
    setSelfConsumptionsFilters,
    supplantedUser,
    mdmout,
    strnout,
    powersFilters,
    setPowersFilters,
    querySelfConsumption,
    tabValue,
    setTabValue,
    userData,
    setMenuTabValue,
    setCreatingNewRequestFromMeter,
    navToMeter,
    setNavToMeter,
    creatingNewRequestFromMeter,
    index,
    onChangeIndex,
    scheme,
    section,
    subSection,
    installationType,
    selfConsumptionType,
    navBarTabValue,
    consumptionTabValueFromURL,
    billingStartDate,
    setBilingStartDate,
    billingEndDate,
    setBilingEndDate,
    contracts,
    ongoingContracts,
    closedContracts,
    loadedContracts,
    contractsError,
    setContractsError
  } = props

  return (
    <>
      <Grid container item xs={11} md={12} className={classes.viewsContainer} style={{ maxWidth: '100%', }}>
        {/* Submenú. El orden de las clases es el orden en que aparece
          en el desplegable. Importante mantenerlo */}

        {(supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau !== '') ?
          <SwipeableViews
            index={index}
            className={classes.views}
            onChangeIndex={onChangeIndex}
          >

            {/* tabValue = 0*/}
            {/* Datos Generales */}
            <GeneralData
              supplyData={supplyData}
              scheme={scheme}
              section={section}
              subSection={subSection}
              installationType={installationType}
              selfConsumptionType={selfConsumptionType}
            />

            {/* tabValue = 1*/}
            {/* Mi Consumo */}
            {
              mdmout === 'false' ?
                <Consumption
                  isSelfConsumption={false}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  supplyData={supplyData}
                  consumptionsFilters={consumptionsFilters}
                  setConsumptionsFilters={setConsumptionsFilters}
                  supplantedUser={supplantedUser}
                  querySelfConsumption={querySelfConsumption}
                  navBarTabValue={navBarTabValue}
                  tabValueFromURL={consumptionTabValueFromURL}
                  billingStartDate={billingStartDate}
                  setBilingStartDate={setBilingStartDate}
                  billingEndDate={billingEndDate}
                  setBilingEndDate={setBilingEndDate}
                />
                :
                <Courtesy />
            }

            {/* tabValue = 2*/}
            {/* Autoconsumo */}

            {
              mdmout === 'false' ?
                <SelfConsumption
                  isSelfConsumption={true}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  supplyData={supplyData}
                  consumptionsFilters={selfConsumptionsFilters}
                  setConsumptionsFilters={setSelfConsumptionsFilters}
                  supplantedUser={supplantedUser}
                  querySelfConsumption={querySelfConsumption}
                  billingStartDate={billingStartDate}
                  setBilingStartDate={setBilingStartDate}
                  billingEndDate={billingEndDate}
                  setBilingEndDate={setBilingEndDate}
                />

                :
                <Courtesy />
            }

            {/* tabValue = 3*/}
            {/* Potencia Máxima Demandada */}
            {
              mdmout === 'false' ?
                <EstimatedMaximumPower
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  supplyData={supplyData}
                  powersFilters={powersFilters}
                  setPowersFilters={setPowersFilters}
                  supplantedUser={supplantedUser}
                />
                :
                <Courtesy />

            }

            {/* tabValue = 4*/}
            {/* Certificados */}
            {
              mdmout === 'false' ?
                <Certificates
                  supplyData={supplyData}
                  setIsLoading={setIsLoading}
                  setTabValue={setTabValue}
                  setNavToMeter={setNavToMeter}
                  billingStartDate={billingStartDate}
                  setBilingStartDate={setBilingStartDate}
                  billingEndDate={billingEndDate}
                  setBilingEndDate={setBilingEndDate}
                />
                :
                <Courtesy />
            }

            {/* tabValue = 5*/}
            {/* Mi Contador */}
            {
              mdmout === 'false' && strnout === 'false' ?
                <Meter
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  supplyData={supplyData}
                  tabValue={tabValue}
                  setTabValue={setTabValue}
                  setMenuTabValue={setMenuTabValue}
                  setCreatingNewRequestFromMeter={setCreatingNewRequestFromMeter}
                  navToMeter={navToMeter}
                  setNavToMeter={setNavToMeter}
                />
                :
                <Courtesy />
            }

            {/* tabValue = 6*/}
            {/* Comunica tu incidencia */}
            <ReportFault
              supplyData={supplyData}
              userData={userData}
              tabValue={tabValue}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />

            {/* tabValue = 7*/}
            {/* Histórico de incidencias */}
            <IncidentHistory
              supplyData={supplyData}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />

            {/* tabValue = 8*/}
            {/* Peticiones */}
            <Requests
              supplyData={supplyData}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setCreatingNewRequestFromMeter={setCreatingNewRequestFromMeter}
              creatingNewRequestFromMeter={creatingNewRequestFromMeter}
            />

            {/* tabValue = 9*/}
            {/* Contratos */}
            <Contracts
              supplyData={supplyData}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              contracts={contracts}
              ongoingContracts={ongoingContracts}
              closedContracts={closedContracts}
              contractsError={contractsError}
              loadedContracts={loadedContracts}
            />
            
          </SwipeableViews>

          :

          <SwipeableViews
            index={index}
            className={classes.views}
            onChangeIndex={onChangeIndex}
          >

            {/* tabValue = 0*/}
            {/* Datos Generales */}
            <GeneralData
              supplyData={supplyData}
              scheme={scheme}
              section={section}
              subSection={subSection}
              installationType={installationType}
              selfConsumptionType={selfConsumptionType}
            />

            {/* tabValue = 1*/}
            {/* Mi Consumo */}
            {
              mdmout === 'false' ?
                <Consumption
                  isSelfConsumption={false}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  supplyData={supplyData}
                  consumptionsFilters={consumptionsFilters}
                  setConsumptionsFilters={setConsumptionsFilters}
                  supplantedUser={supplantedUser}
                  querySelfConsumption={querySelfConsumption}
                  navBarTabValue={navBarTabValue}
                  tabValueFromURL={consumptionTabValueFromURL}
                  billingStartDate={billingStartDate}
                  setBilingStartDate={setBilingStartDate}
                  billingEndDate={billingEndDate}
                  setBilingEndDate={setBilingEndDate}
                />
                :
                <Courtesy />
            }

            {/* tabValue = 2*/}
            {/* Potencia Máxima Demandada */}
            {
              mdmout === 'false' ?
                <EstimatedMaximumPower
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  supplyData={supplyData}
                  powersFilters={powersFilters}
                  setPowersFilters={setPowersFilters}
                  supplantedUser={supplantedUser}
                />
                :
                <Courtesy />

            }

            {/* tabValue = 3*/}
            {/* Certificados */}
            {
              mdmout === 'false' ?
                <Certificates
                  supplyData={supplyData}
                  setIsLoading={setIsLoading}
                  setTabValue={setTabValue}
                  setNavToMeter={setNavToMeter}
                  billingStartDate={billingStartDate}
                  setBilingStartDate={setBilingStartDate}
                  billingEndDate={billingEndDate}
                  setBilingEndDate={setBilingEndDate}
                />
                :
                <Courtesy />
            }

            {/* tabValue = 4*/}
            {/* Mi Contador */}
            {
              mdmout === 'false' && strnout === 'false' ?
                <Meter
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  supplyData={supplyData}
                  tabValue={tabValue}
                  setTabValue={setTabValue}
                  setMenuTabValue={setMenuTabValue}
                  setCreatingNewRequestFromMeter={setCreatingNewRequestFromMeter}
                  navToMeter={navToMeter}
                  setNavToMeter={setNavToMeter}
                />
                :
                <Courtesy />
            }

            {/* tabValue = 5*/}
            {/* Comunica tu incidencia */}
            <ReportFault
              supplyData={supplyData}
              userData={userData}
              tabValue={tabValue}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />

            {/* tabValue = 6*/}
            {/* Histórico de incidencias */}
            <IncidentHistory
              supplyData={supplyData}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />

            {/* tabValue = 7*/}
            {/* Peticiones */}
            <Requests
              supplyData={supplyData}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setCreatingNewRequestFromMeter={setCreatingNewRequestFromMeter}
              creatingNewRequestFromMeter={creatingNewRequestFromMeter}
            />

            {/* tabValue = 8*/}
            {/* Contratos */}
            <Contracts 
                supplyData={supplyData}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                contracts={contracts}
                ongoingContracts={ongoingContracts}
                closedContracts={closedContracts}
                contractsError={contractsError}
                setContractsError={setContractsError}
                loadedContracts={loadedContracts}
            />


          </SwipeableViews>
        }
      </Grid>
    </>
  )
}

export default Dropdown2