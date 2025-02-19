import {
  eventLog,
  handlerContext,
  Sayeth,
  Sayeth_Say_eventArgs,
} from 'generated';
import { Hex } from 'viem';
import { decodeAbiParameters, parseAbiParameters } from 'viem';
import { OPEN_REFERRERS, TAG } from './utils/dynamicIndexing';
import { addTransaction } from './utils/sync';

const FILTERED_IDS = [
  '0xa06d98c78191d02f8d41d86c1fc0776c373f4eddb4622442a43ee7ec5d38473f',
];

const handleAppDraftPost = async ({
  event,
  context,
  tag,
  protocol,
  pointer,
  onchainStorage,
}: {
  tag: string;
  protocol: bigint;
  pointer: string;
  onchainStorage: string;
  event: eventLog<Sayeth_Say_eventArgs>;
  context: handlerContext;
}) => {
  const [postTag, id] = tag.split(':');

  if (FILTERED_IDS.some((filteredId) => filteredId === id)) {
    context.log.warn(`Filtered id ${id}`);
    return;
  }

  if (!postTag || !id) {
    context.log.error('Post tag or id not found');
    return;
  }

  const prevDraft = await context.AppDraft.get(id);

  if (prevDraft) {
    context.log.error('Draft already exists');
    return;
  }

  context.AppDraft.set({
    id: `${id}-${0}`,
    chainId: event.chainId,
    tag: postTag,
    userAddress: event.params.sender,
    json: onchainStorage,
    ipfsHash: pointer,
    lastUpdated: event.block.timestamp,
    contentProtocol: protocol,
    version: 0,
    isHistory: false,
  });

  addTransaction(event, context);
};

const handleAppDraftEdit = async ({
  event,
  context,
  tag,
  pointer,
  onchainStorage,
}: {
  tag: string;
  protocol: bigint;
  pointer: string;
  onchainStorage: string;
  event: eventLog<Sayeth_Say_eventArgs>;
  context: handlerContext;
}) => {
  const [postTag, id] = tag.split(':');

  const prevDraft = await context.AppDraft.get(id);

  if (!prevDraft) {
    context.log.error('Previous draft not found');
    return;
  }

  if (FILTERED_IDS.some((filteredId) => filteredId === id)) {
    context.log.warn(`Filtered id ${id}`);
    return;
  }

  if (!postTag || !id) {
    context.log.error('Post tag or id not found');
    return;
  }

  if (prevDraft.userAddress !== event.params.sender) {
    context.log.error('User not authorized');
    return;
  }

  const newVersion = prevDraft.version + 1;

  // create a new draft with the updated content

  const ogId = prevDraft.id.split('-')[0];

  context.AppDraft.set({
    ...prevDraft,
    id: `${ogId}-${newVersion}`,
    json: onchainStorage,
    ipfsHash: pointer,
    lastUpdated: event.block.timestamp,
    version: newVersion,
  });

  // mark the previous draft as history
  context.AppDraft.set({
    ...prevDraft,
    isHistory: true,
  });

  addTransaction(event, context);
};

Sayeth.Say.handler(async ({ event, context }) => {
  try {
    const isOpenReferrer = Object.values(OPEN_REFERRERS).some(
      (ref) => ref === event.params.referrer
    );

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
      context.log.error(`Referrer ${event.params.referrer} not found`);
      return;
    }
  } catch (error) {}
});
