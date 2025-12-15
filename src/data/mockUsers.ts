import { UserProfile } from "../types/user";

export const mockUsers: Array<
  UserProfile & { password: string; token: string }
> = [
  {
    id: "user-1",
    email: "amelia@luxegems.com",
    firstName: "Amelia",
    lastName: "Stone",
    phone: "+1 555 0199",
    addresses: [
      {
        id: "addr-1",
        label: "Home",
        line1: "123 Radiant Street",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "USA",
        isDefault: true,
      },
      {
        id: "addr-2",
        label: "Work",
        line1: "7 High Street",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "USA",
        isDefault: true,
      },
    ],
    paymentMethods: [
      {
        id: "card-1",
        brand: "Visa",
        last4: "4242",
        expiryMonth: 9,
        expiryYear: 2027,
        isDefault: true,
      },
    ],
    wishlist: [],
    password: "password123",
    token: "token-user-1",
  },
];
