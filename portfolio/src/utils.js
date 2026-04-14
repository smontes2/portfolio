export const getImageUrl = (path) => {
  if (!path) {
    return "";
  }

  if (/^(https?:)?\/\//.test(path) || path.startsWith("/")) {
    return path;
  }

  return `/assets/${path}`;
};
  
