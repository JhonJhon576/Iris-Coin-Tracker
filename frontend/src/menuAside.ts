import * as icon from '@mdi/js';
import { MenuAsideItem } from './interfaces'

const menuAside: MenuAsideItem[] = [
  {
    href: '/dashboard',
    icon: icon.mdiViewDashboardOutline,
    label: 'Dashboard',
  },

  {
    href: '/users/users-list',
    label: 'Users',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiAccountGroup ?? icon.mdiTable,
    permissions: 'READ_USERS'
  },
  {
    href: '/alerts/alerts-list',
    label: 'Alerts',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiAlertCircle' in icon ? icon['mdiAlertCircle' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_ALERTS'
  },
  {
    href: '/anomalies/anomalies-list',
    label: 'Anomalies',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiAlert' in icon ? icon['mdiAlert' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_ANOMALIES'
  },
  {
    href: '/data_sources/data_sources-list',
    label: 'Data sources',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiDatabase' in icon ? icon['mdiDatabase' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_DATA_SOURCES'
  },
  {
    href: '/scraping_tasks/scraping_tasks-list',
    label: 'Scraping tasks',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: 'mdiCalendarClock' in icon ? icon['mdiCalendarClock' as keyof typeof icon] : icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_SCRAPING_TASKS'
  },
  {
    href: '/pots/pots-list',
    label: 'Pots',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    icon: icon.mdiTable ?? icon.mdiTable,
    permissions: 'READ_POTS'
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: icon.mdiAccountCircle,
  },

 {
    href: '/api-docs',
    target: '_blank',
    label: 'Swagger API',
    icon: icon.mdiFileCode,
    permissions: 'READ_API_DOCS'
  },
]

export default menuAside
