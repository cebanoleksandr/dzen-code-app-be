import { v4 as uuidv4 } from 'uuid';
import { usersCollection } from '../db.js';
import { ApiError } from '../exeptions/api.error.js';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

export const getAll = async (query) => {
  try {
    const filter = {};

    if (query) {
      filter.$or = [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ];
    }
    const allUsers = await usersCollection.find(filter).toArray();
    console.log('Fetched all users:', allUsers.length);
    
    return allUsers.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

export const getById = async (id) => {
  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    console.log(`Fetched user by "ID" ${id}:`, user ? 'found' : 'not found');
   
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching user by "ID" ${id}:`, error);
    throw error;
  }
};

export const update = async ({ id, firstName, lastName, photoUrl }) => {
  try {
    const updateFields = {};
    if (firstName !== undefined) updateFields.firstName = firstName;
    if (lastName !== undefined) updateFields.lastName = lastName;
    if (photoUrl !== undefined) updateFields.photoUrl = photoUrl;
    
    updateFields.updatedAt = new Date();

    if (Object.keys(updateFields).length === 1 && updateFields.hasOwnProperty('updatedAt')) {
        console.log(`No specific fields to update for user ID: ${id}`);
        return await getById(id);
    }

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );
    
    console.log(`User with "ID" ${id} updated. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);

    if (result.modifiedCount === 0 && result.matchedCount === 0) {
      return null;
    }

    // Возвращаем обновленный документ без пароля
    return await getById(id);
  } catch (error) {
    console.error(`Error updating user with "ID" ${id}:`, error);
    throw error;
  }
};

export const remove = async (id) => {
  try {
    const result = await usersCollection.deleteOne({ id });
    console.log(`User with "ID" ${id} deleted. Deleted Count: ${result.deletedCount}`);
    
    return result.deletedCount > 0;
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    throw error;
  }
};

export const findByCredentials = async (email, plainTextPassword) => {
  try {
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(plainTextPassword, user.password);
    if (isMatch) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } else {
      throw ApiError.badRequest('Wrong password');
    }
  } catch (error) {
    console.error("Error finding user by credentials:", error);
    throw error;
  }
};

export const create = async ({ email, password }) => {
  const existUser = await findByCredentials(email, password);

  if (existUser) {
    throw ApiError.badRequest('User already exist', { email: 'User already exist' });
  }
  
  const newUser = {
    email,
    password,
    firstName: null,
    lastName: null,
    photoUrl: null,
    updatedAt: new Date(),
    createdAt: new Date(),
  }

  const result = await usersCollection.insertOne(newUser);
    
  console.log(`User with "id": ${result.insertedId} created successfully.`);

  return newUser;
}
