export const getImageUrl = (path) => {
  if (!path) {
    return "";
  }

  if (/^(https?:)?\/\//.test(path)) {
    return path;
  }

  if (path.startsWith("/assets/")) {
    return path;
  }

  if (path.startsWith("/")) {
    return `/assets${path}`;
  }

  return `/assets/${path}`;
};
  
