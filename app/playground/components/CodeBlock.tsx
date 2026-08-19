/** A read-only code snippet. Pairs the live demo with the conveyor code that drives it. */
export function CodeBlock({ code, caption }: { code: string; caption?: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      {caption && (
        <div className="border-b border-border bg-muted/40 px-4 py-1.5 text-xs font-medium text-muted-foreground">
          {caption}
        </div>
      )}
      <pre className="overflow-x-auto bg-muted/20 p-4 text-[12.5px] leading-relaxed">
        <code className="text-foreground/85">{code.trim()}</code>
      </pre>
    </div>
  )
}
