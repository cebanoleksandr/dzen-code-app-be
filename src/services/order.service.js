import { v4 as uuidv4 } from 'uuid';
import { ordersCollection } from '../db.js';
import { ObjectId } from 'mongodb';

export const getAll = async (query) => {
  try {
    const body = {};
    if (!!query) {
      body.title = { $regex: query, $options: 'i' };
    }
    const allOrders = await ordersCollection.find(body).toArray();
    console.log('Fetched all orders:', allOrders.length);
    return allOrders;
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw error;
  }
}

export const getById = async (id) => {
  try {
    const order = await ordersCollection.findOne({ _id: new ObjectId(id) });
    console.log(`Fetched order by ID ${id}:`, order ? 'found' : 'not found');
    return order;
  } catch (error) {
    console.error(`Error fetching order by ID ${id}:`, error);
    throw error;
  }
};

export const create = async ({ title, description, authorId }) => {
  try {
    const newOrder = {
      title,
      description,
      authorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await ordersCollection.insertOne(newOrder);
    console.log(`Order with "id": ${result.insertedId} successfully created.`);
    
    return newOrder;
  } catch (error) {
    console.error("Error creating new order:", error);
    throw error;
  }
};

export const update = async ({ id, title, description }) => {
  try {
    const updateFields = {};
    if (title !== undefined) {
      updateFields.title = title;
    }
    if (description !== undefined) {
      updateFields.description = description;
    }
    updateFields.updatedAt = new Date();

    if (Object.keys(updateFields).length === 1 && updateFields.updatedAt) {
      console.log(`No fields to update for order ID: ${id}`);
      return await getById(id);
    }
    
    const result = await ordersCollection.updateOne(
      { id },
      { $set: updateFields }
    );
    
    console.log(`Order with "ID" ${id} updated. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
    
    if (result.modifiedCount === 0 && result.matchedCount === 0) {
      return null;
    }

    return await getById(id);
  } catch (error) {
    console.error(`Error updating order with ID ${id}:`, error);
    throw error;
  }
};

export const remove = async (id) => {
  try {
    const result = await ordersCollection.deleteOne({ _id: new ObjectId(id) });
    console.log(`Order with "ID" ${id} deleted. Deleted Count: ${result.deletedCount}`);
    
    return result.deletedCount > 0;
  } catch (error) {
    console.error(`Error deleting order with "ID" ${id}:`, error);
    throw error;
  }
};
