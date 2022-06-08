# Consulta Boletos
Com essa API de apenas um endpoint, é possível consultar o vencimento, o valor e o código de barras de um boleto, através da linha digitável.

## Rodando a API
Para rodar a API, clone o repositório e entre no diretório do projeto:
```
git clone https://github.com/JoaoP12/ConsultaBoletos
cd ConsultaBoletos
```

Para funcionar, a API só precisa da biblioteca Express, mas você pode fazer a instalação de todas as dependências (incluindo o jest e o supertest, que foram utilizados para os testes unitários), presentes no `package.json`:
```
npm install
```

Após a instalação das dependências, pode rodar a API com o comando `npm start`.
Se tudo der certo, deverá aparecer no seu console a seguint mensagem:
```
Server listening at http://localhost:3000
```

## Endpoints
#### GET /boleto/:linhaDigitavel
Esse é o único endpoint disponível. O parâmetro `linhaDigitavel` é a linha digitável de 47 ou 48 dígitos do boleto escolhido.

Se for enviado uma linha digitável válida, a resposta da API será com status 200 e um json contendo as informações do boleto.
Exemplo de request:
**GET /boleto/816700000010732728822022206100063448388000000215**

Response:
```json
{"barCode":"81670000001732728822022061000634438800000021","amount":"173.27","expirationDate":"2022-06-10"}
```

No entanto, ser for enviado uma linha digitada inválida, a API vai responder a requisição com status 400 e um json com a mensagem do primeiro erro que encontrar. Existem três erros possíveis para uma linha digitável inválida:

- Comprimento da linha maior que 48 dígitos ou menor que 47.
- Linha contém caracteres especiais ou letras
- Um ou mais dígitos verificadores incorretos 

Exemplo de request inválida:
**GET /boleto/826b80a00000d18052501102025303071634635056594823**

Response:
```json
{"error":"A linha digitada deve conter apenas números"}
```

> **NOTE:** o arquivo `src/tests/boletosTest.json` possui diversas linhas digitáveis válidas e inválidas para que você possa testar a aplicação. Se você instalou todas as dependências do projeto, também pode fazer isso utilizando a suíte de testes do jest, rodando o comando `npm test`.