export async function checkImageExists(url: string) {
  return fetch(url)
    .then((response) => {
      if (response.status === 200) {
        if (url.length > 8500) {
          throw new Error("Too long url");
        }
        return true; // Image exists
      } else {
        throw new Error("Image doesn't exist"); // Image does not exist
      }
    })
    .catch((error) => {
      throw new Error(error.message);
    }); // Network error or other issues
}
