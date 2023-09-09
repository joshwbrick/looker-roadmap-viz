/**
 * Welcome to the Looker Custom Visualization Builder! Please refer to the following resources
 * to help you write your visualization:
 *  - API Documentation - https://github.com/looker/custom_visualizations_v2/blob/master/docs/api_reference.md
 *  - Example Visualizations - https://github.com/looker/custom_visualizations_v2/tree/master/src/examples
 *  - How to use the CVB - https://developers.looker.com/marketplace/tutorials/about-custom-viz-builder
 **/

const visObject = {

 /**
  * Configuration options for your visualization. In Looker, these show up in the vis editor
  * panel but here, you can just manually set your default values in the code.
  **/
  options: {
  },

 /**
  * The create function gets called when the visualization is mounted but before any
  * data is passed to it.
  **/
  create: function(element, config){
    element.innerHTML = "<div id=\"container\"></div>";
  },

 /**
  * UpdateAsync is the function that gets called (potentially) multiple times. It receives
  * the data and should update the visualization with the new data.
  **/
  updateAsync: function(data, element, config, queryResponse, details, doneRendering){

    var customSeries = [];
    var customSeries2 = [];
    var categoricals = [];
    for (const [rowNum, row] of data.entries()) {
      rec = Object.values(row);
      categoricals.push(rec[0])

      customSeries.push({
        low: Date.parse(rec[2]),
        high: Date.parse(rec[3]),
        x: categoricals.length - 1,
        id: rec[4],
        dataLabels: {
          enabled: true,

          inside: false,
          formatter: function (t) {

            this.percentage = this.point.id / 100;
            return this.point.id
          }
        }
      })


      customSeries2.push({
        low: Date.parse(rec[2]),
        high: Date.parse(rec[2])+(rec[4]/100)*((Date.parse(rec[3])-Date.parse(rec[2]))),
        x: categoricals.length - 1
      })
    }

    Highcharts.chart('container', {
      chart: {inverted: true},
      series: [
        {
          type: 'columnrange',
          centerInCategory: true,
          grouping: false,
          animation: false,
          backgroundColor: 'rgba(0, 0, 0, 0)',
          inverted: true,
          spacingBottom: 8,
          spacingRight: 20,
          spacingLeft: 20,
          style: {
            fontFamily: 'inherit',
          },
          dataLabels: {
            inside: true,
            shadow: false,
            style: {
              color: 'rgba(0, 0, 0, 1)',
              borderColor: 'rgba(0, 0, 0, 0)',
              backgroundColor: 'rgba(0, 0, 0, 0)'
            },
            xLow: 99999999999,
            yLow: 99999999999
        },
          data: customSeries,
        },
        {
          type: 'columnrange',
          animation: false,
          backgroundColor: 'rgba(0, 0, 0, 0)',
          inverted: true,
          spacingBottom: 8,
          spacingRight: 20,
          spacingLeft: 20,
          style: {
            fontFamily: 'inherit',
          },
          dataLabels: {
            enabled: false
          },
          data: customSeries2,
        },
      ],

      accessibility: {
        landmarkVerbosity: 'disabled',
      },

      legend: {
        enabled: true,
        itemStyle: {
          color: 'var(--vis-color-text4)',
          fontWeight: 'normal',
        },
        navigation: {
          activeColor: '#666666',
        },
      },

      plotOptions: {
        columnrange: {
          borderRadius: 5
        },
        series: {
          animation: false,
          cursor: 'pointer',
          events: {},
          softThreshold: true,
          states: {
            inactive: {
              opacity: 1,
            },
          },
          opacity: 0.8,
          pointWidth: 18,
        },
      },

      title: {
        text: "The Title Goes Here",
      },

      tooltip: {
        animation: false,
        backgroundColor: 'var(--vis-color-tooltip-background)',
        borderRadius: 4,
        borderWidth: 0,
        followPointer: true,
        hideDelay: 0,
        outside: true,
        padding: 8,
        pointFormat: '{point.name}: {point.detail} {point.formattedStart} — {point.formattedEnd} ({point.magnitude})',
        shadow: false,
        style: {
          color: 'white',
          fontWeight: 400,
          fontFamily: 'inherit',
        },
      },

      xAxis: {
          categories: categoricals,
          type: 'category'
        },

        yAxis: {
          type: 'datetime',
          opposite: true
        }
    });
  }
};

looker.plugins.visualizations.add(visObject);



