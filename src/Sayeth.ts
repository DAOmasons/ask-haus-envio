import { Sayeth } from 'generated';
import { Hex } from 'viem';
import { decodeAbiParameters, parseAbiParameters } from 'viem';
import { HATS_REFERRERS, OPEN_REFERRERS, TAG } from './utils/dynamicIndexing';
import { handleAppDraftEdit, handleAppDraftPost } from './utils/post';
import { generateRandomId } from './utils/common';
import { addTransaction } from './utils/sync';

Sayeth.Say.handler(async ({ event, context }) => {
  const isOpenReferrer =
    OPEN_REFERRERS?.[event.chainId.toString()] === event.params.referrer;

  const isHatsReferrer =
    HATS_REFERRERS?.[event.chainId.toString()] === event.params.referrer;
  try {
    if (isOpenReferrer) {
      const [tag, onchainStorage, metadata] = decodeAbiParameters(
        parseAbiParameters('string, string, (uint256, string)'),
        event.params.content as Hex
      );

      const [protocol, pointer] = metadata;

      if (!tag || !metadata || !protocol || !pointer || !onchainStorage) {
        context.log.error('Parameters not found');
        return;
      }
      if (tag.includes(TAG.APPLICATION_POST)) {
        await handleAppDraftPost({
          event,
          context,
          tag,
          protocol,
          pointer,
          onchainStorage,
        });
      } else if (tag.includes(TAG.APPLICATION_EDIT)) {
        await handleAppDraftEdit({
          event,
          context,
          tag,
          protocol,
          pointer,
          onchainStorage,
        });
      } else if (tag.includes(TAG.APPLICATION_COMMENT)) {
        const topic = tag.split(':')[1];

        context.FeedItem.set({
          id: generateRandomId(),
          topic,
          userAddress: event.params.sender,
          createdAt: event.block.timestamp,
          postType: TAG.APPLICATION_COMMENT,
          json: onchainStorage,
          ipfsHash: undefined,
        });

        addTransaction(event, context);
      } else {
        return;
      }
    } else if (isHatsReferrer) {
      const [tag, onchainStorage, _metadata, _hatId] = decodeAbiParameters(
        parseAbiParameters('string, string, (uint256, string), uint256'),
        event.params.content as Hex
      );

      if (tag.includes(TAG.APPLICATION_COMMENT)) {
        const topic = tag.split(':')[1];

        context.FeedItem.set({
          id: generateRandomId(),
          topic,
          userAddress: event.params.sender,
          createdAt: event.block.timestamp,
          postType: TAG.APPLICATION_COMMENT,
          json: onchainStorage,
          ipfsHash: undefined,
        });

        addTransaction(event, context);
      }
    } else {
      // context.log.error(`Referrer ${event.params.referrer} not found`);
      return;
    }
  } catch (error) {
    context.log.error(JSON.stringify(error));
  }
});
//
