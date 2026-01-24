export interface AutumnProduct {
  id: string;
  name: string;
  description?: string;
  type: 'service' | 'physical' | 'addon';
  display?: {
    name?: string;
    description?: string;
    recommend_text?: string;
    button_text?: string;
    button_url?: string;
    everything_from?: string;
  };
  properties?: {
    interval?: 'month' | 'year' | 'one_time';
    interval_group?: 'month' | 'year';
    is_free?: boolean;
  };
  items: Array<{
    id: string;
    type: 'flat' | 'unit' | 'tier';
    display?: {
      primary_text?: string;
      secondary_text?: string;
    };
    flat?: {
      amount: number;
    };
    unit?: {
      amount: number;
      quantity?: number;
    };
  }>;
}

export const AUTUMN_PRODUCTS: AutumnProduct[] = [
  {
    id: 'free',
    name: 'Free Trial',
    description: 'Get started with 10 free credits',
    type: 'service',
    display: {
      name: 'Free Trial',
      description: 'Perfect for trying out our service',
      button_text: 'Get Started',
    },
    properties: {
      is_free: true,
    },
    items: [
      {
        id: 'messages', // Use 'messages' as feature_id for credits
        type: 'unit',
        display: {
          primary_text: '10 credits',
          secondary_text: '1 free analysis',
        },
        unit: {
          amount: 0,
          quantity: 10,
        },
      },
    ],
  },
  {
    id: 'single-analysis',
    name: 'Single Analysis',
    description: '50 credits for 5 brand analyses',
    type: 'service',
    display: {
      name: 'Single Analysis',
      description: 'One-time purchase',
      button_text: 'Buy Now',
      recommend_text: 'Most Popular',
    },
    properties: {
      interval: 'one_time',
    },
    items: [
      {
        id: 'single-analysis-price',
        type: 'flat',
        display: {
          primary_text: '$49',
          secondary_text: 'one-time',
        },
        flat: {
          amount: 4900, // $49 in cents
        },
      },
      {
        id: 'messages', // Use 'messages' as feature_id for credits
        type: 'unit',
        display: {
          primary_text: '50 credits',
          secondary_text: '5 analyses',
        },
        unit: {
          amount: 0,
          quantity: 50,
        },
      },
    ],
  },
  {
    id: 'credit-pack',
    name: 'Credit Pack',
    description: '200 credits for 20 brand analyses',
    type: 'service',
    display: {
      name: 'Credit Pack',
      description: 'Best value',
      button_text: 'Buy Now',
    },
    properties: {
      interval: 'one_time',
    },
    items: [
      {
        id: 'credit-pack-price',
        type: 'flat',
        display: {
          primary_text: '$149',
          secondary_text: 'one-time',
        },
        flat: {
          amount: 14900, // $149 in cents
        },
      },
      {
        id: 'messages', // Use 'messages' as feature_id for credits
        type: 'unit',
        display: {
          primary_text: '200 credits',
          secondary_text: '20 analyses',
        },
        unit: {
          amount: 0,
          quantity: 200,
        },
      },
    ],
  },
  // Monthly Subscription Plans
  {
    id: 'starter-monthly',
    name: 'Starter',
    description: '50 credits per month for individuals',
    type: 'service',
    display: {
      name: 'Starter',
      description: 'Perfect for individuals',
      button_text: 'Subscribe',
      recommend_text: '',
    },
    properties: {
      interval: 'month',
      interval_group: 'month',
    },
    items: [
      {
        id: 'starter-monthly-price',
        type: 'flat',
        display: {
          primary_text: '$39',
          secondary_text: '/month',
        },
        flat: {
          amount: 3900, // $39 in cents
        },
      },
      {
        id: 'messages', // Use 'messages' as feature_id for credits
        type: 'unit',
        display: {
          primary_text: '50 credits',
          secondary_text: 'per month',
        },
        unit: {
          amount: 0,
          quantity: 50,
        },
      },
    ],
  },
  {
    id: 'pro-monthly',
    name: 'Pro',
    description: '150 credits per month for growing businesses',
    type: 'service',
    display: {
      name: 'Pro',
      description: 'For growing businesses',
      button_text: 'Subscribe',
      recommend_text: 'Recommended',
    },
    properties: {
      interval: 'month',
      interval_group: 'month',
    },
    items: [
      {
        id: 'pro-monthly-price',
        type: 'flat',
        display: {
          primary_text: '$69',
          secondary_text: '/month',
        },
        flat: {
          amount: 6900, // $69 in cents
        },
      },
      {
        id: 'messages', // Use 'messages' as feature_id for credits
        type: 'unit',
        display: {
          primary_text: '150 credits',
          secondary_text: 'per month',
        },
        unit: {
          amount: 0,
          quantity: 150,
        },
      },
    ],
  },
  {
    id: 'enterprise-monthly',
    name: 'Enterprise',
    description: 'Unlimited credits for large organizations',
    type: 'service',
    display: {
      name: 'Enterprise',
      description: 'For large organizations',
      button_text: 'Contact Sales',
    },
    properties: {
      interval: 'month',
      interval_group: 'month',
    },
    items: [
      {
        id: 'enterprise-monthly-price',
        type: 'flat',
        display: {
          primary_text: 'Custom',
          secondary_text: '/month',
        },
        flat: {
          amount: 99900, // $999 placeholder - actual pricing via sales
        },
      },
      {
        id: 'messages', // Use 'messages' as feature_id for credits
        type: 'unit',
        display: {
          primary_text: 'Unlimited credits',
          secondary_text: 'per month',
        },
        unit: {
          amount: 0,
          quantity: 10000, // Large number for "unlimited"
        },
      },
    ],
  },
];

export const AUTUMN_ADDONS: AutumnProduct[] = [];