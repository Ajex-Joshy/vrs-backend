import "dotenv/config";

const baseUrl = process.env.SMOKE_BASE_URL ?? "http://127.0.0.1:3000";

const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@vrs.local";
const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin@1234";
const userEmail = process.env.SEED_USER_EMAIL ?? "user@vrs.local";
const userPassword = process.env.SEED_USER_PASSWORD ?? "User@1234";

type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  code?: string;
  message?: string;
};

const callApi = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> => {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  const body = (await response.json()) as ApiResponse<T>;

  if (!response.ok) {
    throw new Error(
      `${options.method ?? "GET"} ${path} failed: ${body.code ?? "UNKNOWN"} ${
        body.message ?? "Request failed"
      }`,
    );
  }

  return body;
};

const run = async () => {
  const adminLogin = await callApi<{ accessToken: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: adminEmail, password: adminPassword }),
  });

  const userLogin = await callApi<{ accessToken: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: userEmail, password: userPassword }),
  });

  const adminToken = adminLogin.data?.accessToken;
  const userToken = userLogin.data?.accessToken;

  if (!adminToken || !userToken) {
    throw new Error("Login token missing in response");
  }

  const me = await callApi<{ userId: string; email: string; role: string }>("/auth/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${userToken}` },
  });

  const userId = me.data?.userId;

  if (!userId) {
    throw new Error("/auth/me did not return userId");
  }

  const registrationNumber = `SMK-${Date.now()}`;

  const vehicle = await callApi<{ id: string }>("/vehicles", {
    method: "POST",
    headers: { Authorization: `Bearer ${adminToken}` },
    body: JSON.stringify({
      name: "Smoke Sedan",
      brand: "SmokeBrand",
      model: "S1",
      registrationNumber,
      pricePerDay: 49.99,
    }),
  });

  const vehicleId = vehicle.data?.id;

  if (!vehicleId) {
    throw new Error("Vehicle creation did not return id");
  }

  await callApi("/vehicles?page=1&limit=10&sortBy=name&sortOrder=asc", {
    method: "GET",
    headers: { Authorization: `Bearer ${adminToken}` },
  });

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 2);

  const rental = await callApi<{ id: string }>("/rentals", {
    method: "POST",
    headers: { Authorization: `Bearer ${userToken}` },
    body: JSON.stringify({
      userId,
      vehicleId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    }),
  });

  const rentalId = rental.data?.id;

  if (!rentalId) {
    throw new Error("Rental creation did not return id");
  }

  await callApi("/rentals/" + rentalId + "/return", {
    method: "POST",
    headers: { Authorization: `Bearer ${userToken}` },
    body: JSON.stringify({ returnDate: new Date().toISOString() }),
  });

  await callApi("/payments", {
    method: "POST",
    headers: { Authorization: `Bearer ${userToken}` },
    body: JSON.stringify({
      rentalId,
      amount: 99.98,
      method: "CARD",
    }),
  });

  console.log("Smoke test passed");
};

run().catch((error) => {
  console.error("Smoke test failed", error);
  process.exit(1);
});
