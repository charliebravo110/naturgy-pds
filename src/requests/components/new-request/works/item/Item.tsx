import React from 'react'

import Grid from '@material-ui/core/Grid'

import useStyles from './Item.styles'

const Item = (props: any) => {
  const classes = useStyles({})

  const {
    type,
    icon,
    title,
    handleClick
  } = props

  return (
    <Grid item md={3} sm={6} xs={12}>
      <div className={classes.box} onClick={handleClick}>
        <div>
          <img className={`${classes.icon} ${type}`} src={icon} alt='' />
        </div>

        <div className={classes.title}>{title}</div>
      </div>
    </Grid>
  )
}

export default Item
