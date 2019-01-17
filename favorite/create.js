'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  if (typeof data.rawData !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t create the test item.'));
    return;
  }
  if (typeof data.favOwner !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t create the test item.'));
    return;
  }
  if (typeof data.type !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t create the test item.'));
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      favOwner: data.favOwner,
      type: data.type,
      rawData: data.rawData,
      isAvailable: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  // write the todo to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(new Error('Couldn\'t create the todo item.'));
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
    callback(null, response);
  });
};
