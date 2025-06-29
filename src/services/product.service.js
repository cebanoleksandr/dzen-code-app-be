import { productsCollection } from '../db.js';
import { ObjectId } from 'mongodb';

export const getAll = async ({ orderId, query }) => {
  try {
    const body = {};
    if (!!orderId) {
      body.order = orderId;
    }
    if (!!query) {
      body.title = { $regex: query, $options: 'i' };
    }
    const allProducts = await productsCollection.find(body).toArray();
    console.log('Fetched all products:', allProducts);
    return allProducts;
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw error;
  }
};

export const getById = async (id) => {
  try {
    const product = await productsCollection.findOne({ id });
    console.log(`Fetched product by "ID" ${id}:`, product ? 'found' : 'not found');
    return product;
  } catch (error) {
    console.error(`Error fetching product by "ID" ${id}:`, error);
    throw error;
  }
};

export const create = async (productData) => {
  try {
    const newProduct = {
      serialNumber: productData.serialNumber,
      status: productData.status,
      photo: productData.photo,
      title: productData.title,
      type: productData.type,
      specification: productData.specification,
      guarantee: productData.guarantee,
      price: productData.price,
      order: productData.order,
      authorId: productData.authorId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await productsCollection.insertOne(newProduct);
    console.log(`Product with "ID": ${result.insertedId} successfully created.`);
    
    return newProduct;
  } catch (error) {
    console.error("Error creating new product:", error);
    throw error;
  }
};

export const update = async ({ id, title, photo, type, specification, guarantee, price }) => {
  try {
    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (photo !== undefined) updateFields.photo = photo;
    if (type !== undefined) updateFields.type = type;
    if (specification !== undefined) updateFields.specification = specification;
    if (guarantee !== undefined) updateFields.guarantee = guarantee;
    if (price !== undefined) updateFields.price = price;
    
    updateFields.updatedAt = new Date();

    if (Object.keys(updateFields).length === 1 && updateFields.hasOwnProperty('updatedAt')) {
        console.log(`No specific fields to update for product ID: ${id}`);
        return await getById(id);т
    }

    const result = await productsCollection.updateOne(
      { id },
      { $set: updateFields }
    );
    
    console.log(`Product with "ID" ${id} updated. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);

    if (result.modifiedCount === 0 && result.matchedCount === 0) {
      return null;
    }

    return await getById(id);
  } catch (error) {
    console.error(`Error updating product with "ID" ${id}:`, error);
    throw error;
  }
};

export const remove = async (id) => {
  try {
    const result = await productsCollection.deleteOne({ _id: new ObjectId(id)});
    console.log(`Product with "ID" ${id} deleted. Deleted Count: ${result.deletedCount}`);
    
    return result.deletedCount > 0;
  } catch (error) {
    console.error(`Error deleting product with "ID" ${id}:`, error);
    throw error;
  }
};