import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Grid } from '@material-ui/core';
import Input from '../input/Input';

import useStyles from './TextArea.styles';


interface TextAreaProps {
    label?: string;
    rows?: number;
    value?: string;
    maxLength?: number;
    showLengthCount?: boolean;
    handleOnChange: Function;
    error?: boolean
}

const TextArea = (props: TextAreaProps) => {

    const classes = useStyles({});
    const { t } = useTranslation();

    const [inputValue, setInputValue ] = useState<string>(props.value);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setInputValue(event.currentTarget.value);
        props.handleOnChange(event.currentTarget.value);
    }

    return (
        <div className={classes.container}>
            {(props.label) &&
                <div className={classes.label}>
                    {props.label}
                </div>
            }

            <Input
                fullWidth
                multiline
                rows={props.rows || 5}
                value={inputValue}
                onChange={handleChange}
                inputProps={{
                    maxLength: (props.maxLength || 100000)
                }}
                error={props.error ? props.error : false}
            />

            {(props.showLengthCount && props.maxLength != null) &&
                <Grid container justifyContent='flex-end'>
                    <Grid item className={classes.characterCount}>
                        {t('requests.newRequest.form.comment.characterCount.part1')}

                        <b>
                            {(props.maxLength - inputValue.length)}
                        </b>

                        {t('requests.newRequest.form.comment.characterCount.part2')}

                        <b>{props.maxLength}</b>
                    </Grid>
                </Grid>
            }
        </div>
    );
}

export default TextArea;
