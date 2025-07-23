import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { DialogContent, DialogActions } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'

import Mosaic from './mosaic/Mosaic'
import Button from '../../../../../../../../common/components/button/Button'
import TextButton from '../../../../../../../../common/components/text-button/TextButton'
import CloseIcon from '../../../../../../../../assets/icons/cerrar.svg'

import useStyles, { StyledTableCell } from './Content.styles'

const Content = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('sm'))

  const {
    handleCloseDialog,
    handleAcceptDialog,
    stateList,
    selectedState,
    isRustic
  } = props

  const [ tempSelectedState, setTempSelectedState ] = useState(selectedState ? selectedState : 0)

  return (
    <DialogContent className={classes.modalContainer}>
      <Grid container className={classes.block}>
        <Grid container justifyContent='flex-end'>
          <TextButton className={classes.closeButton} onClick={handleCloseDialog}>
            <img src={CloseIcon} alt='' />
          </TextButton>
        </Grid>

        <Grid container className={classes.container}>
          <Grid item className={classes.title}>
            {
              isRustic ?
                t('provisions.newProvision.requestData.location.locationModal.titlePolygon')
              :
                t('provisions.newProvision.requestData.location.locationModal.titleAddress')
            }
          </Grid>

          {
            mobile ?
              <Grid container className={classes.mosaicContainer} spacing={2}>
                {
                  (stateList && stateList.length > 0) && stateList.map(
                    (item, index) => {
                      const tipo = item.tipo || 'UR'

                      let usoPrincipal

                      if (tipo === 'RU') {
                        usoPrincipal = (item && item.datosEcononimos && item.datosEcononimos.uso) ? item.datosEcononimos.uso : t('provisions.newProvision.requestData.supplyType.rustic')
                      } else {
                        usoPrincipal = (item && item.datosEcononimos && item.datosEcononimos.uso) ? item.datosEcononimos.uso : t('provisions.newProvision.requestData.supplyType.livingPlace')
                      }

                      return (
                        <Mosaic
                          key={index}
                          itemIndex={index}
                          use={usoPrincipal}
                          stair={(item && item.domicilioTributario && item.domicilioTributario.locBienUrbano && item.domicilioTributario.locBienUrbano.locUrbana && item.domicilioTributario.locBienUrbano.locUrbana.locInterna) ? item.domicilioTributario.locBienUrbano.locUrbana.locInterna.escalera : '-'}
                          floor={(item && item.domicilioTributario && item.domicilioTributario.locBienUrbano && item.domicilioTributario.locBienUrbano.locUrbana && item.domicilioTributario.locBienUrbano.locUrbana.locInterna) ? item.domicilioTributario.locBienUrbano.locUrbana.locInterna.planta : '-'}
                          door={(item && item.domicilioTributario && item.domicilioTributario.locBienUrbano && item.domicilioTributario.locBienUrbano.locUrbana && item.domicilioTributario.locBienUrbano.locUrbana.locInterna) ? item.domicilioTributario.locBienUrbano.locUrbana.locInterna.puerta : '-'}
                          tempSelectedState={tempSelectedState}
                          setTempSelectedState={setTempSelectedState}
                        />
                      )
                    }
                  )
                }
              </Grid>
            :
              <Grid container>
                <Table className={classes.locationTable}>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>{t('provisions.newProvision.requestData.location.locationModal.header.primaryUse')}</StyledTableCell>

                      <StyledTableCell>{t('provisions.newProvision.requestData.location.locationModal.header.stairs')}</StyledTableCell>

                      <StyledTableCell>{t('provisions.newProvision.requestData.location.locationModal.header.floor')}</StyledTableCell>

                      <StyledTableCell>{t('provisions.newProvision.requestData.location.locationModal.header.door')}</StyledTableCell>

                      <StyledTableCell />
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {
                      (stateList && stateList.length > 0) && stateList.map(
                        (item, index) => {
                          const tipo = item.tipo || 'UR'

                          let usoPrincipal

                          if (tipo === 'RU') {
                            usoPrincipal = (item && item.datosEcononimos && item.datosEcononimos.uso) ? item.datosEcononimos.uso : t('provisions.newProvision.requestData.supplyType.rustic')
                          } else {
                            usoPrincipal = (item && item.datosEcononimos && item.datosEcononimos.uso) ? item.datosEcononimos.uso : t('provisions.newProvision.requestData.supplyType.livingPlace')
                          }

                          return (
                            <TableRow key={index}>
                              <StyledTableCell>{usoPrincipal}</StyledTableCell>

                              <StyledTableCell>{(item && item.domicilioTributario && item.domicilioTributario.locBienUrbano && item.domicilioTributario.locBienUrbano.locUrbana && item.domicilioTributario.locBienUrbano.locUrbana.locInterna) ? item.domicilioTributario.locBienUrbano.locUrbana.locInterna.escalera : '-'}</StyledTableCell>

                              <StyledTableCell>{(item && item.domicilioTributario && item.domicilioTributario.locBienUrbano && item.domicilioTributario.locBienUrbano.locUrbana && item.domicilioTributario.locBienUrbano.locUrbana.locInterna) ? item.domicilioTributario.locBienUrbano.locUrbana.locInterna.planta : '-'}</StyledTableCell>

                              <StyledTableCell>{(item && item.domicilioTributario && item.domicilioTributario.locBienUrbano && item.domicilioTributario.locBienUrbano.locUrbana && item.domicilioTributario.locBienUrbano.locUrbana.locInterna) ? item.domicilioTributario.locBienUrbano.locUrbana.locInterna.puerta : '-'}</StyledTableCell>

                              <StyledTableCell>
                                <div
                                  className={`radioButton ${classes.radioButton} ${tempSelectedState === index && 'active'}`}
                                  onClick={() => setTempSelectedState(index)}
                                />
                              </StyledTableCell>
                            </TableRow>
                          )
                        }
                      )
                    }
                  </TableBody>
                </Table>
              </Grid>
          }

          <DialogActions>
            <Grid container direction='row' justifyContent='center'>
              <Button
                className={classes.button}
                text={t('common.buttons.accept')}
                color='primary'
                size='large'
                variant='contained'
                onClick={() => handleAcceptDialog(tempSelectedState)}
              />
            </Grid>
          </DialogActions>
        </Grid>
      </Grid>
    </DialogContent>
  )
}

export default Content
