import Loadable from 'react-loadable'

import Login from '../login/components/login/Login'
import Loading from '../common/components/loading/Loading'

// @NOTE Code Splitting: https://github.com/jamiebuilds/react-loadable
const SignUp = Loadable({
  loader: () => import('../sign-up/components/sign-up/SignUp'),
  loading: Loading
})

const Landing = Loadable({
  loader: () => import('../common/components/landing/Landing'),
  loading: Loading
})

const Profile = Loadable({
  loader: () => import('../profile/components/profile/Profile'),
  loading: Loading
})

const ProfilePasswordChange = Loadable({
  loader: () => import('../profile/components/profile-password-change/profile-password-change/ProfilePasswordChange'),
  loading: Loading
})

const ProfilePasswordChange_OldPassword = Loadable({
  loader: () => import('../profile/components/profile-password-change/profile-password-change/ProfilePasswordChange_OldPassword'),
  loading: Loading
})


const ProfilePasswordChangeSuccess = Loadable({
  loader: () => import('../profile/components/profile-password-change/profile-password-change-success/ProfilePasswordChangeSuccess'),
  loading: Loading
})

const ProfileEmailChange = Loadable({
  loader: () => import('../profile/components/profile-email-change/ProfileEmailChange'),
  loading: Loading
})

const ResetPasswordSuccess = Loadable({
  loader: () => import('../login/components/reset-password-success/ResetPasswordSuccess'),
  loading: Loading
})

const SignUpSuccess = Loadable({
  loader: () => import('../sign-up/components/sign-up-success/SignUpSuccess'),
  loading: Loading
})
const SignUpNotCreate = Loadable({
  loader: () => import('../sign-up/components/sign-up-error/SignUpNotCreate'),
  loading: Loading
})

const SignUpError = Loadable({
  loader: () => import('../sign-up/components/sign-up-error/SignUpError'),
  loading: Loading
})


const Faqs = Loadable({
  loader: () => import('../faqs/components/faqs/Faqs'),
  loading: Loading
})

const Admin = Loadable({
  loader: () => import('../admin/components/admin/Admin'),
  loading: Loading
})

const GestionAverias = Loadable({
  loader: () => import('../gestionAverias/components/gestionAverias/GestionAverias'),
  loading: Loading
})

const GestionUsuarios = Loadable({
  loader: () => import('../usersManagement/components/gestionUsuarios/GestionUsuarios'),
  loading: Loading
})

const gestionUsuariosCallCenter = Loadable({
  loader: () => import('../usersManagement/components/gestionUsuariosCallCenter/gestionUsuariosCallCenter'),
  loading: Loading
})

const MFAdmin = Loadable({
  loader: () => import('../mfa/components/mfa-admin/MfaAdmin'),
  loading: Loading,
})

/*const ControlMensajeria = Loadable({
  loader: () => import('../controlMensajeria/components/ControlMensajeria'),
  loading: Loading
})
*/

const ControlMensajeria = Loadable({
  loader: () => import('../controlMensajeria/components/consultsAndReports/ConsultsAndReports'),
  loading: Loading
})

const SupplyPanel = Loadable({
  loader: () => import('../gestionAverias/components/supplyPointPanel/SupplyPointPanel2'),
  loading: Loading
}) 

const FailureResultPage = Loadable({
  loader: () => import('../gestionAverias/components/failure-result-page/FailureResultPage'),
  loading: Loading
}) 

const SignUpActivate = Loadable({
  loader: () => import('../sign-up/components/sign-up-activate/SignUpActivate'),
  loading: Loading
})

const SignUpActivateSuccess = Loadable({
  loader: () => import('../sign-up/components/sign-up-activate-success/SignUpActivateSuccess'),
  loading: Loading
})
const SignUpTimeOut = Loadable({
  loader: () => import('../sign-up/components/sign-up-time-out/SignUpTimeOut'),
  loading: Loading
})

const SuppliesList = Loadable({
  loader: () => import('../supplies/supplies-list/components/supplies-list/SuppliesList'),
  loading: Loading
})

const SuppliesDetails = Loadable({
  loader: () => import('../supplies/supplies-details/components/supplies-details/SuppliesDetails'),
  loading: Loading
})

