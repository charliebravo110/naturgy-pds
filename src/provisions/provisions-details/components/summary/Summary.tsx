import React, { Fragment, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Input from '@material-ui/core/Input'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import LightTooltip from '../../../../common/components/tooltip/light/LightTooltip'
import Spinner from      '../../../../common/components/spinner/Spinner'
import CancelDossierDialog from '../cancel-dossier-dialog/CancelDossierDialog'
import EditIcon from '../../../../assets/icons/editar_blanco.svg'
import SaveIcon from '../../../../assets/icons/guardar_blanco.svg'
import CloseIcon from '../../../../assets/icons/cerrar_blanco.svg'
import HomeIcon from '../../../../assets/icons/ico_casa_playa_blanco.svg'
import InfoIcon from '../../../../assets/icons/info_blanco.svg'
import OpenPadlockIcon from '../../../../assets/icons/icoMarcaFehaciencia.svg'

import { setCurrentProvisionName, setProvisionData } from '../../../store/actions/ProvisionsActions'
import { thunkUpdateDossierData } from '../../../store/actions/ProvisionsThunkActions'

import useStyles from './Summary.styles'
import ArrowTooltip from '../../../../common/components/tooltip/arrow/ArrowTooltip'

// LCS: Importa la función - Wave 3
import { sendGAEvent, removeAccents, removeEmails }  from '../../../../core/utils/gtm'

const Header = (props: any) => {
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.only('xs'))
  const classes = useStyles({})
  const dispatch = useDispatch()
  const userToken = useSelector((state: any) => state.user.token)
  const user = useSelector((state: any) => state.user.profile)
  const { t } = useTranslation()

  const provisions = useSelector((state: any) => state.provisions)
  const provisionsList = useSelector((state: any) => state.provisions.provisionsList)
  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)
  const currentProvisionSubtype = useSelector((state: any) => state.provisions.supplySubtypes)

  let supplantedUser = sessionStorage.getItem('supplantedUser')

  const [ name, setName ] = useState(currentProvision.name)
  const [ isEditingName, setIsEditingName ] = useState(false)

  const [ isLoading, setIsLoading ] = useState(false)

  const [ showingCancelDossierDialog, setShowingCancelDossierDialog ] = useState(false)
  const statusInadmitido    = 'STATUS0102' 

  const getTypologyValue = () => {
    const item = provisions.newGeneration.typologies.find(item => item.split('|')[0] === provisions.dossierSubtype)

    return item && item.split('|')[1] &&  item.split('|')[1].toLowerCase()
  }

  const getDossierSubtype = () => {
    const dossierSubtype = currentProvisionSubtype.length > 0 && currentProvisionSubtype.filter(item => item.split('|')[0] === provisions.dossierSubtype)[0]

    return dossierSubtype && dossierSubtype.split('|')[1]
  }

  const formatDate = (e) => {
    return  e.substr(6,2) + '/' + e.substr(4,2) + '/' + e.substr(0,4) + ' ' +  e.substr(8,2) + ':' + e.substr(10,2) + ':'  + e.substr(12,4) 
  }

  const handleChangeSupplyName = (e) => {
    const value = e.target.value

    setName(value)
  }

  const handleFocusSupplyName = (e) => {
    if (name === currentProvision.name) {
      setName('')
    }
  }

  const handleClickEditingName = () => {
    if (!supplantedUser) {
      if (isEditingName) {
        if (name !== '' && name !== currentProvision.name) {
          setIsLoading(true)

          dispatch(thunkUpdateDossierData(currentProvision.dossierCod, user.documentNumber, name, '', userToken, () => {
            let provision = provisionsList.find(i => i.dossierCod === currentProvision.dossierCod)

            dispatch(setCurrentProvisionName(name))

            if (provision) {
              // actualizar provision en la lista

              let index = provisionsList.indexOf(provision)

              dispatch(setProvisionData({name}, index))
            }

            setIsLoading(false)

            setIsEditingName(!isEditingName)
          }))
        } else {
          setName(currentProvision.name)

          setIsEditingName(!isEditingName)
        }
      } else {
        setIsEditingName(true)
      }
    }
  }

  const handleClickCancelDossier = () => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    let request_type = provisions.dossierType === 'DOSTYP002' ? 
      (t('provisions.newGeneration.requestData.technicalData.generation') + getTypologyValue()).toLowerCase()
      : getDossierSubtype().toLowerCase()
    sendGAEvent({
      event: 'browsing',
      section_name: 'mi conexion a la red',
      subsection_name: 'detalle de solicitud',
      click_text: 'cancelar expediente',
      element_type: 'consulta de informacion',
      page_url: removeEmails(window.location.href),
      request_number: currentProvision.dossierCod,
      request_status: sessionStorage.getItem('provisionDossierStatus'),
      request_type: removeAccents(request_type),
      browsing_type: sessionStorage.getItem('browsing_type')
    });
    setShowingCancelDossierDialog(true)
  }

  return (
    <>
    	<CancelDossierDialog showing={showingCancelDossierDialog} setShowing={setShowingCancelDossierDialog} currentProvision={currentProvision} />

      <Grid
        container
        item
        xs={11}
        md={10}
        className={`${classes.container} ${(currentProvision.dossierStatusId === 'STATUS0094' || currentProvision.dossierStatusId === 'STATUS0098' || currentProvision.dossierStatusId === statusInadmitido ) && 'canceled'}`}
      >
        {
          isLoading &&
            <Spinner fixed={true} />
        }

        {
          (currentProvision.dossierStatusId === 'STATUS0094' || currentProvision.dossierStatusId === 'STATUS0098'|| currentProvision.dossierStatusId === statusInadmitido) &&
            <div className={classes.canceledDossier}>

              {currentProvision.dossierStatusId === 'STATUS0094'  && 
                  t('provisions.provisionsDetails.summary.deniedDossier')
              }

              {currentProvision.dossierStatusId === 'STATUS0098' && 
                  t('provisions.provisionsDetails.summary.canceledDossier')
              }

              {currentProvision.dossierStatusId === statusInadmitido  &&  
                  t('provisions.provisionsDetails.summary.notAdmittedDossier')
              }
            </div>
        }

        <Grid
          container
          className={classes.leftColumn}
          item
          xs={12}
          sm={12}
          md={3}
        >
          <Grid item xs={12} sm={12}>
            <span className={classes.title} />
          </Grid>

          <Grid item xs={12} sm={12}>
            <div>{t('provisions.provisionsDetails.summary.requestNumber')}</div>

            <div className={classes.cups}>
              {currentProvision.dossierCod}
            </div>
 
            {(currentProvision && currentProvision.priorityDate && currentProvision.priorityDate !=='') &&
              <>
                <div className={classes.sectionTitle2}>
                    {t('supplies.suppliesDetails.components.summary.priorityDate')}
                    <LightTooltip
                      title={t('supplies.suppliesDetails.components.summary.priorityInfo')}
                      placement='right'
                    >
                      <img className={classes.infoIcon} src={InfoIcon} alt='' />
                    </LightTooltip>                  
                </div>
                <div>
                  {formatDate(currentProvision.priorityDate)}              
                </div> 
              </>
            } 
              
          </Grid>
        </Grid>

        <Grid
          container
          className={classes.centerColumn}
          item
          xs={12}
          sm={12}
          md={7}
        >
          <Grid item className={classes.name} xs={12} sm={12}>
            <Grid container className={classes.nameContainer}>
              <Grid item>
                <img src={HomeIcon} className={classes.nameIcon} alt='' />
              </Grid>

              <Grid item>
                {
                  isEditingName ?
                    <Input
                      className={`${classes.nameLabel} textField`}
                      value={name}
                      onChange={handleChangeSupplyName}
                      onFocus={handleFocusSupplyName}
                      inputProps={{
                        style: {
                          letterSpacing: '0.00938em',
                          borderColor: '#FFF'
                        },
                        maxLength: '25'
                      }}
                    />
                  :
                    <Typography className={classes.nameLabel}>{name}</Typography>
                }
              </Grid>
            </Grid>
          </Grid>

          {
            mobile &&
              <Grid container item xs={12} className={classes.divider} />
          }

          <Grid item className={classes.addressContainer} xs={12} sm={12}>
            <div className={classes.sectionTitle}>{t('supplies.suppliesDetails.components.summary.address')}</div>

            <div className={classes.boldText}>
              {currentProvision.streetType+' '+currentProvision.streetName+' '+currentProvision.num+' '+currentProvision.stair+' '+currentProvision.floor+' '+currentProvision.door+' '+currentProvision.addressDescription}
            </div>
          </Grid>

          <Grid item className={classes.typeContainer} xs={12} sm={12}>
            <div className={classes.sectionTitle}>{t('supplies.suppliesDetails.components.summary.typeSupplyPoint')}</div>

            <div className={classes.boldText}>
              {
                provisions.dossierType === 'DOSTYP002' ?
                  <span><strong>{t('provisions.newGeneration.requestData.technicalData.generation')} {getTypologyValue()}</strong></span>
                :
                  getDossierSubtype()
              }
            </div>
          </Grid>
        </Grid>

        <Grid item md={2}>
          {
            (currentProvision.dossierStatusId !== 'STATUS0094' && currentProvision.dossierStatusId !== 'STATUS0098') &&
              <Grid container className={classes.rightColumn} direction='column'>
                <Grid item className={classes.button} onClick={handleClickEditingName} xs={12} sm={12}>
                  {
                    isEditingName ?
                      <Fragment>
                        <img className={classes.buttonIcon} src={SaveIcon} alt='' />

                        <Typography className={classes.buttonLabel}>{t('supplies.suppliesDetails.components.summary.saveChanges')}</Typography>
                      </Fragment>
                    :
                      <Fragment>
                        <img className={classes.buttonIcon} src={EditIcon} alt='' />

                        <Typography className={classes.buttonLabel}>{t('supplies.suppliesDetails.components.summary.editName')}</Typography>
                      </Fragment>
                  }
                </Grid>

                <Grid item className={classes.button} xs={12} sm={12}>
                  <img className={classes.buttonIcon} src={CloseIcon} alt='' />

                  <span
                    className={classes.buttonLabel}
                    onClick={() => {handleClickCancelDossier()}}
                  >
                    {t('provisions.provisionsDetails.summary.cancelDossier')}
                  </span>
                </Grid>
              </Grid>
          }
        </Grid>
        { currentProvision.esFehaciente === '1' &&
          <Grid item className={classes.button} xs={12} sm={12}>
            <ArrowTooltip title={t('provisions.provisionsDetails.summary.tooltypefehaciente')} placement='right' >
              <img className={classes.buttonpadlockIcon} src={OpenPadlockIcon} alt='' />
            </ArrowTooltip>
          </Grid>
        }
      </Grid>
    </>
  )
}

export default Header
