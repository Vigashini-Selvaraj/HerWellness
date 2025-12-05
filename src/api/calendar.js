import {baseApi} from '../baseapi'
const BASE_URL = `${baseApi}/calendar`;

export async function fetchMarkedDates(email) {
  const res = await fetch(`${BASE_URL}/${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error("Failed to fetch marked dates");
  return res.json();
}

export async function markDate(email, date) {
  const res = await fetch(`${BASE_URL}/mark`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, date }),
  });
  if (!res.ok) throw new Error("Failed to mark date");
  return res.json();
}
