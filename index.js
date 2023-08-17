const axios = require('axios');
const cheerio = require('cheerio');
const replaceToken = require('./utils/replaceToken');
const baseUrl = 'http://applicant-test.us-east-1.elasticbeanstalk.com/';

(async () => {
  const response = await axios.get(baseUrl);
  const $ = cheerio.load(response.data);
  
  const sessionId = response.headers['set-cookie'][0]?.match(/PHPSESSID=([a-zA-Z0-9]+);/)?.[1];
  const token = $('#token').attr('value');
  const replacedToken = replaceToken(token);

  const result = await axios.post(
    baseUrl,
    { token: replacedToken },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': baseUrl,
        'Cookie': `PHPSESSID=${sessionId}`,
      },
    },
  );

  const $$ = cheerio.load(result.data);
  const answer = $$('#answer').text();
  
  console.log(`🆔 SESSION ID: ${sessionId}`);
  console.log(`🔴 Token original: ${token}`);
  console.log(`🟡 Token transformado: ${replacedToken}`);
  console.log(`🟢 Resposta final: ${answer} \n`);
})();
