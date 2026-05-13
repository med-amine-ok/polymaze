import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/Navbar";
import Content from "../components/register/content";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "POLYMAZE 2026 · Registration" },
      { name: "description", content: "Register for POLYMAZE 2026." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <main className="bg-black text-white antialiased">
      <Navbar />
      <Content />
    </main>
  );
}
