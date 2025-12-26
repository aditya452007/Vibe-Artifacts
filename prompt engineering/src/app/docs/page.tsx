
import { getAllDocs } from '@/lib/docs'
import { redirect } from 'next/navigation'

export default function DocsIndex() {
    const docs = getAllDocs()
    // Redirect to the first doc (usually Introduction)
    if (docs.length > 0) {
        redirect(`/docs/${docs[0].slug}`)
    }

    return (
        <div className="p-12 text-zinc-500">
            No documentation found.
        </div>
    )
}
