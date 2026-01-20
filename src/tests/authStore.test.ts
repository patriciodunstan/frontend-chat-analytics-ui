import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAuthStore } from "../stores/authStore";
import { authApi } from "../services/api";

// Mock API
vi.mock("../services/api", () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    getMe: vi.fn(),
  },
}));

describe("authStore", () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("handles successful login", async () => {
    const mockUser = {
      id: 1,
      email: "test@test.com",
      full_name: "Test",
      role: "viewer",
    };
    const mockResponse = {
      data: { access_token: "fake-token", user: mockUser },
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (authApi.login as any).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      await result.current.login("test@test.com", "pass");
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe("fake-token");
    expect(result.current.isAuthenticated).toBe(true);
    expect(localStorage.getItem("token")).toBe("fake-token");
  });

  it("handles login failure", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (authApi.login as any).mockRejectedValue({
      response: { data: { detail: "Invalid credentials" } },
    });

    const { result } = renderHook(() => useAuthStore());

    await act(async () => {
      try {
        await result.current.login("test@test.com", "wrong");
      } catch {
        // Expected error
      }
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBe("Invalid credentials");
  });

  it("handles logout", () => {
    useAuthStore.setState({
      token: "token",
      isAuthenticated: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      user: { id: 1 } as any,
    });
    localStorage.setItem("token", "token");

    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.logout();
    });

    expect(result.current.token).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem("token")).toBeNull();
  });
});
