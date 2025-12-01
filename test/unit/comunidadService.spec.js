// test/unit/comunidadService.spec.js
import sinon from 'sinon';
import { expect } from 'chai';
import * as comunidadService from '../../services/comunidadService.js';
import Comunidad from '../../models/Comunidad.js';

describe('comunidadService (unit)', () => {

  afterEach(() => sinon.restore());

  it('obtenerTodas debe retornar todas las publicaciones', async () => {
    const mockResult = [{ titulo: 'Pub1' }, { titulo: 'Pub2' }];

    const stub = sinon.stub(Comunidad, 'find').returns({
      populate: sinon.stub().resolves(mockResult)
    });

    const res = await comunidadService.obtenerTodas();
    expect(stub.calledOnce).to.be.true;
    expect(res).to.have.lengthOf(2);
  });

  it('obtenerPorUsuario debe retornar publicaciones del usuario', async () => {
    const mockResult = [{ propietario: 'u1' }];

    const stub = sinon.stub(Comunidad, 'find').resolves(mockResult);

    const res = await comunidadService.obtenerPorUsuario('u1');
    expect(stub.calledWith({ propietario: 'u1' })).to.be.true;
    expect(res[0].propietario).to.equal('u1');
  });

  it('crearPublicacion debe guardar correctamente', async () => {
    const saveStub = sinon.stub().resolves({ _id: 'p1' });
    sinon.stub(Comunidad.prototype, 'save').callsFake(saveStub);

    await comunidadService.crearPublicacion({
      tipoVehiculo: 'carro',
      precio: 5000
    });

    expect(saveStub.calledOnce).to.be.true;
  });

  it('eliminarPublicacion debe ejecutar findByIdAndDelete', async () => {
    const stub = sinon.stub(Comunidad, 'findByIdAndDelete').resolves({ deletedCount: 1 });

    await comunidadService.eliminarPublicacion('p1');
    expect(stub.calledWith('p1')).to.be.true;
  });

  it('obtenerPorId debe ejecutar findById', async () => {
    const stub = sinon.stub(Comunidad, 'findById').resolves({ _id: 'p1' });

    const res = await comunidadService.obtenerPorId('p1');
    expect(stub.calledWith('p1')).to.be.true;
    expect(res._id).to.equal('p1');
  });

  it('actualizarPublicacion debe ejecutar findByIdAndUpdate', async () => {
    const stub = sinon.stub(Comunidad, 'findByIdAndUpdate').resolves({ _id: 'p1', precio: 3000 });

    const data = {
      tipoParqueadero: 'cubierto',
      tipoVehiculo: 'moto',
      precio: 3000,
      fecha: '2025-10-10',
      telefono: '123',
      ubicacion: 'Los Tulipanes',
      descripcion: 'Disponible'
    };

    await comunidadService.actualizarPublicacion('p1', data);

    expect(stub.calledWith(
      'p1',
      {
        tipoParqueadero: 'cubierto',
        tipoVehiculo: 'moto',
        precio: 3000,
        fechaDisponible: '2025-10-10',
        telefono: '123',
        conjunto: 'Los Tulipanes',
        descripcion: 'Disponible'
      },
      { new: true }
    )).to.be.true;
  });
});
