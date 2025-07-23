import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import SuppliesIcon from '../../../../../assets/icons/nueva_provision_servicio.svg'
import DossiersIcon from '../../../../../assets/icons/modificacion_suministro.svg'
import ClaimIcon from '../../../../../assets/icons/peticiones_reclamaciones.svg'
import IncidenceIcon from '../../../../../assets/icons/peticiones_incidencias_anomalias.svg'
import CutIcon from '../../../../../assets/icons/peticiones_reclamaciones.svg'
import DocumentationIcon from '../../../../../assets/icons/peticiones_documentacion.svg'
import FraudIcon from '../../../../../assets/icons/peticiones_denunciar_fraude.svg'
import OthersIcon from '../../../../../assets/icons/peticiones_otros.svg'
import HomeAppliancesIcon from '../../../../../assets/icons/peticiones_electrodomesticos.svg'
import OtherAssetsIcon from '../../../../../assets/icons/peticiones_otros_bienes.svg'
import PersonalIcon from '../../../../../assets/icons/peticiones_personales.svg'
import WoodlandLoggingIcon from '../../../../../assets/icons/peticiones_tala_arbolado.svg'
import FoodIcon from '../../../../../assets/icons/peticiones_alimentos.svg'
import MoneyIcon from '../../../../../assets/icons/peticiones_dinero.svg'
import PowerOutagesIcon from '../../../../../assets/icons/peticiones_cortes_luz.svg'
import NotificationIcon from '../../../../../assets/icons/nueva_generacion.svg'
import EsquemaIcon from '../../../../../assets/icons/ico_esquema.svg'
import useStyles from './Breadcrumbs.styles'

