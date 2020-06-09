let jwt = require('jsonwebtoken');

const verify = ((token, secret) => {
    try {
        let decoded = jwt.verify(token, secret);

        if(decoded){
            return true
        }
        else {
            return false
        }
    }
    catch(e) {
        console.log(e)
        return false;
    }
});

module.exports = verify