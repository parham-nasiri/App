function genericResponse({ success = true, errorMessage = undefined, errorStack = undefined, data = undefined }) {
    return {
        status: {
            success,
            errorMessage,
            errorStack
        },
        data,
    };
}

module.exports = genericResponse;
