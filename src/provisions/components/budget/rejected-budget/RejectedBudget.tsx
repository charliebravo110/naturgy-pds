import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'

import Select from '../../../../common/components/select/Select'
import Input from '../../../../common/components/input/Input'
import Button from '../../../../common/components/button/Button'
import Spinner from '../../../../common/components/spinner/Spinner'

import { setCurrentProvision } from '../../../store/actions/ProvisionsActions'
import { thunkUpdateDossier, thunkGetMasterData } from '../../../store/actions/ProvisionsThunkActions'

import useStyles from './RejectedBudget.styles'

const RejectedBudget = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const { setPopup } = props

  const user = useSelector((state: any) => state.user.profile)
  const currentProvision = useSelector((state: any) => state.provisions.currentProvision)

  const [ isLoading, setIsLoading ] = useState(false)
  const [ reasonsList, setReasonsList ] = useState([] as any)
  const [ reason, setReason ] = useState('')
  const [ explain, setExplain ] = useState('')
  const [ characters, setCharacters ] = useState(500)

  const handleSelect = (e) => {
    setReason(e.target.value)
  }

  const handleInput = (e) => {
    setExplain(e.target.value)
    setCharacters(500 - e.target.value.length)
  }

  const handleSend = () => {
    setIsLoading(true)

    const data = {
      dossierCod: currentProvision.dossierCod,
      applicant: {
        docNumber: user.documentNumber
      },
      budgetValorationRejection: '1',
      budgetValorationRejectionComment: reason + '. ' + explain
    }

    dispatch(thunkUpdateDossier(currentProvision.dossierCod, false, data, (response) => {
      if (response && response.result && response.result.codResult === '0') {
        let provision = currentProvision

        if (response.dossier && response.dossier.dossierCod) {
          provision = {
            ...provision,
            ...response.dossier,
            dossierStatusId: response.dossier.dossierStatusId,
            valoration: provision.valoration,
            techData: provision.techData
          }

          dispatch(setCurrentProvision(provision))

          setPopup(false)
        }

      }
      setIsLoading(false)
    }))
  }

  useEffect(() => {
    setIsLoading(true)

    // cargar lista de motivos de MasterData
    dispatch(thunkGetMasterData('DOSSIER_PRESUPUESTO_MOTIVO_RECHAZO', 
            (sessionStorage.getItem('lang') || 'ES').toUpperCase(), 'PREREC', (response) => {
      if (response && response.length > 0) {
        let auxResponse = [] as any

        response.map((item) => {
          return auxResponse.push(item.value)
        })

        setReasonsList(auxResponse)

        setReason(auxResponse[0])
      }

      setIsLoading(false)
    }))
  // eslint-disable-next-line
  }, [])

  return (
    <Grid container justifyContent='center' alignItems='center' className={classes.container}>
      {
        isLoading &&
          <Spinner />
      }

      <Grid
        container
        direction='column'
        justifyContent='center'
        alignItems='center'
        spacing={6}
        md={8}
        sm={10}
        xs={11}
      >
        <Grid item>
          <Grid container direction='column' justifyContent='center' alignItems='center'>
            <Grid item className={classes.title}>
              {t('provisions.budget.rejectBudget.title')}
            </Grid>

            <Grid item className={classes.subtitle}>{t('provisions.budget.rejectBudget.subtitle')}</Grid>
          </Grid>
        </Grid>

        <Grid item className={classes.inputBlock}>
          <div className={classes.label}>{t('provisions.budget.rejectBudget.selectLabel')}</div>

          <Select
            fullWidth
            values={reasonsList}
            value={reason}
            onChange={handleSelect}
          />
        </Grid>

        <Grid item className={classes.inputBlock}>
          <div className={classes.label}>{t('provisions.budget.rejectBudget.inputLabel')}</div>

          <Input
            fullWidth
            multiline
            rows='5'
            value={explain}
            onChange={handleInput}
            inputProps={{
              maxlength: '500'
            }}
          />

          <Grid container justifyContent='flex-end'>
            <Grid item className={classes.characterCount}>
              {t('provisions.budget.rejectBudget.characters.part1')}

              {characters}

              {t('provisions.budget.rejectBudget.characters.part2')}
            </Grid>
          </Grid>
        </Grid>

        <Grid container justifyContent='center'>
          <Button
            className={classes.button}
            text={t('provisions.budget.rejectBudget.buttons.send')}
            color='primary'
            size='large'
            variant='contained'
            disabled={reason === '' || explain === ''}
            onClick={handleSend}
          />
        </Grid>
      </Grid>
    </Grid>
  )
}

export default RejectedBudget
