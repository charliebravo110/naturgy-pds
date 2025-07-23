import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'

import signUp from '../../../sign-up/store/reducers/SignUpRdx'
import { loginReducer } from '../../../login/store/reducers/LoginReducer'
import { userReducer } from './UserReducer'
import { adminReducer } from '../../../admin/store/reducers/AdminReducer'
import { faqsReducer } from '../../../faqs/store/reducers/FaqsReducer'
import { suppliesReducer } from '../../../supplies/store/reducers/SuppliesReducer'
import { delegatesReducer } from '../../../delegates/store/reducers/DelegatesReducer'
import { errorReducer } from './ErrorReducer'
import { delegationsReducer } from '../../../supplies/store/reducers/DelegationsReducer'
import { provisionsReducer } from '../../../provisions/store/reducers/ProvisionsReducer'
import { requestsReducer } from '../../../requests/store/reducers/RequestsReducer'
import { urlMessagesReducer } from '../../components/send-url/store/reducers/UrlMessagesReducer'
import { alertsReducer } from '../../../supplies/store/reducers/AlertsReducers'
import { Reducer as BiometricAccessReducer } from '../../../mobile-apps/biometric-access/store/Reducer'
import { Reducer as BottomNavReducer } from '../../../mobile-apps/menu-bottom-nav/store/Reducer'
import { notificationsReducer } from '../../../mobile-apps/notifications/store/reducer/NofiticationsReducer'

const rootReducer = (history) => combineReducers({
  router: connectRouter(history),
  signUp,
  login: loginReducer,
  user: userReducer,
  admin: adminReducer,
  faqs: faqsReducer,
  supplies: suppliesReducer,
  error: errorReducer,
  delegations: delegationsReducer,
  delegates: delegatesReducer,
  provisions: provisionsReducer,
  requests: requestsReducer,
  urlMessages: urlMessagesReducer,
  alerts: alertsReducer,
  biometricAccess: BiometricAccessReducer,
  bottomNav: BottomNavReducer,
  notifications: notificationsReducer
  })

type aux = ReturnType<typeof rootReducer>;

export type AppState = ReturnType<aux>;

export default rootReducer
