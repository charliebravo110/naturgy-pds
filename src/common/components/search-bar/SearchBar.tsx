import React, { useState } from 'react';

import { Grid } from '@material-ui/core';
import Input from '../input/Input';

import useStyles from './SearchBar.styles';
import MagnifyingGlassIcon from '../../../assets/icons/lupa_buscador_blanca.svg';


interface SearchBarProps {
    label?: string;
    index?: number;
    value?: string;
    size: 's' | 'm' | 'l';
    handleSearch: Function;
    searchOnChange?: boolean;
}

const SearchBar = (props: SearchBarProps) => {

    const styles = useStyles({});

    const [inputValue, setInputValue] = useState<string>(props.value ? props.value : '');
    

    const handleChange = (value: string): void => {
        setInputValue(value);

        if (props.searchOnChange) {
            performSearch();
        }
    }

    const handleKeyPress = (event: React.KeyboardEvent): void => {
        if (event.key === 'Enter') {
            performSearch();
        }
    }

    const performSearch = (): void => {
        props.handleSearch(inputValue, props.index);
    }

    return (
        <Grid item className={`${styles.container} ${styles[props.size]}`}>
            <Input
                label={props.label}
                className={styles.input}
                defaultValue={inputValue}
                onKeyPress={(e) => handleKeyPress(e)}
                onChange={(e) => handleChange(e.target.value)}
                {...props}
            />

            <div className={styles.icon} onClick={performSearch}>
                <img src={MagnifyingGlassIcon} alt='' />
            </div>
        </Grid>
    );
}

export default SearchBar;
