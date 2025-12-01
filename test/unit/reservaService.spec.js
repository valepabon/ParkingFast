// test/unit/reservaService.spec.js
import sinon from 'sinon';
import { expect } from 'chai';
import * as reservaService from '../../services/reservaService.js';
import Reserva from '../../models/Reserva.js';

describe('reservaService (unit)', () => {
  afterEach(() => sinon.restore());

  it('getReservasByUsuario debe retornar reservas del usuario', async () => {
    const stub = sinon.stub(Reserva, 'find').returns({
      populate: sinon.stub().resolves([{ _id: '1', placa: 'ABC123' }])
    });

    const result = await reservaService.getReservasByUsuario('user123');
    expect(stub.calledWith({ usuario: 'user123' })).to.be.true;
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

  it('updateReserva debe llamar a findByIdAndUpdate con datos correctos', async () => {
    const stub = sinon.stub(Reserva, 'findByIdAndUpdate').resolves({ modifiedCount: 1 });

    const result = await reservaService.updateReserva('r1', { placa: 'XYZ' });
    expect(stub.calledWith('r1', { $set: { placa: 'XYZ' } })).to.be.true;
    expect(result.modifiedCount).to.equal(1);
  });

  it('deleteReserva debe llamar a findByIdAndDelete con el id', async () => {
    const stub = sinon.stub(Reserva, 'findByIdAndDelete').resolves({ deletedCount: 1 });

    const result = await reservaService.deleteReserva('r1');
    expect(stub.calledWith('r1')).to.be.true;
    expect(result.deletedCount).to.equal(1);
  });
});
