const API_BASE_URL = "http://127.0.0.1:5000";

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return await response.json();
}

export async function registerUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  return await response.json();
}

export async function predictSales(predictionData) {
  const response = await fetch(`${API_BASE_URL}/api/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(predictionData),
  });

  return await response.json();
}

export async function getPredictionHistory(email) {
  const response = await fetch(
    `${API_BASE_URL}/api/history?email=${encodeURIComponent(email)}`
  );

  return await response.json();
}

export async function getDashboardStats(email) {
  const response = await fetch(
    `${API_BASE_URL}/api/dashboard?email=${encodeURIComponent(email)}`
  );

  return await response.json();
}


export async function getModelMetrics() {
  const response = await fetch(
    `${API_BASE_URL}/api/model-metrics`
  );

  return await response.json();
}

export async function getSalesTrend() {
  const response = await fetch(
    `${API_BASE_URL}/api/sales-trend`
  );

  return await response.json();
}
