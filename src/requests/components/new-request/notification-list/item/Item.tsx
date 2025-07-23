import React from 'react'
import Grid from '@material-ui/core/Grid'
import Checkbox from '../../../../../supplies/supplies-list/managed-by-me/components/checkbox/Checkbox'
import useStyles from './Item.styles'

const Item = (props: any) => {
    const classes = useStyles({})

    const {
        type,
        icon,
        title,
        description,
        handleClick,
        isCheckboxSelected      
    } = props

    return (
        <Grid container className={classes.box} spacing={4}  onClick={handleClick}>

            <Grid item md='auto' sm={10} xs={10}>
                <img className={`${classes.icon} ${type}`} src={icon} alt='' />
            </Grid>

            <Grid item md={10} sm={12} xs={12}>
                <div className={classes.title}>{title}</div>

                <div className={classes.description}>{description}</div>
            </Grid>

            <Grid item className={classes.check}  >
                <Checkbox 
                    selected={isCheckboxSelected}
                />

            </Grid>
        </Grid>
    )
}

export default Item