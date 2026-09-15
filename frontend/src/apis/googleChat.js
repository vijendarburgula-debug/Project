// Google Chat API v1 reference — https://developers.google.com/workspace/chat/api/reference/rest/v1
// Path params below take just the trailing ID (e.g. "AAAAAAAAAAA"), matching
// how Google Chat resource names work: spaces/{space}, spaces/{space}/messages/{message}, etc.

export const googleChatAPIs = [

  // ── SPACES ────────────────────────────────────────────────────────────────
  {
    id: 'spaces-list',
    group: 'Spaces',
    name: 'List Spaces',
    method: 'GET',
    baseUrl: 'https://chat.googleapis.com/v1/spaces',
    description: 'Returns all spaces (rooms and direct messages) the authenticated user is a member of.',
    params: [
      { key: 'pageSize',  type: 'query', required: false, hint: 'e.g. 100', description: 'Max spaces per page (max 1000).' },
      { key: 'pageToken', type: 'query', required: false, hint: 'e.g. <nextPageToken from previous response>', description: 'Pagination token.' },
      { key: 'filter',    type: 'query', required: false, hint: "e.g. spaceType = \"SPACE\"", description: 'Filter by spaceType: SPACE, GROUP_CHAT, or DIRECT_MESSAGE.' },
    ],
  },
  {
    id: 'spaces-get',
    group: 'Spaces',
    name: 'Get Space',
    method: 'GET',
    baseUrl: 'https://chat.googleapis.com/v1/spaces/{spaceId}',
    description: 'Returns details for a specific space — display name, type, description.',
    params: [
      { key: 'spaceId', type: 'path', required: true, hint: 'e.g. AAAAAAAAAAA', description: 'Space ID (without the "spaces/" prefix).' },
    ],
  },

  // ── MEMBERS ───────────────────────────────────────────────────────────────
  {
    id: 'members-list',
    group: 'Members',
    name: 'List Members',
    method: 'GET',
    baseUrl: 'https://chat.googleapis.com/v1/spaces/{spaceId}/members',
    description: 'Returns all members (and invitees) of a space.',
    params: [
      { key: 'spaceId',     type: 'path',  required: true,  hint: 'e.g. AAAAAAAAAAA', description: 'Space ID.' },
      { key: 'pageSize',    type: 'query', required: false, hint: 'e.g. 100', description: 'Max members per page (max 1000).' },
      { key: 'pageToken',   type: 'query', required: false, hint: 'e.g. <nextPageToken from previous response>', description: 'Pagination token.' },
      { key: 'filter',      type: 'query', required: false, hint: 'e.g. role = "ROLE_MANAGER"', description: 'Filter by role or member type.' },
      { key: 'showInvited', type: 'query', required: false, hint: 'e.g. true', description: 'Include members who were invited but haven\'t joined.' },
    ],
  },
  {
    id: 'members-get',
    group: 'Members',
    name: 'Get Member',
    method: 'GET',
    baseUrl: 'https://chat.googleapis.com/v1/spaces/{spaceId}/members/{memberId}',
    description: 'Returns details for a specific membership — role, state, and user info.',
    params: [
      { key: 'spaceId',  type: 'path', required: true, hint: 'e.g. AAAAAAAAAAA', description: 'Space ID.' },
      { key: 'memberId', type: 'path', required: true, hint: 'e.g. 112233445566778899000 or a member resource ID', description: 'Membership ID.' },
    ],
  },

  // ── MESSAGES ──────────────────────────────────────────────────────────────
  {
    id: 'messages-list',
    group: 'Messages',
    name: 'List Messages',
    method: 'GET',
    baseUrl: 'https://chat.googleapis.com/v1/spaces/{spaceId}/messages',
    description: 'Returns messages posted in a space.',
    params: [
      { key: 'spaceId',     type: 'path',  required: true,  hint: 'e.g. AAAAAAAAAAA', description: 'Space ID.' },
      { key: 'pageSize',    type: 'query', required: false, hint: 'e.g. 100', description: 'Max messages per page (max 1000).' },
      { key: 'pageToken',   type: 'query', required: false, hint: 'e.g. <nextPageToken from previous response>', description: 'Pagination token.' },
      { key: 'filter',      type: 'query', required: false, hint: 'e.g. createTime > "2026-01-01T00:00:00-00:00"', description: 'Filter by createTime or thread.name.' },
      { key: 'orderBy',     type: 'query', required: false, hint: 'e.g. createTime desc', description: 'Sort order.' },
      { key: 'showDeleted', type: 'query', required: false, hint: 'e.g. false', description: 'Include deleted messages.' },
    ],
  },
  {
    id: 'messages-get',
    group: 'Messages',
    name: 'Get Message',
    method: 'GET',
    baseUrl: 'https://chat.googleapis.com/v1/spaces/{spaceId}/messages/{messageId}',
    description: 'Returns a specific message — text, cards, thread, and sender info.',
    params: [
      { key: 'spaceId',   type: 'path', required: true, hint: 'e.g. AAAAAAAAAAA', description: 'Space ID.' },
      { key: 'messageId', type: 'path', required: true, hint: 'e.g. BBBBBBBBBBB.BBBBBBBBBBB', description: 'Message ID.' },
    ],
  },
  {
    id: 'attachments-get',
    group: 'Messages',
    name: 'Get Attachment',
    method: 'GET',
    baseUrl: 'https://chat.googleapis.com/v1/spaces/{spaceId}/messages/{messageId}/attachments/{attachmentId}',
    description: 'Returns metadata for a file attached to a message.',
    params: [
      { key: 'spaceId',      type: 'path', required: true, hint: 'e.g. AAAAAAAAAAA', description: 'Space ID.' },
      { key: 'messageId',    type: 'path', required: true, hint: 'e.g. BBBBBBBBBBB.BBBBBBBBBBB', description: 'Message ID.' },
      { key: 'attachmentId', type: 'path', required: true, hint: 'e.g. CCCCCCCCCCC', description: 'Attachment ID from the message payload.' },
    ],
  },

  // ── SPACE EVENTS ──────────────────────────────────────────────────────────
  {
    id: 'space-events-list',
    group: 'Space Events',
    name: 'List Space Events',
    method: 'GET',
    baseUrl: 'https://chat.googleapis.com/v1/spaces/{spaceId}/spaceEvents',
    description: 'Returns changes (messages, memberships, reactions) in a space since a given time — useful for sync/audit.',
    params: [
      { key: 'spaceId',   type: 'path',  required: true,  hint: 'e.g. AAAAAAAAAAA', description: 'Space ID.' },
      { key: 'filter',    type: 'query', required: true,  hint: 'e.g. event_types:"google.workspace.chat.message.v1.created"', description: 'Required. Event types and/or time range to filter by.' },
      { key: 'pageSize',  type: 'query', required: false, hint: 'e.g. 100', description: 'Max events per page.' },
      { key: 'pageToken', type: 'query', required: false, hint: 'e.g. <nextPageToken from previous response>', description: 'Pagination token.' },
    ],
  },
  {
    id: 'space-events-get',
    group: 'Space Events',
    name: 'Get Space Event',
    method: 'GET',
    baseUrl: 'https://chat.googleapis.com/v1/spaces/{spaceId}/spaceEvents/{spaceEventId}',
    description: 'Returns details for a specific space event.',
    params: [
      { key: 'spaceId',      type: 'path', required: true, hint: 'e.g. AAAAAAAAAAA', description: 'Space ID.' },
      { key: 'spaceEventId', type: 'path', required: true, hint: 'e.g. DDDDDDDDDDD', description: 'Space event ID.' },
    ],
  },
];
