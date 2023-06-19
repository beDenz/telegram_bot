import { Telegraf, Markup } from 'telegraf';

import { config } from 'dotenv'
import { message } from 'telegraf/filters';
import { GoogleSpreadsheet } from 'google-spreadsheet';

config({ path: `.env.local` })

// @ts-ignore
const bot = new Telegraf(process.env.TELEGRAM_API_TOKEN);

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID);
await doc.useServiceAccountAuth({
  client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
  private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n')
})


bot.start(async (ctx) => {
  ctx.reply('Welcome');
  // await doc.loadInfo();
  // const sheet = doc.sheetsByIndex[0];
  // const rows = await sheet.getRows();
});

bot.hears('hi', async (ctx) => {
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  await sheet.loadCells(['B2', 'B1']);
  const a1 = sheet.getCellByA1('B2');
  const b1 = sheet.getCellByA1('B1');

  const message = a1.value.toString().replace('{{username}}', ctx.message.from.first_name || '');

  await ctx.replyWithPhoto({ url: b1.value.toString() });
  ctx.reply(message);

  // ctx.reply(
	// 	"Keyboard wrap",
	// 	Markup.keyboard(["one", "two", "three", "four", "five", "six"], {
	// 		wrap: (btn, index, currentRow) => currentRow.length >= (index + 1) / 2,
	// 	}),
	// );
});


bot.help((ctx) => ctx.reply('Send me a sticker'));

bot.on(message('sticker'), (ctx) => ctx.reply('👍'));

bot.hears('hi', (ctx) => ctx.reply('Hey there'));

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));