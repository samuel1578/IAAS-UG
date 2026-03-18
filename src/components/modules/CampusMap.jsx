import { useState } from 'react';
import { motion } from 'framer-motion';
import { MdLocationOn, MdDirections, MdAccessTime } from 'react-icons/md';
import Card from '../Card';
import Button from '../Button';
import { campusLocations } from '../../data/mockData';

const CampusMap = () => {
  const [startLocation, setStartLocation] = useState('Main Gate');
  const [destination, setDestination] = useState('Soil Science Building');
  const [routeCalculated, setRouteCalculated] = useState(false);

  const calculateRoute = () => {
    setRouteCalculated(true);
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#00592D] mb-2">Campus Map & Practical Planner</h2>
        <p className="text-gray-600">Navigate between campus locations efficiently</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1"
        >
          <Card hover={false}>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#00592D] mb-6 flex items-center gap-2">
                <MdDirections className="w-6 h-6" />
                Route Planning
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Start Location
                  </label>
                  <select
                    value={startLocation}
                    onChange={(e) => {
                      setStartLocation(e.target.value);
                      setRouteCalculated(false);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00592D] focus:border-transparent transition-all"
                  >
                    {campusLocations.start.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Destination
                  </label>
                  <select
                    value={destination}
                    onChange={(e) => {
                      setDestination(e.target.value);
                      setRouteCalculated(false);
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00592D] focus:border-transparent transition-all"
                  >
                    {campusLocations.destination.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={calculateRoute}
                  icon={MdDirections}
                  className="w-full"
                  variant="primary"
                >
                  Calculate Route
                </Button>

                {routeCalculated && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-4 bg-[#F8F9FA] rounded-lg border border-gray-200"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <MdAccessTime className="w-5 h-5 text-[#00592D] mt-1" />
                      <div>
                        <p className="font-semibold text-gray-800">Estimated Walk Time</p>
                        <p className="text-2xl font-bold text-[#00592D]">15 Mins</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 leading-relaxed">
                      <p className="font-semibold mb-1">Route:</p>
                      <p>Pass via the central library, head towards the science quad.</p>
                    </div>
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
          className="lg:col-span-2"
        >
          <Card hover={false} className="h-full">
            <div className="p-6 h-full">
              <h3 className="text-xl font-bold text-[#00592D] mb-6">Campus Map</h3>
              <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl min-h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden">
                <svg
                  className="absolute inset-0 w-full h-full"
                  viewBox="0 0 600 500"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="10"
                      refX="9"
                      refY="3"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3, 0 6" fill="#00592D" />
                    </marker>
                  </defs>

                  {routeCalculated && (
                    <motion.line
                      x1="150"
                      y1="100"
                      x2="450"
                      y2="350"
                      stroke="#00592D"
                      strokeWidth="3"
                      strokeDasharray="10,5"
                      markerEnd="url(#arrowhead)"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, ease: 'easeInOut' }}
                    />
                  )}
                </svg>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="absolute top-[100px] left-[150px] transform -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="relative group cursor-pointer">
                    <MdLocationOn className="w-12 h-12 text-[#F2A900] drop-shadow-lg" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-800">{startLocation}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                  className="absolute top-[350px] left-[450px] transform -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="relative group cursor-pointer">
                    <MdLocationOn className="w-12 h-12 text-[#00592D] drop-shadow-lg" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-800">{destination}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: 'spring' }}
                  className="absolute top-[200px] left-[300px] transform -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="relative group cursor-pointer">
                    <MdLocationOn className="w-10 h-10 text-gray-500 drop-shadow-lg" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-800">Central Library</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.9, type: 'spring' }}
                  className="absolute top-[280px] left-[200px] transform -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="relative group cursor-pointer">
                    <MdLocationOn className="w-10 h-10 text-gray-500 drop-shadow-lg" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-800">Science Quad</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CampusMap;
