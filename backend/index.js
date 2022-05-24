const setupDb = require('./db/db-setup');
const express = require('express');
const clientRouter = require('./routes/client');
const adminRouter = require('./routes/admin');
const cors = require('cors')

setupDb();

const app = express();
app.use(express.json());
app.use(cors())
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/', clientRouter);


app.listen(3002, '192.168.18.61', () => console.log('server is running on port 3002'));
