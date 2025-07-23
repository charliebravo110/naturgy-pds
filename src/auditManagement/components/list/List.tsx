import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import TableCell from '@material-ui/core/TableCell';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Button from '../../../common/components/button/Button';
import AddIcon from '../../../assets/icons/mas.svg';
import RemoveIcon from '../../../assets/icons/menos.svg';
import LockIcon from '../../../assets/icons/s_candadoabiertoazul.svg';
import WarnIcon from '../../../assets/icons/ico_aviso_rojo.svg';
import MailIcon from '../../../assets/icons/Icon_mail.svg';
import SmsIcon from '../../../assets/icons/Icon_sms.svg';
import Pagination from '../../../common/components/pagination/Pagination2';
import DynamicSearcher from '../../../common/components/searcher/DynamicSearcher';
import useStyles, { StyledTableCell, StyledSubTableCell } from './List.styles';

const initialOrderState = {
    'user': false,
    'session': false,
    'date': false,
    'tries': false,
    'validate': false,
    'order': 'desc'
};

const Row = (props: any) => {
    const { item, index } = props;
    const [open, setOpen] = React.useState(false);
    const classes = useStyles({});
    const { t } = useTranslation();

    const isMail = (email: string): boolean => {
        return /\S+@\S+\.\S+/.test(email);
    }

    const addZero = (nmb: number) => {
        return nmb < 10 ? `0${nmb}` : nmb;
    }

    const getFormatedDate = (loginDate: string) => {
        let d = new Date(0);
        d.setUTCSeconds(parseInt(loginDate));
        return `${addZero(d.getDate())}/${addZero(d.getMonth() + 1)}/${d.getFullYear()} - ${d.getHours()}:${addZero(d.getMinutes())}`
    }

    const getFormatedHour = (loginDate: string) => {
        let d = new Date(0);
        d.setUTCSeconds(parseInt(loginDate));
        return `${d.getHours()}:${addZero(d.getMinutes())}`
    }

    return (
        <>
            <TableRow key={`${index}-top`} className={classes.tableBodyRow}>
                <StyledTableCell className={open && classes.rowOpen}>{item.user_id}</StyledTableCell>
                <StyledTableCell className={open && classes.rowOpen}>{t(`audit.${item.authentication_status}`)}</StyledTableCell>
                <StyledTableCell className={open && classes.rowOpen}>{getFormatedDate(item.authentication_date)}</StyledTableCell>
                <StyledTableCell className={open && classes.rowOpen}>
                    <div className={classes.numberRow}>
                        {item.mfa_data.length > 0 ?
                            <>
                                {item.mfa_data.length}
                                <Grid container className={classes.iconAdd} onClick={() => setOpen(!open)}>
                                    <img className={classes.iconPlus} src={open ? RemoveIcon : AddIcon} alt='' />
                                    <span className={classes.detailText}>{t('audit.table.seeDetail')}</span>
                                </Grid>
                            </>
                            :
                            <>0
                                <Grid container className={classes.iconAddDisabled}>
                                    <img className={classes.iconPlus} src={AddIcon} alt='' />
                                    <span className={classes.detailText}>{t('audit.table.seeDetail')}</span>
                                </Grid>
                            </>
                        }


                    </div>
                </StyledTableCell>
                <StyledTableCell className={open && classes.rowOpen}>
                    {item.mfa_validated === 'S' ?
                        <>
                            <img className={classes.iconLock} src={LockIcon} alt='' /> {t('audit.S')}
                        </> :
                        <>
                            <img className={classes.iconLock} src={WarnIcon} alt='' /> {t('audit.N')}
                        </>
                    }
                </StyledTableCell>
            </TableRow>
            {item.mfa_data.length > 0 &&
                <TableRow key={`${index}-bottom`} className={classes.rowOpen}>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                        <Collapse in={open} timeout='auto' unmountOnExit>
                            <Box margin={1}>
                                <Table size='small' aria-label='purchases'>
                                    <TableHead>
                                        <TableRow>
                                            <StyledSubTableCell>{t('audit.table.subheader.channel')}</StyledSubTableCell>
                                            <StyledSubTableCell>{t('audit.table.subheader.hour')}</StyledSubTableCell>
                                            <StyledSubTableCell align='left'>{t('audit.table.subheader.trie')}</StyledSubTableCell>
                                            <StyledSubTableCell align='left'>{t('audit.table.subheader.detail')}</StyledSubTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {item.mfa_data.map((it) => (
                                            <TableRow key={it.index}>
                                                <StyledSubTableCell component='th' scope='row'>
                                                    <img className={classes.iconLock} src={isMail(it.mfa_destination) ? MailIcon : SmsIcon} alt='' />
                                                    {it.mfa_destination}
                                                </StyledSubTableCell>
                                                <StyledSubTableCell>{it.mfa_timestamp ? getFormatedHour(it.mfa_timestamp) : ''}</StyledSubTableCell>
                                                <StyledSubTableCell align='left'>{it.index}</StyledSubTableCell>
                                                <StyledSubTableCell align='left'>
                                                    {(it.status && it.status === 'S') ?
                                                        <img className={classes.iconLock} src={LockIcon} alt='' /> :
                                                        <img className={classes.iconLock} src={WarnIcon} alt='' />}
                                                    {it.mfa_event}
                                                </StyledSubTableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            }
        </>
    );
}

const List = (props: any) => {
    const {
        items,
        setItemsPerPage,
        handleExport,
        handleMoreResults,
        lastKey,
        showDynamicSearcher = true
    } = props;

    const { t } = useTranslation()
    const classes = useStyles({})
    const target = document.getElementById('number') as HTMLSelectElement
    const [orderFields, setOrderFields] = useState(initialOrderState);
    const [itemsToShow, setItemsToShow] = useState([]);

    const onChangeSelector = () => {
        setItemsPerPage(Number(target.options[target.selectedIndex].value))
    }

    const handleChangeOrder = (column: string) => {
        const tempElem = Object.assign({}, orderFields) as any;

        if (tempElem[column]) {
            tempElem.order = tempElem.order === 'desc' ? 'asc' : 'desc';
        } else {
            for (const property in tempElem) {
                tempElem[property] = false;
            }
            tempElem.order = 'desc';
            tempElem[column] = true;
        }
        setOrderFields(tempElem);
    };

    useEffect(() => {
        setItemsToShow(items);
    }, [items]);

    return (
        <>
            <Grid container className={classes.titleCont}>
                <Grid item className={classes.buttonContainerSearch}>
                    {
                    showDynamicSearcher && 
                        <DynamicSearcher
                            label={t('audit.searchResult')}
                            finalList={itemsToShow}
                            setFinalList={setItemsToShow}
                            listItems={items}
                            subtype={'auditoria'}
                        />
                    }
                </Grid>

                <Grid item className={classes.buttonContainer}>
                    <Button
                        text={t('audit.export')}
                        color={'primary'}
                        size={'medium'}
                        variant={'contained'}
                        onClick={handleExport}
                    />
                </Grid>
            </Grid>
            <Table className={classes.messagesTable}>
                <TableHead>
                    <TableRow className={classes.tableRow}>
                        <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                            {t('audit.table.header.user')}
                        </StyledTableCell>
                        <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                            {t('audit.table.header.session')}
                        </StyledTableCell>
                        <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                            {t('audit.table.header.date')}
                        </StyledTableCell>
                        <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                            {t('audit.table.header.tries')}
                        </StyledTableCell>
                        <StyledTableCell className={classes.headTableCell} rowSpan={1}>
                            {t('audit.table.header.validate')}
                        </StyledTableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {
                        itemsToShow.map(
                            (item, index) => {
                                return (
                                    <Row item={item} index={index} key={index} />
                                );
                            }
                        )
                    }
                </TableBody>
            </Table>

            <Grid container className={classes.footPaginator}>

                <Grid className={classes.paginationContainer} onClick={handleMoreResults}>
                    {lastKey &&
                        <>
                            <img className={classes.updateIcon} src={AddIcon} alt='' />
                            <span className={classes.updateText}>{t('audit.moreResults')}</span>
                        </>
                    }
                </Grid>

                <Grid className={classes.itemsPerPage}>
                    <span style={{ marginRight: 5 }}>{t('common.pagination.show')}</span>
                    <select id='number' name='number' onChange={onChangeSelector} className={classes.select}>
                        <option value='20' selected>20</option>
                        <option value='50'>50</option>
                        <option value='100'>100</option>
                    </select>
                    <span style={{ marginLeft: 5 }}>{t('common.pagination.forPage')}</span>
                </Grid>
            </Grid>
        </>
    )
}

export default List;