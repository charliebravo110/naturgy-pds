import React, { useState, useRef, useEffect } from 'react'

import BlueArrowDownIcon from '../../../assets/icons/flecha_down_blue.svg'

import useStyles from './StyledSelect.styles'

const StyledSelect = (props: any) => {
  const classes = useStyles({})

  const ref = useRef(null)

  const {
    values,
    selectedKey,
    handleSelect,
    codFiltering
  } = props

  const [ showingBox, setShowingBox ] = useState(false)

  const handleClickButton = () => {
    setShowingBox(!showingBox)
  }

  const handleClickItem = (key: any, value?: any) => {
    codFiltering ? handleSelect(key, value) : handleSelect(key)

    setShowingBox(false)
  }

  const generateMenuItems = () => {
    return (values && values.length > 0) && values.map(
      (item, index) => (
        <div
          key={index}
          className={classes.item}
          onClick={() => codFiltering ? handleClickItem(item.key, item.value.split('|')[0]) : handleClickItem(item.key)}
        >
          {codFiltering ? item.value.split('|')[1] : item.value}
        </div>
      )
    )
  }

  const handleClickOutside = (e: any) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setShowingBox(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)

    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  })

  return (
    <div className={classes.select}>
      <div
        className={`${classes.button} ${showingBox && 'active'}`}
        onClick={handleClickButton}
      >
        {
          (values && values.length > 0) &&
            codFiltering ? values.find(item => item.key === selectedKey).value.split('|')[1] : values.find(item => item.key === selectedKey).value
        }

        <img src={BlueArrowDownIcon} alt='' className={classes.arrowDown}/>
      </div>

      {
        showingBox &&
          <div className={classes.items} ref={ref}>
            {generateMenuItems()}
          </div>
      }
    </div>
  )
}

export default StyledSelect
