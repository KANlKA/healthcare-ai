import { memoryCache } from '@/lib/cache';
import AICache from '@/models/AICache';
import connectDB from '@/lib/mongodb';

class CacheService {
  async get<T>(key: string): Promise<T | null> {
    // Try memory cache first
    const memCached = memoryCache.get<T>(key);
    if (memCached !== null) {
      return memCached;
    }

    // Try database cache
    await connectDB();
    const dbCached = await AICache.findOne({
      cacheKey: key,
      validUntil: { $gt: new Date() }
    });

    if (dbCached) {
      // Store in memory cache for faster access
      memoryCache.set(key, dbCached.response as T, 3600);
      return dbCached.response as T;
    }

    return null;
  }

  async set<T>(
    key: string,
    value: T,
    ttlSeconds: number = 3600,
    metadata?: {
      promptType?: string;
      model?: string;
      tokensUsed?: number;
    }
  ): Promise<void> {
    // Store in memory cache
    memoryCache.set(key, value, ttlSeconds);

    // Store in database cache if metadata provided
    if (metadata) {
      await connectDB();
      const validUntil = new Date();
      validUntil.setSeconds(validUntil.getSeconds() + ttlSeconds);

      await AICache.findOneAndUpdate(
        { cacheKey: key },
        {
          cacheKey: key,
          promptType: metadata.promptType || 'general',
          response: value as string,
          model: metadata.model || 'unknown',
          tokensUsed: metadata.tokensUsed || 0,
          validUntil,
          $inc: { hitCount: 1 }
        },
        { upsert: true, new: true }
      );
    }
  }

  async invalidate(pattern: string): Promise<number> {
    await connectDB();
    const result = await AICache.deleteMany({
      cacheKey: { $regex: pattern }
    });
    
    // Clear memory cache
    memoryCache.clear();
    
    return result.deletedCount || 0;
  }

  async getStats() {
    await connectDB();
    const [dbStats, memStats] = await Promise.all([
      AICache.aggregate([
        {
          $group: {
            _id: '$promptType',
            count: { $sum: 1 },
            totalHits: { $sum: '$hitCount' },
            avgTokens: { $avg: '$tokensUsed' }
          }
        }
      ]),
      Promise.resolve(memoryCache.stats())
    ]);

    return { database: dbStats, memory: memStats };
  }
}

export const cacheService = new CacheService();