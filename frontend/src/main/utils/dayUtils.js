export const calculateDays = (startingDate) => {
    const start = new Date(startingDate);
    const today = new Date();
    const timeDifference = today.getTime() - start.getTime();
    const days = Math.floor(timeDifference / (1000 * 3600 * 24));
    return days;
  };