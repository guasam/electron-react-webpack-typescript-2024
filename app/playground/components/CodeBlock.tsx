import { Fragment, type ReactNode } from 'react'

// Tiny TS/JS highlighter: sticky-regex scan, no dependency. Good enough for short snippets.
const RULES: [RegExp, string][] = [
  [/\/\/[^\n]*/y, 'text-muted-foreground italic'],
  [/`[^`]*`|'[^']*'|"[^"]*"/y, 'text-emerald-600 dark:text-emerald-400'],
  [
    /\b(?:const|let|var|function|return|await|async|for|of|in|if|else|import|export|from|new|throw|type|interface|extends|as|void|yield)\b/y,
    'text-violet-600 dark:text-violet-400',
  ],
  [/\b[A-Za-z_$][\w$]*(?=\s*\()/y, 'text-sky-600 dark:text-sky-400'],
  [/\b\d[\d_]*\b/y, 'text-amber-600 dark:text-amber-400'],
]

function highlight(code: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let plain = ''
  let i = 0
  let key = 0
  const flush = () => {
    if (plain) {
      nodes.push(<Fragment key={key++}>{plain}</Fragment>)
      plain = ''
    }
  }
  while (i < code.length) {
    let matched = false
    for (const [re, cls] of RULES) {
      re.lastIndex = i
      const m = re.exec(code)
      if (m) {
        flush()
        nodes.push(
          <span key={key++} className={cls}>
            {m[0]}
          </span>
        )
        i += m[0].length
        matched = true
        break
      }
    }
    if (!matched) {
      plain += code[i]
      i++
    }
  }
  flush()
  return nodes
}

/** A read-only, syntax-highlighted code snippet paired with a demo. */
export function CodeBlock({ code, caption }: { code: string; caption?: string }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      {caption && (
        <div className="border-b border-border bg-muted/40 px-4 py-1.5 font-mono text-xs text-muted-foreground">
          {caption}
        </div>
      )}
      <pre className="overflow-x-auto bg-muted/20 p-4 text-[12.5px] leading-relaxed">
        <code>{highlight(code.trim())}</code>
      </pre>
    </div>
  )
}
