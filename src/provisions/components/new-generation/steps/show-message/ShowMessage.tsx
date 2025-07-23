import React from 'react'

import Grid from '@material-ui/core/Grid'

import useStyles from './ShowMessage.styles'

const ShowMessage = (props: any) => {
  const { title , subtitle } = props
  const classes = useStyles({})

  return (
    <Grid item container md={12} direction='column' justifyContent='center' alignItems='center' className={classes.container}>
      <Grid item className={classes.title}>
        {title}
      </Grid>
      <Grid item className={classes.subtitle}>
        {subtitle}
      </Grid>
    </Grid>
  )
}

export default ShowMessage