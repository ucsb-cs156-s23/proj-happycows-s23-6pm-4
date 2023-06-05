
const padWithZero = (n) => { return n < 10 ? '0' + n : n; }

const timestampToDate = (timestamp) => {
    var date = new Date(timestamp);
    return (date.getFullYear() + "-" + (padWithZero(date.getMonth()+1)) + "-" + padWithZero(date.getDate()));
}


const calculateDays = (startingDate,currentDate) => {
    const start = new Date(startingDate);
    const today = new Date(currentDate);
    const timeDifference = today.getTime() - start.getTime();
    const days = Math.floor(timeDifference / (1000 * 3600 * 24))+1;
    return days;
  }

export {timestampToDate, padWithZero, calculateDays};