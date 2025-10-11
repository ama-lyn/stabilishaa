import { neon } from "@neondatabase/serverless"

// Create a SQL client using Neon
export const sql = neon(process.env.DATABASE_URL!)

// Helper function to execute queries with error handling
export async function query<T = any>(queryText: string, params: any[] = []): Promise<T[]> {
  try {
    const result = await sql(queryText, params)
    return result as T[]
  } catch (error) {
    console.error("[v0] Database query error:", error)
    throw error
  }
}

// User operations
export const db = {
  users: {
    async create(data: {
      email: string
      passwordHash: string
      fullName: string
      userType: "worker" | "client"
      phone?: string
      location?: string
    }) {
      const result = await query<{ id: string }>(
        `INSERT INTO users (email, password_hash, full_name, user_type, phone, location)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [data.email, data.passwordHash, data.fullName, data.userType, data.phone, data.location],
      )
      return result[0]
    },

    async findByEmail(email: string) {
      const result = await query("SELECT * FROM users WHERE email = $1", [email])
      return result[0]
    },

    async findById(id: string) {
      const result = await query("SELECT * FROM users WHERE id = $1", [id])
      return result[0]
    },
  },

  wallets: {
    async create(userId: string) {
      const result = await query<{ id: string }>(
        `INSERT INTO wallets (user_id)
         VALUES ($1)
         RETURNING id`,
        [userId],
      )
      return result[0]
    },

    async findByUserId(userId: string) {
      const result = await query("SELECT * FROM wallets WHERE user_id = $1", [userId])
      return result[0]
    },

    async updateBalance(userId: string, balanceKes: number, balanceUsd: number) {
      await query(
        `UPDATE wallets 
         SET balance_kes = $2, balance_usd = $3, updated_at = NOW()
         WHERE user_id = $1`,
        [userId, balanceKes, balanceUsd],
      )
    },
  },

  transactions: {
    async create(data: {
      walletId: string
      userId: string
      type: "credit" | "debit"
      category: string
      amount: number
      currency?: string
      description?: string
      blockchainHash?: string
    }) {
      const result = await query<{ id: string }>(
        `INSERT INTO transactions (wallet_id, user_id, type, category, amount, currency, description, blockchain_hash)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        [
          data.walletId,
          data.userId,
          data.type,
          data.category,
          data.amount,
          data.currency || "KES",
          data.description,
          data.blockchainHash,
        ],
      )
      return result[0]
    },

    async findByUserId(userId: string, limit = 10) {
      return await query(
        `SELECT * FROM transactions 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT $2`,
        [userId, limit],
      )
    },
  },

  workerProfiles: {
    async create(userId: string) {
      const result = await query<{ id: string }>(
        `INSERT INTO worker_profiles (user_id)
         VALUES ($1)
         RETURNING id`,
        [userId],
      )
      return result[0]
    },

    async findByUserId(userId: string) {
      const result = await query("SELECT * FROM worker_profiles WHERE user_id = $1", [userId])
      return result[0]
    },

    async findAll(limit = 20) {
      return await query(
        `SELECT wp.*, u.full_name, u.location, u.profile_image
         FROM worker_profiles wp
         JOIN users u ON wp.user_id = u.id
         WHERE u.user_type = 'worker'
         ORDER BY wp.rating DESC
         LIMIT $1`,
        [limit],
      )
    },
  },

  creditScores: {
    async create(userId: string) {
      const result = await query<{ id: string }>(
        `INSERT INTO credit_scores (user_id)
         VALUES ($1)
         RETURNING id`,
        [userId],
      )
      return result[0]
    },

    async findByUserId(userId: string) {
      const result = await query("SELECT * FROM credit_scores WHERE user_id = $1", [userId])
      return result[0]
    },

    async update(
      userId: string,
      data: {
        score: number
        gigConsistency: number
        paymentHistory: number
        financialHealth: number
      },
    ) {
      await query(
        `UPDATE credit_scores 
         SET score = $2, gig_consistency = $3, payment_history = $4, 
             financial_health = $5, last_calculated = NOW(), updated_at = NOW()
         WHERE user_id = $1`,
        [userId, data.score, data.gigConsistency, data.paymentHistory, data.financialHealth],
      )
    },
  },

  gigs: {
    async create(data: {
      clientId: string
      title: string
      description: string
      category: string
      budgetMin?: number
      budgetMax?: number
      duration?: string
      location?: string
      locationType?: string
      requiredSkills?: string[]
      experienceLevel?: string
    }) {
      const result = await query<{ id: string }>(
        `INSERT INTO gigs (client_id, title, description, category, budget_min, budget_max, 
                          duration, location, location_type, required_skills, experience_level)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING id`,
        [
          data.clientId,
          data.title,
          data.description,
          data.category,
          data.budgetMin,
          data.budgetMax,
          data.duration,
          data.location,
          data.locationType,
          data.requiredSkills,
          data.experienceLevel,
        ],
      )
      return result[0]
    },

    async findAll(filters?: { category?: string; status?: string }) {
      let queryText = `
        SELECT g.*, u.full_name as client_name, u.location as client_location
        FROM gigs g
        JOIN users u ON g.client_id = u.id
        WHERE 1=1
      `
      const params: any[] = []

      if (filters?.category) {
        params.push(filters.category)
        queryText += ` AND g.category = $${params.length}`
      }

      if (filters?.status) {
        params.push(filters.status)
        queryText += ` AND g.status = $${params.length}`
      }

      queryText += " ORDER BY g.created_at DESC LIMIT 50"

      return await query(queryText, params)
    },

    async findByClientId(clientId: string) {
      return await query(
        `SELECT * FROM gigs 
         WHERE client_id = $1 
         ORDER BY created_at DESC`,
        [clientId],
      )
    },
  },

  saccoAccounts: {
    async create(userId: string) {
      const result = await query<{ id: string }>(
        `INSERT INTO sacco_accounts (user_id)
         VALUES ($1)
         RETURNING id`,
        [userId],
      )
      return result[0]
    },

    async findByUserId(userId: string) {
      const result = await query("SELECT * FROM sacco_accounts WHERE user_id = $1", [userId])
      return result[0]
    },

    async updateContribution(userId: string, amount: number) {
      await query(
        `UPDATE sacco_accounts 
         SET total_contributions = total_contributions + $2,
             available_loan_amount = (total_contributions + $2) * 2,
             updated_at = NOW()
         WHERE user_id = $1`,
        [userId, amount],
      )
    },
  },

  insurancePolicies: {
    async findByUserId(userId: string) {
      return await query(
        `SELECT * FROM insurance_policies 
         WHERE user_id = $1 AND status = 'active'
         ORDER BY created_at DESC`,
        [userId],
      )
    },
  },

  insuranceClaims: {
    async create(data: {
      policyId: string
      userId: string
      claimType: string
      claimAmount: number
      description: string
      geotaggedImages?: any
    }) {
      const result = await query<{ id: string }>(
        `INSERT INTO insurance_claims (policy_id, user_id, claim_type, claim_amount, description, geotagged_images)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [
          data.policyId,
          data.userId,
          data.claimType,
          data.claimAmount,
          data.description,
          JSON.stringify(data.geotaggedImages),
        ],
      )
      return result[0]
    },

    async findByUserId(userId: string) {
      return await query(
        `SELECT ic.*, ip.policy_type, ip.policy_number
         FROM insurance_claims ic
         JOIN insurance_policies ip ON ic.policy_id = ip.id
         WHERE ic.user_id = $1
         ORDER BY ic.created_at DESC`,
        [userId],
      )
    },
  },

  aiInsights: {
    async create(data: {
      userId: string
      insightType: string
      title: string
      description: string
      confidence?: number
    }) {
      const result = await query<{ id: string }>(
        `INSERT INTO ai_insights (user_id, insight_type, title, description, confidence)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [data.userId, data.insightType, data.title, data.description, data.confidence],
      )
      return result[0]
    },

    async findByUserId(userId: string, limit = 10) {
      return await query(
        `SELECT * FROM ai_insights 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT $2`,
        [userId, limit],
      )
    },
  },
}
