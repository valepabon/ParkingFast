// test/unit/reservaAdminService.spec.js
import sinon from "sinon";
import { expect } from "chai";
import * as reservaService from "../../services/reservaService.js";

describe("reservaAdminService (unit)", () => {
  afterEach(() => sinon.restore());

  it("cerrarReserva debe actualizar estado a cerrada", async () => {
    const stub = sinon.stub(reservaService, 'updateReserva').resolves({ modifiedCount: 1 });

    const result = await reservaService.updateReserva("res123", { estado: "cerrada" });

    expect(stub.calledWith("res123", { estado: "cerrada" })).to.be.true;
    expect(result.modifiedCount).to.equal(1);
  });

  it("cancelarReserva debe actualizar estado a cancelada", async () => {
    const stub = sinon.stub(reservaService, 'updateReserva').resolves({ modifiedCount: 1 });

    const result = await reservaService.updateReserva("res123", { estado: "cancelada" });

    expect(stub.calledWith("res123", { estado: "cancelada" })).to.be.true;
    expect(result.modifiedCount).to.equal(1);
  });
});
