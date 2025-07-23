import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'

import DeleteSupplyDialog from '../../../common/delete-supply-dialog/Dialog'

import ListItem from './list-item/ListItem'
import MosaicItem from './mosaic-item/MosaicItem'

import useStyles, { StyledTableCell } from './PowerTable.styles'

const PowerTable = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const [ popupDelete, setPopupDelete ] = useState(false)
  const [ supplyIndex, setSupplyIndex ] = useState()

  const {
    powerList,
    setPowerListI,
    powerListErrors,
    setPowerListErrors,
    techData,
    typesSelect,
    setTotalBuildableArea,
    setTotalPowerRequested,
    state,
    mobile,
    setShowDialog,
    setDialogText
  } = props

  useEffect(() => {
    let totalBuildableAreaAux = 0
    let totalPowerRequestedAux = 0

    powerList.map((item, index) => {
      totalBuildableAreaAux += item.numberOfSupplies * item.buildableArea

      totalPowerRequestedAux += item.subtotalPower !== '' ? +Number(parseFloat(item.subtotalPower)).toFixed(2) : 0

      return null
    })

    setTotalBuildableArea(totalBuildableAreaAux)

    setTotalPowerRequested(totalPowerRequestedAux)
  // eslint-disable-next-line
  }, [ powerList ])

  const handleDeleteSupplie = (index) => {
    setSupplyIndex(index)

    setPopupDelete(true)
  }

  return (
    <>
      <DeleteSupplyDialog
        powerList={powerList}
        setPowerListI={setPowerListI}
        powerListErrors={powerListErrors}
        setPowerListErrors={setPowerListErrors}
        supplyIndex={supplyIndex}
        popup={popupDelete}
        setPopup={setPopupDelete}
      />

      {
        mobile ?
          <Grid container direction='column'>
            {
              powerList.map((item, index) => (
                <MosaicItem
                  key={index}
                  item={item}
                  index={index}
                  techData={techData}
                  state={state}
                  powerList={powerList}
                  setPowerListI={setPowerListI}
                  powerListErrors={powerListErrors}
                  setPowerListErrors={setPowerListErrors}
                  typesSelect={typesSelect}
                  handleDeleteSupplie={handleDeleteSupplie}
                  setShowDialog={setShowDialog}
                  setDialogText={setDialogText}
                />
              ))
            }
          </Grid>
        :
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <StyledTableCell>
                  {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.table.tableHead.col1')}
                </StyledTableCell>

                <StyledTableCell>
                  {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.table.tableHead.col2')}
                </StyledTableCell>

                <StyledTableCell>
                  {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.table.tableHead.col3')}
                </StyledTableCell>

                <StyledTableCell>
                  {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.table.tableHead.col4')}
                </StyledTableCell>

                <StyledTableCell>
                  {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.table.tableHead.col5')}
                </StyledTableCell>
                
                <StyledTableCell>
                  {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.table.tableHead.col7')}
                </StyledTableCell>

                {
                  props.location.pathname === '/provisions/detail' &&
                    <StyledTableCell>
                      {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.building.table.tableHead.col6')}
                    </StyledTableCell>
                }

                <StyledTableCell />
              </TableRow>
            </TableHead>

            <TableBody>
              {
                powerList.map((item, index) => (
                  <ListItem
                    key={index}
                    item={item}
                    index={index}
                    techData={techData}
                    state={state}
                    powerList={powerList}
                    setPowerListI={setPowerListI}
                    powerListErrors={powerListErrors}
                    setPowerListErrors={setPowerListErrors}
                    typesSelect={typesSelect}
                    handleDeleteSupplie={handleDeleteSupplie}
                    setShowDialog={setShowDialog}
                    setDialogText={setDialogText}
                  />
                ))
              }
            </TableBody>
          </Table>
      }
    </>
  )
}

export default withRouter(PowerTable)
