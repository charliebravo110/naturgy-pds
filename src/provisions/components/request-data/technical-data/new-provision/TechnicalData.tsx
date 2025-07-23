import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Typography from '@material-ui/core/Typography'

import TechnicalDataIcon from '../../../../../assets/icons/datos_tecnicos.svg'

import Family from './family/Family'
import Group from './group/Group'
import Building from './building/Building'

import useStyles, {
  ExpansionPanel,
  ExpansionPanelSummary,
  StyledExpandMoreIcon,
  ExpansionPanelDetails
} from './TechnicalData.styles'

const TechnicalData = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    provisions,
    state,
    setErrorCheck,
    setIsEmpty,
    setIsLoading,
    setShowDialog,
    setDialogText
  } = props

  const getDossierSubtype = () => {
    if (provisions && provisions.supplyTypes && provisions.supplySubtypes && provisions.selectedSupplySubtype) {
      if (provisions.selectedSupplySubtype === '') {
        return provisions.supplyTypes && provisions.supplyTypes.length > 0 && provisions.supplyTypes.filter(item => item.split('|')[0] === provisions.selectedSupplyType)[0].split('|')[1]
      } else {
        return provisions.supplySubtypes && provisions.supplySubtypes.length > 0 && provisions.supplySubtypes.filter(item => item.split('|')[0] === provisions.selectedSupplySubtype)[0].split('|')[1]
      }
    }
  }

  return (
    <>
      <ExpansionPanel defaultExpanded={state < 2}>

        <ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />}>
          <img className={classes.expansionPanelSummaryIcon} src={TechnicalDataIcon} alt='' />

          <Typography className={classes.expansionPanelSummaryText}>{t('provisions.newProvision.requestData.supplyType.dataType.technicalInstallationData')}</Typography>
        </ExpansionPanelSummary>

        <ExpansionPanelSummary className='colored'>
          <span>{t('provisions.newProvision.requestData.supplyType.useTypeAndSubtype')}</span>
          &nbsp;
          <strong>
            {getDossierSubtype()}
          </strong>
        </ExpansionPanelSummary>


        {provisions.selectedSupplySubtype !== '' && (

          (provisions.selectedSupplySubtype === 'DOSSUB004') ?
            <ExpansionPanelDetails>
              <Family
                state={state}
                setErrorCheck={setErrorCheck}
                setIsEmpty={setIsEmpty}
                setIsLoading={setIsLoading}
                oneSupplie={provisions.selectedSupplySubtype === 'DOSSUB004'}
                setShowDialog={setShowDialog}
                setDialogText={setDialogText}
              />
            </ExpansionPanelDetails>
            //ppm 1007821 - inicio
            : (provisions.selectedSupplySubtype === 'DOSSUB006' || provisions.selectedSupplySubtype === 'DOSSUB005' ||provisions.selectedSupplySubtype === 'DOSSUB031' ||provisions.selectedSupplySubtype === 'DOSSUB001') ?
            //ppm 1007821 - fin
              <div>
                <Building
                  state={state}
                  setErrorCheck={setErrorCheck}
                  setIsEmpty={setIsEmpty}
                  setIsLoading={setIsLoading}
                  setShowDialog={setShowDialog}
                  setDialogText={setDialogText}
                />
              </div>
              :
              <ExpansionPanelDetails>
                <Group
                  state={state}
                  setErrorCheck={setErrorCheck}
                  setIsEmpty={setIsEmpty}
                  setIsLoading={setIsLoading}
                  oneSupplie={provisions.selectedSupplySubtype === 'DOSSUB002'|| provisions.selectedSupplySubtype === 'DOSSUB029' || provisions.selectedSupplySubtype === 'DOSSUB030'}
                  setShowDialog={setShowDialog}
                  setDialogText={setDialogText}
                />
              </ExpansionPanelDetails>

        )
        }
      </ExpansionPanel>
    </>
  )
}

export default TechnicalData
