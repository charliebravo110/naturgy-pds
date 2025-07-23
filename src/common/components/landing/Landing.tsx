import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'

import useStyles from './Landing.styles'
import { Grid } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'

import mas from '../../../assets/icons/mas.svg'
import NewServiceProvisionIcon from '../../../assets/icons/ico_casa.svg'
import SupplyModificationIcon from '../../../assets/icons/ico_enchufe.svg'
import InstallationsModificationIcon from '../../../assets/icons/ico_torre_electrica.svg'
import GenerationIcon from '../../../assets/icons/ico_solar.svg'
import Input from '../input/Input'
import Button from '../button/Button'
import { thunkPutSupply } from '../../../supplies/supplies-vinculation/store/actions/SuppliesVinculationThunkActions'
import { setUserRole } from '../../store/actions/UserActions'
import { validateCupsNumber } from '../../lib/ValidationLib'
import Dialog from '../../../supplies/supplies-vinculation/components/dialog/Dialog'
import { SecurityHOC } from '../../HOC/SecurityHOC'

// LCS: Importa la función - Wave 3
import { removeEmails, sendGAEvent } from '../../../core/utils/gtm';

const Landing = (props: any) => {
  const suppliesCount = useSelector((state: any) => state.supplies.list.length)
  const classes = useStyles({})
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const user = useSelector((state: any) => state.user.profile)

  const [dossierCod, setDossierCod] = useState('')
  const [dossierCodValidity, setDossierCodValidity] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [cupsValue, setCupsValue] = useState('')
  const [cupsValidity, setCupsValidity] = useState(false)
  const [bindingSupply, setBindingSupply] = useState(false)
  const [showingDialog, setShowingDialog] = useState(false)

  useEffect(() => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'view',
      content_group: 'landing',
      page_url: removeEmails(window.location.href),
      user_id: sessionStorage.getItem('id'),
      previous_path: removeEmails(sessionStorage.getItem("previousPage")),
      user_type: sessionStorage.getItem('user_type'),
      browsing_type: sessionStorage.getItem('browsing_type'),
      element_type: 'medicion de pagina',
      ga_client_id: sessionStorage.getItem('ga_client_id'),
      cups: 'no aplica',
      supply_type: 'no aplica'
    });
    sessionStorage.setItem("previousPage", window.location.href);
  },[])

  const handleKeyDown = (e) => {
    if (dossierCodValidity && (e.key === 'Enter')) {
      handleBindSupply()
    }
  }

  const handleClickButton = () => {
    if (dossierCod !== '' && dossierCodValidity) {
      handleBindSupply()
    }
  }

  const handleOpenDialog = () => {
    setShowingDialog(true)
  }

  const handleCloseDialog = () => {
    setShowingDialog(false)
  }

  //Esta funcion es la encargada de vincular nuestro PS con un numero de solicitud X
  const handleBindSupply = () => {
    setIsLoading(true)
 
    dispatch(thunkPutSupply(user.documentNumber, '', dossierCod, setIsLoading, (response) => {
      if (response && response.result.codResult === '0000') {
        sessionStorage.setItem('userRoles', sessionStorage.getItem('userRoles') + ',US_DOSSIER_CLIENT,US_SUPPLYPOINT_CLIENT')

        dispatch(setUserRole(user.roles + ',US_DOSSIER_CLIENT,US_SUPPLYPOINT_CLIENT'))

        props.history.push('/provisions')
      }
    }))
  }

  const handleKeyDownCups = (e) => {
    if (cupsValidity && (e.key === 'Enter')) {
      handleBindSupplyCups()
    }
  }

  const handleClickButtonCups = () => {
    if (cupsValue !== '' && cupsValidity) {
      handleBindSupplyCups()
    }
  }

  const handleBindSupplyCups = () => {

    let valorcups = cupsValue.substring(0,20)+ '1P'
    setCupsValue(valorcups)

    dispatch(thunkPutSupply(user.documentNumber, valorcups, '', setBindingSupply, (response) => {
      if (response && response.result.codResult === '0000') {
        sessionStorage.setItem('userRoles', sessionStorage.getItem('userRoles') + ',US_SUPPLYPOINT_CLIENT,US_DOSSIER_CLIENT')

        dispatch(setUserRole(user.roles + ',US_SUPPLYPOINT_CLIENT,US_DOSSIER_CLIENT'))

        props.history.push('/supplies')
      }
    }))
  }

  if (suppliesCount > 0) {
    return <Redirect push to='/supplies' />
  }

  return (
    <>
      <Dialog
        showingDialog={showingDialog}
        closeDialog={handleCloseDialog}
      />
      <Grid container className={classes.container}>
        <div className={classes.titleCont}>
          <h1 className={classes.titleWelcome}>{t('landing.titleWelcome')}</h1>
          <h2 className={classes.titleOpt}>{t('landing.titleOpt')}</h2>
        </div>
        <Grid container className={classes.options}>
          <Grid item md={2} sm={6} xs={12} className={classes.optionsCont}>
            <div>
              <div className={classes.descriptions}>
                <img src={NewServiceProvisionIcon} alt='' className={classes.image} />
                <p className={classes.p} style={{ marginLeft: 14, marginTop: 40 }}>{t('landing.textCasa')}</p>
              </div>
              <div className={classes.descriptions}>
                <img src={SupplyModificationIcon} alt='' className={classes.image} />
                <p className={classes.p} style={{ marginLeft: 31, marginTop: 40 }}>{t('landing.textEnchufe')}</p>
              </div>
              <div className={classes.descriptions}>
                <img src={InstallationsModificationIcon} alt='' className={classes.image} />
                <p className={classes.p} style={{ marginLeft: 22, marginTop: 40 }}>{t('landing.textTorre')}</p>
              </div>
              <div className={classes.descriptions}>
                <img src={GenerationIcon} alt='' className={classes.image} />
                <p className={classes.p} style={{ marginTop: 40 }}>{t('landing.textPlaca')}</p>
              </div>
            </div>
          </Grid>
          <Grid item md={3} sm={6} xs={12}>
            <div className={classes.box}>
              <Grid item className={classes.boxtitle} >
                <h1 className={classes.titleSub}>{t('landing.titleSub1')}</h1>
                <p className={classes.text}>{t('landing.textSub1')}</p>
                <p className={classes.text}>{t('landing.textinfocups')}</p>
              </Grid>
              <Grid item className={classes.boxtitle}>
                <div className={classes.bottomLine} />
                <Grid container justifyContent='center' alignItems='center'>
                  <Grid container xs={12} sm={12} md={12} justifyContent='center'>
                    <Grid item direction='column'>
                      <Grid item>
                        <Typography className={classes.titleSubSub}>{t('landing.titleSubSub1')}<span className={classes.Linkcups} onClick={handleOpenDialog}>{t('supplies.suppliesVinculation.components.suppliesVinculation.where')}</span></Typography>
                      </Grid>
                      <Grid item>
                        <Input
                          style={{ width: 270 }}
                          placeholder='ES0000000000000000AA'
                          label=''
                          width='100'
                          error={cupsValue !== '' && !cupsValidity}
                          showValidationIcon
                          onChange={({ target }) => {
                            const value = target.value

                            setCupsValidity(validateCupsNumber(value))

                            setCupsValue(value)
                          }}
                          onKeyDown={handleKeyDownCups}
                          value={cupsValue}
                        />
                      </Grid>
                    </Grid>
                    <Grid item className={classes.descriptions}>
                      <Button
                        text={t('common.buttons.accept')}
                        color='primary'
                        size='large'
                        variant='contained'
                        className={classes.button}
                        onClick={handleClickButtonCups}
                        disabled={!cupsValidity}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item className={classes.boxtitle}>
                <div className={classes.bottomLine} />
                <Grid container justifyContent='center' alignItems='center'>
                  <Grid container xs={12} sm={12} md={12} justifyContent='center'>
                    <Grid item direction='column'>
                      <Grid item>
                        <Typography className={classes.titleSubSub}>{t('landing.titleSubSub1_2')}</Typography>
                      </Grid>
                      <Grid item>
                        <Input
                          style={{ width: 270 }}
                          label=''
                          placeholder='EXP000000000000'
                          width='100'
                          error={dossierCod !== '' && !dossierCodValidity}
                          showValidationIcon
                          onChange={({ target }) => {
                          const validation = (target.value.length === 15 && target.value.substring(0, 3).toUpperCase() === 'EXP')

                            setDossierCodValidity(validation)
                            const newValue = target.value.substring(0, 3).toUpperCase()+target.value.substring(3, 30);
                            setDossierCod(newValue)
                     
                          }}
                          onKeyDown={handleKeyDown}
                          value={dossierCod}
                        />
                      </Grid>
                    </Grid>
                    <Grid item className={classes.descriptions} justifyContent='center'>
                      <Button
                        text={t('common.buttons.accept')}
                        color='primary'
                        size='large'
                        variant='contained'
                        className={classes.button}
                        onClick={handleClickButton}
                        disabled={!dossierCodValidity}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
              <div className={classes.box}>
                <h1 className={classes.titleSub}>{t('landing.titleSub2')}</h1>
                <p className={classes.text}>{t('landing.textSub2')}</p>
                <Link
                  to={{
                    pathname: '/provisions/what-to-do',
                    state: {
                      dashboard: 'linkProvisions'
                    }
                  }}
                  className={classes.Link}
                >
                  <Grid container className={classes.Link}>
                    <Grid item>
                      <img src={mas} alt='' />
                    </Grid>
                  </Grid>
                </Link>
                <p className={classes.Link}>{t('landing.textLinkSub2')}</p>
              </div>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default SecurityHOC(Landing)
