import axios from "axios";
import useAuthService from "@/services/useAuthService";

jest.mock("axios");

describe("useAuthService", () => {
  let auth;
  let isAuthenticated;

  beforeEach(() => {
    let authService = useAuthService();
    auth = authService.auth;
    isAuthenticated = authService.isAuthenticated;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should set up a logged-in session on successful token retrieval", async () => {
    const data = {
      authToken: "token",
      username: "username",
      hasSubscription: true,
    };

    axios.get.mockResolvedValueOnce({ status: 200, data });
    
    await auth.getTokenSilently();

    expect(isAuthenticated.value).toBe(true);
    expect(auth.token).toBe(data.authToken);
    expect(auth.user.username).toBe(data.username);
    expect(auth.user.hasSubscription).toBe(data.hasSubscription);
  });

  it("should tear down logged-in session on token retrieval error", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network error"));

    try {
      await auth.getTokenSilently();
    } catch (e) {
      expect(e).toEqual("Network error");
    }

    expect(isAuthenticated.value).toBe(false);
    expect(auth.user.username).toBeNull();
    expect(auth.user.hasSubscription).toBe(false);
  });

  it("should log in with supplied username and password on successful login", async () => {
    const username = "testUser";
    const password = "testPassword";

    axios.post.mockResolvedValueOnce({ status: 200 });

    await auth.loginWithSupplied(username, password);

    expect(isAuthenticated.value).toBe(true);
    expect(auth.user.hasSubscription).toBe(false);
  });

  it("should tear down logged-in session on login error", async () => {
    axios.post.mockRejectedValueOnce(new Error("Authentication failed"));

    try {
      await auth.loginWithSupplied("testUser", "testPassword");
    } catch (e) {
      expect(e).toEqual("Authentication failed");
    }

    expect(isAuthenticated.value).toBe(false);
    expect(auth.user.username).toBeNull();
    expect(auth.user.hasSubscription).toBe(false);
  });

  it("should initialize password reset with supplied username and email", async () => {
    const username = "testUser";
    const email = "test@example.com";

    axios.post.mockResolvedValueOnce({ status: 200 });

    await auth.pwResetWithSupplied(username, email);
  });

  it("should update password with supplied new password and confirmed password", async () => {
    const newPassword = "newPassword";
    const newPasswordConfirmed = "newPasswordConfirmed";

    axios.put.mockResolvedValueOnce({ status: 200 });

    await auth.pwUpdateWithSupplied(newPassword, newPasswordConfirmed);
  });

  it("should register with supplied username, email, password, and user type", async () => {
    const username = "testUser";
    const email = "test@example.com";
    const password = "testPassword";
    const userType = "user";

    axios.post.mockResolvedValueOnce({ status: 200 });

    await auth.registerWithSupplied(username, email, password, userType);
  });

  it("should log out successfully", async () => {
    const authToken = "token";
    auth.token = authToken;

    axios.get.mockResolvedValueOnce({ status: 200 });

    await auth.logout();

    expect(isAuthenticated.value).toBe(false);
    expect(auth.user.username).toBeNull();
    expect(auth.user.hasSubscription).toBe(false);
  });

  it("should reject with an error on logout error", async () => {
    const authToken = "token";
    auth.token = authToken;

    axios.get.mockRejectedValueOnce(new Error("Logout failed"));

    try {
      await auth.logout();
    } catch (e) {
      expect(e).toEqual("Logout failed");
    }

    expect(isAuthenticated.value).toBe(false);
    expect(auth.user.username).toBeNull();
    expect(auth.user.hasSubscription).toBe(false);
  });
});
