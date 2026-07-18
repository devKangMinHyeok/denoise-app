import * as React from "react";
export function Container({ children, style, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div style={{ maxWidth: "var(--page-max)", margin: "0 auto", padding: "0 var(--gutter)", ...style }} {...rest}>
      {children}
    </div>
  );
}
