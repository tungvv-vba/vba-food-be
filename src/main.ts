import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { join } from "path";
import { AppModule } from "./app.module";
import { PORT } from "./constants";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, "..", "uploads"));
  app.enableCors();
  app.useGlobalPipes();
  const config = new DocumentBuilder()
    .setTitle("VBA API Documentation")
    .setDescription("API description")
    .setVersion("1.0")
    .addTag("API")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  await app.listen(PORT);
}

bootstrap();
