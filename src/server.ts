import { app } from './app';

app.listen(process.env.PORT, () => {
  console.log(`Server is running in ${process.env.PORT} PORT...`);
});