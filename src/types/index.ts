
import { Request } from 'express';

export interface User {
    id: number;
    email: string;
    name: string;
    role: string;
}

export interface AuthRequest extends Request {
    user?: User;
}

export interface Domain {
    id: number;
    name: string;
    url: string;
    api_key?: string;
    created_at: Date;
    updated_at: Date;
}

export interface Blog {
    id: number;
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    domain_id: number;
    author_id: number;
    status: string;
    published_at?: Date;
    created_at: Date;
    updated_at: Date;
}
