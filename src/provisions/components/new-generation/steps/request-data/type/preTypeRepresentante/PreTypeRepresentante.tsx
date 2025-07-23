import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'

import useStyles from '../PreType.styles'
import MedalIcon from '@material-ui/icons/CardMembership'
import ErrorPreType from '../../errorPreType/ErrorPreType'
import RedPadlock from '../../../../../../../assets/icons/m_candadocerrado.svg'
import Input from '../../../../../../../common/components/input/Input'
import Button from '../../../../../../../common/components/button/Button'
import {
  checkDocumentTypeInString,
  checkUserType,
  validateCIF,
  validateNIE,
  validateNIF
} from '../../../../../../../common/lib/ValidationLib'
import { setSearchedUser } from '../../../../../../../admin/store/actions/AdminActions'
import { thunkGetSearchedUser } from '../../../../../../../admin/store/actions/UserThunkActions'
import ValidateForm from '../../../../../../../common/components/validation/Form'

const PreTypeRepresentante = (props: any) => {
  const {
    pageNumberRepresentante,
    nextPageRepresentante,
    previousPageRepresentante,
    initialPage,
    datosUser,
    setDatosUser,
    statusErrorCertificado,
    setStatusErrorCertificado,
    finPreType,
    padlock
  } = props

  const classes = useStyles({})
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [error, setError] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [docType, setDocType] = useState<string>('')

  const validateCredentials = () => {
    let docTypeLet: string = ''
    docTypeLet = checkDocumentTypeInString(datosUser.docRepresentante)

    switch (docTypeLet) {
      default:
        setError(true)
        break
      case 'NIF':
        setError(!validateNIF(datosUser.docRepresentante))
        break
      case 'CIF':
        setError(!validateCIF(datosUser.docRepresentante))
        break
      case 'NIE':
        setError(!validateNIE(datosUser.docRepresentante))
        break
    }
    setDocType(docTypeLet)
  }

  const buscarDocumento = () => {
    dispatch(setSearchedUser({}))

    dispatch(thunkGetSearchedUser(datosUser.docRepresentante, '', setIsLoading, (response) => {
      if (response && (checkUserType(datosUser.docRepresentante) === '1' && padlock !== '1')) {
        nextPageRepresentante()
        setDatosUser({
          ...datosUser,
          isFehaciente: '1'
        })
      } else if (checkUserType(datosUser.docRepresentante) === '1' && padlock !== '1'){
        nextPageRepresentante()
        setDatosUser({
          ...datosUser,
          isFehaciente: '1'
        })
      } else if (checkUserType(datosUser.docRepresentante) === '0') {
        setDatosUser({
          ...datosUser,
          isFehaciente: '0'
        })
        finPreType()
      } else {
        setDatosUser({
          ...datosUser,
          isFehaciente: '1'
        })
        finPreType()
      }
    }))
  }

  useEffect(() => {
    if (datosUser.docRepresentante !== '') {
      validateCredentials()
    }
  }, [datosUser.docRepresentante])

  return (
    <>
      {statusErrorCertificado > 0 &&
        <ErrorPreType
          statusErrorCertificado={statusErrorCertificado}
        />
      }

      <Grid container justifyContent='center'>
        <Grid container className={classes.buttonAtras} onClick={previousPageRepresentante} justify='flex-start'>
          {t('PreType.atras')}
        </Grid>

        {statusErrorCertificado === 0 &&
          <>
            <Grid container justifyContent='center'>
              <Grid container className={classes.input2a}>
                {t('PreType.PreTypeRepresentante.actRepre')}
              </Grid>
            </Grid>
          </>
        }

        {(pageNumberRepresentante === 1) &&
          <Grid container className={classes.container2b}>
            
            <Grid container className={classes.container2b}>
              <Grid item className={classes.input3}>
                {t('PreType.PreTypeRepresentante.doc')}
              </Grid>
            </Grid>

            <Grid container className={classes.container2b}>
              <Grid item className={classes.input3}>
                <Input
                  className={classes.input3}
                  onChange={(e) =>
                    setDatosUser({
                      ...datosUser,
                      docRepresentante: e.target.value
                    })
                  }
                />
              </Grid>
              <Grid item className={classes.input3}>
                <Button
                  variant='contained'
                  text={t('PreType.PreTypeRepresentante.ok')}
                  color={'primary'}
                  size={'small'}
                  disabled={error}
                  onClick={buscarDocumento}
                />
              </Grid>
            </Grid>

          </Grid>
        }
      </Grid>

      {(pageNumberRepresentante === 2) &&
        <Grid container justifyContent='center'>
          <Grid container md={8} className={classes.container2} justifyContent='center'>
            <Grid container className={classes.gridCandado} md={6} justifyContent='center'>
              <Grid container className={classes.gridCloseIcon} md={12} justifyContent='center'>
                <img src={RedPadlock} className={classes.lockIcon} alt='' />
              </Grid>

              <Grid container className={classes.text1b}>
                {t('PreType.PreTypeRepresentante.persJuridica')}
              </Grid>

              <Grid container className={classes.gridCertificado2} onClick={nextPageRepresentante} justifyContent='center'>
                <Grid item className={classes.buttons2} md={2}>
                  <Grid item className={classes.gridItemButtonS1} justifyContent='center'>
                    <MedalIcon className={classes.medalIcon} />
                  </Grid>
                </Grid>

                <Grid item className={classes.buttons2} md={8}>
                  <Grid item className={classes.gridItemButtonS1} justifyContent='center'>
                    {t('PreType.PreTypePropietario.acceder')}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      }

      {(pageNumberRepresentante === 3) &&
        <ValidateForm
          setStatusErrorCertificado={setStatusErrorCertificado}
          previousPage={previousPageRepresentante}
          initialPage={initialPage}
          finPreType={finPreType}
        />
      }
    </>
  )
}

export default PreTypeRepresentante
