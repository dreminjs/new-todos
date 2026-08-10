import { Module } from "@nestjs/common";
import { MailService } from "./mail.service.js";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/adapters/handlebars.adapter";
import { MailerModule } from "@nestjs-modules/mailer";
import { TokenModule } from "../token/token.module.js";
import { join } from "node:path";

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: process.env.APP_EMAIL,
          pass: process.env.APP_PASSWORD,
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
      template: {
        adapter: new HandlebarsAdapter(),
        dir: join("src", "views"),
        options: {
          strict: true,
        },
      },
    }),
    TokenModule,
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
