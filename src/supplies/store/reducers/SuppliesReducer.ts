import {
  SET_SUPPLIES_COUNT,
  SET_SUPPLIES,
  APPEND_SUPPLIES_LIST,
  RESET_SUPPLIES_LIST,
  SET_SUPPLY,
  RESET_SUPPLIES,
  SET_CURRENT_SUPPLY_CONSUMPTIONS,
  SET_CURRENT_COMPARE_CONSUMPTIONS,
  SET_CURRENT_SUPPLY_BILLING_PERIODS,
  SET_CURRENT_SUPPLY_PROGRAMMED_READS_COUNT,
  APPEND_CURRENT_SUPPLY_PROGRAMMED_READS,
  SET_CURRENT_SUPPLY_PROGRAMMED_READS,
  SET_CURRENT_SUPPLY_PROGRAMMED_READS_X_MESSAGE_ID,
  RESET_CURRENT_SUPPLY_PROGRAMMED_READS,
  SuppliesActionTypes
} from '../../interfaces/SuppliesActionTypes'
import Supplies from '../../interfaces/Supplies'

const initialState: Supplies = {
  count: 0,
  list: [],
  currentSupplyConsumptions: {
    maxConsumptionDate: '',
    minConsumptionDate: '',
    avgConsumption: '',
    maxConsumption: '',
    minConsumption: '',
    totalConsumption: '',
    consumptions: {
      items: []
    }
  },
  currentCompareConsumptions: {
    maxConsumptionDate: '',
    minConsumptionDate: '',
    avgConsumption: '',
    maxConsumption: '',
    minConsumption: '',
    totalConsumption: '',
    consumptions: {
      items: []
    }
  },
  currentSupplyBillingPeriods: [{
    periodStartDate: '',
    periodEndDate: ''
  }],
  currentSupplyProgrammedReads: {
    count: 0,
    items: [],
    xMessageId: ''
  }
}

export function suppliesReducer(state = initialState, action: SuppliesActionTypes): Supplies {
  switch (action.type) {
    case SET_SUPPLIES_COUNT:
      return {
        ...state,
        count: action.data
      }

    case SET_SUPPLIES:
      return {
        ...state,
        list: action.data
      }

    case APPEND_SUPPLIES_LIST:
      return {
        ...state,
        list: [
          ...state.list,
          ...action.data
        ]
      }

    case RESET_SUPPLIES_LIST:
      return {
        ...state,
        list: initialState.list
      }

    case SET_SUPPLY:
      const index = action.data.index
      return {
        ...state,
        list: [
          ...state.list.slice(0, index), {
            ...state.list[index],
            ...action.data.info
          },
          ...state.list.slice(index + 1)
        ]
        // list: state.list.map(
        //   (item) => {
        //     if(item.cups === action.data.cups){
        //       return action.data
        //     } else {
        //       return item
        //     }
        //   }
        // )
      }

    case RESET_SUPPLIES:
      return initialState

    case SET_CURRENT_SUPPLY_CONSUMPTIONS:
      return {
        ...state,
        currentSupplyConsumptions: action.data
      }
    
    case SET_CURRENT_COMPARE_CONSUMPTIONS:
      return {
        ...state,
        currentCompareConsumptions: action.data
      }

    case SET_CURRENT_SUPPLY_BILLING_PERIODS:
      return {
        ...state,
        currentSupplyBillingPeriods: action.data
      }

    case SET_CURRENT_SUPPLY_PROGRAMMED_READS_COUNT:
      return {
        ...state,
        currentSupplyProgrammedReads: {
          ...state.currentSupplyProgrammedReads,
          count: action.data
        }
      }

    case APPEND_CURRENT_SUPPLY_PROGRAMMED_READS:
      return {
        ...state,
        currentSupplyProgrammedReads: {
          ...state.currentSupplyProgrammedReads,
          items: [
            ...state.currentSupplyProgrammedReads.items,
            ...action.data
          ]
        }
      }

      case SET_CURRENT_SUPPLY_PROGRAMMED_READS:
        return {
          ...state,
          currentSupplyProgrammedReads: {
            items: [
              ...action.data
            ]
          }
        }

    case SET_CURRENT_SUPPLY_PROGRAMMED_READS_X_MESSAGE_ID:
      return {
        ...state,
        currentSupplyProgrammedReads: {
          ...state.currentSupplyProgrammedReads,
          xMessageId: action.data
        }
      }

    case RESET_CURRENT_SUPPLY_PROGRAMMED_READS:
      return {
        ...state,
        currentSupplyProgrammedReads: initialState.currentSupplyProgrammedReads
      }

    default:
      return state
  }
}
