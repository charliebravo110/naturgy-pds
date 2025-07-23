import { useHistory } from 'react-router'

export default function useGoHomeIf(condition: boolean) {
  const history = useHistory()
  if (condition) history.push('/')
}
