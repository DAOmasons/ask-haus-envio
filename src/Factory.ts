import { FastFactory } from 'generated';
import { addTransaction } from './utils/sync';
import { moduleFactory } from './utils/dynamicIndexing';

FastFactory.FactoryInitialized.handler(async ({ event, context }) => {
  context.Factory.set({
    id: `factory-${event.chainId}-${event.srcAddress}`,
    address: event.srcAddress,
    admins: [event.params.admin],
  });
});

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
  const factory = await context.Factory.get(
    `factory-${event.chainId}-${event.srcAddress}`
  );

  if (!factory) {
    context.log.error(`Factory ${event.srcAddress} not found`);
    return;
  }

  context.Factory.set({
    ...factory,
    admins: factory.admins.filter((admin) => admin !== event.params.admin),
  });
});

FastFactory.ContestTemplateCreated.handler(async ({ event, context }) => {
  context.ContestTemplate.set({
    id: `${event.params.contestVersion}-${event.params.contestAddress}`,
    contestVersion: event.params.contestVersion,
    contestAddress: event.params.contestAddress,
    mdProtocol: event.params.contestInfo[0],
    mdPointer: event.params.contestInfo[1],
    active: true,
  });
});

FastFactory.ContestTemplateDeleted.handler(async ({ event, context }) => {
  const template = await context.ContestTemplate.get(
    `${event.params.contestVersion}-${event.params.contestAddress}`
  );

  if (!template) {
    context.log.error(
      `Contest template ${event.params.contestAddress} not found`
    );
    return;
  }

  context.ContestTemplate.set({
    ...template,
    active: false,
  });
});

FastFactory.ModuleTemplateCreated.handler(async ({ event, context }) => {
  context.ModuleTemplate.set({
    id: `${event.params.moduleName}-${event.params.moduleAddress}`,
    moduleName: event.params.moduleName,
    templateAddress: event.params.moduleAddress,
    mdProtocol: event.params.moduleInfo[0],
    mdPointer: event.params.moduleInfo[1],
    active: true,
  });
});

FastFactory.ModuleTemplateDeleted.handler(async ({ event, context }) => {
  const template = await context.ModuleTemplate.get(
    `${event.params.moduleName}-${event.params.moduleAddress}`
  );

  if (!template) {
    context.log.error(
      `Module template ${event.params.moduleAddress} not found`
    );
    return;
  }

  context.ModuleTemplate.set({
    ...template,
    active: false,
  });
});

FastFactory.ContestCloned.contractRegister(({ event, context }) => {
  // context.addFastFactory(event.params.contestAddress)
  // event.params.contestVersion;
});

FastFactory.ContestCloned.handler(async ({ event, context }) => {
  // // context.Factory.set(entity);
  // moduleFactory(event, context);
  // addTransaction(event, context);
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
