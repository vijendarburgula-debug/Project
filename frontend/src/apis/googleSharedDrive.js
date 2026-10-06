// Google Drive API v3/v2 reference — https://developers.google.com/drive/api/reference/rest/v3
// Scoped to Shared Drives (formerly Team Drives) — listing drives themselves and browsing their contents.
// For the signed-in user's own My Drive, see googleMyDrive.js.

export const googleSharedDriveAPIs = [

  // ── SHARED DRIVES ─────────────────────────────────────────────────────────
  {
    id: 'drives-list-v3',
    group: 'Shared Drives',
    name: 'List Shared Drives (v3)',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v3/drives',
    description: 'Returns all shared drives the user has access to.',
    params: [
      { key: 'pageSize',  type: 'query', required: false, hint: 'e.g. 100', description: 'Max shared drives per page (1–100).' },
      { key: 'pageToken', type: 'query', required: false, hint: 'e.g. <nextPageToken from previous response>', description: 'Pagination token.' },
      { key: 'useDomainAdminAccess', type: 'query', required: false, hint: 'e.g. true', description: 'Set true to list ALL shared drives in the domain (requires admin token).' },
    ],
  },
  {
    id: 'drives-get-v3',
    group: 'Shared Drives',
    name: 'Get Shared Drive (v3)',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v3/drives/{driveId}',
    description: 'Returns metadata for a specific shared drive.',
    params: [
      { key: 'driveId', type: 'path', required: true, hint: 'e.g. 0AGtQa9Ux0mqlUk9PVA', description: 'Shared drive ID.' },
      { key: 'useDomainAdminAccess', type: 'query', required: false, hint: 'e.g. true', description: 'Admin-level access to any shared drive in the domain.' },
    ],
  },
  {
    id: 'drives-create-v3',
    group: 'Shared Drives',
    name: 'Create Shared Drive (v3)',
    method: 'POST',
    baseUrl: 'https://www.googleapis.com/drive/v3/drives',
    description: 'Creates a new shared drive.',
    params: [
      { key: 'name',        type: 'body', required: true, hint: 'e.g. Team Projects', description: 'Name for the new shared drive.' },
      { key: 'requestId',   type: 'query', required: true, hint: 'e.g. a UUID string', description: 'Idempotency key (unique UUID per request).' },
    ],
  },
  {
    id: 'drives-update-v3',
    group: 'Shared Drives',
    name: 'Update Shared Drive (v3)',
    method: 'PATCH',
    baseUrl: 'https://www.googleapis.com/drive/v3/drives/{driveId}',
    description: 'Updates a shared drive\'s name or restrictions.',
    params: [
      { key: 'driveId', type: 'path', required: true, hint: 'e.g. 0AGtQa9Ux0mqlUk9PVA', description: 'Shared drive ID.' },
      { key: 'name',    type: 'body', required: false, hint: 'e.g. Renamed Drive', description: 'New drive name.' },
    ],
  },
  {
    id: 'drives-delete-v3',
    group: 'Shared Drives',
    name: 'Delete Shared Drive (v3)',
    method: 'DELETE',
    baseUrl: 'https://www.googleapis.com/drive/v3/drives/{driveId}',
    description: 'Permanently deletes an empty shared drive.',
    params: [
      { key: 'driveId', type: 'path', required: true, hint: 'e.g. 0AGtQa9Ux0mqlUk9PVA', description: 'Shared drive ID.' },
    ],
  },
  {
    id: 'drives-list-v2',
    group: 'Shared Drives',
    name: 'List Shared Drives (v2)',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v2/drives',
    description: 'Lists shared drives accessible to the user using Drive v2.',
    params: [
      { key: 'maxResults', type: 'query', required: false, hint: 'e.g. 100', description: 'Max drives to return.' },
      { key: 'pageToken',  type: 'query', required: false, hint: 'e.g. <pageToken from previous response>', description: 'Pagination token.' },
    ],
  },

  // ── FILES IN SHARED DRIVE ─────────────────────────────────────────────────
  {
    id: 'shared-drive-files-list',
    group: 'Files in Shared Drive',
    name: 'List Files in Shared Drive',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v3/files',
    description: 'Lists files inside a specific shared drive. Requires driveId — get it from "List Shared Drives".',
    params: [
      { key: 'driveId',    type: 'query', required: true,  hint: 'e.g. 0AGtQa9Ux0mqlUk9PVA', description: 'The shared drive to search within.' },
      { key: 'corpora',    type: 'query', required: true,  hint: 'drive', description: 'Must be "drive" to scope results to driveId.' },
      { key: 'includeItemsFromAllDrives', type: 'query', required: true, hint: 'true', description: 'Required — must be true for Shared Drive results.' },
      { key: 'supportsAllDrives', type: 'query', required: true, hint: 'true', description: 'Required — must be true for Shared Drive access.' },
      { key: 'q',          type: 'query', required: false, hint: "e.g. mimeType != 'application/vnd.google-apps.folder'", description: 'Drive query string to filter results.' },
      { key: 'pageSize',   type: 'query', required: false, hint: 'e.g. 100', description: 'Max files per page (1–1000).' },
      { key: 'fields',     type: 'query', required: false, hint: 'e.g. files(id,name,size,mimeType,modifiedTime)', description: 'Fields to include.' },
      { key: 'pageToken',  type: 'query', required: false, hint: 'e.g. <nextPageToken from previous response>', description: 'Pagination token.' },
    ],
  },
  {
    id: 'shared-drive-file-get',
    group: 'Files in Shared Drive',
    name: 'Get File in Shared Drive',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/{fileId}',
    description: 'Returns metadata for a specific file living inside a shared drive.',
    params: [
      { key: 'fileId', type: 'path', required: true, hint: 'e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms', description: 'Drive file or folder ID.' },
      { key: 'fields', type: 'query', required: false, hint: 'e.g. id,name,size,mimeType,modifiedTime,parents,owners', description: 'Fields to include.' },
      { key: 'supportsAllDrives', type: 'query', required: true, hint: 'true', description: 'Required for Shared Drive items.' },
    ],
  },

  {
    id: 'shared-drive-files-download',
    group: 'Files in Shared Drive',
    name: 'Download File Content',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/{fileId}',
    description: 'Downloads the actual file bytes (set alt=media). For Google Docs/Sheets/Slides, use Export instead.',
    params: [
      { key: 'fileId', type: 'path', required: true, hint: 'e.g. 1BxiMVs0XRA5nFMd...', description: 'Drive file ID.' },
      { key: 'alt', type: 'query', required: true, hint: 'media', description: 'Must be "media" to download file content.' },
      { key: 'supportsAllDrives', type: 'query', required: true, hint: 'true', description: 'Required for Shared Drive items.' },
    ],
  },

  // ── PERMISSIONS ───────────────────────────────────────────────────────────
  {
    id: 'shared-drive-permissions-list',
    group: 'Permissions',
    name: 'List Permissions (Shared Drive file)',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/{fileId}/permissions',
    description: 'Returns all sharing/permission entries for a file or folder inside a shared drive.',
    params: [
      { key: 'fileId',    type: 'path', required: true, hint: 'e.g. 1BxiMVs0XRA5nFMd...', description: 'Drive file or folder ID.' },
      { key: 'fields',    type: 'query', required: false, hint: 'e.g. permissions(id,type,role,emailAddress,displayName)', description: 'Fields to include.' },
      { key: 'supportsAllDrives', type: 'query', required: true, hint: 'true', description: 'Required for Shared Drives.' },
    ],
  },
  {
    id: 'shared-drive-permissions-get',
    group: 'Permissions',
    name: 'Get Single Permission (Shared Drive file)',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/{fileId}/permissions/{permissionId}',
    description: 'Returns details for a specific permission entry on a Shared Drive file.',
    params: [
      { key: 'fileId',       type: 'path', required: true, hint: 'e.g. 1BxiMVs0XRA5nFMd...', description: 'Drive file ID.' },
      { key: 'permissionId', type: 'path', required: true, hint: 'e.g. anyoneWithLink or specific ID', description: 'Permission ID.' },
      { key: 'supportsAllDrives', type: 'query', required: true, hint: 'true', description: 'Required for Shared Drives.' },
    ],
  },

  // ── CHANGES ───────────────────────────────────────────────────────────────
  {
    id: 'shared-drive-changes-get-start-token',
    group: 'Changes',
    name: 'Get Start Page Token (Shared Drive)',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v3/changes/startPageToken',
    description: 'Returns the current page token for tracking future changes within a specific shared drive.',
    params: [
      { key: 'driveId',           type: 'query', required: true,  hint: 'e.g. 0AGtQa9Ux0mqlUk9PVA', description: 'Shared drive to track changes for.' },
      { key: 'supportsAllDrives', type: 'query', required: true,  hint: 'true', description: 'Required for Shared Drives.' },
    ],
  },
  {
    id: 'shared-drive-changes-list',
    group: 'Changes',
    name: 'List Changes (Shared Drive)',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v3/changes',
    description: 'Returns all changes within a shared drive since a given page token.',
    params: [
      { key: 'pageToken',                 type: 'query', required: true,  hint: 'e.g. <token from getStartPageToken>', description: 'The page token from startPageToken.' },
      { key: 'driveId',                   type: 'query', required: true,  hint: 'e.g. 0AGtQa9Ux0mqlUk9PVA', description: 'Shared drive to list changes for.' },
      { key: 'includeItemsFromAllDrives', type: 'query', required: true,  hint: 'true', description: 'Required — must be true.' },
      { key: 'supportsAllDrives',         type: 'query', required: true,  hint: 'true', description: 'Required for Shared Drives.' },
      { key: 'pageSize',                  type: 'query', required: false, hint: 'e.g. 100', description: 'Max changes per page (1–1000).' },
    ],
  },

  // ── COMMENTS & REVISIONS ──────────────────────────────────────────────────
  {
    id: 'shared-drive-comments-list',
    group: 'Comments & Revisions',
    name: 'List Comments (Shared Drive file)',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/{fileId}/comments',
    description: 'Returns all comments on a file inside a shared drive.',
    params: [
      { key: 'fileId', type: 'path', required: true, hint: 'e.g. 1BxiMVs0XRA5nFMd...', description: 'Drive file ID.' },
      { key: 'fields', type: 'query', required: false, hint: 'e.g. comments(id,author,content,resolved,createdTime)', description: 'Fields to include.' },
    ],
  },
  {
    id: 'shared-drive-revisions-list',
    group: 'Comments & Revisions',
    name: 'List File Revisions (Shared Drive file)',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/{fileId}/revisions',
    description: 'Returns all revisions of a file inside a shared drive.',
    params: [
      { key: 'fileId', type: 'path', required: true, hint: 'e.g. 1BxiMVs0XRA5nFMd...', description: 'Drive file ID.' },
      { key: 'fields', type: 'query', required: false, hint: 'e.g. revisions(id,modifiedTime,lastModifyingUser,size)', description: 'Fields to include.' },
    ],
  },
];
