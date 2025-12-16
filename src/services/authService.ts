import { mockUsers } from "../data/mockUsers";
import { UserProfile } from "../types/user";

const simulateNetworkDelay = async (ms = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const authService = {
  async login(email: string, password: string) {
    await simulateNetworkDelay();
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password,
    );
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const { token, password: _, ...profile } = user;
    return { token, user: profile as UserProfile };
  },

  async me(token: string): Promise<UserProfile> {
    await simulateNetworkDelay();
    const user = mockUsers.find((u) => u.token === token);
    if (!user) {
      throw new Error("User session expired");
    }
    const { password: _, token: __, ...profile } = user;
    return profile;
  },
};
