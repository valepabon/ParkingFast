// test/unit/parqueaderoService.spec.js
import sinon from 'sinon';
import { expect } from 'chai';
import * as parqueaderoService from '../../services/parqueaderoService.js';
import Parqueadero from '../../models/Parqueadero.js';

describe('parqueaderoService (unit)', () => {
  afterEach(() => sinon.restore());

  it('obtenerTodos debe retornar todos los parqueaderos', async () => {
    const mock = [{ codigo: 'P1' }, { codigo: 'P2' }];
    const stub = sinon.stub(Parqueadero, 'find').resolves(mock);

    const res = await parqueaderoService.obtenerTodos();
    expect(stub.calledOnce).to.be.true;
    expect(res).to.have.lengthOf(2);
  });

  it('crearParqueadero debe guardar un nuevo parqueadero', async () => {
    const saveStub = sinon.stub().resolves({ _id: 'p1' });
    sinon.stub(Parqueadero.prototype, 'save').callsFake(saveStub);

    const data = { codigo: 'P1', tipo: 'residente' };
    const result = await parqueaderoService.crearParqueadero(data);

    expect(saveStub.calledOnce).to.be.true;
    expect(result._id).to.equal('p1');
  });

  it('eliminarParqueadero debe ejecutar findByIdAndDelete', async () => {
    const stub = sinon.stub(Parqueadero, 'findByIdAndDelete').resolves({ deletedCount: 1 });

    await parqueaderoService.eliminarParqueadero('p1');
    expect(stub.calledWith('p1')).to.be.true;
  });

  it('obtenerPorId debe retornar un parqueadero por id', async () => {
    const stub = sinon.stub(Parqueadero, 'findById').resolves({ codigo: 'P1' });

    const res = await parqueaderoService.obtenerPorId('123');
    expect(stub.calledWith('123')).to.be.true;
    expect(res.codigo).to.equal('P1');
  });

  it('actualizarParqueadero debe ejecutar findByIdAndUpdate con los datos', async () => {
    const stub = sinon.stub(Parqueadero, 'findByIdAndUpdate').resolves({ codigo: 'P1', tipo: 'visitante' });

    const datos = { tipo: 'visitante' };
    const result = await parqueaderoService.actualizarParqueadero('p1', datos);

    expect(stub.calledWith('p1', datos, { new: true })).to.be.true;
    expect(result.tipo).to.equal('visitante');
  });
});
