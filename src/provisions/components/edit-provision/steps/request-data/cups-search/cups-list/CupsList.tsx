import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'

import Button from '../../../../../../../common/components/button/Button'
import SupplyPagination from '../../../../../../../common/components/supply-pagination/SupplyPagination'

import useStyles, { StyledTableCell } from './CupsList.styles'

const CupsList = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const delegatesInMe = useSelector((state: any) => state.delegations.delegatesInMeList)

  const {
    cupsList,
    setCups,
    setModificationCups,
    getAddress,
    totalPages,
    rowsPerPage,
    currentPage,
    setCurrentPage,
    setIsLoading
  } = props

  const onlydescStatus = cupsList.filter(item => item.descStatus == 'ACTIVO CONTRATADO');


  const handleOnClick = (item) => {
    const cupsObj = {
      cups: item.cups && item.cups ,
      address: getAddress(item),
      power: item.maxAuthorizedVoltage && item.maxAuthorizedVoltage,
      validExtentRights: item.validExtentRights && item.validExtentRights,
      CIEApprovalDate: item.CIEApprovalDate && item.CIEApprovalDate,
      maxAuthorizedVoltage: item.maxAuthorizedVoltage && item.maxAuthorizedVoltage,
      maxAvalaibleVoltage: item.maxAvalaibleVoltage && item.maxAvalaibleVoltage,
      province: item.address && item.address.province,
      town: item.address && item.address.town,
      streetType: item.address && item.address.streetType,
      streetName: item.address && item.address.street,
      zipCode: item.address && item.address.zipCode,
      number: item.address && item.address.number,
      stair: item.address && item.address.stair,
      floor: item.address && item.address.floor,
      door: item.address && item.address.door,
      mail: item.holderContactEmail && item.holderContactEmail,
      phone: item.holderContactPhone && item.holderContactPhone,
      indTimeDiscriminator: item.hasHourlyDiscrimination && item.hasHourlyDiscrimination
    }
    dispatch(setModificationCups(cupsObj))
    setCups(cupsObj)
  }

  return (
    <Grid container direction='column'>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <StyledTableCell>
              {t(
                'provisions.editProvision.requestData.cupsSearch.table.col1'
              )}
            </StyledTableCell>
            <StyledTableCell>
              {t(
                'provisions.editProvision.requestData.cupsSearch.table.col2'
              )}
            </StyledTableCell>
            <StyledTableCell>
              {t(
                'provisions.editProvision.requestData.cupsSearch.table.col3'
              )}
            </StyledTableCell>

            <StyledTableCell />

          </TableRow>
        </TableHead>

        <TableBody>
          {
            onlydescStatus && onlydescStatus.slice(
              (currentPage * rowsPerPage),
              ((currentPage * rowsPerPage) + rowsPerPage)
            ).map((item, index) => {
              return (
                <TableRow key={index} className={classes.row}>
                  <StyledTableCell>
                    <Typography>{item.cups && item.cups}</Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography>
                      {getAddress(item)}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography>{item.maxAuthorizedVoltage && `${item.maxAuthorizedVoltage} ${t('provisions.editProvision.requestData.cupsSearch.kW')}`}</Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Button
                      className={classes.button}
                      text={t('provisions.editProvision.requestData.cupsSearch.buttons.select')}
                      color='inherit'
                      size='small'
                      variant='outlined'
                      onClick={()=> handleOnClick(item)}
                    />
                  </StyledTableCell>
                </TableRow>
              )
            })
          }

          {
            (
              (currentPage + 1) === totalPages &&
              delegatesInMe &&
              delegatesInMe.length > 0 &&
              delegatesInMe.filter(item => item.role === 'US_MANAGER').length > 0
            ) && delegatesInMe.filter(item => item.role === 'US_MANAGER').map((item, index) => {
              return (
                <TableRow key={index} className={classes.row}>
                  <StyledTableCell>
                    <Typography>{item.cups && item.cups}</Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography>
                      {getAddress(item)}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Typography>{item.maxAuthorizedVoltage && `${item.maxAuthorizedVoltage} ${t('provisions.editProvision.requestData.cupsSearch.kW')}`}</Typography>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Button
                      className={classes.button}
                      text={t('provisions.editProvision.requestData.cupsSearch.buttons.select')}
                      color='inherit'
                      size='small'
                      variant='outlined'
                      onClick={()=> handleOnClick(item)}
                    />
                  </StyledTableCell>
                </TableRow>
              )
            })
          }
        </TableBody>
      </Table>
      {
        totalPages > 1 &&
          <Grid container className={classes.paginationContainer}>
            <SupplyPagination
              listItems={onlydescStatus}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              itemsPerPage={rowsPerPage}
              setIsLoading={setIsLoading}
            />
          </Grid>
      }
    </Grid>
  )
}

export default CupsList
