import crypto from "crypto";
import { ddb } from "../aws/dynamodb.js";
import {
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
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
          FilterExpression: "begins_with(nameLower, :q)",
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

  static async create(name, price, quantity, image_key = null, url_image = null) {
    const productId = crypto.randomUUID();
    const nameLower = normName(name);

    const item = {
      productId,
      name,
      nameLower,
      price: Number(price),
      quantity: Number(quantity),
      image_key,
      url_image,
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


  static async update(id, name, price, quantity, image_key = undefined, url_image = undefined) {
    const productId = String(id);
    const nameLower = normName(name);

    const setParts = [
      "#name = :name",
      "nameLower = :nameLower",
      "price = :price",
      "quantity = :quantity",
      "updatedAt = :u",
    ];

    const values = {
      ":name": name,
      ":nameLower": nameLower,
      ":price": Number(price),
      ":quantity": Number(quantity),
      ":u": new Date().toISOString(),
    };

    const names = { "#name": "name" };

    if (image_key !== undefined) {
      setParts.push("image_key = :image_key");
      values[":image_key"] = image_key;
    }
    if (url_image !== undefined) {
      setParts.push("url_image = :url_image");
      values[":url_image"] = url_image;
    }

    const res = await ddb.send(
      new UpdateCommand({
        TableName: TABLE,
        Key: { productId },
        UpdateExpression: `SET ${setParts.join(", ")}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
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
