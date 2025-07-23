import React from 'react'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'

import { useTranslation } from 'react-i18next'

import useStyles from './DelegationsNotResults.module'

const DelegationsNotResults = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()
  const { isSearching } = props
  

  return (
    <TableRow className={classes.row}>
      <TableCell
        colSpan={6}
        className={classes.cell}
      >
        {
          isSearching ?
            t('delegations.delegationsNotResult.isSearching1')
          :
            t('delegations.delegationsNotResult.isSearching2')
        }
      </TableCell>
    </TableRow>
  )
}

export default DelegationsNotResults
