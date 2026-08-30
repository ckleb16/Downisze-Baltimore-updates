import { Anchor } from "lucide-react";

type AnchorLineLabelProps = {
  children: React.ReactNode;
  className?: string;
  decorative?: boolean;
};

export default function AnchorLineLabel({ children, className = "", decorative = false }: AnchorLineLabelProps) {
  return (
    <div className={`anchor-line-label ${className}`.trim()} aria-hidden={decorative || undefined}>
      <Anchor size={20} strokeWidth={1.5} aria-hidden="true" />
      <span className="anchor-line-label__rule" aria-hidden="true" />
      <span className="anchor-line-label__text">{children}</span>
    </div>
  );
}
