export const formatDateForInput = (dateString?: string) => {
  if (!dateString) return ""; // Return empty string if undefined/null
  return dateString.split(" ")[0]; // Extracts only 'YYYY-MM-DD'
};