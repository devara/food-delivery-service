# Food App API Service

This application is the assignment of Devara Eko given by Itsavirus

## `Table of Contents`

#### [`Section 1: Features for this API`](#section-1-features)

List of all the features this API can do

#### [`Section 2: Technologies`](#section-2-tech)

The technologies used to create and develop this API

#### [`Section 3: How to Setup the API`](#section-3-setup-the-api)

How to prepare, setup, and start the API servive

#### [`Section 4: The API Documentation`](#section-4-api-documentation)

The documentation to use this API and check the all of features from the API

#### [`Section 5: Testing`](#section-5-api-testing)

How to test this API

#### [`Section 6: Note`](#section-6-note-from-deva)

Some note from Deva

## Section 1: Features

- List all restaurants within the vicinity of the user’s location or (any location), ranked by distance (the distances will be displayed in the app)
- List all restaurants that are open for x-z hours per day or week
- List all restaurants that have x-z number of dishes within a price range
- List all restaurants that are open at a certain datetime
- Search for restaurants or dishes by name, ranked by relevance to search term
- Search for restaurants that has a dish matching search term
- The top x users by total transaction amount within a date range
- The most popular restaurants by transaction volume, either by number of transactions or transaction amount
- Total number of users who made transactions above or below $v within a date range
- List all transactions belonging to a restaurant
- List all transactions belonging to a user
- Process a user purchase in an atomic manner and ensure the changes of cash balances can be applied safely and correctly

## Section 2: Tech

The API uses a number of open source projects to work properly:

- [node.js](https://nodejs.org/en/) - evented I/O for the backend
- [Fastify](https://www.fastify.io/) - Fast and low overhead web framework, for Node.js
- [MongoDB](https://www.mongodb.com/3) - Most popular database for modern apps
- [Swagger](https://swagger.io/) - API Development for Everyone.
- [Docker](https://www.docker.com/) - Empowering App Development for Developers

## Section 3: Setup the API

### 3.1: Build the Dockerfile

Before we import raw data to the database (mongodb), we need to build this application using Docker.
Since we are using the mongodb image from Docker, we need to prepare it and make sure it runs before importing the raw data.

First, copy **.env.example** file into **.env**

Then, in the root of project folder, using terminal, run:

```sh
docker-compose up
```

Wait for the Docker build to finish.
You will have 2 images:

- docker image for this app
- bitnami/mongodb image

### 3.2: Importing Raw Data to MongoDB

Now that the Docker Container is running, we can start importing our raw data into MongoDB.

The database name is **food-app**.

I recommend installing [MongoDB Compas](https://www.mongodb.com/try/download/compass) to access the database. So, you can check if the data has been properly imported into the MongoDB collection.

MongoDB access details:

| Field       | Value                 |
| ----------- | --------------------- |
| Hostname    | 0.0.0.0               |
| Port        | 27017                 |
| Auth method | username and password |
| Username    | janganroot            |
| Password    | letmein-iamhungry     |
| Database    | food-app              |

![Connect using mongoDB compas](https://i.imgur.com/QLmwcin.png?1)

For the steps to import raw data, you can also check the API [documentation page](http://127.0.0.1:3000/docs) to import user data and restaurant data.

You can use Postman to import data for a better experience, although you can import directly via the [documentation page](http://127.0.0.1:3000/docs) using the supplied import endpoints.
Because when I import raw data on my local device, it took a little while, maybe around 40 seconds to 1 minute, or more.

We have two raw data (**users.json** and **restaurants.json**), but when the import is finished, I split them into 4 collections:

- restaurants
- menus
- users
- transactions

When import **users.json**, it will create two collections, **users** and **transactions**.
For **restaurants.json**, it will create **restaurants** and **menus**.

Steps if you are using postman:

- Use the endpoint: **127.0.0.0:3000/api/v1/user** with POST method
- We are not use params, but body request, and then choose **raw** method using JSON type
- Copy all **users.json** data into body request field (raw data must be wrapped as an array)
- Execute this endpoint and wait untill import process is done
- Check mongoDB compas, it will be create **users** collection (in my local, there are 999 documents), and **transactions** collection (in my local there are 9308 documents)
- Next to import restaurants data
- Use the endpoint: **127.0.0.0:3000/api/v1/restaurant** with POST method and using body request as same as when import users data
- Copy all **restaurants.json** data into request field then execute and wait it (maybe this is a little bit longer, because the data is quite a lot)
- It will be create **restaurants** collection (968 documents) and **menus** collection (18.673 documents)
- For the record, the restaurant with the same name, I merged into one document

![collections view](https://i.imgur.com/Khjqcne.png)

After all the import process is complete, we can start using this API and you can next go to documentatin section.

## Section 4: API Documentation

Want to check the API features? Lets begin!

I am use the [Swagger](https://swagger.io/) for serve the API documentation.
You can access the documentation page to test all endpoints from this API.
Go to [docs page](http://127.0.0.1:3000/docs)

For online documentation, you can access from API that deployed in [Heroku](https://deva-food-app-api.herokuapp.com/docs).

You can find all endpoints to check all the features this API can do.

![swagger docs page](https://i.imgur.com/iIZYunS.png)

## Section 5: API Testing

I'm sorry if I just made a simple test for this API.

To test this API, I used the [Tap](https://node-tap.org/) test and [Supertest](https://github.com/visionmedia/supertest)

You can run the API testing using CLI.
If docker container for this app is running, go to the docker CLI.
You can run:

```sh
npm run test
```

Then, You will see the results.

I'm sorry if this test case isn't perfect.

I hope you are happy with my assignment.

## Section 6: Note from Deva

I'm deploying this API to Heroku with this URL [https://deva-food-app-api.herokuapp.com/](https://deva-food-app-api.herokuapp.com/api/v1).
But, I didn't implement with a docker because we can't use the MongoDB addon there. You can check this [post](https://devcenter.heroku.com/changelog-items/1823).

So, I'm used the free MongoDB Atlas and connected the mongoose using it. You can access the database using Compas with this connection (mongodb+srv://iamhungry:letmeinguys@transaction-cluster.fozm9.mongodb.net/food-app?retryWrites=true&w=majority)

Regarding the raw data that was given to me, yesterday I felt confused and thought quite hard, especially the restaurants.json hihihi

Especially in the data on working hours which are presented in text. I need to do a few splits before importing them into the database.
And I admit it may be objective that requires looking for data from restaurants that are open at a certain datetime, there is a bug that occurs and it's my fault. Where when we input clock data in the early morning, such as (1 AM or 2 AM), the result data will be empty.

This happens because I'm performing a Query looking for the time span between opening and closing hours using seconds. The value must be above opening hours, and below closing hours.
The bug I mean, for example, is when restaurant X opens at 10 AM on Wednesdays and closes at 2 AM. This means that the restaurant is still open in the early morning of Thursday. Where, before I calculate the range of opening hours and closing hours, I make a selection on the day data that corresponds to the day entered by the user.
So if the selected day is Thursday at 1 AM, restaurant X should appear in the data, but because 1 AM is included in the working hours of Wednesday, this means Restaurant X will not appear in the data.

I admit maybe this is my lack of understanding of Query in MongoDB which requires looking for data according to opening hours and closing hours.
I apologize profusely for this bug which makes one of the objectives imperfect.

Thank you.
