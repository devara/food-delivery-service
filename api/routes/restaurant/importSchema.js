const importRestaurantSchema = {
  description:
    'You can use this endpoint to import restaurant data using JSON raw data. I suggest using Postman to import raw data. Because when I tested it on my local device, it took a little while, maybe around 40 seconds to 1 minute.',
  summary: 'Import Restaurant Data',
  tags: ['Import Data'],
  body: {
    type: 'array',
    example: [
      {
        name: 'Orange House',
        location: '-8.65504,115.110801',
        balance: '4483.84',
        business_hours:
          'Sunday: 10:45 AM - 5 PM | Monday, Friday: 2:30 PM - 8 PM | Tuesday: 11 AM - 2 PM | Wednesday: 1:15 PM - 3:15 AM | Thursday: 10 AM - 3:15 AM | Saturday: 5 AM - 11:30 AM',
        menu: [
          {
            name: 'Kiwiberries',
            price: '10.64'
          },
          {
            name: 'Dates',
            price: '12.45'
          },
          {
            name: 'Arborio Rice',
            price: '10.59'
          },
          {
            name: 'Figs juice',
            price: '13.5'
          },
          {
            name: 'Papaya',
            price: '13.5'
          }
        ]
      }
    ],
    items: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        location: { type: 'string' },
        balance: { type: 'string' },
        business_hours: { type: 'string' },
        menu: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              price: { type: 'string' }
            }
          }
        }
      }
    }
  }
};

module.exports = { importRestaurantSchema };
