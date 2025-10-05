import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const uppercasePages = import.meta.glob('./Pages/**/*.jsx');
const lowercasePages = import.meta.glob('./pages/**/*.jsx');

const pageModules = {
    ...lowercasePages,
    ...uppercasePages,
};

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
        const candidates = [`./Pages/${name}.jsx`, `./pages/${name}.jsx`];

        for (const path of candidates) {
            if (pageModules[path]) {
                return resolvePageComponent(path, pageModules);
            }
        }

        console.error(`Inertia page not found for name: ${name}`);

        return resolvePageComponent(`./Pages/${name}.jsx`, uppercasePages);
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
