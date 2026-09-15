// Google Drive API v3/v2 reference — https://developers.google.com/drive/api/reference/rest/v3
// Scoped to the signed-in user's own My Drive (files, permissions, comments, revisions, apps).
// For Shared Drives management, see googleSharedDrive.js.

export const googleMyDriveAPIs = [

  // ── ABOUT ─────────────────────────────────────────────────────────────────
  {
    id: 'about-get-v3',
    group: 'About',
    name: 'Get Drive Info (v3)',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v3/about',
    description: 'Returns info about the user, their Drive, and system capabilities — storage quota, root folder ID, etc.',
    params: [
      { key: 'fields', type: 'query', required: true, hint: 'e.g. user,storageQuota,rootFolderId', description: 'Required. Fields to return.' },
    ],
  },
  {
    id: 'about-get-v2',
    group: 'About',
    name: 'Get Drive Info (v2)',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v2/about',
    description: 'Returns user info, root folder ID, quota, and feature flags. Useful for finding the root Drive ID before listing files.',
    params: [],
  },

  // ── FILES — Read ──────────────────────────────────────────────────────────
  {
    id: 'files-list-v3',
    group: 'Files — Read',
    name: 'List Files (v3)',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v3/files',
    description: 'Returns a paginated list of files in the user\'s My Drive.',
    params: [
      { key: 'q',         type: 'query', required: false, hint: "e.g. name contains 'invoice' and trashed=false", description: 'Drive query string to filter results.' },
      { key: 'pageSize',  type: 'query', required: false, hint: 'e.g. 100', description: 'Max files per page (1–1000).' },
      { key: 'fields',    type: 'query', required: false, hint: 'e.g. files(id,name,size,mimeType,modifiedTime,parents)', description: 'Fields to include.' },
      { key: 'orderBy',   type: 'query', required: false, hint: 'e.g. modifiedTime desc', description: 'Sort order: name, modifiedTime, createdTime, etc.' },
      { key: 'pageToken', type: 'query', required: false, hint: 'e.g. <nextPageToken from previous response>', description: 'Token for next-page pagination.' },
      { key: 'corpora',   type: 'query', required: false, hint: 'e.g. user', description: 'Set to user to search only My Drive.' },
    ],
  },
  {
    id: 'files-get-v3',
    group: 'Files — Read',
    name: 'Get File Metadata (v3)',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/{fileId}',
    description: 'Returns metadata for a specific file or folder by its ID.',
    params: [
      { key: 'fileId', type: 'path', required: true, hint: 'e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms', description: 'Drive file or folder ID.' },
      { key: 'fields', type: 'query', required: false, hint: 'e.g. id,name,size,mimeType,modifiedTime,parents,webViewLink,owners', description: 'Fields to include.' },
    ],
  },
  {
    id: 'files-list-labels',
    group: 'Files — Read',
    name: 'List File Labels (v3)',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/{fileId}/listLabels',
    description: 'Returns all labels applied to a file.',
    params: [
      { key: 'fileId', type: 'path', required: true, hint: 'e.g. 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms', description: 'Drive file ID.' },
    ],
  },
  {
    id: 'files-export',
    group: 'Files — Read',
    name: 'Export Google Doc (v3)',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/{fileId}/export',
    description: 'Exports a Google Workspace document (Docs, Sheets, Slides) to another format.',
    params: [
      { key: 'fileId',   type: 'path', required: true, hint: 'e.g. 1BxiMVs0XRA5nFMd...', description: 'Google Doc/Sheet/Slide file ID.' },
      { key: 'mimeType', type: 'query', required: true, hint: 'e.g. application/pdf', description: 'Export format MIME type.' },
    ],
  },
  {
    id: 'files-generate-ids',
    group: 'Files — Read',
    name: 'Generate File IDs (v3)',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/generateIds',
    description: 'Generates a set of file IDs you can use in subsequent create or copy calls.',
    params: [
      { key: 'count', type: 'query', required: false, hint: 'e.g. 5', description: 'Number of IDs to generate (max 1000).' },
      { key: 'space', type: 'query', required: false, hint: 'e.g. drive', description: 'Namespace: drive or appDataFolder.' },
    ],
  },
  {
    id: 'files-get-v2',
    group: 'Files — Read',
    name: 'Get File / Folder Details (v2)',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v2/files/{fileId}',
    description: 'Returns metadata for a file or folder.',
    params: [
      { key: 'fileId', type: 'path', required: true, hint: 'e.g. 1zlwCR_7aIshOnAUTKazZatzWV7bLzvot', description: 'Drive file or folder ID.' },
    ],
  },
  {
    id: 'files-list-v2',
    group: 'Files — Read',
    name: 'List Files (v2)',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v2/files',
    description: 'Lists files in the user\'s My Drive using Drive v2 API.',
    params: [
      { key: 'q',          type: 'query', required: false, hint: "e.g. trashed=false and 'root' in parents", description: 'Drive v2 query string.' },
      { key: 'maxResults', type: 'query', required: false, hint: 'e.g. 100', description: 'Max files per page.' },
      { key: 'pageToken',  type: 'query', required: false, hint: 'e.g. <pageToken from previous response>', description: 'Pagination token.' },
    ],
  },
  {
    id: 'files-children-v2',
    group: 'Files — Read',
    name: 'Get Folder Children (v2)',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v2/files/{folderId}/children',
    description: 'Lists all children of a folder in My Drive. Get root folder ID from "Get Drive Info (v2)".',
    params: [
      { key: 'folderId',   type: 'path', required: true, hint: 'e.g. root', description: 'Drive folder ID. Use root for My Drive root.' },
      { key: 'maxResults', type: 'query', required: false, hint: 'e.g. 999', description: 'Max children to return.' },
      { key: 'q',          type: 'query', required: false, hint: 'e.g. trashed=false', description: 'Query to filter children.' },
      { key: 'pageToken',  type: 'query', required: false, hint: 'e.g. <pageToken from previous response>', description: 'Pagination token.' },
    ],
  },

  // ── FILES — Write ─────────────────────────────────────────────────────────
  {
    id: 'files-copy-v3',
    group: 'Files — Write',
    name: 'Copy File (v3)',
    method: 'POST',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/{fileId}/copy',
    description: 'Creates a copy of a file.',
    params: [
      { key: 'fileId',        type: 'path', required: true, hint: 'e.g. 1BxiMVs0XRA5nFMd...', description: 'File to copy.' },
      { key: 'name',          type: 'body', required: false, hint: 'e.g. Copy of report', description: 'Name for the copy.' },
      { key: 'parents',       type: 'body', required: false, hint: 'e.g. ["folder_id_here"]', description: 'Array of parent folder IDs.' },
    ],
  },
  {
    id: 'files-create-v3',
    group: 'Files — Write',
    name: 'Create File / Folder (v3)',
    method: 'POST',
    baseUrl: 'https://www.googleapis.com/drive/v3/files',
    description: 'Creates a new file or folder. For folders use mimeType application/vnd.google-apps.folder.',
    params: [
      { key: 'name',     type: 'body', required: true, hint: 'e.g. New Folder', description: 'Name of the file or folder.' },
      { key: 'mimeType', type: 'body', required: false, hint: 'e.g. application/vnd.google-apps.folder', description: 'MIME type. Use folder MIME to create a folder.' },
      { key: 'parents',  type: 'body', required: false, hint: 'e.g. ["parent_folder_id"]', description: 'Array of parent folder IDs.' },
    ],
  },
  {
    id: 'files-update-v3',
    group: 'Files — Write',
    name: 'Update File Metadata (v3)',
    method: 'PATCH',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/{fileId}',
    description: 'Updates a file\'s metadata — name, description, starred, trashed, parents (move), etc.',
    params: [
      { key: 'fileId',      type: 'path', required: true, hint: 'e.g. 1BxiMVs0XRA5nFMd...', description: 'Drive file ID.' },
      { key: 'name',        type: 'body', required: false, hint: 'e.g. Renamed File.pdf', description: 'New file name.' },
      { key: 'description', type: 'body', required: false, hint: 'e.g. Q4 report', description: 'New description.' },
      { key: 'starred',     type: 'body', required: false, hint: 'e.g. true', description: 'Star/unstar the file.' },
      { key: 'trashed',     type: 'body', required: false, hint: 'e.g. false', description: 'true = move to trash, false = restore.' },
      { key: 'addParents',  type: 'query', required: false, hint: 'e.g. folder_id_here', description: 'Add to this folder (move).' },
      { key: 'removeParents', type: 'query', required: false, hint: 'e.g. old_folder_id', description: 'Remove from this folder (move).' },
    ],
  },
  {
    id: 'files-delete-v3',
    group: 'Files — Write',
    name: 'Delete File (v3)',
    method: 'DELETE',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/{fileId}',
    description: 'Permanently deletes a file or folder (not moved to trash).',
    params: [
      { key: 'fileId', type: 'path', required: true, hint: 'e.g. 1BxiMVs0XRA5nFMd...', description: 'Drive file ID to delete.' },
    ],
  },
  {
    id: 'files-empty-trash',
    group: 'Files — Write',
    name: 'Empty Trash (v3)',
    method: 'DELETE',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/trash',
    description: 'Permanently deletes all files in the user\'s trash.',
    params: [],
  },
  {
    id: 'files-modify-labels',
    group: 'Files — Write',
    name: 'Modify File Labels (v3)',
    method: 'POST',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/{fileId}/modifyLabels',
    description: 'Adds or removes labels on a file.',
    params: [
      { key: 'fileId', type: 'path', required: true, hint: 'e.g. 1BxiMVs0XRA5nFMd...', description: 'Drive file ID.' },
      { key: 'labelModifications', type: 'body', required: true, hint: 'e.g. [{"labelId":"...", "removeLabel":false}]', description: 'Array of label modifications.' },
    ],
  },

  // ── PERMISSIONS ───────────────────────────────────────────────────────────
  {
    id: 'permissions-list-v3',
    group: 'Permissions',
    name: 'List File Permissions (v3)',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/{fileId}/permissions',
    description: 'Returns all sharing/permission entries for a file or folder.',
    params: [
      { key: 'fileId',    type: 'path', required: true, hint: 'e.g. 1BxiMVs0XRA5nFMd...', description: 'Drive file or folder ID.' },
      { key: 'fields',    type: 'query', required: false, hint: 'e.g. permissions(id,type,role,emailAddress,displayName)', description: 'Fields to include.' },
    ],
  },
  {
    id: 'permissions-get-v3',
    group: 'Permissions',
    name: 'Get Single Permission (v3)',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/{fileId}/permissions/{permissionId}',
    description: 'Returns details for a specific permission entry on a file.',
    params: [
      { key: 'fileId',       type: 'path', required: true, hint: 'e.g. 1BxiMVs0XRA5nFMd...', description: 'Drive file ID.' },
      { key: 'permissionId', type: 'path', required: true, hint: 'e.g. anyoneWithLink or specific ID', description: 'Permission ID.' },
    ],
  },
  {
    id: 'permissions-create-v3',
    group: 'Permissions',
    name: 'Create / Share Permission (v3)',
    method: 'POST',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/{fileId}/permissions',
    description: 'Adds a new sharing permission to a file or folder.',
    params: [
      { key: 'fileId',            type: 'path', required: true, hint: 'e.g. 1BxiMVs0XRA5nFMd...', description: 'Drive file ID.' },
      { key: 'type',              type: 'body', required: true, hint: 'e.g. user', description: 'user, group, domain, or anyone.' },
      { key: 'role',              type: 'body', required: true, hint: 'e.g. reader', description: 'owner, organizer, fileOrganizer, writer, commenter, or reader.' },
      { key: 'emailAddress',      type: 'body', required: false, hint: 'e.g. user@example.com', description: 'Email (for user/group types).' },
      { key: 'domain',            type: 'body', required: false, hint: 'e.g. example.com', description: 'Domain (for domain type).' },
      { key: 'sendNotificationEmail', type: 'query', required: false, hint: 'e.g. true', description: 'Send share notification email.' },
    ],
  },
  {
    id: 'permissions-update-v3',
    group: 'Permissions',
    name: 'Update Permission (v3)',
    method: 'PATCH',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/{fileId}/permissions/{permissionId}',
    description: 'Changes the role of an existing permission.',
    params: [
      { key: 'fileId',       type: 'path', required: true, hint: 'e.g. 1BxiMVs0XRA5nFMd...', description: 'Drive file ID.' },
      { key: 'permissionId', type: 'path', required: true, hint: 'e.g. 07123456789', description: 'Permission ID to update.' },
      { key: 'role',         type: 'body', required: true, hint: 'e.g. writer', description: 'New role: reader, commenter, writer.' },
    ],
  },
  {
    id: 'permissions-delete-v3',
    group: 'Permissions',
    name: 'Delete Permission (v3)',
    method: 'DELETE',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/{fileId}/permissions/{permissionId}',
    description: 'Removes a sharing permission from a file or folder.',
    params: [
      { key: 'fileId',       type: 'path', required: true, hint: 'e.g. 1BxiMVs0XRA5nFMd...', description: 'Drive file ID.' },
      { key: 'permissionId', type: 'path', required: true, hint: 'e.g. 07123456789', description: 'Permission ID to remove.' },
    ],
  },
  {
    id: 'permissions-list-v2',
    group: 'Permissions',
    name: 'List File Permissions (v2)',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v2/files/{fileId}/permissions',
    description: 'Lists all permissions on a file or folder using Drive v2.',
    params: [
      { key: 'fileId', type: 'path', required: true, hint: 'e.g. 1z39qa8SyLo6n7ehmoJeIeiZrQnKCrJ6s4jhzVdwgtMY', description: 'Drive file or folder ID.' },
    ],
  },

  // ── CHANGES ───────────────────────────────────────────────────────────────
  {
    id: 'changes-get-start-token',
    group: 'Changes',
    name: 'Get Start Page Token',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v3/changes/startPageToken',
    description: 'Returns the current page token for listing future file changes. Use this before starting a change-watch loop.',
    params: [],
  },
  {
    id: 'changes-list',
    group: 'Changes',
    name: 'List Changes',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v3/changes',
    description: 'Returns all changes since a given page token. Use to track file activity.',
    params: [
      { key: 'pageToken',  type: 'query', required: true, hint: 'e.g. <token from getStartPageToken>', description: 'The page token from startPageToken.' },
      { key: 'pageSize',   type: 'query', required: false, hint: 'e.g. 100', description: 'Max changes per page (1–1000).' },
      { key: 'fields',     type: 'query', required: false, hint: 'e.g. changes(fileId,type,time,file(name,modifiedTime))', description: 'Fields to include.' },
    ],
  },

  // ── COMMENTS ──────────────────────────────────────────────────────────────
  {
    id: 'comments-list',
    group: 'Comments',
    name: 'List Comments',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/{fileId}/comments',
    description: 'Returns all comments on a file.',
    params: [
      { key: 'fileId',    type: 'path', required: true, hint: 'e.g. 1BxiMVs0XRA5nFMd...', description: 'Drive file ID.' },
      { key: 'fields',    type: 'query', required: false, hint: 'e.g. comments(id,author,content,resolved,createdTime)', description: 'Fields to include.' },
      { key: 'includeDeleted', type: 'query', required: false, hint: 'e.g. false', description: 'Include deleted comments.' },
    ],
  },
  {
    id: 'comments-get',
    group: 'Comments',
    name: 'Get Comment',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/{fileId}/comments/{commentId}',
    description: 'Returns a specific comment on a file.',
    params: [
      { key: 'fileId',    type: 'path', required: true, hint: 'e.g. 1BxiMVs0XRA5nFMd...', description: 'Drive file ID.' },
      { key: 'commentId', type: 'path', required: true, hint: 'e.g. AAAABHmorrhc', description: 'Comment ID.' },
      { key: 'fields',    type: 'query', required: false, hint: 'e.g. id,content,resolved,author', description: 'Fields to include.' },
    ],
  },
  {
    id: 'comments-create',
    group: 'Comments',
    name: 'Create Comment',
    method: 'POST',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/{fileId}/comments',
    description: 'Adds a comment to a file.',
    params: [
      { key: 'fileId',  type: 'path', required: true, hint: 'e.g. 1BxiMVs0XRA5nFMd...', description: 'Drive file ID.' },
      { key: 'content', type: 'body', required: true, hint: 'e.g. Please review section 3', description: 'Comment text.' },
    ],
  },
  {
    id: 'comments-update',
    group: 'Comments',
    name: 'Update Comment',
    method: 'PATCH',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/{fileId}/comments/{commentId}',
    description: 'Updates the content of a comment.',
    params: [
      { key: 'fileId',    type: 'path', required: true, hint: 'e.g. 1BxiMVs0XRA5nFMd...', description: 'Drive file ID.' },
      { key: 'commentId', type: 'path', required: true, hint: 'e.g. AAAABHmorrhc', description: 'Comment ID.' },
      { key: 'content',   type: 'body', required: true, hint: 'e.g. Updated comment text', description: 'New comment content.' },
    ],
  },
  {
    id: 'comments-delete',
    group: 'Comments',
    name: 'Delete Comment',
    method: 'DELETE',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/{fileId}/comments/{commentId}',
    description: 'Deletes a comment on a file.',
    params: [
      { key: 'fileId',    type: 'path', required: true, hint: 'e.g. 1BxiMVs0XRA5nFMd...', description: 'Drive file ID.' },
      { key: 'commentId', type: 'path', required: true, hint: 'e.g. AAAABHmorrhc', description: 'Comment ID.' },
    ],
  },

  // ── REPLIES ───────────────────────────────────────────────────────────────
  {
    id: 'replies-list',
    group: 'Replies',
    name: 'List Comment Replies',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/{fileId}/comments/{commentId}/replies',
    description: 'Returns all replies to a comment.',
    params: [
      { key: 'fileId',    type: 'path', required: true, hint: 'e.g. 1BxiMVs0XRA5nFMd...', description: 'Drive file ID.' },
      { key: 'commentId', type: 'path', required: true, hint: 'e.g. AAAABHmorrhc', description: 'Comment ID.' },
    ],
  },
  {
    id: 'replies-create',
    group: 'Replies',
    name: 'Create Comment Reply',
    method: 'POST',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/{fileId}/comments/{commentId}/replies',
    description: 'Creates a reply to a comment.',
    params: [
      { key: 'fileId',    type: 'path', required: true, hint: 'e.g. 1BxiMVs0XRA5nFMd...', description: 'Drive file ID.' },
      { key: 'commentId', type: 'path', required: true, hint: 'e.g. AAAABHmorrhc', description: 'Comment ID.' },
      { key: 'content',   type: 'body', required: true, hint: 'e.g. Agreed, will fix.', description: 'Reply text.' },
      { key: 'action',    type: 'body', required: false, hint: 'e.g. resolve', description: 'resolve or reopen the comment.' },
    ],
  },

  // ── REVISIONS ─────────────────────────────────────────────────────────────
  {
    id: 'revisions-list',
    group: 'Revisions',
    name: 'List File Revisions',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/{fileId}/revisions',
    description: 'Returns all revisions of a file.',
    params: [
      { key: 'fileId',    type: 'path', required: true, hint: 'e.g. 1BxiMVs0XRA5nFMd...', description: 'Drive file ID.' },
      { key: 'fields',    type: 'query', required: false, hint: 'e.g. revisions(id,modifiedTime,lastModifyingUser,size)', description: 'Fields to include.' },
      { key: 'pageSize',  type: 'query', required: false, hint: 'e.g. 200', description: 'Max revisions per page.' },
    ],
  },
  {
    id: 'revisions-get',
    group: 'Revisions',
    name: 'Get Revision',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/{fileId}/revisions/{revisionId}',
    description: 'Returns metadata for a specific file revision.',
    params: [
      { key: 'fileId',     type: 'path', required: true, hint: 'e.g. 1BxiMVs0XRA5nFMd...', description: 'Drive file ID.' },
      { key: 'revisionId', type: 'path', required: true, hint: 'e.g. 1', description: 'Revision ID.' },
    ],
  },
  {
    id: 'revisions-update',
    group: 'Revisions',
    name: 'Update Revision',
    method: 'PATCH',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/{fileId}/revisions/{revisionId}',
    description: 'Updates a revision — set keepForever to prevent auto-deletion.',
    params: [
      { key: 'fileId',      type: 'path', required: true, hint: 'e.g. 1BxiMVs0XRA5nFMd...', description: 'Drive file ID.' },
      { key: 'revisionId',  type: 'path', required: true, hint: 'e.g. 1', description: 'Revision ID.' },
      { key: 'keepForever', type: 'body', required: false, hint: 'e.g. true', description: 'If true, keeps this revision permanently.' },
    ],
  },
  {
    id: 'revisions-delete',
    group: 'Revisions',
    name: 'Delete Revision',
    method: 'DELETE',
    baseUrl: 'https://www.googleapis.com/drive/v3/files/{fileId}/revisions/{revisionId}',
    description: 'Permanently deletes a file revision.',
    params: [
      { key: 'fileId',     type: 'path', required: true, hint: 'e.g. 1BxiMVs0XRA5nFMd...', description: 'Drive file ID.' },
      { key: 'revisionId', type: 'path', required: true, hint: 'e.g. 1', description: 'Revision ID to delete.' },
    ],
  },

  // ── APPS ──────────────────────────────────────────────────────────────────
  {
    id: 'apps-list',
    group: 'Apps',
    name: 'List Installed Apps',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v3/apps',
    description: 'Returns all apps installed by the user in Google Drive.',
    params: [
      { key: 'fields',     type: 'query', required: false, hint: 'e.g. apps(id,name,authorized,productUrl)', description: 'Fields to include.' },
    ],
  },
  {
    id: 'apps-get',
    group: 'Apps',
    name: 'Get App',
    method: 'GET',
    baseUrl: 'https://www.googleapis.com/drive/v3/apps/{appId}',
    description: 'Returns details about a specific Drive-connected app.',
    params: [
      { key: 'appId', type: 'path', required: true, hint: 'e.g. 1234567890', description: 'Drive app ID.' },
    ],
  },
];
