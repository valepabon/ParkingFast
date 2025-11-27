// test/unit/reservaService.spec.js
import sinon from 'sinon';
import { expect } from 'chai';
import mongoose from 'mongoose';

import * as reservaService from '../../services/reservaService.js';
import Reserva from '../../models/Reserva.js';

describe('reservaService (unit)', () => {
  afterEach(() => sinon.restore());

  it('getReservasByUsuario debe retornar reservas del usuario', async () => {
    const fakeReservas = [{ _id: '1', placa: 'ABC123' }];

    const findStub = sinon.stub(Reserva, 'find').returns({
      populate: sinon.stub().resolves(fakeReservas)
    });

    const result = await reservaService.getReservasByUsuario('user123');

    expect(findStub.calledWith({ usuario: 'user123' })).to.be.true;
    expect(result).to.have.lengthOf(1);
    expect(result[0].placa).to.equal('ABC123');
  });

  it('createReserva debe guardar una nueva reserva', async () => {
    const saveStub = sinon.stub().resolves({ _id: 'r1' });

    sinon.stub(Reserva.prototype, 'save').callsFake(saveStub);

    const data = {
      usuario: 'user123',
      conjunto: 'cj1',
      fecha: '2025-11-30',
      horaInicio: '08:00',
      horaFin: '10:00',
      placa: 'ZZZ-999',
      estado: 'activa'
    };

    const result = await reservaService.createReserva(data);

    expect(saveStub.calledOnce).to.be.true;
    expect(result._id).to.equal('r1');
  });

  it('updateReserva debe llamar a updateOne con datos correctos', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const updateStub = sinon.stub(Reserva, 'updateOne').resolves({ modifiedCount: 1 });

    await reservaService.updateReserva(fakeId, { placa: 'XYZ' });

    expect(updateStub.calledWith(
      { _id: fakeId },
      { $set: { placa: 'XYZ' } }
    )).to.be.true;
  });

  it('deleteReserva debe llamar a deleteOne con el id', async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const deleteStub = sinon.stub(Reserva, 'deleteOne').resolves({ deletedCount: 1 });

    await reservaService.deleteReserva(fakeId);

    expect(deleteStub.calledWith({ _id: fakeId })).to.be.true;
  });
});
