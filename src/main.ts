import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log("LES VAR D ENV : ",process.env);
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
