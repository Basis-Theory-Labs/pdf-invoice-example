# Creating PDF Files Securely with Reactors

Basis Theory’s Reactor service allows your development team to control your business logic and workflows. This example shows how you can utilize Reactors to generate a PDF that contains sensitive data without that data touching your application.

*[Complete Blog Post](https://www.basistheory.com/blog)

## Requirements

* NodeJS
* Basis Theory account
* Basis Theory "Management" Application with `reactor:create` permissions
* Basis Theory "Private" Application with `token:general:create` and `token:general:use:proxy` permissions

## Creating The Reactor Formula

### Write your function

The blog post covers all the details of how the code works. Once your have your Reactor Formula code written, you need to create the [Reactor Formula Configuration](https://docs.basistheory.com/#reactor-formulas-reactor-formula-object) object. This object contains a stringified version of the code. To generate that, we use this JavaScript trick, then paste the results into the `pdf-invoice-example.json` file:

```javascript
console.log(JSON.stringify(`module.exports = ${formula}`))
```

### Uploading the Formula

Once the configuration file is created, the next step is to send it to the `/reactor-formulas` endpoint. You will need the API Key from the Management Application for this request:

```bash
curl 'https://api.basistheory.com/reactor-formulas' \
  -X 'POST' \
  -H 'BT-API-KEY: BT_API_KEY' \
  -H 'Content-Type: application/json' \
  -d @pdf-invoice-example.json
```

You should get a response similar to this. Note the ID, you will need it in the next step!

```javascript
{
  "id":"e0b60a76-2edf-4d1d-a7d8-b3f6ed346871",
  "type":"private",
  "status":"verified",
  "name":"PDF Invoice - Example",
  "description":"Insert sensitive data into a PDF with a Reactor",
  ...
}
```

## Creating the Reactor

A Reactor is a concrete instance of a Reactor Formula. Reactor Formulas can optionally contain configuration variables, such as API Keys to external services, which means you can reuse the same Formula with different configuration values. The next steps it use our formula to create a Reactor. This requires the Management API Key and the Formula ID from the previous step.

```bash
curl 'https://api.basistheory.com/reactors' \
  -X 'POST' \
  -H 'BT-API-KEY: BT_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
      "name": "PDF Invoice Example - Insert data into PDF",
      "formula": {
        "id": "e0b60a76-2edf-4d1d-a7d8-b3f6ed346871"
      }
  }'
```

You will receive another response with the ID of the Reactor. Take note of this ID.

```javascript
{
  "id":"1618d2de-3825-4077-907e-f254b730e827",
  "tenant_id":"570b53fb-1ecf-4aaf-9cb2-145e13b566a9",
  "name":"PDF Invoice Example - Insert data into PDF",
  ...
}
```

## Invoking the Reactor

First, we need to create tokens to use for the example. This example uses two tokens: a `user` token containing the PII for our fictional customer, and an `account_number` token that contains their account number. Let's create those tokens and get their IDs for the Reactor request. You will need to use

```bash
curl 'https://api.basistheory.com/tokens' \
  -H 'BT-API-KEY: BT_API_KEY' \
  -H 'Content-Type: application/json' \
  -X 'POST' \
  -d '{
    "type": "token",
    "data": "999999-00"
  }'

curl 'https://api.basistheory.com/tokens' \
  -H 'BT-API-KEY: BT_API_KEY' \
  -H 'Content-Type: application/json' \
  -X 'POST' \
  -d '{
    "type": "token",
    "data": {
      "first_name": "James",
      "last_name": "Holden",
      "address_line1": "456 Expanse St.",
      "city": "New York",
      "state": "NY",
      "zip": "12345",
      "phone": "(555) 555-5555"
    }
  }'
```

You should now have two token IDs that you an use to invoke your new Reactor! Plug your token IDs and API Key into the `invoke-reactor.js` file and test it for yourself!

You can invoke a Reactor with `curl` but it would be a bit of a nuisance to get the base64 encoded PDF into the body of the request. For completeness, the `curl` request to invoke our new Reactor would look something like this:

```bash
curl 'https://api.basistheory.com/reactors/ab8a1c9a-8666-449d-91c7-6c0d77bf7d02/react' \
  -X 'POST' \
  -H 'BT-API-KEY: BT_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
      "args": {
        "user": "{{d98cbe84-d7f0-49d4-837c-a76c817709b0}},
        "account_number": "{{162e8144-a3d6-412f-9483-1c98ec1c88ea}}",
        "invoice": "base64 encoded pdf, omitted for brevity"
      }
  }'
```
