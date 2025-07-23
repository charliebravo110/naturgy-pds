import React from 'react'
import { Grid } from '@material-ui/core'
import InfoIcon from '../../../../assets/icons/ico_info_azul.svg'
import CloseIcon from '../../../../assets/icons/cerrar.svg'
import useStyles from '../searchCups/SearchCups.styles'


export const AlertMessage = ({
    text,
    onClose,

}) => {

    const styles = useStyles({})

    return <Grid className={styles.searchResult}>
        <div className={styles.alertMessage}>
            <div><img src={InfoIcon} className={styles.icon} alt='' /> <span className={styles.bluetext}>{text}</span> </div>
            
            <div><img src={CloseIcon} className={styles.closeButton} alt='' onClick={() => onClose()} /></div>
        </div>
    </Grid>
}