const Breadcrumbs = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const requests = useSelector((state: any) => state.requests)

  const { currentStep, notificationListSelected } = props

  const [not1, setNot1] = useState(false)
  const [not2, setNot2] = useState(false)
  const [not3, setNot3] = useState(false)
  const [not4, setNot4] = useState(false)

  useEffect(() => {
    if (notificationListSelected && notificationListSelected.length > 0) {
      if (notificationListSelected.includes('NOTIFIOPER01')) {
        setNot1(true)
      }
      if (notificationListSelected.includes('NOTIFIOPER02')) {
        setNot2(true)
      }
      if (notificationListSelected.includes('NOTIFIOPER03')) {
        setNot3(true)
      }
      if (notificationListSelected.includes('NOTIFIOPER04')) {
        setNot4(true)
      }
    }
  }, [notificationListSelected])

  return (
    <Grid container className={classes.container}>
      <Grid item className={classes.item} md='auto' sm={12} xs={12}>
        {
          requests.newRequestSteps.step1 === 'SUPPLY' &&
          <Grid container className={classes.itemContainer}>
            <Grid item className={classes.icon}>
              <img src={SuppliesIcon} alt='' />
            </Grid>

            <Grid item className={classes.label}>
              {t('requests.newRequest.breadcrumbs.step1.supplies')}
            </Grid>
          </Grid>
        }

        {
          requests.newRequestSteps.step1 === 'DOSSIER' && requests.newRequestSteps.step3 !== 'NOTIFICATIONS' &&
          <Grid container className={classes.itemContainer}>
            <Grid item className={classes.icon}>
              <img src={DossiersIcon} alt='' />
            </Grid>

            <Grid item className={classes.label}>
              {t('requests.newRequest.breadcrumbs.step1.dossiers')}
            </Grid>
          </Grid>
        }

        {
          requests.newRequestSteps.step3 === 'NOTIFICATIONS' &&
          <Grid container className={classes.itemContainer}>
            <Grid item className={classes.icon}>
              <img src={NotificationIcon} alt='' />
            </Grid>

            <Grid item className={classes.label}>
              {t('requests.newRequest.breadcrumbs.step3.dossier.notifications')}
            </Grid>
          </Grid>
        }

        {
          requests.newRequestSteps.step1 === 'FRAUD' &&
          <Grid container className={classes.itemContainer}>
            <Grid item className={classes.icon}>
              <img src={FraudIcon} alt='' />
            </Grid>

            <Grid item className={classes.label}>
              {t('requests.newRequest.breadcrumbs.step1.fraud')}
            </Grid>
          </Grid>
        }

        {
          requests.newRequestSteps.step1 === 'INCIDENTS' &&
          <Grid container className={classes.itemContainer}>
            <Grid item className={classes.icon}>
              <img src={IncidenceIcon} alt='' />
            </Grid>

            <Grid item className={classes.label}>
              {t('requests.newRequest.breadcrumbs.step1.incidents')}
            </Grid>
          </Grid>
        }

        {
          requests.newRequestSteps.step1 === 'WORKS' &&
          <Grid container className={classes.itemContainer}>
            <Grid item className={classes.icon}>
              <img src={ClaimIcon} alt='' />
            </Grid>

            <Grid item className={classes.label}>
              {t('requests.newRequest.breadcrumbs.step1.works')}
            </Grid>
          </Grid>
        }

        {
          requests.newRequestSteps.step1 === 'CONSULT' &&

          <Grid container className={classes.itemContainer}>
            <Grid item className={classes.icon}>
              <img src={ClaimIcon} alt='' />
            </Grid>

            <Grid item className={classes.label}>
              {t('requests.newRequest.breadcrumbs.step1.consult')}
            </Grid>
          </Grid>
        }

        {
          requests.newRequestSteps.step1 === 'SELFCONSUMPTION' &&

          <Grid container className={classes.itemContainer}>
            <Grid item className={classes.icon}>
              <img src={ClaimIcon} alt='' />
            </Grid>

            <Grid item className={classes.label}>
              {t('requests.newRequest.breadcrumbs.step1.selfConsumption')}
            </Grid>
          </Grid>
        }

        {/*{
          requests.newRequestSteps.step1 === 'CUT' &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={classes.icon}>
                <img src={CutIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step1.cut')}
              </Grid>
            </Grid>
        }*/}
      </Grid>

      {
        (currentStep > 3 && requests.newRequestSteps.step1 !== 'INCIDENTS' && requests.newRequestSteps.step3 !== 'OTHERS' && requests.newRequestSteps.step4 !== 'INSTANT-MEASUREMENT') &&
        <Grid item className={classes.item} md='auto' sm={12} xs={12}>
          {
            (requests.newRequestSteps.step1 === 'SUPPLY' && requests.newRequestSteps.step3 === 'CLAIM') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={`${classes.icon} claim`}>
                <img src={ClaimIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step3.supply.claim')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'SUPPLY' && requests.newRequestSteps.step3 === 'READING') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={classes.icon}>
                <img src={DocumentationIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step3.supply.reading')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'SUPPLY' && requests.newRequestSteps.step3 === 'REPORT') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={classes.icon}>
                <img src={DocumentationIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step3.supply.report')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'SUPPLY' && requests.newRequestSteps.step3 === 'ACCESS') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={classes.icon}>
                <img src={DocumentationIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step3.supply.access')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'SUPPLY' && requests.newRequestSteps.step3 === 'INCIDENCE') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={classes.icon}>
                <img src={IncidenceIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step3.supply.incidence')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'DOSSIER' && requests.newRequestSteps.step3 === 'CLAIM') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={`${classes.icon} claim`}>
                <img src={ClaimIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step3.dossier.claim')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'DOSSIER' && requests.newRequestSteps.step3 === 'MODIFY') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={`${classes.icon} claim`}>
                <img src={ClaimIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step3.dossier.modify')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'DOSSIER' && requests.newRequestSteps.step3 === 'DOUBTS') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={`${classes.icon} claim`}>
                <img src={ClaimIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step3.dossier.doubts')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'DOSSIER' && requests.newRequestSteps.step3 === 'REACTIVATE') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={`${classes.icon} claim`}>
                <img src={ClaimIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step3.dossier.reactivate')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'DOSSIER' && requests.newRequestSteps.step3 === 'DOCUMENTATION') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={classes.icon}>
                <img src={DocumentationIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step3.dossier.documentation')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'FRAUD' && requests.newRequestSteps.step3 === 'ANONYMOUS') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={classes.icon}>
                <img src={IncidenceIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step3.fraud.anonymous')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'FRAUD' && requests.newRequestSteps.step3 === 'PERSONAL-DATA') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={`${classes.icon} documentation`}>
                <img src={OthersIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step3.fraud.personalData')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'WORKS' && requests.newRequestSteps.step3 === 'CUT') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={classes.icon}>
                <img src={ClaimIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step3.works.cut')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'WORKS' && requests.newRequestSteps.step3 === 'UNMOUNT') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={classes.icon}>
                <img src={ClaimIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step3.works.unmount')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'CONSULT' && requests.newRequestSteps.step3 === 'INFO') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={classes.icon}>
                <img src={ClaimIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step3.consult.info')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'CONSULT' && requests.newRequestSteps.step3 === 'REPORT') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={classes.icon}>
                <img src={ClaimIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step3.consult.report')}
              </Grid>
            </Grid>
          }
        </Grid>
      }

      {
        (currentStep > 4 && requests.newRequestSteps.step1 !== 'FRAUD' && requests.newRequestSteps.step1 !== 'INCIDENTS' && requests.newRequestSteps.step3 !== 'OTHERS') &&
        <Grid item className={classes.item} md='auto' sm={12} xs={12}>
          {
            (requests.newRequestSteps.step1 === 'SUPPLY' && requests.newRequestSteps.step3 === 'CLAIM' && requests.newRequestSteps.step4 === 'APPLIANCE-DAMAGE') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={classes.icon}>
                <img src={HomeAppliancesIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step4.supply.claim.applianceDamage')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'SUPPLY' && requests.newRequestSteps.step3 === 'CLAIM' && requests.newRequestSteps.step4 === 'OTHER-ASSETS-DAMAGE') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={classes.icon}>
                <img src={OtherAssetsIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step4.supply.claim.otherAssetsDamage')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'SUPPLY' && requests.newRequestSteps.step3 === 'CLAIM' && requests.newRequestSteps.step4 === 'PERSONAL-DAMAGE') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={`${classes.icon} documentation`}>
                <img src={PersonalIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step4.supply.claim.personalDamage')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'SUPPLY' && requests.newRequestSteps.step3 === 'CLAIM' && requests.newRequestSteps.step4 === 'WOODLAND-LOGGING-DAMAGE') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={classes.icon}>
                <img src={WoodlandLoggingIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step4.supply.claim.woodlandLoggingDamage')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'SUPPLY' && requests.newRequestSteps.step3 === 'CLAIM' && requests.newRequestSteps.step4 === 'OTHER-DAMAGE') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={classes.icon}>
                <img src={FoodIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step4.supply.claim.otherDamage')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'SUPPLY' && requests.newRequestSteps.step3 === 'CLAIM' && requests.newRequestSteps.step4 === 'PERISHABLE-FOOD-DAMAGE') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={classes.icon}>
                <img src={FoodIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step4.supply.claim.perishableFoodDamage')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'SUPPLY' && requests.newRequestSteps.step3 === 'CLAIM' && requests.newRequestSteps.step4 === 'RECEIVED-COMPENSATION-DISAGREEMENTS') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={classes.icon}>
                <img src={MoneyIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step4.supply.claim.receivedCompensationDisagreements')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'SUPPLY' && requests.newRequestSteps.step4 === 'INSTANT-MEASUREMENT') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={classes.icon}>
                <img src={PowerOutagesIcon} alt='' />
              </Grid>
              {requests.newRequestSteps.step3 === 'LECTURA' ?
                <Grid item className={classes.label}>
                  {t('requests.newRequest.breadcrumbs.step4.supply.claim.instantMeasurement')}
                </Grid>
                :
                <Grid item className={classes.label}>
                  {t('requests.newRequest.breadcrumbs.step4.supply.claim.errorInstantMeasurement')}
                </Grid>
              }
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'SUPPLY' && requests.newRequestSteps.step3 === 'INCIDENCE' && requests.newRequestSteps.step4 === 'PROJECT-DOCUMENTATION') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={classes.icon}>
                <img src={ClaimIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step4.supply.incidence.projectDocumentation')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'SUPPLY' && requests.newRequestSteps.step3 === 'INCIDENCE' && requests.newRequestSteps.step4 === 'LOCATION-MAP') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={classes.icon}>
                <img src={IncidenceIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step4.supply.incidence.locationMap')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'SUPPLY' && requests.newRequestSteps.step3 === 'INCIDENCE' && requests.newRequestSteps.step4 === 'INSTALLATION-COMMUNICATION') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={`${classes.icon} documentation`}>
                <img src={OthersIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step4.supply.incidence.installationCommunication')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'DOSSIER' && requests.newRequestSteps.step3 === 'CLAIM' && requests.newRequestSteps.step4 === 'TECHNICAL-ECONOMIC-DEFINITION') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={`${classes.icon} document`}>
                <img src={DocumentationIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step4.dossier.claim.technicalEconomicDefinition')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'DOSSIER' && requests.newRequestSteps.step3 === 'CLAIM' && requests.newRequestSteps.step4 === 'JOB-EXECUTION') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={`${classes.icon} document`}>
                <img src={IncidenceIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step4.dossier.claim.jobExecution')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'DOSSIER' && requests.newRequestSteps.step3 === 'CLAIM' && requests.newRequestSteps.step4 === 'PAYMENT-RETURN') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={`${classes.icon} document`}>
                <img src={MoneyIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step4.dossier.claim.paymentReturn')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'DOSSIER' && requests.newRequestSteps.step3 === 'CLAIM' && requests.newRequestSteps.step4 === 'OTHERS') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step4.dossier.claim.others')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'DOSSIER' && requests.newRequestSteps.step3 === 'DOCUMENTATION' && requests.newRequestSteps.step4 === 'TECHNICAL-MEMORY') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={`${classes.icon} document`}>
                <img src={OthersIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step4.dossier.documentation.technicalMemory')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'DOSSIER' && requests.newRequestSteps.step3 === 'DOCUMENTATION' && requests.newRequestSteps.step4 === 'CGP-LOCATION-MAP') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={`${classes.icon} document`}>
                <img src={OthersIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step4.dossier.documentation.cgpLocationMap')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'DOSSIER' && requests.newRequestSteps.step3 === 'DOCUMENTATION' && requests.newRequestSteps.step4 === 'CGP-INSTALLATION') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={`${classes.icon} document`}>
                <img src={OthersIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step4.dossier.documentation.cgpInstallation')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'CUT' && requests.newRequestSteps.step3 === 'BTEN') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={`${classes.icon} document`}>
                <img src={OthersIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step4.cut.bten')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'CUT' && requests.newRequestSteps.step3 === 'PRIVATE') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={`${classes.icon} document`}>
                <img src={OthersIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step4.cut.private')}
              </Grid>
            </Grid>
          }

          {
            (requests.newRequestSteps.step1 === 'CUT' && requests.newRequestSteps.step3 === 'PROXIMITY') &&
            <Grid container className={classes.itemContainer}>
              <Grid item className={`${classes.icon} document`}>
                <img src={OthersIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.breadcrumbs.step4.cut.proximity')}
              </Grid>
            </Grid>
          }
        </Grid>
      }

      {
        (requests.newRequestSteps.step1 === 'DOSSIER' && requests.newRequestSteps.step3 === 'NOTIFICATIONS' &&
          currentStep === 7 && not1) &&
        <Grid item className={classes.item} md='auto' sm={12} xs={12}>
          {
            <Grid container className={classes.itemContainer}>
              <Grid item className={classes.icon}>
                <img src={EsquemaIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.notificationlist.notification.notifications.notifioper01.title')}
              </Grid>
            </Grid>
          }
        </Grid>
      }
      {
        (requests.newRequestSteps.step1 === 'DOSSIER' && requests.newRequestSteps.step3 === 'NOTIFICATIONS' &&
          currentStep === 7 && not2) &&
        <Grid item className={classes.item} md='auto' sm={12} xs={12}>
          {
            <Grid container className={classes.itemContainer}>
              <Grid item className={classes.icon}>
                <img src={EsquemaIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.notificationlist.notification.notifications.notifioper02.title')}
              </Grid>
            </Grid>
          }
        </Grid>
      }
      {
        (requests.newRequestSteps.step1 === 'DOSSIER' && requests.newRequestSteps.step3 === 'NOTIFICATIONS' &&
          currentStep === 7 && not3) &&
        <Grid item className={classes.item} md='auto' sm={12} xs={12}>
          {
            <Grid container className={classes.itemContainer}>
              <Grid item className={classes.icon}>
                <img src={EsquemaIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.notificationlist.notification.notifications.notifioper03.title')}
              </Grid>
            </Grid>
          }
        </Grid>
      }
      {
        (requests.newRequestSteps.step1 === 'DOSSIER' && requests.newRequestSteps.step3 === 'NOTIFICATIONS' &&
          currentStep === 7 && not4) &&
        <Grid item className={classes.item} md='auto' sm={12} xs={12}>
          {
            <Grid container className={classes.itemContainer}>
              <Grid item className={classes.icon}>
                <img src={EsquemaIcon} alt='' />
              </Grid>

              <Grid item className={classes.label}>
                {t('requests.newRequest.notificationlist.notification.notifications.notifioper04.title')}
              </Grid>
            </Grid>
          }
        </Grid>
      }
    </Grid>
  )
}

export default Breadcrumbs
