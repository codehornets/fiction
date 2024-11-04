/* eslint-disable no-irregular-whitespace */

import { testEnvFile } from '@fiction/core/test-utils'
import { createUiTestingKit } from '@fiction/core/test-utils/kit'
import fs from 'fs-extra'
import { afterAll, describe, expect, it } from 'vitest'
import { setup as emailActionMainFileSetup } from './emailActions.main'
import { emailActionSnapshot } from './utils'

describe('email actions', async () => {
  if (!fs.existsSync(testEnvFile))
    console.warn(`missing test env file ${testEnvFile}`)

  const kit = await createUiTestingKit({ headless: false, slowMo: 0, envFiles: [testEnvFile], setup: emailActionMainFileSetup })
  const testUtils = kit.testUtils

  const initialized = await testUtils.initUser()

  const user = initialized.user

  testUtils.fictionTransactions.settings.fictionEmail.isTest = false

  afterAll(async () => {
    await testUtils.close()
    await kit.close()
  })

  it('sends email', async () => {
    const r = await testUtils.emailAction.serveSend({
      to: user.email || '',
      origin: testUtils.fictionApp.appUrl.value || '',
      recipient: user,
      queryVars: { code: user.verify?.code || '' },
    }, { server: true })

    const callbackUrl = r.emailVars?.callbackUrl || ''

    const emailHtml = r.data?.html
    expect(emailHtml).toBeDefined()
    expect(user.verify?.code).toBeDefined()
    expect(emailHtml).toContain(user.verify?.code)
    expect(emailHtml, 'contains callbackUrl').toContain(callbackUrl)
    expect(emailHtml).toContain('Email Action Heading')

    const code = user.verify?.code || ''

    if (!code)
      throw new Error('missing code')

    if (!user.email)
      throw new Error('missing email')

    const replaced = emailActionSnapshot(r.data?.html || '', r.emailVars)
    expect(replaced).toMatchInlineSnapshot(`
      "<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><tailwind-clean-component><html lang="en" dir="ltr" class=""><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><meta name="x-apple-disable-message-reformatting"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><title>Test Fiction App: Email Action Subject</title><meta name="description" content="Email Action Heading -- Email Action Subheading"/><style data-id="__vue-email-style">
                {{ generateColorStyles(false) }}
                @media (prefers-color-scheme: dark) {
                {{ generateColorStyles(true) }}
                }
                .dark { {{ generateColorStyles(true) }} }
                .light { {{ generateColorStyles(false) }} }
                tbody { font-size: 1rem; line-height: 1.65; }
                h1, h2 { line-height: 1.2; }
                h3, h4, h5 { line-height: 1.4; }
                h5, h6 { font-weight: bold; }
                ol, ul, dd, dt { font-size: 1rem; line-height: 1.65; }
                dt { font-weight: bold; margin-top: 0.5rem; }
                dd { margin-inline-start: 1.5rem; }
                ul, ol { padding-inline-start: 1.5rem; }
                img, figure { max-width: 100%; height: auto; }
                img[data-emoji] { display: inline; }
                figure img { border-radius: .5rem; display: block; }
                figcaption { font-size: 0.8rem; text-align: center; color: #666; margin-top: 0.5rem; }
                a { transition: opacity 0.2s; }
                a:hover { opacity: 0.8; }
              </style></head><div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0;">Email Action Heading -- Email Action Subheading<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div></div><body style="font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;;"><table align="center" width="100%" role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width:37.5em; padding-top: 2rem;
          padding-bottom: 2rem; padding-left: 1rem;
          padding-right: 1rem; max-width: 600px;" class="py-8 px-4 max-w-[600px]"><tbody><tr style="width: 100%"><td><table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:24px;"><tbody><tr><td/><td role="presentation" class="w-[22px]" style="width: 22px;"><a href="https://www.fiction.com"><img style="display:block;outline:none;border:none;text-decoration:none; border-radius: 0.375rem; border-width: 2px !important; border-color: rgb(255,255,255,0.1) !important; border-style: solid !important;" src="https://media.fiction.com/fiction-relative-media/med66f2033d4a0726d689e49015-fiction-icon.png?blurhash=U9EMLDD%2500%3Fb9FWBay%25M00Rj%7Eqxu_3%25Mt74n" width="22" class="rounded-md !border-2 !border-white/10 !border-solid"/></a></td><td role="presentation" class="pl-3" style="padding-left: 0.75rem;"><a href="https://www.fiction.com" class="text-inherit font-normal text-[14px] no-underline" style="color: inherit; font-weight: 400; font-size: 14px; text-decoration-line: none;">Fiction</a></td></tr></tbody></table></td></tr></tbody></table><table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="font:'Geist', -apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif,&quot;Apple Color Emoji&quot;,&quot;Segoe UI Emoji&quot;;"><tbody><tr><td><h1 style="margin:0 0 0 0;font-weight:bold;font-size:24px;line-height:1.2;" data-test-id="email-title" data-heading="Email Action Heading">Email Action Heading</h1><h3 style="margin:0 0 0 0;font-weight:normal;font-size:24px;line-height:1.33; margin-top: 0px;
          margin-bottom: 0px; opacity: 0.6;" data-test-id="email-sub-title" class="my-0 opacity-60"><span>Email Action Subheading</span> <span class="opacity-40" style="opacity: 0.4;">↘</span></h3></td></tr></tbody></table><hr style="width:100%;border:none;border-top:1px solid #eaeaea;margin:32px 0;"/><div data-test-id="email-content" class="body-content"><p style="font-size:1.1rem;line-height:1.65;font-weight:normal">Email Action Body Markdown</p>
      </div><table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" class="mt-8 mb-8 text-left" style="margin-top: 2rem; margin-bottom: 2rem; text-align: left;"><tbody><tr><td><table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block;"><tbody><tr><td></td><td role="presentation" class=""><a style="line-height:100%;text-decoration:none;display:inline-block;max-width:100%;padding:0px 0px 0px 0px;white-space:nowrap; background-color: rgb(30,32,38,0.7); color: rgb(255,255,255); padding-top: 0.75rem;
          padding-bottom: 0.75rem; padding-left: 1rem;
          padding-right: 1rem; border-radius: 0.375rem; font-size: 16px; border-radius: 9999px; font-weight: 500; user-select: none;" href="http://localhost:[port]/__transaction/test-action?code=[code]&token=[token]&email=[email]&userId=[userId]" class="hover:opacity-80">Verify Email</a></td></tr></tbody></table></td></tr></tbody></table><hr style="width:100%;border:none;border-top:1px solid #eaeaea; margin-top: 3rem;
          margin-bottom: 3rem;" class="my-12"/><table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" class="subtle-text text-normal" style="margin-top: 2rem; text-align: left; font-size: 0.75rem;
          line-height: 1rem;"><tbody><tr><td/><td role="presentation" class="w-[65%] align-top" style="width: 65%; vertical-align: top;"><img style="display: block; outline: none; border: none; text-decoration: none" src="https://media.fiction.com/fiction-relative-media/med66f2033efae31d14b773375d-fiction-email-footer.png?blurhash=U2DS%5D%5D%7Eq00_N00_4%25M4n00_N%3FcIU%7Eq9F%25M-%3B" width="80" alt="Brand Yourself with Fiction"/><p style="font-size:14px;line-height:24px;margin:16px 0;"><a class="text-normal hover:opacity-80" href="https://www.fiction.com" style="margin-top: 1rem; text-decoration-line: none; color: inherit; opacity: 0.4;">Brand Yourself with Fiction ↗ </a></p></td><td role="presentation" class="w-[35%] text-right align-top text-xs" style="width: 35%; text-align: right; vertical-align: top; font-size: 0.75rem;
          line-height: 1rem;"><!--v-if--><!--v-if--></td></tr></tbody></table></body></html></tailwind-clean-component>"
    `)

    await kit.performActions({
      caller: 'emailActions',
      path: new URL(callbackUrl).pathname,
      actions: [
        { type: 'visible', selector: `[data-action-id="${testUtils.emailAction.settings.actionId}"]` },
      ],
    })
  })
})