const Alerts = Loadable({
  loader: () => import('../supplies/supplies-details/components/alerts/Alerts'),
  loading: Loading
})

const SuppliesVinculation = Loadable({
  loader: () => import('../supplies/supplies-vinculation/components/supplies-vinculation/SuppliesVinculation'),
  loading: Loading
})

const DelegatesList = Loadable({
  loader: () => import('../delegates/components/delegates-list/DelegatesList'),
  loading: Loading
})

const NewDelegate = Loadable({
  loader: () => import('../delegates/components/new-delegate/NewDelegate'),
  loading: Loading
})

const DelegateProfile = Loadable({
  loader: () => import('../delegates/components/delegate-profile/DelegateProfile'),
  loading: Loading
})

const DelegationUpdate = Loadable({
  loader: () => import('../supplies/supplies-list/components/delegation-update/DelegationUpdate'),
  loading: Loading
})

const DelegationSuccess = Loadable({
  loader: () => import('../supplies/supplies-list/components/delegation-success/DelegationSuccess'),
  loading: Loading
})

const ProvisionsVinculation = Loadable({
  loader: () => import('../provisions/components/provisions-vinculation/ProvisionsVinculation'),
  loading: Loading
})

const ProvisionsList = Loadable({
  loader: () => import('../provisions/components/provisions-list/ProvisionsList'),
  loading: Loading
})

const BillsList = Loadable({
  loader: () => import('../provisions/components/bills-list/BillsList'),
  loading: Loading
})

const WhatToDo = Loadable({
  loader: () => import('../provisions/components/what-to-do/WhatToDo'),
  loading: Loading
})

const CoverageArea = Loadable({
  loader: () => import('../provisions/components/new-provision/coverage-area/CoverageArea'),
  loading: Loading
})

const KeepInMind = Loadable({
  loader: () => import('../provisions/components/new-provision/keep-in-mind/KeepInMind'),
  loading: Loading
})

const EditKeepInMind = Loadable({
  loader: () => import('../provisions/components/edit-provision/keep-in-mind/KeepInMind'),
  loading: Loading
})

const EditInstallationsKeepInMind = Loadable({
  loader: () => import('../provisions/components/edit-installations/keep-in-mind/KeepInMind'),
  loading: Loading
})

const NewGenerationKeepInMind = Loadable({
  loader: () => import('../provisions/components/new-generation/keep-in-mind/KeepInMind'),
  loading: Loading
})

const Steps = Loadable({
  loader: () => import('../provisions/components/new-provision/steps/Steps'),
  loading: Loading
})

const EditSteps = Loadable({
  loader: () => import('../provisions/components/edit-provision/steps/Steps'),
  loading: Loading
})

const EditInstallationsSteps = Loadable({
  loader: () => import('../provisions/components/edit-installations/steps/Steps'),
  loading: Loading
})

const Documentation = Loadable({
  loader: () => import('../provisions/components/documentation/Documentation'),
  loading: Loading
})

const Budget = Loadable({
  loader: () => import('../provisions/components/budget/Budget'),
  loading: Loading
})

const Payment = Loadable({
  loader: () => import('../provisions/components/payment/Payment'),
  loading: Loading
})

const OfflinePayment = Loadable ({
  loader: () => import('../provisions/components/payment/OfflinePayment'),
  loading: Loading
})

const SuccessPaymentOffline = Loadable({
  loader: () => import('../provisions/components/payment/SuccessOfflinePayment'),
  loading: Loading
})

const JobExecution = Loadable({
  loader: () => import('../provisions/components/job-execution/JobExecution'),
  loading: Loading
})

const ApplicationClosure = Loadable({
  loader: () => import('../provisions/components/application-closure/ApplicationClosure'),
  loading: Loading
})

const RequestData = Loadable({
  loader: () => import('../provisions/components/request-data/RequestData'),
  loading: Loading
})

const NotFound = Loadable({
  loader: () => import('../not-found/components/not-found/NotFound'),
  loading: Loading
})

const ProvisionsDetails = Loadable({
  loader: () => import('../provisions/provisions-details/components/provisions-details/ProvisionsDetails'),
  loading: Loading
})

