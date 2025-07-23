import React from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import Button from '../../../../../common/components/button/Button'
import DossierPagination from '../../../../../common/components/dossier-pagination/DossierPagination'

import { setNewRequestSteps, setNewRequestDossier } from '../../../../store/actions/RequestsActions'

import useStyles from './Mosaic.styles'

const Mosaic = (props: any) => {
  const classes = useStyles({})
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const {
    cupsList,
    setCups,
    setSelected,
    handleScrollToBottom,
    totalPages,
    rowsPerPage,
    currentPage,
    setCurrentPage,
    setIsLoading
  } = props

  const getDossierTypeString = (code: string) => {
    let type = ''

    if (code === 'DOSTYP001') {
      type = t('provisions.editProvision.requestData.cupsSearch.table.col8.field1')
    } else if (code === 'DOSTYP002') {
      type = t('provisions.editProvision.requestData.cupsSearch.table.col8.field3')
    } else if (code === 'DOSTYP003') {
      type = t('provisions.editProvision.requestData.cupsSearch.table.col8.field2')
    }

    return type
  }

  const handleOnClick = (item) => {
    const object = {
      dossierCod: item.dossierCod,
      name: item.name && item.name,
      address: item.addressDescription && item.addressDescription,
      idDossierType: item.idDossierType
    }

    dispatch(setNewRequestSteps({
      step2: object.dossierCod
    }))

    dispatch(setNewRequestDossier(object))

    setCups(object)

    setSelected(true)

    handleScrollToBottom()
  }

  return (
    <Grid container direction='column'>
      {
        cupsList && cupsList.slice(
          (currentPage * rowsPerPage),
          ((currentPage * rowsPerPage) + rowsPerPage)
        ).map((item, index) => {
          return (
              <div key={index} className={classes.mobileRow}>
                <Grid container direction='column' className={classes.inputContainer}>
                  <Grid item className={classes.label}>
                    <Typography>
                      {t(
                        'provisions.editProvision.requestData.cupsSearch.table.col6'
                      )}
                    </Typography>
                  </Grid>
                  <Grid item className={classes.input}>
                    <Typography className={classes.stateLabel}>
                    {item.dossierCod && item.dossierCod}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container direction='column' className={classes.inputContainer}>
                  <Grid item className={classes.label}>
                    <Typography>
                      {t(
                        'provisions.editProvision.requestData.cupsSearch.table.col2'
                      )}
                    </Typography>
                  </Grid>
                  <Grid item className={classes.input}>
                    <Typography className={classes.stateLabel}>
                      {item.addressDescription && item.addressDescription}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container direction='column' className={classes.inputContainer}>
                  <Grid item className={classes.label}>
                    <Typography>
                      {t(
                        'provisions.editProvision.requestData.cupsSearch.table.col7'
                      )}
                    </Typography>
                  </Grid>
                  <Grid item className={classes.input}>
                    <Typography className={classes.stateLabel}>
                      {getDossierTypeString(item.idDossierType)}
                    </Typography>
                  </Grid>
                </Grid>

                <Grid container direction='column' className={classes.inputContainer}>
                  <Button
                    className={classes.button}
                    text={t('provisions.editProvision.requestData.cupsSearch.buttons.select')}
                    color='inherit'
                    size='small'
                    variant='outlined'
                    onClick={()=> handleOnClick(item)}
                  />
                </Grid>
            </div>
          )
        })
      }

      {
        totalPages > 1 &&
          <Grid container className={classes.paginationContainer}>
            <DossierPagination
              listItems={cupsList}
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

export default Mosaic
