import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const docsDirectory = path.join(process.cwd(), 'src/content/docs')

export type DocMeta = {
    title: string
    description: string
    order: number
    icon: string
    slug: string
}

export type DocPost = {
    slug: string
    meta: DocMeta
    content: string
}

export function getAllDocs(): DocMeta[] {
    // Get file names under /docs
    const fileNames = fs.readdirSync(docsDirectory)
    const allDocsData = fileNames.map((fileName) => {
        // Remove ".md" from file name to get id
        const slug = fileName.replace(/\.md$/, '')

        // Read markdown file as string
        const fullPath = path.join(docsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents)

        // Combine the data with the id
        return {
            slug,
            ...(matterResult.data as Omit<DocMeta, 'slug'>),
        }
    })

    // Sort posts by order
    return allDocsData.sort((a, b) => {
        if (a.order < b.order) {
            return -1
        } else {
            return 1
        }
    })
}

export function getDocBySlug(slug: string): DocPost | null {
    try {
        const fullPath = path.join(docsDirectory, `${slug}.md`)
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents)

        return {
            slug,
            meta: matterResult.data as DocMeta,
            content: matterResult.content,
        }
    } catch (err) {
        return null
    }
}
