import { MongoClient } from 'mongodb';

const mongoUri = 'mongodb+srv://cebanoleksandr:loVSbFm4GyMzasZN@cluster0.iondvjp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

export const client = new MongoClient(mongoUri);

export const usersCollection = client.db('dzen_inventory').collection('users');
export const ordersCollection = client.db('dzen_inventory').collection('orders');
export const productsCollection = client.db('dzen_inventory').collection('products');

export const runDb = async () => {
  try {
    await client.connect();
    await client.db('dzen_inventory').command({ ping : 1 });
    console.log("Connected to MongoDB!"); 
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    await client.close();
    throw error; 
  }
}
