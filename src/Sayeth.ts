import { Sayeth } from 'generated';
import { Hex } from 'viem';
import { decodeAbiParameters, parseAbiParameters } from 'viem';
import { OPEN_REFERRERS, TAG } from './utils/dynamicIndexing';
import { handleAppDraftEdit, handleAppDraftPost } from './utils/post';

Sayeth.Say.handler(async ({ event, context }) => {
  const isOpenReferrer =
    OPEN_REFERRERS?.[event.chainId.toString()] === event.params.referrer;
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
      } else {
        return;
      }
    } else {
      // context.log.error(`Referrer ${event.params.referrer} not found`);
      return;
    }
  } catch (error) {}
});
