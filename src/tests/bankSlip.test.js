const boletosTest = require('./boletosTeste.json');
const request = require('supertest');
const app = require('../../app');
const {
    validateWritableLineLength,
    validateWritableLineContent,
    validateCheckDigits } = require('../utils/validators/bankSlipValidator');

const linhasValidas = boletosTest.validos;
const linhasInvalidas = boletosTest.invalidos;

/* --------- TESTES DE VALIDAÇÃO DA LINHA DIGITÁVEL --------- */
test('Validating writable line length', async () => {
    expect(validateWritableLineLength(linhasValidas[0].linhaDigitavel)).toBe(true); // 48 dígitos
    expect(validateWritableLineLength(linhasValidas[7].linhaDigitavel)).toBe(true); // 47 dígitos

    expect(validateWritableLineLength(linhasInvalidas[1].linhaDigitavel)).toBe(false); // Menos de 47 dígitos
    expect(validateWritableLineLength(linhasInvalidas[2].linhaDigitavel)).toBe(false); // Mais de 48 dígitos
});

test('Validating line content', async () => {
    expect(validateWritableLineContent(linhasValidas[0].linhaDigitavel)).toBe(true);
    expect(validateWritableLineContent(linhasValidas[1].linhaDigitavel)).toBe(true);
    expect(validateWritableLineContent(linhasValidas[7].linhaDigitavel)).toBe(true);
    expect(validateWritableLineContent(linhasValidas[8].linhaDigitavel)).toBe(true);

    expect(validateWritableLineContent(linhasInvalidas[0].linhaDigitavel)).toBe(false);
    expect(validateWritableLineContent(linhasInvalidas[3].linhaDigitavel)).toBe(false);
    expect(validateWritableLineContent(linhasInvalidas[4].linhaDigitavel)).toBe(false);
    expect(validateWritableLineContent(linhasInvalidas[5].linhaDigitavel)).toBe(false);
});

test('Validating check digits', async () => {
    expect(validateCheckDigits(linhasValidas[2].linhaDigitavel)).toBe(true);
    expect(validateCheckDigits(linhasValidas[3].linhaDigitavel)).toBe(true);
    expect(validateCheckDigits(linhasValidas[5].linhaDigitavel)).toBe(true);
    expect(validateCheckDigits(linhasValidas[6].linhaDigitavel)).toBe(true);

    expect(validateCheckDigits(linhasInvalidas[5].linhaDigitavel)).toBe(false);
    expect(validateCheckDigits(linhasInvalidas[6].linhaDigitavel)).toBe(false);
    expect(validateCheckDigits(linhasInvalidas[7].linhaDigitavel)).toBe(false);
    expect(validateCheckDigits(linhasInvalidas[8].linhaDigitavel)).toBe(false);
    expect(validateCheckDigits(linhasInvalidas[9].linhaDigitavel)).toBe(false);
})

/* --------- TESTES DE INTEGRAÇÃO COM A API --------- */
describe(`GET /boleto/:linhaDigitavel`, () => {
    test("It should respond with status 200 and the bank slips' infos", async () => {
        for (let linha of linhasValidas) {
            const response = await request(app).get(`/boleto/${linha.linhaDigitavel}`);
            
            await expect(response.body).toEqual({
                amount: linha.amount,
                expirationDate: linha.expirationDate,
                barCode: linha.barCode
            });

            await expect(response.statusCode).toBe(200);
        }
    });
});

describe(`GET /boleto/`, () => {
    test("It should respond with status 404", async () => {
        const response = await request(app).get("/boleto/");

        await expect(response.statusCode).toBe(404);
    });
});

describe(`GET /boleto/:linhaDigitavel`, () => {
    test("It should respond with status 400 and the error messages according to the line problem' infos", async () => {
        for (let linha of linhasInvalidas.slice(1)) {
            const response = await request(app).get(`/boleto/${linha.linhaDigitavel}`);
            
            await expect(response.body).toEqual({
                error: linha.msgErro,
            });

            await expect(response.statusCode).toBe(400);
        }
    });
})