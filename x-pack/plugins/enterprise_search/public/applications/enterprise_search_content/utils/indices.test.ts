/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { connectorIndex, crawlerIndex, apiIndex } from '../__mocks__/view_index.mock';

import moment from 'moment';

import { ConnectorStatus, SyncStatus } from '../../../../common/types/connectors';
import { IngestionMethod, IngestionStatus } from '../types';

import {
  getIngestionMethod,
  getIngestionStatus,
  getLastUpdated,
  indexToViewIndex,
} from './indices';

describe('Indices util functions', () => {
  describe('getIngestionMethod', () => {
    it('should return correct ingestion method for connector', () => {
      expect(getIngestionMethod(connectorIndex)).toEqual(IngestionMethod.CONNECTOR);
    });
    it('should return correct ingestion method for crawler', () => {
      expect(getIngestionMethod(crawlerIndex)).toEqual(IngestionMethod.CRAWLER);
    });
    it('should return correct ingestion method for API', () => {
      expect(getIngestionMethod(apiIndex)).toEqual(IngestionMethod.API);
    });
    it('should return API for undefined index', () => {
      expect(getIngestionMethod(undefined)).toEqual(IngestionMethod.API);
    });
  });
  describe('getIngestionStatus', () => {
    it('should return connected for API', () => {
      expect(getIngestionStatus(apiIndex)).toEqual(IngestionStatus.CONNECTED);
    });
    it('should return connected for undefined', () => {
      expect(getIngestionStatus(undefined)).toEqual(IngestionStatus.CONNECTED);
    });
    it('should return incomplete for incomplete connector', () => {
      expect(getIngestionStatus(connectorIndex)).toEqual(IngestionStatus.INCOMPLETE);
    });
    it('should return connected for complete connector', () => {
      expect(
        getIngestionStatus({
          ...connectorIndex,
          connector: { ...connectorIndex.connector, status: ConnectorStatus.CONNECTED },
        })
      ).toEqual(IngestionStatus.CONNECTED);
    });
    it('should return error for connector that last checked in more than 30 minutes ago', () => {
      const lastSeen = moment().subtract(31, 'minutes').format();
      expect(
        getIngestionStatus({
          ...connectorIndex,
          connector: {
            ...connectorIndex.connector,
            last_seen: lastSeen,
            status: ConnectorStatus.CONNECTED,
          },
        })
      ).toEqual(IngestionStatus.ERROR);
    });
    it('should return sync error for complete connector with sync error', () => {
      expect(
        getIngestionStatus({
          ...connectorIndex,
          connector: {
            ...connectorIndex.connector,
            last_sync_status: SyncStatus.ERROR,
            status: ConnectorStatus.NEEDS_CONFIGURATION,
          },
        })
      ).toEqual(IngestionStatus.SYNC_ERROR);
    });
    it('should return error for connector with error', () => {
      expect(
        getIngestionStatus({
          ...connectorIndex,
          connector: {
            ...connectorIndex.connector,
            last_sync_status: SyncStatus.COMPLETED,
            status: ConnectorStatus.ERROR,
          },
        })
      ).toEqual(IngestionStatus.ERROR);
    });
  });
  describe('getLastUpdated', () => {
    it('should return never for connector with no last updated time', () => {
      expect(getLastUpdated(connectorIndex)).toEqual('never');
    });
    it('should return last_synced for connector with no last updated time', () => {
      expect(
        getLastUpdated({
          ...connectorIndex,
          connector: { ...connectorIndex.connector, last_synced: 'last_synced' },
        })
      ).toEqual('last_synced');
    });
    it('should return null for api', () => {
      expect(getLastUpdated(apiIndex)).toEqual(null);
    });
  });
  describe('indexToViewIndex', () => {
    it('should apply above transformations to viewIndex', () => {
      expect(indexToViewIndex(connectorIndex)).toEqual({
        ...connectorIndex,
        ingestionMethod: getIngestionMethod(connectorIndex),
        ingestionStatus: getIngestionStatus(connectorIndex),
        lastUpdated: getLastUpdated(connectorIndex),
      });
    });
  });
});
