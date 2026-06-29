import moment from "moment";

export const formatDate = (date, format = "DD MMM YYYY") => {
  if (!date || !moment(date).isValid()) return "";
  const m = moment(date);
  return m.format(format);
};

export const formatTime = (date) => {
  if (!date || !moment(date).isValid()) return "";
  const m = moment(date);
  return m.format("hh:mm A");
};

export const formatPHTime = (date) => {
  if (!date) return "";

  const m = moment(date, "HH:mm:ss", true); // <-- important
  if (!m.isValid()) return "";

  return m.format("hh:mm A");
};

export const getAge = (birthDate) => {
  if (birthDate == null) return 0;
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime()) || birth > new Date()) {
    return 0;
  }
  return Math.floor((Date.now() - birth) / (1000 * 60 * 60 * 24 * 365.25)) || 0;
};
