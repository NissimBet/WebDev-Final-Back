import { app } from '.';
import { PORT } from './config';

// listen to port
app.listen(PORT, () => console.log(`App listening on ${PORT}`));
