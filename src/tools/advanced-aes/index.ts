import { ArrowsShuffle } from '@vicons/tabler';
import { defineTool } from '../tool';

export const tool = defineTool({
  name: 'Advanced AES',
  path: '/advanced-aes',
  description: 'AES encryption and decryption tool with advanced options.',
  keywords: ['aes'],
  component: () => import('./advanced-aes.vue'),
  icon: ArrowsShuffle,
  createdAt: new Date('2025-01-09'),
});
