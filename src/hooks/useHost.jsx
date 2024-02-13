const useHost = () =>
{
    const appEnv = process.env.EXPO_PUBLIC_APP_ENV;

    const myPromise = () =>
    {
        return new Promise((resolve) =>
        {
            const host = appEnv === 'local' ?
            (
                `${process.env.EXPO_PUBLIC_API_HOST}:${process.env.EXPO_PUBLIC_API_PORT}`
            ) : process.env.EXPO_PUBLIC_DEPLOY_HOST;

            resolve({ host: host });
        });
    }

    return myPromise;
}

export default useHost;
