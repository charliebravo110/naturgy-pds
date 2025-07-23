import React from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'

import useStyles, { StyledTableCell } from './ConsultantsTable.styles'

const ConsultantsTable = (props: any) => {
  const { currentDelegatesList, selectConsultant } = props

  const { t } = useTranslation()
 
  const classes = useStyles({})

  return (
    <Grid className={classes.tableBodyScrollWrapper}>
      <Table className={classes.suppliesTable}>
        <TableHead>
          <TableRow className={classes.tableRow} >

            <StyledTableCell>{t('delegates.consultantsList.name')}</StyledTableCell>

            <StyledTableCell>{t('delegates.delegatesList.email')}</StyledTableCell>

            <StyledTableCell>{t('delegates.delegatesList.document')}</StyledTableCell>

            <StyledTableCell className={classes.onlyDesktop} />

          </TableRow>
        </TableHead>
      
        <TableBody>
          {   
            currentDelegatesList.length === 0 ?
            <TableRow className={classes.tableBodyRow} >
              <StyledTableCell className={classes.noResults} colSpan={6}>
                {t('delegates.delegatesList.noResults')}
              </StyledTableCell>
            </TableRow>
            :
            currentDelegatesList.map(
                (delegate, index) => (
                  <TableRow key={delegate.delegateId} className={classes.tableBodyRow} >
                    <StyledTableCell className={classes.suppliesBoldCell}>{delegate.name}</StyledTableCell>

                    <StyledTableCell className={classes.suppliesTableWrappedCell}>{delegate.email}</StyledTableCell>

                    <StyledTableCell>{delegate.documentNumber}</StyledTableCell>

                    <StyledTableCell className={classes.suppliesTableButtonCell}>
                        <p className={classes.blueLink} onClick={() => selectConsultant(delegate)}>{t('delegations.delegationProfile.enter')}</p>
                    </StyledTableCell>
                  </TableRow>
                )
              )
          }
        </TableBody>
      </Table>
    </Grid>
  )
}

export default ConsultantsTable