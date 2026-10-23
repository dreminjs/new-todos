export const getDownloadUrl = (key: string) => {
  return `http://localhost:9001/api/v1/buckets/todos-bucket/objects/download?preview=true&prefix=${encodeURIComponent(
    key,
  )}&version_id=null`;
};
