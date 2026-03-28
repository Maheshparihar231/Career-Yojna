export interface Blog {
    id?: string;
    title: string;
    content: string;
    summary: string;
    author: string;
    category: string;
    tags: string[];
    imageUrl: string;
    publishDate: Date;
    lastModified?: Date;
    status: 'draft' | 'published';
    readTime: string;
    likes: number;
    views: number;
    featured: boolean;
    relatedPosts?: string[]; // IDs of related blog posts
    seoMetadata?: {
        metaTitle: string;
        metaDescription: string;
        keywords: string[];
    };
}