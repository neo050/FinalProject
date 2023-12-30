async function withRetry(apiFunction, args, retries = 3) {
    try {
        return await apiFunction(...args);
    } catch (error) {
        if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return withRetry(apiFunction, args, retries - 1);
        } else {
            throw error;
        }
    }
}

module.exports = { withRetry };
