import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (!links || links.length === 0) {
        return null;
    }

    return (
        <div className="flex items-center justify-center space-x-1">
            {links.map((link, index) => (
                <div key={index}>
                    {!link.url ? (
                        // Disabled link (current page or unavailable)
                        <span
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                                link.active
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ) : (
                        // Active link
                        <Link
                            href={link.url}
                            className={`px-3 py-2 text-sm font-medium rounded-md transition ${
                                link.active
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-white text-indigo-600 hover:bg-indigo-50 border border-gray-300'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
