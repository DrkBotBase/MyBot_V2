const unixTimestampSeconds = (date = new Date()) => Math.floor(date.getTime() / 1000)
 console.log(unixTimestampSeconds(100))