export function getDeviceId() {
  let id = localStorage.getItem("swasthya_device_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("swasthya_device_id", id);
  }
  return id;
}
