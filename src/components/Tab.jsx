export default function Tab({ tapName, children }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">{tapName} Settings</h2>
            {children}
        </div>
    )
}