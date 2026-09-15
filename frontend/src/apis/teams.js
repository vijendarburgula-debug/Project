// Microsoft Graph API — Microsoft Teams
// https://learn.microsoft.com/en-us/graph/api/resources/teams-api-overview
// Scoped to the signed-in user's own teams and chats (all read-only / GET).

export const teamsAPIs = [

  // ── TEAMS ─────────────────────────────────────────────────────────────────
  {
    id: 'joined-teams-list',
    group: 'Teams',
    name: 'List Joined Teams',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/me/joinedTeams',
    description: 'Returns all Teams the signed-in user is a member of.',
    params: [],
  },
  {
    id: 'team-get',
    group: 'Teams',
    name: 'Get Team',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/teams/{teamId}',
    description: 'Returns details for a specific team — display name, description, specialization.',
    params: [
      { key: 'teamId', type: 'path', required: true, hint: 'e.g. 02bd9fd6-8f93-4758-87c3-1fb73740a315', description: 'Team ID.' },
    ],
  },
  {
    id: 'team-members-list',
    group: 'Teams',
    name: 'List Team Members',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/teams/{teamId}/members',
    description: 'Returns all members and owners of a team.',
    params: [
      { key: 'teamId', type: 'path', required: true, hint: 'e.g. 02bd9fd6-8f93-4758-87c3-1fb73740a315', description: 'Team ID.' },
    ],
  },

  // ── CHANNELS ──────────────────────────────────────────────────────────────
  {
    id: 'channels-list',
    group: 'Channels',
    name: 'List Channels',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/teams/{teamId}/channels',
    description: 'Returns all channels in a team.',
    params: [
      { key: 'teamId', type: 'path', required: true, hint: 'e.g. 02bd9fd6-8f93-4758-87c3-1fb73740a315', description: 'Team ID.' },
    ],
  },
  {
    id: 'channel-get',
    group: 'Channels',
    name: 'Get Channel',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/teams/{teamId}/channels/{channelId}',
    description: 'Returns details for a specific channel — display name, description, membership type.',
    params: [
      { key: 'teamId',    type: 'path', required: true, hint: 'e.g. 02bd9fd6-8f93-4758-87c3-1fb73740a315', description: 'Team ID.' },
      { key: 'channelId', type: 'path', required: true, hint: 'e.g. 19:4a95f7d8db4c4e7fae857bcebe0623e6@thread.tacv2', description: 'Channel ID.' },
    ],
  },
  {
    id: 'channel-members-list',
    group: 'Channels',
    name: 'List Channel Members',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/teams/{teamId}/channels/{channelId}/members',
    description: 'Returns all members of a specific channel (relevant for private/shared channels).',
    params: [
      { key: 'teamId',    type: 'path', required: true, hint: 'e.g. 02bd9fd6-8f93-4758-87c3-1fb73740a315', description: 'Team ID.' },
      { key: 'channelId', type: 'path', required: true, hint: 'e.g. 19:4a95f7d8db4c4e7fae857bcebe0623e6@thread.tacv2', description: 'Channel ID.' },
    ],
  },

  // ── CHANNEL MESSAGES ──────────────────────────────────────────────────────
  {
    id: 'channel-messages-list',
    group: 'Channel Messages',
    name: 'List Channel Messages',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/teams/{teamId}/channels/{channelId}/messages',
    description: 'Returns messages posted in a channel (top-level, not thread replies).',
    params: [
      { key: 'teamId',    type: 'path',  required: true,  hint: 'e.g. 02bd9fd6-8f93-4758-87c3-1fb73740a315', description: 'Team ID.' },
      { key: 'channelId', type: 'path',  required: true,  hint: 'e.g. 19:4a95f7d8db4c4e7fae857bcebe0623e6@thread.tacv2', description: 'Channel ID.' },
      { key: '$top',      type: 'query', required: false, hint: 'e.g. 50', description: 'Max messages per page.' },
    ],
  },
  {
    id: 'channel-message-get',
    group: 'Channel Messages',
    name: 'Get Channel Message',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/teams/{teamId}/channels/{channelId}/messages/{messageId}',
    description: 'Returns a specific message posted in a channel.',
    params: [
      { key: 'teamId',    type: 'path', required: true, hint: 'e.g. 02bd9fd6-8f93-4758-87c3-1fb73740a315', description: 'Team ID.' },
      { key: 'channelId', type: 'path', required: true, hint: 'e.g. 19:4a95f7d8db4c4e7fae857bcebe0623e6@thread.tacv2', description: 'Channel ID.' },
      { key: 'messageId', type: 'path', required: true, hint: 'e.g. 1616990615113', description: 'Message ID.' },
    ],
  },
  {
    id: 'channel-message-replies-list',
    group: 'Channel Messages',
    name: 'List Message Replies',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/teams/{teamId}/channels/{channelId}/messages/{messageId}/replies',
    description: 'Returns all replies to a specific channel message (a thread).',
    params: [
      { key: 'teamId',    type: 'path', required: true, hint: 'e.g. 02bd9fd6-8f93-4758-87c3-1fb73740a315', description: 'Team ID.' },
      { key: 'channelId', type: 'path', required: true, hint: 'e.g. 19:4a95f7d8db4c4e7fae857bcebe0623e6@thread.tacv2', description: 'Channel ID.' },
      { key: 'messageId', type: 'path', required: true, hint: 'e.g. 1616990615113', description: 'Parent message ID.' },
    ],
  },

  // ── CHATS (1:1 / GROUP) ───────────────────────────────────────────────────
  {
    id: 'chats-list',
    group: 'Chats',
    name: 'List My Chats',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/me/chats',
    description: 'Returns all 1:1 and group chats the signed-in user is part of.',
    params: [
      { key: '$top', type: 'query', required: false, hint: 'e.g. 50', description: 'Max chats per page.' },
    ],
  },
  {
    id: 'chat-get',
    group: 'Chats',
    name: 'Get Chat',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/chats/{chatId}',
    description: 'Returns details for a specific chat — type, topic, creation date.',
    params: [
      { key: 'chatId', type: 'path', required: true, hint: 'e.g. 19:2da4c29f6d7041eca70b625b91280435@thread.v2', description: 'Chat ID.' },
    ],
  },
  {
    id: 'chat-messages-list',
    group: 'Chats',
    name: 'List Chat Messages',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/chats/{chatId}/messages',
    description: 'Returns messages posted in a 1:1 or group chat.',
    params: [
      { key: 'chatId', type: 'path',  required: true,  hint: 'e.g. 19:2da4c29f6d7041eca70b625b91280435@thread.v2', description: 'Chat ID.' },
      { key: '$top',   type: 'query', required: false, hint: 'e.g. 50', description: 'Max messages per page.' },
    ],
  },
  {
    id: 'chat-members-list',
    group: 'Chats',
    name: 'List Chat Members',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/chats/{chatId}/members',
    description: 'Returns all participants in a chat.',
    params: [
      { key: 'chatId', type: 'path', required: true, hint: 'e.g. 19:2da4c29f6d7041eca70b625b91280435@thread.v2', description: 'Chat ID.' },
    ],
  },
];
