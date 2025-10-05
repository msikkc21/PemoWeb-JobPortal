import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const uppercasePages = import.meta.glob('./Pages/**/*.jsx');
const lowercasePages = import.meta.glob('./pages/**/*.jsx');

const pageModules = {
    ...lowercasePages,
    ...uppercasePages,
};

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => (title ? `${title} - ${appName}` : appName),
        resolve: async (name) => {
            const candidates = [`./Pages/${name}.jsx`, `./pages/${name}.jsx`];

            for (const path of candidates) {
                if (pageModules[path]) {
                    return resolvePageComponent(path, pageModules);
                }
            }

            console.error(`SSR Inertia page not found for name: ${name}`);

            return resolvePageComponent(`./pages/${name}.jsx`, lowercasePages);
        },
        setup: ({ App, props }) => <App {...props} />,
    }),
);