const NewGenerationSteps = Loadable({
  loader: () => import('../provisions/components/new-generation/steps/Steps'),
  loading: Loading
})

const RequestsList = Loadable({
  loader: () => import('../requests/components/requests-list/RequestsList'),
  loading: Loading
})

const RequestDetail = Loadable({
  loader: () => import('../requests/components/request-detail/RequestDetail'),
  loading: Loading
})

const NewRequest = Loadable({
  loader: () => import('../requests/components/new-request/NewRequest'),
  loading: Loading
})

const Gdpr = Loadable({
  loader: () => import('../gdpr/components/gdpr/Gdpr'),
  loading: Loading
})

const Newdashboard = Loadable({
  loader: () => import('../dashboard/DashboardList'),
  loading: Loading
})

const Cookies = Loadable({
  loader: () => import('./components/cookies/Cookies'),
  loading: Loading
})

const NewGenerationQuestions = Loadable({
  loader: () => import('../provisions/components/new-generation/questions/Question'),
  loading: Loading
})

const AzureRedirect = Loadable({
  loader: () => import ('../login/components/azure-redirect/AzureRedirect'),
  loading: Loading
})

const Carousel = Loadable({
  loader: () => import('../mobile-apps/carousel/Carousel'),
  loading: Loading,
})

const ConsultasInformes = Loadable({
  loader: () => import('../controlMensajeria/ConsultasInformes'),
  loading: Loading
})


const PhotosPocPage = Loadable({
  loader: () => import('../mobile-apps/photos/PhotosPocPage'),
  loading: Loading,
})

const VersionEnforcerPage = Loadable({
  loader: () => import('../mobile-apps/version-enforcer/VersionEnforcerPage'),
  loading: Loading,
})

const Notifications = Loadable({
  loader: () => import('../mobile-apps/notifications/notifications'),
  loading: Loading,
})

const NotificationsDetail = Loadable({
  loader: () => import('../mobile-apps/notifications/notifications-detail/notifications-detail'),
  loading: Loading,
})

