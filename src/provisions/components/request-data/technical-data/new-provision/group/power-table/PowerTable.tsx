import React, { useState, useEffect } from 'react'
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
import DeleteSupplyDialog from '../../../common/delete-supply-dialog/Dialog'

import useStyles, { StyledTableCell } from './PowerTable.styles'

const PowerTable = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const [popup, setPopup] = useState(false)
  const [supplyIndex, setSupplyIndex] = useState()

  const dossierSubtype = useSelector((state: any) => state.provisions.dossierSubtype)

  const {
    powerList,
    setPowerListI,
    powerListErrors,
    setPowerListErrors,
    typesSelect,
    oneSupplie,
    setTotalPowerRequested,
    state,
    mobile,
    setShowDialog,
    setDialogText
  } = props

  useEffect(() => {
    let totalPowerRequestedAux = 0

    powerList.map((item, index) => {
      return totalPowerRequestedAux += item.subtotalPower !== '' ? +Number(parseFloat(item.subtotalPower)).toFixed(2) : 0
    })

    setTotalPowerRequested(totalPowerRequestedAux)
    // eslint-disable-next-line
  }, [powerList])

  const handleDeleteSupplie = (index) => {
    setSupplyIndex(index)

    setPopup(true)
  }

  return (
    <>
      <DeleteSupplyDialog
        powerList={powerList}
        setPowerListI={setPowerListI}
        powerListErrors={powerListErrors}
        setPowerListErrors={setPowerListErrors}
        supplyIndex={supplyIndex}
        popup={popup}
        setPopup={setPopup}
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
                  oneSupplie={oneSupplie}
                  state={state}
                  dossierSubtype={dossierSubtype}
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
                {
                  dossierSubtype !== 'DOSSUB007' && dossierSubtype !== 'DOSSUB009' &&
                  dossierSubtype !== 'DOSSUB029' &&
                  dossierSubtype !== 'DOSSUB030' &&
                  <StyledTableCell>
                    {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.table.tableHead.col1')}
                  </StyledTableCell>
                }

                {
                  (dossierSubtype === 'DOSSUB011' || dossierSubtype === 'DOSSUB012' || dossierSubtype === 'DOSSUB013' || dossierSubtype === 'DOSSUB014') &&
                  <StyledTableCell>
                    {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.table.tableHead.col2')}
                  </StyledTableCell>
                }

                <StyledTableCell>
                  {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.table.tableHead.col3')}
                </StyledTableCell>

                <StyledTableCell>
                  {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.table.tableHead.col5')}
                </StyledTableCell>

                {
                  props.location.pathname === '/provisions/detail' &&
                  <StyledTableCell>
                    {t('provisions.newProvision.requestData.supplyType.form.technicalInstallationData.group.table.tableHead.col6')}
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
                    oneSupplie={oneSupplie}
                    state={state}
                    dossierSubtype={dossierSubtype}
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
