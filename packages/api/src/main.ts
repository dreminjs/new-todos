import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app/app.module.js";
import fastifyCookie from "@fastify/cookie";
import fastifyView from "@fastify/view";
import fastifyMultipart from "@fastify/multipart";
import handlebars from "handlebars";
import {
  FastifyAdapter,
 type NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { fileURLToPath } from "url";
import path from "path";
import { ZodExceptionFilter } from "./filters/zod-exception.filter.js";
import { ZodValidationPipe } from "nestjs-zod";
import { RedisIoAdapter } from "./modules/infra/redis/redis-io.adapter.js";
import { getAllowedOrigins } from "./scripts/get-allowed-origins.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  if (process.env.ENABLE_SWAGGER === "true") {
    const config = new DocumentBuilder()
      .setTitle("Todos API")
      .setDescription("The Todos API description")
      .setVersion("1.0")
      .addTag("todos")
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, documentFactory);
  }

  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET,
  });
  await app.register(fastifyMultipart);
  await app.register(fastifyView, {
    engine: { handlebars },
    root: path.join(__dirname, "views"),
  });

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();

  app.useWebSocketAdapter(redisIoAdapter);

  app.enableCors({
    origin: getAllowedOrigins(),
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: "Content-Type, Accept",
  });

  app.useGlobalFilters(new ZodExceptionFilter());
  app.useGlobalPipes(new ZodValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
