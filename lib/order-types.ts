export const orderStatuses = ["new", "processing", "completed", "cancelled"] as const;
export type OrderStatus = (typeof orderStatuses)[number];

export type StoredOrder = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  customer: {
    name: string;
    phone: string;
    email: string;
    city: string;
    address: string;
    comment: string;
  };
  contactMethod: "Telegram" | "WhatsApp" | "MAX";
  items: {
    productId: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
  }[];
  total: number;
};