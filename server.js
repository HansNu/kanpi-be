const dotenv = require('dotenv');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./routes/swagger');
const userRoutes = require('./routes/userRoutes');
const classroomRoutes = require('./routes/classroomRoutes');
const classroomMemberRoutes = require('./routes/classroomMemberRoutes');
const classroomAdminRoutes = require('./routes/classroomAdminRoutes');
const classroomSubjectRoutes = require('./routes/classroomSubjectRoutes');
const kanbanRoutes = require('./routes/kanbanRoutes');
const aaiRoutes = require('./routes/aaiRoutes');
const supabase = require('./services/supabaseClient');

dotenv.config();

console.log('Supabase URL:', process.env.SUPABASE_URL);
console.log('Supabase Key:', process.env.SUPABASE_KEY);

const app = express();
app.use(express.json());

const port = 4200;
const baseUrl = '/api';

app.get('/', (req, res) => {
    res.send('This is root node');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(baseUrl, userRoutes);
app.use(baseUrl, classroomRoutes);
app.use(baseUrl, classroomMemberRoutes); 
app.use(baseUrl, classroomAdminRoutes);
app.use(baseUrl, classroomSubjectRoutes);
app.use(baseUrl, kanbanRoutes);
app.use(baseUrl, aaiRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;