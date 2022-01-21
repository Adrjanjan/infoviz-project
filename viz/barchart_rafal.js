console.log('chart4 script added')

let rm_global_base_data
let rm_global_bar_chart

let chart4_legend = {
    region: regions,
}

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
    const data_prep = d3.group(base_data, d => d.subregion)
    const intermediate_data = d3.map(data_prep, v => {
                        const sr = v[0]
                        var x = {
                            'subregion': sr,
                            'region': v[1][0].region,
                            'averageGapValues': rm_get_countries_gap_list(v)
                        }
                        return x
                    })
    const final_data = rm_modify_data(intermediate_data)
    const config = {
        type: 'bar',
        data: rm_filter_data(final_data),
        options: {            
            onClick: rm_handle_event,
            plugins: {
                legend: {
                    display: false
                }
            }, 
            scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Subregion name'
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
        
    const rm_bar_chart = new Chart(
        document.getElementById('chart4'),
        config
    );

    rm_global_base_data = final_data 
    rm_global_bar_chart = rm_bar_chart
});

function rm_handle_event(evt){
    console.log("WOLOLOLOLO")
}

function rm_modify_data(iData){
    let i = 0
    result = []
    iData.forEach( rm_y => {
        rm_y.averageGapValues.forEach(x =>{
            var dict = {
                'subregion': rm_y.subregion,
                'region': rm_y.region,
                'year': x.year,
                'indicator': "glob",
                'index': x.glob
            }
            result[i++]=dict

            var dict = {
                'subregion': rm_y.subregion,
                'region': rm_y.region,
                'year': x.year,
                'indicator': "eco",
                'index': x.eco
            }
            result[i++]=dict

            var dict = {
                'subregion': rm_y.subregion,
                'region': rm_y.region,
                'year': x.year,
                'indicator': "edu",
                'index': x.edu
            }
            result[i++]=dict

            var dict = {
                'subregion': rm_y.subregion,
                'region': rm_y.region,
                'year': x.year,
                'indicator': "health",
                'index': x.health
            }
            result[i++]=dict

            var dict = {
                'subregion': rm_y.subregion,
                'region': rm_y.region,
                'year': x.year,
                'indicator': "pol",
                'index': x.pol
            }
            result[i++]=dict
        }
    )}
    )
    return result
}

function rm_get_countries_gap_list(v){
    const result = [];
    for (let i = 0; i < 2021-2006; i++) {
        var dict = {
            "glob": 0,
            "eco": 0,
            "edu": 0,
            "health": 0,
            "pol": 0,
            "glob_id": 0,
            "eco_id": 0,
            "edu_id": 0,
            "health_id": 0,
            "pol_id": 0,
        };
        
        v[1].forEach( x => {
            if(x.year == i+2006){
                dict[x.indicator] += x.i
                dict[x.indicator+"_id"] += 1
            }
        });
        var averageValues = {
            "year": i+2006,
            "glob": Math.round(1000 * dict["glob"]/dict["glob_id"])/1000,
            "eco": Math.round(1000 * dict["eco"]/dict["eco_id"])/1000,
            "edu": Math.round(1000 * dict["edu"]/dict["edu_id"])/1000,
            "health": Math.round(1000 * dict["health"]/dict["health_id"])/1000,
            "pol": Math.round(1000 * dict["pol"]/dict["pol_id"])/1000
        }
        result[i] = (averageValues)
    }
    return result
}

function rm_filter_data(d) {
    const year = rm_get_year()
    const indicator = rm_get_indicator()
    const filtered = d.filter(
        v => v.year == year && 
            v.indicator == indicator
    )
    
    const sorted = filtered.sort(rm_compare)

    return {
        labels: sorted.map(v => v.subregion),
        datasets: [{
            data: sorted.map(v => v.index),
            backgroundColor: sorted.map(get_color)
        }]
    }
}

function rm_compare( a, b ) {
  if ( a.index < b.index ){
    return -1;
  }
  if ( a.index > b.index ){
    return 1;
  }
  return 0;
}
const update_chart4 = _ => {
    rm_global_bar_chart.config.data = rm_filter_data(rm_global_base_data)
    rm_global_bar_chart.update()
}
const rm_get_year = _ => document.getElementById('year_rm').value
const rm_get_indicator = _ => document.getElementById('indicator_rm').value

build_chart4_legend()

function build_chart4_legend(){
    const legend_div = document.getElementById("chart4-legend")
    legend_div.className = "rm_legend"
    for (const region in regions){  
         const region_column = document.createElement('div');
         region_column.id = 'chart4_legend_region_' + region;
         region_column.className = "legend-list"
         const row = document.createElement('span')
         const region_title = document.createElement('span')
         region_title.innerText = region 
         region_title.className = "rm-legend-region"
         region_column.appendChild(region_title)
         regions[region].forEach(s => {
             row.className = "legend-row"

             const square = document.createElement('div') 
             square.className = "rm-square"
             square.style.backgroundColor = get_color({region:region, subregion:s})

             region_column.appendChild(square)
         })
         legend_div.appendChild(region_column)
         legend_div.appendChild(row)

    }
}