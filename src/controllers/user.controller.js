import * as userService from '../services/user.service.js';
import * as jwtService from '../services/jwt.service.js';
import { ApiError } from '../exeptions/api.error.js';
import bcrypt from 'bcrypt';

export const get = async (req, res) => {
  const { query } = req.query;
  const users = await userService.getAll(query);
  res.send(users);
}

export const getOne = async (req, res) => {
  const { id } = req.params;
  const user = await userService.getById(id);

  if (!user) {
    res.sendStatus(404);
    return;
  }

  res.send({ ...user, id: user._id });
}

export const update = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, photoUrl } = req.body;

  if ((!firstName && !lastName && photoUrl === undefined) || ((!!firstName && typeof firstName !== 'string') || (!!lastName && typeof lastName !== 'string'))) {
    res.sendStatus(422);
    return;
  }

  const user = await userService.getById(id);

  if (!user) {
    res.sendStatus(404);
    return;
  }

  const updatedUser = await userService.update({ id, firstName, lastName, photoUrl });

  res.send(updatedUser);
}

export const remove = async (req, res) => {
  const { id } = req.params;
  
  if (!userService.getById(id)) {
    res.sendStatus(404);
    return;
  }
  
  userService.remove(id);

  res.sendStatus(204);
}

export const register = async (req, res, next) => {
  const { email, password } = req.body;
  const hashPassword = await bcrypt.hash(password, 10);

  await userService.create({ email, password: hashPassword });

  const user = await userService.findByCredentials(email, password);

  if (!user) {
    throw ApiError.badRequest('No such user');
  }

  const accessToken = jwtService.sign(user);

  res.send({ user: { ...user, id: user._id }, accessToken });
}

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userService.findByCredentials(email, password);

  if (!user) {
    throw ApiError.badRequest('No such user');
  }

  const accessToken = jwtService.sign(user);

  res.send({ user, accessToken });
}
