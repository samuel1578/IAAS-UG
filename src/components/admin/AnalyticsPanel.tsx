import { MdAnalytics } from 'react-icons/md';
import Card from '../Card';

const AnalyticsPanel = () => {
    return (
        <div className="max-w-6xl space-y-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#00592D] mb-2">Analytics Dashboard</h2>
                <p className="text-gray-600">Comprehensive overview of platform usage and student engagement</p>
            </div>

            <Card hover={false}>
                <div className="p-8 text-center text-gray-500">
                    <MdAnalytics className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    Analytics dashboard coming soon...
                    <p className="text-sm mt-2">Detailed insights will be available here</p>
                </div>
            </Card>
        </div>
    );
};

export default AnalyticsPanel;
