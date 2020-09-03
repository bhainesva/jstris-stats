const Apify = require('apify');

const hmsToSeconds = (time) => {
  const p = time.split(':');
  let s = 0;
  let m = 1;

  while (p.length > 0) {
      s += m * Number(p.pop());
      m *= 60;
  }

  return s;
}

Apify.main(async () => {
    const dataSet = await Apify.openDataset('jstris-40L-leaderboards');

    const topTime = await dataSet.reduce((memo, item) => {
      if (item.data.length) memo[item.country] = hmsToSeconds(item.data[0][2]);
      return memo;
    }, {})

    const avgTimes = await dataSet.reduce((memo, item) => {
      if (item.data.length) {
        const times = item.data.slice(0, 5)
          .map(data => hmsToSeconds(data[2]));

        const avgTime =  times.reduce((a, b) => a + b / times.length, 0);

        memo[item.country] = avgTime;
      }

      return memo;
    }, {})

    await Apify.setValue('top_time_by_country', topTime);
    await Apify.setValue('top_avg_of_5_by_country', avgTimes);
});
