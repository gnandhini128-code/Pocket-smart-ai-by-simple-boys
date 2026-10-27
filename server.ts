import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

// Server-side Gemini initialization with required User-Agent
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY' && !apiKey.includes('MY_GEMINI')) {
  try {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    appName: 'GO SAVE',
    timestamp: new Date().toISOString(),
  });
});

// Gemini AI Advisor Endpoint
app.post('/api/ai/advisor', async (req, res) => {
  const { question, financialSummary, categoryTotals, budgetLimits, savingsGoals, advisorStyle } = req.body;

  if (!question || typeof question !== 'string') {
    res.status(400).json({ error: 'Question is required.' });
    return;
  }

  // Dynamic context builder and specialized responses
  const income = Number(financialSummary?.totalIncome) || 10000;
  const expenses = Number(financialSummary?.totalExpenses) || 0;
  const remaining = Number(financialSummary?.remainingBalance) || (income - expenses);
  const savingsRate = income > 0 ? Math.round(((remaining / income) * 100) * 10) / 10 : 0;

  const sortedCategories = Object.entries(categoryTotals || {})
    .map(([cat, amt]) => [cat, Number(amt) || 0] as [string, number])
    .filter(([_, amt]) => amt > 0)
    .sort((a, b) => b[1] - a[1]);

  const highestCat = sortedCategories[0] || ['Food', 0];
  const secondHighestCat = sortedCategories[1] || ['Travel', 0];

  // Intelligent question-specific dynamic responder
  const generateDynamicAdvisorResponse = (q: string): string => {
    const lower = q.toLowerCase();

    if (lower.includes('highest') || lower.includes('most') || lower.includes('maximum')) {
      const pct = expenses > 0 ? Math.round((highestCat[1] / expenses) * 100) : 0;
      return `**Highest Spending Analysis**

Based on your actual financial records:
- **Highest Category:** **${highestCat[0]}** with **₹${highestCat[1].toLocaleString('en-IN')}** spent.
- **Share of Expenses:** Represents **${pct}%** of your total monthly expenditures (₹${expenses.toLocaleString('en-IN')}).
${secondHighestCat[1] > 0 ? `- **Second Highest:** **${secondHighestCat[0]}** at ₹${secondHighestCat[1].toLocaleString('en-IN')} (${Math.round((secondHighestCat[1] / expenses) * 100)}%).` : ''}

**Practical Cutback Opportunities:**
1. **Targeted 20% Reduction:** Reducing spending in **${highestCat[0]}** by just 20% saves **₹${Math.round(highestCat[1] * 0.2).toLocaleString('en-IN')}** every month.
2. **Student Swap:** Explore student discounts or institutional alternatives (such as college canteen cards or pooled study materials) to curb top-heavy outflows.

*Note: Educational budget recommendations only; not professional financial advice.*`;
    }

    if (lower.includes('budget') || lower.includes('next month') || lower.includes('suggest a budget')) {
      const suggestedSavings = Math.round(income * 0.25);
      const suggestedNeeds = Math.round(income * 0.50);
      const suggestedFlex = Math.round(income * 0.25);

      return `**Suggested Monthly Budget Plan (Student 50/25/25 Model)**

Based on your monthly allowance of **₹${income.toLocaleString('en-IN')}**:

1. **Fixed Essentials & Commute (50% — ₹${suggestedNeeds.toLocaleString('en-IN')}):**
   - **Travel / Metro Pass:** ₹${Math.min(2000, Math.round(income * 0.18)).toLocaleString('en-IN')}
   - **College Canteen & Basic Food:** ₹${Math.min(2500, Math.round(income * 0.22)).toLocaleString('en-IN')}
   - **Mobile Connectivity & Essential Bills:** ₹${Math.min(800, Math.round(income * 0.10)).toLocaleString('en-IN')}

2. **Education & Flexible Discretionary (25% — ₹${suggestedFlex.toLocaleString('en-IN')}):**
   - **Books, Xerox & Project Records:** ₹${Math.min(1500, Math.round(income * 0.15)).toLocaleString('en-IN')}
   - **Recreation & Personal Needs:** ₹${Math.min(1000, Math.round(income * 0.10)).toLocaleString('en-IN')}

3. **Guaranteed Student Savings (25% — ₹${suggestedSavings.toLocaleString('en-IN')}):**
   - Deposit directly at the beginning of the month into your Savings Goals (e.g., certification exam fees or emergency buffer).

*Note: Educational budget recommendations only; not professional financial advice.*`;
    }

    if (lower.includes('shopping') || lower.includes('clothes') || lower.includes('purchase')) {
      const shoppingSpent = Number(categoryTotals?.Shopping) || 0;
      return `**Strategy to Reduce Shopping Expenses**

Your current recorded Shopping outflow is **₹${shoppingSpent.toLocaleString('en-IN')}**.

**Actionable Student Tactics:**
1. **The 48-Hour Delay Rule:** Before buying non-academic items or accessories, wait 48 hours. Impulse cravings drop by over 60%.
2. **Bulk & Shared Stationery:** Never buy individual print cartridges or notebook singles at retail; purchase stationery and record sheets jointly with classmates.
3. **Student Tech Perks:** Use your student college email ID (.edu or institutional email) to claim educational hardware discounts and software licenses instead of paying retail.

*Note: Educational budget recommendations only; not professional financial advice.*`;
    }

    if (lower.includes('week') || lower.includes('weekly')) {
      const weeklyBudget = Math.round(remaining > 0 ? remaining / 4 : income / 4);
      const dailyCap = Math.round(weeklyBudget / 7);

      return `**Your Weekly Student Survival & Savings Plan**

With **₹${remaining.toLocaleString('en-IN')}** in remaining balance:
- **Weekly Spending Allowance:** **₹${weeklyBudget.toLocaleString('en-IN')}** per week.
- **Daily Spending Cap:** Approximately **₹${dailyCap.toLocaleString('en-IN')}** per day.

**Weekly Routine:**
- **Monday–Friday (College Days):** Limit weekday spend to travel fares and campus canteen essentials.
- **Weekend Allocation:** Reserve a small weekend buffer (₹300–₹400) for leisure with friends.
- **Sunday Review:** Log all transactions in GO SAVE every Sunday evening to recalibrate the coming week.

*Note: Educational budget recommendations only; not professional financial advice.*`;
    }

    if (lower.includes('travel') || lower.includes('commute') || lower.includes('transit') || lower.includes('metro')) {
      const travelSpent = Number(categoryTotals?.Travel) || 0;
      return `**Commute & Transit Optimization for Day Scholars**

Your current Travel expenditure is **₹${travelSpent.toLocaleString('en-IN')}**.

**Smart Transit Moves:**
1. **Student Concession Pass:** Apply through your college administration for student railway or state transport bus concession passes for up to 40% discount.
2. **Metro Card Smart Recharge:** Auto-reload metro cards during promotional cashback windows or buy monthly trip bundles instead of single-token fares.
3. **Campus Carpooling / Bike Sharing:** Coordinate shared rides with batchmates traveling along the same commuter route.

*Note: Educational budget recommendations only; not professional financial advice.*`;
    }

    if (lower.includes('food') || lower.includes('canteen') || lower.includes('eating') || lower.includes('snacks')) {
      const foodSpent = Number(categoryTotals?.Food) || 0;
      return `**Campus Food & Canteen Optimization**

Your Food & Snack expenses currently total **₹${foodSpent.toLocaleString('en-IN')}**.

**Actionable Food Savings:**
1. **Home-Packed Snacks:** Carry fruit, dry snacks, or a water bottle from home to eliminate ₹30–₹50 spontaneous roadside chai/snack purchases daily (saves ~₹900/month).
2. **Canteen Meals vs Delivery Apps:** Eat hot subsidized meals at the campus cafeteria instead of ordering through food delivery apps with delivery surcharges and convenience taxes.
3. **Monthly Mess Coupons:** Buy advance meal coupon booklets if your college offers them at a bulk discount.

*Note: Educational budget recommendations only; not professional financial advice.*`;
    }

    // Default holistic savings advisory
    return `**Personalized Student Savings Plan**

Based on your current numbers:
- **Monthly Income:** ₹${income.toLocaleString('en-IN')}
- **Total Spent:** ₹${expenses.toLocaleString('en-IN')}
- **Remaining Buffer:** ₹${remaining.toLocaleString('en-IN')} (${savingsRate}% savings rate)
- **Top Outflow:** ${highestCat[0]} (₹${highestCat[1].toLocaleString('en-IN')})

**3 Quick Steps to Increase Your Savings:**
1. **Trim ${highestCat[0]}:** Shave 15% off your ${highestCat[0]} spend to instantly add **₹${Math.round(highestCat[1] * 0.15).toLocaleString('en-IN')}** to your savings.
2. **Prioritize Savings Goals:** Funnel your available ₹${Math.max(0, remaining).toLocaleString('en-IN')} balance into your target milestones immediately.
3. **Establish Daily Spending Discipline:** Keep non-commute spending under ₹100 per college day.

*Note: Educational budget recommendations only; not professional financial advice.*`;
  };

  const summaryContext = `Total Income: ₹${income.toLocaleString('en-IN')}, Total Expenses: ₹${expenses.toLocaleString('en-IN')}, Remaining Balance: ₹${remaining.toLocaleString('en-IN')}, Savings Rate: ${savingsRate}%`;
  const categoriesContext = sortedCategories
    .map(([cat, amount]) => {
      const limit = budgetLimits?.[cat];
      return `${cat}: Spent ₹${amount.toLocaleString('en-IN')}${limit ? ` (Budget Limit: ₹${Number(limit).toLocaleString('en-IN')})` : ''}`;
    })
    .join('\n- ');

  const goalsContext = savingsGoals && savingsGoals.length > 0
    ? savingsGoals
        .map((g: any) => `${g.name}: Saved ₹${Number(g.currentAmount).toLocaleString('en-IN')} of ₹${Number(g.targetAmount).toLocaleString('en-IN')}`)
        .join('\n- ')
    : 'No active savings goals recorded.';

  const systemInstruction = `You are "GO SAVE Assistant", a smart personal finance and budget recommendation AI designed specifically for college students and day scholars in India.
App Name: GO SAVE (PocketSmart AI: Your Smart Budget & Recommendation Assistant).
Tone: ${advisorStyle || 'Practical Advisor with category breakdown and smart cutbacks'}.

STRICT RULES:
1. Always express amounts in Indian Rupees (₹).
2. Ground all advice directly in the user's specific question: "${question}".
3. Provide relevant, tailored advice for their actual spending numbers:
${summaryContext}
Category Outflows:
- ${categoriesContext || 'None'}
Goals:
- ${goalsContext}
4. Distinguish AI advice from deterministic calculated totals.
5. End with: "Note: Educational budget recommendations only; not professional financial advice."`;

  let answer = '';
  let usedModel = 'gemini-3.5-flash-lite';

  if (!ai) {
    res.json({
      answer: generateDynamicAdvisorResponse(question),
      model: 'grounded-advisor',
      success: true,
    });
    return;
  }

  try {
    // 6-second grace timer to keep UI snappy
    const timeoutPromise = new Promise((resolve) =>
      setTimeout(() => resolve(null), 6000)
    );

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.5-flash-lite',
      contents: question,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    }).catch((genErr) => {
      console.warn('Gemini generateContent note:', genErr?.message || genErr);
      return null;
    });

    const response: any = await Promise.race([generatePromise, timeoutPromise]);
    if (response && response.text) {
      answer = response.text;
    } else {
      answer = generateDynamicAdvisorResponse(question);
      usedModel = 'grounded-advisor';
    }
  } catch (e: any) {
    answer = generateDynamicAdvisorResponse(question);
    usedModel = 'grounded-advisor';
  }

  res.json({
    answer,
    model: usedModel,
    success: true,
  });
});

// Dev vs Production static asset / Vite middleware handler
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`GO SAVE server running at http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
