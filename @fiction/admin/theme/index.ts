import type { template as TransactionTemplate } from '@fiction/cards/page-transaction/index.js'
import type { CardFactory } from '@fiction/site/cardFactory.js'
import type { SiteUserConfig } from '@fiction/site/schema.js'
import type { Site } from '@fiction/site/site.js'
import type { authTemplate, template as dashTemplate, panelTemplate } from '../dashboard/cardDash.js'
import type { FictionAdmin } from '../index.js'
import { getCardTemplates } from '@fiction/cards'
import { safeDirname, vue } from '@fiction/core/index.js'
import { Theme } from '@fiction/site/theme.js'
import favicon from '@fiction/ui/brand/favicon.svg'
import icon from '@fiction/ui/brand/icon.png'
import shareImage from '@fiction/ui/brand/shareImage.png'
import * as dash from '../dashboard/cardDash.js'

const def = vue.defineAsyncComponent

export const fictionLogo = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" class="main-logo" viewBox="0 0 488 122"><path fill="currentColor" d="M271.21 72.237c-3.274-4.608-9.163-6.71-14.4-6.71-10.74 0-18.2 10.199-18.2 21.248 0 8.805 5.364 13.976 13.488 13.976 6.136-.179 12.058-2.383 16.889-6.29l1.837 17.051c-6.282 5.453-17.022 7.823-24.748 7.823-16.363 0-28.147-11.6-28.147-29.236 0-23.48 16.662-42.49 39.014-42.49 6.415 0 15.172 1.958 19.876 7.267l-5.609 17.36ZM305.105 48.895h14.347l-2.841 17.197h-14.214c-1.49 9.367-4.165 19.71-4.165 29.235 0 4.052 1.896 5.302 5.549 5.302a17.22 17.22 0 0 0 6.501-1.257l-1.663 17.746a62.655 62.655 0 0 1-15.298 2.238c-10.7 0-17.062-5.033-17.062-16.495 0-12.156 3.247-25.012 4.997-36.762l2.669-17.197h.04l1.351-8.667c.212-1.854.306-3.722.266-5.59a30.2 30.2 0 0 0-.266-4.299h20.981c.306 1.504.439 3.042.392 4.58a39.917 39.917 0 0 1-.539 6.298l-1.045 7.671ZM318.767 117.797a17.31 17.31 0 0 1-.539-4.889c.007-2.019.186-4.032.539-6.016l7.174-47.936c.252-1.902.392-3.818.405-5.734a29.855 29.855 0 0 0-.272-4.3h20.994a19.94 19.94 0 0 1 .406 4.616 39.674 39.674 0 0 1-.539 6.284l-7.173 47.935a39.283 39.283 0 0 0-.406 5.158 24.997 24.997 0 0 0 .406 4.889l-20.995-.007Zm20.416-76.593c-5.69 0-10.288-3.352-10.288-9.65 0-8.11 6.222-13.837 13.947-13.837 5.836 0 10.288 3.35 10.288 9.642.033 7.98-6.202 13.845-13.947 13.845ZM378.151 119.336c-16.456 0-29.159-10.198-29.159-29.07 0-24.318 16.835-42.62 39.593-42.62 16.582 0 29.159 10.322 29.159 29.235.02 24.263-16.689 42.455-39.593 42.455Zm7.839-53.814c-10.541 0-16.583 11.18-16.583 21.495 0 7.823 3.859 13.694 11.439 13.694 10.54 0 16.582-11.18 16.582-21.495.027-7.822-3.833-13.694-11.412-13.694h-.026ZM461.596 117.798a17.498 17.498 0 0 1-.539-4.89c.006-2.019.186-4.031.539-6.016l3.793-25.011c.419-2.267.645-4.567.672-6.882 0-5.734-2.17-8.941-7.992-8.941-9.476 0-12.59 9.36-13.814 17.615l-5.284 34.104H417.85l8.964-58.525c.252-1.998.386-4.004.399-6.016a29.994 29.994 0 0 0-.266-4.299h20.828a20.02 20.02 0 0 1 .406 4.622 40.605 40.605 0 0 1-.406 5.157h.133c4.877-6.71 12.057-11.043 20.322-11.043 13.262 0 19.77 6.573 19.77 20.122a56.034 56.034 0 0 1-.832 9.498l-4.744 30.472a39.268 39.268 0 0 0-.406 5.157 25.123 25.123 0 0 0 .406 4.897l-20.828-.021ZM181.593 47.795c1.125-6.813 1.837-12.574 9.968-13.776 3.015-.357 4.146-.488 6.987-.144l3.747-18.02c-4.585-.804-9.443-.68-13.548-.282-20.542 1.998-26.232 14.243-29.04 32.208H149.06l-2.149 17.828h10.134s-6.042 34.558-6.448 37.051c-.406 2.493-2.841 16.159-2.841 16.159l21.846-.316s-.373.138.752-7.107l8.158-45.766h14.859l-6.221 39.228c-.426 2.458-1.444 13.453-1.444 13.453l20.914-.158c.14-4.965.3-6.249.725-10.397.426-4.155 5.477-31.426 5.477-31.426.798-5.171 2.023-12.74 3.114-18.783.992-5.5.439-9.738.439-9.738h-34.782v-.014ZM101.983 122H50.804c-3.32 0-6.448-1.332-8.797-3.763L3.014 77.986C.065 74.95-.807 70.41.784 66.44c1.597-3.976 5.317-6.551 9.49-6.551h47.784V10.574c0-4.292 2.488-8.131 6.335-9.78 3.786-1.627 8.298-.7 11.192 2.287L114.6 43.346c2.349 2.438 3.64 5.659 3.64 9.079v52.804c-.006 9.251-7.293 16.771-16.256 16.771Zm-49.036-18.144h47.712v-49.24l-25.02-25.822v49.24H27.926l25.02 25.822Z"/></svg>`

