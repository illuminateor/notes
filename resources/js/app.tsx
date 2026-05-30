import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),

    resolve: async (name) => {
        const module = await resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob<{ default: ComponentType }>('./Pages/**/*.tsx'));
        return module.default;
    },
    setup({ App, props }) {
        const element = document.getElementById('app') ?? document.body.appendChild(document.createElement('div'));
        createRoot(element).render(<App {...props} />);
    },

    progress: {
        color: '#4B5563',
    },
});

initializeTheme();
