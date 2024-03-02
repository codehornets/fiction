/* tslint:disable */
/**
 * Automatically generated file, do not modify by hand.
 */

export interface CompiledServiceConfig {
  commands: 'app' | 'build' | 'dev' | 'dev-r' | 'generate' | 'render' | 'server' | 'sites'
  vars:
    | 'APP_PORT'
    | 'AWS_ACCESS_KEY'
    | 'AWS_ACCESS_KEY_SECRET'
    | 'COMMAND'
    | 'COMMAND_OPTS'
    | 'FLY_API_TOKEN'
    | 'GOOGLE_CLIENT_ID'
    | 'GOOGLE_CLIENT_SECRET'
    | 'IS_TEST'
    | 'MAILCHIMP_API_KEY'
    | 'NGROK_AUTH_TOKEN'
    | 'NODE_ENV'
    | 'OPENAI_API_KEY'
    | 'PINECONE_API_KEY'
    | 'PINECONE_ENVIRONMENT'
    | 'PINECONE_INDEX'
    | 'POSTGRES_URL'
    | 'RUNTIME_COMMIT'
    | 'RUNTIME_VERSION'
    | 'SENTRY_PUBLIC_DSN'
    | 'SERVER_PORT'
    | 'SITES_PORT'
    | 'SLACK_WEBHOOK_URL'
    | 'SMTP_HOST'
    | 'SMTP_PASSWORD'
    | 'SMTP_USER'
    | 'TOKEN_SECRET'
    | 'UNSPLASH_ACCESS_KEY'
  routes: 'engine'
  menus: ''
  endpoints:
    | 'AiCompletion'
    | 'AiImage'
    | 'CheckUsername'
    | 'CurrentUser'
    | 'FindOneOrganization'
    | 'GenerateApiSecret'
    | 'Login'
    | 'ManageCert'
    | 'ManageIndex'
    | 'ManageMedia'
    | 'ManageMemberRelation'
    | 'ManageOnboard'
    | 'ManageOrganization'
    | 'ManagePage'
    | 'ManageSite'
    | 'ManageUser'
    | 'ManageVectors'
    | 'MediaIndex'
    | 'NewVerificationCode'
    | 'OrgMembers'
    | 'OrganizationsByUserId'
    | 'ResetPassword'
    | 'SaveMedia'
    | 'SeekInviteFromUser'
    | 'SendOneTimeCode'
    | 'SetPassword'
    | 'StartNewUser'
    | 'TeamInvite'
    | 'UpdateCurrentUser'
    | 'UpdateOrganizationMemberStatus'
    | 'UserGoogleAuth'
    | 'VerifyAccountEmail'
  tables: {
    fiction_user:
      | 'userId'
      | 'email'
      | 'username'
      | 'googleId'
      | 'fullName'
      | 'firstName'
      | 'lastName'
      | 'role'
      | 'status'
      | 'site'
      | 'github'
      | 'githubFollowers'
      | 'twitter'
      | 'twitterFollowers'
      | 'facebook'
      | 'linkedin'
      | 'workSeniority'
      | 'workRole'
      | 'bio'
      | 'location'
      | 'hashedPassword'
      | 'emailVerified'
      | 'verificationCode'
      | 'codeExpiresAt'
      | 'avatarUrl'
      | 'picture'
      | 'about'
      | 'gender'
      | 'birthday'
      | 'phoneNumber'
      | 'address'
      | 'meta'
      | 'invitedById'
      | 'lastOrgId'
      | 'lastSeenAt'
      | 'isSuperAdmin'
      | 'onboard'
      | 'pushSubscription'
      | 'ip'
      | 'geo'
      | 'createdAt'
      | 'updatedAt'
    fiction_org:
      | 'orgId'
      | 'username'
      | 'orgName'
      | 'orgEmail'
      | 'orgStatus'
      | 'orgPlan'
      | 'ownerId'
      | 'avatarUrl'
      | 'customerId'
      | 'customer'
      | 'customerAuthorized'
      | 'customerIdTest'
      | 'customerTest'
      | 'lastSeenAt'
      | 'specialPlan'
      | 'apiSecret'
      | 'timezone'
      | 'dashboards'
      | 'config'
      | 'meta'
      | 'onboard'
      | 'createdAt'
      | 'updatedAt'
    fiction_org_user:
      | 'memberId'
      | 'orgId'
      | 'userId'
      | 'memberStatus'
      | 'memberAccess'
      | 'memberRole'
      | 'invitedById'
      | 'priority'
      | 'createdAt'
      | 'updatedAt'
    fiction_deleted:
      | 'deletedId'
      | 'orgId'
      | 'userId'
      | 'deletedType'
      | 'modelId'
      | 'renderId'
      | 'imageId'
      | 'collectionId'
      | 'meta'
      | 'createdAt'
      | 'updatedAt'
    fiction_media:
      | 'mediaId'
      | 'userId'
      | 'orgId'
      | 'hash'
      | 'url'
      | 'originUrl'
      | 'thumbUrl'
      | 'thumbOriginUrl'
      | 'thumbFilePath'
      | 'blurhash'
      | 'preview'
      | 'filePath'
      | 'mime'
      | 'width'
      | 'height'
      | 'orientation'
      | 'alt'
      | 'contentEncoding'
      | 'etag'
      | 'bucket'
      | 'size'
      | 'prompt'
      | 'sourceImageUrl'
      | 'createdAt'
      | 'updatedAt'
    fiction_site:
      | 'siteId'
      | 'userId'
      | 'orgId'
      | 'title'
      | 'themeId'
      | 'subDomain'
      | 'customDomains'
      | 'status'
      | 'userConfig'
      | 'editor'
      | 'sections'
      | 'createdAt'
      | 'updatedAt'
    fiction_site_pages:
      | 'cardId'
      | 'siteId'
      | 'userId'
      | 'orgId'
      | 'regionId'
      | 'layoutId'
      | 'templateId'
      | 'slug'
      | 'title'
      | 'cards'
      | 'userConfig'
      | 'isDefault'
      | 'is404'
      | 'createdAt'
      | 'updatedAt'
    fiction_site_domains:
      | 'domainId'
      | 'siteId'
      | 'hostname'
      | 'isPrimary'
      | 'dnsValidationHostname'
      | 'dnsValidationTarget'
      | 'isConfigured'
      | 'certificateAuthority'
      | 'createdAt'
      | 'updatedAt'
    [k: string]: unknown
  }
  [k: string]: unknown
}
