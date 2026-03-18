import { useState } from 'react';
import { motion } from 'framer-motion';
import { MdScience, MdCalculate } from 'react-icons/md';
import Card from '../Card';
import Button from '../Button';
import { labLogbookData } from '../../data/mockData';

const LabLogbook = () => {
  const [formData, setFormData] = useState({
    seedType: 'Maize',
    initialWeight: '',
    timeImmersed: '',
    finalWeight: ''
  });

  const [calculatedRate, setCalculatedRate] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setCalculatedRate(null);
  };

  const calculateRate = () => {
    const { initialWeight, finalWeight } = formData;
    if (initialWeight && finalWeight) {
      const rate = ((parseFloat(finalWeight) - parseFloat(initialWeight)) / parseFloat(initialWeight)) * 100;
      setCalculatedRate(rate.toFixed(1));
    }
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#00592D] mb-2">Lab Logbook</h2>
        <p className="text-gray-600">Record and track your practical experiments</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card hover={false}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <MdScience className="w-8 h-8 text-[#00592D]" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Active Practical</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-1 bg-[#00592D] text-white rounded text-xs font-semibold">
                      PEBO 205
                    </span>
                    <span className="text-gray-600 text-sm">Seed Imbibition Rate</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Seed Type
                  </label>
                  <select
                    name="seedType"
                    value={formData.seedType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00592D] focus:border-transparent transition-all"
                  >
                    <option value="Maize">Maize</option>
                    <option value="Beans">Beans</option>
                    <option value="Groundnut">Groundnut</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Initial Dry Weight (g)
                  </label>
                  <input
                    type="number"
                    name="initialWeight"
                    value={formData.initialWeight}
                    onChange={handleInputChange}
                    placeholder="e.g., 12.5"
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00592D] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time Immersed (hours)
                  </label>
                  <input
                    type="number"
                    name="timeImmersed"
                    value={formData.timeImmersed}
                    onChange={handleInputChange}
                    placeholder="e.g., 24"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00592D] focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Final Wet Weight (g)
                  </label>
                  <input
                    type="number"
                    name="finalWeight"
                    value={formData.finalWeight}
                    onChange={handleInputChange}
                    placeholder="e.g., 18.7"
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00592D] focus:border-transparent transition-all"
                  />
                </div>

                <Button
                  onClick={calculateRate}
                  icon={MdCalculate}
                  className="w-full"
                  variant="primary"
                >
                  Calculate Rate
                </Button>

                {calculatedRate && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-4 bg-[#F2A900] bg-opacity-10 border-2 border-[#F2A900] rounded-lg text-center"
                  >
                    <p className="text-sm text-gray-600 mb-1">Imbibition Rate</p>
                    <p className="text-3xl font-bold text-[#00592D]">{calculatedRate}%</p>
                  </motion.div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card hover={false}>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#00592D] mb-4">Previous Entries</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Seed</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Initial (g)</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Final (g)</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Rate</th>
                      <th className="text-left py-3 px-2 text-sm font-semibold text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {labLogbookData.map((entry, idx) => (
                      <motion.tr
                        key={entry.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-2 text-sm text-gray-800">{entry.seedType}</td>
                        <td className="py-3 px-2 text-sm text-gray-800">{entry.initialWeight}</td>
                        <td className="py-3 px-2 text-sm text-gray-800">{entry.finalWeight}</td>
                        <td className="py-3 px-2 text-sm font-semibold text-[#00592D]">{entry.rate}</td>
                        <td className="py-3 px-2 text-sm text-gray-600">{entry.date}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default LabLogbook;
