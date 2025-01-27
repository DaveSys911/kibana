/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { File, FileJSON, FilesMetrics } from '../../common';
import type { FileShareServiceStart } from '../file_share_service/types';
import type {
  CreateFileArgs,
  UpdateFileArgs,
  DeleteFileArgs,
  GetByIdArgs,
  ListFilesArgs,
  FindFileArgs,
} from './file_action_types';

/**
 * Public file service interface.
 */
export interface FileServiceStart {
  /**
   * Create a new file.
   *
   * Once created, the file content can be uploaded. See {@link File}.
   *
   * @param args - create file arg
   */
  create<M>(args: CreateFileArgs<M>): Promise<File<M>>;

  /**
   * Update updatable file attributes like name and meta.
   *
   * @param args - update file args
   */
  update<M>(args: UpdateFileArgs): Promise<File<M>>;

  /**
   * Delete a file.
   *
   * @param args - delete file args
   */
  delete(args: DeleteFileArgs): Promise<void>;

  /**
   * Get a file by ID. Will throw if file cannot be found.
   *
   * @param args - get file by ID args
   */
  getById<M>(args: GetByIdArgs): Promise<File<M>>;

  /**
   * Find files given a set of parameters.
   *
   * @param args - find files args
   */
  find<M>(args: FindFileArgs): Promise<Array<FileJSON<M>>>;

  /**
   * List all files of specific file kind.
   *
   * @param args - list files args
   */
  list<M>(args: ListFilesArgs): Promise<Array<File<M>>>;

  /**
   * Get an instance of a share object
   *
   * @param arg - get share args
   */
  getShareObject: FileShareServiceStart['get'];

  /**
   * List share objects
   *
   * @param arg - list share objects args
   */
  listShareObjects: FileShareServiceStart['list'];

  /**
   * Update an instance of a share object
   *
   * @param args - update share args
   */
  updateShareObject: FileShareServiceStart['update'];

  /**
   * Delete a share instance
   *
   * @param args - delete share args
   */
  deleteShareObject: FileShareServiceStart['delete'];

  /**
   * Get the current usage metrics for all storage media.
   *
   * Returns diagnostics or `undefined` if metrics could not be retrieved.
   */
  getUsageMetrics(): Promise<FilesMetrics>;

  /**
   * Get a file by a secret token.
   *
   * @param token - secret token
   */
  getByToken<M>(token: string): Promise<File<M>>;
}
