import React from 'react'

import LoadingAnimation from '../../../assets/img/spinner.gif'

import useStyles from './Spinner.styles'

const Spinner = (props: any) => {
  const classes = useStyles({})

  const {
    id,
    visible,
    fixed
  } = props

  return (
    <div id={id ? id : ''} className={`${classes.loadingContainer} ${typeof(visible) !== 'undefined' ? (visible ? '' : 'hidden') : ''} ${fixed ? 'fixed' : ''}`}>
      <img className={classes.loadingAnimation} src={LoadingAnimation} alt='' />
    </div>
  )
}

export default Spinner
