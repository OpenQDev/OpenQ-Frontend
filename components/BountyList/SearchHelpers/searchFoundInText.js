const searchFoundInText = (title, body, localSearchText) => {
  const lowerCaseContent = (title + body).toLowerCase();
  const lowerCaseSearch = localSearchText.toLowerCase();
  return lowerCaseContent.indexOf(lowerCaseSearch) > -1;
};
export default searchFoundInText;
