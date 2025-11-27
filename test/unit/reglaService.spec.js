// test/unit/reglaService.spec.js
import sinon from 'sinon';
import { expect } from 'chai';
import * as reglaService from '../../services/reglaService.js';
import Regla from '../../models/Regla.js';

describe('reglaService (unit)', () => {
  afterEach(() => sinon.restore());

  it('crearRegla debe guardar una nueva regla', async () => {
    const stub = sinon.stub(Regla, 'create').resolves({ _id: '1', titulo: 'Regla 1' });

    const result = await reglaService.crearRegla({ titulo: 'Regla 1' });
    expect(result._id).to.equal('1');
    expect(stub.calledOnce).to.be.true;
  });

  it('obtenerReglas debe devolver todas las reglas', async () => {
    const stub = sinon.stub(Regla, 'find').resolves([{ titulo: 'Regla 1' }]);

    const result = await reglaService.obtenerReglas();
    expect(result).to.have.lengthOf(1);
    expect(result[0].titulo).to.equal('Regla 1');
  });

  it('obtenerReglaPorId debe devolver la regla correspondiente', async () => {
    const stub = sinon.stub(Regla, 'findById').resolves({ _id: '1', titulo: 'Regla 1' });

    const result = await reglaService.obtenerReglaPorId('1');
    expect(result.titulo).to.equal('Regla 1');
  });

  it('actualizarRegla debe llamar a findByIdAndUpdate correctamente', async () => {
    const stub = sinon.stub(Regla, 'findByIdAndUpdate').resolves({ _id: '1', titulo: 'Actualizado' });

    const result = await reglaService.actualizarRegla('1', { titulo: 'Actualizado' });
    expect(stub.calledWith('1', { titulo: 'Actualizado' })).to.be.true;
  });

  it('eliminarRegla debe llamar a findByIdAndDelete', async () => {
    const stub = sinon.stub(Regla, 'findByIdAndDelete').resolves({ _id: '1' });

    await reglaService.eliminarRegla('1');
    expect(stub.calledWith('1')).to.be.true;
  });
});

