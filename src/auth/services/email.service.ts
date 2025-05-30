import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const confirmUrl = `${process.env.EMAIL_DOMAIN}verify-email?token=${token}`;

    await this.transporter.sendMail({
      from: `"E-Commerce" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Підтвердження електронної пошти',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Підтвердіть свою пошту</h2>
          <p>Натисніть кнопку нижче, щоб завершити реєстрацію:</p>
          <a href="${confirmUrl}" style="display: inline-block; margin-top: 16px; padding: 12px 24px; background-color: #32AA71; color: white; text-decoration: none; border-radius: 6px;">
            Підтвердити email
          </a>
          <p style="margin-top: 20px; font-size: 13px; color: #888;">
            Якщо ви не реєструвались — просто ігноруйте цей лист.
          </p>
        </div>
      `,
    });
  }
}
