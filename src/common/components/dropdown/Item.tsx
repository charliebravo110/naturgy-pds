import React from 'react'

import Grid from '@material-ui/core/Grid'

import useStyles from './Dropdown.styles'

const Item = (props: any) => {
  const classes = useStyles({})

  const {
    element,
    selectedItemHandler,
    position
  } = props

  const handleClick = () => {
    position ?
      selectedItemHandler(element, position)
    :
      selectedItemHandler(element)
  }

  return (
    <Grid container className={`${classes.item} ${classes.itemWithBorder}`} onClick={handleClick}>
      <Grid item className={classes.itemIcon}/>
      <Grid item className={classes.itemText}>{element.title ? element.title : 'Title field not set'}</Grid>
    </Grid>
  )
}

export default Item
