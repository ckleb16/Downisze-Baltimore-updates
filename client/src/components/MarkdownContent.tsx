import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

type MarkdownContentProps = {
  children: string;
  className?: string;
};

export default function MarkdownContent({ children, className }: MarkdownContentProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        skipHtml
        components={{
          h1: ({ children: heading }) => <h2>{heading}</h2>,
          img: () => null,
          a: ({ href, children: linkText }) => (
            <a href={href} rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}>
              {linkText}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
