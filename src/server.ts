import { app } from '.';
import { PORT } from '../src/config';

// listen to port
app.listen(PORT, () => console.log(`App listening on ${PORT}`));
