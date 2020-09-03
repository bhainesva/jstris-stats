const countryCodes = require('./countries.js');
const Apify = require('apify');

const urls = countryCodes.map(code => {
  return {
    url: `https://jstris.jezevec10.com/sprint?display=10&country=${code}`
  }
});

Apify.main(async () => {
    // Create a RequestList
    const requestList = await Apify.openRequestList('jstris-countries', urls);

    const dataset = await Apify.openDataset('jstris-40L-leaderboards');

    const getCellContent = (cell) => {
      const text = cell.text().trim();
      if (text === "(V3)") {
        const a = cell.find('a');
        return a.attr('href');
      }

      return text;
    }

    // Function called for each URL
    const handlePageFunction = async ({ request, $ }) => {
        const country = request.url.slice(-3);
        console.log("Processing: ", country);
        const row = $('tr');
        const data = [];

        row.each((_, r) => {
          const tds = $(r).find('td');
          const text = tds.map((_, td) => getCellContent($(td))).get();
          if (text.length) data.push(text);
        });

        // Add data to dataset
        await dataset.pushData({
          country: country,
          data,
         });
    };
    // Create a CheerioCrawler
    const crawler = new Apify.CheerioCrawler({
        requestList,
        handlePageFunction,
    });
    // Run the crawler
    await crawler.run();
});