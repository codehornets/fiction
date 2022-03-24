import { expect, it, describe } from "vitest"
import { setupApp } from ".."

describe("server entry handling", () => {
  it("gets entry and runs server function if exists", async () => {
    const config = await setupApp()

    expect(config.variables?.TEST_BLOG_PLUGIN).toBe(undefined)
    expect(config.server).toBe(undefined)
    expect(config.plugins).toBe(undefined)
    expect(config).toMatchInlineSnapshot(`
      {
        "routes": [
          AppRoute {
            "children": [],
            "component": [Function],
            "external": undefined,
            "icon": undefined,
            "isActive": undefined,
            "key": "home",
            "menus": [],
            "meta": undefined,
            "name": "Home",
            "parent": undefined,
            "path": "/",
            "priority": 100,
          },
          AppRoute {
            "children": [],
            "component": [Function],
            "external": undefined,
            "icon": undefined,
            "isActive": undefined,
            "key": "plugins",
            "menus": [],
            "meta": undefined,
            "name": "Plugins",
            "parent": undefined,
            "path": "/plugins",
            "priority": 100,
          },
          AppRoute {
            "children": [],
            "component": [Function],
            "external": undefined,
            "icon": undefined,
            "isActive": undefined,
            "key": "showcase",
            "menus": [],
            "meta": undefined,
            "name": "Showcase",
            "parent": undefined,
            "path": "/showcase",
            "priority": 100,
          },
          AppRoute {
            "children": [],
            "component": [Function],
            "external": undefined,
            "icon": undefined,
            "isActive": undefined,
            "key": "showcaseSingle",
            "menus": [],
            "meta": undefined,
            "name": "Showcase Item",
            "parent": undefined,
            "path": "/showcase/:slug",
            "priority": 100,
          },
          AppRoute {
            "children": [],
            "component": [Function],
            "external": undefined,
            "icon": undefined,
            "isActive": undefined,
            "key": "install",
            "menus": [],
            "meta": undefined,
            "name": "Install",
            "parent": undefined,
            "path": "/install",
            "priority": 100,
          },
          AppRoute {
            "children": [],
            "component": [Function],
            "external": undefined,
            "icon": undefined,
            "isActive": undefined,
            "key": "testing",
            "menus": [],
            "meta": undefined,
            "name": "Testing",
            "parent": undefined,
            "path": "/testing",
            "priority": 100,
          },
          AppRoute {
            "children": [
              AppRoute {
                "children": [],
                "component": [Function],
                "external": undefined,
                "icon": undefined,
                "isActive": undefined,
                "key": "blogIndex",
                "menus": [],
                "meta": undefined,
                "name": "Blog Index",
                "parent": "blog",
                "path": "/blog",
                "priority": 200,
              },
              AppRoute {
                "children": [],
                "component": [Function],
                "external": undefined,
                "icon": undefined,
                "isActive": undefined,
                "key": "blogSingle",
                "menus": [],
                "meta": undefined,
                "name": "Blog Single",
                "parent": "blog",
                "path": "/blog/:slug",
                "priority": 200,
              },
            ],
            "component": [Function],
            "external": undefined,
            "icon": undefined,
            "isActive": undefined,
            "key": "blog",
            "menus": [],
            "meta": undefined,
            "name": "Blog",
            "parent": undefined,
            "path": "/blog",
            "priority": 100,
          },
          AppRoute {
            "children": [
              AppRoute {
                "children": [],
                "component": [Function],
                "external": undefined,
                "icon": undefined,
                "isActive": undefined,
                "key": "docsIndex",
                "menus": [],
                "meta": undefined,
                "name": "Docs Index",
                "parent": "docs",
                "path": "/docs",
                "priority": 200,
              },
              AppRoute {
                "children": [],
                "component": [Function],
                "external": undefined,
                "icon": undefined,
                "isActive": undefined,
                "key": "docsSingle",
                "menus": [],
                "meta": undefined,
                "name": "Docs Single",
                "parent": "docs",
                "path": "/docs/:slug",
                "priority": 200,
              },
            ],
            "component": [Function],
            "external": undefined,
            "icon": undefined,
            "isActive": undefined,
            "key": "docs",
            "menus": [],
            "meta": undefined,
            "name": "Docs",
            "parent": undefined,
            "path": "/docs",
            "priority": 100,
          },
          AppRoute {
            "children": [],
            "component": [Function],
            "external": undefined,
            "icon": undefined,
            "isActive": undefined,
            "key": "blogIndex",
            "menus": [],
            "meta": undefined,
            "name": "Blog Index",
            "parent": "blog",
            "path": "/blog",
            "priority": 200,
          },
          AppRoute {
            "children": [],
            "component": [Function],
            "external": undefined,
            "icon": undefined,
            "isActive": undefined,
            "key": "blogSingle",
            "menus": [],
            "meta": undefined,
            "name": "Blog Single",
            "parent": "blog",
            "path": "/blog/:slug",
            "priority": 200,
          },
          AppRoute {
            "children": [],
            "component": [Function],
            "external": undefined,
            "icon": undefined,
            "isActive": undefined,
            "key": "docsIndex",
            "menus": [],
            "meta": undefined,
            "name": "Docs Index",
            "parent": "docs",
            "path": "/docs",
            "priority": 200,
          },
          AppRoute {
            "children": [],
            "component": [Function],
            "external": undefined,
            "icon": undefined,
            "isActive": undefined,
            "key": "docsSingle",
            "menus": [],
            "meta": undefined,
            "name": "Docs Single",
            "parent": "docs",
            "path": "/docs/:slug",
            "priority": 200,
          },
        ],
        "sitemaps": [
          {
            "paths": [
              "/blog/factorjs-version-3-released",
            ],
            "topic": "posts",
          },
          {
            "paths": [
              "/docs/introduction",
              "/docs/core-concepts",
              "/docs/quickstart",
              "/docs/configuration",
              "/docs/dev-server",
              "/docs/upgrading",
              "/docs/styling",
              "/docs/template",
              "/docs/meta-tags",
              "/docs/routes",
              "/docs/app-component",
              "/docs/store",
              "/docs/public-folder",
              "/docs/pre-render",
              "/docs/deploy-server",
              "/docs/endpoints",
              "/docs/server-config",
              "/docs/sitemaps",
              "/docs/using-plugins",
            ],
            "topic": "docs",
          },
        ],
      }
    `)
  })
})
