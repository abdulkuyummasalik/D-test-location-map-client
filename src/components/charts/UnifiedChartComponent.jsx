import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const UnifiedChartComponent = ({ title, data, categories, config = {} }) => {
  const {
    chartHeight = "60%", // Menggunakan persentase agar lebih responsif
    xAxisTitle = "X-Axis",
    yAxisLeftTitle = "Y-Axis Left",
    yAxisRightTitle = "Y-Axis Right",
    series1Name = "Series 1",
    series2Name = "Series 2",
    series1Type = "column",
    series2Type = "line",
    series1Color = "#2C3E50",
    series2Color = "#FFD700",
    series3Color,
    yAxisFormatLeft = "{value}%",
    yAxisFormatRight = "{value}h",
    min = 0,
    max = 100,
    formatTooltip = "%",
    dataLabelEnabled = true,
    dataLabelFormat = "{y}%",
    dataLabelStyle = { fontWeight: "bold", color: "black" },
    markerEnabled = true,
    markerLineWidth = 2,
    markerFillColor = "white",
  } = config;

  const getSeries1Color = (item) => {
    if (series3Color && item.category < item.value) {
      return series3Color;
    }
    return series1Color ? series1Color : "transparent";
  };

  const xAxisCategories = categories || data.map((item) => item.name);

  const getChartOptions = () => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error("Data is not valid or empty");
      return {};
    }

    return {
      chart: {
        type: "column",
        height: chartHeight,
        style: { width: "100%" },
      },
      title: { text: title, style: { fontSize: "18px", fontWeight: "bold" } },
      responsive: {
        rules: [{
          condition: {
            maxWidth: 600
          },
          chartOptions: {
            chart: { height: "400px" },
            legend: { enabled: false },
          }
        }]
      },
      xAxis: {
        categories: xAxisCategories,
        title: { text: xAxisTitle ? xAxisTitle : "" },
        crosshair: true,
      },
      yAxis: [
        {
          title: { text: yAxisLeftTitle ? yAxisLeftTitle : "" },
          labels: { format: yAxisFormatLeft ? yAxisFormatLeft : "" },
          min,
          max,
        },
        {
          title: { text: yAxisRightTitle ? yAxisRightTitle : "" },
          labels: { format: yAxisFormatRight ? yAxisFormatRight : "" },
          min: yAxisFormatRight === "" ? min : undefined,
          max: yAxisFormatRight === "" ? max : undefined,
          opposite: true,
          visible: yAxisFormatRight,
        },
      ],
      tooltip: {
        shared: true,
        useHTML: true,
        formatter: function () {
          return `<b>${this.points[0].key}</b><br/>${this.points
            .map(
              (point) =>
                `${point.series.name}: <b>${point.y}${formatTooltip ? formatTooltip : ""}</b>`
            )
            .join("<br/>")}`;
        },
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: dataLabelEnabled ? dataLabelEnabled : false,
            format: dataLabelFormat ? dataLabelFormat : "",
            style: dataLabelStyle ? dataLabelStyle : {},
          },
          color: series1Color ? series1Color : "transparent",
          colorByPoint: !!series3Color,
        },
        line: {
          dataLabels: {
            enabled: dataLabelEnabled ? dataLabelEnabled : false,
            format: dataLabelFormat ? dataLabelFormat : "",
            style: dataLabelStyle ? { ...dataLabelStyle, color: series2Color } : {},
          },
        },
      },
      series: [
        series1Name
          ? {
            name: series1Name,
            data: data.map((item) => ({
              y: item.category,
              color: getSeries1Color(item),
            })),
            type: series1Type ? series1Type : "column",
          }
          : null,
        series2Name
          ? {
            name: series2Name,
            data: data.map((item) => item.value),
            type: series2Type ? series2Type : "line",
            color: series2Color ? series2Color : "transparent",
            yAxis: 1,
            marker: {
              enabled: markerEnabled ? markerEnabled : false,
              lineWidth: markerLineWidth ? markerLineWidth : 0,
              lineColor: series2Color ? series2Color : "transparent",
              fillColor: markerFillColor ? markerFillColor : "transparent",
            },
          }
          : null,
      ].filter(Boolean),
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 w-full overflow-auto">
      <HighchartsReact highcharts={Highcharts} options={getChartOptions()} />
    </div>
  );
};

export default UnifiedChartComponent;