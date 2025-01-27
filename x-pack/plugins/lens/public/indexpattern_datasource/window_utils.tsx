/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';
import { IndexPattern, IndexPatternLayer } from './types';

export const windowOptions = [
  {
    label: i18n.translate('xpack.lens.indexPattern.window.30s', {
      defaultMessage: '30 seconds (30s)',
    }),
    value: '30s',
  },
  {
    label: i18n.translate('xpack.lens.indexPattern.window.1m', {
      defaultMessage: '1 minute (1m)',
    }),
    value: '1m',
  },
  {
    label: i18n.translate('xpack.lens.indexPattern.window.5m', {
      defaultMessage: '5 minutes (5m)',
    }),
    value: '5m',
  },
  {
    label: i18n.translate('xpack.lens.indexPattern.window.15m', {
      defaultMessage: '15 minutes (15m)',
    }),
    value: '15m',
  },
  {
    label: i18n.translate('xpack.lens.indexPattern.window.1h', {
      defaultMessage: '1 hour (1h)',
    }),
    value: '1h',
  },
];

export const windowOptionOrder = windowOptions.reduce<{ [key: string]: number }>(
  (optionMap, { value }, index) => ({
    ...optionMap,
    [value]: index,
  }),
  {}
);

export function getColumnWindowError(
  layer: IndexPatternLayer,
  columnId: string,
  indexPattern: IndexPattern
): string[] | undefined {
  const currentColumn = layer.columns[columnId];
  if (!currentColumn.window) {
    return;
  }
  const hasDateHistogram = Object.values(layer.columns).some(
    (column) => column.operationType === 'date_histogram'
  );
  const hasTimeField = Boolean(indexPattern.timeFieldName);
  return [
    hasDateHistogram &&
      i18n.translate('xpack.lens.indexPattern.windowWithDateHistogram', {
        defaultMessage:
          'Reduced time range can only be used without a date histogram. Either remove the date histogram dimension or remove the reduced time range from {column}.',
        values: {
          column: currentColumn.label,
        },
      }),
    !hasTimeField &&
      i18n.translate('xpack.lens.indexPattern.windowWithoutTimefield', {
        defaultMessage:
          'Reduced time range can only be used with a specified default time field on the data view. Either use a different data view with default time field or remove the reduced time range from {column}.',
        values: {
          column: currentColumn.label,
        },
      }),
  ].filter(Boolean) as string[];
}
