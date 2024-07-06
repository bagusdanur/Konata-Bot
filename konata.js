const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, MessageType, Mimetype, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType, downloadMediaMessage } = require("@whiskeysockets/baileys");
const fs = require("fs");
const util = require("util");
const chalk = require("chalk");
const OpenAI = require("openai");
let setting = require("./key.json");
const openai = new OpenAI({ apiKey: setting.keyopenai });
const axios = require("axios");
const cheerio = require('cheerio');
const { google } = require('googleapis');
const donet = "https://trakteer.id/kanimenia17";



// Konfigurasi kunci API Google Custom Search
const customSearch = google.customsearch('v1');
const googleApiKey = setting.googleApiKey;
const searchEngineId = setting.searchEngineId;
const apiKeyAll = setting.apiKeyAll;
const apiCaliKey = setting.apiCaliKey;


module.exports = konata = async (client, m, chatUpdate) => {
  try {
    var body =
      m.mtype === "conversation"
        ? m.message.conversation
        : m.mtype == "imageMessage"
          ? m.message.imageMessage.caption
          : m.mtype == "videoMessage"
            ? m.message.videoMessage.caption
            : m.mtype == "extendedTextMessage"
              ? m.message.extendedTextMessage.text
              : m.mtype == "buttonsResponseMessage"
                ? m.message.buttonsResponseMessage.selectedButtonId
                : m.mtype == "listResponseMessage"
                  ? m.message.listResponseMessage.singleSelectReply.selectedRowId
                  : m.mtype == "templateButtonReplyMessage"
                    ? m.message.templateButtonReplyMessage.selectedId
                    : m.mtype === "messageContextInfo"
                      ? m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text
                      : "";
    var budy = typeof m.text == "string" ? m.text : "";
    // var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/"
    var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/";
    const isCmd2 = body.startsWith(prefix);
    const command = body.replace(prefix, "").trim().split(/ +/).shift().toLowerCase();
    const args = body.trim().split(/ +/).slice(1);
    const pushname = m.pushName || "No Name";
    const botNumber = await client.decodeJid(client.user.id);
    const itsMe = m.sender == botNumber ? true : false;
    let text = (q = args.join(" "));
    const arg = budy.trim().substring(budy.indexOf(" ") + 1);
    const arg1 = arg.trim().substring(arg.indexOf(" ") + 1);

    const from = m.chat;
    const reply = m.reply;
    const sender = m.sender;
    const mek = chatUpdate.messages[0];



    const color = (text, color) => {
      return !color ? chalk.green(text) : chalk.keyword(color)(text);
    };

    // Group
    const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch((e) => { }) : "";
    const groupName = m.isGroup ? groupMetadata.subject : "";

    // Push Message To Console
    let argsLog = budy.length > 30 ? `${q.substring(0, 30)}...` : budy;

    if (isCmd2 && !m.isGroup) {
      console.log(chalk.black(chalk.bgWhite("[ LOGS ]")), color(argsLog, "turquoise"), chalk.magenta("From"), chalk.green(pushname), chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`));
    } else if (isCmd2 && m.isGroup) {
      console.log(
        chalk.black(chalk.bgWhite("[ LOGS ]")),
        color(argsLog, "turquoise"),
        chalk.magenta("From"),
        chalk.green(pushname),
        chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`),
        chalk.blueBright("IN"),
        chalk.green(groupName)
      );
    }

    if (isCmd2) {
      switch (command) {
        case "menu":
          // Dapatkan nama pengguna WA
          const userName = pushname || "Pengguna";

          // URL gambar menu Anda
          const menuImagePath = 'images/banner.jpg';

          // Pesan yang berisi nama pengguna dan menu
          const message =
            `
    *[ INFORMASI KAMU 👤 ]*

*❏ ✒️Nama*: ${userName}
    
🌸-------------------------------------------🌸

    *[ AI CHAT 🤖 ]*

*❏ Command*: /konata
*❏ Info*: Tanyakan apa saja kepada AI.
*❏ Penggunaan*: Silahkan ketik:

- /konata <Ketik Apapun>

*❏ Command*: /konatav2
*❏ Info*: Tanyakan apa saja kepada AI.
*❏ Penggunaan*: Silahkan ketik:

- /konatav2 <Ketik Apapun>

*❏ Command*: /bard
*❏ Info*: Tanyakan apa saja kepada AI.
*❏ Penggunaan*: Silahkan ketik:

- /bard <Ketik Apapun>
 
🌸-------------------------------------------🌸
     
    *[ MENU ANIME 🎬 ]*

*❏ Command*: /anime
*❏ Info*: Memunculkan Detail Anime sesuai yang di cari
*❏ Penggunaan*: Silahkan ketik:

- /anime <Kakegurui>

*❏ Command*: /karakter
*❏ Info*: Memunculkan karakter sesuai yang di cari
*❏ Penggunaan*: Silahkan ketik:
  
- /karakter <Naruto>

🌸-------------------------------------------🌸
     
    *[ GAMES 🎮 ]*

*❏ Command*: /tebakanime
*❏ Info*: game Tebak anime /tebakanime untuk memunculkan gambar /tebakanime <jawaban> untuk mengjawab /tebakanime-help untuk bantuan
*❏ Penggunaan*: Silahkan ketik:

- /tebakanime (Mendapatkan Soal)
- /tebakanime <jawaban> Untuk Menjawab
- /tebakanime-help untuk mendapatkan bantuan

🌸-------------------------------------------🌸
     
    *[ MUSIC 🎵 ]*

*❏ Command*: /spotify
*❏ Info*: MEncari Lagu Sesaui Ketikan mu
*❏ Penggunaan*: Silahkan ketik:
    
- /spotify <Play Date>

🌸-------------------------------------------🌸
     
  *[ MENU GAMBAR 🖼️ ]*

*❏ Command*: /gambar
*❏ Info*: Memunculkan Gambar sesuai yang Kamu Cari
*❏ Penggunaan*: Silahkan ketik:

- /Gambar <Pemandangan>

*❏ Command*: /gambarv2
*❏ Info*: Memunculkan Gambar sesuai yang Kamu Cari
*❏ Penggunaan*: Silahkan ketik:

- /Gambarv2 <Pemandangan>

*❏ Command*: /pinterest
*❏ Info*: Memunculkan Gambar Dari Pinterest
*❏ Penggunaan*: Silahkan ketik:

- /pinterest <Anime>

*❏ Command*: /wallpaper
*❏ Info*: Memunculkan Gambar Wallpaper
*❏ Penggunaan*: Silahkan ketik:

- /wallpaper <Anime HD>

🌸-------------------------------------------🌸

   *[ TOOLS 🛠️ ]*

*❏ Command*: /translate
*❏ Info*: Mencari Lagu Sesaui Keinginan mu Dan Preview 30 Detik
*❏ Penggunaan*: Silahkan ketik:

- /translate My Name Is mikasa

*❏ Command*: /kata-ke-suara
*❏ Info*: Mencari Lagu Sesaui Keinginan mu Dan Preview 30 Detik
*❏ Penggunaan*: Silahkan ketik:

- /kata-ke-suara Halo Namaku Cayy

🌸-------------------------------------------🌸

   *[ DOWNLOAD 📥 ]*

*❏ Command*: /tiktok
*❏ Info*: Download Video Tiktok Tanpa Watermark
*❏ Penggunaan*: Silahkan ketik:

- /tiktok <Link Video Tiktok>

*❏ Command*: /youtube
*❏ Info*: Download Video youtube 
*❏ Penggunaan*: Silahkan ketik:

- /youtube <Link Video youtube>

🌸-------------------------------------------🌸

   *[ DONATE CREATOR 📥 ]*

Buat Yang Mau Donasi :)

*❏ Trakteer*: ${donet}

        `;

          const imageBuffer = fs.readFileSync(menuImagePath);
          client.sendImage(from, imageBuffer, message, mek);
          break;

        case "konata":
          try {
            // tidak perlu diisi apikeynya disini, karena sudah diisi di file key.json
            if (setting.keyopenai === "ISI_APIKEY_OPENAI_DISINI") return reply("Apikey belum diisi\n\nSilahkan isi terlebih dahulu apikeynya di file key.json\n\nApikeynya bisa dibuat di website: https://beta.openai.com/account/api-keys");
            if (!text) return reply(`Chat dengan AI.\n\nContoh:\n${prefix}${command} Apa itu resesi`);
            const chatCompletion = await openai.chat.completions.create({
              messages: [{ role: 'user', content: q }],
              model: 'gpt-3.5-turbo'
            });

            await m.reply(chatCompletion.choices[0].message.content);
          } catch (error) {
            if (error.response) {
              console.log(error.response.status);
              console.log(error.response.data);
            } else {
              console.log(error);
              m.reply("Maaf, sepertinya ada yang error :" + error.message);
            }
          }
          break;
        case "konatav2":
          try {
            if (!text) return reply(`Mencari wallpaper .\n\nContoh:\n${prefix}${command} Jabami Yumeko`);

            // Lakukan permintaan ke endpoint API untuk mencari wallpaper
            const response = await axios.get(`https://daniapi.biz.id/api/artificial-intelligence/chatgpt-4?api_key=${apiKeyAll}&question=${encodeURIComponent(text)}`);
            const data = response.data.data.answer;

            if (data) {
              reply(data)
            } else {
              reply("Maaf, gambar tidak ditemukan.");
            }
          } catch (error) {
            console.log(error);
            reply("Maaf, terjadi kesalahan dalam memproses permintaan.");
          }
          break;
        case "bard":
          try {
            if (!text) return reply(`Mencari wallpaper .\n\nContoh:\n${prefix}${command} Jabami Yumeko`);

            // Lakukan permintaan ke endpoint API untuk mencari wallpaper
            const response = await axios.get(`https://daniapi.biz.id/api/artificial-intelligence/bard?api_key=${apiKeyAll}&question=${encodeURIComponent(text)}`);
            const data = response.data.data.answer;

            if (data) {
              reply(data)
            } else {
              reply("Maaf, gambar tidak ditemukan.");
            }
          } catch (error) {
            console.log(error);
            reply("Maaf, terjadi kesalahan dalam memproses permintaan.");
          }
          break;
        case "anime":
          try {
            if (!text) return reply(`Mencari detail anime.\n\nContoh:\n${prefix}${command} Naruto`);
            const response = await axios.get(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(text)}&limit=1`);
            if (response.data.data && response.data.data.length > 0) {
              const anime = response.data.data[0];
              const message = `
Title: ${anime.title}
Type: ${anime.type}
Episode: ${anime.episodes}
Score: ${anime.score}
Mal: ${anime.url}
                    `;
              // Mengirimkan pesan teks dan gambar ke pengguna
              client.sendImage(from, anime.images.jpg.image_url, message, mek);
            } else {
              reply("Maaf, anime tidak ditemukan.");
            }
          } catch (error) {
            console.log(error);
            reply("Maaf, terjadi kesalahan dalam memproses permintaan.");
          }
          break;
        case "karakter":
          try {
            if (!text) return reply(`Mencari gambar karakter anime.\n\nContoh:\n${prefix}${command} Jabami Yumeko`);
            const response = await axios.get(`https://kitsu.io/api/edge/characters?filter[name]=${encodeURIComponent(text)}`);
            if (response.data.data && response.data.data.length > 0) {
              const character = response.data.data[0];
              if (character.attributes.image) {
                client.sendImage(from, character.attributes.image.original, character.attributes.slug, mek);
              } else {
                reply("Maaf, gambar karakter tidak ditemukan.");
              }
            } else {
              reply("Maaf, karakter anime tidak ditemukan.");
            }
          } catch (error) {
            console.log(error);
            reply("Maaf, terjadi kesalahan dalam memproses permintaan.");
          }
          break;
        case "gambar":
          try {
            if (!text) return reply(`Mencari gambar.\n\nContoh:\n${prefix}${command} Anime Naruto`);

            // Melakukan pencarian gambar dengan kata kunci menggunakan Google Custom Search
            const response = await customSearch.cse.list({
              auth: googleApiKey,
              cx: searchEngineId,
              q: text,
              searchType: 'image'
            });

            // Mengambil semua URL gambar dari hasil pencarian
            const images = response.data.items.map(item => item.link);

            // Memilih URL gambar secara acak
            const randomImage = images[Math.floor(Math.random() * images.length)];

            // Kirim gambar yang dipilih secara acak ke pengguna
            if (randomImage) {
              client.sendImage(from, randomImage, 'Ini gambar yang ditemukan:  ', mek);
            } else {
              reply("Maaf, gambar tidak ditemukan.");
            }
          } catch (error) {
            console.log(error);
            reply("Maaf, Limit Harian Sudah Habis (100x Per hari).");
          }
          break;
        case "pinterest":
          try {
            if (!text) return reply(`Mencari gambar pinterest.\n\nContoh:\n${prefix}${command} Jabami Yumeko`);

            // Lakukan permintaan ke endpoint API untuk mengunduh video dari YouTube
            const response = await axios.get(`https://daniapi.biz.id/api/searcher/pinterest?api_key=${apiKeyAll}&pint_search=${encodeURIComponent(text)}`);
            const imageResponse = response.data.data;
            const randomImage = imageResponse[Math.floor(Math.random() * imageResponse.length)];
            if (randomImage) {
              // Kirim tautan unduhan video ke pengguna
              client.sendImage(from, randomImage, 'Ini gambar yang ditemukan:  ', mek);
            } else {
              reply("Maaf, gambar tidak ditemukan.");
            }
          } catch (error) {
            console.log(error);
            reply("Maaf, terjadi kesalahan dalam memproses permintaan.");
          }
          break;
          case "pinterestv2":
          try {
            if (!text) return reply(`Mencari gambar pinterest.\n\nContoh:\n${prefix}${command} Jabami Yumeko`);

            // Lakukan permintaan ke endpoint API untuk mengunduh video dari YouTube
            const response = await axios.get(`https://api.caliph.biz.id/api/pinterestSearch?q=${encodeURIComponent(text)}&apikey=${apiCaliKey}`);
            const imageResponse = response.data.result;
            const randomImage = imageResponse[Math.floor(Math.random() * imageResponse.length)];
            if (randomImage) {
              // Kirim tautan unduhan video ke pengguna
              client.sendImage(from, randomImage.image, 'Ini gambar yang ditemukan:  ', mek);
            } else {
              reply("Maaf, gambar tidak ditemukan.");
            }
          } catch (error) {
            console.log(error);
            reply("Maaf, terjadi kesalahan dalam memproses permintaan.");
          }
          break;
        case "wallpaper":
          try {
            if (!text) return reply(`Mencari wallpaper .\n\nContoh:\n${prefix}${command} Jabami Yumeko`);

            // Lakukan permintaan ke endpoint API untuk mencari wallpaper
            const response = await axios.get(`https://daniapi.biz.id/api/searcher/wallpaper?api_key=${apiKeyAll}&wallpaper_name=${encodeURIComponent(text)}`);
            const data = response.data.data;

            if (data.length > 0) {
              // Ambil gambar secara acak dari data yang diterima
              const randomImage = data[Math.floor(Math.random() * data.length)];

              // Kirim gambar yang dipilih ke pengguna
              client.sendImage(from, randomImage.image, `Ini Type : ${randomImage.type} `, mek);
            } else {
              reply("Maaf, gambar tidak ditemukan.");
            }
          } catch (error) {
            console.log(error);
            reply("Maaf, terjadi kesalahan dalam memproses permintaan.");
          }
          break;
        case "gambarv2":
          try {
            if (!text) return reply(`Mencari wallpaper .\n\nContoh:\n${prefix}${command} Jabami Yumeko`);

            // Lakukan permintaan ke endpoint API untuk mencari wallpaper
            const response = await axios.get(`https://daniapi.biz.id/api/searcher/google-image?api_key=${apiKeyAll}&gi_search=${encodeURIComponent(text)}`);
            const data = response.data.data;

            if (data.length > 0) {
              // Ambil gambar secara acak dari data yang diterima
              const randomImage = data[Math.floor(Math.random() * data.length)];

              // Kirim gambar yang dipilih ke pengguna
              client.sendImage(from, randomImage, 'Ini gambar yang ditemukan:  ', mek);
            } else {
              reply("Maaf, gambar tidak ditemukan.");
            }
          } catch (error) {
            console.log(error);
            reply("Maaf, terjadi kesalahan dalam memproses permintaan.");
          }
          break;
        case "tiktok":
          try {
            if (!text) return reply(`Mengunduh video TikTok tanpa watermark.\n\nContoh:\n${prefix}${command} https://www.tiktok.com/@username/video/1234567890123456789`);

            // Lakukan scraping pada halaman TikTok untuk mendapatkan tautan video tanpa watermark
            const response = await axios.get(`https://videodownloader.so/download?v=${encodeURIComponent(text)}`);
            const $ = cheerio.load(response.data);
            const videoLink = $('a.downloadBtn.popbtn').attr('href');
            const titleVideo = $('span.title').text();


            if (videoLink) {
              // Kirim tautan video tanpa watermark ke pengguna
              reply(`
   *[ DOWNLOAD VIDEO TIKTOK 📥 ]*

*Caption*: ${titleVideo}

*Cara Download Klik Titik 3 Di bawah Kanan!!*

Klik link berikut untuk mengunduh video TikTok tanpa watermark:\n\n${videoLink}    `);
            } else {
              reply("Maaf, tidak dapat mengunduh video TikTok.");
            }
          } catch (error) {
            console.log(error);
            reply("Maaf, terjadi kesalahan dalam memproses permintaan.");
          }
          break;
        case "youtube":

          if (!text) return reply(`Mengunduh video dari YouTube.\n\nContoh:\n${prefix}${command} https://www.youtube.com/watch?v=VIDEO_ID`);

          // Lakukan permintaan ke endpoint API untuk mengunduh video dari YouTube
          const response = await axios.get(`https://daniapi.biz.id/api/downloader/youtube-video?api_key=sk-oqaq01pr48ho3kv03&video_url=${encodeURIComponent(text)}`);
          const downloadLink = response.data.data.url;
          const title = response.data.data.title
          const thumb = response.data.data.thumb

          // Kirim tautan unduhan video ke pengguna
          const commt = `
  *[ DOWNLOAD YOUTUBE 📥 ]*

*Title*: ${title}

Klik link berikut untuk mengunduh video Youtube :\n\n${downloadLink} 
              `;

          client.sendImage(from, thumb, commt, mek);
          break;
        case "tebakanime":
          try {
            if (!args[0]) {
              // Jika tidak ada argumen, mulai permainan baru
              const response = await axios.get(`https://api.caliph.biz.id/api/tebakanime?apikey=f2608287ef207521`);
              tebakanimeData = response.data;

              // Kirim gambar tebakan anime beserta bantuan ke pengguna
              client.sendImage(from, tebakanimeData.img, `❏ 🤔 Siapakah karakter anime ini?\n\n❏ 🌟 Jika kesulitan, gunakan /tebakanime-help untuk mendapatkan bantuan\n\n❏ ✒️ Kirim jawaban dengan format /tebakanime <jawaban>`, mek);
            } else {
              // Memeriksa apakah pengguna memberikan jawaban
              const jawaban = args.join(" ").trim();

              // Memeriksa apakah data tebakan anime sudah tersedia
              if (!tebakanimeData) return reply("Permainan tebakan anime belum dimulai. Silakan gunakan /tebakanime untuk memulai permainan.");

              // Memeriksa jawaban pengguna
              if (jawaban.toLowerCase() === tebakanimeData.nama.toLowerCase()) {
                reply("Selamat! Jawaban kamu benar!✅");
                tebakanimeData = null; // Menghapus data tebakan anime setelah permainan selesai
              } else {
                reply("Maaf, jawaban kamu salah. Coba lagi!❌");
              }
            }
          } catch (error) {
            console.log(error);
            reply("Maaf, terjadi kesalahan dalam memproses permintaan.");
          }
          break;

        case "tebakanime-help":
          try {
            // Kirim bantuan tebakan anime ke pengguna
            reply(`Ini adalah bantuan untuk tebakan Karakter:\n${tebakanimeData.bantuan}\n\nJika masih kesulitan, coba lagi atau gunakan /tebakanime untuk mendapatkan gambar lainnya.`);
          } catch (error) {
            console.log(error);
            reply("Maaf, terjadi kesalahan dalam memproses permintaan.");
          }
          break;

        case "tebakanime-next":
          try {
            // Jika data tebakan anime sudah ada, hapus data tersebut untuk mendapatkan pertanyaan baru
            if (tebakanimeData) {
              tebakanimeData = null;
            }

            // Mulai permainan baru dengan mengambil gambar tebakan anime baru
            const response = await axios.get('https://api.caliph.biz.id/api/tebakanime?apikey=f2608287ef207521');
            tebakanimeData = response.data;

            // Kirim gambar tebakan anime beserta bantuan ke pengguna
            client.sendImage(from, tebakanimeData.img, `❏ 🤔 Siapakah karakter anime ini?\n\n❏ 🌟 Jika kesulitan, gunakan /tebakanime-help untuk mendapatkan bantuan\n\n❏ ✒️ Kirim jawaban dengan format /tebakanime jawaban <jawaban>`, mek);
          } catch (error) {
            console.log(error);
            reply("Maaf, terjadi kesalahan dalam memproses permintaan.");
          }
          break;
        case "spotify":
          try {
            if (!text) return reply(`Mencari lagu di Spotify.\n\nContoh:\n${prefix}${command} Play Date`);

            // Lakukan permintaan ke endpoint API untuk mencari lagu di Spotify
            const response = await axios.get(`https://api.caliph.biz.id/api/search/spotify?query=${encodeURIComponent(text)}&apikey=${apiCaliKey}`);
            const songs = response.data.result;

            if (songs.length > 0) {
              // Ambil data lagu pertama dari hasil pencarian
              const song = songs[0];

              // Kirim informasi lagu ke pengguna
              const message = `
*Title*: ${song.title}
*Artist*: ${song.artist}
*Album*: ${song.album}
*URL*: ${song.url}
                `;

              // Kirim thumbnail dan informasi lagu sebagai pesan
              await client.sendImage(from, song.thumbnail, message, mek);

              // Cek apakah pratinjau MP3 tersedia
              if (song.preview_mp3) {
                // Kirim file suara lagu ke pengguna menggunakan sendAudio
                await client.sendAudio(from, song.preview_mp3, `Ini pratinjau lagunya: ${song.title}`);
              } else {

              }
            } else {
              reply("Maaf, lagu tidak ditemukan.");
            }
          } catch (error) {
            console.log(error);
            reply("Maaf, terjadi kesalahan dalam memproses permintaan.");
          }
          break;
          
        case "translate":
          try {
            if (!text) return reply(`Translate Bahasa Inggris .\n\nContoh:\n${prefix}${command} my name is Mikasa`);

            // Lakukan permintaan ke endpoint API untuk melakukan terjemahan
            const response = await axios.get(`https://daniapi.biz.id/api/tools/translate?api_key=${apiKeyAll}&language=id&text=${encodeURIComponent(text)}`);
            const translatedText = response.data.data.translated_text;

            if (translatedText) {
              // Kirim teks terjemahan ke pengguna
              reply(translatedText);
            } else {
              reply("Maaf, terjemahan tidak tersedia.");
            }
          } catch (error) {
            console.log(error);
            reply("Maaf, terjadi kesalahan dalam memproses permintaan.");
          }
          break;
          case "kata-ke-suara":
            try {
              if (!text) return reply(`Konversi teks menjadi suara.\n\nContoh:\n${prefix}${command} Halo, dunia`);
              
              // Lakukan permintaan ke endpoint API untuk mengonversi teks ke suara
              const response = await axios.get(`https://daniapi.biz.id/api/converter/text-to-speech?api_key=sk-oqaq01pr48ho3kv03&language=id-ID&text=${encodeURIComponent(text)}`);
              const audioURL = response.data.data.audio_url;
              
              if (audioURL) {
                // Kirim audio yang telah dikonversi ke pengguna
                await client.sendAudio(from, audioURL);
              } else {
                reply("Maaf, tidak dapat melakukan konversi teks ke suara.");
              }
            } catch (error) {
              console.log(error);
              reply("Maaf, terjadi kesalahan dalam memproses permintaan.");
            }
            break;
        default: {
          if (isCmd2 && budy.toLowerCase() != undefined) {
            if (m.chat.endsWith("broadcast")) return;
            if (m.isBaileys) return;
            if (!budy.toLowerCase()) return;
            if (argsLog || (isCmd2 && !m.isGroup)) {
              // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
              console.log(chalk.black(chalk.bgRed("[ ERROR ]")), color("command", "turquoise"), color(`${prefix}${command}`, "turquoise"), color("tidak tersedia", "turquoise"));
            } else if (argsLog || (isCmd2 && m.isGroup)) {
              // client.sendReadReceipt(m.chat, m.sender, [m.key.id])
              console.log(chalk.black(chalk.bgRed("[ ERROR ]")), color("command", "turquoise"), color(`${prefix}${command}`, "turquoise"), color("tidak tersedia", "turquoise"));
            }
          }
        }
      }
    }
  } catch (err) {
    m.reply(util.format(err));
  }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update ${__filename}`));
  delete require.cache[file];
  require(file);
});
