/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EuiBasicTable, EuiLink } from '@elastic/eui';

export const DashboardList = ({ visualizations }: any) => {
  const getTableData = () => {
    const dashboards = [
      {
        id: '1',
        title: 'Application analytics',
        link: '#/application_analytics',
        description: 'Application analytics',
      },
      {
        id: '2',
        title: 'Trace analytics',
        link: '#/trace_analytics',
        description: 'Trace analytics',
      },
      {
        id: '3',
        title: 'Event analytics',
        link: '#/event_analytics',
        description: 'Event analytics',
      },
      {
        id: '4',
        title: 'Operational panels',
        link: '#/operational_panels',
        description: 'Operational panels',
      },
      {
        id: '5',
        title: 'Notebooks',
        link: '#/notebooks',
        description: 'Notebooks',
      },
    ];

    return dashboards;
  };

  const getTableColumns = () => {
    const tableColumns = [
      {
        field: 'title',
        name: 'Title',
        sortable: false,
        render: (title) => {
          return <EuiLink href={`#/${title.replace(' ', '_').toLowerCase()}`}>{title}</EuiLink>;
        },
      },
      {
        field: 'description',
        name: 'Description',
        sortable: false,
      },
    ];
    return tableColumns;
  };

  return <EuiBasicTable items={getTableData()} columns={getTableColumns()} />;
};
