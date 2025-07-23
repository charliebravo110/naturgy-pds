import { Grid } from '@material-ui/core'
import React from 'react'
import { useTranslation } from 'react-i18next'
import useStyles from './error.styles'

const ErrorMessageContainer = ({children}) => {
    const { t } = useTranslation();
    const styles = useStyles({});
    return (
        <>
            <Grid container className={styles.errorContainer}>
                {children}
            </Grid>
        </>
    )
}

export default ErrorMessageContainer