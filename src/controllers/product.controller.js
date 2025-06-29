import * as productService from '../services/product.service.js';

export const get = async (req, res) => {
  const { orderId, query } = req.query;

  const products = await productService.getAll({ orderId, query });
  res.send(products);
}

export const getOne = async (req, res) => {
  const { id } = req.params;
  const product = productService.getById(id);

  if (!product) {
    res.sendStatus(404);
    return;
  }

  res.send({ ...product, id: product._id });
}

export const create = async (req, res) => {
  const {
    serialNumber,
    status,
    photo,
    title,
    type,
    specification,
    guarantee,
    price,
    order,
    authorId,
  } = req.body;

  if (
    !serialNumber
    || !status
    || !title
    || !type
    || !specification
    || !guarantee
    || !price
    || !order
    || !authorId
  ) {
    res.sendStatus(422);
    return;
  }

  const product = productService.create({ 
    serialNumber, 
    status, 
    photo, 
    title, 
    type, 
    specification, 
    guarantee, 
    price, 
    order, 
    authorId 
  });

  res.status(201).send({ ...product, id: product._id });
}

export const update = async (req, res) => {
  const { id } = req.params;
  const { photo, title, type, specification, guarantee, price } = req.body;

  if (!photo && !title && !type && !specification && !guarantee && !price) {
    res.sendStatus(422);
    return;
  }

  const product = productService.getById(id);

  if (!product) {
    res.sendStatus(404);
    return;
  }

  const updatedProduct = productService.update({ id, title, photo, type, specification, guarantee, price });

  res.send(updatedProduct);
}

export const remove = async (req, res) => {
  const { id } = req.params;
  
  if (!productService.getById(id)) {
    res.sendStatus(404);
    return;
  }
  
  productService.remove(id);

  res.sendStatus(204);
}
