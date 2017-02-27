Now that we have the initial chats layout and its component, we will take it a step further by providing the chats data from a server instead of having it locally.

## Collections

Collections in `Meteor` are actually references to [MongoDB](http://mongodb.com) collections. This functionality is provided to us by a `Meteor` package called [Minimongo](https://guide.meteor.com/collections.html), and it shares almost the same API as a native `MongoDB` collection. In this tutorial we will be wrapping our collections using `RxJS`'s `Observables`, which is available for us thanks to [meteor-rxjs](http://npmjs.com/package/meteor-rxjs).

Our initial collections are gonna be the chats and messages collections; One is going to store chats-models, and the other is going to store messages-models:

{{{diff_step 4.1}}}

We chose to create a dedicated module for each collection, because in the near future there might be more logic added into each one of them. To make importation convenient, we will export all collections from a single file:

{{{diff_step 4.2}}}

Now instead of requiring each collection individually, we can just require them from the `index.ts` file.

## Data fixtures

Since we have real collections now, and not dummy ones, we will need to fill them up with some data in case they are empty, so we can test our application properly. Let's create our data fixtures in the server:

{{{diff_step 4.3}}}

> This behavior is **not** recommended and should be removed once we're ready for production. A conditioned environment variable might be an appropriate solution.

Note how we use the `.collection` property to get the actual `Mongo.Collection` instance. In the `Meteor` server we want to avoid the usage of observables since it uses `fibers`. More information about fibers can be fond [here](https://www.npmjs.com/package/fibers).

## Preparing Our Client

Now that we have some real data stored in our database, we can replace it with the data fabricated in the `ChatsPage`. This way the client can stay correlated with the server:

{{{diff_step 4.4}}}

We will also re-implement the `removeChat` method using an actual `Meteor` collection:

{{{diff_step 4.5}}}