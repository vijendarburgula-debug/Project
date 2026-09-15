// Quick-reference for getting a Bearer token per service — scopes needed and
// where to actually generate one. This app never fetches tokens itself; it's
// a pure pass-through proxy, so the token always has to come from somewhere else.

export const TOKEN_HELP = {
  'google-my-drive': {
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    linkLabel: 'OAuth Playground',
    link: 'https://developers.google.com/oauthplayground',
    note: 'Pick the scope above on the left, authorize, then exchange for an access token.',
  },
  'google-shared-drive': {
    scopes: ['https://www.googleapis.com/auth/drive.readonly (or the full https://www.googleapis.com/auth/drive scope for useDomainAdminAccess)'],
    linkLabel: 'OAuth Playground',
    link: 'https://developers.google.com/oauthplayground',
    note: 'Domain-wide "list every shared drive" calls need a Workspace super admin token.',
  },
  gmail: {
    scopes: [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.settings.basic',
      'https://www.googleapis.com/auth/gmail.settings.sharing',
    ],
    linkLabel: 'OAuth Playground',
    link: 'https://developers.google.com/oauthplayground',
    note: 'settings.sharing is only needed for the Delegates / Forwarding / S-MIME groups.',
  },
  'google-chat': {
    scopes: [
      'https://www.googleapis.com/auth/chat.spaces.readonly',
      'https://www.googleapis.com/auth/chat.messages.readonly',
      'https://www.googleapis.com/auth/chat.memberships.readonly',
    ],
    linkLabel: 'OAuth Playground',
    link: 'https://developers.google.com/oauthplayground',
    note: 'Space Events calls need the same scopes plus the space to have events enabled for your app.',
  },
  outlook: {
    scopes: ['Mail.Read', 'MailboxSettings.Read', 'Calendars.Read', 'Contacts.Read'],
    linkLabel: 'Graph Explorer',
    link: 'https://developer.microsoft.com/en-us/graph/graph-explorer',
    note: 'Sign in, tick the scopes under "Modify permissions", then copy the access token from the Access token tab.',
  },
  onedrive: {
    scopes: ['Files.Read.All', 'User.Read.All'],
    linkLabel: 'Graph Explorer',
    link: 'https://developer.microsoft.com/en-us/graph/graph-explorer',
    note: 'User.Read.All is only needed for the Users group (looking up whose drive to open).',
  },
  sharepoint: {
    scopes: ['Sites.Read.All', 'Group.Read.All'],
    linkLabel: 'Graph Explorer',
    link: 'https://developer.microsoft.com/en-us/graph/graph-explorer',
    note: 'Group.Read.All covers the Groups tab; Sites.Read.All covers everything else.',
  },
  teams: {
    scopes: ['Team.ReadBasic.All', 'Channel.ReadBasic.All', 'ChannelMessage.Read.All', 'Chat.Read', 'ChatMember.Read'],
    linkLabel: 'Graph Explorer',
    link: 'https://developer.microsoft.com/en-us/graph/graph-explorer',
    note: 'ChannelMessage.Read.All is admin-consent-only in most tenants — an admin may need to grant it once.',
  },
  slack: {
    scopes: [
      'channels:read', 'groups:read', 'im:read', 'mpim:read',
      'channels:history', 'groups:history', 'users:read', 'team:read',
      'files:read', 'usergroups:read', 'emoji:read', 'reminders:read',
      'stars:read', 'bookmarks:read', 'dnd:read',
    ],
    linkLabel: 'Slack API Apps',
    link: 'https://api.slack.com/apps',
    note: 'Create an app → OAuth & Permissions → add scopes above → Install to Workspace → copy the Bot/User OAuth Token.',
  },
  dropbox: {
    scopes: [
      'files.metadata.read', 'files.content.read', 'sharing.read', 'account_info.read',
      '(POST is enabled here — also add files.content.write, files.metadata.write, sharing.write if you need writes)',
    ],
    linkLabel: 'Dropbox App Console',
    link: 'https://www.dropbox.com/developers/apps',
    note: 'Create an app → Permissions tab → check the scopes → Generate access token on the Settings tab for quick testing.',
  },
  box: {
    scopes: ['Read all files and folders stored in Box', 'Manage users (only if using the admin-level endpoints)'],
    linkLabel: 'Box Developer Console',
    link: 'https://app.box.com/developers/console',
    note: 'Fastest path for testing: My App → Configuration → Generate Developer Token (valid 60 minutes, no OAuth flow needed).',
  },
  egnyte: {
    scopes: ['Egnyte scopes are set per-API-key in the app registration, not via OAuth scope strings'],
    linkLabel: 'Egnyte Developer Portal',
    link: 'https://developers.egnyte.com/',
    note: 'Register an app, then complete the OAuth2 authorization-code flow to get an access token for your domain.',
  },
  sharefile: {
    scopes: ['ShareFile uses full-account OAuth2 — no granular scopes to pick'],
    linkLabel: 'ShareFile Developer Portal',
    link: 'https://developer.sharefile.com/',
    note: 'Register a client ID/secret, then use the password or authorization-code grant to get an access token.',
  },
};
