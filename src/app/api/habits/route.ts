import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        // Return habits (placeholder)
        res.status(200).json([{ id: 1, name: 'Drink Water' }]);
    } else if (req.method === 'POST') {
        // Add habit logic
        res.status(201).json({ message: 'Habit added!' });
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}