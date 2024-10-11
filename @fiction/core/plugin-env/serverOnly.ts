export function commonServerOnlyModules(): Record<string, true | Record<string, string>> {
  return {
    'ai': true,
    'ua-parser-js': true,
    'ffprobe': true,
    'ffprobe-static': true,
    'js-yaml': true,
    'cron': true,
    'node:inspector': true,
    'playwright': true,
    'cheerio': true,
    'xml2js': true,
    'web-push': true,
    '@slack/webhook': true,
    '@sendinblue/client': true,
    'fsevents': true,
    '@faker-js/faker': true,
    'net': true,
    'unsplashjs': true,
    'nodemon': true,
    'semver': true,
    'chokidar': true,
    '@playwright/test': true,
    'http': true,
    'enquirer': true,
    'execa': true,
    'puppeteer': true,
    'clearbit': true,
    'minimist': true,
    'knex': true,
    'knex-stringcase': true,
    'bcrypt': true,
    'chalk': true,
    'google-auth-library': true,
    'express': true,
    'multer': true,
    'multer-s3': true,
    'sharp': true,
    'fs-extra': true,
    'ws': true,
    'nodemailer': true,
    'nodemailer-html-to-text': true,
    'prettyoutput': true,
    'consola': true,
    'jsonwebtoken': true,
    'body-parser': true,
    'cors': true,
    'helmet': true,
    'json-schema-to-typescript': true,
    'compression': true,
    'serve-favicon': true,
    'html-minifier': true,
    'serve-static': true,
    'stream': true,
    'sitemap': true,
    'glob': true,
    'vitest': true,
    '@vitejs/plugin-vue': true,
    'vite/dist/node': true,
    'stripe': true,
    'dotenv': true,
    'request-ip': true,
    'ipaddr.js': true,
    'address': true,
    'ioredis': true,
    '@aws-sdk/client-s3': true,
    '@aws-sdk/client-cloudfront': true,
    'metascraper': true,
    'metascraper-title': true,
    'metascraper-image': true,
    'metadata-scraper': true,
    'uuid-apikey': true,
    'node-fetch': true,
    '@sinclair/typebox': { Type: '{}' },
    'express-http-proxy': true,
    'http-proxy-middleware': true,
    'apicache': true,
    'lru-cache': true,
    'node-cron': true,
    'bullmq': true,
    '@tailwindcss/forms': true,
    '@tailwindcss/container-queries': true,
    'simple-oauth2': true,
    'googleapis': true,
    'ngrok': true,
    'module': {
      createRequire: '() => {}',
      Module: '{createRequire: () => {}}',
    },
    'buffer': true,
  }
}
