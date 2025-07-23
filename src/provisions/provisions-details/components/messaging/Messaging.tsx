import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'

import Searcher from '../../../../common/components/searcher/Searcher'
import Pagination from '../../../../common/components/pagination/Pagination'

import ListItem from './list-item/ListItem'
import MosaicItem from './mosaic-item/MosaicItem'

import NoItemsIcon from '../../../../assets/icons/aviso_alerta_pop_up.svg'

import { thunkGetMasterData } from '../../../store/actions/ProvisionsThunkActions'

import useStyles, { StyledTableCell } from './Messaging.styles'
import { TableSortLabel } from '@material-ui/core'
import { convertToFullDate } from '../../../../common/lib/FormatLib'
import DynamicSearcher from '../../../../common/components/searcher/DynamicSearcher'

const Messaging = (props: any) => {
  const classes = useStyles({})
  const theme = useTheme()
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const mobile = useMediaQuery(theme.breakpoints.down('sm'))

  const user = useSelector((state: any) => state.user.profile)
  const provisions = useSelector((state: any) => state.provisions)

  const { setLoading } = props

  const [ currentPage, setCurrentPage ] = useState(1)
  const [ subjectTypes, setSubjectTypes ] = useState([] as any)

  const [ list, setList ] = useState((provisions.currentProvision.communicationList && provisions.currentProvision.communicationList.length > 0) ? provisions.currentProvision.communicationList : [] as any)
  const [ listToShow, setListToShow ] = useState((provisions.currentProvision.communicationList && provisions.currentProvision.communicationList.length > 0) ? provisions.currentProvision.communicationList : [] as any)

  const [showSubjectArrow, setShowSubjectArrow] = useState(false)
  const [directionCode, setDirectionCode] = useState('desc')
  const [orderBySubjectAsc, setOrderBySubjectAsc] = useState(false)
  const [orderByDateAsc, setOrderByDateAsc] = useState(false)
  const [showDateArrow, setShowDateArrow] = useState(false)

  const [subjectAdded, setSubjectAdded] = useState(false)

  const rowsPerPage = 6
  const totalPages = listToShow ? (listToShow.length === 0 ? 1 : Math.ceil(listToShow.length / rowsPerPage)) : 0

  const handleChangePage = (page) => {
    setCurrentPage(page)
  }

  const handleChangeSearch = (e) => {
    
    if (e) {
      const value = e.toLowerCase()
      handleSearch(value)
    }
  }

  const handleSearch = (value) => {
    const allCommunications = list
    if (value && value !== null ) {
      const matches = allCommunications.filter(item => {
        const subject = item.subject
  
        return subject.toLowerCase().includes(value.toLowerCase()) && item
      });
  
      setListToShow(matches)
    } else {
      setListToShow(list)
    }

    if (value.length == 0) {
      setListToShow(list)
    }
  };
  
  const resetFilters = () => {

    setShowSubjectArrow(false)
    setOrderBySubjectAsc(false)
    setOrderByDateAsc(false)
    setShowDateArrow(false)
  
  }

  const orderBySubject = () => {
    resetFilters()
    setShowSubjectArrow(true)
    setShowDateArrow(false)
    if (orderBySubjectAsc) {
      setListToShow([].concat(listToShow).sort().reverse())
      setOrderBySubjectAsc(false)
      setDirectionCode('asc')
    } else {
      setListToShow([].concat(listToShow).sort((a, b) => a.subject.localeCompare(b.subject)))
      setOrderBySubjectAsc(true)
      setDirectionCode('desc')
    }
  }

  const orderByDate = () => {
    resetFilters()
    setShowDateArrow(true)
    setShowSubjectArrow(false)
    if (orderByDateAsc) {
      setListToShow(
        listToShow.sort(function (a, b) {
          return new Date(convertToFullDate(b.sendDate)).getTime() - new Date(convertToFullDate(a.sendDate)).getTime();
        })
      );
      setOrderByDateAsc(false);
      setDirectionCode('asc');
    } else {
      setListToShow(
        listToShow.sort(function (a, b) {
          return new Date(convertToFullDate(a.sendDate)).getTime() - new Date(convertToFullDate(b.sendDate)).getTime();
        })
      );
      setOrderByDateAsc(true);
      setDirectionCode('desc');
    }
  }

  useEffect(() => {
    if (subjectTypes.length === 0) {
      setLoading(true)

      dispatch(thunkGetMasterData('COMMUNICATIONS_TYPE', (sessionStorage.getItem('lang') || 'ES').toUpperCase(), 'COMTYP', (response) => {
        if (response) {
          setSubjectTypes(response)
        }

        setLoading(false)
      }))
    }
  // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (provisions.currentProvision && 
        provisions.currentProvision.communicationList && 
        provisions.currentProvision.communicationList.length > 0) {
        
        let sortedDocumentList = provisions.currentProvision.communicationList.sort(function (a,b){
        
        if (a.sendDate > b.sendDate) {
          return -1
        }
        if (a.sendDate < b.sendDate) {
          return 1
        }
        return 0
      })
      
      setListToShow(sortedDocumentList)
    } else {
      setListToShow(provisions.currentProvision.communicationList)
    }
  // eslint-disable-next-line
  }, [ provisions.currentProvision ])

  useEffect(() => {
   
    if (!subjectAdded && subjectTypes.length !== 0 ) {
      
      const updatedListToShow = listToShow ? listToShow.map(item => {
        const subject = subjectTypes.find(i => i.key === item.idCommunicationType) ? subjectTypes.find(i => i.key === item.idCommunicationType).value : '';
        return { ...item, subject };
      }) : [];
  
      setListToShow(updatedListToShow);
  
      const updatedList = list.map(item => {
        const subject = subjectTypes.find(i => i.key === item.idCommunicationType) ? subjectTypes.find(i => i.key === item.idCommunicationType).value : '';
        return { ...item, subject };
      });

      setList(updatedList)

      setSubjectAdded(true)
      
    }
    
  }, [listToShow,list,subjectTypes])
 
  return (
    <Grid container justifyContent='center' alignItems='center'>
      <Grid item container xs={11} md={10} className={classes.container}>
        <Grid item className={classes.title}>
          {t('provisions.provisionsDetails.messaging.title')}
        </Grid>

        <Grid container className={classes.block} direction='column'>
          <Grid container justifyContent='space-between' alignItems='center' spacing={1}>
            <Grid item className={classes.subtitle}>
              {t('provisions.provisionsDetails.messaging.subtitle')} {user.name}
            </Grid>

            <Grid item className={mobile && classes.fullWidth}>
              {/* <Searcher
                label={t('common.buttons.search')}
                handleSearch={handleSearch}
                handleChangeSearch={handleChangeSearch}
                fromSupplies
              /> */}
            <DynamicSearcher
                label={t('common.buttons.search')}
                finallist={listToShow}
                setfinallist={setListToShow}
                listitems={list}
                subtype={'ProvisionMessaging'}
            />
            </Grid>
          </Grid>

          {
            (!listToShow || (listToShow && listToShow.length === 0)) ?
              <Grid container className={classes.noItems}>
                <Grid item>
                  <img src={NoItemsIcon} alt='' />

                  <Grid className={classes.text}>
                    {t('provisions.provisionsDetails.messaging.noItems')}
                  </Grid>
                </Grid>
              </Grid>
            :
              mobile ?
                <Grid container className={classes.mosaicContainer}>
                  {
                    listToShow && listToShow.slice(
                      (currentPage - 1) * rowsPerPage,
                      currentPage * rowsPerPage
                    ).map(item => (
                      <MosaicItem
                        key={item.sendDate}
                        read={item.indRead}
                        subject={subjectTypes.find(i => i.key === item.idCommunicationType) ? subjectTypes.find(i => i.key === item.idCommunicationType).value : ''}
                        date={item.sendDate}
                        attachment={item.documentumId}
                        setLoading={setLoading}
                      />
                    ))
                  }
                </Grid>
              :
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell />

                      <StyledTableCell>
                        {t('provisions.provisionsDetails.messaging.table.col1')}
                        <TableSortLabel
                            active={showSubjectArrow}
                            direction={directionCode === 'asc' ? 'asc' : 'desc'}
                            onClick={orderBySubject}
                        />
                      </StyledTableCell>

                      <StyledTableCell>
                        {t('provisions.provisionsDetails.messaging.table.col2')}
                        <TableSortLabel
                            active={showDateArrow}
                            direction={directionCode === 'asc' ? 'asc' : 'desc'}
                            onClick={orderByDate}
                        />
                      </StyledTableCell>

                      <StyledTableCell />

                      <StyledTableCell />
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {
                      listToShow && listToShow.slice(
                        (currentPage - 1) * rowsPerPage,
                        currentPage * rowsPerPage
                      ).map(item => (
                        <ListItem
                          key={item.sendDate}
                          read={item.indRead}
                          subject={subjectTypes.find(i => i.key === item.idCommunicationType) ? subjectTypes.find(i => i.key === item.idCommunicationType).value : ''}
                          date={item.sendDate}
                          attachment={item.documentumId}
                          setLoading={setLoading}
                        />
                      ))
                    }
                  </TableBody>
                </Table>
          }

          {
            totalPages > 1 &&
              <Grid container className={classes.paginationContainer}>
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  handleChangePage={handleChangePage}
                />
              </Grid>
          }
        </Grid>
      </Grid>
    </Grid>
  )
}
export default Messaging
