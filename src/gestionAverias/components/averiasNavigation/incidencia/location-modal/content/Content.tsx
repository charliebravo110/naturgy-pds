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
import Button from '../../../../../../common/components/button/Button'
import TextButton from '../../../../../../common/components/text-button/TextButton'
import CloseIcon from '../../../../../../assets/icons/cerrar.svg'

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
    streetName,
    number
  } = props

  const [tempSelectedState, setTempSelectedState] = useState(selectedState ? selectedState : 0)

  return (
    <DialogContent className={classes.modalContainer}>
      <Grid container className={classes.block}>
        <Grid container justifyContent='flex-end'>
          <TextButton className={classes.closeButton} onClick={handleCloseDialog}>
            <img src={CloseIcon} alt='' />
          </TextButton>
        </Grid>

        <Grid container className={classes.container}>
          <Grid item md={12} className={classes.title}>
            {t('provisions.newProvision.requestData.location.locationModal.titleAddress')}
          </Grid>

          <Grid item md={12} className={classes.addressContainer}>
            <div className={classes.addressContainerTitle}>{t('provisions.newProvision.requestData.location.locationModal.addressContainerTitle')}</div>
            <div className={classes.addressDesc}>{(streetName) ? streetName + ' ' + number : ''}</div>
          </Grid>

          <Grid item md={12} className={classes.selectAnOptionContainer}>
            <div className={classes.selectAnOption}>{t('provisions.newProvision.requestData.location.locationModal.selectAnOption')}</div>
          </Grid>

          {
            mobile ?
              <Grid container className={classes.mosaicContainer} spacing={2}>
                {
                  (stateList && stateList.length > 0) && stateList.map(
                    (item, index) => {

                      return (
                        <Mosaic
                          key={index}
                          itemIndex={index}
                          primaryUse={'Vivienda'}
                          stair={(item && item.stair) ? item.stair : '-'}
                          floor={(item && item.floor) ? item.floor : '-'}
                          door={(item && item.door) ? item.door : '-'}
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
                      <StyledTableCell className={classes.tablePadding}>{t('provisions.newProvision.requestData.location.locationModal.header.number')}</StyledTableCell>
                      <StyledTableCell className={classes.tablePadding}>{t('provisions.newProvision.requestData.location.locationModal.header.duplicator')}</StyledTableCell>
                      <StyledTableCell className={classes.tablePadding}>{t('provisions.newProvision.requestData.location.locationModal.header.stairs')}</StyledTableCell>
                      <StyledTableCell className={classes.tablePadding}>{t('provisions.newProvision.requestData.location.locationModal.header.floor')}</StyledTableCell>
                      <StyledTableCell className={classes.tablePadding}>{t('provisions.newProvision.requestData.location.locationModal.header.door')}</StyledTableCell>
                      <StyledTableCell className={classes.tablePadding}/>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {
                      (stateList && stateList.length > 0) && stateList.map(
                        (item, index) => {
                          return (
                            <TableRow key={index}>
                              <StyledTableCell className={classes.tablePadding}>{(item && item.addNumber) ? item.addNumber : '-'}</StyledTableCell>
                              <StyledTableCell className={classes.tablePadding}>{(item && item.portal) ? item.portal : '-'}</StyledTableCell>
                              <StyledTableCell className={classes.tablePadding}>{(item && item.stair) ? item.stair : '-'}</StyledTableCell>
                              <StyledTableCell className={classes.tablePadding}>{(item && item.floor) ? item.floor : '-'}</StyledTableCell>
                              <StyledTableCell className={classes.tablePadding}>{(item && item.door) ? item.door : '-'}</StyledTableCell>
                              <StyledTableCell className={classes.tablePadding} style={{padding: '0'}}>
                                <div
                                  className={`radioButton ${classes.radioButton} ${tempSelectedState === index && 'active'}`}
                                  onClick={() => setTempSelectedState(index)}
                                  style={{margin: '12px 8px 12px 8px'}}
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
