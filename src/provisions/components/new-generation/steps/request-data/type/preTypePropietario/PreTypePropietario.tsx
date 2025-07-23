import React from 'react'
import { useTranslation } from 'react-i18next'
import Grid from '@material-ui/core/Grid'
import useStyles from '../PreType.styles'
import MedalIcon from '@material-ui/icons/CardMembership'
import RedPadlock from '../../../../../../../assets/icons/m_candadocerrado.svg'
import ErrorPreType from '../../errorPreType/ErrorPreType'
import ValidateForm from '../../../../../../../common/components/validation/Form'

const PreTypePropietario = (props: any) => {
  const {
    pageNumber,
    nextPage,
    previousPage,
    initialPage,
    statusErrorCertificado,
    setStatusErrorCertificado,
    finPreType
  } = props

  const classes = useStyles({})
  const { t } = useTranslation()

  return (
    <>
      {statusErrorCertificado > 0 &&
        <ErrorPreType
          statusErrorCertificado={statusErrorCertificado}
        />
      }

      <Grid container justifyContent='center'>
        {((pageNumber === 1) || (pageNumber === 2)) &&
          <>
            <Grid container className={classes.buttonAtras} onClick={previousPage} justify='flex-start'>
              {t('PreType.atras')}
            </Grid>

            {statusErrorCertificado === 0 &&
              <Grid container justifyContent='center'>
                <Grid container className={classes.input2a}>
                  {t('PreType.PreTypeRepresentante.actPropietario')}
                </Grid>
              </Grid>
            }
          </>
        }

        {(pageNumber === 1) &&
          <Grid container md={8} className={classes.container2} justifyContent='center'>
            <Grid container className={classes.gridCandado} md={6} justifyContent='center'>
              <Grid container className={classes.gridCloseIcon} md={12} justifyContent='center'>
                <img src={RedPadlock} className={classes.lockIcon} alt='' />
              </Grid>

              <Grid container className={classes.text1b}>
                {t('PreType.PreTypePropietario.persJuridica')}
              </Grid>

              <Grid container className={classes.gridCertificado2} onClick={nextPage} justifyContent='center'>
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
        }
      </Grid>

      {(pageNumber === 2) &&
        <ValidateForm
          setStatusErrorCertificado={setStatusErrorCertificado}
          previousPage={previousPage}
          initialPage={initialPage}
          finPreType={finPreType}
        />
      }
    </>
  )
}

export default PreTypePropietario
