import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'

import useStyles from './PreType.styles'
import PreTypePropietario from './preTypePropietario/PreTypePropietario'
import PreTypeRepresentante from './preTypeRepresentante/PreTypeRepresentante'
import { checkUserType } from '../../../../../../common/lib/ValidationLib'
import ErrorPreType from '../errorPreType/ErrorPreType'

const PreType = (props: any) => {
  const {
    history,
    datosUser,
    setDatosUser,
    setActiveComponent,
  } = props

  const { t } = useTranslation()
  const classes = useStyles({})

  const [pageNumber, setPageNumber] = useState<number>(0);
  const [pageNumberRepresentante, setPageNumberRepresentante] = useState<number>(0);
  const [representante, setRepresentante] = useState<boolean>(false)
  const [propietario, setPropietario] = useState<boolean>(false)
  const user = useSelector((state: any) => state.user.profile)
  const [statusErrorCertificado, setStatusErrorCertificado] = useState<number>(0)
  const padlock = useSelector((state: any) => state.user.padlock)

  const handleClickRepresentante = () => {
    if (checkUserType(datosUser.docRepresentante) === '0') {
      finPreType()
    } else {
      setDatosUser({
        ...datosUser,
        isOwner: false,
        preType: true
      })
      setRepresentante(true)
      setStatusErrorCertificado(0)
      nextPageRepresentante()
    }
  }

  const handleClickPropietario = () => {
    if (checkUserType(user.documentNumber) === '0' || padlock === '1') {
      if (checkUserType(user.documentNumber) !== '0') {
        setDatosUser({
          ...datosUser,
          isOwner: true,
          preType: true,
          isFehaciente: '1'
        })
      } else {
        setDatosUser({
          ...datosUser,
          isOwner: true,
          preType: true,
          isFehaciente: '0'
        })
      }
      finPreType()
    } else {
      setDatosUser({
        ...datosUser,
        isOwner: true,
        preType: true,
        isFehaciente: '1'
      })
      setPropietario(true)
      setStatusErrorCertificado(0)
      nextPage()
    }
  }

  const handleClickReturn = () => {
    history.push('/provisions/what-to-do')
  }

  const finPreType = () => {
    setActiveComponent(0)
  }

  const nextPage = (): void => {
    setPageNumber(pageNumber + 1)
  }

  const nextPageRepresentante = (): void => {
    setPageNumberRepresentante(pageNumberRepresentante + 1)
  }

  const initialPage = (): void => {
    setPageNumber(0)
    setPageNumberRepresentante(0)
    setRepresentante(false)
    setPropietario(false)
  }

  const previousPage = (): void => {
    if (pageNumber === 1) {
      initialPage()
    } else {
      setPageNumber(pageNumber - 1);
    }
  }

  const previousPageRepresentante = (): void => {
    if (pageNumberRepresentante === 1) {
      initialPage()
    } else{
      setPageNumberRepresentante(pageNumberRepresentante - 1)
    }
  }
  return (
    <>
      {(pageNumber === 0 && pageNumberRepresentante === 0) &&
        <Grid container justifyContent='center'>
          {statusErrorCertificado === 1 ?
          <>
            <Grid container className={classes.buttonAtras} onClick={handleClickReturn} justify='flex-start'>
              {t('PreType.atras')}
            </Grid>
            <ErrorPreType
              statusErrorCertificado={statusErrorCertificado}
            />
          </>
        :
        <>
          <Grid container className={classes.buttonAtras} onClick={handleClickReturn} justify='flex-start'>
            {t('PreType.atras')}
          </Grid>
          <Grid container className={classes.input5} justifyContent='center'>
            {t('PreType.solicitante')}
          </Grid>
          <Grid container md={8} justifyContent='center'>
            <Grid container className={classes.container2} justify='space-evenly'>
              <Grid item className={classes.buttonsRP} md={4}>
                <Grid item className={statusErrorCertificado !== 1 ? classes.buttons1 : classes.buttonsDisable} onClick={(statusErrorCertificado !== 1) && handleClickRepresentante} justifyContent='center'>
                  {t('PreType.PreTypeRepresentante.actRepre')}
                </Grid>
              </Grid>

              <Grid item className={classes.buttonsRP} md={4}>
                <Grid item className={statusErrorCertificado !== 1 ? classes.buttons1 : classes.buttonsDisable} onClick={(statusErrorCertificado !== 1) && handleClickPropietario} justifyContent='center'>
                  {t('PreType.PreTypeRepresentante.actPropietario')}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </>
        }
        </Grid>
      }

      {(pageNumber > 0 && pageNumberRepresentante === 0) && propietario &&
        <PreTypePropietario
          pageNumber={pageNumber}
          nextPage={nextPage}
          previousPage={previousPage}
          initialPage={initialPage}
          statusErrorCertificado={statusErrorCertificado}
          setStatusErrorCertificado={setStatusErrorCertificado}
          finPreType={finPreType}
          padlock={padlock}
        />
      }

      {(pageNumberRepresentante > 0 && pageNumber === 0) && representante &&
        <PreTypeRepresentante
          pageNumberRepresentante={pageNumberRepresentante}
          nextPageRepresentante={nextPageRepresentante}
          previousPageRepresentante={previousPageRepresentante}
          previousPage={previousPage}
          initialPage={initialPage}
          datosUser={datosUser}
          setDatosUser={setDatosUser}
          statusErrorCertificado={statusErrorCertificado}
          setStatusErrorCertificado={setStatusErrorCertificado}
          finPreType={finPreType}
          padlock={padlock}
        />
      }
    </>
  )
}

export default PreType
