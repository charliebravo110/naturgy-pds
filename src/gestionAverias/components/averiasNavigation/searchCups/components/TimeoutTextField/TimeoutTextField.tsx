import React,{ useEffect, useState } from 'react'

const TimeoutTextField = ({onChange, asyncOperation, timeOut, loading, ...rest}) => {
    const [searchTerm, setSearchTerm] = useState('')
  
    useEffect(() => {
      onChange(searchTerm)
      const delayDebounceFn = setTimeout(() => {
        searchTerm.length && asyncOperation(searchTerm)
      }, parseInt(timeOut))
  
      return () => clearTimeout(delayDebounceFn)
    }, [searchTerm])
  
    return (
      <input
        {...rest}
        onChange={(evt) => setSearchTerm(evt.target.value)}
      />
    )
  }

export default TimeoutTextField