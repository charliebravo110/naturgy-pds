import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'

import useStyles from './ValidateCups.styles'
import Input from '../../../../../common/components/input/Input'
import Select from '../../../../../common/components/select/Select'
import { noAccents } from '../../../../../common/lib/FormatLib'
import {
  validateCIF,
  validateNIF,
  validateMobileNumber
} from '../../../../../common/lib/ValidationLib'

import { thunkListSupplies } from '../../../../../supplies/supplies-list/store/actions/SuppliesListThunkActions'


const ValidateCups = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const user = useSelector((state: any) => state.user)

  const {
    pvtData,
    setPvtData,
    pvtErrors,
    handleUpdateErrors
  } = props


  const [loadingCupsList, setLoadingCupsList] = useState(false)
  const [cupsList, setCupsList] = useState([] as any)

  const onlyHasLetters = (text) => {
    const letters = /^[A-Za-z][A-Za-z\s]*$/
    return text.match(letters) ? true : false
  }

  useEffect(() => {
    if (user.token !== '' && user.profile.documentNumber) {
      if (cupsList.length === 0) {
        let auxCupsList = []
        const supplyPointDefaultName = t('delegations.supplyPointDefaultName')
        // setIsLoading ? setIsLoading(true) : setLoading(true)
        setLoadingCupsList(true)
        dispatch(thunkListSupplies(
          supplyPointDefaultName,
          //1,
          //15,
          //null,
          //false,
          //0, // offset [delegatePoints]
          //15, // limit [delegatePoints]
          false, // proveniente de cupsSearch para la busqueda [delegatePoints]
          true, // accion contra supplyPoints
          true, // accion contra delegatePoints
          (response) => {
            if (response && response.supplypoints && response.supplypoints.length > 0) {
              response.supplypoints.map((supplypoint, i) => {
                auxCupsList.push(supplypoint.cups)
              })
            }
            if (response && response.delegatepoints && response.delegatepoints.length > 0) {
              response.delegatepoints.map((delegatepoint, i) => {
                if (delegatepoint.role === 'US_MANAGER') {
                  auxCupsList.push(delegatepoint.cups)
                }
              })
            }
            setCupsList(auxCupsList)
            // setIsLoading ? setIsLoading(false) : setLoading(false)
            setLoadingCupsList(false)
          }
        ))
      }
    }
  }, [user])

  return (
    <Grid>
      <div className={classes.description2}>
        {t('requests.newRequest.form.btenForm.titles.title6')}
      </div>

      <Grid container className={classes.inputs} spacing={3}>
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>
                {t('requests.newRequest.form.validatorCups.labelsP.cups')}
              </div>
            </Grid>

            <Select
              fullWidth
              label={
                loadingCupsList ?
                  ''
                  :
                  cupsList.length === 0 ?
                    t('requests.newRequest.form.btenForm.inputs.errors.noCups')
                    :
                    ''
              }
              value={pvtData.cups}
              values={cupsList}
              onChange={(e) => {
                setPvtData({
                  ...pvtData,
                  cups: e.target.value
                })
              }}
              onBlur={(e) => {
                pvtData.cups === '' ?
                  handleUpdateErrors({
                    ...pvtErrors,
                    cups: true
                  })
                  :
                  handleUpdateErrors({
                    ...pvtErrors,
                    cups: false
                  })
              }}
              error={pvtErrors.cups}
              helperText={pvtErrors.cups &&
                t('requests.newRequest.form.privateForm.errors.required')}
              disabled={cupsList.length === 0}
              isLoading={loadingCupsList}
            />
          </Grid>
        </Grid>
      </Grid>

      {/* 
      *** Titular de las instalaciones ***
      */}

      <div className={classes.description2}>
        {t('requests.newRequest.form.validatorCups.datosTitular.title')}
      </div>

      <Grid container className={classes.inputs} spacing={3}>
        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>
                {t('requests.newRequest.form.validatorCups.datosTitular.company')}
              </div>
            </Grid>

            <Input
              fullWidth
              value={pvtData.ownerBusinessName}
              onChange={(e) => {
                const value = e.target.value

                setPvtData({
                  ...pvtData,
                  ownerBusinessName: value
                })

                if (value === '') {
                  handleUpdateErrors({
                    ...pvtErrors,
                    ownerBusinessName: true
                  })
                } else {
                  handleUpdateErrors({
                    ...pvtErrors,
                    ownerBusinessName: false
                  })
                }
              }}
              onBlur={(e) => {
                e.target.value === '' ?
                  handleUpdateErrors({
                    ...pvtErrors,
                    ownerBusinessName: true
                  })
                  :
                  handleUpdateErrors({
                    ...pvtErrors,
                    ownerBusinessName: false
                  })
              }}
              error={pvtErrors.ownerBusinessName}
              helperText={pvtErrors.ownerBusinessName &&
                t('requests.newRequest.form.privateForm.errors.required')}
            />
          </Grid>
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>
                {t('requests.newRequest.form.validatorCups.datosTitular.nif')}
              </div>
            </Grid>

            <Input
              fullWidth
              value={pvtData.ownerDocNum}
              onChange={(e) => {
                setPvtData({
                  ...pvtData,
                  ownerDocNum: e.target.value
                })
              }}
              onBlur={(e) => {
                if (e.target.value !== '' &&
                  !validateCIF(e.target.value) &&
                  !validateNIF(e.target.value)) {

                  handleUpdateErrors({
                    ...pvtErrors,
                    ownerDocNum: true
                  })
                } else {
                  handleUpdateErrors({
                    ...pvtErrors,
                    ownerDocNum: false
                  })
                }
              }}
              error={pvtErrors.ownerDocNum}
              helperText={pvtErrors.ownerDocNum && t('requests.newRequest.form.btenForm.inputs.errors.docNumber2')}
            />
          </Grid>
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>
                {t('requests.newRequest.form.validatorCups.datosTitular.cargo')}
              </div>
            </Grid>

            <Input
              fullWidth
              value={pvtData.ownerCharge}
              onChange={(e) => {
                setPvtData({
                  ...pvtData,
                  ownerCharge: e.target.value
                })
              }}
            />
          </Grid>
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>
                {t('requests.newRequest.form.validatorCups.datosTitular.name')}
              </div>
            </Grid>

            <Input
              fullWidth
              value={pvtData.ownerContactPerson}
              onChange={(e) => {
                const value = noAccents(e.target.value.toUpperCase())

                setPvtData({
                  ...pvtData,
                  ownerContactPerson: value
                })

                if (value === '' || !onlyHasLetters(value)) {
                  handleUpdateErrors({
                    ...pvtErrors,
                    ownerContactPerson: true
                  })
                } else {
                  handleUpdateErrors({
                    ...pvtErrors,
                    ownerContactPerson: false
                  })
                }
              }}
              onBlur={(e) => {
                (e.target.value === '' || !onlyHasLetters(e.target.value)) ?
                  handleUpdateErrors({
                    ...pvtErrors,
                    ownerContactPerson: true
                  })
                  :
                  handleUpdateErrors({
                    ...pvtErrors,
                    ownerContactPerson: false
                  })
              }}
              error={pvtErrors.ownerContactPerson}
              helperText={pvtErrors.ownerContactPerson &&
                t('requests.newRequest.form.privateForm.errors.required')}
            />
          </Grid>
        </Grid>

        <Grid item md={6} sm={12} xs={12}>
          <Grid container direction='column'>
            <Grid item>
              <div className={classes.label}>
                {t('requests.newRequest.form.validatorCups.datosTitular.movil')}
              </div>
            </Grid>

            <Input
              fullWidth
              value={pvtData.ownerContactPhoneNum}
              onChange={(e) => {
                const value = e.target.value

                setPvtData({
                  ...pvtData,
                  ownerContactPhoneNum: value
                })

                if (value === '' || !validateMobileNumber(value)) {
                  handleUpdateErrors({
                    ...pvtErrors,
                    ownerContactPhoneNum: true
                  })
                } else {
                  handleUpdateErrors({
                    ...pvtErrors,
                    ownerContactPhoneNum: false
                  })
                }
              }}
              onBlur={(e) => {
                (e.target.value === '' || !validateMobileNumber(e.target.value)) ?
                  handleUpdateErrors({
                    ...pvtErrors,
                    ownerContactPhoneNum: true
                  })
                  :
                  handleUpdateErrors({
                    ...pvtErrors,
                    ownerContactPhoneNum: false
                  })
              }}
              error={pvtErrors.ownerContactPhoneNum}
              helperText={pvtErrors.ownerContactPhoneNum &&
                t('requests.newRequest.form.privateForm.errors.required')}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ValidateCups