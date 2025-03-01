import { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const API_URL = import.meta.env.VITE_API_BASE_URL;

const Dashboard = () => {
    const [energyData, setEnergyData] = useState([]);
    const [totalUsage, setTotalUsage] = useState(0);
    const [userUsage, setUserUsage] = useState(0); // Individual user's usage
    const [savingsTips, setSavingsTips] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/api/energy-usage`)
            .then(response => response.json())
            .then(data => {
                console.log("Fetched Data:", data);
                setEnergyData(data);
                setTotalUsage(data.reduce((sum, entry) => sum + entry.usage, 0));
                setUserUsage(data.length ? data[0].usage : 0); // Assume first entry is the user's data

                // Generate Savings Tips
                const tips = [
                    "Unplug devices when not in use to save power.",
                    "Switch to LED bulbs for lower energy consumption.",
                    "Use smart thermostats to regulate heating and cooling.",
                    "Run full loads in washing machines and dishwashers."
                ];
                setSavingsTips(tips);
            })
            .catch(error => console.error("Error fetching energy usage:", error));
    }, []);

    // Line Chart Data (Trends Over Time)
    const trendChartData = {
        labels: energyData.map(entry => entry.timestamp),
        datasets: [
            {
                label: "Energy Usage (kWh)",
                data: energyData.map(entry => entry.usage),
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: true,
            },
        ],
    };

    // Pie Chart Data (Individual Contribution)
    const pieChartData = {
        labels: ["Your Usage", "Total Usage"],
        datasets: [
            {
                data: [userUsage, totalUsage - userUsage],
                backgroundColor: ["#4CAF50", "#FF5733"],
                hoverBackgroundColor: ["#45A049", "#FF3D00"],
            },
        ],
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
                    🏠 Energy Tracker Dashboard
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* 📊 Energy Consumption Trends */}
                    <div className="bg-white p-6 shadow-md rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">
                            📈 Energy Consumption Trends
                        </h2>
                        <Line data={trendChartData} />
                    </div>

                    {/* 🔥 Individual Contribution */}
                    <div className="bg-white p-6 shadow-md rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">
                            🔥 Your Contribution
                        </h2>
                        <Pie data={pieChartData} />
                        <p className="text-gray-600 mt-4">
                            You consumed <span className="font-bold">{userUsage} kWh</span>, which is 
                            {((userUsage / totalUsage) * 100).toFixed(2)}% of total usage.
                        </p>
                    </div>

                    {/* 💡 Suggestions for Savings */}
                    <div className="bg-white p-6 shadow-md rounded-lg">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">
                            💡 Energy Savings Tips
                        </h2>
                        <ul className="list-disc pl-4 space-y-2 text-gray-600">
                            {savingsTips.map((tip, index) => (
                                <li key={index} className="text-sm">{tip}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
