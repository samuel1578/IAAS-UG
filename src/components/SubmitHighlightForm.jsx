import { useState } from 'react';
import Button from './Button';

const initialForm = {
    studentName: '',
    level: '100',
    message: ''
};

const SubmitHighlightForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState(initialForm);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({ ...previous, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSubmit(formData);
        setFormData(initialForm);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <h3 className="text-xl font-semibold text-[#00592D]">Submit a Student Highlight</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                    <span className="block text-sm font-medium text-gray-700 mb-1">Student Name</span>
                    <input
                        type="text"
                        name="studentName"
                        value={formData.studentName}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00592D]/30"
                    />
                </label>

                <label className="block">
                    <span className="block text-sm font-medium text-gray-700 mb-1">Level</span>
                    <select
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00592D]/30"
                    >
                        <option value="100">100</option>
                        <option value="200">200</option>
                        <option value="300">300</option>
                        <option value="400">400</option>
                    </select>
                </label>
            </div>

            <label className="block">
                <span className="block text-sm font-medium text-gray-700 mb-1">Highlight Message</span>
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#00592D]/30"
                />
            </label>

            <div>
                <Button type="submit" variant="primary">Submit for Review</Button>
            </div>
        </form>
    );
};

export default SubmitHighlightForm;
