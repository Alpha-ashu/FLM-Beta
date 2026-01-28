import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-e9ec81de/health", (c) => {
  return c.json({ status: "ok" });
});

// ===== AUTH ROUTES =====

// User Signup
app.post("/make-server-e9ec81de/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    // Create default portfolio for new user
    const portfolioKey = `portfolio:${data.user.id}:default`;
    await kv.set(portfolioKey, {
      id: 'default',
      name: 'Personal',
      type: 'personal',
      userId: data.user.id,
      createdAt: new Date().toISOString()
    });

    return c.json({ user: data.user });
  } catch (error) {
    console.error('Signup exception:', error);
    return c.json({ error: 'Signup failed' }, 500);
  }
});

// ===== TRANSACTION ROUTES =====

// Get transactions for a user
app.get("/make-server-e9ec81de/transactions", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const portfolioId = c.req.query('portfolioId') || 'default';
    const transactionsKey = `transactions:${user.id}:${portfolioId}`;
    
    const transactions = await kv.get(transactionsKey) || [];
    return c.json({ transactions });
  } catch (error) {
    console.error('Get transactions error:', error);
    return c.json({ error: 'Failed to fetch transactions' }, 500);
  }
});

// Add transaction
app.post("/make-server-e9ec81de/transactions", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const transaction = await c.req.json();
    const portfolioId = transaction.portfolioId || 'default';
    const transactionsKey = `transactions:${user.id}:${portfolioId}`;
    
    const transactions = await kv.get(transactionsKey) || [];
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
      userId: user.id,
      createdAt: new Date().toISOString()
    };
    
    transactions.push(newTransaction);
    await kv.set(transactionsKey, transactions);
    
    return c.json({ transaction: newTransaction });
  } catch (error) {
    console.error('Add transaction error:', error);
    return c.json({ error: 'Failed to add transaction' }, 500);
  }
});

// Delete transaction
app.delete("/make-server-e9ec81de/transactions/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { id } = c.req.param();
    const portfolioId = c.req.query('portfolioId') || 'default';
    const transactionsKey = `transactions:${user.id}:${portfolioId}`;
    
    let transactions = await kv.get(transactionsKey) || [];
    transactions = transactions.filter((t: any) => t.id !== id);
    await kv.set(transactionsKey, transactions);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Delete transaction error:', error);
    return c.json({ error: 'Failed to delete transaction' }, 500);
  }
});

// ===== PORTFOLIO ROUTES =====

// Get portfolios for a user
app.get("/make-server-e9ec81de/portfolios", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const portfoliosKey = `portfolios:${user.id}`;
    const portfolios = await kv.get(portfoliosKey) || [
      { id: 'default', name: 'Personal', type: 'personal', userId: user.id }
    ];
    
    return c.json({ portfolios });
  } catch (error) {
    console.error('Get portfolios error:', error);
    return c.json({ error: 'Failed to fetch portfolios' }, 500);
  }
});

// Create portfolio
app.post("/make-server-e9ec81de/portfolios", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const portfolio = await c.req.json();
    const portfoliosKey = `portfolios:${user.id}`;
    
    const portfolios = await kv.get(portfoliosKey) || [];
    const newPortfolio = {
      ...portfolio,
      id: crypto.randomUUID(),
      userId: user.id,
      createdAt: new Date().toISOString()
    };
    
    portfolios.push(newPortfolio);
    await kv.set(portfoliosKey, portfolios);
    
    return c.json({ portfolio: newPortfolio });
  } catch (error) {
    console.error('Create portfolio error:', error);
    return c.json({ error: 'Failed to create portfolio' }, 500);
  }
});

// ===== GOAL ROUTES =====

// Get goals for a user
app.get("/make-server-e9ec81de/goals", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const goalsKey = `goals:${user.id}`;
    const goals = await kv.get(goalsKey) || [];
    
    return c.json({ goals });
  } catch (error) {
    console.error('Get goals error:', error);
    return c.json({ error: 'Failed to fetch goals' }, 500);
  }
});

// Create goal
app.post("/make-server-e9ec81de/goals", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const goal = await c.req.json();
    const goalsKey = `goals:${user.id}`;
    
    const goals = await kv.get(goalsKey) || [];
    const newGoal = {
      ...goal,
      id: crypto.randomUUID(),
      userId: user.id,
      currentAmount: 0,
      createdAt: new Date().toISOString()
    };
    
    goals.push(newGoal);
    await kv.set(goalsKey, goals);
    
    return c.json({ goal: newGoal });
  } catch (error) {
    console.error('Create goal error:', error);
    return c.json({ error: 'Failed to create goal' }, 500);
  }
});

// Update goal progress
app.put("/make-server-e9ec81de/goals/:id", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { id } = c.req.param();
    const updates = await c.req.json();
    const goalsKey = `goals:${user.id}`;
    
    let goals = await kv.get(goalsKey) || [];
    goals = goals.map((g: any) => g.id === id ? { ...g, ...updates } : g);
    await kv.set(goalsKey, goals);
    
    return c.json({ success: true });
  } catch (error) {
    console.error('Update goal error:', error);
    return c.json({ error: 'Failed to update goal' }, 500);
  }
});

// ===== REPORT ROUTES =====

// Generate financial report
app.get("/make-server-e9ec81de/reports", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );
    
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const portfolioId = c.req.query('portfolioId') || 'default';
    const period = c.req.query('period') || 'monthly'; // monthly, quarterly, annual
    const transactionsKey = `transactions:${user.id}:${portfolioId}`;
    
    const transactions = await kv.get(transactionsKey) || [];
    
    // Calculate financial summary
    const income = transactions
      .filter((t: any) => t.type === 'income')
      .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);
    
    const expenses = transactions
      .filter((t: any) => t.type === 'expense')
      .reduce((sum: number, t: any) => sum + parseFloat(t.amount), 0);
    
    const savings = income - expenses;
    
    // Group by category
    const categoryBreakdown = transactions.reduce((acc: any, t: any) => {
      if (!acc[t.category]) {
        acc[t.category] = { total: 0, count: 0, type: t.type };
      }
      acc[t.category].total += parseFloat(t.amount);
      acc[t.category].count += 1;
      return acc;
    }, {});
    
    return c.json({
      period,
      summary: {
        totalIncome: income,
        totalExpenses: expenses,
        netSavings: savings,
        savingsRate: income > 0 ? ((savings / income) * 100).toFixed(2) : 0
      },
      categoryBreakdown,
      transactionCount: transactions.length
    });
  } catch (error) {
    console.error('Generate report error:', error);
    return c.json({ error: 'Failed to generate report' }, 500);
  }
});

Deno.serve(app.fetch);
