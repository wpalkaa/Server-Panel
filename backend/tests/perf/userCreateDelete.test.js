const axios = require('axios');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const https = require('https');

const API_URL = 'https://localhost:13001/api'
const TIMEOUT = 500;

const agent = new https.Agent({ rejectUnauthorized: false })

async function accountCreateDelete1000times(accData, i) {
    try {
        const r = await axios.post(`${API_URL}/users/create`, accData, { timeout: TIMEOUT, httpsAgent: agent });
        if( r.status !== 201 ) throw new Error(`${i}-request: Got wrong status`);

        const data = r.data;

        const r2 = await axios.delete(`${API_URL}/users/delete/noauth/${data.userId}`, { timeout: TIMEOUT, httpsAgent: agent });
        if( r2.status !== 200 ) throw new Error(`${i}-request: Got wrong status`);

        console.log(`${i}-iteration ended successfully.`);
    } catch(err) {
        throw new Error(`Iteration ${i} failed: Status=${err.response?.status}, URL=${err.config?.url}, Message=${err.response?.data || err.message}`);
    }
}





describe('Perf test', () => {
    const accData = {
        login: "DonaldNaworcki",
        password: "Lubiekotki1337"
    };

    jest.setTimeout(250000)

    it('Create and delete account 500 times', async () => { 
        for(let i=0; i < 500; i++) await accountCreateDelete1000times(accData, i)
    });
});