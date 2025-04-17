/**
 * API client for making requests to the backend
 * Includes error handling and authentication
 */

// Base API URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

// Custom error class for API errors
export class ApiError extends Error {
  status: number
  data: any

  constructor(message: string, status: number, data?: any) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.data = data
  }
}

// Helper function to get the auth token
const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

// Generic fetch function with error handling
async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken()

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    // Parse the JSON response
    const data = await response.json()

    // Handle error responses
    if (!response.ok) {
      throw new ApiError(data.message || "An error occurred", response.status, data)
    }

    return data as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    // Handle network errors or JSON parsing errors
    throw new ApiError(error instanceof Error ? error.message : "Network error", 500)
  }
}

// API client with methods for different endpoints
export const api = {
  // Auth endpoints
  auth: {
    login: (email: string, password: string) =>
      fetchWithAuth("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),

    register: (email: string, password: string, firstName?: string, lastName?: string) =>
      fetchWithAuth("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, firstName, lastName }),
      }),

    getProfile: () => fetchWithAuth("/api/auth/profile"),

    updateProfile: (data: any) =>
      fetchWithAuth("/api/auth/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    getSettings: () => fetchWithAuth("/api/auth/settings"),

    updateSettings: (data: any) =>
      fetchWithAuth("/api/auth/settings", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
  },

  // Cost endpoints
  costs: {
    getTotal: (params?: { startDate?: string; endDate?: string; groupBy?: string }) => {
      const queryParams = new URLSearchParams()
      if (params?.startDate) queryParams.append("startDate", params.startDate)
      if (params?.endDate) queryParams.append("endDate", params.endDate)
      if (params?.groupBy) queryParams.append("groupBy", params.groupBy)

      return fetchWithAuth(`/api/costs/total?${queryParams.toString()}`)
    },

    getForecast: () => fetchWithAuth("/api/costs/forecast"),

    getByAccount: (params?: { startDate?: string; endDate?: string }) => {
      const queryParams = new URLSearchParams()
      if (params?.startDate) queryParams.append("startDate", params.startDate)
      if (params?.endDate) queryParams.append("endDate", params.endDate)

      return fetchWithAuth(`/api/costs/by-account?${queryParams.toString()}`)
    },
  },

  // Recommendations endpoints
  recommendations: {
    getAll: (params?: { status?: string; impact?: string; provider?: string; type?: string }) => {
      const queryParams = new URLSearchParams()
      if (params?.status) queryParams.append("status", params.status)
      if (params?.impact) queryParams.append("impact", params.impact)
      if (params?.provider) queryParams.append("provider", params.provider)
      if (params?.type) queryParams.append("type", params.type)

      return fetchWithAuth(`/api/recommendations?${queryParams.toString()}`)
    },

    getById: (id: string) => fetchWithAuth(`/api/recommendations/${id}`),

    updateStatus: (id: string, status: string, notes?: string) =>
      fetchWithAuth(`/api/recommendations/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status, notes }),
      }),

    getSummary: () => fetchWithAuth("/api/recommendations/summary"),
  },

  // Alerts endpoints
  alerts: {
    getAll: (params?: { status?: string; severity?: string; category?: string; limit?: number; offset?: number }) => {
      const queryParams = new URLSearchParams()
      if (params?.status) queryParams.append("status", params.status)
      if (params?.severity) queryParams.append("severity", params.severity)
      if (params?.category) queryParams.append("category", params.category)
      if (params?.limit) queryParams.append("limit", params.limit.toString())
      if (params?.offset) queryParams.append("offset", params.offset.toString())

      return fetchWithAuth(`/api/alerts?${queryParams.toString()}`)
    },

    getById: (id: string) => fetchWithAuth(`/api/alerts/${id}`),

    updateStatus: (id: string, status: string) =>
      fetchWithAuth(`/api/alerts/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      }),

    markAllAsRead: () =>
      fetchWithAuth("/api/alerts/mark-all-read", {
        method: "POST",
      }),

    getSummary: () => fetchWithAuth("/api/alerts/summary"),
  },

  // Cloud accounts endpoints
  accounts: {
    // AWS accounts
    aws: {
      getAll: () => fetchWithAuth("/api/aws/accounts"),

      getById: (id: string) => fetchWithAuth(`/api/aws/accounts/${id}`),

      create: (data: any) =>
        fetchWithAuth("/api/aws/accounts", {
          method: "POST",
          body: JSON.stringify(data),
        }),

      update: (id: string, data: any) =>
        fetchWithAuth(`/api/aws/accounts/${id}`, {
          method: "PUT",
          body: JSON.stringify(data),
        }),

      delete: (id: string) =>
        fetchWithAuth(`/api/aws/accounts/${id}`, {
          method: "DELETE",
        }),

      sync: (id: string) =>
        fetchWithAuth(`/api/aws/accounts/${id}/sync`, {
          method: "POST",
        }),

      getCosts: (id: string, params?: { startDate?: string; endDate?: string; groupBy?: string }) => {
        const queryParams = new URLSearchParams()
        if (params?.startDate) queryParams.append("startDate", params.startDate)
        if (params?.endDate) queryParams.append("endDate", params.endDate)
        if (params?.groupBy) queryParams.append("groupBy", params.groupBy)

        return fetchWithAuth(`/api/aws/accounts/${id}/costs?${queryParams.toString()}`)
      },

      getResources: (id: string, params?: { resourceType?: string; status?: string }) => {
        const queryParams = new URLSearchParams()
        if (params?.resourceType) queryParams.append("resourceType", params.resourceType)
        if (params?.status) queryParams.append("status", params.status)

        return fetchWithAuth(`/api/aws/accounts/${id}/resources?${queryParams.toString()}`)
      },
    },

    // Azure accounts
    azure: {
      getAll: () => fetchWithAuth("/api/azure/accounts"),

      getById: (id: string) => fetchWithAuth(`/api/azure/accounts/${id}`),

      create: (data: any) =>
        fetchWithAuth("/api/azure/accounts", {
          method: "POST",
          body: JSON.stringify(data),
        }),

      update: (id: string, data: any) =>
        fetchWithAuth(`/api/azure/accounts/${id}`, {
          method: "PUT",
          body: JSON.stringify(data),
        }),

      delete: (id: string) =>
        fetchWithAuth(`/api/azure/accounts/${id}`, {
          method: "DELETE",
        }),

      sync: (id: string) =>
        fetchWithAuth(`/api/azure/accounts/${id}/sync`, {
          method: "POST",
        }),

      getResources: (id: string, params?: { resourceType?: string; status?: string }) => {
        const queryParams = new URLSearchParams()
        if (params?.resourceType) queryParams.append("resourceType", params.resourceType)
        if (params?.status) queryParams.append("status", params.status)

        return fetchWithAuth(`/api/azure/accounts/${id}/resources?${queryParams.toString()}`)
      },
    },

    // GCP accounts
    gcp: {
      getAll: () => fetchWithAuth("/api/gcp/accounts"),

      getById: (id: string) => fetchWithAuth(`/api/gcp/accounts/${id}`),

      create: (data: any) =>
        fetchWithAuth("/api/gcp/accounts", {
          method: "POST",
          body: JSON.stringify(data),
        }),

      update: (id: string, data: any) =>
        fetchWithAuth(`/api/gcp/accounts/${id}`, {
          method: "PUT",
          body: JSON.stringify(data),
        }),

      delete: (id: string) =>
        fetchWithAuth(`/api/gcp/accounts/${id}`, {
          method: "DELETE",
        }),

      sync: (id: string) =>
        fetchWithAuth(`/api/gcp/accounts/${id}/sync`, {
          method: "POST",
        }),

      getResources: (id: string, params?: { resourceType?: string; status?: string }) => {
        const queryParams = new URLSearchParams()
        if (params?.resourceType) queryParams.append("resourceType", params.resourceType)
        if (params?.status) queryParams.append("status", params.status)

        return fetchWithAuth(`/api/gcp/accounts/${id}/resources?${queryParams.toString()}`)
      },
    },
  },

  // Resources endpoints
  resources: {
    getAll: (params?: { provider?: string; resourceType?: string; status?: string }) => {
      const queryParams = new URLSearchParams()
      if (params?.provider) queryParams.append("provider", params.provider)
      if (params?.resourceType) queryParams.append("resourceType", params.resourceType)
      if (params?.status) queryParams.append("status", params.status)

      return fetchWithAuth(`/api/resources?${queryParams.toString()}`)
    },

    getById: (id: string) => fetchWithAuth(`/api/resources/${id}`),

    getMetrics: (id: string, params?: { metric?: string; period?: string; startTime?: string; endTime?: string }) => {
      const queryParams = new URLSearchParams()
      if (params?.metric) queryParams.append("metric", params.metric)
      if (params?.period) queryParams.append("period", params.period)
      if (params?.startTime) queryParams.append("startTime", params.startTime)
      if (params?.endTime) queryParams.append("endTime", params.endTime)

      return fetchWithAuth(`/api/resources/${id}/metrics?${queryParams.toString()}`)
    },

    getTags: (id: string) => fetchWithAuth(`/api/resources/${id}/tags`),

    updateTags: (id: string, tags: Record<string, string>) =>
      fetchWithAuth(`/api/resources/${id}/tags`, {
        method: "PUT",
        body: JSON.stringify({ tags }),
      }),
  },
}
