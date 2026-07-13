import { MdSettings } from 'react-icons/md';
import Card from '../Card';

const SettingsPanel = () => {
    return (
        <div className="max-w-6xl space-y-8">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#00592D] mb-2">System Settings</h2>
                <p className="text-gray-600">Configure platform settings and preferences</p>
            </div>

            <Card hover={false}>
                <div className="p-8 text-center text-gray-500">
                    <MdSettings className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    Settings panel coming soon...
                    <p className="text-sm mt-2">System configuration options will be available here</p>
                </div>
            </Card>
        </div>
    );
};

export default SettingsPanel;
