import React from 'react'

import Grid from '@material-ui/core/Grid'

import ArrowIcon from '../../../../../assets/icons/flecha_derecha.svg'

import useStyles from './Item.styles'

const Item = (props: any) => {
  const classes = useStyles({})

  const {
    type,
    icon,
    title,
    description,
    handleClick,
    disabled
  } = props

  return (
    <Grid container className={`${classes.box} ${disabled && classes.disabled}`} spacing={2} onClick={handleClick}>
      <div className={classes.arrow}>
        <img src={ArrowIcon} alt='' />
      </div>

      <Grid item md='auto' sm={12} xs={12}>
        <img className={`${classes.icon} ${type}`} src={icon} alt='' />
      </Grid>

      <Grid item md={10} sm={12} xs={12}>
        <div className={classes.title}>{title}</div>

        <div className={classes.description}>{description}</div>
      </Grid>
    </Grid>
  )
}

export default Item
