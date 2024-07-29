const isErrorPage = (name) => {
  return ["Result404", "Result403"].includes(name);
};

export default isErrorPage;
