// Slack Web API reference — https://api.slack.com/methods
// All methods are called as https://slack.com/api/{method} — Slack accepts GET
// for every read-only method (POST is only required for methods that write data).
// Auth: send your token as a Bearer token — this app's Authorization header covers it.

export const slackAPIs = [

  // ── AUTH ──────────────────────────────────────────────────────────────────
  {
    id: 'auth-test',
    group: 'Auth',
    name: 'Test Authentication',
    method: 'GET',
    baseUrl: 'https://slack.com/api/auth.test',
    description: 'Verifies your token and returns identity info — user, team, and workspace URL.',
    params: [],
  },

  // ── TEAM ──────────────────────────────────────────────────────────────────
  {
    id: 'team-info',
    group: 'Team',
    name: 'Get Team Info',
    method: 'GET',
    baseUrl: 'https://slack.com/api/team.info',
    description: 'Returns workspace details — name, domain, icon, email domain.',
    params: [
      { key: 'team', type: 'query', required: false, hint: 'e.g. T0123456', description: 'Team ID (Enterprise Grid only — omit for single workspace).' },
    ],
  },

  // ── USERS ─────────────────────────────────────────────────────────────────
  {
    id: 'users-list',
    group: 'Users',
    name: 'List Users',
    method: 'GET',
    baseUrl: 'https://slack.com/api/users.list',
    description: 'Returns all members of the workspace, including bots and deactivated users.',
    params: [
      { key: 'limit',          type: 'query', required: false, hint: 'e.g. 200', description: 'Max users per page.' },
      { key: 'cursor',         type: 'query', required: false, hint: 'e.g. <next_cursor from response_metadata>', description: 'Pagination cursor.' },
      { key: 'include_locale', type: 'query', required: false, hint: 'e.g. true', description: 'Include each user\'s locale.' },
    ],
  },
  {
    id: 'users-info',
    group: 'Users',
    name: 'Get User Info',
    method: 'GET',
    baseUrl: 'https://slack.com/api/users.info',
    description: 'Returns full profile and metadata for a specific user.',
    params: [
      { key: 'user',           type: 'query', required: true,  hint: 'e.g. U0123456', description: 'User ID.' },
      { key: 'include_locale', type: 'query', required: false, hint: 'e.g. true', description: 'Include the user\'s locale.' },
    ],
  },
  {
    id: 'users-profile-get',
    group: 'Users',
    name: 'Get User Profile',
    method: 'GET',
    baseUrl: 'https://slack.com/api/users.profile.get',
    description: 'Returns detailed profile fields for a user — display name, title, status, custom fields.',
    params: [
      { key: 'user',           type: 'query', required: false, hint: 'e.g. U0123456', description: 'User ID (defaults to the authed user).' },
      { key: 'include_labels', type: 'query', required: false, hint: 'e.g. true', description: 'Include custom profile field labels.' },
    ],
  },
  {
    id: 'users-get-presence',
    group: 'Users',
    name: 'Get User Presence',
    method: 'GET',
    baseUrl: 'https://slack.com/api/users.getPresence',
    description: 'Returns whether a user is active or away.',
    params: [
      { key: 'user', type: 'query', required: false, hint: 'e.g. U0123456', description: 'User ID (defaults to the authed user).' },
    ],
  },
  {
    id: 'users-conversations',
    group: 'Users',
    name: 'List User\'s Conversations',
    method: 'GET',
    baseUrl: 'https://slack.com/api/users.conversations',
    description: 'Returns the channels, DMs, and group DMs a user is a member of.',
    params: [
      { key: 'user',             type: 'query', required: false, hint: 'e.g. U0123456', description: 'User ID (defaults to the authed user).' },
      { key: 'types',            type: 'query', required: false, hint: 'e.g. public_channel,private_channel,mpim,im', description: 'Conversation types to include.' },
      { key: 'exclude_archived', type: 'query', required: false, hint: 'e.g. true', description: 'Exclude archived conversations.' },
      { key: 'limit',            type: 'query', required: false, hint: 'e.g. 100', description: 'Max conversations per page.' },
      { key: 'cursor',           type: 'query', required: false, hint: 'e.g. <next_cursor from response_metadata>', description: 'Pagination cursor.' },
    ],
  },

  // ── CONVERSATIONS (CHANNELS) ──────────────────────────────────────────────
  {
    id: 'conversations-list',
    group: 'Conversations',
    name: 'List Conversations',
    method: 'GET',
    baseUrl: 'https://slack.com/api/conversations.list',
    description: 'Returns all channels in the workspace — public, private, DMs, and group DMs.',
    params: [
      { key: 'types',            type: 'query', required: false, hint: 'e.g. public_channel,private_channel', description: 'Conversation types to include.' },
      { key: 'exclude_archived', type: 'query', required: false, hint: 'e.g. true', description: 'Exclude archived channels.' },
      { key: 'limit',            type: 'query', required: false, hint: 'e.g. 200', description: 'Max channels per page.' },
      { key: 'cursor',           type: 'query', required: false, hint: 'e.g. <next_cursor from response_metadata>', description: 'Pagination cursor.' },
    ],
  },
  {
    id: 'conversations-info',
    group: 'Conversations',
    name: 'Get Conversation Info',
    method: 'GET',
    baseUrl: 'https://slack.com/api/conversations.info',
    description: 'Returns metadata for a specific channel — topic, purpose, member count, creation date.',
    params: [
      { key: 'channel',            type: 'query', required: true,  hint: 'e.g. C0123456', description: 'Channel ID.' },
      { key: 'include_num_members', type: 'query', required: false, hint: 'e.g. true', description: 'Include the member count.' },
    ],
  },
  {
    id: 'conversations-history',
    group: 'Conversations',
    name: 'Get Conversation History',
    method: 'GET',
    baseUrl: 'https://slack.com/api/conversations.history',
    description: 'Returns messages posted in a channel.',
    params: [
      { key: 'channel', type: 'query', required: true,  hint: 'e.g. C0123456', description: 'Channel ID.' },
      { key: 'latest',  type: 'query', required: false, hint: 'e.g. 1710000000.000100', description: 'End of time range (message ts).' },
      { key: 'oldest',  type: 'query', required: false, hint: 'e.g. 1700000000.000000', description: 'Start of time range (message ts).' },
      { key: 'limit',   type: 'query', required: false, hint: 'e.g. 100', description: 'Max messages per page.' },
      { key: 'cursor',  type: 'query', required: false, hint: 'e.g. <next_cursor from response_metadata>', description: 'Pagination cursor.' },
    ],
  },
  {
    id: 'conversations-replies',
    group: 'Conversations',
    name: 'Get Thread Replies',
    method: 'GET',
    baseUrl: 'https://slack.com/api/conversations.replies',
    description: 'Returns all replies in a message thread.',
    params: [
      { key: 'channel', type: 'query', required: true, hint: 'e.g. C0123456', description: 'Channel ID.' },
      { key: 'ts',      type: 'query', required: true, hint: 'e.g. 1710000000.000100', description: 'Timestamp of the parent message.' },
      { key: 'limit',   type: 'query', required: false, hint: 'e.g. 100', description: 'Max replies per page.' },
      { key: 'cursor',  type: 'query', required: false, hint: 'e.g. <next_cursor from response_metadata>', description: 'Pagination cursor.' },
    ],
  },
  {
    id: 'conversations-members',
    group: 'Conversations',
    name: 'List Conversation Members',
    method: 'GET',
    baseUrl: 'https://slack.com/api/conversations.members',
    description: 'Returns the user IDs of everyone in a channel.',
    params: [
      { key: 'channel', type: 'query', required: true,  hint: 'e.g. C0123456', description: 'Channel ID.' },
      { key: 'limit',   type: 'query', required: false, hint: 'e.g. 200', description: 'Max members per page.' },
      { key: 'cursor',  type: 'query', required: false, hint: 'e.g. <next_cursor from response_metadata>', description: 'Pagination cursor.' },
    ],
  },

  // ── USER GROUPS ───────────────────────────────────────────────────────────
  {
    id: 'usergroups-list',
    group: 'User Groups',
    name: 'List User Groups',
    method: 'GET',
    baseUrl: 'https://slack.com/api/usergroups.list',
    description: 'Returns all user groups in the workspace.',
    params: [
      { key: 'include_users',    type: 'query', required: false, hint: 'e.g. true', description: 'Include each group\'s member list.' },
      { key: 'include_count',    type: 'query', required: false, hint: 'e.g. true', description: 'Include member counts.' },
      { key: 'include_disabled', type: 'query', required: false, hint: 'e.g. false', description: 'Include disabled/deleted user groups.' },
    ],
  },
  {
    id: 'usergroups-users-list',
    group: 'User Groups',
    name: 'List User Group Members',
    method: 'GET',
    baseUrl: 'https://slack.com/api/usergroups.users.list',
    description: 'Returns the members of a specific user group.',
    params: [
      { key: 'usergroup',        type: 'query', required: true,  hint: 'e.g. S0123456', description: 'User group ID.' },
      { key: 'include_disabled', type: 'query', required: false, hint: 'e.g. false', description: 'Include disabled users.' },
    ],
  },

  // ── FILES ─────────────────────────────────────────────────────────────────
  {
    id: 'files-list',
    group: 'Files',
    name: 'List Files',
    method: 'GET',
    baseUrl: 'https://slack.com/api/files.list',
    description: 'Returns files shared in the workspace, optionally filtered by user or channel.',
    params: [
      { key: 'user',    type: 'query', required: false, hint: 'e.g. U0123456', description: 'Filter to files shared by this user.' },
      { key: 'channel', type: 'query', required: false, hint: 'e.g. C0123456', description: 'Filter to files shared in this channel.' },
      { key: 'types',   type: 'query', required: false, hint: 'e.g. images,pdfs', description: 'Filter by file type.' },
      { key: 'count',   type: 'query', required: false, hint: 'e.g. 100', description: 'Max files per page.' },
      { key: 'page',    type: 'query', required: false, hint: 'e.g. 1', description: 'Page number.' },
    ],
  },
  {
    id: 'files-info',
    group: 'Files',
    name: 'Get File Info',
    method: 'GET',
    baseUrl: 'https://slack.com/api/files.info',
    description: 'Returns metadata for a specific file, including its comments.',
    params: [
      { key: 'file',  type: 'query', required: true,  hint: 'e.g. F0123456', description: 'File ID.' },
      { key: 'limit', type: 'query', required: false, hint: 'e.g. 100', description: 'Max comments per page.' },
    ],
  },

  // ── OTHER ─────────────────────────────────────────────────────────────────
  {
    id: 'emoji-list',
    group: 'Other',
    name: 'List Custom Emoji',
    method: 'GET',
    baseUrl: 'https://slack.com/api/emoji.list',
    description: 'Returns all custom emoji available in the workspace.',
    params: [],
  },
  {
    id: 'reminders-list',
    group: 'Other',
    name: 'List Reminders',
    method: 'GET',
    baseUrl: 'https://slack.com/api/reminders.list',
    description: 'Returns all reminders created by or for the authed user.',
    params: [],
  },
  {
    id: 'stars-list',
    group: 'Other',
    name: 'List Starred Items',
    method: 'GET',
    baseUrl: 'https://slack.com/api/stars.list',
    description: 'Returns messages and files starred by the authed user.',
    params: [
      { key: 'count', type: 'query', required: false, hint: 'e.g. 100', description: 'Max items per page.' },
      { key: 'page',  type: 'query', required: false, hint: 'e.g. 1', description: 'Page number.' },
    ],
  },
  {
    id: 'bookmarks-list',
    group: 'Other',
    name: 'List Bookmarks',
    method: 'GET',
    baseUrl: 'https://slack.com/api/bookmarks.list',
    description: 'Returns bookmarks attached to a channel.',
    params: [
      { key: 'channel_id', type: 'query', required: true, hint: 'e.g. C0123456', description: 'Channel ID.' },
    ],
  },
  {
    id: 'dnd-info',
    group: 'Other',
    name: 'Get Do Not Disturb Info',
    method: 'GET',
    baseUrl: 'https://slack.com/api/dnd.info',
    description: 'Returns a user\'s current Do Not Disturb status and schedule.',
    params: [
      { key: 'user', type: 'query', required: false, hint: 'e.g. U0123456', description: 'User ID (defaults to the authed user).' },
    ],
  },
];
