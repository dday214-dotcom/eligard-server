require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `당신은 엘리가드(Eligard) 전문 AI 어시스턴트입니다. 의료 전문가 대상으로 한국어로 답변하세요. 처방은 반드시 전문의와 상담 강조.`;

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages
    });
    res.json({ reply: response.content[0].text });
  } catch (err) {
    res.status(500).json({ error: '오류가 발생했습니다.' });
  }
});

app.get('/health', (req, res) => res.json({ status: 'OK' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ 서버 실행 중: http://localhost:${PORT}`));
