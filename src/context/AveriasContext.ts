import { useEffect, useState } from 'react'

const AveriasContext = () => {
  const [name, setName] = useState<string>('')
  const [firstSurname, setFirstSurname] = useState<string>('')
  const [secondSurname, setSecondSurname] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [observation, setObservation] = useState<string>('')
  const [security, setSecurity] = useState<boolean>()
  const [electrodependent, setElectodependent] = useState<boolean>()

  return {
    security,
    observation,
    setSecurity,
    setObservation,
    electrodependent,
    setElectodependent,
  }
}

export default AveriasContext