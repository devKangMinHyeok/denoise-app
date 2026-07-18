import * as React from "react";
export function Section({ children, style, ...rest }: React.HTMLAttributes<HTMLElement>) {
  return (
    <section style={{ position: "relative", padding: "clamp(72px, 9vw, 110px) 0", ...style }} {...rest}>
      {children}
    </section>
  );
}
