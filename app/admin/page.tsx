import type { Metadata } from "next";
import { AdminConsole } from "@/app/components/admin-console";

export const metadata: Metadata = {
  title: "Заказы — Вкусно Суши",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminConsole />;
}