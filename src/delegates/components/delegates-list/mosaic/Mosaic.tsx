import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import Pagination from '../../../../common/components/pagination/Pagination2'
import Checkbox from '../../../../common/components/checkbox/Checkbox'

import EditIcon from '../../../../assets/icons/editar.svg'

import useStyles from './Mosaic.styles'

const Mosaic = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  const {
    delegatesText,
    listItems,
    currentPage,
    handleCheckbox,
    handleChangePage,
    adminToken
  } = props
  const rowsPerPage = 6

  const totalPages = listItems.length === 0 ? 1 : Math.ceil(listItems.length / rowsPerPage)

  return (
    <Grid className={classes.table}>
        {
          listItems.length === 0 ?
            <div>No hay elementos disponibles</div>
          :
            <Grid container spacing={2}>
              {
                listItems.slice(
                  (currentPage - 1) * rowsPerPage,
                  (currentPage - 1) * rowsPerPage + rowsPerPage
                ).map(
                  (delegate, index) => (
                    <Grid
                      item
                      key={index}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                    >
                      <Grid className={classes.item}>
                        <Grid className={classes.row}>
                          <Typography className={classes.title}>{t(`delegates.${delegatesText}List.name`)}</Typography>

                          <Typography className={`${classes.value} bold`}>{delegate.name}</Typography>
                        </Grid>

                        <Grid className={classes.row}>
                          <Typography className={classes.title}>{t('delegates.delegatesList.email')}</Typography>

                          <Typography className={`${classes.value} bold`}>{delegate.email}</Typography>
                        </Grid>

                        <Grid className={classes.row}>
                          <Typography className={classes.title}>{t('delegates.delegatesList.document')}</Typography>

                          <Typography className={classes.value}>{delegate.documentNumber}</Typography>
                        </Grid>

                        <Grid container justifyContent='space-between'>
                          <Checkbox
                            value={delegate.delegateId}
                            onChange={handleCheckbox}
                          />
                          {
                            !adminToken &&
                              <Link 
                                to={{
                                  pathname: `/${delegatesText}/profile`,
                                    state: {
                                      delegateId: delegate.delegateId
                                    }
                                }} 
                                className={classes.editButton} 
                              >
                                <img src={EditIcon} alt='' />
                                <p>{t('delegates.delegatesList.edit')}</p>
                              </Link>
                          }
                        </Grid>

                      </Grid>
                    </Grid>
                  )
                )
              }
            </Grid>
        }

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          handleChangePage={handleChangePage}
        />
    </Grid>
  )
}

export default Mosaic
