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
        <div className="max-w-4xl mx-auto px-6 py-12 md:px-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header */}
            <header className="mb-16 border-b border-white/5 pb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 mb-6">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
                    <span className="text-[10px] font-mono text-neon-cyan tracking-widest uppercase">Knowledge Base v1.0</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6 drop-shadow-xl">
                    {doc.meta.title}
                </h1>
                <p className="text-xl text-zinc-300 font-light leading-relaxed max-w-3xl">
                    {doc.meta.description}
                </p>
            </header>

            {/* Markdown Content */}
            <div className="prose prose-invert prose-lg max-w-none 
        prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white prose-headings:mb-6
        prose-p:text-zinc-200 prose-p:leading-relaxed prose-p:mb-6
        prose-strong:text-white prose-strong:font-bold
        prose-code:text-neon-cyan prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-white/20 prose-pre:shadow-2xl prose-pre:rounded-xl
        prose-blockquote:border-l-4 prose-blockquote:border-neon-cyan prose-blockquote:bg-white/5 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-zinc-300
        prose-li:text-zinc-300 prose-li:marker:text-neon-cyan
        marker:text-neon-cyan
      ">
                <ReactMarkdown
                    components={{
                        // Custom Code Block Renderer
                        pre: ({ node, ...props }) => (
                            <div className="relative my-8 group">
                                <div className="absolute -top-3 left-4 px-2 py-0.5 bg-zinc-800 rounded-md border border-white/10 text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
                                    Code // Protocol
                                </div>
                                <pre {...props} />
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
