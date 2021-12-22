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
            // TODO DODAC ONCLICKI DO SAMEGO WYKRESU 
            plugins: {
                // legend: {
                //     display: true,
                //     // onclick: 
                //     labels: {
                //         data: regions,
                //         color: regions_colormap
                //     }
                // }
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
        const year = get_year()
        const indicator = get_indicator()

        const filtered = base_data.filter(
            v => v.year == year && 
                v.indicator == indicator
        )
        return {
            labels: filtered.map(v => v.country),
            datasets: [{
                data: filtered.map(v => v.i)
            }]
        }
    }
});


function prepare_data() {
    const year = get_year()
    const indicator = get_indicator()

    const filtered = global_base_data.filter(
        v => v.year == year && 
            v.indicator == indicator
    )

    return {
        labels: filtered.map(v => v.country),
        datasets: [{
            data: filtered.map(v => v.i)
        }]
    }
}

// Listeners 
function indicator_selector(){
    console.log("indicator = " + get_indicator())
    global_bar_chart.config.data = prepare_data()
    global_bar_chart.update()
}

function year_slider(){
    console.log("year =" + get_year())
    global_bar_chart.config.data = prepare_data()
    global_bar_chart.update()
}

//  Getters
function get_year(){
    return document.getElementById('year').value
}

function get_indicator(){
    return document.getElementById('indicator').value
}