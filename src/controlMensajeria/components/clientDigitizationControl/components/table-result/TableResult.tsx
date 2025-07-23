import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Table, TableBody, TableHead, TableRow, TableSortLabel, Typography, useMediaQuery } from '@material-ui/core';


import MailIcon from '../../../../../assets/icons/Interfaz_126_correo_arroba.svg'
import MobileIcon from '../../../../../assets/icons/Icon_sms.svg'



import Grid from '@material-ui/core/Grid'
import useStyles, { StyledTableCell } from './TableResult.styles'
import DynamicSearcher from '../../../../../common/components/searcher/DynamicSearcher';
import Button from '../../../../../common/components/button/Button';
import Pagination from '../../../../../common/components/pagination/Pagination2';
import { formatDate, gettHourFromDate } from '../../../../../common/lib/FormatLib'
import XLSX from 'xlsx';



export const TableResult = (props: any) => {
  const {
    selectedCategory,
    selectedDetail,
    listItems,
    setListItems,
    listItems2,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    startDateSearched,
    endDateSearched,
    startItems,
    endItems,
    totalItems,
    totalPagesFilter,
    executingNewSearch,
    tabletRes,
    mobileRes,
    emailPercentage,
    smsPercentage,
    counters,
    categoryTitle,
    detailTitle
  } = props

  const { t } = useTranslation()
  const classes = useStyles({})

  const target = document.getElementById('number') as HTMLSelectElement


  const [isLoading, setIsLoading] = useState(false)



  const [showUserCodeArrow, setshowUserCodeArrow] = useState(false)
  const [showReceiverArrow, setshowReceiverArrow] = useState(false)
  const [showSendDateArrow, setshowSendDateArrow] = useState(false)
  const [showOpenUrlArrow, setshowOpenUrlArrow] = useState(false)
  const [showCategoryArrow, setshowCategoryArrow] = useState(false)
  const [showDetailArrow, setshowDetailArrow] = useState(false)
  const [showChannelArrow, setshowChannelArrow] = useState(false)


  const [orderByUserCodeAsc, setOrderByUserCodeAsc] = useState(false)
  const [orderByReceiverAsc, setOrderByReceiverAsc] = useState(false)
  const [orderByDateAsc, setOrderByDateAsc] = useState(false)
  const [orderByOpenUrlAsc, setOrderByOpenUrlAsc] = useState(false)
  const [orderByCategoryAsc, setOrderCategoryAsc] = useState(false)
  const [orderByDetailAsc, setOrderByDetailAsc] = useState(false)
  const [orderByChannelAsc, setOrderByChannelAsc] = useState(false)

  const [directionNumber, setDirectionNumber] = useState('desc')


  const resetFilters = () => {
    setshowUserCodeArrow(false)
    setshowReceiverArrow(false)
    setshowSendDateArrow(false)
    setshowOpenUrlArrow(false)
    setshowCategoryArrow(false)
    setshowDetailArrow(false)
    setshowChannelArrow(false)

    setOrderByUserCodeAsc(false)
    setOrderByChannelAsc(false)
    setOrderByDateAsc(false)
    setOrderByDetailAsc(false)
    setOrderByOpenUrlAsc(false)
    setOrderByReceiverAsc(false)
    setOrderCategoryAsc(false)
  }

  const orderByDate = () => {
    
    setshowUserCodeArrow(false)
    setshowReceiverArrow(false)
    setshowSendDateArrow(true)
    setshowOpenUrlArrow(false)
    setshowCategoryArrow(false)
    setshowDetailArrow(false)
    setshowChannelArrow(false)

    setDirectionNumber('desc')
    setCurrentPage(0)

    if (orderByDateAsc) {
      setListItems([].concat(listItems).sort().reverse())
      setOrderByDateAsc(false)
      setDirectionNumber('asc')
    } else {
      const auxList = listItems.sort(function (a, b) {
        let aa = a.postDate.split('/') // Formato con el que llega la fecha: dd/mm/yyyy hh:mm:ss
        let aaa = aa[2].substring(0, 4) + '-' + aa[1] + '-' + aa[0] + ' ' + aa[2].substring(5, 13)

        let bb = b.postDate.split('/')
        let bbb = bb[2].substring(0, 4) + '-' + bb[1] + '-' + bb[0] + ' ' + bb[2].substring(5, 13)

        return aaa.localeCompare(bbb)
      })
      setListItems(auxList)
      setOrderByDateAsc(true)
      setDirectionNumber('desc')
    }
  }

  const orderByUserCode = () => {

    setshowUserCodeArrow(true)
    setshowReceiverArrow(false)
    setshowSendDateArrow(false)
    setshowOpenUrlArrow(false)
    setshowCategoryArrow(false)
    setshowDetailArrow(false)
    setshowChannelArrow(false)
    
    setDirectionNumber('desc')
    setCurrentPage(0)
		if (orderByUserCodeAsc) {
			setListItems([].concat(listItems).sort().reverse())
      setOrderByUserCodeAsc(false)
			setDirectionNumber('asc')
		} else {
			setListItems([].concat(listItems).sort((a, b) => a.adminId.localeCompare(b.adminId)))
			setOrderByUserCodeAsc(true)
			setDirectionNumber('desc')
		}
  }

  const orderByReceiver = () => {

    setshowUserCodeArrow(false)
    setshowReceiverArrow(true)
    setshowSendDateArrow(false)
    setshowOpenUrlArrow(false)
    setshowCategoryArrow(false)
    setshowDetailArrow(false)
    setshowChannelArrow(false)
    
    setDirectionNumber('desc')
    setCurrentPage(0)
		if (orderByReceiverAsc) {
			setListItems([].concat(listItems).sort().reverse())
      setOrderByReceiverAsc(false)
			setDirectionNumber('asc')
		} else {
			setListItems([].concat(listItems).sort((a, b) => a.userId.localeCompare(b.userId)))
      setOrderByReceiverAsc(true)
			setDirectionNumber('desc')
		}
  }

  const orderByOpenUrl = () => {

    setshowUserCodeArrow(false)
    setshowReceiverArrow(false)
    setshowSendDateArrow(false)
    setshowOpenUrlArrow(true)
    setshowCategoryArrow(false)
    setshowDetailArrow(false)
    setshowChannelArrow(false)

    setDirectionNumber('desc')
    setCurrentPage(0)
		if (orderByOpenUrlAsc) {
			setListItems([].concat(listItems).sort().reverse())
      setOrderByOpenUrlAsc(false)
			setDirectionNumber('asc')
		} else {
			setListItems([].concat(listItems).sort((a, b) => a.openUrl.localeCompare(b.openUrl)))
      setOrderByOpenUrlAsc(true)
			setDirectionNumber('desc')
		}
  }

  const orderByCategory = () => {

    setshowUserCodeArrow(false)
    setshowReceiverArrow(false)
    setshowSendDateArrow(false)
    setshowOpenUrlArrow(false)
    setshowCategoryArrow(true)
    setshowDetailArrow(false)
    setshowChannelArrow(false)

    setDirectionNumber('desc')
    setCurrentPage(0)

    
		if (orderByCategoryAsc) {
			setListItems([].concat(listItems).sort().reverse())
      setOrderCategoryAsc(false)
			setDirectionNumber('asc')
		} else {
			setListItems([].concat(listItems).sort((a, b) => a.literalCategory.localeCompare(b.literalCategory)))
      setOrderCategoryAsc(true)
			setDirectionNumber('desc')
		}
  }

  const orderByDetail = () => {

    setshowUserCodeArrow(false)
    setshowReceiverArrow(false)
    setshowSendDateArrow(false)
    setshowOpenUrlArrow(false)
    setshowCategoryArrow(false)
    setshowDetailArrow(true)
    setshowChannelArrow(false)

    setDirectionNumber('desc')
    setCurrentPage(0)
		if (orderByDetailAsc) {
			setListItems([].concat(listItems).sort().reverse())
      setOrderByDetailAsc(false)
			setDirectionNumber('asc')
		} else {
			setListItems([].concat(listItems).sort((a, b) => a.literalDetail.localeCompare(b.literalDetail)))
      setOrderByDetailAsc(true)
			setDirectionNumber('desc')
		}

  }

  const orderByChannel = () => {

    setshowUserCodeArrow(false)
    setshowReceiverArrow(false)
    setshowSendDateArrow(false)
    setshowOpenUrlArrow(false)
    setshowCategoryArrow(false)
    setshowDetailArrow(false)
    setshowChannelArrow(true)

    setDirectionNumber('desc')
    setCurrentPage(0)
		if (orderByChannelAsc) {
			setListItems([].concat(listItems).sort().reverse())
      setOrderByChannelAsc(false)
			setDirectionNumber('asc')
		} else {
			setListItems([].concat(listItems).sort((a, b) => a.channel2.localeCompare(b.channel2)))
      setOrderByChannelAsc(true)
			setDirectionNumber('desc')
		}

  }

  useEffect(() => {
    if (listItems.length !== 0 &&  !listItems[0].literalCategory) {
      setListItems(listItems.map(item => {
        const literalCategory = t(`sendUrl.dialogSendUrl.dropDownCategories.${item.category}`);
        const literalDetail = t(`sendUrl.dialogSendUrl.dropDownDetails.${item.detail}`);
        
        const channel2 = (item.channel === '0') ? item.mail : item.sms

        const openUrl2 = (item.openUrl === '0') ? t('clientDigitizationControl.tableResult.no') : t('clientDigitizationControl.tableResult.yes')

        return { ...item, literalCategory, literalDetail,channel2, openUrl2 };
      }));

    }
        
  }, [listItems])
  
  useEffect(() => {
    // Restablecemos la ordenación por columnas cuando se lanza una nueva búsqueda o filtro
    resetFilters()
  }, [executingNewSearch, listItems.length])


  const handleExport = () => {
    let listData = [] as any
    if (listItems.length > 0) {
        listItems.map((item, index) => (
            listData.push({
               adminId: item.adminId,
               userId: item.userId,
               postDate: item.postDate,
               openUrl: (item.openUrl === '0') ? t('clientDigitizationControl.tableResult.no') : t('clientDigitizationControl.tableResult.yes'),
               category: item.literalCategory,
               detail:item.literalDetail,
               channel:(item.channel === '0') ? item.mail : item.sms
            })
        ))
    }
    //funcion para descar un excel con la información de los suplipoints en un excel
    const wb = XLSX.utils.book_new()
    let ws

    const fechaExportAux = formatDate(new Date())
    const horaExportAux = gettHourFromDate(new Date())

    const data = [
      [t('clientDigitizationControl.title'), ''],
      ['',''],
      [t('clientDigitizationControl.tableResult.exportDate'),fechaExportAux],
      [t('clientDigitizationControl.tableResult.exportHour'),horaExportAux],
      ['',''],
      [t('clientDigitizationControl.tableResult.searchResume.category'),selectedCategory],
      [t('clientDigitizationControl.tableResult.searchResume.detail'),selectedDetail],
      [t('clientDigitizationControl.tableResult.fromDate'),startDateSearched],
      [t('clientDigitizationControl.tableResult.toDate'),endDateSearched],
      ['',''],
      [t('clientDigitizationControl.search.searchParameters.resumeGraph.totalUrl')+':', `${counters.totalCounter}`],
      [t('clientDigitizationControl.search.searchParameters.resumeGraph.sentEmail') + ':', `${counters.sentEmailsCounter}`],
      [t('clientDigitizationControl.search.searchParameters.resumeGraph.sentSms') + ':', `${counters.sentSMSCounter}`],
      [t('clientDigitizationControl.search.searchParameters.resumeGraph.openedUrls') + ':', `${counters.openedURLsCounter}`],
      ['% ' + t('clientDigitizationControl.search.resumeParameters.emailPercentage'), emailPercentage],
      ['% ' + t('clientDigitizationControl.search.resumeParameters.SMSPercentage'), smsPercentage]
    ]

    const worksheet = XLSX.utils.aoa_to_sheet(data);

    worksheet['!cols'] = [{ width: 20 }, { width: 10 }];
  
    //posa un JSON object a una pagina
    ws = XLSX.utils.json_to_sheet(listData, {})
  
    ws['A1'].v = t('clientDigitizationControl.tableResult.tableInfo.userCode') 
    ws['B1'].v = t('clientDigitizationControl.tableResult.tableInfo.receiver')
    ws['C1'].v = t('clientDigitizationControl.tableResult.tableInfo.sendDate')
    ws['D1'].v = t('clientDigitizationControl.tableResult.tableInfo.openUrl') 
    ws['E1'].v = t('clientDigitizationControl.tableResult.tableInfo.category')
    ws['F1'].v = t('clientDigitizationControl.tableResult.tableInfo.detail')
    ws['G1'].v = t('clientDigitizationControl.tableResult.tableInfo.channel')

    let fileName = t('clientDigitizationControl.tableResult.archiveName')+'.xlsx'
    XLSX.utils.book_append_sheet(wb, worksheet, t('clientDigitizationControl.tableResult.resume'));
    XLSX.utils.book_append_sheet(wb, ws, t('clientDigitizationControl.tableResult.tabName'))
    //crea el llibre 
    XLSX.writeFile(wb, fileName)
}

const onChangeSelector = () => {
  setCurrentPage(0)
  if (target && target.options) {
    setItemsPerPage(Number(target.options[target.selectedIndex].value))
  }
}
  


  return (
    <Grid container className={classes.generalCont}>
      <Grid container className={classes.title}>
        {t('clientDigitizationControl.tableResult.title')}
      </Grid>

      <Grid container className={classes.subTitle}>
        {categoryTitle &&
          <>
            <span>
              {t('clientDigitizationControl.tableResult.searchResume.category')+': '}
              <strong>{categoryTitle}</strong>
              &nbsp;
            </span>

            {detailTitle === '' ?
              <span>
                {t('clientDigitizationControl.tableResult.searchResume.detail')+': '}
                <strong>
                {t('clientDigitizationControl.tableResult.searchResume.all')}
                {t('clientDigitizationControl.tableResult.searchResume.espacio')}
                </strong>
              </span>

              :
              <span>
                {t('clientDigitizationControl.tableResult.searchResume.detail')+': '}
                <strong>
                  {detailTitle}
                  {t('clientDigitizationControl.tableResult.searchResume.espacio')+': '}
                </strong>
              </span>
            }
          </>
        }

        <span>
          &nbsp;
          {t('common.conjunctions.desde') + startDateSearched + t('common.conjunctions.hasta') + endDateSearched}
        </span>
      </Grid >

      <Grid container className={classes.titleCont}>
        <Grid item className={classes.buttonContainerSearch}>
          <DynamicSearcher
            label={t('clientDigitizationControl.tableResult.searcher')}
            finalList={listItems}
            setFinalList={setListItems}
            listItems={listItems2}
            subtype={'controlDigitalizacion'}
            setCurrentPage={setCurrentPage}
          />
        </Grid>

        <Grid item className={classes.buttonContainer}>
          <Button
            text={t('clientDigitizationControl.tableResult.export')}
            color={'primary'}
            size={'large'}
            variant={'contained'}
            onClick={handleExport}
          />
        </Grid>
      </Grid>

      <Grid item className={classes.itemText}>
        {listItems.length !== 0 &&
          <span>
            {t('common.conjunctions.del')}
            {startItems}
            {t('common.conjunctions.to')}
            {endItems}
            {t('common.conjunctions.de')}
            {totalItems}
          </span>
        }
      </Grid>

      {(mobileRes || tabletRes) ?
        // MOSAICO (VISTA MOBIL)
        <Grid className={classes.table}>
          {
            listItems.length === 0 ?
              <div>No hay elementos disponibles</div>
            :
              <Grid container spacing={2}>
                {
                  listItems.slice(
                    (currentPage * itemsPerPage),
                    ((currentPage * itemsPerPage) + itemsPerPage)
                  ).map(
                    (item, index) => (
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
                            <Typography className={classes.mosaicTitle}>{t('clientDigitizationControl.tableResult.tableInfo.userCode')}</Typography>
                            <Typography className={`${classes.value} bold`}>{item.adminId}</Typography>
                          </Grid>

                          <Grid className={classes.row}>
                            <Typography className={classes.mosaicTitle}>{t('clientDigitizationControl.tableResult.tableInfo.receiver')}</Typography>
                            <Typography className={classes.value}>{item.userId}</Typography>
                          </Grid>

                          <Grid className={classes.row}>
                            <Typography className={classes.mosaicTitle}>{t('clientDigitizationControl.tableResult.tableInfo.sendDate')}</Typography>
                            <Typography className={classes.value}>{item.postDate}</Typography>
                          </Grid>

                          <Grid className={classes.row}>
                            <Typography className={classes.mosaicTitle}>{t('clientDigitizationControl.tableResult.tableInfo.openUrl')}</Typography>
                            <Typography className={classes.value}>{(item.openUrl === '0') ? t('clientDigitizationControl.tableResult.no') : t('clientDigitizationControl.tableResult.yes')}</Typography>
                          </Grid>

                          <Grid className={classes.row}>
                            <Typography className={classes.mosaicTitle}>{t('clientDigitizationControl.tableResult.tableInfo.category')}</Typography>
                            <Typography className={classes.value}>{item.literalCategory}</Typography>
                          </Grid>

                          <Grid className={classes.row}>
                            <Typography className={classes.mosaicTitle}>{t('clientDigitizationControl.tableResult.tableInfo.detail')}</Typography>
                            <Typography className={classes.value}>{item.literalDetail}</Typography>
                          </Grid>

                          <Grid className={classes.row}>
                            <Typography className={classes.mosaicTitle}>{t('clientDigitizationControl.tableResult.tableInfo.channel')}</Typography>
                              <Grid className={classes.inline}>
                                {
                                    (item.channel === '0') ?
                                      <img className={classes.iconResponsive} src={MailIcon} alt='' />
                                    :
                                      <img className={classes.iconResponsive} src={MobileIcon} alt='' />
                                }
                                <Typography className={classes.value}>
                                {
                                  item.channel2
                                }
                                </Typography>
                              </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    )
                  )
                }
              </Grid>
          }
        </Grid>
      :
        // TABLA (VISTA DESKTOP)
        <Table className={classes.messagesTable}>
          <TableHead>
            <TableRow className={classes.tableRow}>
              <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                <span>{t('clientDigitizationControl.tableResult.tableInfo.userCode')}</span>
                <TableSortLabel
                  active={showUserCodeArrow}
                  direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                  onClick={() => {orderByUserCode()}}
                />
              </StyledTableCell>

              <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                  <span>{t('clientDigitizationControl.tableResult.tableInfo.receiver')}</span>
                <TableSortLabel
                  active={showReceiverArrow}
                  direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                  onClick={() => {orderByReceiver()}}
                />
              </StyledTableCell>

              <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                  <span>{t('clientDigitizationControl.tableResult.tableInfo.sendDate')}</span>
                <TableSortLabel
                  active={showSendDateArrow}
                  direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                  onClick={() => {orderByDate()}}
                />
              </StyledTableCell>

              <StyledTableCell className={`${classes.headTableCell} extra`} rowSpan={1}>
                {t('clientDigitizationControl.tableResult.tableInfo.openUrl')}
                <TableSortLabel
                  active={showOpenUrlArrow}
                  direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                  onClick={() => {orderByOpenUrl()}}
                />
              </StyledTableCell>

              <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                {t('clientDigitizationControl.tableResult.tableInfo.category')}
                <TableSortLabel
                  active={showCategoryArrow}
                  direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                  onClick={() => {orderByCategory()}}
                />
              </StyledTableCell>

              <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                {t('clientDigitizationControl.tableResult.tableInfo.detail')}
                <TableSortLabel
                  active={showDetailArrow}
                  direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                  onClick={() => {orderByDetail()}}
                />
              </StyledTableCell>

              <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                {t('clientDigitizationControl.tableResult.tableInfo.channel')}
                <TableSortLabel
                  active={showChannelArrow}
                  direction={directionNumber === 'asc' ? 'asc' : 'desc'}
                  onClick={() => {orderByChannel()}}
                />
              </StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {
              listItems.length === 0 ?
                <TableRow className={classes.tableBodyRow} >
                  <StyledTableCell className={classes.noResults} colSpan={12}>
                    {t('clientDigitizationControl.tableResult.noResults')}
                  </StyledTableCell>
                </TableRow>
                :
                listItems.slice(
                  (currentPage * itemsPerPage),
                  ((currentPage * itemsPerPage) + itemsPerPage)
                ).map(
                  (item, index) => (
                    <>
                      <TableRow key={index} className={classes.tableBodyRow}>

                        <StyledTableCell>{item.adminId}</StyledTableCell>
                        <StyledTableCell>
                          {item.userId}
                        </StyledTableCell>
                        <StyledTableCell>
                          {item.postDate}
                        </StyledTableCell>
                        <StyledTableCell>{item.openUrl2}</StyledTableCell>
                        <StyledTableCell>{item.literalCategory}</StyledTableCell>
                        <StyledTableCell>{item.literalDetail}</StyledTableCell>
                        <StyledTableCell>
                          <div className={classes.alignItems}>
                            {
                              
                              (item.channel === '0') ?
                                <img className={classes.icon} src={MailIcon} alt='' />
                              :
                                <img className={classes.icon} src={MobileIcon} alt='' />
                            }
                            <span>{item.channel2}</span>
                          </div>
                        </StyledTableCell>

                      </TableRow>
                    </>
                  )
                )
            }
          </TableBody>
        </Table>
      }

      <Grid container className={classes.itemsPerPage}>
        <span style={{ marginRight: 5 }}>{t('common.pagination.show')}</span>
        <select id='number' name='number' onChange={onChangeSelector} className={classes.select}>
          <option value='20' selected>20</option>
          {listItems.length > 20 && 
            <option value='50'>50</option>
          }
          {listItems.length > 50 && 
            <option value='100'>100</option>
          }          
        </select>
        <span style={{ marginLeft: 5 }}>{t('common.pagination.forPage')}</span>
      </Grid>

      {
        (listItems.length > itemsPerPage) &&
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