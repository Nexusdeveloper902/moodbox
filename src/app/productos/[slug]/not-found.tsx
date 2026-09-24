import { EmptyState } from "@/components/EmptyState";

export default function ProductNotFound() {
  return <EmptyState title="No encontramos este producto" text="Mira todo lo que puedes poner en tu caja." actions={[["Ver productos", "/productos"], ["Volver al inicio", "/"]]} />;
}
