// Central API fetch wrapper — auto-attaches Bearer token from localStorage

const BASE_URL = "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("accessToken") || "";
}

async function request(method, path, body = null) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json();

  if (!res.ok) {
    throw { status: res.status, message: data.message || "Request failed" };
  }
  return data;
}

const api = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  put: (path, body) => request("PUT", path, body),
  delete: (path) => request("DELETE", path),
};

export default api;
