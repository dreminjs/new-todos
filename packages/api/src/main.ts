import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app/app.module.js";
import fastifyCookie from "@fastify/cookie";
import fastifyView from "@fastify/view";
import handlebars from "handlebars";
import { IoAdapter } from "@nestjs/platform-socket.io";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { fileURLToPath } from "url";
import path from "path";
import { ZodExceptionFilter } from "./filters/zod-exception.filter.js";
import { ZodValidationPipe } from "nestjs-zod";
import { writeFileSync } from "fs";
import * as yaml from "js-yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const config = new DocumentBuilder()
  .setTitle("Todos API")
  .setDescription("The Todos API description")
  .setVersion("1.0")
  .addTag("todos")
  .build();

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api", app, documentFactory);
  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
  });
  await app.register(fastifyView, {
    engine: { handlebars },
    root: path.join(__dirname, "views"),
  });

  app.useWebSocketAdapter(new IoAdapter(app));

  app.enableCors({
    origin: ["http://localhost:5173"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: "Content-Type, Accept",
  });

  app.useGlobalFilters(new ZodExceptionFilter());
  app.useGlobalPipes(new ZodValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
