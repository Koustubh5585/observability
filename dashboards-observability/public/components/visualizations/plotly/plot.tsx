/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import plotComponentFactory from 'react-plotly.js/factory';
import Plotly from 'plotly.js-dist';
import { uiSettingsService } from '../../../../common/utils';
import { Annotations } from '../annotations/annotations';

interface PltProps {
  data: Plotly.Data[];
  layout?: Partial<Plotly.Layout>;
  config?: Partial<Plotly.Config>;
  onHoverHandler?: (event: Readonly<Plotly.PlotMouseEvent>) => void;
  onUnhoverHandler?: (event: Readonly<Plotly.PlotMouseEvent>) => void;
  onClickHandler?: (event: Readonly<Plotly.PlotMouseEvent>) => void;
  height?: string;
  dispatch?: (props: any) => void;
  chartType?: string;
  annotationText?: string;
  annotationIndex?: number;
  showAnnotationInput?: boolean;
  isEditMode?: boolean;
  onChangeHandler?: Function;
  onAddAnnotationHandler?: Function;
  onEditAnnotationHandler?: Function;
  onDeleteAnnotationHandler?: Function;
  onCancelAnnotationHandler?: Function;
}

export function Plt(props: PltProps) {
  const PlotComponent = plotComponentFactory(Plotly);
  const darkLayout = uiSettingsService.get('theme:darkMode')
    ? {
        paper_bgcolor: '#1D1E24',
        plot_bgcolor: '#1D1E24',
        font: {
          color: '#DFE5EF',
        },
      }
    : {};

  const finalLayout = {
    autosize: true,
    margin: {
      l: 30,
      r: 5,
      b: 30,
      t: 5,
      pad: 4,
    },
    barmode: 'stack',
    legend: {
      orientation: 'h',
      traceorder: 'normal',
    },
    showlegend: false,
    hovermode: 'closest',
    xaxis: {
      showgrid: true,
      zeroline: false,
      rangemode: 'normal',
      automargin: true,
    },
    yaxis: {
      showgrid: true,
      zeroline: false,
      rangemode: 'normal',
    },
    ...darkLayout,
    ...props.layout,
  };

  const finalConfig = {
    displayModeBar: false,
    ...props.config,
  };

  return (
    <div>
      <Annotations
        data={props.data}
        chartType={props.chartType!}
        annotationText={props.annotationText!}
        annotationIndex={props.annotationIndex!}
        showInputBox={props.showAnnotationInput!}
        isEditMode={props.isEditMode!}
        onTextChange={props.onChangeHandler!}
        onAddAnnotation={props.onAddAnnotationHandler!}
        onEditAnnotation={props.onEditAnnotationHandler!}
        onDeleteAnnotation={props.onDeleteAnnotationHandler!}
        onCancelAnnotation={props.onCancelAnnotationHandler!}
      />
      <PlotComponent
        divId="explorerPlotComponent"
        data={props.data}
        style={{ width: '100%', height: props.height || '100%' }}
        onHover={props.onHoverHandler}
        onUnhover={props.onUnhoverHandler}
        onClick={props.onClickHandler}
        useResizeHandler
        config={finalConfig}
        layout={finalLayout}
      />
    </div>
  );
}
