/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { isEmpty, last, take } from 'lodash';
import { Plt } from '../../plotly/plot';
import {
  LONG_CHART_COLOR,
  PLOTLY_COLOR,
  FILLOPACITY_DIV_FACTOR,
  THRESHOLD_LINE_WIDTH,
  THRESHOLD_LINE_OPACITY,
  MAX_BUCKET_LENGTH,
} from '../../../../../common/constants/shared';
import { AvailabilityUnitType } from '../../../event_analytics/explorer/visualizations/config_panel/config_panes/config_controls/config_availability';
import { ThresholdUnitType } from '../../../event_analytics/explorer/visualizations/config_panel/config_panes/config_controls/config_thresholds';
import {
  hexToRgb,
  filterDataConfigParameter,
  getTooltipHoverInfo,
} from '../../../event_analytics/utils/utils';
import { EmptyPlaceholder } from '../../../event_analytics/explorer/visualizations/shared_components/empty_placeholder';
import { ConfigListEntry } from '../../../../../common/types/explorer';

export const Bar = ({ visualizations, layout, config }: any) => {
  const { vis } = visualizations;
  const {
    data,
    metadata: { fields },
  } = visualizations.data.rawVizData;
  const lastIndex = fields.length - 1;
  const {
    dataConfig: {
      chartStyles = {},
      valueOptions = {},
      legend = {},
      colorTheme = [],
      panelOptions = {},
      tooltipOptions = {},
    },
    layoutConfig = {},
    availabilityConfig = {},
  } = visualizations?.data?.userConfigs;
  const xaxis = valueOptions.dimensions ? filterDataConfigParameter(valueOptions.dimensions) : [];
  const yaxis = valueOptions.metrics ? filterDataConfigParameter(valueOptions.metrics) : [];
  const isVertical = vis.orientation === 'v';
  let bars;
  let valueSeries;
  let valueForXSeries;

  const storedAnnotations = sessionStorage.getItem('ChartsAnnotations');
  const [newAnnotationText, setNewAnnotationText] = useState<string>();
  const [annotationParam, setAnnotationParam] = useState({
    showInputBox: false,
    xAnnotation: '',
    yAnnotation: '',
    annotationText: Array(visualizations.data.rawVizData.size).fill(''),
    annotationIndex: 0,
  });

  useEffect(() => {
    const annotations = storedAnnotations ? JSON.parse(storedAnnotations) : [];
    let annotationTexts;
    annotations.map((item) => {
      if (item.type === visualizations.vis.name) {
        annotationTexts = item.annotationTexts;
      }
    });

    // Reset values on chart change
    setAnnotationParam({
      showInputBox: false,
      xAnnotation: '',
      yAnnotation: '',
      annotationText: annotationTexts || Array(visualizations.data.rawVizData.size).fill(''),
      annotationIndex: 0,
    });
  }, [visualizations.vis.name]);

  if (!isEmpty(xaxis) && !isEmpty(yaxis)) {
    valueSeries = [...yaxis];
    valueForXSeries = [...xaxis];
  } else {
    return <EmptyPlaceholder icon={visualizations?.vis?.icontype} />;
  }
  const tickAngle = chartStyles.rotateBarLabels || vis.labelangle;
  const lineWidth = chartStyles.lineWidth || vis.linewidth;
  const fillOpacity =
    chartStyles.fillOpacity !== undefined
      ? chartStyles.fillOpacity / FILLOPACITY_DIV_FACTOR
      : vis.fillopacity / FILLOPACITY_DIV_FACTOR;
  const barWidth = 1 - (chartStyles.barWidth || vis.barwidth);
  const groupWidth = 1 - (chartStyles.groupWidth || vis.groupwidth);
  const showLegend = !(legend.showLegend && legend.showLegend !== vis.showlegend);
  const legendPosition = legend.position || vis.legendposition;
  const labelSize = chartStyles.labelSize;
  const legendSize = legend.legendSize;

  const getSelectedColorTheme = (field: any, index: number) =>
    (colorTheme.length > 0 &&
      colorTheme.find((colorSelected) => colorSelected.name.name === field.label)?.color) ||
    PLOTLY_COLOR[index % PLOTLY_COLOR.length];

  const prepareData = (valueForXSeries) => {
    return valueForXSeries
      .map((dimension: ConfigListEntry) => data[dimension.label])
      ?.reduce((prev, cur) => {
        return prev.map((i, j) => `${i}, ${cur[j]}`);
      });
  };

  const createNameData = (nameData: Array<string | number>, metricName: string) =>
    nameData?.map((el) => el + ',' + metricName);

  // for multiple dimention and metrics with timestamp
  if (valueForXSeries.some((e) => e.type === 'timestamp')) {
    const nameData =
      valueForXSeries.length > 1
        ? valueForXSeries
            .filter((item) => item.type !== 'timestamp')
            .map((dimension) => data[dimension.label])
            .reduce((prev, cur) => {
              return prev.map((i, j) => `${i}, ${cur[j]}`);
            })
        : [];
    const dimensionsData = valueForXSeries
      .filter((item) => item.type === 'timestamp')
      .map((dimension) => data[dimension.label])
      .flat();

    bars = valueSeries
      .map((field: ConfigListEntry, index: number) => {
        const selectedColor = getSelectedColorTheme(field, index);
        return dimensionsData.map((dimension: number | string, j: number) => {
          return {
            x: isVertical
              ? !isEmpty(xaxis)
                ? dimension
                : data[fields[lastIndex].name]
              : data[field.label][j],
            y: isVertical ? data[field.label][j] : dimension,
            type: vis.type,
            marker: {
              color: hexToRgb(selectedColor, fillOpacity),
              line: {
                color: selectedColor,
                width: lineWidth,
              },
            },
            name: nameData.length > 0 ? createNameData(nameData, field.label)[j] : field.label, // dimensionsData[index]+ ',' + field.label,
            orientation: vis.orientation,
            hoverinfo: getTooltipHoverInfo({
              tooltipMode: tooltipOptions.tooltipMode,
              tooltipText: tooltipOptions.tooltipText,
            }),
          };
        });
      })
      .flat();

    // merging x, y for same names
    bars = Object.values(
      bars?.reduce((acc, { x, y, name, type, marker, orientation, hoverinfo, hovertext }) => {
        acc[name] = acc[name] || {
          x: [],
          y: [],
          name,
          type,
          marker,
          orientation,
          hoverinfo,
          hovertext,
        };
        acc[name].x.push(x);
        acc[name].y.push(y);
        return acc;
      }, {})
    );
  } else {
    // for multiple dimention and metrics without timestamp
    const dimensionsData = prepareData(valueForXSeries);
    bars = valueSeries.map((field: ConfigListEntry, index: number) => {
      const selectedColor = getSelectedColorTheme(field, index);
      return {
        x: isVertical
          ? !isEmpty(xaxis)
            ? dimensionsData
            : data[fields[lastIndex].name]
          : data[field.name],
        y: isVertical ? data[field.name] : dimensionsData,
        type: vis.type,
        marker: {
          color: hexToRgb(selectedColor, fillOpacity),
          line: {
            color: selectedColor,
            width: lineWidth,
          },
        },
        name: field.name,
        orientation: vis.orientation,
        hoverinfo: getTooltipHoverInfo({
          tooltipMode: tooltipOptions.tooltipMode,
          tooltipText: tooltipOptions.tooltipText,
        }),
      };
    });
  }

  // If chart has length of result buckets < 16
  // then use the LONG_CHART_COLOR for all the bars in the chart
  const plotlyColorway =
    data[fields[lastIndex].name].length < MAX_BUCKET_LENGTH ? PLOTLY_COLOR : [LONG_CHART_COLOR];
  const mergedLayout = {
    colorway: plotlyColorway,
    ...layout,
    ...(layoutConfig.layout && layoutConfig.layout),
    title: panelOptions.title || layoutConfig.layout?.title || '',
    barmode: chartStyles.mode || vis.mode,
    xaxis: {
      ...(isVertical && { tickangle: tickAngle }),
      automargin: true,
      tickfont: {
        ...(labelSize && {
          size: labelSize,
        }),
      },
    },
    yaxis: {
      ...(!isVertical && { tickangle: tickAngle }),
      automargin: true,
      tickfont: {
        ...(labelSize && {
          size: labelSize,
        }),
      },
    },
    bargap: groupWidth,
    bargroupgap: barWidth,
    legend: {
      ...layout.legend,
      orientation: legendPosition,
      ...(legendSize && {
        font: {
          size: legendSize,
        },
      }),
    },
    showlegend: showLegend,
    annotations: [
      {
        x: annotationParam.xAnnotation,
        y: annotationParam.yAnnotation,
        xref: 'x',
        yref: 'y',
        text: annotationParam.xAnnotation
          ? annotationParam.annotationText[annotationParam.annotationIndex]
          : '',
        showarrow: true,
      },
    ],
    hovermode: 'closest',
  };
  if (availabilityConfig.level) {
    const thresholdTraces = {
      x: [],
      y: [],
      mode: 'text',
      text: [],
    };

    const levels = availabilityConfig.level ? availabilityConfig.level : [];

    const mapToLine = (list: ThresholdUnitType[] | AvailabilityUnitType[], lineStyle: any) => {
      return list.map((thr: ThresholdUnitType) => {
        thresholdTraces.x.push(
          data[!isEmpty(xaxis) ? xaxis[xaxis.length - 1]?.label : fields[lastIndex].name][0]
        );
        thresholdTraces.y.push(thr.value * (1 + 0.06));
        thresholdTraces.text.push(thr.name);
        return {
          type: 'line',
          x0: data[!isEmpty(xaxis) ? xaxis[0]?.label : fields[lastIndex].name][0],
          y0: thr.value,
          x1: last(data[!isEmpty(xaxis) ? xaxis[0]?.label : fields[lastIndex].name]),
          y1: thr.value,
          name: thr.name || '',
          opacity: THRESHOLD_LINE_OPACITY,
          line: {
            color: thr.color,
            width: THRESHOLD_LINE_WIDTH,
            ...lineStyle,
          },
        };
      });
    };

    mergedLayout.shapes = mapToLine(levels, {});
    bars = [...bars, thresholdTraces];
  }

  const mergedConfigs = {
    ...config,
    ...(layoutConfig.config && layoutConfig.config),
  };

  const handleChange = (event) => {
    setNewAnnotationText(event.target.value);
  };

  const handleCancelAnnotation = () => {
    setAnnotationParam({
      ...annotationParam,
      showInputBox: false,
    });
  };

  const handleAddAnnotation = () => {
    const newAnnotation = [
      ...annotationParam.annotationText.slice(0, annotationParam.annotationIndex),
      newAnnotationText,
      ...annotationParam.annotationText.slice(annotationParam.annotationIndex + 1),
    ];
    setAnnotationParam({
      ...annotationParam,
      annotationText: newAnnotation,
      showInputBox: false,
    });
  };

  const handleEditAnnotation = () => {
    const newAnnotation = [
      ...annotationParam.annotationText.slice(0, annotationParam.annotationIndex),
      newAnnotationText,
      ...annotationParam.annotationText.slice(annotationParam.annotationIndex + 1),
    ];
    setAnnotationParam({
      ...annotationParam,
      annotationText: newAnnotation,
      showInputBox: false,
    });
  };

  const handleDeleteAnnotation = () => {
    const newAnnotation = [
      ...annotationParam.annotationText.slice(0, annotationParam.annotationIndex),
      '',
      ...annotationParam.annotationText.slice(annotationParam.annotationIndex + 1),
    ];
    setAnnotationParam({
      ...annotationParam,
      annotationText: newAnnotation,
      showInputBox: false,
    });
  };

  const onBarChartClick = () => {
    const myPlot = document.getElementById('explorerPlotComponent');
    myPlot?.on('plotly_click', (data) => {
      setAnnotationParam({
        ...annotationParam,
        xAnnotation:
          visualizations.vis.name === 'bar'
            ? `${data.points[0].x}`
            : `${parseFloat(data.points[0].x.toPrecision(4))}`,
        yAnnotation:
          visualizations.vis.name === 'bar'
            ? `${parseFloat(data.points[0].y.toPrecision(4))}`
            : `${data.points[0].y}`,
        annotationIndex: data.points[0].pointIndex,
        showInputBox: true,
      });
      setNewAnnotationText(annotationParam.annotationText[data.points[0].pointIndex]);
    });
  };

  return (
    <Plt
      data={bars}
      layout={mergedLayout}
      config={mergedConfigs}
      onClickHandler={onBarChartClick}
      showAnnotationInput={annotationParam.showInputBox}
      onChangeHandler={handleChange}
      onAddAnnotationHandler={handleAddAnnotation}
      onEditAnnotationHandler={handleEditAnnotation}
      onDeleteAnnotationHandler={handleDeleteAnnotation}
      onCancelAnnotationHandler={handleCancelAnnotation}
      isEditMode={annotationParam.annotationText[annotationParam.annotationIndex]}
      annotationText={newAnnotationText}
      chartType={visualizations.vis.name}
      annotationIndex={annotationParam.annotationIndex}
    />
  );
};
