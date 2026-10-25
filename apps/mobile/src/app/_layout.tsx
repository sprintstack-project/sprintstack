import "../global.css";
import { ApiProvider } from "@sprintstack/api-client";
import { Stack } from "expo-router";
import { apiClient } from "@/lib/api-client";

export default function RootLayout() {
  return (
    <ApiProvider value={apiClient}>
      <Stack />
    </ApiProvider>
  );
}
