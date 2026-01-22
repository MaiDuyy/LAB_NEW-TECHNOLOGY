// src/aws/dynamodb.js
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import dotenv from "dotenv";

dotenv.config();

const client = new DynamoDBClient({
  region: process.env.AWS_REGION, 
// accessKeyId :  process.env.AWS_ACCESS_KEY,
// accessKeySecret :  process.env.AWS_ACCESS_KEY_SECRET
});

export const ddb = DynamoDBDocumentClient.from(client);
