const axios = require('axios');

async function genPassword(length, symbols, numbers, type, count, syllables, dashes) {
    let API_URL = "https://makemeapassword.ligos.net"

    let types = ["pin", "alphanumeric", "hex", "pronounceable"]

    let passwords = "";

    if (type === "pin") {
        API_URL += `/api/v1/pin/json?c=${count}&l=${length}`
    } else if (type === "alphanumeric") {
        API_URL += `/api/v1/alphanumeric/json?c=${count}&l=${length}`
    } else if (type === "hex") {
        API_URL += `/api/v1/hex/json?c=${count}&l=${length}`
    } else if (type === "pronounceable") {
        API_URL += `/api/v1/pronounceable/json?c=${count}&sc=${syllables}&dsh=${dashes}`
    }

    await axios.get(API_URL)
        .then(response => {
            passwords = response.data.pws
        })
        .catch(error => {
            console.error(error);
        });

    return passwords
}

module.exports = genPassword