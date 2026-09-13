export const getDate = (date?: string | Date) => {
  const dateObj = new Date(date ?? "");
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Months are 0-11
  const year = dateObj.getFullYear();

  return `${day}-${month}-${year}`;
};

export const validateUrl = (url: string) => {
  try {
    if (!URL.canParse(url)) return false;
    const urlObj = new URL(url);

    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch (error) {
    return false;
  }
};
