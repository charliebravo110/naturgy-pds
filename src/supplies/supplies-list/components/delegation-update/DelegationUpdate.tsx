import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import Spinner from '../../../../common/components/spinner/Spinner'

import { thunkUpdateDelegationStatus } from '../../store/actions/SuppliesListThunkActions'

// LCS: Importar la función - Wave 3
import { sendGAEvent, removeEmails } from '../../../../core/utils/gtm'

const DelegationUpdate = (props: any) => {
  const dispatch = useDispatch()

  let token = sessionStorage.getItem('token') || ''

  const [ isDelegating, setIsDelegating ] = useState(true)

  useEffect(() => {
    // LCS: Enviar evento de GdC a GA - Wave 3
    sendGAEvent({
    event: 'view',
    content_group: props.delegateType === 'US_MANAGER' ? 'mis gestores' : 'mis asesores',
    page_url: removeEmails(window.location.href),
    user_id: sessionStorage.getItem('id'),
    previous_path: removeEmails(sessionStorage.getItem("previousPage")),
    user_type: sessionStorage.getItem('user_type'),
    browsing_type: sessionStorage.getItem('browsing_type'),
    element_type: 'medicion de pagina',
    ga_client_id: sessionStorage.getItem('ga_client_id'),
    cups: 'no aplica',
    supply_type: 'no aplica'
    });
    sessionStorage.setItem("previousPage", window.location.href);
  },[])

  useEffect(() => {
    const delegationsIds = props.match.params.ids.split(',')
    const status = props.match.params.status

    if (!token) {
      props.history.push({
        pathname:'/login',
        state: {
          request: '/delegation/update/',
          delegationsIds,
          status
        }
      })
    } else {
      let items = [] as any

      delegationsIds.forEach(
        (item) => {
          let auxItem = {
            delegationId: item,
            status: status
          }

          items.push(auxItem)
        }
      )

      dispatch(thunkUpdateDelegationStatus(items, (result) => {
        if (result === 'OK') {
          if (status === 'C' || status === 'R') {
            props.history.push({
              pathname: '/supplies',
              state: {
                origin: 'updateDelegations'
              }
            })
          }
        }

        setIsDelegating(false)
      }))
    }
  // eslint-disable-next-line
  }, [])

  return (
    <>
      {
        isDelegating &&
          <Spinner fixed={true} />
      }
    </>
  )
}

export default DelegationUpdate
