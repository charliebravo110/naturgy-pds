import React, { useEffect, useState } from 'react';

import { noAccents } from '../../lib/FormatLib';

import useStyles, { StyledTableCell } from './ListFilter.styles';
import SearchBar from '../search-bar/SearchBar';
import Pagination from '../pagination/Pagination';
import ArrowDown from '../../../assets/icons/flecha_down_blue.svg';
import { Grid, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import Tooltip from '../../../common/components/tooltip/Tooltip';


export interface Column<T> {
    header: string;
    size: 's' | 'm' | 'l';
    valueForFilter?: (T) => string;
    selector: (T) => React.ReactNode;
}

interface ListFilterProps<T> {
    columns: Column<T>[];
    data: T[];
    filterOnChange?: boolean;
    maxRowsPerPage?: number;
    fontSize?: 'sm' | 'md';
    setSelected?: any;
    selected?: any;
}

const ListFilter = <T extends object>(props: ListFilterProps<T>) => {

    const classes = useStyles({});

    let stateDescription = ''

    const [totalPages, setTotalPages] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [filteredList, setFilteredList] = useState<T[]>([]);
    const [searchBarIndex, setSearchBarIndex] = useState<number>(null);
    const filterList = (value: string, index: number): void => {
        let auxFilteredList: T[] = [];
        const filterValue = noAccents(value.toLowerCase());

        props.columns.map((c, i): any => {
            if (index === i) {
                auxFilteredList = props.data.filter((e: T) => {
                    const columnValue = noAccents(c.valueForFilter(e).toLowerCase());

                    return (columnValue.includes(filterValue));
                });
            } else if (index == null) {
                auxFilteredList = props.data;
            }
        });

        setFilteredList(auxFilteredList);
    }

    const showSearchBar = (index: number): void => {
        if (index !== searchBarIndex) {
            setSearchBarIndex(index);
        } else {
            setSearchBarIndex(null);
            handleSearch('', index);
        }
    }

    const handleSearch = (value: string, index: number): void => {
        filterList(value, index);
    }

    const assignDescription = (value: string): void => {
        if (value === 'PT') {
            stateDescription = 'PENDIENTE (PT)'
        } else if (value === 'EB') {
            stateDescription = 'ENVIO BRIGADA (EB)'
        } else if (value === 'CL') {
            stateDescription = 'CAUSA LOCALIZADA (CL)'
        } else if (value === 'ER') {
            stateDescription = 'EN RESOLUCION (ER)'
        } else if (value === 'SR') {
            stateDescription = 'SERVICIO REPUESTO (SR)'
        } else if (value === 'EM') {
            stateDescription = 'ENVIADO MANTENIMIENTO (EM)'
        } else if (value === 'RS') {
            stateDescription = 'RESUELTO (RS)'
        }
    }

    const resetDescription = (): void => {
        stateDescription = ''
    }

    useEffect(() => {
        if (props.maxRowsPerPage != null) {
            setTotalPages((filteredList.length === 0) ? 1 : Math.ceil(filteredList.length / props.maxRowsPerPage));
        }
    }, [filterList]);

    useEffect(() => {
        setFilteredList(props.data);
    }, [props.data]);

    const headers = props.columns.map((c, index) =>
        <StyledTableCell key={index} className={(props.fontSize != null) ? ((props.fontSize === 'sm') ? classes.sm : classes.md) : classes.md}>
            <Grid container direction='row' justifyContent='space-between'>
                <Grid item>
                    {c.header}
                </Grid>

                {(c.valueForFilter != null) &&
                    <Grid item onClick={() => showSearchBar(index)}>
                        <img src={ArrowDown} alt='' />
                    </Grid>
                }
            </Grid>
        </StyledTableCell>
    );

    const filters = props.columns.map((c, index) =>
        <TableCell key={index} className={c.size}>
            {(index === searchBarIndex) &&
                <SearchBar handleSearch={handleSearch} index={index} searchOnChange={props.filterOnChange} size='s' />
            }
        </TableCell>
    );

    const rows = filteredList.map((d, dIndex) =>
        <TableRow key={dIndex} className={classes.row}>
            {props.columns.map((c, cIndex) =>
                <TableCell key={cIndex} className={(props.fontSize != null) ? ((props.fontSize === 'sm') ? classes.cell2 : classes.cell) : classes.cell}>

                    {assignDescription(c.selector(d).toString())}

                    {
                        stateDescription !== '' ?
                            <Tooltip title={stateDescription} placement='top'>
                                <p>{c.selector(d)}</p>
                            </Tooltip>
                            :
                            c.selector(d)
                    }

                    {resetDescription()}

                </TableCell>
            )}
        </TableRow>
    );


    const rowsPagination = filteredList.slice((currentPage - 1) * props.maxRowsPerPage, (currentPage - 1) * props.maxRowsPerPage + props.maxRowsPerPage)
        .map((d, dIndex) =>
            <TableRow key={dIndex} className={classes.row}>
                {props.columns.map((c, cIndex) =>
                    <TableCell key={cIndex} className={(props.fontSize != null) ? ((props.fontSize === 'sm') ? classes.cell2 : classes.cell) : classes.cell}>

                        {assignDescription(c.selector(d).toString())}

                        {
                            stateDescription !== '' ?
                                <Tooltip title={stateDescription} placement='top'>
                                    <p>{c.selector(d)}</p>
                                </Tooltip>
                                :
                                c.selector(d)
                        }

                        {resetDescription()}

                    </TableCell>
                )}
            </TableRow>
        );

    return (
        <Grid container>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow className={classes.row}>
                        {headers}
                    </TableRow>

                    {(searchBarIndex != null) &&
                        <TableRow className={classes.row}>
                            {filters}
                        </TableRow>
                    }

                </TableHead>
                <TableBody>
                    {(props.maxRowsPerPage != null) ?
                        rowsPagination
                        :
                        rows
                    }
                </TableBody>
            </Table>

            {(props.maxRowsPerPage != null) &&
                <Pagination currentPage={currentPage} totalPages={totalPages} handleChangePage={setCurrentPage} />
            }

        </Grid>
    );
}

export default ListFilter;
