import React, { useEffect } from 'react'
import { withRouter } from 'react-router'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'

import ListItem from './list-item/ListItem'
import MosaicItem from './mosaic-item/MosaicItem'

import useStyles, { StyledTableCell } from './PowerTable.styles'

const PowerTable = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const provisions = useSelector((state: any) => state.provisions)

  const {
    state,
    mobile,
    oneSupplie,
    techData,
    powerList,
    setPowerListI,
    powerListErrors,
    setPowerListErrors,
    typesSelect,
    setTotalBuildableArea,
    setTotalPowerRequested,
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
  }, [powerList])

  return (
    <>
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
                  oneSupplie={oneSupplie}
                  state={state}
                  powerList={powerList}
                  setPowerListI={setPowerListI}
                  powerListErrors={powerListErrors}
                  setPowerListErrors={setPowerListErrors}
                  typesSelect={typesSelect}
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
                  {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.family.table.tableHead.col1')}
                </StyledTableCell>

                <StyledTableCell>
                  {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.family.table.tableHead.col2')}
                </StyledTableCell>

                <StyledTableCell>
                  {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.family.table.tableHead.col3')}
                </StyledTableCell>

                <StyledTableCell>
                  {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.family.table.tableHead.col4')}
                </StyledTableCell>

                <StyledTableCell>
                  {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.family.table.tableHead.col5')}
                </StyledTableCell>

                {
                  props.location.pathname === '/provisions/detail' &&
                  <StyledTableCell>
                    {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.family.table.tableHead.col6')}
                  </StyledTableCell>
                }
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
                    oneSupplie={oneSupplie}
                    state={state}
                    powerList={powerList}
                    setPowerListI={setPowerListI}
                    powerListErrors={powerListErrors}
                    setPowerListErrors={setPowerListErrors}
                    typesSelect={typesSelect}
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
