'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {
  // const params = {
  //   TableName: process.env.DYNAMODB_TABLE,
  //   Key: {
  //     favOwner: event.pathParameters.favOwner,
  //   },
  // };
  
  var params = {
    TableName: process.env.DYNAMODB_TABLE,
    KeyConditionExpression: "#favOwner = :favOwner",
    ExpressionAttributeNames: {
        "#favOwner": "favOwner"
    },
    ExpressionAttributeValues: {
        ":favOwner": event.pathParameters.favOwner
    }
  };
  
  console.log(params);

  // fetch todo from the database
  dynamoDb.query(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t fetch the todo item.'));
      return;
    }
    
    console.log(result);

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
    callback(null, response);
  });
};