export async function getTemplates() {
  const tpl = await getCardTemplates()
  return [...tpl, dash.template]
}

export async function getPages(args: { factory: CardFactory, site: Site }) {
  const { factory } = args
  return [
    await factory.fromTemplate<typeof dashTemplate>({
      regionId: 'main',
      templateId: 'dash',
      slug: '_404',
      title: 'Not Found (404)',
      cards: [
        await factory.fromTemplate({ templateId: 'card404ErrorV1' }),
      ],
    }),
    await factory.fromTemplate<typeof dashTemplate>({
      templateId: 'dash',
      slug: 'settings',
      title: `Settings`,
      userConfig: { navIcon: 'i-tabler-settings', navIconAlt: 'i-tabler-settings-filled' },
      cards: [
        await factory.fromTemplate({
          el: def(async () => import('../settings/SettingsMain.vue')),
          cards: [
            await factory.fromTemplate<typeof panelTemplate>({
              slug: '_home',
              title: 'Organization Settings',
              description: 'Manage your organization profile, branding, and general preferences',
              el: def(async () => import('../settings/PanelOrganization.vue')),
              userConfig: { isNavItem: true, navIcon: 'i-tabler-building', navIconAlt: 'i-tabler-building-cog' },
            }),
            await factory.fromTemplate<typeof panelTemplate>({
              slug: 'account',
              title: 'Personal Account',
              description: 'Manage your profile, security settings, and preferences',
              el: def(async () => import('../settings/PanelAccount.vue')),
              userConfig: { isNavItem: true, navIcon: 'i-tabler-user-circle', navIconAlt: 'i-tabler-user-cog' },
            }),
            await factory.fromTemplate<typeof panelTemplate>({
              slug: 'team',
              title: 'Team Management',
              description: 'Manage team members, roles, and permissions',
              el: def(async () => import('../settings/PanelTeam.vue')),
              userConfig: { isNavItem: true, navIcon: 'i-tabler-users-group' },
            }),
            await factory.fromTemplate<typeof panelTemplate>({
              slug: 'team-member',
              title: 'Team Member Details',
              description: 'View and edit individual team member settings and roles',
              el: def(async () => import('../settings/PanelTeamMember.vue')),
              userConfig: { isNavItem: false, navIcon: 'i-tabler-users-group', parentItemId: 'team' },
            }),
            await factory.fromTemplate<typeof panelTemplate>({
              slug: 'billing',
              title: 'Billing & Subscription',
              description: 'Manage subscriptions, payment methods, and billing history',
              el: def(async () => import('../settings/PanelBilling.vue')),
              userConfig: { isNavItem: true, navIcon: 'i-tabler-credit-card', navIconAlt: 'i-tabler-credit-card-filled' },
            }),
            await factory.fromTemplate<typeof panelTemplate>({
              slug: 'developer',
              title: 'Developer Tools',
              description: 'Access API keys, documentation, and technical resources',
              el: def(async () => import('../settings/PanelDev.vue')),
              userConfig: { isNavItem: true, navIcon: 'i-tabler-code-circle', navIconAlt: 'i-tabler-code-circle-filled' },
            }),
            await factory.fromTemplate<typeof panelTemplate>({
              slug: 'manage-organizations',
              title: 'Change Organization',
              description: 'Manage and change active organization',
              el: def(async () => import('../settings/PanelManageOrg.vue')),
              userConfig: { isNavItem: true, navIcon: 'i-tabler-refresh', navIconAlt: 'i-tabler-refresh' },
            }),
          ],
        }),
      ],
    }),
    await factory.fromTemplate<typeof TransactionTemplate>({
      templateId: 'cardTransactionViewV1',
      slug: 'auth',
      title: 'Settings',
      cards: [
        await factory.fromTemplate<typeof authTemplate>({
          el: def(async () => import('../auth/AuthCard.vue')),
          userConfig: {
            logo: { format: 'html' as const, html: fictionLogo },
            standard: { spaceSize: 'none', showOnSingle: true },
          },
        }),
      ],
    }),
  ]
}

