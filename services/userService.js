import Usuario from '../models/Usuario.js';

export const getUsers = async () => {
  return await Usuario.find().populate('conjunto');
};

export const getUserById = async (id) => {
  return await Usuario.findById(id).populate('conjunto');
};

export const getUserByEmail = async (email) => {
  return await Usuario.findOne({ email });
};

export const createUser = async (data) => {
  const newUser = new Usuario(data);
  return await newUser.save();
};

export const updateUser = async (id, data) => {
  return await Usuario.updateOne({ _id: id }, { $set: data });
};

export const deleteUser = async (id) => {
  return await Usuario.deleteOne({ _id: id });
};


  