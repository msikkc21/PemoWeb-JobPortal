const Welcome = () => {
    return (
        <div className="items-top relative flex min-h-screen justify-center bg-gray-100 py-4 sm:items-center sm:pt-0 dark:bg-gray-900">
            <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
                <div className="flex justify-center pt-8 sm:justify-start sm:pt-0">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Laravel</h1>
                </div>

                <div className="mt-8 overflow-hidden bg-white shadow sm:rounded-lg dark:bg-gray-800">
                    <div className="p-6">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Welcome to Laravel</h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Info turuuuuu</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
