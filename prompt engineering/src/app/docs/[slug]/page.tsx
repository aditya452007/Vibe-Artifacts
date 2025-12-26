import { getDocBySlug, getAllDocs } from '@/lib/docs'
import ReactMarkdown from 'react-markdown'
import { notFound } from 'next/navigation'
import { Terminal } from 'lucide-react'

// Generate static params for all markdown files
export async function generateStaticParams() {
    const docs = getAllDocs()
    return docs.map((doc) => ({
        slug: doc.slug,
    }))
}

export default async function DocPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const doc = getDocBySlug(slug)

    if (!doc) {
        return notFound()
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-12 md:py-16 animate-in fade-in slide-in-from-bottom-2 duration-500">

            {/* Header */}
            <header className="mb-12 border-b border-border pb-8">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-surface border border-border mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-system-blue" />
                    <span className="text-[10px] font-semibold text-canvas-subtext tracking-wide uppercase">Documentation</span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                    {doc.meta.title}
                </h1>
                <p className="text-xl text-canvas-subtext leading-relaxed font-normal">
                    {doc.meta.description}
                </p>
            </header>

            {/* Markdown Content */}
            <div className="prose prose-lg max-w-none
        prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-foreground prose-headings:mb-4
        prose-h1:text-4xl prose-h2:text-2xl prose-h2:mt-12 prose-h3:text-xl prose-h3:mt-8
        prose-p:text-foreground/90 prose-p:leading-7 prose-p:mb-6
        prose-strong:text-foreground prose-strong:font-semibold
        prose-code:text-pink-500 prose-code:bg-pink-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-[0.9em] prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-surface prose-pre:border prose-pre:border-border prose-pre:shadow-sm prose-pre:rounded-xl prose-pre:p-4
        prose-blockquote:border-l-4 prose-blockquote:border-system-blue prose-blockquote:bg-surface prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-canvas-subtext
        prose-li:text-foreground/90 prose-li:marker:text-canvas-subtext
        prose-a:text-system-blue prose-a:no-underline hover:prose-a:underline
      ">
                <ReactMarkdown
                    components={{
                        // Custom Code Block Renderer
                        pre: ({ node, ...props }) => (
                            <div className="relative my-6 group">
                                <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="px-2 py-1 bg-background/50 backdrop-blur rounded text-[10px] font-mono text-canvas-subtext border border-border">
                                        RAW
                                    </div>
                                </div>
                                <pre {...props} className="no-scrollbar" />
                            </div>
                        ),
                    }}
                >
                    {doc.content}
                </ReactMarkdown>
            </div>

        </div>
    )
}
