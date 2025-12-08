import { WasteRecord } from '../models/WasteRecord.js';
import { Reward } from '../models/Reward.js';
import axios from 'axios';
import pool from '../config/database.js';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Simple in-memory cache for tips: Map<userId, { tips: string[], expiresAt: number }>
const tipsCache = new Map();
let placeholderUrlWarned = false;

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.userId;

    // Get total waste
    const totalWaste = await WasteRecord.getTotalWasteByUser(userId);

    // Get waste by type
    const wasteByType = await WasteRecord.getWasteByTypeForUser(userId);

    // Get weekly progress
    const weeklyProgress = await WasteRecord.getWeeklyProgressForUser(userId);

    // Get rewards
    const reward = await Reward.findByUserId(userId);

    res.status(200).json({
      totalWaste: totalWaste || 0,
      wasteByType,
      weeklyProgress,
      reward: {
        points: reward?.points || 0,
        badge: reward?.badge || 'STARTER',
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAdminStats = async (req, res) => {
  try {
    // Get all waste records
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    
    const allRecords = await WasteRecord.getAll(limit, offset);

    // Get all rewards
    const allRewards = await Reward.getAllRewards();

    res.status(200).json({
      wasteRecords: allRecords,
      rewards: allRewards,
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const exportWasteCsv = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 1000;
    const records = await WasteRecord.getAll(limit, 0);

    let csv = 'Record ID,User,Entry Date,Waste Type,Quantity,Unit,Notes,Created At\n';

    records.forEach((record) => {
      csv += `${record.record_id},"${record.name}",${record.entry_date},${record.display_name},${record.quantity},${record.unit},"${record.notes || ''}",${record.created_at}\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename=waste_records.csv');
    res.send(csv);
  } catch (error) {
    console.error('Export CSV error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const generateTips = async (req, res) => {
  try {
    const userId = req.userId;

    // Serve from cache when available and not expired
    const cached = tipsCache.get(userId);
    if (cached && cached.expiresAt > Date.now()) {
      console.log(`GenerateTips: returning cached tips for user ${userId}`);
      return res.status(200).json({ tips: cached.tips });
    }

    // Fetch recent waste records for the user
    const records = await WasteRecord.findByUserId(userId, 50, 0);

    // Build a detailed summary (date, type, qty, unit, notes) to send to the AI
    const summaryLines = records.map((r) => {
      const date = r.entry_date || r.created_at || 'unknown-date';
      const notes = r.notes ? ` - notes: ${r.notes}` : '';
      return `${date} — ${r.display_name} — ${r.quantity} ${r.unit || ''}${notes}`;
    });
    const summary = summaryLines.slice(0, 50).join('\n');

    const prompt = `You are an eco-coach. Below are the user's recent waste entries (date — type — quantity unit — optional notes). Using only the data provided, generate 2 to 4 concise, actionable tips (each 1 short sentence) tailored to this user's habits. Keep tips friendly, practical, and focused on reducing waste. Return plain text tips separated by line breaks.\n\nUser waste entries:\n${summary}`;

    console.log(`GenerateTips: sending ${records.length} records to AI (summary length ${summaryLines.length})`);

    const apiKey = process.env.GEMINI_API_KEY;
    const apiUrl = process.env.GEMINI_API_URL; // e.g. https://api.example.com/v1/generate

    let tipsText = null;

    // Prefer an explicit GEMINI_API_URL if provided and not a placeholder
    // const     = apiUrl // && /example\.com|placeholder/i.test(apiUrl);

    if (apiKey) {
      // First try using the official Google Generative AI client if available
      try {
        try {
          const client = new GoogleGenerativeAI(apiKey);
          const modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
          const model = client.getGenerativeModel({ model: modelName });

          const result = await model.generateContent(prompt);
          // Some client versions return a promise or object with response()
          const responseObj = result?.response || result;
          // normalize and extract text
          let text = null;
          if (responseObj?.text) {
            text = typeof responseObj.text === 'function' ? await responseObj.text() : responseObj.text;
          } else if (responseObj?.response) {
            const r = await responseObj.response;
            if (r?.text) text = typeof r.text === 'function' ? await r.text() : r.text;
          } else if (result?.response) {
            const r = await result.response;
            if (r?.text) text = typeof r.text === 'function' ? await r.text() : r.text;
          }

          if (text) {
            tipsText = text;
          } else if (typeof result === 'string') {
            tipsText = result;
          }
        } catch (clientErr) {
          console.warn('GoogleGenerativeAI client failed, falling back to REST axios call:', clientErr?.message || clientErr);
          // Fallback to REST approach below
          let response = null;
          if (apiUrl) {
            response = await axios.post(
              apiUrl,
              { prompt, max_tokens: 200 },
              {
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                  'Content-Type': 'application/json',
                },
                timeout: 15000,
              }
            );
          } else {
            const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
            const googleUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
            const body = {
              contents: [
                {
                  parts: [
                    {
                      text: prompt,
                    },
                  ],
                },
              ],
              temperature: 0.2,
              maxOutputTokens: 200,
            };
            response = await axios.post(googleUrl, body, {
              headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': apiKey,
              },
              timeout: 15000,
            });
          }

          const d = response?.data || {};
          tipsText =
            d?.candidates?.[0]?.content?.map((c) => (c?.parts || []).map((p) => p.text).join('\n')).join('\n') ||
            d?.candidates?.[0]?.output?.map((o) => o?.content?.map((c) => c?.parts?.map((p) => p.text).join('')).join('\n')).join('\n') ||
            d?.outputs?.[0]?.content?.[0]?.text ||
            d?.text ||
            d?.output ||
            d?.choices?.[0]?.text ||
            null;
        }
      } catch (error_) {
        console.error('AI request failed:', error_?.response?.data || error_.message || error_);
        // Continue to local fallback
        tipsText = null;
      }
    } else if (apiUrl && isPlaceholderUrl) {
      // Warn only once to avoid log spam
      if (!placeholderUrlWarned) {
        console.warn('GEMINI_API_URL appears to be a placeholder; skipping external AI call and using local fallback.');
        placeholderUrlWarned = true;
      }
    }

    // Fallback: generate simple tips locally if AI not configured or failed
    if (!tipsText) {
      // Build a simple heuristic: tally by display_name
      const tally = {};
      records.forEach((r) => {
        const key = r.display_name || 'Other';
        tally[key] = (tally[key] || 0) + Number(r.quantity || 0);
      });

      const top = Object.entries(tally).sort((a, b) => b[1] - a[1])[0];
      const tips = [];
      if (top) {
        const [topType, topQty] = top;
        if (/food/i.test(topType)) {
          tips.push('Start a small compost bin or join a community compost to reduce food waste.');
          tips.push('Plan meals and freeze leftovers to avoid spoilage.');
        } else if (/plastic|bottle|container/i.test(topType)) {
          tips.push('Carry a reusable bottle and shopping bag to avoid single-use plastics.');
          tips.push('Choose products with minimal plastic packaging or buy in bulk.');
        } else if (/paper|cardboard/i.test(topType)) {
          tips.push('Switch to reusable cloth or eco-friendly alternatives where possible.');
          tips.push('Recycle clean paper and cardboard and reduce unnecessary printing.');
        } else {
          tips.push('Aim to reduce single-use items and replace them with reusable alternatives.');
          tips.push('Buy in bulk and prioritize products with minimal packaging.');
        }
      } else {
        tips.push('Log a few waste entries first so we can give personalized tips.');
        tips.push('Try tracking one category (e.g., food) for a week to identify reduction opportunities.');
      }

      tipsText = tips.join('\n');
    }

    // Normalize into an array of short tip strings
    const tipsArray = tipsText
      .split(/\r?\n/) // split by lines
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 4);

    // Cache tips for 1 hour to avoid repeated AI calls and log spam
    const ttlMs = 1000 * 60 * 60; // 1 hour
    tipsCache.set(userId, { tips: tipsArray, expiresAt: Date.now() + ttlMs });

    res.status(200).json({ tips: tipsArray });
  } catch (error) {
    console.error('Generate tips error:', error);
    res.status(500).json({ error: 'Failed to generate tips' });
  }
};
