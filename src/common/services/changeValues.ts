import { formatNumberES } from './formatNumber'

const W_to_Kw = (value: string, decimal?: boolean) => {
  return formatNumberES(parseFloat(value), decimal)+' kW'
}

export default {
    W_to_Kw
}