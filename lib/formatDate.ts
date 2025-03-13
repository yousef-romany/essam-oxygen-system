/* eslint-disable @typescript-eslint/no-explicit-any */
export function formatDate(timestamp: any) {
    // Convert the timestamp to a Date object
    const date = new Date(parseInt(timestamp, 10));

    // Extract the year, month, and day
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
    const day = String(date.getDate()).padStart(2, '0');

    // Format the date as YYYY/MM/DD
    return `${year}/${month}/${day}`;
}



export function formatToYearMonth(dateStr: any) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // ضمان وجود رقمين
    return `${year}-${month}`;
}