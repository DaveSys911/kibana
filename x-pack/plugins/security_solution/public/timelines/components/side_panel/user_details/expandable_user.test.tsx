/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { mount } from 'enzyme';
import { waitFor } from '@testing-library/react';
import React from 'react';

import '../../../../common/mock/match_media';
import { mockGlobalState, TestProviders } from '../../../../common/mock';
import { ExpandableUserDetails } from './expandable_user';
import { mockAnomalies } from '../../../../common/components/ml/mock';
import type { Anomalies } from '../../../../common/components/ml/types';
import { hasMlUserPermissions } from '../../../../../common/machine_learning/has_ml_user_permissions';
const mockDispatch = jest.fn();
jest.mock('../../../../../common/machine_learning/has_ml_user_permissions');
jest.mock('react-redux', () => {
  const original = jest.requireActual('react-redux');

  return {
    ...original,
    useDispatch: () => mockDispatch,
  };
});
jest.mock('../../../../common/components/ml/anomaly/anomaly_table_provider', () => ({
  AnomalyTableProvider: ({
    children,
  }: {
    children: (args: {
      anomaliesData: Anomalies;
      isLoadingAnomaliesData: boolean;
    }) => React.ReactNode;
  }) => children({ anomaliesData: mockAnomalies, isLoadingAnomaliesData: false }),
}));

describe('Expandable Host Component', () => {
  beforeAll(() => {
    (hasMlUserPermissions as jest.Mock).mockReturnValue(true);
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const mockProps = {
    contextID: 'text-context',
    userName: 'testUserName',
    isDraggable: true,
  };

  describe('ExpandableUserDetails: rendering', () => {
    test('it should render the UserOverview of the ExpandableUserDetails', () => {
      const wrapper = mount(
        <TestProviders>
          <ExpandableUserDetails {...mockProps} />
        </TestProviders>
      );

      expect(wrapper.find('[data-test-subj="user-overview"]').exists()).toBe(true);
    });

    test('it should render the UserOverview of the ExpandableUserDetails with the correct indices', () => {
      const wrapper = mount(
        <TestProviders>
          <ExpandableUserDetails {...mockProps} />
        </TestProviders>
      );

      expect(wrapper.find('UserOverview').prop('indexPatterns')).toStrictEqual(
        mockGlobalState.sourcerer.sourcererScopes.default.selectedPatterns
      );
    });

    test('it should set date range to anomaly date range', async () => {
      const wrapper = mount(
        <TestProviders>
          <ExpandableUserDetails {...mockProps} />
        </TestProviders>
      );
      wrapper.find('[data-test-subj="anomaly-score-popover"]').first().simulate('click');
      await waitFor(() => {
        wrapper
          .find('button[data-test-subj="anomaly-description-narrow-range-link"]')
          .first()
          .simulate('click');
      });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'x-pack/security_solution/local/inputs/SET_ABSOLUTE_RANGE_DATE_PICKER',
        payload: {
          id: 'global',
          from: '2019-06-15T06:00:00.000Z',
          to: '2019-06-17T06:00:00.000Z',
        },
      });
    });
  });
});
