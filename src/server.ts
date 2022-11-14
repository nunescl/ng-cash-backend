import express from 'express';

import { Router, Request, Response } from 'express';

const app = express();

const route = Router();

app.use(express.json());

app.listen(3333, () => 'server running on port 3333');
