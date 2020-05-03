import { ChartConfiguration } from 'chart.js';

export default class ConfigStandard {
    constructor() {}

    public initiate(): ChartConfiguration {
        return {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'healthy',
                        data: [],
                        backgroundColor: ['rgba(54, 162, 235, 0.2)'],
                        borderColor: ['rgba(54, 162, 235, 1)'],
                        borderWidth: 1,
                        pointRadius: 0.5,
                        fill: false,
                    },
                    {
                        label: 'infected',
                        data: [],
                        backgroundColor: ['rgba(255, 99, 132, 0.2)'],
                        borderColor: ['rgba(255, 99, 132, 1)'],
                        borderWidth: 1,
                        pointRadius: 0.5,
                    },
                    {
                        label: 'recovered',
                        data: [],
                        backgroundColor: ['rgba(0, 255, 180, 0.2)'],
                        borderColor: ['rgba(0, 255, 180, 1)'],
                        borderWidth: 1,
                        pointRadius: 0.5,
                    },
                ],
            },
            options: {
                maintainAspectRatio: true,
                responsive: true,
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                                suggestedMin: 0,
                                suggestedMax: 200,
                                fontColor: '#161616',
                            },
                            gridLines: {
                                color: '#161616',
                            },
                            display: false,
                        },
                    ],
                    xAxes: [
                        {
                            display: true,
                            ticks: {},
                        },
                    ],
                },
            },
        };
    }
}