// @NOTE Setting routes
export const ROUTES = [
  {
    url: '/landing',
    component: Landing
  },
  {
    url: '/reset-message',
    component: ResetPasswordSuccess
  },
  {
    url: '/reset-message2',
    component: ResetPasswordSuccess
  },
  {
    url: '/login',
    component: Login
  },
  {
    url: '/login/reset',
    component: Login
  },
  {
    url: '/profile',
    component: Profile
  },
  {
    url: '/profile/changePassword',
    component: ProfilePasswordChange
  },
  {
    url: '/profile/changePassword/:hash/:email',
    component: ProfilePasswordChange_OldPassword
  },
  {
    url: '/profile/changePassword/success',
    component: ProfilePasswordChangeSuccess
  },
  {
    url: '/profile/changeEmail',
    component: ProfileEmailChange
  },
  {
    url: '/signup',
    component: SignUp
  },
  {
    url: '/offlinepayment',
    component: OfflinePayment
  },
  {
    url: '/successofflinepayment/:successorderid',
    component: SuccessPaymentOffline
  },
  {
    url: '/signup/success',
    component: SignUpSuccess
  },
  {
    url: '/signup/register/error',
    component: SignUpNotCreate
  },
  
  {
    url: '/signup/error',
    component: SignUpError
  },
  {
    url: '/faqs',
    component: Faqs
  },
  {
    url: '/admin',
    component: Admin
  },
  {
    url: '/controlMensajeria',
    component: ControlMensajeria
  },
  {
    url: '/gestionAverias',
    component: GestionAverias
  },
  {
    url: '/gestionAverias/supplyPanel',
    component: SupplyPanel
  },
  {
    url: '/gestionAverias/resultPage',
    component: FailureResultPage
  },
  {
    url: '/gestionUsuarios',
    component: GestionUsuarios
  },
  {
    url: '/gestionUsuariosCallCenter',
    component: gestionUsuariosCallCenter
  },
  {
    url: '/signup/activate/:hash/:email',
    component: SignUpActivate
  },
  {
    url: '/signup/activate/success',
    component: SignUpActivateSuccess
  },
  {
    url: '/signup/activate/timeout',
    component: SignUpTimeOut
  },  
  {
    url: '/supplies',
    component: SuppliesList
  },
  {
    url: '/supplies/detail',
    component: SuppliesDetails
  },
   {
    url: '/supplies/alerts',
    component: Alerts
  },
  {
    url: '/suppliesVinculation',
    component: SuppliesVinculation
  },
  {
    url: '/managers',
    component: DelegatesList,
    params: 'US_MANAGER'
  },
  {
    url: '/consultants',
    component: DelegatesList,
    params: 'US_CONSULTANT'
  },
  {
    url: '/managers/add',
    component: NewDelegate,
    params: 'US_MANAGER'
  },
  {
    url: '/consultants/add',
    component: NewDelegate,
    params: 'US_CONSULTANT'
  },
  {
    url: '/managers/profile',
    component: DelegateProfile,
    params: 'US_MANAGER'
  },
  {
    url: '/consultants/profile',
    component: DelegateProfile,
    params: 'US_CONSULTANT'
  },
  {
    url: '/delegation/update/:ids/:status',
    component: DelegationUpdate
  },
  {
    url: '/delegation/success',
    component: DelegationSuccess
  },
  {
    url: '/provisionsVinculation',
    component: ProvisionsVinculation
  },
  {
    url: '/provisions',
    component: ProvisionsList
  },
  {
    url: '/provisions/bills-list',
    component: BillsList
  },
  {
    url: '/provisions/what-to-do',
    component: WhatToDo
  },
  {
    url: '/provisions/new-provision',
    component: CoverageArea
  },
  {
    url: '/provisions/new-provision/keep-in-mind',
    component: KeepInMind
  },
  
  {
    url: '/provisions/edit-provision/keep-in-mind',
    component: EditKeepInMind
  },
  {
    url: '/provisions/edit-installations/keep-in-mind',
    component: EditInstallationsKeepInMind
  },
  {
    url: '/provisions/new-generation/keep-in-mind',
    component: NewGenerationKeepInMind
  },
  {
    url: '/provisions/new-generation/questions',
    component: NewGenerationQuestions
  },  
  {
    url: '/provisions/new-provision/steps',
    component: Steps
  },
  {
    url: '/provisions/edit-provision/steps',
    component: EditSteps
  },
  {
    url: '/provisions/edit-installations/steps',
    component: EditInstallationsSteps
  },
  {
    url: '/provisions/documentation',
    component: Documentation
  },
  {
    url: '/provisions/budget',
    component: Budget
  },
  {
    url: '/provisions/payment',
    component: Payment
  },
  {
    url: '/provisions/job-execution',
    component: JobExecution
  },
  {
    url: '/provisions/application-closure',
    component: ApplicationClosure
  },
  {
    url: '/provisions/request-data',
    component: RequestData
  },
  {
    url: '/provisions/detail',
    component: ProvisionsDetails
  },
  {
    url: '/provisions/new-generation/steps',
    component: NewGenerationSteps
  },
  {
    url: '/requests',
    component: RequestsList
  },
  {
    url: '/requests/detail',
    component: RequestDetail
  },
  {
    url: '/requests/add',
    component: NewRequest
  },
  {
    url: '/notifications',
    component: Notifications
  },
  {
    url: '/notifications/detail',
    component: NotificationsDetail
  },
  {
    url: '/not-found',
    component: NotFound
  },
  {
    url: '/gdpr',
    component: Gdpr
  },
  {
    url: '/pre-signup/:hash',
    component: SignUp
  },
  {
    url: '/pre-signup',
    component: SignUp
  },
  {
    url: '/dashboard',
    component: Newdashboard
  },
  {
    url: '/politica-de-cookies',
    component: Cookies
  },
  // both welcome and what-is-new are using the same component
  {
    url: '/welcome',
    component: Carousel,
  },
  // both welcome and what-is-new are using the same component
  {
    url: '/what-is-new',
    component: Carousel,
  },
  {
    url: '/photos-poc',
    component: PhotosPocPage,
  },
  {
    url: '/version-enforcer',
    component: VersionEnforcerPage,
  },
  {
    url: '/redirect-login',
    component: AzureRedirect
  },
  {
    url: '/consultas-informes',
    component: ConsultasInformes
  },
  {
    url: '/mfa-admin',
    component: MFAdmin
  }
]
