export const DB_NAME = "Roxiler"

export const getMonthNumber = (month) => {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      return months.indexOf(month) + 1;
};