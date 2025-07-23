import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Checkbox from '@material-ui/core/Checkbox';
import useStyles, { StyledTableCell } from './List.styles'

import EnvelopeIcon from '../../../assets/icons/Interfaz_126_correo_arroba.svg'
import MobileIcon from '../../../assets/icons/Icon_sms.svg'
import Pagination from '../../../common/components/pagination/Pagination2'
import Button from '../../../common/components/button/Button'


const initialOrderState = {
  'username': false,
  'name': false,
  'type': false,
  'role': false,
  'email': false,
  'creationDate': false,
  'dateTo': false,
  'order': 'desc'
};

const List = (props: any) => {
  const {
    listItems,
    setFinalList,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    deleteUser,
    assignUser,
    revokeUser,
  } = props;

  const { t } = useTranslation()
  const classes = useStyles({})
  const target = document.getElementById('number') as HTMLSelectElement
  const [selected, setSelected] = useState<any>({});
  const [totalPagesFilter, setTotalPagesFilter] = useState(0);
  const [orderFields, setOrderFields] = useState(initialOrderState);


  const isSelected = (id: string) => selected.username === id;

  const resetFilters = () => {
    setOrderFields(initialOrderState);
  }

  const onChangeSelector = () => {
    setCurrentPage(0)
    setItemsPerPage(Number(target.options[target.selectedIndex].value))
  }

  const getFormatedDate = (date: string): string => {
		return `${date.slice(3, 5)}/${date.slice(0, 2)}${date.slice(5)}`;
	}

  const getDeleteDate = (item: any) => {
    return item.enabled ? new Date().getTime() : new Date(getFormatedDate(item.lastModifiedDate)).getTime();
  }

  const handleChangeOrder = (column: string) => {
    const tempElem = Object.assign({}, orderFields) as any;
    setCurrentPage(0);

    if (tempElem[column]) {
      tempElem.order = tempElem.order === 'desc' ? 'asc' : 'desc';
    } else {
      for (const property in tempElem) {
        tempElem[property] = false;
      }
      tempElem.order = 'desc';
      tempElem[column] = true;
    }

    let auxList = [];

    if(column === 'type') {
      auxList = [].concat(listItems).sort((a, b) =>   getUserType(a['username']).localeCompare(getUserType(b['username'])))
    } else if(column === 'role') {
      auxList = [].concat(listItems).sort((a, b) => hasCCRole(a['roles']).localeCompare(hasCCRole(b['roles'])))
    } else if(column === 'baja') {
      auxList = [].concat(listItems).sort((a, b) => getDeleteDate(a) - getDeleteDate(b))
    } else {
      auxList = ['alta'].includes(column) ? [].concat(listItems).sort((a, b) => new Date(getFormatedDate(a['creationDate'])).getTime() - new Date(getFormatedDate(b['creationDate'])).getTime()) :
      [].concat(listItems).sort((a, b) => a[column].localeCompare(b[column]));
    }

    if (tempElem.order === 'asc') {
      setFinalList([].concat(auxList).sort().reverse());
    } else {
      setFinalList(auxList);
    }
    setOrderFields(tempElem);
  };

  // const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.checked) {
  //     const newSelected = listItems.map((n) => n.username);
  //     setSelected(newSelected);
  //     return;
  //   }
  //   setSelected([]);
  // };

  const handleClick = (event: React.MouseEvent<unknown>, item: any) => {
    if (selected.username === item.username) {
      setSelected({});
    } else {
      setSelected(item);
    }
  };

  const handleTableAction = (action: string) => {
    if (action === 'delete') {
      deleteUser(selected);
    }

    if (action === 'assign') {
      assignUser(selected);
    }
    if (action === 'revoke') {
      revokeUser(selected);
    }
  }

  const getUserType = (user: string) => {
    const code = user.toUpperCase();

    const code9 = /^9\d{7}$/.test(code);
    const code00 = /^00\d{6}$/.test(code);
    const code44 = /^44\d{6}$/.test(code);
    const code700 = /^700\d{5}$/.test(code);
    const codeUF = /^UF\d{6}$/.test(code) || /^uf\d{6}$/.test(code);
    const code70 = /^70\d{6}$/.test(code) && !/^700\d{5}$/.test(code);

    if (code9) {
      return t('gestionUsuariosCC.userTypes.administrator')
    } else if (code700) {
      return t('gestionUsuariosCC.userTypes.platform')
    } else if (code00 || code44 || code70 || codeUF) {
      return t('gestionUsuariosCC.userTypes.ufd')
    }

    return ''
  }

  const hasCCRole = (roles: string[]) => {
    return roles.filter(rol => rol === 'US_CC').length > 0 ? t('common.buttons.yes') : t('common.buttons.no');
  }

  const hasRoleCall = () => {
    if (selected.roles) {
      return selected.roles.filter(rol => rol === 'US_CC').length > 0;
    } else {
      return false;
    }
  }

  const hasRoleWhiteCC = () => {
    if (selected.roles) {
      return selected.roles.filter(rol => rol === 'US_CC_WHITELIST').length > 0;
    } else {
      return false;
    }
  }

  useEffect(() => {
    setTotalPagesFilter(listItems.length === 0 ? 1 : Math.ceil(listItems.length / itemsPerPage));
    // eslint-disable-next-line
  }, [listItems, itemsPerPage]);

  useEffect(() => {
    resetFilters();
  }, [listItems.length]);


  return (
    <>
      <Grid container className={classes.titleCont}>
        <Grid item className={classes.buttonContainer}>
          <Button
            text={t('gestionUsuariosCC.table.assignRole')}
            color={'primary'}
            size={'large'}
            variant={'contained'}
            disabled={!selected.enabled || hasRoleCall() || Object.keys(selected).length === 0}
            onClick={() => handleTableAction('assign')}
          />
          <Button
            text={t('gestionUsuariosCC.table.revokeRole')}
            color={'primary'}
            size={'large'}
            variant={'contained'}
            disabled={!hasRoleCall() || Object.keys(selected).length === 0 || hasRoleWhiteCC()}
            onClick={() => handleTableAction('revoke')}
          />
          <Button
            text={t('gestionUsuariosCC.table.deleteUser')}
            color={'primary'}
            size={'large'}
            variant={'contained'}
            disabled={!selected.enabled}
            onClick={() => handleTableAction('delete')}
          />
        </Grid>
      </Grid>
      <Table className={classes.messagesTable}>
        <TableHead>
          <TableRow className={classes.tableRow}>
            <StyledTableCell padding='checkbox' />
            <StyledTableCell className={classes.headTableCell} rowSpan={1}>
              {t('gestionUsuariosCC.table.header.registration')}
              <TableSortLabel
                active={orderFields['username']}
                direction={orderFields['order'] === 'asc' ? 'asc' : 'desc'}
                onClick={() => handleChangeOrder('username')}
              />
            </StyledTableCell>
            <StyledTableCell className={classes.headTableCell} rowSpan={1}>
              {t('gestionUsuariosCC.table.header.name')}
              <TableSortLabel
                active={orderFields['name']}
                direction={orderFields['order'] === 'asc' ? 'asc' : 'desc'}
                onClick={() => handleChangeOrder('name')}
              />
            </StyledTableCell>
            <StyledTableCell className={classes.headTableCell} rowSpan={1}>
              {t('gestionUsuariosCC.table.header.type')}
              <TableSortLabel
                active={orderFields['type']}
                direction={orderFields['order'] === 'asc' ? 'asc' : 'desc'}
                onClick={() => handleChangeOrder('type')}
              />
            </StyledTableCell>
            <StyledTableCell className={classes.headTableCell} rowSpan={1}>
              {t('gestionUsuariosCC.table.header.role')}
              <TableSortLabel
                active={orderFields['role']}
                direction={orderFields['order'] === 'asc' ? 'asc' : 'desc'}
                onClick={() => handleChangeOrder('role')}
              />
            </StyledTableCell>
            <StyledTableCell className={classes.headTableCell} rowSpan={1}>
              {t('gestionUsuariosCC.table.header.email')}
              <TableSortLabel
                active={orderFields['email']}
                direction={orderFields['order'] === 'asc' ? 'asc' : 'desc'}
                onClick={() => handleChangeOrder('email')}
              />
            </StyledTableCell>
            <StyledTableCell className={classes.headTableCell} rowSpan={1}>
              {t('gestionUsuariosCC.table.header.dateFrom')}
              <TableSortLabel
                active={orderFields['dateFrom']}
                direction={orderFields['order'] === 'asc' ? 'asc' : 'desc'}
                onClick={() => handleChangeOrder('alta')}
              />
            </StyledTableCell>
            <StyledTableCell className={classes.headTableCell} rowSpan={1}>
              {t('gestionUsuariosCC.table.header.dateTo')}
              <TableSortLabel
                active={orderFields['dateTo']}
                direction={orderFields['order'] === 'asc' ? 'asc' : 'desc'}
                onClick={() => handleChangeOrder('baja')}
              />
            </StyledTableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {
            listItems.slice(
              (currentPage * itemsPerPage),
              ((currentPage * itemsPerPage) + itemsPerPage)
            ).map(
              (item, index) => {
                const isItemSelected = isSelected(item.username);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <>
                    <TableRow key={index} className={classes.tableBodyRow}>
                      <StyledTableCell padding='checkbox'>
                        <Checkbox
                          style={{
                            color: '#004571'
                          }}
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                          onClick={(event) => handleClick(event, item)}
                        />
                      </StyledTableCell>
                      <StyledTableCell>{item.username}</StyledTableCell>
                      <StyledTableCell>{`${item.name} ${item.lastName}`}</StyledTableCell>
                      <StyledTableCell>{getUserType(item.username)}</StyledTableCell>
                      <StyledTableCell>{hasCCRole(item.roles)}</StyledTableCell>
                      <StyledTableCell>
                        <p>
                          <img className={classes.icon} src={EnvelopeIcon} alt='' />
                          {item.email}
                        </p>
                        {item.phone_number &&
                          <>
                            <img className={classes.icon} src={MobileIcon} alt='' />
                            {item.phone_number}
                          </>
                        }
                      </StyledTableCell>
                      <StyledTableCell>{item.creationDate ? item.creationDate.substring(0, 10) : ''}</StyledTableCell>
                      <StyledTableCell>{!item.enabled ? item.lastModifiedDate.substring(0, 10) : ' '}</StyledTableCell>
                    </TableRow>
                  </>
                );
              }
            )
          }
        </TableBody>
      </Table>

      <Grid container className={classes.itemsPerPage}>
        <span style={{ marginRight: 5 }}>{t('common.pagination.show')}</span>
        <select id='number' name='number' onChange={onChangeSelector} className={classes.select}>
          <option value='20' selected>20</option>
          <option value='50'>50</option>
          <option value='100'>100</option>
        </select>
        <span style={{ marginLeft: 5 }}>{t('common.pagination.forPage')}</span>
      </Grid>

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
    </>
  )
}

export default List