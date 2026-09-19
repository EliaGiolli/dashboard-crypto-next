import DrawerDashboardMenu from './DrawerDashboardMenu'
import Sidebar from './Sidebar'
import type { CryptoMarket } from '../types'

interface SidebarWrapperProps {
  markets: CryptoMarket[]
}

/**
 * Renders both the desktop sidebar and the mobile drawer and lets CSS decide
 * which is visible.
 *
 * It used to pick between them with `useMediaQuery('(min-width: 1024px)')`
 * from usehooks-ts, which returns `false` until it resolves in the browser —
 * so neither one appeared on first paint. A media query is a styling
 * decision and belongs in the stylesheet.
 */
export default function SidebarWrapper({ markets }: SidebarWrapperProps) {
  return (
    <>
      <Sidebar markets={markets} />
      <DrawerDashboardMenu markets={markets} />
    </>
  )
}
