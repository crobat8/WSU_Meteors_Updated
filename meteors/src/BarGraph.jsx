import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const BarGraph = ({ data, sortByValue }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    let sortedData = data;
    if(data == undefined){
      return
    }
    if (sortByValue) {
      sortedData = Object.fromEntries(Object.entries(data).sort(([,a],[,b]) => b-a));
    }

    const labels = Object.keys(sortedData);
    const values = Object.values(sortedData);

    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Data',
          data: values,
          backgroundColor: 'rgba(54, 162, 235, 0.6)', // Color for bars
          borderColor: 'rgba(54, 162, 235, 1)', // Border color for bars
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true // Start y-axis from zero
          }
        }
      }
    });

    return () => {
      myChart.destroy(); // Clean up chart on unmount
    };
  }, [data, sortByValue]);

  return (
    <div>
      <canvas ref={chartRef} width="400" height="400"></canvas>
    </div>
  );
};

export default BarGraph;