const AUTH_URL = "http://localhost:3000/api/auth";
const CALENDAR_URL = "http://localhost:3000/api/calendar";

// ========== AUTH APIs ==========

// ✅ Login
export const loginUser = async ({ email, password }) => {
  const res = await fetch(`${AUTH_URL}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.text();
  if (!res.ok) throw new Error(data || "Login failed");
  return data;
};

// ✅ Register
export const registerUser = async ({ name, email, password }) => {
  const res = await fetch(`${AUTH_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.text();
  if (!res.ok) throw new Error(data || "Registration failed");
  return data;
};

// ========== CALENDAR APIs ==========

// ✅ Fetch all marked dates for a user
export const fetchMarkedDates = async (email) => {
  const res = await fetch(`${CALENDAR_URL}/${email}`);
  if (!res.ok) throw new Error("Failed to fetch dates");
  return await res.json();
};

// ✅ Mark or unmark a date
export const markDate = async (email, date) => {
  const res = await fetch(`${CALENDAR_URL}/mark`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, date }),
  });

  if (!res.ok) {
    const errData = await res.json();
    throw new Error(errData.message || "Failed to mark date");
  }

  return await res.json();
};
