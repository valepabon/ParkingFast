// test/unit/userService.spec.js
import { expect } from 'chai';
import sinon from 'sinon';
import * as userService from '../../services/userService.js';
import Usuario from '../../models/Usuario.js';

describe('userService (unit)', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('getUsers: debería retornar lista de usuarios con conjunto', async () => {
    const mockUsuarios = [{ nombre: 'Valentina', conjunto: {} }];
    const populateStub = sandbox.stub().resolves(mockUsuarios);
    sandbox.stub(Usuario, 'find').returns({ populate: populateStub });

    const result = await userService.getUsers();
    expect(result).to.deep.equal(mockUsuarios);
  });

  it('getUserById: debería retornar un usuario por ID con conjunto', async () => {
    const id = '123';
    const mockUsuario = { _id: id, nombre: 'Valentina', conjunto: {} };
    const populateStub = sandbox.stub().resolves(mockUsuario);
    sandbox.stub(Usuario, 'findById').withArgs(id).returns({ populate: populateStub });

    const result = await userService.getUserById(id);
    expect(result).to.deep.equal(mockUsuario);
  });

  it('getUserByEmail: debería encontrar un usuario por email', async () => {
    const email = 'vale@correo.com';
    const fakeUsuario = { email };
    const stub = sandbox.stub(Usuario, 'findOne').resolves(fakeUsuario);

    const result = await userService.getUserByEmail(email);
    expect(stub.calledOnceWith({ email })).to.be.true;
    expect(result).to.deep.equal(fakeUsuario);
  });

  it('createUser: debería crear un nuevo usuario', async () => {
    const data = { nombre: 'Nuevo', email: 'nuevo@correo.com' };
    const saveStub = sandbox.stub(Usuario.prototype, 'save').resolves(data);

    const result = await userService.createUser(data);
    expect(saveStub.calledOnce).to.be.true;
    expect(result).to.deep.equal(data);
  });

  it('updateUser: debería actualizar un usuario por ID', async () => {
    const id = 'abc123';
    const data = { nombre: 'Modificado' };
    const expected = { modifiedCount: 1 };
    const stub = sandbox.stub(Usuario, 'updateOne').resolves(expected);

    const result = await userService.updateUser(id, data);
    expect(stub.calledOnceWith({ _id: id }, { $set: data })).to.be.true;
    expect(result).to.deep.equal(expected);
  });

  it('deleteUser: debería eliminar un usuario por ID', async () => {
    const id = 'del999';
    const expected = { deletedCount: 1 };
    const stub = sandbox.stub(Usuario, 'deleteOne').resolves(expected);

    const result = await userService.deleteUser(id);
    expect(stub.calledOnceWith({ _id: id })).to.be.true;
    expect(result).to.deep.equal(expected);
  });
});
