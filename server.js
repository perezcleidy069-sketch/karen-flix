import 'dotenv/config';
import app from './src/app.js';

const port = Number(process.env.PORT || process.env.SERVER_PORT || 3000);
app.listen(port, () => {
    console.log(`Karen Flix API escuchando en el puerto ${port}`);
});
