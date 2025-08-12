/* eslint-disable @typescript-eslint/no-explicit-any */
import { Wallet } from '../app/modules/wallets/wallets.model';
import { logger } from '../shared/logger';

export const handleWalletSocketAction = async (...actions: any) => {
  try {
    actions.user = { id: actions.userId, role: actions.role };

    const wallet = await Wallet.findById(actions.user?.id);
    if (!wallet) {
      return actions.emit('error', { message: 'Wallet not found' });
    }
    if (wallet.isBlocked) {
      return actions.emit('error', { message: 'This wallet is blocked' });
    }

    actions.emit(actions, { actions, ...actions });
  } catch (err) {
    logger.error(err);
    actions.emit('error', { message: 'Internal server error' });
  }
};

