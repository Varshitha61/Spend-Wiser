const Joi = require('joi');

// User validation schemas
const userSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required'
  }),
  name: Joi.string().required().messages({
    'any.required': 'Name is required'
  })
});

// Transaction validation schema
const transactionSchema = Joi.object({
  amount: Joi.number().positive().required().messages({
    'number.positive': 'Amount must be a positive number',
    'any.required': 'Amount is required'
  }),
  type: Joi.string().valid('income', 'expense').required().messages({
    'any.only': 'Type must be either "income" or "expense"',
    'any.required': 'Type is required'
  }),
  category: Joi.string().required().messages({
    'any.required': 'Category is required'
  }),
  description: Joi.string().max(500).optional().messages({
    'string.max': 'Description cannot exceed 500 characters'
  }),
  date: Joi.date().required().messages({
    'any.required': 'Date is required'
  }),
  walletId: Joi.string().required().messages({
    'any.required': 'Wallet ID is required'
  }),
  currency: Joi.string().default('INR')
});

// Bank details validation schema
const bankDetailsSchema = Joi.object({
  userId: Joi.string().required().messages({
    'any.required': 'User ID is required'
  }),
  accounts: Joi.array().items(
    Joi.object({
      bankName: Joi.string().required(),
      accountNumber: Joi.string().required(),
      ifscCode: Joi.string().required(),
      accountType: Joi.string().required()
    })
  ).required().messages({
    'any.required': 'Accounts array is required'
  })
});

// SMS webhook validation schema
const smsSchema = Joi.object({
  message: Joi.string().required().messages({
    'any.required': 'Message is required'
  }),
  from: Joi.string().optional(),
  timestamp: Joi.date().optional()
});

module.exports = {
  userSchema,
  transactionSchema,
  bankDetailsSchema,
  smsSchema
};
