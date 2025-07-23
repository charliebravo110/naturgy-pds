import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'

import Button from '../../../../../common/components/button/Button'
import SupplyPagination from '../../../../../common/components/supply-pagination/SupplyPagination'

import { setNewRequestSteps, setNewRequestSupply } from '../../../../store/actions/RequestsActions'

import useStyles, { StyledTableCell } from './List.styles'

const List = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const delegatesInMe = useSelector((state: any) => state.delegations.delegatesInMeList)

  const {
    cupsList,
    setCups,
    setCurrentCups,
    setSelected,
    handleScrollToBottom,
    totalPages,
    rowsPerPage,
    currentPage,
    setCurrentPage,
    setIsLoading
  } = props

  const onlydescStatus = cupsList.filter(item => item.descStatus == 'ACTIVO CONTRATADO');

  const handleOnClick = (item) => {
    const object = {
      cups: item.cups && item.cups,
      name: item.name && item.name,
      address:
        item.address &&
        `${item.address.street ? item.address.street + ' ' : ''}${item.address.name
          ? item.address.name + ' '
          : ''}${item.address.number ? item.address.number + ', ' : ''}${item.address.street
          ? item.address.street + ' '
          : ''}${item.address.complement2 ? item.address.complement2 + ', ' : ''}${item.address
          .municipality
          ? item.address.municipality + ', '
          : ''}${item.address.province ? item.address.province : ''}`
    }

    dispatch(
      setNewRequestSteps({
        step2: object.cups
      })
    )

    dispatch(setNewRequestSupply(object))

    setCups(object)

    setCurrentCups(object && object.cups)

    setSelected(true)

    handleScrollToBottom()
  }

  return (
    <Grid container direction='column'>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <StyledTableCell>
              {t('provisions.editProvision.requestData.cupsSearch.table.col1')}
            </StyledTableCell>

            <StyledTableCell>
              {t('provisions.editProvision.requestData.cupsSearch.table.col2')}
            </StyledTableCell>

            <StyledTableCell>
              {t('provisions.editProvision.requestData.cupsSearch.table.col3')}
            </StyledTableCell>

            <StyledTableCell />
          </TableRow>
        </TableHead>

        <TableBody>
          {onlydescStatus &&
            onlydescStatus
              .slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
              .map((item, index) => {
                return (
                  <TableRow key={index} className={classes.row}>
                    <StyledTableCell>
                      <Typography>{item.cups && item.cups}</Typography>
                    </StyledTableCell>

                    <StyledTableCell>
                      <Typography>
                        {item.address &&
                          `${item.address.street ? item.address.street + ' ' : ''}${item.address
                            .name
                            ? item.address.name + ' '
                            : ''}${item.address.number ? item.address.number + ', ' : ''}${item
                            .address.street
                            ? item.address.street + ' '
                            : ''}${item.address.complement2
                            ? item.address.complement2 + ', '
                            : ''}${item.address.municipality
                            ? item.address.municipality + ', '
                            : ''}${item.address.province ? item.address.province : ''}`}
                      </Typography>
                    </StyledTableCell>

                    <StyledTableCell>
                      <Typography>
                        {item.power &&
                          `${item.power} ${t(
                            'provisions.editProvision.requestData.cupsSearch.kW'
                          )}`}
                      </Typography>
                    </StyledTableCell>

                    <StyledTableCell>
                      <Button
                        className={classes.button}
                        text={t('provisions.editProvision.requestData.cupsSearch.buttons.select')}
                        color='inherit'
                        size='small'
                        variant='outlined'
                        onClick={() => handleOnClick(item)}
                      />
                    </StyledTableCell>
                  </TableRow>
                )
              })}
          {currentPage + 1 === totalPages &&
            delegatesInMe &&
            delegatesInMe.length > 0 &&
            delegatesInMe.filter((item) => item.role === 'US_MANAGER').length > 0 &&
            delegatesInMe.filter((item) => item.role === 'US_MANAGER').map((item, index) => {
              return (
                <TableRow key={index} className={classes.row}>
                  <StyledTableCell>
                    <Typography>{item.cups && item.cups}</Typography>
                  </StyledTableCell>

                  <StyledTableCell>
                    <Typography>
                      {item.address &&
                        `${item.address.street ? item.address.street + ' ' : ''}${item.address.name
                          ? item.address.name + ' '
                          : ''}${item.address.number ? item.address.number + ', ' : ''}${item
                          .address.street
                          ? item.address.street + ' '
                          : ''}${item.address.complement2
                          ? item.address.complement2 + ', '
                          : ''}${item.address.municipality
                          ? item.address.municipality + ', '
                          : ''}${item.address.province ? item.address.province : ''}`}
                    </Typography>
                  </StyledTableCell>

                  <StyledTableCell>
                    <Typography>
                      {item.power &&
                        `${item.power} ${t('provisions.editProvision.requestData.cupsSearch.kW')}`}
                    </Typography>
                  </StyledTableCell>

                  <StyledTableCell>
                    <Button
                      className={classes.button}
                      text={t('provisions.editProvision.requestData.cupsSearch.buttons.select')}
                      color='inherit'
                      size='small'
                      variant='outlined'
                      onClick={() => handleOnClick(item)}
                    />
                  </StyledTableCell>
                </TableRow>
              )
            })}
        </TableBody>
      </Table>

      {totalPages > 1 && (
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
      )}
    </Grid>
  )
}

export default List
