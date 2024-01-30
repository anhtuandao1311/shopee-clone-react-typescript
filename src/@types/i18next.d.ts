import 'i18next'
import { resources, DefaultNamespace } from '~/i18n/i18n'

declare module 'i18next' {
  interface CustomTypeOptions {
    resources: (typeof resources)['vi']
    defaultNS: typeof DefaultNamespace
  }
}
