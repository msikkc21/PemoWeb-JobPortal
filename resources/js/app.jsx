// import '../css/app.css';
// import './bootstrap';

// import { createInertiaApp } from '@inertiajs/react';
// import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
// import { createRoot, hydrateRoot } from 'react-dom/client';

// const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// createInertiaApp({
//     title: (title) => `${title} - ${appName}`,
//     resolve: (name) =>
//         resolvePageComponent(
//             `./Pages/${name}.jsx`,
//             import.meta.glob('./Pages/**/*.jsx'),
//         ),
//     setup({ el, App, props }) {
//         if (import.meta.env.SSR) {
//             hydrateRoot(el, <App {...props} />);
//             return;
//         }

//         createRoot(el).render(<App {...props} />);
//     },
//     progress: {
//         color: '#4B5563',
//     },
// });
import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.jsx`, import.meta.glob('./pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
