import React, { useState } from 'react';

const SubscriptionCalculator = ({ data }) => {
  const [basePrice, setBasePrice] = useState(0);
  const [pricePerCreditLine, setPricePerCreditLine] = useState(0);
  const [pricePerCreditScorePoint, setPricePerCreditScorePoint] = useState(0);
  const [subscriptionPrices, setSubscriptionPrices] = useState([]);

  const calculatePrices = () => {
    const prices = data.map((entry) => {
      const creditScore = parseFloat(entry.CreditScore);
      const creditLines = parseFloat(entry.CreditLines);
      const subscriptionPrice =
        basePrice + pricePerCreditLine * creditLines + pricePerCreditScorePoint * creditScore;
      return { ...entry, subscriptionPrice };
    });
    setSubscriptionPrices(prices);
  };

  return (
    <div>
      <input
        type="number"
        placeholder="Base Price"
        value={basePrice}
        onChange={(e) => setBasePrice(parseFloat(e.target.value))}
      />
      <input
        type="number"
        placeholder="Price per Credit Line"
        value={pricePerCreditLine}
        onChange={(e) => setPricePerCreditLine(parseFloat(e.target.value))}
      />
      <input
        type="number"
        placeholder="Price per Credit Score Point"
        value={pricePerCreditScorePoint}
        onChange={(e) => setPricePerCreditScorePoint(parseFloat(e.target.value))}
      />
      <button onClick={calculatePrices}>Calculate Prices</button>

      {subscriptionPrices.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(subscriptionPrices[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {subscriptionPrices.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, idx) => (
                  <td key={idx}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SubscriptionCalculator;