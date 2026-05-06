"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-sage max-w-none ${className ?? ""}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ children, href, ...props }) => {
            const isExternal = href?.startsWith("http");
            return (
              <a
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "external noopener" : undefined}
                className="text-sage-dark underline hover:text-sage"
                {...props}
              >
                {children}
              </a>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-sage bg-cream/50 pl-4 italic">
              {children}
            </blockquote>
          ),
          h2: ({ children }) => (
            <h2 className="font-heading text-2xl font-bold text-foreground">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-heading text-xl font-bold text-foreground">
              {children}
            </h3>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table>{children}</table>
            </div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
