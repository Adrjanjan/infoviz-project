# 2021-gggi

Gender Gap Index 2020.
Data used by the World Economic Forum to publish their [Gender Gap Index Report](https://reports.weforum.org/global-gender-gap-report-2020/the-global-gender-gap-index-2020/).

## Content

* **data/** the data in [tsv](https://bl.ocks.org/mbostock/3305937).
	* **gggi.tsv** trips details
	* **iso3.tsv** country codes
* **viz/** sample visualisations
* **vendor/** vendorized d3 v7.1.1 library

## Data structure

The attributes present in the **gggi** table are:

* **#alpha3** the [ISO 3166-1 alpha-3](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) country code
* **indicator** national gender gap benchmark, {'glob', 'eco', 'edu', 'health', 'pol'} for "Global index", "Economic Participation", "Educational Attainment", "Health and Survival" and "Political Empowerment".
* **subtype** type of indicator, {'i', 'r'} for "index" or "rank" (ranks should be computed from index values).
* **year** year of the indicator [2006-2020].
* **index** value of the indicator in the [0.-1.] range, values are floats, nan encodes no value.
* **rank** value of the rank in the [1-156] range, all values are floats, nan encodes no value.

This dataset consists in 157 countries × 5 indicators × 15 years ️= **11775** records.


The attributes present in the **countries** table are:

* **#alpha3** the [ISO 3166-1 alpha-3](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-3) country code (156 values)
* **country** name of the country in english
* **subregion** world subregion (~sub continent)
* **region** world region (~continent)

## Run locally

Run **python3 -m http.server** in main folder and open link printed to console. Then navigate to main.html.
