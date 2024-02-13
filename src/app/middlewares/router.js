const router =
{
    status: (router) =>
    {
        router.get('*', (request, response) =>
        {
            response.status(404).json({ message: 'Not Found' });
        });
        router.post('*', (request, response) =>
        {
            response.status(405).json({ message: 'Method Not Allowed' });
        });
        router.put('*', (request, response) =>
        {
            response.status(405).json({ message: 'Method Not Allowed' });
        });
        router.patch('*', (request, response) =>
        {
            response.status(405).json({ message: 'Method Not Allowed' });
        });
        router.delete('*', (request, response) =>
        {
            response.status(405).json({ message: 'Method Not Allowed' });
        });
    }
}

module.exports = router;
