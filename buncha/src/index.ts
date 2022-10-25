import { logger } from '@/lib/logger';
import main from '@/main';

main().catch((err) => logger.error(err));
