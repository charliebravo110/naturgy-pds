import React from 'react'
import { Badge, BottomNavigation, BottomNavigationAction } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { ReactComponent as IconBell } from '../../assets/icons/camapana.svg'
import { ReactComponent as IconBulb } from '../../assets/icons/ico_menu_bottom_tabs_bulb.svg'
import { ReactComponent as IconFolder } from '../../assets/icons/ico_menu_bottom_tabs_folder.svg'
import { ReactComponent as IconPlug } from '../../assets/icons/ico_menu_bottom_tabs_plug.svg'
import { MenuItem } from './interfaces/MenuItem'
import useMenuBottomNavLogic from './useMenuBottomNavLogic'

let unprocessedMenuItems: MenuItem[] = [
  // reminder: MUI allows between 3 and 5 items in the bottom nav
  { label: 'Suministros', route: 'DINAMICALLY SETTED IN useMenuBottomNavLogic', icon: <IconBulb /> },
  { label: 'Conexiones', route: 'DINAMICALLY SETTED IN useMenuBottomNavLogic', icon: <IconPlug /> },
  { label: 'Peticiones', route: '/requests', icon: <IconFolder />, hasBadge: true },
  { label: 'Notificaciones', route: '/notifications', icon: <IconBell />, hasBadge: true },
]

/** mobile-apps only. The logic to show it or not is inside the component */
export default function MenuBottomNav() {
  const { showMe, classes, activeTabIndex, unreadRequests, processedMenuItems, unreadNotifications } =
    useMenuBottomNavLogic(unprocessedMenuItems)

  return showMe === false ? null : (
    <>
      <div className={classes.spacerUnderFooter} />
      <BottomNavigation className={classes.bottomNav} showLabels value={activeTabIndex}>
        {processedMenuItems.map(({ label, icon, route, hasBadge }, index) => {

          //Set bullet number in specific tab
          switch (label) {
            case 'Peticiones':
              icon = hasBadge ? addBadgeToIcon(icon, unreadRequests) : icon
            break;
            case 'Notificaciones':
              icon = hasBadge ? addBadgeToIcon(icon, unreadNotifications) : icon
            break;
          }

          return (
            // To use mui bottom nav with react router, we need to use:
            // The 'component' prop with Link (from react router-dom) and the 'to' prop with the route to navigate to
            <BottomNavigationAction key={index} value={index} label={label} icon={icon} component={Link} to={route} />
          )
        })}
      </BottomNavigation>
    </>
  )

  //jsx helper
  function addBadgeToIcon(icon: JSX.Element, badgeContent: number | string) {
    return (
      <Badge badgeContent={badgeContent} color='error' overlap='circular' max={999}>
        {icon}
      </Badge>
    ) // reminder: MUI badges by default are not shown if badgeContent is 0. Color 'error' is red by default
  }
}
