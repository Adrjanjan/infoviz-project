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
    Africa: [rgb(255,249,174), rgb(248,237,98), rgb(233,215,0), rgb(218,182,0), rgb(169,134,0)],
    Americas: [rgb(255,186,186), rgb(255,123,123), rgb(255,82,82), rgb(255,0,0), rgb(167,0,0)],
    Asia: [rgb(35,77,32), rgb(54,128,45), rgb(119,171,89), rgb(201,223,138), rgb(240,247,218)],
    Europe: [rgb(153,153,153), rgb(119,119,119), rgb(85,85,85), rgb(51,51,51), rgb(17,17,17)],
    Oceania: [rgb(0,80,115), rgb(16,125,172), rgb(24,154,211), rgb(30,187,215), rgb(113,199,236)],
}



// const labels = [
//     'January',
//     'February',
//     'March',
//     'April',
//     'May',
//     'June',
// ];
// const data = {
//     labels: labels,
//     datasets: [{
//     label: 'My First dataset',
//     backgroundColor: 'rgb(255, 99, 132)',
//     borderColor: 'rgb(255, 99, 132)',
//     data: [0, 10, 5, 2, 20, 30, 45],
//     }]
// };

// const config = {
//     type: 'bar',
//     data: data,
//     options: {}
// };

// Chart creation 

// const myChart = new Chart(
//     document.getElementById('myChart'),
//     config
// );

// Listeners 

function indicator_selector(){
    const indicator = document.getElementById('indicator')
    console.log("indicator = " + indicator)
}

function year_slider(){
    const year = document.getElementById('year')
    console.log("year =" + year)
}








// Promise.all([
//     d3.tsv("../data/gggi.tsv", d => ({
//         iso3:      d['#alpha3'],
//         indicator: d.indicator,
//         year:     +d.year,
//         i:        +d.index,
//         r:        +d.rank,
//     })),
    
//     d3.tsv("../data/iso3.tsv", d => ({
//         iso3:      d['#alpha3'],
//         country:   d.country,
//         subregion: d.subregion,
//         region:    d.region,
//     })),	
    
//     ]).then(

// function(datasets) {
// 	console.log(datasets)
// 	// map 3 letters country codes to countries
// 	let countries = Object.fromEntries(datasets[1].map(c => [c.iso3, c]));
// 	let data = datasets[0]; // gggi dataset
	
// 	// dropdown years
// 	let dropdown = body.select('h1').append('select');
// 	let years = [...new Set(data.map(d => d.year))].sort(d3.descending); // collect the years from data set
// 	var options = dropdown.selectAll('option')
// 		.data(years)
// 		.enter().append('option')
// 			.text(d => d)
// 			.attr('value', d => d);

// 	let dropdown2 = body.select('h1').append('select');
// 	var options = dropdown2.selectAll('option')
// 		.data(years)
// 		.enter().append('option')
// 			.text(d => d)
// 			.attr('value', d => d);


// 	// build country list for given year
// 	var country_list = body.append('ol');	
// 	function update(year) {
// 		var selection = country_list.selectAll('li')
// 			.data(data
// 				.filter(d => d.year == year)             // consider data for given year
// 				.filter(d => d.indicator == 'glob')      // consider global index
// 				.filter(d => !isNaN(d.i))                // filter out nans
// 				.sort((a, b) => d3.descending(a.i, b.i)) // sort according to index
// 				.slice(0, 20)                            // keep top-20
// 			)
// 			.join('li')                                  // enter, update, exit at once
// 				.text(d => `${countries[d.iso3].country} – ${f(d.i)}`);
// 	}
	
// 	dropdown.on('change', e => {
// 		update(dropdown.property('value'));
// 	});
// 	dropdown.dispatch('change'); // force initial update

// });


