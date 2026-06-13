// src/services/dynamo.service.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  DYNAMO_TABLE_NAME,
} from "../../config/setting.js";

const client = new DynamoDBClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

const dynamo = DynamoDBDocumentClient.from(client);

/**
 * Saves a return item to DynamoDB.
 * @param {object} item
 */
export async function saveItem(item) {
  return dynamo.send(
    new PutCommand({
      TableName: DYNAMO_TABLE_NAME,
      Item: item,
    })
  );
}

/**
 * Fetches a return item by ID from DynamoDB.
 * @param {string} itemId
 * @returns {Promise<object|null>}
 */
export async function getItem(itemId) {
  const { Item } = await dynamo.send(
    new GetCommand({
      TableName: DYNAMO_TABLE_NAME,
      Key: { itemId },
    })
  );
  return Item || null;
}
