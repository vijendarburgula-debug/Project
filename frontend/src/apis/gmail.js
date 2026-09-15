// Gmail API v1 reference — https://developers.google.com/gmail/api/reference/rest/v1
// Scoped to the signed-in user's own mailbox (userId is always "me").

export const gmailAPIs = [

  // ── PROFILE ───────────────────────────────────────────────────────────────
  {
    id: 'profile-get',
    group: 'Profile',
    name: 'Get Profile',
    method: 'GET',
    baseUrl: 'https://gmail.googleapis.com/gmail/v1/users/me/profile',
    description: 'Returns your email address, message/thread totals, and history ID.',
    params: [],
  },

  // ── LABELS ────────────────────────────────────────────────────────────────
  {
    id: 'labels-list',
    group: 'Labels',
    name: 'List Labels',
    method: 'GET',
    baseUrl: 'https://gmail.googleapis.com/gmail/v1/users/me/labels',
    description: 'Returns all labels (system and user-created) in your mailbox.',
    params: [],
  },
  {
    id: 'labels-get',
    group: 'Labels',
    name: 'Get Label',
    method: 'GET',
    baseUrl: 'https://gmail.googleapis.com/gmail/v1/users/me/labels/{id}',
    description: 'Returns details for a specific label, including unread/total message counts.',
    params: [
      { key: 'id', type: 'path', required: true, hint: 'e.g. INBOX or Label_12', description: 'Label ID.' },
    ],
  },

  // ── MESSAGES ──────────────────────────────────────────────────────────────
  {
    id: 'messages-list',
    group: 'Messages',
    name: 'List Messages',
    method: 'GET',
    baseUrl: 'https://gmail.googleapis.com/gmail/v1/users/me/messages',
    description: 'Returns message IDs matching a query. Use "Get Message" to fetch full content.',
    params: [
      { key: 'q',              type: 'query', required: false, hint: 'e.g. from:boss@company.com is:unread', description: 'Gmail search syntax.' },
      { key: 'labelIds',       type: 'query', required: false, hint: 'e.g. INBOX', description: 'Only return messages with this label.' },
      { key: 'maxResults',     type: 'query', required: false, hint: 'e.g. 50', description: 'Max messages per page (max 500).' },
      { key: 'pageToken',      type: 'query', required: false, hint: 'e.g. <nextPageToken from previous response>', description: 'Pagination token.' },
      { key: 'includeSpamTrash', type: 'query', required: false, hint: 'e.g. false', description: 'Include Spam and Trash in results.' },
    ],
  },
  {
    id: 'messages-get',
    group: 'Messages',
    name: 'Get Message',
    method: 'GET',
    baseUrl: 'https://gmail.googleapis.com/gmail/v1/users/me/messages/{id}',
    description: 'Returns a specific message — headers, body, and labels.',
    params: [
      { key: 'id',     type: 'path',  required: true,  hint: 'e.g. 18d4f1a2b3c4d5e6', description: 'Message ID.' },
      { key: 'format', type: 'query', required: false, hint: 'e.g. full', description: 'minimal, full, raw, or metadata.' },
    ],
  },
  {
    id: 'messages-attachments-get',
    group: 'Messages',
    name: 'Get Attachment',
    method: 'GET',
    baseUrl: 'https://gmail.googleapis.com/gmail/v1/users/me/messages/{messageId}/attachments/{id}',
    description: 'Returns the base64url-encoded data for a message attachment.',
    params: [
      { key: 'messageId', type: 'path', required: true, hint: 'e.g. 18d4f1a2b3c4d5e6', description: 'Message ID the attachment belongs to.' },
      { key: 'id',         type: 'path', required: true, hint: 'e.g. ANGjdJ8xkS...', description: 'Attachment ID from the message payload.' },
    ],
  },

  // ── THREADS ───────────────────────────────────────────────────────────────
  {
    id: 'threads-list',
    group: 'Threads',
    name: 'List Threads',
    method: 'GET',
    baseUrl: 'https://gmail.googleapis.com/gmail/v1/users/me/threads',
    description: 'Returns conversation threads matching a query.',
    params: [
      { key: 'q',          type: 'query', required: false, hint: 'e.g. subject:invoice', description: 'Gmail search syntax.' },
      { key: 'labelIds',   type: 'query', required: false, hint: 'e.g. INBOX', description: 'Only return threads with this label.' },
      { key: 'maxResults', type: 'query', required: false, hint: 'e.g. 50', description: 'Max threads per page (max 500).' },
      { key: 'pageToken',  type: 'query', required: false, hint: 'e.g. <nextPageToken from previous response>', description: 'Pagination token.' },
    ],
  },
  {
    id: 'threads-get',
    group: 'Threads',
    name: 'Get Thread',
    method: 'GET',
    baseUrl: 'https://gmail.googleapis.com/gmail/v1/users/me/threads/{id}',
    description: 'Returns all messages in a conversation thread.',
    params: [
      { key: 'id',     type: 'path',  required: true,  hint: 'e.g. 18d4f1a2b3c4d5e6', description: 'Thread ID.' },
      { key: 'format', type: 'query', required: false, hint: 'e.g. full', description: 'minimal, full, or metadata.' },
    ],
  },

  // ── DRAFTS ────────────────────────────────────────────────────────────────
  {
    id: 'drafts-list',
    group: 'Drafts',
    name: 'List Drafts',
    method: 'GET',
    baseUrl: 'https://gmail.googleapis.com/gmail/v1/users/me/drafts',
    description: 'Returns all draft messages in your mailbox.',
    params: [
      { key: 'maxResults', type: 'query', required: false, hint: 'e.g. 50', description: 'Max drafts per page.' },
      { key: 'pageToken',  type: 'query', required: false, hint: 'e.g. <pageToken from previous response>', description: 'Pagination token.' },
    ],
  },
  {
    id: 'drafts-get',
    group: 'Drafts',
    name: 'Get Draft',
    method: 'GET',
    baseUrl: 'https://gmail.googleapis.com/gmail/v1/users/me/drafts/{id}',
    description: 'Returns a specific draft, including its message content.',
    params: [
      { key: 'id', type: 'path', required: true, hint: 'e.g. r-1234567890', description: 'Draft ID.' },
    ],
  },

  // ── HISTORY ───────────────────────────────────────────────────────────────
  {
    id: 'history-list',
    group: 'History',
    name: 'List History',
    method: 'GET',
    baseUrl: 'https://gmail.googleapis.com/gmail/v1/users/me/history',
    description: 'Returns mailbox changes (added/deleted/labeled messages) since a given history ID — useful for sync.',
    params: [
      { key: 'startHistoryId', type: 'query', required: true,  hint: 'e.g. 12345 (from Get Profile)', description: 'Return changes after this history ID.' },
      { key: 'historyTypes',   type: 'query', required: false, hint: 'e.g. messageAdded', description: 'messageAdded, messageDeleted, labelAdded, or labelRemoved.' },
      { key: 'labelId',        type: 'query', required: false, hint: 'e.g. INBOX', description: 'Only return changes for this label.' },
      { key: 'maxResults',     type: 'query', required: false, hint: 'e.g. 100', description: 'Max history records per page.' },
      { key: 'pageToken',      type: 'query', required: false, hint: 'e.g. <pageToken from previous response>', description: 'Pagination token.' },
    ],
  },

  // ── SETTINGS ──────────────────────────────────────────────────────────────
  {
    id: 'settings-get-autoforwarding',
    group: 'Settings',
    name: 'Get Auto-Forwarding Setting',
    method: 'GET',
    baseUrl: 'https://gmail.googleapis.com/gmail/v1/users/me/settings/autoForwarding',
    description: 'Returns whether your mail is being auto-forwarded, and to where.',
    params: [],
  },
  {
    id: 'settings-get-imap',
    group: 'Settings',
    name: 'Get IMAP Setting',
    method: 'GET',
    baseUrl: 'https://gmail.googleapis.com/gmail/v1/users/me/settings/imap',
    description: 'Returns whether IMAP access is enabled for your mailbox.',
    params: [],
  },
  {
    id: 'settings-get-pop',
    group: 'Settings',
    name: 'Get POP Setting',
    method: 'GET',
    baseUrl: 'https://gmail.googleapis.com/gmail/v1/users/me/settings/pop',
    description: 'Returns whether POP access is enabled for your mailbox.',
    params: [],
  },
  {
    id: 'settings-get-vacation',
    group: 'Settings',
    name: 'Get Vacation Responder',
    method: 'GET',
    baseUrl: 'https://gmail.googleapis.com/gmail/v1/users/me/settings/vacation',
    description: 'Returns your out-of-office autoresponder configuration.',
    params: [],
  },
  {
    id: 'settings-get-language',
    group: 'Settings',
    name: 'Get Language Setting',
    method: 'GET',
    baseUrl: 'https://gmail.googleapis.com/gmail/v1/users/me/settings/language',
    description: 'Returns the display language configured for your mailbox.',
    params: [],
  },

  // ── SETTINGS — FILTERS ────────────────────────────────────────────────────
  {
    id: 'filters-list',
    group: 'Settings — Filters',
    name: 'List Filters',
    method: 'GET',
    baseUrl: 'https://gmail.googleapis.com/gmail/v1/users/me/settings/filters',
    description: 'Returns all inbox filter rules (auto-archive, auto-label, auto-forward, etc.).',
    params: [],
  },
  {
    id: 'filters-get',
    group: 'Settings — Filters',
    name: 'Get Filter',
    method: 'GET',
    baseUrl: 'https://gmail.googleapis.com/gmail/v1/users/me/settings/filters/{id}',
    description: 'Returns a specific filter rule.',
    params: [
      { key: 'id', type: 'path', required: true, hint: 'e.g. ANe1BmiA1234', description: 'Filter ID.' },
    ],
  },

  // ── SETTINGS — FORWARDING ─────────────────────────────────────────────────
  {
    id: 'forwarding-addresses-list',
    group: 'Settings — Forwarding',
    name: 'List Forwarding Addresses',
    method: 'GET',
    baseUrl: 'https://gmail.googleapis.com/gmail/v1/users/me/settings/forwardingAddresses',
    description: 'Returns all addresses your mailbox is allowed to auto-forward to.',
    params: [],
  },
  {
    id: 'forwarding-addresses-get',
    group: 'Settings — Forwarding',
    name: 'Get Forwarding Address',
    method: 'GET',
    baseUrl: 'https://gmail.googleapis.com/gmail/v1/users/me/settings/forwardingAddresses/{forwardingEmail}',
    description: 'Returns the verification status of a specific forwarding address.',
    params: [
      { key: 'forwardingEmail', type: 'path', required: true, hint: 'e.g. backup@example.com', description: 'The forwarding address to look up.' },
    ],
  },

  // ── SETTINGS — SEND AS ────────────────────────────────────────────────────
  {
    id: 'sendas-list',
    group: 'Settings — Send As',
    name: 'List Send-As Aliases',
    method: 'GET',
    baseUrl: 'https://gmail.googleapis.com/gmail/v1/users/me/settings/sendAs',
    description: 'Returns all "send mail as" aliases configured for your mailbox.',
    params: [],
  },
  {
    id: 'sendas-get',
    group: 'Settings — Send As',
    name: 'Get Send-As Alias',
    method: 'GET',
    baseUrl: 'https://gmail.googleapis.com/gmail/v1/users/me/settings/sendAs/{sendAsEmail}',
    description: 'Returns details for a specific send-as alias, including signature and reply-to.',
    params: [
      { key: 'sendAsEmail', type: 'path', required: true, hint: 'e.g. alias@example.com', description: 'The alias email address.' },
    ],
  },
  {
    id: 'sendas-smime-list',
    group: 'Settings — Send As',
    name: 'List S/MIME Configs for Alias',
    method: 'GET',
    baseUrl: 'https://gmail.googleapis.com/gmail/v1/users/me/settings/sendAs/{sendAsEmail}/smimeInfo',
    description: 'Returns all S/MIME configs (certificates) for a send-as alias.',
    params: [
      { key: 'sendAsEmail', type: 'path', required: true, hint: 'e.g. alias@example.com', description: 'The alias email address.' },
    ],
  },

  // ── SETTINGS — DELEGATES ──────────────────────────────────────────────────
  {
    id: 'delegates-list',
    group: 'Settings — Delegates',
    name: 'List Delegates',
    method: 'GET',
    baseUrl: 'https://gmail.googleapis.com/gmail/v1/users/me/settings/delegates',
    description: 'Returns all accounts granted delegate access to your mailbox.',
    params: [],
  },
  {
    id: 'delegates-get',
    group: 'Settings — Delegates',
    name: 'Get Delegate',
    method: 'GET',
    baseUrl: 'https://gmail.googleapis.com/gmail/v1/users/me/settings/delegates/{delegateEmail}',
    description: 'Returns the status of a specific delegate.',
    params: [
      { key: 'delegateEmail', type: 'path', required: true, hint: 'e.g. assistant@example.com', description: 'The delegate\'s email address.' },
    ],
  },
];
