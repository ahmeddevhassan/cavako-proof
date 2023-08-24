const axios = require("axios");
module.exports = {
    getRequest: async(url, token) => {
            try {
                const response = await axios.get(url, {headers: {
                    authorization: token
                }});
                return response.data;
            } catch (error) {
                return error;
            }
        },
    postRequest: async(url, body) => {
        try {
            const response = await axios.get(url, body);
            return response.data;
        } catch (error) {
            return error;
        }
    },
};


