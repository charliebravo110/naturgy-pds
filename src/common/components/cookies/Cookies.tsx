import React, { useEffect } from 'react'

import useStyles, { StyledTableCell } from './Cookies.styles'
import { Grid } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableBody from '@material-ui/core/TableBody'

// LCS: Importa la función - Wave 3
import { removeEmails, sendGAEvent } from '../../../core/utils/gtm';

const Cookies = (props: any) => {
  const classes = useStyles({})
  const { t } = useTranslation()

  useEffect(() => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
      event: 'view',
      content_group: 'landing',
      page_url: removeEmails(window.location.href),
      user_id: sessionStorage.getItem('id'),
      previous_path: removeEmails(sessionStorage.getItem("previousPage")),
      user_type: sessionStorage.getItem('user_type'),
      browsing_type: sessionStorage.getItem('browsing_type'),
      element_type: 'medicion de pagina',
      ga_client_id: sessionStorage.getItem('ga_client_id'),
      cups: 'no aplica',
      supply_type: 'no aplica'
    });
    sessionStorage.setItem("previousPage", window.location.href);
  },[])
  
  return (
    <Grid container className={classes.container}>
      <div>
      <p className={classes.title}>{t('cookies.title')}</p>
      <p className={classes.title1}>{t('cookies.title1')}</p>
      <p className={classes.text}>
        {t('cookies.text')}
        <b>{t('cookies.textref')}</b>
        {t('cookies.text1')}
        <b>{t('cookies.textref1')}</b>
        {t('cookies.text34')}
      </p>
      <p className={classes.text}>{t('cookies.text2')}</p>
      <p className={classes.title1}>{t('cookies.title2')}</p>
      <p className={classes.text}>
        {t('cookies.text3')}
        {t('cookies.text4')}
      </p>
      <p className={classes.text}>{t('cookies.text5')}</p>
      <p className={classes.title1}>{t('cookies.title3')}</p>
      <p className={classes.text}>{t('cookies.text6')}</p>
      <p className={classes.text}>{t('cookies.text7')}</p>
      <p className={classes.title2}>{t('cookies.title4')}</p>
      <Table className={classes.suppliesTable}>
        <TableHead>
          <TableRow className={classes.tableRow}>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table.category')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell1}>{t('cookies.table.cookie')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell2}>{t('cookies.table.description')}</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow className={classes.tableRow}>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table.firstcategory')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table.firstcookie')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table.firstdescription')}</StyledTableCell>
          </TableRow>
          <TableRow className={classes.tableRow}>
          <StyledTableCell className={classes.headTableCell}>{t('cookies.table.firstcategory')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table.secondcookie')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table.seconddescription')}</StyledTableCell>
          </TableRow>
          <TableRow className={classes.tableRow}>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table.secondcategory')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table.thirdcookie')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>
              {t('cookies.table.thirddescription')}
              <p>{t('cookies.table.quarterdescription')}</p>
            </StyledTableCell>
          </TableRow>
          <TableRow className={classes.tableRow}>
          <StyledTableCell className={classes.headTableCell}>{t('cookies.table.secondcategory')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table.quertercookie')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table.fifthdescription')}</StyledTableCell>
          </TableRow>
          <TableRow className={classes.tableRow}>
          <StyledTableCell className={classes.headTableCell}>{t('cookies.table.secondcategory')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table.fifthcookie')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table.sixthdescription')}</StyledTableCell>
          </TableRow>
          <TableRow className={classes.tableRow}>
          <StyledTableCell className={classes.headTableCell}>{t('cookies.table.secondcategory')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table.sixthcookie')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table.seventhdescription')}</StyledTableCell>
          </TableRow>
          <TableRow className={classes.tableRow}>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table.thirdcategory')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table.seventhcookie')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table.eightdescription')}</StyledTableCell>
          </TableRow>
          <TableRow className={classes.tableRow}>
          <StyledTableCell className={classes.headTableCell}>{t('cookies.table.thirdcategory')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table.eighthcookie')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table.ninthdescription')}</StyledTableCell>
          </TableRow>
        </TableBody>
      </Table>  
      
      <p className={classes.title2}>{t('cookies.title5')}</p>
      <p className={classes.text}>{t('cookies.text8')}</p>
      <p className={classes.text}>{t('cookies.text9')}</p>
      <Table className={classes.suppliesTable}>
        <TableHead>
          <TableRow className={classes.tableRow}>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table2.cookie')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table2.type')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell2}>{t('cookies.table2.purpose')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table2.headline')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell1}>{t('cookies.table2.duration')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table2.observations')}</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow className={classes.tableRow}>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table2.firstcookie')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table2.firsttype')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table2.firstpurpose')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table2.firstheadline')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table2.quarterduration')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell} rowSpan={2}>{t('cookies.table2.observationsnull')}</StyledTableCell>
          </TableRow>
          <TableRow className={classes.tableRow}>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table2.secondcookie')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table2.firsttype')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table2.secondpurpose')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table2.firstheadline')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table2.quarterduration')}</StyledTableCell>
          </TableRow>
          <TableRow className={classes.tableRow}>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table2.thirdcookie')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table2.secondtype')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table2.thirdpurpose')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table2.secondheadline')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table2.secondduration')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell} rowSpan={3}>
              {t('cookies.table2.firstobservations')}
              <p><a href='https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage?hl=es'>{t('cookies.table2.googleanalytics')}</a></p>
              {t('cookies.table2.secondobservations')}
              <p><a href='https://support.google.com/analytics/answer/6004245?hl=es'>{t('cookies.table2.transferanalytics')}</a></p>
            </StyledTableCell>
          </TableRow>
          <TableRow className={classes.tableRow}>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table2.quartercookie')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table2.secondtype')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table2.quarterpurpose')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table2.secondheadline')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table2.secondduration')}</StyledTableCell>
          </TableRow>
          <TableRow className={classes.tableRow}>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table2.fifthcookie')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table2.secondtype')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table2.fifthpurpose')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table2.secondheadline')}</StyledTableCell>
            <StyledTableCell className={classes.headTableCell}>{t('cookies.table2.thirdduration')}</StyledTableCell>
          </TableRow>
        </TableBody>
      </Table>  
      <p className={classes.title1}>{t('cookies.title6')}</p>
      <p className={classes.text}>
        {t('cookies.text10')}
        <button id='ot-sdk-btn' className='ot-sdk-show-settings'>{t('cookies.text11')}</button>
      </p>
      <p className={classes.text}>
        {t('cookies.text12')}
      </p>
      <p className={classes.text}>{t('cookies.text14')}</p>
      <p className={classes.text}>{t('cookies.text15')}</p>
      <p className={classes.title2}>{t('cookies.text16')}</p>
      <p className={classes.text}>
        <a href='https://support.microsoft.com/es-es/help/17442/windows-internet-explorer-delete-manage-cookies'>
          {t('cookies.text17')}
        </a>
      </p>
      <p className={classes.title2}>{t('cookies.text18')}</p>
      <p className={classes.text}>
        <a href='https://support.microsoft.com/es-es/help/4027947/microsoft-edge-delete-cookies'>
          {t('cookies.text19')}
        </a>
      </p>
      <p className={classes.title2}>{t('cookies.text20')}</p>
      <p className={classes.text}>
        <a href='https://support.google.com/chrome/answer/95647?hl=es'>
          {t('cookies.text21')}
        </a>
      </p>
      <p className={classes.title2}>{t('cookies.text22')}</p>
      <p className={classes.text}>
        <a href='https://support.mozilla.org/es/products/firefox/protect-your-privacy/cookies'>
          {t('cookies.text23')}
        </a>
      </p>
      <p className={classes.title2}>{t('cookies.text24')}</p>
      <p className={classes.text}>
        <a href='https://support.apple.com/es-es/guide/safari/sfri11471/mac'>
          {t('cookies.text25')}
        </a>
      </p>
      <p className={classes.title2}>{t('cookies.text26')}</p>
      <p className={classes.text}>
        <a href='http://help.opera.com/Windows/11.50/es-ES/cookies.html'>
          {t('cookies.text27')}
        </a>
      </p>
      <p className={classes.title1}>{t('cookies.title7')}</p>
      <p className={classes.text}>{t('cookies.text28')}</p>
      <p className={classes.text}>{t('cookies.text29')}</p>
      <p className={classes.title1}>{t('cookies.title8')}</p>
      <p className={classes.text}>
        {t('cookies.text30')}
        <a href='https://www.ufd.es/nota-legal/'>{t('cookies.text31')}</a>
        {t('cookies.text32')}
      </p>
      <p className={classes.title1}>{t('cookies.title9')}</p>
      <p className={classes.text}>{t('cookies.text33')}</p>

      </div>
    </Grid>
  )
}
export default Cookies