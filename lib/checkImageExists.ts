export async function checkImageExists(url: string) {
  return fetch(url)
    .then((response) => {
      if (response.status === 200) {
        return true; // Image exists
      } else {
        return false; // Image does not exist
      }
    })
    .catch(() => false); // Network error or other issues
}
