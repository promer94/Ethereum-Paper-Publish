$(document).ready(() => {
  d3.csv('./NewPaper-totalcost.csv').then(data => {
    const canvas = document.getElementById('initialCost')
    const context = canvas.getContext('2d')
    const lineData = data.map(({ numOfAuthor, TotalCost }) => ({
      x: numOfAuthor,
      y: d3.format('.3f')(TotalCost)
    }))
    const formatData = data.map(({ numOfAuthor, TotalCost }) => ({
      x: numOfAuthor,
      y: d3.format('.3f')(TotalCost / numOfAuthor)
    }))
    const xData = formatData.map(({ numOfAuthor }) => numOfAuthor)
    const yData = formatData.map(({ TotalCost }) => TotalCost)
    const scatterChart = new Chart(context, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Total Cost',
            data: lineData,
            yAxisID: 'total',
            fill: false,
            borderColor: '#ef5350'
          },
          {
            label: 'Average Cost',
            data: formatData,
            yAxisID: 'average',
            fill: false,
            borderColor: '#2196f3'
          }
        ]
      },
      options: {
        scales: {
          xAxes: [
            {
              type: 'linear',
              position: 'bottom',
              scaleLabel: {
                display: true,
                labelString: 'Number of Authors',
                fontSize: 24
              }
            }
          ],
          yAxes: [
            {
              display: true,
              type: 'linear',
              position: 'left',
              id: 'total',
              scaleLabel: {
                display: true,
                labelString: 'Total cost',
                fontSize: 20
              }
            },
            {
              type: 'linear',
              position: 'right',
              id: 'average',
              scaleLabel: {
                display: true,
                labelString: 'Average cost',
                fontSize: 20
              }
            }
          ]
        }
      }
    })

    const realContext = document
      .getElementById('realInitialCost')
      .getContext('2d')
    const realData = data.map(({ numOfAuthor }) => ({
      x: numOfAuthor,
      y: d3.format('.5f')(0.02 * numOfAuthor + 0.43)
    }))
    const realChart = new Chart(realContext, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Total Cost On Rinkby Test Network',
            data: realData,
            yAxesID: 'total',
            fill: false,
            borderColor: '#ef5350'
          }
        ]
      },
      options: {
        scales: {
          xAxes: [
            {
              type: 'linear',
              position: 'bottom',
              scaleLabel: {
                display: true,
                labelString: 'Number of Authors',
                fontSize: 24
              }
            }
          ],
          yAxes: [
            {
              type: 'linear',
              position: 'left',
              id: 'total',
              scaleLabel: {
                display: true,
                labelString: 'Total Cost (£)',
                fontSize: 20
              }
            }
          ]
        }
      }
    })
  })
  d3.csv('./NewVersion-totalcost.csv').then(data => {
    const approveCost = data
      .map(({ numOfAuthor, TotalCost }) => ({
        x: numOfAuthor,
        y: d3.format('.3f')(TotalCost)
      }))
      .filter(
        (v, index) => index !== 6 && index !== 69 && index !== 0 && index !== 70
      )
    const averageCost = data
      .map(({ numOfAuthor, TotalCost }) => ({
        x: numOfAuthor,
        y: d3.format('.3f')(TotalCost / numOfAuthor)
      }))
      .filter(
        (v, index) => index !== 6 && index !== 69 && index !== 0 && index !== 70
      )
    const context1 = document.getElementById('approveCost').getContext('2d')
    const scatterChart = new Chart(context1, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Total Cost',
            data: approveCost,
            fill: false,
            yAxisID: 'total',
            borderColor: '#ef5350'
          },
          {
            label: 'Average Cost',
            data: averageCost,
            fill: false,
            yAxisID: 'average',
            borderColor: '#2196f3'
          }
        ]
      },
      options: {
        scales: {
          xAxes: [
            {
              type: 'linear',
              position: 'bottom',
              scaleLabel: {
                display: true,
                labelString: 'Number of Authors',
                fontSize: 24
              }
            }
          ],
          yAxes: [
            {
              display: true,
              type: 'linear',
              position: 'left',
              id: 'total',
              scaleLabel: {
                display: true,
                labelString: 'Total cost',
                fontSize: 20
              }
            },
            {
              type: 'linear',
              position: 'right',
              id: 'average',
              scaleLabel: {
                display: true,
                labelString: 'Average cost',
                fontSize: 20
              }
            }
          ]
        }
      }
    })
  })
  d3.csv('./NewVersion-createcost.csv').then(data => {
    const ctx = document.getElementById('createCost').getContext('2d')
    const formatData = data
      .filter(
        (ele, index) =>
          index !== 69 && index !== 70 && index !== 0 && index !== 6
      )
      .map(({ numOfAuthor, CreateCost }) => ({
        x: numOfAuthor,
        y: d3.format('.3f')(CreateCost)
      }))
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Create Cost',
            data: formatData,
            fill: false,
            yAxesID: 'create',
            borderColor: '#ef5350'
          }
        ]
      },
      options: {
        scales: {
          xAxes: [
            {
              type: 'linear',
              position: 'bottom',
              scaleLabel: {
                display: true,
                labelString: 'Number of Authors',
                fontSize: 24
              }
            }
          ],
          yAxes: [
            {
              display: true,
              type: 'linear',
              position: 'left',
              id: 'create',
              scaleLabel: {
                display: true,
                labelString: 'Create Cost',
                fontSize: 20
              }
            }
          ]
        }
      }
    })
  })
  d3.csv('./NewVersion-approvecost.csv').then(data => {
    const formatData = data
      .filter(
        (ele, index) =>
          index !== 69 && index !== 70 && index !== 0 && index !== 6
      )
      .map(({ numOfAuthor, Approvecost }) => ({
        x: numOfAuthor,
        y: d3.format('.2f')(Approvecost)
      }))
    const actualData = data
      .filter(
        (ele, index) =>
          index !== 69 && index !== 70 && index !== 0 && index !== 6
      )
      .map(({ numOfAuthor }) => ({
        x: numOfAuthor,
        y: d3.format('.2f')(0.06 * numOfAuthor + 0.22)
      }))
    console.log(actualData)
    const ctx = document.getElementById('versionCost').getContext('2d')
    const newCtx = document.getElementById('theCost').getContext('2d')
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Approve Cost',
            data: formatData,
            fill: false,
            yAxesID: 'create',
            borderColor: '#2196f3'
          }
        ]
      },
      options: {
        scales: {
          xAxes: [
            {
              type: 'linear',
              position: 'bottom',
              scaleLabel: {
                display: true,
                labelString: 'Number of Authors',
                fontSize: 24
              }
            }
          ],
          yAxes: [
            {
              display: true,
              type: 'linear',
              position: 'left',
              id: 'create',
              scaleLabel: {
                display: true,
                labelString: 'Approve Cost',
                fontSize: 20
              }
            }
          ]
        }
      }
    })
    const newChart = new Chart(newCtx, {
      type: 'line',
      data: {
        datasets: [
          {
            label: 'Cost on Rinkby Test Network',
            data: actualData,
            fill: false,
            yAxesID: 'all',
            borderColor: '#000000'
          }
        ]
      },
      options: {
        scales: {
          xAxes: [
            {
              type: 'linear',
              position: 'bottom',
              scaleLabel: {
                display: true,
                labelString: 'Number of Authors',
                fontSize: 24
              }
            }
          ],
          yAxes: [
            {
              display: true,
              type: 'linear',
              position: 'left',
              id: 'all',
              scaleLabel: {
                display: true,
                labelString: 'Total Cost (£)',
                fontSize: 20
              }
            }
          ]
        }
      }
    })
  })
})
