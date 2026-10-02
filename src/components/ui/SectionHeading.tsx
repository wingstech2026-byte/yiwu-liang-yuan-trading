interface Props {
  eyebrow?: string;
  title: string;
  text?: string;
  center?: boolean;
  as?: "h1" | "h2";
  id?: string; // heading id, for aria-labelledby on the parent section
}

export function SectionHeading({ eyebrow, title, text, center, as: Tag = "h2", id }: Props) {
  return (
    <div className={`section-heading${center ? " section-heading--center" : ""}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Tag id={id}>{title}</Tag>
      {text && <p className="lead">{text}</p>}
    </div>
  );
}
