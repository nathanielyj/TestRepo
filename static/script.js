function generateMockData() {
    const strikes = [];
    const callOI = [];
    const putOI = [];
    const callOIChange = [];
    const putOIChange = [];

    const basePrice = 22000;
    const interval = 100;

    for (let i = -10; i <= 10; i++) {
        const strike = basePrice + (i * interval);
        strikes.push(strike);

        // Random OI values
        callOI.push(Math.floor(Math.random() * 50000) + 10000);
        putOI.push(Math.floor(Math.random() * 50000) + 10000);

        // Random Change values (positive or negative)
        callOIChange.push(Math.floor(Math.random() * 20000) - 5000);
        putOIChange.push(Math.floor(Math.random() * 20000) - 5000);
    }

    return { strikes, callOI, putOI, callOIChange, putOIChange };
}

function initCharts() {
    const data = generateMockData();

    // Chart Options
    const commonOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#e0e0e0'
                }
            }
        },
        scales: {
            x: {
                ticks: { color: '#888' },
                grid: { color: '#333' }
            },
            y: {
                ticks: { color: '#888' },
                grid: { color: '#333' }
            }
        }
    };

    // Total Open Interest Chart
    const oiCtx = document.getElementById('oiChart').getContext('2d');
    new Chart(oiCtx, {
        type: 'bar',
        data: {
            labels: data.strikes,
            datasets: [
                {
                    label: 'Call OI',
                    data: data.callOI,
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgb(255, 99, 132)',
                    borderWidth: 1
                },
                {
                    label: 'Put OI',
                    data: data.putOI,
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgb(75, 192, 192)',
                    borderWidth: 1
                }
            ]
        },
        options: commonOptions
    });

    // Change in Open Interest Chart
    const oiChangeCtx = document.getElementById('oiChangeChart').getContext('2d');
    new Chart(oiChangeCtx, {
        type: 'bar',
        data: {
            labels: data.strikes,
            datasets: [
                {
                    label: 'Call OI Change',
                    data: data.callOIChange,
                    backgroundColor: 'rgba(255, 159, 64, 0.7)',
                    borderColor: 'rgb(255, 159, 64)',
                    borderWidth: 1
                },
                {
                    label: 'Put OI Change',
                    data: data.putOIChange,
                    backgroundColor: 'rgba(153, 102, 255, 0.7)',
                    borderColor: 'rgb(153, 102, 255)',
                    borderWidth: 1
                }
            ]
        },
        options: commonOptions
    });
}

document.addEventListener('DOMContentLoaded', initCharts);
