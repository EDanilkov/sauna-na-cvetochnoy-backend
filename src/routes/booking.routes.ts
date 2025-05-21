import { Router } from 'express';
import { createBooking } from '../controllers/booking.controller';
import rateLimit from 'express-rate-limit';
import { TelegramService } from '../services/telegram.service';

const router = Router();
const telegramService = new TelegramService();

// Rate limiting: 5 запросов в минуту
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 минута
  max: 5, // 5 запросов
  message: 'Too many requests from this IP, please try again later.'
});

// Тестовый эндпоинт для проверки бота
router.get('/test-bot', async (req, res) => {
  try {
    await telegramService.sendBookingNotification({
      date: new Date().toISOString(),
      time: '12:00',
      duration: '2',
      guests: '2',
      name: 'Test User',
      phone: '+375291234567'
    });
    res.json({ message: 'Test message sent successfully' });
  } catch (error) {
    console.error('Test bot error:', error);
    res.status(500).json({ error: 'Failed to send test message' });
  }
});

router.post('/bookings', limiter, createBooking);

export default router; 