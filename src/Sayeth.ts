import { Sayeth } from 'generated';
import { Hex } from 'viem';
import { decodeAbiParameters, parseAbiParameters } from 'viem';
import { REFERRERS, TAG } from './utils/dynamicIndexing';
import { addTransaction } from './utils/sync';

Sayeth.Say.handler(async ({ event, context }) => {
  try {
    const [tag, onchainStorage, metadata] = decodeAbiParameters(
      parseAbiParameters('string, string, (uint256, string)'),
      event.params.content as Hex
    );
    if (!tag.includes(TAG.APPLICATION_POST)) {
      return;
    }

    const isReferrer = Object.values(REFERRERS).some(
      (ref) => ref === event.params.referrer
    );

    if (!isReferrer) {
      context.log.error(`Referrer ${event.params.referrer} not found`);
      return;
    }

    const [protocol, pointer] = metadata;

    if (!tag || !metadata || !protocol || !pointer || !onchainStorage) {
      context.log.error('Parameters not found');
      return;
    }

    const [postTag, id] = tag.split(':');

    if (
      id ===
      '0xa06d98c78191d02f8d41d86c1fc0776c373f4eddb4622442a43ee7ec5d38473f'
    ) {
      return;
    }

    if (!postTag || !id) {
      context.log.error('Post tag or id not found');
      return;
    }

    context.log.info(`Got here`);

    context.AppDraft.set({
      id,
      chainId: event.chainId,
      tag: postTag,
      userAddress: event.params.sender,
      json: onchainStorage,
      ipfsHash: pointer,
      lastUpdated: event.block.timestamp,
      contentProtocol: protocol,
    });

    addTransaction(event, context);
  } catch (error) {}
});
