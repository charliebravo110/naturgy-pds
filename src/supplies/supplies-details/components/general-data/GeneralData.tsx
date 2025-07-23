import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import TechnicalDataIcon from '../../../../assets/icons/datos_tecnicos.svg'
import RecognizedRightsIcon from '../../../../assets/icons/mis_documentos.svg'
import HolderDataIcon from '../../../../assets/icons/datos_solicitante.svg'

import useStyles, {
  ExpansionPanel,
  ExpansionPanelSummary,
  StyledExpandMoreIcon,
  ExpansionPanelDetails
} from './GeneralData.styles'

// LCS: Importar las funciones - Wave3
import { sendGAEvent, removeEmails } from '../../../../core/utils/gtm'

const GeneralData = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const {
    supplyData,
    scheme,
    section,
    subSection,
    installationType,
    selfConsumptionType
  } = props

  // LCS: Enviar evento de GdC a GA - Wave 3
  const sendGAEventExpandTechnicalData = ():void => {
    sendGAEvent({
      event: 'browsing',
      section_name: 'mis suministros',
      subsection_name: 'datos generales',
      click_text: 'datos tecnicos del punto de consumo',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      browsing_type: sessionStorage.getItem('browsing_type'),
      cups: supplyData.cups,
      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
    })
  }

  // LCS: Enviar evento de GdC a GA - Wave 3
  const sendGAEventExpandRecognizedRights = ():void => {
    sendGAEvent({
      event: 'browsing',
      section_name: 'mis suministros',
      subsection_name: 'datos generales',
      click_text: 'derechos reconocidos',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      browsing_type: sessionStorage.getItem('browsing_type'),
      cups: supplyData.cups,
      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
    })
  }

  // LCS: Enviar evento de GdC a GA - Wave 3
  const sendGAEventExpandDataHolder = ():void => {
    sendGAEvent({
      event: 'browsing',
      section_name: 'mis suministros',
      subsection_name: 'datos generales',
      click_text: 'datos del titular',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      browsing_type: sessionStorage.getItem('browsing_type'),
      cups: supplyData.cups,
      supply_type: supplyData.isGenerator ? (supplyData.isGenerator === '0' ? 'consumo' : 'generacion') : 'no aplica',
    })
  }

  return (
    <Grid container className={classes.container} justifyContent='center'>
      <Grid item sm={12} md={8} className={classes.maxWidthForBigScreens}>
        {
          (supplyData.isGenerator === '0') &&
          <>
            <ExpansionPanel defaultExpanded onChange={sendGAEventExpandTechnicalData}>
              <ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />}>
                <img className={classes.expansionPanelSummaryIcon} src={TechnicalDataIcon} alt='' />

                <Typography className={classes.expansionPanelSummaryText}>{t('supplies.suppliesDetails.components.generalData.technicalData')}</Typography>
              </ExpansionPanelSummary>

              {/*<ExpansionPanelSummary className='colored'>{t('supplies.suppliesDetails.components.generalData.typeUse')}&nbsp;<strong>{t('supplies.suppliesDetails.components.generalData.familyHome')}</strong></ExpansionPanelSummary>*/}

              <ExpansionPanelDetails>
                <Grid
                  container
                  spacing={4}
                  item
                  md={12}
                  sm={12}
                  xs={12}
                >
                  {/* CUPS */}
                  <Grid
                    item
                    md={6}
                    sm={12}
                    xs={12}
                  >
                    <div className={classes.expansionPanelDetailsTitle}>CUPS</div>

                    <div className={classes.expansionPanelDetailsValue}>{typeof supplyData.cups === 'object' ? '' : supplyData.cups}</div>
                  </Grid>

                  {/* DIRECCION */}
                  <Grid
                    item
                    md={6}
                    sm={12}
                    xs={12}
                  >
                    <div className={classes.expansionPanelDetailsTitle}>{t('supplies.suppliesDetails.components.generalData.supplyAddress')}</div>

                    <div className={classes.expansionPanelDetailsValue}>
                      {
                        supplyData.address &&
                        (supplyData.address.street ? supplyData.address.street : '') + ' ' + (supplyData.address.number ? supplyData.address.number : '') + ', ' + ' ' + (supplyData.address.town ? supplyData.address.town : '') + ', ' + ' ' + (supplyData.address.province ? supplyData.address.province : '') + ' ' + (supplyData.address.zipCode ? supplyData.address.zipCode : '')
                      }
                    </div>
                  </Grid>

                  {/* TARIFA */}
                  <Grid
                    item
                    md={6}
                    sm={12}
                    xs={12}
                  >
                    <div className={classes.expansionPanelDetailsTitle}>{t('supplies.suppliesDetails.components.generalData.consumptionRate')}</div>

                    <div className={classes.expansionPanelDetailsValue}>{typeof supplyData.rate === 'object' ? '' : supplyData.rate}</div>
                  </Grid>

                  {/* DISCRIMINACION HORARIA */}
                  <Grid
                    item
                    md={6}
                    sm={12}
                    xs={12}
                  >
                    <div className={classes.expansionPanelDetailsTitle}>{t('supplies.suppliesDetails.components.generalData.timeDiscrimination')}</div>

                    <div className={classes.expansionPanelDetailsValue}>{typeof supplyData.hasHourlyDiscrimination === 'object' ? '' : supplyData.hasHourlyDiscrimination}</div>
                  </Grid>
                  
                  {/* TIPO DE INSTALAICON */}
                  {
                    supplyData.measurementSystem && supplyData.measurementSystem === 'O' &&
                    <Grid
                      item
                      md={6}
                      sm={12}
                      xs={12}
                    >
                      <div className={classes.expansionPanelDetailsTitle}>{t('supplies.suppliesDetails.components.generalData.installationType')}</div>

                      <div className={classes.expansionPanelDetailsValue}>{typeof supplyData.installationType === 'object' ? '' : supplyData.installationType}</div>
                    </Grid>
                  }

                  {/* TENSION Y SUBTENSION */}
                  <Grid
                    item
                    md={6}
                    sm={12}
                    xs={12}
                  >
                    <div className={classes.expansionPanelDetailsTitle}>{t('supplies.suppliesDetails.components.generalData.voltage')}</div>

                    <div className={classes.expansionPanelDetailsValue}>{typeof supplyData.voltage === 'object' ? '' : supplyData.voltage}</div>
                  </Grid>

                  {/* POTENCIA CONTRATADA */}
                  <Grid
                    item
                    md={6}
                    sm={12}
                    xs={12}
                  >
                    <div className={classes.expansionPanelDetailsTitle}>{t('supplies.suppliesDetails.components.generalData.power')}</div>
                    {supplyData && supplyData.measurementEquipments && supplyData.measurementEquipments.meters[0].isAdapted === 'SI'/* true */ ?

                      //Adaptado y tarifa simple
                      (supplyData.rate.toString().includes('2.') /*'2.0TD PEAJE ATR'*/ ?

                        <Grid container className={classes.expansionPanelDetailsValue} direction='column' justifyContent='space-around'>
                          <Grid item className={classes.powerValuesSpacing}>
                            <Grid item><strong>{t('supplies.suppliesDetails.components.generalData.contractedPower1')}</strong></Grid>
                            <Grid item>{Number(supplyData.power1).toFixed(2).replace('.', ',')}</Grid>
                          </Grid>

                          <Grid item direction='row'>
                            <Grid item><strong>{t('supplies.suppliesDetails.components.generalData.contractedPower2')}</strong></Grid>
                            <Grid item>{Number(supplyData.power2).toFixed(2).replace('.', ',')}</Grid>
                          </Grid>
                        </Grid>

                        :

                        //Adaptado y tarifa compleja
                        <Grid container>
                          <Grid container md={8} className={classes.expansionPanelDetailsValue} direction='column'>
                            <Grid item className={classes.powerValuesSpacing}>
                              <Grid item><strong>{t('supplies.suppliesDetails.components.generalData.contractedPower01')}</strong></Grid>
                              <Grid item>{Number(supplyData.power1).toFixed(2).replace('.', ',')}</Grid>
                            </Grid>

                            <Grid item className={classes.powerValuesSpacing}>
                              <Grid item><strong>{t('supplies.suppliesDetails.components.generalData.contractedPower02')}</strong></Grid>
                              <Grid item>{Number(supplyData.power2).toFixed(2).replace('.', ',')}</Grid>
                            </Grid>

                            <Grid item >
                              <Grid item><strong>{t('supplies.suppliesDetails.components.generalData.contractedPower03')}</strong></Grid>
                              <Grid item>{Number(supplyData.power3).toFixed(2).replace('.', ',')}</Grid>
                            </Grid>
                          </Grid>
                          <Grid container md={4} className={classes.expansionPanelDetailsValue} direction='column'>
                            <Grid item className={classes.powerValuesSpacing}>
                              <Grid item><strong>{t('supplies.suppliesDetails.components.generalData.contractedPower04')}</strong></Grid>
                              <Grid item>{Number(supplyData.power4).toFixed(2).replace('.', ',')}</Grid>
                            </Grid>

                            <Grid item className={classes.powerValuesSpacing}>
                              <Grid item><strong>{t('supplies.suppliesDetails.components.generalData.contractedPower05')}</strong></Grid>
                              <Grid item>{Number(supplyData.power5).toFixed(2).replace('.', ',')}</Grid>
                            </Grid>

                            <Grid item>
                              <Grid item><strong>{t('supplies.suppliesDetails.components.generalData.contractedPower06')}</strong></Grid>
                              <Grid item>{Number(supplyData.power6).toFixed(2).replace('.', ',')}</Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      )

                      :

                      <Grid container className={classes.expansionPanelDetailsValue} direction='column' justifyContent='space-around'>
                        <Grid item className={classes.powerValuesSpacing}>
                          <Grid item>{Number(supplyData.power1).toFixed(2).replace('.', ',')}</Grid>
                        </Grid>
                      </Grid>

                    }
                    {/* {t('supplies.suppliesDetails.components.generalData.powerPeajes')} */}
                  </Grid>

                  {/* POTENCIA MAXIMA */}
                  <Grid
                    item
                    md={6}
                    sm={12}
                    xs={12}
                  >
                    <div className={classes.expansionPanelDetailsTitle}>{t('supplies.suppliesDetails.components.generalData.maximumAuthorizedPowerCIE')}</div>

                    <div className={classes.expansionPanelDetailsValue}>{typeof supplyData.maxAuthorizedVoltage === 'object' ? '' : Number(supplyData.maxAuthorizedVoltage).toFixed(2).replace('.', ',')}</div>
                  </Grid>

                  {/* FECHA DE APROVACION */}
                  {
                    supplyData.measurementSystem && supplyData.measurementSystem === 'O' &&
                    <Grid
                      item
                      md={6}
                      sm={12}
                      xs={12}
                    >
                      <div className={classes.expansionPanelDetailsTitle}>{t('supplies.suppliesDetails.components.generalData.approvalDateCIE')}</div>

                      <div className={classes.expansionPanelDetailsValue}>{typeof supplyData.CIEApprovalDate === 'object' ? '' : supplyData.CIEApprovalDate}</div>
                    </Grid>
                  }

                  {/* COMERCIALIZADORA */}
                  <Grid
                    item
                    md={6}
                    sm={12}
                    xs={12}
                  >
                    <div className={classes.expansionPanelDetailsTitle}>{t('supplies.suppliesDetails.components.generalData.company')}</div>

                    <div className={classes.expansionPanelDetailsValue}>{typeof supplyData.marketer === 'object' ? '' : supplyData.marketer}</div>
                  </Grid>

                  {/* EQUIPO DE MEDIDA INSTALADO */}
                  <Grid
                    item
                    md={6}
                    sm={12}
                    xs={12}
                  >
                    <div className={classes.expansionPanelDetailsTitle}>{t('supplies.suppliesDetails.components.generalData.device')}</div>

                    <div className={classes.expansionPanelDetailsValue}>
                      {
                        supplyData.measurementEquipments &&
                        supplyData.measurementEquipments.meters[0] &&
                        (typeof supplyData.measurementEquipments.meters[0].serialNumber === 'object' ? '' : supplyData.measurementEquipments.meters[0].serialNumber) + ' - ' + (typeof supplyData.measurementEquipments.meters[0].brand === 'object' ? '' : supplyData.measurementEquipments.meters[0].brand)
                      }
                    </div>
                  </Grid>

                  {/*{
                    supplyData.measurementSystem && supplyData.measurementSystem === 'O' &&
                    <Grid
                      item
                      md={6}
                      sm={12}
                      xs={12}
                    >
                      <div className={classes.expansionPanelDetailsTitle}>{t('supplies.suppliesDetails.components.generalData.meterId')}</div>

                      <div className={classes.expansionPanelDetailsValue}>{supplyData.measurementEquipments && supplyData.measurementEquipments.meters && supplyData.measurementEquipments.meters.item && typeof (supplyData.measurementEquipments.meters.item.meter) === 'object' ? '' : supplyData.measurementEquipments && supplyData.measurementEquipments.meters && supplyData.measurementEquipments.meters.item && supplyData.measurementEquipments.meters.item.meter}</div>
                    </Grid>
                  }*/}

                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </>
        }

        {supplyData.isSelfConsumption && supplyData.isSelfConsumption.cau && supplyData.isSelfConsumption.cau != '' &&
          <>
            <ExpansionPanel defaultExpanded>
              <ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />}>
                <img className={classes.expansionPanelSummaryIcon} src={RecognizedRightsIcon} alt='' />

                <Typography className={classes.expansionPanelSummaryText}>{t('supplies.suppliesDetails.components.generalData.selfConsumptionLabel')}</Typography>
              </ExpansionPanelSummary>


              <ExpansionPanelDetails>
                <Grid container spacing={4} item md={12} sm={12} xs={12} >
                  <Grid item md={6} sm={12} xs={12}>

                    <div className={classes.expansionPanelDetailsTitle}>{t('supplies.suppliesDetails.components.generalData.cau')}</div>

                    <div className={classes.expansionPanelDetailsValue}>{supplyData.isSelfConsumption.cau ? supplyData.isSelfConsumption.cau : ''}</div>

                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>

                    <div className={classes.expansionPanelDetailsTitle}>{t('supplies.suppliesDetails.components.generalData.selfConsumptionState')}</div>

                    <div className={classes.expansionPanelDetailsValue}>{supplyData.isSelfConsumption.state ? supplyData.isSelfConsumption.state : ''}</div>

                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>

                    <div className={classes.expansionPanelDetailsTitle}>{t('supplies.suppliesDetails.components.generalData.selfConsumptionStartDate')}</div>

                    <div className={classes.expansionPanelDetailsValue}>{supplyData.isSelfConsumption.startDate ? supplyData.isSelfConsumption.startDate : ''}</div>

                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>

                    <div className={classes.expansionPanelDetailsTitle}>{t('supplies.suppliesDetails.components.generalData.betaCoefficient')}</div>

                    <div className={classes.expansionPanelDetailsValue}>{supplyData.isSelfConsumption.betaCoefficient ? supplyData.isSelfConsumption.betaCoefficient : ''}</div>

                  </Grid>
                  <Grid item md={12} sm={12} xs={12}>

                    <div className={classes.expansionPanelDetailsTitle}>{t('supplies.suppliesDetails.components.generalData.scheme')}</div>

                    <div className={classes.expansionPanelDetailsValue}>{scheme ? scheme : ''}</div>

                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>

                    <div className={classes.expansionPanelDetailsTitle}>{t('supplies.suppliesDetails.components.generalData.totalGenerationIsntPower')}</div>

                    <div className={classes.expansionPanelDetailsValue}>{supplyData.isSelfConsumption.totalGenerationIsntPower ? supplyData.isSelfConsumption.totalGenerationIsntPower + ' kW' : ''}</div>

                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>
                    <div className={classes.expansionPanelDetailsTitle}>
                      {t('supplies.suppliesDetails.components.generalData.cil')}
                    </div>

                    <div className={classes.expansionPanelDetailsValue}>
                      {supplyData.isSelfConsumption.cil
                        ? supplyData.isSelfConsumption.cil.split(';').map((item, index) => (
                            <div key={index}>{item}</div>
                          ))
                        : ''}
                    </div>
                  </Grid>
                  <Grid md={12} sm={12} xs={12}>

                    <div className={classes.titleSelfConsumption}>{t('supplies.suppliesDetails.components.generalData.selfConsumptionType')}</div>
                    
                    <div className={classes.expansionPanelDetailsValueSelfConsumption}>{selfConsumptionType ? selfConsumptionType : ''}</div>
                    
                  </Grid>
                  {/*
                  <Grid item md={6} sm={12} xs={12}>

                    <div className={classes.expansionPanelDetailsTitle}>{t('supplies.suppliesDetails.components.generalData.section')}</div>

                    <div className={classes.expansionPanelDetailsValue}>{section ? section : ''}</div>

                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>

                    <div className={classes.expansionPanelDetailsTitle}>{t('supplies.suppliesDetails.components.generalData.subSection')}</div>

                    <div className={classes.expansionPanelDetailsValue}>{supplyData.isSelfConsumption.subSection !== '' ? subSection : 'N/A'}</div>

                  </Grid>
                  <Grid item md={6} sm={12} xs={12}>

                    <div className={classes.expansionPanelDetailsTitle}>{t('supplies.suppliesDetails.components.generalData.collective')}</div>

                    <div className={classes.expansionPanelDetailsValue}>{supplyData.isSelfConsumption.collective ? supplyData.isSelfConsumption.collective : ''}</div>

                  </Grid>
                  */}
                  <Grid item md={12} sm={12} xs={12}>

                    <div className={classes.expansionPanelDetailsTitle}>{t('supplies.suppliesDetails.components.generalData.selfConsumptionInstallationType')}</div>

                    <div className={classes.expansionPanelDetailsValue}>{installationType ? installationType : ''}</div>

                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </>

        }

        {
          (supplyData.isGenerator === '1' && (supplyData.measurementSystem === 'O' || supplyData.measurementSystem === 'G')) &&
          <ExpansionPanel defaultExpanded>
            <ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />}>
              <img className={classes.expansionPanelSummaryIcon} src={TechnicalDataIcon} alt='' />

              <Typography className={classes.expansionPanelSummaryText}>{t('supplies.suppliesDetails.components.generalData.technicalDataGeneration')}</Typography>
            </ExpansionPanelSummary>

            <ExpansionPanelDetails>
              <Typography>
                {t('supplies.suppliesDetails.components.generalData.moreInformation')}
              </Typography>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        }

        {
          (supplyData.isGenerator === '0') &&
          <>
            {
              supplyData.measurementSystem && supplyData.measurementSystem === 'O' &&
              <ExpansionPanel defaultExpanded onChange={sendGAEventExpandRecognizedRights}>
                <ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />}>
                  <img className={classes.expansionPanelSummaryIcon} src={RecognizedRightsIcon} alt='' />

                  <Typography className={classes.expansionPanelSummaryText}>{t('supplies.suppliesDetails.components.generalData.recognizedRights')}</Typography>
                </ExpansionPanelSummary>

                <ExpansionPanelDetails>
                  <Grid
                    container
                    spacing={4}
                    item
                    md={12}
                    sm={12}
                    xs={12}
                  >
                    <Grid
                      item
                      md={6}
                      sm={12}
                      xs={12}
                    >
                      <div className={classes.expansionPanelDetailsTitle}>{t('supplies.suppliesDetails.components.generalData.extensionRights')}</div>

                      <div className={classes.expansionPanelDetailsValue}>{typeof supplyData.validExtentRights === 'object' ? '' : Number(supplyData.validExtentRights).toFixed(2).replace('.', ',')}</div>
                    </Grid>

                    <Grid
                      item
                      md={6}
                      sm={12}
                      xs={12}
                    >
                      <div className={classes.expansionPanelDetailsTitle}>{t('supplies.suppliesDetails.components.generalData.accessRights')}</div>

                      <div className={classes.expansionPanelDetailsValue}>{typeof supplyData.validAccessRights === 'object' ? '' : Number(supplyData.validAccessRights).toFixed(2).replace('.', ',')}</div>
                    </Grid>

                    <Grid
                      item
                      md={6}
                      sm={12}
                      xs={12}
                    >
                      <div className={classes.expansionPanelDetailsTitle}>{t('supplies.suppliesDetails.components.generalData.endDateExtensionRights')}</div>

                      <div className={classes.expansionPanelDetailsValue}>{typeof supplyData.expirationDate === 'object' ? '' : supplyData.expirationDate}</div>
                    </Grid>

                    <Grid
                      item
                      md={6}
                      sm={12}
                      xs={12}
                    >
                      <div className={classes.expansionPanelDetailsTitle}>{t('supplies.suppliesDetails.components.generalData.acometidaMaxPower')}</div>

                      <div className={classes.expansionPanelDetailsValue}>{typeof supplyData.maxAvalaibleVoltage === 'object' ? '' : Number(supplyData.maxAvalaibleVoltage).toFixed(2).replace('.', ',')}</div>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            }

            <ExpansionPanel defaultExpanded onChange={sendGAEventExpandDataHolder}>
              <ExpansionPanelSummary expandIcon={<StyledExpandMoreIcon />}>
                <img className={classes.expansionPanelSummaryIcon} src={HolderDataIcon} alt='' />

                <Typography className={classes.expansionPanelSummaryText}>{t('supplies.suppliesDetails.components.generalData.dataHolder')}</Typography>
              </ExpansionPanelSummary>

              <ExpansionPanelDetails>
                <Grid
                  container
                  spacing={4}
                  item
                  md={12}
                  sm={12}
                  xs={12}
                >
                  <Grid
                    item
                    md={6}
                    sm={12}
                    xs={12}
                  >
                    <div className={classes.expansionPanelDetailsTitle}>{t('supplies.suppliesDetails.components.generalData.contractHolder')}</div>

                    <div className={classes.expansionPanelDetailsValue}>{typeof supplyData.holderName === 'object' ? '' : supplyData.holderName}</div>
                  </Grid>
                  {/*
                    {
                      supplyData.measurementSystem && supplyData.measurementSystem === 'O' &&
                        <Grid
                          item
                          md={6}
                          sm={12}
                          xs={12}
                        >
                          <div className={classes.expansionPanelDetailsTitle}>Email</div>

                          <div className={classes.expansionPanelDetailsValue}>{typeof supplyData.holderContactEmail === 'object' ? '' : supplyData.holderContactEmail}</div>
                        </Grid>
                    }
                    */}
                  <Grid
                    item
                    md={6}
                    sm={12}
                    xs={12}
                  >
                    <div className={classes.expansionPanelDetailsTitle}>{t('supplies.suppliesDetails.components.generalData.identificationDocument')}</div>

                    <div className={classes.expansionPanelDetailsValue}>{typeof supplyData.holderDocumentNumber === 'object' ? '' : supplyData.holderDocumentNumber}</div>
                  </Grid>
                  {/*
                    <Grid
                      item
                      md={6}
                      sm={12}
                      xs={12}
                    >
                      <div className={classes.expansionPanelDetailsTitle}>{t('supplies.suppliesDetails.components.generalData.contactPhone')}</div>

                      <div className={classes.expansionPanelDetailsValue}>{typeof supplyData.holderContactPhone === 'object' ? '' : supplyData.holderContactPhone}</div>
                    </Grid>*/}
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </>
        }
      </Grid>
    </Grid>
  )
}

export default GeneralData