export const theme = new Theme({
  root: safeDirname(import.meta.url),
  themeId: 'admin',
  title: 'Admin',
  version: '1.0.0',
  getTemplates: async () => await getTemplates(),
  isPublic: false,
  getConfig: async (args) => {
    const { factory, site } = args
    const pg = await getPages(args)
    const service = site.fictionSites.fictionEnv.getService<{ fictionAdmin: FictionAdmin }>()

    const adminPages = await service.fictionAdmin.getAdminPages({ factory })
    const pages = [...pg, ...adminPages]
    return {
      pages,
      sections: {},
      userConfig: {
        site: {
          shareImage: { url: shareImage, format: 'image' },
          favicon: { url: favicon, format: 'image' },
          icon: { url: icon, format: 'image' },
          fonts: {
            body: { family: 'Inter', stack: 'sans' },
            sans: { family: 'Inter', stack: 'sans' },
          },
          buttons: { design: 'solid', rounding: 'full', hover: 'fade' },
        },
        standard: {
          widthSize: 'sm',
          spaceSize: 'none',
        },
      } satisfies SiteUserConfig,
    }
  },
  templateDefaults: { page: 'dash', transaction: 'cardTransactionViewV1' },
  getBaseConfig: () => {
    return {
      spacing: { contentWidthSize: 'sm', spacingSize: `none` },
      brand: {
        logo: { format: 'html' as const, html: fictionLogo },
      },
    }
  },

})

// createCard({
//   templates,
//   templateId: 'dash',
//   slug: 'settings',
//   title: 'Settings',
//   cards: [
//     createCard({
//       el: def(() => import('../el/SettingsWrap.vue')),
//       cards: [
//         createCard({
//           slug: 'organization',
//           title: 'Projects',
//           el: def(() => import('./el/ViewSettingsOrg.vue')),
//           userConfig: { isNavItem: true, navIcon: 'i-tabler-cube', navIconAlt: 'i-tabler-cube-plus' },
//         }),
//         createCard({
//           slug: 'newOrg',
//           el: def(() => import('./el/ViewNewOrganization.vue')),
//           userConfig: { isNavItem: false, parentItemId: 'organization' },
//         }),
//         createCard({
//           slug: 'account',
//           el: def(() => import('./el/SettingsAccount.vue')),
//           userConfig: { isNavItem: true, navIcon: 'i-heroicons-user', navIconAlt: 'i-heroicons-user-20-solid' },
//         }),
//         createCard({
//           slug: 'team',
//           el: def(() => import('./el/ViewTeamIndex.vue')),
//           userConfig: { isNavItem: true, navIcon: 'i-heroicons-user-group', navIconAlt: 'i-heroicons-user-group-20-solid' },
//         }),
//         createCard({
//           slug: 'teamEdit',
//           el: def(() => import('./el/ViewTeamEdit.vue')),
//           userConfig: { isNavItem: false, parentItemId: 'team', navIcon: 'i-heroicons-user-group', navIconAlt: 'i-heroicons-user-group-20-solid' },
//         }),
//         createCard({
//           slug: 'teamInvite',
//           el: def(() => import('./el/ViewTeamInvite.vue')),
//           userConfig: { isNavItem: false, parentItemId: 'team', navIcon: 'i-heroicons-user-group', navIconAlt: 'i-heroicons-user-group-20-solid' },
//         }),

//         createCard({
//           slug: 'billing',
//           el: def(() => import('./el/ViewSettingsBilling.vue')),
//           userConfig: { isNavItem: true, navIcon: 'i-heroicons-credit-card', navIconAlt: 'i-heroicons-credit-card-20-solid' },
//         }),
//         createCard({
//           slug: 'billingSuccess',
//           el: def(() => import('./el/ViewBillingSuccess.vue')),
//           userConfig: { isNavItem: false, parentItemId: 'billing', navIcon: 'i-heroicons-credit-card', navIconAlt: 'i-heroicons-credit-card-20-solid' },
//         }),
//         createCard({
//           slug: 'developer',
//           el: def(() => import('./el/ViewSettingsDev.vue')),
//           userConfig: { isNavItem: true, navIcon: 'i-heroicons-code-bracket-square', navIconAlt: 'i-heroicons-code-bracket-square-20-solid' },
//         }),
//       ],
//     }),
//   ],
//   userConfig: { },
// }),
