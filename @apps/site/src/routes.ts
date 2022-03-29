import { AppRoute } from "@factor/api"

import { routes as docsRoutes } from "../docs/routes"
import { routes as blogRoutes } from "../blog/routes"
export const routes = [
  new AppRoute({
    name: "home",
    niceName: "Home",
    path: "/",
    component: (): Promise<any> => import("./el/ViewHome.vue"),
  }),
  new AppRoute({
    name: "plugins",
    niceName: "Plugins",
    path: "/plugins",
    component: (): Promise<any> => import("./plugins/PageIndex.vue"),
  }),
  new AppRoute({
    name: "showcase",
    niceName: "Showcase",
    path: "/showcase",
    component: (): Promise<any> => import("./showcase/PageIndex.vue"),
  }),
  new AppRoute({
    name: "showcaseSingle",
    niceName: "Showcase Item",
    path: "/showcase/:slug",
    component: (): Promise<any> => import("./showcase/PageSingle.vue"),
  }),
  new AppRoute({
    name: "install",
    niceName: "Install",
    path: "/install",
    component: (): Promise<any> => import("./el/ViewInstall.vue"),
  }),
  new AppRoute({
    name: "testing",
    niceName: "Testing",
    path: "/testing",
    component: (): Promise<any> => import("./FactorTesting.vue"),
  }),
  ...blogRoutes,
  ...docsRoutes,
]
