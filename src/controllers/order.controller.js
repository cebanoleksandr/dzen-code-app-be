import * as orderService from '../services/order.service.js';

export const get = async (req, res) => {
  const { query } = req.query;
  const orders = await orderService.getAll(query);
  res.send(orders);
}

export const getOne = async (req, res) => {
  const { id } = req.params;
  const order = await orderService.getById(id);

  if (!order) {
    res.sendStatus(404);
    return;
  }

  res.send({ ...order, id: order._id });
}

export const create = async (req, res) => {
  const { title, description, authorId } = req.body;
  if (!title || !description || !authorId) {
    res.sendStatus(422);
  }

  const order = orderService.create({ title, description, authorId });

  res.status(201).send({ ...order, id: order._id });
}

export const update = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if ((!title && !description) || ((!!title && typeof title !== 'string') || (!!description && typeof description !== 'string'))) {
    res.sendStatus(422);
    return;
  }

  const order = orderService.getById(id);

  if (!order) {
    res.sendStatus(404);
    return;
  }

  const updatedOrder = orderService.update({ id, title, description });

  res.send(updatedOrder);
}

export const remove = async (req, res) => {
  const { id } = req.params;

  if (!orderService.getById(id)) {
    res.sendStatus(404);
    return;
  }
  
  orderService.remove(id);

  res.sendStatus(204);
}
