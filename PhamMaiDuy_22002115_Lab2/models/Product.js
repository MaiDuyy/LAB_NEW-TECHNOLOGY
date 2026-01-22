import crypto from "crypto";
import { ddb } from "../aws/dynamodb.js";
import {
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand, // ✅ thêm
} from "@aws-sdk/lib-dynamodb";

const TABLE = process.env.DDB_TABLE_PRODUCTS || "Products";

function normName(name = "") {
  return name.trim().toLowerCase();
}

export default class Product {
  static async getAll(searchQuery = null) {
    const q = searchQuery ? normName(searchQuery) : "";

    const params = q
      ? {
          TableName: TABLE,
          FilterExpression: "begins_with(nameLower, :q)", // ✅ search prefix
          ExpressionAttributeValues: { ":q": q },
        }
      : { TableName: TABLE };

    const res = await ddb.send(new ScanCommand(params));
    return res.Items || [];
  }

  static async getById(id) {
    const productId = String(id);
    const res = await ddb.send(
      new GetCommand({
        TableName: TABLE,
        Key: { productId },
      })
    );
    return res.Item || null;
  }

  static async create(name, price, quantity) {
    const productId = crypto.randomUUID();
    const nameLower = normName(name);

    const item = {
      productId,
      name,
      nameLower,
      price: Number(price),
      quantity: Number(quantity),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await ddb.send(
      new PutCommand({
        TableName: TABLE,
        Item: item,
        ConditionExpression: "attribute_not_exists(productId)",
      })
    );

    return item;
  }

  static async update(id, name, price, quantity) {
    const productId = String(id);
    const nameLower = normName(name);

    const res = await ddb.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: { productId },
        UpdateExpression:
          "SET #name = :name, nameLower = :nameLower, price = :price, quantity = :quantity, updatedAt = :u",
        ExpressionAttributeNames: { "#name": "name" },
        ExpressionAttributeValues: {
          ":name": name,
          ":nameLower": nameLower,
          ":price": Number(price),
          ":quantity": Number(quantity),
          ":u": new Date().toISOString(),
        },
        ConditionExpression: "attribute_exists(productId)",
        ReturnValues: "ALL_NEW",
      })
    );

    return res.Attributes;
  }

  static async delete(id) {
    const productId = String(id);
    await ddb.send(
      new DeleteCommand({
        TableName: TABLE,
        Key: { productId },
      })
    );
    return true;
  }
}
