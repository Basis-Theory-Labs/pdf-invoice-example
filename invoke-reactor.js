const { BasisTheory } = require('@basis-theory/basis-theory-js');
const fs = require('fs');

const PRIVATE_API_KEY = '';
const REACTOR_ID = '';
const ACCOUNT_NUMBER_TOKEN_ID = '';
const USER_TOKEN_ID = '';

(async () => {
  const contents = fs.readFileSync('invoice.pdf', {encoding: 'base64'});

  const bt = await new BasisTheory().init(PRIVATE_API_KEY);
  const reactResponse = await bt.reactors.react(REACTOR_ID, {
    args: {
      invoice: contents,
      user: `{{${USER_TOKEN_ID}}}`,
      account_number: `{{${ACCOUNT_NUMBER_TOKEN_ID}}}`
    },
  });

  console.log(reactResponse);

  fs.writeFileSync('test.pdf', reactResponse.raw.invoice);
})()
