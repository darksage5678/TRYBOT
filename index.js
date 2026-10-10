const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Render 헬스체크 및 UptimeRobot 확인용 엔드포인트
app.get('/', (req, res) => {
  res.send('Bot is running!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

require('dotenv').config();
const { 
    Client, 
    GatewayIntentBits, 
    PermissionFlagsBits 
} = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

client.on('ready', () => {
    console.log(`[ON] ${client.user.tag} 실행 완료`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content === '!전체삭제') {
        // 관리자 권한 체크
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply('❌ 권한이 없습니다.');
        }

        try {
            // 서버의 모든 채널과 카테고리를 최신 상태로 가져옴
            const fetchedChannels = await message.guild.channels.fetch();

            // 모든 채널 및 카테고리를 한 번에 삭제 요청
            await Promise.all(
                fetchedChannels.map(channel => channel?.delete().catch(() => {}))
            );
        } catch (error) {
            console.error('채널 삭제 중 오류 발생:', error);
        }
    }
});

client.login(process.env.TOKEN);