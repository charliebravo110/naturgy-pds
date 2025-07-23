import React, { Fragment, useState } from 'react'
import { Redirect } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'

import Spinner from '../../../common/components/spinner/Spinner'
import ButtonToTop from '../../../common/components/button-to-top/ButtonToTop'
import Input from '../../../common/components/input/Input'
import Button from '../../../common/components/button/Button'
import AddIcon from '../../../assets/icons/mas.svg'

import { SecurityHOC } from '../../../common/HOC/SecurityHOC'
import { setUserRole } from '../../../common/store/actions/UserActions'
import { thunkPutSupply } from '../../../supplies/supplies-vinculation/store/actions/SuppliesVinculationThunkActions'
import IconTextButton from '../../../common/components/icon-text-button/IconTextButton'

import useStyles from './ProvisionsVinculation.styles'

const ProvisionsVinculation = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const user = useSelector((state: any) => state.user.profile)

  let userRoles = sessionStorage.getItem('userRoles') || ''
  let userRolesArray = userRoles.split(',')

  const [isLoading, setIsLoading] = useState(false)

  const [dossierCod, setDossierCod] = useState('')
  const [dossierCodValidity, setDossierCodValidity] = useState(false)

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

  if (userRolesArray.includes('US_CC') || userRolesArray.includes('US_DOSSIER_CLIENT')) {
    return <Redirect to='/provisions' />
  }

  return (
    <Fragment>
      {
        isLoading &&
        <Spinner fixed />
      }

      <ButtonToTop />

      <Grid container className={classes.container} justifyContent='center'>
        <Grid container className={classes.maxWidthForBigScreens} justifyContent='center' alignItems='center'>
          <Grid item xs={12} sm={12} md={12}>
            <div className={classes.headerTitle}>{t('provisions.title')}</div>
          </Grid>

          <Grid container justifyContent='center'>
              <Grid
                container
                className={classes.newProvisionLink}
                item
                xs={11}
                sm={8}
                md={8}
              >
                <Grid container>
                  <Link to='/provisions/what-to-do' className={classes.newServiceLink}>
                    <IconTextButton icon={<img src={AddIcon} className={classes.iconTextButton} alt='' />} text={t('delegations.requestNewService')} />
                  </Link>
                </Grid>
              </Grid>

            <Grid container item xs={11} sm={8} md={8} className={classes.formBlock}>
              <Grid container spacing={3} direction='column'>
                <Grid item>
                  <Grid container spacing={2} direction='column' justifyContent='center' alignItems='center'>
                    <Grid item className={classes.subtitle}>{t('supplies.suppliesVinculation.components.suppliesVinculation.start')}</Grid>

                    <Grid item className={classes.text} xs={8} sm={7} md={6}>{t('provisions.provisionsVinculation.introduceDossierCod')}</Grid>
                  </Grid>
                </Grid>

                <Grid item>
                  <Grid container justifyContent='center' alignItems='center'>
                    <Grid container item xs={12} sm={7} md={5} direction='column'>
                      <Typography className={classes.label}>{t('provisions.provisionsVinculation.dossierCod')}</Typography>

                      <Input
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

                      <Button
                        text={t('common.buttons.continue')}
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
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Fragment>
  )
}

export default SecurityHOC(ProvisionsVinculation)
