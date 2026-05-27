import nodemailer from "nodemailer";
import { env } from "../env";
import { logger } from "@repo/logger";

export default class EmailService {
  public async sendEmail(to: string, subject: string, text: string) {
    if (!env.SMTP_PASS) {
      logger.warn("[EMAIL] Resend API key (SMTP_PASS) not configured, skipping email", { to, subject });
      return;
    }

    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.SMTP_PASS}`,
        },
        body: JSON.stringify({
          from: env.SMTP_FROM || "onboarding@resend.dev",
          to,
          subject,
          text,
        }),
      });

      if (!response.ok) {
        const errData = await response.text();
        throw new Error(`Resend API returned ${response.status}: ${errData}`);
      }

      logger.info("[EMAIL] Sent successfully", { to, subject });
    } catch (error) {
      logger.error("[EMAIL] Failed to send email via Resend API", { error, to, subject });
    }
  }

  public async sendFormPublishedEmail(to: string, formTitle: string, formUrl: string) {
    const subject = `Your form "${formTitle}" is now live!`;
    const text = `Congratulations!\n\nYour form "${formTitle}" has been successfully published and is ready to accept responses.\n\nYou can view and share it using this link:\n${formUrl}\n\nHappy collecting!\n- The Parcha Team`;
    return this.sendEmail(to, subject, text);
  }

  public async sendNewResponseEmail(to: string, formTitle: string, responseCount: number, formId: string) {
    const subject = `New response received for "${formTitle}"!`;
    const text = `Great news!\n\nA new respondent has just filled out your form "${formTitle}".\nThis form now has a total of ${responseCount} response(s).\n\nCheck out the results in your dashboard here:\n${env.FRONTEND_URL}/dashboard/builder/${formId}?view=analytics\n\n- The Parcha Team`;
    return this.sendEmail(to, subject, text);
  }

  public async sendRespondentConfirmationEmail(to: string, formTitle: string) {
    const subject = `Your response to "${formTitle}" was received!`;
    const text = `Hi there,\n\nWe just wanted to let you know that your response to the form "${formTitle}" has been successfully recorded.\n\nThank you!\n- The Parcha Team`;
    return this.sendEmail(to, subject, text);
  }
}
