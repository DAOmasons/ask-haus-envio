import { eventLog, handlerContext, Sayeth_Say_eventArgs } from 'generated';
import { addTransaction } from './sync';
import { CURRENT_ROUND, Role, TAG } from './dynamicIndexing';
import { generateRandomId, truncateAddr } from './common';

export const FILTERED_IDS = [
  '0xa06d98c78191d02f8d41d86c1fc0776c373f4eddb4622442a43ee7ec5d38473f',
];

// const internalLink = (label: string, to: string) => `##INTERNAL_LINK##${label}##${to}##`;

export const handleAppDraftPost = async ({
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
    rootId: id,
    chainId: event.chainId,
    tag: postTag,
    userAddress: event.params.sender,
    json: onchainStorage,
    ipfsHash: pointer,
    lastUpdated: event.block.timestamp,
    contentProtocol: protocol,
    version: 0,
    isHistory: false,
    approvedRounds: [],
  });

  context.CurrentDraftVersion.set({
    id,
    version: 0,
  });

  context.FeedItem.set({
    id: generateRandomId(),
    topic: id,
    userAddress: event.params.sender,
    createdAt: event.block.timestamp,
    postType: TAG.APPLICATION_POST,
    json: JSON.stringify({
      title: 'Application Created',
      body: `Ship Operator ${truncateAddr(event.params.sender)} has created a new application.`,
    }),
    ipfsHash: undefined,
  });

  addTransaction(event, context);
};

export const handleAppDraftEdit = async ({
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
  if (FILTERED_IDS.some((filteredId) => filteredId === id)) {
    context.log.warn(`Filtered id ${id}`);
    return;
  }

  const prevDraft = await context.AppDraft.get(id);

  if (!prevDraft) {
    context.log.error('Previous draft not found');
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

  // create a new draft with the updated content
  const newVersion = prevDraft.version + 1;
  const rootId = prevDraft.id.split('-')[0];

  context.AppDraft.set({
    ...prevDraft,
    id: `${rootId}-${newVersion}`,
    json: onchainStorage,
    ipfsHash: pointer,
    lastUpdated: event.block.timestamp,
    version: newVersion,
    approvedRounds: prevDraft.approvedRounds.filter(
      (round) => round !== CURRENT_ROUND
    ),
  });

  context.CurrentDraftVersion.set({
    id: rootId,
    version: newVersion,
  });

  // mark the previous draft as history
  context.AppDraft.set({
    ...prevDraft,
    isHistory: true,
  });

  //   context.FeedItem.set({
  //     id: generateRandomId(),
  //     topic: ogId,
  //     userAddress: event.params.sender,
  //     role: Role.System,
  //     postType: TAG.APPLICATION_EDIT,
  //     json: JSON.stringify({
  //       title: 'Application Edited',
  //       body: `This application has been edited by ${event.params.sender}. You can view the updated application at ${}`,
  //     }),
  //     ipfsHash: undefined,
  //   });

  addTransaction(event, context);
};
