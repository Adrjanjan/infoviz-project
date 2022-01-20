console.log('chart2 script added')

let mk_global_base_data
let mk_global_bar_chart

Promise.all([
    d3.tsv("../data/gggi.tsv", d => ({
        iso3:      d['#alpha3'],
        indicator: d.indicator,
        year:     +d.year,
        i:        +d.index,
        r:        +d.rank,
    }))
    ,
    d3.tsv("../data/iso3.tsv", d => ({
        iso3:      d['#alpha3'],
        country:   d.country,
        subregion: d.subregion,
        region:    d.region,
    }))
]).then( data => {
    const region_map = data[1].reduce((acc, r)=> acc.set(r.iso3, r), new Map());
    const base_data = data[0].filter(v => v.i) // filter out all NaN values
        .map(v => {
            let r = region_map.get(v.iso3);
            v.region = r.region;
            v.country = r.country;
            v.subregion = r.subregion;
            return v;
        })

    const config = {
        type: 'line',
        data: mk_filter_data(base_data),
        options: {
            //onClick: on_click_sort_chart2,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Years'
                    },
                    ticks: {
                        display: true
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Index value'
                    }
                }
            },
            animation: {
                duration: 0
            }
        }
    };

    const bar_chart = new Chart(
        document.getElementById('chart2'),
        config
    );

    mk_global_base_data = base_data
    mk_global_bar_chart = bar_chart

    updateChart2();
});

const colorMap = {
    Europe: '#007fff',
    Asia: '#ff8000',
    Africa: '#ffff00',
    Americas: '#80ff00',
    Oceania: '#ff0000'
};

const transformData = (data) => {
    const regionsYearsCountriesIndicators = data.reduce((acc, value) => {
        if (acc[value.region]) {
            const currentRegion = acc[value.region];
            if (currentRegion[value.year]) {
                if (currentRegion[value.year][value.country]) {
                    currentRegion[value.year][value.country][value.indicator] = value.i;
                } else {
                    currentRegion[value.year][value.country] = {
                        [value.indicator]: value.i
                    }
                }
            } else {
                currentRegion[value.year] = {
                    [value.country]: value.i,
                };
            }
        } else {
            const subregionsYears = {};
            subregionsYears[value.year] = {
                [value.country]: {
                    [value.indicator]: value.i
                }
            };
            acc[value.region] = subregionsYears;
        }
        return acc;
    }, {});
    const regionsYearsIndicatorsMean = Object.fromEntries(Object.keys(regionsYearsCountriesIndicators).map((key) => {
        const region = regionsYearsCountriesIndicators[key];
        return [key, Object.fromEntries(Object.keys(region).map((key) => {
            const year = region[key];
            const indicatorsMean = {
                eco: [],
                edu: [],
                pol: [],
                glob: [],
                health: []
            };
            Object.keys(year).forEach((country) => {
                const currentCountry = year[country];
                Object.keys(currentCountry).forEach((indicator) => {
                    const currentIndicatorValue = currentCountry[indicator];
                    indicatorsMean[indicator].push(currentIndicatorValue);
                })
            });
            Object.keys(indicatorsMean).forEach((key) => {
                const indicatorsSum = indicatorsMean[key].reduce((a, b) => a + b, 0);
                const indicatorsAverage = (indicatorsSum / indicatorsMean[key].length)
                indicatorsMean[key] = indicatorsAverage;
            })
            return [key, indicatorsMean];
        }))];
    }))
    const batchedData = Object.keys(regionsYearsIndicatorsMean).flatMap((regionKey) => {
        const region = regionsYearsIndicatorsMean[regionKey];
        return Object.keys(region).flatMap((yearKey) => {
            const indicatorsMean = region[yearKey];
            return Object.keys(indicatorsMean).flatMap((indicatorKey) => {
                const indicator = indicatorsMean[indicatorKey];
                return {
                    region: regionKey,
                    year: yearKey,
                    indicator: indicatorKey,
                    iMean: indicator
                };
            });
        });
    });
    return batchedData;
}

function mk_filter_data(d, params = {}) {
    const transformedData = transformData(d);
    const indicator = document.getElementById('indicator-chart-2').value
    const region = params.region || document.getElementById('region-chart-2').value
    const filteredData = transformedData.filter((value) => value.region === region && value.indicator === indicator);
    const yearsFrom2006To2020 = Array.from({length: 15}).fill(2006).map((value, index) => value + index);
    return {
        labels: yearsFrom2006To2020,
        datasets: [{
            data: filteredData.map(v => v.iMean),
            fill: 'stack',
            backgroundColor: colorMap[region]
        }]
    }
}

const updateChart2 = () => {
    const indicatorSelect = document.getElementById('indicator-chart-2');
    indicatorSelect.addEventListener("change", () => {
        mk_global_bar_chart.config.data = mk_filter_data(mk_global_base_data);
        mk_global_bar_chart.update();
    })
    const regionSelect = document.getElementById('region-chart-2');
    regionSelect.addEventListener("change", () => {
        mk_global_bar_chart.config.data = mk_filter_data(mk_global_base_data);
        mk_global_bar_chart.update();
    })
    // buttons
    const europeButton = document.getElementById('chart-2-legend-europe');
    europeButton.style = `background-color: ${colorMap.Europe}; color: white; width: 150px; height: 50px`;
    europeButton.addEventListener("click", () => {
        mk_global_bar_chart.config.data = mk_filter_data(mk_global_base_data, {
            region: "Europe"
        });
        mk_global_bar_chart.update();
        document.getElementById('region-chart-2').value = "Europe";
    });
    const africaButton = document.getElementById('chart-2-legend-africa');
    africaButton.style = `background-color: ${colorMap.Africa}; color: white; width: 150px; height: 50px; -webkit-text-stroke-width: 0.7px; -webkit-text-stroke-color: #000000`;
    africaButton.addEventListener("click", () => {
        mk_global_bar_chart.config.data = mk_filter_data(mk_global_base_data, {
            region: "Africa"
        });
        mk_global_bar_chart.update();
        document.getElementById('region-chart-2').value = "Africa";
    });
    const asiaButton = document.getElementById('chart-2-legend-asia');
    asiaButton.style = `background-color: ${colorMap.Asia}; color: white; width: 150px; height: 50px`;
    asiaButton.addEventListener("click", () => {
        mk_global_bar_chart.config.data = mk_filter_data(mk_global_base_data, {
            region: "Asia"
        });
        mk_global_bar_chart.update();
        document.getElementById('region-chart-2').value = "Asia";
    });
    const americasButton = document.getElementById('chart-2-legend-americas');
    americasButton.style = `background-color: ${colorMap.Americas}; color: white; width: 150px; height: 50px`;
    americasButton.addEventListener("click", () => {
        mk_global_bar_chart.config.data = mk_filter_data(mk_global_base_data, {
            region: "Americas"
        });
        mk_global_bar_chart.update();
        document.getElementById('region-chart-2').value = "Americas";
    });
    const oceaniaButton = document.getElementById('chart-2-legend-oceania');
    oceaniaButton.style = `background-color: ${colorMap.Oceania}; color: white; width: 150px; height: 50px`;
    oceaniaButton.addEventListener("click", () => {
        mk_global_bar_chart.config.data = mk_filter_data(mk_global_base_data, {
            region: "Oceania"
        });
        mk_global_bar_chart.update();
        document.getElementById('region-chart-2').value = "Oceania";
    });

};

