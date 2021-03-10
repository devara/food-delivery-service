const importUserSchema = {
  description:
    'You can use this endpoint to import user data using JSON raw data. I suggest to use postman to import the raw data.',
  summary: 'Import User Data',
  tags: ['Import Data'],
  body: {
    type: 'array',
    example: [
      {
        name: 'Don Reichert',
        location: '-8.640233,115.228221',
        balance: '700.7',
        purchases: [
          {
            dish: 'Dos Equis Light Hybrid Beer',
            restaurant_name: 'Red Subs',
            amount: '13.18',
            date: '2020-02-10 04:09:00 UTC'
          },
          {
            dish: 'Coconut Key Lime Pie with Toffee Bits',
            restaurant_name: 'Blue Plate Eats',
            amount: '12.81',
            date: '2020-04-03 13:56:00 UTC'
          },
          {
            dish: 'Delirium Pilsner',
            restaurant_name: 'Silver Dragon',
            amount: '11.22',
            date: '2020-02-29 00:13:00 UTC'
          },
          {
            dish: 'Patagonia Stout',
            restaurant_name: 'Thirsty Cafe',
            amount: '13.03',
            date: '2018-05-13 18:02:00 UTC'
          },
          {
            dish: 'Neapolitan Brownie with Marshmallows',
            restaurant_name: 'Fat Juice Bar',
            amount: '12.46',
            date: '2018-11-16 06:49:00 UTC'
          },
          {
            dish: 'Coors lite Stout',
            restaurant_name: 'Green Sushi',
            amount: '10.93',
            date: '2019-09-20 22:18:00 UTC'
          },
          {
            dish: 'Kirin English Brown Ale',
            restaurant_name: 'Hungry Eatery',
            amount: '10.45',
            date: '2019-04-20 11:20:00 UTC'
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
        purchases: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              dish: { type: 'string' },
              restaurant_name: { type: 'string' },
              amount: { type: 'string' },
              date: { type: 'string' }
            }
          }
        }
      }
    }
  }
};

module.exports = { importUserSchema };
