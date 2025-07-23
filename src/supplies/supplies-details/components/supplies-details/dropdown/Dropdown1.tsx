import React from 'react'
import { useTranslation } from 'react-i18next'

import SwipeableViews from 'react-swipeable-views'
import Grid from '@material-ui/core/Grid'
import Courtesy from '../../../../../common/components/courtesy/Courtesy'
import Consumption from '../../consumption/consumption/Consumption'
import EstimatedMaximumPower from '../../consumption/estimated-maximum-power/EstimatedMaximumPower'
import Generation from '../../consumption/generation/Generation'
import SelfConsumption from '../../consumption/selfconsumption/SelfConsumption'
import useStyles from './Dropdown.styles'
import GeneralData from '../../general-data/GeneralData'
import Requests from '../../requests/Requests'
import { Contracts } from '../../contracts/Contracts'

const Dropdown1 = (props: any) => {
  const { t } = useTranslation()
  const classes = useStyles({})

  const {
    toggle,
    isLoading,
    setIsLoading,
    supplyData,
    consumptionsFilters,
    setConsumptionsFilters,
    selfConsumptionsFilters,
    setSelfConsumptionsFilters,
    supplantedUser,
    mdmout,
    powersFilters,
    setPowersFilters,
    querySelfConsumption,
    index,
    onChangeIndex,
    scheme,
    section,
    subSection,
    installationType,
    selfConsumptionType,
    setCreatingNewRequestFromMeter,
    creatingNewRequestFromMeter,
    navBarTabValue,
    consumptionTabValueFromURL,
    generationTabValueFromURL,
    contracts,
    ongoingContracts,
    closedContracts,
    loadedContracts,
    contractsError,
    setContractsError
  } = props

  return (
    <>
      <Grid container item xs={11} md={12} className={classes.viewsContainer}>
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
            {/* Genereación */}
            {
              mdmout === 'false' ?
                <Generation
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  supplyData={supplyData}
                  consumptionsFilters={consumptionsFilters}
                  setConsumptionsFilters={setConsumptionsFilters}
                  supplantedUser={supplantedUser}
                  querySelfConsumption={querySelfConsumption}
                  navBarTabValue={navBarTabValue}
                  tabValueFromURL={generationTabValueFromURL}
                />
                :
                <Courtesy />

            }

            {/* tabValue = 2*/}
            {/* Mi Consumo */}
            {
              mdmout === 'false' ?
                <Consumption
                  toggle={toggle}
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
                />
                :
                <Courtesy />
            }

            {/* tabValue = 3*/}
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
                />
                :
                <Courtesy />
            }

            {/* tabValue = 4*/}
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

            {/* tabValue = 5*/}
            <Requests
              supplyData={supplyData}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setCreatingNewRequestFromMeter={setCreatingNewRequestFromMeter}
              creatingNewRequestFromMeter={creatingNewRequestFromMeter}
            />

            {/* tablValue = 6 */}
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
            {/* Genereación */}
            {
              mdmout === 'false' ?
                <Generation
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  supplyData={supplyData}
                  consumptionsFilters={consumptionsFilters}
                  setConsumptionsFilters={setConsumptionsFilters}
                  supplantedUser={supplantedUser}
                  querySelfConsumption={querySelfConsumption}
                  navBarTabValue={navBarTabValue}
                  tabValueFromURL={generationTabValueFromURL}
                />
                :
                <Courtesy />

            }

            {/* tabValue = 2*/}
            {/* Mi Consumo */}
            {
              mdmout === 'false' ?
                <Consumption
                  toggle={toggle}
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
            <Requests
              supplyData={supplyData}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              setCreatingNewRequestFromMeter={setCreatingNewRequestFromMeter}
              creatingNewRequestFromMeter={creatingNewRequestFromMeter}
            />

             {/* tabValue = 5*/}
             {/* Contratos */}

             <Contracts 
               supplyData={supplyData}
               isLoading={isLoading}
               setIsLoading={setIsLoading}
               contracts={contracts}
               ongoingContracts={ongoingContracts}
               closedContracts={closedContracts}
               loadedContracts={loadedContracts}
               contractsError={contractsError}
             />

          </SwipeableViews>
        }
      </Grid>
    </>
  )
}

export default Dropdown1