// Slow-scrolling strip of the registered business scope. Purely decorative (the full list is on the About page),
// so it is hidden from assistive tech. The list is duplicated so the CSS loop is seamless; it pauses on hover.
export function Marquee({ items }: { items: readonly string[] }) {
  const row = (key: string) => (
    <ul className="marquee-row" key={key}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {row("a")}
        {row("b")}
      </div>
    </div>
  );
}
