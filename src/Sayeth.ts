import { Sayeth } from 'generated';
import { Hex } from 'viem';
import { decodeAbiParameters, parseAbiParameters } from 'viem';
import { TAG } from './utils/dynamicIndexing';

Sayeth.Say.handler(async ({ event, context }) => {
  try {
    const [tag, metadata] = decodeAbiParameters(
      parseAbiParameters('string, (uint256, string)'),
      event.params.content as Hex
    );

    const [protocol, pointer] = metadata;

    if (!tag || !metadata || !protocol || !pointer) {
      return;
    }

    if (!tag.includes(TAG.APPLICATION_POST)) {
      return;
    }

    const [postTag, id] = tag.split(':');

    if (!postTag || !id) {
      return;
    }

    context.GGApplicationContent.set({
      id,
      tag: postTag,
      userAddress: event.params.sender,
      json: pointer,
      lastUpdated: event.block.timestamp,
      contentProtocol: protocol,
    });
  } catch (error) {}
});
