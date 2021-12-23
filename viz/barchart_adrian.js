console.log('chart1 script added')
// Data preparation 

const africa = ['Northern Africa', 'Sub-Saharan Africa']
const americas = ['Latin America and the Caribbean', 'Northern America']
const asia = ['Central Asia', 'Eastern Asia', 'South-eastern Asia', 'Southern Asia', 'Western Asia']
const europe = ['Eastern Europe', 'Northern Europe', 'Southern Europe', 'Western Europe']
const oceania = ['Australia and New Zealand', 'Melanesia']

const regions = {
    Africa: africa, 
    Americas: americas,
    Asia: asia, 
    Europe: europe, 
    Oceania: oceania
}

const regions_colormap = {
    Africa: ["rgb(255,249,174)", "rgb(248,237,98)", "rgb(233,215,0)", "rgb(218,182,0)", "rgb(169,134,0)"],
    Americas: ["rgb(255,186,186)", "rgb(255,123,123)", "rgb(255,82,82)", "rgb(255,0,0)", "rgb(167,0,0)"],
    Asia: ["rgb(35,77,32)", "rgb(54,128,45)", "rgb(119,171,89)", "rgb(201,223,138)", "rgb(240,247,218)"],
    Europe: ["rgb(153,153,153)", "rgb(119,119,119)", "rgb(85,85,85)", "rgb(51,51,51)", "rgb(17,17,17)"],
    Oceania: ["rgb(0,80,115)", "rgb(16,125,172)", "rgb(24,154,211)", "rgb(30,187,215)", "rgb(113,199,236)"],
}


let global_base_data
let global_bar_chart
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
        type: 'bar',
        data: prepare_data(),
        options: {            
            onClick: on_click_sort_chart,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    };
    console.log(config)
    const bar_chart = new Chart(
        document.getElementById('chart1'),
        config
    );

    global_base_data = base_data 
    global_bar_chart = bar_chart

    function prepare_data() {
        return filter_data(base_data)
    }
});


// Behaviour 
function filter_data(d) {
    const year = get_year()
    const indicator = get_indicator()
    const sort_function = get_sort_function(actual_sort)

    const filtered = d.filter(
        v => v.year == year && 
            v.indicator == indicator
    )
    const sorted = filtered.sort(sort_function)

    return {
        labels: sorted.map(v => v.country),
        datasets: [{
            data: sorted.map(v => v.i),
            backgroundColor: sorted.map(v => regions_colormap[v.region].at(regions[v.region]))
        }]
    }
}

let actual_sort = 'country'
const on_click_sort_chart = e => { // sort name <-> index
    let sort_function
    if( actual_sort == 'country'){
        console.log('now sort index')
        sort_function = (a, b) => a[1] - b[1]
        actual_sort = 'index'
    } else {
        console.log('now sort country')
        sort_function = (a, b) => a[0].localeCompare(b[0])
        actual_sort = 'country'
    }

    const data = e.chart.data 
    const sorted = zip(data.labels, data.datasets[0].data).sort(sort_function)
    data.labels = sorted.map(a=>a[0])
    data.datasets[0].data = sorted.map(a=>a[1])
    global_bar_chart.update()
}

// Listeners 
function indicator_selector(){
    console.log("indicator = " + get_indicator())
    global_bar_chart.config.data = filter_data(global_base_data)
    global_bar_chart.update()
}

function year_slider(){
    console.log("year =" + get_year())
    global_bar_chart.config.data = filter_data(global_base_data)
    global_bar_chart.update()
}

//  Getters
const get_year = _ => document.getElementById('year').value
const get_indicator = _ => document.getElementById('indicator').value
const get_sort_function = sort => new Map([
        ['country', (a, b) => a.country.localeCompare(b.country)],
        ['index', (a, b) => a.i - b.i]
    ]).get(sort)

// Helpers 
const zip = (a, b) => a.map((k, i) => [k, b[i]])
