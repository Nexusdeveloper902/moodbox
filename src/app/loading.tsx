export default function Loading() {
  return (
    <div className="wrap grid min-h-[50vh] place-items-center" role="status" aria-label="Cargando">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/moodbox/icon.svg" alt="" className="size-14 animate-bounce" />
    </div>
  );
}
