import { Config } from 'ziggy-js';

declare module '@inertiajs/react' {
    interface PageProps {
        ziggy: Config;
        auth: {
            user: {
                id: number;
                name: string;
                email: string;
                email_verified_at: string;
            };
        };
        categories: { id: number; name: string }[];
        tags: { id: number; name: string }[];
        workspaces: { id: number; name: string }[];
    }
}
