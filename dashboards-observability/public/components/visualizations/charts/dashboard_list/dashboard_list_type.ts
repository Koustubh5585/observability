/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import { getPlotlyCategory } from '../shared/shared_configs';
import { LensIconChartLine } from '../../assets/chart_line';
import { DashboardList } from './dashboard_list';
import { VizDataPanel } from '../../../event_analytics/explorer/visualizations/config_panel/config_panes/default_vis_editor';
import { ConfigText } from '../../../event_analytics/explorer/visualizations/config_panel/config_panes/config_controls';

const VIS_CATEGORY = getPlotlyCategory();

export const createDashboardListTypeDefinition = () => ({
  name: 'dashboard_list',
  type: 'dashboard_list',
  id: 'dashboard_list',
  label: 'Dashboard list',
  fulllabel: 'Dashboard list',
  icontype: 'visTable',
  category: VIS_CATEGORY.BASICS,
  selection: {
    dataLoss: 'nothing',
  },
  icon: LensIconChartLine,
  editorconfig: {
    panelTabs: [
      {
        id: 'data-panel',
        name: 'Style',
        mapTo: 'dataConfig',
        editor: VizDataPanel,
        sections: [
          {
            id: 'text_editor',
            name: 'Text',
            editor: ConfigText,
            mapTo: 'text',
            schemas: [],
          },
        ],
      },
    ],
  },
  component: DashboardList,
});
