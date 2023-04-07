const searchFoundInText = (title, localSearchText) => {
  const lowerCaseContent = title.toLowerCase();
  const lowerCaseSearch = localSearchText.toLowerCase();
  return lowerCaseContent.indexOf(lowerCaseSearch) > -1;
};
export default searchFoundInText;
