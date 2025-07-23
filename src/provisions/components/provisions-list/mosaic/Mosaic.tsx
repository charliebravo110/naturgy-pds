import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useHistory, withRouter } from 'react-router'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import AlertIcon from '../../../../assets/icons/aviso_alerta_pop_up.svg'
import LoadingAnimation from '../../../../assets/img/spinner.gif'
import { isPrevious2017 } from '../../../../common/lib/ValidationLib'
import {
  setDossierType,
  setDossierSubtype,
  setSelectedSupplyType,
  setSupplySubtypes,
  setSelectedSupplySubtype,
  setBuildingCoordinates,
  setCurrentProvisionScaleInd
} from '../../../store/actions/ProvisionsActions'
import { thunkGetMasterData, thunkGetProvision } from '../../../store/actions/ProvisionsThunkActions'

import useStyles from './Mosaic.styles'
import Pagination from '../../../../common/components/pagination/Pagination2'

const Mosaic = (props: any) => {
  const {
    listItems,
    currentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    setIsLoading,
    isSubLoading,
    setCurrentPage
  } = props

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [dossierStatus, setDossierStatus] = useState([] as any)
  const classes = useStyles({})

  const history = useHistory()

  const target = document.getElementById('number') as HTMLSelectElement

  const onChangeSelector = () => {
    setItemsPerPage(target.options[target.selectedIndex].value)
  }

  const formatDateAndTime = (date) => {
    if (date) {
      const year = date.substring(0, 4)
      const month = date.substring(4, 6)
      const day = date.substring(6, 8)
      const hour = date.substring(8, 10)
      const min = date.substring(10, 12)
      const sec = date.substring(12, 14)
      return (day + '/' + month + '/' + year + ' ' + hour + ':' + min + ':' + sec)
    }
  }

  const handleClick = (provision) => {
    if (provision.dossierStatusId && !isPrevious2017(provision.registerDate)) {
      setIsLoading(true)

      dispatch(setCurrentProvisionScaleInd(provision.scaleInd ? provision.scaleInd : ''))

      let defaultName = t('provisions.defaultName')

      dispatch(thunkGetProvision(provision.dossierCod, defaultName, (response) => {
        if (response) {
          dispatch(setDossierType(''))
          dispatch(setDossierSubtype(''))
          dispatch(setSelectedSupplyType(''))
          dispatch(setSupplySubtypes([]))
          dispatch(setSelectedSupplySubtype(''))
          dispatch(setBuildingCoordinates({}))

          history.push({ 
            pathname: '/provisions/detail',
            state: response
           });
          //props.history.push('/provisions/detail')
        }

        setIsLoading(false)
      }))
    }
  }

  const getDossierSubtype = (CurrentProvisionType, CurrentProvisionSubType) => {
    if (CurrentProvisionType === 'DOSTYP001') {
      if (CurrentProvisionSubType === 'DOSSUB015') return  t('provisions.provisionsList.provisionTypes.power')
      else return t('provisions.provisionsList.provisionTypes.consumo')
    }
    else {
      if (CurrentProvisionType === 'DOSTYP002') {
        if (CurrentProvisionSubType === 'DOSSUB000') return t('provisions.provisionsList.provisionTypes.autoconsumo')
        else return t('provisions.provisionsList.provisionTypes.generation')
      }
      else return t('provisions.provisionsList.provisionTypes.trazado')
    }
  }

  const [totalPagesFilter, setTotalPagesFilter] = useState(0)
  useEffect(() => {
		setTotalPagesFilter(listItems.length === 0 ? 1 : Math.ceil(listItems.length / itemsPerPage))
		// eslint-disable-next-line
	}, [listItems, itemsPerPage])

  useEffect(() => {
    if (dossierStatus.length === 0) {
      dispatch(thunkGetMasterData('DOSSIER_STATUS_ID', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), '', (response) => {
        if (response) {
          setDossierStatus(response)
        }
      }))

    }
    // eslint-disable-next-line
  }, [])

  const handleCheckProvisionName = (nameProvision) => {
    let nameResult = nameProvision
    if (nameResult === 'Provisión de servicio') {
      nameResult = 'Solicitud de conexión'
    }
    return nameResult
  }

  return (
    <Grid className={classes.table}>
      {
        listItems.length === 0 ?
          <Grid>
            {t('delegates.delegatesList.noResults')}
          </Grid>
          :
          <>
            {
              listItems.length > 20 && totalPages > 1 ?
                <Grid container className={classes.totalItems}>
                  {listItems.slice((currentPage * itemsPerPage), ((currentPage * itemsPerPage) + itemsPerPage)).length + t('provisions.provisionsList.solicitudesDe') + listItems.length}
                  {
                    isSubLoading &&
                    <img className={classes.loadingAnimation} src={LoadingAnimation} alt='' />
                  }
                </Grid>
                :
                <Grid container className={classes.totalItems}>
                  {listItems.length + (listItems.length > 1 ? t(' solicitudes') : t(' solicitud'))}
                  {
                    isSubLoading &&
                    <img className={classes.loadingAnimation} src={LoadingAnimation} alt='' />
                  }
                </Grid>
            }
            <Grid container spacing={2}>
              {
                listItems.slice(
                  (currentPage * itemsPerPage),
                  ((currentPage * itemsPerPage) + itemsPerPage)
                ).map(
                  (provision, index) => (
                    <Grid
                      item
                      key={index}
                      lg={4}
                      md={6}
                      sm={6}
                      xs={12}
                    >
                      <Grid className={`${classes.item} ${isPrevious2017(provision.registerDate) && 'disabled'}`}>
                        {
                          provision.actionDoc === '1' &&
                          <Grid container className={classes.actionBox}>
                            <Grid item>
                              <img className={classes.alertIcon} src={AlertIcon} alt='' />
                            </Grid>

                            <Grid item className={classes.alertLabel}>{t('provisions.provisionsList.pendingAction')}</Grid>
                          </Grid>
                        }

                        <Grid className={classes.nameRow}>
                          <Typography className={classes.title}>{t('provisions.provisionsList.name')}</Typography>

                          <Typography className={`${classes.value} bold`}>{handleCheckProvisionName(provision.name)}</Typography>
                        </Grid>

                        <Grid className={classes.row}>
                          <Typography className={classes.title}>{t('provisions.provisionsList.provisionType')}</Typography>

                          <Typography className={classes.value}>{getDossierSubtype(provision.idDossierType, provision.idDossierSubtype)}</Typography>
                        </Grid>

                        <Grid className={classes.row}>
                          <Typography className={classes.title}>{t('provisions.provisionsList.number')}</Typography>

                          <Typography className={classes.value}>{provision.dossierCod}</Typography>
                        </Grid>

                        <Grid className={classes.row}>
                          <Typography className={classes.title}>{t('provisions.provisionsList.address')}</Typography>

                          <Typography className={classes.value}>{provision.addressDescription}</Typography>
                        </Grid>

                        <Grid className={classes.row}>
                          <Typography className={classes.title}>{t('provisions.provisionsList.createDate')}</Typography>

                          <Typography className={classes.value}>{formatDateAndTime(provision.registerDate)}</Typography>
                        </Grid>

                        <Grid className={classes.row}>
                          <Typography className={classes.title}>{t('provisions.provisionsList.status')}</Typography>

                          <Typography className={classes.value}>{dossierStatus.find(i => i.key === provision.dossierStatusId) ? dossierStatus.find(i => i.key === provision.dossierStatusId).value : ''}</Typography>
                        </Grid>

                        <Grid className={classes.button}>
                          {
                            isPrevious2017(provision.registerDate) ?
                              <div className={`${classes.editButton} disabled`}>
                                <p>{t('delegations.enter')}</p>
                              </div>
                              :
                              <div
                                className={classes.editButton}
                                onClick={() => handleClick(provision)}
                              >
                                <p>{t('delegations.enter')}</p>
                              </div>
                          }
                        </Grid>
                      </Grid>
                    </Grid>
                  )
                )
              }
            </Grid>
          </>
      }
      {
        listItems.length > 20 &&
        <Grid container className={classes.itemsPerPage}>
          <span style={{ marginRight: 5 }}>{t('common.pagination.show')}</span>
          <select id='number' name='number' onChange={onChangeSelector} className={classes.select}>
            <option value='20' selected>20</option>
            <option value='50'>50</option>
            <option value='100'>100</option>
          </select>
          <span style={{ marginLeft: 5 }}>{t('common.pagination.forPage')}</span>
        </Grid>
      }
      {
        totalPagesFilter > 1 &&
          <Grid container className={classes.paginationContainer}>
            <Pagination
              totalPages={totalPagesFilter}
              currentPage={currentPage}
              handleChangePage={setCurrentPage}
            />
          </Grid>
      }
    </Grid>
  )
}

export default withRouter(Mosaic)
