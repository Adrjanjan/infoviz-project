console.log('chart3 script added')

const bo_colorsMapping = {
    'Northern Africa': "rgb(255, 229, 127)",
    'Sub-Saharan Africa': "rgb(255, 171, 0)",
    'Latin America and the Caribbean': "rgb(255, 100, 100)",
    'Northern America': "rgb(221, 22, 0)",
    'Central Asia': "rgb(128, 216, 255)",
    'Eastern Asia': "rgb(0, 176, 255)",
    'South-eastern Asia': "rgb(83, 109, 254)",
    'Southern Asia': "rgb(48, 79, 254)",
    'Western Asia': "rgb(40, 53, 147)",
    'Eastern Europe': "rgb(209, 196, 233)",
    'Northern Europe': "rgb(149, 117, 205)",
    'Southern Europe': "rgb(156, 39, 176)",
    'Western Europe': "rgb(123, 31, 162)",
    'Australia and New Zealand': "rgb(118, 255, 3)",
    'Melanesia': "rgb(0, 200, 83)",
    "Global Average": "rgb(247,255,0)"
}
const bo_years = [2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020]

let bo_global_base_data
let bo_global_line_chart

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

    const config3 = {
        type: 'line',
        data: prepare_data3(base_data),
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    title: {
                      display: true,
                      text: "Year"
                    },
                    ticks: {
                        display: true
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Index value"
                    },
                    ticks: {
                        display: true
                    }
                }
            },
            animation: {
                duration: 0
            }
        }
    };

    const line_chart3 = new Chart(
        document.getElementById('chart3'),
        config3
    );

    bo_global_base_data = prepare_data3(base_data)
    bo_global_line_chart = line_chart3
});

function filter_data3(d, labels){
    let bo_datasets = []
    labels.forEach(label =>{
        bo_datasets.push({label: label, data: d[label], borderColor: bo_colorsMapping[label], backgroundColor: bo_colorsMapping[label]} )
    })


    return {
        labels: bo_years,
        datasets: bo_datasets
    }
}

