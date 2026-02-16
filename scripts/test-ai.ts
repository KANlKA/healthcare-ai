import { aiService } from '../services/ai-service';
import { config } from 'dotenv';

config();

async function test() {
  try {
    console.log('Testing AI service...');
    
    const explanation = await aiService.generateExplanation(
      'Take 500mg ibuprofen twice daily',
      'Pain management for post-surgical recovery',
      'intermediate'
    );

    console.log('✅ AI Response:', explanation);
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

test();