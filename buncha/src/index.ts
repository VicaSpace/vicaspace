import { logger } from '@/lib/utils/logger';
import main from '@/main';

main().catch((err) => logger.error(err));
