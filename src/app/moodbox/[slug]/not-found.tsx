import { EmptyState } from "@/components/EmptyState";

export default function MoodBoxNotFound() {
  return <EmptyState title="No encontramos esta MoodBox" text="Tenemos tres cajas listas para ti, o puedes armar la tuya." actions={[["Ver MoodBox", "/moodbox"], ["Personalizar mi caja", "/personaliza"]]} />;
}
