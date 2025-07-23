import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { AppState } from '../../common/store/reducers/MainReducer'
import { BOTTOM_NAV_UNDER_DEV } from '../common/configAndConstants'
import { isMobileApp } from '../common/detectPlatform'
import { useCommonStuff } from '../common/useCommonStuff'
import { MenuItem } from './interfaces/MenuItem'
import useStyles from './MenuBottomNav.style'
import requestRoleFilter from '../../requests/components/request-filter/RequestFilter'
import { thunkGetMasterData } from '../../provisions/store/actions/ProvisionsThunkActions'

export default function useMenuBottomNavLogic(menuItems: MenuItem[]) {
  const dispatch = useDispatch()
  const classes = useStyles()
  const { someoneIsLoggedIn, mobileRes } = useCommonStuff()

  // reflects the currently selected tab (index in the menuItems array)
  const [activeTabIndex, setActiveTabIndex] = useState(undefined)
  const history = useHistory()

  // reflects if the component should be shown or not
  const [showMe, setShowMe] = useState(false)

  // reflects the count of unread requests (red badge)
  const [unreadRequests, setUnreadRequests] = useState(0)
  const requestsList = useSelector((state: any) => state.requests.list)

  // reflects the count of unread notifications (red badge)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const notificationsList = useSelector((state: any) => state.notifications.list)

  // reflects if the bottom nav is shown or not according to username type (shown for domestic users)
  const { showBottomNav } = useSelector((state: AppState) => state.bottomNav)

  const [filterList, setFilterList] = useState([])

  useEffect(() => {
    if(showMe && someoneIsLoggedIn){
      dispatch(thunkGetMasterData(
        'SERVICE_REQUEST_FILTERS',
        'ES',
        'FILTERS',
        (response) => {
          if (response && response.length > 0) {
            setFilterList(response[0].value.split(';'))
          }
        }
      ))
    }
  }, [])

  // set dinamic routes for the first 2 tabs
  const adminToken = useSelector((state: AppState) => state.admin.token)
  const userRoles = useSelector((state: AppState) => state.user.profile.roles)
  const [dinamicRoutesSetted, setDinamicRoutesSetted] = useState(false)
  useEffect(() => {
    // if (!adminToken || !userRoles) return
    const userRolesArray = userRoles.split(',')
    const suppliesRoute =
      adminToken || userRolesArray.includes('US_SUPPLYPOINT_CLIENT') ? '/supplies' : '/suppliesVinculation'
    const provisionsRoute =
      adminToken || userRolesArray.includes('US_DOSSIER_CLIENT') ? '/provisions' : '/provisionsVinculation'
    menuItems[0].route = suppliesRoute
    menuItems[1].route = provisionsRoute
    setDinamicRoutesSetted(true)
  }, [adminToken, menuItems, userRoles])

  // keep showMe updated
  useEffect(() => {
    // Show it only when a domestic user is logged in on mobile apps with mobile view,
    // unless the flag BOTTOM_NAV_UNDER_DEV is raised, then it will be shown on web too.
    // (adding mobile view condition might seem redundant, the purpose is to hide it for native apps on tablets)

    setShowMe(
      BOTTOM_NAV_UNDER_DEV
        ? mobileRes && someoneIsLoggedIn && dinamicRoutesSetted
        : isMobileApp() && mobileRes && someoneIsLoggedIn && showBottomNav && dinamicRoutesSetted
    )
  }, [mobileRes, someoneIsLoggedIn, showBottomNav, dinamicRoutesSetted])

  // keep activeTabIndex updated (when the route changes)
  useEffect(() => {
    // read the current route from the history object, this is useful when the user refreshes the page or enters the url directly
    const index = menuItems.findIndex((item) => history.location.pathname.startsWith(item.route))
    setActiveTabIndex(index)

    // create a listener for subsequent route changes (when the user navigates via the menus)
    // this works both for navigation via BottomNavigation and via webapp menu
    const unlisten = history.listen((location, action) => {
      const index = menuItems.findIndex((item) => history.location.pathname.startsWith(item.route))
      if (activeTabIndex !== index) setActiveTabIndex(index)
    })

    // cleanup: remove the listener
    return () => {
      unlisten()
    }
  }, [])

  // keep unreadRequests updated
  useEffect(() => {
    setUnreadRequests(requestRoleFilter(requestsList.filter((item) => item.indRead === 0), filterList).length)
  }, [requestsList])

  // keep unreadNotifications updated
    useEffect(() => {
      setUnreadNotifications(notificationsList.filter(notification => notification.ind_read === '0').length)
    }, [notificationsList])

  return { showMe, activeTabIndex, classes, unreadRequests, unreadNotifications, processedMenuItems: menuItems }
}
