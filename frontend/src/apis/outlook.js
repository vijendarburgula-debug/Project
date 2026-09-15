// Microsoft Graph API — Outlook Mail, Calendar & Contacts
// https://learn.microsoft.com/en-us/graph/api/resources/mail-api-overview
// Scoped to the signed-in user's own mailbox (all paths are under /me).

export const outlookAPIs = [

  // ── MAIL — MESSAGES ───────────────────────────────────────────────────────
  {
    id: 'messages-list',
    group: 'Mail — Messages',
    name: 'List Messages',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/me/messages',
    description: 'Returns messages across all folders in your mailbox (default: Inbox-first ordering).',
    params: [
      { key: '$search',  type: 'query', required: false, hint: 'e.g. "from:boss@company.com"', description: 'Search across subject, body, sender, etc.' },
      { key: '$filter',  type: 'query', required: false, hint: "e.g. isRead eq false", description: 'OData filter.' },
      { key: '$top',     type: 'query', required: false, hint: 'e.g. 50', description: 'Max messages per page.' },
      { key: '$select',  type: 'query', required: false, hint: 'e.g. subject,from,receivedDateTime,isRead', description: 'Fields to return.' },
      { key: '$orderby', type: 'query', required: false, hint: 'e.g. receivedDateTime desc', description: 'Sort order.' },
      { key: '$skip',    type: 'query', required: false, hint: 'e.g. 50', description: 'Number of results to skip (paging).' },
    ],
  },
  {
    id: 'messages-get',
    group: 'Mail — Messages',
    name: 'Get Message',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/me/messages/{id}',
    description: 'Returns a specific message — headers, body, and metadata.',
    params: [
      { key: 'id',      type: 'path',  required: true,  hint: 'e.g. AAMkAGI2...', description: 'Message ID.' },
      { key: '$select', type: 'query', required: false, hint: 'e.g. subject,body,from,toRecipients', description: 'Fields to return.' },
    ],
  },
  {
    id: 'messages-list-in-folder',
    group: 'Mail — Messages',
    name: 'List Messages in Folder',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/me/mailFolders/{folderId}/messages',
    description: 'Returns messages within a specific mail folder (e.g. Inbox, Sent Items, or a custom folder).',
    params: [
      { key: 'folderId', type: 'path',  required: true,  hint: 'e.g. inbox, sentitems, drafts, or a folder ID', description: 'Well-known folder name or folder ID.' },
      { key: '$top',     type: 'query', required: false, hint: 'e.g. 50', description: 'Max messages per page.' },
      { key: '$filter',  type: 'query', required: false, hint: 'e.g. isRead eq false', description: 'OData filter.' },
      { key: '$orderby', type: 'query', required: false, hint: 'e.g. receivedDateTime desc', description: 'Sort order.' },
    ],
  },
  {
    id: 'messages-delta',
    group: 'Mail — Messages',
    name: 'Message Sync (Delta)',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/me/mailFolders/{folderId}/messages/delta',
    description: 'Returns messages added/changed/deleted in a folder since the last sync — for tracking mailbox activity.',
    params: [
      { key: 'folderId',    type: 'path',  required: true,  hint: 'e.g. inbox', description: 'Well-known folder name or folder ID.' },
      { key: '$deltatoken', type: 'query', required: false, hint: 'e.g. <token from previous @odata.deltaLink>', description: 'Resume from a previous delta sync.' },
    ],
  },

  // ── MAIL — ATTACHMENTS ────────────────────────────────────────────────────
  {
    id: 'attachments-list',
    group: 'Mail — Attachments',
    name: 'List Attachments',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/me/messages/{messageId}/attachments',
    description: 'Returns all attachments on a message.',
    params: [
      { key: 'messageId', type: 'path', required: true, hint: 'e.g. AAMkAGI2...', description: 'Message ID.' },
    ],
  },
  {
    id: 'attachments-get',
    group: 'Mail — Attachments',
    name: 'Get Attachment',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/me/messages/{messageId}/attachments/{id}',
    description: 'Returns a specific attachment, including its base64-encoded content.',
    params: [
      { key: 'messageId', type: 'path', required: true, hint: 'e.g. AAMkAGI2...', description: 'Message ID the attachment belongs to.' },
      { key: 'id',         type: 'path', required: true, hint: 'e.g. AAMkAGI2-attachment-id', description: 'Attachment ID.' },
    ],
  },

  // ── MAIL — FOLDERS ────────────────────────────────────────────────────────
  {
    id: 'mailfolders-list',
    group: 'Mail — Folders',
    name: 'List Mail Folders',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/me/mailFolders',
    description: 'Returns the top-level mail folders in your mailbox (Inbox, Sent Items, Drafts, custom folders, etc.).',
    params: [
      { key: '$top',    type: 'query', required: false, hint: 'e.g. 50', description: 'Max folders per page.' },
      { key: '$select', type: 'query', required: false, hint: 'e.g. displayName,totalItemCount,unreadItemCount', description: 'Fields to return.' },
    ],
  },
  {
    id: 'mailfolders-get',
    group: 'Mail — Folders',
    name: 'Get Mail Folder',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/me/mailFolders/{id}',
    description: 'Returns details for a specific mail folder, including item counts.',
    params: [
      { key: 'id', type: 'path', required: true, hint: 'e.g. inbox or a folder ID', description: 'Well-known folder name or folder ID.' },
    ],
  },
  {
    id: 'mailfolders-child-list',
    group: 'Mail — Folders',
    name: 'List Child Folders',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/me/mailFolders/{id}/childFolders',
    description: 'Returns the subfolders nested under a mail folder.',
    params: [
      { key: 'id', type: 'path', required: true, hint: 'e.g. inbox or a folder ID', description: 'Parent folder name or ID.' },
    ],
  },

  // ── MAIL — SETTINGS ───────────────────────────────────────────────────────
  {
    id: 'mailbox-settings-get',
    group: 'Mail — Settings',
    name: 'Get Mailbox Settings',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/me/mailboxSettings',
    description: 'Returns timezone, language, working hours, and automatic-replies configuration.',
    params: [],
  },
  {
    id: 'categories-list',
    group: 'Mail — Settings',
    name: 'List Categories',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/me/outlook/masterCategories',
    description: 'Returns the color-coded categories available to tag messages, events, and contacts.',
    params: [],
  },
  {
    id: 'focused-inbox-overrides',
    group: 'Mail — Settings',
    name: 'List Focused Inbox Overrides',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/me/inferenceClassification/overrides',
    description: 'Returns senders manually classified as always Focused or always Other.',
    params: [],
  },

  // ── CALENDAR ──────────────────────────────────────────────────────────────
  {
    id: 'calendars-list',
    group: 'Calendar',
    name: 'List Calendars',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/me/calendars',
    description: 'Returns all calendars in your mailbox.',
    params: [],
  },
  {
    id: 'calendar-get-default',
    group: 'Calendar',
    name: 'Get Default Calendar',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/me/calendar',
    description: 'Returns your default calendar\'s metadata.',
    params: [],
  },
  {
    id: 'events-list',
    group: 'Calendar',
    name: 'List Events',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/me/events',
    description: 'Returns upcoming and past events on your default calendar.',
    params: [
      { key: '$top',     type: 'query', required: false, hint: 'e.g. 50', description: 'Max events per page.' },
      { key: '$filter',  type: 'query', required: false, hint: "e.g. start/dateTime ge '2026-01-01'", description: 'OData filter.' },
      { key: '$orderby', type: 'query', required: false, hint: 'e.g. start/dateTime', description: 'Sort order.' },
      { key: '$select',  type: 'query', required: false, hint: 'e.g. subject,start,end,organizer,attendees', description: 'Fields to return.' },
    ],
  },
  {
    id: 'events-get',
    group: 'Calendar',
    name: 'Get Event',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/me/events/{id}',
    description: 'Returns details for a specific calendar event.',
    params: [
      { key: 'id', type: 'path', required: true, hint: 'e.g. AAMkAGI2...', description: 'Event ID.' },
    ],
  },
  {
    id: 'calendarview-list',
    group: 'Calendar',
    name: 'Calendar View (Date Range)',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/me/calendarView',
    description: 'Returns events (including expanded recurring instances) within a specific date range.',
    params: [
      { key: 'startDateTime', type: 'query', required: true,  hint: 'e.g. 2026-08-01T00:00:00Z', description: 'Start of the date range (ISO 8601).' },
      { key: 'endDateTime',   type: 'query', required: true,  hint: 'e.g. 2026-08-31T23:59:59Z', description: 'End of the date range (ISO 8601).' },
      { key: '$top',          type: 'query', required: false, hint: 'e.g. 100', description: 'Max events per page.' },
    ],
  },

  // ── CONTACTS ──────────────────────────────────────────────────────────────
  {
    id: 'contacts-list',
    group: 'Contacts',
    name: 'List Contacts',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/me/contacts',
    description: 'Returns all personal contacts saved in your mailbox.',
    params: [
      { key: '$top',    type: 'query', required: false, hint: 'e.g. 100', description: 'Max contacts per page.' },
      { key: '$filter', type: 'query', required: false, hint: "e.g. startswith(displayName,'John')", description: 'OData filter.' },
      { key: '$select', type: 'query', required: false, hint: 'e.g. displayName,emailAddresses,companyName', description: 'Fields to return.' },
    ],
  },
  {
    id: 'contacts-get',
    group: 'Contacts',
    name: 'Get Contact',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/me/contacts/{id}',
    description: 'Returns details for a specific contact.',
    params: [
      { key: 'id', type: 'path', required: true, hint: 'e.g. AAMkAGI2...', description: 'Contact ID.' },
    ],
  },
  {
    id: 'contact-folders-list',
    group: 'Contacts',
    name: 'List Contact Folders',
    method: 'GET',
    baseUrl: 'https://graph.microsoft.com/v1.0/me/contactFolders',
    description: 'Returns folders used to organize your contacts.',
    params: [],
  },
];
