import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import Button from '../../../../../common/components/button/Button'
import SupplyPagination from '../../../../../common/components/supply-pagination/SupplyPagination'

import { setNewRequestSteps, setNewRequestSupply } from '../../../../store/actions/RequestsActions'

import useStyles from './Mosaic.styles'

const Mosaic = (props: any) => {
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
      {onlydescStatus &&
        onlydescStatus
          .slice(currentPage * rowsPerPage, currentPage * rowsPerPage + rowsPerPage)
          .map((item, index) => {
            return (
              <div key={index} className={classes.mobileRow}>
                <Grid container direction='column' className={classes.inputContainer}>
                  <Grid item className={classes.label}>
                    <Typography>
                      {t('provisions.editProvision.requestData.cupsSearch.table.col1')}
                    </Typography>
                  </Grid>

                  <Grid item className={classes.input}>
                    <Typography className={classes.stateLabel}>{item.cups && item.cups}</Typography>
                  </Grid>
                </Grid>

                <Grid container direction='column' className={classes.inputContainer}>
                  <Grid item className={classes.label}>
                    <Typography>
                      {t('provisions.editProvision.requestData.cupsSearch.table.col2')}
                    </Typography>
                  </Grid>

                  <Grid item className={classes.input}>
                    <Typography className={classes.stateLabel}>
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
                  </Grid>
                </Grid>

                <Grid container direction='column' className={classes.inputContainer}>
                  <Grid item className={classes.label}>
                    <Typography>
                      {t('provisions.editProvision.requestData.cupsSearch.table.col3')}
                    </Typography>
                  </Grid>

                  <Grid item className={classes.input}>
                    <Typography className={classes.stateLabel}>
                      {item.power &&
                        `${item.power} ${t('provisions.editProvision.requestData.cupsSearch.kW')}`}
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
                    onClick={() => handleOnClick(item)}
                  />
                </Grid>
              </div>
            )
          })}

      {currentPage + 1 === totalPages &&
        delegatesInMe &&
        delegatesInMe.length > 0 &&
        delegatesInMe.filter((item) => item.role === 'US_MANAGER').length > 0 &&
        delegatesInMe.filter((item) => item.role === 'US_MANAGER').map((item, index) => {
          return (
            <div key={index} className={classes.mobileRow}>
              <Grid container direction='column' className={classes.inputContainer}>
                <Grid item className={classes.label}>
                  <Typography>
                    {t('provisions.editProvision.requestData.cupsSearch.table.col1')}
                  </Typography>
                </Grid>

                <Grid item className={classes.input}>
                  <Typography className={classes.stateLabel}>{item.cups && item.cups}</Typography>
                </Grid>
              </Grid>

              <Grid container direction='column' className={classes.inputContainer}>
                <Grid item className={classes.label}>
                  <Typography>
                    {t('provisions.editProvision.requestData.cupsSearch.table.col2')}
                  </Typography>
                </Grid>

                <Grid item className={classes.input}>
                  <Typography className={classes.stateLabel}>
                    {item.address &&
                      `${item.address.street ? item.address.street + ' ' : ''}${item.address.name
                        ? item.address.name + ' '
                        : ''}${item.address.number ? item.address.number + ', ' : ''}${item.address
                        .street
                        ? item.address.street + ' '
                        : ''}${item.address.complement2
                        ? item.address.complement2 + ', '
                        : ''}${item.address.municipality
                        ? item.address.municipality + ', '
                        : ''}${item.address.province ? item.address.province : ''}`}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container direction='column' className={classes.inputContainer}>
                <Grid item className={classes.label}>
                  <Typography>
                    {t('provisions.editProvision.requestData.cupsSearch.table.col3')}
                  </Typography>
                </Grid>

                <Grid item className={classes.input}>
                  <Typography className={classes.stateLabel}>
                    {item.power &&
                      `${item.power} ${t('provisions.editProvision.requestData.cupsSearch.kW')}`}
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
                  onClick={() => handleOnClick(item)}
                />
              </Grid>
            </div>
          )
        })}

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

export default Mosaic
