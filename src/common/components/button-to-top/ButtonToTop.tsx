import React, { useEffect, useState } from 'react'

import ArrowUpIcon from '../../../assets/icons/flecha_up.svg'

import useStyles from './ButtonToTop.styles'

const ButtonToTop = (props: any) => {
  const classes = useStyles({})

  const [ isVisible, setIsVisible ] = useState(false)

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return function() {
      window.removeEventListener('scroll', handleScroll)
    }
  })

  const handleScroll = () => {
    const scrollPosition = window.pageYOffset
    
    setIsVisible(scrollPosition > 0)
  }

  const handleClickButton = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div
      className={`${classes.button} ${isVisible ? 'visible' : 'hidden'}`}
      onClick={handleClickButton}
    >
      <img src={ArrowUpIcon} alt='' />
    </div>
  )
}

export default ButtonToTop
