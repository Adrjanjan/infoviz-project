console.log('chart1 script added')
// Data preparation 

const africa = ['Northern Africa', 'Sub-Saharan Africa']
const americas = ['Latin America and the Caribbean', 'Northern America']
const asia = ['Central Asia', 'Eastern Asia', 'South-eastern Asia', 'Southern Asia', 'Western Asia']
const europe = ['Eastern Europe', 'Northern Europe', 'Southern Europe', 'Western Europe']
const oceania = ['Australia and New Zealand', 'Melanesia']
const all_subregions = africa.concat(americas).concat(asia).concat(europe).concat(oceania)

const regions = {
    Africa: africa, 
    Americas: americas,
    Asia: asia, 
    Europe: europe, 
    Oceania: oceania
}

const regions_colormap = {
    Africa: ["rgb(255, 255, 141)", "rgb(255, 255, 0)"],
    Americas: ["rgb(255, 110, 64)", "rgb(221, 44, 0)"],
    Asia: ["rgb(128, 216, 255)", "rgb(0, 176, 255)", "rgb(83, 109, 254)", "rgb(48, 79, 254)", "rgb(40, 53, 147)" ],
    Europe: ["rgb(209, 196, 233)", "rgb(149, 117, 205)", "rgb(156, 39, 176)", "rgb(123, 31, 162)" ],
    Oceania: ["rgb(118, 255, 3)", "rgb(0, 200, 83)"]
}
const get_color = v => regions_colormap[v.region][regions[v.region].findIndex(x => x == v.subregion)]


let chart1_legend = {
    region: null,
    subregion: null
}

const chart1_legend_listener = e => {
    // clear selection 
    for (const selected of document.getElementsByClassName("legend-selected")) {
        selected.className = selected.className.replace("legend-selected", "")    
    }

    const target = e.target.className.includes("square") ? e.target.nextElementSibling : e.target

    // deselect same or select different  
    if (target.className.includes("legend-region")) {
        if(chart1_legend.region == target.innerHTML){ 
            chart1_legend.region = null
            target.className = target.className.replace(" legend-selected", "")
        } else { 
            chart1_legend.subregion = null
            chart1_legend.region = target.innerHTML
            target.className += " legend-selected"
        }
    } else {
        if(chart1_legend.subregion == target.innerHTML){
            chart1_legend.subregion = null
            target.className = target.className.replace(" legend-selected", "")
        } else { 
            chart1_legend.region = null
            chart1_legend.subregion = target.innerHTML
            target.className += " legend-selected"
        }
    }
         
    global_bar_chart.config.data = filter_data(global_base_data)
    global_bar_chart.update()
} 

build_chart1_legend()

function build_chart1_legend(){
    const legend_div = document.getElementById("chart1-legend")
    legend_div.className = "legend"
    for (const region in regions){  
         const region_column = document.createElement('div');
         region_column.id = 'chart1_legend_region_' + region;
         region_column.className = "legend-list"
         const region_title = document.createElement('p')
         region_title.innerText = region 
         region_title.onclick = chart1_legend_listener
         region_title.className = "legend-region"
         region_column.appendChild(region_title)
         regions[region].forEach(s => {
             const row = document.createElement('span')
             row.className = "legend-row"
             row.onclick = chart1_legend_listener 

             const square = document.createElement('div') 
             square.className = "square"
             square.style.backgroundColor = get_color({region:region, subregion:s})

             const li = document.createElement('span')
             li.id = 'chart1_legend_subregion' + s
             li.innerHTML = s
             li.className = "legend-subregion"

             row.appendChild(square)
             row.appendChild(li)
             region_column.appendChild(row)
         })
         legend_div.appendChild(region_column)
    }
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
        data: filter_data(base_data),
        options: {            
            onClick: on_click_sort_chart,
            plugins: {
                legend: {
                    display: false
                }
            }, 
            scales: {
                x: { 
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
        
    const bar_chart = new Chart(
        document.getElementById('chart1'),
        config
    );

    global_base_data = base_data 
    global_bar_chart = bar_chart
});


function filter_data(d) {
    const year = get_year()
    const indicator = get_indicator()
    const sort_function = get_sort_function(chart1_sort)
    const subregions = get_subregions()
    const filtered = d.filter(
        v => v.year == year && 
            v.indicator == indicator &&
            subregions.includes(v.subregion) 
    )
    const sorted = filtered.sort(sort_function)

    return {
        labels: sorted.map(v => v.country),
        datasets: [{
            data: sorted.map(v => v.i),
            backgroundColor: sorted.map(get_color)
        }]
    }
}

let chart1_sort = 'country'
const on_click_sort_chart = e => { 
    chart1_sort = chart1_sort == 'country'? 'index' : 'country'
    update_chart1()
}

const update_chart1 = _ => {
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

const get_subregions = _ =>  chart1_legend.region != null 
    ? regions[chart1_legend.region]
    : chart1_legend.subregion != null 
    ? chart1_legend.subregion
    : all_subregions

// Helpers 
const zip = (a, b) => a.map((k, i) => [k, b[i]])
