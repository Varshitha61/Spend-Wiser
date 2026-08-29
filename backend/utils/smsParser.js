function parseBankSMS(message) {
  const patterns = [
    /(?:Paid|Received)\s+(?:Rs\.?|₹|INR)\s*([\d,]+(?:\.\d{2})?)/i,
    /(?:Debit|Credit)\s+(?:of\s+)?(?:Rs\.?|₹)\s*([\d,]+(?:\.\d{2})?)\s+(?:from|to)\s+(\w+)/i,
    /Amount\s+(?:Rs\.?|₹)\s*([\d,]+(?:\.\d{2})?)\s+(debited|credited)/i,
    /(?:Rs\.?|₹)\s*([\d,]+(?:\.\d{2})?)\s+(debit|credit)/i,
  ];

  let amount = null;
  let type = null;
  const lowerMsg = message.toLowerCase();

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      amount = parseFloat(match[1].replace(/,/g, ''));
      if (lowerMsg.includes('paid') || lowerMsg.includes('debited') || lowerMsg.includes('debit') || lowerMsg.includes('sent')) {
        type = 'expense';
      } else if (lowerMsg.includes('received') || lowerMsg.includes('credited') || lowerMsg.includes('credit')) {
        type = 'income';
      } else {
        type = 'expense'; // default fallback for safety
      }
      break;
    }
  }

  if (!amount) return null;

  let description = 'Bank Transaction';
  const merchantMatch = message.match(/(?:at|from|to)\s+([A-Za-z\s]+?)(?:\.|,|$|via|on)/i);
  if (merchantMatch) {
    description = merchantMatch[1].trim();
  }
  
  if (lowerMsg.includes('gpay') || lowerMsg.includes('google pay')) {
    description += ' via GPay';
  } else if (lowerMsg.includes('phonepe')) {
    description += ' via PhonePe';
  } else if (lowerMsg.includes('paytm')) {
    description += ' via Paytm';
  }

  let category = 'Other';
  
  if (lowerMsg.includes('food') || lowerMsg.includes('restaurant') || lowerMsg.includes('cafe')) category = 'Food';
  else if (lowerMsg.includes('fuel') || lowerMsg.includes('petrol') || lowerMsg.includes('auto')) category = 'Transport';
  else if (lowerMsg.includes('rent') || lowerMsg.includes('housing')) category = 'Housing';
  else if (lowerMsg.includes('movie') || lowerMsg.includes('entertainment')) category = 'Entertainment';
  else if (lowerMsg.includes('shopping') || lowerMsg.includes('mall')) category = 'Shopping';
  else if (lowerMsg.includes('hospital') || lowerMsg.includes('medical') || lowerMsg.includes('pharmacy')) category = 'Health';
  else if (lowerMsg.includes('salary') || lowerMsg.includes('credited')) category = type === 'income' ? 'Salary' : 'Other';

  return {
    amount,
    type,
    description,
    category,
    currency: 'INR'
  };
}

module.exports = { parseBankSMS };