function prepare_data3(d) {
    const bo_indicator = "glob"
    const bo_global_average = "Global Average"

    let bo_aggregated_data = {}

   all_subregions.concat(bo_global_average).forEach(subregion => {
       bo_aggregated_data[subregion] = {}

    bo_years.forEach(year => {
        bo_aggregated_data[subregion][year] = []
    })
   })

    d.forEach(record => {
        if (record.indicator == bo_indicator)
        bo_aggregated_data[record.subregion][record.year].push(record.i)
    })

    bo_years.forEach(year => {
        bo_aggregated_data[bo_global_average][year] = []
        d.forEach(record => {
            if (record.indicator === bo_indicator && record.year === year)
                bo_aggregated_data[bo_global_average][year].push(record.i)
        })
    })

    let bo_average_data = {}
    bo_average_data[bo_global_average] = {}
    all_subregions.concat(bo_global_average).forEach(subregion => {
        bo_average_data[subregion] = {}
        bo_years.forEach(year => {
            let bo_agg_arr = bo_aggregated_data[subregion][year]
            bo_average_data[subregion][year] = bo_agg_arr.reduce((a,b) => a + b, 0) / bo_agg_arr.length
        })
    })

    let bo_ready_data = {}
    all_subregions.concat(bo_global_average).forEach(subregion => {
        bo_ready_data[subregion] = []
        bo_years.forEach(year => {
            bo_ready_data[subregion].push(bo_average_data[subregion][year])
        })
    })


    let bo_labels_filtered = all_subregions.concat([bo_global_average])

    const Global_Average_button = document.getElementById('bo_legend_Global_Average');
    Global_Average_button.style = `background-color: ${bo_colorsMapping["Global Average"]}; color: black; width: 200px; height: 50px`;
    Global_Average_button.addEventListener("click", () => {
        const index = bo_labels_filtered.indexOf("Global Average");
        if (index > -1) {
            bo_labels_filtered.splice(index, 1);
            Global_Average_button.style.opacity = '0.5'
        }
        else {
            bo_labels_filtered.push("Global Average")
            Global_Average_button.style.opacity = '1'
        }
        console.log(bo_labels_filtered)
        bo_global_line_chart.config.data = filter_data3(bo_ready_data, bo_labels_filtered)
        bo_global_line_chart.update()
    });
    Global_Average_button.textContent = "Global Average";

    const Northern_Africa_button = document.getElementById('bo_legend_Northern_Africa');
    Northern_Africa_button.style = `background-color: ${bo_colorsMapping['Northern Africa']}; color: black; width: 200px; height: 50px`;
    Northern_Africa_button.addEventListener("click", () => {
        const index = bo_labels_filtered.indexOf('Northern Africa');
        if (index > -1) {
            bo_labels_filtered.splice(index, 1);
            Northern_Africa_button.style.opacity = '0.5'
        }
        else {
            bo_labels_filtered.push('Northern Africa')
            Northern_Africa_button.style.opacity = '1'
        }
        console.log(bo_labels_filtered)
        bo_global_line_chart.config.data = filter_data3(bo_ready_data, bo_labels_filtered)
        bo_global_line_chart.update()
    });
    Northern_Africa_button.textContent = 'Northern Africa';

    const Sub_Saharan_Africa_button = document.getElementById('bo_legend_Sub-Saharan_Africa');
    Sub_Saharan_Africa_button.style = `background-color: ${bo_colorsMapping['Sub-Saharan Africa']}; color: black; width: 200px; height: 50px`;
    Sub_Saharan_Africa_button.addEventListener("click", () => {
        const index = bo_labels_filtered.indexOf('Sub-Saharan Africa');
        if (index > -1) {
            bo_labels_filtered.splice(index, 1);
            Sub_Saharan_Africa_button.style.opacity = '0.5'
        }
        else {
            bo_labels_filtered.push('Sub-Saharan Africa')
            Sub_Saharan_Africa_button.style.opacity = '1'
        }
        console.log(bo_labels_filtered)
        bo_global_line_chart.config.data = filter_data3(bo_ready_data, bo_labels_filtered)
        bo_global_line_chart.update()
    });
    Sub_Saharan_Africa_button.textContent = 'Sub-Saharan Africa';

    const Latin_America_and_the_Caribbean_button = document.getElementById('bo_legend_Latin_America_and_the_Caribbean');
    Latin_America_and_the_Caribbean_button.style = `background-color: ${bo_colorsMapping['Latin America and the Caribbean']}; color: black; width: 300px; height: 50px`;
    Latin_America_and_the_Caribbean_button.addEventListener("click", () => {
        const index = bo_labels_filtered.indexOf('Latin America and the Caribbean');
        if (index > -1) {
            bo_labels_filtered.splice(index, 1);
            Latin_America_and_the_Caribbean_button.style.opacity = '0.5'
        }
        else {
            bo_labels_filtered.push('Latin America and the Caribbean')
            Latin_America_and_the_Caribbean_button.style.opacity = '1'
        }
        console.log(bo_labels_filtered)
        bo_global_line_chart.config.data = filter_data3(bo_ready_data, bo_labels_filtered)
        bo_global_line_chart.update()
    });
    Latin_America_and_the_Caribbean_button.textContent = 'Latin America and the Caribbean';

    const Northern_America_button = document.getElementById('bo_legend_Northern_America');
    Northern_America_button.style = `background-color: ${bo_colorsMapping['Northern America']}; color: black; width: 200px; height: 50px`;
    Northern_America_button.addEventListener("click", () => {
        const index = bo_labels_filtered.indexOf('Northern America');
        if (index > -1) {
            bo_labels_filtered.splice(index, 1);
            Northern_America_button.style.opacity = '0.5'
        }
        else {
            bo_labels_filtered.push('Northern America')
            Northern_America_button.style.opacity = '1'
        }
        console.log(bo_labels_filtered)
        bo_global_line_chart.config.data = filter_data3(bo_ready_data, bo_labels_filtered)
        bo_global_line_chart.update()
    });
    Northern_America_button.textContent = 'Northern America';

    const Central_Asia_button = document.getElementById('bo_legend_Central_Asia');
    Central_Asia_button.style = `background-color: ${bo_colorsMapping['Central Asia']}; color: black; width: 200px; height: 50px`;
    Central_Asia_button.addEventListener("click", () => {
        const index = bo_labels_filtered.indexOf('Central Asia');
        if (index > -1) {
            bo_labels_filtered.splice(index, 1);
            Central_Asia_button.style.opacity = '0.5'
        }
        else {
            bo_labels_filtered.push('Central Asia')
            Central_Asia_button.style.opacity = '1'
        }
        console.log(bo_labels_filtered)
        bo_global_line_chart.config.data = filter_data3(bo_ready_data, bo_labels_filtered)
        bo_global_line_chart.update()
    });
    Central_Asia_button.textContent = 'Central Asia';

    const Eastern_Asia_button = document.getElementById('bo_legend_Eastern_Asia');
    Eastern_Asia_button.style = `background-color: ${bo_colorsMapping['Eastern Asia']}; color: black; width: 200px; height: 50px`;
    Eastern_Asia_button.addEventListener("click", () => {
        const index = bo_labels_filtered.indexOf('Eastern Asia');
        if (index > -1) {
            bo_labels_filtered.splice(index, 1);
            Eastern_Asia_button.style.opacity = '0.5'
        }
        else {
            bo_labels_filtered.push('Eastern Asia')
            Eastern_Asia_button.style.opacity = '1'
        }
        console.log(bo_labels_filtered)
        bo_global_line_chart.config.data = filter_data3(bo_ready_data, bo_labels_filtered)
        bo_global_line_chart.update()
    });
    Eastern_Asia_button.textContent = 'Eastern Asia';

    const South_eastern_Asia_button = document.getElementById('bo_legend_South-eastern_Asia');
    South_eastern_Asia_button.style = `background-color: ${bo_colorsMapping['South-eastern Asia']}; color: black; width: 200px; height: 50px`;
    South_eastern_Asia_button.addEventListener("click", () => {
        const index = bo_labels_filtered.indexOf('South-eastern Asia');
        if (index > -1) {
            bo_labels_filtered.splice(index, 1);
            South_eastern_Asia_button.style.opacity = '0.5'
        }
        else {
            bo_labels_filtered.push('South-eastern Asia')
            South_eastern_Asia_button.style.opacity = '1'
        }
        console.log(bo_labels_filtered)
        bo_global_line_chart.config.data = filter_data3(bo_ready_data, bo_labels_filtered)
        bo_global_line_chart.update()
    });
    South_eastern_Asia_button.textContent = 'South-eastern Asia';

    const Southern_Asia_button = document.getElementById('bo_legend_Southern_Asia');
    Southern_Asia_button.style = `background-color: ${bo_colorsMapping['Southern Asia']}; color: black; width: 200px; height: 50px`;
    Southern_Asia_button.addEventListener("click", () => {
        const index = bo_labels_filtered.indexOf('Southern Asia');
        if (index > -1) {
            bo_labels_filtered.splice(index, 1);
            Southern_Asia_button.style.opacity = '0.5'
        }
        else {
            bo_labels_filtered.push('Southern Asia')
            Southern_Asia_button.style.opacity = '1'
        }
        console.log(bo_labels_filtered)
        bo_global_line_chart.config.data = filter_data3(bo_ready_data, bo_labels_filtered)
        bo_global_line_chart.update()
    });
    Southern_Asia_button.textContent = 'Southern Asia';

    const Western_Asia_button = document.getElementById('bo_legend_Western_Asia');
    Western_Asia_button.style = `background-color: ${bo_colorsMapping['Western Asia']}; color: black; width: 200px; height: 50px`;
    Western_Asia_button.addEventListener("click", () => {
        const index = bo_labels_filtered.indexOf('Western Asia');
        if (index > -1) {
            bo_labels_filtered.splice(index, 1);
            Western_Asia_button.style.opacity = '0.5'
        }
        else {
            bo_labels_filtered.push('Western Asia')
            Western_Asia_button.style.opacity = '1'
        }
        console.log(bo_labels_filtered)
        bo_global_line_chart.config.data = filter_data3(bo_ready_data, bo_labels_filtered)
        bo_global_line_chart.update()
    });
    Western_Asia_button.textContent = 'Western Asia';

    const Eastern_Europe_button = document.getElementById('bo_legend_Eastern_Europe');
    Eastern_Europe_button.style = `background-color: ${bo_colorsMapping['Eastern Europe']}; color: black; width: 200px; height: 50px`;
    Eastern_Europe_button.addEventListener("click", () => {
        const index = bo_labels_filtered.indexOf('Eastern Europe');
        if (index > -1) {
            bo_labels_filtered.splice(index, 1);
            Eastern_Europe_button.style.opacity = '0.5'
        }
        else {
            bo_labels_filtered.push('Eastern Europe')
            Eastern_Europe_button.style.opacity = '1'
        }
        console.log(bo_labels_filtered)
        bo_global_line_chart.config.data = filter_data3(bo_ready_data, bo_labels_filtered)
        bo_global_line_chart.update()
    });
    Eastern_Europe_button.textContent = 'Eastern Europe';

    const Northern_Europe_button = document.getElementById('bo_legend_Northern_Europe');
    Northern_Europe_button.style = `background-color: ${bo_colorsMapping['Northern Europe']}; color: black; width: 200px; height: 50px`;
    Northern_Europe_button.addEventListener("click", () => {
        const index = bo_labels_filtered.indexOf('Northern Europe');
        if (index > -1) {
            bo_labels_filtered.splice(index, 1);
            Northern_Europe_button.style.opacity = '0.5'
        }
        else {
            bo_labels_filtered.push('Northern Europe')
            Northern_Europe_button.style.opacity = '1'
        }
        console.log(bo_labels_filtered)
        bo_global_line_chart.config.data = filter_data3(bo_ready_data, bo_labels_filtered)
        bo_global_line_chart.update()
    });
    Northern_Europe_button.textContent = 'Northern Europe';

    const Southern_Europe_button = document.getElementById('bo_legend_Southern_Europe');
    Southern_Europe_button.style = `background-color: ${bo_colorsMapping['Southern Europe']}; color: black; width: 200px; height: 50px`;
    Southern_Europe_button.addEventListener("click", () => {
        const index = bo_labels_filtered.indexOf('Southern Europe');
        if (index > -1) {
            bo_labels_filtered.splice(index, 1);
            Southern_Europe_button.style.opacity = '0.5'
        }
        else {
            bo_labels_filtered.push('Southern Europe')
            Southern_Europe_button.style.opacity = '1'
        }
        console.log(bo_labels_filtered)
        bo_global_line_chart.config.data = filter_data3(bo_ready_data, bo_labels_filtered)
        bo_global_line_chart.update()
    });
    Southern_Europe_button.textContent = 'Southern Europe';

    const Western_Europe_button = document.getElementById('bo_legend_Western_Europe');
    Western_Europe_button.style = `background-color: ${bo_colorsMapping['Western Europe']}; color: black; width: 200px; height: 50px`;
    Western_Europe_button.addEventListener("click", () => {
        const index = bo_labels_filtered.indexOf('Western Europe');
        if (index > -1) {
            bo_labels_filtered.splice(index, 1);
            Western_Europe_button.style.opacity = '0.5'
        }
        else {
            bo_labels_filtered.push('Western Europe')
            Western_Europe_button.style.opacity = '1'
        }
        console.log(bo_labels_filtered)
        bo_global_line_chart.config.data = filter_data3(bo_ready_data, bo_labels_filtered)
        bo_global_line_chart.update()
    });
    Western_Europe_button.textContent = 'Western Europe';

    const Australia_and_New_Zealand_button = document.getElementById('bo_legend_Australia_and_New_Zealand');
    Australia_and_New_Zealand_button.style = `background-color: ${bo_colorsMapping['Australia and New Zealand']}; color: black; width: 200px; height: 50px`;
    Australia_and_New_Zealand_button.addEventListener("click", () => {
        const index = bo_labels_filtered.indexOf('Australia and New Zealand');
        if (index > -1) {
            bo_labels_filtered.splice(index, 1);
            Australia_and_New_Zealand_button.style.opacity = '0.5'
        }
        else {
            bo_labels_filtered.push('Australia and New Zealand')
            Australia_and_New_Zealand_button.style.opacity = '1'
        }
        console.log(bo_labels_filtered)
        bo_global_line_chart.config.data = filter_data3(bo_ready_data, bo_labels_filtered)
        bo_global_line_chart.update()
    });
    Australia_and_New_Zealand_button.textContent = 'Australia and New Zealand';

    const Melanesia_button = document.getElementById('bo_legend_Melanesia');
    Melanesia_button.style = `background-color: ${bo_colorsMapping['Melanesia']}; color: black; width: 200px; height: 50px`;
    Melanesia_button.addEventListener("click", () => {
        const index = bo_labels_filtered.indexOf('Melanesia');
        if (index > -1) {
            bo_labels_filtered.splice(index, 1);
            Melanesia_button.style.opacity = '0.5'
        }
        else {
            bo_labels_filtered.push('Melanesia')
            Melanesia_button.style.opacity = '1'
        }
        console.log(bo_labels_filtered)
        bo_global_line_chart.config.data = filter_data3(bo_ready_data, bo_labels_filtered)
        bo_global_line_chart.update()
    });
    Melanesia_button.textContent = 'Melanesia';

    let bo_datasets = []
    bo_labels_filtered.forEach(label =>{
        bo_datasets.push({label: label, data: bo_ready_data[label], borderColor: bo_colorsMapping[label], backgroundColor: bo_colorsMapping[label]} )
    })


    return {
        labels: bo_years,
        datasets: bo_datasets
    }
}

