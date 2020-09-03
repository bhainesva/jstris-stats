# Jstris Stats

This code pulls the first page of the 40L Sprint leaderboards for each country from [jstris](https://jstris.jezevec10.com/sprint?display=10).

The repo includes the results in the `apify_storage` directory (pulled on Sept 3, 2020).

Each file in `apify_storage/datasets/jstris-40L-leaderboards/` contains the first page of leaderboard times for one country.

`apify_storage/key_value_stores/default/` contains a file `top_time_by_country.json` which is a json obejct mapping the 3 letter country code to the fastest time for that country and `top_avg_of_5_by_country.json` which has the same structure but maps to the average of the 5 fastest times.

## Running

Use node version 12.

`yarn` or `npm install` to install dependencies.

`node scrape.js` to re-scrape the data from jstris and update the `jstris-40L-leaderboards` dataset.

`node parse.js` to recompute the `top_time_by_country.json` and `top_avg_of_5_by_country.json` files.