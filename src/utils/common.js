function getNodeEnv () {
    let env = 'production';
    if (process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'development') {
        env = 'development';
    }
    return env;
}

function jsonToArray (input) {
    return JSON.parse(JSON.stringify(input, null, 4));
} 

module.exports = {
    getNodeEnv, jsonToArray
};
