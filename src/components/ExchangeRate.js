"use client";

import { useState, useEffect } from "react";

export default function ExchangeRate() {
  const [exchangeRates, setExchangeRates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch exchange rates from the API
    const fetchRates = async () => {
      try {
        const response = await fetch(
          "https://v6.exchangerate-api.com/v6/47cdba4ec2852c4342e27f3d/latest/NGN"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch exchange rates");
        }
        const data = await response.json();

        // Transform the data to invert rates (from NGN to each currency)
        const transformedData = [
          { currency: "USD", rate: 1 / data.conversion_rates.USD, flag: "/flags/us.png" },
          { currency: "CAD", rate: 1 / data.conversion_rates.CAD, flag: "/flags/ca.png" },
          { currency: "AUD", rate: 1 / data.conversion_rates.AUD, flag: "/flags/au.png" },
          { currency: "GBP", rate: 1 / data.conversion_rates.GBP, flag: "/flags/gb.png" },
          { currency: "AED", rate: 1 / data.conversion_rates.AED, flag: "/flags/ae.png" },
          { currency: "CNY", rate: 1 / data.conversion_rates.CNY, flag: "/flags/cn.png" },
          { currency: "EGP", rate: 1 / data.conversion_rates.EGP, flag: "/flags/eg.png" },
        ];

        // Multiply rates by the NGN base value to get the equivalent rate in Naira
        const ratesInNaira = transformedData.map((item) => ({
          ...item,
          rate: (item.rate * data.conversion_rates.NGN).toFixed(2), // Multiply with NGN rate and format to 2 decimals
        }));

        setExchangeRates(ratesInNaira);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600">Loading exchange rates...</p>;
  }

  return (
    <div className="text-gray mb-6">
      <h3 className="text-2xl font-bold mb-1">Naira Exchange Rates</h3>
      <div className="flex flex-col space-y-1 mb-6">
        <div className="h-0.5 w-full bg-gray-700"></div>
        <div className="h-0.5 w-full bg-gray-400"></div>
        <div className="h-0.5 w-full bg-gray-200"></div>
      </div>
      <table className="w-full text-left">
        <thead className="border-b border-gray-400">
          <tr>
            <th className="py-2">CURRENCIES</th>
            <th className="py-2">RATE (₦)</th>
          </tr>
        </thead>
        <tbody>
          {exchangeRates.map((rate, index) => (
            <tr key={index} className="border-b border-gray-300">
              <td className="py-2 flex items-center space-x-2">
                <img
                  src={rate.flag}
                  alt={rate.currency}
                  className="w-6 h-4 object-cover rounded-sm"
                />
                <span>{rate.currency}</span>
              </td>
              <td className="py-2">{rate.rate}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-sm text-gray-400">
        Currency exchange rates in <span className="text-red-500">NGN</span> on{" "}
        {new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
    </div>
  );
}
