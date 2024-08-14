import cron from "node-cron";
import { reminderService } from "../services";
import { emailService } from "../services/email.service";
import { IWallet, ReminderEnums } from "../models";

cron.schedule("0 0 * * *", async () => {
  const data: Partial<IWallet[]> = await reminderService.getUsersWithDueBooks(
    ReminderEnums.DUE_DATE,
  );

  data.length > 0 &&
    data.forEach((i) => {
      emailService.sendEmail(
        i.user.email,
        "Upcoming Book Return Reminder",
        `Hi ${i.user.firstName}, your book: ${i.book.title} is due to be returned in 2 days. Please make sure to return it to the library on time.`,
        `<p>Hi ${i.user.firstName},</p><p>This is a friendly reminder that your book <strong>${i.book.title}</strong> is due to be returned in 2 days. Please make sure to return it to the library on time to avoid any late fees.</p>`,
      );
    });
});

cron.schedule("0 0 * * *", async () => {
  const data = await reminderService.getUsersWithDueBooks(
    ReminderEnums.LATE_RETURN,
  );

  data.forEach(async (i) => {
    emailService.sendEmail(
      i.user.email,
      "Overdue Book Reminder",
      `Hi ${i.user.firstName}, your book: ${i.book.title} was due 7 days ago. Please return it to the library immediately to avoid further penalties.`,
      `<p>Hi ${i.user.firstName},</p><p>We noticed that your book <strong>${i.book.title}</strong> was due 7 days ago. Please return it to the library immediately to avoid further penalties. If you need any assistance, please contact us.</p>`,
    );
  });
});
