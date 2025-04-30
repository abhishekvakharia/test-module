import express, { Request, Response, Application } from 'express';
import bodyParser from 'body-parser';
import _ from 'lodash';

// In-memory user store
const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

export const app: Application = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.get('/users', (req: Request, res: Response): void => {
    res.json(users);
});

app.post('/users', (req: Request, res: Response): void => {
    const { name, email } = req.body;
    
    if (!name || !email) {
        res.status(400).json({ error: 'Name and email are required' });
        return;
    }

    const newUser = {
        id: users.length + 1,
        name,
        email
    };

    users.push(newUser);
    res.status(201).json(newUser);
});

app.get('/users/:id', (req: Request, res: Response): void => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    res.json(user);
});

app.get('/error', (req: Request, res: Response): void => {
    res.status(500).json({ error: 'Test error' });
});

// Test route for JSON parsing
app.post('/test-json', (req: Request, res: Response): void => {
    res.json(req.body);
});

// Start server only if this file is run directly
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
} 