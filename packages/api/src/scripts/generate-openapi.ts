import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { writeFileSync } from "fs";
import { AppModule } from "../modules/app/app.module.js";
import * as yaml from "js-yaml";
async function generate() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const config = new DocumentBuilder()
    .setTitle("Nado API")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  writeFileSync("./openapi.yml", yaml.dump(document));

  await app.close();
  console.log("")
  process.exit(0);
}

generate();
