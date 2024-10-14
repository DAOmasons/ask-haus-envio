/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import { FastFactory } from 'generated';

FastFactory.AdminAdded.handler(async ({ event, context }) => {
  const factory = await context.Factory.get(
    `factory-${event.chainId}-${event.srcAddress}`
  );

  if (!factory) {
    context.log.error(`Factory ${event.srcAddress} not found`);
    return;
  }

  context.Factory.set({
    ...factory,
    admins: [...factory.admins, event.params.admin],
  });
});

FastFactory.AdminRemoved.handler(async ({ event, context }) => {
  // const entity: FastFactory_AdminRemoved = {
  //   id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
  //   admin: event.params.admin,
  // };
  // context.FastFactory_AdminRemoved.set(entity);
});

FastFactory.ContestBuilt.handler(async ({ event, context }) => {
  // const entity: FastFactory_ContestBuilt = {
  //   id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
  //   votesModule: event.params.votesModule,
  //   pointsModule: event.params.pointsModule,
  //   choicesModule: event.params.choicesModule,
  //   executionModule: event.params.executionModule,
  //   contestAddress: event.params.contestAddress,
  //   contestVersion: event.params.contestVersion,
  //   filterTag: event.params.filterTag,
  // };
  // context.FastFactory_ContestBuilt.set(entity);
});

FastFactory.ContestCloned.handler(async ({ event, context }) => {
  // const entity: FastFactory_ContestCloned = {
  //   id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
  //   contestAddress: event.params.contestAddress,
  //   contestVersion: event.params.contestVersion,
  //   filterTag: event.params.filterTag,
  // };
  // context.FastFactory_ContestCloned.set(entity);
});

FastFactory.ContestTemplateCreated.handler(async ({ event, context }) => {
  // const entity: FastFactory_ContestTemplateCreated = {
  //   id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
  //   contestVersion: event.params.contestVersion,
  //   contestAddress: event.params.contestAddress,
  //   contestInfo_0: event.params.contestInfo[0],
  //   contestInfo_1: event.params.contestInfo[1],
  // };
  // context.FastFactory_ContestTemplateCreated.set(entity);
});

FastFactory.ContestTemplateDeleted.handler(async ({ event, context }) => {
  // const entity: FastFactory_ContestTemplateDeleted = {
  //   id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
  //   contestVersion: event.params.contestVersion,
  //   contestAddress: event.params.contestAddress,
  // };
  // context.FastFactory_ContestTemplateDeleted.set(entity);
});

FastFactory.FactoryInitialized.handler(async ({ event, context }) => {
  context.Factory.set({
    id: `factory-${event.chainId}-${event.srcAddress}`,
    address: event.srcAddress,
    admins: [event.params.admin],
  });
});

FastFactory.ModuleCloned.handler(async ({ event, context }) => {
  // const entity: FastFactory_ModuleCloned = {
  //   id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
  //   moduleAddress: event.params.moduleAddress,
  //   moduleName: event.params.moduleName,
  //   filterTag: event.params.filterTag,
  // };
  // context.FastFactory_ModuleCloned.set(entity);
});

FastFactory.ModuleTemplateCreated.handler(async ({ event, context }) => {
  // const entity: FastFactory_ModuleTemplateCreated = {
  //   id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
  //   moduleName: event.params.moduleName,
  //   moduleAddress: event.params.moduleAddress,
  //   moduleInfo_0: event.params.moduleInfo[0],
  //   moduleInfo_1: event.params.moduleInfo[1],
  // };
  // context.FastFactory_ModuleTemplateCreated.set(entity);
});

FastFactory.ModuleTemplateDeleted.handler(async ({ event, context }) => {
  // const entity: FastFactory_ModuleTemplateDeleted = {
  //   id: `${event.chainId}_${event.block.number}_${event.logIndex}`,
  //   moduleName: event.params.moduleName,
  //   moduleAddress: event.params.moduleAddress,
  // };
  // context.FastFactory_ModuleTemplateDeleted.set(entity);
});
