const { makeid } = require('./gen-id');
const express = require('express');
const fs = require('fs');
const path = require('path');
// Path Fix: Agar converter 'data' folder mein hai to './data/converter' use karein
const converter = require('./data/converter'); 
let router = express.Router();
const pino = require("pino");
const { default: makeWASocket, useMultiFileAuthState, delay, Browsers, makeCacheableSignalKeyStore, DisconnectReason } = require('@whiskeysockets/baileys');

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    async function GIFTED_MD_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
        try {
            var items = ["Safari"];
            function selectRandomItem(array) {
                var randomIndex = Math.floor(Math.random() * array.length);
                return array[randomIndex];
            }
            var randomItem = selectRandomItem(items);
            
            let sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                generateHighQualityLinkPreview: true,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                syncFullHistory: false,
                browser: Browsers.macOS(randomItem)
            });

            if (!sock.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await sock.requestPairingCode(num, "FEEMO0MD");
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            sock.ev.on('creds.update', saveCreds);
            sock.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;
                
                if (connection === "open") {
                    await delay(5000);
                    let rf = path.join(__dirname, 'temp', id, 'creds.json');

                    try {
                        const sessionData = fs.readFileSync(rf, 'utf-8');
                        const base64Encoded = Buffer.from(sessionData).toString('base64');
                        const prefixedSession = "FAHEEM-MD~" + base64Encoded;
                        
                        // 1. Send Session ID
                        await sock.sendMessage(sock.user.id, { text: prefixedSession });
                        await delay(2000);

                        // 2. Send Description Card
                        let desc = `*┏━━━━━━━━━━━━━━*
*┃FAHEEM-MD SESSION IS*
*┃SUCCESSFULLY*
*┃CONNECTED ✅🔥*
*┗━━━━━━━━━━━━━━━*
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*❶ || Creator = *FAHEEM-MD*
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*❷ || https://whatsapp.com/channel/0029VbBDkMV05MUnspQOhf1A
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*❸ || Owner =* https://wa.me/message/QC5FBBS4LBLII1
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*❹ || Repo =* https://github.com/feemo0/FAHEEM-MD
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
*ᴄʀᴇᴀᴛᴇᴅ ʙʏ ғᴀʜᴇᴇᴍ-ᴍᴅ ☘︎*`; 

                        await sock.sendMessage(sock.user.id, {
                            text: desc,
                            contextInfo: {
                                externalAdReply: {
                                    title: "FAHEEM-MD👨🏻‍💻",
                                    thumbnailUrl: "https://files.catbox.moe/snae53.jpg",
                                    sourceUrl: "https://whatsapp.com/channel/0029VbBDkMV05MUnspQOhf1A",
                                    mediaType: 1,
                                    renderLargerThumbnail: true
                                }  
                            }
                        });
                        await delay(2000);

                        // 3. Convert ring.mp3 to playable PTT (Voice Note)
                        const audioPath = path.join(__dirname, 'ring.mp3');
                        if (fs.existsSync(audioPath)) {
                            const buffer = fs.readFileSync(audioPath);
                            // 'toPTT' function ensures voice message is playable
                            const ptt = await converter.toPTT(buffer, 'mp3');

                            await sock.sendMessage(sock.user.id, {
                                audio: ptt,
                                mimetype: 'audio/ogg; codecs=opus',
                                ptt: true 
                            });
                        }

                        await sock.newsletterFollow("120363421775873396@newsletter");
                        
                    } catch (e) {
                        console.error("PTT Conversion Error:", e);
                    }

                    await delay(2000);
                    await sock.ws.close();
                    await removeFile('./temp/' + id);
                    process.exit();
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    await delay(10000);
                    GIFTED_MD_PAIR_CODE();
                }
            });
        } catch (err) {
            await removeFile('./temp/' + id);
        }
    }
    return await GIFTED_MD_PAIR_CODE();
});

module.exports = router;
