const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://business-sales-revenue-prediction-system-tnhx.onrender.com";

async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;

    try {
      const data = await response.json();
      errorMessage = data.message || errorMessage;
    } catch {
      // Keep default error message
    }

    throw new Error(errorMessage);
  }

  return response.json();
}


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

  return handleResponse(response);
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

  return handleResponse(response);
}


export async function predictSales(predictionData) {
  const response = await fetch(`${API_BASE_URL}/api/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(predictionData),
  });

  return handleResponse(response);
}


export async function getPredictionHistory(email) {
  const response = await fetch(
    `${API_BASE_URL}/api/history?email=${encodeURIComponent(email)}`
  );

  return handleResponse(response);
}


export async function getDashboardStats(email) {
  const response = await fetch(
    `${API_BASE_URL}/api/dashboard?email=${encodeURIComponent(email)}`
  );

  return handleResponse(response);
}


export async function getModelMetrics() {
  const response = await fetch(
    `${API_BASE_URL}/api/model-metrics`
  );

  return handleResponse(response);
}


export async function getModelComparison() {
  const response = await fetch(
    `${API_BASE_URL}/api/model-comparison`
  );

  return handleResponse(response);
}

export async function getSalesTrend() {
  const response = await fetch(
    `${API_BASE_URL}/api/sales-trend`
  );

  return handleResponse(response);
}

export async function getPerformance(email) {
  const response = await fetch(
    `${API_BASE_URL}/api/performance?email=${encodeURIComponent(email)}`
  );

  return handleResponse(response);
}