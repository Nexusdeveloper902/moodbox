import { EmptyState } from "@/components/EmptyState";

export default function NotFound() {
  return <EmptyState title="No encontramos esta página" text="Puede que el enlace haya cambiado. Te dejamos por dónde seguir." actions={[["Volver al inicio", "/"], ["Ver MoodBox", "/moodbox"]]} />;
}
